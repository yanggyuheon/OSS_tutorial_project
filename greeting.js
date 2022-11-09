const greeting = function (rtm, channel) {
  console.log("say hello1");
  rtm.sendMessage("Hello", channel);
};
module.exports = greeting;
