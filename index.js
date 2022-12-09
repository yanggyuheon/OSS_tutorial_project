const { RTMClient } = require("@slack/rtm-api");
const fs = require("fs");

//  참고 : https://doongdoongeee.tistory.com/148
const { spawn } = require("child_process");

// 사용하기 전 npm instll line-reader 할것
const lineReader = require("line-reader");
const greeting = require("./greeting");
const haksa = require("./haksa");
const square = require("./square");
const classresult = require("./class_result");
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
const classarr2 = []; // 대소문자, 띄워쓰기 적용된 dept text
try {
  let i = 0;
  lineReader.eachLine("./dept.txt", (line) => {
    const string = line.substr(0, line.indexOf("-") - 1);

    classarr2[i] = string;
    const stringlower = string.toLocaleLowerCase();
    const laststring = stringlower.replace(/ /g, "");

    classarr[i] = laststring;
    i += 1;
  });
} catch (err) {
  console.error(err);
}

// 학과 사무실을 입력받을때 사용하는 flags
let flags = 0;

const rtm = new RTMClient(token);

rtm.start();

rtm.on("message", (message) => {
  const { channel } = message;
  const { text } = message;


  if (flags === 1) {
    const idx = classarr.indexOf(text.toLowerCase().replace(/ /g, ""));
    // 일치하는 학과가 있는 경우, 없는 경우 if-else
    if (idx !== -1) {
      classresult(rtm, text.toLowerCase().replace(/ /g, ""), idx, channel);
    } else {
      // spawn을 통해 "python main.py" 명령어 실행
      // 순서 : python파일명, dept array, input dept text
      const result = spawn("py", [
        "./main.py",
        classarr,
        text.toLowerCase().replace(/ /g, ""),
      ]);

      // stdout의 'data'이벤트리스너로 실행결과를 받는다.
      result.stdout.on("data", (data) => {
        const resulttext = data.toString().slice(0, data.toString().length - 2);

        const idx2 = classarr.indexOf(resulttext);
        rtm.sendMessage(`${classarr2[idx2]}을 말씀하시는 건가요?\n`, channel);
        classresult(rtm, resulttext, idx2, channel);
      });

      // 에러 발생 시, stderr의 'data'이벤트리스너로 실행결과를 받는다.
      result.stderr.on("data", (data) => {
        console.log("error", data.toString());
      });
    }
    flags = 0;

  } else {
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
          "이번주가 궁금하면 : '이번주 뭐 나와' 를 입력해주세요\n오늘이 궁금하면 : '오늘 밥 뭐야' 를 입력해주세요",
          channel
        );
        break;
      default:
        rtm.sendMessage(
          "학과 사무실 안내를 받으시려면 : 학과 안내\n진수원 식당 안내를 받으시려면 : 식단 안내\n인사를 하고 싶으시면 : HI\n제곱을 구하시고 싶으시면 : 숫자",
          channel
        );

    }
  }
});
