require("dotenv").config();
const { RTMClient } = require("@slack/rtm-api");
const fs = require("fs");
const assert = require("assert");
const dept = require("./dept");

const channel = "D047VRXT0C9";
let token;

try {
  token = fs.readFileSync("./token").toString("utf-8");
} catch (err) {
  console.error(err);
}

const classarr = [
  "Architectural Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
];

const testText = classarr[Math.floor(Math.random() * classarr.length)];

const rtm = new RTMClient(token);

(async () => {
  await rtm.start().catch(console.error);
})();

let res;
describe("테스트를 시작합니다", async () => {
  before(async () => {
    res = await dept.fsdept(rtm, channel, testText);
    return res;
  });

  it("학과사무실 모듈 테스트", (done) => {
    console.log(res);
    assert.equal(res, "success");
    done();
  });
});
