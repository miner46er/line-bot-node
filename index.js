'use strict'

const line = require('@line/bot-sdk')
const express = require('express')

require('dotenv').config()

// create LINE SDK config
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

// create LINE SDK client
const client = new line.Client(config)

// create Express app
// about Express itself: https://expressjs.com/
const app = express()

app.post('/webhook', line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end()
  }

  // handle events separately
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
})

// event handler
function handleEvent (event) {
  switch (event.type) {
    case 'message':
      switch (event.message.type) {
        case 'text':
          return handleText(event.message, event.replyToken, event.source)
        default:
          throw new Error(`Unknown message: ${JSON.stringify(event.message)}`)
      }
    default:
      throw new Error(`Unknown message: ${JSON.stringify(event.message)}`)
  }
}

function handleText (message, replyToken, source) {
  if (message.text.startsWith('!')) {
    const inputMessage = (message.text.slice(1)).split(' ')
    const inputCommand = inputMessage[0]
    const inputArgument = inputMessage[1]

    switch (inputCommand) {
      case 'echo':
        return client.replyMessage(replyToken, {
          type: 'text',
          text: inputArgument
        })
    }
  }
}

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
