db.Airports.aggregate(
  [{
    $lookup: {
      from: 'Flights',
      localField: 'id',
      foreignField: 'arv.airport',
      as: 'arvFlight'
    }
  }, {
    $lookup: {
      from: 'Flights',
      localField: 'id',
      foreignField: 'dep.airport',
      as: 'depFlight'
    }
  }, {
    $match: {
      $or: [
        {
          arvFlight: {
            $not: {
              $size: 0
            }
          }
        },
        {
          depFlight: {
            $not: {
              $size: 0
            }
          }
        }
      ]
    }
  }, {
    $project: {
      country: '$location.country',
      cnt: {
        $add: [
          {
            $size: '$arvFlight'
          },
          {
            $size: '$depFlight'
          }
        ]
      }
    }
  }, {
    $group: {
      _id: '$country',
      flightCount: {
        $sum: '$cnt'
      }
    }
  }, {
    $sort: {
      flightCount: -1
    }
  }, { $limit: 10 }]
)