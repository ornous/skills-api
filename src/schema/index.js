const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

const typeDefs = `
  type Query {
    # Lists users
    people: [Person!]

    # Get a user
    user(id: ID!): Person

    # Currently logged in user or null if logged out
    currentUser: Person
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, authProvider: AuthProviderSignupData!): Person!
    signUserIn(email: AUTH_PROVIDER_EMAIL): SigninPayload!
    removeSkillFromUser(id: ID!, userId: ID!): Int!
    addSkillToUser(userId: ID!, name: String!): Skill!
  }

  type Subscription {
    userCreated: Person!
    userSignedIn: Person!
    userFailedSignIn: Person!
  }

  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    skills: [Skill!]
  }

  type Skill {
    id: ID!
    name: String!
  }

  type SigninPayload {
    token: String!
    user: Person!
  }

  input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL!
  }

  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }

`
/*
    people
      id: ID!
      email: String!
    skills
      id: ID!
      name: String!
*/

module.exports = makeExecutableSchema({ typeDefs, resolvers })
