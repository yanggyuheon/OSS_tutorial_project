var greeting = function(rtm, channel){
	console.log('say hello');
	rtm.sendMessage('Hello', channel);
}
module.exports = greeting;