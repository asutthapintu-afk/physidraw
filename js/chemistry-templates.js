/* PhysiDraw — Chemical equation tool + chemistry templates (Phase 2d).
   Equation syntax: 2H2(g) + O2(g) -> 2H2O(l) · equilibrium <=> · conditions ->[above][below] · charges Cu^2+, SO4^2- · electrons e^- */
"use strict";
(function(){
if(typeof CATS==='undefined'||!window.__chem)return;
const {mkBohr,mkAtom,molecule,place,addMol,angObj}=window.__chem;

/* ---------------- chemical equation object ---------------- */
const ARROWS=[['<=>','eq'],['⇌','eq'],['<->','both'],['->','fwd'],['→','fwd'],['<-','back'],['←','back']];
function ceParse(src){const out=[];let i=0,buf='';src=String(src);
  while(i<src.length){let m=null;for(const a of ARROWS)if(src.startsWith(a[0],i)){m=a;break;}
    if(m){if(buf){out.push({t:'text',s:buf});buf='';}i+=m[0].length;let above='',below='';
      if(src[i]==='['){const j=src.indexOf(']',i);if(j>0){above=src.slice(i+1,j);i=j+1;if(src[i]==='['){const k=src.indexOf(']',i);if(k>0){below=src.slice(i+1,k);i=k+1;}}}}
      out.push({t:'arr',k:m[1],above,below});continue;}
    buf+=src[i];i++;}
  if(buf)out.push({t:'text',s:buf});return out;}
/* Chemistry-aware conversion to the editor's rich-text markup: digits after an element/bracket become subscripts, ^2+ becomes a charge. */
function ceRich(s,auto){if(!auto)return s;let out='';const ch=Array.from(s);let i=0;
  while(i<ch.length){const c=ch[i];
    if(c==='^'){let j=i+1,t='';if(ch[j]==='{'){j++;while(j<ch.length&&ch[j]!=='}'){t+=ch[j];j++;}j++;}else{while(j<ch.length&&/[0-9+\-−]/.test(ch[j])){t+=ch[j];j++;}}out+='^{'+t.replace(/-/g,'−')+'}';i=j;continue;}
    if(c==='_'){let j=i+1,t='';if(ch[j]==='{'){j++;while(j<ch.length&&ch[j]!=='}'){t+=ch[j];j++;}j++;}else{t=ch[j]||'';j++;}out+='_{'+t+'}';i=j;continue;}
    if(/[0-9]/.test(c)&&/[A-Za-z)\]]/.test(out.slice(-1))){let t='';while(i<ch.length&&/[0-9]/.test(ch[i])){t+=ch[i];i++;}out+='_{'+t+'}';continue;}
    out+=c;i++;}
  return out;}
const _cv=document.createElement('canvas').getContext('2d');
function richWidth(str,size){const m=(t,sz)=>{_cv.font=`${sz}px ${SANS}`;return _cv.measureText(t).width;};let w=0,buf='';const ch=Array.from(str);let i=0;
  while(i<ch.length){const c=ch[i];if((c==='_'||c==='^')&&i+1<ch.length){if(buf){w+=m(buf,size);buf='';}let s='';i++;if(ch[i]==='{'){i++;while(i<ch.length&&ch[i]!=='}'){s+=ch[i];i++;}i++;}else{s=ch[i];i++;}w+=m(s,size*.68);continue;}buf+=c;i++;}
  return w+(buf?m(buf,size):0);}
function ceLayout(o){const size=o.size||22,auto=o.auto!==false,c=o.color||'#111827';const H=size*2.7,cy=H/2;let x=2,s='';
  const T=(str,x0,y0,sz)=>`<text x="${R2(x0)}" y="${R2(y0)}" font-size="${R2(sz)}" fill="${c}" dominant-baseline="central" font-family="${SANS}">${rich(str,sz)}</text>`;
  ceParse(o.text||'').forEach(seg=>{
    if(seg.t==='text'){const r=ceRich(seg.s,auto);s+=T(r,x,cy,size);x+=richWidth(r,size);}
    else{const cs=size*.6,ra=ceRich(seg.above,auto),rb=ceRich(seg.below,auto);const La=Math.max(size*2.1,Math.max(richWidth(ra,cs),richWidth(rb,cs))+size*.8);
      const x0=x+size*.3,x1=x0+La,hs=size*.32,sw=Math.max(1.2,size*.06);const st=`stroke="${c}" stroke-width="${R2(sw)}" stroke-linecap="round" fill="none"`;
      if(seg.k==='eq'){const g=size*.13;s+=`<path d="M${R2(x0)},${R2(cy-g)}H${R2(x1)}l${R2(-hs)},${R2(-hs*.6)}M${R2(x1)},${R2(cy+g)}H${R2(x0)}l${R2(hs)},${R2(hs*.6)}" ${st}/>`;}
      else{s+=`<path d="M${R2(x0)},${R2(cy)}H${R2(x1)}" ${st}/>`;if(seg.k!=='back')s+=head(x1,cy,0,hs*1.25,c);if(seg.k!=='fwd')s+=head(x0,cy,Math.PI,hs*1.25,c);}
      if(ra)s+=`<g transform="translate(${R2((x0+x1)/2)} 0)">${T(ra,-richWidth(ra,cs)/2,cy-size*.68,cs)}</g>`;
      if(rb)s+=`<g transform="translate(${R2((x0+x1)/2)} 0)">${T(rb,-richWidth(rb,cs)/2,cy+size*.72,cs)}</g>`;
      x=x1+size*.3;}});
  return {svg:s,W:Math.max(30,x+2),H};}
function mkEq(text,cx,cy,o={}){const e=Object.assign({id:uid(),type:'chemeq',text,size:22,auto:true,color:'#111827',x:0,y:0,w:100,h:60,rot:0,op:1,label:'',lp:'bottom',ls:'text',lsz:14,lc:'#111827'},o);const L=ceLayout(e);e.w=L.W;e.h=L.H;e.x=cx-L.W/2;e.y=cy-L.H/2;return e;}
TYPES.chemeq={name:'สมการเคมี',box:true,
  svg(o,exp){const L=ceLayout(o);o.w=L.W;o.h=L.H;return `<g transform="translate(${R2(o.x+o.w/2)} ${R2(o.y+o.h/2)}) rotate(${R2(o.rot||0)}) translate(${R2(-o.w/2)} ${R2(-o.h/2)})">${exp?'':`<rect width="${R2(o.w)}" height="${R2(o.h)}" fill="transparent"/>`}${L.svg}</g>`;},
  afterResize(o,or){o.size=clamp(R2((or.size||22)*o.h/or.h),8,140);const L=ceLayout(o);o.w=L.W;o.h=L.H;},
  act(o,a){const EX=['2H2(g) + O2(g) -> 2H2O(l)','N2(g) + 3H2(g) <=>[Fe][450 °C, 200 atm] 2NH3(g)','CaCO3(s) ->[Δ] CaO(s) + CO2(g)','Cu^2+(aq) + 2e^- -> Cu(s)','HCl(aq) + NaOH(aq) -> NaCl(aq) + H2O(l)','CH4(g) + 2O2(g) -> CO2(g) + 2H2O(g)'];if(a.startsWith('ex:'))o.text=EX[+a.slice(3)];if(a.startsWith('ins:'))o.text=(o.text||'')+a.slice(4);},
  panel(o){const ex=['2H₂ + O₂ → 2H₂O','สมดุลฮาเบอร์','CaCO₃ —Δ→','Cu²⁺ + 2e⁻','กรด + เบส','การเผาไหม้มีเทน'];
    return `<div class="ph"><div class="ttl">สมการเคมี<div class="sub">Chemical equation</div></div>${ACTS}</div>
    <div class="sec"><h5>สมการ</h5><textarea class="ta" data-p="text" id="fText" style="font-family:ui-monospace,Menlo,monospace;font-size:12.5px">${esc(o.text||'')}</textarea>
    <div class="sym">${['->','<=>','->[Δ]','(s)','(l)','(g)','(aq)','e^-','^+','^2+','^-','^2-','↑','↓','Δ','°'].map(t=>`<button data-act="x:ins:${esc(t)}" style="font-family:ui-monospace,monospace;font-size:11px">${esc(t)}</button>`).join('')}</div>
    <div class="hint">ตัวเลขหลังธาตุเป็นตัวห้อยอัตโนมัติ <code>H2SO4</code> · ประจุ <code>Fe^3+</code> <code>SO4^2-</code> · ลูกศร <code>-&gt;</code> สมดุล <code>&lt;=&gt;</code> · เงื่อนไขบน/ล่าง <code>-&gt;[Pt][500 °C]</code> · สัมประสิทธิ์เขียนหน้าสารได้ตามปกติ <code>2NaCl</code></div>
    <div class="row" style="margin-top:8px">${chk2('auto',o.auto!==false,'ตัวห้อยและประจุอัตโนมัติ')}</div></div>
    <div class="sec"><h5>ตัวอย่าง</h5><div class="row" style="flex-wrap:wrap;gap:5px">${ex.map((t,i)=>`<button class="btn" data-act="x:ex:${i}" style="height:26px;padding:0 8px;font-size:11.5px">${t}</button>`).join('')}</div></div>
    <div class="sec"><h5>รูปแบบ</h5><div class="row"><span class="lab">ขนาด</span><input type="range" min="10" max="72" step="1" data-p="size" value="${o.size||22}"><span class="val">${o.size||22}</span></div>${colorRow('สี','color',o.color||'#111827',PAL.slice(0,8))}</div>`;}};
const chk2=(p,on,label)=>`<label class="chk"><input type="checkbox" data-p="${p}" ${on?'checked':''}>${label}</label>`;
def('chem_proc','chem_eq','สมการเคมี','chemical equation reaction arrow',140,60,{al:'สมการ ปฏิกิริยา equation reaction',make:(x,y)=>[mkEq('2H2(g) + O2(g) -> 2H2O(l)',x,y)]},p=>tx(70,30,'A + B → C',18,'#111827'));
def('chem_proc','chem_eq_eq','สมการสมดุลพร้อมเงื่อนไข','equilibrium equation conditions',140,60,{al:'สมดุล equilibrium',make:(x,y)=>[mkEq('N2(g) + 3H2(g) <=>[Fe][450 °C] 2NH3(g)',x,y)]},p=>tx(30,30,'A',18,'#111827')+'<path d="M48,27H92l-6,-4M92,33H48l6,4" stroke="#111827" stroke-width="2" fill="none"/>'+tx(110,30,'B',18,'#111827'));

/* ---------------- template helpers ---------------- */
const S=(k,cx,cy,o={})=>mkShape(k,cx,cy,o);
const box=(t,cx,cy,w=150,h=44,o={})=>mkShape('rrect',cx,cy,Object.assign({w,h,fill:'#ffffff',stroke:'#94a3b8',sw:1.2,label:t,lp:'center',lsz:13,lc:'#1f2937'},o));
const lead=(x1,y1,b,side='l')=>{const l=mkLine('leader',x1,y1,0,0);l.a2={id:b.id,a:side};return l;};
const title=(t,x,y,sz=24)=>mkText(t,x,y,{size:sz,bold:true});
const note=(t,x,y,o={})=>mkText(t,x,y,Object.assign({size:13,color:'#64748b'},o));
const wire=(a,aa,b,ba,elbow='hv',o={})=>{const l=mkLine('wire',0,0,0,0,Object.assign({elbow},o));l.a1={id:a.id,a:aa};l.a2={id:b.id,a:ba};return l;};
function D(name,w,h,objs){const d=newDoc();d.name=name;d.w=w;d.h=h;d.objects=objs;const save=doc;doc=d;resolveAnchors();doc=save;return d;}
const rp=(o,lx,ly,dw,dh)=>{const sx=o.w/dw,sy=o.h/dh,[u,v]=rot((lx-dw/2)*sx,(ly-dh/2)*sy,(o.rot||0)*DEG);return [o.x+o.w/2+u,o.y+o.h/2+v];};

/* 1. Acid–base titration */
function T_titration(){const O=[];
  const stand=S('cl_rodstand',0,0,{w:110,h:360});stand.x=110;stand.y=150;
  const clamp=S('cl_clamp',0,0);clamp.x=110+25.5-12;clamp.y=183;
  const bur=S('cl_burette',0,0,{lv:.8,liq:'#bfdbfe'});bur.x=110+25.5-12+86-20;bur.y=121;
  const stir=S('cl_stirrer',0,0);stir.x=bur.x+20-65;stir.y=496-66;
  const fl=S('cl_flask',0,0,{lv:.26,liq:'#f9a8d4'});fl.x=bur.x+20-45;fl.y=442-115;
  O.push(stand,fl,stir,bur,clamp);
  const b1=box('บิวเรตต์\n(สารละลายเบส NaOH)',520,175,190,48),b2=box('ก๊อกปิด–เปิด\nควบคุมการไหล',520,290,170,46),b3=box('ขวดรูปกรวย (กรด HCl\n+ ฟีนอล์ฟทาลีน)',520,390,200,48),b4=box('เครื่องกวนแม่เหล็ก',520,470,170,34),b5=box('ขาตั้งและที่จับ',90,110,130,34);
  O.push(b1,b2,b3,b4,b5,lead(bur.x+27,bur.y+60,b1),lead(bur.x+38,bur.y+178,b2),lead(fl.x+70,fl.y+95,b3),lead(stir.x+120,stir.y+44,b4),lead(stand.x+25,clamp.y+18,b5,'b'));
  O.push(title('การไทเทรตกรด–เบส',450,52),mkEq('HCl(aq) + NaOH(aq) -> NaCl(aq) + H2O(l)',450,96,{size:18}),note('จุดยุติ: สารละลายเปลี่ยนเป็นสีชมพูอ่อนและคงอยู่ประมาณ 30 วินาที',450,560));
  return D('การไทเทรตกรด–เบส',880,600,O);}
/* 2. Filtration */
function T_filtration(){const O=[];const stand=S('cl_rodstand',0,0,{w:110,h:360});stand.x=110;stand.y=150;
  const clamp=S('cl_clamp',0,0);clamp.x=123.5;clamp.y=346;const fun=S('cl_filterfunnel',0,0,{lv:.4,liq:'#c8a26a'});fun.x=clamp.x+86-45;fun.y=clamp.y+18-60;
  const bk=S('cl_beaker',0,0,{lv:.22,liq:'#e0f2fe',tag:''});bk.x=fun.x+45-38;bk.y=496-106;const res=S('cl_crystals',0,0,{w:34,h:22,fill:'#a16207'});res.x=fun.x+28;res.y=fun.y+30;
  const rod=S('cl_stirrod',0,0,{rot:-25,h:140});rod.x=fun.x+70;rod.y=fun.y-130;
  O.push(stand,bk,fun,res,clamp,rod);
  const b1=box('สารผสมของแข็ง\nกับของเหลว',540,210,170,46),b2=box('กระดาษกรอง',540,300,140,34),b3=box('กากหรือตะกอน\n(residue)',540,370,160,46),b4=box('สารละลายที่ผ่าน\nการกรอง (filtrate)',540,460,170,46),b5=box('แท่งแก้วช่วยเท',540,130,140,34);
  O.push(b1,b2,b3,b4,b5,lead(fun.x+60,fun.y+24,b1),lead(fun.x+74,fun.y+12,b2),lead(res.x+24,res.y+10,b3),lead(bk.x+62,bk.y+92,b4),lead(rod.x+8,rod.y+50,b5));
  O.push(title('การกรอง (Filtration)',450,52),note('ใช้แยกของแข็งที่ไม่ละลายออกจากของเหลว',450,90,{size:14}));
  return D('การกรอง',880,560,O);}
/* 3. Simple distillation */
function T_distillation(){const O=[];const th=19.4;
  const stand=S('cl_rodstand',0,0,{w:110,h:360});stand.x=10;stand.y=160;
  const clamp=S('cl_clamp',0,0,{w:130,h:36});clamp.x=35.5-15.6;clamp.y=258;
  const fl=S('cl_distflask',0,0,{lv:.35,liq:'#fca5a5'});fl.x=clamp.x+111.8-40;fl.y=clamp.y+18-15;
  const bun=S('cl_bunsen',0,0);bun.x=fl.x+40-30;bun.y=520-138;
  const ther=S('cl_thermometer',0,0,{lv:.62});const tb=[fl.x+40,fl.y+25];ther.x=tb[0]-13;ther.y=tb[1]-158;
  const arm=[fl.x+98,fl.y+43];const con=S('cl_condenser',0,0,{rot:th});const c0=[arm[0]+110*Math.cos(th*DEG),arm[1]+110*Math.sin(th*DEG)];con.x=c0[0]-110;con.y=c0[1]-30;
  const end=[c0[0]+110*Math.cos(th*DEG),c0[1]+110*Math.sin(th*DEG)];const rf=S('cl_flask',0,0,{lv:.14,liq:'#bae6fd'});rf.x=end[0]-45+6;rf.y=520-115;
  [stand,bun,fl,ther,clamp,con,rf].forEach(o=>moveObj(o,130,0));O.push(stand,bun,fl,ther,clamp,con,rf);
  const win=rp(con,178,58,220,60),wout=rp(con,42,2,220,60);c0[0]+=130;
  const bIn=box('น้ำเย็นเข้า (ปลายล่าง)',win[0]+170,win[1]-40,170,32,{lc:'#1d4ed8'}),bOut=box('น้ำออก (ด้านบน)',wout[0]+30,wout[1]-70,140,32,{lc:'#1d4ed8'});
  const bT=box('เทอร์โมมิเตอร์ — กระเปาะ\nอยู่ระดับแขนข้างของขวด',ther.x-10,ther.y-36,210,46),bF=box('ขวดกลั่น\n(สารผสม)',fl.x-60,fl.y+150,110,46),bR=box('ขวดรับสารที่กลั่นได้\n(distillate)',rf.x+240,rf.y+80,170,46),bB=box('ตะเกียงบุนเซน',bun.x-70,bun.y+150,130,32),bC=box('เครื่องควบแน่น',c0[0]+40,c0[1]-70,140,32);
  O.push(bIn,bOut,bT,bF,bR,bB,bC,lead(win[0],win[1]+6,bIn,'l'),lead(wout[0],wout[1]-6,bOut,'b'),lead(ther.x+13,ther.y+30,bT,'b'),lead(fl.x+20,fl.y+90,bF,'t'),lead(rf.x+70,rf.y+90,bR,'l'),lead(bun.x+24,bun.y+110,bB,'t'),lead(c0[0],c0[1]-14,bC,'b'));
  O.push(title('การกลั่นอย่างง่าย (Simple distillation)',560,46),note('น้ำหล่อเย็นไหลเข้าทางปลายล่างและออกทางปลายบน (สวนทางกับไอ) จึงควบแน่นได้ดีที่สุด',500,598,{size:13}));
  return D('การกลั่นอย่างง่าย',1000,620,O);}
/* 4. Crystallization */
function T_crystal(){const O=[];const trip=S('cl_tripod',170,475);const bun=S('cl_bunsen',0,0,{w:39,h:91});bun.x=170-19.5;bun.y=520-91;
  const dish=S('cl_evapdish',0,0,{lv:.6,liq:'#bae6fd'});dish.x=170-55;dish.y=trip.y+5-30;
  const arrow=S('fat_arrow',360,470,{w:90,h:44,fill:'#e0e7ff',stroke:'#6366f1'});
  const dish2=S('cl_evapdish',0,0,{lv:.12,liq:'#bae6fd'});dish2.x=560-55;dish2.y=520-36;const cr=S('cl_crystals',560,494,{w:60,h:40});
  O.push(bun,trip,dish,arrow,dish2,cr,note('ปล่อยให้เย็น',360,430,{size:13,color:'#4338ca'}));
  const b1=box('สารละลายอิ่มตัวขณะร้อน',130,330,200,34),b2=box('ตะแกรงลวด',330,380,120,32),b3=box('ขาตั้งสามขา',330,560,120,32),b4=box('ผลึกที่เกิดขึ้น',680,420,140,34);
  O.push(b1,b2,b3,b4,lead(dish.x+40,dish.y+22,b1,'b'),lead(trip.x+92,trip.y+9,b2,'l'),lead(trip.x+92,trip.y+70,b3,'l'),lead(cr.x+50,cr.y+10,b4,'l'));
  O.push(title('การตกผลึก (Crystallization)',420,52),note('ระเหยตัวทำละลายบางส่วนจนสารละลายอิ่มตัว เมื่อเย็นลงความสามารถในการละลายลดลงจึงเกิดผลึก',420,92,{size:13}));
  return D('การตกผลึก',840,600,O);}
/* 5. Electrolysis of CuCl2 */
function T_electrolysis(){const O=[];const bk=S('cl_beaker',0,0,{w:240,h:240,lv:.62,liq:'#93c5fd',tag:''});bk.x=250;bk.y=270;
  const an=S('cl_electrode',0,0,{w:30,h:240,fill:'#4b5563',tag:'C'});an.x=318;an.y=210;const ca=S('cl_electrode',0,0,{w:30,h:240,fill:'#4b5563',tag:'C'});ca.x=432;ca.y=210;
  const cell=S('battery2',378,110,{label:'แหล่งจ่ายไฟตรง',lp:'top',lsz:12});
  const dep=S('rect',0,0,{w:24,h:70,fill:'#c87533',stroke:'#7c2d12',sw:1});dep.x=435;dep.y=392;
  O.push(bk,an,ca,dep,cell,wire(cell,'l',an,'t','hv'),wire(cell,'r',ca,'t','hv'));
  [[302,390],[308,412],[299,436],[305,368]].forEach(([x,y])=>O.push(S('circle',x,y,{w:8,h:8,fill:'#ffffff',stroke:'#16a34a',sw:1.2})));
  O.push(mkLine('arrow',300,96,340,96,{stroke:'#2563eb',sw:2,label:'e⁻',lc:'#2563eb',ls:'math'}),mkLine('arrow',420,96,460,96,{stroke:'#2563eb',sw:2,label:'e⁻',lc:'#2563eb',ls:'math'}));
  O.push(note('แอโนด (+)',190,240,{size:15,color:'#b91c1c',bold:true}),mkEq('2Cl^-(aq) -> Cl2(g) + 2e^-',160,280,{size:15}),note('แคโทด (−)',590,240,{size:15,color:'#1d4ed8',bold:true}),mkEq('Cu^2+(aq) + 2e^- -> Cu(s)',610,280,{size:15}),
    note('สารละลาย CuCl₂(aq)',370,540,{size:14,color:'#1e3a8a'}),note('ฟองแก๊สคลอรีน',215,410,{size:12,color:'#15803d'}),note('ทองแดงเกาะที่แคโทด',575,420,{size:12,color:'#9a3412'}),
    title('อิเล็กโทรลิซิสของสารละลาย CuCl₂',380,40),note('อิเล็กตรอนไหลจากแอโนดไปขั้วบวกของแหล่งจ่าย และจากขั้วลบไปยังแคโทด',380,600,{size:12.5}));
  return D('อิเล็กโทรลิซิส',780,630,O);}
/* 6. Galvanic (Daniell) cell */
function T_galvanic(){const O=[];const b1=S('cl_beaker',0,0,{w:190,h:200,lv:.6,liq:'#e0f2fe',tag:''});b1.x=90;b1.y=300;const b2=S('cl_beaker',0,0,{w:190,h:200,lv:.6,liq:'#60a5fa',tag:''});b2.x=470;b2.y=300;
  const zn=S('cl_electrode',0,0,{w:30,h:220,fill:'#9ca3af',tag:'Zn'});zn.x=150;zn.y=230;const cu=S('cl_electrode',0,0,{w:30,h:220,fill:'#c87533',tag:'Cu'});cu.x=580;cu.y=230;
  const sb=S('cl_saltbridge',0,0,{w:250,h:150,tag:'KNO₃'});sb.x=255;sb.y=290;const vm=S('voltmeter',382,120,{label:'1.10 V',lp:'top',lsz:14,lc:'#15803d'});
  O.push(b1,b2,sb,zn,cu,vm,wire(zn,'t',vm,'l','vh'),wire(vm,'r',cu,'t','hv'));
  O.push(mkLine('arrow',240,88,300,88,{stroke:'#2563eb',sw:2,label:'e⁻',lc:'#2563eb'}),mkLine('arrow',460,88,520,88,{stroke:'#2563eb',sw:2,label:'e⁻',lc:'#2563eb'}));
  O.push(note('แอโนด (−)',120,200,{size:15,color:'#b91c1c',bold:true}),mkEq('Zn(s) -> Zn^2+(aq) + 2e^-',170,548,{size:15}),note('แคโทด (+)',640,200,{size:15,color:'#1d4ed8',bold:true}),mkEq('Cu^2+(aq) + 2e^- -> Cu(s)',580,548,{size:15}),
    note('ZnSO₄(aq)',185,470,{size:13}),note('CuSO₄(aq)',565,470,{size:13,color:'#1e3a8a'}),note('NO₃⁻ ←',318,350,{size:12,color:'#7c2d12'}),note('→ K⁺',440,350,{size:12,color:'#7c2d12'}),note('สะพานเกลือ',380,330,{size:12,color:'#78350f'}),
    title('เซลล์กัลวานิก (เซลล์แดเนียล)',380,40),mkEq('Zn(s) + Cu^2+(aq) -> Zn^2+(aq) + Cu(s)',380,592,{size:16}),note('E°เซลล์ = E°แคโทด − E°แอโนด = 0.34 − (−0.76) = 1.10 V',380,624,{size:12.5}));
  return D('เซลล์กัลวานิก',760,650,O);}
/* 7. Reaction energy diagram (exothermic) */
function T_energy(){const O=[];const g=mkGraph(0,0);Object.assign(g,{x:120,y:120,w:560,h:360,fns:[{e:'3-2/(1+exp(-1.6(x-5)))+5exp(-(x-5)^2/1.8)',c:'#dc2626'}],xmin:0,xmax:10,ymin:0,ymax:8.5,grid:false,legend:false,ticks:false,xl:'การดำเนินไปของปฏิกิริยา',yl:'พลังงาน',sw:3});
  const L=46,R=14,T=14,B=30,pw=g.w-L-R,ph=g.h-T-B;const X=v=>g.x+L+v/10*pw,Y=v=>g.y+T+(8.5-v)/8.5*ph;const f=x=>3-2/(1+Math.exp(-1.6*(x-5)))+5*Math.exp(-((x-5)**2)/1.8);
  let pk=0,px=5;for(let x=3;x<=7;x+=.01){const y=f(x);if(y>pk){pk=y;px=x;}}
  O.push(g,mkLine('dashed',X(.3),Y(3),X(6.6),Y(3)),mkLine('dashed',X(px-.8),Y(pk),X(px+.8),Y(pk)),mkLine('dashed',X(6.2),Y(1),X(9.8),Y(1)));
  O.push(mkLine('double',X(2.6),Y(3),X(2.6),Y(pk),{stroke:'#7c3aed',label:'E_a',lc:'#7c3aed',ls:'math'}),mkLine('double',X(8.3),Y(3),X(8.3),Y(1),{stroke:'#0f766e',label:'ΔH',lc:'#0f766e',lo:-1}));
  O.push(mkLine('dashed',X(7.4),Y(3),X(8.8),Y(3)));
  O.push(note('สารตั้งต้น',X(1.2),Y(3)-16,{size:14,color:'#111827'}),note('ผลิตภัณฑ์',X(8.9),Y(1)-16,{size:14,color:'#111827'}),note('สารเชิงซ้อนกัมมันต์ (สภาวะแทรนซิชัน)',X(px),Y(pk)-22,{size:13,color:'#111827'}),
    note('ΔH < 0 : ปฏิกิริยาคายความร้อน',X(8.3),Y(3)-60,{size:13,color:'#0f766e'}),title('แผนภาพพลังงานของปฏิกิริยา',400,60),note('แผนภาพเชิงแนวคิด — ไม่ได้แสดงค่าพลังงานจริง',400,520));
  return D('แผนภาพพลังงานของปฏิกิริยา',800,560,O);}
/* 8. Heating curve of water */
function T_heating(){const O=[];const yT=t=>470-(t+20)*2.4;const P=[[100,yT(-20)],[120,yT(0)],[210,yT(0)],[390,yT(100)],[630,yT(100)],[650,yT(120)]];
  O.push(mkLine('arrow',90,490,720,490,{sw:1.6,label:'',stroke:'#111827'}),mkLine('arrow',90,490,90,140,{sw:1.6,stroke:'#111827'}));
  for(let i=0;i<P.length-1;i++)O.push(mkLine('line',P[i][0],P[i][1],P[i+1][0],P[i+1][1],{stroke:'#dc2626',sw:3.2}));
  O.push(mkLine('dashed',90,yT(0),120,yT(0)),mkLine('dashed',90,yT(100),390,yT(100)));
  O.push(note('0 °C',62,yT(0),{size:13,color:'#111827'}),note('100 °C',56,yT(100),{size:13,color:'#111827'}),note('อุณหภูมิ (°C)',140,130,{size:14,color:'#111827'}),note('พลังงานความร้อนที่ได้รับ',640,512,{size:14,color:'#111827'}),
    note('น้ำแข็ง',138,yT(-10)+4,{size:12.5,color:'#1d4ed8'}),note('หลอมเหลว\n(น้ำแข็ง + น้ำ)',165,yT(0)-26,{size:12.5,color:'#1d4ed8'}),note('น้ำ (ของเหลว)',330,yT(55),{size:12.5,color:'#1d4ed8'}),note('เดือด (น้ำ + ไอน้ำ)',510,yT(100)-18,{size:12.5,color:'#1d4ed8'}),note('ไอน้ำ',672,yT(118),{size:12.5,color:'#1d4ed8'}),
    title('กราฟการเปลี่ยนสถานะของน้ำเมื่อได้รับความร้อน',400,56),note('ช่วงเดือดยาวกว่าช่วงหลอมเหลวเพราะความร้อนแฝงของการกลายเป็นไอ (2260 J/g) มากกว่าการหลอมเหลว (334 J/g)\nความชันช่วงน้ำแข็งมากกว่าช่วงน้ำเพราะความจุความร้อนจำเพาะของน้ำแข็งน้อยกว่า · แผนภาพไม่ได้ใช้มาตราส่วนจริง',400,550,{size:12}));
  return D('กราฟการเปลี่ยนสถานะของน้ำ',800,600,O);}
/* 9. Phase diagram of water */
function T_phase(){const O=[];const TP=[300,380],CP=[600,170];const vap=mkLine('curve',TP[0],TP[1],CP[0],CP[1],{he:false,stroke:'#2563eb',sw:3,cx:480,cy:360});const sub=mkLine('curve',110,470,TP[0],TP[1],{he:false,stroke:'#2563eb',sw:3,cx:230,cy:462});const fus=mkLine('line',TP[0],TP[1],280,120,{stroke:'#2563eb',sw:3});
  O.push(mkLine('arrow',90,490,720,490,{sw:1.6,stroke:'#111827'}),mkLine('arrow',90,490,90,90,{sw:1.6,stroke:'#111827'}),sub,vap,fus);
  const yAtm=300;let t=.5;for(let k=0;k<40;k++){const y=(1-t)**2*TP[1]+2*(1-t)*t*360+t*t*CP[1];t+=(y-yAtm)/600;t=clamp(t,0,1);}const bx=(1-t)**2*TP[0]+2*(1-t)*t*480+t*t*CP[0];const mx=TP[0]+(280-TP[0])*(TP[1]-yAtm)/(TP[1]-120);
  O.push(mkLine('dashed',90,yAtm,690,yAtm),S('point',mx,yAtm,{label:'0 °C',lp:'left',lsz:12}),S('point',bx,yAtm,{label:'100 °C',lp:'right',lsz:12}),S('point',TP[0],TP[1],{fill:'#dc2626',stroke:'#dc2626'}),S('point',CP[0],CP[1],{fill:'#dc2626',stroke:'#dc2626'}));
  O.push(note('ของแข็ง',180,220,{size:18,color:'#111827',bold:true}),note('ของเหลว',420,220,{size:18,color:'#111827',bold:true}),note('แก๊ส',560,420,{size:18,color:'#111827',bold:true}),note('1 atm',62,yAtm,{size:12,color:'#111827'}),
    note('จุดร่วมสาม\n0.01 °C, 0.006 atm',TP[0]+80,TP[1]+40,{size:12,color:'#b91c1c'}),note('จุดวิกฤต\n374 °C, 218 atm',CP[0]+60,CP[1]-30,{size:12,color:'#b91c1c'}),note('ความดัน',120,80,{size:14,color:'#111827'}),note('อุณหภูมิ',690,512,{size:14,color:'#111827'}),
    title('แผนภาพเฟสของน้ำ',400,46),note('เส้นสมดุลของแข็ง–ของเหลวของน้ำเอียงไปทางซ้าย (ความชันเป็นลบ) เพราะน้ำแข็งมีความหนาแน่นน้อยกว่าน้ำ · ไม่ใช่มาตราส่วนจริง',400,540,{size:12}));
  return D('แผนภาพเฟสของน้ำ',800,570,O);}
/* 10. SN2 mechanism */
function T_sn2(){const O=[];const o=mkAtom('O',170,260,{style:'text',lpairs:3,q:-1}),h=mkAtom('H',120,260,{style:'text'}),c=mkAtom('C',320,260,{style:'text'}),br=mkAtom('Br',410,260,{style:'text',lpairs:3});
  const hs=[mkAtom('H',320,205,{style:'text'}),mkAtom('H',285,305,{style:'text'}),mkAtom('H',355,305,{style:'text'})];
  const bd=(a,b,bs)=>{const l=mkLine('bond',0,0,0,0,{bstyle:bs||'normal',order:1});l.a1={id:a.id,a:'c'};l.a2={id:b.id,a:'c'};return l;};
  O.push(bd(h,o),bd(c,br),bd(c,hs[0]),bd(c,hs[1],'wedge'),bd(c,hs[2],'hash'),o,h,c,br,...hs);
  O.push(mkLine('curve',190,246,300,250,{stroke:'#dc2626',sw:2,cx:245,cy:190}),mkLine('curve',365,268,418,282,{stroke:'#dc2626',sw:2,cx:392,cy:320}));
  O.push(mkEq('->',500,260,{size:26}),mkEq('HO–CH3 + Br^-',650,260,{size:24}));
  O.push(note('นิวคลีโอไฟล์',150,330,{size:13,color:'#1d4ed8'}),note('หมู่ที่หลุดออก (leaving group)',430,340,{size:13,color:'#1d4ed8'}),note('ลูกศรโค้ง = การเคลื่อนที่ของอิเล็กตรอนหนึ่งคู่',400,430,{size:13}),
    title('กลไกปฏิกิริยา S_N2 (การแทนที่แบบนิวคลีโอไฟล์)',400,56),note('นิวคลีโอไฟล์เข้าทำปฏิกิริยาจากด้านตรงข้ามกับหมู่ที่หลุดออก ในขั้นตอนเดียว ทำให้โครงแบบกลับด้าน',400,120,{size:13}));
  return D('กลไกปฏิกิริยา SN2',800,480,O);}
/* 11. Hydrogen isotopes */
function T_isotopes(){const O=[];[['โปรเทียม',1],['ดิวทีเรียม',2],['ทริเทียม',3]].forEach(([n,A],i)=>{const b=mkBohr(1,160+i*240,270,{size:200,A,label:`${n} (¹H${A>1?' → ':''})`.replace(' (¹H)',''),lsz:16});b.label=`${n}  ${'¹²³'[A-1]}H`;O.push(b);});
  O.push(title('ไอโซโทปของไฮโดรเจน',400,56),note('ทุกไอโซโทปมีโปรตอน 1 อนุภาคและอิเล็กตรอน 1 อนุภาคเท่ากัน แต่มีจำนวนนิวตรอนต่างกัน (0, 1, 2)',400,470,{size:13}));
  return D('ไอโซโทปของไฮโดรเจน',800,510,O);}
/* 12. Ion formation (NaCl) */
function T_ions(){const O=[];const na=mkBohr(11,140,210,{size:190}),nap=mkBohr(11,560,210,{size:190,q:1}),cl=mkBohr(17,140,470,{size:190}),clm=mkBohr(17,560,470,{size:190,q:-1});
  O.push(na,nap,cl,clm,S('fat_arrow',350,210,{w:90,h:40,fill:'#e0e7ff',stroke:'#6366f1'}),S('fat_arrow',350,470,{w:90,h:40,fill:'#e0e7ff',stroke:'#6366f1'}));
  O.push(mkEq('Na -> Na^+ + e^-',350,140,{size:17}),mkEq('Cl + e^- -> Cl^-',350,400,{size:17}),mkLine('curve',225,190,225,430,{stroke:'#2563eb',sw:2,cx:300,cy:310,label:'e⁻ ถ่ายโอน',lc:'#2563eb',ls:'text',lsz:13}));
  O.push(title('การเกิดไอออน: โซเดียมให้อิเล็กตรอนแก่คลอรีน',400,40),note('Na⁺ มีการจัดเรียง 2, 8 และ Cl⁻ มีการจัดเรียง 2, 8, 8 ซึ่งเสถียรแบบแก๊สมีตระกูล',400,600,{size:13}));
  return D('การเกิดไอออน',800,630,O);}
/* 13. VSEPR shapes */
function T_vsepr(){const O=[];const put=(k,x,y,n,a)=>{const objs=addMol(k,'ball',x,y);O.push(...objs,mkText(n,x,y+86,{size:15,bold:true}),mkText(a,x,y+108,{size:13,color:'#475569'}));return objs;};
  const w=put('h2o',150,220,'H₂O — มุมงอ','104.5°');const at3=w.filter(o=>o.type==='atomnode').map(a=>[a.x+a.w/2,a.y+a.h/2]);O.push(angObj(at3[0][0],at3[0][1],at3[1],at3[2]));
  put('co2',420,220,'CO₂ — เส้นตรง','180°');put('ch4',680,220,'CH₄ — ทรงสี่หน้า','109.5°');put('nh3',150,450,'NH₃ — พีระมิดฐานสามเหลี่ยม','107°');put('bf3',420,450,'BF₃ — สามเหลี่ยมแบนราบ','120°');put('sf6',680,450,'SF₆ — ทรงแปดหน้า','90°');
  O.push(title('รูปร่างโมเลกุลตามทฤษฎี VSEPR',420,56),note('ลิ่มทึบ = พันธะชี้ออกจากระนาบ · ลิ่มขีด = พันธะชี้ไปด้านหลัง · มุมที่ระบุเป็นมุมพันธะจริงในสามมิติ',420,610,{size:12.5}));
  return D('รูปร่างโมเลกุล VSEPR',840,640,O);}
TPL.splice(TPL.length-1,0,
 ['การไทเทรตกรด–เบส','เคมี · อุปกรณ์และป้ายกำกับครบ',T_titration,'chem'],['การกรอง','เคมี · การแยกสาร',T_filtration,'chem'],['การกลั่นอย่างง่าย','เคมี · น้ำหล่อเย็นไหลสวนทาง',T_distillation,'chem'],
 ['การตกผลึก','เคมี · การแยกสาร',T_crystal,'chem'],['อิเล็กโทรลิซิส CuCl₂','เคมีไฟฟ้า',T_electrolysis,'chem'],['เซลล์กัลวานิก Zn/Cu','เคมีไฟฟ้า · E° = 1.10 V',T_galvanic,'chem'],
 ['แผนภาพพลังงานของปฏิกิริยา','จลนศาสตร์ · Eₐ และ ΔH',T_energy,'chem'],['กราฟการเปลี่ยนสถานะของน้ำ','สมบัติของสาร',T_heating,'chem'],['แผนภาพเฟสของน้ำ','สมบัติของสาร',T_phase,'chem'],
 ['กลไก SN2','เคมีอินทรีย์ · ลูกศรโค้ง',T_sn2,'chem'],['ไอโซโทปของไฮโดรเจน','โครงสร้างอะตอม',T_isotopes,'chem'],['การเกิดไอออน Na⁺ / Cl⁻','โครงสร้างอะตอม',T_ions,'chem'],['รูปร่างโมเลกุล VSEPR','พันธะเคมี',T_vsepr,'chem']);
window.__chemTpl={mkEq,T_titration,T_filtration,T_distillation,T_crystal,T_electrolysis,T_galvanic,T_energy,T_heating,T_phase,T_sn2,T_isotopes,T_ions,T_vsepr,ceRich,ceParse};
})();
