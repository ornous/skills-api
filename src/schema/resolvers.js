module.exports = {
  Query: {
    people: async (_, args, { Person }) => Person.findAll({ where: args }),

    skills: async (_, args, { Skill }) => Skill.findAll({ where: args })
  },
  Mutation: {
    createUser: async (_, data, { Person, pubsub }) => {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.authProvider.email.email,
        password: data.authProvider.email.password
      }
      const user = await Person.create(payload)
      pubsub.publish('userCreated', { user })

      return user
    },

    signUserIn: async (root, { email }, { Person, pubsub }) => {
      const user = await Person.findOne({
        where: { email: email.email } // Kind of embarrassing <_<
      })
      pubsub.publish('userSignedIn', { user })

      if (user.validatePassword(user.password)) {
        return { token: `token-${user.email}`, user }
      }
      // TODO Otherwise crash and burn <3
    },

    addSkillToUser: async (_, { userId, name }, { Person, pubsub }) => {
      const user = await Person.findById(userId)
      const skill = await user.createSkill({ name })

      pubsub.publish('skillAddedToUser', { user, skill })

      return skill
    },

    /**
     * @todo Scope to logged in user (i.e. me { removeSkill })
     */
    removeSkillFromUser: async (_, { id, userId }, { Person }) => {
      const user = await Person.findById(userId)
      const res = user.removeSkill(id)

      console.log(res)
    }
  }
}
