const { PubSub } = require('graphql-subscriptions')
const { cryptPassword } = require('../utils')

const pubsub = new PubSub()

module.exports = {
  Query: {
    people: async (_, args, { models }) =>
      models.Person.findAll({ where: args }),

    skills: async (_, args, { models }) => models.Skill.findAll({ where: args })
  },
  Mutation: {
    createUser: async (_, data, { models }) => {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.authProvider.email.email,
        password: data.authProvider.email.password
      }
      const user = await models.Person.create(payload)
      pubsub.publish('userCreated', { userCreated: user })

      return user
    },

    signUserIn: async (root, data, { models }) => {
      const user = await models.Person.findOne({
        where: { email: data.email.email }
      })
      if (user.validatePassword(user.password)) {
        return { token: `token-${user.email}`, user }
      }
    },

    addSkillToUser: async (_, { userId, name }, { models }) => {
      const user = await models.Person.findById(userId)
      const skill = await user.createSkill({ name })

      console.log(skill)
      return skill
    },

    removeSkillFromUser: async (_, { id, userId }, { models }) => {
      const user = await models.Person.findById(userId)
      const res = user.removeSkill(id)

      console.log(res)
    }
  }
}
