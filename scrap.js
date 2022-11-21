// 터미널에서 npm install axios && npm install cheerio 하고 진행해 주세요.

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

  // for (const contents of getData) {
  //     res.push($(contents).text());
  // } // eslint error

  getData.each(function () {
    res.push($(this).text());
  });

  // scrap한 li에 빈 배열들을 제거하기 위한 .fliter 참고 : "https://hianna.tistory.com/423"
  return res.filter(Boolean);
}

webScraping().then((res) => {
  console.log(res);
});

exports.webScraping = webScraping;
