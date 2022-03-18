[
  {
    op: 'command',
    ns: 'ecs789p.Flights',
    command: {
      aggregate: 'Flights',
      pipeline: [
        {
          '$lookup': {
            from: 'Planes',
            localField: 'plane',
            foreignField: 'id',
            as: 'planeDetails'
          }
        },
        {
          '$lookup': {
            from: 'Bookings',
            localField: 'id',
            foreignField: 'flights',
            as: 'booking'
          }
        },
        { '$unwind': { path: '$planeDetails' } },
        { '$unwind': { path: '$booking' } },
        {
          '$project': {
            flightId: '$id',
            cap: '$planeDetails.cap',
            passengerCnt: { '$size': '$booking.passengers' }
          }
        },
        {
          '$group': {
            _id: { flightId: '$flightId', cap: '$cap' },
            numPassengers: { '$sum': '$passengerCnt' }
          }
        },
        {
          '$project': {
            _id: false,
            flightId: '$_id.flightId',
            remainCap: { '$subtract': [Array] }
          }
        },
        { '$match': { remainCap: { '$lt': 0 } } }
      ],
      cursor: {},
      lsid: { id: UUID("61b5e835-a890-42ab-bb86-0ee6c70e6f42") },
      '$db': 'ecs789p'
    },
    keysExamined: 0,
    docsExamined: 480400,
    cursorExhausted: true,
    numYield: 400,
    nreturned: 3279,
    queryHash: 'E8FDCA30',
    planCacheKey: '8D4C8D7B',
    locks: {
      ReplicationStateTransition: { acquireCount: { w: Long("1") } },
      Global: { acquireCount: { r: Long("2003") } },
      Mutex: { acquireCount: { r: Long("1602") } }
    },
    flowControl: {},
    storage: {},
    responseLength: 104,
    protocol: 'op_msg',
    millis: 186,
    planSummary: 'COLLSCAN',
    ts: ISODate("2021-12-23T09:17:06.938Z"),
    client: '192.168.76.1',
    appName: 'mongosh 1.1.7',
    allUsers: [],
    user: ''
  }
]