'use strict'

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('People', [
      {
        firstName: 'Ozzy',
        lastName: 'Ndiaye',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'snekshaark@gmail.com'
      },
      {
        firstName: 'Abdoul',
        lastName: 'Sy',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'dreescan@gmail.com'
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'john.doe@gmail.com'
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'jane.doe@gmail.com'
      }
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('People', [
    { firstName: 'Ozzy' },
    { firstName: 'Abdoul' },
    { firstName: 'John' },
    { firstName: 'Jane' }
    ])
  }
}
