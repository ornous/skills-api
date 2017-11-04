const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require('graphql')

const db = require('../models').sequelize

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

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

const Mutation = new GraphQLObjectType({
  name: 'Skills_Mutations',
  description: 'You can mutate your skills however you want..',
  fields: () => ({
    createUser: {
      type: Person,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (value, { firstName, lastName, email }) => {
        const user = db.models.Person.create({ firstName, lastName, email })
        pubsub.publish('userCreated', { userCreated: user })

        return user
      }
    },
    removeSkillFromUser: {
      type: Skill,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (value, { userId, id }) =>
        db.models.Person.findById(userId).then(user => user.removeSkill(id))
    },
    addSkillToUser: {
      type: Skill,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (value, { userId, name }) =>
        db.models.Person
          .findById(userId)
          .then(user => user.createSkill({ name }))
    }
  })
})

const Subscription = new GraphQLObjectType({
  name: 'Skills_Subscriptions',
  description: 'Sur courtrajmé: Branche toi!',
  fields: () => ({
    userCreated: {
      type: Person,
      subscribe: () => pubsub.asyncIterator('userCreated')
    }
  })
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription
})

module.exports = Schema
