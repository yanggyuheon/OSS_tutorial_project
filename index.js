// 
require('dotenv').config();
const fs = require("fs");
const {RTMClient} = require('@slack/rtm-api')

let token;
try {
	token = fs.readFileSync('./token').toString('utf-8')
} catch (err) {
	console.error(err);
}

const rtm = new RTMClient(token);

rtm.start();
const greeting = require('./greeting.js');
const square = require('./square.js');
rtm.on('message', function (message){
	var channel = message.channel;
	var text = message.text;
	
	if(!isNaN(text)){
		square(rtm, text, channel);
	} else {
		switch(text){
			case 'hi':
				greeting(rtm, channel);
				break;
			default:
				rtm.sendMessage('I`m alive', channel);
		}
	}
	

});
