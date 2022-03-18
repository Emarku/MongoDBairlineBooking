[
  {
    op: 'command',
    ns: 'ecs789p.Flights',
    command: {
      aggregate: 'Flights',
      pipeline: [
        {
          '$lookup': {
            from: 'Employees',
            localField: 'pilot',
            foreignField: 'id',
            as: 'pilots'
          }
        },
        {
          '$lookup': {
            from: 'Employees',
            localField: 'coPilot',
            foreignField: 'id',
            as: 'copilots'
          }
        },
        { '$unwind': { path: '$pilots' } },
        { '$unwind': { path: '$copilots' } },
        {
          '$project': {
            id: true,
            pilot: true,
            pilotSalary: '$pilots.salary',
            pilotDOB: '$pilots.dob',
            coPilot: true,
            coSalary: '$copilots.salary',
            copilotDOB: '$copilots.dob',
            flagRedHR: { '$let': [Object] }
          }
        },
        { '$match': { flagRedHR: true } },
        { '$project': { coPilot: true, pilot: true, flight: '$id' } }
      ],
      cursor: {},
      lsid: { id: UUID("61b5e835-a890-42ab-bb86-0ee6c70e6f42") },
      '$db': 'ecs789p'
    },
    keysExamined: 0,
    docsExamined: 208400,
    cursorExhausted: true,
    numYield: 0,
    nreturned: 26,
    queryHash: '6DAB46EC',
    planCacheKey: 'D23A0176',
    locks: {
      Global: { acquireCount: { r: Long("1602") } },
      Mutex: { acquireCount: { r: Long("1602") } }
    },
    flowControl: {},
    responseLength: 1706,
    protocol: 'op_msg',
    millis: 79,
    planSummary: 'COLLSCAN',
    ts: ISODate("2021-12-23T08:22:21.638Z"),
    client: '192.168.76.1',
    appName: 'mongosh 1.1.7',
    allUsers: [],
    user: ''
  }
]