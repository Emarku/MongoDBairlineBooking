[
  {
    explainVersion: '1',
    stages: [
      {
        '$cursor': {
          queryPlanner: {
            namespace: 'ecs789p.Bookings',
            indexFilterSet: false,
            parsedQuery: {},
            queryHash: '8590D559',
            planCacheKey: '0A506B49',
            maxIndexedOrSolutionsReached: false,
            maxIndexedAndSolutionsReached: false,
            maxScansToExplodeReached: false,
            winningPlan: {
              stage: 'PROJECTION_SIMPLE',
              transformBy: {
                _id: 1,
                flights: 1,
                passengerData: 1,
                passengers: 1,
                userFlight: 1
              },
              inputStage: { stage: 'COLLSCAN', direction: 'forward' }
            },
            rejectedPlans: []
          },
          executionStats: {
            executionSuccess: true,
            nReturned: 1000,
            executionTimeMillis: 388,
            totalKeysExamined: 0,
            totalDocsExamined: 1000,
            executionStages: {
              stage: 'PROJECTION_SIMPLE',
              nReturned: 1000,
              executionTimeMillisEstimate: 0,
              works: 1002,
              advanced: 1000,
              needTime: 1,
              needYield: 0,
              saveState: 2,
              restoreState: 2,
              isEOF: 1,
              transformBy: {
                _id: 1,
                flights: 1,
                passengerData: 1,
                passengers: 1,
                userFlight: 1
              },
              inputStage: {
                stage: 'COLLSCAN',
                nReturned: 1000,
                executionTimeMillisEstimate: 0,
                works: 1002,
                advanced: 1000,
                needTime: 1,
                needYield: 0,
                saveState: 2,
                restoreState: 2,
                isEOF: 1,
                direction: 'forward',
                docsExamined: 1000
              }
            }
          }
        },
        nReturned: Long("1000"),
        executionTimeMillisEstimate: Long("0")
      },
      {
        '$unwind': { path: '$flights' },
        nReturned: Long("2488"),
        executionTimeMillisEstimate: Long("0")
      },
      {
        '$unwind': { path: '$passengers' },
        nReturned: Long("6179"),
        executionTimeMillisEstimate: Long("0")
      },
      {
        '$lookup': {
          from: 'Flights',
          as: 'userFlight',
          localField: 'flights',
          foreignField: 'id'
        },
        totalDocsExamined: Long("6179"),
        totalKeysExamined: Long("6179"),
        collectionScans: Long("0"),
        indexesUsed: ['id'],
        nReturned: Long("6179"),
        executionTimeMillisEstimate: Long("212")
      },
      {
        '$lookup': {
          from: 'Passengers',
          as: 'passengerData',
          localField: 'passengers',
          foreignField: 'id'
        },
        totalDocsExamined: Long("6179"),
        totalKeysExamined: Long("6179"),
        collectionScans: Long("0"),
        indexesUsed: ['id'],
        nReturned: Long("6179"),
        executionTimeMillisEstimate: Long("388")
      },
      {
        '$unwind': { path: '$userFlight' },
        nReturned: Long("6179"),
        executionTimeMillisEstimate: Long("388")
      },
      {
        '$unwind': { path: '$passengerData' },
        nReturned: Long("6179"),
        executionTimeMillisEstimate: Long("388")
      },
      {
        '$project': {
          _id: true,
          id: '$passengerData.id',
          name: '$passengerData.name',
          distance: '$userFlight.fLength'
        },
        nReturned: Long("6179"),
        executionTimeMillisEstimate: Long("388")
      },
      {
        '$group': {
          _id: { id: '$id', name: '$name' },
          totalDistance: { '$sum': '$distance' }
        },
        maxAccumulatorMemoryUsageBytes: { totalDistance: Long("7200") },
        totalOutputDataSizeBytes: Long("87731"),
        usedDisk: false,
        nReturned: Long("100"),
        executionTimeMillisEstimate: Long("388")
      },
      {
        '$sort': { sortKey: { totalDistance: -1 }, limit: Long("10") },
        totalDataSizeSortedBytesEstimate: Long("27705"),
        usedDisk: false,
        nReturned: Long("10"),
        executionTimeMillisEstimate: Long("388")
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
      aggregate: 'Bookings',
      pipeline: [
        { '$unwind': { path: '$flights' } },
        { '$unwind': { path: '$passengers' } },
        {
          '$lookup': {
            from: 'Flights',
            localField: 'flights',
            foreignField: 'id',
            as: 'userFlight'
          }
        },
        {
          '$lookup': {
            from: 'Passengers',
            localField: 'passengers',
            foreignField: 'id',
            as: 'passengerData'
          }
        },
        { '$unwind': { path: '$userFlight' } },
        { '$unwind': { path: '$passengerData' } },
        {
          '$project': {
            id: '$passengerData.id',
            name: '$passengerData.name',
            distance: '$userFlight.fLength'
          }
        },
        {
          '$group': {
            _id: { id: '$id', name: '$name' },
            totalDistance: { '$sum': '$distance' }
          }
        },
        { '$sort': { totalDistance: -1 } },
        { '$limit': 10 }
      ],
      cursor: {},
      '$db': 'ecs789p'
    },
    ok: 1
  }
]