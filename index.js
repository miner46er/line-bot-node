'use strict'

require('dotenv').config()
const line = require('@line/bot-sdk')
const express = require('express')

// create LINE SDK config
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

// create Express app
// about Express itself: https://expressjs.com/
const app = express()

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
})

// create LINE SDK client
const client = new line.Client(config)

// event handler
function handleEvent (event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  })
}

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`listening on ${port}`)
})
