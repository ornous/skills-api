require('dotenv').config()

const {
  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
} = process.env

module.exports = {
  dialect: 'postgres',
  logging: false,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
}
