/* PhysiDraw — Astronomy tools (Phase 4b)
   - celsphere : celestial sphere in the horizon system (observer's latitude, celestial
                 equator, Sun's diurnal paths at the solstices/equinoxes, a star's altitude & azimuth)
   - orbit     : Kepler orbit (Sun at a focus, equal-time positions from Kepler's equation,
                 equal-area sectors, perihelion/aphelion)
   - moonphase : Moon as seen from Earth for a given age (exact terminator, Thai lunar day)  */
"use strict";
(function(){
if(!window.__astro)return;
const {f,P,C,E,L,G}=window.__astro;const D2R=Math.PI/180;
const boxT=(o,inner)=>`<g transform="translate(${f(o.x+o.w/2)} ${f(o.y+o.h/2)}) rotate(${f(o.rot||0)}) translate(${f(-o.w/2)} ${f(-o.h/2)})">${inner}</g>`;
const hit=(o,exp)=>exp?'':`<rect width="${f(o.w)}" height="${f(o.h)}" fill="transparent"/>`;
const chk=(p,on,label)=>`<label class="chk"><input type="checkbox" data-p="${p}" ${on?'checked':''}>${label}</label>`;
const btn=(a,label)=>`<button class="btn" data-act="x:${a}" style="height:27px;padding:0 9px;font-size:11.5px">${label}</button>`;
const header=(t,sub)=>`<div class="ph"><div class="ttl">${t}<div class="sub">${sub}</div></div>${ACTS}</div>`;
const posSec=o=>`<div class="sec"><h5>ตำแหน่งและขนาด</h5><div class="row">${num('X','x',o.x)}${num('Y','y',o.y)}</div><div class="row">${num('W','w',o.w)}${num('H','h',o.h)}</div></div>`;
const rng_=(p,min,max,step,v,lab,unit='')=>`<div class="row"><span class="lab">${lab}</span><input type="range" min="${min}" max="${max}" step="${step}" data-p="${p}" value="${v}"><span class="val">${v}${unit}</span></div>`;
const T0=(x,y,t,sz,c,o={})=>`<text x="${f(x)}" y="${f(y)}" font-size="${f(sz)}" fill="${c}" text-anchor="${o.a||'middle'}" dominant-baseline="central" font-family="${SANS}" font-weight="${o.b?700:400}"${o.i?' font-style="italic"':''}>${t}</text>`;
const T=T0;const num0=v=>Math.round(v*10)/10;

/* ======================= CELESTIAL SPHERE ======================= */
function csLayout(o){const W=o.w,H=o.h,R=Math.min(W*.4,H*.42),cx=W/2,cy=H*.54;const A=(o.vaz??25)*D2R,el=(o.vel??22)*D2R,phi=clamp(+o.lat||0,-90,90)*D2R;
  const pr=v=>{const x1=v[0]*Math.cos(A)-v[1]*Math.sin(A),y1=v[0]*Math.sin(A)+v[1]*Math.cos(A),z=v[2];return {X:cx+R*x1,Y:cy-R*(z*Math.cos(el)+y1*Math.sin(el)),d:y1*Math.cos(el)-z*Math.sin(el),z};};
  const Pv=[0,Math.cos(phi),Math.sin(phi)],M=[0,-Math.sin(phi),Math.cos(phi)];
  const dec=(H0,d)=>{const cd=Math.cos(d),sd=Math.sin(d);return [cd*(Math.cos(H0)*M[0]-Math.sin(H0))+sd*Pv[0],cd*Math.cos(H0)*M[1]+sd*Pv[1],cd*Math.cos(H0)*M[2]+sd*Pv[2]];};
  /* path through 3D points split by style key */
  const path=(pts,keyFn,styles)=>{let out='',cur=null,d='',prev=null;const flush=()=>{if(d&&styles[cur])out+=`<path d="${d}" fill="none" ${styles[cur]}/>`;};
    pts.forEach(v=>{const p=pr(v),k=keyFn(p,v);if(k!==cur){flush();d=prev?`M${f(prev.X)},${f(prev.Y)}L${f(p.X)},${f(p.Y)}`:`M${f(p.X)},${f(p.Y)}`;cur=k;}else d+=`L${f(p.X)},${f(p.Y)}`;prev=p;});flush();return out;};
  const st=(c,w,dash)=>`stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}`;
  const fb=(c,w)=>({f:st(c,w),b:st(c,w*.8,'5 4')});const vis=p=>p.d>0?'b':'f';
  const circ=(fn,n=144)=>{const a=[];for(let i=0;i<=n;i++)a.push(fn(i/n*2*Math.PI));return a;};
  let s='';const lab=o.labels!==false;
  /* ground (horizon plane) and sphere outline */
  const hz=circ(t=>[Math.sin(t),Math.cos(t),0]);s+=`<path d="${hz.map((v,i)=>{const p=pr(v);return (i?'L':'M')+f(p.X)+','+f(p.Y);}).join('')}Z" fill="#dcfce7" fill-opacity=".75" stroke="none"/>`;
  s+=C(cx,cy,R,'none','#cbd5e1',1);
  s+=path(hz,vis,fb('#15803d',1.6));
  if(o.meridian!==false)s+=path(circ(t=>[0,Math.cos(t),Math.sin(t)]),vis,fb('#94a3b8',1));
  if(o.paths!==false)[[23.44,'#f59e0b'],[0,'#eab308'],[-23.44,'#f97316']].forEach(([d,c])=>{s+=path(circ(t=>dec(t,d*D2R)),(p,v)=>v[2]<0?'u':vis(p),{f:st(c,2.2),b:st(c,1.6,'5 4'),u:st(c,1,'1.5 3.5')+' opacity=".55"'});});
  if(o.equator!==false)s+=path(circ(t=>dec(t,0)),vis,fb('#0891b2',1.8));
  if(o.pole!==false){const p1=pr(Pv),p0=pr([0,0,0]),p2=pr(Pv.map(v=>-v));s+=`<path d="M${f(p2.X)},${f(p2.Y)}L${f(p1.X)},${f(p1.Y)}" ${st('#7c3aed',1.6,'6 3')}/>`+C(p1.X,p1.Y,4,'#7c3aed','#fff',1.2);
    const arc=[];const a0=Math.min(0,phi),a1=Math.max(0,phi);for(let i=0;i<=24;i++){const t=a0+(a1-a0)*i/24;arc.push([0,Math.cos(t)*.32,Math.sin(t)*.32]);}s+=path(arc,()=>'x',{x:st('#7c3aed',1.4)});
    if(lab){const m=pr([0,Math.cos(phi/2)*.42,Math.sin(phi/2)*.42]);s+=T(m.X+4,m.Y,'φ = '+num0(Math.abs(phi/D2R))+'°',11,'#6d28d9',{a:'start',b:1})+T(p1.X+8,p1.Y-8,phi>=0?'ขั้วฟ้าเหนือ':'ขั้วฟ้าเหนือ (ใต้ขอบฟ้า)',10.5,'#6d28d9',{a:'start',b:1});}}
  if(o.star!==false){const h=(+o.alt||0)*D2R,az=(+o.az||0)*D2R;const sv=[Math.cos(h)*Math.sin(az),Math.cos(h)*Math.cos(az),Math.sin(h)];
    const vc=[],ac=[];for(let i=0;i<=30;i++){const t=h*i/30;vc.push([Math.cos(t)*Math.sin(az),Math.cos(t)*Math.cos(az),Math.sin(t)]);const u=az*i/30;ac.push([Math.sin(u)*1.0,Math.cos(u)*1.0,0]);}
    s+=path(vc,vis,{f:st('#dc2626',2),b:st('#dc2626',1.6,'4 3')})+path(ac,()=>'x',{x:st('#2563eb',3)+' opacity=".75"'});const sp=pr(sv);
    s+=`<path d="M${f(pr([0,0,0]).X)},${f(pr([0,0,0]).Y)}L${f(sp.X)},${f(sp.Y)}" ${st('#dc2626',1,'2 3')}/>`+P(`M${f(sp.X)},${f(sp.Y-8)}l2.2,5.4 5.8,.4-4.5,3.7 1.4,5.6-4.9,-3.1-4.9,3.1 1.4,-5.6-4.5,-3.7 5.8,-.4z`,'#fde047','#a16207',1);
    if(lab){const mh=pr([Math.cos(h/2)*Math.sin(az)*1.06,Math.cos(h/2)*Math.cos(az)*1.06,Math.sin(h/2)*1.06]);const ma=pr([Math.sin(az/2)*1.14,Math.cos(az/2)*1.14,0]);
      s+=T(mh.X+6,mh.Y,'มุมเงย h = '+num0(h/D2R)+'°',11,'#b91c1c',{a:'start',b:1})+T(ma.X,ma.Y+10,'มุมทิศ A = '+num0(az/D2R)+'°',11,'#1d4ed8',{b:1})+T(sp.X+10,sp.Y-10,'ดาว',10.5,'#a16207',{a:'start',b:1});}}
  const z=pr([0,0,1]);s+=C(z.X,z.Y,3.5,'#0f172a')+(lab?T(z.X+7,z.Y-8,'จุดเหนือศีรษะ (Z)',10.5,'#0f172a',{a:'start'}):'');
  [['N','เหนือ',0],['E','ตะวันออก',90],['S','ใต้',180],['W','ตะวันตก',270]].forEach(([k,n,a])=>{const p=pr([Math.sin(a*D2R)*1.13,Math.cos(a*D2R)*1.13,0]);s+=T(p.X,p.Y,`${n} (${k})`,11,'#14532d',{b:1});});
  const o0=pr([0,0,0]);s+=C(o0.X,o0.Y-12,3.2,'#334155')+L(`M${f(o0.X)},${f(o0.Y-9)}v8M${f(o0.X-4)},${f(o0.Y-5)}h8M${f(o0.X)},${f(o0.Y-1)}l-3,5M${f(o0.X)},${f(o0.Y-1)}l3,5`,'#334155',1.4);
  if(o.paths!==false&&lab){[[23.44,'≈ 21 มิ.ย.','#b45309'],[0,'≈ 21 มี.ค. / 23 ก.ย.','#a16207'],[-23.44,'≈ 22 ธ.ค.','#c2410c']].forEach(([d,t,c])=>{const p=pr(dec(-1.15,d*D2R));s+=T(p.X+8,p.Y,t,10.5,c,{a:'start',b:1});});}
  if(o.equator!==false&&lab){const p=pr(dec(1.05,0));s+=T(p.X-6,p.Y-10,'เส้นศูนย์สูตรฟ้า',10,'#0e7490',{a:'end'});}
  return s;}
const centerAt=(e,cx,cy)=>{e.x=cx-e.w/2;e.y=cy-e.h/2;return e;};
function mkCelSphere(cx,cy,o={}){return centerAt(Object.assign({id:uid(),type:'celsphere',lat:16.2,vaz:25,vel:22,alt:40,az:120,paths:true,equator:true,pole:true,star:true,meridian:true,labels:true,x:0,y:0,w:480,h:400,rot:0,op:1,label:'',lp:'bottom',ls:'text',lsz:14,lc:'#111827'},o),cx,cy);}
const noonAlt=(phi,d)=>{const a=90-Math.abs(phi-d);return a;};
TYPES.celsphere={name:'ทรงกลมท้องฟ้า',box:true,svg(o,exp){return boxT(o,hit(o,exp)+csLayout(o));},
  onProp(o,p,v){if(['lat','vaz','vel','alt','az'].includes(p))o[p]=+v;},
  act(o,a){const PR={msk:16.2,bkk:13.8,eq:0,np:90,cm:18.8,s35:-35};if(a.startsWith('lat:'))o.lat=PR[a.slice(4)];},
  panel(o){const phi=+o.lat;const n=d=>{const a=noonAlt(phi,d);return a<0?'ไม่ขึ้นเหนือขอบฟ้า':num0(a)+'° ทาง'+(d>phi?'เหนือ':d<phi?'ใต้':'เหนือศีรษะ');};
    return header('ทรงกลมท้องฟ้า','Celestial sphere · horizon system')+`<div class="sec"><h5>ผู้สังเกต</h5>${rng_('lat',-90,90,.1,o.lat,'ละติจูด','°')}
    <div class="row" style="flex-wrap:wrap;gap:5px">${btn('lat:msk','มหาสารคาม 16.2°N')}${btn('lat:bkk','กรุงเทพฯ 13.8°N')}${btn('lat:cm','เชียงใหม่ 18.8°N')}${btn('lat:eq','ศูนย์สูตร 0°')}${btn('lat:np','ขั้วโลกเหนือ')}${btn('lat:s35','35°S')}</div>
    <div class="hint" style="background:#f8fafc;border:1px solid var(--line);border-radius:8px;padding:8px 10px">มุมเงยของขั้วฟ้าเหนือ = ละติจูด = <b>${num0(phi)}°</b><br>ดวงอาทิตย์เวลาเที่ยงสุริยะ:<br>· วันวสันตวิษุวัต/ศารทวิษุวัต: <b>${n(0)}</b><br>· ครีษมายัน (≈21 มิ.ย.): <b>${n(23.44)}</b><br>· เหมายัน (≈22 ธ.ค.): <b>${n(-23.44)}</b></div></div>
    <div class="sec"><h5>ดาวและพิกัดขอบฟ้า</h5>${rng_('alt',0,90,1,o.alt,'มุมเงย h','°')}${rng_('az',0,359,1,o.az,'มุมทิศ A','°')}<div class="hint">มุมทิศวัดจากทิศเหนือไปทางตะวันออก (N = 0°, E = 90°, S = 180°, W = 270°)</div></div>
    <div class="sec"><h5>แสดง</h5><div class="row" style="flex-wrap:wrap;gap:6px 14px">${chk('paths',o.paths!==false,'เส้นทางดวงอาทิตย์')}${chk('equator',o.equator!==false,'เส้นศูนย์สูตรฟ้า')}${chk('pole',o.pole!==false,'แกนขั้วฟ้า')}${chk('meridian',o.meridian!==false,'เส้นเมริเดียน')}${chk('star',o.star!==false,'ดาวและมุม')}${chk('labels',o.labels!==false,'ป้ายกำกับ')}</div>
    ${rng_('vaz',-180,180,1,o.vaz??25,'หมุนมุมมอง','°')}${rng_('vel',5,60,1,o.vel??22,'มุมก้มมอง','°')}</div>`+posSec(o);}};

/* ======================= KEPLER ORBIT ======================= */
const keplerE=(M,e)=>{let E0=e<.8?M:Math.PI;for(let i=0;i<30;i++)E0-=(E0-e*Math.sin(E0)-M)/(1-e*Math.cos(E0));return E0;};
function orbLayout(o){const e=clamp(+o.e||0,0,.97),W=o.w,H=o.h,sq=Math.sqrt(1-e*e);const a=Math.min(W*.4,(H*.36)/sq),b=a*sq,c=a*e,cx=W/2,cy=H*.48,Fx=cx+c,Fy=cy;
  const pos=M=>{const E0=keplerE(M,e);return [cx+a*Math.cos(E0),cy-b*Math.sin(E0)];};let s='';const lab=o.labels!==false;const k=clamp(W/520,1,1.6);const T=(x,y,t,sz,c,op)=>T0(x,y,t,sz*k,c,op);
  if(o.sectors!==false){const n=Math.max(4,o.n||12),dM=2*Math.PI/n;[[-dM/2,'#fde68a'],[Math.PI-dM/2,'#bfdbfe']].forEach(([m0,c0])=>{let d=`M${f(Fx)},${f(Fy)}`;for(let i=0;i<=20;i++){const p=pos(m0+dM*i/20);d+=`L${f(p[0])},${f(p[1])}`;}s+=`<path d="${d}Z" fill="${c0}" fill-opacity=".85" stroke="#94a3b8" stroke-width=".8"/>`;});}
  s+=E(cx,cy,a,b,'none','#334155',1.8);
  if(o.axes!==false)s+=L(`M${f(cx-a)},${f(cy)}H${f(cx+a)}`,'#94a3b8',1,' stroke-dasharray="4 3"')+L(`M${f(cx)},${f(cy-b)}V${f(cy+b)}`,'#cbd5e1',1,' stroke-dasharray="4 3"');
  if(o.ticks!==false){const n=Math.max(4,o.n||12);for(let k=0;k<n;k++){const p=pos(2*Math.PI*k/n);s+=C(p[0],p[1],3,'#64748b','#fff',1);}}
  if(o.foci!==false)s+=L(`M${f(cx-c-4)},${f(cy-4)}l8,8m0,-8l-8,8`,'#475569',1.4);
  s+=C(Fx,Fy,11,'#fbbf24','#d97706',1.4);
  if(o.planet!==false){const m=(+o.m||0)*D2R,p=pos(m),E0=keplerE(m,e);const r=Math.hypot(p[0]-Fx,p[1]-Fy),v=Math.sqrt(Math.max(0,2/r-1/a));const tx=-a*Math.sin(E0),ty=-b*Math.cos(E0),tl=Math.hypot(tx,ty)||1,len=v*Math.sqrt(a)*34;
    s+=arw(p[0],p[1],p[0]+tx/tl*len,p[1]+ty/tl*len,{s:'#dc2626',sw:2},8)+L(`M${f(Fx)},${f(Fy)}L${f(p[0])},${f(p[1])}`,'#64748b',1,' stroke-dasharray="3 3"')+C(p[0],p[1],7,'#3b82f6','#1e3a8a',1.2);}
  if(lab){s+=T(cx+a+6,cy-14,'จุดใกล้ดวงอาทิตย์ที่สุด',10.5,'#334155',{a:'start',b:1})+T(cx+a+6,cy+2,`(perihelion) ${num0(1-e)}a`,10,'#64748b',{a:'start'})
    +T(cx-a-6,cy-14,'จุดไกลดวงอาทิตย์ที่สุด',10.5,'#334155',{a:'end',b:1})+T(cx-a-6,cy+2,`(aphelion) ${num0(1+e)}a`,10,'#64748b',{a:'end'})+T(Fx,Fy+22,'ดวงอาทิตย์ (จุดโฟกัส)',10,'#b45309',{b:1})
    +T(cx-a/2,cy-9,'a',13,'#475569',{i:1,b:1})+T(cx,H-12,`ความเยื้องศูนย์กลาง e = ${(+o.e).toFixed(3)}`+(o.sectors!==false?' · พื้นที่แรเงาสองส่วนเท่ากัน (ช่วงเวลาเท่ากัน)':''),11,'#334155');}
  return s;}
function mkOrbit(cx,cy,o={}){return centerAt(Object.assign({id:uid(),type:'orbit',e:.5,n:12,m:120,sectors:true,ticks:true,axes:true,foci:true,planet:true,labels:true,x:0,y:0,w:520,h:320,rot:0,op:1,label:'',lp:'bottom',ls:'text',lsz:14,lc:'#111827'},o),cx,cy);}
TYPES.orbit={name:'วงโคจรตามกฎของเคปเลอร์',box:true,svg(o,exp){return boxT(o,hit(o,exp)+orbLayout(o));},
  onProp(o,p,v){if(['e','n','m'].includes(p))o[p]=+v;},
  act(o,a){const PR={earth:.0167,mercury:.2056,mars:.0934,pluto:.2488,halley:.967};if(a.startsWith('e:'))o.e=PR[a.slice(2)];},
  panel(o){const e=+o.e;return header('วงโคจรของเคปเลอร์','Kepler orbit · laws 1 & 2')+`<div class="sec"><h5>รูปร่างวงโคจร</h5>${rng_('e',0,.97,.001,o.e,'ความเยื้อง e')}
    <div class="row" style="flex-wrap:wrap;gap:5px">${btn('e:earth','โลก 0.017')}${btn('e:mars','ดาวอังคาร 0.093')}${btn('e:mercury','ดาวพุธ 0.206')}${btn('e:pluto','ดาวพลูโต 0.249')}${btn('e:halley','ดาวหางฮัลเลย์ 0.967')}</div>
    <div class="hint" style="background:#f8fafc;border:1px solid var(--line);border-radius:8px;padding:8px 10px">ระยะใกล้สุด = a(1−e) = <b>${num0(1-e)}a</b> · ไกลสุด = a(1+e) = <b>${num0(1+e)}a</b><br>อัตราเร็วที่จุดใกล้สุด / จุดไกลสุด = (1+e)/(1−e) = <b>${e<1?num0((1+e)/(1-e)):'—'}</b><br>กฎข้อ 3: T² ∝ a³</div></div>
    <div class="sec"><h5>กฎข้อ 2 (พื้นที่เท่ากันในเวลาเท่ากัน)</h5>${rng_('n',4,24,1,o.n||12,'จำนวนช่วงเวลา')}${rng_('m',0,359,1,o.m||0,'ตำแหน่งดาวเคราะห์','°')}<div class="hint">ตำแหน่งคำนวณจากสมการของเคปเลอร์ M = E − e sin E · ลูกศรแดงยาวตามอัตราเร็ว (vis-viva)</div>
    <div class="row" style="flex-wrap:wrap;gap:6px 14px;margin-top:6px">${chk('sectors',o.sectors!==false,'พื้นที่แรเงา')}${chk('ticks',o.ticks!==false,'ตำแหน่งทุกช่วงเวลา')}${chk('planet',o.planet!==false,'ดาวเคราะห์และความเร็ว')}${chk('foci',o.foci!==false,'จุดโฟกัสว่าง')}${chk('axes',o.axes!==false,'แกน')}${chk('labels',o.labels!==false,'ป้ายกำกับ')}</div></div>`+posSec(o);}};

/* ======================= MOON PHASE ======================= */
const SYN=29.530589;
function phaseInfo(age){const ph=((age%SYN)+SYN)%SYN/SYN*360,k=(1-Math.cos(ph*D2R))/2;let n,en;
  if(ph<6||ph>=354){n='จันทร์ดับ';en='New Moon';}else if(ph<84){n='เสี้ยวข้างขึ้น';en='Waxing crescent';}else if(ph<96){n='ครึ่งดวงข้างขึ้น';en='First quarter';}else if(ph<174){n='ค่อนดวงข้างขึ้น';en='Waxing gibbous';}
  else if(ph<186){n='จันทร์เต็มดวง';en='Full Moon';}else if(ph<264){n='ค่อนดวงข้างแรม';en='Waning gibbous';}else if(ph<276){n='ครึ่งดวงข้างแรม';en='Last quarter';}else{n='เสี้ยวข้างแรม';en='Waning crescent';}
  const a=ph/360*SYN;const day=(a<.5||a>=SYN-.5)?'แรม 14–15 ค่ำ (เดือนดับ)':a<15.27?`ขึ้น ${clamp(Math.floor(a)+1,1,15)} ค่ำ`:`แรม ${clamp(Math.floor(a-SYN/2)+1,1,15)} ค่ำ`;return {ph,k,n,en,day};}
function moonDisc(cx,cy,R,ph,south){const c=Math.cos(ph*D2R),rx=Math.abs(c)*R,wax=ph<180;let d;
  if(ph<1||ph>359)d='';else if(Math.abs(ph-180)<1)d=`M${cx},${cy-R}A${R},${R} 0 1 1 ${cx},${cy+R}A${R},${R} 0 1 1 ${cx},${cy-R}Z`;
  else if(wax)d=`M${cx},${cy-R}A${R},${R} 0 0 1 ${cx},${cy+R}A${f(rx)},${R} 0 0 ${c>0?0:1} ${cx},${cy-R}Z`;
  else d=`M${cx},${cy-R}A${R},${R} 0 0 0 ${cx},${cy+R}A${f(rx)},${R} 0 0 ${c<0?0:1} ${cx},${cy-R}Z`;
  const body=C(cx,cy,R,'#475569','#334155',1.2)+(d?`<path d="${d}" fill="#f5f5f4"/>`:'')+C(cx,cy,R,'none','#334155',1.2);
  return south?`<g transform="translate(${2*cx} 0) scale(-1 1)">${body}</g>`:body;}
function mkMoonPhase(cx,cy,o={}){const s=o.size||110;return centerAt(Object.assign({id:uid(),type:'moonphase',age:7.4,south:false,info:true,x:0,y:0,w:s,h:s,rot:0,op:1,label:'',lp:'bottom',ls:'text',lsz:13,lc:'#111827'},o),cx,cy);}
TYPES.moonphase={name:'ดวงจันทร์ข้างขึ้นข้างแรม',box:true,
  svg(o,exp){const I=phaseInfo(+o.age||0),inf=o.info!==false,R=Math.min(o.w,o.h*(inf?.72:1))/2*.94,cx=o.w/2,cy=inf?R+2:o.h/2;
    let s=moonDisc(cx,cy,R,I.ph,o.south);if(inf){const fs=Math.max(10,R*.3);s+=T(cx,cy+R+fs*1.1,I.n,fs,'#0f172a',{b:1})+T(cx,cy+R+fs*2.3,`${I.day} · สว่าง ${Math.round(I.k*100)}%`,fs*.85,'#475569');}
    return boxT(o,hit(o,exp)+s);},
  onProp(o,p,v){if(p==='age')o.age=+v;},
  act(o,a){if(a.startsWith('age:'))o.age=+a.slice(4);},
  panel(o){const I=phaseInfo(+o.age||0);return header('ข้างขึ้นข้างแรม','Moon phase as seen from Earth')+`<div class="sec"><h5>อายุดวงจันทร์</h5>${rng_('age',0,29.5,.1,o.age,'วันหลังจันทร์ดับ')}
    <div class="row" style="flex-wrap:wrap;gap:5px">${[[0,'ดับ'],[3.7,'เสี้ยวขึ้น'],[7.4,'ขึ้น 8 ค่ำ'],[11.1,'ค่อนขึ้น'],[14.8,'เพ็ญ'],[18.5,'ค่อนแรม'],[22.1,'แรม 8 ค่ำ'],[25.8,'เสี้ยวแรม']].map(([a,l])=>btn('age:'+a,l)).join('')}</div>
    <div class="hint" style="background:#f8fafc;border:1px solid var(--line);border-radius:8px;padding:8px 10px"><b>${I.n}</b> (${I.en})<br>${I.day} (โดยประมาณ) · ส่วนสว่าง ${Math.round(I.k*100)}% · มุมเฟส ${Math.round(I.ph)}°<br>เดือนจันทรคติเฉลี่ย 29.53 วัน</div></div>
    <div class="sec"><h5>แสดง</h5><div class="row" style="flex-wrap:wrap;gap:6px 14px">${chk('info',o.info!==false,'ชื่อและข้อมูล')}${chk('south',!!o.south,'มองจากซีกโลกใต้')}</div><div class="hint">ซีกโลกเหนือ (รวมประเทศไทย): ข้างขึ้นสว่างด้านขวา ข้างแรมสว่างด้านซ้าย</div></div>`+posSec(o);}};

/* library entries */
def('astro_sky','astro_celsphere','ทรงกลมท้องฟ้า (ปรับละติจูดได้)','celestial sphere horizon system',200,170,{al:'ทรงกลมท้องฟ้า celestial sphere ขอบฟ้า มุมเงย มุมทิศ altitude azimuth',make:(x,y)=>[mkCelSphere(x,y)]},()=>`<ellipse cx="100" cy="100" rx="80" ry="26" fill="#dcfce7" stroke="#15803d" stroke-width="1.4"/><circle cx="100" cy="90" r="80" fill="none" stroke="#cbd5e1"/><path d="M100,100L150,30" stroke="#7c3aed" stroke-width="1.6" stroke-dasharray="5 3"/><ellipse cx="100" cy="80" rx="76" ry="30" transform="rotate(-25 100 80)" fill="none" stroke="#f59e0b" stroke-width="2"/><circle cx="100" cy="10" r="3" fill="#0f172a"/>`);
def('astro_sky','astro_orbit','วงโคจรตามกฎของเคปเลอร์','Kepler orbit ellipse equal areas',200,130,{al:'วงโคจร เคปเลอร์ kepler orbit วงรี',make:(x,y)=>[mkOrbit(x,y)]},()=>`<path d="M130,65L170,58A80,48 0 0 1 172,72Z" fill="#fde68a"/><ellipse cx="100" cy="65" rx="80" ry="48" fill="none" stroke="#334155" stroke-width="2"/><circle cx="140" cy="65" r="8" fill="#fbbf24" stroke="#d97706"/><circle cx="60" cy="24" r="6" fill="#3b82f6"/>`);
def('astro_sky','astro_moonphase','ดวงจันทร์ข้างขึ้นข้างแรม (กำหนดวันได้)','moon phase',110,130,{al:'ข้างขึ้น ข้างแรม moon phase ดวงจันทร์ เฟส',make:(x,y)=>[mkMoonPhase(x,y)]},()=>moonDisc(55,55,48,90,false)+T(55,118,'ขึ้น 8 ค่ำ',13,'#0f172a',{b:1}));
const halfLit=(R,dark='#334155',lit='#f5f5f4',base)=>C(0,0,R,base||dark,'#1e293b',1)+`<path d="M0,${-R}A${R},${R} 0 0 0 0,${R}Z" fill="${lit}"/>`+C(0,0,R,'none','#1e293b',1);
def('astro_sky','astro_moon_lit','ดวงจันทร์ (มองจากด้านบน แสงจากซ้าย)','moon top view lit half',60,60,{al:'ดวงจันทร์ ครึ่งสว่าง moon lit'},()=>G(30,30,0,1,halfLit(26)));
def('astro_sky','astro_earth_lit','โลก (มองจากขั้วเหนือ แสงจากซ้าย)','earth top view day night',100,100,{al:'โลก กลางวัน กลางคืน earth lit'},()=>G(50,50,0,1,C(0,0,46,'#1e3a8a','#0f172a',1.2)+`<path d="M0,-46A46,46 0 0 0 0,46Z" fill="#60a5fa"/>`+C(0,0,6,'#e2e8f0','#475569',1)+L('M0,-46V46','#0f172a',1,' stroke-dasharray="3 3"')));
def('astro_sky','astro_sunlight','แสงอาทิตย์ (ลำแสงขนาน)','parallel sunlight rays',120,140,{al:'แสงอาทิตย์ sunlight ลำแสง'},()=>{let s='';for(let k=0;k<6;k++)s+=arw(6,12+k*23,112,12+k*23,{s:'#f59e0b',sw:2},8);return s;});
window.__astroTools={mkCelSphere,mkOrbit,mkMoonPhase,phaseInfo,keplerE,moonDisc};
/* ======================= ECLIPSE (exact tangent construction) ======================= */
function tangents(x1,r1,x2,r2,cy){/* external (umbra) & internal (penumbra) tangent lines between two circles on y = cy */
  const d=x2-x1,res={ext:[],int:[]};
  [1,-1].forEach(sg=>{const nx=-(r1-r2)/d,ny=sg*Math.sqrt(Math.max(0,1-nx*nx));res.ext.push([[x1-r1*nx,cy-r1*ny],[x2-r2*nx,cy-r2*ny]]);
    const mx=-(r1+r2)/d,my=sg*Math.sqrt(Math.max(0,1-mx*mx));res.int.push([[x1-r1*mx,cy-r1*my],[x2+r2*mx,cy+r2*my]]);});return res;}
const extendTo=(p,q,X)=>{const t=(X-p[0])/(q[0]-p[0]);return [X,p[1]+(q[1]-p[1])*t];};
const yAt=(p,q,X)=>p[1]+(q[1]-p[1])*(X-p[0])/(q[0]-p[0]);
function eclLayout(o){const W=o.w,H=o.h,cy=H*.5,lab=o.labels!==false,solar=o.kind!=='lunar';let s='';
  const x1=W*.1,r1=H*.3;const bodyAt=(key,x,r)=>{const d=DEF[key];if(!d)return C(x,cy,r,'#94a3b8');const disc={astro_sun:68,astro_earth:48,astro_moon:33}[key],sc=r/disc;return `<g transform="translate(${f(x)} ${f(cy)}) scale(${f(sc)}) translate(${-d.w/2} ${-d.h/2})">${d.draw({s:'#334155',f:'none',sw:1})}</g>`;};
  if(solar){const xE=W*.86,rE=H*.2,x2=W*.56,Lx=(xE-rE+rE*.06)-x2,r2=r1*Lx/((x2-x1)+Lx);const T0=tangents(x1,r1,x2,r2,cy);
    const apex=[x2+(x2-x1)*r2/(r1-r2),cy];const pen=T0.int.map(([a,b])=>extendTo(a,b,xE));
    s+=`<path d="M${f(T0.int[0][1][0])},${f(T0.int[0][1][1])}L${f(pen[0][0])},${f(pen[0][1])}L${f(pen[1][0])},${f(pen[1][1])}L${f(T0.int[1][1][0])},${f(T0.int[1][1][1])}Z" fill="#94a3b8" fill-opacity=".35"/>`;
    s+=bodyAt('astro_sun',x1,r1)+bodyAt('astro_earth',xE,rE);
    s+=`<path d="M${f(T0.ext[0][1][0])},${f(T0.ext[0][1][1])}L${f(apex[0])},${f(apex[1])}L${f(T0.ext[1][1][0])},${f(T0.ext[1][1][1])}Z" fill="#1e293b" fill-opacity=".8"/>`;
    const pa=[xE-rE*.98,cy];s+=E(xE-rE*.7,cy,rE*.32,rE*.95,'#475569','none',0,' opacity=".28"');
    if(o.lines!==false){T0.ext.forEach(([a,b])=>s+=L(`M${f(a[0])},${f(a[1])}L${f(apex[0])},${f(apex[1])}`,'#f59e0b',1,' opacity=".9"'));T0.int.forEach(([a,b],i)=>s+=L(`M${f(a[0])},${f(a[1])}L${f(pen[i][0])},${f(pen[i][1])}`,'#fbbf24',1,' stroke-dasharray="5 4"'));}
    s+=bodyAt('astro_moon',x2,r2);
    if(lab){s+=T(x1,cy+r1+18,'ดวงอาทิตย์',13,'#92400e',{b:1})+T(x2,cy+r2+30,'ดวงจันทร์ (จันทร์ดับ)',12,'#334155',{b:1})+T(xE,cy+rE+18,'โลก',13,'#1e3a8a',{b:1})
      +T(apex[0]-12,cy-r2*1.9,'เงามืด (umbra)',11.5,'#0f172a',{b:1})+T(apex[0]-12,cy-r2*1.9+15,'→ เห็นสุริยุปราคาเต็มดวง',10.5,'#334155')
      +T((x2+xE)/2+20,yAt(T0.int[0][0],T0.int[0][1],(x2+xE)/2+20)+18,'เงามัว (penumbra)',11.5,'#475569',{b:1})+T((x2+xE)/2+20,yAt(T0.int[0][0],T0.int[0][1],(x2+xE)/2+20)+33,'→ เห็นสุริยุปราคาบางส่วน',10.5,'#64748b');}}
  else{const xE=W*.5,rE=H*.17;const Lap=(xE-x1)*rE/(r1-rE),xM=W*.86,rU=rE*(1-(xM-xE)/Lap),rM=rU/2.7;const T0=tangents(x1,r1,xE,rE,cy);
    const apex=[xE+Lap,cy];const endX=W*.99,pen=T0.int.map(([a,b])=>extendTo(a,b,endX)),um=T0.ext.map(([a,b])=>extendTo(a,b,Math.min(apex[0],endX)));
    s+=`<path d="M${f(T0.int[0][1][0])},${f(T0.int[0][1][1])}L${f(pen[0][0])},${f(pen[0][1])}L${f(pen[1][0])},${f(pen[1][1])}L${f(T0.int[1][1][0])},${f(T0.int[1][1][1])}Z" fill="#94a3b8" fill-opacity=".35"/>`;
    s+=`<path d="M${f(T0.ext[0][1][0])},${f(T0.ext[0][1][1])}L${f(um[0][0])},${f(um[0][1])}L${f(um[1][0])},${f(um[1][1])}L${f(T0.ext[1][1][0])},${f(T0.ext[1][1][1])}Z" fill="#1e293b" fill-opacity=".8"/>`;
    if(o.lines!==false){T0.ext.forEach(([a,b],i)=>s+=L(`M${f(a[0])},${f(a[1])}L${f(um[i][0])},${f(um[i][1])}`,'#f59e0b',1,' opacity=".9"'));T0.int.forEach(([a,b],i)=>s+=L(`M${f(a[0])},${f(a[1])}L${f(pen[i][0])},${f(pen[i][1])}`,'#fbbf24',1,' stroke-dasharray="5 4"'));}
    s+=bodyAt('astro_sun',x1,r1)+bodyAt('astro_earth',xE,rE)+C(xM,cy,rM,'#c2410c','#7c2d12',1.2)+C(xM-rM*.3,cy-rM*.2,rM*.3,'#9a3412','none',0,' opacity=".6"');
    if(lab){s+=T(x1,cy+r1+18,'ดวงอาทิตย์',13,'#92400e',{b:1})+T(xE,cy+rE+18,'โลก',13,'#1e3a8a',{b:1})+T(xM,cy+rM+30,'ดวงจันทร์ (จันทร์เพ็ญ)',12,'#7c2d12',{b:1})+T(xM,cy+rM+45,'ในเงามืดดวงจันทร์เป็นสีแดงอิฐ',10.5,'#64748b')
      +T((xE+xM)/2,cy-rE*.2,'เงามืด (umbra)',11.5,'#f8fafc',{b:1})+T((xE+xM)/2,yAt(T0.int[0][0],T0.int[0][1],(xE+xM)/2)-12,'เงามัว (penumbra)',11.5,'#475569',{b:1});}}
  return s;}
function mkEclipse(kind,cx,cy,o={}){return centerAt(Object.assign({id:uid(),type:'eclipse',kind,labels:true,lines:true,x:0,y:0,w:960,h:380,rot:0,op:1,label:'',lp:'bottom',ls:'text',lsz:14,lc:'#111827'},o),cx,cy);}
TYPES.eclipse={name:'อุปราคา',box:true,svg(o,exp){return boxT(o,hit(o,exp)+eclLayout(o));},
  panel(o){return header('อุปราคา','Eclipse · umbra & penumbra')+`<div class="sec"><h5>ชนิด</h5><div class="row">${segB('kind',o.kind==='lunar'?'lunar':'solar',[['solar','สุริยุปราคา'],['lunar','จันทรุปราคา']])}</div>
    <div class="row" style="flex-wrap:wrap;gap:6px 14px">${chk('labels',o.labels!==false,'ป้ายกำกับ')}${chk('lines',o.lines!==false,'เส้นสัมผัสขอบ (แสดงการสร้างเงา)')}</div>
    <div class="hint">เงามืดและเงามัวสร้างจากเส้นสัมผัสร่วมภายนอกและภายในของวัตถุสองดวงจริง · ขนาดและระยะไม่ได้ตามมาตราส่วน (ระยะจริงไกลกว่านี้มาก)<br>${o.kind==='lunar'?'จันทรุปราคาเกิดเฉพาะคืนจันทร์เพ็ญ เมื่อดวงจันทร์อยู่ใกล้จุดตัดของวงโคจร':'สุริยุปราคาเกิดเฉพาะวันจันทร์ดับ เมื่อดวงจันทร์อยู่ใกล้จุดตัดของวงโคจร'}</div></div>`+posSec(o);}};
def('astro_sky','astro_eclipse_solar','สุริยุปราคา (เงามืด/เงามัว)','solar eclipse umbra penumbra',200,90,{al:'สุริยุปราคา solar eclipse เงามืด เงามัว',make:(x,y)=>[mkEclipse('solar',x,y)]},()=>`<path d="M110,40L190,30V60L110,50Z" fill="#94a3b8" fill-opacity=".4"/><circle cx="20" cy="45" r="30" fill="#f59e0b"/><path d="M110,42L160,45L110,48Z" fill="#1e293b"/><circle cx="110" cy="45" r="5" fill="#d6d3d1" stroke="#334155"/><circle cx="175" cy="45" r="16" fill="#3b82f6"/>`);
def('astro_sky','astro_eclipse_lunar','จันทรุปราคา (เงามืด/เงามัว)','lunar eclipse umbra penumbra',200,90,{al:'จันทรุปราคา lunar eclipse',make:(x,y)=>[mkEclipse('lunar',x,y)]},()=>`<circle cx="20" cy="45" r="30" fill="#f59e0b"/><path d="M100,32L190,36V54L100,58Z" fill="#1e293b" fill-opacity=".85"/><circle cx="100" cy="45" r="16" fill="#3b82f6"/><circle cx="172" cy="45" r="6" fill="#c2410c"/>`);
window.__astroTools.mkEclipse=mkEclipse;

})();
