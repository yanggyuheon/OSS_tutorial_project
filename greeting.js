const greeting = function (rtm, channel) {
  // 인사 패턴 3가지로 랜덤하게 응답하도록 0 ~ 2 난수 생성
  // 0 <= Math.random() * 3 < 3 + floor() - 소숫점 제외 => random 값 : 0 or 1 or 2
  const random = Math.floor(Math.random() * 3);
  console.log(`greeting ver_${random + 1}`);

  // Mocha => random : 0,1,2 이면 success, 다른 값이면 error.
  try {
    if (random === 0) {
      console.log("say Hello");
      rtm.sendMessage("Hello", channel);
    } else if (random === 1) {
      console.log("say bonjour");
      rtm.sendMessage("bonjour", channel);
    } else if (random === 2) {
      console.log("say 안녕하세요");
      rtm.sendMessage("안녕하세요", channel);
    } // random : 0 ~ 2 이외 값
    else {
      console.error("error");
      rtm.sendMessage("Error", channel);
    }

    if (random === 0 || random === 1 || random === 2)
      return Promise.resolve("success");

    // random : 0 ~ 2 아닌 경우 error
    return Promise.resolve("error");
  } catch (error) {
    console.error("error");
    return Promise.resolve("error");
  }
};
module.exports = greeting;
