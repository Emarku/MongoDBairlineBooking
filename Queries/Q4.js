db.Planes.aggregate(
  [{
    $lookup: {
      from: 'Flights',
      localField: 'id',
      foreignField: 'plane',
      as: 'planeFlights'
    }
  }, {
    $unwind: {
      path: '$planeFlights'
    }
  }, {
    $group: {
      _id: '$id',
      totalFlyingDistance: {
        $sum: '$planeFlights.fLength'
      }
    }
  }, {
    $sort: {
      totalFlyingDistance: -1
    }
  }, {
    $limit: 3
  }]
)