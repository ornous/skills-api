'use strict'

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Skills', [
      {
        name: 'Cook',
        createdAt: new Date(),
        updatedAt: new Date(),
        PersonId: 1
      },
      {
        name: 'Play Rugby',
        createdAt: new Date(),
        updatedAt: new Date(),
        PersonId: 1
      },
      {
        name: 'Systems Thinking',
        createdAt: new Date(),
        updatedAt: new Date(),
        PersonId: 1
      },
      {
        name: 'AWS Lambda',
        createdAt: new Date(),
        updatedAt: new Date(),
        PersonId: 1
      },
      {
        name: 'React',
        createdAt: new Date(),
        updatedAt: new Date(),
        PersonId: 1
      }
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Skills', [
      { PersonId: 1 }
    ])
  }
}
