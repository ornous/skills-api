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
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    }
  })
  
  Person.associate = models => {
    Person.hasMany(models.Skill)
  }

  return Person
}
