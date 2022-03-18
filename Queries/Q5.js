db.Flights.aggregate(
  [{
    $lookup: {
      from: 'Employees',
      localField: 'pilot',
      foreignField: 'id',
      as: 'pilots'
    }
  }, {
    $lookup: {
      from: 'Employees',
      localField: 'coPilot',
      foreignField: 'id',
      as: 'copilots'
    }
  }, {
    $unwind: {
      path: '$pilots'
    }
  }, {
    $unwind: {
      path: '$copilots'
    }
  }, {
    $project: {
      id: true,
      pilot: true,
      pilotSalary: '$pilots.salary',
      pilotDOB: '$pilots.dob',
      coPilot: true,
      coSalary: '$copilots.salary',
      copilotDOB: '$copilots.dob',
      flagRedHR: {
        $let: {
          vars: {
            ps: '$pilots.salary',
            cs: {
              $multiply: [
                0.8,
                '$copilots.salary'
              ]
            },
            pdob: '$pilots.dob',
            cdob: {
              $dateAdd: {
                startDate: '$copilots.dob',
                unit: 'year',
                amount: 10
              }
            }
          },
          'in': {
            $and: [
              {
                $lt: [
                  '$$ps',
                  '$$cs'
                ]
              },
              {
                $gt: [
                  '$$pdob',
                  '$$cdob'
                ]
              }
            ]
          }
        }
      }
    }
  }, {
    $match: {
      flagRedHR: true
    }
  }, {
    $project: {
      coPilot: true,
      pilot: true,
      flight: '$id'
    }
  }]
)