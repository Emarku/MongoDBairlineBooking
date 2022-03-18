db.Bookings.aggregate(
  [{
    $unwind: {
      path: '$flights'
    }
  }, {
    $unwind: {
      path: '$passengers'
    }
  }, {
    $lookup: {
      from: 'Flights',
      localField: 'flights',
      foreignField: 'id',
      as: 'userFlight'
    }
  }, {
    $lookup: {
      from: 'Passengers',
      localField: 'passengers',
      foreignField: 'id',
      as: 'passengerData'
    }
  }, {
    $unwind: {
      path: '$userFlight'
    }
  }, {
    $unwind: {
      path: '$passengerData'
    }
  }, {
    $project: {
      id: '$passengerData.id',
      name: '$passengerData.name',
      distance: '$userFlight.fLength'
    }
  }, {
    $group: {
      _id: {
        id: '$id',
        name: '$name'
      },
      totalDistance: {
        $sum: '$distance'
      }
    }
  }, {
    $sort: {
      totalDistance: -1
    }
  }, { $limit: 10 }]
)