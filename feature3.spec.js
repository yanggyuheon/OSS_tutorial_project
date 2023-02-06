const { RTMClient } = require("@slack/rtm-api");
const fs = require("fs");
const assert = require("assert");
const scrap = require("./scrap");
require("dotenv").config();

let token;
try {
  token = fs.readFileSync("./token").toString("utf-8");
} catch (err) {
  console.error(err);
}
const channel = "D047VRXT0C9";
const rtm = new RTMClient(token);

(async () => {
  await rtm.start().catch(console.error);
})();

let todayres;
let weeklyres;
const res = [];
describe("테스트를 시작합니다", async () => {
  before(async () => {
    todayres = await scrap.todayScrap(rtm, channel);
    weeklyres = await scrap.weeklyScrap(rtm, channel);
    res.push(todayres);
    res.push(weeklyres);
    return res;
  });

  it("식단 일간/주간 테스트", (done) => {
    console.log(res);
    assert.equal(res.at(0), "success");
    assert.equal(res.at(1), "success");
    done();
  });
});
