const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const USER_CREATED_TOPIC = 'userCreated'
const USER_SIGNED_IN_TOPIC = 'userSignedIn'
const USER_FAILED_SIGN_IN_TOPIC = 'userFailedSignin'

module.exports = {
  Query: {
    people: async (_, {}, { Person }) => Person.findAll(),
    user: async (_, { id }, { Person }) => Person.findById(id) || null,
    currentUser: async (_, {}, { user }) => user || null
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(USER_CREATED_TOPIC)
    },
    userSignedIn: {
      subscribe: () => pubsub.asyncIterator(USER_SIGNED_IN_TOPIC)
    },
    userFailedSignIn: {
      subscribe: () => pubsub.asyncIterator(USER_SIGNED_IN_TOPIC)
    }
  },
  Mutation: {
    createUser: async (_, data, { Person }) => {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.authProvider.email.email,
        password: data.authProvider.email.password
      }
      const user = await Person.create(payload)
      pubsub.publish(USER_CREATED_TOPIC, { user })

      return user
    },

    signUserIn: async (_, { email }, { Person }) => {
      const user = await Person.findOne({
        where: { email: email.email } // Kind of embarrassing <_<
      })

      /* @todo What if we cannot find them? :( */

      if (!user.validatePassword(user.password)) {
        pubsub.publish(USER_FAILED_SIGN_IN_TOPIC, { user, email: email.email })
        throw new Error("Ha! You don't know your password.")
      }

      pubsub.publish(USER_SIGNED_IN_TOPIC, { user })

      return { token: `token-${user.email}`, user }
    },

    addSkillToUser: async (_, { userId, name }, { Person }) => {
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
