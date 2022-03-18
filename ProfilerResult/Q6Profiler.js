[
  {
    op: 'command',
    ns: 'ecs789p.Airports',
    command: {
      aggregate: 'Airports',
      pipeline: [
        {
          '$lookup': {
            from: 'Flights',
            localField: 'id',
            foreignField: 'arv.airport',
            as: 'arvFlight'
          }
        },
        {
          '$lookup': {
            from: 'Flights',
            localField: 'id',
            foreignField: 'dep.airport',
            as: 'depFlight'
          }
        },
        { '$match': { '$or': [[Object], [Object]] } },
        {
          '$project': { country: '$location.country', cnt: { '$add': [Array] } }
        },
        {
          '$group': { _id: '$country', flightCount: { '$sum': '$cnt' } }
        },
        { '$sort': { flightCount: -1 } },
        { '$limit': 10 }
      ],
      cursor: {},
      lsid: { id: UUID("61b5e835-a890-42ab-bb86-0ee6c70e6f42") },
      '$db': 'ecs789p'
    },
    keysExamined: 0,
    docsExamined: 7389225,
    hasSortStage: true,
    cursorExhausted: true,
    numYield: 9,
    nreturned: 10,
    queryHash: '3323FF12',
    planCacheKey: 'C75B6B35',
    locks: {
      ReplicationStateTransition: { acquireCount: { w: Long("1") } },
      Global: { acquireCount: { r: Long("36912") } },
      Mutex: { acquireCount: { r: Long("36902") } }
    },
    flowControl: {},
    storage: {},
    responseLength: 475,
    protocol: 'op_msg',
    millis: 2806,
    planSummary: 'COLLSCAN',
    ts: ISODate("2021-12-23T09:43:04.277Z"),
    client: '192.168.76.1',
    appName: 'mongosh 1.1.7',
    allUsers: [],
    user: ''
  }
]