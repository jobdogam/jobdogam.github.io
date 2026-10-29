// 랜덤 핀볼 회차 설정 — 신청 마감 날짜·회차는 여기 한 곳만 고치면 됨
// (신청 페이지 event.html · 게임 pinball.html · 관리 admin-q7m2.html · 결과 result.html 이 같이 읽음)
// deadline: 한국 시각(+09:00). 이 시각이 지나면 신청 버튼이 잠기고, 경기 때는 이 시각까지 들어온 신청만 공으로 나가요.
// dl: 신청 페이지에 보이는 마감 문구. date: 경기 기록 이름(race_날짜.json)과 결과 페이지 날짜.
// kind: 구글 폼 '구분' 칸에 들어가는 값(시트에서 회차를 나누는 기준). 1회차 기록(핀볼이벤트)은 그대로 둠.
// 새 회차를 열 때: 아래 목록 끝에 한 줄 추가(n·date·kind·deadline·dl) — 맨 마지막 줄이 지금 받는 회차.
window.PB_ROUNDS=[
 {n:1,date:'20261027',kind:'핀볼이벤트',deadline:'2026-10-27T22:00:59+09:00',dl:'10월 27일(화) 밤 10시',winner:'외교관'},
 {n:2,date:'20261029',kind:'핀볼이벤트2',deadline:'2026-10-29T22:00:59+09:00',dl:'10월 29일(목) 밤 10시',winner:'f1엔지니어'}
];
window.PB_ROUND=window.PB_ROUNDS[window.PB_ROUNDS.length-1];
window.PB_ROUND.dlMs=Date.parse(window.PB_ROUND.deadline);
window.PB_ROUNDS.forEach(function(r){r.dlMs=Date.parse(r.deadline)});
