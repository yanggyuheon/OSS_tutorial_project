const { RTMClient } = require("@slack/rtm-api");
const fs = require("fs");
const greeting = require("./greeting");
const haksa = require("./haksa");
const square = require("./square");
const dept = require("./dept");
require("dotenv").config();
const scrap = require("./scrap");

let token;
try {
  token = fs.readFileSync("./token").toString("utf-8");
} catch (err) {
  console.error(err);
}

// 학과 사무실, 식단을 입력받을때 사용하는 flags
let flags = 0;

const rtm = new RTMClient(token);

rtm.start();

rtm.on("message", (message) => {
  const { channel } = message;
  const { text } = message;

  // switch문 정규식 사용을 위한 테스트 변경
  switch (true) {
    case flags === 1:
      dept.fsdept(rtm, channel, text);
      flags = 0;
      break;
    case !Number.isNaN(Number(text)):
      square(rtm, text, channel);
      break;
    case text.toLowerCase() === "hi":
      greeting(rtm, channel);
      break;
    case /^([1-9]|1[0-2])\/([1-9]|[12][0-9]|3[01])$/.test(text):
      haksa(rtm, channel, text);
      break;
    case text === "오늘 밥 뭐야":
      if (flags === 2) {
        scrap.todayScrap(rtm, channel);
        flags = 0;
      } else {
        rtm.sendMessage("식단 안내를 먼저 입력해주세요", channel);
      }
      break;
    case text === "이번주 뭐 나와":
      if (flags === 2) {
        scrap.weeklyScrap(rtm, channel);
        flags = 0;
      } else {
        rtm.sendMessage("식단 안내를 먼저 입력해주세요", channel);
      }
      break;
    case text === "학과 안내":
      flags = 1;
      rtm.sendMessage("학과를 입력하세요", channel);
      break;
    case text === "식단 안내":
      flags = 2;
      rtm.sendMessage(
        "이번주 식단이 궁금하면 : '이번주 뭐 나와' 를 입력해주세요\n오늘의 식단이 궁금하면 : '오늘 밥 뭐야' 를 입력해주세요",
        channel
      );
      break;
    default:
      rtm.sendMessage(
        "학과 사무실 안내를 받으시려면 : 학과 안내\n진수원 식당 안내를 받으시려면 : 식단 안내\n인사를 하고 싶으시면 : HI\n제곱을 구하시고 싶으시면 : 숫자",
        channel
      );
      break;
  }
});
