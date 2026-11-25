/* PhysiDraw — library taxonomy (loaded last).
   Puts every asset in the subject/category where a teacher would look for it.
   - Object keys never change, so saved .json files keep working.
   - `also`  : an asset can be listed in more than one category (e.g. a beaker in heat experiments).
   - `legacy`: older duplicates are hidden from the library but still render in existing files. */
"use strict";
(function(){
if(typeof CATS==='undefined')return;
const NAME={mech:'กลศาสตร์',wave:'คลื่นและเสียง',heat:'ความร้อนและแก๊ส',optics:'ทัศนศาสตร์',em:'ไฟฟ้าสถิตและแม่เหล็กไฟฟ้า',elec:'วงจรไฟฟ้า',semi:'อิเล็กทรอนิกส์และเซมิคอนดักเตอร์',
  modern:'ฟิสิกส์อะตอมและนิวเคลียร์',meas:'เครื่องมือวัดและจับเวลา',mat:'วัสดุและโครงสร้างผลึก',matg:'กราฟสมบัติวัสดุ',adv:'เครื่องมือวิเคราะห์ขั้นสูง',
  chem_glass:'เครื่องแก้วและภาชนะ',chem_lab:'อุปกรณ์และเครื่องมือปฏิบัติการเคมี'};
const EN={heat:'Heat & gases',wave:'Waves & sound',matg:'Material property plots',chem_glass:'Glassware',chem_lab:'Chemistry equipment',em:'Electrostatics & EM',modern:'Atomic & nuclear',meas:'Measurement & timing',mat:'Materials & crystals',adv:'Analytical instruments'};
const ORDER=['mech','wave','heat','optics','em','elec','semi','modern','meas','mat','matg','adv',
  'chem_atom','chem_mol','chem_glass','chem_lab','chem_proc',
  'bio_cell','bio_gen','bio_body','bio_plant','bio_micro','bio_eco','bio_lab',
  'astro_sol','astro_struct','astro_sky','astro_star','astro_inst','life','gen'];
const MOVE={thermometer:'heat',burner:'heat',gas_box:'heat',magnifier:'optics',vdg:'em',band:'semi',pn:'semi',atom:'modern',geiger:'modern',crt:'modern',
  vernier:'meas',micrometer:'meas',ticker:'meas',photogate:'meas',photogate_stand:'meas',photogate_timer:'meas',laptop:'meas',
  eps_freq:'matg',eps_temp:'matg',sinter:'matg',pe_loop:'matg',mh_loop:'matg',xrd:'matg',cuvette:'chem_glass',mortar:'chem_lab',
  cl_beaker:'chem_glass',cl_flask:'chem_glass',cl_volflask:'chem_glass',cl_testtube:'chem_glass',cl_cylinder:'chem_glass',cl_burette:'chem_glass',cl_pipette:'chem_glass',cl_funnel:'chem_glass',
  cl_filterfunnel:'chem_glass',cl_sepfunnel:'chem_glass',cl_condenser:'chem_glass',cl_roundflask:'chem_glass',cl_distflask:'chem_glass',cl_watchglass:'chem_glass',cl_evapdish:'chem_glass',
  cl_crucible:'chem_glass',cl_reagent:'chem_glass',cl_washbottle:'chem_glass',cl_stirrod:'chem_glass'};
const ALSO={heat:['cl_thermometer','cl_bunsen','cl_beaker','cl_testtube','cl_flask','cl_hotplate','cl_waterbath','cl_tripod','cl_stand'],mech:['cl_stand','cl_clamp'],
  modern:['bohr_tool','nucleus','p_proton','p_neutron'],chem_lab:['uvvis','balance'],chem_atom:['atom','energy_levels'],
  bio_lab:['cl_beaker','cl_testtube','cl_rack','cl_bunsen','cl_pipette','cl_washbottle','cl_thermometer'],astro_inst:['rocket'],astro_sky:['bio_sun'],optics:['bio_eye_xs']};
/* duplicates of better, editable versions (kept for old files) */
const LEGACY=['beaker','flask','test_tube','grad_cylinder','pipette','dropper','petri','funnel','round_flask','crucible','hotplate','retort_stand','thermometer','burner'];
Object.entries(MOVE).forEach(([k,c])=>{if(DEF[k])DEF[k].cat=c;});
Object.entries(ALSO).forEach(([c,ks])=>ks.forEach(k=>{const d=DEF[k];if(d&&d.cat!==c)(d.also=d.also||[]).includes(c)||d.also.push(c);}));
LEGACY.forEach(k=>{if(DEF[k])DEF[k].legacy=true;});
/* rebuild the category list in teaching order */
const have=new Map(CATS.map(c=>[c[0],c]));[['heat'],['matg'],['chem_glass']].forEach(([k])=>{if(!have.has(k))have.set(k,[k,NAME[k],EN[k]]);});
const next=[];ORDER.forEach(k=>{const c=have.get(k);if(c){next.push([k,NAME[k]||c[1],EN[k]||c[2]]);have.delete(k);}});have.forEach((c,k)=>{if(k!=='lab')next.push(c);});
CATS.length=0;next.forEach(c=>CATS.push(c));
CAT_SUBJ.chem_glass='chem';
window.__taxonomy={MOVE,ALSO,LEGACY};
})();
