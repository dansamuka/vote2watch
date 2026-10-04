import fs from 'node:fs';
import vm from 'node:vm';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const files=['data/context.js','data/counties.js','data/wards.js','data/transport.js','js/app.js'];
const context={
  console,Math,Date,Intl,URL,
  Blob: class {},
  setTimeout:()=>0,clearTimeout:()=>{},setInterval:()=>0,clearInterval:()=>{},
  localStorage:{getItem:()=>null,setItem:()=>{}},
  window:{},
  document:{addEventListener:()=>{},querySelector:()=>null,querySelectorAll:()=>[]},
  Event:function(){}
};
context.globalThis=context;
vm.createContext(context);
for(const p of files)vm.runInContext(read(p),context,{filename:p});
vm.runInContext("globalThis.__V={CO,WARDS,S,CANDIDATES,sim,r2sim,structuralSummary,REGISTER_META,REGISTER_MODES};",context);
const V=context.__V;
const fail=m=>{throw new Error(m);};
const ok=(x,m)=>{if(!x)fail(m);};
const near=(a,b,t,m)=>ok(Math.abs(a-b)<=t,m+': expected '+b+', got '+a);

ok(V.CO.length===47,'expected 47 counties');
ok(V.WARDS.length===1450,'expected canonical 1,450 wards');
ok(new Set(V.WARDS.map(w=>w.sourceConstituencyCode)).size===290,'expected 290 constituencies');
ok(V.WARDS.every(w=>w.basis==='constituency_imputed'),'every ward preference row must disclose constituency imputation');
ok(V.WARDS.reduce((z,w)=>z+w.voters,0)===22102532,'2022 ward register must reconcile to 22,102,532');

const byCounty={};
for(const w of V.WARDS)byCounty[w.county]=(byCounty[w.county]||0)+1;
for(const c of V.CO)ok(byCounty[c.name]===c.wards,'ward count mismatch: '+c.name);

ok(V.CO.reduce((z,c)=>z+c.currentEnrolmentProxyAug2026,0)===25039048,'current proxy register total must be 25,039,048');
ok(V.CO.reduce((z,c)=>z+c.projectedVoters2027,0)===28500000,'target register scenario must be 28,500,000');
ok(V.REGISTER_META.ecvrCountyTotal===2345476,'April ECVR total mismatch');
ok(V.REGISTER_META.nationalNewRegistrations===2936516,'August national additions mismatch');

const ruto=V.CANDIDATES.find(c=>c.name==='William Ruto');
ok(ruto&&ruto.avgAll>ruto.avg,'held-out-poll sensitivity should differ from validated Ruto baseline');
const ndindi=V.CANDIDATES.find(c=>c.name==='Ndindi Nyoro');
ok(ndindi&&ndindi.polls===0&&ndindi.avg<=0.6,'held-out-only candidate should be strongly shrunk in validated baseline');

V.S.registerMode='current';
V.S.pollMode='validated';
V.S.mcMode='research';
V.S.seed='ci-model-validation';
const r=V.sim({},false,false,true);
near(r.nat.i+r.nat.o+r.nat.t,1,1e-9,'national shares');
for(const c of r.ctyRes)near(c.i+c.o+c.t,1,1e-9,'county shares '+c.name);

for(const n of ['Kisumu','Migori']){
  const c=r.ctyRes.find(x=>x.name===n);
  ok(c&&c.i<0.48,n+' incumbent-side default should remain below 48% after transfer calibration');
}
for(const n of ['Kisii','Nyamira']){
  const c=r.ctyRes.find(x=>x.name===n);
  ok(c&&c.t>=0.45&&c.t<=0.65,n+' third-force calibration should remain inside broad 45-65% band');
}

const byCon=new Map();
for(const w of r.wardRes){
  const k=w.county+'|'+w.constituency;
  if(!byCon.has(k))byCon.set(k,[]);
  byCon.get(k).push(w);
}
ok(byCon.size===290,'simulation should retain 290 constituencies');
for(const [k,rows] of byCon){
  const u=new Set(rows.map(w=>[w.inc,w.opp,w.tf,w.to].map(x=>x.toFixed(10)).join('|')));
  ok(u.size===1,'ward rows in '+k+' must remain constituency-imputed until ward-specific evidence exists');
}

const modelRO=V.r2sim(r.ctyRes,r.nat,'model');
const splitRO=V.r2sim(r.ctyRes,r.nat,'spl');
ok(Math.abs(modelRO.shareA-splitRO.shareA)>0.01,'modelled runoff transfers must not collapse to old 50/50 split');

const st=V.structuralSummary();
ok(st.values.length>=5,'structural uncertainty requires multiple coalition presets');
ok(st.iHi-st.iLo>0.02,'structural coalition range should be visible');

V.S.pollMode='all';
const all=V.sim({},false,false,false);
ok(Math.abs(all.nat.i-r.nat.i)>0.005,'all-polls sensitivity should materially differ from validated baseline');

console.log(JSON.stringify({
  status:'PASS',
  wards:V.WARDS.length,
  constituencies:byCon.size,
  certified2022:V.WARDS.reduce((z,w)=>z+w.voters,0),
  currentProxy:V.CO.reduce((z,c)=>z+c.currentEnrolmentProxyAug2026,0),
  targetScenario:V.CO.reduce((z,c)=>z+c.projectedVoters2027,0),
  validated:[r.nat.i,r.nat.o,r.nat.t].map(x=>+(x*100).toFixed(1)),
  allPolls:[all.nat.i,all.nat.o,all.nat.t].map(x=>+(x*100).toFixed(1)),
  structuralA:[+(st.iLo*100).toFixed(1),+(st.iHi*100).toFixed(1)],
  runoffModelA:+(modelRO.shareA*100).toFixed(1)
},null,2));
