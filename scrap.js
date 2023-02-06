// 터미널에서 npm install axios && npm install cheerio 하고 진행해 주세요.
const axios = require("axios");
const cheerio = require("cheerio");

const today = new Date();

// 요일 테스트 하시려면 getDay의 반환값이 일요일(0) ~ 토요일(6)이기 때문에 생각해서 해주세요. (기본값 2(오늘), 식단 리스트 3~7),
// 1~2 일때 백반과 중식 적혀있는 곳은 th여서 빈배열 반환, 값이 8 초과여도 빈배열 반환되어 토요일 값이 들어가도 문제는 없어보임.

function selectorFunc(number = 0) {
  // 기본값 월요일
  const str =
    `#contents > div.contentsArea.WeekMenu` +
    `> .section:eq(0) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(${
      3 + number
    }) > ul > li`;
  return str;
}

const dayDict = {
  0: "월요일",
  1: "화요일",
  2: "수요일",
  3: "목요일",
  4: "금요일",
};

async function webScraping() {
  const url = "https://sobi.chonbuk.ac.kr/menu/week_menu.php";
  const res = [];
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);
  let getData;

  let i = 0;
  for (i = 0; i < 5; i += 1) {
    const tmpList = [];
    getData = $(selectorFunc(i));
    getData.each(function () {
      if ($(this).text() !== "\n") {
        tmpList.push($(this).text().replace("\n", ""));
      }
    });
    res.push(tmpList.filter(Boolean));
  }
  // scrap한 li에 빈 배열들을 제거하기 위한 .fliter 참고 : "https://hianna.tistory.com/423"

  return res; // .at(0) = 월요일 메뉴
}

function scoring(str) {
  let score = 2; // 기본 점수 2점으로

  str.forEach((value) => {
    // 1) 점수 + 경우
    if (value.includes("고기")) {
      score += 1;
    }
    if (value.includes("새우")) {
      score += 1;
    }
    if (value.includes("만두")) {
      score += 1;
    }
    if (value.includes("두부")) {
      score += 1;
    }

    // 2) 점수 - 경우
    if (value.includes("쑥")) {
      score -= 1;
    }
    if (value.includes("숙주")) {
      score -= 1;
    }
    if (value.includes("나물")) {
      score -= 1;
    }
    if (value.includes("토마토")) {
      score -= 1;
    }
  });

  return score;
}

function scoreToStar(score) {
  if (score <= 1) return "★☆☆";
  if (score === 2) return "★★☆";
  return "★★★";
}

const todayScrap = function (rtm, channel) {
  console.log("일간메뉴 출력");
  try {
    webScraping().then((res) => {
      if (today.getDay() === 0 || today.getDay() === 6) {
        rtm.sendMessage("주말에는 밥 안팔아요", channel);
        return Promise.resolve("success");
      }
      let menu = "";
      const todayMenu = res.at(today.getDay() - 1);
      const score = scoring(todayMenu);

      todayMenu.forEach((value) => {
        menu += `${value}, `;
      });

      menu = menu.substring(0, menu.length - 2);

      // 메뉴 및 별점 출력
      rtm.sendMessage(`${menu}\n${scoreToStar(score)}`, channel);
      return Promise.resolve("success");
    });
    return Promise.resolve("success");
  } catch (error) {
    console.error("error");
    return Promise.resolve("error");
  }
};

const weeklyScrap = function (rtm, channel) {
  console.log("주간메뉴 출력");
  try {
    webScraping().then((res) => {
      let i;
      for (i = 0; i < 5; i += 1) {
        let menu = "";
        const todayMenu = res.at(i);
        const score = scoring(todayMenu);

        todayMenu.forEach((value) => {
          menu += `${value}, `;
        });

        menu = menu.substring(0, menu.length - 2);
        rtm.sendMessage(
          `${dayDict[i]}\n${menu}\n${scoreToStar(score)}`,
          channel
        );
      }
    });
    return Promise.resolve("success");
  } catch (error) {
    console.error("error");
    return Promise.resolve("error");
  }
};

module.exports = {
  todayScrap,
  weeklyScrap,
};
