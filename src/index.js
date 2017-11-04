require('dotenv').config()
const bunyan = require('bunyan')
const bodyParser = require('body-parser')
const compression = require('compression')
const { Engine } = require('apollo-engine')
const expressBunyan = require('express-bunyan-logger')
const express = require('express')
const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

const { SubscriptionServer } = require('subscriptions-transport-ws')

const { sequelize } = require('./models')
const schema = require('./data/schema')

const logger = bunyan.createLogger({
  name: 'Server',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    }
  ]
})

const { APP_PORT, APP_HOST } = process.env

const app = express()
app.set('host', APP_HOST)
app.set('port', APP_PORT)

if (process.env.APP_ENV === 'production') {
  const engine = new Engine({
    engineConfig: {
      apiKey: 'service:ornous-skills-staging:rik0Q78HrR8foBYYjpr46g',
      logging: {
        level: 'INFO' // Proxy logging. DEBUG, INFO, WARN or ERROR
      }
    },
    graphqlPort: APP_PORT || 3000, // GraphQL port
    dumpTraffic: true // Debug configuration that logs traffic between Proxy and GraphQL server
  })

  app.use(engine.expressMiddleware())
}
app.use(expressBunyan())
app.use(compression())
app.use(
  '/graphql',
  require('cors')({
    origin: '*',
    methods: ['GET', 'POST']
  })
)

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {},
    tracing: true,
    cacheControl: true
  })
)
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://${APP_HOST}:${APP_PORT}/subscriptions`
  })
)

// Graceful startup/shutdown
app.get('/healthz', (req, res) => {
  let appStatus = { api: 'ok', db: 'unkown' }
  let appStatusCode = 200

  sequelize
    .authenticate()
    .then(() => {
      appStatus.db = 'ok'
    })
    .catch(err => {
      appStatus.db = `failed ${err}`
    })
    .finally(() => res.status(appStatusCode).json(appStatus))
})

app.on('listening', () => {
  logger.info('Express server started on port %s at %s', APP_PORT, APP_HOST)
  logger.info('Serving subscriptions ws endpoint at /subscriptions')
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

sequelize
  .authenticate()
  .then(() => {
    logger.info('Attempting to connect to the database')
    sequelize.sync()

    if (process.env.APP_ENV === 'production') {
      engine.start()
    }
    const server = createServer(app)
    server.listen(APP_PORT, APP_HOST, () => {
      app.emit('listening')
      const srv = new SubscriptionServer(
        { execute, subscribe, schema },
        { server: server, path: '/subscriptions' }
      )
      return srv
    })
  })
  .catch(err => {
    logger.error(
      `Got ${err.name}:\nUnable to connect to the database:`,
      err.original
    )
  })
