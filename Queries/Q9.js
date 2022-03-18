db.Airports.aggregate(
  [{
    $facet: {
      buckets_by_stay: [
        {
          $bucket: {
            groupBy: '$rate.stay',
            boundaries: [
              20,
              30,
              40,
              50,
              60,
              70,
              80,
              90,
              100
            ],
            'default': 'Other',
            output: {
              airport_stay_cost_buckets_by_range: {
                $sum: 1
              },
              airport_details: {
                $push: {
                  code: '$code',
                  name: '$name',
                  location: '$location'
                }
              }
            }
          }
        }
      ],
      buckets_by_refuel: [
        {
          $bucket: {
            groupBy: '$rate.refuel',
            boundaries: [
              20,
              30,
              40,
              50,
              60,
              70,
              80,
              90,
              100
            ],
            'default': 'Other',
            output: {
              flight_refuel_buckets_by_range: {
                $sum: 1
              },
              airport_details: {
                $push: {
                  code: '$code',
                  name: '$name',
                  location: '$location'
                }
              }
            }
          }
        }
      ]
    }
  }]
)