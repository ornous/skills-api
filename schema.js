import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql'

import db from './db'

const Person = new GraphQLObjectType({
    name: 'Person',
    decription: 'Represents a person',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve(person) {
                return person.id
            }
        },
        firstName: {
            type: GraphQLString,
            resolve(person) {
                return person.firstName
            }
        },
        lastName: {
            type: GraphQLString,
            resolve(person) {
                return person.lastName
            }
        },
        email: {
            type: GraphQLString,
            resolve(person) {
                return person.email
            }
        },
        skills: {
            type: new GraphQLList(Skill),
            resolve(person) {
                return person.getSkills()
            }
        }
    })
})

const PersonInput = new GraphQLInputObjectType({
    name: 'PersonInput',
    description: 'Select a preson',
    fields: () => ({
        firstName: {
            type: GraphQLString,
            description: 'First Name'
        },
        lastName: {
            type: GraphQLString,
            description: 'Last Name'
        },
        email: {
            type: GraphQLString,
            description: 'Email Address'
        }
    })
})

const Skill = new GraphQLObjectType({
    name: 'Skill',
    description: 'Represents a skill',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve(skill) {
                return skill.id
            }
        },
        name: {
            type: GraphQLInt,
            resolve(skill) {
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
            resolve(root, args) {
                return db.models.person.findAll({ where: args })
            }
        },
        skills: {
            type: new GraphQLList(Skill),
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString }
            },
            resolve(root, args) {
                return db.models.skill.findAll({ where: args })
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Functions to mutate stuff',
    fields() {
        return {
            addPerson: {
                type: Person,
                args: {
                    firstName: { type: new GraphQLNonNull(GraphQLString) },
                    lastName: { type: new GraphQLNonNull(GraphQLString) },
                    email: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve(root, args) {
                    return db.models.person.create({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email.toLowerCase()
                    })
                }
            },
            addSkill: {
                type: Skill,
                args: {
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    owner: { type: new GraphQLNonNull(PersonInput) }
                },
                resolve(_, args) {
                    return db.models.person.find(args.owner).then(person =>
                        person.createSkill({ name: args.name })
                    )
                }
            }
        }
    }
})

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})

export default Schema
