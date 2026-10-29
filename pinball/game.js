'use strict';
// ================= 기본 =================
const FORM_KIND=(window.PB_ROUND||{}).kind||'핀볼이벤트';// 회차별 구분(round.js)
const GVIZ='https://docs.google.com/spreadsheets/d/18XwQDvv-OFtv9NA1V1a9SiSLaR6oFu5gNjZfZsZ7qRg/gviz/tq?gid=470754975&tqx=out:csv&tq=';
const P={k:'#000000',nv:'#1D2B53',pu:'#7E2553',dg:'#008751',br:'#AB5236',dk:'#5F574F',lg:'#C2C3C7',wh:'#FFF1E8',rd:'#FF004D',or:'#FFA300',ye:'#FFEC27',gr:'#00E436',bl:'#29ADFF',la:'#83769C',pk:'#FF77A8',pe:'#FFCCAA',cy:'#3BF0FF'};
const BODY=['#FF004D','#FFA300','#FFEC27','#00E436','#29ADFF','#FF77A8','#B06CFF','#FFCCAA','#FFF1E8','#3BF0FF','#AB5236','#83769C'];
const FACES=['기본','웃음','화남','하트','선글라스','졸림'];
const HATS=['없음','캡모자','리본','고양이귀','헬멧','마법사','새싹','뿔'];
const W=360,H=640,WW=1000,MR=7,GRAV=640;
const GOAL_Y=4820,GATE=[468,532];
const bez=(x1,y1,x2,y2)=>t=>{t=Math.max(0,Math.min(1,t));let a=0,b=1,u=t;for(let i=0;i<22;i++){u=(a+b)/2;const x=3*(1-u)*(1-u)*u*x1+3*(1-u)*u*u*x2+u*u*u;if(x<t)a=u;else b=u}return 3*(1-u)*(1-u)*u*y1+3*(1-u)*u*u*y2+u*u*u};
const EIN=bez(0,0,0,1),EMOVE=bez(.65,0,.35,1),EOUT=bez(.55,0,.9,.45);
const cl=(x,a,b)=>Math.max(a,Math.min(b,x));
const cv=document.getElementById('cv'),g=cv.getContext('2d');g.imageSmoothingEnabled=false;
const QS=new URLSearchParams(location.search);
const seedRand=s=>{s=Math.max(1,s|0);return()=>(s=(s*16807)%2147483647)/2147483647};
let R=Math.random,VR=seedRand(77),CR=seedRand(31); // R=경기(물리 결정), CR=카메라 연출(update 안에서만), VR=그림 전용
// v4(10/27): 경기에 쓰는 삼각함수·거리는 사칙연산+sqrt로 직접 계산 — Math.sin/cos/atan2/hypot은 엔진·버전마다 마지막 자리가 달라 경기가 갈림
const PIO2_1=1.57079632673412561417e+00,PIO2_2=6.07710050630396597660e-11,PIO2_3=2.02226624871116645580e-21,TWO_PI_INV=2/Math.PI;
function trigK(x){const k=Math.round(x*TWO_PI_INV);return[k,((x-k*PIO2_1)-k*PIO2_2)-k*PIO2_3]}
const kSin=r=>{const z=r*r;return r+r*z*(-1.66666666666666324348e-01+z*(8.33333333332248946124e-03+z*(-1.98412698298579493134e-04+z*(2.75573137070700676789e-06+z*(-2.50507602534068634195e-08+z*1.58969099521155010221e-10)))))};
const kCos=r=>{const z=r*r;return 1-.5*z+z*z*(4.16666666666666019037e-02+z*(-1.38888888888741095749e-03+z*(2.48015872894767294178e-05+z*(-2.75573143513906633035e-07+z*(2.08757232129817482790e-09+z*-1.13596475577881948265e-11)))))};
function dsin(x){const [k,r]=trigK(x),q=((k%4)+4)%4;return q===0?kSin(r):q===1?kCos(r):q===2?-kSin(r):-kCos(r)}
function dcos(x){const [k,r]=trigK(x),q=((k%4)+4)%4;return q===0?kCos(r):q===1?-kSin(r):q===2?-kCos(r):kSin(r)}
function datan(x){if(x<0)return -datan(-x);let y=0;if(x>2.414213562373095){y=Math.PI/2;x=-1/x}else if(x>.4142135623730950){y=Math.PI/4;x=(x-1)/(x+1)}
 const z=x*x,p=(((-8.750608600031904122785e-1*z-1.615753718733365076637e1)*z-7.500855792314704667340e1)*z-1.228866684490136173410e2)*z-6.485021904942025371773e1,q=((((z+2.485846490142306297962e1)*z+1.650270098316988542046e2)*z+4.328810604912902668951e2)*z+4.853903996359136964868e2)*z+1.945506571482613964425e2;return y+(x*z*p/q+x)}
function datan2(y,x){if(x>0)return datan(y/x);if(x<0)return datan(y/x)+(y>=0?Math.PI:-Math.PI);return y>0?Math.PI/2:y<0?-Math.PI/2:0}
const dhyp=(a,b)=>Math.sqrt(a*a+b*b);
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);cv.style.width=W*s+'px';cv.style.height=H*s+'px'}addEventListener('resize',fit);fit();

// ================= 8비트 음악·효과음 =================
// VT=영상 시계(초). 오프라인 렌더(AREC)에서는 소리를 기록만 하고 나중에 OfflineAudioContext로 다시 합성
let AC=null,sndOn=true,master=null,musicOn=false,tempo=150,nextNote=0,step16=0,AREC=null,VT=0,timers=[];
const aNow=()=>AREC?VT:AC?AC.currentTime:null;
function audioInit(){if(AREC)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(!master){master=AC.createGain();master.gain.value=.9;const cp=AC.createDynamicsCompressor();cp.threshold.value=-10;cp.ratio.value=8;master.connect(cp).connect(AC.destination)}}catch(e){}}
function tone(f,t,d,type='square',vol=.05,slide=0){if(!sndOn)return;if(AREC){AREC.push([0,f,t,d,type,vol,slide,MTAG]);return}if(!AC)return;const o=AC.createOscillator(),v=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);v.gain.setValueAtTime(vol,t);v.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(v).connect(master);o.start(t);o.stop(t+d+.03)}
let noiseBuf=null;function noise(t,d,vol=.05,hp=4000){if(!sndOn)return;if(AREC){AREC.push([1,t,d,vol,hp,MTAG]);return}if(!AC)return;if(!noiseBuf){noiseBuf=AC.createBuffer(1,AC.sampleRate*.5,AC.sampleRate);const a=noiseBuf.getChannelData(0);const r=seedRand(3);for(let i=0;i<a.length;i++)a[i]=r()*2-1}const s=AC.createBufferSource();s.buffer=noiseBuf;const f=AC.createBiquadFilter();f.type='highpass';f.frequency.value=hp;const v=AC.createGain();v.gain.setValueAtTime(vol,t);v.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(f).connect(v).connect(master);s.start(t);s.stop(t+d+.02)}
const sfx=(f,d=.06,type='square',vol=.05,slide=0)=>{const t=aNow();if(t!=null)tone(f,t,d,type,vol,slide)};
const nz=(d,vol,hp)=>{const t=aNow();if(t!=null)noise(t,d,vol,hp)};
let lastTick=-9;const tick=f=>{if(VT-lastTick>.05){lastTick=VT;sfx(f,.035,'square',.025)}};
function later(s,fn){timers.push({t:VT+s,fn})}
const mid=n=>440*Math.pow(2,(n-69)/12);
// A단조 신나는 진행: Am F C G
const PROG=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]];
const LEAD=[76,79,81,79,76,74,72,74, 72,74,76,79,76,74,72,69, 72,76,79,84,83,79,76,79, 74,79,83,86,83,79,74,71];
let MTAG=0;
function scheduleMusic(){if(!musicOn)return;const now=aNow();if(now==null)return;MTAG=1;
 while(nextNote<now+.12){const spb=60/tempo/4,t=nextNote,s=step16%64,bar=Math.floor(s/16),ch=PROG[bar],beat=s%16;
  if(beat%2===0)tone(mid(ch[0]-12+(beat%4===2?12:0)),t,spb*1.6,'square',.045);
  tone(mid(ch[s%3]+12),t,spb*.9,'triangle',.035);
  if(beat%2===0){const n=LEAD[(Math.floor(s/2))%32];tone(mid(n),t,spb*1.7,'square',finalT>0?.04:.03)}
  if(beat%4===0)tone(150,t,.12,'sine',.18,-110);
  if(beat%8===4)noise(t,.12,.08,1500);
  noise(t,.03,beat%2?.02:.035,7000);
  if(tempo>190&&beat%2===1)noise(t,.02,.03,9000); // 빨라질수록 하이햇 촘촘
  nextNote+=spb;step16++}MTAG=0}
function musicStart(){if(!sndOn||aNow()==null)return;musicOn=true;nextNote=aNow()+.05;step16=0}
function musicStop(){musicOn=false}
function fanfare(){const t=aNow();if(t==null)return;[[72,0],[76,.12],[79,.24],[84,.36],[79,.6],[84,.72],[88,.96]].forEach(([n,d])=>{tone(mid(n),t+d,.28,'square',.07);tone(mid(n-12),t+d,.28,'triangle',.05)})}

// ================= 코스 =================
let segs,pegs,bumps,mills,belts,pipes,pads,wheels,pends,plats,holes,pits,geys,boosts,cannons,spinners,trapd,stages,pops,meteors,boxes,whirls,pistons,booms,boss;
const L=10,RX=WW-10;
// 7구간(하단 순위 바용)
const ZONES=[[0,'우주'],[600,'은하'],[1140,'태양'],[1640,'하늘'],[2650,'땅속'],[3460,'용암'],[4460,'FINAL']];
const zoneOf=y=>{let i=0;for(let k=0;k<ZONES.length;k++)if(y>=ZONES[k][0]-30)i=k;return i};
function S(x1,y1,x2,y2,c,kind){const s={x1,y1,x2,y2,c:c||P.la,kind:kind||'brick',on:true};segs.push(s);return s}
const onSeg=(s,x)=>s.y1+(s.y2-s.y1)*(x-s.x1)/(s.x2-s.x1);
function box(s,x){boxes.push({x,y:onSeg(s,x)-17,t:-9})}
function pegField(x0,x1,y0,rows,dx,dy){for(let r=0;r<rows;r++){const off=r%2?dx/2:0;for(let x=x0+off;x<=x1;x+=dx)pegs.push({x,y:y0+r*dy,r:3.5,hit:-9})}}
// 결승 깔때기 벽의 x
const funL=y=>10+(y-4480)/300*448,funR=y=>990-(y-4480)/300*448;
function build(){
 segs=[];pegs=[];bumps=[];mills=[];belts=[];pipes=[];pads=[];wheels=[];pends=[];plats=[];holes=[];pits=[];geys=[];boosts=[];cannons=[];spinners=[];trapd=[];stages=[];pops=[];meteors=[];boxes=[];whirls=[];pistons=[];booms=[];
 S(L,-300,L,GOAL_Y+200,P.nv,'side');S(RX,-300,RX,GOAL_Y+200,P.nv,'side');
 // ================= 레인: 위 3개(우주~태양계) → 가운데 2개(하늘~땅속) → 아래 1개(용암~FINAL) =================
 const g3=[[10,335],[335,665],[665,990]],g2=[[10,500],[500,990]];
 S(335,-300,335,1598,P.nv);S(665,-300,665,1598,P.nv);S(500,1662,500,3450,P.nv);
 const ramp=(xa,xb,y,dir,drop,c,kind)=>{const gp=46;return dir>0?S(xa,y,xb-gp,y+drop,c,kind):S(xb,y,xa+gp,y+drop,c,kind)};
 const at=(s,f)=>({x:s.x1+(s.x2-s.x1)*f,y:s.y1+(s.y2-s.y1)*f});
 // ---------- 우주 ----------
 stages.push({y:0,n:'STAGE 1 · 우주'});
 // 스타트존: 레인마다 하나(공을 레인 3개에 고르게), 뚜껑·벽으로 막고 바닥은 가운데부터 차례로 열림
 {const n3=Math.ceil(START_N/3);const bx=g3.map(([xa,xb])=>{const sb=startBox(n3,xa,xb);S(sb.x0,sb.top,sb.x0,170,P.la);S(sb.x1,sb.top,sb.x1,170,P.la);S(sb.x0,sb.top,sb.x1,sb.top,P.la);
   const nf=Math.max(3,Math.round(sb.w/24)),fw=sb.w/nf,cx=(sb.x0+sb.x1)/2;for(let i=0;i<nf;i++){const a=sb.x0+i*fw,c=a+fw,f=S(a,170,c,170,P.rd,'trap');f.open=Math.abs((a+c)/2-cx)/(sb.w/2)*sb.openT}return sb});
  const top=Math.min(...bx.map(q=>q.top));START={boxes:bx,x0:bx[0].x0,x1:bx[2].x1,top,w:bx[2].x1-bx[0].x0,h:170-top}}
 const LC=[P.la,P.bl,P.pk];
 g3.forEach(([xa,xb],v)=>{const xc=(xa+xb)/2;let dir=v===1?-1:1;const rows=[];
  pegField(xa+26,xb-26,215,5,36,28);
  for(let k=0;k<11;k++){const y=380+k*112;const s=ramp(xa,xb,y,dir,44,k>=7?P.lg:LC[v]);rows.push(s);
   const T=k===2||k===5?['mill','spin','mill2'][(v+(k===5?1:0))%3]:['boost','hole','','box','worm','','boost','bump','box','bump','box'][k];
   if(T==='boost'){const p=at(s,.45);boosts.push({x:p.x,y:p.y-3,dir})}
   if(T==='hole'){const p=at(s,.62);holes.push({x:p.x,y:p.y-26,r:9,pull:62,to:{x:xc,y:200},msg:'블랙홀! 출발점으로',c:P.pu})}
   if(T==='worm'){const p=at(s,.55);holes.push({x:p.x,y:p.y-24,r:7,pull:30,to:{x:dir>0?xa+40:xb-40,y:380+7*112-30},msg:'웜홀! 태양계로 직행',c:P.cy,fwd:true})}
   if(T==='box'){box(s,at(s,.4).x)}
   if(T==='mill'){const p=at(s,.5);mills.push({x:p.x,y:p.y-34,len:40,a:v,w:-dir*(2.4+v*.2),arms:3})}
   if(T==='mill2'){const p=at(s,.5);mills.push({x:p.x,y:p.y-32,len:38,a:.5,w:-dir*2.8,arms:2})}
   if(T==='spin'){const p=at(s,.5);spinners.push({x:p.x,y:p.y-30,len:80,a:v,w:-dir*2.6})}
   if(T==='bump'){for(const f of [.3,.7]){const p=at(s,f),r=13+((k+v)%3);bumps.push({x:p.x,y:p.y-20-r,r,hit:-9})}}
   dir=-dir}
  // 마지막: 레인 가운데로 모으는 깔때기
  S(xa,1566,xc-22,1596,LC[v]);S(xb,1566,xc+22,1596,LC[v])});
 stages.push({y:600,n:'STAGE 2 · 은하계'});
 stages.push({y:1140,n:'STAGE 3 · 태양계'});
 meteorZone={x0:60,x1:940,y0:1130,y1:1560,next:3};
 // 3 → 2 합류: 가운데 레인은 산 모양으로 반씩 나눔
 S(500,1622,466,1648,P.wh);S(500,1622,534,1648,P.wh);
 // ---------- 하늘(2레인) ----------
 stages.push({y:1640,n:'STAGE 4 · 하늘'});
 g2.forEach(([xa,xb],v)=>{const xc=(xa+xb)/2;let dir=v?1:-1;
  for(let k=0;k<5;k++){const y=1700+k*122;const belt=k===0||k===3;const s=ramp(xa,xb,y,dir,48,P.wh,belt?'belt':'brick');if(belt)belts.push({s,v:250});
   if(k===1){const p=at(s,v?.35:.6);pads.push({x1:p.x-22,y1:p.y-1,x2:p.x+22,y2:p.y+1,kick:[dir*70,-330],cloud:true,name:'구름 점프대!'})}
   if(k===2){const gx=dir>0?xb-23:xa+23;whirls.push({x:gx,y:y+48+52,r:40})}
   if(k===3)box(s,at(s,.45).x);
   if(k===4){const p=at(s,.5);boosts.push({x:p.x,y:p.y-3,dir});pegField(xa+40,xb-40,y+90,3,40,26)}
   dir=-dir}});
 lightning={next:10,last:0};web={next:16};bomb={next:12};
 // ---------- 땅속(2레인) ----------
 stages.push({y:2650,n:'STAGE 5 · 땅속'});
 g2.forEach(([xa,xb],v)=>{const w=xb-xa,xc=(xa+xb)/2;const pX=[xa+w*.2,xa+w*.5,xa+w*.8];
  S(xa,2770,pX[0]-15,2798,P.br);for(let i=0;i<2;i++){const a=pX[i]+15,c=pX[i+1]-15,m=(a+c)/2;S(a,2798,m,2782,P.br);S(m,2782,c,2798,P.br)}S(pX[2]+15,2798,xb,2770,P.br);
  const D=[{fwd:1},{to:{x:xc,y:1700},msg:'되돌이 관! 하늘로',back:true},{to:{x:960,y:3560},msg:'지름길! 용암까지',fwd:true,shortcut:true}];const ord=v?[1,0,2]:[2,0,1];
  pX.forEach((x,i)=>pipes.push({x,y:2798,w:30,q:true,lane:v,...D[ord[i]]}));
  [xa+w*.3,xa+w*.7].forEach(x=>pipes.push({x,y:2900,w:30,out:true,lane:v}));
  // 함정 문 경사
  const dir=v?-1:1,x0=dir>0?xa:xb,x1=dir>0?xb-46:xa+46,y0=3010,y1=3070;for(let i=0;i<5;i++){const a=x0+(x1-x0)*i/5,c=x0+(x1-x0)*(i+1)/5,s=S(a,y0+(y1-y0)*i/5,c,y0+(y1-y0)*(i+1)/5,i%2?P.rd:P.br,i%2?'trapdoor':'brick');if(i%2)trapd.push({s,ph:i*.7+v*.4})}
  {const p=x0+(x1-x0)*.5;boosts.push({x:p,y:y0+(y1-y0)*.5-3,dir})}
  const cx0=dir>0?xa:xb,cx1=dir>0?xb-70:xa+70;S(cx0,3160,cx1,3200,P.br);pipes.push({x:dir>0?cx1-14:cx1+14,y:3199,w:30,to:{x:xc,y:2700},msg:'구덩이! 땅속 입구로',back:true,pit:true,lane:v})});
 stages.push({y:2960,n:'함정 문 주의!',sub:true});
 // ---------- 용암 ----------
 stages.push({y:3460,n:'STAGE 6 · 용암'});
 const r6=S(RX,3585,80,3690,P.dk);box(r6,650);
 geys.push({x:780,y:3607,w:40,ph:0});geys.push({x:520,y:3637,w:40,ph:1.3});geys.push({x:260,y:3666,w:40,ph:2.4});
 pends.push({x:650,y:3480,len:120,amp:1.05,ph:0,sp:2.3});pends.push({x:380,y:3500,len:120,amp:1.05,ph:Math.PI,sp:2.3});
 wheels.push({x:230,y:3850,r:115,a:0,w:1.35,n:18,gaps:[0,1,9,10]});
 const r7=S(L,4040,900,4120,P.dk);box(r7,320);
 spinners.push({x:600,y:4044,len:90,a:0,w:-3.2});
 stages.push({y:4160,n:'용암 다리',sub:true});
 {const xs=[990,820,700,520,400,220,70];for(let i=0;i<xs.length-1;i++){const x1=xs[i],x2=xs[i+1],y1=4230+(990-x1)/920*100,y2=4230+(990-x2)/920*100;const tdoor=i===1||i===3||i===5;const s=S(x1,y1,x2,y2,tdoor?P.or:P.dk,tdoor?'trapdoor':'brick');if(tdoor){trapd.push({s,ph:i*.55});pits.push({x0:Math.min(x1,x2)+12,x1:Math.max(x1,x2)-4,y0:Math.max(y1,y2)+14,y1:Math.max(y1,y2)+140,top:Math.max(y1,y2),to:{x:960,y:3560},msg:'용암 빠짐! 다시'})}}}
 // ---------- FINAL ----------
 stages.push({y:4460,n:'FINAL · 보스전'});
 S(L,4480,GATE[0]-10,GOAL_Y-40,P.ye);S(RX,4480,GATE[1]+10,GOAL_Y-40,P.ye);
 spinners.push({x:500,y:GOAL_Y-120,len:70,a:0,w:-4});
 pistons.push({y:GOAL_Y-88,side:-1,ph:0,max:72});pistons.push({y:GOAL_Y-88,side:1,ph:.8,max:72});
 S(GATE[0],GOAL_Y-40,GATE[0],GOAL_Y+40,P.ye);S(GATE[1],GOAL_Y-40,GATE[1],GOAL_Y+40,P.ye);
 S(L,GOAL_Y+160,RX,GOAL_Y+160,P.nv);
 // 칸 나누기(공 수백~천 개 대비): 세로 32px 칸마다 벽·못 목록
 SB=new Map();PB=new Map();const put=(M,k,o)=>{let a=M.get(k);if(!a)M.set(k,a=[]);a.push(o)};
 // 장치 종류별 세로 범위(공이 그 근처일 때만 검사)
 const yr=(a,f,m)=>{if(!a.length)return[1,0];let lo=1e9,hi=-1e9;for(const o of a){const [y0,y1]=f(o);lo=Math.min(lo,y0);hi=Math.max(hi,y1)}return[lo-m,hi+m]};
 YR={mill:yr(mills,o=>[o.y-o.len,o.y+o.len],30),bump:yr(bumps,o=>[o.y-o.r,o.y+o.r],30),pad:yr(pads,o=>[Math.min(o.y1,o.y2),Math.max(o.y1,o.y2)],30),spin:yr(spinners,o=>[o.y-o.len,o.y+o.len],30),wheel:yr(wheels,o=>[o.y-o.r,o.y+o.r],30),pend:yr(pends,o=>[o.y,o.y+o.len],40),gey:yr(geys,o=>[o.y-70,o.y+10],20),hole:yr(holes,o=>[o.y-o.pull,o.y+o.pull],20),pipe:yr(pipes,o=>[o.y-20,o.y+20],20),pit:yr(pits,o=>[o.y0,o.y1],20),box:[-1e9,1e9],whirl:yr(whirls,o=>[o.y-o.r,o.y+o.r],30),cannon:yr(cannons,o=>[o.y-30,o.y+30],10),boost:yr(boosts,o=>[o.y-20,o.y+20],0)};
 SIDES=segs.filter(q=>q.kind==='side');for(const sg of segs){if(sg.kind==='side')continue;const y0=Math.floor((Math.min(sg.y1,sg.y2)-20)/32),y1=Math.floor((Math.max(sg.y1,sg.y2)+20)/32);for(let k=y0;k<=y1;k++)put(SB,k,sg)}
 for(const p of pegs)for(let k=Math.floor((p.y-20)/32);k<=Math.floor((p.y+20)/32);k++)put(PB,k,p);
 boss={x:200,y:4500,vx:0,vy:0,r:30,hp:16,max:16,hit:-9,dead:-1,land:0};bossMove(0,1/240);boss.vx=boss.vy=0;
}
// 보스: 깔때기 왼쪽 벽을 따라 왔다 갔다, 가끔 점프(그 밑으로 지나갈 수 있음)
function bossPos(t){const x=150+(dsin(t*.8)+1)*95;const wy=4480+(x-10)*300/448;const ph=((t%2.2)+2.2)%2.2;const hop=ph<.85?dsin(ph/.85*Math.PI)*64:0;return{x,y:wy-40-hop,air:ph<.85}}
function bossMove(t,dt){const p=bossPos(t);boss.vx=(p.x-boss.x)/dt;boss.vy=(p.y-boss.y)/dt;boss.x=p.x;boss.y=p.y;if(boss.wasAir&&!p.air&&boss.dead<0&&Math.abs(boss.y-cam.y)<400){sfx(70,.18,'square',.07,-30);boss.land=simT}boss.wasAir=p.air}
// 역풍 범퍼: 골 입구 앞을 작은 원으로 공전(한 바퀴 2초), 공마다 1번만 약하게 튕김
const WB={r:9,cx:500,cy:GOAL_Y-56,ax:16,ay:12};
function wbPos(t){const a=t*Math.PI;return{x:WB.cx+dcos(a)*WB.ax,y:WB.cy+dsin(a)*WB.ay}}
function pistonExt(p,t){const q=((t+p.ph)%1.6+1.6)%1.6;if(q<1.0)return 0;if(q<1.08)return (q-1.0)/.08*p.max;if(q<1.35)return p.max;return p.max*(1-(q-1.35)/.25)}
let START_N=24,START=null;
// 레인 가운데 x(카메라용)
function laneCX(x,y){if(y<1600)return x<335?172:x<665?500:828;if(y<3470)return x<500?255:745;return x}
function laneZ(y){return y<1600?1:y<3470?.74:1}
// 스타트존 크기: 칸 16px·줄 15px 격자에 공 수만큼, 맵 폭 안(최대 56칸)
function startBox(n,xa=10,xb=990){const maxC=Math.floor((xb-xa-40)/16),cols=Math.max(Math.min(8,maxC),Math.min(maxC,Math.round(Math.sqrt(n)*1.4))),rows=Math.ceil(n/cols),w=cols*16+20,h=rows*15+16,cx=(xa+xb)/2;return{cols,rows,x0:cx-w/2,x1:cx+w/2,top:170-h,w,h,openT:Math.max(.35,Math.min(1.6,n/300))}}
let YR={},SB=new Map(),PB=new Map(),SIDES=[],HSTEP=1/240;const NONE=[];
let meteorZone=null,lightning=null,web=null,bomb=null;
// 경기 정보(인트로·결과 기록): PRACTICE=연습 경기, RACE=다시보기·결과 기록
let PRACTICE=false,RACE=null,INFO={apps:0,jobs:0};
// 결과 기록: 사람 기준(직업·가린 아이디), 같은 직업 신청 수 k
const pubB=(b,lk)=>({job:b.name,id:b.id?maskNick(b.id):'',k:b.k||1,...(lk?{look:b.look&&b.look.spr?'p:'+b.look.spr:''}:{})});
function recordResult(){const o=rankOrder().filter(b=>!b.out||true);const top=o.slice(0,20).map((b,i)=>pubB(b,i<3));const bd=ending&&ending.bad;RACE.result={top,winT:+winT.toFixed(2),bad:bd?{...pubB(bd,1),light:bd.light,trap:bd.trap}:null,boss:boss.dead>=0}}
// ================= 공 =================
let balls=[],fin=[],state='idle',simT=0,winner=null,winT=-1,winVT=-1,finalT=-1,lastMode=false,cam={x:500,y:120,z:1};
let leadCur=null,leadCand=null,leadN=0,leadShow=null,lastLeadAnn=-9,focus={b:null,until:0,msg:'',kind:''},nextSpot=6,stageShow={i:-1,t:-9},klog=[],photo=null,ending=null,elimCP=[],elimShow=null,musicCut=false;
function hash(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h}
function parseLook(code,key){const h=hash(key||'x');const sp=(code||'').match(/p:([0-9a-g]{144})/);if(sp)return{c:0,f:0,h:0,spr:sp[1]};const m=(code||'').match(/c(\d+)f(\d+)h(\d+)/);return m?{c:+m[1]%BODY.length,f:+m[2]%FACES.length,h:+m[3]%HATS.length}:{c:h%BODY.length,f:(h>>4)%FACES.length,h:(h>>8)%HATS.length}}
function makeBalls(list){
 balls=list.map((e,i)=>{const lk=parseLook(e.look,maskNick(e.id||'')+normJob(e.job));return{name:e.job,id:e.id||'',n:e.n||1,k:e.k||1,ids:e.ids||(e.id?[e.id]:[]),look:lk,c:lk.spr?sprMain(lk.spr):BODY[lk.c],spr:lk.spr?sprCanvas(lk.spr):null,x:0,y:0,vx:0,vy:0,r:MR,done:false,out:false,rank:0,rk:0,sy:0,st:0,tp:0,face:1,stun:0,light:0,trap:0,backUsed:false,shield:false,it:null,webT:0,bombT:0,wind:null,windDone:-9,spot:0}});
 const idx=balls.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(R()*(i+1)),t=idx[i];idx[i]=idx[j];idx[j]=t} // v3(10/27): R로 Fisher-Yates — 브라우저마다 sort 결과가 달라 다시보기가 어긋나던 문제
const BX=START?START.boxes:[startBox(balls.length)];
 idx.forEach((k,j)=>{const b=balls[k],sb=BX[j%BX.length],q=Math.floor(j/BX.length),r=Math.floor(q/sb.cols),c=q%sb.cols;b.x=sb.x0+10+c*16+(r%2?4:0);b.y=170-9-r*15});
 leadCur=null;leadCand=null;leadN=0;leadShow=null;lastLeadAnn=-9;fin=[];winner=null;winT=-1;winVT=-1;finalT=-1;focus={b:null,until:0,msg:''};nextSpot=6;klog=[];photo=null;ending=null;elimShow=null;musicCut=false;
 const n=balls.length;elimCP=false?[{y:2650,keep:Math.max(30,Math.ceil(n*.5))},{y:3460,keep:Math.max(20,Math.ceil(n*.25))}]:[];
 HSTEP=n>150?1/120:1/240; // 공이 많으면 물리 계산 간격을 2배로(실시간 재생 유지)
 boss.max=boss.hp=n<=30?2:3;
}
// 직접 그린 12x12 캐릭터: 글자 하나가 한 칸(0=빈칸, 1~g=팔레트)
const SPAL=[null,'#000000','#1D2B53','#7E2553','#008751','#AB5236','#5F574F','#C2C3C7','#FFF1E8','#FF004D','#FFA300','#FFEC27','#00E436','#29ADFF','#83769C','#FF77A8','#FFCCAA'];
function sprCanvas(code){const c=document.createElement('canvas');c.width=c.height=14;const o=c.getContext('2d');
 for(const [ox,oy] of [[0,1],[2,1],[1,0],[1,2]])for(let i=0;i<144;i++){const v=parseInt(code[i],17);if(v){o.fillStyle='#000';o.fillRect(i%12+ox,(i/12|0)+oy,1,1)}}
 for(let i=0;i<144;i++){const v=parseInt(code[i],17);if(v){o.fillStyle=SPAL[v];o.fillRect(i%12+1,(i/12|0)+1,1,1)}}return c}
function sprMain(code){const n={};for(const ch of code)if(ch!=='0'&&ch!=='1')n[ch]=(n[ch]||0)+1;const k=Object.keys(n).sort((a,b)=>n[b]-n[a])[0];return k?SPAL[parseInt(k,17)]:'#FFF1E8'}
const nick=b=>b.name;
// 아이디 가리기: 사이트 신청 순위와 같은 방식(앞 2글자 + ***), 이미 가린 값에 다시 써도 그대로
const maskNick=s=>{s=String(s||'').trim();const a=[...s];return a.length<=2?(a[0]||'')+'*':a.slice(0,2).join('')+'***'};
const subl=b=>b.n>1?`신청 ${b.n}명`:(b.id?'@'+maskNick(b.id):'');// (예전 묶음 기록 다시보기는 n>1)
// 내 직업 찾기: 그 공이 반짝이고 카메라가 따라감
const FIND={b:null,cam:true};
// 직업 이름 정규화(사이트 norm과 같게): 공백·괄호·가운뎃점·쉼표·마침표·하이픈 무시, 소문자
const normJob=s=>String(s||'').toLowerCase().replace(/[\s·()・,.\-]/g,'');
const alive=b=>!b.done&&!b.out;
// ================= 물리 =================
function hitSeg(b,x1,y1,x2,y2,vxw,vyw,rest,th){
 const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy;let t=((b.x-x1)*dx+(b.y-y1)*dy)/l2;t=cl(t,0,1);
 const px=x1+dx*t,py=y1+dy*t,ox=b.x-px,oy=b.y-py,d=dhyp(ox,oy),rr=b.r+(th||2);
 if(d<rr&&d>1e-6){const nx=ox/d,ny=oy/d;b.x=px+nx*rr;b.y=py+ny*rr;const rvx=b.vx-(vxw||0),rvy=b.vy-(vyw||0),vn=rvx*nx+rvy*ny;
  if(vn<0){b.vx-=(1+rest)*vn*nx;b.vy-=(1+rest)*vn*ny}return {nx,ny}}
 return null}
// 사건 → 상단 킬로그(+필요하면 카메라 컷)
const CUTK=['light','bomb','boss','lead'];
// 카메라 단계: 초반(넓게+스포트라이트) → 중반(1등+역전 사건 컷) → 막판(1·2등만)
function phase(){if(simT<15.5)return 'early';const l=balls.find(b=>b.rk===1);return (finalT>0||(l&&l.y>LATE_Y))?'late':'mid'}
const LATE_Y=3700;
function event(b,msg,kind,camCut=true){if(winner)return;klog.push({t:VT,msg,kind});if(klog.length>6)klog.shift();
 if(camCut&&CUTK.includes(kind)&&phase()!=='late')focus={b,until:simT+(kind==='lead'?2:2.4),msg,kind};
 if(kind==='back'||kind==='hole')sfx(660,.35,'square',.06,-560);else if(kind==='fwd')sfx(330,.3,'square',.06,900);else if(kind==='lava')sfx(200,.4,'sawtooth',.06,-150);else if(kind==='web')sfx(300,.4,'triangle',.06,-200)}
function teleport(b,to,msg,kind){b.x=to.x+(R()-.5)*14;b.y=to.y+(R()-.5)*6;b.vx=(R()-.5)*60;b.vy=60;b.tp=simT;if(msg){pops.push({x:b.x,y:b.y-16,t:simT,s:msg.split('!')[0]+'!'});event(b,`${nick(b)} ${msg}`,kind)}}
// 방패: 함정 1번 무시
function guard(b,what){if(!b.shield)return false;b.shield=false;pops.push({x:b.x,y:b.y-18,t:simT,s:'방패!'});sfx(1200,.15,'square',.05,-600);event(b,`${nick(b)} 방패로 ${what} 막음!`,'item',false);return true}
// 되돌리기 함정: 공마다 1번까지만
function backTrap(b,to,msg,kind){b.backUsed=true;if(guard(b,msg.split('!')[0])){b.vy=-300;b.vx=(R()-.5)*300;b.tp=simT;return}b.trap++;teleport(b,to,msg,kind)}
const ITEMS={rocket:['로켓!',1.1],shield:['방패!',0],magnet:['자석!',4],giant:['거대화!',5]};
function giveItem(b){const k=['rocket','shield','magnet','giant'][Math.floor(R()*4)];if(k==='shield')b.shield=true;else b.it={k,until:simT+ITEMS[k][1]};pops.push({x:b.x,y:b.y-18,t:simT,s:ITEMS[k][0]});sfx(1046,.07,'square',.05,600);later(.07,()=>sfx(1568,.09,'square',.04));
 if(b.rk<=6||balls.length<=12)event(b,`${nick(b)} 아이템 ${ITEMS[k][0]}`,'item',false)}
function explode(b){booms.push({x:b.x,y:b.y,t:simT});nz(.6,.16,300);sfx(90,.5,'sawtooth',.08,-60);
 for(const c of balls){if(c===b||!alive(c)||c.wind)continue;const dx=c.x-b.x,dy=c.y-b.y,d=dhyp(dx,dy);if(d<95&&d>0){const f=1-d/95;c.vx+=dx/d*560*f;c.vy+=dy/d*480*f-280*f;if(f>.35)c.trap++}}
 if(!guard(b,'폭탄')){b.vy=-460;b.vx=(R()-.5)*520;b.trap++}
 event(b,`쾅! ${nick(b)} 시한폭탄 폭발`,'bomb',false)}
function stepSim(dt){
 simT+=dt;
 const ordS=rankOrder();ordS.forEach((b,i)=>b.rk=i+1);
 for(const m of mills)m.a+=m.w*dt;for(const w of wheels)w.a+=w.w*dt;for(const s of spinners)s.a+=s.w*dt;
 for(const p of pends)p.ang=dsin(simT*p.sp+p.ph)*p.amp;
 for(const t of trapd)t.s.on=((simT+t.ph)%2.4)>.6;
 for(const p of pistons){const e=pistonExt(p,simT);p.v=(e-(p.ext||0))/dt;p.ext=e}
 if(boss.dead<0)bossMove(simT,dt);else{boss.y+=boss.vy*dt;boss.vy+=500*dt}
 // 운석
 if(meteorZone&&simT>meteorZone.next){meteorZone.next=simT+1.6+R()*1.4;meteors.push({x:meteorZone.x0+R()*(meteorZone.x1-meteorZone.x0),y:meteorZone.y0-40,vx:(R()-.5)*80,vy:260,r:9})}
 for(const m of meteors){m.x+=m.vx*dt;m.y+=m.vy*dt;m.vy+=200*dt}
 meteors=meteors.filter(m=>m.y<meteorZone.y1+60);
 if(!winner&&simT>0){
  // 번개: 충전 게이지가 다 차면 1등 저격
  if(simT>lightning.next){lightning.last=simT;lightning.next=simT+6.5+R()*1.5;const tgt=ordS.find(b=>alive(b)&&simT-b.tp>1&&!b.wind);
   if(tgt){lightning.strike={x:tgt.x,y:tgt.y,t:simT};nz(.5,.12,800);sfx(1400,.25,'sawtooth',.05,-1300);
    if(!guard(tgt,'번개')){tgt.vy=-360;tgt.vx=(R()-.5)*420;tgt.stun=simT+.6;tgt.light++;pops.push({x:tgt.x,y:tgt.y-18,t:simT,s:'찌릿!'});event(tgt,`1등 ${nick(tgt)} 번개 맞음!`,'light')}}}
  // 거미줄: 1등 발밑에 3초 감속
  if(simT>web.next&&finalT<0){web.next=simT+13+R()*3;const tgt=ordS.find(b=>alive(b)&&!b.wind&&simT-b.tp>1);if(tgt&&!guard(tgt,'거미줄')){tgt.webT=simT+3;tgt.trap++;pops.push({x:tgt.x,y:tgt.y-18,t:simT,s:'끈적!'});event(tgt,`거미줄! 1등 ${nick(tgt)} 3초 감속`,'web')}}
  // 시한폭탄: 앞쪽 무리 중 한 명에게 붙어 5초 뒤 폭발
  if(simT>bomb.next&&finalT<0){bomb.next=simT+14+R()*3;const pool=ordS.filter(b=>alive(b)&&!b.bombT&&!b.wind).slice(1,10);if(pool.length){const b=pool[Math.floor(R()*pool.length)];b.bombT=simT+5;sfx(880,.1,'square',.05);event(b,`시한폭탄이 ${nick(b)}에게! 5초 뒤 펑`,'bomb',false)}}}
 for(const b of balls)if(b.bombT&&simT>=b.bombT){b.bombT=0;if(alive(b))explode(b)}
 for(const b of balls){if(!alive(b)||simT<0)continue; // 출발 전엔 제자리
  // 역전 회오리: 붙잡혀 빙글빙글(앞 순위일수록 오래)
  if(b.wind){const w=b.wind,wh=whirls[0];w.a+=11*dt;const k=(simT-w.t0)/w.hold;const rad=wh.r*(.8-.45*dsin(Math.min(1,k)*Math.PI));b.x=wh.x+dcos(w.a)*rad;b.y=wh.y+dsin(w.a)*rad*.5-k*6;b.vx=0;b.vy=0;b.face=dcos(w.a)>0?-1:1;
   if(k>=1){b.wind=null;b.windDone=simT;const s=R()<.5?-1:1;b.vx=s*(240+R()*240);b.vy=-150;b.tp=simT;sfx(500,.2,'triangle',.04,-300)}continue}
  const it=b.it&&simT<b.it.until?b.it.k:null;if(b.it&&!it)b.it=null;
  b.r=it==='giant'?MR*1.7:MR;
  if(it==='rocket'){b.vy+=1000*dt;b.vx+=b.face*520*dt}
  b.vy+=GRAV*dt;const sp=dhyp(b.vx,b.vy);if(sp>760){b.vx*=760/sp;b.vy*=760/sp}
  if(simT<b.webT){const k=1-5*dt;b.vx*=k;b.vy*=k}
  b.x+=b.vx*dt;b.y+=b.vy*dt;
  const bk=Math.floor(b.y/32);for(const sd of SIDES)hitSeg(b,sd.x1,sd.y1,sd.x2,sd.y2,0,0,.28,2);for(const s of SB.get(bk)||NONE){if(s.kind==='trap'&&simT>s.open)continue;if(s.kind==='trapdoor'&&!s.on)continue;if(Math.max(s.y1,s.y2)+16<b.y||Math.min(s.y1,s.y2)-16>b.y)continue;if(Math.max(s.x1,s.x2)+16<b.x||Math.min(s.x1,s.x2)-16>b.x)continue;
   const h=hitSeg(b,s.x1,s.y1,s.x2,s.y2,0,0,s.kind==='belt'?.1:.28,2);
   if(h&&s.kind==='belt'){const bl=belts.find(q=>q.s===s);const len=dhyp(s.x2-s.x1,s.y2-s.y1),tx=(s.x2-s.x1)/len,ty=(s.y2-s.y1)/len;const vt=b.vx*tx+b.vy*ty;const dv=(bl.v-vt)*.22;b.vx+=dv*tx;b.vy+=dv*ty}}
  for(const p of PB.get(bk)||NONE){const dx=b.x-p.x,dy=b.y-p.y;if(Math.abs(dx)>16||Math.abs(dy)>16)continue;const d=dhyp(dx,dy),rr=b.r+p.r;if(d<rr&&d>0){const nx=dx/d,ny=dy/d;b.x=p.x+nx*rr;b.y=p.y+ny*rr;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.5*vn*nx;b.vy-=1.5*vn*ny;b.vx+=(nx>=0?1:-1)*(8+R()*22)}if(simT-p.hit>.15)tick(660+((p.x|0)%5)*110);p.hit=simT}}
  if(b.y>YR.bump[0]&&b.y<YR.bump[1])for(const q of bumps){const dx=b.x-q.x,dy=b.y-q.y,d=dhyp(dx,dy),rr=b.r+q.r;if(d<rr&&d>0){const nx=dx/d,ny=dy/d;b.x=q.x+nx*rr;b.y=q.y+ny*rr;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=2.1*vn*nx;b.vy-=2.1*vn*ny;b.vx+=nx*130;b.vy+=ny*130;if(simT-q.hit>.12){pops.push({x:q.x,y:q.y-q.r-6,t:simT,s:'+100'});sfx(880,.07,'square',.05,400)}q.hit=simT}}}
  if(b.y>YR.pad[0]&&b.y<YR.pad[1])for(const p of pads){const h=hitSeg(b,p.x1,p.y1,p.x2,p.y2,0,0,.2,3);if(h&&h.ny<0){b.vy=p.kick[1]-R()*60;b.vx=p.kick[0]+(R()-.5)*60;if(simT-(p.hit||-9)>.3)pops.push({x:(p.x1+p.x2)/2,y:p.y1-22,t:simT,s:p.name});p.hit=simT;sfx(330,.12,'square',.05,700)}}
  if(b.y>YR.mill[0]&&b.y<YR.mill[1])for(const m of mills)for(let k=0;k<m.arms;k++){const a=m.a+k*Math.PI*2/m.arms,x2=m.x+dcos(a)*m.len,y2=m.y+dsin(a)*m.len;if(Math.abs(b.x-m.x)>m.len+14||Math.abs(b.y-m.y)>m.len+14)continue;const dx=x2-m.x,dy=y2-m.y;let t=cl(((b.x-m.x)*dx+(b.y-m.y)*dy)/(dx*dx+dy*dy),0,1);hitSeg(b,m.x,m.y,x2,y2,-m.w*dy*t,m.w*dx*t,.35,3)}
  if(b.y>YR.spin[0]&&b.y<YR.spin[1])for(const s of spinners){const ca=dcos(s.a)*s.len/2,sa=dsin(s.a)*s.len/2;if(Math.abs(b.x-s.x)>s.len||Math.abs(b.y-s.y)>s.len)continue;const x1=s.x-ca,y1=s.y-sa,x2=s.x+ca,y2=s.y+sa;const dx=x2-x1,dy=y2-y1;let t=cl(((b.x-x1)*dx+(b.y-y1)*dy)/(dx*dx+dy*dy),0,1);const px=x1+dx*t-s.x,py=y1+dy*t-s.y;hitSeg(b,x1,y1,x2,y2,-s.w*py,s.w*px,.45,3)}
  if(b.y>YR.wheel[0]&&b.y<YR.wheel[1])for(const w of wheels){if(Math.abs(b.x-w.x)>w.r+16||Math.abs(b.y-w.y)>w.r+16)continue;for(let k=0;k<w.n;k++){if(w.gaps.includes(k))continue;const a1=w.a+k/w.n*6.283,a2=w.a+(k+1)/w.n*6.283;const x1=w.x+dcos(a1)*w.r,y1=w.y+dsin(a1)*w.r,x2=w.x+dcos(a2)*w.r,y2=w.y+dsin(a2)*w.r;const mx=(x1+x2)/2-w.x,my=(y1+y2)/2-w.y;hitSeg(b,x1,y1,x2,y2,-w.w*my,w.w*mx,.3,2)}
   const dx=b.x-w.x,dy=b.y-w.y,d=dhyp(dx,dy);if(d<b.r+12&&d>0){b.x=w.x+dx/d*(b.r+12);b.y=w.y+dy/d*(b.r+12);const vn=b.vx*dx/d+b.vy*dy/d;if(vn<0){b.vx-=1.4*vn*dx/d;b.vy-=1.4*vn*dy/d}}}
  if(b.y>YR.pend[0]&&b.y<YR.pend[1])for(const p of pends){const x2=p.x+dsin(p.ang)*p.len,y2=p.y+dcos(p.ang)*p.len;const om=dcos(simT*p.sp+p.ph)*p.amp*p.sp;const dx=b.x-x2,dy=b.y-y2,d=dhyp(dx,dy);
   if(d<b.r+13&&d>0){const nx=dx/d,ny=dy/d;b.x=x2+nx*(b.r+13);b.y=y2+ny*(b.r+13);const hvx=om*dcos(p.ang)*p.len,hvy=-om*dsin(p.ang)*p.len;const rvx=b.vx-hvx,rvy=b.vy-hvy,vn=rvx*nx+rvy*ny;if(vn<0){b.vx-=1.7*vn*nx;b.vy-=1.7*vn*ny;if(simT-(p.hit||0)>.2){sfx(160,.1,'square',.06,-60);pops.push({x:x2,y:y2-18,t:simT,s:'쾅!'})}p.hit=simT}}}
  // 피스톤(결승선 앞)
  for(const p of pistons){if(Math.abs(b.y-p.y)>24)continue;const bx=p.side<0?funL(p.y):funR(p.y),tip=bx-p.side*p.ext;const x0=Math.min(bx,tip),x1=Math.max(bx,tip);
   hitSeg(b,x0,p.y-9,x1,p.y-9,0,0,.3,2);hitSeg(b,x0,p.y+9,x1,p.y+9,0,0,.3,2);const h=hitSeg(b,tip,p.y-9,tip,p.y+9,-p.side*Math.max(0,p.v),0,.5,2);if(h&&p.v>50&&simT-(p.hit||-9)>.3){p.hit=simT;sfx(140,.12,'square',.06,200);pops.push({x:tip,y:p.y-20,t:simT,s:'퍽!'})}}
  // 역풍 범퍼
  if(!b.bumpUsed&&b.y>WB.cy-40&&b.y<WB.cy+40){const q=wbPos(simT),dx=b.x-q.x,dy=b.y-q.y,d=dhyp(dx,dy);if(d<b.r+WB.r&&d>0){b.bumpUsed=true;const sd=dx>=0?1:-1;b.x=q.x+dx/d*(b.r+WB.r+1);b.y=q.y+dy/d*(b.r+WB.r+1);b.vy=-170;b.vx=sd*110;WB.hit=simT;pops.push({x:q.x,y:q.y-18,t:simT,s:'튕김!'});sfx(660,.14,'sine',.08,320);klog.push({t:VT,msg:`튕김! ${nick(b)}`,kind:'bump'});if(klog.length>6)klog.shift()}}
  // 보스
  if(boss.dead<0){const dx=b.x-boss.x,dy=b.y-boss.y,d=dhyp(dx,dy),rr=b.r+boss.r;if(d<rr&&d>0){const nx=dx/d,ny=dy/d;b.x=boss.x+nx*rr;b.y=boss.y+ny*rr;const rvx=b.vx-boss.vx,rvy=b.vy-boss.vy,vn=rvx*nx+rvy*ny;
   if(vn<0){b.vx-=1.5*vn*nx;b.vy-=1.5*vn*ny;b.vx+=nx*60;b.vy+=ny*60-40;
    if(simT-(b.bossHit||-9)>.3&&vn<-10){b.bossHit=simT;boss.hp--;boss.hit=simT;pops.push({x:boss.x+(R()-.5)*30,y:boss.y-40,t:simT,s:'-1'});sfx(220,.08,'square',.06,-120);
     if(boss.hp<=0){boss.dead=simT;boss.vy=-200;booms.push({x:boss.x,y:boss.y,t:simT,big:1});nz(.9,.18,200);sfx(60,.8,'sawtooth',.09,-30);pops.push({x:boss.x,y:boss.y-50,t:simT,s:'보스 격파!'});event(b,`${nick(b)} 보스 격파!`,'boss')}}}}}
  for(const p of plats){const x=p.x0+dsin(simT*p.sp+p.ph)*p.amp,v=dcos(simT*p.sp+p.ph)*p.amp*p.sp;const h=hitSeg(b,x-p.w/2,p.y,x+p.w/2,p.y,v,0,.25,3);if(h&&h.ny<-.5)b.vx+=(v-b.vx)*.2}
  for(const m of meteors){const dx=b.x-m.x,dy=b.y-m.y,d=dhyp(dx,dy);if(d<b.r+m.r&&d>0){b.vx+=dx/d*380+m.vx;b.vy+=dy/d*300-120;m.y=99999;pops.push({x:b.x,y:b.y-16,t:simT,s:'운석!'});sfx(120,.25,'sawtooth',.06,-80);nz(.25,.08,600)}}
  if(b.y>YR.boost[0]&&b.y<YR.boost[1])for(const q of boosts){if(Math.abs(b.x-q.x)<16&&Math.abs(b.y-q.y)<14){b.vx+=q.dir*900*dt*4;if(simT-(q.hit||0)>.25){sfx(988,.08,'square',.04,500)}q.hit=simT}}
  if(b.y>YR.gey[0]&&b.y<YR.gey[1])for(const q of geys){const on=((simT+q.ph)%3.2)<.6;if(on&&Math.abs(b.x-q.x)<q.w/2&&b.y>q.y-60&&b.y<q.y+6){b.vy=-430;b.vx+=(R()-.5)*120;if(simT-(q.hit||0)>.3){sfx(90,.3,'sawtooth',.05,300);pops.push({x:q.x,y:q.y-40,t:simT,s:'펑!'})}q.hit=simT}}
  // 아이템 상자
  for(const q of boxes){if(simT-q.t<2.5)continue;if(Math.abs(b.x-q.x)<12&&Math.abs(b.y-q.y)<14){q.t=simT;giveItem(b)}}
  // 자석: 주변 공 끌어당김
  if(it==='magnet'){for(const c of balls){if(c===b||!alive(c)||c.wind)continue;const dx=b.x-c.x,dy=b.y-c.y,d=dhyp(dx,dy);if(d<100&&d>b.r+c.r){const f=(1-d/100)*900*dt;c.vx+=dx/d*f;c.vy+=dy/d*f}}}
  // 회오리 진입
  if(b.y>YR.whirl[0]&&b.y<YR.whirl[1])for(const wh of whirls){if(simT-b.windDone>2.5&&dhyp(b.x-wh.x,(b.y-wh.y)*1.6)<wh.r){const hold=b.rk<=3?1.9:b.rk<=8?1.0:.45;b.wind={t0:simT,hold,a:datan2(b.y-wh.y,b.x-wh.x)};sfx(400,.3,'triangle',.04,400);if(b.rk===1)event(b,`역전 회오리! 1등 ${nick(b)} 붙잡힘`,'wind');}}
  // 대포
  if(b.y>YR.cannon[0]&&b.y<YR.cannon[1])for(const c of cannons){if(!b.cann&&simT-b.tp>1&&Math.abs(b.x-c.x)<22&&Math.abs(b.y-c.y)<26){b.cann=simT}}
  if(b.cann){const c=cannons[0];if(simT-b.cann<.35){b.x=c.x;b.y=c.y;b.vx=0;b.vy=0}else{b.vx=-(160+R()*560);b.vy=-260-R()*120;b.cann=0;b.tp=simT;sfx(110,.25,'square',.07,-60);nz(.2,.1,300);pops.push({x:c.x-20,y:c.y-20,t:simT,s:'발사!'})}}
  // 블랙홀·웜홀 (되돌리기는 공마다 1번)
  if(b.y>YR.hole[0]&&b.y<YR.hole[1])for(const hh of holes){if(!hh.fwd&&b.backUsed)continue;const dx=hh.x-b.x,dy=hh.y-b.y,d=dhyp(dx,dy);if(d<hh.pull&&simT-b.tp>1){const f=(1-d/hh.pull)*1600*dt;b.vx+=dx/d*f;b.vy+=dy/d*f;if(d<hh.r+b.r*.5){if(hh.fwd)teleport(b,hh.to,hh.msg,'fwd');else backTrap(b,hh.to,hh.msg,'hole')}}}
  // 관
  if(simT-b.tp>.8&&b.y>YR.pipe[0]&&b.y<YR.pipe[1]){for(const q of pipes){if(q.out)continue;if(Math.abs(b.x-q.x)<q.w/2&&b.y>q.y-10&&b.y<q.y+14){
    const randOut=()=>{const outs=pipes.filter(o=>o.out&&o.lane===q.lane);const o=outs[Math.floor(R()*outs.length)];b.x=o.x+(R()-.5)*6;b.y=o.y+16;b.vx=(R()-.5)*60;b.vy=120;b.tp=simT;sfx(220,.18,'square',.05,900)};
    if(q.back){if(b.backUsed){if(q.q)randOut();else continue}else backTrap(b,q.to,q.msg,'back')}
    else if(q.fwd&&!q.to)randOut();
    else teleport(b,q.to,q.msg,'fwd');break}}}
  if(b.y>YR.pit[0]&&b.y<YR.pit[1])for(const p of pits){if(b.x>p.x0&&b.x<p.x1&&b.y>p.y0&&b.y<p.y1&&simT-b.tp>.5){
   if(b.backUsed){b.x=p.x0-14;b.y=p.top-14;b.vx=-120;b.vy=-160;b.tp=simT;pops.push({x:b.x,y:b.y-16,t:simT,s:'휴! 탈출'})}else backTrap(b,p.to,p.msg,'lava')}}
  // 결승
  if(simT>0&&b.y>GOAL_Y&&b.x>GATE[0]&&b.x<GATE[1]){b.done=true;b.doneT=simT;fin.push(b);b.rank=fin.length;onFinish(b)}
  // 끼임
  if(simT>0){b.st+=dt;if(b.st>1.3){if(dhyp(b.y-b.sy,b.x-(b.sx||0))<10){b.vx+=(R()-.5)*260;b.vy-=200}b.sy=b.y;b.sx=b.x;b.st=0}}
  if(b.y>GOAL_Y+150){b.y=GOAL_Y-200;b.x=500;b.vx=0;b.vy=0}
  if(b.x<L||b.x>RX){b.x=cl(b.x,L+10,RX-10)}
  if(Math.abs(b.vx)>8)b.face=b.vx>0?1:-1;
 }
 const BB=simT<0?[]:balls.filter(b=>alive(b)&&!b.wind).sort((a,c)=>a.y-c.y);for(let i=0;i<BB.length;i++){const a=BB[i];for(let k=i+1;k<BB.length;k++){const c=BB[k];const dy=c.y-a.y;if(dy>26)break;const dx=c.x-a.x;if(Math.abs(dx)>26)continue;const d=dhyp(dx,dy),rr=a.r+c.r;if(d<rr&&d>0){const ma=a.r*a.r,mc=c.r*c.r,wa=mc/(ma+mc),wc=ma/(ma+mc);const nx=dx/d,ny=dy/d,o=(rr-d);a.x-=nx*o*wa;a.y-=ny*o*wa;c.x+=nx*o*wc;c.y+=ny*o*wc;const rv=(c.vx-a.vx)*nx+(c.vy-a.vy)*ny;if(rv<0){const j=-1.5*rv;a.vx-=j*wa*nx;a.vy-=j*wa*ny;c.vx+=j*wc*nx;c.vy+=j*wc*ny}}}}
}
function onFinish(b){
 if(photo&&!photo.gap&&b===photo.c)photo.gap=Math.max(.01,b.doneT-winner.doneT);
 const need=lastMode?balls.filter(x=>!x.out).length:1;
 if(!winner&&fin.length===need){winner=b;winT=simT;winVT=VT;musicStop();sfx(1568,.4,'square',.07);
  // 포토 피니시: 2등이 바로 뒤에 붙어 있으면 사진 판정 컷
  if(!lastMode&&!window.noPhoto){const run=rankOrder().find(c=>alive(c));if(run&&(GOAL_Y-run.y<60||QS.get('photo')==='1')&&Math.abs(run.x-500)<90){photo={t0:VT,a:b,c:run,gap:0,snap:balls.filter(c=>(alive(c)||c===b)&&Math.abs(c.x-500)<90&&Math.abs(c.y-GOAL_Y)<60).map(c=>({x:c.x,y:c.y,r:MR,c:c.c,look:c.look,spr:c.spr,face:c.face,me:c===b,run:c===run}))};
   later(.25,()=>{nz(.08,.12,5000);sfx(2400,.04,'square',.05)})}}
  const cardIn=photo?2.9:.7;
  // 불운상: 번개·함정 최다 피격자
  let bad=null;for(const c of balls){const h=c.light+c.trap;if(h>0&&(!bad||h>bad.light+bad.trap||(h===bad.light+bad.trap&&bad===b)))bad=c}
  // 우승 카드 → 불운상 → (공식 경기만) 다음 직업 예고 → 엔딩 문구
  const nx=!PRACTICE&&!lastMode;const badIn=cardIn+2.9,nextIn=badIn+(bad?2.2:0),ctaIn=nextIn+(nx?2.4:0);ending={cardIn,bad,badIn,badOut:nx?nextIn:ctaIn,next:nx,nextIn,ctaIn,end:ctaIn+2.5};
  later(cardIn-.4,fanfare);if(bad)later(badIn,()=>{sfx(220,.25,'triangle',.06,-110);later(.25,()=>sfx(165,.4,'triangle',.06,-80))});later(ctaIn,()=>{sfx(784,.1,'square',.05);later(.12,()=>sfx(1046,.16,'square',.05))})}
 else sfx(988,.06,'square',.04)}
// 진행도: 높이(골인한 공은 맨 앞, 탈락한 공은 맨 뒤)
function prog(b){return b.done?1e6-b.rank:b.out?-1e6:b.y}
function rankOrder(){return balls.slice().sort((a,c)=>prog(c)-prog(a))}

// ================= 감독(연출)·카메라 =================
let slow=1,acc=0,stageLog=[];const SPD=1.35,REC_T=1.2; // 전체 진행 속도(1분 안팎 맞춤)
function update(dt){
 VT+=dt;
 if(timers.length){const due=timers.filter(t=>t.t<=VT);if(due.length){timers=timers.filter(t=>t.t>VT);due.forEach(t=>t.fn())}}
 scheduleMusic();
 if(state!=='run')return;
 const ord=rankOrder(),live=ord.filter(alive);
 if(!winner&&simT>0&&live.length){const ly=live[0].y;let si=0;for(let i=0;i<stages.length;i++)if(ly>stages[i].y-30)si=i;if(si!==stageShow.i&&si>stageShow.i){stageShow={i:si,t:simT};stageLog.push([si,+VT.toFixed(2)]);sfx(784,.08,'square',.05,200)}
  if(finalT<0&&!lastMode&&ly>4440){finalT=simT;sfx(440,.25,'square',.06,440)}
  if(finalT<0&&lastMode&&live.length<=2&&fin.length>0){finalT=simT;tempo=185}
  // 결승 10초 전부터 음악이 빨라지다가 결승선 바로 앞에서 뚝(정적)
  if(!lastMode){if(!musicCut)tempo=150+75*cl((ly-3900)/(GOAL_Y-60-3900),0,1);if(!musicCut&&ly>GOAL_Y-62&&live[0].x>GATE[0]-30&&live[0].x<GATE[1]+30){musicCut=true;musicStop();sfx(55,.5,'sine',.12,-20)}}
  // 탈락존: 참가자 많을 때 하위권 정리(꼴찌 당첨 모드에선 끔)
  for(const cp of elimCP){if(!cp.done&&ly>cp.y){cp.done=true;const cut=live.slice(cp.keep);if(cut.length){cut.forEach(b=>{b.out=true;b.outT=simT;b.ox=b.x;b.oy=b.y});elimShow={t:VT+1.6,k:cut.length,left:live.length-cut.length};klog.push({t:VT,msg:`탈락존! 하위 ${cut.length}명 탈락 · ${live.length-cut.length}명 생존`,kind:'elim'});nz(.4,.1,900);sfx(300,.4,'square',.06,-250)}}}
  // 스포트라이트: 1등만 보지 않고 골고루(덜 비춘 사람 먼저)
  const ph=phase();
  // 1등 교체: 0.4초 이상 유지되면 'NEW 1위!'
  const L1=live[0];if(!leadCur){if(simT>2)leadCur=L1}else if(L1!==leadCur){if(!leadCand||leadCand.b!==L1)leadCand={b:L1,t:simT};else if(simT-leadCand.t>.7&&simT-lastLeadAnn>2){leadCur=L1;leadCand=null;leadN++;lastLeadAnn=simT;leadShow={t:VT,b:L1};sfx(1046,.07,'square',.05);later(.08,()=>sfx(1318,.07,'square',.05));later(.16,()=>sfx(1568,.12,'square',.05));event(L1,`NEW 1위! ${nick(L1)}`,'lead')}}else leadCand=null;
  // 초반: 참가자를 짧게 하나씩 스포트라이트(덜 비춘 사람 먼저)
  if(ph==='early'&&simT>1&&simT>nextSpot&&simT>focus.until){nextSpot=simT+2.1;const pool=live.slice(1).filter(b=>!b.wind);if(pool.length){const mn=Math.min(...pool.map(b=>b.spot));const pp=pool.filter(b=>b.spot===mn);const b=pp[Math.floor(CR()*pp.length)];b.spot++;focus={b,until:simT+1.5,msg:`${nick(b)} 지금 ${live.indexOf(b)+1}등`,kind:'spot'}}}
  // 폭탄 터지기 직전 컷
  if(ph!=='late'){const bb=live.find(b=>b.bombT&&b.bombT-simT<1.5&&b.bombT-simT>0);if(bb&&(focus.b!==bb||focus.kind!=='bomb')&&(focus.kind==='spot'||simT>focus.until))focus={b:bb,until:bb.bombT+.7,msg:'',kind:'bomb'}}}
 if(winner){const tt=VT-winVT;slow=tt<1.6?.15+.85*EIN(tt/1.6):1}
 else if(finalT>0)slow=live.length&&live[0].y>GOAL_Y-170?.5:1;
 else if(focus.b&&simT<focus.until&&(focus.kind==='light'||focus.kind==='boss'))slow=.6;else slow=1;
 if(ending&&VT-winVT>REC_T&&RACE&&!RACE.result)recordResult(); // 결과(2·3등…)는 우승 뒤 고정 시점에 기록 — 포토 피니시 연출(noPhoto·?photo=1)과 무관
 if(ending&&VT-winVT>ending.cardIn+.5)slow=0; // 카드가 뜨면 물리 멈춤
 acc+=dt*slow*(simT<0?1:SPD);const h=HSTEP;let n=0;while(acc>=h&&n<24){stepSim(h);acc-=h;n++}
 let tx=cam.x,ty=cam.y,tz=1;
 if(simT<0){const sb=START;tz=Math.min(1,(W-16)/(sb.w+20),(H*.42)/(sb.h+20));tx=500;ty=sb.top+sb.h/2-(70/tz)} // 스타트존 전체가 화면 아래쪽에
 else if(winner){tx=500;ty=GOAL_Y-20;tz=1.5}
 else if(!live.length){ty=GOAL_Y}
 else if(phase()==='late'){const a=lastMode?live[live.length-1]:live[0],b=lastMode?(live[live.length-2]||a):(live[1]||a);ty=a.y*.6+b.y*.4;tx=a.x*.6+b.x*.4;tz=1.45;if(!lastMode&&boss.dead<0&&Math.abs(a.y-boss.y)<160){tx=a.x*.5+boss.x*.5;ty=a.y*.5+boss.y*.5;tz=1.3}}
 else if(focus.b&&simT<focus.until&&alive(focus.b)){tx=focus.b.x;ty=focus.b.y;tz=1.25}
 else if(phase()==='early'){const a=live[0];tx=laneCX(a.x,a.y);ty=a.y+40;tz=laneZ(a.y)*.92}
 else{const a=live[0],b=live[Math.min(2,live.length-1)];const cx=laneCX(a.x,a.y);tx=a.y<3470?cx:a.x*.7+b.x*.3;ty=a.y*.85+(laneCX(b.x,b.y)===cx?b.y:a.y)*.15+30;tz=laneZ(a.y)}
 if(FIND.b&&FIND.cam&&!winner&&simT>0&&alive(FIND.b)){tx=FIND.b.x;ty=FIND.b.y;tz=1.3}
 if(window.camF&&!winner&&simT>-1){const c=window.camF;if(alive(c)){tx=c.x;ty=c.y;tz=c.z||1.3}}
 const hw=W*.5/tz;tx=cl(tx,hw,WW-hw);ty=cl(ty,simT<0?-400:120,GOAL_Y+60);
 const f=Math.min(1,dt*(phase()==='late'?4:3.2));cam.x+=(tx-cam.x)*f;cam.y+=(ty-cam.y)*f;cam.z+=(tz-cam.z)*Math.min(1,dt*2.5);
}
