db.Employyes.find(
  {
    'details.sType': "PILOT",
    'details.fffDate': {
      $ne: ''
    }
  }
)