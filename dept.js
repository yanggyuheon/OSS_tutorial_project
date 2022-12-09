const pythonShell = require("python-shell"); // npm i -S python-shell
const fs = require("fs");
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
      return Promise.resolve("success");
    }

    const options = {
      mode: "text",
      pythonPath: "",
      pythonOptions: ["-u"],
      scriptPath: "",
      args: [deptLowerList, text.toLowerCase().replace(/ /g, "")],
    };

    pythonShell.PythonShell.run("main.py", options, (err, results) => {
      if (err) {
        console.error(err);
        return Promise.resolve("error");
      }
      // results : object => string 타입으로 수정
      const resultText = results.toString();

      const idx2 = deptLowerList.indexOf(resultText);

      console.log(deptDict[results]);
      rtm.sendMessage(
        `${deptUpperList[idx2]}을 말씀하시는 건가요?\n입력하신 학과의 정보는 ${deptDict[results]}입니다.`,
        channel
      );
      return Promise.resolve("success");
    });
    return Promise.resolve("success");
  } catch (err) {
    console.error(err);
    return Promise.resolve("error");
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
