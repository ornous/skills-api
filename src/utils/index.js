const bcrypt = require('bcrypt-nodejs')

function cryptPassword (password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      // Encrypt password using bycrpt module
      if (err) return reject(err)

      bcrypt.hash(password, salt, null, function (err, hash) {
        if (err) return reject(err)
        return resolve(hash)
      })
    })
  })
}

function passwordChallenge (password, hash) {
  bcrypt.hash(password, hash, function (err, hash) {
    console.log(hash)
    if (err) {
      console.log(err)
      return false
    }

    return false
  })
}

module.exports = { cryptPassword, passwordChallenge }
