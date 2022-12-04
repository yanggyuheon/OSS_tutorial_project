// 학과 사무실 배열
const lineReader = require("line-reader");

const Classresult = [
  "College of Engineering Building 1, 132",
  "College of Engineering Building 4, 212",
  "College of Engineering Building 6, 999",
];
try {
  let i = 0;
  lineReader.eachLine("./dept.txt", (line) => {
    let string = line;
    string = string.substr(string.indexOf("-") + 2, string.length);
    Classresult[i] = string;
    i += 1;
  });
} catch (err) {
  console.error(err);
}

const resultFunction = function (rtm, text, index, channel) {
  // console.log("check classroom");
  try {
    const resulttext = Classresult[index];
    console.log(resulttext);
    rtm.sendMessage(`The result is ${resulttext}`, channel);
    if (resulttext === undefined) {
      throw new Error("error");
    }
    return Promise.resolve("success");
  } catch (error) {
    console.error("error");
    return Promise.resolve("error");
  }
};

module.exports = resultFunction;
