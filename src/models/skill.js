module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
  
  Skill.associate = models => {
    Skill.belongsTo(models.Person, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    })
  }

  return Skill
}
