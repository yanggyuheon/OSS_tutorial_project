require("dotenv").config();

const { RTMClient } = require("@slack/rtm-api");
// const { channel } = require("diagnostics_channel");

const fs = require("fs");

const testchannel = "D04F5HP28NL";
const testuid = "U04C77L0000"
let token;


try {
    token = fs.readFileSync("./token").toString("utf-8");
  } catch (err) {
    console.error(err);
}

token = token.trim();

const rtm = new RTMClient(token);

rtm.start();
let status = 0;
rtm.on('ready', async ()=> {
    const rdy1 = await rtm.sendMessage("테스트를 시작한다.", testchannel);
    console.log("테스트 루틴 시작이다.");
    status+=1;

    const rdy2 = await rtm.sendMessage("hi", testchannel);
    console.log(rdy1)
    console.log(rdy2)
});

const answerhello = ["Hello", "bonjour", "안녕하세요"];
rtm.on('message', (message)=> {
    const {text} = message;

    console.log("받은 메시지: ", text);
    if(message.user === testuid){
        
        switch(status){
            case 1:
                if(answerhello.includes(text)){
                    console.log("테스트 #1 성공");
                    status+=1;
                }else{
                    console.log("테스트 #1 실패");
                    process.exit(1);
                }
                rtm.sendMessage("학사 일정 테스트", testchannel);
                console.log("테스트 #2 시작");
                break;
            case 2:
                rtm.sendMessage("학사 일정", testchannel)
                rtm.sendMessage("12/21", testchannel)
                if(text === "12/21는 종강 입니다."){
                    console.log("테스트 #2 성공");
                    status+=1;
                }else{
                    console.log("테스트 #2 실패");
                    process.exit(1);
                }
                rtm.sendMessage("주간 식단 테스트", testchannel);
                console.log("테스트 #3 시작");
                break;
            case 3:
                rtm.sendMessage("식단 안내", testchannel)
                rtm.sendMessage("이번주 뭐 나와", testchannel)
                if(text !== "undifined"){
                    console.log("테스트 #3 성공");
                    status+=1;
                }else{
                    console.log("테스트 #3 실패");
                    process.exit(1);
                }
                break;
            default:
                break;
        }
    }else{
        rtm.sendMessage("테스트 채널에서 떠들지 마세요.", testchannel);
    }
});