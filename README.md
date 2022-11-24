# 전북대학교 학생들을 위한 챗봇

해당 프로젝트는 전북대학교 학생들을 위한 Chat bot service 입니다.

학생이 원하는 내용을 입력하면, 입력에 따른 응답을 합니다.

주요 기능으로는 인사하기, 학사 일정 안내, 식단 안내 및 평가, 학과 사무실 안내가 존재합니다.

## 주요 기능

### 주요기능 - 1) 인사하기

학생이 `"Hi"`를 입력하면 인사합니다. (대소문자 모두 처리)

인사의 종류는 `"Hello", "bonjour", "안녕하세요"` 세 가지 방식이 존재하고 랜덤으로 응답합니다.

![image](https://user-images.githubusercontent.com/112867282/203094517-900f834f-f09d-450e-a402-88aea457c5e7.png)

---

### 주요기능 - 2) 학사 일정 안내

학생이 `"학사일정"`을 입력하면 `"안내 받을 날짜를 이야기해주세요"`를 응답합니다.

그 후 예를 들어 `"10/15"`처럼 `"mm/dd"`를 입력하면, `"10/15는 개교기념일 입니다."`처럼 해당 날짜의 학사 일정을 응답합니다.

![image](https://user-images.githubusercontent.com/40075034/203595104-9ac40e25-f709-48c4-a83a-9c7c1f834d7d.png)

---

### 주요기능 - 3) 식단 안내 및 평가

학생이 `"오늘 밥 뭐야"`을 입력하면 오늘의 진수원 중식 식단과, 반찬에 따라 평가를 진행하여 1 ~ 3 사이의 점수를 `"★☆☆", "★★☆", "★★★"` 별로 응답합니다.

![image](https://user-images.githubusercontent.com/112867282/203094783-7acbc23e-e5e1-413a-abf6-748dba9fe03a.png)

---

### 주요기능 - 4) 학과 사무실 안내

학생이 `"컴퓨터공학부"`와 같은 학과 이름을 입력하면, `"공과대학 7호관 224호"`처럼 해당 학과의 사무실 위치를 응답합니다.

![image](https://user-images.githubusercontent.com/40075034/203675940-4fa2f9ae-c40b-46b5-977c-b4669d6d9905.png)
