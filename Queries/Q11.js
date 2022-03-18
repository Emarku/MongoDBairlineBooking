db.Flights.aggregate(
  [{
    $lookup: {
      from: 'Planes',
      localField: 'plane',
      foreignField: 'id',
      as: 'planeDetails'
    }
  }, {
    $lookup: {
      from: 'Bookings',
      localField: 'id',
      foreignField: 'flights',
      as: 'booking'
    }
  }, {
    $unwind: {
      path: '$planeDetails'
    }
  }, {
    $unwind: {
      path: '$booking'
    }
  }, {
    $project: {
      flightId: '$id',
      cap: '$planeDetails.cap',
      passengerCnt: {
        $size: '$booking.passengers'
      }
    }
  }, {
    $group: {
      _id: {
        flightId: '$flightId',
        cap: '$cap'
      },
      numPassengers: {
        $sum: '$passengerCnt'
      }
    }
  }, {
    $project: {
      _id: false,
      flightId: '$_id.flightId',
      remainCap: {
        $subtract: [
          '$_id.cap',
          '$numPassengers'
        ]
      }
    }
  }, {
    $match: {
      remainCap: {
        $lt: 0
      }
    }
  }]
)