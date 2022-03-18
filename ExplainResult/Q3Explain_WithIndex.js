[
  {
    explainVersion: '1',
    stages: [
      {
        '$cursor': {
          queryPlanner: {
            namespace: 'ecs789p.Flights',
            indexFilterSet: false,
            parsedQuery: {
              '$and': [
                {
                  'arv.dt': { '$lte': ISODate("2021-10-31T00:00:00.000Z") }
                },
                {
                  'dep.dt': { '$lte': ISODate("2021-10-31T00:00:00.000Z") }
                },
                {
                  'arv.dt': { '$gte': ISODate("2021-10-01T00:00:00.000Z") }
                },
                {
                  'dep.dt': { '$gte': ISODate("2021-10-01T00:00:00.000Z") }
                }
              ]
            },
            queryHash: 'F72EAADF',
            planCacheKey: '6B6ED767',
            maxIndexedOrSolutionsReached: false,
            maxIndexedAndSolutionsReached: false,
            maxScansToExplodeReached: false,
            winningPlan: {
              stage: 'PROJECTION_DEFAULT',
              transformBy: {
                _id: 1,
                'arv.airport': 1,
                'arv.refuel': 1,
                'arv.stay': 1,
                arvAirport: 1,
                'dep.airport': 1,
                'dep.refuel': 1,
                'dep.stay': 1,
                depAirport: 1
              },
              inputStage: {
                stage: 'COLLSCAN',
                filter: {
                  '$and': [
                    {
                      'arv.dt': { '$lte': ISODate("2021-10-31T00:00:00.000Z") }
                    },
                    {
                      'dep.dt': { '$lte': ISODate("2021-10-31T00:00:00.000Z") }
                    },
                    {
                      'arv.dt': { '$gte': ISODate("2021-10-01T00:00:00.000Z") }
                    },
                    {
                      'dep.dt': { '$gte': ISODate("2021-10-01T00:00:00.000Z") }
                    }
                  ]
                },
                direction: 'forward'
              }
            },
            rejectedPlans: []
          },
          executionStats: {
            executionSuccess: true,
            nReturned: 100,
            executionTimeMillis: 9,
            totalKeysExamined: 0,
            totalDocsExamined: 400,
            executionStages: {
              stage: 'PROJECTION_DEFAULT',
              nReturned: 100,
              executionTimeMillisEstimate: 0,
              works: 402,
              advanced: 100,
              needTime: 301,
              needYield: 0,
              saveState: 1,
              restoreState: 1,
              isEOF: 1,
              transformBy: {
                _id: 1,
                'arv.airport': 1,
                'arv.refuel': 1,
                'arv.stay': 1,
                arvAirport: 1,
                'dep.airport': 1,
                'dep.refuel': 1,
                'dep.stay': 1,
                depAirport: 1
              },
              inputStage: {
                stage: 'COLLSCAN',
                filter: {
                  '$and': [
                    {
                      'arv.dt': { '$lte': ISODate("2021-10-31T00:00:00.000Z") }
                    },
                    {
                      'dep.dt': { '$lte': ISODate("2021-10-31T00:00:00.000Z") }
                    },
                    {
                      'arv.dt': { '$gte': ISODate("2021-10-01T00:00:00.000Z") }
                    },
                    {
                      'dep.dt': { '$gte': ISODate("2021-10-01T00:00:00.000Z") }
                    }
                  ]
                },
                nReturned: 100,
                executionTimeMillisEstimate: 0,
                works: 402,
                advanced: 100,
                needTime: 301,
                needYield: 0,
                saveState: 1,
                restoreState: 1,
                isEOF: 1,
                direction: 'forward',
                docsExamined: 400
              }
            }
          }
        },
        nReturned: Long("100"),
        executionTimeMillisEstimate: Long("0")
      },
      {
        '$lookup': {
          from: 'Airports',
          as: 'arvAirport',
          localField: 'arv.airport',
          foreignField: 'id'
        },
        totalDocsExamined: Long("100"),
        totalKeysExamined: Long("100"),
        collectionScans: Long("0"),
        indexesUsed: ['id'],
        nReturned: Long("100"),
        executionTimeMillisEstimate: Long("5")
      },
      {
        '$lookup': {
          from: 'Airports',
          as: 'depAirport',
          localField: 'dep.airport',
          foreignField: 'id'
        },
        totalDocsExamined: Long("100"),
        totalKeysExamined: Long("100"),
        collectionScans: Long("0"),
        indexesUsed: ['id'],
        nReturned: Long("100"),
        executionTimeMillisEstimate: Long("8")
      },
      {
        '$unwind': { path: '$arvAirport' },
        nReturned: Long("100"),
        executionTimeMillisEstimate: Long("8")
      },
      {
        '$unwind': { path: '$depAirport' },
        nReturned: Long("100"),
        executionTimeMillisEstimate: Long("8")
      },
      {
        '$project': {
          _id: true,
          airportCost: {
            '$let': {
              vars: {
                depStay: { '$multiply': ['$dep.stay', '$depAirport.rate.stay'] },
                depRF: {
                  '$cond': [
                    '$dep.refuel',
                    '$depAirport.rate.refuel',
                    { '$const': 0 }
                  ]
                },
                arvStay: { '$multiply': ['$arv.stay', '$arvAirport.rate.stay'] },
                arvRF: {
                  '$cond': [
                    '$arv.refuel',
                    '$arvAirport.rate.refuel',
                    { '$const': 0 }
                  ]
                }
              },
              in: {
                '$add': ['$$depStay', '$$depRF', '$$arvStay', '$$arvRF']
              }
            }
          }
        },
        nReturned: Long("100"),
        executionTimeMillisEstimate: Long("8")
      },
      {
        '$group': {
          _id: { '$const': null },
          totalAirportCost: { '$sum': '$airportCost' }
        },
        maxAccumulatorMemoryUsageBytes: { totalAirportCost: Long("72") },
        totalOutputDataSizeBytes: Long("229"),
        usedDisk: false,
        nReturned: Long("1"),
        executionTimeMillisEstimate: Long("8")
      },
      {
        '$lookup': {
          from: 'Employees',
          as: 'emps',
          localField: '*',
          foreignField: '*',
          unwinding: { preserveNullAndEmptyArrays: false }
        },
        totalDocsExamined: Long("260"),
        totalKeysExamined: Long("0"),
        collectionScans: Long("2"),
        indexesUsed: [],
        nReturned: Long("260"),
        executionTimeMillisEstimate: Long("8")
      },
      {
        '$group': {
          _id: '$totalAirportCost',
          totalSalary: { '$sum': '$emps.salary' }
        },
        maxAccumulatorMemoryUsageBytes: { totalSalary: Long("72") },
        totalOutputDataSizeBytes: Long("229"),
        usedDisk: false,
        nReturned: Long("1"),
        executionTimeMillisEstimate: Long("8")
      },
      {
        '$lookup': {
          from: 'Bookings',
          as: 'bookings',
          localField: '*',
          foreignField: '*',
          let: {},
          pipeline: [
            {
              '$match': {
                '$and': [
                  {
                    createDate: { '$gte': ISODate("2021-10-01T00:00:00.000Z") }
                  },
                  {
                    createDate: { '$lte': ISODate("2021-10-31T00:00:00.000Z") }
                  }
                ]
              }
            }
          ],
          unwinding: { preserveNullAndEmptyArrays: false }
        },
        totalDocsExamined: Long("1000"),
        totalKeysExamined: Long("0"),
        collectionScans: Long("2"),
        indexesUsed: [],
        nReturned: Long("486"),
        executionTimeMillisEstimate: Long("9")
      },
      {
        '$project': {
          _id: true,
          totalSalary: true,
          totalAirportCost: '$_id',
          bookingCost: '$bookings.price'
        },
        nReturned: Long("486"),
        executionTimeMillisEstimate: Long("9")
      },
      {
        '$group': {
          _id: {
            totalAirportCost: '$totalAirportCost',
            totalSalary: '$totalSalary'
          },
          totalBookingCost: { '$sum': '$bookingCost' }
        },
        maxAccumulatorMemoryUsageBytes: { totalBookingCost: Long("72") },
        totalOutputDataSizeBytes: Long("458"),
        usedDisk: false,
        nReturned: Long("1"),
        executionTimeMillisEstimate: Long("9")
      },
      {
        '$project': {
          totalBookingCost: true,
          totalAirportCost: '$_id.totalAirportCost',
          totalSalary: '$_id.totalSalary',
          revenue: {
            '$subtract': [
              {
                '$subtract': ['$totalBookingCost', '$_id.totalAirportCost']
              },
              '$_id.totalSalary'
            ]
          },
          createDate: { '$const': ISODate("2021-12-23T06:26:36.107Z") },
          _id: { '$const': ObjectId("61c4169c8458a244fc204450") }
        },
        nReturned: Long("1"),
        executionTimeMillisEstimate: Long("9")
      },
      {
        '$merge': {
          into: { db: 'ecs789p', coll: 'Revenue' },
          on: '_id',
          whenMatched: 'merge',
          whenNotMatched: 'insert'
        },
        nReturned: Long("0"),
        executionTimeMillisEstimate: Long("9")
      }
    ],
    serverInfo: {
      host: 'miku-server',
      port: 27017,
      version: '5.0.5',
      gitVersion: 'd65fd89df3fc039b5c55933c0f71d647a54510ae'
    },
    serverParameters: {
      internalQueryFacetBufferSizeBytes: 104857600,
      internalQueryFacetMaxOutputDocSizeBytes: 104857600,
      internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
      internalDocumentSourceGroupMaxMemoryBytes: 104857600,
      internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
      internalQueryProhibitBlockingMergeOnMongoS: 0,
      internalQueryMaxAddToSetBytes: 104857600,
      internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600
    },
    command: {
      aggregate: 'Flights',
      pipeline: [
        {
          '$match': {
            'arv.dt': {
              '$gte': ISODate("2021-10-01T00:00:00.000Z"),
              '$lte': ISODate("2021-10-31T00:00:00.000Z")
            },
            'dep.dt': {
              '$gte': ISODate("2021-10-01T00:00:00.000Z"),
              '$lte': ISODate("2021-10-31T00:00:00.000Z")
            }
          }
        },
        {
          '$lookup': {
            from: 'Airports',
            localField: 'arv.airport',
            foreignField: 'id',
            as: 'arvAirport'
          }
        },
        {
          '$lookup': {
            from: 'Airports',
            localField: 'dep.airport',
            foreignField: 'id',
            as: 'depAirport'
          }
        },
        { '$unwind': { path: '$arvAirport' } },
        { '$unwind': { path: '$depAirport' } },
        {
          '$project': {
            airportCost: {
              '$let': {
                vars: {
                  depStay: {
                    '$multiply': ['$dep.stay', '$depAirport.rate.stay']
                  },
                  depRF: {
                    '$cond': ['$dep.refuel', '$depAirport.rate.refuel', 0]
                  },
                  arvStay: {
                    '$multiply': ['$arv.stay', '$arvAirport.rate.stay']
                  },
                  arvRF: {
                    '$cond': ['$arv.refuel', '$arvAirport.rate.refuel', 0]
                  }
                },
                in: {
                  '$add': ['$$depStay', '$$depRF', '$$arvStay', '$$arvRF']
                }
              }
            }
          }
        },
        {
          '$group': { _id: null, totalAirportCost: { '$sum': '$airportCost' } }
        },
        {
          '$lookup': {
            from: 'Employees',
            localField: '*',
            foreignField: '*',
            as: 'emps'
          }
        },
        { '$unwind': { path: '$emps' } },
        {
          '$group': {
            _id: '$totalAirportCost',
            totalSalary: { '$sum': '$emps.salary' }
          }
        },
        {
          '$lookup': {
            from: 'Bookings',
            localField: '*',
            foreignField: '*',
            as: 'bookings'
          }
        },
        { '$unwind': { path: '$bookings' } },
        {
          '$match': {
            'bookings.createDate': {
              '$gte': ISODate("2021-10-01T00:00:00.000Z"),
              '$lte': ISODate("2021-10-31T00:00:00.000Z")
            }
          }
        },
        {
          '$project': {
            totalAirportCost: '$_id',
            totalSalary: true,
            bookingCost: '$bookings.price'
          }
        },
        {
          '$group': {
            _id: {
              totalAirportCost: '$totalAirportCost',
              totalSalary: '$totalSalary'
            },
            totalBookingCost: { '$sum': '$bookingCost' }
          }
        },
        {
          '$project': {
            totalAirportCost: '$_id.totalAirportCost',
            totalSalary: '$_id.totalSalary',
            totalBookingCost: true,
            revenue: {
              '$subtract': [
                {
                  '$subtract': ['$totalBookingCost', '$_id.totalAirportCost']
                },
                '$_id.totalSalary'
              ]
            },
            createDate: ISODate("2021-12-23T06:26:36.107Z"),
            _id: ObjectId("61c4169c8458a244fc204450")
          }
        },
        { '$merge': 'Revenue' }
      ],
      cursor: {},
      '$db': 'ecs789p'
    },
    ok: 1
  }
]