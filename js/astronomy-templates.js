/* PhysiDraw — Astronomy templates (Phase 4c). Built from editable objects:
   library shapes, the celsphere / orbit / moonphase / eclipse tools, graphs, labels and arrows. */
"use strict";
(function(){
if(!window.__astro||!window.__astroTools)return;
const PARTS=window.ASTRO_PARTS;const {mkCelSphere,mkOrbit,mkMoonPhase,mkEclipse}=window.__astroTools;
const cv=document.createElement('canvas').getContext('2d');const tw=(t,sz=13)=>{cv.font=`400 ${sz}px ${SANS}`;return cv.measureText(t).width;};
const put=(k,x,y,w,h,o={})=>{const s=mkShape(k,0,0,Object.assign({w,h},o));s.x=x;s.y=y;return s;};
const putC=(k,cx,cy,w,h,o={})=>put(k,cx-w/2,cy-h/2,w,h,o);
const box=(t,cx,cy,w,h=30,o={})=>mkShape('rrect',cx,cy,Object.assign({w:w||Math.max(70,tw(t,o.lsz||13)+24),h,fill:'#ffffff',stroke:'#94a3b8',sw:1.2,label:t,lp:'center',lsz:13,lc:'#1f2937'},o));
const lead=(x1,y1,b,side)=>{const l=mkLine('leader',x1,y1,0,0);l.a2={id:b.id,a:side};return l;};
const title=(t,x,y,sz=24)=>mkText(t,x,y,{size:sz,bold:true});
const note=(t,x,y,o={})=>mkText(t,x,y,Object.assign({size:13,color:'#64748b'},o));
const txt=(t,x,y,o={})=>mkText(t,x,y,Object.assign({size:14,color:'#1f2937'},o));
const arrow=(x1,y1,x2,y2,c='#334155',sw=2.5,o={})=>mkLine('arrow',x1,y1,x2,y2,Object.assign({stroke:c,sw},o));
function D(name,w,h,objs){const d=newDoc();d.name=name;d.w=w;d.h=h;d.objects=objs;const save=doc;doc=d;resolveAnchors();doc=save;return d;}
const pt=(o,lx,ly)=>{const d=DEF[o.key];return [o.x+lx*o.w/d.w,o.y+ly*o.h/d.h];};
function annotate(O,obj,items,{lx,rx,gap=34,top=80,bottom=9999,lsz=13}={}){const parts=PARTS[obj.key];const pts=items.map(([k,t,sd])=>{const [X,Y]=pt(obj,...parts[k]);return {t,X,Y,sd};});
  ['l','r'].forEach(sd=>{const g=pts.filter(p=>p.sd===sd).sort((a,b)=>a.Y-b.Y);if(!g.length)return;let ys=g.map(p=>p.Y);for(let i=1;i<ys.length;i++)ys[i]=Math.max(ys[i],ys[i-1]+gap);
    const sh=(g.reduce((s,p)=>s+p.Y,0)-ys.reduce((s,y)=>s+y,0))/g.length;ys=ys.map(y=>y+sh);if(ys[0]<top)ys=ys.map(y=>y+top-ys[0]);if(ys[ys.length-1]>bottom)ys=ys.map(y=>y-(ys[ys.length-1]-bottom));
    g.forEach((p,i)=>{const w=Math.max(70,tw(p.t,lsz)+24);const b=box(p.t,sd==='l'?lx-w/2:rx+w/2,ys[i],w,30,{lsz});O.push(b,lead(p.X,p.Y,b,sd==='l'?'r':'l'));});});}
const NS='ภาพจำลองเพื่อการเรียนรู้ — ขนาดและระยะทางไม่ได้ตามมาตราส่วนจริง';

function T_solar(){const O=[];O.push(put('astro_sun',-190,60,340,340));
  const P=[['astro_mercury','ดาวพุธ','0.39 AU',225,22],['astro_venus','ดาวศุกร์','0.72 AU',290,36],['astro_earth','โลก','1.00 AU',360,38],['astro_mars','ดาวอังคาร','1.52 AU',430,28],
    ['astro_jupiter','ดาวพฤหัสบดี','5.20 AU',590,118],['astro_saturn','ดาวเสาร์','9.58 AU',790,98],['astro_uranus','ดาวยูเรนัส','19.2 AU',955,56],['astro_neptune','ดาวเนปจูน','30.1 AU',1080,54]];
  P.forEach(([k,n,au,x,d])=>{const DEFk=DEF[k];const w=k==='astro_saturn'?d*240/88:d*DEFk.w/(DEFk.w-8),h=k==='astro_saturn'?d*130/88:w;O.push(putC(k,x,230,w,h),txt(n,x,330,{bold:true}),note(au,x,352));});
  [[500,190],[512,250],[504,286],[517,210],[492,268]].forEach(([x,y],i)=>O.push(putC('astro_asteroid',x,y,14+i%2*5,10+i%2*4)));O.push(note('↑ แถบดาวเคราะห์น้อย',505,378,{size:12}));
  O.push(title('ระบบสุริยะ (Solar System)',640,52),note('AU = หน่วยดาราศาสตร์ ≈ 1.496 × 10⁸ km (ระยะเฉลี่ยโลก–ดวงอาทิตย์) · ดาวพฤหัสบดีมีเส้นผ่านศูนย์กลางราว 11 เท่าของโลก',640,410,{size:13,color:'#334155'}),note(NS,640,434,{size:12}));
  return D('ระบบสุริยะ',1160,460,O);}
function T_sun(){const O=[];const s=put('astro_sun_xs',300,90,420,420);O.push(s);
  annotate(O,s,[['corona','คอโรนา (> 1 ล้าน K)','l'],['photosphere','โฟโตสเฟียร์ — ผิวที่มองเห็น (~5,800 K)','l'],['chromosphere','โครโมสเฟียร์','l'],['sunspot','จุดมืดดวงอาทิตย์','l'],['prominence','พวยแก๊ส (prominence)','l'],
    ['convective','เขตการพาความร้อน','r'],['radiative','เขตการแผ่รังสี','r'],['core','แกนกลาง (~15 ล้าน K) — นิวเคลียร์ฟิวชัน','r']],{lx:280,rx:740,top:110,bottom:470,gap:40});
  O.push(title('โครงสร้างของดวงอาทิตย์',510,46),note('พลังงานเกิดที่แกนกลางจากฟิวชันของไฮโดรเจนเป็นฮีเลียม แล้วถ่ายเทออกมาโดยการแผ่รังสีและการพาความร้อน',510,540),note(NS,510,564,{size:12}));return D('โครงสร้างของดวงอาทิตย์',1020,590,O);}
function T_earth(){const O=[];const e=put('astro_earth_xs',300,90,420,420);O.push(e);
  annotate(O,e,[['crust','เปลือกโลก — หนา 5–70 km','r'],['mantle','เนื้อโลก — ลึกถึง ~2,900 km','r'],['outercore','แก่นโลกชั้นนอก (ของเหลว) 2,900–5,150 km','r'],['innercore','แก่นโลกชั้นใน (ของแข็ง) 5,150–6,371 km','r']],{rx:740,top:110,bottom:400,gap:52});
  O.push(title('โครงสร้างภายในโลก',510,46),note('รัศมีโลกเฉลี่ย 6,371 km · ความหนาของเปลือกโลกในภาพถูกขยายให้เห็นชัด',510,540),note(NS,510,564,{size:12}));return D('โครงสร้างภายในโลก',1020,590,O);}
function T_csphere(){const O=[mkCelSphere(500,330,{w:700,h:520,paths:false,alt:40,az:120,lat:16.2})];
  O.push(title('ทรงกลมท้องฟ้าและระบบพิกัดขอบฟ้า',500,40),note('ผู้สังเกตที่มหาสารคาม (ละติจูด 16.2°N) — ปรับละติจูดและตำแหน่งดาวได้ในแผงด้านขวา',500,72,{color:'#334155'}),
    note('มุมเงย (altitude) วัดจากขอบฟ้าขึ้นไป 0–90° · มุมทิศ (azimuth) วัดจากทิศเหนือไปทางตะวันออก 0–360° · มุมเงยของขั้วฟ้าเหนือเท่ากับละติจูดของผู้สังเกต',500,612));return D('ทรงกลมท้องฟ้า',1000,640,O);}
function T_sunpath(){const O=[mkCelSphere(500,330,{w:700,h:520,star:false,equator:false,lat:16.2,vaz:35})];const phi=16.2;
  O.push(title('เส้นทางการขึ้น–ตกของดวงอาทิตย์ในรอบปี',500,40),note('ผู้สังเกตที่ละติจูด 16.2°N',500,72,{color:'#334155'}),
    note(`มุมเงยเวลาเที่ยง: วิษุวัต ${(90-phi).toFixed(1)}° ทางใต้ · ครีษมายัน ${(90-Math.abs(phi-23.44)).toFixed(1)}° ทางเหนือ · เหมายัน ${(90-phi-23.44).toFixed(1)}° ทางใต้`,500,600,{color:'#334155'}),
    note('ช่วงครีษมายันดวงอาทิตย์ขึ้นค่อนไปทางทิศตะวันออกเฉียงเหนือ ช่วงเหมายันค่อนไปทางตะวันออกเฉียงใต้ · วันวิษุวัตขึ้นตรงทิศตะวันออก',500,624));return D('เส้นทางดวงอาทิตย์',1000,650,O);}
function T_seasons(){const O=[];const cx=500,cy=330,rx=340,ry=118;O.push(mkShape('circle',cx,cy,{w:rx*2,h:ry*2,fill:'none',stroke:'#94a3b8',sw:1.5,dash:'dash'}),putC('astro_sun',cx,cy,130,130));
  const E=[[cx+rx,cy,1,'เหมายัน ≈ 22 ธ.ค.','ซีกโลกเหนือเป็นฤดูหนาว'],[cx,cy-ry,.78,'วสันตวิษุวัต ≈ 20 มี.ค.','กลางวันเท่ากลางคืน'],[cx-rx,cy,1,'ครีษมายัน ≈ 21 มิ.ย.','ซีกโลกเหนือเป็นฤดูร้อน'],[cx,cy+ry,1.18,'ศารทวิษุวัต ≈ 23 ก.ย.','กลางวันเท่ากลางคืน']];
  E.forEach(([x,y,s,a,b])=>{O.push(putC('astro_earth_tilt',x,y,92*s,100*s));const ly=y<cy?y-60*s-22:y+56*s+14;O.push(txt(a,x,ly,{bold:true,size:14}),note(b,x,ly+20,{size:12}));});
  O.push(mkLine('curve',cx-80,cy+ry+4,cx+80,cy+ry+4,{he:true,stroke:'#475569',sw:2,cx:cx,cy:cy+ry+18}),mkLine('curve',cx+80,cy-ry-4,cx-80,cy-ry-4,{he:true,stroke:'#475569',sw:2,cx:cx,cy:cy-ry-18}));
  O.push(title('การเกิดฤดูกาล',500,40),note('แกนโลกเอียง 23.5° และชี้ไปทิศเดิมตลอดปี — ฤดูกาลไม่ได้เกิดจากระยะห่างโลก–ดวงอาทิตย์ (โลกอยู่ใกล้ดวงอาทิตย์ที่สุดราว 3 ม.ค.)',500,600,{color:'#334155'}),note('มองจากเหนือระนาบวงโคจรเฉียงลง · โลกโคจรทวนเข็มนาฬิกาเมื่อมองจากเหนือขั้วโลกเหนือ · '+NS,500,624,{size:12}));
  return D('การเกิดฤดูกาล',1000,650,O);}
function T_phases(){const O=[];const cx=520,cy=430,R=170,R2=292;O.push(mkShape('circle',cx,cy,{w:R*2,h:R*2,fill:'none',stroke:'#94a3b8',sw:1.4,dash:'dash'}),putC('astro_earth_lit',cx,cy,84,84),put('astro_sunlight',22,320,110,220),txt('แสงจาก',78,300,{size:13,bold:true,color:'#b45309'}),txt('ดวงอาทิตย์',78,560,{size:13,bold:true,color:'#b45309'}));
  for(let k=0;k<8;k++){const a=(180+k*45)*Math.PI/180;const x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);O.push(putC('astro_moon_lit',x,y,34,34));
    const X=cx+R2*Math.cos(a),Y=cy-R2*Math.sin(a);O.push(mkMoonPhase(X,Y+14,{age:k*29.530589/8,w:112,h:112}));}
  O.push(mkLine('curve',cx-70,cy+R+22,cx+70,cy+R+22,{he:true,stroke:'#475569',sw:2,cx:cx,cy:cy+R+40}));
  O.push(title('ข้างขึ้นข้างแรม (เฟสของดวงจันทร์)',520,40),note('วงใน: ดวงจันทร์มองจากเหนือขั้วโลกเหนือ (ด้านที่หันเข้าหาดวงอาทิตย์สว่างเสมอ) · วงนอก: ภาพที่เห็นจากโลกในซีกโลกเหนือ',520,72,{color:'#334155'}),
    note('ดวงจันทร์โคจรรอบโลกทวนเข็มนาฬิกา · เดือนจันทรคติเฉลี่ย 29.53 วัน · '+NS,520,836,{size:12}));return D('ข้างขึ้นข้างแรม',1040,860,O);}
function T_solarEcl(){return D('สุริยุปราคา',1040,560,[mkEclipse('solar',520,290,{w:980,h:400}),title('การเกิดสุริยุปราคา',520,40),note('ดวงจันทร์บังดวงอาทิตย์ — เกิดในวันจันทร์ดับเมื่อดวงจันทร์อยู่ใกล้จุดตัดระหว่างระนาบวงโคจรของดวงจันทร์กับระนาบวงโคจรของโลก',520,510,{color:'#334155'}),note(NS,520,534,{size:12})]);}
function T_lunarEcl(){return D('จันทรุปราคา',1040,560,[mkEclipse('lunar',520,290,{w:980,h:400}),title('การเกิดจันทรุปราคา',520,40),note('ดวงจันทร์เคลื่อนเข้าไปในเงาของโลก — เกิดในคืนจันทร์เพ็ญ · แสงที่หักเหผ่านบรรยากาศโลกทำให้ดวงจันทร์ในเงามืดมีสีแดงอิฐ',520,510,{color:'#334155'}),note(NS,520,534,{size:12})]);}
function T_tides(){const O=[];const panel=(cx,cy,neap,ttl,sub)=>{const e=putC('astro_earth',cx,cy,104,104);
    O.push(mkShape('circle',cx,cy,{w:neap?168:196,h:neap?140:118,fill:'#93c5fd',stroke:'#3b82f6',sw:1.2,op:.65}),e,putC('astro_moon',cx+250,cy,40,40),txt('ดวงจันทร์',cx+250,cy+38,{size:13,bold:true}));
    if(!neap){O.push(putC('astro_sun',cx-330,cy,90,90),txt('ดวงอาทิตย์',cx-330,cy+58,{size:13,bold:true,color:'#b45309'}));}else{O.push(putC('astro_sun',cx,cy-190,80,80),txt('ดวงอาทิตย์',cx,cy-138,{size:13,bold:true,color:'#b45309'}));}
    O.push(note('น้ำขึ้น',cx+(neap?96:112),cy-14,{color:'#1d4ed8',size:13}),note('น้ำขึ้น',cx-(neap?96:112),cy-14,{color:'#1d4ed8',size:13}),note('น้ำลง',cx,cy-(neap?82:72),{color:'#0f766e',size:13}),note('น้ำลง',cx,cy+(neap?82:72),{color:'#0f766e',size:13}),
      txt(ttl,cx,cy+(neap?150:140),{bold:true,size:17}),note(sub,cx,cy+(neap?172:162),{size:12.5}));};
  panel(380,300,false,'น้ำเกิด (spring tide)','ดวงอาทิตย์ โลก ดวงจันทร์ อยู่แนวเดียวกัน (จันทร์ดับ/จันทร์เพ็ญ)');panel(860,330,true,'น้ำตาย (neap tide)','ดวงอาทิตย์และดวงจันทร์ทำมุมฉากกับโลก (ขึ้น/แรม 8 ค่ำ)');
  O.push(title('น้ำขึ้นน้ำลง',620,40),note('แรงไทดัลของดวงจันทร์ทำให้น้ำนูนสองด้าน (ด้านใกล้และด้านไกลดวงจันทร์) จึงเกิดน้ำขึ้นราววันละ 2 ครั้ง ห่างกันประมาณ 12 ชั่วโมง 25 นาที',620,560,{color:'#334155'}),note('ความสูงของน้ำในภาพถูกขยายอย่างมาก · '+NS,620,584,{size:12}));
  return D('น้ำขึ้นน้ำลง',1240,610,O);}
function T_kepler(){const O=[mkOrbit(440,300,{w:760,h:420,e:.55,n:12,m:200})];
  O.push(title('กฎของเคปเลอร์',500,40),txt('1. วงโคจรของดาวเคราะห์เป็นวงรี โดยมีดวงอาทิตย์อยู่ที่จุดโฟกัสหนึ่ง',880,170,{size:14,align:'left'}),txt('2. เส้นเชื่อมดาวเคราะห์กับดวงอาทิตย์กวาดพื้นที่เท่ากันในเวลาเท่ากัน',880,220,{size:14,align:'left'}),txt('   → เคลื่อนที่เร็วเมื่ออยู่ใกล้ดวงอาทิตย์',880,244,{size:13,align:'left',color:'#475569'}),
    txt('3. กำลังสองของคาบ ∝ กำลังสามของกึ่งแกนเอก  (T² ∝ a³)',880,294,{size:14,align:'left'}),note('ความเยื้องศูนย์กลางในภาพขยายให้เห็นชัด — วงโคจรของโลกเกือบเป็นวงกลม (e ≈ 0.017)',700,548));
  return D('กฎของเคปเลอร์',1400,570,O);}
function T_evo(){const O=[];const row=(items,y)=>{let x=240;const sh=items.map(([k,w,n,s])=>{const o=putC(k,x,y,w,w*(DEF[k].h/DEF[k].w));O.push(o,txt(n,x,y+74,{bold:true,size:14}));if(s)O.push(note(s,x,y+94,{size:12}));x+=210;return o;});for(let i=1;i<sh.length;i++)O.push(arrow(sh[i-1].x+sh[i-1].w+10,y,sh[i].x-10,y,'#64748b',2.4));return sh;};
  O.push(putC('astro_nebula',90,330,150,106),txt('เนบิวลา',90,400,{bold:true,size:14}),note('แก๊สและฝุ่นยุบตัว',90,420,{size:12}));
  const a=row([['astro_protostar',110,'ดาวฤกษ์ก่อนเกิด'],['astro_star_sun',80,'ลำดับหลัก','เผาไฮโดรเจนที่แกน'],['astro_red_giant',110,'ดาวยักษ์แดง'],['astro_planetary_nebula',110,'เนบิวลาดาวเคราะห์'],['astro_white_dwarf',56,'ดาวแคระขาว']],200);
  const b=row([['astro_protostar',110,'ดาวฤกษ์ก่อนเกิด'],['astro_star_blue',96,'ลำดับหลัก (มวลมาก)'],['astro_red_supergiant',130,'ดาวยักษ์ใหญ่แดง'],['astro_supernova',130,'ซูเปอร์โนวา']],470);
  const ns=putC('astro_neutron_star',1110,400,80,80),bh=putC('astro_black_hole',1110,560,140,81);O.push(ns,bh,txt('ดาวนิวตรอน',1110,454,{bold:true,size:14}),txt('หลุมดำ',1110,614,{bold:true,size:14}),arrow(b[3].x+b[3].w+8,450,ns.x-8,400,'#64748b',2.4),arrow(b[3].x+b[3].w+8,490,bh.x-6,550,'#64748b',2.4));
  O.push(arrow(165,310,a[0].x-8,200,'#64748b',2.4),arrow(165,350,b[0].x-8,470,'#64748b',2.4),txt('มวลน้อย (≲ 8 เท่าของดวงอาทิตย์)',560,118,{bold:true,size:15,color:'#b45309'}),txt('มวลมาก (≳ 8 เท่าของดวงอาทิตย์)',560,388,{bold:true,size:15,color:'#1d4ed8'}),
    title('วิวัฒนาการของดาวฤกษ์',600,46),note('ชะตากรรมสุดท้ายขึ้นกับมวล · แกนที่เหลือมวลสูงมาก (ดาวตั้งต้นราว > 20–25 เท่าของดวงอาทิตย์) ยุบเป็นหลุมดำ · '+NS,600,660,{size:12}));
  return D('วิวัฒนาการของดาวฤกษ์',1220,690,O);}
function T_hr(){const O=[put('astro_hr',220,80,560,490)];O.push(title('แผนภาพเฮิรตซ์สปรัง–รัสเซลล์ (H–R)',500,40),note('ดาวฤกษ์ส่วนใหญ่ (รวมดวงอาทิตย์) อยู่บนแถบลำดับหลัก · ความส่องสว่างเป็นมาตราลอการิทึมเทียบกับดวงอาทิตย์ (L☉) · อุณหภูมิลดลงจากซ้ายไปขวา',500,600,{color:'#334155'}));return D('แผนภาพ H–R',1000,630,O);}
function T_bb(){const O=[];const g=mkGraph(0,0);const Ts=[[6000,'#2563eb'],[5000,'#16a34a'],[4000,'#ea580c'],[3000,'#dc2626']];
  Object.assign(g,{x:120,y:110,w:700,h:400,fns:Ts.map(([T,c])=>({e:`1/(x^5*(exp(14388/(x*${T}))-1))`,c})),xmin:.1,xmax:3,ymin:0,ymax:.3,grid:true,legend:false,xl:'ความยาวคลื่น λ (µm)',yl:'ความเข้มของการแผ่รังสี (หน่วยสัมพัทธ์)',sw:2.6});O.push(g);
  const X=v=>g.x+46+(v-g.xmin)/(g.xmax-g.xmin)*(g.w-60),Y=v=>g.y+14+(g.ymax-v)/(g.ymax-g.ymin)*(g.h-44);const B=(x,T)=>1/(Math.pow(x,5)*(Math.exp(14388/(x*T))-1));
  Ts.forEach(([T,c],i)=>{const lm=2897.8/T;const lx=i<2?X(lm)+12:X(lm)+60+i*30,ly=i<2?Y(B(lm,T))-12:Y(B(lm,T))-26-i*12;O.push(mkText(`${T} K  (λmax ≈ ${lm.toFixed(2)} µm)`,lx,ly,{size:13,bold:true,color:c,align:'left'}),mkShape('point',X(lm),Y(B(lm,T)),{w:8,h:8,fill:c,stroke:c}));});
  O.push(mkShape('rect',X(.38)+(X(.75)-X(.38))/2,g.y+g.h-30-6,{w:X(.75)-X(.38),h:8,fill:'#a78bfa',stroke:'none',sw:0,op:.8}),note('แถบสีม่วงบนแกน = ช่วงแสงที่ตามองเห็น 0.38–0.75 µm',X(2.1),Y(.22),{size:12,color:'#6d28d9'}));
  O.push(title('การแผ่รังสีของวัตถุดำ',470,46),txt('กฎการกระจัดของวีน:  λmax = b / T ,  b ≈ 2.898 × 10⁻³ m·K',470,560,{size:16}),note('ดาวที่ร้อนกว่าแผ่รังสีมากกว่าและมีจุดสูงสุดที่ความยาวคลื่นสั้นกว่า (สีออกน้ำเงิน) · เส้นโค้งคำนวณจากกฎของพลังค์',470,588));
  return D('การแผ่รังสีของวัตถุดำ',940,620,O);}
function T_gal(){const O=[];[['astro_gal_elliptical',160,110,'ดาราจักรรี (E)','รูปร่างรี ดาวอายุมาก'],['astro_gal_spiral',170,160,'ดาราจักรกังหัน (S)','มีแขนกังหัน'],['astro_gal_barred',170,160,'ดาราจักรกังหันมีคาน (SB)','ทางช้างเผือกเป็นแบบนี้'],['astro_gal_irregular',150,120,'ดาราจักรไร้รูปแบบ (Irr)','ไม่มีรูปร่างแน่นอน']].forEach(([k,w,h,n,s],i)=>{const x=150+i*240;O.push(putC(k,x,250,w*1.15,h*1.15),txt(n,x,360,{bold:true,size:15}),note(s,x,384,{size:12.5}));});
  O.push(title('ประเภทของดาราจักร (ตามการจำแนกของฮับเบิล)',510,46),note('ดาราจักรทางช้างเผือกเป็นดาราจักรกังหันมีคาน มีดาวฤกษ์ราว 1–4 แสนล้านดวง · '+NS,510,450));return D('ประเภทของดาราจักร',1020,480,O);}
function T_tele(){const O=[];const c=210,fo=400,fe=100,xo=170,xF=xo+fo,xe=xF+fe;O.push(putC('lens_convex',xo,c,34,150),putC('lens_convex',xe,c,22,70));
  [-50,0,50].forEach(y=>{const y2=-y*fe/fo;O.push(mkLine('ray',40,c+y,xo,c+y,{stroke:'#dc2626',sw:1.6}),mkLine('ray',xo,c+y,xe,c+y2,{stroke:'#dc2626',sw:1.6}),mkLine('ray',xe,c+y2,xe+170,c+y2,{stroke:'#dc2626',sw:1.6}));});
  O.push(mkLine('dashed',20,c,xe+200,c,{}),mkShape('point',xF,c,{w:8,h:8}),txt('F',xF,c+18,{size:13,font:'serif',italic:true}),txt('เลนส์ใกล้วัตถุ (fₒ)',xo,c+100,{size:13,bold:true}),txt('เลนส์ใกล้ตา (fₑ)',xe,c+60,{size:13,bold:true}),
    txt('กล้องโทรทรรศน์แบบหักเหแสง',300,92,{size:17,bold:true}),note(`กำลังขยาย M = fₒ / fₑ = ${fo}/${fe} = ${fo/fe} เท่า (ภาพหัวกลับ)`,420,c+128,{color:'#334155'}));
  const cy=560,xm=760,fm=400,Fx=xm-fm,xd=Fx+60;O.push(mkShape('rect',(130+xm+10)/2,cy,{w:xm+10-130,h:140,fill:'#f8fafc',stroke:'#64748b',sw:1.4,op:.9}),putC('mirror_concave',xm,cy,32,130,{fh:true}),putC('mirror_plane',xd,cy,10,40,{rot:-45}),putC('lens_convex',xd,cy-112,22,56,{rot:90}));
  [[40,1],[-40,-1]].forEach(([y,sg])=>{const hx=(Math.abs(y)===40?(sg>0?366.67:354.55):360)-300+Fx;const hy=cy+(sg>0?6.67:-5.45);O.push(mkLine('ray',40,cy+y,xm,cy+y,{stroke:'#dc2626',sw:1.6}),mkLine('ray',xm,cy+y,hx,hy,{stroke:'#dc2626',sw:1.6}),mkLine('ray',hx,hy,xd+(hx-xd)*-1.4,cy-150,{stroke:'#dc2626',sw:1.6}));});
  O.push(txt('กระจกเว้า (กระจกหลัก)',xm,cy+92,{size:13,bold:true}),txt('กระจกราบทำมุม 45°',xd+10,cy+50,{size:13,bold:true}),txt('เลนส์ใกล้ตา',xd+80,cy-112,{size:13,bold:true,align:'left'}),txt('กล้องโทรทรรศน์แบบสะท้อนแสง (นิวโทเนียน)',360,cy-150,{size:17,bold:true}));
  O.push(title('การทำงานของกล้องโทรทรรศน์',480,38),note('แสงจากวัตถุไกลมากเข้ามาเป็นลำแสงขนาน · '+NS,480,690));return D('กล้องโทรทรรศน์',960,710,O);}

TPL.splice(TPL.length-1,0,
 ['ระบบสุริยะ','ดาราศาสตร์ · ดาวเคราะห์ 8 ดวง',T_solar,'astro'],['โครงสร้างดวงอาทิตย์','ชั้นต่าง ๆ และอุณหภูมิ',T_sun,'astro'],['โครงสร้างภายในโลก','เปลือก เนื้อ แก่นโลก',T_earth,'astro'],
 ['ทรงกลมท้องฟ้า','มุมเงย มุมทิศ ละติจูด',T_csphere,'astro'],['เส้นทางดวงอาทิตย์','วิษุวัตและอายัน',T_sunpath,'astro'],['การเกิดฤดูกาล','แกนโลกเอียง 23.5°',T_seasons,'astro'],
 ['ข้างขึ้นข้างแรม','เฟสของดวงจันทร์ 8 ตำแหน่ง',T_phases,'astro'],['สุริยุปราคา','เงามืดและเงามัว',T_solarEcl,'astro'],['จันทรุปราคา','เงาของโลก',T_lunarEcl,'astro'],['น้ำขึ้นน้ำลง','น้ำเกิดและน้ำตาย',T_tides,'astro'],
 ['กฎของเคปเลอร์','วงรีและพื้นที่เท่ากัน',T_kepler,'astro'],['วิวัฒนาการดาวฤกษ์','มวลน้อยและมวลมาก',T_evo,'astro'],['แผนภาพ H–R','อุณหภูมิและความส่องสว่าง',T_hr,'astro'],
 ['การแผ่รังสีวัตถุดำ','กฎของวีนและพลังค์',T_bb,'astro'],['ประเภทของดาราจักร','การจำแนกของฮับเบิล',T_gal,'astro'],['กล้องโทรทรรศน์','หักเหแสงและสะท้อนแสง',T_tele,'astro']);
window.__astroTpl={T_solar,T_sun,T_earth,T_csphere,T_sunpath,T_seasons,T_phases,T_solarEcl,T_lunarEcl,T_tides,T_kepler,T_evo,T_hr,T_bb,T_gal,T_tele};
})();
