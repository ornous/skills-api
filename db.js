import Sequelize from 'sequelize'
import { times } from 'lodash'
import Faker from 'faker'

const Conn = new Sequelize('relay', 'postgres', 'postgres', {
    dialect: 'postgres',
    host: 'localhost'
})

const Person = Conn.define('person', {
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

const Skill = Conn.define('skill', {
    name: {
        type: Sequelize.STRING, allowNull: false
    }
})

Person.hasMany(Skill)
Skill.belongsTo(Person)

Conn.sync({ force: true }).then(() => {
    times(10, () => {
        return Person.create({
            firstName: Faker.name.firstName(),
            lastName: Faker.name.lastName(),
            email: Faker.internet.email()
        }).then(person => person.createSkill({ name: 'Learning' }))
    })
})

export default Conn
