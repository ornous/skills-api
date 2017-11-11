require('dotenv').config()

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_LOG_QUERIES
} = process.env

let logging = false
if (DB_LOG_QUERIES) {
  let logging = console.log
}
console.log(DB_LOG_QUERIES, !!DB_LOG_QUERIES)
module.exports = {
  dialect: 'postgres',
  logging,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
}
