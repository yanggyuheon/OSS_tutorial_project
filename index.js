const { RTMClient } = require("@slack/rtm-api");
const fs = require("fs");
const greeting = require("./greeting");
const square = require("./square");
const scrap = require("./scrap");
require("dotenv").config();

let token;
try {
  token = fs.readFileSync("./token").toString("utf-8");
} catch (err) {
  console.error(err);
}

const rtm = new RTMClient(token);

rtm.start();
rtm.on("message", (message) => {
  const { channel } = message;
  const { text } = message;

  // text가 숫자인 경우
  if (!Number.isNaN(Number(text))) {
    square(rtm, text, channel);
  }
  // text 숫자가 아닌 경우, 영어면 소문자처리해서 Hi, Hi, hI, hi 인식하도록
  else {
    switch (text.toLowerCase()) {
      case "hi":
        greeting(rtm, channel);
        break;

      case "오늘 밥 뭐야":
        scrap(rtm, channel);
        break;

      default:
        rtm.sendMessage("I`m alive", channel);
    }
  }
});
