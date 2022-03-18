db.PilotRelatives.aggregate(
  [{
    $lookup: {
      from: 'Employees',
      localField: 'pilot_id',
      foreignField: 'id',
      as: 'pilotInfo'
    }
  }, {
    $unwind: {
      path: '$pilotInfo'
    }
  }]
)