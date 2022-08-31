const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const messagesRouter = require('./controllers/messages')
const MONGODB_URI = require('./utils/config').MONGODB_URI
const middleware = require('./utils/middleware')

const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/messages', messagesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app