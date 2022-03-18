db.Bookings.aggregate(
  [{
    $project: {
      id: 1,
      flights: 1,
      price: 1,
      createDate: 1
    }
  }, {
    $match: {
      createDate: {
        $gte: ISODate('2021-10-01T00:00:00.000Z'),
        $lte: ISODate('2021-12-01T00:00:00.000Z')
      },
      price: {
        $gte: 2000,
        $lte: 4000
      }
    }
  }, {
    $sort: {
      price: 1,
      createDate: 1
    }
  }]
)