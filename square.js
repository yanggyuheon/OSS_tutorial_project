const squareFunction = function (rtm, text, channel) {
  console.log("Do square");
  console.log(text);
  rtm.sendMessage(`The result is ${text * text}`, channel);
};

module.exports = squareFunction;
