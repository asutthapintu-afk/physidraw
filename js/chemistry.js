/* =====================================================================
   PhysiDraw — Chemistry module (Phase 2)
   Registers: categories, Bohr atom tool, orbital models, molecule editor
   (atom nodes + bond connectors, Lewis lone pairs, formal charge, valence
   hints), chemistry lab glassware, chemical-equation tool and templates.
   Depends on the core (index.html) and js/elements.js.
   ===================================================================== */
"use strict";
(function(){
if(typeof ELEMENTS==='undefined'){console.warn('PhysiDraw chemistry: elements.js missing');return;}

/* ---------- categories (subject: chem) ---------- */
[['chem_atom','โครงสร้างอะตอม','Atomic structure'],['chem_mol','โมเลกุลและพันธะ','Molecules & bonds'],
 ['chem_lab','อุปกรณ์ปฏิบัติการเคมี','Chemistry lab'],['chem_proc','สมการ กราฟ และกระบวนการ','Equations & processes']]
 .forEach(c=>{CATS.push(c);CAT_SUBJ[c[0]]='chem';});

const SUP=n=>String(n).replace(/\d/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).replace(/\+/g,'⁺').replace(/-/g,'⁻');
const chargeStr=q=>q===0?'':(Math.abs(q)===1?'':Math.abs(q))+(q>0?'+':'−');
const NOS={s:'none',sw:0};
const ink=c=>{try{return lum(c)<.55?'#ffffff':'#111827';}catch(e){return '#111827';}};
const boxT=(o,inner)=>`<g transform="translate(${R2(o.x+o.w/2)} ${R2(o.y+o.h/2)}) rotate(${R2(o.rot||0)}) translate(${R2(-o.w/2)} ${R2(-o.h/2)})">${inner}</g>`;
const hitRect=(o,exp)=>exp?'':`<rect width="${R2(o.w)}" height="${R2(o.h)}" fill="transparent"/>`;
const elOpts=sel=>ELEMENTS.map((e,z)=>e?`<option value="${z}" ${z===sel?'selected':''}>${z} · ${e[0]} · ${e[1]}</option>`:'').join('');
const chk=(p,on,label)=>`<label class="chk"><input type="checkbox" data-p="${p}" ${on?'checked':''}>${label}</label>`;
const actBtn=(a,label,extra='')=>`<button class="btn" data-act="x:${a}" style="height:28px;padding:0 9px;${extra}">${label}</button>`;
const header=(t,sub)=>`<div class="ph"><div class="ttl">${t}<div class="sub">${sub}</div></div>${ACTS}</div>`;
const posSec=o=>`<div class="sec"><h5>ตำแหน่งและขนาด</h5><div class="row">${num('X','x',o.x)}${num('Y','y',o.y)}</div><div class="row">${num('W','w',o.w)}${num('H','h',o.h)}</div></div>`;

/* =====================================================================
   A1. Bohr atom tool — atomic number, mass number and ion charge
   ===================================================================== */
function mkBohr(Z,cx,cy,o={}){const s=o.size||230;return Object.assign({id:uid(),type:'bohr',Z,A:ELEMENTS[Z][3],q:0,x:cx-s/2,y:cy-s/2,w:s,h:s,rot:0,nuc:'particles',showCfg:true,showSym:true,shellNames:false,stroke:'#64748b',fill:'#2563eb',sw:1.4,op:1,label:'',lp:'bottom',ls:'text',lsz:15,lc:'#111827'},o);}
function bohrInner(o){const Z=o.Z|0,A=o.A|0,q=o.q|0,N=A-Z,E=Z-q;const W=o.w,H=o.h,cx=W/2,cy=H/2;
  const sh=E>0?ionShells(Z,q):[];const nS=sh.length;const R=Math.min(W,H)/2-(o.showCfg?20:6);
  const rn=Math.max(9,Math.min(46,R*(nS>=4?.17:nS>=3?.2:.24)));let s='';
  for(let k=0;k<nS;k++){const r=rn+10+(k+1)*(R-rn-10)/nS;s+=`<circle cx="${R2(cx)}" cy="${R2(cy)}" r="${R2(r)}" fill="none" stroke="${o.stroke}" stroke-width="${o.sw||1.4}"/>`;
    if(o.shellNames)s+=tx(R2(cx+r*.7071+4),R2(cy-r*.7071-4),'KLMNOP'[k],10,o.stroke,{b:1,a:'start'});}
  const tot=Z+Math.max(0,N);
  if(o.nuc==='particles'&&tot<=90&&N>=0){const pr=Math.max(1.6,rn*.9/Math.sqrt(tot));const pts=[];
    for(let i=0;i<tot;i++){const rr=tot===1?0:rn*.82*Math.sqrt((i+.5)/tot),th=i*2.399963;pts.push([cx+rr*Math.cos(th),cy+rr*Math.sin(th),Math.floor((i+1)*Z/tot)>Math.floor(i*Z/tot)]);}
    pts.reverse().forEach(([x,y,isP])=>{s+=`<circle cx="${R2(x)}" cy="${R2(y)}" r="${R2(pr)}" fill="${isP?'#ef4444':'#9ca3af'}" stroke="${isP?'#991b1b':'#4b5563'}" stroke-width="${R2(Math.max(.5,pr*.16))}"/>`;
      if(pr>=4.5)s+=tx(R2(x),R2(y),isP?'+':'',R2(pr*1.3),'#fff',{b:1});});}
  else{s+=`<circle cx="${R2(cx)}" cy="${R2(cy)}" r="${R2(rn)}" fill="#fee2e2" stroke="#dc2626" stroke-width="1.4"/>`+tx(R2(cx),R2(cy-rn*.28),`${Z}p⁺`,R2(Math.max(8,rn*.42)),'#991b1b',{b:1})+tx(R2(cx),R2(cy+rn*.32),`${Math.max(0,N)}n⁰`,R2(Math.max(8,rn*.42)),'#374151',{b:1});}
  const er=Math.max(2.4,Math.min(5.5,R*.04));
  sh.forEach((n,k)=>{const r=rn+10+(k+1)*(R-rn-10)/nS;for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;s+=`<circle cx="${R2(cx+r*Math.cos(a))}" cy="${R2(cy+r*Math.sin(a))}" r="${R2(er)}" fill="${o.fill}" stroke="${shade(o.fill,-.35)}" stroke-width=".8"/>`;}});
  if(o.showSym){const e=ELEMENTS[Z];const fs=Math.max(14,Math.min(30,W*.11));s+=tx(R2(fs*.95),R2(fs*1.15),e[0],fs,'#111827',{b:1,a:'start'})+tx(R2(fs*.85),R2(fs*.62),A,R2(fs*.48),'#111827',{a:'end'})+tx(R2(fs*.85),R2(fs*1.62),Z,R2(fs*.48),'#111827',{a:'end'});
    if(q)s+=tx(R2(fs*.95+fs*.62*e[0].length+2),R2(fs*.62),chargeStr(q),R2(fs*.5),'#111827',{b:1,a:'start'});}
  if(o.showCfg)s+=tx(R2(cx),R2(H-7),N<0?'เลขมวลต้องไม่น้อยกว่าเลขอะตอม':`p⁺ ${Z} · n⁰ ${N} · e⁻ ${E}   (${sh.join(', ')||'0'})`,11,N<0?'#dc2626':'#334155');
  return s;}
TYPES.bohr={name:'แบบจำลองอะตอมของโบร์',box:true,
  svg:(o,exp)=>boxT(o,hitRect(o,exp)+bohrInner(o)),
  onProp(o,p,v){if(p==='Z'){const Z=Math.max(1,Math.min(ZMAX,parseInt(v)||1));o.Z=Z;o.A=ELEMENTS[Z][3];o.q=0;}else if(p==='A'||p==='q'){o[p]=parseInt(v)||0;}},
  panel(o){const e=ELEMENTS[o.Z];const N=o.A-o.Z;const sh=ionShells(o.Z,o.q);
    return header('แบบจำลองอะตอมของโบร์',`Bohr model · ${e[2]}`)+`<div class="sec"><h5>ธาตุและอนุภาค</h5>
    <div class="row"><label class="f"><select data-p="Z">${elOpts(o.Z)}</select></label></div>
    <div class="row">${num('Z','Z',o.Z)}${num('A','A',o.A)}</div>
    <div class="row"><span class="lab">ประจุไอออน</span>${segB('q',String(o.q),[['-3','3−'],['-2','2−'],['-1','−'],['0','0'],['1','+'],['2','2+'],['3','3+']])}</div>
    <div class="hint" style="background:#f8fafc;border:1px solid var(--line);border-radius:8px;padding:8px 10px">โปรตอน <b>${o.Z}</b> · นิวตรอน <b style="color:${N<0?'#dc2626':'inherit'}">${N}</b> · อิเล็กตรอน <b>${o.Z-o.q}</b><br>การจัดเรียงในชั้นพลังงาน: <b>${sh.join(', ')||'—'}</b>${o.q===0?`<br>ออร์บิทัล: ${configString(o.Z)}`:''}<br>เลขมวลของไอโซโทปที่พบมากที่สุด: ${e[3]}${N<0?'<br><span style="color:#dc2626">เลขมวลต้องไม่น้อยกว่าเลขอะตอม</span>':''}</div></div>
    <div class="sec"><h5>การแสดงผล</h5><div class="row">${segB('nuc',o.nuc,[['particles','นิวเคลียสแบบอนุภาค'],['label','แบบตัวเลข']])}</div>
    <div class="row" style="flex-wrap:wrap;gap:6px 14px">${chk('showSym',o.showSym,'สัญลักษณ์นิวเคลียร์')}${chk('showCfg',o.showCfg,'จำนวนอนุภาค')}${chk('shellNames',o.shellNames,'ชื่อชั้น K L M')}</div>
    ${colorRow('อิเล็กตรอน','fill',o.fill,['#2563eb','#0891b2','#7c3aed','#111827'])}${colorRow('วงโคจร','stroke',o.stroke,['#64748b','#94a3b8','#111827','#2563eb'])}
    <div class="hint">เกิน 90 นิวคลีออนจะแสดงนิวเคลียสเป็นตัวเลขอัตโนมัติ · ธาตุ Z = 1–54 · Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag ใช้การจัดเรียงจริงที่ต่างจากหลักเอาฟ์บาว</div></div>`+posSec(o);}};

/* ---------- small helpers for drawn previews ---------- */
const ball=(x,y,r,sym,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${shade(fill,-.45)}" stroke-width="${R2(Math.max(.8,r*.08))}"/><ellipse cx="${R2(x-r*.35)}" cy="${R2(y-r*.38)}" rx="${R2(r*.36)}" ry="${R2(r*.24)}" fill="#fff" opacity=".45"/>`+(sym?tx(x,R2(y+.5),sym,R2(r*.95),ink(fill),{b:1}):'');
const stick=(x1,y1,x2,y2,w=4)=>`<path d="M${x1},${y1}L${x2},${y2}" stroke="#9ca3af" stroke-width="${w}" stroke-linecap="round"/>`;

/* ---------- A1 extras: particles & orbitals ---------- */
def('chem_atom','bohr_tool','แบบจำลองอะตอมของโบร์ (กำหนดเลขอะตอม)','bohr model atom builder atomic number mass number',120,120,{al:'อะตอม โบร์ ชั้นพลังงาน อิเล็กตรอน isotope ไอโซโทป ไอออน',make:(x,y)=>[mkBohr(11,x,y)]},
  p=>`<circle cx="60" cy="60" r="52" fill="none" stroke="#64748b" stroke-width="2"/><circle cx="60" cy="60" r="33" fill="none" stroke="#64748b" stroke-width="2"/>`+[[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8]].map(([i])=>{const a=-Math.PI/2+i*Math.PI/4;return `<circle cx="${R2(60+52*Math.cos(a))}" cy="${R2(60+52*Math.sin(a))}" r="4.5" fill="#2563eb"/>`;}).join('')+`<circle cx="60" cy="27" r="4.5" fill="#2563eb"/><circle cx="60" cy="93" r="4.5" fill="#2563eb"/><circle cx="60" cy="60" r="15" fill="#fecaca" stroke="#dc2626" stroke-width="1.5"/>`+tx(60,60,'Z',14,'#991b1b',{b:1}));
[['proton','โปรตอน','proton','#ef4444','+'],['neutron','นิวตรอน','neutron','#9ca3af','0'],['electron_c','อิเล็กตรอน','electron','#2563eb','−']].forEach(([k,n,en,c,t])=>
  def('chem_atom','p_'+k,n,en+' subatomic particle',36,36,{f:c,s:shade(c,-.4),al:'อนุภาค particle'},p=>`<circle cx="18" cy="18" r="16" fill="${p.f}" stroke="${p.s}" stroke-width="${R2(p.sw*.8)}"/><ellipse cx="12.5" cy="12" rx="5" ry="3.5" fill="#fff" opacity=".4"/>`+tx(18,18.5,t,15,'#fff',{b:1})));
def('chem_atom','nucleus','นิวเคลียส','nucleus protons neutrons',70,70,{al:'นิวคลีออน'},p=>{let s='';const tot=19,Zp=9;for(let i=tot-1;i>=0;i--){const rr=27*Math.sqrt((i+.5)/tot),th=i*2.4;const isP=Math.floor((i+1)*Zp/tot)>Math.floor(i*Zp/tot);s+=`<circle cx="${R2(35+rr*Math.cos(th))}" cy="${R2(35+rr*Math.sin(th))}" r="7" fill="${isP?'#ef4444':'#9ca3af'}" stroke="${isP?'#991b1b':'#4b5563'}" stroke-width="1"/>`;}return s;});
const AX=(cx,cy,L,lab)=>{const a={s:'#64748b',sw:1};let s=arw(cx-L,cy,cx+L,cy,a,6)+arw(cx,cy+L,cx,cy-L,a,6);if(lab)s+=tx(cx+L-2,cy+9,'x',10,'#64748b',{serif:1,i:1})+tx(cx+8,cy-L+4,lab,10,'#64748b',{serif:1,i:1});return s;};
const lobe=(cx,cy,ang,len,wid,fill,op=.88)=>{const p=`M0,0 C${R2(len*.3)},${R2(-wid)} ${R2(len)},${R2(-wid)} ${R2(len)},0 C${R2(len)},${R2(wid)} ${R2(len*.3)},${R2(wid)} 0,0Z`;return `<path d="${p}" transform="translate(${cx} ${cy}) rotate(${ang})" fill="${fill}" fill-opacity="${op}" stroke="${shade(fill,-.35)}" stroke-width="1"/>`;};
const PH1='#60a5fa',PH2='#f87171';
def('chem_atom','orb_s','ออร์บิทัล s','s orbital',120,120,{al:'ออร์บิทัล orbital'},p=>AX(60,60,56,'y')+`<circle cx="60" cy="60" r="38" fill="${PH1}" fill-opacity=".85" stroke="${shade(PH1,-.35)}" stroke-width="1.2"/><ellipse cx="48" cy="46" rx="13" ry="8" fill="#fff" opacity=".35"/>`+tx(60,60,'s',18,'#1e3a8a',{serif:1,i:1,b:1}));
def('chem_atom','orb_p','ออร์บิทัล p (pₓ)','p orbital px dumbbell',160,120,{al:'ออร์บิทัล orbital'},p=>AX(80,60,74,'y')+lobe(80,60,0,66,26,PH1)+lobe(80,60,180,66,26,PH2)+tx(122,60,'+',14,'#1e3a8a',{b:1})+tx(38,60,'−',14,'#7f1d1d',{b:1})+tx(80,108,'pₓ',14,'#111827',{serif:1,i:1}));
def('chem_atom','orb_p3','ออร์บิทัล pₓ p_y p_z','three p orbitals px py pz',170,170,{al:'ออร์บิทัล orbital'},p=>AX(85,85,80,'z')+`<path d="M85,85L35,135" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3"/>`+lobe(85,85,135,62,18,'#a78bfa',.7)+lobe(85,85,-45,62,18,'#a78bfa',.7)+lobe(85,85,0,70,20,PH1,.8)+lobe(85,85,180,70,20,PH1,.8)+lobe(85,85,-90,70,20,'#34d399',.8)+lobe(85,85,90,70,20,'#34d399',.8)+tx(158,72,'pₓ',12,'#1e3a8a',{serif:1,i:1})+tx(98,12,'p_z',12,'#065f46',{serif:1,i:1})+tx(30,150,'p_y',12,'#5b21b6',{serif:1,i:1}));
def('chem_atom','orb_dxy','ออร์บิทัล d_xy','d orbital dxy cloverleaf',160,160,{al:'ออร์บิทัล orbital'},p=>AX(80,80,76,'y')+lobe(80,80,-45,66,22,PH1)+lobe(80,80,135,66,22,PH1)+lobe(80,80,45,66,22,PH2)+lobe(80,80,-135,66,22,PH2)+tx(80,152,'d_xy',13,'#111827',{serif:1,i:1}));
def('chem_atom','orb_dz2','ออร์บิทัล d_z²','d orbital dz2',130,170,{al:'ออร์บิทัล orbital'},p=>AX(65,85,62,'z')+lobe(65,85,-90,76,24,PH1)+lobe(65,85,90,76,24,PH1)+`<ellipse cx="65" cy="85" rx="40" ry="11" fill="${PH2}" fill-opacity=".8" stroke="${shade(PH2,-.35)}" stroke-width="1"/><ellipse cx="65" cy="85" rx="18" ry="4.5" fill="#fff" fill-opacity=".9"/>`+tx(100,162,'d_z²',13,'#111827',{serif:1,i:1}));

/* =====================================================================
   A2. Molecule editor — atom nodes + bond connectors
   ===================================================================== */
const ATOM_R={ball:17,text:14,skeletal:9};
function mkAtom(el,cx,cy,o={}){const style=o.style||'ball';const r=o.r||(style==='ball'?(el==='H'?12:17):ATOM_R[style]);
  return Object.assign({id:uid(),type:'atomnode',el,style,lpairs:0,q:0,x:cx-r,y:cy-r,w:2*r,h:2*r,rot:0,fill:CPK[el]||'#a1a1aa',stroke:'#1f2937',ink:'#111827',sw:1.4,op:1,label:'',lp:'bottom',ls:'text',lsz:14,lc:'#111827'},o,{x:cx-r,y:cy-r,w:2*r,h:2*r});}
const bondsOf=id=>doc.objects.filter(l=>l.type==='line'&&l.kind==='bond'&&((l.a1&&l.a1.id===id)||(l.a2&&l.a2.id===id)));
function bondInfo(o){const cx=o.x+o.w/2,cy=o.y+o.h/2;let sum=0;const dirs=[];
  bondsOf(o.id).forEach(l=>{const mine=l.a1&&l.a1.id===o.id;const ox=mine?l.x2:l.x1,oy=mine?l.y2:l.y1;dirs.push(Math.atan2(oy-cy,ox-cx));sum+=(+l.order||1);});return {sum,dirs};}
function valenceIssue(o){const allowed=VALENCE[o.el];if(!allowed)return null;const{sum}=bondInfo(o);const q=o.q|0;if(sum===0)return null;
  const ok=allowed.some(v=>v===sum||v+q===sum||v-q===sum);return ok?null:`${o.el} มีพันธะรวม ${sum} (ปกติ ${allowed.join(' หรือ ')}${q?` ประจุ ${chargeStr(q)}`:''})`;}
function formalCharge(o){const e=elementInfo(o.el);if(!e||e.ve==null)return null;return e.ve-2*(o.lpairs|0)-bondInfo(o).sum;}
function lonePairAngles(n,dirs){const out=[],occ=dirs.slice();for(let k=0;k<n;k++){let best=0,bd=-1;for(let a=0;a<360;a+=5){const t=a*DEG;let m=Math.PI;occ.forEach(d=>{let x=Math.abs(((t-d)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI);m=Math.min(m,x);});
      const pref=-Math.abs(Math.sin(t))*.001+(occ.length?0:-Math.abs(((t+Math.PI/2)%(2*Math.PI)))*0);if(m+pref>bd){bd=m+pref;best=t;}}if(!occ.length)best=[-Math.PI/2,Math.PI/2,Math.PI,0][k%4];out.push(best);occ.push(best);}return out;}
function atomSVG(o,exp){const r=Math.min(o.w,o.h)/2,cx=o.x+o.w/2,cy=o.y+o.h/2;let s=exp?'':`<circle cx="${R2(cx)}" cy="${R2(cy)}" r="${R2(Math.max(r,8))}" fill="transparent"/>`;
  const hidden=o.style==='skeletal'&&o.el==='C';
  if(o.style==='ball')s+=ball(R2(cx),R2(cy),R2(r),o.el,o.fill);
  else if(hidden){if(!exp)s+=`<circle cx="${R2(cx)}" cy="${R2(cy)}" r="2.2" fill="#94a3b8" opacity=".6"/>`;}
  else s+=tx(R2(cx),R2(cy+.5),o.el,R2(r*1.25),o.ink||'#111827',{b:o.style!=='text'?0:0});
  if((o.lpairs|0)>0&&!hidden){const{dirs}=bondInfo(o);const d=o.style==='ball'?r+5:r*.98+3.5;
    lonePairAngles(o.lpairs|0,dirs).forEach(a=>{const ux=Math.cos(a),uy=Math.sin(a),px=-uy*3,py=ux*3;const x=cx+ux*d,y=cy+uy*d;s+=`<circle cx="${R2(x+px)}" cy="${R2(y+py)}" r="1.8" fill="${o.ink||'#111827'}"/><circle cx="${R2(x-px)}" cy="${R2(y-py)}" r="1.8" fill="${o.ink||'#111827'}"/>`;});}
  if(o.q){const k=o.style==='ball'?r+3:r*.95;s+=tx(R2(cx+k*.75),R2(cy-k*.78),chargeStr(o.q),R2(Math.max(10,r*.75)),o.ink||'#111827',{b:1,a:'start'});}
  if(!exp){const iss=valenceIssue(o);if(iss)s+=`<g><title>${esc(iss)}</title><circle cx="${R2(cx-r*.8)}" cy="${R2(cy-r*.8)}" r="5.5" fill="#f59e0b" stroke="#fff" stroke-width="1"/>${tx(R2(cx-r*.8),R2(cy-r*.8+.3),'!',8,'#fff',{b:1})}</g>`;}
  return s;}
TYPES.atomnode={name:'อะตอม',box:true,noLabel:false,anchors:['c'],
  svg:atomSVG,
  onProp(o,p,v){if(p==='rad'){const cx=o.x+o.w/2,cy=o.y+o.h/2,r=Math.max(5,+v||10);o.w=o.h=2*r;o.x=cx-r;o.y=cy-r;delete o.rad;}
    else if(p==='el'){const e=String(v).trim();o.el=e.charAt(0).toUpperCase()+e.slice(1).toLowerCase();if(CPK[o.el])o.fill=CPK[o.el];}
    else if(p==='style'){const cx=o.x+o.w/2,cy=o.y+o.h/2,r=v==='ball'?(o.el==='H'?12:17):ATOM_R[v]||14;o.w=o.h=2*r;o.x=cx-r;o.y=cy-r;}},
  afterResize(o,or){const r=Math.max(o.w,o.h)/2,cx=o.x+o.w/2,cy=o.y+o.h/2;o.w=o.h=2*r;o.x=cx-r;o.y=cy-r;},
  act(o,a){if(a.startsWith('el:')){o.el=a.slice(3);if(CPK[o.el])o.fill=CPK[o.el];}else if(a==='lp+')o.lpairs=Math.min(4,(o.lpairs|0)+1);else if(a==='lp-')o.lpairs=Math.max(0,(o.lpairs|0)-1);
    else if(a==='q+')o.q=(o.q|0)+1;else if(a==='q-')o.q=(o.q|0)-1;else if(a==='fc'){const f=formalCharge(o);if(f!=null)o.q=f;}
    else if(a==='autolp'){const e=elementInfo(o.el);if(e&&e.ve!=null){const nb=e.ve-(o.q|0)-bondInfo(o).sum;o.lpairs=Math.max(0,Math.min(4,Math.floor(nb/2)));}}},
  panel(o){const bi=bondInfo(o),fc=formalCharge(o),iss=valenceIssue(o),e=elementInfo(o.el);
    return header(`อะตอม ${esc(o.el)}${e?' · '+e.th:''}`,'Atom node — ลากเครื่องมือ “พันธะ” จากอะตอมหนึ่งไปอีกอะตอม')+`<div class="sec"><h5>ธาตุ</h5>
    <div class="row"><label class="f"><span style="padding-right:6px">ธาตุ</span><input data-p="el" value="${esc(o.el)}" maxlength="3"></label></div>
    <div class="sym">${['H','C','N','O','F','Cl','Br','I','S','P','B','Si','Na','K','Mg','Ca'].map(x=>`<button data-act="x:el:${x}" style="font-family:inherit;font-size:12px">${x}</button>`).join('')}</div></div>
    <div class="sec"><h5>รูปแบบ</h5><div class="row">${segB('style',o.style,[['ball','ลูกบอล'],['text','สัญลักษณ์'],['skeletal','โครงร่าง (C ซ่อน)']])}</div>
    <div class="row"><span class="lab">ขนาด</span><input type="range" min="6" max="40" step="1" data-p="rad" value="${R2(o.w/2)}"><span class="val">${R2(o.w/2)}</span></div>
    ${o.style==='ball'?colorRow('สีลูกบอล','fill',o.fill,['#4b5563','#f5f5f5','#e23b3b','#3b6fd8','#33c24d','#f2c230','#9b6bd6']):colorRow('สีตัวอักษร','ink',o.ink||'#111827',PAL.slice(0,8))}</div>
    <div class="sec"><h5>อิเล็กตรอนคู่โดดเดี่ยวและประจุ</h5>
    <div class="row"><span class="lab">คู่โดดเดี่ยว</span><div class="stp"><button data-act="x:lp-">−</button><b>${o.lpairs|0}</b><button data-act="x:lp+">+</button></div>${actBtn('autolp','อัตโนมัติ (ครบออกเตต)')}</div>
    <div class="row"><span class="lab">ประจุ</span><div class="stp"><button data-act="x:q-">−</button><b>${chargeStr(o.q|0)||'0'}</b><button data-act="x:q+">+</button></div>${actBtn('fc','ใช้ประจุฟอร์มัล')}</div>
    <div class="hint" style="background:#f8fafc;border:1px solid var(--line);border-radius:8px;padding:8px 10px">พันธะรวม (ผลรวมอันดับพันธะ) <b>${bi.sum}</b>${VALENCE[o.el]?` · ปกติ ${VALENCE[o.el].join(' หรือ ')}`:''}${fc!=null?`<br>ประจุฟอร์มัล = ${e.ve} − ${2*(o.lpairs|0)} − ${bi.sum} = <b>${fc>0?'+':''}${fc}</b>`:''}${iss?`<br><span style="color:#b45309">⚠ ${esc(iss)} — เป็นคำเตือนเท่านั้น โมเลกุลบางชนิดขยายออกเตตได้</span>`:''}</div></div>`;}};

/* Bond connector (line kind) */
function shrinkFor(id){const a=id&&byId(id);if(!a||a.type!=='atomnode')return 0;const r=Math.min(a.w,a.h)/2;if(a.style==='skeletal'&&a.el==='C')return 0;return a.style==='ball'?r*.9:r*.82+2;}
function bondSVG(o,exp){let x1=o.x1,y1=o.y1,x2=o.x2,y2=o.y2;const L0=Math.hypot(x2-x1,y2-y1)||1,ux=(x2-x1)/L0,uy=(y2-y1)/L0,nx=-uy,ny=ux;
  const s1=Math.min(L0*.45,shrinkFor(o.a1&&o.a1.id)),s2=Math.min(L0*.45,shrinkFor(o.a2&&o.a2.id));x1+=ux*s1;y1+=uy*s1;x2-=ux*s2;y2-=uy*s2;
  const c=o.stroke,w=o.sw||2,ord=+o.order||1,g=Math.max(3.4,w*1.7);const seg=(ax,ay,bx,by)=>`M${R2(ax)},${R2(ay)}L${R2(bx)},${R2(by)}`;let d='',s='';
  if(o.bstyle==='wedge'&&ord===1){const W=Math.max(4,w*2.6);s+=`<path d="M${R2(x1+nx*.6)},${R2(y1+ny*.6)}L${R2(x2+nx*W)},${R2(y2+ny*W)}L${R2(x2-nx*W)},${R2(y2-ny*W)}L${R2(x1-nx*.6)},${R2(y1-ny*.6)}Z" fill="${c}"/>`;}
  else if(o.bstyle==='hash'&&ord===1){const W=Math.max(4,w*2.6),L=Math.hypot(x2-x1,y2-y1),n=Math.max(4,Math.round(L/4.5));for(let i=0;i<=n;i++){const t=i/n,px=x1+(x2-x1)*t,py=y1+(y2-y1)*t,h=.6+(W-.6)*t;d+=seg(px+nx*h,py+ny*h,px-nx*h,py-ny*h);}s+=`<path d="${d}" stroke="${c}" stroke-width="${R2(Math.max(1,w*.6))}" stroke-linecap="round"/>`;}
  else{if(ord===2&&o.dside){const sd=+o.dside;d=seg(x1,y1,x2,y2);const sh=L0*.12;d+=seg(x1+ux*sh+nx*g*1.6*sd,y1+uy*sh+ny*g*1.6*sd,x2-ux*sh+nx*g*1.6*sd,y2-uy*sh+ny*g*1.6*sd);}
    else{const offs=ord===3?[-g*1.1,0,g*1.1]:ord===2?[-g*.8,g*.8]:[0];offs.forEach(k=>d+=seg(x1+nx*k,y1+ny*k,x2+nx*k,y2+ny*k));}
    s+=`<path d="${d}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"${dashArr(o)}/>`;}
  if(!exp)s=`<path d="M${R2(o.x1)},${R2(o.y1)}L${R2(o.x2)},${R2(o.y2)}" stroke="transparent" stroke-width="${Math.max(12,w+10)}"/>`+s;
  return s;}
LINEKINDS.bond={name:'พันธะเคมี',svg:bondSVG,
  panel:o=>`<div class="sec"><h5>พันธะเคมี</h5><div class="row"><span class="lab">อันดับพันธะ</span>${segB('order',String(o.order||1),[['1','เดี่ยว'],['2','คู่'],['3','สาม']])}</div>
   <div class="row"><span class="lab">ทิศทาง 3 มิติ</span>${segB('bstyle',o.bstyle||'normal',[['normal','ปกติ'],['wedge','ลิ่มทึบ'],['hash','ลิ่มขีด']])}</div>
   ${(+o.order||1)===2?`<div class="row"><span class="lab">เส้นที่สอง</span>${segB('dside',String(o.dside||0),[['-1','ด้าน A'],['0','กึ่งกลาง'],['1','ด้าน B']])}</div>`:''}
   <div class="hint">ลิ่มทึบ = พุ่งออกจากระนาบ · ลิ่มขีด = ชี้เข้าไปหลังระนาบ (ปลายแคบอยู่ที่อะตอมต้น — กด “สลับทิศทาง” เพื่อกลับด้าน)</div></div>`};
LINE_NAME.bond='พันธะเคมี';
LP.bond={n:'พันธะเคมี',kind:'bond',stroke:'#1f2937',sw:2};
ICON.bond='<circle cx="5" cy="17" r="3"/><circle cx="19" cy="7" r="3"/><path d="M7.5 15.2L16.5 8.8M8.6 17.4l8.2-5.8"/>';

/* Build a molecule from atoms [[el,dx,dy,{opts}]] and bonds [[i,j,order,bstyle,dside]] */
function molecule(cx,cy,atoms,bonds,o={}){const style=o.style||'ball';const sc=o.scale||1;
  const A=atoms.map(([el,dx,dy,ex],i)=>{const e=Object.assign({style},ex||{});if(style==='ball'&&i>0)e.lpairs=0;return mkAtom(el,cx+dx*sc,cy+dy*sc,e);});
  const B=bonds.map(([i,j,ord,bs,ds])=>{const a=A[i],b=A[j];const l=mkLine('bond',a.x+a.w/2,a.y+a.h/2,b.x+b.w/2,b.y+b.h/2,{order:ord||1,bstyle:bs||'normal',dside:ds||0,stroke:style==='ball'?'#9ca3af':'#1f2937',sw:style==='ball'?5:2});l.a1={id:a.id,a:'c'};l.a2={id:b.id,a:'c'};return l;});
  return [...B,...A];}
const at=(a,L)=>[Math.cos(a*DEG)*L,Math.sin(a*DEG)*L];
const MOLS={
  h2o:st=>{const L=52,[hx,hy]=at(90-52.25,L);return molecule(0,0,[['O',0,0,{lpairs:st==='ball'?0:2}],['H',-hx,hy],['H',hx,hy]],[[0,1],[0,2]],{style:st});},
  co2:st=>molecule(0,0,[['C',0,0],['O',-58,0,{lpairs:st==='ball'?0:2}],['O',58,0,{lpairs:st==='ball'?0:2}]],[[0,1,2],[0,2,2]],{style:st}),
  ch4:st=>{const L=52;return molecule(0,0,[['C',0,0],['H',0,-L],['H',...at(150,L)],['H',...at(20,L)],['H',...at(62,L)]],[[0,1],[0,2],[0,3,1,'wedge'],[0,4,1,'hash']],{style:st});},
  nh3:st=>{const L=52;return molecule(0,0,[['N',0,0,{lpairs:1}],['H',...at(150,L)],['H',...at(30,L),{}],['H',...at(95,L)]],[[0,1],[0,2,1,'wedge'],[0,3,1,'hash']],{style:st});},
  ethanol:st=>{const L=50;return molecule(0,0,[['C',-L,0],['C',0,0],['O',L,0,{lpairs:2}],['H',L*1.75,0],['H',-L*1.9,0],['H',-L,-L],['H',-L,L],['H',0,-L],['H',0,L]],[[0,1],[1,2],[2,3],[0,4],[0,5],[0,6],[1,7],[1,8]],{style:st});},
  benzene:()=>{const R=44,A=[...Array(6)].map((_,i)=>['C',...at(-90+i*60,R)]);const B=[...Array(6)].map((_,i)=>{const j=(i+1)%6,mx=(A[i][1]+A[j][1])/2,my=(A[i][2]+A[j][2])/2;const ux=A[j][1]-A[i][1],uy=A[j][2]-A[i][2],L=Math.hypot(ux,uy);const nx=-uy/L,ny=ux/L;return [i,j,i%2?1:2,'normal',i%2?0:(nx*-mx+ny*-my>0?1:-1)];});return molecule(0,0,A,B,{style:'skeletal'});},
  bf3:st=>molecule(0,0,[['B',0,0],['F',...at(-90,56),{lpairs:3}],['F',...at(30,56),{lpairs:3}],['F',...at(150,56),{lpairs:3}]],[[0,1],[0,2],[0,3]],{style:st}),
  becl2:st=>molecule(0,0,[['Be',0,0],['Cl',-62,0,{lpairs:3}],['Cl',62,0,{lpairs:3}]],[[0,1],[0,2]],{style:st}),
  pcl5:st=>molecule(0,0,[['P',0,0],['Cl',0,-62],['Cl',0,62],['Cl',-62,0],['Cl',...at(30,58)],['Cl',...at(-30,58)]],[[0,1],[0,2],[0,3],[0,4,1,'wedge'],[0,5,1,'hash']],{style:st}),
  sf6:st=>molecule(0,0,[['S',0,0],['F',0,-60],['F',0,60],['F',-60,0],['F',60,0],['F',...at(35,50)],['F',...at(215,50)]],[[0,1],[0,2],[0,3],[0,4],[0,5,1,'wedge'],[0,6,1,'hash']],{style:st})};
const place=(objs,x,y)=>{objs.forEach(o=>moveObj(o,x,y));resolveAnchorsFor(objs);return objs;};
function resolveAnchorsFor(objs){const save=doc.objects;doc.objects=save.concat(objs.filter(o=>!save.includes(o)));resolveAnchors();doc.objects=save;}
const molPreview=(atoms,bonds)=>bonds.map(([i,j,w])=>stick(atoms[i][1],atoms[i][2],atoms[j][1],atoms[j][2],w||4)).join('')+atoms.map(([el,x,y,r])=>ball(x,y,r||(el==='H'?9:13),el,CPK[el]||'#a1a1aa')).join('');
const angObj=(vx,vy,p1,p2,label='')=>Object.assign(mkAngle(vx,vy),{x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],label,r:22,lsz:13,stroke:'#7c3aed',lc:'#7c3aed',arms:false});
function addMol(key,st,x,y,extra){const objs=place(MOLS[key](st),x,y);if(extra)objs.push(...extra(objs));return objs;}
def('chem_mol','mol_h2o','โมเลกุลน้ำ H₂O (มุม 104.5°)','water molecule h2o bent',100,80,{al:'น้ำ water โมเลกุล',make:(x,y)=>addMol('h2o','ball',x,y,objs=>{const at3=objs.filter(o=>o.type==='atomnode');const c=a=>[a.x+a.w/2,a.y+a.h/2];const[o,h1,h2]=at3.map(c);return [angObj(o[0],o[1],h1,h2)];})},p=>molPreview([['O',50,26,16],['H',22,52],['H',78,52]],[[0,1],[0,2]]));
def('chem_mol','mol_h2o_lewis','น้ำ H₂O โครงสร้างลิวอิส','water lewis structure',100,80,{al:'ลิวอิส lewis น้ำ',make:(x,y)=>addMol('h2o','text',x,y)},p=>tx(50,30,'O',20,'#111827')+tx(18,60,'H',18,'#111827')+tx(82,60,'H',18,'#111827')+'<path d="M42,38L25,52M58,38L75,52" stroke="#111827" stroke-width="2"/>'+[[44,12],[50,12],[34,24],[34,30]].map(([x,y])=>`<circle cx="${x+(y<20?0:0)}" cy="${y}" r="1.8" fill="#111827"/>`).join('')+'<circle cx="66" cy="24" r="1.8" fill="#111827"/><circle cx="66" cy="30" r="1.8" fill="#111827"/>');
def('chem_mol','mol_co2','คาร์บอนไดออกไซด์ CO₂ (เส้นตรง)','carbon dioxide co2 linear',120,50,{al:'คาร์บอนไดออกไซด์',make:(x,y)=>addMol('co2','ball',x,y)},p=>stick(18,25,102,25,4)+stick(18,19,102,19,3)+molPreview([['O',18,25,14],['C',60,25,13],['O',102,25,14]],[]));
def('chem_mol','mol_ch4','มีเทน CH₄ (ทรงสี่หน้า)','methane ch4 tetrahedral wedge dash',100,100,{al:'มีเทน tetrahedral',make:(x,y)=>addMol('ch4','ball',x,y)},p=>molPreview([['C',50,54,14],['H',50,14],['H',16,72],['H',86,68],['H',66,90]],[[0,1],[0,2],[0,3],[0,4]]));
def('chem_mol','mol_nh3','แอมโมเนีย NH₃ (พีระมิดฐานสามเหลี่ยม)','ammonia nh3 trigonal pyramidal',100,100,{al:'แอมโมเนีย',make:(x,y)=>addMol('nh3','ball',x,y)},p=>molPreview([['N',50,40,15],['H',16,62],['H',84,62],['H',54,86]],[[0,1],[0,2],[0,3]]));
def('chem_mol','mol_ethanol','เอทานอล C₂H₅OH (สูตรโครงสร้าง)','ethanol structural formula',140,80,{al:'เอทานอล แอลกอฮอล์',make:(x,y)=>addMol('ethanol','text',x,y)},p=>tx(70,40,'H₃C–CH₂–OH',17,'#111827'));
def('chem_mol','mol_benzene','เบนซีน (สูตรโครงร่าง)','benzene skeletal formula aromatic ring',100,100,{al:'เบนซีน วงแหวน',make:(x,y)=>addMol('benzene','skeletal',x,y)},p=>{const P=[...Array(6)].map((_,i)=>at(-90+i*60,38).map((v,k)=>v+50));let d=`M${P[0]}`+P.slice(1).map(q=>`L${q}`).join('')+'Z';return `<path d="${d}" fill="none" stroke="#111827" stroke-width="2.4"/><path d="M${P[0].map((v,k)=>R2(v*.82+50*.18))}L${P[1].map(v=>R2(v*.82+50*.18))}M${P[2].map(v=>R2(v*.82+50*.18))}L${P[3].map(v=>R2(v*.82+50*.18))}M${P[4].map(v=>R2(v*.82+50*.18))}L${P[5].map(v=>R2(v*.82+50*.18))}" stroke="#111827" stroke-width="2.4"/>`;});
[['becl2','BeCl₂ เส้นตรง 180°','linear',[['Be',60,40,13],['Cl',18,40,14],['Cl',102,40,14]],[[0,1],[0,2]]],
 ['bf3','BF₃ สามเหลี่ยมแบนราบ 120°','trigonal planar',[['B',50,52,13],['F',50,14,12],['F',18,72,12],['F',82,72,12]],[[0,1],[0,2],[0,3]]],
 ['pcl5','PCl₅ พีระมิดคู่ฐานสามเหลี่ยม','trigonal bipyramidal',[['P',50,50,13],['Cl',50,10,11],['Cl',50,90,11],['Cl',12,50,11],['Cl',86,66,11],['Cl',86,32,11]],[[0,1],[0,2],[0,3],[0,4],[0,5]]],
 ['sf6','SF₆ ทรงแปดหน้า','octahedral',[['S',50,50,13],['F',50,10,11],['F',50,90,11],['F',10,50,11],['F',90,50,11],['F',78,70,11],['F',22,30,11]],[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]]]
 .forEach(([k,n,en,a,b])=>def('chem_mol','vsepr_'+k,'VSEPR: '+n,'vsepr molecular geometry '+en,k==='becl2'?120:100,k==='becl2'?80:100,{al:'รูปร่างโมเลกุล vsepr geometry',make:(x,y)=>addMol(k,'ball',x,y)},p=>molPreview(a,b)));
/* single atoms palette */
['H','C','N','O','F','Cl','Br','I','S','P','Na'].forEach(el=>{const e=elementInfo(el);def('chem_mol','an_'+el,`อะตอม ${el} (${e.th})`,`atom node ${e.en}`,40,40,{al:'อะตอม ธาตุ atom element',make:(x,y)=>[mkAtom(el,x,y)]},p=>ball(20,20,el==='H'?13:17,el,CPK[el]||'#a1a1aa'));});
/* NaCl ionic lattice (fixed drawing) */
def('chem_mol','nacl','ผลึกไอออนิก NaCl','sodium chloride ionic lattice crystal',150,150,{al:'โซเดียมคลอไรด์ ผลึก lattice ionic'},p=>{const P=(x,y,z)=>[18+50*x+22*z,128-50*y-22*z];let ln2='',at2=[];
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++){const q=P(i,j,k);if(i<2){const r=P(i+1,j,k);ln2+=`M${q}L${r}`;}if(j<2){const r=P(i,j+1,k);ln2+=`M${q}L${r}`;}if(k<2){const r=P(i,j,k+1);ln2+=`M${q}L${r}`;}at2.push([q,(i+j+k)%2,k,j]);}
  at2.sort((a,b)=>(b[2]-a[2])||(a[3]-b[3]));return `<path d="${ln2}" stroke="#94a3b8" stroke-width="${R2(p.sw*.6)}"/>`+at2.map(([[x,y],na])=>na?ball(R2(x),R2(y),6,'','#9b6bd6'):ball(R2(x),R2(y),10,'','#33c24d')).join('')+tx(18,8,'Na⁺',10,'#6b21a8',{b:1,a:'start'})+tx(70,8,'Cl⁻',10,'#15803d',{b:1,a:'start'});});

/* expose for templates (same file, later section) */
window.__chem={mkBohr,mkAtom,molecule,MOLS,place,addMol,angObj,resolveAnchorsFor};
})();
