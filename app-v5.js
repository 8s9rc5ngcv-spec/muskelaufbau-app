const STORAGE='muskelcoach-v1';
const defaultState={tab:'home',setup:false,days:3,level:'Einsteiger',duration:35,equipment:{chair:true,table:true,rower:true},completed:[],currentDay:0,ratings:{}};
let state=load();
function load(){try{return {...defaultState,...JSON.parse(localStorage.getItem(STORAGE)||'{}')}}catch{return {...defaultState}}}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
const GIF_BASE='https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/';
const exerciseGifs={
 pushup:'0662-I4hDWkc.gif',
 squat:'1685-QChZi3x.gif',
 pike:'0662-I4hDWkc.gif',
 split:'2368-9E25EOx.gif',
 plank:'0664-KhHJ338.gif',
 rower:'1323-SJqRxOt.gif',
 tableRow:'2298-Mxa7Cr8.gif',
 superman:'0609-bLyQokI.gif',
 reverseAngel:'0609-bLyQokI.gif',
 hollow:'0001-2gPfomN.gif',
 chairDip:'0129-RrLske5.gif',
 lunge:'2368-9E25EOx.gif',
 declinePush:'0662-I4hDWkc.gif',
 glute:'3561-GibBPPg.gif',
 sidePlank:'0664-KhHJ338.gif'
};
const plans={
  A:{name:'Push & Beine',focus:'Brust • Schulter • Beine',ex:['pushup','squat','pike','split','plank']},
  B:{name:'Rücken & Core',focus:'Rücken • hintere Schulter • Bauch',ex:['rower','tableRow','superman','reverseAngel','hollow']},
  C:{name:'Ganzkörper Kraft',focus:'Beine • Brust • Core',ex:['chairDip','lunge','declinePush','glute','sidePlank']}
};
const exercises={
 pushup:{n:'Liegestütz',m:'Brust, Trizeps',s:'3–4 Sätze × 6–15 Wdh.',tip:'Körper bleibt gerade, Brust kontrolliert Richtung Boden. 1–2 Wiederholungen im Tank lassen.'},
 squat:{n:'Kniebeuge',m:'Beine, Gesäß',s:'4 Sätze × 8–20 Wdh.',tip:'Knie folgen den Fußspitzen, Rücken stabil, langsam absenken.'},
 pike:{n:'Pike Push-up',m:'Schulter',s:'3 Sätze × 6–12 Wdh.',tip:'Hüfte hoch, Kopf Richtung Boden, kontrollierte Wiederholungen.'},
 split:{n:'Bulgarian Split Squat am Stuhl',m:'Beine, Gesäß',s:'3 Sätze × 6–12 je Seite',tip:'Vorderes Bein arbeitet. Langsam und sauber, nicht wackeln.'},
 plank:{n:'Unterarmstütz',m:'Core',s:'3 Sätze × 25–60 Sek.',tip:'Rippen runter, Po leicht angespannt, nicht durchhängen.'},
 rower:{n:'Rudergerät – Kraftzüge',m:'Rücken, Bizeps',s:'5 Sätze × 8–15 kräftige Züge',tip:'Hoher Widerstand, explosiv ziehen, langsam zurück. Kein Cardio-Tempo.'},
 tableRow:{n:'Tischrudern',m:'Rücken',s:'3 Sätze × 6–12 Wdh.',tip:'Nur an stabilem Tisch. Brust Richtung Tischkante ziehen, Schulterblätter zusammen.'},
 superman:{n:'Superman Hold',m:'Rückenstrecker',s:'3 Sätze × 20–45 Sek.',tip:'Arme und Beine leicht anheben, Nacken neutral halten.'},
 reverseAngel:{n:'Reverse Snow Angels',m:'oberer Rücken',s:'3 Sätze × 8–15 Wdh.',tip:'Bauchlage, Arme langsam seitlich führen, Schulterblätter aktiv.'},
 hollow:{n:'Hollow Hold',m:'Bauch',s:'3 Sätze × 15–45 Sek.',tip:'Lendenwirbelsäule bleibt am Boden. Leichtere Variante mit angewinkelten Beinen.'},
 chairDip:{n:'Stuhl-Dips',m:'Trizeps, Brust',s:'3 Sätze × 6–12 Wdh.',tip:'Stuhl an Wand sichern. Schultern nicht zu tief absinken lassen.'},
 lunge:{n:'Ausfallschritte',m:'Beine, Gesäß',s:'3 Sätze × 8–14 je Seite',tip:'Großer, stabiler Schritt. Oberkörper aufrecht, kontrollierte Bewegung.'},
 declinePush:{n:'Füße-erhöhte Liegestütze',m:'Brust, Schulter',s:'3 Sätze × 6–12 Wdh.',tip:'Füße auf Sofa/Stuhl. Schwieriger als normale Liegestütze.'},
 glute:{n:'Glute Bridge einbeinig',m:'Gesäß, Beinrückseite',s:'3 Sätze × 8–15 je Seite',tip:'Becken kontrolliert heben, oben kurz anspannen.'},
 sidePlank:{n:'Seitstütz',m:'seitlicher Core',s:'3 Sätze × 20–45 Sek. je Seite',tip:'Körper bildet eine Linie, Hüfte bleibt oben.'}
};
function todaysKeys(){return ['A','B','C','A','B'].slice(0,state.days)}
function currentPlan(){return todaysKeys()[state.currentDay%todaysKeys().length]}
function doneThisWeek(){const week=weekId();return state.completed.filter(x=>x.week===week).length}
function weekId(){const d=new Date();let onejan=new Date(d.getFullYear(),0,1);return `${d.getFullYear()}-${Math.ceil((((d-onejan)/86400000)+onejan.getDay()+1)/7)}`}
function completeWorkout(){state.completed.push({date:new Date().toISOString(),plan:currentPlan(),week:weekId()});state.currentDay++;save();render()}
function icon(){return `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="43" stroke="white" stroke-width="6" opacity=".35"/><path d="M28 58c10-21 34-21 44 0M35 35h30M50 35v38" stroke="white" stroke-width="7" stroke-linecap="round"/></svg>`}
function shell(content){return `<main class="app">${content}</main><nav class="tabs"><div class="tabs-inner">${['home:Heute','train:Training','progress:Fortschritt','settings:Einstellungen'].map(t=>{let [id,l]=t.split(':');return `<button class="tab ${state.tab===id?'active':''}" onclick="state.tab='${id}';save();render()">${l}</button>`}).join('')}</div></nav>`}
function setup(){return `<main class="app"><section class="hero"><div class="eyebrow">MuskelCoach</div><h1 class="title">Dein Bodyweight-Plan für Muskelaufbau.</h1><p class="sub">Keine Cardio-Challenges. Kein HIIT. Nur saubere Kraftübungen mit Körpergewicht, Haushaltsmitteln und optional Rudergerät.</p></section><section class="card"><h2>Wie oft pro Woche?</h2><div class="grid">${[2,3,4,5].map(d=>`<button class="choice ${state.days===d?'active':''}" onclick="state.days=${d};save();render()">${d}× pro Woche</button>`).join('')}</div></section><section class="card"><h2>Trainingsniveau</h2><div class="switch">${['Einsteiger','Mittel','Fortgeschritten'].map(l=>`<button class="choice ${state.level===l?'active':''}" onclick="state.level='${l}';save();render()">${l}</button>`).join('')}</div></section><section class="card"><h2>Equipment</h2><p class="notice">Voreingestellt: Stuhl, stabiler Tisch und dein Rudergerät. Spezialgeräte bleiben aus.</p></section><button class="btn" onclick="state.setup=true;save();render()">App starten</button></main>`}
function home(){let p=plans[currentPlan()],done=doneThisWeek(),pct=Math.min(100,Math.round(done/state.days*100));return shell(`<section class="hero"><div class="eyebrow">Heute</div><h1 class="title">${p.name}</h1><p class="sub">${p.focus} · ca. ${state.duration} Minuten · ${state.level}</p></section><section class="card"><div class="row"><div><div class="muted">Wochenfortschritt</div><div class="big">${done} von ${state.days}</div></div><span class="pill">Muskelaufbau</span></div><br><div class="progress"><div class="bar" style="width:${pct}%"></div></div></section><section class="card"><h2>Nächstes Training</h2><p class="muted">${p.ex.length} Übungen · längere Pausen · kontrollierte Wiederholungen</p><button class="btn" onclick="state.tab='train';save();render()">Training starten</button></section><section class="card"><h2>Prinzip</h2><p class="notice">Die App nutzt bewusst keine Cardio-Übungen. Ziel sind saubere Sätze, passende Pausen und Progression über Wiederholungen oder schwierigere Varianten.</p></section>`)}
function train(){let p=plans[currentPlan()];return shell(`<section class="hero"><div class="eyebrow">Training ${currentPlan()}</div><h1 class="title">${p.name}</h1><p class="sub">${p.focus}</p></section><section class="card"><div class="timer" id="timer">02:00</div><div class="grid"><button class="btn secondary" onclick="startTimer(120)">Pause 2:00</button><button class="btn secondary" onclick="startTimer(180)">Pause 3:00</button></div></section><div class="list">${p.ex.map(id=>exCard(id)).join('')}</div><br><button class="btn" onclick="completeWorkout()">Training abschließen</button>`)}
function exCard(id){let e=exercises[id],src=GIF_BASE+exerciseGifs[id];return `<article class="card exercise"><div class="visual"><img class="exercise-gif" src="${src}" alt="Animation: ${e.n}" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="gif-fallback" hidden>${icon()}<span>Animation konnte nicht geladen werden</span></div></div><div class="exbody"><h3 class="exname">${e.n}</h3><div class="tagrow"><span class="tag">${e.m}</span><span class="tag">Hypertrophie</span></div><p class="sets">${e.s}</p><p class="notice">${e.tip}</p></div></article>`}
function progress(){let total=state.completed.length,streak=Math.min(total,7);return shell(`<section class="hero"><div class="eyebrow">Fortschritt</div><h1 class="title">Deine Kraft-Routine</h1></section><div class="grid"><section class="card"><div class="muted">Trainings gesamt</div><div class="big">${total}</div></section><section class="card"><div class="muted">Serie</div><div class="big">${streak}</div></section></div><section class="card"><h2>Letzte Einheiten</h2><div class="list">${state.completed.slice(-8).reverse().map(x=>`<div class="item"><b>Training ${x.plan}</b><br><span class="muted">${new Date(x.date).toLocaleString('de-DE')}</span></div>`).join('')||'<p class="muted">Noch kein Training abgeschlossen.</p>'}</div></section>`)}
function settings(){return shell(`<section class="hero"><div class="eyebrow">Einstellungen</div><h1 class="title">Dein Plan</h1></section><section class="card"><h2>Trainingshäufigkeit</h2><div class="grid">${[2,3,4,5].map(d=>`<button class="choice ${state.days===d?'active':''}" onclick="state.days=${d};save();render()">${d}×</button>`).join('')}</div></section><section class="card"><h2>Equipment</h2><div class="item">✅ Körpergewicht</div><div class="item">✅ Stuhl / Sofa / Wand / Boden</div><div class="item">✅ stabiler Tisch</div><div class="item">✅ Rudergerät für Rücken-Kraftzüge</div></section><section class="card"><h2>Übungsanimationen</h2><p class="notice">Quelle: Exercises Dataset von hasaneyldrm (nur für private, nicht-kommerzielle Nutzung). Die Animationen werden beim ersten Aufruf geladen und danach zwischengespeichert.</p></section><section class="card"><h2>Daten</h2><button class="btn secondary" onclick="exportData()">Backup exportieren</button><br><br><button class="btn secondary" onclick="if(confirm('Alle Daten löschen?')){localStorage.removeItem(STORAGE);state={...defaultState};render()}">Zurücksetzen</button></section>`)}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='muskelcoach-backup.json';a.click()}
let int=null;function startTimer(sec){clearInterval(int);let left=sec;const el=()=>document.getElementById('timer');function tick(){let m=String(Math.floor(left/60)).padStart(2,'0'),s=String(left%60).padStart(2,'0');if(el())el().textContent=`${m}:${s}`;if(left--<=0){clearInterval(int); if(navigator.vibrate)navigator.vibrate(300)}}tick();int=setInterval(tick,1000)}
function render(){document.getElementById('app').innerHTML= state.setup ? ({home,train,progress,settings}[state.tab]||home)() : setup()}
render();
