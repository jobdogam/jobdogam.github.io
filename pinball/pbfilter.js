// 핀볼 신청 집계 공통 규칙 (event·admin·게임이 같이 씀). 원래 시트는 건드리지 않고 '세는 방법'만 정함.
// ① 같은 아이디는 마지막 1건
// ③ 같은 직업 신청(서로 다른 아이디)이 20초 안 간격으로 4건 이상 연달아 들어오면 그 묶음 1표
// ⑤ 같은 직업에서 10분 안, 아이디 편집거리 1 이하(4자 이상) → 같은 사람
// ② 같은 그림은 단독 근거 아님: 기본·랜덤 틀이 아닌 같은 그림 + 두 아이디 모두 '막 친 아이디'(④) + 같은 직업 10분 안일 때만 묶음
// ④ 막 친 아이디(영문에 모음이 거의 없음)는 '의심' 표시만, 단독으로는 빼지 않음
(function(g){
'use strict';
const SEP='\u241f';
const normJob=s=>String(s||'').toLowerCase().replace(/[\s·()・,.\-]/g,'');
const normId=s=>String(s||'').trim().replace(/^@+/,'').toLowerCase();
function parseCSV(s){const out=[];let row=[],f='',q=false;for(let i=0;i<s.length;i++){const ch=s[i];if(q){if(ch=='"'){if(s[i+1]=='"'){f+='"';i++}else q=false}else f+=ch}else if(ch=='"')q=true;else if(ch==','){row.push(f);f=''}else if(ch=='\n'||ch=='\r'){if(ch=='\r'&&s[i+1]=='\n')i++;row.push(f);out.push(row);row=[];f=''}else f+=ch}if(f||row.length){row.push(f);out.push(row)}return out}
// "2026. 10. 27 오후 7:25:44" → ms(UTC)
function pbTime(s){const m=String(s||'').match(/(\d+)\.\s*(\d+)\.\s*(\d+)\s*(오전|오후)\s*(\d+):(\d+):?(\d+)?/);if(!m)return 0;let h=+m[5]%12;if(m[4]==='오후')h+=12;return Date.UTC(+m[1],+m[2]-1,+m[3],h-9,+m[6],+(m[7]||0))}
// ④ 막 친 아이디: 영문만 모아 5자 이상인데 모음(aeiou) 비율 20% 미만. 표시만 함.
function suspId(id){const s=String(id||'').toLowerCase().replace(/[^a-z]/g,'');if(s.length<5)return false;const v=(s.match(/[aeiou]/g)||[]).length;return v/s.length<0.2}
function ed1(a,b){if(a===b)return true;const la=a.length,lb=b.length;if(Math.abs(la-lb)>1)return false;let i=0;while(i<la&&i<lb&&a[i]===b[i])i++;if(la===lb)return a.slice(i+1)===b.slice(i+1);if(la>lb)return a.slice(i+1)===b.slice(i);return a.slice(i)===b.slice(i+1)}
// 기본·랜덤 그림 틀: event.html '랜덤 예시'(타원 몸통+모자 4종)의 칠한 칸 모양과 10칸 이하 차이면 틀로 봄
const TPL=(()=>{const out=[];for(let hat=0;hat<4;hat++){const m=new Array(144).fill(0);for(let y=2;y<11;y++)for(let x=0;x<6;x++){const dx=5.5-x,dy=y-6.3;if(dx*dx/30+dy*dy/22<1){m[y*12+x]=1;m[y*12+11-x]=1}}
 if(hat===0){m[3]=m[15]=m[8]=m[20]=1}else if(hat===1){for(let x=2;x<10;x++)m[12+x]=1}else if(hat===2){m[6]=m[17]=m[18]=1}out.push(m)}return out})();
const mask=c=>[...c].map(ch=>parseInt(ch,17)?1:0);
const canon=c=>{const mp=new Map();return [...c].map(ch=>{if(!mp.has(ch))mp.set(ch,String.fromCharCode(65+mp.size));return mp.get(ch)}).join('')};
function isTplMask(c){const m=mask(c);return TPL.some(t=>{let d=0;for(let i=0;i<144;i++)if(t[i]!==m[i]&&++d>10)return false;return true})}
// rows: [[시각, 직업, '아이디␟p:그림', 구분], ...] (시트 순서) / opt.deadline(ms) 이후 신청은 뺌
function filter(rows,opt={}){
 const dl=opt.deadline||0;const raw=[];
 for(const r of rows){if(!r||r.length<3)continue;const ts=pbTime(r[0]);if(dl&&ts>dl)continue;const job=String(r[1]||'').trim(),pk=String(r[2]||'').split(SEP),id=normId(pk[0]),look=String(pk[1]||'').replace(/^p:/,'');if(!id||job.length<2)continue;raw.push({tsText:r[0],ts,job,key:normJob(job),id,look})}
 // ① 같은 아이디는 마지막 1건
 const byId=new Map();for(const e of raw){byId.delete(e.id);byId.set(e.id,e)}
 const E=[...byId.values()];E.forEach((e,i)=>{e.i=i;e.susp=suspId(e.id);e.subs=raw.filter(x=>x.id===e.id).length});
 // 그림 틀 판정: 랜덤 틀 모양이거나, 같은 무늬(색만 바꾼 것)가 3가지 이상 색으로 쓰인 그림 = 공용 틀 → 근거에서 뺌
 const canCnt=new Map();for(const lk of new Set(E.map(e=>e.look).filter(l=>l.length===144))){const c=canon(lk);canCnt.set(c,(canCnt.get(c)||0)+1)}
 const tplCache=new Map();const isTpl=lk=>{if(lk.length!==144)return true;if(!tplCache.has(lk))tplCache.set(lk,isTplMask(lk)||canCnt.get(canon(lk))>=3);return tplCache.get(lk)};
 const P=E.map((_,i)=>i),find=i=>P[i]===i?i:(P[i]=find(P[i])),why=new Map();
 const uni=(a,b,r)=>{const x=find(a),y=find(b);if(x!==y)P[x]=y;for(const k of [a,b]){if(!why.has(k))why.set(k,new Set());why.get(k).add(r)}};
 const byJob=new Map();for(const e of E){if(!byJob.has(e.key))byJob.set(e.key,[]);byJob.get(e.key).push(e)}
 const TEN=600e3;
 for(const list of byJob.values()){list.sort((a,b)=>a.ts-b.ts||a.i-b.i);
  // ③ 연달아 몰림(20초 안 간격, 4건 이상)
  let s=0;for(let k=1;k<=list.length;k++){if(k<list.length&&list[k].ts-list[k-1].ts<=20e3)continue;if(k-s>=4)for(let j=s+1;j<k;j++)uni(list[s].i,list[j].i,'burst');s=k}
  for(let a=0;a<list.length;a++)for(let b=a+1;b<list.length&&list[b].ts-list[a].ts<=TEN;b++){const A=list[a],B=list[b];
   // ⑤ 비슷한 아이디
   if(A.id.length>=4&&B.id.length>=4&&ed1(A.id,B.id))uni(A.i,B.i,'typo');
   // ② 같은 그림(틀 아님) + 둘 다 막 친 아이디
   else if(A.look&&A.look===B.look&&!isTpl(A.look)&&A.susp&&B.susp)uni(A.i,B.i,'samepic')}}
 const gm=new Map();for(const e of E){const r=find(e.i);if(!gm.has(r))gm.set(r,[]);gm.get(r).push(e)}
 const RS={burst:'20초 안 연달아 몰림',typo:'아이디 한 글자 차이',samepic:'같은 그림+막 친 아이디'};
 const groups=[...gm.values()].map(m=>{m.sort((a,b)=>a.ts-b.ts||a.i-b.i);const rs=new Set();m.forEach(e=>(why.get(e.i)||[]).forEach(x=>rs.add(x)));const rep=m[m.length-1];
  return{job:rep.job,key:rep.key,rep,members:m,n:m.length,from:m[0],to:rep,reasons:[...rs].map(x=>RS[x]),susp:m.filter(e=>e.susp).length}});
 groups.sort((a,b)=>a.rep.ts-b.rep.ts||a.rep.i-b.rep.i);
 const jobs=new Map();for(const gr of groups){const j=jobs.get(gr.key)||{job:gr.job,key:gr.key,raw:0,ids:0,votes:0};j.votes++;j.ids+=gr.n;jobs.set(gr.key,j)}
 for(const e of raw){const j=jobs.get(e.key);if(j)j.raw++}
 return{raw,entries:E,groups,bundles:groups.filter(g=>g.n>1),jobs:[...jobs.values()],isTpl}}
g.PBF={filter,parseCSV,pbTime,normJob,normId,suspId,SEP};
})(typeof window!=='undefined'?window:globalThis);
