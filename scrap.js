/* eslint-disable global-require */
// 터미널에서 npm install axios && npm install cheerio 하고 진행해 주세요.
const scrap = function (rtm, channel) {
  const axios = require("axios");
  const cheerio = require("cheerio");

  const today = new Date();

  const url = "https://sobi.chonbuk.ac.kr/menu/week_menu.php";
  const selector =
    `#contents > div.contentsArea.WeekMenu` +
    `> .section:eq(0) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(${
      today.getDay() + 2
    }) > ul > li`;

  // 요일 테스트 하시려면 getDay의 반환값이 일요일(0) ~ 토요일(6)이기 때문에 생각해서 해주세요. (기본값 2(오늘), 식단 리스트 3~7),
  // 1~2 일때 백반과 중식 적혀있는 곳은 th여서 빈배열 반환, 값이 8 초과여도 빈배열 반환되어 토요일 값이 들어가도 문제는 없어보임.

  async function webScraping() {
    const res = [];
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const getData = $(selector);

    getData.each(function () {
      res.push($(this).text());
    });

    // scrap한 li에 빈 배열들을 제거하기 위한 .fliter 참고 : "https://hianna.tistory.com/423"
    return res.filter(Boolean);
  }

  webScraping().then((res) => {
    let menu = ""; // 메뉴를 한 줄로 저장할 변수
    let score = 1; // 기본 점수 1점으로

    // 읽어온 여러 메뉴 반복문을 통해, string type + 점수 변경
    res.forEach((value) => {
      // 기존 메뉴 문자열 + (메뉴이름, ) String type으로 늘려가기
      menu += `${value}, `;

      // 메뉴명에 포함여부에 따라 점수 +, - 변경 / 메뉴에 점수 변경 2개 이상일 때 모두 찾기위해 각각 if문으로
      // ex) "감자채볶음/오이도라지무침" => "감자" : + 1, "오이" : - 1

      // 1) 점수 + 경우
      if (value.includes("갈치")) {
        score += 1;
      }
      if (value.includes("감자")) {
        score += 1;
      }
      if (value.includes("카레")) {
        score += 1;
      }
      if (value.includes("고기")) {
        score += 1;
      }

      // 2) 점수 - 경우
      if (value.includes("오이")) {
        score -= 1;
      }

      if (value.includes("나물")) {
        score -= 1;
      }

      if (value.includes("시금치")) {
        score -= 1;
      }
    });

    // 메뉴 마지막 ", "" 부분 제거 => 0 ~ menu.length - 3 범위로 자르기
    menu = menu.substring(0, menu.length - 2);

    // 메뉴 출력
    rtm.sendMessage(menu, channel);

    // 점수는 1 ~ 3 점으로 설정되도록 score < 1이면 => 1점, score > 3이면 => 3점 처리 + 점수 출력
    if (score <= 1) rtm.sendMessage("★☆☆", channel);
    else if (score === 2) rtm.sendMessage("★★☆", channel);
    // score >=3
    else rtm.sendMessage("★★★", channel);
  });
};
module.exports = scrap;
