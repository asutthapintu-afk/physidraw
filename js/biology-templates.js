/* PhysiDraw — Biology templates (Phase 3d). Every template is built from editable
   objects: library shapes, label boxes joined by anchored leader lines, Punnett and
   sequence objects, text and arrows. */
"use strict";
(function(){
if(!window.__bio||!window.__bioTools)return;
const PARTS=window.BIO_PARTS;const {mkPunnett,mkSeq}=window.__bioTools;const mkEq=window.__chemTpl&&window.__chemTpl.mkEq;
const cv=document.createElement('canvas').getContext('2d');const tw=(t,sz=13)=>{cv.font=`400 ${sz}px ${SANS}`;return cv.measureText(t).width;};
const put=(k,x,y,w,h,o={})=>{const s=mkShape(k,0,0,Object.assign({w,h},o));s.x=x;s.y=y;return s;};
const box=(t,cx,cy,w,h=30,o={})=>mkShape('rrect',cx,cy,Object.assign({w:w||Math.max(70,tw(t,o.lsz||13)+24),h,fill:'#ffffff',stroke:'#94a3b8',sw:1.2,label:t,lp:'center',lsz:13,lc:'#1f2937'},o));
const lead=(x1,y1,b,side)=>{const l=mkLine('leader',x1,y1,0,0);l.a2={id:b.id,a:side};return l;};
const title=(t,x,y,sz=24)=>mkText(t,x,y,{size:sz,bold:true});
const note=(t,x,y,o={})=>mkText(t,x,y,Object.assign({size:13,color:'#64748b'},o));
const arrow=(x1,y1,x2,y2,c='#334155',sw=2.5,o={})=>mkLine('arrow',x1,y1,x2,y2,Object.assign({stroke:c,sw},o));
const poly=(pts,c,sw=3)=>pts.slice(1).map((p,i)=>mkLine(i===pts.length-2?'arrow':'line',pts[i][0],pts[i][1],p[0],p[1],{stroke:c,sw}));
function D(name,w,h,objs){const d=newDoc();d.name=name;d.w=w;d.h=h;d.objects=objs;const save=doc;doc=d;resolveAnchors();doc=save;return d;}
const pt=(o,lx,ly)=>{const d=DEF[o.key];const sx=o.w/d.w,sy=o.h/d.h;return [o.x+lx*sx,o.y+ly*sy];};
/* label a shape: items [partKey,text,'l'|'r']; labels stack in two columns without overlapping */
function annotate(O,obj,items,{lx,rx,gap=34,top=80,bottom=9999,lsz=13}={}){
  const parts=PARTS[obj.key];const pts=items.map(([k,t,sd])=>{const [X,Y]=pt(obj,...parts[k]);return {t,X,Y,sd};});
  ['l','r'].forEach(sd=>{const g=pts.filter(p=>p.sd===sd).sort((a,b)=>a.Y-b.Y);if(!g.length)return;let ys=g.map(p=>p.Y);
    for(let i=1;i<ys.length;i++)ys[i]=Math.max(ys[i],ys[i-1]+gap);const sh=(g.reduce((s,p)=>s+p.Y,0)-ys.reduce((s,y)=>s+y,0))/g.length;ys=ys.map(y=>y+sh);
    if(ys[0]<top)ys=ys.map(y=>y+top-ys[0]);if(ys[ys.length-1]>bottom)ys=ys.map(y=>y-(ys[ys.length-1]-bottom));
    g.forEach((p,i)=>{const w=Math.max(70,tw(p.t,lsz)+24);const b=box(p.t,sd==='l'?lx-w/2:rx+w/2,ys[i],w,30,{lsz});O.push(b,lead(p.X,p.Y,b,sd==='l'?'r':'l'));});});}
const NS='ภาพจำลองเพื่อการเรียนรู้ — รูปร่างและสัดส่วนถูกทำให้ง่ายขึ้น ไม่ได้ตามมาตราส่วนจริง';

function T_animal(){const O=[];const c=put('bio_animal_cell',275,120,470,338);O.push(c);
  annotate(O,c,[['nucleus','นิวเคลียส (nucleus)','l'],['nucleolus','นิวคลีโอลัส (nucleolus)','l'],['mito','ไมโทคอนเดรีย (mitochondrion)','l'],['ribo','ไรโบโซม (ribosome)','l'],['rer','ร่างแหเอนโดพลาซึมผิวขรุขระ (RER)','l'],
    ['centro','เซนโทรโซม (centrosome)','r'],['lyso','ไลโซโซม (lysosome)','r'],['vesicle','เวสิเคิล (vesicle)','r'],['golgi','กอลจิบอดี (Golgi apparatus)','r'],['membrane','เยื่อหุ้มเซลล์ (cell membrane)','r'],['ser','ร่างแหเอนโดพลาซึมผิวเรียบ (SER)','r'],['cytoplasm','ไซโทพลาซึม (cytoplasm)','r']],{lx:262,rx:758,top:110,bottom:560});
  O.push(title('โครงสร้างของเซลล์สัตว์ (Animal cell)',510,50),note(NS+' · เซลล์สัตว์ทั่วไปมีขนาดราว 10–30 µm',510,596));return D('โครงสร้างของเซลล์สัตว์',1020,620,O);}
function T_plant(){const O=[];const c=put('bio_plant_cell',290,140,440,330);O.push(c);
  annotate(O,c,[['wall','ผนังเซลล์ (cell wall)','l'],['cytoplasm','ไซโทพลาซึม (cytoplasm)','l'],['golgi','กอลจิบอดี (Golgi apparatus)','l'],['nucleus','นิวเคลียส (nucleus)','l'],['nucleolus','นิวคลีโอลัส (nucleolus)','l'],['rer','ร่างแหเอนโดพลาซึม (ER)','l'],['membrane','เยื่อหุ้มเซลล์ (cell membrane)','l'],
    ['chloro','คลอโรพลาสต์ (chloroplast)','r'],['vacuole','แวคิวโอลขนาดใหญ่ (central vacuole)','r'],['tonoplast','เยื่อหุ้มแวคิวโอล (tonoplast)','r'],['mito','ไมโทคอนเดรีย (mitochondrion)','r']],{lx:262,rx:758,top:110,bottom:560});
  O.push(title('โครงสร้างของเซลล์พืช (Plant cell)',510,50),note('เซลล์พืชมีผนังเซลล์ คลอโรพลาสต์ และแวคิวโอลขนาดใหญ่ แต่พืชดอกไม่มีเซนทริโอล',510,580),note(NS,510,602,{size:12}));return D('โครงสร้างของเซลล์พืช',1020,630,O);}
function T_bacterium(){const O=[];const c=put('bio_bacterium',250,170,500,191);O.push(c);
  annotate(O,c,[['pilus','พิลัส (pilus)','l'],['capsule','แคปซูล (capsule)','l'],['cytoplasm','ไซโทพลาซึม (cytoplasm)','l'],['ribo','ไรโบโซม 70S (ribosome)','l'],['membrane','เยื่อหุ้มเซลล์ (cell membrane)','l'],
    ['wall','ผนังเซลล์ (cell wall)','r'],['plasmid','พลาสมิด (plasmid)','r'],['nucleoid','นิวคลีออยด์ (DNA วงแหวน)','r'],['flagellum','แฟลเจลลัม (flagellum)','r']],{lx:230,rx:770,top:120,bottom:430,gap:36});
  O.push(title('โครงสร้างของเซลล์แบคทีเรีย (โพรคาริโอต)',510,52),note('ไม่มีเยื่อหุ้มนิวเคลียสและออร์แกเนลล์ที่มีเยื่อหุ้ม · ขนาดทั่วไปราว 1–5 µm',510,470),note(NS,510,494,{size:12}));return D('เซลล์แบคทีเรีย',1020,520,O);}
function T_membrane(){const O=[];const c=put('bio_membrane',310,140,560,280);O.push(c);
  annotate(O,c,[['glycoprotein','ไกลโคโปรตีน (glycoprotein)','l'],['head','ส่วนหัวมีขั้ว ชอบน้ำ (hydrophilic head)','l'],['tail','ส่วนหางไม่มีขั้ว ไม่ชอบน้ำ (hydrophobic tails)','l'],['bilayer','ฟอสโฟลิพิดสองชั้น (phospholipid bilayer)','l'],['integral','โปรตีนแทรกผ่านเยื่อ (integral protein)','l'],
    ['glycolipid','ไกลโคลิพิด (glycolipid)','r'],['channel','โปรตีนช่อง (channel protein)','r'],['cholesterol','คอเลสเตอรอล (cholesterol)','r'],['peripheral','โปรตีนเกาะผิว (peripheral protein)','r']],{lx:290,rx:890,top:110,bottom:470,gap:38});
  O.push(title('โครงสร้างเยื่อหุ้มเซลล์ตามแบบจำลองฟลูอิดโมเสก',590,52),note('โมเลกุลในเยื่อเคลื่อนที่ได้ด้านข้าง (fluid) และมีโปรตีนแทรกกระจายเป็นลวดลาย (mosaic) · ความหนาของเยื่อราว 7–10 nm',590,510),note(NS,590,534,{size:12}));return D('เยื่อหุ้มเซลล์ (Fluid mosaic)',1180,560,O);}
function T_mitosis(){const O=[];const st=[['bio_mit_inter','อินเตอร์เฟส','จำลอง DNA (ระยะ S)','โครมาทินยังไม่ขดตัว'],['bio_mit_pro','โพรเฟส','โครโมโซมขดตัวเห็นชัด','เยื่อหุ้มนิวเคลียสสลาย'],['bio_mit_meta','เมทาเฟส','โครโมโซมเรียงกลางเซลล์','สปินเดิลยึดที่เซนโทรเมียร์'],['bio_mit_ana','แอนาเฟส','โครมาทิดพี่น้องแยกจากกัน','เคลื่อนไปยังขั้วเซลล์'],['bio_mit_telo','เทโลเฟส + ไซโทไคนีซิส','นิวเคลียสใหม่ก่อตัว','ได้ 2 เซลล์ที่เหมือนกัน']];
  st.forEach(([k,n,a,b],i)=>{const x=40+i*232;O.push(put(k,x,130,180,180),mkText(n,x+90,340,{size:17,bold:true}),note(a,x+90,366),note(b,x+90,386));if(i)O.push(arrow(x-44,220,x-8,220,'#64748b',2.5));});
  O.push(title('การแบ่งเซลล์แบบไมโทซิส (2n = 4)',600,56),note('สีแดง = โครโมโซมที่ได้จากแม่ · สีน้ำเงิน = จากพ่อ · แท่งยาว/สั้น = โครโมโซมคู่เหมือน 2 คู่',600,96,{size:14,color:'#334155'}),
   note('อินเตอร์เฟสเป็นระยะเตรียมตัวก่อนแบ่ง ไม่นับเป็นระยะของไมโทซิส · เซลล์ลูกมีจำนวนโครโมโซมเท่าเซลล์แม่ (2n)',600,440),note(NS,600,464,{size:12}));return D('การแบ่งเซลล์แบบไมโทซิส',1200,490,O);}
function T_dna(){const O=[];const h=put('bio_dna_helix',70,90,110,420);O.push(h);annotate(O,h,[['backbone','แกนน้ำตาล–ฟอสเฟต','r'],['basepair','คู่เบส','r']],{rx:200,top:150,bottom:300,gap:60});
  const s=mkSeq('ATGCGTACCTAG','dna',640,200,{bw:34});O.push(s,box('สายรหัส (coding) 5′→3′',0,0,180,28,{fill:'#f8fafc'}),box('สายแม่แบบ (template) 3′→5′',0,0,190,28,{fill:'#f8fafc'}));
  const bA=O[O.length-2],bB=O[O.length-1];bA.x=s.x;bA.y=s.y-38;bB.x=s.x;bB.y=s.y+s.h+8;
  const n=put('bio_nucleotide',540,380,234,144);O.push(n);annotate(O,n,[['phosphate','หมู่ฟอสเฟต','l'],['sugar','น้ำตาลดีออกซีไรโบส','l'],['base','เบสไนโตรเจน (A T C G)','r']],{lx:510,rx:810,top:400,bottom:520,gap:40});
  O.push(title('โครงสร้างของ DNA',500,50),note('A จับคู่กับ T ด้วยพันธะไฮโดรเจน 2 พันธะ · G จับคู่กับ C ด้วย 3 พันธะ · สองสายวางตัวสวนทางกัน (antiparallel)',590,320,{size:14,color:'#334155'}),
    mkText('นิวคลีโอไทด์ = หน่วยย่อยของ DNA',590,560,{size:15,bold:true,color:'#334155'}),note(NS,500,600,{size:12}));return D('โครงสร้างของ DNA',1000,624,O);}
function T_protein(){const O=[];const dna=mkSeq('ATGTTTGGCAAATAG','dna',470,170,{bw:30});const rna=mkSeq('AUGUUUGGCAAAUAG','rna',470,410,{bw:30});O.push(dna,rna);
  O.push(box('DNA (ในนิวเคลียส)',0,0,150,30,{fill:'#eff6ff',stroke:'#60a5fa'}),box('mRNA',0,0,80,30,{fill:'#f5f3ff',stroke:'#a78bfa'}),box('พอลิเพปไทด์',0,0,110,30,{fill:'#fffbeb',stroke:'#f59e0b'}));
  const [b1,b2,b3]=O.slice(-3);b1.x=dna.x-170;b1.y=dna.y+dna.h/2-15;b2.x=rna.x-100;b2.y=rna.y+6;b3.x=rna.x-130;b3.y=rna.y+rna.h-38;
  O.push(arrow(470,dna.y+dna.h+12,470,rna.y-14,'#7c3aed',3),mkText('การถอดรหัส (transcription)',490,(dna.y+dna.h+rna.y)/2,{size:15,bold:true,color:'#6d28d9',align:'left'}),note('สร้าง mRNA จากสายแม่แบบ (ใช้ U แทน T)',490,(dna.y+dna.h+rna.y)/2+22,{align:'left'}));
  O.push(mkText('การแปลรหัส (translation) ที่ไรโบโซม',470,rna.y+rna.h+30,{size:15,bold:true,color:'#b45309'}),note('อ่านทีละโคดอน (3 เบส) เริ่มที่ AUG (Met) และหยุดที่โคดอนหยุด UAG',470,rna.y+rna.h+52));
  const rb=put('bio_ribosome',860,260,176,132);const tr=put('bio_trna',920,430,72,104,{tag:'UAC'});O.push(rb,tr,note('ไรโบโซม',948,406,{color:'#1e3a8a'}),note('tRNA แอนติโคดอน UAC (3′→5′)',956,548,{size:12}),note('เข้าคู่กับโคดอน AUG',956,566,{size:12}));
  O.push(title('การสังเคราะห์โปรตีน: DNA → mRNA → โปรตีน',560,52),note('ลำดับตัวอย่างสั้นเพื่อการเรียนรู้ · รหัสพันธุกรรมมาตรฐาน',560,606,{size:12}));return D('การสังเคราะห์โปรตีน',1120,630,O);}
function T_mono(){const O=[];const p=mkPunnett('Rr','Rr',450,330,{cs:84,t1:'เมล็ดกลม/เมล็ดขรุขระ',rs:15});O.push(p);
  O.push(title('การถ่ายทอดลักษณะ 1 ลักษณะ (เมล็ดถั่วลันเตาของเมนเดล)',450,50),mkText('รุ่นพ่อแม่:  Rr (เมล็ดกลม)  ×  Rr (เมล็ดกลม)',450,100,{size:17,color:'#334155'}),
    note('R = แอลลีลเด่น (เมล็ดกลม) · r = แอลลีลด้อย (เมล็ดขรุขระ) · ลักษณะเด่นข่มลักษณะด้อยอย่างสมบูรณ์',450,580),note('ช่องสีเขียว = เมล็ดกลม · ช่องสีน้ำเงิน = เมล็ดขรุขระ · อัตราส่วนเป็นความน่าจะเป็นทางทฤษฎี',450,604,{size:12}));return D('ตารางพันเนตต์ 1 ลักษณะ',900,630,O);}
function T_di(){const O=[];const p=mkPunnett('RrYy','RrYy',500,360,{cs:62,t1:'กลม/ขรุขระ',t2:'เหลือง/เขียว',rs:14});O.push(p);
  O.push(title('การถ่ายทอดลักษณะ 2 ลักษณะ (Dihybrid cross)',500,46),mkText('RrYy (เมล็ดกลม สีเหลือง)  ×  RrYy (เมล็ดกลม สีเหลือง)',500,88,{size:16,color:'#334155'}),
    note('R/r = รูปร่างเมล็ด (กลม/ขรุขระ) · Y/y = สีเมล็ด (เหลือง/เขียว) · ยีนทั้งสองอยู่ต่างโครโมโซมจึงแยกกันอย่างอิสระ',500,676),note('ได้อัตราส่วนฟีโนไทป์ 9 : 3 : 3 : 1 ตามทฤษฎี',500,698,{size:12}));return D('ตารางพันเนตต์ 2 ลักษณะ',1000,720,O);}
function T_photo(){const O=[];const sun=put('bio_sun',60,50,120,120);const pl=put('bio_plant_whole',380,120,210,334);O.push(sun,pl);
  const [lx,ly]=pt(pl,124,124);O.push(mkLine('wave',170,130,lx-14,ly-18,{stroke:'#f59e0b',sw:2.4}),mkText('พลังงานแสง',236,196,{size:15,bold:true,color:'#b45309'}));
  O.push(arrow(760,236,lx+30,ly-6,'#475569',2.5),mkText('CO₂ เข้าทางปากใบ',780,226,{size:15,color:'#334155',align:'left'}),arrow(lx+30,ly+22,760,300,'#0ea5e9',2.5),mkText('O₂ ออกทางปากใบ',780,306,{size:15,color:'#0369a1',align:'left'}));
  const [rx,ry]=pt(pl,85,236);O.push(arrow(rx-60,ry+6,rx-60,ly+70,'#2563eb',2.5),mkText('H₂O ดูดจากรากลำเลียงทางไซเล็ม',rx-70,ry+30,{size:14,color:'#1d4ed8',align:'right'}));
  const ch=put('bio_chloro',740,380,200,95);O.push(ch,note('เกิดในคลอโรพลาสต์',840,494,{color:'#15803d'}),mkLine('dashed',lx+20,ly+10,740,400,{}));
  if(mkEq)O.push(mkEq('6CO2 + 6H2O ->[แสง][คลอโรฟิลล์] C6H12O6 + 6O2',500,560,{size:24}));
  O.push(title('การสังเคราะห์ด้วยแสง (Photosynthesis)',500,44),note('น้ำตาลที่สร้างขึ้นลำเลียงไปทั่วต้นทางโฟลเอ็ม · O₂ ที่ปล่อยออกมาได้จากการแยกโมเลกุลน้ำ',500,618),note(NS,500,640,{size:12}));return D('การสังเคราะห์ด้วยแสง',1000,664,O);}
function T_resp(){const O=[];const B=(t,y,c,s)=>{const b=box(t,250,y,400,46,{fill:c,stroke:s,lsz:14});O.push(b);return b;};
  const b1=B('กลูโคส (C₆H₁₂O₆)',130,'#fef9c3','#ca8a04'),b2=B('ไกลโคลิซิส — ในไซโทพลาซึม · ได้ 2 ATP',230,'#f1f5f9','#64748b'),b3=B('วัฏจักรเครบส์ — ในเมทริกซ์ · ได้ 2 ATP, ปล่อย CO₂',350,'#ffedd5','#ea580c'),b4=B('ระบบถ่ายทอดอิเล็กตรอน — เยื่อชั้นใน · ได้ ATP มากที่สุด',470,'#fee2e2','#dc2626');
  O.push(arrow(250,153,250,205,'#475569',2.5),arrow(250,253,250,325,'#475569',2.5),arrow(250,373,250,445,'#475569',2.5),note('ไพรูเวต → แอซิทิลโคเอ (ปล่อย CO₂)',262,290,{align:'left'}),note('NADH, FADH₂ นำอิเล็กตรอนไป',262,410,{align:'left'}),note('O₂ เป็นตัวรับอิเล็กตรอนตัวสุดท้าย → H₂O',250,505));
  const m=put('bio_mito',560,250,380,171);O.push(m);annotate(O,m,[['outer','เยื่อหุ้มชั้นนอก','r'],['inner','เยื่อหุ้มชั้นใน','r'],['cristae','คริสตี (cristae)','r'],['matrix','เมทริกซ์ (matrix)','r']],{rx:900,top:200,bottom:460,gap:44});
  O.push(lead(560+12*380/160,250+36*171/72,b4,'r'));
  if(mkEq)O.push(mkEq('C6H12O6 + 6O2 -> 6CO2 + 6H2O + ATP',500,568,{size:22}));
  O.push(title('การหายใจระดับเซลล์แบบใช้ออกซิเจน',500,52),note('ภาพรวมเชิงแนวคิด — จำนวน ATP รวมขึ้นกับชนิดเซลล์ ตำราปัจจุบันระบุราว 30–32 ATP ต่อกลูโคส',500,616),note(NS,500,638,{size:12}));return D('การหายใจระดับเซลล์',1080,660,O);}
function T_food(){const O=[];const L=[['bio_sun',40,150,110,110,'ดวงอาทิตย์','แหล่งพลังงาน'],['bio_grass',220,180,130,76,'หญ้า','ผู้ผลิต'],['bio_grasshopper',420,180,140,78,'ตั๊กแตน','ผู้บริโภคลำดับที่ 1'],['bio_frog',630,170,130,92,'กบ','ผู้บริโภคลำดับที่ 2'],['bio_snake',820,180,170,72,'งู','ผู้บริโภคลำดับที่ 3'],['bio_hawk',1040,160,170,96,'เหยี่ยว','ผู้บริโภคลำดับที่ 4']];
  const sh=L.map(([k,x,y,w,h,n,r],i)=>{const s=put(k,x,y,w,h);O.push(s,mkText(n,x+w/2,286,{size:17,bold:true}),note(r,x+w/2,310));return s;});
  sh.slice(1).forEach((s,i)=>{const a=sh[i];O.push(arrow(a.x+a.w+8,218,s.x-8,218,i?'#334155':'#f59e0b',3));});
  const mu=put('bio_mushroom',590,390,90,96);O.push(mu,mkText('เห็ด รา และแบคทีเรีย',635,506,{size:16,bold:true}),note('ผู้ย่อยสลาย — คืนธาตุอาหารสู่ดิน',635,530));
  sh.slice(1).forEach(s=>O.push(mkLine('dashed',s.x+s.w/2,330,630,384,{he:true,stroke:'#a16207'})));
  O.push(title('ห่วงโซ่อาหาร (Food chain)',640,56),note('ลูกศรแสดงทิศทางการถ่ายทอดพลังงาน (จากผู้ถูกกินไปยังผู้กิน) · พลังงานถ่ายทอดไปยังลำดับถัดไปได้เพียงราว 10%',640,96,{size:14,color:'#334155'}));return D('ห่วงโซ่อาหาร',1260,570,O);}
function T_circ(){const O=[];const ch=(t,cx,cy,c,s)=>{const b=box(t,cx,cy,170,74,{fill:c,stroke:s,lsz:14});O.push(b);return b;};
  O.push(box('ปอด — แลกเปลี่ยนแก๊ส',450,110,300,60,{fill:'#ffe4e6',stroke:'#e11d48',lsz:15}),box('เนื้อเยื่อทั่วร่างกาย',450,640,300,60,{fill:'#f1f5f9',stroke:'#64748b',lsz:15}));
  ch('ห้องบนขวา (RA)',350,320,'#dbeafe','#2563eb');ch('ห้องล่างขวา (RV)',350,430,'#dbeafe','#2563eb');ch('ห้องบนซ้าย (LA)',550,320,'#fee2e2','#dc2626');ch('ห้องล่างซ้าย (LV)',550,430,'#fee2e2','#dc2626');
  const BL='#2563eb',RD='#dc2626';O.push(arrow(350,358,350,392,BL,3),arrow(550,358,550,392,RD,3));
  O.push(...poly([[265,430],[200,430],[200,110],[298,110]],BL),...poly([[602,110],[700,110],[700,320],[637,320]],RD),...poly([[637,430],[740,430],[740,640],[602,640]],RD),...poly([[298,640],[160,640],[160,320],[263,320]],BL));
  O.push(mkText('หลอดเลือดอาร์เทอรีปอด',190,250,{size:13,color:BL,align:'right'}),mkText('(เลือดมี O₂ ต่ำ)',190,270,{size:12,color:BL,align:'right'}),mkText('หลอดเลือดเวนปอด',712,210,{size:13,color:RD,align:'left'}),mkText('(เลือดมี O₂ สูง)',712,230,{size:12,color:RD,align:'left'}),
    mkText('เอออร์ตา',752,530,{size:13,color:RD,align:'left'}),mkText('เวนาคาวา',150,500,{size:13,color:BL,align:'right'}));
  O.push(mkText('วงจรปอด (pulmonary circulation)',450,200,{size:14,bold:true,color:'#475569'}),mkText('วงจรร่างกาย (systemic circulation)',450,550,{size:14,bold:true,color:'#475569'}),
    title('ระบบหมุนเวียนเลือดแบบวงจรคู่',450,40),note('แผนผังมองจากด้านหน้า: ซีกขวาของหัวใจอยู่ทางซ้ายของภาพ · สีน้ำเงิน = เลือดมี O₂ ต่ำ, สีแดง = เลือดมี O₂ สูง',450,700,{size:12}));return D('ระบบหมุนเวียนเลือด',900,720,O);}
function T_heart(){const O=[];const h=put('bio_heart',300,90,374,408);O.push(h);
  annotate(O,h,[['svc','หลอดเลือดเวนาคาวาบน','l'],['pa','หลอดเลือดอาร์เทอรีปอด','l'],['ra','ห้องบนขวา (right atrium)','l'],['tricuspid','ลิ้นไตรคัสพิด','l'],['rv','ห้องล่างขวา (right ventricle)','l'],['ivc','หลอดเลือดเวนาคาวาล่าง','l'],
    ['aorta','เอออร์ตา (aorta)','r'],['pv','หลอดเลือดเวนปอด','r'],['la','ห้องบนซ้าย (left atrium)','r'],['mitral','ลิ้นไบคัสพิด (ไมทรัล)','r'],['lv','ห้องล่างซ้าย (left ventricle)','r'],['septum','ผนังกั้นห้องหัวใจ (septum)','r']],{lx:270,rx:720,top:100,bottom:520,gap:36});
  O.push(title('โครงสร้างของหัวใจ (ภาพตัดตามยาว มองจากด้านหน้า)',500,46),note('ซีกขวาของหัวใจอยู่ทางซ้ายของภาพ · ผนังห้องล่างซ้ายหนาที่สุดเพราะต้องสูบฉีดเลือดไปทั่วร่างกาย',500,548),note(NS,500,572,{size:12}));return D('โครงสร้างของหัวใจ',1000,596,O);}
function T_flower(){const O=[];const f0=put('bio_flower',330,90,320,325);O.push(f0);
  annotate(O,f0,[['anther','อับเรณู (anther)','l'],['filament','ก้านชูอับเรณู (filament)','l'],['petal','กลีบดอก (petal)','l'],['sepal','กลีบเลี้ยง (sepal)','l'],['receptacle','ฐานรองดอก (receptacle)','l'],['pedicel','ก้านดอก (pedicel)','l'],
    ['stigma','ยอดเกสรเพศเมีย (stigma)','r'],['style','ก้านเกสรเพศเมีย (style)','r'],['ovary','รังไข่ (ovary)','r'],['ovule','ออวุล (ovule)','r']],{lx:300,rx:680,top:110,bottom:420,gap:36});
  O.push(title('ส่วนประกอบของดอก (ภาพตัดตามยาว)',490,46),note('เกสรเพศผู้ (stamen) = อับเรณู + ก้านชูอับเรณู · เกสรเพศเมีย (carpel) = ยอด + ก้าน + รังไข่',490,452),note(NS,490,476,{size:12}));return D('ส่วนประกอบของดอก',980,500,O);}
function T_leaf(){const O=[];const l=put('bio_leaf_xs',250,110,480,300);O.push(l);
  annotate(O,l,[['cuticle','คิวทิเคิล (cuticle)','l'],['upper','เอพิเดอร์มิสด้านบน','l'],['palisade','แพลิเซดมีโซฟิลล์','l'],['spongy','สปันจีมีโซฟิลล์','l'],['lower','เอพิเดอร์มิสด้านล่าง','l'],
    ['chloroplast','คลอโรพลาสต์','r'],['xylem','ไซเล็ม — ลำเลียงน้ำ','r'],['phloem','โฟลเอ็ม — ลำเลียงอาหาร','r'],['airspace','ช่องอากาศ','r'],['guard','เซลล์คุม (guard cell)','r'],['stoma','ปากใบ (stoma)','r']],{lx:225,rx:760,top:90,bottom:450,gap:34});
  O.push(title('ภาพตัดขวางของใบพืช',500,44),note('ปากใบส่วนใหญ่อยู่ที่ผิวใบด้านล่าง · แพลิเซดมีคลอโรพลาสต์หนาแน่นที่สุด',500,476),note(NS,500,500,{size:12}));return D('ภาพตัดขวางของใบ',1000,520,O);}
function T_neuron(){const O=[];const n=put('bio_neuron',200,170,680,268);O.push(n);
  annotate(O,n,[['dendrite','เดนไดรต์ (dendrite)','l'],['nucleus','นิวเคลียส','l'],['soma','ตัวเซลล์ (cell body)','l'],['hillock','แอกซอนฮิลล็อก','l']],{lx:180,top:120,bottom:470,gap:40});
  const items=[['myelin','เยื่อไมอีลิน (myelin sheath)',340,110],['schwann','นิวเคลียสของเซลล์ชวานน์',530,110],['node','โนดออฟแรนเวียร์ (node of Ranvier)',430,470],['axon','แอกซอน (axon)',640,470],['terminal','ปลายแอกซอน (axon terminal)',830,110]];
  items.forEach(([k,t,x,y])=>{const [X,Y]=pt(n,...PARTS.bio_neuron[k]);const b=box(t,x,y,0,30);O.push(b,lead(X,Y,b,y<300?'b':'t'));});
  O.push(arrow(330,500,700,500,'#7c3aed',2.5),mkText('ทิศทางของกระแสประสาท',515,522,{size:14,color:'#6d28d9'}),title('โครงสร้างของเซลล์ประสาท (นิวรอน)',500,46),note(NS,500,560,{size:12}));return D('เซลล์ประสาท',1000,580,O);}
function T_eye(){const O=[];const e=put('bio_eye_xs',280,90,439,360);O.push(e);
  annotate(O,e,[['cornea','กระจกตา (cornea)','l'],['aqueous','ของเหลวช่องหน้า (aqueous humour)','l'],['iris','ม่านตา (iris)','l'],['pupil','รูม่านตา (pupil)','l'],['lens','เลนส์ตา (lens)','l'],['ciliary','กล้ามเนื้อยึดเลนส์ (ciliary body)','l'],['ligament','เอ็นยึดเลนส์','l'],
    ['sclera','ตาขาว (sclera)','r'],['choroid','คอรอยด์ (choroid)','r'],['retina','เรตินา (retina)','r'],['vitreous','วุ้นตา (vitreous humour)','r'],['fovea','โฟเวีย (fovea)','r'],['blindspot','จุดบอด (blind spot)','r'],['nerve','เส้นประสาทตา (optic nerve)','r']],{lx:250,rx:760,top:80,bottom:470,gap:32});
  O.push(title('โครงสร้างของนัยน์ตา (ภาพตัดตามขวาง)',510,40),note('แสงผ่านกระจกตาและเลนส์ หักเหไปรวมเป็นภาพจริงหัวกลับบนเรตินา',510,500),note(NS,510,524,{size:12}));return D('โครงสร้างของนัยน์ตา',1020,548,O);}
function T_scope(){const O=[];const m=put('bio_microscope',380,80,238,350);O.push(m);
  annotate(O,m,[['eyepiece','เลนส์ใกล้ตา (eyepiece)','l'],['tube','ลำกล้อง (body tube)','l'],['nosepiece','แป้นหมุน (revolving nosepiece)','l'],['objective','เลนส์ใกล้วัตถุ (objective)','l'],['stage','แท่นวางสไลด์ (stage)','l'],['condenser','เลนส์รวมแสง (condenser)','l'],['diaphragm','ไดอะแฟรม (diaphragm)','l'],['light','แหล่งกำเนิดแสง','l'],
    ['clip','ที่หนีบสไลด์','r'],['slide','สไลด์','r'],['arm','แขน (arm)','r'],['coarse','ปุ่มปรับภาพหยาบ','r'],['fine','ปุ่มปรับภาพละเอียด','r'],['base','ฐาน (base)','r']],{lx:350,rx:660,top:70,bottom:440,gap:30});
  O.push(title('ส่วนประกอบของกล้องจุลทรรศน์ใช้แสง',500,36),note('กำลังขยายรวม = กำลังขยายเลนส์ใกล้ตา × กำลังขยายเลนส์ใกล้วัตถุ',500,474),note(NS,500,498,{size:12}));return D('กล้องจุลทรรศน์',1000,520,O);}

TPL.splice(TPL.length-1,0,
 ['เซลล์สัตว์','ชีววิทยา · ออร์แกเนลล์พร้อมป้าย',T_animal,'bio'],['เซลล์พืช','ชีววิทยา · ผนังเซลล์ คลอโรพลาสต์',T_plant,'bio'],['เซลล์แบคทีเรีย','โพรคาริโอต',T_bacterium,'bio'],['เยื่อหุ้มเซลล์','แบบจำลองฟลูอิดโมเสก',T_membrane,'bio'],
 ['ไมโทซิส','การแบ่งเซลล์ · 2n = 4',T_mitosis,'bio'],['โครงสร้าง DNA','คู่เบสและนิวคลีโอไทด์',T_dna,'bio'],['การสังเคราะห์โปรตีน','ถอดรหัสและแปลรหัส',T_protein,'bio'],
 ['พันเนตต์ 1 ลักษณะ','Rr × Rr · 3 : 1',T_mono,'bio'],['พันเนตต์ 2 ลักษณะ','RrYy × RrYy · 9 : 3 : 3 : 1',T_di,'bio'],['การสังเคราะห์ด้วยแสง','สารตั้งต้น ผลิตภัณฑ์ และสมการ',T_photo,'bio'],['การหายใจระดับเซลล์','ไกลโคลิซิส เครบส์ ETC',T_resp,'bio'],
 ['ห่วงโซ่อาหาร','นิเวศวิทยา · การถ่ายทอดพลังงาน',T_food,'bio'],['ระบบหมุนเวียนเลือด','วงจรคู่ · ปอดและร่างกาย',T_circ,'bio'],['โครงสร้างหัวใจ','4 ห้อง ลิ้น และหลอดเลือด',T_heart,'bio'],
 ['ส่วนประกอบของดอก','พืช · ภาพตัดตามยาว',T_flower,'bio'],['ภาพตัดขวางของใบ','พืช · เนื้อเยื่อใบ',T_leaf,'bio'],['เซลล์ประสาท','นิวรอนและเยื่อไมอีลิน',T_neuron,'bio'],['นัยน์ตา','ภาพตัดตามขวาง',T_eye,'bio'],['กล้องจุลทรรศน์','ส่วนประกอบและหน้าที่',T_scope,'bio']);
window.__bioTpl={T_animal,T_plant,T_bacterium,T_membrane,T_mitosis,T_dna,T_protein,T_mono,T_di,T_photo,T_resp,T_food,T_circ,T_heart,T_flower,T_leaf,T_neuron,T_eye,T_scope};
})();
