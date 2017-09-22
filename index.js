import {} from 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress } from 'apollo-server-express'

import Schema from './schema'

const APP_PORT = process.env.APP_PORT || 3000

const app = express()

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: Schema }))

// Graceful startup/shutdown
    // db conn
// Add /healthz endpoint
app.listen(APP_PORT, () => console.log(`App running on port ${APP_PORT}`))
