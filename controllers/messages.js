const messagesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
// const { Message } = require('../models/message')
const getMessagesFromGoogle = require('../utils/messages')


messagesRouter.get('/', async (req, res, next) => {
  const messages = await getMessagesFromGoogle.getMessageList()
  return res.status(200).json(messages)
} )

module.exports = messagesRouter