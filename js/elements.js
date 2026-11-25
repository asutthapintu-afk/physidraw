/* PhysiDraw — periodic data for the chemistry module (Z = 1–54, H to Xe).
   Each entry: [symbol, Thai name, English name, mass number of the most abundant isotope, valence electrons (main group) or null]
   Shell occupancy follows the Aufbau (Madelung) order, with the known ground-state exceptions listed in SHELL_EXCEPTIONS. */
"use strict";
const ELEMENTS=[null,
 ['H','ไฮโดรเจน','Hydrogen',1,1],['He','ฮีเลียม','Helium',4,2],
 ['Li','ลิเทียม','Lithium',7,1],['Be','เบริลเลียม','Beryllium',9,2],['B','โบรอน','Boron',11,3],['C','คาร์บอน','Carbon',12,4],['N','ไนโตรเจน','Nitrogen',14,5],['O','ออกซิเจน','Oxygen',16,6],['F','ฟลูออรีน','Fluorine',19,7],['Ne','นีออน','Neon',20,8],
 ['Na','โซเดียม','Sodium',23,1],['Mg','แมกนีเซียม','Magnesium',24,2],['Al','อะลูมิเนียม','Aluminium',27,3],['Si','ซิลิคอน','Silicon',28,4],['P','ฟอสฟอรัส','Phosphorus',31,5],['S','กำมะถัน','Sulfur',32,6],['Cl','คลอรีน','Chlorine',35,7],['Ar','อาร์กอน','Argon',40,8],
 ['K','โพแทสเซียม','Potassium',39,1],['Ca','แคลเซียม','Calcium',40,2],['Sc','สแกนเดียม','Scandium',45,null],['Ti','ไทเทเนียม','Titanium',48,null],['V','วาเนเดียม','Vanadium',51,null],['Cr','โครเมียม','Chromium',52,null],['Mn','แมงกานีส','Manganese',55,null],['Fe','เหล็ก','Iron',56,null],['Co','โคบอลต์','Cobalt',59,null],['Ni','นิกเกิล','Nickel',58,null],['Cu','ทองแดง','Copper',63,null],['Zn','สังกะสี','Zinc',64,null],
 ['Ga','แกลเลียม','Gallium',69,3],['Ge','เจอร์เมเนียม','Germanium',74,4],['As','สารหนู','Arsenic',75,5],['Se','ซีลีเนียม','Selenium',80,6],['Br','โบรมีน','Bromine',79,7],['Kr','คริปทอน','Krypton',84,8],
 ['Rb','รูบิเดียม','Rubidium',85,1],['Sr','สตรอนเชียม','Strontium',88,2],['Y','อิตเทรียม','Yttrium',89,null],['Zr','เซอร์โคเนียม','Zirconium',90,null],['Nb','ไนโอเบียม','Niobium',93,null],['Mo','โมลิบดีนัม','Molybdenum',98,null],['Tc','เทคนีเชียม','Technetium',98,null],['Ru','รูทีเนียม','Ruthenium',102,null],['Rh','โรเดียม','Rhodium',103,null],['Pd','แพลเลเดียม','Palladium',106,null],['Ag','เงิน','Silver',107,null],['Cd','แคดเมียม','Cadmium',114,null],
 ['In','อินเดียม','Indium',115,3],['Sn','ดีบุก','Tin',120,4],['Sb','พลวง','Antimony',121,5],['Te','เทลลูเรียม','Tellurium',130,6],['I','ไอโอดีน','Iodine',127,7],['Xe','ซีนอน','Xenon',132,8]];
const ZMAX=ELEMENTS.length-1;
const SYM2Z={};ELEMENTS.forEach((e,z)=>{if(e)SYM2Z[e[0]]=z;});
/* Ground-state shell occupancies that differ from simple Aufbau filling (NIST). */
const SHELL_EXCEPTIONS={24:[2,8,13,1],29:[2,8,18,1],41:[2,8,18,12,1],42:[2,8,18,13,1],44:[2,8,18,15,1],45:[2,8,18,16,1],46:[2,8,18,18],47:[2,8,18,18,1]};
const MADELUNG=[[1,0],[2,0],[2,1],[3,0],[3,1],[4,0],[3,2],[4,1],[5,0],[4,2],[5,1]];
function subshells(nElectrons){const out=[];let left=nElectrons;for(const[n,l]of MADELUNG){if(left<=0)break;const cap=2*(2*l+1),k=Math.min(cap,left);out.push([n,l,k]);left-=k;}return out;}
/* Electrons per shell (K, L, M, …) for a neutral atom of atomic number Z. */
function shellsOf(Z){if(SHELL_EXCEPTIONS[Z])return SHELL_EXCEPTIONS[Z].slice();const sh=[];for(const[n,,k]of subshells(Z))sh[n-1]=(sh[n-1]||0)+k;return Array.from(sh,v=>v||0);}
/* Shell occupancy for an ion of charge q: cations lose electrons from the outermost shell first (e.g. Fe²⁺ loses 4s), anions gain into the valence shell. */
function ionShells(Z,q){const sh=shellsOf(Z);if(q>0){let r=q;for(let i=sh.length-1;i>=0&&r>0;i--){const t=Math.min(sh[i],r);sh[i]-=t;r-=t;}while(sh.length&&sh[sh.length-1]===0)sh.pop();}
  else if(q<0){sh[sh.length-1]+=-q;}return sh;}
const SUBL='spdf';
function configString(Z){if(SHELL_EXCEPTIONS[Z]){const fix={24:'[Ar] 3d⁵ 4s¹',29:'[Ar] 3d¹⁰ 4s¹',41:'[Kr] 4d⁴ 5s¹',42:'[Kr] 4d⁵ 5s¹',44:'[Kr] 4d⁷ 5s¹',45:'[Kr] 4d⁸ 5s¹',46:'[Kr] 4d¹⁰',47:'[Kr] 4d¹⁰ 5s¹'};return fix[Z];}
  const sup=n=>String(n).replace(/\d/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);return subshells(Z).map(([n,l,k])=>n+SUBL[l]+sup(k)).join(' ');}
/* CPK-style colours for ball models (Jmol palette, slightly softened for print). */
const CPK={H:'#f5f5f5',C:'#4b5563',N:'#3b6fd8',O:'#e23b3b',F:'#7ed957',Cl:'#33c24d',Br:'#a52a2a',I:'#7b3fa0',S:'#f2c230',P:'#f28c28',B:'#f5b38a',Si:'#d9b38c',Na:'#9b6bd6',K:'#8a4fd0',Mg:'#4fc24f',Ca:'#5f9e5f',Al:'#b9a3a3',Fe:'#d9762b',Cu:'#c87533',Zn:'#7d80b0',Li:'#c27ee6',Be:'#b8f046',He:'#d9ffff',Ne:'#b3e3f5',Ar:'#80d1e3',Xe:'#66b3c7',Ag:'#c0c0c0',Mn:'#9c7ac7',Co:'#f090a0',Ni:'#50d050',Cr:'#8a99c7',Ti:'#bfc2c7',Se:'#ffa100',Kr:'#5cb8d1',Sn:'#668080'};
/* Typical numbers of covalent bonds (sum of bond orders) for neutral atoms — used only for gentle warnings. */
const VALENCE={H:[1],B:[3],C:[4],N:[3],O:[2],F:[1],Si:[4],P:[3,5],S:[2,4,6],Cl:[1,3,5,7],Br:[1,3,5],I:[1,3,5,7],Se:[2,4,6],Xe:[0,2,4,6],Be:[2],Li:[0,1],Na:[0,1],K:[0,1],Mg:[0,2],Ca:[0,2],Al:[3]};
function elementInfo(sym){const Z=SYM2Z[sym];return Z?{Z,sym,th:ELEMENTS[Z][1],en:ELEMENTS[Z][2],A:ELEMENTS[Z][3],ve:ELEMENTS[Z][4]}:null;}
