const express = require('express')
const {
  getMessages
} = require('../handlers/messages')

const router = express.Router()

router.route('/')
  .get(getMessages)

module.exports = router
