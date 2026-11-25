/* =====================================================================
   PhysiDraw — Biology module (Phase 3a): categories, cells & organelles,
   membrane, genetics shapes and mitosis stages. Editable SVG only.
   Each asset is drawn in its own w×h box; PARTS gives label points
   (local coordinates) used by the biology templates.
   ===================================================================== */
"use strict";
(function(){
if(typeof CATS==='undefined')return;
[['bio_cell','เซลล์และออร์แกเนลล์','Cells & organelles'],['bio_gen','พันธุศาสตร์และการแบ่งเซลล์','Genetics & cell division'],
 ['bio_body','ร่างกายมนุษย์','Human body'],['bio_plant','พืช','Plants'],['bio_micro','จุลชีพและไวรัส','Microbes & viruses'],
 ['bio_eco','นิเวศวิทยา','Ecology'],['bio_lab','อุปกรณ์ชีววิทยา','Biology lab']].forEach(c=>{CATS.push(c);CAT_SUBJ[c[0]]='bio';});

/* ---------- drawing helpers ---------- */
const f=n=>Math.round(n*100)/100;
const P=(d,fill,st,sw=1.2,x='')=>`<path d="${d}" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"${x}/>`;
const E=(cx,cy,rx,ry,fill,st,sw=1.2,x='')=>`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${x}/>`;
const C=(cx,cy,r,fill,st='none',sw=1.2,x='')=>`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${x}/>`;
const G=(x,y,a,s,inner)=>`<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a||0)}) scale(${f(s||1)})">${inner}</g>`;
const L=(d,st,sw=1.2,x='')=>`<path d="${d}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${x}/>`;
const T=(x,y,t,sz,c,o={})=>tx(x,y,t,sz,c,o);
const hi=(cx,cy,rx,ry)=>E(cx,cy,rx,ry,'#fff','none',0,' opacity=".45"');
/* seeded scatter (deterministic) */
function rng(seed){let s=seed>>>0||1;return ()=>((s=Math.imul(s^(s>>>15),2246822507)^Math.imul(s^(s>>>13),3266489909),(s>>>0)/4294967296));}

/* organelles drawn around (0,0) */
const ORG={
 mito(L0=40,W=18){const r=W/2,a=-L0/2+r,b=L0/2-r;let s=P(`M${a},${-r}H${b}A${r},${r} 0 0 1 ${b},${r}H${a}A${r},${r} 0 0 1 ${a},${-r}Z`,'#fdba74','#c2410c',1.3);
   const r2=r-2.4;s+=P(`M${a},${-r2}H${b}A${r2},${r2} 0 0 1 ${b},${r2}H${a}A${r2},${r2} 0 0 1 ${a},${-r2}Z`,'#ffedd5','#ea580c',.9);
   const n=Math.max(3,Math.round(L0/8)),st=(L0-6)/n;for(let k=0;k<n;k++){const x=-L0/2+3+st*(k+.5),up=k%2===0;s+=L(`M${f(x)},${up?-r2:r2}V${f(up?r2*.35:-r2*.35)}`,'#ea580c',1.6);}return s;},
 chloro(L0=44,W=20){let s=E(0,0,L0/2,W/2,'#86efac','#15803d',1.3)+E(0,0,L0/2-2.2,W/2-2.2,'none','#22c55e',.8);
   const n=Math.max(3,Math.round(L0/10)),st=(L0-12)/n;let lam='';for(let k=0;k<n;k++){const x=-L0/2+6+st*(k+.5);for(let j=0;j<4;j++)s+=`<rect x="${f(x-3.2)}" y="${f(-W*.28+j*W*.14)}" width="6.4" height="${f(W*.11)}" rx="1" fill="#16a34a"/>`;if(k)lam+=`M${f(x-st+3.2)},${f((k%2?-1:1)*W*.06)}L${f(x-3.2)},${f((k%2?1:-1)*W*.06)}`;}
   return s+L(lam,'#15803d',.8);},
 nucleus(r=40){let s=C(0,0,r,'#ede9fe','#6d28d9',1.6)+C(0,0,r-3,'none','#8b5cf6',.8);
   for(let a=0;a<360;a+=40){const t=a*Math.PI/180;s+=C(Math.cos(t)*(r-1.5),Math.sin(t)*(r-1.5),1.7,'#ede9fe','none');}
   const R=rng(r*7);let ch='';for(let k=0;k<7;k++){const x=(R()-.5)*r*1.1,y=(R()-.5)*r*1.1;ch+=`M${f(x)},${f(y)}q${f(4+R()*4)},${f(-4-R()*3)} ${f(8+R()*4)},0t${f(7)},${f(2)}`;}
   return s+L(ch,'#a78bfa',1.1)+C(r*.18,-r*.12,r*.3,'#7c3aed','#5b21b6',1)+hi(r*.1,-r*.2,r*.12,r*.07);},
 golgi(sc=1){let s='';[[-14,30],[-7,34],[0,36],[7,32],[14,26]].forEach(([y,w])=>{s+=L(`M${-w/2},${y+4}Q0,${y-6} ${w/2},${y+4}`,'#d97706',5.4)+L(`M${-w/2},${y+4}Q0,${y-6} ${w/2},${y+4}`,'#fde68a',3);});
   return G(0,0,0,sc,s+C(-21,6,2.6,'#fde68a','#d97706',.9)+C(22,10,3,'#fde68a','#d97706',.9)+C(25,-2,2.2,'#fde68a','#d97706',.9));},
 rer(sc=1){let s='',d='';[-10,0,10].forEach(y=>{const p=`M-30,${y}C-20,${y-7} -10,${y+7} 0,${y}S20,${y-7} 30,${y}`;s+=L(p,'#3b82f6',5.6)+L(p,'#bfdbfe',3);for(let x=-28;x<=28;x+=5){const yy=y+Math.sin((x+30)/20*Math.PI)*-3.4;d+=C(x,yy-3.6,.95,'#1e3a8a')+C(x+2.5,yy+3.6,.95,'#1e3a8a');}});return G(0,0,0,sc,s+d);},
 ser(sc=1){const p='M-28,6C-18,-6 -8,10 2,0S18,-10 28,2M2,0C6,10 14,16 22,14M-14,2C-16,-8 -10,-14 -2,-16';return G(0,0,0,sc,L(p,'#14b8a6',5.2)+L(p,'#ccfbf1',2.6));},
 lyso(r=7){return C(0,0,r,'#bbf7d0','#15803d',1.2)+C(-r*.3,-r*.2,.9,'#15803d')+C(r*.25,r*.1,.9,'#15803d')+C(-r*.05,r*.4,.9,'#15803d')+hi(-r*.3,-r*.4,r*.35,r*.2);},
 centro(){const c=(x,y,a)=>G(x,y,a,1,`<rect x="-3.5" y="-7" width="7" height="14" rx="1.5" fill="#fca5a5" stroke="#b91c1c" stroke-width="1"/>`+L('M-3.5,-3.5H3.5M-3.5,0H3.5M-3.5,3.5H3.5','#b91c1c',.6));return c(-5,0,0)+c(6,0,90);},
 vac(r=4){return C(0,0,r,'#fef3c7','#d97706',.9);}
};

/* ---------- registration helper ---------- */
const PARTS=window.BIO_PARTS={};
const B=(cat,key,n,en,w,h,o,draw,parts)=>{def(cat,key,n,en,w,h,Object.assign({s:'#334155',sw:1.4},o),draw);if(parts)PARTS[key]=parts;};

/* =================== CELLS =================== */
B('bio_cell','bio_animal_cell','เซลล์สัตว์','animal cell',320,230,{f:'#fdf2f8',s:'#db2777',sw:3,al:'เซลล์สัตว์ animal cell eukaryote ยูคาริโอต'},p=>{
  let s=P('M40,60C70,10 230,8 280,45C320,75 315,170 275,200C230,232 90,232 45,200C10,170 12,95 40,60Z',p.f,p.s,p.sw);
  const R=rng(11);for(let k=0;k<34;k++){const x=40+R()*240,y=40+R()*160;if(Math.hypot(x-130,y-115)<50)continue;s+=C(x,y,1.2,'#475569');}
  s+=G(128,172,0,.9,ORG.rer())+G(186,74,-62,.8,ORG.rer())+G(205,150,10,1,ORG.ser())+G(218,102,-20,.95,ORG.golgi())+G(244,78,0,1,ORG.vac())
   +G(250,128,0,1,ORG.vac(3.4))+G(70,82,-30,1,ORG.mito(40,18))+G(250,172,20,1,ORG.mito(36,16))+G(82,165,40,1,ORG.mito(30,14))+G(265,70,0,1,ORG.lyso(7))+G(170,198,0,1,ORG.lyso(6))+G(190,54,0,1,ORG.centro())+G(130,115,0,1,ORG.nucleus(42));
  return s+C(60,125,1.6,'#1e293b');},
 {membrane:[307,122],cytoplasm:[215,196],nucleus:[100,85],nucleolus:[138,108],mito:[70,82],rer:[128,172],ser:[205,150],golgi:[218,102],lyso:[265,70],centro:[190,54],ribo:[60,125],vesicle:[244,78]});

B('bio_cell','bio_plant_cell','เซลล์พืช','plant cell',320,240,{f:'#f7fee7',s:'#4d7c0f',sw:2,al:'เซลล์พืช plant cell คลอโรพลาสต์ ผนังเซลล์'},p=>{
  let s=`<rect x="6" y="6" width="308" height="228" rx="18" fill="#bef264" stroke="${p.s}" stroke-width="${p.sw}"/><rect x="14" y="14" width="292" height="212" rx="12" fill="${p.f}" stroke="#65a30d" stroke-width="1.4"/>`;
  s+=P('M128,58C160,40 250,38 268,66C284,92 282,170 262,190C236,212 150,208 126,190C104,172 102,80 128,58Z','#dbeafe','#3b82f6',1.8)+hi(160,70,30,8);
  const R=rng(5);for(let k=0;k<18;k++){const x=22+R()*80,y=24+R()*190;s+=C(x,y,1.1,'#475569');}
  s+=G(60,70,90,.55,ORG.golgi())+G(62,172,0,.62,ORG.rer())+G(62,120,0,1,ORG.nucleus(26));
  [[150,27,0],[230,27,0],[293,118,90],[220,216,0],[40,205,30],[293,190,90]].forEach(([x,y,a])=>s+=G(x,y,a,1,ORG.chloro(30,14)));
  s+=G(140,216,0,1,ORG.mito(26,12))+G(282,42,30,1,ORG.mito(24,11))+G(40,30,-20,1,ORG.mito(24,11));return s;},
 {wall:[9,150],membrane:[90,226],cytoplasm:[95,40],nucleus:[62,96],nucleolus:[66,117],vacuole:[200,125],tonoplast:[262,190],chloro:[150,27],mito:[140,216],golgi:[60,70],rer:[62,172]});

B('bio_cell','bio_bacterium','เซลล์แบคทีเรีย (โพรคาริโอต)','bacterium prokaryotic cell',340,130,{f:'#ecfeff',s:'#0891b2',al:'แบคทีเรีย โพรคาริโอต bacteria prokaryote'},p=>{
  let s=L('M250,65C262,52 270,78 282,65S302,52 312,65S330,78 338,65','#475569',2.2);
  [[70,14,64,2],[130,14,128,1],[190,14,194,2],[90,116,86,128],[170,116,174,128]].forEach(([x1,y1,x2,y2])=>s+=L(`M${x1},${y1+(y1<60?8:-8)}L${x2},${y2}`,'#64748b',1.4));
  s+=`<rect x="6" y="14" width="244" height="102" rx="51" fill="#fef3c7" fill-opacity=".75" stroke="#d97706" stroke-width="1.4" stroke-dasharray="5 3"/><rect x="14" y="22" width="228" height="86" rx="43" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2.6"/><rect x="19" y="27" width="218" height="76" rx="38" fill="${p.f}" stroke="${p.s}" stroke-width="1.6"/>`;
  const R=rng(21);for(let k=0;k<40;k++){const x=36+R()*186,y=36+R()*58;if(Math.abs(x-124)<34&&Math.abs(y-64)<18)continue;s+=C(x,y,1.5,'#1e3a8a');}
  s+=L('M96,62C100,46 118,50 116,62S128,80 138,66S150,48 152,62S136,82 120,76S94,80 96,62Z','#be185d',1.6)+L('M104,70C110,58 124,66 132,58','#be185d',1.3);
  s+=C(194,50,7,'none','#be185d',1.6)+C(204,84,5,'none','#be185d',1.4);return s;},
 {capsule:[70,15],wall:[150,23],membrane:[150,103],cytoplasm:[60,52],nucleoid:[124,64],plasmid:[194,50],ribo:[80,76],flagellum:[300,62],pilus:[66,4]});

B('bio_cell','bio_membrane','เยื่อหุ้มเซลล์ (Fluid mosaic)','cell membrane fluid mosaic phospholipid bilayer',320,160,{al:'เยื่อหุ้มเซลล์ ฟอสโฟลิพิด membrane bilayer โปรตีน'},p=>{
  let s='';const hd='#fb923c',hs='#c2410c',tl='#ca8a04';
  const pl=(x,y,dn)=>{const d=dn?1:-1;return L(`M${x-2.4},${y+d*5}C${x-4},${y+d*12} ${x-1},${y+d*18} ${x-2.4},${y+d*28}M${x+2.4},${y+d*5}L${x+2.4},${y+d*12}L${x+5},${y+d*17}L${x+3},${y+d*28}`,tl,1.3)+C(x,y,6,hd,hs,1);};
  for(let x=12;x<=310;x+=14){if((x>78&&x<134)||(x>190&&x<248))continue;s+=pl(x,60,1)+pl(x,120,0);}
  s+=`<rect x="265" y="66" width="7" height="12" rx="2" fill="#fde047" stroke="#a16207" stroke-width=".9"/>`+L('M268.5,78V90','#a16207',1.4);
  s+=P('M84,34C80,20 130,18 128,34C138,60 136,95 128,118C124,134 86,134 82,118C74,95 74,58 84,34Z','#c4b5fd','#6d28d9',1.4)+hi(96,50,8,14);
  [[106,30],[106,22],[100,14],[112,14],[95,6]].forEach(([x,y],i)=>{if(i)s+=L(`M${[106,106,106,100][i-1]},${[30,22,22,14][i-1]}L${x},${y}`,'#15803d',1.2);});
  [[106,30],[106,22],[100,14],[112,14],[95,6]].forEach(([x,y])=>s+=C(x,y,3.4,'#86efac','#15803d',1));
  [[166,46],[160,38],[172,38],[166,30]].forEach(([x,y],i)=>{s+=L(`M166,54L${x},${y}`,'#15803d',1);});[[166,46],[160,38],[172,38],[166,30]].forEach(([x,y])=>s+=C(x,y,3,'#86efac','#15803d',.9));
  s+=P('M196,38C194,30 214,30 214,38V140C214,148 196,148 196,140Z','#93c5fd','#1d4ed8',1.3)+P('M222,38C222,30 242,30 240,38V140C240,148 222,148 222,140Z','#93c5fd','#1d4ed8',1.3)+C(218,86,3.2,'#f472b6','#be185d',.9)+C(218,104,3.2,'#f472b6','#be185d',.9)+arw(218,26,218,46,{s:'#be185d',sw:1.2},5);
  s+=E(160,138,15,8,'#f9a8d4','#be185d',1.2);
  s+=T(10,8,'นอกเซลล์',8.5,'#64748b',{a:'start'})+T(10,153,'ในเซลล์ (ไซโทพลาซึม)',8.5,'#64748b',{a:'start'});return s;},
 {head:[54,60],tail:[54,78],bilayer:[26,90],integral:[106,92],glycoprotein:[100,14],glycolipid:[166,38],channel:[204,70],cholesterol:[268,70],peripheral:[160,138]});

B('bio_cell','bio_phospholipid','โมเลกุลฟอสโฟลิพิด','phospholipid molecule',44,100,{al:'ฟอสโฟลิพิด phospholipid ไขมัน'},p=>C(22,16,13,'#fb923c','#c2410c',1.3)+T(22,16.5,'P',10,'#7c2d12',{b:1})+L('M16,29C14,46 18,62 15,94','#ca8a04',2.4)+L('M28,29V52L34,62L30,94','#ca8a04',2.4),{head:[22,16],tail:[22,70]});

B('bio_cell','bio_rbc','เซลล์เม็ดเลือดแดง','red blood cell erythrocyte',90,90,{al:'เม็ดเลือดแดง rbc erythrocyte'},p=>C(45,45,40,'#ef4444','#991b1b',1.6)+C(45,45,22,'#f87171','none')+C(45,45,14,'#fca5a5','none')+hi(30,26,12,6));
B('bio_cell','bio_rbc_side','เม็ดเลือดแดง (ภาพด้านข้าง)','red blood cell side view biconcave',120,50,{al:'เม็ดเลือดแดง เว้าสองด้าน biconcave'},p=>P('M10,25C10,6 34,4 46,12C54,17 66,17 74,12C86,4 110,6 110,25C110,44 86,46 74,38C66,33 54,33 46,38C34,46 10,44 10,25Z','#ef4444','#991b1b',1.5)+hi(26,16,10,4));
B('bio_cell','bio_wbc','เซลล์เม็ดเลือดขาว (นิวโทรฟิล)','white blood cell neutrophil',90,90,{al:'เม็ดเลือดขาว wbc leukocyte'},p=>{const R=rng(9);let s=C(45,45,40,'#f1f5f9','#64748b',1.6);for(let k=0;k<26;k++)s+=C(14+R()*62,14+R()*62,1,'#c4b5fd');return s+P('M24,40C18,28 34,22 38,32C42,22 56,22 56,34C66,30 72,44 62,50C66,60 54,66 48,58C44,66 30,64 32,54C22,56 18,46 24,40Z','#8b5cf6','#5b21b6',1.3);});
B('bio_cell','bio_platelet','เกล็ดเลือด','platelets thrombocytes',70,40,{al:'เกล็ดเลือด platelet'},p=>E(16,20,12,8,'#e9d5ff','#7e22ce',1.2)+E(42,14,9,6,'#e9d5ff','#7e22ce',1.2)+E(56,28,10,7,'#e9d5ff','#7e22ce',1.2)+C(15,19,1.2,'#7e22ce')+C(43,14,1,'#7e22ce')+C(56,28,1.1,'#7e22ce'));

B('bio_cell','bio_neuron','เซลล์ประสาท (นิวรอน)','neuron nerve cell myelin axon',380,150,{al:'เซลล์ประสาท นิวรอน neuron axon dendrite'},p=>{
  const c='#c084fc',k='#7e22ce';let s='';
  [['M60,62C44,40 30,30 12,22M38,42C34,30 36,20 30,8','M48,70C30,72 18,80 4,78M24,74C18,64 10,60 4,58'],['M62,92C48,108 34,118 16,128M36,114C26,112 20,104 10,104','M80,96C82,116 76,130 70,144M80,118C88,126 96,128 104,138'],['M78,54C84,36 94,26 104,14M90,36C82,26 82,16 76,6']].flat().forEach(d=>s+=L(d,k,4.6)+L(d,c,2.6));
  s+=L('M110,75H332',k,6)+L('M110,75H332',c,3.6);
  [[124,170],[178,224],[232,278]].forEach(([a,b])=>s+=`<rect x="${a}" y="65" width="${b-a}" height="20" rx="10" fill="#fde68a" stroke="#d97706" stroke-width="1.4"/>`+E((a+b)/2,70,5,2.6,'#d97706','none'));
  s+=P('M332,75C344,70 350,56 358,46M332,75C346,78 352,90 360,102M340,73C352,72 360,74 366,74','none','#7e22ce',2.4);
  [[358,46],[360,102],[366,74]].forEach(([x,y])=>s+=C(x+3,y,5.5,'#e9d5ff',k,1.4));
  s+=P('M70,46C92,46 100,62 112,70V80C100,88 92,104 70,104C46,104 38,90 40,74C42,58 50,46 70,46Z','#e9d5ff',k,1.8)+C(68,74,10,'#a855f7','#6b21a8',1.2)+C(71,71,3,'#581c87');return s;},
 {dendrite:[20,24],soma:[56,94],nucleus:[68,74],hillock:[108,75],axon:[300,75],myelin:[148,66],node:[174,75],schwann:[201,70],terminal:[364,46]});

B('bio_cell','bio_sperm','เซลล์อสุจิ','sperm cell spermatozoon',170,40,{al:'อสุจิ sperm สเปิร์ม'},p=>L('M56,20C76,10 90,30 110,20S144,10 166,20','#64748b',1.8)+`<rect x="34" y="16" width="24" height="8" rx="4" fill="#fdba74" stroke="#c2410c" stroke-width="1.1"/>`+E(20,20,16,11,'#bfdbfe','#1d4ed8',1.4)+P('M6,14C8,8 16,6 22,8C12,10 8,14 6,20Z','#fde68a','#ca8a04',1)+E(22,21,8,6,'#3b82f6','none'),{acrosome:[10,12],head:[22,22],midpiece:[46,20],tail:[130,20]});
B('bio_cell','bio_ovum','เซลล์ไข่','egg cell ovum',150,150,{al:'เซลล์ไข่ ovum egg'},p=>{let s='';for(let a=0;a<360;a+=20){const t=a*Math.PI/180;s+=C(75+Math.cos(t)*64,75+Math.sin(t)*64,8,'#fde68a','#ca8a04',1);}return s+C(75,75,54,'#e0f2fe','#0284c7',4)+C(75,75,50,'#fff7ed','#ea580c',1)+C(80,70,14,'#c4b5fd','#6d28d9',1.3)+C(83,67,4,'#6d28d9');},{corona:[75,11],zona:[75,22],cytoplasm:[55,95],nucleus:[80,70]});

/* single organelles */
B('bio_cell','bio_mito','ไมโทคอนเดรีย','mitochondrion',160,72,{al:'ไมโทคอนเดรีย mitochondria หายใจระดับเซลล์ ATP'},()=>G(80,36,0,1,ORG.mito(150,64)),{outer:[80,4],inner:[80,10],cristae:[54,40],matrix:[94,28]});
B('bio_cell','bio_chloro','คลอโรพลาสต์','chloroplast thylakoid grana',160,76,{al:'คลอโรพลาสต์ chloroplast สังเคราะห์ด้วยแสง'},()=>G(80,38,0,1,ORG.chloro(152,70)),{envelope:[80,3],granum:[33,30],stroma:[60,52],lamella:[52,38]});
B('bio_cell','bio_nucleus','นิวเคลียส','nucleus nuclear envelope nucleolus',110,110,{al:'นิวเคลียส nucleus'},()=>G(55,55,0,1,ORG.nucleus(50)),{envelope:[20,20],pore:[105,55],nucleolus:[64,49],chromatin:[40,66]});
B('bio_cell','bio_golgi','กอลจิบอดี','golgi apparatus',90,70,{al:'กอลจิ golgi'},()=>G(45,32,0,1.6,ORG.golgi()));
B('bio_cell','bio_rer','ร่างแหเอนโดพลาซึมชนิดผิวขรุขระ','rough endoplasmic reticulum',100,54,{al:'ER RER ร่างแหเอนโดพลาซึม'},()=>G(50,27,0,1.5,ORG.rer()));
B('bio_cell','bio_ser','ร่างแหเอนโดพลาซึมชนิดผิวเรียบ','smooth endoplasmic reticulum',100,60,{al:'ER SER ร่างแหเอนโดพลาซึม'},()=>G(50,32,0,1.6,ORG.ser()));
B('bio_cell','bio_lyso','ไลโซโซม','lysosome',40,40,{al:'ไลโซโซม lysosome'},()=>G(20,20,0,1,ORG.lyso(17)));
B('bio_cell','bio_centrosome','เซนโทรโซม (เซนทริโอล)','centrosome centrioles',50,40,{al:'เซนทริโอล centriole เซนโทรโซม'},()=>G(25,20,0,2,ORG.centro()));

/* =================== GENETICS =================== */
const chrX=(cx,cy,len,ang,c,w=7)=>{const h=len/2,b=w*.55;return G(cx,cy,ang,1,L(`M${-b},${-h}Q${b*.3},0 ${-b},${h}`,shade(c,-.35),w+1.6)+L(`M${b},${-h}Q${-b*.3},0 ${b},${h}`,shade(c,-.35),w+1.6)+L(`M${-b},${-h}Q${b*.3},0 ${-b},${h}`,c,w)+L(`M${b},${-h}Q${-b*.3},0 ${b},${h}`,c,w)+C(0,0,w*.45,'#fff',shade(c,-.4),1));};
const chrI=(cx,cy,len,ang,c,w=7)=>{const h=len/2;return G(cx,cy,ang,1,L(`M0,${-h}V${h}`,shade(c,-.35),w+1.6)+L(`M0,${-h}V${h}`,c,w)+C(0,-h*.15,w*.42,'#fff',shade(c,-.4),1));};
window.BIO_CHR={chrX,chrI};
B('bio_gen','bio_chr_x','โครโมโซม (จำลองตัวแล้ว)','chromosome replicated sister chromatids',50,100,{f:'#ef4444',al:'โครโมโซม chromosome โครมาทิด'},p=>{const c=p.f&&p.f!=='none'?p.f:'#ef4444';return chrX(25,50,88,0,c,12)+L('M12,26H18M32,26H38M13,72H19M31,72H37','#fff',1.6,' opacity=".7"');},{chromatid:[12,20],centromere:[25,50]});
B('bio_gen','bio_chr_i','โครโมโซม (ยังไม่จำลองตัว)','chromosome unreplicated',30,100,{f:'#3b82f6',al:'โครโมโซม chromosome'},p=>chrI(15,50,88,0,p.f&&p.f!=='none'?p.f:'#3b82f6',12));
B('bio_gen','bio_homolog','โครโมโซมคู่เหมือน','homologous chromosome pair',90,100,{al:'คู่เหมือน homologous ฮอมอโลกัส'},p=>chrX(25,50,86,0,'#ef4444',11)+chrX(65,50,86,0,'#3b82f6',11)+`<rect x="16" y="20" width="18" height="5" fill="#fde047"/><rect x="56" y="20" width="18" height="5" fill="#fde047"/>`,{maternal:[25,80],paternal:[65,80],locus:[45,22]});
B('bio_gen','bio_dna_helix','DNA เกลียวคู่','DNA double helix',90,260,{al:'ดีเอ็นเอ DNA เกลียวคู่ double helix'},p=>{let back='',front='',rung='';const X=(y,ph)=>45+32*Math.sin(y/26+ph);const cols=['#f87171','#60a5fa','#4ade80','#facc15'];
  let i=0;for(let y=8;y<=252;y+=11,i++){const a=X(y,0),b=X(y,Math.PI);const c=cols[i%4],c2=cols[[1,0,3,2][i%4]];rung+=L(`M${f(a)},${y}L${f((a+b)/2)},${y}`,c,4)+L(`M${f((a+b)/2)},${y}L${f(b)},${y}`,c2,4);}
  let d1='',d2='';for(let y=4;y<=256;y+=2){d1+=(y===4?'M':'L')+f(X(y,0))+','+y;d2+=(y===4?'M':'L')+f(X(y,Math.PI))+','+y;}
  return rung+L(d2,'#1e3a8a',5)+L(d2,'#93c5fd',2.2)+L(d1,'#7c2d12',5)+L(d1,'#fdba74',2.2);},{backbone:[77,40],basepair:[45,66]});
B('bio_gen','bio_nucleotide','นิวคลีโอไทด์','nucleotide phosphate sugar base',130,80,{tag:'A',al:'นิวคลีโอไทด์ nucleotide'},p=>{const b=(p.tag||'A').toUpperCase().slice(0,1);const col={A:'#f87171',T:'#60a5fa',G:'#4ade80',C:'#facc15',U:'#c084fc'}[b]||'#e5e7eb';
  return L('M30,32L44,38M70,40H92','#475569',2)+C(18,30,13,'#fde047','#a16207',1.4)+T(18,30.5,'P',12,'#713f12',{b:1})+P('M56,22L72,32L66,52H46L40,32Z','#fdba74','#c2410c',1.4)+T(56,39,'S',10,'#7c2d12',{b:1})+`<rect x="92" y="24" width="34" height="32" rx="4" fill="${col}" stroke="${shade(col,-.45)}" stroke-width="1.4"/>`+T(109,40.5,esc(b),15,'#111827',{b:1});},{phosphate:[18,30],sugar:[56,38],base:[109,40]});
B('bio_gen','bio_trna','tRNA','transfer RNA anticodon',90,130,{tag:'UAC',al:'ทีอาร์เอ็นเอ tRNA แอนติโคดอน'},p=>{const ac=(p.tag||'UAC').toUpperCase().slice(0,3);const c='#a78bfa',k='#6d28d9';
  let s=L('M41,4V48M49,8V48',k,2.6)+L('M41,48C30,52 26,54 22,56M49,48C60,52 64,54 68,56M41,52C42,64 42,74 41,86M49,52C48,64 48,74 49,86',k,2.6)+C(18,58,11,'#ede9fe',k,2)+C(72,58,11,'#ede9fe',k,2)+C(45,100,15,'#ede9fe',k,2);
  s+=T(53,6,'3′',8,'#475569',{a:'start'})+T(36,12,'5′',8,'#475569',{a:'end'})+C(49,2,4,'#fbbf24','#b45309',1)+T(58,2,'กรดอะมิโน',7.5,'#b45309',{a:'start'});
  [...ac].forEach((b,i)=>s+=`<rect x="${32+i*9}" y="112" width="8" height="13" rx="2" fill="${{A:'#f87171',U:'#c084fc',G:'#4ade80',C:'#facc15'}[b]||'#ddd'}" stroke="${k}" stroke-width=".8"/>`+T(36+i*9,119,esc(b),7,'#111827',{b:1}));return s;},{amino:[49,2],anticodon:[45,120],loop:[18,58]});
B('bio_gen','bio_ribosome','ไรโบโซม (กำลังแปลรหัส)','ribosome translation mRNA E P A sites',160,120,{al:'ไรโบโซม ribosome แปลรหัส translation'},p=>{let s=E(80,46,62,36,'#bfdbfe','#1d4ed8',1.6)+L('M0,82H160','#c084fc',4);for(let x=6;x<160;x+=18)s+=L(`M${x},79V85`,'#7e22ce',1);
  s+=E(80,94,56,18,'#93c5fd','#1d4ed8',1.6);[['E',46],['P',80],['A',114]].forEach(([t,x])=>s+=`<rect x="${x-15}" y="40" width="30" height="34" rx="6" fill="#eff6ff" stroke="#60a5fa" stroke-dasharray="3 2"/>`+T(x,32,t,11,'#1e3a8a',{b:1}));
  return s+T(4,72,'5′',8,'#7e22ce',{a:'start'})+T(156,72,'3′',8,'#7e22ce',{a:'end'});},{large:[80,14],small:[80,108],mrna:[150,82],esite:[46,58],psite:[80,58],asite:[114,58]});

/* --- mitosis stages (2n = 4: long + short homologous pairs; red = from mother, blue = from father) --- */
const RED='#ef4444',BLU='#3b82f6',RD2='#f87171',BL2='#60a5fa';
const cellBase=(extra='')=>C(70,70,62,'#f0f9ff','#0369a1',1.8)+extra;
const aster=(x,y)=>{let s='';for(let a=0;a<360;a+=45){const t=a*Math.PI/180;s+=L(`M${f(x+Math.cos(t)*4)},${f(y+Math.sin(t)*4)}L${f(x+Math.cos(t)*9)},${f(y+Math.sin(t)*9)}`,'#94a3b8',.8);}return s+G(x,y,0,.55,ORG.centro());};
B('bio_gen','bio_mit_inter','อินเตอร์เฟส','interphase cell cycle',140,140,{al:'อินเตอร์เฟส interphase ไมโทซิส mitosis'},p=>cellBase(C(70,74,32,'#ede9fe','#6d28d9',1.5)+L('M52,64q6,-6 12,0t12,0M58,84q5,6 10,0t10,2M60,74q4,-5 9,0',RED,1.3)+L('M74,62q5,5 10,0M50,78q6,4 10,-1t10,1M76,88q4,-4 9,0',BLU,1.3)+C(80,72,6,'#7c3aed')+aster(70,24)));
B('bio_gen','bio_mit_pro','โพรเฟส','prophase mitosis',140,140,{al:'โพรเฟส prophase ไมโทซิส'},p=>cellBase(C(70,74,32,'none','#6d28d9',1.4,' stroke-dasharray="5 4"')+L('M30,26Q70,8 110,26','#94a3b8',.8)+aster(34,28)+aster(106,28)+chrX(58,64,24,-20,RED)+chrX(80,66,24,25,BLU)+chrX(62,88,15,40,RD2)+chrX(84,86,15,-30,BL2)));
B('bio_gen','bio_mit_meta','เมทาเฟส','metaphase mitosis',140,140,{al:'เมทาเฟส metaphase ไมโทซิส'},p=>{let s='';const ys=[[40,24,RED],[60,24,BLU],[82,15,RD2],[100,15,BL2]];ys.forEach(([y])=>s+=L(`M16,70L70,${y}M124,70L70,${y}`,'#94a3b8',.8));s+=L('M16,70Q70,48 124,70M16,70Q70,92 124,70','#cbd5e1',.7);
  return cellBase(s+L('M70,28V112','#94a3b8',.8,' stroke-dasharray="3 3"')+aster(14,70)+aster(126,70)+ys.map(([y,l,c])=>chrX(70,y,l,0,c)).join(''));});
B('bio_gen','bio_mit_ana','แอนาเฟส','anaphase mitosis sister chromatids separate',140,140,{al:'แอนาเฟส anaphase ไมโทซิส'},p=>{let s='';const vs=(x,y,len,c,dir)=>L(`M${x+dir*len*.8},${y-7}L${x},${y}L${x+dir*len*.8},${y+7}`,shade(c,-.3),6.6)+L(`M${x+dir*len*.8},${y-7}L${x},${y}L${x+dir*len*.8},${y+7}`,c,5);
  const rows=[[48,24,RED],[62,24,BLU],[80,15,RD2],[94,15,BL2]];rows.forEach(([y])=>s+=L(`M12,70L36,${y}M128,70L104,${y}`,'#94a3b8',.8));s+=L('M12,70Q70,50 128,70M12,70Q70,90 128,70','#cbd5e1',.7);
  return E(70,70,64,56,'#f0f9ff','#0369a1',1.8)+s+aster(12,70)+aster(128,70)+rows.map(([y,l,c])=>vs(36,y,l*.7,c,1)+vs(104,y,l*.7,c,-1)).join('');});
B('bio_gen','bio_mit_telo','เทโลเฟสและการแบ่งไซโทพลาซึม','telophase cytokinesis',140,140,{al:'เทโลเฟส telophase ไซโทไคนีซิส cytokinesis'},p=>{const nuc=x=>C(x,70,19,'#ede9fe','#6d28d9',1.3)+L(`M${x-10},64q4,-4 8,0t8,0`,RED,1.6)+L(`M${x-9},74q4,4 8,0t9,0`,BLU,1.6)+L(`M${x-4},80q3,3 6,0`,RD2,1.6)+L(`M${x+2},60q3,-3 6,0`,BL2,1.6);
  return P('M70,36C56,10 8,16 8,70C8,124 56,130 70,104C84,130 132,124 132,70C132,16 84,10 70,36Z','#f0f9ff','#0369a1',1.8)+nuc(38)+nuc(102)+G(30,40,0,.55,ORG.centro())+G(110,40,0,.55,ORG.centro());});

window.__bio={ORG,P,E,C,G,L,T,hi,rng,chrX,chrI,f};
})();
