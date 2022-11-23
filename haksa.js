const fs = require("fs");

const readTxtnSplit = function () {
  let scheduleList = [];
  const res = {};
  const strArr = fs.readFileSync("./haksa.txt").toString("utf-8");
  scheduleList = strArr.split(/\r\n/);
  // console.log(scheduleList);
  scheduleList.forEach((scStr) => {
    const tmpList = scStr.split(/ : /);
    // console.log(tmpList);
    if (tmpList.at(0).includes("-")) {
      const dateList = tmpList.at(0).split(/\/| - /);

      if (dateList.at(0) === dateList.at(2)) {
        let tmpDict = {};
        if (res[dateList.at(0)] !== undefined) {
          tmpDict = res[dateList.at(0)];
        }

        for (
          let i = Number(dateList.at(1));
          i <= Number(dateList.at(3));
          i += 1
        ) {
          if (tmpDict[String(i)] !== undefined) {
            tmpDict[String(i)] = `${tmpDict[String(i)]} \n \t${tmpList.at(-1)}`;
          } else {
            tmpDict[String(i)] = tmpList.at(-1);
          }
          res[dateList.at(0)] = tmpDict;
        }
      }

      // console.log(dateList);
    } else {
      const dateList = tmpList.at(0).split(/\//);

      if (res[dateList.at(0)] === undefined) {
        const tmpDict = {};

        tmpDict[dateList.at(-1)] = tmpList.at(-1);

        res[dateList.at(0)] = tmpDict;
      } else {
        const tmpDict = res[dateList.at(0)];

        if (tmpDict[dateList.at(-1)] !== undefined) {
          tmpDict[dateList.at(-1)] = `${
            tmpDict[dateList.at(-1)]
          } \n \t ${tmpList.at(-1)}`;
        } else {
          tmpDict[dateList.at(-1)] = tmpList.at(-1);
          // console.log(tmpDict[dateList.at(-1)]);
        }
        res[dateList.at(0)] = tmpDict;
      }
    }
  });
  return res;
};

const haksa = function (rtm, channel, date) {
  console.log(`haksa "${date}"`);
  const res = readTxtnSplit();
  const month = date.split(/\//).at(0);
  const day = date.split(/\//).at(1);

  try {
    if (/^([1-9]|1[0-2])\/([1-9]|[12][0-9]|3[01])$/.test(date)) {
      if (res[month] !== undefined && res[month][day]) {
        rtm.sendMessage(`${date}는 ${res[month][day]} 입니다.`, channel);
      } else {
        rtm.sendMessage(`${date}는 일정이 없습니다.`, channel);
      }
      return Promise.resolve("success");
    }
    console.error("Regex error");
    return Promise.resolve("error");
  } catch (err) {
    console.error(err);
    return Promise.resolve("error");
  }
};

// console.log(readTxtnSplit()); // 올바른 dict를 반환했는지 확인

module.exports = haksa;
