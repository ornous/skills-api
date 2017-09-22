require('dotenv').config()
const bunyan = require('bunyan')
const bodyParser = require('body-parser')
const expressBunyan = require('express-bunyan-logger')
const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

const { sequelize } = require('./models')
const Schema = require('./data/schema')

const logger = bunyan.createLogger({
  name: 'Server',
  streams: [{
    level: 'info',
    stream: process.stdout
  }]
})

const { APP_PORT, APP_HOST } = process.env

const app = express()
app.set('host', APP_HOST)
app.set('port', APP_PORT)

app.use(expressBunyan())
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: Schema }))
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

// Graceful startup/shutdown
app.get('/healthz', (req, res) => {
  let appStatus = { api: 'ok', db: 'unkown' }
  let appStatusCode = 200

  sequelize.authenticate()
    .then(() => {
      appStatus.db = 'ok'
    })
    .catch(err => {
      appStatus.db = `failed ${err}`
    })
    .finally(() => res.status(appStatusCode).json(appStatus))
})
console.log("?")

app.on('listening', () => {
  logger.info('Express server started on port %s at %s', APP_PORT, APP_HOST)
})

app.on('close', function () {
  logger.info('Server was closed')
  sequelize.quit()
})

process.on('SIGTERM', function () {
  logger.info('Received terminate Signal. Attempting to gracefully shutdown')
  logger.info('Unable to gracefully shutdown (express)')
  process.exit(0)
})

sequelize.authenticate().then(() => {
  logger.info('Attempting to connect to the database')
  sequelize.sync()

  app.listen(APP_PORT, APP_HOST, () => app.emit('listening'))
})
.catch(err => {
  logger.error(`Got ${err.name}:\nUnable to connect to the database:`, err.original)
})
