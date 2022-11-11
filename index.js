const {RTMClient} = require('@slack/rtm-api');
const fs = require('fs');
const greeting = require('./greeting');
const square = require('./square');
require('dotenv').config();

let token;
try {
  token = fs.readFileSync('./token').toString('utf-8');
} catch (err) {
  console.error(err);
}

const rtm = new RTMClient(token);

rtm.start();
rtm.on('message', (message) => {
  const { channel } = message;
  const { text } = message;

  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(text)) {
    square(rtm, text, channel);
  } else {
    switch (text) {
      case 'hi':
        greeting(rtm, channel);
        break;
      default:
        rtm.sendMessage('I`m alive', channel);
    }
  }
});
