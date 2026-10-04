// Political context and national presidential-preference polls, as of 3 Oct 2026.
// Polls are taken from the kenya-election-intelligence-engine repo
// (data/foundation/poll_results_long.json + polls_normalized.json). `eligible`
// mirrors that repo's model_eligible flag: Mizani and Politrack are shown but
// held out of averages until their methodology is verified.
// Regional-only polls (e.g. Infotrak "Mulembe Nation", Western only) are excluded.

const CTX_AS_OF='2026-10-03';

const POLLS=[
  {date:'2026-10-01',field:'15–25 Sep 2026',pollster:'Politrack Africa',n:20419,eligible:false,
   url:'https://capitalfm.africa/ruto-leads-2027-presidential-race-with-45-1-politrack-africa-poll/',
   r:{'William Ruto':45.1,'Edwin Sifuna':19.6,'Kalonzo Musyoka':10.3,"Fred Matiang'i":7.2,'Rigathi Gachagua':6,'George Wajackoyah':1.1,'David Maraga':0.8,'Martha Karua':0.8,'James Orengo':0.4,'Jimi Wanjigi':0.3}},
  {date:'2026-09-25',field:'not disclosed',pollster:'Mizani Africa',n:null,eligible:false,
   url:'https://capitalfm.africa/mizani-poll-ruto-leads-kalonzo-sifuna-in-presidential-preference-survey/',
   r:{'William Ruto':38.7,'Kalonzo Musyoka':27.5,'Edwin Sifuna':13.2,"Fred Matiang'i":7.7,'Rigathi Gachagua':4.4,'Ndindi Nyoro':3.1,'Martha Karua':0.3,'David Maraga':0.1}},
  {date:'2026-08-20',field:'25 Jul–6 Aug 2026',pollster:'Swiss Poll International',n:4037,eligible:true,
   url:'https://capitalfm.africa/kalonzo-emerges-as-leading-opposition-choice-in-2027-race-swiss-poll-shows/',
   r:{'William Ruto':31,'Kalonzo Musyoka':22,'Edwin Sifuna':13,"Fred Matiang'i":11,'Rigathi Gachagua':6}},
  {date:'2026-07-03',field:'Jun–Jul 2026',pollster:'Infotrak Research',n:3000,eligible:true,
   url:'https://www.infotrakresearch.com/2743-2/',
   r:{'William Ruto':32,'Edwin Sifuna':12,"Fred Matiang'i":12,'Kalonzo Musyoka':4,'Rigathi Gachagua':4}},
  {date:'2026-05-14',field:'May 2026',pollster:'TIFA Research',n:2013,eligible:true,
   url:'https://www.tifaresearch.com/wp-content/uploads/2023/03/TIFA-Research_Political-Alignments-and-2027-Election-Prospects_14-May-2026.pdf',
   r:{'William Ruto':24,'Kalonzo Musyoka':19,"Fred Matiang'i":16,'Edwin Sifuna':9,'Rigathi Gachagua':6}},
  {date:'2026-03-01',field:'Mar 2026',pollster:'Stats Kenya',n:null,eligible:true,
   url:'https://thekenyatimes.com/politics/ruto-in-early-lead-in-new-poll-as-opposition-split-emerges/',
   r:{'William Ruto':23.41,"Fred Matiang'i":12.25,'Kalonzo Musyoka':8.17,'Edwin Sifuna':7.44,'Rigathi Gachagua':3.99,'David Maraga':1.45,'Oburu Odinga':1,'Okiya Omtata':0.36}},
  {date:'2025-12-28',field:'19–20 Dec 2025',pollster:'Infotrak Research',n:1000,eligible:true,
   url:'https://nation.africa/kenya/news/politics/ruto-leads-in-popularity-poll-babu-owino-tipped-for-luo-kingpin-after-raila-death-infotrak-5310226',
   r:{'William Ruto':28,"Fred Matiang'i":13,'Kalonzo Musyoka':12,'Babu Owino':7,'Rigathi Gachagua':5,'David Maraga':2,'Martha Karua':2,'Edwin Sifuna':0.2}},
  {date:'2025-11-01',field:'10–17 Nov 2025',pollster:'TIFA Research',n:2053,eligible:true,
   url:'https://www.tifaresearch.com/wp-content/uploads/2023/03/TIFA-Research_Political-Alignments-and-2027-Election-Prospects_14-May-2026.pdf',
   r:{'William Ruto':25,'Kalonzo Musyoka':18,"Fred Matiang'i":16,'Edwin Sifuna':10,'Rigathi Gachagua':8}},
];

// A poll regrouped by the current teams (decided voters, undecided dropped):
// team A, team B, and everyone else. Uses the live team assignment S.cfg.
function pollTeams(p){
  const b={inc:0,opp:0,tf:0},asg=(typeof S!=="undefined"&&S.cfg&&S.cfg.assign)||{};
  for(const [name,v] of Object.entries(p.r)){const t=asg[name];b[t===0?"inc":t===1?"opp":"tf"]+=v;}
  const t=b.inc+b.opp+b.tf||1;
  return {inc:b.inc/t*100,opp:b.opp/t*100,tf:b.tf/t*100};
}

// Dated, sourced facts behind the political-context options.
const CONTEXT_FACTS=[
  {date:'2025-10',t:'Raila Odinga dies; Oburu Oginga leads ODM.',
   url:'https://nation.africa/kenya/news/politics/raila-s-anniversary-ruto-alliance-party-divisions-oburu-returns-to-a-full-in-tray-5613852'},
  {date:'2026',t:'ODM (Oburu) stays in the broad-based arrangement with Ruto; UDA–ODM zoning for 2027 still disputed.',
   url:'https://nation.africa/kenya/news/politics/ruto-oburu-pact-faces-first-major-test-over-2027-zoning-plan-5593340'},
  {date:'2026-05',t:'TIFA: support for the broad-based government falls to 30% (56% oppose).',
   url:'https://www.capitalfm.co.ke/news/2026/05/ruto-support-weakens-fragmented-opposition-2027-tifa-poll/'},
  {date:'2026-09',t:'Linda Mwananchi endorses Edwin Sifuna as its 2027 presidential candidate; party to be unveiled in October.',
   url:'https://citizen.digital/article/linda-mwananchi-group-settles-on-sifuna-as-its-2027-presidential-candidate-n390997'},
  {date:'2026-09',t:'United Opposition principals (Kalonzo, Gachagua, Matiang\'i, Karua) still split on how to pick one candidate: negotiation vs polling.',
   url:'https://eastleighvoice.co.ke/news/265402/cracks-in-united-opposition-as-gachagua-kalonzo-clash-on-when-to-name-2027-presidential-candidate'},
  {date:'2026-09-28',t:'Gachagua, Kalonzo, Sifuna and Matiang\'i ask MP Edward Muriu to draft a coalition formula for a single candidate.',
   url:'https://peopledaily.digital/inside-politics/gachagua-kalonzo-sifuna-and-matiangi-task-gatanga-mp-edward-muriu-to-draft-2027-coalition-formula'},
  {date:'2027-08-10',t:'General election (second Tuesday of August). Outright win needs 50%+1 and 25% in 24 counties; a run-off is decided by most votes (Art. 138).',
   url:'https://www.electionguide.org/elections/id/2614/'},
];

// ═══ CANDIDATE FIELD ═══
// Central baseline uses only model-eligible polls. Held-out polls remain an explicit
// sensitivity series and do not silently enter the fitted county/ward field.
const POLLSTER_QUALITY={
  'TIFA Research':1.00,'Infotrak Research':1.00,'Swiss Poll International':0.82,
  'Stats Kenya':0.55,'Politrack Africa':0.35,'Mizani Africa':0.30
};
function _pollWeight(p,includeHeld=false){
  if(!p.eligible&&!includeHeld)return 0;
  const asOf=new Date(CTX_AS_OF+'T00:00:00Z'),dt=new Date(p.date+'T00:00:00Z');
  const days=Math.max(0,(asOf-dt)/86400000),rec=Math.exp(-days/180);
  const sample=p.n?Math.min(1.20,Math.max(0.55,Math.sqrt(p.n/2000))):0.60;
  const q=POLLSTER_QUALITY[p.pollster]??0.65;
  return rec*sample*q;
}
function _shrinkReliability(n){return n>=4?1:n===3?0.90:n===2?0.75:n===1?0.55:0;}
function candidatePollEstimate(name,includeHeld=false){
  const rows=POLLS.filter(p=>p.r&&p.r[name]!==undefined&&(p.eligible||includeHeld));
  let sw=0,sv=0;for(const p of rows){const w=_pollWeight(p,includeHeld);if(w>0){sw+=w;sv+=w*p.r[name];}}
  const mean=sw?sv/sw:0.5,n=rows.length,rel=_shrinkReliability(n);
  const avg=rel*mean+(1-rel)*0.5;
  return{avg,polls:n,mean,weight:sw};
}

// Where each candidate's support sits is set per COUNTY GROUP (g), calibrated
// to published regional cuts. youth is a modest preference gradient applied
// around the national youth-ratio mean; it does not manufacture ward-level data.
const COUNTY_GROUP={
  NE:['Garissa','Wajir','Mandera','Marsabit','Isiolo'],
  KAL:['Baringo','Bomet','Elgeyo/Marakwet','Kericho','Nandi','Uasin Gishu','West Pokot'],
  RIFT:['Nakuru','Narok','Kajiado','Trans Nzoia','Turkana','Samburu'],
  LUO:['Siaya','Kisumu','Homa Bay','Migori'],
  GUSII:['Kisii','Nyamira'],
  WEST:['Kakamega','Vihiga','Bungoma','Busia'],
  NBI:['Nairobi City'],
  COAST:['Mombasa','Kilifi','Kwale','Lamu','Tana River','Taita Taveta'],
  KAMBA:['Machakos','Makueni','Kitui'],
  MTK:['Nyeri',"Murang'A",'Kiambu','Kirinyaga','Nyandarua','Laikipia'],
  MERU:['Meru','Tharaka - Nithi','Embu']
};
const GROUP_LABEL={NE:'North',KAL:'Kalenjin Rift',RIFT:'Mixed Rift',LUO:'Luo Nyanza',GUSII:'Gusii',WEST:'Western',NBI:'Nairobi',COAST:'Coast',KAMBA:'Ukambani',MTK:'Mt Kenya',MERU:'Meru & Embu'};

const CANDIDATE_DEFS=[
  {name:'William Ruto',lean:'bi',youth:-0.45,g:{NE:2.3,KAL:2.5,RIFT:1.45,LUO:1.20,GUSII:0.65,WEST:0.55,NBI:0.75,COAST:0.85,KAMBA:0.55,MTK:0.3,MERU:0.55},home:[]},
  {name:'Kalonzo Musyoka',lean:'bo',youth:-0.25,g:{KAMBA:4.5,NBI:1.0,COAST:1.0,MTK:0.8,MERU:0.9,RIFT:0.7,WEST:0.55,LUO:0.45,GUSII:0.45,NE:0.5,KAL:0.2},home:['Kitui']},
  {name:'Edwin Sifuna',lean:'bo',youth:1.25,g:{WEST:1.8,NBI:1.5,COAST:1.7,LUO:1.0,GUSII:0.5,RIFT:0.8,KAMBA:0.4,MTK:0.3,MERU:0.3,NE:0.4,KAL:0.3},home:['Bungoma']},
  {name:"Fred Matiang'i",lean:'bo',youth:0.10,g:{GUSII:3.6,LUO:0.7,MTK:1.4,MERU:1.2,NBI:1.1,RIFT:0.9,WEST:0.5,COAST:0.5,KAMBA:0.5,NE:0.6,KAL:0.4},home:[]},
  {name:'Babu Owino',lean:'bo',youth:1.10,g:{LUO:3.6,NBI:1.6,WEST:0.8,COAST:0.7,GUSII:0.5,rest:0.3},home:[]},
  {name:'Rigathi Gachagua',lean:'bi',youth:-0.10,g:{MTK:4.5,MERU:2.0,NBI:2.0,RIFT:1.2,rest:0.2},home:['Nyeri']},
  {name:'Ndindi Nyoro',lean:'bi',youth:0.30,g:{MTK:3.0,MERU:1.0,NBI:1.0,RIFT:0.8,rest:0.3},home:["Murang'A"]},
  {name:'George Wajackoyah',lean:'bo',youth:0.45,g:{WEST:2.0,rest:0.8},home:['Kakamega']},
  {name:'Oburu Odinga',lean:'bo',youth:-0.35,g:{LUO:5.0,rest:0.2},home:['Siaya']},
  {name:'David Maraga',lean:'bo',youth:-0.10,g:{GUSII:4.0,rest:0.7},home:['Nyamira']},
  {name:'Martha Karua',lean:'bi',youth:0.05,g:{MTK:2.5,MERU:1.2,rest:0.7},home:['Kirinyaga']},
  {name:'James Orengo',lean:'bo',youth:-0.25,g:{LUO:5.0,rest:0.2},home:['Siaya']},
  {name:'Okiya Omtata',lean:'bo',youth:0.35,g:{WEST:2.0,rest:0.8},home:['Busia']},
  {name:'Jimi Wanjigi',lean:'bi',youth:0.00,g:{MTK:2.0,rest:0.8},home:['Nyeri']}
];
const CANDIDATES=CANDIDATE_DEFS.map(c=>{
  const v=candidatePollEstimate(c.name,false),a=candidatePollEstimate(c.name,true);
  return{...c,avg:+v.avg.toFixed(4),avgAll:+a.avg.toFixed(4),polls:v.polls,pollsAll:a.polls,pollMean:+v.mean.toFixed(4),pollMeanAll:+a.mean.toFixed(4)};
});

const TRANSFER_PRIORS={
  'Kalonzo Musyoka':{keep:.70,groups:{KAMBA:.86,NBI:.74},stay:.22,cross:.12,else:.66},
  'Edwin Sifuna':{keep:.67,groups:{WEST:.78,NBI:.76,COAST:.72},stay:.20,cross:.10,else:.70},
  "Fred Matiang'i":{keep:.64,groups:{GUSII:.80,MTK:.68,MERU:.68},stay:.20,cross:.12,else:.68},
  'Babu Owino':{keep:.66,groups:{LUO:.76,NBI:.78},stay:.24,cross:.07,else:.69},
  'Rigathi Gachagua':{keep:.62,groups:{MTK:.74,MERU:.68},stay:.22,cross:.18,else:.60},
  'Ndindi Nyoro':{keep:.58,groups:{MTK:.70,MERU:.64},stay:.20,cross:.24,else:.56},
  'Oburu Odinga':{keep:.30,groups:{LUO:.38},stay:.27,cross:.25,else:.48},
  'David Maraga':{keep:.58,groups:{GUSII:.68},stay:.24,cross:.10,else:.66},
  'Martha Karua':{keep:.54,groups:{MTK:.62},stay:.24,cross:.14,else:.62},
  'James Orengo':{keep:.64,groups:{LUO:.74},stay:.24,cross:.07,else:.69},
  'Okiya Omtata':{keep:.55,groups:{WEST:.63},stay:.23,cross:.09,else:.68},
  'George Wajackoyah':{keep:.48,groups:{WEST:.56},stay:.25,cross:.22,else:.53},
  'Jimi Wanjigi':{keep:.45,groups:{MTK:.52},stay:.25,cross:.25,else:.50}
};
function transferPrior(name,group){
  const p=TRANSFER_PRIORS[name]||{keep:.55,stay:.25,cross:.18,else:.57};
  return{keep:(p.groups&&p.groups[group])??p.keep,stay:p.stay,cross:p.cross,else:p.else};
}

const SALIENT_EVENTS=[
  {date:'2026-09-26',region:'Coast',type:'development',measured:false,title:'Coast development tour, title deeds and project launches',note:'Post-dates the latest model-eligible regional evidence; no automatic vote uplift.'},
  {date:'2026-09',region:'Nyanza',type:'development',measured:false,title:'High-visibility Nyanza development programme',note:'Ruto gains in July regional polls are modelled; later project hype is only a signal until measured.'},
  {date:'2026-09',region:'National',type:'economy',measured:true,title:'Cost-of-living pressure remains material',note:'September inflation 6.8%; food and transport pressures are treated as contextual risk, not a deterministic vote penalty.'}
];

// county name → group key
const GROUP_OF={};Object.entries(COUNTY_GROUP).forEach(([g,list])=>list.forEach(n=>GROUP_OF[n]=g));

// Why each county looks the way it does: shown as "Basis" on the map's county card.
const GROUP_BASIS={
  NE:"Ruto polled 59–61% across the North and North Eastern in July 2026 (Infotrak, TIFA).",
  KAL:"Ruto's home base: 46–49% across the Rift in July 2026 polls (Infotrak, TIFA), highest in Kalenjin counties.",
  RIFT:"Ruto leads, but below his Kalenjin base; these counties have large Kikuyu, Luhya or pastoralist votes.",
  LUO:"The ODM–Ruto pact lifted Ruto to 30–40% in Nyanza (TIFA, Infotrak, Jul 2026); Babu Owino and Sifuna split the rest.",
  GUSII:"Matiang'i's home region; he leads Nyanza-wide at 29% (TIFA, Jul 2026).",
  WEST:"Sifuna leads Western at 28%, Ruto 14% (TIFA, Jul 2026); Sifuna was endorsed as the Luhya flagbearer.",
  NBI:"Sifuna 22% in Nairobi (TIFA, Jul 2026); a split field with Babu Owino, Kalonzo and Matiang'i.",
  COAST:"Sifuna 27%, Ruto 21–33% at the Coast (TIFA, Infotrak, Jul 2026).",
  KAMBA:"Kalonzo's home region: 58% in Lower Eastern, Ruto 15–19% (TIFA, Infotrak, Jul 2026).",
  MTK:"Gachagua 19%, Matiang'i 18%, Ruto 8% in Mt Kenya (TIFA, Jul 2026).",
  MERU:"Like Mt Kenya, but Ruto stronger with Deputy President Kindiki (from Tharaka-Nithi)."
};
// Home-county notes (candidates' own counties get a x1.5 boost in the model)
const HOME_NOTE={};
CANDIDATES.forEach(c=>c.home.forEach(n=>(HOME_NOTE[n]=HOME_NOTE[n]||[]).push(c.name)));
// Notes only (no extra boost: already reflected in the regional strength)
(HOME_NOTE['Kisii']=HOME_NOTE['Kisii']||[]).unshift("Fred Matiang'i");
(HOME_NOTE['Tharaka - Nithi']=HOME_NOTE['Tharaka - Nithi']||[]).push('Deputy President Kithure Kindiki (Ruto\'s running mate)');
