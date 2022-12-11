const { RTMClient } = require("@slack/rtm-api");
const fs = require("fs");
const assert = require("assert");
const haksa = require("./haksa");
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

let res;

let runmmdd;

for (let i = 0; i < 5; i += 1) {
  runmmdd = `${Math.floor(Math.random() * 11) + 1}/${Math.floor(
    Math.random() * 31
  )}`;
}

describe("feature2 test", async () => {
  before(async () => {
    res = await haksa(rtm, channel, runmmdd);
    return res;
  });

  it("학사 일정 테스트", (done) => {
    console.log(res);
    assert.equal(res, "success");
    done();
  });
});
