db.Flights.aggregate(
  [{
    $match: {
      'arv.dt': {
        $gte: ISODate('2021-10-01'),
        $lte: ISODate('2021-10-31')
      },
      'dep.dt': {
        $gte: ISODate('2021-10-01'),
        $lte: ISODate('2021-10-31')
      }
    }
  }, {
    $lookup: {
      from: 'Airports',
      localField: 'arv.airport',
      foreignField: 'id',
      as: 'arvAirport'
    }
  }, {
    $lookup: {
      from: 'Airports',
      localField: 'dep.airport',
      foreignField: 'id',
      as: 'depAirport'
    }
  }, {
    $unwind: {
      path: '$arvAirport'
    }
  }, {
    $unwind: {
      path: '$depAirport'
    }
  }, {
    $project: {
      airportCost: {
        $let: {
          vars: {
            depStay: {
              $multiply: [
                '$dep.stay',
                '$depAirport.rate.stay'
              ]
            },
            depRF: {
              $cond: [
                '$dep.refuel',
                '$depAirport.rate.refuel',
                0
              ]
            },
            arvStay: {
              $multiply: [
                '$arv.stay',
                '$arvAirport.rate.stay'
              ]
            },
            arvRF: {
              $cond: [
                '$arv.refuel',
                '$arvAirport.rate.refuel',
                0
              ]
            }
          },
          'in': {
            $add: [
              '$$depStay',
              '$$depRF',
              '$$arvStay',
              '$$arvRF'
            ]
          }
        }
      }
    }
  }, {
    $group: {
      _id: null,
      totalAirportCost: {
        $sum: '$airportCost'
      }
    }
  }, {
    $lookup: {
      from: 'Employees',
      localField: '*',
      foreignField: '*',
      as: 'emps'
    }
  }, {
    $unwind: {
      path: '$emps'
    }
  }, {
    $group: {
      _id: '$totalAirportCost',
      totalSalary: {
        $sum: '$emps.salary'
      }
    }
  }, {
    $lookup: {
      from: 'Bookings',
      localField: '*',
      foreignField: '*',
      as: 'bookings'
    }
  }, {
    $unwind: {
      path: '$bookings'
    }
  }, {
    $match: {
      'bookings.createDate': {
        $gte: ISODate('2021-10-01'),
        $lte: ISODate('2021-10-31')
      }
    }
  }, {
    $project: {
      totalAirportCost: '$_id',
      totalSalary: true,
      bookingCost: '$bookings.price'
    }
  }, {
    $group: {
      _id: {
        totalAirportCost: '$totalAirportCost',
        totalSalary: '$totalSalary'
      },
      totalBookingCost: {
        $sum: '$bookingCost'
      }
    }
  }, {
    $project: {
      totalAirportCost: '$_id.totalAirportCost',
      totalSalary: '$_id.totalSalary',
      totalBookingCost: true,
      revenue: {
        $subtract: [{
          $subtract: [
            '$totalBookingCost',
            '$_id.totalAirportCost'
          ]
        },
          '$_id.totalSalary'
        ]
      },
      createDate: ISODate(),
      _id: ObjectId()
    }
  }, {
    $merge: 'Revenue'
  }]
)