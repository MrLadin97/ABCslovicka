/* =====================================================================
   DALŠÍ UČICÍ HRY: Pexeso, Dej opičce, Balónky (barvy a čísla), Simon says
   Načítá se až po hlavním skriptu a používá jeho funkce (say, pool, stats…).
   ===================================================================== */

/* ---------- obrázky pro nové hry ---------- */
(() => {
  const { INK, C, E, P, R, G, NS, kid, sparkle } = window.PH;
  const balloon = col => P('M100,150 Q92,170 104,184 Q112,192 104,200', 'none', 'stroke-width="3"') +
    E(100, 86, 54, 64, col) + P('M92,148 L108,148 L100,158Z', col, 'stroke-width="4"') +
    E(78, 60, 10, 18, '#fff', NS + ' opacity=".55" transform="rotate(25 78 60)"');
  window.balloonPic = balloon;
  Object.assign(window.PICS, {
    '_balloons': () => G('translate(-34 14) scale(.8)', balloon('#4DA3FF')) + G('translate(74 18) scale(.8)', balloon('#FFD23F')) + G('translate(20 -6) scale(.9)', balloon('#F0453F')),
    '_pexeso': () => G('rotate(-10 70 100)', R(22, 40, 92, 120, 16, '#7C5CE8') + P('M44,64 L92,136 M92,64 L44,136', 'none', 'stroke="#fff" stroke-width="5" opacity=".5"') + C(68, 100, 14, '#FFD23F', 'stroke-width="3.5"')) +
      G('rotate(8 130 100)', R(86, 40, 92, 120, 16, '#fff') + G('translate(94 58) scale(.38)', window.PICS.apple(), 'stroke-width="13"')),
    '_simon': () => kid({ shirt: '#FF8A65', pose: 'up' }) + P('M80,26 L80,6 L90,16 L100,2 L110,16 L120,6 L120,26Z', '#FFD23F', 'stroke-width="4"') + sparkle(30, 40, .8) + sparkle(172, 50, .7),
    '_hourglass': () => P('M60,24 L140,24 M60,176 L140,176', 'none', 'stroke-width="9"') +
      P('M68,28 Q68,80 100,100 Q132,80 132,28Z', '#BDE7FF') + P('M68,172 Q68,120 100,100 Q132,120 132,172Z', '#BDE7FF') +
      P('M84,60 Q100,74 116,60Z', '#FFD23F', NS) + P('M76,170 Q100,130 124,170Z', '#FFD23F', 'stroke-width="3"') + P('M100,100 L100,150', 'none', 'stroke="#FFD23F" stroke-width="4"'),
  });
})();

/* ---------- společné ---------- */
const MODE_NAMES = { quiz: 'Najdi obrázek', pexeso: 'Pexeso', feed: 'Dej opičce', balloons: 'Balónky', simon: 'Simon says' };
let lastMode = 'quiz';
window.MODE_NAMES_ = MODE_NAMES;
const MODES = {};
function poolOr(list, min){ return list.length >= min ? list : ALL; }
function recordFirst(w){ const st = wstat(w.en); st.first++; st.streak++; st.last = Date.now(); setWeight(w, weightOf(w) - 1); saveStats(); }
function recordLate(w){ const st = wstat(w.en); st.late++; st.last = Date.now(); saveStats(); }
function recordWrong(w, firstMiss){ const st = wstat(w.en); st.wrong++; st.streak = 0; if (firstMiss) setWeight(w, weightOf(w) + 2); saveStats(); }
// after a mistake: Czech word, then the English prompt again; nothing can be tapped meanwhile
async function teach(w, englishKey, el, lockEl, t){
  lockEl?.classList.add('waiting');
  await wait(350); if (t !== quiz.token) return false;
  await czWait(w, el); if (t !== quiz.token) return false;
  await wait(300); if (t !== quiz.token) return false;
  await sayWait(englishKey, { el }); if (t !== quiz.token) return false;
  lockEl?.classList.remove('waiting');
  return true;
}
function progressDots(el, total, results, now){
  el.innerHTML = '';
  for (let i = 0; i < total; i++){
    const d = document.createElement('i'), r = results[i];
    if (r === 'star'){ d.className = 'star'; d.innerHTML = STAR; } else if (r === 'ok') d.className = 'ok'; else if (i === now) d.className = 'now';
    el.appendChild(d);
  }
}
// shared ending: celebration, then a random reward mini-game
function finishLesson(mode, got, total, wrong){
  stats.games.unshift({ t: Date.now(), cat: state.cat, mode, rounds: total, first: got, wrong });
  stats.games = stats.games.slice(0, 40); saveStats();
  show('done');
  $('#done-btns').hidden = true;
  $('#done-stars').innerHTML = STAR.repeat(got) + '<b class="dot"></b>'.repeat(Math.max(0, total - got));
  fanfare(); say('Well done!');
  setTimeout(() => confetti($('.trophy'), 22), 150);
  const t = quiz.token;
  setTimeout(() => { if (t === quiz.token && screen === 'done') startGame(); }, 3200);
}
$('#again').onclick = () => (MODES[lastMode] || startQuiz)();
$('#go-quiz').addEventListener('click', () => { lastMode = 'quiz'; });
// fit a set of square tiles into the space left on screen
function fitTiles(box, n, gap = 12){
  box.style.maxWidth = '';
  const h = box.clientHeight || innerHeight - 220, w = box.clientWidth || innerWidth - 32;
  let best = { size: 0, cols: 1 };
  for (let cols = 1; cols <= n; cols++){
    const rows = Math.ceil(n / cols);
    const size = Math.floor(Math.min((w - (cols - 1) * gap) / cols, (h - (rows - 1) * gap) / rows));
    const tidy = n % cols === 0 ? 1.04 : 1;               // prefer full rows
    if (size * tidy > best.size * (best.tidy || 1)) best = { size, cols, tidy };
  }
  const size = Math.max(50, best.size);
  box.style.setProperty('--size', size + 'px');
  box.style.maxWidth = (best.cols * size + (best.cols - 1) * gap) + 'px';
}

/* =====================================================================
   PEXESO
   ===================================================================== */
const pex = { cards: [], open: [], lock: false, found: 0, moves: 0, pairs: 0 };
// level → number of pairs; every count fills a complete grid
const PEX_PAIRS = { 2: 4, 3: 6, 4: 8, 5: 10 };            // 8, 12, 16, 20 cards
const PEX_GRIDS = { 8: [[4, 2], [2, 4]], 12: [[4, 3], [3, 4], [6, 2]], 16: [[4, 4], [8, 2]], 20: [[5, 4], [4, 5]] };
function layoutPex(){
  const box = $('#pex-grid'), n = pex.cards.length, gap = 10;
  const sec = $('#pexeso');
  const W = sec.clientWidth, H = sec.clientHeight;
  let best = null;
  for (const [cols, rows] of PEX_GRIDS[n] || [[Math.ceil(Math.sqrt(n)), Math.ceil(n / Math.ceil(Math.sqrt(n)))]]){
    const size = Math.floor(Math.min((W - (cols - 1) * gap) / cols, (H - (rows - 1) * gap) / rows));
    if (!best || size > best.size) best = { cols, rows, size };
  }
  box.style.gridTemplateColumns = `repeat(${best.cols}, ${Math.max(44, best.size)}px)`;
  box.style.setProperty('--size', Math.max(44, best.size) + 'px');
}
function startPexeso(){
  lastMode = 'pexeso'; quiz.token++;
  const want = PEX_PAIRS[state.n];
  const words = pickWeighted(poolOr(pool(), want), want);
  pex.pairs = words.length;
  pex.cards = shuffle(words.concat(words).map((w, i) => ({ w, id: i })));
  pex.open = []; pex.lock = false; pex.found = 0; pex.moves = 0; pex.got = 0;
  show('pexeso');
  const box = $('#pex-grid'); box.innerHTML = '';
  pex.cards.forEach(c => {
    const b = document.createElement('button');
    b.className = 'pcard'; b.style.setProperty('--c', c.w.cat.color);
    b.setAttribute('aria-label', 'Karta');
    b.innerHTML = `<span class="pin"><span class="pback">${STAR}</span><span class="pface">${drawPic(c.w.en)}</span></span>`;
    b.onclick = () => flipPex(b, c);
    c.el = b; box.appendChild(b);
  });
  layoutPex();
  requestAnimationFrame(layoutPex);
}
async function flipPex(b, c){
  if (pex.lock || c.done || pex.open.includes(c)) return;
  b.classList.add('up'); say(c.w.en);
  pex.open.push(c);
  if (pex.open.length < 2) return;
  pex.moves++;
  const [a, d] = pex.open; pex.lock = true;
  const t = quiz.token;
  if (a.w.en === d.w.en){
    await wait(650); if (t !== quiz.token) return;
    a.done = d.done = true; a.el.classList.add('done'); d.el.classList.add('done');
    ding(); confetti(d.el, 10); addStar(); pex.got++;
    pex.found++; pex.open = []; pex.lock = false;
    if (pex.found === pex.pairs){ await wait(900); if (t === quiz.token) finishLesson('pexeso', pex.got, pex.pairs, pex.moves - pex.pairs); }
  } else {
    await wait(1450); if (t !== quiz.token) return;      // 1 s to look after the card has finished turning (0.45 s)
    a.el.classList.remove('up'); d.el.classList.remove('up');
    await wait(450); if (t !== quiz.token) return;       // wait until they are face down again
    pex.open = []; pex.lock = false;
  }
}
MODES.pexeso = startPexeso;
addEventListener('resize', () => { if (screen === 'pexeso') layoutPex(); });

/* =====================================================================
   DEJ OPIČCE – "Give me the apple, please!"
   ===================================================================== */
const NOUNS = ['teddy bear', 'rainbow', 'ball', 'apple', 'banana', 'potato', 'car', 'pencil', 'horse', 'cow', 'sheep', 'pig', 'duck', 'dog', 'cat', 'hen'];
const FOOD = ['apple', 'banana', 'potato'];
const feed = { list: [], i: 0, results: [], missed: false, busy: false, wrong: 0 };
const feedPool = () => { const all = ALL.filter(w => NOUNS.includes(w.en)); const p = pool().filter(w => NOUNS.includes(w.en)); return p.length >= 4 ? p : all; };
const askKey = w => `Give me the ${w.en}, please!`;
function startFeed(){
  lastMode = 'feed'; quiz.token++;
  const p = feedPool();
  feed.list = pickWeighted(p, Math.min(8, p.length));
  feed.i = 0; feed.results = []; feed.wrong = 0;
  show('feed');
  $('#feed-monkey').innerHTML = drawPic('monkey');
  feedRound();
}
function feedRound(){
  const target = feed.list[feed.i], n = state.n;
  const opts = [target];
  for (const w of shuffle(feedPool()).concat(shuffle(ALL.filter(w => NOUNS.includes(w.en))))){ if (opts.length >= n) break; if (!opts.some(o => o.en === w.en)) opts.push(w); }
  feed.missed = false; feed.busy = false;
  progressDots($('#feed-prog'), feed.list.length, feed.results, feed.i);
  const box = $('#feed-items'); box.innerHTML = ''; box.classList.remove('waiting');
  shuffle(opts).forEach(w => {
    const b = document.createElement('div');
    b.className = 'fitem'; b.style.setProperty('--c', w.cat.color);
    b.setAttribute('role', 'button'); b.setAttribute('aria-label', w.cz);
    b.innerHTML = drawPic(w.en);
    dragOrTap(b, () => feedPick(b, w, target));
    box.appendChild(b);
  });
  $('#feed-bubble').classList.remove('happy');
  const t = quiz.token;
  setTimeout(() => { if (t === quiz.token && screen === 'feed') say(askKey(target), { el: $('#feed-bubble') }); }, 450);
}
// drag an item onto the monkey, or just tap it
function dragOrTap(el, onDrop){
  let sx, sy, dx = 0, dy = 0, drag = false, id = null;
  el.addEventListener('pointerdown', e => {
    if (feed.busy) return;
    id = e.pointerId; sx = e.clientX; sy = e.clientY; dx = dy = 0; drag = false;
    el.setPointerCapture(id); el.classList.add('held');
  });
  el.addEventListener('pointermove', e => {
    if (e.pointerId !== id) return;
    dx = e.clientX - sx; dy = e.clientY - sy;
    if (Math.hypot(dx, dy) > 10) drag = true;
    if (drag) el.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
  });
  const end = e => {
    if (e.pointerId !== id) return;
    id = null; el.classList.remove('held');
    const m = $('#feed-monkey').getBoundingClientRect();
    const overMonkey = e.clientX > m.left - 30 && e.clientX < m.right + 30 && e.clientY > m.top - 30 && e.clientY < m.bottom + 30;
    if (!drag || overMonkey) onDrop(); else el.style.transform = '';
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', e => { if (e.pointerId === id){ id = null; el.style.transform = ''; el.classList.remove('held'); } });
}
async function feedPick(el, w, target){
  if (feed.busy) return;
  const t = quiz.token;
  if (w.en !== target.en){
    feed.busy = true; feed.wrong++;
    el.style.transform = ''; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); boop();
    recordWrong(target, !feed.missed); feed.missed = true;
    const ok = await teach(target, askKey(target), $('#feed-bubble'), $('#feed-items'), t);
    if (ok) feed.busy = false;
    return;
  }
  feed.busy = true;
  // fly into the monkey's arms
  const m = $('#feed-monkey').getBoundingClientRect(), r = el.getBoundingClientRect();
  const cur = new DOMMatrix(getComputedStyle(el).transform);
  el.classList.add('fly');
  el.style.transform = `translate(${cur.m41 + m.left + m.width / 2 - (r.left + r.width / 2)}px, ${cur.m42 + m.top + m.height * .62 - (r.top + r.height / 2)}px) scale(.2)`;
  el.style.opacity = '0';
  feed.results[feed.i] = feed.missed ? 'ok' : 'star';
  if (feed.missed) recordLate(target); else { recordFirst(target); addStar(); }
  progressDots($('#feed-prog'), feed.list.length, feed.results, -1);
  await wait(450); if (t !== quiz.token) return;
  const mk = $('#feed-monkey'); mk.classList.remove('munch'); void mk.offsetWidth; mk.classList.add('munch');
  $('#feed-bubble').classList.add('happy');
  ding(); confetti(mk, 10);
  await sayWait(FOOD.includes(target.en) ? 'Yummy!' : 'Thank you!'); if (t !== quiz.token) return;
  await sayWait(target.en); if (t !== quiz.token) return;
  await wait(300); if (t !== quiz.token) return;
  feed.i++;
  if (feed.i >= feed.list.length){
    const got = feed.results.filter(r => r === 'star').length;
    finishLesson('feed', got, feed.list.length, feed.wrong);
  } else feedRound();
}
$('#feed-bubble').onclick = () => { if (!feed.busy && feed.list[feed.i]) say(askKey(feed.list[feed.i]), { el: $('#feed-bubble') }); };
MODES.feed = startFeed;

/* =====================================================================
   BALÓNKY – "Pop three red balloons!" (barvy + počítání)
   ===================================================================== */
const COLOURS = { red: '#F0453F', blue: '#3F8EF0', green: '#3DBE5A', yellow: '#FFD62E', orange: '#FF9426', purple: '#9B5CE8', black: '#3A3550', white: '#FFFFFF', brown: '#9A5B33' };
const NUMW = ['one', 'two', 'three', 'four', 'five'];
const bal = { rounds: 6, i: 0, results: [], missed: false, busy: false, wrong: 0 };
const balKey = (num, col) => `Pop ${NUMW[num - 1]} ${col} balloon${num > 1 ? 's' : ''}!`;
const colourWord = en => ALL.find(w => w.en === en);
function startBalloons(){
  lastMode = 'balloons'; quiz.token++;
  bal.i = 0; bal.results = []; bal.wrong = 0;
  // the selected lesson's colours if it has some, otherwise all of them
  const inPool = pool().map(w => w.en).filter(en => COLOURS[en]);
  bal.colours = inPool.length >= 3 ? inPool : Object.keys(COLOURS);
  bal.plan = Array.from({ length: bal.rounds }, () => {
    const col = pickWeighted(bal.colours.map(colourWord).filter(Boolean), 1)[0].en;
    const max = { 2: 3, 3: 4, 4: 5, 5: 5 }[state.n];
    return { col, num: 1 + Math.floor(Math.random() * max) };
  });
  show('balloons');
  balRound();
}
function balRound(){
  const { col, num } = bal.plan[bal.i];
  bal.missed = false; bal.busy = false; bal.popped = 0;
  progressDots($('#bal-prog'), bal.rounds, bal.results, bal.i);
  const others = shuffle(Object.keys(COLOURS).filter(c => c !== col)).slice(0, Math.max(1, state.n - 1));
  const list = [];
  for (let k = 0; k < num + Math.floor(Math.random() * 3); k++) list.push(col);
  others.forEach(c => { for (let k = 0, m = 1 + Math.floor(Math.random() * 3); k < m; k++) list.push(c); });
  const box = $('#bal-field'); box.innerHTML = ''; box.classList.remove('waiting');
  shuffle(list).forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'bln'; b.setAttribute('aria-label', c);
    b.style.setProperty('--d', (Math.random() * 2).toFixed(2) + 's');
    b.style.setProperty('--r', (Math.random() * 10 - 5).toFixed(1) + 'deg');
    b.innerHTML = `<svg viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#wobble)" stroke="#2E2A47" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${balloonPic(COLOURS[c])}</g></svg>`;
    b.onclick = () => balPick(b, c);
    box.appendChild(b);
  });
  fitTiles(box, list.length, 6);
  $('#bal-count').innerHTML = '';
  const t = quiz.token;
  setTimeout(() => { if (t === quiz.token && screen === 'balloons') say(balKey(num, col), { el: $('#bal-say') }); }, 450);
}
function popSound(){ tone([900, 300], .05, 'square', .06); }
async function balPick(b, c){
  if (bal.busy || b.classList.contains('popped')) return;
  const { col, num } = bal.plan[bal.i], t = quiz.token;
  const cw = colourWord(col);
  if (c !== col){
    bal.busy = true; bal.wrong++;
    b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); boop();
    if (cw) recordWrong(cw, !bal.missed);
    bal.missed = true;
    $('#bal-field').classList.add('waiting');
    await wait(300); if (t !== quiz.token) return;
    await sayWait(c); if (t !== quiz.token) return;               // "blue" – the colour they tapped
    await wait(250); if (t !== quiz.token) return;
    if (cw){ await czWait(cw, $('#bal-say')); if (t !== quiz.token) return; await wait(250); }
    await sayWait(balKey(num, col), { el: $('#bal-say') }); if (t !== quiz.token) return;
    $('#bal-field').classList.remove('waiting'); bal.busy = false;
    return;
  }
  b.classList.add('popped'); popSound();
  bal.popped++;
  $('#bal-count').insertAdjacentHTML('beforeend', `<i style="background:${COLOURS[col]}"></i>`);
  say(NUMW[bal.popped - 1]);
  if (bal.popped < num) return;
  bal.busy = true;
  bal.results[bal.i] = bal.missed ? 'ok' : 'star';
  if (cw){ if (bal.missed) recordLate(cw); else recordFirst(cw); }
  if (!bal.missed) addStar();
  await wait(700); if (t !== quiz.token) return;
  ding(); confetti($('#bal-count'), 12);
  $('#bal-field').querySelectorAll('.bln:not(.popped)').forEach(x => x.classList.add('away'));
  progressDots($('#bal-prog'), bal.rounds, bal.results, -1);
  await wait(1300); if (t !== quiz.token) return;
  bal.i++;
  if (bal.i >= bal.rounds){
    const got = bal.results.filter(r => r === 'star').length;
    finishLesson('balloons', got, bal.rounds, bal.wrong);
  } else balRound();
}
$('#bal-say').onclick = () => { if (!bal.busy && bal.plan) { const { col, num } = bal.plan[bal.i]; say(balKey(num, col), { el: $('#bal-say') }); } };
MODES.balloons = startBalloons;

/* =====================================================================
   SIMON SAYS – "Simon says: touch your nose!" → do it → tap what you did
   ===================================================================== */
const SIMON = [
  ...['head', 'face', 'eyes', 'ears', 'nose', 'mouth', 'arm', 'leg', 'shoulders', 'knee', 'toes', 'foot'].map(en => ({ en, key: `Simon says: touch your ${en}!` })),
  ...['stand up', 'sit down', 'turn around', 'be quiet', 'shout', 'smile'].map(en => ({ en, key: `Simon says: ${en}!` })),
];
const sim = { list: [], i: 0, results: [], missed: false, busy: false, wrong: 0 };
const simWord = c => ALL.find(w => w.en === c.en);
function startSimon(){
  lastMode = 'simon'; quiz.token++;
  const inPool = SIMON.filter(c => pool().some(w => w.en === c.en));
  const cmds = inPool.length >= 4 ? inPool : SIMON;
  const picked = pickWeighted(cmds.map(simWord).filter(Boolean), Math.min(8, cmds.length));
  sim.list = picked.map(w => SIMON.find(c => c.en === w.en));
  sim.cmds = cmds;
  sim.i = 0; sim.results = []; sim.wrong = 0;
  show('simon');
  $('#simon-guy').innerHTML = drawPic('_simon');
  simRound();
}
async function simRound(){
  const cmd = sim.list[sim.i], t = quiz.token;
  sim.missed = false; sim.busy = true;
  progressDots($('#sim-prog'), sim.list.length, sim.results, sim.i);
  const box = $('#sim-choices'); box.innerHTML = ''; box.classList.remove('waiting');
  $('#sim-wait').hidden = true;
  await wait(400); if (t !== quiz.token) return;
  $('#simon-guy').classList.add('talking');
  await sayWait(cmd.key); if (t !== quiz.token) return;
  $('#simon-guy').classList.remove('talking');
  // time to actually do it
  const hg = $('#sim-wait'); hg.hidden = false; hg.innerHTML = drawPic('_hourglass');
  hg.classList.remove('run'); void hg.offsetWidth; hg.classList.add('run');
  await wait(3000); if (t !== quiz.token) return;
  hg.hidden = true;
  // now: which one did you do?
  const target = simWord(cmd), n = state.n;
  const opts = [target];
  for (const c of shuffle(sim.cmds).concat(shuffle(SIMON))){ if (opts.length >= n) break; const w = simWord(c); if (w && !opts.some(o => o.en === w.en)) opts.push(w); }
  shuffle(opts).forEach(w => {
    const b = document.createElement('button');
    b.className = 'stk choice'; b.style.setProperty('--c', w.cat.color);
    b.setAttribute('aria-label', w.cz);
    b.innerHTML = `<span class="pic">${drawPic(w.en)}</span>`;
    b.onclick = () => simPick(b, w, cmd);
    box.appendChild(b);
  });
  const narrow = innerWidth < 560, cols = narrow ? { 2: 2, 3: 3, 4: 2, 5: 3 }[n] : n, rows = Math.ceil(n / cols);
  box.style.setProperty('--cols', cols);
  box.style.setProperty('--max', Math.max(90, Math.floor(((box.clientHeight || innerHeight - 300) - (rows - 1) * 14) / rows) - 8) + 'px');
  sim.busy = false;
}
async function simPick(b, w, cmd){
  if (sim.busy) return;
  const target = simWord(cmd), t = quiz.token;
  if (w.en !== target.en){
    sim.busy = true; sim.wrong++;
    b.classList.add('wrong'); b.disabled = true; boop();
    recordWrong(target, !sim.missed); sim.missed = true;
    const ok = await teach(target, cmd.key, $('#simon-guy'), $('#sim-choices'), t);
    if (ok) sim.busy = false;
    return;
  }
  sim.busy = true;
  b.classList.add('right'); ding(); confetti(b);
  sim.results[sim.i] = sim.missed ? 'ok' : 'star';
  if (sim.missed) recordLate(target); else { recordFirst(target); addStar(); }
  progressDots($('#sim-prog'), sim.list.length, sim.results, -1);
  $('#sim-choices').querySelectorAll('button').forEach(x => x.disabled = true);
  await wait(300); if (t !== quiz.token) return;
  await sayWait(target.en); if (t !== quiz.token) return;
  await wait(500); if (t !== quiz.token) return;
  sim.i++;
  if (sim.i >= sim.list.length){
    const got = sim.results.filter(r => r === 'star').length;
    finishLesson('simon', got, sim.list.length, sim.wrong);
  } else simRound();
}
$('#simon-guy').onclick = () => { if (!sim.busy && sim.list[sim.i]) sayWait(sim.list[sim.i].key); };
MODES.simon = startSimon;

/* ---------- wiring on the home screen ---------- */
$('#go-pexeso').onclick = startPexeso;
$('#go-feed').onclick = startFeed;
$('#go-balloons').onclick = startBalloons;
$('#go-simon').onclick = startSimon;
$('#go-pexeso .ico').innerHTML = drawPic('_pexeso');
$('#go-feed .ico').innerHTML = drawPic('monkey');
$('#go-balloons .ico').innerHTML = drawPic('_balloons');
$('#go-simon .ico').innerHTML = drawPic('_simon');

/* =====================================================================
   DATABÁZE SLOVÍČEK (pro rodiče)
   ===================================================================== */
function openWordDb(){
  show('worddb');
  const speaker = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6"/></svg>';
  const total = CATEGORIES.reduce((a, c) => a + c.words.length, 0);
  const body = $('#worddb-body');
  body.innerHTML = `
    <div class="reset-row"><button class="stk pbtn" id="db-back">← Zpět na přehled</button></div>
    <h2>Databáze slovíček</h2>
    <p class="p-note">${ALL.length} různých slovíček (${total} včetně opakování v lekcích). Ke každému je vlastní obrázek, anglická nahrávka (normální i pomalá) a česká nahrávka. Česky upravené překlady jsou zvýrazněné, upravit je jde v přehledu pro rodiče.</p>
    ${CATEGORIES.map(c => `
      <section class="db-cat">
        <div class="db-head" style="--c:${c.color}"><span class="ico">${drawPic(c.icon)}</span>${c.name} <small>${c.words.length} slovíček</small></div>
        <div class="db-grid">${BY[c.id].map(w => {
          const st = STATUS[wordStatus(w)];
          return `<div class="db-word" style="--c:${c.color}">
            <span class="pic">${drawPic(w.en)}</span>
            <b>${esc(w.en)}</b>
            <span class="cz${czEdits[w.en] ? ' edited' : ''}">${esc(w.cz)}</span>
            <span class="row">
              <button class="db-play en" data-en="${esc(w.en)}" aria-label="Anglicky: ${esc(w.en)}">${speaker}</button>
              <button class="db-play cz" data-en="${esc(w.en)}" aria-label="Česky: ${esc(w.cz)}">${drawPic('_cz')}</button>
              <span class="pill ${st[1]}">${st[0]}</span>
            </span>
          </div>`;
        }).join('')}</div>
      </section>`).join('')}`;
  $('#db-back').onclick = openParents;
  body.querySelectorAll('.db-play.en').forEach(b => b.onclick = () => say(b.dataset.en, { el: b }));
  body.querySelectorAll('.db-play.cz').forEach(b => b.onclick = () => { const w = ALL.find(x => x.en === b.dataset.en); if (w) sayCz(w, b); });
  $('#worddb').scrollTop = 0;
}
