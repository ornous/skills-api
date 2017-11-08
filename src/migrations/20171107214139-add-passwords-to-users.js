'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('People', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'changeme'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('People', 'password')
  }
}
