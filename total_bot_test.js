require("dotenv").config();

const { RTMClient } = require("@slack/rtm-api");
// const { channel } = require("diagnostics_channel");

const fs = require("fs");

const testchannel = "C04F93CQ6MN";
// 여기에 본인이 사용하는 testuid를 넣어주세요 그리고 실행
const testuid = "U04C77L0000"
let token;
const channel = "D04F5HP28NL";

try {
    token = fs.readFileSync("./token2").toString("utf-8");
  } catch (err) {
    console.error(err);
}

token = token.trim();

const rtm = new RTMClient(token);

function wait(sec) {
    const start = Date.now();
    let now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
}
rtm.start();
let status = 0;
rtm.on('ready', async ()=> {
    const rdy1 = await rtm.sendMessage("테스트를 시작한다.", channel);
    console.log("테스트 루틴 시작이다.");
    status+=1;

    const rdy2 = await rtm.sendMessage("Hi", testchannel);
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
                rtm.sendMessage("학사 일정 테스트", channel);
                rtm.sendMessage("학사 일정", testchannel)
                console.log("테스트 #2 시작");
                break;
            case 2: 
                if(text === "mm/dd 의 형태로 원하시는 날짜를 입력해주세요"){
                    console.log("테스트 #2 성공");
                    status+=1;
                }else{
                    console.log("테스트 #2 실패");
                    process.exit(1);
                }
                rtm.sendMessage("12/21", testchannel)
                break;
            case 3:
                // rtm.sendMessage("학사 일정", testchannel)
                if(text === "12/21는 종강 입니다."){
                    console.log("테스트 #2 성공");
                    status+=1;
                }else{
                    console.log("테스트 #2 실패");
                    process.exit(1);
                }
                rtm.sendMessage("주간 식단 테스트", channel);
                rtm.sendMessage("식단 안내", testchannel)
                console.log("테스트 #3 시작");
                break;
            case 4:
                if(text === "이번주 식단이 궁금하면 : '이번주 뭐 나와' 를 입력해주세요\n오늘의 식단이 궁금하면 : '오늘 밥 뭐야' 를 입력해주세요"){
                    rtm.sendMessage("이번주 뭐 나와", testchannel)
                    status+=1;
                }
                break;
            case 5:
                // rtm.sendMessage("식단 안내", testchannel)
                // rtm.sendMessage("이번주 뭐 나와", testchannel)
                if(text !== "undifined"){
                    console.log("테스트 #3 성공");
                    status+=1;
                }else{
                    console.log("테스트 #3 실패");
                    process.exit(1);
                }
                rtm.sendMessage("일간 식단 테스트", channel);
                wait(3)
                rtm.sendMessage("식단 안내", testchannel)
                break;
            case 6:
                if(text === "이번주 식단이 궁금하면 : '이번주 뭐 나와' 를 입력해주세요\n오늘의 식단이 궁금하면 : '오늘 밥 뭐야' 를 입력해주세요"){
                    status+=1;
                    rtm.sendMessage("오늘 밥 뭐야", testchannel)
                }
                else{
                    console.log("요일 skip");
                }
                break;
            // case 7:
            //     status+=1;
            //     break;
            // case 8:
            //     status+=1;
            //     break;
            case 7:
                if(text !== "undifined"){
                    status+=1;
                    console.log("테스트 #3-2-1 성공");
                    rtm.sendMessage("학과 안내", testchannel)
                    rtm.sendMessage("학과 안내 테스트 - 기본", channel);
                }
                else{
                    console.log("테스트 #3-2-1 실패");
                    process.exit(1);
                }
                break;
            // case 8:
            //     // rtm.sendMessage("식단 안내", testchannel)
            //     // if(text !== "undifined"){
            //     //     console.log("테스트 #3-2 성공");
            //     //     status+=1;
            //     // }else{
            //     //     console.log("테스트 #3-2 실패");
            //     //     process.exit(1);
            //     // }
            //     rtm.sendMessage("학과 안내 테스트 - 기본", channel);
            //     wait(3)
            //     // rtm.sendMessage("학과 안내", testchannel)
            //     break;
            case 8:
                    if(text ==="학과를 입력하세요"){
                        status+=1;
                    }
                    else{
                        console.log("테스트 #4-1 실패");
                        process.exit(1);
                    }
                    rtm.sendMessage("Architectural Engineering", testchannel)
                    break;

            case 9: 
                // rtm.sendMessage("학과 안내", testchannel)
                // rtm.sendMessage("Architectural Engineering", testchannel)
                if(text === "입력하신 학과의 정보는 College of Engineering Building 1, 132입니다."){
                    console.log("테스트 #4-1 성공");
                    status+=1;
                }else{
                    console.log("테스트 #4-1 실패");
                    process.exit(1);
                }
                rtm.sendMessage("학과 안내 테스트 - 대소문자 구별X", channel);
                rtm.sendMessage("학과 안내", testchannel)
                break;
            case 10:
                if(text ==="학과를 입력하세요"){
                    status+=1;
                }
                else{
                    console.log("테스트 #4-2 실패");
                    process.exit(1);
                }
                rtm.sendMessage("ArchitEctural EnginEering", testchannel)
                break;
            case 11: 
                // rtm.sendMessage("학과 안내", testchannel)
                if(text === "입력하신 학과의 정보는 College of Engineering Building 1, 132입니다."){
                    console.log("테스트 #4-2 성공");
                    status+=1;
                }else{
                    console.log("테스트 #4-2 실패");
                    process.exit(1);
                }
                rtm.sendMessage("학과 안내 테스트 - 유사도", channel);
                rtm.sendMessage("학과 안내", testchannel)
                break;
            case 12:
                if(text ==="학과를 입력하세요"){
                    status+=1;
                }
                else{
                    console.log("테스트 #4-3 실패");
                    process.exit(1);
                }
                rtm.sendMessage("ArchitecturalEngineer", testchannel)
                break;

            case 13: 
                if(text === "Architectural Engineering을 말씀하시는 건가요?\n입력하신 학과의 정보는 College of Engineering Building 1, 132입니다."){
                    console.log("테스트 #4-3 성공");
                    process.exit(1);
                    status+=1;
                }else{
                    console.log("테스트 #4-3 실패");
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