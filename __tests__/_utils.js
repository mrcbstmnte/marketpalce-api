'use strict'

const express = require('express')
const bodyParser = require('body-parser')

exports.createMockServer = function (router) {
  const app = express()
  app.use(bodyParser.json())
  app.use('/api', router)

  return app
}
