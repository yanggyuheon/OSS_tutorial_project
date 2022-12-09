require("dotenv").config();

const { RTMClient } = require("@slack/rtm-api");
// const { channel } = require("diagnostics_channel");

const fs = require("fs");

const testchannel = "D04BL0HNXM2";
// const testuid = "U04C77L0000"
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
    if(true){
        
        switch(status){
            case 1:
                if(answerhello.includes(text)){
                    console.log("테스트 #1 성공");
                    status+=1;
                }else{
                    console.log("테스트 #1 실패");
                    process.exit(1);
                }
                rtm.sendMessage("4", testchannel);
                console.log("테스트 #2 시작");
                break;
            case 2:
                if(text === "16"){
                    console.log("테스트 #2 성공");
                    status+=1;
                }else{
                    console.log("테스트 #2 실패");
                    process.exit(1);
                }
                break;
            default:
                break;
        }
    }else{
        rtm.sendMessage("테스트 채널에서 떠들지 마세요.", testchannel);
    }
})