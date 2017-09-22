const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList
} = require('graphql')

const db = require('../models').sequelize

const Person = new GraphQLObjectType({
  name: 'Person',
  decription: 'Represents a person',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve (person) {
        return person.id
      }
    },
    firstName: {
      type: GraphQLString,
      resolve (person) {
        return person.firstName
      }
    },
    lastName: {
      type: GraphQLString,
      resolve (person) {
        return person.lastName
      }
    },
    email: {
      type: GraphQLString,
      resolve (person) {
        return person.email
      }
    },
    skills: {
      type: new GraphQLList(Skill),
      resolve (person) {
        return person.getSkills()
      }
    }
  })
})

const Skill = new GraphQLObjectType({
  name: 'Skill',
  description: 'Represents a skill',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve (skill) {
        return skill.id
      }
    },
    name: {
      type: GraphQLString,
      resolve (skill) {
        return skill.name
      }
    }
  })
})

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    people: {
      type: new GraphQLList(Person),
      args: {
        id: { type: GraphQLInt },
        email: { type: GraphQLString }
      },
      resolve (root, args) {
        return db.models.Person.findAll({ where: args })
      }
    },
    skills: {
      type: new GraphQLList(Skill),
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString }
      },
      resolve (root, args) {
        return db.models.skill.findAll({ where: args })
      }
    }
  })
})

const Schema = new GraphQLSchema({
  query: Query
})

module.exports = Schema
