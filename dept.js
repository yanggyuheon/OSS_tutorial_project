const fs = require("fs");
const { spawn } = require("child_process");
const lineReader = require("line-reader");

// 정규식 + fs 버전
const readTxtnSplit = function () {
  let deptList = [];
  const resDict = {};
  const resUpperList = [];
  const resLowerList = [];
  const strArr = fs.readFileSync("./dept.txt").toString("utf-8");
  deptList = strArr.split(/\r\n/);
  deptList.forEach((deptStr) => {
    const tmpList = deptStr.split(/ - /);
    resUpperList.push(tmpList.at(0));
    const tmpString = tmpList.at(0).toLowerCase().replace(/ /g, "");
    resLowerList.push(tmpString);
    resDict[tmpString] = tmpList.at(1);
  });
  return [resDict, resUpperList, resLowerList];
};

const fsdept = function (rtm, channel, text) {
  const [deptDict, deptUpperList, deptLowerList] = readTxtnSplit();
  const compText = text.toLowerCase().replace(/ /g, "");
  try {
    if (deptLowerList.includes(compText) === true) {
      console.log(deptDict[compText]);
      rtm.sendMessage(
        `입력하신 학과의 정보는 ${deptDict[compText]}입니다.`,
        channel
      );
      Promise.resolve("success");
    } else {
      // spawn을 통해 "python main.py" 명령어 실행 , python파일명, dept array, input dept text 순서
      const result = spawn("python3", ["./main.py", deptLowerList, compText]);
      // stdout의 'data'이벤트리스너로 실행결과를 받는다.
      result.stdout.on("data", (data) => {
        const resultText = data.toString().slice(0, data.toString().length - 2);
        const idx = deptLowerList.indexOf(resultText);

        console.log(deptDict[resultText]);
        rtm.sendMessage(
          `${deptUpperList[idx]}을 말씀하시는 건가요?\n입력하신 학과의 정보는 ${deptDict[resultText]}입니다.`,
          channel
        );
      });
      // 에러 발생 시, stderr의 'data'이벤트리스너로 실행결과를 받는다.
      result.stderr.on("data", (data) => {
        console.log("error", data.toString());
      });
      Promise.resolve("success");
    }
  } catch (err) {
    console.error(err);
    Promise.resolve("error");
  }
};

// line-reader 버전

const classResult = [
  "College of Engineering Building 1, 132",
  "College of Engineering Building 4, 212",
  "College of Engineering Building 6, 999",
];

try {
  let i = 0;
  lineReader.eachLine("./dept.txt", (line) => {
    let string = line;
    string = string.substr(string.indexOf("-") + 2, string.length);
    classResult[i] = string;
    i += 1;
  });
} catch (err) {
  console.error(err);
}

const resultFunction = function (rtm, text, index, channel) {
  // console.log("check classroom");
  try {
    const resultText = classResult[index];
    console.log(resultText);
    rtm.sendMessage(`The result is ${resultText}`, channel);
    if (resultText === undefined) {
      throw new Error("error");
    }
    return Promise.resolve("success");
  } catch (error) {
    console.error("error");
    return Promise.resolve("error");
  }
};

module.exports = { fsdept, resultFunction };
