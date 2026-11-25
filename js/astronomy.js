/* =====================================================================
   PhysiDraw — Astronomy module (Phase 4a): categories and vector assets
   (solar system, structure of the Sun and Earth, stars and their life
   cycle, galaxies, H–R diagram, telescopes and spacecraft).
   Flat SVG only (no gradients) so monochrome mode and export stay exact.
   ===================================================================== */
"use strict";
(function(){
if(typeof CATS==='undefined')return;
[['astro_sol','ระบบสุริยะ','Solar system'],['astro_struct','โครงสร้างดวงอาทิตย์และโลก','Sun & Earth structure'],
 ['astro_sky','ทรงกลมท้องฟ้าและปรากฏการณ์','Celestial sphere & phenomena'],['astro_star','ดาวฤกษ์และกาแล็กซี','Stars & galaxies'],
 ['astro_inst','กล้องโทรทรรศน์และอวกาศ','Telescopes & spaceflight']].forEach(c=>{CATS.push(c);CAT_SUBJ[c[0]]='astro';});

const f=n=>Math.round(n*100)/100;
const P=(d,fill,st,sw=1.2,x='')=>`<path d="${d}" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"${x}/>`;
const E=(cx,cy,rx,ry,fill,st='none',sw=1.2,x='')=>`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${x}/>`;
const C=(cx,cy,r,fill,st='none',sw=1.2,x='')=>`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${x}/>`;
const L=(d,st,sw=1.2,x='')=>`<path d="${d}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${x}/>`;
const G=(x,y,a,s,inner)=>`<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a||0)}) scale(${f(s||1)})">${inner}</g>`;
function rng(seed){let s=seed>>>0||1;return ()=>((s=Math.imul(s^(s>>>15),2246822507)^Math.imul(s^(s>>>13),3266489909),(s>>>0)/4294967296));}
/* horizontal band of a disc (no clipPath): rows y1..y2 inside circle (cx,cy,r) */
function band(cx,cy,r,y1,y2,fill,op=1){y1=Math.max(y1,-r);y2=Math.min(y2,r);if(y2<=y1)return '';let l='',rr='';const n=10;
  for(let i=0;i<=n;i++){const y=y1+(y2-y1)*i/n,x=Math.sqrt(Math.max(0,r*r-y*y));l+=(i?'L':'M')+f(cx-x)+','+f(cy+y);rr=`L${f(cx+x)},${f(cy+y)}`+rr;}
  return `<path d="${l}${rr}Z" fill="${fill}" opacity="${op}"/>`;}
/* night-side shading and a soft highlight for any sphere lit from the left */
const shadeR=(cx,cy,r,op=.28)=>`<path d="M${f(cx)},${f(cy-r)}A${f(r)},${f(r)} 0 0 1 ${f(cx)},${f(cy+r)}A${f(r*.45)},${f(r)} 0 0 0 ${f(cx)},${f(cy-r)}Z" fill="#0f172a" opacity="${op}"/>`;
const hl=(cx,cy,r)=>E(cx-r*.38,cy-r*.42,r*.3,r*.18,'#fff','none',0,' opacity=".35"');
const PARTS=window.ASTRO_PARTS={};
const A=(cat,key,n,en,w,h,o,draw,parts)=>{def(cat,key,n,en,w,h,Object.assign({s:'#334155',sw:1.4},o),draw);if(parts)PARTS[key]=parts;};
window.__astro={P,E,C,L,G,f,rng,band,shadeR,hl};

/* =================== SOLAR SYSTEM =================== */
A('astro_sol','astro_sun','ดวงอาทิตย์','Sun star',160,160,{al:'ดวงอาทิตย์ sun ดาวฤกษ์'},()=>{const R=rng(3);let s=C(80,80,76,'#fde68a','none',0,' opacity=".35"')+C(80,80,68,'#f59e0b','#d97706',1.6);
  for(let k=0;k<70;k++){const a=R()*6.283,r=Math.sqrt(R())*62;s+=C(80+Math.cos(a)*r,80+Math.sin(a)*r,1.6+R()*2,'#fbbf24','none',0,' opacity=".7"');}
  return s+C(80,80,52,'#fbbf24','none',0,' opacity=".45"')+C(104,66,4.5,'#92400e')+C(110,70,2.6,'#92400e')+C(60,100,3.4,'#92400e');});
const planet=(key,n,en,size,base,draw,o={})=>A('astro_sol',key,n,en,size+(o.pad||8),size+(o.pad||8),{al:o.al||n},()=>{const c=(size+(o.pad||8))/2,r=size/2;return C(c,c,r,base,o.st||'#334155',1)+draw(c,c,r)+shadeR(c,c,r)+hl(c,c,r);});
planet('astro_mercury','ดาวพุธ','Mercury',56,'#a8a29e',(x,y,r)=>{const R=rng(5);let s='';for(let k=0;k<9;k++){const a=R()*6.283,d=Math.sqrt(R())*r*.75;s+=C(x+Math.cos(a)*d,y+Math.sin(a)*d,1.5+R()*3.5,'#78716c','#57534e',.6,' opacity=".75"');}return s;},{al:'ดาวพุธ mercury ดาวเคราะห์'});
planet('astro_venus','ดาวศุกร์','Venus',86,'#fde68a',(x,y,r)=>band(x,y,r,-r*.5,-r*.32,'#fcd34d')+band(x,y,r,-r*.05,r*.12,'#fef3c7')+band(x,y,r,r*.4,r*.55,'#fcd34d')+L(`M${x-r*.7},${y-r*.15}q${r*.4},${-r*.2} ${r*.8},0t${r*.6},${r*.05}`,'#f59e0b',1.2,' opacity=".5"'),{al:'ดาวศุกร์ venus ดาวเคราะห์'});
planet('astro_earth','โลก','Earth',96,'#3b82f6',(x,y,r)=>P(`M${x-r*.55},${y-r*.55}c${r*.25},${-r*.2} ${r*.55},${-r*.15} ${r*.6},${r*.1}s${-r*.2},${r*.35} ${-r*.05},${r*.5}s${-r*.1},${r*.35} ${-r*.35},${r*.25}s${-r*.35},${-r*.45} ${-r*.2},${-r*.85}z`,'#22c55e','#15803d',.8)
  +P(`M${x+r*.15},${y+r*.05}c${r*.3},${-r*.15} ${r*.6},${r*.05} ${r*.55},${r*.35}s${-r*.25},${r*.45} ${-r*.45},${r*.3}s${-r*.25},${-r*.4} ${-r*.1},${-r*.65}z`,'#84cc16','#4d7c0f',.8)+band(x,y,r,-r,-r*.82,'#f8fafc')+band(x,y,r,r*.84,r,'#f8fafc')
  +L(`M${x-r*.8},${y-r*.05}q${r*.3},${-r*.15} ${r*.6},0M${x+r*.1},${y-r*.55}q${r*.3},${-r*.1} ${r*.55},${r*.08}M${x-r*.3},${y+r*.6}q${r*.3},${r*.1} ${r*.6},0`,'#fff',2,' opacity=".75"'),{al:'โลก earth ดาวเคราะห์'});
planet('astro_moon','ดวงจันทร์','Moon',66,'#d6d3d1',(x,y,r)=>{let s=E(x-r*.25,y-r*.2,r*.32,r*.24,'#a8a29e')+E(x+r*.2,y-r*.35,r*.22,r*.16,'#a8a29e')+E(x+r*.05,y+r*.25,r*.28,r*.2,'#a8a29e');const R=rng(7);for(let k=0;k<8;k++){const a=R()*6.283,d=Math.sqrt(R())*r*.8;s+=C(x+Math.cos(a)*d,y+Math.sin(a)*d,1+R()*2.6,'none','#78716c',.8);}return s;},{al:'ดวงจันทร์ moon บริวาร'});
planet('astro_mars','ดาวอังคาร','Mars',76,'#ea580c',(x,y,r)=>P(`M${x-r*.6},${y+r*.05}c${r*.3},${-r*.25} ${r*.7},${r*.2} ${r*1.1},${-r*.05}l${r*.1},${r*.3}c${-r*.4},${r*.2} ${-r*.8},${-r*.05} ${-r*1.15},${r*.05}z`,'#9a3412','none')+band(x,y,r,-r,-r*.8,'#fff7ed')+E(x+r*.25,y-r*.4,r*.18,r*.1,'#c2410c'),{al:'ดาวอังคาร mars ดาวเคราะห์แดง'});
A('astro_sol','astro_jupiter','ดาวพฤหัสบดี','Jupiter',196,196,{al:'ดาวพฤหัสบดี jupiter ดาวเคราะห์แก๊ส'},()=>{const x=98,y=98,r=92;let s=C(x,y,r,'#fef3c7','#92400e',1);
  [[-.85,-.65,'#d6a46a'],[-.48,-.36,'#d97706'],[-.28,-.12,'#fde68a'],[.05,.22,'#c2410c'],[.32,.42,'#f59e0b'],[.58,.72,'#b45309']].forEach(([a,b,c])=>s+=band(x,y,r,a*r,b*r,c,.85));
  return s+E(x+r*.3,y+r*.3,r*.16,r*.08,'#b91c1c','#7f1d1d',.8)+shadeR(x,y,r,.22)+hl(x,y,r);});
A('astro_sol','astro_saturn','ดาวเสาร์','Saturn with rings',240,130,{al:'ดาวเสาร์ saturn วงแหวน'},()=>{const x=120,y=65,r=44;const ring=(half)=>G(x,y,-14,1,L(half?`M-104,0A104,24 0 0 1 104,0`:`M-104,0A104,24 0 0 0 104,0`,'#d6b98c',9)+L(half?`M-104,0A104,24 0 0 1 104,0`:`M-104,0A104,24 0 0 0 104,0`,'#78350f',.8,' opacity=".6"')+L(half?`M-86,0A86,19.5 0 0 1 86,0`:`M-86,0A86,19.5 0 0 0 86,0`,'#e7d3b0',7));
  let s=ring(1)+C(x,y,r,'#fde68a','#92400e',1);[[-.7,-.5,'#e9c98a'],[-.2,0,'#f5deb3'],[.25,.42,'#d6b98c']].forEach(([a,b,c])=>s+=band(x,y,r,a*r,b*r,c,.9));
  return s+shadeR(x,y,r,.22)+hl(x,y,r)+ring(0);});
planet('astro_uranus','ดาวยูเรนัส','Uranus',90,'#a5f3fc',(x,y,r)=>band(x,y,r,-r*.15,r*.1,'#cffafe')+E(x,y,r*.12,r*1.22,'none','#67e8f9',1.2,' opacity=".8"'),{al:'ดาวยูเรนัส uranus แกนเอียง'});
planet('astro_neptune','ดาวเนปจูน','Neptune',88,'#3b82f6',(x,y,r)=>band(x,y,r,-r*.45,-r*.3,'#60a5fa')+band(x,y,r,r*.2,r*.35,'#2563eb')+E(x-r*.15,y+r*.05,r*.17,r*.09,'#1e3a8a'),{al:'ดาวเนปจูน neptune ดาวเคราะห์'});
planet('astro_pluto','ดาวพลูโต (ดาวเคราะห์แคระ)','Pluto dwarf planet',40,'#d6c3a5',(x,y,r)=>E(x+r*.15,y+r*.15,r*.4,r*.32,'#f5ede0')+E(x-r*.4,y-r*.1,r*.25,r*.2,'#a8876a'),{al:'ดาวพลูโต pluto ดาวเคราะห์แคระ'});
A('astro_sol','astro_asteroid','ดาวเคราะห์น้อย','asteroid',80,56,{al:'ดาวเคราะห์น้อย asteroid'},()=>P('M8,30C6,14 24,6 40,8C56,4 74,14 72,30C76,44 58,52 42,50C26,54 8,46 8,30Z','#a8a29e','#57534e',1.4)+C(30,24,5,'#78716c','#57534e',.8)+C(52,34,4,'#78716c','#57534e',.8)+C(44,18,2.5,'#78716c')+shadeR(40,29,24,.2));
A('astro_sol','astro_comet','ดาวหาง','comet coma ion tail dust tail',240,90,{al:'ดาวหาง comet หาง'},()=>P('M30,45C80,34 160,10 238,2L238,22C160,26 90,44 30,52Z','#fde68a','none',0,' opacity=".55"')+L('M30,45L238,40','#93c5fd',3,' opacity=".75"')+L('M34,44L238,47','#bfdbfe',7,' opacity=".35"')+C(28,46,16,'#e0f2fe','none',0,' opacity=".7"')+C(28,46,9,'#f8fafc','#94a3b8',1)+C(27,46,3.5,'#57534e'),{nucleus:[27,46],coma:[22,36],iontail:[200,41],dusttail:[180,18]});
A('astro_sol','astro_meteor','ดาวตก (สะเก็ดดาว)','meteor shooting star',150,70,{al:'ดาวตก meteor ผีพุ่งใต้'},()=>P('M8,8L132,58L126,63Z','#fde68a','none',0,' opacity=".7"')+L('M30,16L128,58','#fff7ed',2.4)+C(130,60,5,'#fff','#f59e0b',1.4));

/* =================== STRUCTURE =================== */
A('astro_struct','astro_sun_xs','โครงสร้างดวงอาทิตย์ (ภาพตัด)','Sun interior cutaway core radiative convective',230,230,{al:'โครงสร้างดวงอาทิตย์ แกน ชั้นแผ่รังสี ชั้นพาความร้อน โฟโตสเฟียร์ คอโรนา'},()=>{const x=115,y=115,R=88;
  let s=C(x,y,R+20,'#fef3c7','none',0,' opacity=".55"')+C(x,y,R+3.5,'#ef4444','none',0,' opacity=".75"')+C(x,y,R,'#f59e0b','#d97706',1.4);
  const Rr=rng(9);for(let k=0;k<50;k++){const a=Rr()*6.283,r=Math.sqrt(Rr())*R*.92;s+=C(x+Math.cos(a)*r,y+Math.sin(a)*r,1.4+Rr()*2,'#fbbf24','none',0,' opacity=".7"');}
  const wedge=(r,c)=>`<path d="M${x},${y}L${x},${y-r}A${r},${r} 0 0 1 ${x+r},${y}Z" fill="${c}"/>`;
  s+=wedge(R,'#fb923c')+wedge(R*.7,'#fdba74')+wedge(R*.25,'#fef9c3');
  for(let k=0;k<5;k++){const a=-Math.PI/2+(k+.5)*Math.PI/10,rm=R*.85;s+=G(x+Math.cos(a)*rm,y+Math.sin(a)*rm,a*180/Math.PI,1,L('M-6,-5a5,5 0 1 1 0,10','#c2410c',1.2));}
  for(let r=R*.3;r<R*.68;r+=7)s+=L(`M${x+1},${f(y-r)}A${f(r)},${f(r)} 0 0 1 ${f(x+r)},${y-1}`,'#ea580c',.6,' stroke-dasharray="2 3"');
  s+=C(x-40,y+30,6,'#7c2d12')+C(x-30,y+40,3.5,'#7c2d12');
  return s+L(`M${x-R*.71},${y+R*.71}c-14,10 -30,0 -24,-16`,'#dc2626',4)+L(`M${x},${y}L${x},${y-R}M${x},${y}L${x+R},${y}`,'#7c2d12',1);},
 {core:[123,107],radiative:[140,88],convective:[170,70],photosphere:[50,60],chromosphere:[30,150],corona:[115,8],sunspot:[75,145],prominence:[40,190]});
A('astro_struct','astro_earth_xs','โครงสร้างภายในโลก (ภาพตัด)','Earth interior crust mantle outer core inner core',230,230,{al:'โครงสร้างโลก เปลือกโลก เนื้อโลก แก่นโลกชั้นนอก แก่นโลกชั้นใน'},()=>{const x=115,y=115,R=100;
  let s=C(x,y,R,'#3b82f6','#1e40af',1.4)+P(`M${x-60},${y-40}c20,-30 50,-20 50,0s-30,40 -10,60s-40,30 -50,0z`,'#22c55e','#15803d',.8)+P(`M${x-30},${y+50}c20,-10 40,0 30,25s-30,10 -30,-25z`,'#84cc16','#4d7c0f',.8)+shadeR(x,y,R,.18);
  const wedge=(r,c,st='none')=>`<path d="M${x},${y}L${x},${y-r}A${r},${r} 0 0 1 ${x+r},${y}Z" fill="${c}" stroke="${st}"/>`;
  return s+wedge(R,'#a16207')+wedge(R*.95,'#ea580c')+wedge(R*.546,'#facc15')+wedge(R*.19,'#fef9c3')+L(`M${x},${y}L${x},${y-R}M${x},${y}L${x+R},${y}`,'#713f12',1.2);},
 {crust:[164,31],mantle:[152,50],outercore:[141,89],innercore:[121,109]});
A('astro_struct','astro_earth_tilt','โลกและแกนเอียง 23.5°','Earth axial tilt equator tropics',220,240,{al:'แกนโลก เอียง 23.5 เส้นศูนย์สูตร ทรอปิก'},()=>{const x=110,y=120,r=72;let s=G(x,y,23.44,1,C(0,0,r,'#bfdbfe','#1d4ed8',1.6)+P(`M${-r*.55},${-r*.5}c${r*.3},${-r*.2} ${r*.6},0 ${r*.5},${r*.3}s${-r*.4},${r*.4} ${-r*.35},${r*.6}s${-r*.4},${-r*.4} ${-r*.15},${-r*.9}z`,'#86efac','#15803d',.8)
  +[[0,'#dc2626',1.6],[23.44,'#f59e0b',1.1],[-23.44,'#f59e0b',1.1],[66.56,'#0ea5e9',1.1],[-66.56,'#0ea5e9',1.1]].map(([la,c,w])=>{const t=la*Math.PI/180;return E(0,-r*Math.sin(t),r*Math.cos(t),r*Math.cos(t)*.14,'none',c,w,la?' stroke-dasharray="4 3"':'');}).join('')
  +L(`M0,${-r-34}V${r+34}`,'#0f172a',2)+P(`M0,${-r-40}l-5,9h10z`,'#0f172a','#0f172a',1)+`<text x="8" y="${-r-28}" font-size="12" font-weight="700" fill="#0f172a" font-family="${SANS}">N</text><text x="8" y="${r+40}" font-size="12" font-weight="700" fill="#0f172a" font-family="${SANS}">S</text>`);
  return s+L(`M${x},${y-r-40}V${y-r-6}`,'#64748b',1,' stroke-dasharray="3 3"')+L(`M${x},${y-r-24}A${r+24},${r+24} 0 0 1 ${f(x+(r+24)*Math.sin(23.44*Math.PI/180))},${f(y-(r+24)*Math.cos(23.44*Math.PI/180))}`,'#475569',1.2)+`<text x="${x+3}" y="${y-r-30}" font-size="11" fill="#334155" font-family="${SANS}">23.5°</text>`;},
 (()=>{const a=23.44*Math.PI/180,r=72,P=(x,y)=>[f(x*Math.cos(a)-y*Math.sin(a)+110),f(x*Math.sin(a)+y*Math.cos(a)+120)],t=d=>d*Math.PI/180;
   return {axis:P(0,-r-22),equator:P(r*.92,0),cancer:P(r*Math.cos(t(23.44))*.9,-r*Math.sin(t(23.44))),capricorn:P(r*Math.cos(t(23.44))*.9,r*Math.sin(t(23.44))),arctic:P(r*Math.cos(t(66.56))*.8,-r*Math.sin(t(66.56))),antarctic:P(r*Math.cos(t(66.56))*.8,r*Math.sin(t(66.56)))};})());

/* =================== STARS & GALAXIES =================== */
const glow=(x,y,r,c,core='#fff')=>C(x,y,r*1.7,c,'none',0,' opacity=".18"')+C(x,y,r*1.3,c,'none',0,' opacity=".3"')+C(x,y,r,c)+C(x-r*.25,y-r*.25,r*.45,core,'none',0,' opacity=".55"');
A('astro_star','astro_nebula','เนบิวลา (กลุ่มแก๊สและฝุ่น)','nebula stellar nursery',170,120,{al:'เนบิวลา nebula แก๊ส ฝุ่น'},()=>{const R=rng(13);let s='';for(let k=0;k<26;k++){const x=20+R()*130,y=20+R()*80;s+=E(x,y,10+R()*22,7+R()*14,['#f9a8d4','#c4b5fd','#93c5fd','#fda4af'][k%4],'none',0,` opacity="${.25+R()*.3}"`);}for(let k=0;k<10;k++)s+=C(10+R()*150,10+R()*100,.8+R()*1.6,'#fff');return s;});
A('astro_star','astro_protostar','ดาวฤกษ์ก่อนเกิด (โพรโทสตาร์)','protostar accretion disk',140,100,{al:'โพรโทสตาร์ protostar'},()=>E(70,50,62,12,'#fdba74','#c2410c',1,' opacity=".55"')+glow(70,50,16,'#fb923c','#fef3c7')+L('M70,32V4M70,68V96','#fde68a',2.5,' opacity=".8"'));
A('astro_star','astro_star_sun','ดาวฤกษ์แถบลำดับหลัก (คล้ายดวงอาทิตย์)','main sequence star G type',90,90,{al:'ดาวฤกษ์ ลำดับหลัก main sequence'},()=>glow(45,45,24,'#facc15','#fef9c3'));
A('astro_star','astro_star_blue','ดาวฤกษ์มวลมาก (สีน้ำเงิน)','massive blue star O B type',110,110,{al:'ดาวฤกษ์มวลมาก blue star'},()=>glow(55,55,30,'#60a5fa','#eff6ff'));
A('astro_star','astro_red_giant','ดาวยักษ์แดง','red giant',150,150,{al:'ดาวยักษ์แดง red giant'},()=>glow(75,75,44,'#f97316','#fed7aa')+C(60,62,5,'#c2410c','none',0,' opacity=".6"')+C(92,88,7,'#c2410c','none',0,' opacity=".5"'));
A('astro_star','astro_red_supergiant','ดาวยักษ์ใหญ่แดง','red supergiant',190,190,{al:'ดาวยักษ์ใหญ่แดง supergiant'},()=>glow(95,95,58,'#ef4444','#fecaca')+C(76,80,8,'#b91c1c','none',0,' opacity=".5"'));
A('astro_star','astro_planetary_nebula','เนบิวลาดาวเคราะห์','planetary nebula',140,140,{al:'เนบิวลาดาวเคราะห์ planetary nebula'},()=>E(70,70,58,50,'#5eead4','none',0,' opacity=".25"')+E(70,70,48,40,'none','#14b8a6',10,' opacity=".55"')+E(70,70,40,33,'none','#f472b6',4,' opacity=".6"')+C(70,70,4,'#fff','#93c5fd',1.2));
A('astro_star','astro_white_dwarf','ดาวแคระขาว','white dwarf',60,60,{al:'ดาวแคระขาว white dwarf'},()=>glow(30,30,10,'#e0f2fe','#fff'));
A('astro_star','astro_supernova','ซูเปอร์โนวา','supernova explosion',160,160,{al:'ซูเปอร์โนวา supernova ระเบิด'},()=>{let s='';for(let k=0;k<16;k++){const a=k*Math.PI/8,l=k%2?44:70;s+=P(`M80,80L${f(80+Math.cos(a-.12)*22)},${f(80+Math.sin(a-.12)*22)}L${f(80+Math.cos(a)*l)},${f(80+Math.sin(a)*l)}L${f(80+Math.cos(a+.12)*22)},${f(80+Math.sin(a+.12)*22)}Z`,k%2?'#fb923c':'#fde047','none');}return C(80,80,58,'#fecaca','none',0,' opacity=".3"')+s+glow(80,80,16,'#fff7ed','#fff');});
A('astro_star','astro_neutron_star','ดาวนิวตรอน (พัลซาร์)','neutron star pulsar beams',120,120,{al:'ดาวนิวตรอน pulsar พัลซาร์'},()=>P('M60,60L40,4L80,4Z','#a5f3fc','none',0,' opacity=".5"')+P('M60,60L40,116L80,116Z','#a5f3fc','none',0,' opacity=".5"')+E(60,60,26,8,'none','#c4b5fd',1.2,' opacity=".8"')+glow(60,60,8,'#bfdbfe','#fff'));
A('astro_star','astro_black_hole','หลุมดำ','black hole accretion disk',190,110,{al:'หลุมดำ black hole'},()=>E(95,55,90,20,'#f97316','none',0,' opacity=".35"')+P('M8,55A87,26 0 0 1 182,55A87,10 0 0 0 8,55Z','#fdba74','none',0,' opacity=".9"')+C(95,55,28,'#fde68a','none',0,' opacity=".55"')+C(95,55,24,'#000','#f59e0b',1.4)+P('M8,55A87,26 0 0 0 182,55A87,10 0 0 1 8,55Z','#fb923c','none',0,' opacity=".95"'),{hole:[95,48],disk:[30,55],horizon:[95,31]});
const spiral=(x,y,R,bar,seed)=>{const Rr=rng(seed);let s=E(x,y,R,R*.92,'#1e1b4b','none',0,' opacity=".9"');
  for(let arm=0;arm<2;arm++)for(let t=0;t<1;t+=.012){const th=arm*Math.PI+t*3.4*Math.PI,r=(bar?R*.28:R*.08)+R*.7*t,jx=(Rr()-.5)*R*.08,jy=(Rr()-.5)*R*.08;s+=C(x+Math.cos(th)*r+jx,y+Math.sin(th)*r*.9+jy,.8+Rr()*2.2,t<.5?'#fde68a':Rr()<.5?'#bfdbfe':'#f9a8d4','none',0,` opacity="${.5+Rr()*.5}"`);}
  if(bar)s+=E(x,y,R*.3,R*.07,'#fde68a','none',0,' opacity=".8"');return s+C(x,y,R*.14,'#fef3c7','none',0,' opacity=".85"');};
A('astro_star','astro_gal_spiral','ดาราจักรกังหัน (Sb)','spiral galaxy',170,160,{al:'กาแล็กซี ดาราจักร กังหัน spiral galaxy ทางช้างเผือก'},()=>spiral(85,80,76,false,21));
A('astro_star','astro_gal_barred','ดาราจักรกังหันมีคาน (SBb)','barred spiral galaxy',170,160,{al:'กาแล็กซี ดาราจักร คาน barred'},()=>spiral(85,80,76,true,31));
A('astro_star','astro_gal_elliptical','ดาราจักรรี (E)','elliptical galaxy',160,110,{al:'กาแล็กซี ดาราจักรรี elliptical'},()=>E(80,55,76,50,'#1e1b4b','none',0,' opacity=".9"')+E(80,55,62,40,'#fde68a','none',0,' opacity=".25"')+E(80,55,42,27,'#fde68a','none',0,' opacity=".35"')+E(80,55,22,14,'#fef3c7','none',0,' opacity=".75"'));
A('astro_star','astro_gal_irregular','ดาราจักรไร้รูปแบบ (Irr)','irregular galaxy',150,120,{al:'กาแล็กซี ไร้รูปแบบ irregular'},()=>{const R=rng(41);let s=E(75,60,70,54,'#1e1b4b','none',0,' opacity=".9"');for(let k=0;k<90;k++){const x=20+R()*110,y=20+R()*80;if(Math.hypot((x-75)/1.3,y-60)>48)continue;s+=C(x,y,.8+R()*2,R()<.6?'#bfdbfe':'#f9a8d4','none',0,` opacity="${.5+R()*.5}"`);}return s;});

/* H–R diagram (log axes, temperature decreasing to the right) */
A('astro_star','astro_hr','แผนภาพ H–R','Hertzsprung Russell diagram',320,280,{al:'แผนภาพ HR hertzsprung russell ความส่องสว่าง อุณหภูมิ'},()=>{const X0=52,Y0=30,W=250,H=200,lT0=Math.log10(40000),lT1=Math.log10(2400);
  const X=T=>X0+(lT0-Math.log10(T))/(lT0-lT1)*W,Y=Lm=>Y0+(6-Math.log10(Lm))/10*H;
  let s=`<rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="#0f172a"/>`;
  const col=T=>T>25000?'#93c5fd':T>9000?'#dbeafe':T>6500?'#fff7ed':T>5200?'#fde047':T>3800?'#fb923c':'#ef4444';
  s+=E(X(4300),Y(300),34,30,'#fb923c','none',0,' opacity=".4"')+P(`M${X(30000)},${Y(3e5)}L${X(3500)},${Y(2e5)}L${X(3500)},${Y(6e4)}L${X(30000)},${Y(3e4)}Z`,'#fca5a5','none',0,' opacity=".3"')+E(X(11000),Y(.003),40,10,'#e0f2fe','none',0,` opacity=".45" transform="rotate(14 ${f(X(11000))} ${f(Y(.003))})"`);
  const MS=[[40000,3e5],[30000,2e4],[15400,8e2],[9600,40],[7200,6],[5800,1],[5200,.4],[4400,.15],[3800,.07],[3100,.008],[2600,.001]];
  for(let i=0;i<MS.length-1;i++){const [T1,L1]=MS[i],[T2,L2]=MS[i+1];for(let t=0;t<1;t+=.1){const T=Math.pow(10,Math.log10(T1)+(Math.log10(T2)-Math.log10(T1))*t),Lm=Math.pow(10,Math.log10(L1)+(Math.log10(L2)-Math.log10(L1))*t);s+=C(X(T),Y(Lm),4.2,col(T),'none',0,' opacity=".85"');}}
  s+=C(X(5778),Y(1),5,'none','#facc15',1.6)+C(X(5778),Y(1),1.5,'#facc15');
  const tx2=(x,y,t,sz,c,a='middle',b=0)=>`<text x="${f(x)}" y="${f(y)}" font-size="${sz}" fill="${c}" text-anchor="${a}" dominant-baseline="central" font-family="${SANS}" font-weight="${b?700:400}">${t}</text>`;
  s+=tx2(X(5778)+8,Y(1)-8,'ดวงอาทิตย์',8.5,'#fde047','start')+tx2(X(9000),Y(.5e-1)+4,'ลำดับหลัก',9,'#e0f2fe','middle',1)+tx2(X(4100),Y(800),'ดาวยักษ์',8.5,'#fed7aa')+tx2(X(9000),Y(1.5e5),'ดาวยักษ์ใหญ่',8.5,'#fecaca')+tx2(X(13000),Y(2e-4),'ดาวแคระขาว',8.5,'#e0f2fe');
  [[30000,'30 000'],[10000,'10 000'],[6000,'6 000'],[3000,'3 000']].forEach(([T,l])=>s+=L(`M${f(X(T))},${Y0+H}v4`,'#334155',1)+tx2(X(T),Y0+H+12,l,8.5,'#334155'));
  [[-4,'10⁻⁴'],[-2,'10⁻²'],[0,'1'],[2,'10²'],[4,'10⁴'],[6,'10⁶']].forEach(([e,l])=>s+=L(`M${X0},${f(Y(Math.pow(10,e)))}h-4`,'#334155',1)+tx2(X0-7,Y(Math.pow(10,e)),l,8.5,'#334155','end'));
  [['O',36000],['B',17000],['A',8600],['F',6750],['G',5600],['K',4450],['M',3200]].forEach(([c,T])=>s+=tx2(X(T),Y0-9,c,10,'#334155','middle',1));
  return s+`<rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="none" stroke="#334155" stroke-width="1.2"/>`+tx2(X0+W/2,Y0+H+26,'อุณหภูมิผิว (K) — ร้อนอยู่ทางซ้าย',9.5,'#0f172a','middle',1)+`<text x="14" y="${Y0+H/2}" font-size="9.5" fill="#0f172a" text-anchor="middle" font-weight="700" font-family="${SANS}" transform="rotate(-90 14 ${Y0+H/2})">ความส่องสว่าง (L☉)</text>`+tx2(X0+W/2,Y0-21,'ชนิดสเปกตรัม',8,'#64748b');});

/* =================== INSTRUMENTS =================== */
const metal=(x,y,w,h,c='#cbd5e1')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${c}" stroke="#334155" stroke-width="1.2"/>`;
A('astro_inst','astro_refractor','กล้องโทรทรรศน์แบบหักเหแสง','refracting telescope',260,150,{al:'กล้องโทรทรรศน์ หักเหแสง refractor'},()=>G(130,50,-12,1,metal(-110,-14,190,28,'#e2e8f0')+metal(-122,-17,22,34,'#94a3b8')+E(-120,0,4,15,'#bae6fd','#0369a1',1.2)+metal(80,-8,26,16,'#64748b')+metal(104,-6,14,12,'#334155'))+L('M130,62L92,146M130,62L168,146M130,62V146','#475569',3)+metal(120,54,20,14,'#64748b'),{objective:[16,74],tube:[110,58],eyepiece:[240,22],mount:[130,120]});
A('astro_inst','astro_reflector','กล้องโทรทรรศน์แบบสะท้อนแสง (นิวโทเนียน)','newtonian reflecting telescope',260,150,{al:'กล้องโทรทรรศน์ สะท้อนแสง reflector newtonian'},()=>G(130,55,-12,1,metal(-112,-24,210,48,'#f8fafc')+L('M98,-22Q90,0 98,22','#0369a1',3.5)+L('M-82,-6L-70,6','#0369a1',2.5)+metal(-82,-38,16,16,'#475569')+metal(-80,-46,12,9,'#334155'))+L('M130,67L94,146M130,67L166,146M130,67V146','#475569',3)+metal(120,58,20,14,'#64748b'),{primary:[228,36],secondary:[54,80],eyepiece:[50,36],tube:[130,60]});
A('astro_inst','astro_radio','กล้องโทรทรรศน์วิทยุ','radio telescope dish',170,180,{al:'กล้องโทรทรรศน์วิทยุ radio telescope จานรับสัญญาณ'},()=>P('M10,30Q85,120 160,30','#e2e8f0','#475569',1.6)+L('M10,30Q85,62 160,30','#94a3b8',1)+L('M40,58L85,6M130,58L85,6','#475569',1.4)+metal(78,2,14,10,'#64748b')+L('M85,75L60,168M85,75L110,168','#475569',4)+metal(50,164,70,10,'#64748b'),{dish:[30,40],receiver:[85,7],mount:[85,140]});
A('astro_inst','astro_space_telescope','กล้องโทรทรรศน์อวกาศ','space telescope',240,110,{al:'กล้องโทรทรรศน์อวกาศ space telescope'},()=>`<rect x="30" y="20" width="22" height="70" fill="#1e3a8a" stroke="#1e293b"/><rect x="188" y="20" width="22" height="70" fill="#1e3a8a" stroke="#1e293b"/>`+L('M41,20V90M199,20V90M30,55H52M188,55H210','#60a5fa',.8)+metal(52,32,136,46,'#e5e7eb')+metal(60,30,30,50,'#cbd5e1')+P('M188,30L208,22V88L188,80Z','#94a3b8','#334155',1.2)+L('M52,55H30M188,55H210','#334155',1.4),{aperture:[200,55],panel:[41,30],tube:[120,55]});
A('astro_inst','astro_satellite','ดาวเทียม','artificial satellite',200,110,{al:'ดาวเทียม satellite'},()=>`<rect x="6" y="36" width="56" height="34" fill="#1e3a8a" stroke="#1e293b"/><rect x="138" y="36" width="56" height="34" fill="#1e3a8a" stroke="#1e293b"/>`+L('M20,36V70M34,36V70M48,36V70M152,36V70M166,36V70M180,36V70','#60a5fa',.8)+L('M62,53H76M124,53H138','#334155',2)+metal(76,32,48,42,'#fcd34d')+P('M100,32V18M86,14Q100,30 114,14','none','#334155',1.6),{panel:[30,40],body:[100,55],antenna:[100,16]});
A('astro_inst','astro_space_station','สถานีอวกาศ','space station',230,130,{al:'สถานีอวกาศ space station'},()=>{let s='';[20,60,150,190].forEach(x=>s+=`<rect x="${x}" y="8" width="22" height="48" fill="#1e3a8a" stroke="#1e293b"/><rect x="${x}" y="74" width="22" height="48" fill="#1e3a8a" stroke="#1e293b"/>`);return s+L('M10,65H220','#64748b',4)+metal(90,52,50,26,'#e5e7eb')+metal(70,57,22,16,'#cbd5e1')+metal(138,57,22,16,'#cbd5e1');});
A('astro_inst','astro_planisphere','แผนที่ฟ้า (Planisphere)','planisphere star wheel',130,130,{al:'แผนที่ฟ้า planisphere'},()=>{const R=rng(51);let s=C(65,65,62,'#1e3a8a','#0f172a',1.4);for(let k=0;k<40;k++){const a=R()*6.283,r=Math.sqrt(R())*56;s+=C(65+Math.cos(a)*r,65+Math.sin(a)*r,.6+R()*1.4,'#fff');}return s+E(65,68,44,38,'none','#fde68a',2)+P('M3,65A62,62 0 0 0 127,65L127,127H3Z','#e2e8f0','none',0,' opacity=".95"')+L('M3,65A62,62 0 0 0 127,65','#334155',1.4);});
})();
