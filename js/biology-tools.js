/* PhysiDraw — Biology tools (Phase 3c): Punnett square (1–2 genes, complete dominance)
   and DNA / mRNA sequence with complementary strand, hydrogen bonds and translation
   using the standard genetic code (NCBI table 1). */
"use strict";
(function(){
if(!window.__bio)return;
const {f}=window.__bio;
const boxT=(o,inner)=>`<g transform="translate(${f(o.x+o.w/2)} ${f(o.y+o.h/2)}) rotate(${f(o.rot||0)}) translate(${f(-o.w/2)} ${f(-o.h/2)})">${inner}</g>`;
const hit=(o,exp)=>exp?'':`<rect width="${f(o.w)}" height="${f(o.h)}" fill="transparent"/>`;
const chk=(p,on,label)=>`<label class="chk"><input type="checkbox" data-p="${p}" ${on?'checked':''}>${label}</label>`;
const btn=(a,label)=>`<button class="btn" data-act="x:${a}" style="height:27px;padding:0 9px;font-size:11.5px">${label}</button>`;
const header=(t,sub)=>`<div class="ph"><div class="ttl">${t}<div class="sub">${sub}</div></div>${ACTS}</div>`;
const posSec=o=>`<div class="sec"><h5>ตำแหน่งและขนาด</h5><div class="row">${num('X','x',o.x)}${num('Y','y',o.y)}</div></div>`;
const cv=document.createElement('canvas').getContext('2d');const tw=(t,sz,b)=>{cv.font=`${b?700:400} ${sz}px ${SANS}`;return cv.measureText(t).width;};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const keepPos=(o,W,H)=>{const cx=o.x+o.w/2,cy=o.y+o.h/2;o.w=W;o.h=H;o.x=cx-W/2;o.y=cy-H/2;};

/* ======================= PUNNETT ======================= */
function parseGeno(g){g=String(g||'').replace(/[^A-Za-z]/g,'');if(!g||g.length%2||g.length>4)return null;const genes=[];
  for(let i=0;i<g.length;i+=2){const a=g[i],b=g[i+1];if(a.toLowerCase()!==b.toLowerCase())return null;genes.push([a,b]);}return genes;}
const gametes=genes=>genes.reduce((acc,[a,b])=>acc.flatMap(x=>[x+a,x+b]),['']);
const order=(x,y)=>x===x.toUpperCase()?x+y:y+x;
function punnettData(o){const g1=parseGeno(o.p1),g2=parseGeno(o.p2);
  if(!g1||!g2)return {err:'จีโนไทป์ต้องเป็นคู่อักษรตัวเดียวกัน เช่น Aa หรือ AaBb (สูงสุด 2 ยีน)'};
  if(g1.length!==g2.length||g1.some((p,i)=>p[0].toLowerCase()!==g2[i][0].toLowerCase()))return {err:'พ่อและแม่ต้องมียีนชุดเดียวกัน เช่น AaBb × aaBb'};
  const top=gametes(g1),side=gametes(g2),n=g1.length;const cells=side.map(sg=>top.map(tg=>{let geno='',ph='';for(let i=0;i<n;i++){geno+=order(tg[i],sg[i]);ph+=/[A-Z]/.test(tg[i]+sg[i])?'D':'r';}return {geno,ph};}));
  const gc={},pc={};cells.flat().forEach(c=>{gc[c.geno]=(gc[c.geno]||0)+1;pc[c.ph]=(pc[c.ph]||0)+1;});
  const up=s=>(s.match(/[A-Z]/g)||[]).length;const gk=Object.keys(gc).sort((a,b)=>up(b)-up(a)||a.localeCompare(b,'en',{caseFirst:'upper'}));
  const pk=Object.keys(pc).sort((a,b)=>(b.split('D').length-a.split('D').length)||a.localeCompare(b));
  const red=arr=>{const g=arr.reduce(gcd);return arr.map(v=>v/g);};
  const letters=g1.map(p=>p[0].toUpperCase());const names=[o.t1||'',o.t2||''].map(t=>t.split('/').map(s=>s.trim()));
  const phName=k=>[...k].map((c,i)=>{const nm=names[i];if(nm[0]&&nm[1])return c==='D'?nm[0]:nm[1];return c==='D'?letters[i]+'_':letters[i].toLowerCase()+letters[i].toLowerCase();}).join(n>1&&names.some(x=>x[0])?' ':'');
  return {top,side,cells,n,gk,gr:red(gk.map(k=>gc[k])),pk,pr:red(pk.map(k=>pc[k])),phName};}
const PHC=['#bbf7d0','#bfdbfe','#fde68a','#fecaca'];
function punnettLayout(o){const d=punnettData(o),cs=o.cs||56,fs=o.fs||Math.round(cs*.3);
  if(d.err){const W=Math.max(220,tw(d.err,12)+20);return {W,H:44,svg:`<rect width="${f(W)}" height="44" rx="6" fill="#fef2f2" stroke="#fca5a5"/>`+tx(W/2,22,esc(d.err),12,'#b91c1c')};}
  const m=d.top.length,nR=d.side.length,gw=(m+1)*cs,gh=(nR+1)*cs;let s='';
  const phIdx=k=>Math.max(0,d.pk.indexOf(k));
  s+=`<rect x="0" y="0" width="${cs}" height="${cs}" fill="#f8fafc" stroke="#94a3b8"/><path d="M0,0L${cs},${cs}" stroke="#cbd5e1"/>`+tx(cs*.7,cs*.28,esc(o.l1||'♂'),cs*.22,'#2563eb',{b:1})+tx(cs*.3,cs*.74,esc(o.l2||'♀'),cs*.22,'#db2777',{b:1});
  const gam=(x,y,t,c)=>`<rect x="${x}" y="${y}" width="${cs}" height="${cs}" fill="#f1f5f9" stroke="#94a3b8"/><circle cx="${x+cs/2}" cy="${y+cs/2}" r="${f(cs*.34)}" fill="#fff" stroke="${c}" stroke-width="1.4"/>`+tx(x+cs/2,y+cs/2,esc(t),fs*.95,'#111827',{b:1,serif:1,i:1});
  d.top.forEach((t,i)=>s+=gam((i+1)*cs,0,t,'#2563eb'));d.side.forEach((t,j)=>s+=gam(0,(j+1)*cs,t,'#db2777'));
  d.cells.forEach((row,j)=>row.forEach((c,i)=>{const x=(i+1)*cs,y=(j+1)*cs;s+=`<rect x="${x}" y="${y}" width="${cs}" height="${cs}" fill="${o.color!==false?PHC[phIdx(c.ph)%4]:'#fff'}" stroke="#94a3b8"/>`+tx(x+cs/2,y+cs/2,esc(c.geno),d.n>1?fs*.82:fs,'#111827',{serif:1,i:1});}));
  s+=`<rect width="${gw}" height="${gh}" fill="none" stroke="#475569" stroke-width="1.6"/>`;
  let W=gw,H=gh;if(o.ratio!==false){const l1=`ฟีโนไทป์  ${d.pk.map(d.phName).join(' : ')}  =  ${d.pr.join(' : ')}`;const l2=d.gk.length<=4?`จีโนไทป์  ${d.gk.join(' : ')}  =  ${d.gr.join(' : ')}`:`จีโนไทป์ทั้งหมด ${d.gk.length} แบบ`;
    const rs=o.rs||13;W=Math.max(gw,tw(l1,rs,1)+8,tw(l2,rs)+8);const ox=(W-gw)/2;s=`<g transform="translate(${f(ox)} 0)">${s}</g>`;
    s+=tx(W/2,gh+rs*1.5,esc(l1),rs,'#111827',{b:1})+tx(W/2,gh+rs*3.1,esc(l2),rs,'#334155');H=gh+rs*4;}
  return {W,H,svg:s};}
function mkPunnett(p1,p2,cx,cy,o={}){const e=Object.assign({id:uid(),type:'punnett',p1,p2,cs:56,t1:'',t2:'',l1:'♂',l2:'♀',ratio:true,color:true,x:0,y:0,w:10,h:10,rot:0,op:1,label:'',lp:'bottom',ls:'text',lsz:14,lc:'#111827'},o);const L0=punnettLayout(e);e.w=L0.W;e.h=L0.H;e.x=cx-e.w/2;e.y=cy-e.h/2;return e;}
TYPES.punnett={name:'ตารางพันเนตต์',box:true,
  svg(o,exp){const L0=punnettLayout(o);keepPos(o,L0.W,L0.H);return boxT(o,hit(o,exp)+L0.svg);},
  afterResize(o,or){o.cs=clamp(Math.round((or.cs||56)*o.w/or.w),28,140);const L0=punnettLayout(o);keepPos(o,L0.W,L0.H);},
  onProp(o,p,v){if(p==='cs')o.cs=clamp(+v||56,28,140);},
  act(o,a){const EX={mono:['Aa','Aa','',''],test:['Aa','aa','',''],di:['AaBb','AaBb','เมล็ดกลม/เมล็ดขรุขระ','สีเหลือง/สีเขียว'],pea:['Rr','Rr','เมล็ดกลม/เมล็ดขรุขระ','']};const e=EX[a];if(e){[o.p1,o.p2,o.t1,o.t2]=e;}},
  panel(o){const d=punnettData(o);
    return header('ตารางพันเนตต์','Punnett square · ข่มสมบูรณ์')+`<div class="sec"><h5>พ่อแม่</h5>
    <div class="row"><label class="f"><span style="padding-right:6px">♂</span><input data-p="p1" value="${esc(o.p1)}"></label><label class="f"><span style="padding-right:6px">♀</span><input data-p="p2" value="${esc(o.p2)}"></label></div>
    <div class="row" style="flex-wrap:wrap;gap:5px">${btn('mono','Aa × Aa')}${btn('test','ผสมทดสอบ Aa × aa')}${btn('pea','เมล็ดถั่ว Rr × Rr')}${btn('di','AaBb × AaBb')}</div>
    <div class="hint">พิมพ์ได้ 1–2 ยีน ตัวพิมพ์ใหญ่ = แอลลีลเด่น เช่น <code>Aa</code>, <code>AaBb</code>, <code>AABb</code></div></div>
    <div class="sec"><h5>ชื่อลักษณะ (เด่น/ด้อย)</h5><div class="row"><label class="f"><span style="padding-right:6px">ยีน 1</span><input data-p="t1" placeholder="เช่น สูง/เตี้ย" value="${esc(o.t1||'')}"></label></div>
    <div class="row"><label class="f"><span style="padding-right:6px">ยีน 2</span><input data-p="t2" placeholder="เช่น ดอกม่วง/ดอกขาว" value="${esc(o.t2||'')}"></label></div></div>
    <div class="sec"><h5>การแสดงผล</h5><div class="row" style="flex-wrap:wrap;gap:6px 14px">${chk('ratio',o.ratio!==false,'อัตราส่วน')}${chk('color',o.color!==false,'แรเงาตามฟีโนไทป์')}</div>
    <div class="row"><span class="lab">ขนาดช่อง</span><input type="range" min="30" max="110" data-p="cs" value="${o.cs||56}"><span class="val">${o.cs||56}</span></div>
    ${d.err?`<div class="hint" style="color:#b91c1c">${d.err}</div>`:`<div class="hint" style="background:#f8fafc;border:1px solid var(--line);border-radius:8px;padding:8px 10px">เซลล์สืบพันธุ์ ♂: <b>${d.top.join(', ')}</b> · ♀: <b>${d.side.join(', ')}</b><br>ฟีโนไทป์ = <b>${d.pr.join(' : ')}</b></div>`}</div>`+posSec(o);}};

/* ======================= DNA / mRNA ======================= */
const AA1='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG',NB='UCAG';
const AA3={A:'Ala',R:'Arg',N:'Asn',D:'Asp',C:'Cys',Q:'Gln',E:'Glu',G:'Gly',H:'His',I:'Ile',L:'Leu',K:'Lys',M:'Met',F:'Phe',P:'Pro',S:'Ser',T:'Thr',W:'Trp',Y:'Tyr',V:'Val','*':'Stop'};
const codonAA=c=>{if(!/^[UCAG]{3}$/.test(c))return null;return AA1[NB.indexOf(c[0])*16+NB.indexOf(c[1])*4+NB.indexOf(c[2])];};
const COMP={A:'T',T:'A',G:'C',C:'G'};const BC={A:'#f87171',T:'#60a5fa',G:'#4ade80',C:'#facc15',U:'#c084fc'};
const cleanSeq=(s,rna)=>{s=String(s||'').toUpperCase().replace(rna?/T/g:/U/g,rna?'U':'T').replace(rna?/[^ACGU]/g:/[^ACGT]/g,'');return s.slice(0,72);};
function translate(r,fromAUG){let i0=0;if(fromAUG){i0=r.indexOf('AUG');if(i0<0)return {i0:-1,aa:[]};}const aa=[];for(let i=i0;i+3<=r.length;i+=3){const a=codonAA(r.slice(i,i+3));aa.push(a);if(fromAUG&&a==='*')break;}return {i0,aa};}
function seqLayout(o){const rna=o.mode==='rna',s=cleanSeq(o.seq,rna),bw=o.bw||24,m=24,n=s.length,W=m*2+Math.max(1,n)*bw;let g='';const bh=bw*1.05,fs=bw*.55;
  const base=(x,y,b,up)=>`<rect x="${f(x+1)}" y="${f(y)}" width="${f(bw-2)}" height="${f(bh)}" rx="${f(bw*.14)}" fill="${BC[b]}" stroke="${shade(BC[b],-.45)}" stroke-width="1"/>`+tx(f(x+bw/2),f(y+bh/2+.5),b,fs,'#111827',{b:1});
  const lab=(x,y,t,a)=>tx(x,y,t,bw*.42,'#475569',{b:1,a});
  if(!n)return {W:200,H:40,svg:tx(100,20,'พิมพ์ลำดับเบสในแผงด้านขวา',12,'#94a3b8')};
  if(!rna){const y0=8,y1=y0+4,hb=bw*.55,y2=y1+bh+hb,y3=y2+bh+4;
    g+=`<path d="M${m-2},${y0}H${W-m+2}M${m-2},${f(y3)}H${W-m+2}" stroke="#334155" stroke-width="3" stroke-linecap="round"/>`;
    [...s].forEach((b,i)=>{const x=m+i*bw,c=COMP[b];g+=`<path d="M${f(x+bw/2)},${y0}V${y1}M${f(x+bw/2)},${f(y2+bh)}V${f(y3)}" stroke="#334155" stroke-width="1.4"/>`+base(x,y1,b)+base(x,y2,c);
      if(o.hb!==false){const k=(b==='G'||b==='C')?3:2;for(let j=0;j<k;j++){const xx=x+bw/2+(j-(k-1)/2)*bw*.2;g+=`<path d="M${f(xx)},${f(y1+bh+2)}V${f(y2-2)}" stroke="#64748b" stroke-width="1.1" stroke-dasharray="2 1.6"/>`;}}});
    if(o.ends!==false)g+=lab(m-6,y0+bh*.5,'5′','end')+lab(W-m+6,y0+bh*.5,'3′','start')+lab(m-6,y3-bh*.5,'3′','end')+lab(W-m+6,y3-bh*.5,'5′','start');
    return {W,H:y3+8,svg:g};}
  const y0=8,y1=y0+4;g+=`<path d="M${m-2},${y0}H${W-m+2}" stroke="#7e22ce" stroke-width="3" stroke-linecap="round"/>`;const tr=translate(s,o.fromAUG!==false);
  if(o.aa!==false&&tr.i0>=0)tr.aa.forEach((a,k)=>{const x=m+(tr.i0+k*3)*bw;g+=`<rect x="${f(x)}" y="${y1-2}" width="${f(bw*3)}" height="${f(bh+4)}" rx="4" fill="${k%2?'#f5f3ff':'#ede9fe'}"/>`;});
  [...s].forEach((b,i)=>{const x=m+i*bw;g+=`<path d="M${f(x+bw/2)},${y0}V${y1}" stroke="#7e22ce" stroke-width="1.4"/>`+base(x,y1,b);});
  if(o.ends!==false)g+=lab(m-6,y0+bh*.5,'5′','end')+lab(W-m+6,y0+bh*.5,'3′','start');let H=y1+bh+8;
  if(o.aa!==false&&tr.i0>=0&&tr.aa.length){const ya=y1+bh+bw*.95,ry=bw*.48;tr.aa.forEach((a,k)=>{const cx=m+(tr.i0+k*3+1.5)*bw,stop=a==='*';
      if(k)g+=`<path d="M${f(cx-bw*3+bw*1.32)},${f(ya)}H${f(cx-bw*1.32)}" stroke="#475569" stroke-width="2"/>`;
      g+=`<path d="M${f(cx-bw*1.4)},${f(y1+bh+3)}V${f(y1+bh+6)}H${f(cx+bw*1.4)}V${f(y1+bh+3)}" fill="none" stroke="#94a3b8"/><ellipse cx="${f(cx)}" cy="${f(ya)}" rx="${f(bw*1.32)}" ry="${f(ry)}" fill="${stop?'#f1f5f9':'#fde68a'}" stroke="${stop?'#94a3b8':'#b45309'}" stroke-width="1.2"/>`+tx(f(cx),f(ya+.5),stop?'หยุด':AA3[a],bw*.46,stop?'#64748b':'#78350f',{b:1});});H=ya+ry+8;}
  return {W,H,svg:g};}
function mkSeq(seq,mode,cx,cy,o={}){const e=Object.assign({id:uid(),type:'dnaseq',seq,mode,bw:24,hb:true,ends:true,aa:true,fromAUG:true,x:0,y:0,w:10,h:10,rot:0,op:1,label:'',lp:'bottom',ls:'text',lsz:14,lc:'#111827'},o);const L0=seqLayout(e);e.w=L0.W;e.h=L0.H;e.x=cx-e.w/2;e.y=cy-e.h/2;return e;}
TYPES.dnaseq={name:'ลำดับเบส DNA / RNA',box:true,
  svg(o,exp){const L0=seqLayout(o);keepPos(o,L0.W,L0.H);return boxT(o,hit(o,exp)+L0.svg);},
  afterResize(o,or){o.bw=clamp(R2((or.bw||24)*o.w/or.w),10,60);const L0=seqLayout(o);keepPos(o,L0.W,L0.H);},
  onProp(o,p,v){if(p==='bw')o.bw=clamp(+v||24,10,60);if(p==='seq')o.seq=String(v).toUpperCase();},
  act(o,a){const rna=o.mode==='rna';if(a==='tx'){o.seq=cleanSeq(o.seq,false).replace(/T/g,'U');o.mode='rna';}
    else if(a==='rt'){o.seq=cleanSeq(o.seq,true).replace(/U/g,'T');o.mode='dna';}
    else if(a==='rand'){const B=rna?'ACGU':'ACGT';let s=rna?'AUG':'ATG';for(let i=0;i<15;i++)s+=B[Math.floor(Math.random()*4)];o.seq=s+(rna?'UAA':'TAA');}
    else if(a.startsWith('ex:')){const EX=['ATGGCCTTTAAA','AUGUUUGGCAAAUAG','ATGCATGCATGC','AUGGAUCCAUGA'];o.seq=EX[+a.slice(3)];o.mode=o.seq.includes('U')?'rna':'dna';}},
  panel(o){const rna=o.mode==='rna',s=cleanSeq(o.seq,rna);const gc=s.length?Math.round([...s].filter(b=>b==='G'||b==='C').length/s.length*100):0;
    const mr=rna?s:s.replace(/T/g,'U');const tr=translate(mr,o.fromAUG!==false);const prot=tr.i0<0?'— (ไม่พบโคดอนเริ่ม AUG)':tr.aa.map(a=>AA3[a]).join('–')||'—';
    const tpl=rna?'':[...s].map(b=>COMP[b]).join('');
    return header('ลำดับเบส DNA / RNA','DNA double strand · mRNA · translation')+`<div class="sec"><h5>ลำดับเบส (5′ → 3′)</h5>
    <textarea class="ta" data-p="seq" id="fText" style="font-family:ui-monospace,Menlo,monospace;font-size:12.5px;letter-spacing:1px">${esc(o.seq||'')}</textarea>
    <div class="row">${segB('mode',rna?'rna':'dna',[['dna','DNA สายคู่'],['rna','mRNA']])}</div>
    <div class="row" style="flex-wrap:wrap;gap:5px">${rna?btn('rt','← เปลี่ยนเป็น DNA'):btn('tx','ถอดรหัส → mRNA')}${btn('rand','สุ่มลำดับ')}${btn('ex:0','ตัวอย่าง DNA')}${btn('ex:1','ตัวอย่าง mRNA')}</div>
    <div class="hint">${rna?'แปลรหัสด้วยรหัสพันธุกรรมมาตรฐาน: เริ่มที่ AUG และหยุดที่ UAA, UAG, UGA':'สายบนคือสายรหัส (coding strand) 5′→3′ · สายล่างคือสายแม่แบบ (template) ที่เข้าคู่แบบสวนทาง · A–T มีพันธะไฮโดรเจน 2 พันธะ, G–C มี 3 พันธะ'} · สูงสุด 72 เบส</div></div>
    <div class="sec"><h5>การแสดงผล</h5><div class="row" style="flex-wrap:wrap;gap:6px 14px">${chk('ends',o.ends!==false,'ปลาย 5′/3′')}${rna?chk('aa',o.aa!==false,'แปลรหัสเป็นกรดอะมิโน')+chk('fromAUG',o.fromAUG!==false,'เริ่มที่ AUG'):chk('hb',o.hb!==false,'พันธะไฮโดรเจน')}</div>
    <div class="row"><span class="lab">ขนาดเบส</span><input type="range" min="12" max="48" data-p="bw" value="${o.bw||24}"><span class="val">${o.bw||24}</span></div>
    <div class="hint" style="background:#f8fafc;border:1px solid var(--line);border-radius:8px;padding:8px 10px;word-break:break-all">ความยาว <b>${s.length}</b> เบส · GC <b>${gc}%</b>${rna?'':`<br>สายแม่แบบ (3′→5′): <code>${tpl}</code>`}<br>mRNA: <code>${mr}</code><br>โปรตีน: <b>${prot}</b></div></div>`+posSec(o);}};

def('bio_gen','bio_punnett','ตารางพันเนตต์','punnett square genetics cross',170,200,{al:'พันเนตต์ punnett ผสมพันธุ์ พันธุศาสตร์ genetics',make:(x,y)=>[mkPunnett('Aa','Aa',x,y)]},()=>{let s='';for(let i=0;i<3;i++)for(let j=0;j<3;j++)s+=`<rect x="${20+i*44}" y="${10+j*44}" width="44" height="44" fill="${i&&j?(i===2&&j===2?'#fecaca':'#bbf7d0'):'#f1f5f9'}" stroke="#64748b"/>`;return s+tx(86,76,'AA',14,'#111827',{serif:1,i:1})+tx(130,76,'Aa',14,'#111827',{serif:1,i:1})+tx(86,120,'Aa',14,'#111827',{serif:1,i:1})+tx(130,120,'aa',14,'#111827',{serif:1,i:1})+tx(86,176,'3 : 1',16,'#111827',{b:1});});
def('bio_gen','bio_dnaseq','ลำดับเบส DNA สายคู่','DNA sequence base pairing complementary',220,90,{al:'ดีเอ็นเอ DNA ลำดับเบส คู่เบส sequence',make:(x,y)=>[mkSeq('ATGGCCTTTAAA','dna',x,y)]},()=>{let s='';'ATGGC'.split('').forEach((b,i)=>{s+=`<rect x="${12+i*40}" y="10" width="36" height="30" rx="4" fill="${BC[b]}"/><rect x="${12+i*40}" y="50" width="36" height="30" rx="4" fill="${BC[COMP[b]]}"/>`+tx(30+i*40,26,b,16,'#111827',{b:1})+tx(30+i*40,66,COMP[b],16,'#111827',{b:1});});return s;});
def('bio_gen','bio_mrnaseq','ลำดับเบส mRNA และการแปลรหัส','mRNA codon translation amino acid',220,90,{al:'อาร์เอ็นเอ mRNA โคดอน codon แปลรหัส translation',make:(x,y)=>[mkSeq('AUGUUUGGCAAAUAG','rna',x,y)]},()=>{let s='';'AUGUUU'.split('').forEach((b,i)=>{s+=`<rect x="${4+i*36}" y="8" width="32" height="28" rx="4" fill="${BC[b]}"/>`+tx(20+i*36,23,b,15,'#111827',{b:1});});return s+`<ellipse cx="56" cy="64" rx="48" ry="16" fill="#fde68a" stroke="#b45309"/><ellipse cx="164" cy="64" rx="48" ry="16" fill="#fde68a" stroke="#b45309"/>`+tx(56,65,'Met',14,'#78350f',{b:1})+tx(164,65,'Phe',14,'#78350f',{b:1});});
window.__bioTools={mkPunnett,mkSeq,punnettData,translate,codonAA,cleanSeq};
})();
