'use strict'

const {
  APP_PORT,

  MONGO_PORT,
  MONGO_DB_NAME
} = process.env

module.exports = {
  service: {
    port: parseInt(APP_PORT, 10)
  },

  mongodb: {
    databaseName: MONGO_DB_NAME,
    connectUri: `mongodb://mongodb:${MONGO_PORT}`
  }
}
