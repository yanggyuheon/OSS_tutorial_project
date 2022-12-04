const { RTMClient } = require("@slack/rtm-api");
const fs = require("fs");
const lineReader = require("line-reader");
const greeting = require("./greeting");
const haksa = require("./haksa");
const square = require("./square");
require("dotenv").config();
const scrap = require("./scrap");

let token;
try {
  token = fs.readFileSync("./token").toString("utf-8");
} catch (err) {
  console.error(err);
}

// 학과 배열
const classarr = [];
try {
  let i = 0;
  lineReader.eachLine("./dept.txt", (line) => {
    const string = line.substr(0, line.indexOf("-") - 1);
    classarr[i] = string;
    i += 1;
  });
} catch (err) {
  console.error(err);
}

const rtm = new RTMClient(token);

rtm.start();

rtm.on("message", (message) => {
  const { channel } = message;
  const { text } = message;

  // switch문 정규식 사용을 위한 테스트 변경, 추후 수정 가능성 있음
  // case 별로 if문같이 사용
  switch (true) {
    case !Number.isNaN(Number(text)):
      square(rtm, text, channel);
      break;
    case text.toLowerCase() === "hi":
      greeting(rtm, channel);
      break;
    case /^([1-9]|1[0-2])\/([1-9]|[12][0-9]|3[01])$/.test(text):
      haksa(rtm, channel, text);
      break;
    case "오늘 밥 뭐야":
      scrap(rtm, channel);
      break;
    default:
      rtm.sendMessage("I`m alive", channel);
  }
});
