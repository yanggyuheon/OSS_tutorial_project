const { RTMClient } = require("@slack/rtm-api");
const fs = require("fs");
const greeting = require("./greeting");
const square = require("./square");
require("dotenv").config();

let token;
try {
  token = fs.readFileSync("./token").toString("utf-8");
} catch (err) {
  console.error(err);
}
const test = 10;
console.log(test);
const rtm = new RTMClient(token);

rtm.start();
rtm.on("message", (message) => {
  const { channel } = message;
  const { text } = message;

  // text가 숫자인 경우
  if (!Number.isNaN(Number(text))) {
    square(rtm, text, channel);
  } else {
    // text - 소문조라 변환해서 HI, Hi, hI, hi 인식하도록
    switch (text.toLowerCase()) {
      case "hi":
        greeting(rtm, channel);
        break;
      default:
        rtm.sendMessage("I`m alive", channel);
    }
  }
});
