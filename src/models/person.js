const bcrypt = require('bcrypt-nodejs')
const { cryptPassword } = require('../utils')

module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define('Person', {
    firstName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: true }
    }
  })

  Person.prototype.validatePassword = function (password) {
    return bcrypt.compare(password, this.password, (err, res) => {
      if (err) console.log(err)
      return res
    })
  }

  Person.beforeCreate(function (user, options) {
    return cryptPassword(user.password)
      .then(hash => {
        user.password = hash
      })
      .catch(err => {
        if (err) console.log(err)
      })
  })

  Person.associate = models => {
    Person.hasMany(models.Skill)
  }

  return Person
}
