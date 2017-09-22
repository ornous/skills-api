import {} from 'dotenv/config'
import bunyan from 'bunyan'
import bodyParser from 'body-parser'
import expressBunyan from 'express-bunyan-logger'
import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'

import { sequelize } from 'models'
import Schema from './data/schema'

const logger = bunyan.createLogger({
  name: "Server",
  streams: [{
    level: 'info',
    stream: process.stdout
  }]
})

const { APP_PORT, APP_HOST } = process.env

const app = express()
app.set("host", APP_HOST)
app.set("port", APP_PORT)

app.use(expressBunyan())
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: Schema }))
app.use('/graphiql', graphiqlExpress({ endpointURL: "/graphql" }))

// Graceful startup/shutdown
app.get('/healthz', (req, res) => {
  let appStatus = { api: "ok", db: "unkown"}
  let appStatusCode = 200

  sequelize.authenticate()
    .then(() => {
      appStatus.db = "ok"
    })
    .catch(err => {
      appStatus.db = `failed ${err}`
    })
    .finally(() => res.status(appStatusCode).json(appStatus))
})

app.on('listening', () => {
  logger.info('Express server started on port %s at %s', APP_PORT, APP_HOST);
});

process.on('SIGTERM', function () {
  logger.info("Received terminate Signal. Attempting to gracefully shutdown")
  app.close(function () {
    process.exit(0);
  });
  logger.info("Done")
});

sequelize.authenticate().then(()  => {
  sequelize.sync()

  app.listen(APP_PORT, APP_HOST, () => app.emit('listening'))
})
.catch(err => {
  logger.error(`Got ${err.name}:\nUnable to connect to the database:`, err.original)
})
