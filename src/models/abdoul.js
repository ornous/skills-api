'use strict'
module.exports = (sequelize, DataTypes) => {
  var Abdoul = sequelize.define(
    'Abdoul',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING
    },
    {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    }
  )
  return Abdoul
}
