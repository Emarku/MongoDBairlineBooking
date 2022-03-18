db.Employees.aggregate(
  [{
    $project: {
      id: true,
      name: {
        $concat: [
          '$name.fname', ' ', '$name.lname'
        ]
      },
      sType: '$details.sType',
      salary: true,
      email: true,
      addr: true,
      empDate: '$details.empDate',
      empYears: {
        $dateDiff: {
          startDate: '$details.empDate',
          endDate: ISODate(),
          unit: 'year'
        }
      }
    }
  }, {
    $group: {
      _id: '$empYears',
      employees: {
        $push: {
          id: '$id',
          name: '$name',
          salary: '$salary',
          email: '$email',
          addr: '$addr',
          sType: '$sType',
          empDate: '$empDate'
        }
      }
    }
  }]
)