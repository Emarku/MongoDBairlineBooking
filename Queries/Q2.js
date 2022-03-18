db.Planes.aggregate(
  [{
    $unwind: {
      path: '$servLog'
    }
  }, {
    $sort: {
      'servLog.createDate': -1
    }
  }, {
    $project: {
      pending: {
        $cond: [{ $eq: ['$servLog.status', 'PEND'] }, 1, 0]
      },
      normal: {
        $cond: [{ $eq: ['$servLog.status', 'NORM'] }, 1, 0]
      },
      retired: {
        $cond: [{ $eq: ['$servLog.status', 'RETR'] }, 1, 0]
      },
      upgraded: {
        $cond: [{ $eq: ['$servLog.status', 'UPED'] }, 1, 0]
      },
      repaired: {
        $cond: [{ $eq: ['$servLog.status', 'RPED'] }, 1, 0]
      }
    }
  }, {
    $group: {
      _id: null,
      pending: { $sum: '$pending' },
      normal: { $sum: '$normal' },
      retired: { $sum: '$retired' },
      upgraded: { $sum: '$upgraded' },
      repaired: { $sum: '$repaired' }
    }
  }]
)