const { RTMClient } = require("@slack/rtm-api");
const fs = require("fs");
const lineReader = require('line-reader');
const greeting = require("./greeting");
const square = require("./square");
require("dotenv").config();
const classresult = require("./class_result")
const scrap = require("./scrap");

let token;
try {
  token = fs.readFileSync("./token").toString("utf-8");
} catch (err) {
  console.error(err);
}

// 학과 배열
const classarr = [];
try{
  let i = 0
  lineReader.eachLine('./dept.txt',(line)=>{
    const string =line.substr(0, line.indexOf('-')-1)
    classarr[i] = string;
    i+=1;
  })
} catch(err){
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
  if(classarr.includes(text)){
    const idx = classarr.indexOf(text);
    classresult(rtm, text, idx ,channel)
  }
  else {
    // text - 소문조라 변환해서 HI, Hi, hI, hi 인식하도록
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
