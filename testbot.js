/* eslint-disable no-unused-vars */
require('dotenv').config();
const { RTMClient } = require('@slack/rtm-api');

const fs = require('fs');

let status = 0;

let token;
try {
    const tmp1 = fs.readFileSync('./token').toString('utf-8');
    // console.log(tmp1);
    const tmp2 = tmp1.split('\n');
    // console.log(tmp2.at(4));
    token = tmp2.at(4).trim();
} catch (err) {
    console.error(err);
}

token = token.trim();
const testChannel = "";
console.log(token);

const rtm = new RTMClient(token);

rtm.start();

rtm.on('ready', async()=> {
    const rdy1 = await rtm.sendMessage("테스트를 시작한다.", testChannel);
    console.log("테스트 루틴 시작");
    status += 1;

    const rdy2 = await rtm.sendMessage("hi", testChannel);
});

rtm.on('message', (message) => {
    const {text} = message;

    console.log("받은 메시지 : ", text);

    if(status === 1) {
        if(text === "Hello") {
            console.log("테스트 #1 성공.");
        } else {
            console.log("테스트 #1 실패.");
        }
    }
    status += 1;
});
