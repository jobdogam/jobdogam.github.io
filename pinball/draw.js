// ================= 그리기 =================
const px=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
function pline(x1,y1,x2,y2,c,t){const n=Math.ceil(Math.hypot(x2-x1,y2-y1)/1.5);g.fillStyle=c;for(let i=0;i<=n;i++){const x=x1+(x2-x1)*i/n,y=y1+(y2-y1)*i/n;g.fillRect(Math.round(x-t/2),Math.round(y-t/2),t,t)}}
function shade(hex,k){if(hex[0]!=='#')return hex;const n=parseInt(hex.slice(1),16);const r=Math.min(255,(n>>16&255)*k),gg=Math.min(255,(n>>8&255)*k),b=Math.min(255,(n&255)*k);return `rgb(${r|0},${gg|0},${b|0})`}
function brickLine(s){const c=s.c,dark=shade(c,.45),lite=shade(c,1.4);const len=Math.hypot(s.x2-s.x1,s.y2-s.y1),n=Math.max(1,Math.round(len/8));
 for(let i=0;i<n;i++){const t0=(i+.5)/n,x=s.x1+(s.x2-s.x1)*t0,y=s.y1+(s.y2-s.y1)*t0;px(x-4,y-3,8,6,dark);px(x-3,y-3,7,5,c);px(x-3,y-3,5,1,lite)}}
function ptext(s,x,y,size,c,al='center',font){g.font=`${size}px ${font||'G11'},monospace`;g.textAlign=al;g.textBaseline='middle';g.fillStyle=P.k;const X=Math.round(x),Y=Math.round(y);for(const [ox,oy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1]])g.fillText(s,X+ox,Y+oy);g.fillStyle=c;g.fillText(s,X,Y)}
const tw=(s,size,font)=>{g.font=`${size}px ${font||'G11'},monospace`;return g.measureText(s).width};
function fitText(s,size,font,maxW){if(tw(s,size,font)<=maxW)return s;while(s.length>1&&tw(s+'…',size,font)>maxW)s=s.slice(0,-1);return s+'…'}
function circ(x,y,r,c){x=Math.round(x);y=Math.round(y);g.fillStyle=c;for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(r*r-dy*dy+r*.8));g.fillRect(x-w,y+dy,w*2+1,1)}}
function ring(x,y,r,c){for(let i=0;i<28;i++){const a=i/28*6.283;px(x+Math.cos(a)*r-1,y+Math.sin(a)*r-1,2,2,c)}}
// 픽셀 아이콘(글꼴에 없는 기호 대신)
function bolt(x,y,c){x=Math.round(x);y=Math.round(y);px(x+2,y,3,1,c);px(x+1,y+1,3,1,c);px(x,y+2,5,1,c);px(x+2,y+3,2,1,c);px(x+1,y+4,2,1,c);px(x,y+5,2,1,c)}
function bombIco(x,y){x=Math.round(x);y=Math.round(y);circ(x,y,4,P.k);circ(x,y,3,'#333');px(x-2,y-2,1,1,P.lg);px(x+2,y-6,2,2,P.dk);px(x+3,y-8,2,2,(Math.floor(VT*12)%2)?P.ye:P.or)}
function camIco(x,y){px(x,y+2,14,9,P.k);px(x+1,y+3,12,7,P.lg);px(x+3,y,5,3,P.k);circ(x+7,y+6,3,P.k);circ(x+7,y+6,1,P.bl)}
// ---- 캐릭터
function drawChar(b,scale=1){if(b.spr){const s=Math.round(14*scale);g.drawImage(b.spr,Math.round(b.x-s/2),Math.round(b.y-s/2),s,s);return}const r=Math.round(b.r*scale),x=Math.round(b.x),y=Math.round(b.y),c=b.c,lk=b.look||{f:0,h:0},f=b.face||1;
 circ(x,y+1,r,P.k);circ(x,y,r,c);circ(x+1,y+1,r-2,shade(c,.82));circ(x-1,y-1,r-3,c);px(x-r+2,y-r+2,2,2,P.wh);
 const e=Math.max(1,Math.round(r*.28)),ex1=x+f-e-1,ex2=x+f+2,ey=y-Math.round(r*.25);
 switch(lk.f){
  case 1: px(ex1,ey+1,e+1,1,P.k);px(ex1+1,ey,e-1||1,1,P.k);px(ex2,ey+1,e+1,1,P.k);px(ex2+1,ey,e-1||1,1,P.k);px(x+f-2,y+2,4,1,P.k);break;
  case 2: px(ex1,ey,e+1,e+1,P.wh);px(ex2,ey,e+1,e+1,P.wh);px(ex1+e,ey+1,1,e,P.k);px(ex2,ey+1,1,e,P.k);px(ex1-1,ey-1,e+2,1,P.k);px(ex2,ey-1,e+2,1,P.k);break;
  case 3: for(const ex of [ex1,ex2]){px(ex,ey,1,1,P.rd);px(ex+2,ey,1,1,P.rd);px(ex,ey+1,3,1,P.rd);px(ex+1,ey+2,1,1,P.rd)}break;
  case 4: px(ex1-1,ey,e*2+5+2,e+1,P.k);px(ex1,ey,e,1,P.la);px(ex2+1,ey,e,1,P.la);break;
  case 5: px(ex1,ey+1,e+1,1,P.k);px(ex2,ey+1,e+1,1,P.k);px(x+f+r-2,ey-3,2,1,P.wh);px(x+f+r-1,ey-5,2,1,P.wh);break;
  default: px(ex1,ey,e+1,e+2,P.wh);px(ex2,ey,e+1,e+2,P.wh);px(ex1+(f>0?e:0),ey+1,1,e,P.k);px(ex2+(f>0?e:0),ey+1,1,e,P.k)}
 const hy=y-r;
 switch(lk.h){
  case 1: px(x-r+1,hy-2,r*2-1,3,P.rd);px(x-r+1+(f>0?r:-3),hy,r+3,2,P.rd);break;
  case 2: px(x+r-4,hy-2,3,3,P.pk);px(x+r-7,hy-3,3,4,P.pk);px(x+r-1,hy-3,3,4,P.pk);break;
  case 3: px(x-r+1,hy-3,3,4,c);px(x+r-3,hy-3,3,4,c);px(x-r+2,hy-2,1,2,P.pk);px(x+r-2,hy-2,1,2,P.pk);break;
  case 4: px(x-r,hy-2,r*2+1,4,P.lg);px(x-r+1,hy-2,r*2-1,1,P.wh);break;
  case 5: px(x-2,hy-8,4,3,P.pu);px(x-4,hy-5,8,3,P.pu);px(x-r,hy-2,r*2+1,2,P.pu);px(x,hy-7,1,1,P.ye);break;
  case 6: px(x,hy-4,1,4,P.gr);px(x-3,hy-5,3,2,P.gr);px(x+1,hy-6,3,2,P.gr);break;
  case 7: px(x-r+1,hy-3,2,3,P.wh);px(x+r-2,hy-3,2,3,P.wh);px(x-r+2,hy-5,1,2,P.wh);px(x+r-2,hy-5,1,2,P.wh);break;
 }}
function crown(x,y){x=Math.round(x);y=Math.round(y);px(x-5,y,11,3,P.ye);px(x-5,y-3,2,3,P.ye);px(x-1,y-4,2,4,P.ye);px(x+3,y-3,2,3,P.ye);px(x-1,y+1,2,1,P.rd)}
// ---- 배경
const BIOME=[[-400,'#04020c','#0a0524'],[560,'#0f0530','#2a0b4a'],[1100,'#0a0a2a','#16224a'],[1600,'#2c8fe0','#a9e2ff'],[2640,'#5b3a21','#2e1c0f'],[3440,'#2a0806','#6a1606'],[4440,'#3a0a04','#160302'],[5200,'#160302','#000']];
function hex2(c){const n=parseInt(c.slice(1),16);return[n>>16&255,n>>8&255,n&255]}
function bgCol(wy){let i=0;while(i<BIOME.length-2&&wy>BIOME[i+1][0])i++;const [y0,a,b]=BIOME[i],y1=BIOME[i+1][0];const t=cl((wy-y0)/(y1-y0),0,1);const A=hex2(a),B=hex2(b),C=hex2(BIOME[i+1][1]);let c=A.map((v,k)=>v+(B[k]-v)*t);const e=cl((wy-(y1-80))/80,0,1);c=c.map((v,k)=>v+(C[k]-v)*e);const q=v=>Math.round(v/12)*12;return `rgb(${q(c[0])},${q(c[1])},${q(c[2])})`}
const W2Sy=sy=>cam.y+(sy-H*.5)/cam.z;
const stars=[];{const r=seedRand(5);for(let i=0;i<170;i++)stars.push({x:r()*W|0,y:r()*H*2|0,l:r()<.2?2:r()<.5?1:0,tw:r()*6.28})}
function drawBG(now){for(let sy=0;sy<H;sy+=4){g.fillStyle=bgCol(W2Sy(sy));g.fillRect(0,sy,W,4)}
 const a=cl((1500-W2Sy(0))/400,0,1);if(a>0){g.globalAlpha=a;for(const s of stars){const y=((s.y-cam.y*(.05+s.l*.08))%(H*2)+H*2)%(H*2),x=((s.x-cam.x*(.03+s.l*.05))%W+W)%W;if(y>H||Math.sin(now*2+s.tw)<-.3)continue;if(s.l===2){px(x,y-1,1,3,P.wh);px(x-1,y,3,1,P.wh)}else px(x,y,1,1,s.l?P.lg:P.la)}g.globalAlpha=1}}
function cloud(x,y,s){px(x,y,40*s,10*s,P.wh);px(x+6*s,y-6*s,16*s,8*s,P.wh);px(x+18*s,y-9*s,14*s,10*s,P.wh);px(x,y+8*s,40*s,3*s,'#cfe9ff')}
function drawDeco(now,v){
 if(v.t<1150&&v.b>500){const gx=600,gy=850,rot=now*.22;for(let i=0;i<300;i++){const arm=i%2,t=(i/300)*4.4,rad=14+t*44;const a=t*1.4+arm*Math.PI+rot;px(gx+Math.cos(a)*rad,gy+Math.sin(a)*rad*.5,2,2,i%3?'#d06cff':'#7fdcff')}circ(gx,gy,9,'#ffe6ff');circ(gx,gy,4,P.wh)}
 if(v.t<1660&&v.b>1080){circ(960,1330,80,P.or);circ(956,1326,70,P.ye);for(let i=0;i<90;i++){const a=i/90*6.28;px(960+Math.cos(a)*160,1330+Math.sin(a)*160*.6,1,1,'rgba(255,241,232,.3)');px(960+Math.cos(a)*300,1330+Math.sin(a)*300*.6,1,1,'rgba(255,241,232,.2)')}}
 if(v.t<2680&&v.b>1580){for(let i=0;i<16;i++){const x=((i*173+now*10*(i%2?1:-1))%1100+1100)%1100-50,y=1680+i*60;cloud(x,y,i%3?1:1.5)}for(let i=0;i<6;i++){const x=((now*35+i*190)%1100)-50,y=1700+i*150+Math.sin(now*3+i)*4;const f=Math.floor(now*6+i)%2;px(x,y,2,1,P.k);px(x+2,y+(f?-1:1),2,1,P.k);px(x+4,y,2,1,P.k)}}
 if(v.t<3480&&v.b>2600){for(let x=0;x<WW;x+=6){px(x,2640,6,4,P.gr);px(x+(x%12?2:0),2644,3,3,P.dg)}const r=seedRand(4);for(let i=0;i<260;i++){const x=r()*WW,y=2650+r()*800;px(x,y,2,2,r()<.06?P.cy:r()<.08?P.pk:'rgba(0,0,0,.25)')}}
 if(v.b>3400){for(const sx of [14,WW-22]){for(let y=Math.max(3460,v.t|0)-((v.t|0)%4);y<Math.min(v.b,GOAL_Y+150);y+=4){const w=6+Math.round(Math.sin(y*.05+now*4)*2);px(sx+(sx<500?0:8-w),y,w,4,((y/4+Math.floor(now*10))%5)?P.or:P.ye)}}
  const r=seedRand(8);for(let i=0;i<120;i++){const x=r()*WW,sp=20+r()*30,y=GOAL_Y+100-((now*sp+r()*1400)%1500);px(x,y,2,2,r()<.5?P.or:P.ye)}
  for(let x=0;x<WW;x+=4){const h=6+Math.round(Math.sin(x*.08+now*3)*3);px(x,GOAL_Y+150-h,4,h+20,P.or);px(x,GOAL_Y+150-h,4,2,P.ye)}}
}
// 보스: 용암 골렘(픽셀)
function drawBoss(now){const B=boss;if(B.dead>=0&&simT-B.dead>2.5)return;const x=Math.round(B.x),y=Math.round(B.y);const lit=simT-B.hit<.1,dead=B.dead>=0;
 const body=lit?P.wh:dead?'#3a2a2a':'#4a2418',crack=lit?P.ye:dead?P.dk:(Math.floor(now*6)%2?P.or:P.ye);
 if(dead){g.globalAlpha=cl(1-(simT-B.dead)/2.5,0,1)}
 px(x-30,y-22,60,48,P.k);px(x-28,y-24,56,48,body);px(x-34,y-10,8,22,P.k);px(x-33,y-9,6,18,body);px(x+26,y-10,8,22,P.k);px(x+27,y-9,6,18,body);// 팔
 px(x-22,y+22,14,8,P.k);px(x+8,y+22,14,8,P.k);// 발
 px(x-26,y-24,52,4,shade('#4a2418',1.6));
 px(x-20,y-6,6,2,crack);px(x-16,y-4,2,8,crack);px(x+10,y+4,8,2,crack);px(x+16,y+6,2,8,crack);px(x-6,y+12,10,2,crack);
 const ang=Math.floor(now*3)%2;px(x-16,y-16,10,6,P.k);px(x+6,y-16,10,6,P.k);px(x-14,y-15,6,4,dead?P.dk:P.rd);px(x+8,y-15,6,4,dead?P.dk:P.rd);px(x-14+(ang?3:0),y-14,2,2,P.ye);px(x+8+(ang?3:0),y-14,2,2,P.ye);
 px(x-12,y-4,24,6,P.k);for(let i=0;i<5;i++)px(x-10+i*5,y-4,3,3,P.wh);px(x-11,y,22,2,P.or);
 px(x-8,y-34,4,10,P.k);px(x+4,y-34,4,10,P.k);px(x-7,y-33,2,8,P.or);px(x+5,y-33,2,8,P.or);// 뿔
 g.globalAlpha=1;
 if(!dead){const w=64,hp=B.hp/B.max;px(x-w/2-1,y-48,w+2,7,P.k);px(x-w/2,y-47,w*hp,5,hp>.5?P.gr:hp>.25?P.or:P.rd);ptext('BOSS',x,y-56,9,P.rd,'center','G11')}}
function drawCourse(now,v){
 const vis=(x,y,m=40)=>x>v.l-m&&x<v.r+m&&y>v.t-m&&y<v.b+m;
 for(const s of segs){if(Math.max(s.y1,s.y2)<v.t-10||Math.min(s.y1,s.y2)>v.b+10||Math.max(s.x1,s.x2)<v.l-10||Math.min(s.x1,s.x2)>v.r+10)continue;
  if(s.kind==='side'){for(let y=Math.max(v.t|0,-300)-((v.t|0)%8);y<v.b;y+=8){const c=y<1600?P.nv:y<2640?'#5aa7e0':y<3440?P.br:'#4a1408';px(s.x1-4,y,8,7,c);px(s.x1-3,y,6,1,y>3440?P.or:shade(c,1.5))}continue}
  if(s.kind==='trap'){if(simT<s.open){pline(s.x1,s.y1,s.x2,s.y2,P.rd,4);for(let x=s.x1;x<s.x2;x+=8)px(x,s.y1-2,4,4,(Math.floor(now*6)%2)?P.ye:P.rd)}continue}
  if(s.kind==='trapdoor'){const tdr=trapd.find(t=>t.s===s);const ph=(simT+tdr.ph)%2.4;if(s.on){brickLine(s);if(ph>2.0&&Math.floor(now*10)%2)pline(s.x1,s.y1-4,s.x2,s.y2-4,P.rd,2)}else{pline(s.x1,s.y1,s.x1+6,s.y1+10,P.rd,3);pline(s.x2,s.y2,s.x2-6,s.y2+10,P.rd,3)}continue}
  if(s.kind==='belt'){const bl=belts.find(q=>q.s===s);pline(s.x1,s.y1+2,s.x2,s.y2+2,'#cfe9ff',8);pline(s.x1,s.y1,s.x2,s.y2,P.wh,6);const len=Math.hypot(s.x2-s.x1,s.y2-s.y1),tx=(s.x2-s.x1)/len,ty=(s.y2-s.y1)/len,dir=Math.sign(tx)*Math.sign(bl.v||1);const off=((now*Math.abs(bl.v))%16+16)%16;for(let d=off;d<len;d+=16){const x=s.x1+tx*d,y=s.y1+ty*d;px(x,y-1,3,2,P.bl);px(x-dir*3,y-2,2,1,P.bl);px(x-dir*3,y+1,2,1,P.bl)}continue}
  brickLine(s)}
 for(const p of pegs){if(!vis(p.x,p.y))continue;const lit=simT-p.hit<.15;if(p.y>3400){px(p.x-4,p.y-3,8,6,P.k);px(p.x-3,p.y-3,6,5,lit?P.ye:'#3a2a2a');continue}const c=lit?P.wh:p.y<1600?P.ye:p.y<2640?P.wh:P.or;px(p.x-1,p.y-3,2,6,c);px(p.x-3,p.y-1,6,2,c);px(p.x-2,p.y-2,4,4,lit?P.ye:shade(c,.8))}
 bumps.forEach((q,qi)=>{if(!vis(q.x,q.y))return;const lit=simT-q.hit<.15;const r=q.r+(lit?2:0);const pl=[[P.bl,P.gr],[P.or,P.br],[P.pe,P.or],[P.rd,P.pu],[P.la,P.lg],[P.cy,P.bl]][qi%6];circ(q.x,q.y+2,r,P.k);circ(q.x,q.y,r,lit?P.wh:pl[0]);circ(q.x+2,q.y+2,r-3,shade(pl[0],.75));if(qi%6===0){px(q.x-6,q.y-4,6,4,P.gr);px(q.x+2,q.y+3,5,3,P.gr)}if(qi%6===2){for(let i=-r-8;i<=r+8;i+=2)px(q.x+i,q.y+i*.25,2,2,P.pe)}px(q.x-r*.5,q.y-r*.5,3,3,P.wh)});
 for(const p of pads){if(!vis(p.x1,p.y1,80))continue;const lit=simT-(p.hit||-9)<.15;if(p.cloud){cloud(p.x1-4,p.y1-6,1.4);px(p.x1+8,p.y1-14,24,3,lit?P.ye:P.gr);continue}pline(p.x1,p.y1,p.x2,p.y2,lit?P.wh:P.gr,5);for(let i=0;i<4;i++){const t=(i+.5)/4;px(p.x1+(p.x2-p.x1)*t-1,p.y1+(p.y2-p.y1)*t+3,2,5,P.dk)}}
 for(const m of mills){if(!vis(m.x,m.y,60))continue;for(let k=0;k<m.arms;k++){const a=m.a+k*Math.PI*2/m.arms;pline(m.x,m.y,m.x+Math.cos(a)*m.len,m.y+Math.sin(a)*m.len,k%2?'#d06cff':P.cy,5)}circ(m.x,m.y,5,P.wh);circ(m.x,m.y,2,P.dk)}
 for(const s of spinners){if(!vis(s.x,s.y,60))continue;const ca=Math.cos(s.a)*s.len/2,sa=Math.sin(s.a)*s.len/2;pline(s.x-ca,s.y-sa,s.x+ca,s.y+sa,P.rd,5);pline(s.x-ca,s.y-sa,s.x+ca,s.y+sa,P.or,2);circ(s.x,s.y,4,P.wh)}
 for(const w of wheels){if(!vis(w.x,w.y,140))continue;for(let k=0;k<w.n;k++){if(w.gaps.includes(k))continue;const a1=w.a+k/w.n*6.283,a2=w.a+(k+1)/w.n*6.283;pline(w.x+Math.cos(a1)*w.r,w.y+Math.sin(a1)*w.r,w.x+Math.cos(a2)*w.r,w.y+Math.sin(a2)*w.r,k%2?'#5a1a0a':P.br,6)}for(let k=0;k<6;k++){const a=w.a+k*1.047;pline(w.x,w.y,w.x+Math.cos(a)*40,w.y+Math.sin(a)*40,P.dk,2)}circ(w.x,w.y,12,P.or);circ(w.x,w.y,6,P.ye)}
 for(const p of pends){if(!vis(p.x,p.y+p.len,140))continue;const x2=p.x+Math.sin(p.ang)*p.len,y2=p.y+Math.cos(p.ang)*p.len;pline(p.x,p.y,x2,y2,P.lg,2);px(p.x-3,p.y-3,6,6,P.dk);px(x2-12,y2-8,24,16,P.k);px(x2-11,y2-9,22,15,'#5a1a0a');px(x2-11,y2-9,22,3,P.or);px(x2-11,y2+3,22,3,P.rd);px(x2-9,y2-5,18,2,P.ye)}
 for(const p of pits){if(!vis((p.x0+p.x1)/2,p.y0,200))continue;for(let x=p.x0-12;x<p.x1+4;x+=4){const h=4+Math.round(Math.sin(x*.1+now*4)*3);px(x,p.y0+40-h,4,p.y1-p.y0,P.or);px(x,p.y0+40-h,4,2,P.ye)}ptext('용암',(p.x0+p.x1)/2,p.y0+70,9,P.ye,'center','G9')}
 for(const q of geys){if(!vis(q.x,q.y))continue;const ph=(simT+q.ph)%3.2,on=ph<.6,warn=ph>2.6;px(q.x-q.w/2,q.y-2,q.w,5,warn&&Math.floor(now*10)%2?P.ye:P.rd);if(on)for(let i=0;i<14;i++)px(q.x-8+((i*37)%16),q.y-6-i*5-((now*200)%10),4+((i*13)%4),4,i%2?P.or:P.ye)}
 for(const q of boosts){if(!vis(q.x,q.y))continue;const o=Math.floor(now*8)%3;for(let i=0;i<3;i++)ptext(q.dir>0?'›':'‹',q.x+(i-1)*6*q.dir,q.y-8,10,i===o?P.ye:P.gr,'center','G11')}
 for(const c of cannons){if(!vis(c.x,c.y))continue;px(c.x-14,c.y-10,28,22,P.k);px(c.x-13,c.y-9,26,20,P.dk);px(c.x-24,c.y-6,12,10,P.dk);px(c.x-25,c.y-5,3,8,P.k);px(c.x-10,c.y+8,8,8,P.k);px(c.x+2,c.y+8,8,8,P.k);ptext('대포',c.x,c.y-18,9,P.ye,'center','G9')}
 for(const h of holes){if(!vis(h.x,h.y,80))continue;const rot=now*(h.fwd?3:-3);for(let i=0;i<40;i++){const t=i/40,rad=h.r+t*h.pull*.7,a=t*9+rot;px(h.x+Math.cos(a)*rad,h.y+Math.sin(a)*rad*.8,2,2,i%3?h.c:P.wh)}circ(h.x,h.y,h.r,P.k);circ(h.x,h.y,h.r-3,h.fwd?P.bl:P.pu);circ(h.x,h.y,Math.max(1,h.r-6),P.k);ptext(h.fwd?'웜홀':'블랙홀',h.x,h.y-h.r-16,9,h.fwd?P.cy:P.pk,'center','G9')}
 for(const q of pipes){if(!vis(q.x,q.y))continue;const c=q.out?P.la:P.cy,d=shade(c,.55),l=shade(c,1.3);
  if(!q.out){px(q.x-q.w/2-2,q.y-6,q.w+4,8,d);px(q.x-q.w/2-1,q.y-6,q.w+2,6,c);px(q.x-q.w/2,q.y-5,3,4,l);px(q.x-q.w/2+2,q.y+2,q.w-4,16,d);px(q.x-q.w/2+3,q.y+2,q.w-6,15,c);px(q.x-q.w/2+3,q.y-4,q.w-6,3,P.k);ptext('?',q.x,q.y-14,9,P.ye,'center','G11')}
  else{px(q.x-q.w/2+2,q.y-16,q.w-4,18,d);px(q.x-q.w/2+3,q.y-16,q.w-6,17,c);px(q.x-q.w/2-2,q.y,q.w+4,8,d);px(q.x-q.w/2-1,q.y+1,q.w+2,6,c);px(q.x-q.w/2+3,q.y+5,q.w-6,3,P.k)}}
 // 아이템 상자
 for(const q of boxes){if(!vis(q.x,q.y))continue;const k=simT-q.t;if(k<2.5){if(k<.4){const s=k/.4;for(let i=0;i<6;i++){const a=i*1.05;px(q.x+Math.cos(a)*s*16-1,q.y+Math.sin(a)*s*16-1,3,3,i%2?P.ye:P.wh)}}continue}
  const y=Math.round(q.y+Math.sin(now*4+q.x)*1.5);px(q.x-7,y-7,14,14,P.k);px(q.x-6,y-6,12,12,P.or);px(q.x-6,y-6,12,2,P.ye);px(q.x-6,y-6,2,12,P.ye);ptext('?',q.x,y+1,9,(Math.floor(now*4)%2)?P.wh:P.ye,'center','G11')}
 // 역전 회오리
 for(const wh of whirls){if(!vis(wh.x,wh.y,80))continue;for(let i=0;i<60;i++){const t=i/60,a=-now*7+t*14,rad=wh.r*(.25+t*.85);px(wh.x+Math.cos(a)*rad,wh.y+Math.sin(a)*rad*.5-(t-.5)*30,2,2,i%4?'rgba(255,241,232,.75)':P.bl)}ptext('역전 회오리',wh.x,wh.y-wh.r-4,9,P.nv,'center','G11')}
 // 피스톤
 for(const p of pistons){if(!vis(500,p.y,60))continue;const bx=p.side<0?funL(p.y):funR(p.y),tip=bx-p.side*p.ext;const x0=Math.min(bx,tip-p.side*0),x1=Math.max(bx,tip);
  for(let x=Math.min(bx,tip);x<Math.max(bx,tip)-4;x+=6)px(x,p.y-3,4,6,P.lg);px(tip-(p.side<0?6:0),p.y-10,6,20,P.k);px(tip-(p.side<0?5:-1),p.y-9,4,18,p.ext>p.max*.9?P.rd:P.lg);
  px(bx-(p.side<0?14:0),p.y-11,14,22,P.k);px(bx-(p.side<0?13:-1),p.y-10,12,20,P.dk);ptext('피스톤',bx-p.side*-2+(p.side<0?-14:14),p.y-20,9,P.lg,'center','G9')}
 for(const m of meteors){if(!vis(m.x,m.y))continue;for(let i=1;i<6;i++)px(m.x-m.vx*.02*i-2,m.y-i*5-2,4,4,i<3?P.or:P.rd);circ(m.x,m.y,m.r,P.br);circ(m.x-2,m.y-2,m.r-4,P.or)}
 if(lightning&&lightning.strike&&simT-lightning.strike.t<.35){const s=lightning.strike;let x=s.x,y=s.y-260;while(y<s.y){const nx=x+(VR()-.5)*24,ny=y+18;pline(x,y,nx,ny,P.ye,3);pline(x,y,nx,ny,P.wh,1);x=nx;y=ny}}
 if(vis(500,WB.cy,80)){const q=wbPos(simT),lit=simT-(WB.hit||-9)<.2,x=Math.round(q.x),y=Math.round(q.y);for(let i=0;i<12;i++){const a=i/12*6.283;px(WB.cx+Math.cos(a)*WB.ax,WB.cy+Math.sin(a)*WB.ay,1,1,'rgba(255,241,232,.35)')}
  const c1=lit?P.wh:P.ye,c2=lit?P.ye:P.or;px(x-2,y-10,5,20,P.k);px(x-10,y-2,20,5,P.k);px(x-6,y-6,13,13,P.k);px(x-1,y-9,3,18,c1);px(x-9,y-1,18,3,c1);px(x-5,y-5,11,11,c1);px(x-3,y-3,7,7,c2);px(x-2,y-4,2,2,P.wh);
  const tw=Math.floor(now*8)%4;if(tw<2){px(x+8,y-9,1,3,P.wh);px(x+7,y-8,3,1,P.wh)}else{px(x-9,y+6,1,3,P.cy);px(x-10,y+7,3,1,P.cy)}}
 if(vis(boss.x,boss.y,120))drawBoss(now);
 for(const e of booms){const k=(simT-e.t)/(e.big?1:.6);if(k<0||k>1)continue;const R0=(e.big?70:50)*EIN(k);for(let i=0;i<24;i++){const a=i/24*6.283+e.t;px(e.x+Math.cos(a)*R0-2,e.y+Math.sin(a)*R0-2,4,4,i%3?P.or:P.ye)}if(k<.3)circ(e.x,e.y,Math.round(R0*.6),k<.15?P.wh:P.ye)}
 // 결승
 if(GOAL_Y>v.t-60&&GOAL_Y<v.b+80){for(let i=0;i<(GATE[1]-GATE[0])/6;i++)for(let j=0;j<2;j++)px(GATE[0]+i*6,GOAL_Y+j*6,6,6,(i+j)%2?P.k:P.wh);ptext(lastMode?'꼴찌가 당첨':'GOAL',500,GOAL_Y+34,14,P.ye,'center','G11');const fx=GATE[1]+8;px(fx,GOAL_Y-40,2,40,P.lg);for(let i=0;i<4;i++)for(let j=0;j<3;j++)px(fx+2+i*4,GOAL_Y-40+j*4+Math.round(Math.sin(now*6+i)),4,4,(i+j)%2?P.k:P.wh)}
}
// 공에 붙은 효과(아이템·거미줄·폭탄)
function drawFx(b,now){const it=b.it&&simT<b.it.until?b.it.k:null,r=b.r;
 if(it==='rocket'){for(let i=1;i<6;i++)px(b.x-b.face*(r+i*3)-2,b.y-2+((i+Math.floor(now*20))%2),4,4,i<3?P.ye:P.or)}
 if(it==='magnet'){const k=(now*2)%1;ring(b.x,b.y,r+4+k*16,k<.5?P.rd:P.bl)}
 if(it==='giant'&&Math.floor(now*6)%2)ring(b.x,b.y,r+3,P.ye);
 if(b.shield)ring(b.x,b.y,r+4,(Math.floor(now*4)%2)?P.cy:P.wh);
 if(simT<b.webT){for(let i=0;i<8;i++){const a=i*.785;pline(b.x,b.y,b.x+Math.cos(a)*(r+8),b.y+Math.sin(a)*(r+8),'rgba(255,241,232,.8)',1)}ring(b.x,b.y,r+5,'rgba(255,241,232,.8)')}
 if(b.bombT){const left=Math.max(0,b.bombT-simT);bombIco(b.x+r+4,b.y-r-4);ptext(String(Math.ceil(left)),b.x+r+12,b.y-r-12,9,left<2?P.rd:P.ye,'center','G11')}}
function frameBox(x,y,w,h,c){px(x,y,w,h,P.k);px(x+2,y+2,w-4,h-4,c);px(x+4,y+4,w-8,h-8,'rgba(0,0,0,.84)')}
function draw(now){
 g.imageSmoothingEnabled=false;g.globalAlpha=1;g.globalCompositeOperation='source-over';drawBG(now);
 g.save();g.translate(W/2,H*.5);g.scale(cam.z,cam.z);g.translate(-cam.x,-cam.y);
 const v={l:cam.x-W*.5/cam.z,r:cam.x+W*.5/cam.z,t:cam.y-H*.5/cam.z,b:cam.y+H*.5/cam.z};
 drawDeco(now,v);drawCourse(now,v);
 const ord=rankOrder(),live=ord.filter(alive);
 const inV=(b,m=20)=>b.x>v.l-m&&b.x<v.r+m&&b.y>v.t-m&&b.y<v.b+m;
 // 탈락한 공: 잠깐 회색으로 가라앉으며 사라짐
 for(const b of balls){if(!b.out)continue;const k=(simT-b.outT)/.9;if(k>1||!inV({x:b.ox,y:b.oy}))continue;g.globalAlpha=1-k;circ(b.ox,b.oy+k*20,MR,P.dk);g.globalAlpha=1;if(k<.6)ptext('탈락',b.ox,b.oy-12-k*10,9,P.rd,'center','G9')}
 const isFocus=b=>focus.b===b&&simT<focus.until;
 for(const b of balls){if(!alive(b)||!inV(b))continue;const i=b.rk-1;const big=(finalT>0&&i<2)||isFocus(b);const sc=(b.r/MR)*(big?1.5:1);if(FIND.b===b){const rr=b.r*sc+5+Math.abs(Math.sin(now*6))*4;ring(b.x,b.y,rr,Math.floor(now*8)%2?P.gr:P.wh);ring(b.x,b.y,rr+2,P.gr)}drawChar(b,sc);drawFx(b,now)}
 // 닉네임: 상위 3명 + 카메라가 비추는 사람만
 const lb=[];if(simT>0)live.forEach((b,i)=>{if(!inV(b,0))return;const big=(finalT>0&&i<2)||isFocus(b)||FIND.b===b;if(i>=3&&!big)return;const fs=11,font='G11';let yy=b.y-(big?b.r*1.5:b.r)-(big?12:9);
  const w=Math.max(tw(b.name,i===0?14:11,'G11'),tw(subl(b),9,'G9'))+4;let tries=0;const hit=()=>lb.some(o=>b.x-w/2<o.x1&&b.x+w/2>o.x0&&yy-28<o.y1&&yy+6>o.y0);while(hit()&&tries<4){yy-=30;tries++}if(hit())return;lb.push({x0:b.x-w/2,x1:b.x+w/2,y0:yy-28,y1:yy+6});if(tries)pline(b.x,b.y-b.r-2,b.x,yy+5,'rgba(255,241,232,.5)',1);
  const sl=subl(b);if(i===0){if(sl)ptext(sl,b.x,yy+1,9,P.wh,'center','G9');ptext(b.name,b.x,yy-12,14,P.ye,'center','G11');crown(b.x,yy-25)}else{if(sl)ptext(sl,b.x,yy+1,9,P.lg,'center','G9');ptext(b.name,b.x,yy-11,11,i===1?P.cy:i===2?P.pk:P.wh,'center','G11')}
  if(isFocus(b)&&focus.kind==='spot'&&i>=3){const t=focus.msg;const w=tw(t,9,'G9')+8;px(b.x-w/2,yy+(big?30:22)+b.r,w,12,P.pu);ptext(t,b.x,yy+(big?36:28)+b.r,9,P.wh,'center','G9')}});
 for(const p of pops){const k=(simT-p.t)/0.9;if(k>1||k<0)continue;ptext(p.s,p.x,p.y-k*14,9,k<.5?P.ye:P.wh,'center','G9')}
 g.restore();
 if(window.noHUD){if(winner&&!window.noEnding)drawEnding(now)}else drawHUD(now,ord,live);
}
const KC={bump:P.ye,light:P.ye,hole:P.pu,back:P.rd,lava:P.or,fwd:P.cy,item:P.gr,bomb:P.rd,web:P.lg,wind:P.bl,boss:P.pk,elim:P.rd,spot:P.la};
function stageBar(live){const y0=H-26;px(0,y0-2,W,28,'rgba(0,0,0,.8)');px(0,y0-2,W,2,P.pu);const cnt=ZONES.map(()=>0);let goal=0;for(const b of balls){if(b.out)continue;if(b.done){goal++;continue}cnt[zoneOf(b.y)]++}
 const lz=live.length?zoneOf(live[0].y):6;const nOut=balls.filter(b=>b.out).length;const cells=ZONES.length+(nOut?1:0),cw=W/cells;
 ZONES.forEach(([_,nm],i)=>{const x=i*cw,on=i===lz;if(on)px(x+1,y0,cw-2,24,P.pu);ptext(nm,x+cw/2,y0+6,9,on?P.ye:P.lg,'center','G9');ptext(String(cnt[i]+(i===6?goal:0)),x+cw/2,y0+17,11,cnt[i]||(i===6&&goal)?P.wh:P.dk,'center','G11');if(i<ZONES.length-1)px(x+cw-1,y0+2,1,20,P.dk)});
 if(nOut){const x=ZONES.length*cw;px(x,y0,cw,24,'#3a0010');ptext('탈락',x+cw/2,y0+6,9,P.rd,'center','G9');ptext(String(nOut),x+cw/2,y0+17,11,P.rd,'center','G11')}}
// 미니맵: 왼쪽 위 세로 전체 맵(구간 색), 점은 1·2·3등 + 카메라가 비추는 공 + 내 직업 공만
function minimap(live){const x0=4,y0=150,h=270,w=12;px(x0-2,y0-2,w+4,h+4,P.k);for(let i=0;i<h;i+=2)px(x0,y0+i,w,2,bgCol(i/h*GOAL_Y));
 ZONES.forEach(([zy])=>{if(zy>0)px(x0,y0+Math.round(zy/GOAL_Y*h),w,1,'rgba(255,241,232,.45)')});
 // 레인 구조: 위 3개 → 가운데 2개 → 아래 1개
 for(const [lx,ya,yb] of [[335,-300,1598],[665,-300,1598],[500,1662,3450]])px(x0+Math.round(lx/WW*w),y0+Math.max(0,Math.round(ya/GOAL_Y*h)),1,Math.round((yb-Math.max(0,ya))/GOAL_Y*h),P.k);px(x0,y0+h-2,w,2,P.ye);
 const vy0=(cam.y-H*.5/cam.z)/GOAL_Y*h,vy1=(cam.y+H*.5/cam.z)/GOAL_Y*h;px(x0-2,y0+cl(vy0,0,h),2,Math.max(2,cl(vy1,0,h)-cl(vy0,0,h)),P.wh);
 const dot=(b,c,big)=>{if(!b||b.out)return;const yy=y0+cl((b.done?GOAL_Y:b.y)/GOAL_Y*h,1,h-2),xx=x0+1+cl(b.x/WW*(w-5),0,w-5);const s=big?5:3;px(xx-1,yy-1-(big?1:0),s+2,s+2,P.k);px(xx,yy-(big?1:0),s,s,c)};
 const fb=focus.b&&simT<focus.until?focus.b:null;dot(fb,P.wh);[live[2],live[1],live[0]].forEach((b,i)=>dot(b,[P.pk,P.cy,P.ye][i]));if(FIND.b&&Math.floor(VT*4)%2===0)dot(FIND.b,P.gr,true)}
function drawHUD(now,ord,live){
 const run=state!=='idle',ended=!!winner;
 px(0,0,W,44,'rgba(0,0,0,.74)');px(0,44,W,2,P.pu);
 ptext('직업도감 이벤트',W/2,9,9,P.lg,'center','G9');ptext('랜덤 핀볼',W/2+2,29,18,P.pu,'center','G14');ptext('랜덤 핀볼',W/2,27,18,P.ye,'center','G14');
 ptext(`${balls.length}명 참가`,W-8,9,9,P.cy,'right','G9');if(balls.some(b=>b.out))ptext(`생존 ${live.length+fin.length}`,W-8,24,9,P.rd,'right','G9');
 if(state==='run'&&simT>0){ptext(`TIME ${Math.min(simT,winner?winT:simT).toFixed(1)}`,8,9,9,P.wh,'left','G9');const fl=leadShow&&VT-leadShow.t<1;ptext(`1위 교체 ${leadN}회`,8,24,9,fl&&Math.floor(now*10)%2?P.wh:P.ye,'left','G9')}
 // 번개 충전 게이지
 if(run&&simT>0&&!ended&&lightning){const k=cl((simT-lightning.last)/(lightning.next-lightning.last),0,1),hot=k>.85,just=lightning.strike&&simT-lightning.strike.t<.9;
  px(0,46,W,14,'rgba(0,0,0,.6)');bolt(8,50,just||hot&&Math.floor(now*8)%2?P.wh:P.ye);ptext(just?'1등 저격!':'충전 중',18,53,9,just?P.rd:hot?P.or:P.ye,'left','G9');
  const bx=66,bw=W-74;px(bx,49,bw,8,P.k);px(bx+1,50,(bw-2)*(just?1:k),6,just?P.wh:hot?(Math.floor(now*8)%2?P.rd:P.or):P.ye);for(let x=bx+bw/8;x<bx+bw-1;x+=bw/8)px(x,50,1,6,'rgba(0,0,0,.5)')}
 // 상단 킬로그
 if(run&&!ended){const y0=finalT>0?94:66;const vis=klog.filter(e=>VT-e.t<3.4).slice(-3);const maxW=finalT>0?W-12:W-140;
  vis.forEach((e,i)=>{const y=y0+i*14,k=VT-e.t,a=k<.15?k/.15:k>3?1-(k-3)/.4:1;g.globalAlpha=cl(a,0,1);const t=fitText(e.msg,9,'G9',maxW-16);const w=tw(t,9,'G9')+14;px(4,y-6,w,13,'rgba(0,0,0,.72)');px(4,y-6,3,13,KC[e.kind]||P.wh);if(e.kind==='light')bolt(9,y-4,P.ye);else if(e.kind==='bomb')px(9,y-2,4,4,P.rd);ptext(t,e.kind==='light'||e.kind==='bomb'?16:10,y,9,P.wh,'left','G9');g.globalAlpha=1})}
 // 순위
 if(run&&!ended&&finalT<0&&simT>0){const n=Math.min(5,ord.length);frameBox(W-122,62,116,20+n*16,P.bl);ptext(lastMode?'꼴찌 순위':'RANK',W-64,72,9,P.lg,'center','G9');const list=lastMode?ord.filter(b=>!b.out).reverse():ord;
  for(let i=0;i<n;i++){const b=list[i];if(!b)break;const y=88+i*16;circ(W-110,y,4,b.c);ptext(`${i+1}`,W-100,y,9,i===0?P.ye:P.wh,'left','G9');ptext(fitText(nick(b),9,'G9',78),W-91,y,9,i===0?P.ye:P.wh,'left','G9')}}
 if(run)stageBar(live);
 if(run&&simT>0&&!ended)minimap(live);
 // 스테이지 배너(한 번에 하나만)
 if(stageShow.i>=0&&simT-stageShow.t<1.8&&!ended&&simT>0){const k=simT-stageShow.t,e=k<.4?EIN(k/.4):k>1.4?1-EOUT((k-1.4)/.4):1;const x=-W+e*W;const st=stages[stageShow.i];frameBox(x+44,196,W-88,28,st.sub?P.or:P.pk);ptext(st.n,x+W/2,210,12,P.wh,'center','G11')}
 if(leadShow&&VT-leadShow.t<1.4&&!ended){const k=VT-leadShow.t,e=k<.2?EIN(k/.2):k>1.1?1-EOUT((k-1.1)/.3):1,s=1+(1-e)*.6;g.save();g.translate(W/2,180);g.scale(s,s);g.globalAlpha=e;const t=fitText(leadShow.b.name,12,'G11',110);frameBox(-88,-13,176,26,P.ye);ptext('NEW 1위!',-44,0,11,(Math.floor(now*10)%2)?P.ye:P.wh,'center','G11');ptext(t,38,0,12,P.wh,'center','G11');g.restore();g.globalAlpha=1}
 // 탈락존 배너
 if(elimShow&&VT>=elimShow.t&&VT-elimShow.t<2&&!ended){const k=VT-elimShow.t,e=k<.3?EIN(k/.3):k>1.6?1-EOUT((k-1.6)/.4):1;g.globalAlpha=e;frameBox(30,236,W-60,44,P.rd);ptext('탈락존!',W/2,250,14,P.ye,'center','G14');ptext(`하위 ${elimShow.k}명 정리 · ${elimShow.left}명 생존`,W/2,268,9,P.wh,'center','G9');g.globalAlpha=1}
 // 카운트다운
 if(state==='run'&&simT<0.6){const c=simT<0?Math.ceil(-simT):0;const k=simT<0?1-((-simT)%1):simT/.6;const s=1+(1-EIN(Math.min(1,k*1.6)))*1.2;g.save();g.translate(W/2,H/2);g.scale(s,s);g.globalAlpha=1-EOUT(cl((k-.6)/.4,0,1));ptext(c?String(c):'GO!',0,0,c?48:40,c?P.wh:P.gr,'center','G14');g.restore()
  if(simT<0){const k=simT+3.4,i=EIN(cl(k/.35,0,1)),o=EOUT(cl((k-3.0)/.4,0,1)),a=i*(1-o);if(a>0){g.save();g.globalAlpha=a;g.translate(-(1-i)*40+o*30,0);
   px(0,150,W,30,'rgba(0,0,0,.88)');ptext(PRACTICE?'연습 경기':(lastMode?'꼴찌 직업이 다음 영상 주인공':'1등 직업이 다음 영상 주인공'),16,165,11,P.wh,'left','G11');
   px(0,182,W,78,'rgba(0,0,0,.72)');ptext(PRACTICE?'예시 직업':`참가 ${INFO.apps}명`,16,206,26,P.wh,'left','G14');ptext(`직업 ${INFO.jobs}개 출전!`,16,240,26,P.ye,'left','G14');g.restore();g.globalAlpha=1}}}
 // FINAL
 if(finalT>0&&!ended){const beat=Math.pow(Math.max(0,Math.sin((simT-finalT)*8)),5);g.fillStyle=`rgba(255,0,77,${.2+.32*beat})`;for(let y=0;y<H-28;y+=4)for(let x=0;x<W;x+=4){const d=Math.min(x,W-x,y,H-28-y);if(d<22&&((x+y)/4)%2===0)g.fillRect(x,y,2,2)}
  const k=EIN(cl((simT-finalT)/.5,0,1));frameBox(W/2-80,62+(1-k)*-70,160,26,P.rd);ptext((Math.floor(now*5)%2?'!! ':'')+'FINAL LAP'+(Math.floor(now*5)%2?' !!':''),W/2,75+(1-k)*-70,12,P.wh,'center','G11');
  if(live.length>=2){const a=lastMode?live[live.length-1]:live[0],b=lastMode?live[live.length-2]:live[1];const gap=Math.abs(Math.round((a.y-b.y)/4));const yb=H-102+(1-k)*110;frameBox(14,yb,W-28,68,P.ye);
   drawChar({x:36,y:yb+22,r:7,c:a.c,look:a.look,spr:a.spr,face:1},1.3);drawChar({x:W-36,y:yb+22,r:7,c:b.c,look:b.look,spr:b.spr,face:-1},1.3);
   ptext('1위',52,yb+22,9,P.ye,'left','G9');ptext(fitText(nick(a),11,'G11',110),24,yb+48,11,P.wh,'left','G11');ptext('2위',W-52,yb+22,9,P.cy,'right','G9');ptext(fitText(nick(b),11,'G11',110),W-24,yb+48,11,P.wh,'right','G11');
   ptext('VS',W/2,yb+22,16,P.pk,'center','G14');ptext(gap<3?'접전!':`${gap}칸 차`,W/2,yb+48,9,gap<3?P.rd:P.lg,'center','G9')}}
 if(winner)drawEnding(now);
}
function cardIn(k){return EIN(cl(k/.45,0,1))}
function drawEnding(now){const tt=VT-winVT,E=ending;
 if(tt<.25){g.fillStyle=`rgba(255,241,232,${1-tt/.25})`;g.fillRect(0,0,W,H)}
 // 포토 피니시
 if(photo&&tt<E.cardIn){const k=tt-.3;if(k>0){drawPhoto(k)}return}
 const r2=seedRand(9);const q=Math.min(tt,3)/3;for(let i=0;i<90;i++){const a=r2()*6.28,sp=40+r2()*260;px(W/2+Math.cos(a)*sp*EIN(q),H*.45+Math.sin(a)*sp*EIN(q)+q*q*120,3,3,[P.ye,P.pk,P.cy,P.gr,P.or][i%5])}
 const t1=tt-E.cardIn;
 if(t1>0&&tt<E.badIn+.3){const e=cardIn(t1),out=E.bad?cl((tt-E.badIn)/.3,0,1):0;g.save();g.translate(W/2-out*W,H*.46);const s=.6+.4*e;g.scale(s,s);g.globalAlpha=e;frameBox(-150,-128,300,256,P.ye);px(-146,-124,292,4,P.pk);
  ptext(lastMode?'꼴찌 당첨!':'WINNER!',0,-100,22,P.ye,'center','G14');drawChar({x:0,y:-50,r:18,c:winner.c,look:winner.look,spr:winner.spr,face:1},winner.spr?2.6:1);crown(0,-78);
  ptext(winner.name,0,0,winner.name.length>7?16:22,P.wh,'center','G14');ptext(winner.n>1?`신청 ${winner.n}명`:(winner.id?`@${maskNick(winner.id)} 님`:'다음 직업 확정!'),0,28,12,P.cy,'center','G11');if(winner.k>1)ptext(`같은 직업 신청 ${winner.k}명`,0,46,9,P.lg,'center','G9');ptext('직업도감이 만들어요!',0,70,12,P.ye,'center','G11');
  ptext(`기록 ${winner.doneT.toFixed(2)}초 · 번개 ${winner.light}번`,0,96,9,P.lg,'center','G9');g.restore();g.globalAlpha=1}
 // 불운상(WINNER 카드 뒤)
 if(E.bad&&tt>E.badIn&&tt<E.badOut+.3){const b=E.bad,e=cardIn(tt-E.badIn),out=cl((tt-E.badOut)/.3,0,1);g.save();g.translate(W/2+(1-e)*W-out*W,H*.46);frameBox(-140,-110,280,220,P.la);
  ptext('불운상',0,-84,22,P.la,'center','G14');ptext('번개·함정을 가장 많이 맞은 사람',0,-62,9,P.lg,'center','G9');
  for(let i=0;i<5;i++)px(-20+i*9,-44+((i*7+Math.floor(now*14))%9),1,4,P.bl);px(-24,-50,48,6,P.dk);px(-18,-54,30,5,P.dk);
  drawChar({x:0,y:-14,r:16,c:b.c,look:b.look,spr:b.spr,face:1},b.spr?2.3:1);
  ptext(b.name,0,24,13,P.wh,'center','G11');ptext(subl(b),0,42,10,P.lg,'center','G9');
  ptext(`번개 ${b.light}번 · 함정 ${b.trap}번`,0,66,11,P.ye,'center','G11');ptext('그래도 끝까지 굴렀다!',0,88,9,P.pk,'center','G9');g.restore()}
 // 엔딩 문구
 if(E.next&&tt>E.nextIn&&tt<E.ctaIn+.3){const e=cardIn(tt-E.nextIn),out=EOUT(cl((tt-E.ctaIn)/.3,0,1));g.globalAlpha=e*(1-out);px(0,0,W,H,'rgba(4,2,12,.9)');g.save();g.globalAlpha=1-out;g.translate(W/2+(1-e)*W,H*.46);
  px(-W/2,-70,W,30,'rgba(0,0,0,.9)');ptext('다음 직업도감은',0,-55,12,P.wh,'center','G11');const nm=winner.name;ptext(nm+'!',0,-6,nm.length>6?24:32,P.ye,'center','G14');
  drawChar({x:-74,y:44,r:9,c:winner.c,look:winner.look,spr:winner.spr,face:1},winner.spr?1.6:1);if(winner.id)ptext(`@${maskNick(winner.id)} 님 신청`,0,90,10,P.lg,'center','G9');
  frameBox(-50,30,120,28,P.ye);ptext('곧 공개',10,44,13,P.ye,'center','G11');g.restore();g.globalAlpha=1}
 if(tt>E.ctaIn){const e=cardIn(tt-E.ctaIn);g.globalAlpha=e;px(0,0,W,H,'rgba(4,2,12,.93)');g.globalAlpha=1;g.save();g.translate(0,(1-e)*40);
  ptext('다음 핀볼 참가자 모집',W/2,170,11,P.cy,'center','G11');
  ptext('댓글로 직업 남기면',W/2,222,22,P.wh,'center','G14');ptext('다음 핀볼에 출전!',W/2,256,22,P.ye,'center','G14');
  ptext('#직업도감_핀볼',W/2,300,12,P.pk,'center','G11');
  const sh=balls.slice(0,8);sh.forEach((b,i)=>{const x=W/2-((sh.length-1)*36)/2+i*36,y=380-Math.abs(Math.sin(now*5+i*.7))*18;drawChar({x,y,r:9,c:b.c,look:b.look,spr:b.spr,face:1},b.spr?1.3:1)});
  px(40,420,W-80,2,P.pu);ptext('직업도감',W/2,446,12,P.lg,'center','G11');g.restore()}
}
function drawPhoto(k){const ph=photo,rn=ph.snap.find(b=>b.run),S=rn?cl(150/(Math.abs(rn.y-GOAL_Y)+24),2,4):4,cx=W/2,cy=rn?360:330;
 px(0,0,W,H,'#2a2218');
 g.save();g.beginPath();g.rect(16,120,W-32,380);g.clip();
 g.translate(cx,cy);g.scale(S,S);g.translate(-500,-GOAL_Y);
 for(let i=0;i<(GATE[1]-GATE[0])/6;i++)for(let j=0;j<2;j++)px(GATE[0]+i*6,GOAL_Y+j*6,6,6,(i+j)%2?P.k:P.wh);
 px(GATE[0]-2,GOAL_Y-60,2,120,P.ye);px(GATE[1],GOAL_Y-60,2,120,P.ye);px(GATE[0]-30,GOAL_Y,GATE[1]-GATE[0]+60,1,P.rd);
 for(const b of ph.snap)if(!b.me)drawChar(b);
 g.restore();
 // 흑백 사진 느낌
 g.save();g.globalCompositeOperation='saturation';px(16,120,W-32,380,'#808080');g.globalCompositeOperation='multiply';px(16,120,W-32,380,'#f2dcb4');g.restore();
 // 판정 후 1등만 컬러로
 g.save();g.beginPath();g.rect(16,120,W-32,380);g.clip();g.translate(cx,cy);g.scale(S,S);g.translate(-500,-GOAL_Y);const me=ph.snap.find(b=>b.me);if(me){if(k<1.2)g.globalCompositeOperation='luminosity';drawChar(me)}g.restore();
 // 사진 틀
 for(const [x,y,w,h] of [[12,116,W-24,4],[12,500,W-24,4],[12,116,4,388],[W-16,116,4,388]])px(x,y,w,h,P.wh);
 camIco(W/2-58,58);ptext('사진 판정',W/2+10,66,18,P.wh,'center','G14');
 if(k<1.2){const dots='.'.repeat(1+Math.floor(k*4)%3);ptext('결승선 확인 중'+dots,W/2,96,11,P.lg,'center','G11')}
 else{const e=EIN(cl((k-1.2)/.3,0,1));if(me){const sx=cx+(me.x-500)*S,sy=cy+(me.y-GOAL_Y)*S;g.globalAlpha=e;ring(sx,sy,34,P.rd);ring(sx,sy,36,P.rd)}g.globalAlpha=1;
  frameBox(30,520,W-60,64,P.ye);ptext(`${nick(ph.a)} 승!`,W/2,540,14,P.ye,'center','G14');ptext(ph.gap?`${ph.gap.toFixed(2)}초 차 간발의 승리`:'간발의 차 승리',W/2,564,10,P.wh,'center','G11');ptext('1등',W/2,96,11,P.ye,'center','G11')}
 if(k<.12){g.fillStyle=`rgba(255,255,255,${1-k/.12})`;g.fillRect(0,0,W,H)}}
// ================= 루프 =================
let lastTs=performance.now(),accF=0;
// 실시간도 1/60초 고정 진행 → 영상 렌더·다시보기와 같은 경기(결정적)
function frame(ts){const dt=Math.min(.25,(ts-lastTs)/1000);lastTs=ts;accF+=dt;let k=0;while(accF>=1/60&&k<15){update(1/60);accF-=1/60;k++}if(k>=15)accF=0;draw(VT);syncFindUI();requestAnimationFrame(frame)}
// ================= 목록 =================
function parseList(text){const seen=new Set(),out=[];for(let line of text.split(/\n/)){line=line.trim();if(!line)continue;const m=line.match(/@([A-Za-z0-9._가-힣]{1,30})/);const id=m?m[1].toLowerCase():'';const lk=(line.match(/#(c\d+f\d+h\d+|p:[0-9a-g]{144})/)||[])[1]||'';const job=line.replace(/@[A-Za-z0-9._가-힣]+/,'').replace(/#(c\d+f\d+h\d+|p:[0-9a-g]{144})/,'').replace(/[,\t|/]+/g,' ').trim().slice(0,12);if(!job)continue;if(id&&seen.has(id))continue;if(id)seen.add(id);out.push({job,id,look:lk})}return out}
function parseCSV(s){const out=[];let row=[],f='',q=false;for(let i=0;i<s.length;i++){const ch=s[i];if(q){if(ch=='"'){if(s[i+1]=='"'){f+='"';i++}else q=false}else f+=ch}else if(ch=='"')q=true;else if(ch==','){row.push(f);f=''}else if(ch=='\n'||ch=='\r'){if(ch=='\r'&&s[i+1]=='\n')i++;row.push(f);out.push(row);row=[];f=''}else f+=ch}if(f||row.length){row.push(f);out.push(row)}return out}
const $=id=>document.getElementById(id),msg=s=>$('msg').textContent=s;
const PB_DEADLINE=Date.UTC(2026,9,27,13,0,59);// 10/27 22:00 KST 마감(사용자 10/27 10:28)
function pbTime(s){const m=String(s||'').match(/(\d+)\.\s*(\d+)\.\s*(\d+)\s*(오전|오후)\s*(\d+):(\d+):?(\d+)?/);if(!m)return 0;let h=+m[5]%12;if(m[4]==='오후')h+=12;return Date.UTC(+m[1],+m[2]-1,+m[3],h-9,+m[6],+(m[7]||0))}
$('load').onclick=async()=>{msg('불러오는 중…');try{const r=await fetch(GVIZ+encodeURIComponent(`select * where D = '${FORM_KIND}'`),{cache:'no-store'});const rows=parseCSV(await r.text()).slice(1);
 // 공통 집계(pbfilter.js): 같은 아이디 마지막 1건 + 의심 묶음은 대표 1명만 공으로
 const F=PBF.filter(rows,{deadline:PB_DEADLINE});const reps=F.groups.map(g=>g.rep);
 $('list').value=reps.map(o=>`${o.job} @${o.id}${o.look?' #p:'+o.look:''}`).join('\n');await loadMade();updInfo(`${F.entries.length}명 신청 중 ${reps.length}명을 불러왔어요`+(F.bundles.length?` (의심 묶음 ${F.bundles.length}개는 1명씩)`:''))}catch(e){msg('불러오지 못했어요. 목록을 직접 붙여 넣어 주세요')}};
function demoText(n=24){const J=['피아니스트','한의사','농구선수','초등교사','플로리스트','제빵사','래퍼','특수교사','외교관','댄서','사육사','수능 출제위원','배드민턴 선수','항공기 정비사','치어리더','음반기획자','골프선수','측량사','네일아티스트','심판','기상캐스터','소방관 꿈나무','웹소설 작가','e스포츠 코치'];const I=Array.from({length:24},(_,i)=>'참가자'+(i+1));const SP=['000000000000009000000900099900009990099999999990999999999990991899991809999999999990999966669999099999999990009999999900000900009000000000000000','00000000000000cc0000cc000c81c00c81c00cccccccccc0cccccccccccccc99999999ccccc999999ccc0cccccccccc000cc0000cc000cc000000cc0000000000000000000000000'];
 const J2=['간호사','경찰관','수의사','건축가','바리스타','프로게이머','성우','큐레이터','조향사','파일럿','셰프','변호사','유튜버','작곡가','마술사','천문학자','소믈리에','웹툰작가','로봇공학자','스턴트맨'];const r=seedRand(n*7+3),A='abcdefghijklmnopqrstuvwxyz';
 const out=[];for(let i=0;i<n;i++){if(i<24)out.push(`${J[i]} @${I[i]}${i<2?' #p:'+SP[i]:''}`);else{let id='';const L=5+Math.floor(r()*5);for(let k=0;k<L;k++)id+=r()<.2?String(Math.floor(r()*10)):A[Math.floor(r()*26)];if(r()<.3)id+=(r()<.5?'_':'.')+Math.floor(r()*99);out.push(`${J2[(i-24)%J2.length]}${i>=44?' '+(Math.floor((i-24)/J2.length)+1)+'호':''} @참가자${i+1}`)}}return out.join('\n')}
$('demo').onclick=()=>{$('list').value=demoText(+(QS.get('n')||24));updInfo()};
// 같은 직업은 공 1개(신청자 수와 상관없이), 이미 만든 직업(../made.json)은 뺌
let MADE=new Set();async function loadMade(){try{const r=await fetch('../made.json?'+Date.now(),{cache:'no-store'});const a=await r.json();MADE=new Set(a.map(normJob))}catch(e){}try{const r=await fetch('../blocked.json?'+Date.now(),{cache:'no-store'});const b=await r.json();b.forEach(x=>MADE.add(normJob(x)))}catch(e){}}
// 신청자 한 명당 공 1개(각자 그린 캐릭터), 이미 만든 직업(../made.json)은 뺌. k = 같은 직업 신청 수
function groupJobs(list){let ex=0;const exJ=new Set(),cnt=new Map(),keep=[];
 for(const e of list){const k=normJob(e.job);if(!k)continue;if(MADE.has(k)){ex++;exJ.add(k);continue}keep.push(e);cnt.set(k,(cnt.get(k)||0)+1)}
 const out=keep.map(e=>({job:e.job,id:e.id||'',n:1,k:cnt.get(normJob(e.job)),ids:e.id?[e.id]:[],look:e.look||''}));
 return{list:out,ex,exJobs:exJ.size,apps:list.length,jobs:cnt.size}}
function updInfo(pre=''){const q=groupJobs(parseList($('list').value));msg((pre?pre+' · ':'')+`참가 ${q.list.length}명(공 ${q.list.length}개) · 직업 ${q.jobs}개`+(q.ex?` · 이미 만든 직업 ${q.exJobs}개(${q.ex}건) 제외`:''));return q}
$('list').addEventListener('input',()=>updInfo());
loadMade();
const ADMIN=QS.get('admin')==='1',OFFLINE=QS.get('offline')==='1';let REPLAY=null;
// 연습 모드 예시 직업(공개 화면 기본)
const PJ=['피아니스트','한의사','농구선수','초등교사','플로리스트','제빵사','래퍼','특수교사','외교관','댄서','사육사','수능 출제위원','배드민턴 선수','항공기 정비사','치어리더','음반기획자','골프선수','측량사','네일아티스트','심판','기상캐스터','소방관','웹소설 작가','e스포츠 코치','간호사','경찰관','수의사','건축가','바리스타','프로게이머','성우','큐레이터','조향사','파일럿','셰프','변호사','유튜버','작곡가','마술사','천문학자','소믈리에','웹툰작가','로봇공학자','스턴트맨','동물조련사','해양생물학자','기관사','버스기사','택배기사','환경미화원','약사','치과의사','물리치료사','영양사','사서','학예사','고고학자','지질학자','기상학자','우주비행사','게임기획자','애니메이터','작가','기자','아나운서','PD','촬영감독','조명감독','음향감독','배우','가수','무용가','지휘자','바이올리니스트','드러머','DJ','패션디자이너','모델','헤어디자이너','메이크업 아티스트','플로리스트 강사','도예가','목수','용접공','전기기사','배관공','정원사','농부','어부','양봉가','제과제빵사','바텐더','호텔리어','여행가이드','통역사','번역가','외교관 비서','검사','판사','법무사','회계사','세무사','은행원','증권분석가','보험설계사','부동산중개사','공인중개사 보조','프로그래머','해커','데이터분석가','인공지능 연구원','로봇 수리공','드론 조종사','자동차 정비사','항해사','등대지기','산림감시원','국립공원 레인저','수영강사','태권도 사범','축구심판','야구선수','e스포츠 해설가'];
function practiceList(n){return PJ.slice(0,Math.min(n,PJ.length)).map((j,i)=>({job:j,n:1,id:'',ids:[],look:''}))}
function curList(){PRACTICE=false;if(REPLAY){INFO={apps:REPLAY.apps||REPLAY.list.reduce((s,e)=>s+(e.n||1),0),jobs:REPLAY.jobs||new Set(REPLAY.list.map(e=>normJob(e.job))).size};return REPLAY.list}if((ADMIN||OFFLINE)&&$('list').value.trim()){const q=groupJobs(parseList($('list').value));INFO={apps:q.list.length,jobs:q.jobs};return q.list}PRACTICE=true;const l=practiceList(+($('pn')&&$('pn').value)||24);INFO={apps:l.length,jobs:l.length};return l}
const ymd=()=>{const d=new Date();return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')};
function startRace(seed){const list=curList();if(list.length<2){msg('직업을 2개 이상 넣어 주세요(이미 만든 직업은 빠져요)');return false}
 if(seed==null)seed=REPLAY?REPLAY.seed:1+Math.floor(Math.random()*2147483000);R=seedRand(seed);VR=seedRand(seed+99);
 if(!AREC){sndOn=$('sound').checked;audioInit()}lastMode=REPLAY?!!REPLAY.last:$('lastMode').checked;tempo=150;START_N=list.length;build();makeBalls(list);simT=-3.4;acc=0;{const sb=START,z=Math.min(1,(W-16)/(sb.w+20),(H*.42)/(sb.h+20));cam={x:500,y:sb.top+sb.h/2-70/z,z}}stageShow={i:-1,t:-9};stageLog=[];timers=[];meteorZone.next=3;state='run';$('panel').style.display='none';
 // 기록(다시보기용): 직업별 공 목록·가린 아이디·캐릭터 코드·시드
 RACE={v:3,date:ymd(),seed,last:lastMode,apps:INFO.apps,jobs:INFO.jobs,list:list.map(e=>({job:e.job,n:e.n||1,k:e.k||1,id:e.id?maskNick(e.id):'',ids:(e.ids||[]).map(maskNick),look:e.look||''}))};
 applyFind();
 const t=aNow();if(t!=null){[0,1,2].forEach(i=>tone(440,t+.4+i,.14,'square',.06));tone(880,t+3.4,.3,'square',.07);later(3.4,musicStart)}return true}
$('start').onclick=()=>startRace();
// 경기 기록 저장(관리 모드)
$('save').onclick=()=>{if(!RACE){msg('먼저 START로 경기를 돌려 주세요');return}if(!RACE.result&&!confirm('경기가 아직 안 끝나서 결과(1·2·3등·불운상)가 빠져요. 그래도 저장할까요?'))return;const bl=new Blob([JSON.stringify(RACE)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=`race_${RACE.date}.json`;document.body.appendChild(a);a.click();a.remove();msg(`race_${RACE.date}.json 저장됨 · 사이트 pinball/races/ 에 올리면 pinball.html?replay=${RACE.date}`)};
// 다시보기
async function loadReplay(d){try{const r=await fetch(`races/race_${d}.json?${Date.now()}`,{cache:'no-store'});if(!r.ok)throw 0;REPLAY=await r.json();if((REPLAY.v|0)<3){REPLAY=null;msg('이 날짜 경기는 다시보기를 지원하지 않아요(예전 기록). 결과는 결과 페이지에서 볼 수 있어요.');return}$('pmode').textContent=`${+d.slice(4,6)}월 ${+d.slice(6)}일 경기 다시보기 · 직업 ${REPLAY.list.length}개`;$('start').textContent='▶ 다시보기 시작';$('practice').style.display='none';msg('')}catch(e){msg('그 날짜 경기 기록을 찾지 못했어요')}}
async function loadRaces(){let ds=[];try{const r=await fetch('races/index.json?'+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;ds=await r.json()}catch(e){try{const a=await (await fetch('https://api.github.com/repos/jobdogam/jobdogam.github.io/contents/pinball/races')).json();ds=Array.isArray(a)?a.map(f=>(String(f.name).match(/^race_(\d{8})\.json$/)||[])[1]).filter(Boolean):[]}catch(e2){}}
 ds=[...new Set(ds.map(String))].filter(d=>/^\d{8}$/.test(d)).sort().reverse().slice(0,10);$('past').innerHTML=ds.length?'지난 경기 다시보기 '+ds.map(d=>`<a href="?replay=${d}">${+d.slice(4,6)}/${+d.slice(6)}</a>`).join(' '):''}
// 내 직업 찾기
function applyFind(){const q=normJob(($('find').value||'').trim());if(!q||!balls.length){FIND.b=null;return}FIND.b=balls.find(b=>normJob(b.name)===q)||balls.find(b=>normJob(b.name).includes(q))||null;FIND.cam=true;if(state==='run')$('fmsg').textContent=FIND.b?'':'그 직업 공이 없어요'}
$('find').addEventListener('input',()=>{$('find2').value=$('find').value;applyFind()});
$('find2').addEventListener('input',()=>{$('find').value=$('find2').value;applyFind()});
$('fclear').onclick=()=>{$('find').value=$('find2').value='';FIND.b=null;$('fbox').hidden=true};
$('fpill').onclick=()=>{$('fbox').hidden=!$('fbox').hidden;if(!$('fbox').hidden)$('find2').focus()};
// 찾기 버튼은 캔버스 오른쪽(순위표 아래)에 붙임
function syncFindUI(){const on=state==='run'&&!winner;const p=$('fpill');p.style.display=on?'block':'none';if(!on){$('fbox').hidden=true;return}const r=cv.getBoundingClientRect(),k=r.width/W;p.style.left=(r.left+(W-80)*k)+'px';p.style.top=(r.top+168*k)+'px';p.style.width=76*k+'px';p.style.height=22*k+'px';p.style.fontSize=Math.max(11,9*k)+'px';p.textContent=FIND.b?(FIND.b.name.length>5?FIND.b.name.slice(0,5)+'…':FIND.b.name):'내 직업 찾기';p.classList.toggle('on',!!FIND.b);
 const bx=$('fbox');bx.style.left=(r.left+(W-206)*k)+'px';bx.style.top=(r.top+194*k)+'px';bx.style.width=202*k+'px'}
// 공개(연습) / 관리 화면 나누기
if(!ADMIN){for(const id of ['list','load','demo','save','adminHelp'])if($(id))$(id).style.display='none'}else{$('practice').style.display='none';$('pmode').textContent='관리 모드: 신청을 불러와 공식 경기를 돌리고, 끝나면 경기 기록을 저장하세요'}
if(QS.get('replay')&&/^\d{8}$/.test(QS.get('replay')))loadReplay(QS.get('replay'));
if(!OFFLINE)loadRaces();
let tapT=0;cv.addEventListener('pointerdown',()=>{const n=Date.now();if(n-tapT<350){state='idle';musicStop();$('panel').style.display='block'}tapT=n});
build();makeBalls([]);
if(QS.get('demo')==='1'&&!OFFLINE){$('list').value=demoText(+(QS.get('n')||24));$('sound').checked=false;$('lastMode').checked=QS.get('last')==='1';startRace(QS.get('seed')?+QS.get('seed'):5)}
if(QS.get('offline')!=='1')requestAnimationFrame(frame);
window.__dbg=()=>{const l=balls.filter(alive);return{VT:+VT.toFixed(2),simT:+simT.toFixed(1),fin:fin.length,n:balls.length,out:balls.filter(b=>b.out).length,winner:winner&&winner.name,maxY:l.length?Math.max(...l.map(b=>b.y|0)):0,minY:l.length?Math.min(...l.map(b=>b.y|0)):0}};
// ================= 오프라인 렌더(프레임 단위 영상 + 오디오) =================
window.__off={
 init(o){AREC=[];sndOn=true;VT=0;REPLAY=o.replay||null;$('list').value=o.text||demoText(o.n||24);$('lastMode').checked=!!o.last;startRace(o.seed||5);return balls.length},
 st(){return{VT:+VT.toFixed(3),simT:+simT.toFixed(2),winVT:+winVT.toFixed(2),end:ending?+(winVT+ending.end).toFixed(2):0,done:!!ending&&VT>=winVT+ending.end,photo:!!photo,boss:boss.dead>=0?+boss.dead.toFixed(1):-1,bossHp:boss.hp,out:balls.filter(b=>b.out).length,fin:fin.length,stages:stageLog,winner:winner&&nick(winner),bad:ending&&ending.bad&&nick(ending.bad),back:balls.filter(b=>b.backUsed).length,klog:klog.length}},
 run(k){for(let i=0;i<k;i++)update(1/60);return this.st()},
 frames(k){const out=[];for(let i=0;i<k;i++){update(1/60);draw(VT);out.push(cv.toDataURL('image/png'))}return out},
 events:()=>AREC.length,
 async audio(dur){const sr=44100,oc=new OfflineAudioContext(1,Math.ceil(sr*dur),sr);const log=AREC;AC=oc;AREC=null;noiseBuf=null;master=oc.createGain();master.gain.value=.9;const comp=oc.createDynamicsCompressor();comp.threshold.value=-10;comp.ratio.value=4;master.connect(comp).connect(oc.destination);sndOn=true;
  for(const e of log){if(e[0]===0){if(e[2]<dur)tone(e[1],e[2],e[3],e[4],e[5],e[6])}else if(e[1]<dur)noise(e[1],e[2],e[3],e[4])}
  const buf=await oc.startRendering();const d=buf.getChannelData(0),n=d.length,ab=new ArrayBuffer(44+n*2),v=new DataView(ab);const ws=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
  ws(0,'RIFF');v.setUint32(4,36+n*2,true);ws(8,'WAVE');ws(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);ws(36,'data');v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++)v.setInt16(44+i*2,Math.max(-1,Math.min(1,d[i]))*32767,true);
  let s='';const u=new Uint8Array(ab);for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s)}
};
