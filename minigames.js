/* =====================================================================
   DALŠÍ ODMĚNOVÉ MINIHRY S MOTORKOU
   Závod s kamarádem · Doručovatel · Motokros přes rampy · Motorka v tunelu
   Přidávají se do GAMES z hlavního skriptu, takže je náhodný výběr po lekci
   nabízí stejně jako pejska, auto a motorku v kopcích.
   ===================================================================== */

/* ---------- obrázky ---------- */
(() => {
  const { INK, SKIN, C, E, P, R, G, NS, limb } = window.PH;
  const wheel = (x, y, r) => C(x, y, r, '#3B3550') + C(x, y, r * .45, '#C9C6D9', NS) + C(x, y, r * .15, INK, NS);
  const moto = (body, shirt, helmet, extra = '') => extra +
    wheel(48, 150, 30) + wheel(156, 150, 30) +
    P('M48,150 L84,118 M156,150 L140,96', 'none', 'stroke-width="8"') +
    P('M70,124 L104,100 L144,104 L150,128 L96,136Z', body) + R(84, 130, 46, 10, 5, '#C9C6D9') +
    P('M60,112 Q80,100 104,104 L100,116 L64,120Z', '#3B3550') + P('M134,94 L150,86', 'none', 'stroke-width="6"') +
    limb('M84,106 L96,64', shirt, 18) + limb('M100,76 L142,90', shirt, 10) + C(144, 90, 7, SKIN) +
    limb('M84,110 L112,122 L108,146', '#3F4C9A', 12) + E(112, 148, 10, 6, '#E8505B') +
    C(102, 46, 22, helmet) + P('M106,34 Q126,36 124,54 L106,54Z', '#2E2A47', 'stroke-width="4"');
  const house = (wall, roof) =>
    R(146, 20, 18, 40, 3, '#8B5A3C') +
    R(30, 84, 140, 108, 6, wall) + P('M16,90 L100,20 L184,90Z', roof) +
    R(48, 104, 36, 32, 5, '#FFE27A', 'stroke-width="4"') + P('M66,104 L66,136 M48,120 L84,120', 'none', 'stroke-width="3.5"') +
    R(116, 124, 34, 68, 6, '#8B5A3C') + C(142, 160, 3.5, '#FFD23F', NS) +
    R(52, 150, 34, 26, 5, '#BDE7FF', 'stroke-width="4"');
  Object.assign(window.PICS, {
    '_moto2': () => moto('#4DA3FF', '#5CCB6A', '#E8434A'),
    '_motoD': () => moto('#FFB020', '#E8434A', '#fff',
      R(18, 82, 46, 38, 6, '#C98B55') + P('M18,100 L64,100', 'none', 'stroke="#A86B3C" stroke-width="5"') + P('M60,114 L80,114', 'none', 'stroke-width="6"')),
    '_package': () => R(30, 52, 140, 108, 10, '#C98B55') + P('M30,92 L170,92', 'none', 'stroke="#A86B3C" stroke-width="10"') +
      P('M100,52 L100,160', 'none', 'stroke="#E8434A" stroke-width="12"') +
      P('M100,52 Q78,22 66,40 Q78,60 100,52 Q122,60 134,40 Q122,22 100,52Z', '#E8434A', 'stroke-width="4"'),
    '_mailbox': () => R(92, 112, 16, 82, 4, '#8B5A3C') +
      P('M42,116 L42,72 Q42,40 100,40 Q158,40 158,72 L158,116Z', '#E8434A') + R(64, 70, 72, 12, 6, INK) +
      P('M158,64 L180,64 L180,40 L158,40', '#FFD23F', 'stroke-width="4"'),
    '_ramp': () => P('M4,192 L196,192 L196,72Z', '#FFB020') +
      P('M70,151 L96,192 M120,120 L163,192', 'none', 'stroke="#2E2A47" stroke-width="12"') + P('M4,192 L196,192 L196,72Z', 'none'),
    '_puddle': () => E(100, 162, 94, 26, '#6EC3FF') + E(66, 156, 26, 6, '#fff', NS + ' opacity=".7"') + E(132, 168, 18, 4, '#fff', NS + ' opacity=".6"'),
    '_flag': () => R(36, 14, 9, 182, 3, '#8A8698') +
      (() => { let s = ''; for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) s += R(45 + i * 22, 18 + j * 18, 22, 18, 0, (i + j) % 2 ? INK : '#fff', NS); return s; })() +
      R(45, 18, 132, 72, 3, 'none', 'stroke-width="4"'),
    '_house0': () => house('#FF9A6B', '#C2412D'),
    '_house1': () => house('#7FD4F0', '#3A6FB0'),
    '_house2': () => house('#B9A6FF', '#6A4FC0'),
    '_house3': () => house('#9ED98F', '#3F8F55'),
  });
})();

/* ---------- pomocné ---------- */
function splash(el){
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 12; i++){
    const b = document.createElement('span');
    b.className = 'bit blob'; b.style.background = i % 3 ? '#6EC3FF' : '#fff';
    const ang = -Math.PI * (.1 + .8 * Math.random()), d = 60 + Math.random() * 90;
    b.style.left = r.left + r.width / 2 + 'px'; b.style.top = r.bottom - 14 + 'px';
    b.style.setProperty('--dx', Math.cos(ang) * d + 'px'); b.style.setProperty('--dy', Math.sin(ang) * d + 'px'); b.style.setProperty('--r', '0deg');
    document.body.appendChild(b); setTimeout(() => b.remove(), 950);
  }
  tone([220, 120], .12, 'sine', .08);
}
const bonusStar = () => catchStar({ el: document.createElement('i') });
const skyHTML = '<div class="sunb"></div><div class="cloud c1"></div><div class="cloud c2"></div>';

// pointer position, holding and releasing (the main engine only reports taps)
(() => {
  const w = $('#world');
  const setY = e => { const r = w.getBoundingClientRect(); game.ptrY = (e.clientY - r.top) / r.height; };
  w.addEventListener('pointerdown', e => { game.ptrDown = true; setY(e); try { w.setPointerCapture(e.pointerId); } catch(_){} });
  w.addEventListener('pointermove', e => { if (game.ptrDown || e.pointerType === 'mouse') setY(e); });
  const up = () => { game.ptrDown = false; if (game.on && game.g && game.g.release) game.g.release(); };
  w.addEventListener('pointerup', up); w.addEventListener('pointercancel', up);
  addEventListener('keyup', e => { if (screen === 'game' && (e.key === ' ' || e.key === 'ArrowUp')) up(); });
  addEventListener('keydown', e => {
    if (screen !== 'game' || game.kind !== 'tunnel') return;
    if (e.key === 'ArrowDown'){ game.ptrY = Math.min(1, (game.ptrY ?? .5) + .12); e.preventDefault(); }
  });
})();

Object.assign(GAMES, {

  /* ---------- ZÁVOD S KAMARÁDEM: rychlé klepání = rychlá motorka ---------- */
  race: {
    setup(){
      $('#world').innerHTML = skyHTML + '<div class="track"><div class="lane-line" id="lane-line"></div></div><div class="finish" id="finish"></div>';
      const W = game.W, H = game.H;
      game.size = Math.max(60, Math.min(H * .25, W * .2));
      game.laneY = [H * .66, H * .95];           // bottom edge of the friend's and the child's bike
      game.px = 0; game.fx = 0; game.pv = 0; game.fv = 0; game.cam = 0; game.done = false;
      game.goal = W * 12;
      game.flag = sprite(drawPic('_flag'), game.size * 1.1);
      game.friend = sprite(drawPic('_moto2'), game.size * .9, 'hero');
      game.hero = sprite(drawPic('_moto'), game.size, 'hero');
      for (let x = W * 1.3; x < game.goal - W * .6; x += W * (.8 + Math.random() * .5))
        game.items.push({ kind: 'turbo', x, s: game.size * .5, el: sprite(STAR, game.size * .5, 'star') });
    },
    tap(){
      if (game.done) return;
      game.pv = Math.min(game.W * .85, game.pv + game.W * .14);
      tone([280 + Math.random() * 60], .05, 'sawtooth', .025);
    },
    update(dt){
      const W = game.W, S = game.size, k = Math.min(1, dt * 2);
      game.pv = Math.max(0, game.pv - game.pv * 1.1 * dt - W * .02 * dt);
      if (!game.done){
        // the friend stays close; near the finish it slows down so the child can win by tapping
        let target = W * .28 + (game.px - game.fx) * .9;
        if (game.goal - game.fx < W * 1.3 && game.fx > game.px - S) target = Math.min(target, W * .15);
        game.fv += (Math.max(W * .12, Math.min(W * .7, target)) - game.fv) * k;
      } else { game.fv *= 1 - k; game.pv *= 1 - k; }
      game.px += game.pv * dt; game.fx += game.fv * dt;
      game.cam = game.px - W * .3;
      const hx = W * .3;
      place(game.hero, hx, game.laneY[1] - S + (game.pv > 10 ? Math.sin(game.t * 22) * 2 : 0), game.pv > W * .55 ? -5 : 0);
      place(game.friend, Math.max(-S, Math.min(W + 10, game.fx - game.cam)), game.laneY[0] - S * .9 + Math.sin(game.t * 19) * 1.5);
      place(game.flag, game.goal - game.cam + S * .25, game.laneY[0] - S * 2);
      $('#finish').style.transform = `translateX(${game.goal - game.cam + S * .75}px)`;
      $('#lane-line').style.backgroundPositionX = -(game.cam % 60) + 'px';
      for (const it of game.items){
        if (it.dead) continue;
        const x = it.x - game.cam;
        place(it.el, x, game.laneY[1] - S * .85);
        if (x < hx + S * .75 && x + it.s > hx + S * .25){ catchStar(it); game.pv += W * .5; }
        else if (x < -it.s - 40) it.dead = true;
      }
      if (!game.done && (game.px >= game.goal || game.fx >= game.goal)){
        game.done = true;
        if (game.px >= game.goal){ confetti(game.hero, 14); for (let i = 0; i < 3; i++) setTimeout(bonusStar, 250 * i); }
        game.dur = game.t + 1.4;                  // finish a moment later
      }
    },
  },

  /* ---------- DORUČOVATEL: klepni, když svítí schránka ---------- */
  deliver: {
    setup(){
      $('#world').innerHTML = skyHTML + '<div class="street" id="street"></div>';
      game.size = Math.max(60, Math.min(game.H * .24, game.W * .2));
      game.gy = game.H * .9; game.bx = game.W * .14; game.dist = 0; game.nextHouse = .6;
      game.hero = sprite(drawPic('_motoD'), game.size, 'hero');
    },
    inReach(it){ const S = game.size, c = it.x + it.s * .5; return c > game.bx + S * .2 && c < game.bx + S * 2.8; },
    tap(){
      const S = game.size;
      const target = game.items.find(it => it.kind === 'box' && !it.got && this.inReach(it));
      const p = { kind: 'pkg', s: S * .42, t: 0, target, el: sprite(drawPic('_package'), S * .42, 'hero') };
      p.x0 = p.x = game.bx + S * .1; p.y0 = p.y = game.gy - S * .95;
      if (target) target.got = true;
      game.items.push(p); tone([500, 700], .05, 'triangle', .06);
    },
    update(dt, pace){
      const S = game.size, speed = (game.W * .2 + game.H * .1) * pace;
      game.dist += speed * dt;
      place(game.hero, game.bx, game.gy - S + Math.sin(game.t * 18) * 1.5);
      $('#street').style.backgroundPositionX = -(game.dist % 80) + 'px';
      if ((game.nextHouse -= dt) <= 0){
        const hs = Math.min(S * 2, game.H * .48), x = game.W + 20;
        game.items.push({ kind: 'house', s: hs, x, y: game.gy - S * .3 - hs, el: sprite(drawPic('_house' + Math.floor(Math.random() * 4)), hs, 'house') });
        game.items.push({ kind: 'box', s: S * .72, x: x + hs * .7, y: game.gy - S * .78, el: sprite(drawPic('_mailbox'), S * .72, 'mbox') });
        game.nextHouse = (2.1 + Math.random() * 1.1) / pace;
      }
      for (const it of game.items){
        if (it.dead) continue;
        if (it.kind === 'pkg'){
          it.t += dt / .55;
          const k = Math.min(1, it.t);
          if (it.target){
            const tx = it.target.x + it.target.s * .28, ty = it.target.y + it.target.s * .05;
            it.x = it.x0 + (tx - it.x0) * k; it.y = it.y0 + (ty - it.y0) * k - Math.sin(k * Math.PI) * S * 1.1;
            place(it.el, it.x, it.y, k * 360);
            if (it.t >= 1){ it.dead = true; it.el.remove(); it.target.el.classList.add('done'); bonusStar(); confetti(it.target.el, 8); }
          } else {                                     // nothing in reach: the parcel just bounces off the road
            it.x += speed * .35 * dt;
            it.y = it.y0 - Math.sin(k * Math.PI) * S * .9 + (it.t > 1 ? (it.t - 1) * S * 4 : 0);
            place(it.el, it.x, it.y, it.t * 300);
            if (it.y > game.H + 20) it.dead = true;
          }
          continue;
        }
        it.x -= speed * dt; place(it.el, it.x, it.y);
        if (it.kind === 'box') it.el.classList.toggle('ready', !it.got && this.inReach(it));
        if (it.x < -it.s - 30) it.dead = true;
      }
    },
  },

  /* ---------- MOTOKROS: drž = rychle (na rampu), pusť = pomalu (do louže) ---------- */
  cross: {
    setup(){
      $('#world').innerHTML = skyHTML + '<div class="ground dirt" id="ground"></div>';
      game.size = Math.max(60, Math.min(game.H * .24, game.W * .2));
      game.gy = game.H * .8; game.bx = game.W * .18;
      game.y = 0; game.vy = 0; game.v = game.W * .22; game.dist = 0; game.holding = false;
      game.nextOb = 1.6; game.nextKind = 'ramp';
      game.hero = sprite(drawPic('_moto'), game.size, 'hero');
    },
    tap(){ game.holding = true; },
    release(){ game.holding = false; },
    update(dt){
      const W = game.W, H = game.H, S = game.size;
      const target = game.holding || game.ptrDown ? W * .62 : W * .2;
      game.v += (target - game.v) * Math.min(1, dt * 2.5);
      game.dist += game.v * dt;
      if (game.y > 0 || game.vy > 0){ game.vy -= H * 3 * dt; game.y += game.vy * dt; if (game.y <= 0){ game.y = 0; game.vy = 0; } }
      const fast = game.v > W * .42;
      place(game.hero, game.bx, game.gy - S - game.y + (game.y ? 0 : Math.sin(game.t * 20) * (fast ? 2 : 1)), game.y > 0 ? Math.max(-28, -game.vy / H * 14) : (fast ? -4 : 0));
      $('#ground').style.backgroundPositionX = -(game.dist % 40) + 'px';
      if ((game.nextOb -= dt * game.v / (W * .3)) <= 0){
        const x = W + 20;
        if (game.nextKind === 'ramp'){
          const s = S * 1.15;
          game.items.push({ kind: 'ramp', s, x, y: game.gy - s * .96, el: sprite(drawPic('_ramp'), s) });
          for (let i = 0; i < 3; i++) game.items.push({ kind: 'star', s: S * .45, x: x + s + S * .7 * i, y: game.gy - S * (2.3 + .25 * Math.sin(i * 1.6)), el: sprite(STAR, S * .45, 'star') });
        } else {
          const s = S * 1.3;
          game.items.push({ kind: 'puddle', s, x, y: game.gy - s * .86, el: sprite(drawPic('_puddle'), s) });
        }
        game.nextKind = Math.random() < .5 ? 'ramp' : 'puddle';
        game.nextOb = 1.5 + Math.random() * 1.2;
      }
      const top = game.gy - S - game.y;
      for (const it of game.items){
        if (it.dead) continue;
        it.x -= game.v * dt; place(it.el, it.x, it.y);
        if (it.x < -it.s - 30){ it.dead = true; continue; }
        if (it.kind === 'ramp' && !it.used && game.y === 0 && it.x + it.s * .92 < game.bx + S * .7){
          it.used = true; game.vy = H * (fast ? 1.95 : 1.05);
          tone(fast ? [400, 600, 900] : [400, 500], .07, 'triangle', .07);
        }
        if (it.kind === 'puddle' && !it.used && game.y === 0 && it.x + it.s * .5 < game.bx + S * .55){
          it.used = true;
          if (fast){ splash(game.hero); bump(game.hero); }        // too fast: everything gets splashed
          else { bonusStar(); confetti(it.el, 6); }               // nice and slow: a star
        }
        if (it.kind === 'star' && it.x + it.s * .2 < game.bx + S * .8 && it.x + it.s * .8 > game.bx + S * .2 && it.y + it.s * .8 > top && it.y + it.s * .2 < top + S) catchStar(it);
      }
    },
  },

  /* ---------- TUNEL: prstem nahoru a dolů, vyhni se kamenům ---------- */
  tunnel: {
    setup(){
      $('#world').innerHTML = '<div class="cave-top" id="cave-top"></div><div class="cave-bot" id="cave-bot"></div>';
      game.size = Math.max(50, Math.min(game.H * .17, game.W * .16));
      game.bx = game.W * .14; game.by = game.H * .5; game.ptrY = null; game.dist = 0;
      game.nextOb = 1.3; game.nextSt = .6; game.fromTop = Math.random() < .5;
      game.hero = sprite(drawPic('_moto'), game.size, 'hero');
    },
    tap(){},
    update(dt, pace){
      const W = game.W, H = game.H, S = game.size, top = H * .1, bot = H * .9;
      const speed = (W * .26 + H * .1) * pace;
      game.dist += speed * dt;
      let ty = game.ptrY == null ? H * .5 : game.ptrY * H;
      ty = Math.max(top + S * .5, Math.min(bot - S * .5, ty));
      const prev = game.by;
      game.by += (ty - game.by) * Math.min(1, dt * 8);
      const tilt = Math.max(-20, Math.min(20, (game.by - prev) / Math.max(dt, .001) / H * 10));
      place(game.hero, game.bx, game.by - S * .55, tilt);
      $('#cave-top').style.backgroundPositionX = $('#cave-bot').style.backgroundPositionX = -(game.dist % 60) + 'px';
      if ((game.nextOb -= dt) <= 0){
        const room = bot - top, L = Math.min(room - S * 2.3, room * (.3 + Math.random() * .25));
        const w = S * (.9 + Math.random() * .4), fromTop = game.fromTop;
        const el = document.createElement('div');
        el.className = 'spr rock'; el.style.width = w + 'px'; el.style.height = L + 'px';
        el.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${fromTop ? '0,0 100,0 52,100' : '48,0 100,100 0,100'}" fill="#8E86AE" stroke="#2E2A47" stroke-width="4" vector-effect="non-scaling-stroke"/><polygon points="${fromTop ? '20,0 45,0 40,55' : '45,30 55,100 30,100'}" fill="#A9A3C6"/></svg>`;
        $('#world').appendChild(el);
        game.items.push({ kind: 'rock', x: W + 10, y: fromTop ? top : bot - L, w, h: L, top: fromTop, el, s: w });
        game.fromTop = Math.random() < .5 ? !fromTop : fromTop;
        game.nextOb = (1.15 + Math.random() * .6) / pace;
      }
      if ((game.nextSt -= dt) <= 0){
        const s = S * .45;
        game.items.push({ kind: 'star', s, x: W + 10, y: top + S * .4 + Math.random() * (bot - top - S * 1.3), el: sprite(STAR, s, 'star') });
        game.nextSt = (.9 + Math.random() * .7) / pace;
      }
      const hx1 = game.bx + S * .2, hx2 = game.bx + S * .8, hy1 = game.by - S * .35, hy2 = game.by + S * .3;
      for (const it of game.items){
        if (it.dead) continue;
        it.x -= speed * dt; place(it.el, it.x, it.y);
        if (it.x < -(it.w || it.s) - 30){ it.dead = true; continue; }
        if (it.kind === 'star'){
          if (it.x + it.s * .2 < hx2 && it.x + it.s * .8 > hx1 && it.y + it.s * .8 > hy1 && it.y + it.s * .2 < hy2) catchStar(it);
        } else if (!it.hit){
          const rx1 = it.x + it.w * .28, rx2 = it.x + it.w * .72;
          const ry1 = it.top ? it.y : it.y + it.h * .2, ry2 = it.top ? it.y + it.h * .8 : it.y + it.h;
          if (rx1 < hx2 && rx2 > hx1 && ry1 < hy2 && ry2 > hy1){ it.hit = true; bump(game.hero); }
        }
      }
    },
  },
});
