import Sequelize from 'sequelize'
import { times } from 'lodash'
import Faker from 'faker'
/*
const Person = sequelize.define('person', {
    firstName: {
        type: Sequelize.STRING, allowNull: false
    },
    lastName: {
        type: Sequelize.STRING, allowNull: false
    },
    email: {
        type: Sequelize.STRING, allowNull: false, validate: {
            isEmail: true
        }
    }
})

Person.associate = models => {
  Person.hasMany(models.Skill)
}

const Skill = sequelize.define('skill', {
    name: {
        type: Sequelize.STRING, allowNull: false
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


export default sequelize
*/
