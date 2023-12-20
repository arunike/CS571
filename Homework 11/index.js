
// You MUST have a file called "token.secret" in the same directory as this file!
// This should be the secret token found in https://dashboard.ngrok.com/
// Make sure it is on a single line with no spaces!
// It will NOT be committed.

// TO START
//   1. Open a terminal and run 'npm start'
//   2. Open another terminal and run 'npm run tunnel'
//   3. Copy/paste the ngrok HTTPS url into the DialogFlow fulfillment.
//
// Your changes to this file will be hot-reloaded!

import fetch from 'node-fetch';
import fs from 'fs';
import ngrok from 'ngrok';
import morgan from 'morgan';
import express from 'express';
import CS571 from '@cs571/mobile-client';
import { get } from 'http';

// Read and register with secret ngrok token.
ngrok.authtoken(fs.readFileSync("token.secret").toString().trim());

// Start express on port 53705
const app = express();
const port = 53705;

// Accept JSON bodies and begin logging.
app.use(express.json());
app.use(morgan(':date ":method :url" :status - :response-time ms'));

// "Hello World" endpoint.
// You should be able to visit this in your browser
// at localhost:53705 or via the ngrok URL.
app.get('/', (req, res) => {
  res.status(200).send(JSON.stringify({
    msg: 'Express Server Works!'
  }))
})

// Dialogflow will POST a JSON body to /.
// We use an intent map to map the incoming intent to
// its appropriate async functions below.
// You can examine the request body via `req.body`
// See https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook#webhook_request
app.post('/', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;

  // A map of intent names to callback functions.
  // The "HelloWorld" is an example only -- you may delete it.
  const intentMap = {
    "HelloWorld": doHelloWorld,
    "GetWhenPosted": doGetWhenPosted,
    "GetChatroomMessages": doGetChatroom,
  }

  if (intent in intentMap) {
    // Call the appropriate callback function
    intentMap[intent](req, res);
  } else {
    // Uh oh! We don't know what to do with this intent.
    // There is likely something wrong with your code.
    // Double-check your names.
    console.error(`Could not find ${intent} in intent map!`)
    res.status(404).send(JSON.stringify({ msg: "Not found!" }));
  }
})

// Open for business!
app.listen(port, () => {
  console.log(`DialogFlow Handler listening on port ${port}. Use 'npm run tunnel' to expose this.`)
})

// Your turn!
// Each of the async functions below maps to an intent from DialogFlow
// Complete the intent by fetching data from the API and
// returning an appropriate response to DialogFlow.
// See https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook#webhook_response
// Use `res` to send your response; don't return!

async function doHelloWorld(req, res) {
  res.status(200).send({
    fulfillmentMessages: [
      {
        text: {
          text: [
            'You will see this if you trigger an intent named HelloWorld'
          ]
        }
      }
    ]
  })
}

async function doGetWhenPosted(req, res) {
  try {
    const chatroomName = req.body.queryResult.parameters.chatroom;
    const response = await fetch(`https://cs571.org/api/f23/hw11/messages?chatroom=${chatroomName}&page=1`, {
      method: 'GET',
      headers: {
        'X-CS571-ID': CS571.getBadgerId()
      },
    });
    const data = await response.json();

    const latestMessage = data.messages.sort((a, b) => new Date(b.created) - new Date(a.created))[0];

    const postDate = new Date(latestMessage.created).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const postTime = new Date(latestMessage.created).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const formattedDateTime = `${postDate}, ${postTime}`;

    res.status(200).send({
      fulfillmentMessages: [
        {
          text: {
            text: [
              `The last message in ${chatroomName} was posted on ${formattedDateTime}!`
            ]
          }
        }
      ]
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      fulfillmentMessages: [
        {
          text: {
            text: [
              `Sorry, something went wrong. Please try again later.`
            ]
          }
        }
      ]
    });
  }
}

async function doGetChatroom(req, res) {
  const chatroomName = req.body.queryResult.parameters.chatroom;
  const numberOfPosts = req.body.queryResult.parameters.numMessages || 1;

  let responseMessage;
  let limitedPosts = Math.min(numberOfPosts, 5);
  if (numberOfPosts > 5) {
    responseMessage = `Sorry, you can only get up to the latest 5 messages. Here are the 5 latest messages from ${chatroomName}.`;
    limitedPosts = 5;
  } else if (numberOfPosts === 1) {
    responseMessage = `Here is the latest message from ${chatroomName}!`;
  } else {
    responseMessage = `Here are the latest ${numberOfPosts} messages from ${chatroomName}!`;
  }

  const response = await fetch(`https://cs571.org/api/f23/hw11/messages?chatroom=${chatroomName}&page=1`, {
    method: 'GET',
    headers: {
      'X-CS571-ID': CS571.getBadgerId(),
    },
  });
  const data = await response.json();

  if (!data.messages || data.messages.length === 0) {
    return res.status(200).send({
      fulfillmentMessages: [{
        text: {
          text: [`Sorry, there are no messages in ${chatroomName} or the ${chatroomName} does not exist.`]
        }
      }]
    });
  }

  const limitedMessages = data.messages.slice(0, limitedPosts);

  res.status(200).send({
    fulfillmentMessages: [
      {
        text: {
          text: [responseMessage]
        }
      },
      ...limitedMessages.map(message => ({
        card: {
          title: message.title,
          subtitle: `${message.poster}`,
          buttons: [
            {
              text: "Read More",
              postback: `https://www.cs571.org/f23/badgerchat/chatrooms/${chatroomName}`
            }
          ],
        }
      })),
    ]
  });
}