/* =====================================================================
   ILUSTRACE – vlastní kreslené obrázky v jednom dětském stylu.
   Každý obrázek je funkce, která vrací SVG (plátno 200 × 200).
   ===================================================================== */
(function(){
const INK = '#2E2A47';
const SKIN = '#FFD9BC', SKIN2 = '#F3B994', BLUSH = '#FF9DB0';
const HL = '#FF3D8B';

/* ---------- helpers ---------- */
const C = (cx, cy, r, f, x = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${x}/>`;
const E = (cx, cy, rx, ry, f, x = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${x}/>`;
const P = (d, f = 'none', x = '') => `<path d="${d}" fill="${f}" ${x}/>`;
const R = (x, y, w, h, rx, f, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${extra}/>`;
const G = (t, inner, x = '') => `<g transform="${t}" ${x}>${inner}</g>`;
const NS = 'stroke="none"';
// limb = thick outlined stroke (arm, leg, handle)
const limb = (d, col, w = 13) => P(d, 'none', `stroke-width="${w + 9}"`) + P(d, 'none', `stroke="${col}" stroke-width="${w}"`);
// highlight ring (pink dashed) – marks the body part the word means
const ring = (cx, cy, rx, ry) => E(cx, cy, rx, ry, 'rgba(255,255,255,.55)', `stroke="${HL}" stroke-width="5" stroke-dasharray="11 8"`);
const glowLine = d => P(d, 'none', `stroke="${HL}" stroke-opacity=".6" stroke-width="34"`);
const eye = (x, y, s = 1) => E(x, y, 4.6 * s, 6 * s, INK, NS) + C(x + 1.6 * s, y - 2.2 * s, 1.7 * s, '#fff', NS);
const cheeks = (x1, x2, y, r = 7) => E(x1, y, r, r * .7, BLUSH, NS + ' opacity=".75"') + E(x2, y, r, r * .7, BLUSH, NS + ' opacity=".75"');
const smile = (x, y, w = 12) => P(`M${x - w},${y} Q${x},${y + w * .9} ${x + w},${y}`, 'none', 'stroke-width="4.5"');
const sparkle = (x, y, s = 1, col = '#FFD23F') => G(`translate(${x} ${y}) scale(${s})`, P('M0,-12 Q2,-2 12,0 Q2,2 0,12 Q-2,2 -12,0 Q-2,-2 0,-12Z', col, 'stroke-width="3"'));
const star = (cx, cy, Ro, Ri, n = 5) => {
  let d = '';
  for (let i = 0; i < n * 2; i++){
    const a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? Ri : Ro;
    d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
};
const arrow = (x, y, dir, col) => {           // chunky arrow, dir: 1 = up, -1 = down
  const s = dir;
  return P(`M${x},${y - 36 * s} L${x + 26},${y - 6 * s} L${x + 11},${y - 6 * s} L${x + 11},${y + 34 * s} L${x - 11},${y + 34 * s} L${x - 11},${y - 6 * s} L${x - 26},${y - 6 * s}Z`, col);
};

/* ---------- people ---------- */
// full-body child; opts: shirt, pants, hair, pose ('down' | 'up' | 'wave'), hl (part to highlight), cap
function kid(o = {}){
  const shirt = o.shirt || '#4DA3FF', pants = o.pants || '#3F4C9A', hair = o.hair || '#7A4A2A';
  const up = o.pose === 'up';
  const armL = up ? 'M82,92 L60,52' : 'M82,92 L64,128';
  const armR = up ? 'M118,92 L140,52' : (o.pose === 'wave' ? 'M118,92 L144,60' : 'M118,92 L136,128');
  const hL = up ? [60, 52] : [64, 128], hR = up ? [140, 52] : (o.pose === 'wave' ? [144, 60] : [136, 128]);
  let s = '';
  if (o.hl === 'head') s += ring(100, 52, 38, 38);
  if (o.hl === 'leg') s += glowLine('M91,130 L89,166') + glowLine('M109,130 L111,166');
  if (o.hl === 'arm') s += glowLine(armR);
  s += limb('M91,130 L89,166', pants, 14) + limb('M109,130 L111,166', pants, 14);
  s += E(86, 172, 13, 7, '#E8505B') + E(114, 172, 13, 7, '#E8505B');
  s += R(76, 80, 48, 56, 18, shirt);
  s += P('M90,82 Q100,92 110,82', 'none', 'stroke-width="4"');
  s += limb(armL, shirt, 13) + limb(armR, shirt, 13);
  s += C(hL[0], hL[1], 8, SKIN) + C(hR[0], hR[1], 8, SKIN);
  s += C(100, 52, 27, SKIN);
  s += o.cap
    ? P('M73,48 Q74,22 100,22 Q126,22 127,48Z', o.cap) + P('M120,44 Q146,44 150,52 L118,50Z', o.cap)
    : P('M73,52 Q72,22 100,22 Q128,22 127,52 Q118,36 100,38 Q84,36 73,52Z', hair);
  s += eye(91, 56) + eye(109, 56) + cheeks(84, 116, 66, 5) + smile(100, 64, 8);
  if (o.hl === 'shoulders') s += ring(80, 88, 13, 13) + ring(120, 88, 13, 13);
  if (o.hl === 'knee') s += ring(90, 150, 12, 12) + ring(110, 150, 12, 12);
  return s;
}

// head-and-shoulders portrait; opts: shirt, hair (fn back/front), kid (smaller), extra
function bust(o = {}){
  let s = '';
  s += o.back || '';
  s += P('M28,204 Q30,150 100,144 Q170,150 172,204Z', o.shirt || '#6BC4A6');
  s += o.collar || '';
  s += R(88, 120, 24, 28, 8, SKIN);
  s += C(58, 94, 10, SKIN) + C(142, 94, 10, SKIN);
  s += C(100, 90, 42, SKIN);
  s += o.front || '';
  s += eye(85, 92) + eye(115, 92) + cheeks(76, 124, 106);
  s += o.mouth || smile(100, 108, 11);
  s += o.extra || '';
  return o.kid ? G('translate(100 204) scale(.84) translate(-100 -204)', s) : s;
}
const glasses = C(85, 92, 12, 'rgba(255,255,255,.35)', 'stroke-width="4"') + C(115, 92, 12, 'rgba(255,255,255,.35)', 'stroke-width="4"') + P('M97,92 L103,92', 'none', 'stroke-width="4"');

// big face close-up; hl: eyes | ears | nose | mouth | face
function bigFace(o = {}){
  let s = '';
  s += C(38, 112, 15, SKIN) + C(162, 112, 15, SKIN);
  s += C(100, 110, 62, SKIN);
  s += P('M40,104 Q40,44 100,44 Q160,44 160,104 Q146,74 112,76 Q100,62 86,78 Q58,74 40,104Z', '#7A4A2A');
  if (o.hl === 'face') s = ring(100, 110, 82, 78) + s;
  if (o.hl === 'ears') s += ring(36, 112, 21, 23) + ring(164, 112, 21, 23);
  if (o.hl === 'eyes') s += ring(100, 102, 44, 20);
  if (o.hl === 'nose') s += ring(100, 122, 17, 15);
  if (o.hl === 'mouth') s += ring(100, 150, 32, 24);
  if (o.hl === 'chin') s += ring(100, 170, 30, 14);
  s += o.eyes || (eye(80, 102, 1.4) + eye(120, 102, 1.4));
  s += E(100, 122, 7, 5, SKIN2);
  s += cheeks(68, 132, 130, 9);
  s += o.mouth || P('M84,140 Q100,160 116,140Z', '#D2405A', 'stroke-width="4.5"');
  return s + (o.extra || '');
}

// round emotion face
function moodFace(kind){
  let s = C(100, 104, 66, '#FFD866');
  if (kind === 'happy'){
    s += P('M68,96 Q78,84 88,96', 'none') + P('M112,96 Q122,84 132,96', 'none');
    s += P('M70,116 Q100,156 130,116Z', '#D2405A') + P('M86,136 Q100,146 114,136', '#FF8FA3', NS);
    s += cheeks(62, 138, 116, 9) + sparkle(30, 40, .9) + sparkle(172, 54, .7) + sparkle(168, 160, .6);
  } else if (kind === 'sad'){
    s += P('M64,82 L86,90', 'none') + P('M136,82 L114,90', 'none');
    s += eye(78, 102, 1.3) + eye(122, 102, 1.3);
    s += P('M78,142 Q100,122 122,142', 'none', 'stroke-width="5"');
    s += P('M130,112 Q122,128 130,134 Q138,128 130,112Z', '#6EC3FF', 'stroke-width="3.5"');
  } else { // tired
    s += P('M66,100 Q78,108 90,100', 'none') + P('M110,100 Q122,108 134,100', 'none');
    s += E(100, 136, 10, 12, '#B53450');
    s += P('M138,40 L156,40 L138,58 L156,58', 'none', 'stroke-width="4.5"') + P('M162,18 L174,18 L162,30 L174,30', 'none', 'stroke-width="4"');
    s += cheeks(66, 134, 120, 8);
  }
  return s;
}

/* ---------- hands ---------- */
const pointHand = (sleeve = '#4DA3FF') =>
  R(18, 84, 36, 46, 10, sleeve) +
  R(48, 80, 58, 54, 20, SKIN) +
  R(92, 84, 72, 20, 10, SKIN) +
  E(78, 80, 20, 10, SKIN) +
  P('M70,110 L100,110 M70,122 L98,122', 'none', 'stroke-width="3.5"');

/* ---------- animals ---------- */
const A = {
  dog(){
    return E(100, 172, 44, 26, '#E8B77D') +
      E(100, 98, 54, 50, '#E8B77D') +
      E(78, 92, 16, 18, '#C98B55', NS) +
      G('rotate(18 50 100)', E(50, 100, 18, 38, '#8B5A3C')) + G('rotate(-18 150 100)', E(150, 100, 18, 38, '#8B5A3C')) +
      E(100, 124, 28, 21, '#FFF1DC') +
      eye(80, 92) + eye(120, 92) +
      E(100, 112, 10, 7, INK) +
      P('M100,118 L100,126 M88,128 Q100,138 112,128', 'none', 'stroke-width="4"') +
      P('M94,132 Q100,148 106,132Z', '#FF7A93', 'stroke-width="3.5"') + cheeks(70, 130, 114);
  },
  cat(){
    return E(100, 172, 42, 26, '#FFA04D') +
      P('M52,80 L58,26 L94,56Z', '#FFA04D') + P('M148,80 L142,26 L106,56Z', '#FFA04D') +
      P('M62,64 L64,40 L82,56Z', '#FFB5C2', NS) + P('M138,64 L136,40 L118,56Z', '#FFB5C2', NS) +
      E(100, 102, 60, 52, '#FFA04D') +
      P('M90,54 L92,68 M100,52 L100,68 M110,54 L108,68', 'none', 'stroke="#D9772A" stroke-width="5"') +
      eye(78, 98, 1.15) + eye(122, 98, 1.15) +
      P('M93,112 L107,112 L100,120Z', '#FF7A93', 'stroke-width="3.5"') +
      P('M100,120 Q92,130 84,124 M100,120 Q108,130 116,124', 'none', 'stroke-width="4"') +
      P('M40,110 L66,114 M40,124 L66,120 M160,110 L134,114 M160,124 L134,120', 'none', 'stroke-width="3"') + cheeks(66, 134, 116);
  },
  cow(){
    return P('M54,58 Q36,40 44,24 Q56,40 70,50Z', '#FFF3D6') + P('M146,58 Q164,40 156,24 Q144,40 130,50Z', '#FFF3D6') +
      E(44, 76, 20, 11, '#fff') + E(156, 76, 20, 11, '#fff') +
      R(56, 46, 88, 112, 40, '#fff') +
      P('M60,70 Q72,56 92,64 Q90,84 70,90 Q58,86 60,70Z', INK, NS) + P('M118,52 Q138,50 140,70 Q126,74 116,64Z', INK, NS) +
      eye(82, 98) + eye(118, 98) +
      E(100, 136, 42, 28, '#FFB3C1') + E(86, 136, 6, 8, '#D46A82', NS) + E(114, 136, 6, 8, '#D46A82', NS) +
      P('M88,152 Q100,160 112,152', 'none', 'stroke-width="4"');
  },
  pig(){
    return P('M52,72 L52,36 L86,56Z', '#FFA8BE') + P('M148,72 L148,36 L114,56Z', '#FFA8BE') +
      C(100, 106, 60, '#FFB8CA') +
      eye(78, 92) + eye(122, 92) +
      E(100, 120, 26, 18, '#FF8FAB') + E(91, 120, 5, 7, '#C2486A', NS) + E(109, 120, 5, 7, '#C2486A', NS) +
      smile(100, 146, 10) + cheeks(64, 136, 116, 8);
  },
  horse(){
    return P('M66,56 L70,22 L88,44Z', '#B5713F') + P('M134,56 L130,22 L112,44Z', '#B5713F') +
      E(100, 100, 44, 64, '#B5713F') +
      P('M84,40 Q100,20 116,40 Q110,58 100,62 Q92,58 84,40Z', '#5A3420') +
      P('M124,46 Q148,70 140,120 Q132,90 120,70Z', '#5A3420') +
      E(100, 142, 34, 26, '#E3B48A') +
      eye(82, 90) + eye(118, 90) +
      E(88, 140, 5, 7, INK, NS) + E(112, 140, 5, 7, INK, NS) + smile(100, 152, 10);
  },
  sheep(){
    let s = '';
    [[56,70],[84,52],[116,52],[144,70],[152,104],[140,136],[110,150],[80,150],[56,134],[46,102]].forEach(([x,y]) => s += C(x, y, 24, '#fff'));
    s += C(100, 100, 50, '#fff', NS);
    return R(78, 150, 14, 34, 7, '#4A3F55') + R(108, 150, 14, 34, 7, '#4A3F55') + s +
      E(66, 98, 16, 8, '#4A3F55') + E(134, 98, 16, 8, '#4A3F55') +
      E(100, 106, 28, 34, '#4A3F55') +
      C(88, 100, 6, '#fff', NS) + C(112, 100, 6, '#fff', NS) + C(89, 101, 3, INK, NS) + C(113, 101, 3, INK, NS) +
      P('M92,124 Q100,130 108,124', 'none', 'stroke="#fff" stroke-width="3.5"') +
      C(92, 70, 10, '#fff') + C(108, 68, 11, '#fff');
  },
  duck(){
    return E(100, 182, 70, 10, '#8FD3FF', NS) +
      P('M84,170 L76,182 L96,182Z M118,170 L112,182 L132,182Z', '#FF9A3D') +
      P('M44,126 Q46,170 110,172 Q166,170 168,128 Q172,100 150,108 Q130,116 104,108 Q70,100 44,126Z', '#FFD84D') +
      P('M96,128 Q120,116 142,132 Q122,152 96,128Z', '#FFC21F') +
      C(80, 76, 32, '#FFD84D') +
      P('M50,80 Q26,82 30,92 Q44,98 58,90Z', '#FF9A3D') +
      eye(78, 70) + E(96, 86, 6, 4, BLUSH, NS + ' opacity=".75"') +
      P('M106,52 Q112,38 100,40', 'none', 'stroke-width="4"');
  },
  hen(){
    return P('M84,166 L84,186 M76,186 L92,186 M116,166 L116,186 M108,186 L124,186', 'none', 'stroke="#F2A93B" stroke-width="5"') +
      P('M150,70 Q186,60 176,100 Q192,110 170,128 Z', '#C2552E') +
      E(110, 122, 58, 48, '#FFF4E0') +
      P('M92,118 Q118,104 144,124 Q120,150 92,118Z', '#F2DEC0') +
      P('M62,40 Q64,24 74,34 Q80,20 88,34 Q98,26 96,46Z', '#E8434A') +
      C(76, 70, 28, '#FFF4E0') +
      P('M46,68 L32,76 L48,82Z', '#FFB52E') +
      P('M50,84 Q44,100 56,98 Q60,90 56,84Z', '#E8434A', 'stroke-width="3.5"') +
      eye(74, 64) + E(88, 78, 6, 4, BLUSH, NS + ' opacity=".75"');
  },
  monkey(){
    return E(100, 176, 40, 24, '#9A6340') +
      C(44, 100, 20, '#9A6340') + C(156, 100, 20, '#9A6340') + C(44, 100, 11, '#F2C9A0', NS) + C(156, 100, 11, '#F2C9A0', NS) +
      C(100, 100, 54, '#9A6340') +
      P('M100,84 Q128,62 142,92 Q150,130 100,150 Q50,130 58,92 Q72,62 100,84Z', '#F2C9A0') +
      P('M92,48 Q100,34 108,48', 'none', 'stroke-width="4.5"') +
      eye(82, 96) + eye(118, 96) +
      E(94, 116, 2.5, 3.5, INK, NS) + E(106, 116, 2.5, 3.5, INK, NS) +
      P('M80,126 Q100,144 120,126', 'none', 'stroke-width="4.5"') + cheeks(72, 128, 116);
  },
  teddy(){
    return C(64, 44, 17, '#C58A55') + C(136, 44, 17, '#C58A55') + C(64, 44, 8, '#E8BD8E', NS) + C(136, 44, 8, '#E8BD8E', NS) +
      E(48, 132, 16, 26, '#C58A55', 'transform="rotate(25 48 132)"') + E(152, 132, 16, 26, '#C58A55', 'transform="rotate(-25 152 132)"') +
      C(76, 174, 20, '#C58A55') + C(124, 174, 20, '#C58A55') + C(76, 176, 9, '#E8BD8E', NS) + C(124, 176, 9, '#E8BD8E', NS) +
      E(100, 140, 42, 40, '#C58A55') + E(100, 146, 24, 24, '#E8BD8E', NS) +
      C(100, 72, 40, '#C58A55') + E(100, 86, 18, 13, '#E8BD8E') +
      E(100, 80, 7, 5, INK) + smile(100, 89, 6) +
      eye(84, 66) + eye(116, 66) +
      P('M100,108 L80,98 L80,120Z M100,108 L120,98 L120,120Z', '#E8434A', 'stroke-width="4"') + C(100, 108, 6, '#E8434A', 'stroke-width="4"');
  },
};

/* ---------- objects ---------- */
const O = {
  apple(){
    return P('M100,64 C70,40 34,60 38,104 C42,150 76,176 100,164 C124,176 158,150 162,104 C166,60 130,40 100,64Z', '#FF5A4E') +
      P('M100,64 Q98,46 106,30', 'none', 'stroke="#7A4A2A" stroke-width="7"') +
      P('M106,48 Q128,26 150,38 Q128,60 106,48Z', '#5CCB6A') +
      E(66, 96, 9, 17, '#fff', NS + ' opacity=".6" transform="rotate(20 66 96)"');
  },
  banana(){
    return P('M44,58 Q42,150 150,156 Q174,156 168,142 Q86,134 70,56 Q66,44 54,46 Q44,48 44,58Z', '#FFE04D') +
      P('M58,60 Q66,130 150,146', 'none', 'stroke="#E6B82E" stroke-width="4"') +
      R(44, 38, 14, 14, 4, '#8B5A3C') + E(166, 150, 5, 5, '#8B5A3C', NS);
  },
  potato(){
    return P('M44,104 C40,66 86,52 120,60 C158,68 170,98 160,126 C150,156 104,164 74,154 C50,146 46,126 44,104Z', '#D9A867') +
      E(78, 92, 5, 3, '#A9763A', NS) + E(120, 80, 4, 3, '#A9763A', NS) + E(132, 124, 5, 3, '#A9763A', NS) + E(92, 134, 4, 3, '#A9763A', NS) +
      E(70, 120, 10, 16, '#fff', NS + ' opacity=".35"');
  },
  ball(){                                   // football: white ball with black patches
    const cx = 100, cy = 104, R = 64;
    const pent = (x, y, r, rot) => {
      let d = '';
      for (let i = 0; i < 5; i++){ const a = (rot - 90 + i * 72) * Math.PI / 180; d += (i ? 'L' : 'M') + (x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1); }
      return d + 'Z';
    };
    let seams = '', outer = '';
    for (let i = 0; i < 5; i++){
      const va = (-90 + i * 72) * Math.PI / 180, ea = (-54 + i * 72) * Math.PI / 180;
      seams += `M${(cx + 21 * Math.cos(va)).toFixed(1)},${(cy + 21 * Math.sin(va)).toFixed(1)} L${(cx + 40 * Math.cos(va)).toFixed(1)},${(cy + 40 * Math.sin(va)).toFixed(1)} `;
      outer += P(pent(cx + 58 * Math.cos(ea), cy + 58 * Math.sin(ea), 19, i * 72 + 36 + 180), INK, NS);
    }
    return `<clipPath id="footballClip"><circle cx="${cx}" cy="${cy}" r="${R - 1}"/></clipPath>` +
      C(cx, cy, R, '#fff', NS) +
      `<g clip-path="url(#footballClip)">` + outer + P(seams, 'none', 'stroke-width="3.5"') + `</g>` +
      P(pent(cx, cy, 22, 0), INK) +
      C(cx, cy, R, 'none') +
      E(74, 70, 11, 6, '#fff', NS + ' opacity=".8" transform="rotate(-35 74 70)"') +
      E(100, 176, 46, 6, '#000', NS + ' opacity=".08"');
  },
  rainbow(){
    const cols = ['#FF5A4E', '#FFA63D', '#FFE04D', '#5CCB6A', '#4DA3FF', '#8C6CF0'];
    let s = '';
    cols.forEach((c, i) => {
      const r1 = 84 - i * 11, r2 = r1 - 11;
      s += P(`M${100 - r1},146 A${r1},${r1} 0 0 1 ${100 + r1},146 L${100 + r2},146 A${r2},${r2} 0 0 0 ${100 - r2},146Z`, c, 'stroke-width="3.5"');
    });
    const cloud = x => C(x - 16, 150, 16, '#fff') + C(x + 14, 150, 18, '#fff') + C(x, 140, 20, '#fff') + E(x, 160, 30, 10, '#fff', NS);
    return s + cloud(30) + cloud(170);
  },
  car(){
    return P('M24,138 L24,112 Q24,100 38,98 L60,96 L78,64 Q82,58 92,58 L132,58 Q142,58 146,66 L162,96 L170,98 Q178,102 178,114 L178,138Z', '#FF5A4E') +
      P('M86,70 L72,94 L110,94 L110,70Z', '#BDE7FF', 'stroke-width="4"') + P('M120,70 L120,94 L152,94 L140,70Z', '#BDE7FF', 'stroke-width="4"') +
      P('M114,100 L114,132', 'none', 'stroke-width="4"') + R(122, 106, 12, 5, 2.5, INK, NS) +
      C(172, 112, 6, '#FFE04D', 'stroke-width="3.5"') +
      C(62, 140, 20, '#3B3550') + C(62, 140, 8, '#C9C6D9', NS) + C(144, 140, 20, '#3B3550') + C(144, 140, 8, '#C9C6D9', NS);
  },
  pencil(){
    return G('rotate(-35 100 100)',
      R(44, 82, 96, 36, 4, '#FFC93C') + P('M44,94 L140,94 M44,106 L140,106', 'none', 'stroke="#E6A817" stroke-width="3"') +
      P('M140,82 L178,100 L140,118Z', '#F5D3A6') + P('M166,94 L178,100 L166,106Z', INK) +
      R(30, 82, 18, 36, 3, '#C9C6D9') + R(10, 82, 24, 36, 10, '#FF8FA3'));
  },
  school(){
    return E(100, 182, 84, 8, '#8EDB8A', NS) +
      R(34, 92, 132, 90, 6, '#FF9A6B') +
      P('M22,96 L100,40 L178,96Z', '#C2412D') +
      P('M100,40 L100,12', 'none', 'stroke-width="4"') + P('M100,12 L124,20 L100,28Z', '#5CCB6A', 'stroke-width="3.5"') +
      C(100, 74, 12, '#fff', 'stroke-width="4"') + P('M100,74 L100,66 M100,74 L106,78', 'none', 'stroke-width="3"') +
      R(46, 108, 26, 24, 4, '#BDE7FF', 'stroke-width="4"') + R(128, 108, 26, 24, 4, '#BDE7FF', 'stroke-width="4"') +
      R(46, 144, 26, 22, 4, '#BDE7FF', 'stroke-width="4"') + R(128, 144, 26, 22, 4, '#BDE7FF', 'stroke-width="4"') +
      P('M84,182 L84,140 Q100,124 116,140 L116,182Z', '#8B5A3C');
  },
  stop(){
    return R(94, 150, 12, 44, 4, '#A3A0B8') +
      P('M161,108 L125,144 L75,144 L39,108 L39,58 L75,22 L125,22 L161,58Z', '#E8434A') +
      P('M152,104 L121,135 L79,135 L48,104 L48,62 L79,31 L121,31 L152,62Z', 'none', 'stroke="#fff" stroke-width="4"') +
      R(80, 82, 40, 36, 12, '#fff', 'stroke-width="3.5"') +
      R(80, 54, 9, 36, 4.5, '#fff', 'stroke-width="3.5"') + R(91, 48, 9, 40, 4.5, '#fff', 'stroke-width="3.5"') +
      R(102, 50, 9, 38, 4.5, '#fff', 'stroke-width="3.5"') + R(113, 58, 8, 32, 4, '#fff', 'stroke-width="3.5"') +
      E(74, 102, 7, 14, '#fff', 'stroke-width="3.5" transform="rotate(-30 74 102)"');
  },
  starBig(scale){
    const inner = P(star(100, 108, 70, 32), '#FFD23F') + eye(88, 104, 1.1) + eye(112, 104, 1.1) + smile(100, 118, 9) + cheeks(80, 120, 118, 6);
    return E(100, 186, 70 * scale + 10, 7, '#000', NS + ' opacity=".08"') +
      G(`translate(100 182) scale(${scale}) translate(-100 -182)`, inner, `stroke-width="${5 / scale}"`);
  },
  splat(col){
    let d = '';
    const pts = [];
    for (let i = 0; i < 16; i++){
      const a = i / 16 * Math.PI * 2, r = 58 + (i % 2 ? -10 : 8) + 6 * Math.sin(i * 1.7);
      pts.push([100 + r * Math.cos(a), 104 + r * Math.sin(a)]);
    }
    pts.forEach((p, i) => {
      const n = pts[(i + 1) % pts.length], mx = (p[0] + n[0]) / 2, my = (p[1] + n[1]) / 2;
      d += (i ? '' : `M${((pts[pts.length - 1][0] + p[0]) / 2).toFixed(1)},${((pts[pts.length - 1][1] + p[1]) / 2).toFixed(1)}`) + `Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
    });
    return P(d + 'Z', col) + C(36, 52, 9, col) + C(168, 46, 7, col) + C(160, 168, 10, col) + C(32, 160, 6, col) +
      E(80, 84, 12, 8, '#fff', NS + ' opacity=".45" transform="rotate(-30 80 84)"');
  },
  number(n){
    const cols = ['#FF5A4E', '#FFA63D', '#FFD23F', '#5CCB6A', '#4DA3FF', '#8C6CF0', '#FF7AB8', '#2FB3A8', '#C58A55', '#FF8A65'];
    let s = `<text x="100" y="86" text-anchor="middle" font-family="'Baloo 2', 'Arial Rounded MT Bold', sans-serif" font-weight="700" font-size="78" fill="${cols[n - 1]}" stroke-width="5" paint-order="stroke">${n}</text>`;
    const rows = n <= 5 ? [n] : [5, n - 5];
    rows.forEach((cnt, ri) => {
      const y = rows.length === 1 ? 140 : 124 + ri * 36;
      for (let i = 0; i < cnt; i++){
        const x = 100 + (i - (cnt - 1) / 2) * 34;
        s += C(x, y, 13, cols[(ri * 5 + i) % 10]);
      }
    });
    return s;
  },
  broom(){
    return P('M146,22 L92,128', 'none', 'stroke-width="17"') + P('M146,22 L92,128', 'none', 'stroke="#B5713F" stroke-width="9"') +
      P('M80,118 L114,134 L102,178 L46,154Z', '#FFD23F') +
      P('M62,160 L84,128 M78,166 L94,132 M92,172 L104,136', 'none', 'stroke="#D9A817" stroke-width="3.5"') +
      R(76, 114, 40, 14, 5, '#E8434A', 'transform="rotate(26 96 121)"') +
      P('M126,170 L176,170 L168,150 L132,150Z', '#4DA3FF') +
      C(140, 136, 5, '#C9C6D9', NS) + C(152, 140, 4, '#C9C6D9', NS) +
      sparkle(40, 60, .9) + sparkle(172, 96, .7);
  },
  toybox(){
    return E(100, 184, 80, 8, '#000', NS + ' opacity=".08"') +
      C(76, 92, 20, '#C58A55') + C(62, 76, 8, '#C58A55') + C(90, 76, 8, '#C58A55') + eye(70, 90, .7) + eye(82, 90, .7) +
      C(124, 96, 18, '#FF6B5B') + P('M108,92 Q124,100 140,92', 'none', 'stroke="#fff" stroke-width="5"') +
      R(140, 78, 24, 24, 4, '#5CCB6A', 'transform="rotate(12 152 90)"') +
      R(36, 104, 128, 76, 10, '#4DA3FF') + R(36, 104, 128, 18, 8, '#3A86D9') +
      P(star(100, 148, 16, 7), '#FFD23F', 'stroke-width="3.5"') +
      sparkle(30, 50, .9) + sparkle(174, 44, .8) + sparkle(178, 150, .6);
  },
  megaphoneKid(){
    return bigFace({
      eyes: P('M66,98 L84,104 L66,110', 'none') + P('M134,98 L116,104 L134,110', 'none'),
      mouth: E(100, 148, 20, 18, '#B53450', 'stroke-width="4.5"') + E(100, 156, 11, 6, '#FF8FA3', NS),
    }) + P('M170,96 Q182,110 170,124 M178,84 Q198,110 178,136', 'none', 'stroke="#FF3D8B" stroke-width="5"') +
      P('M30,96 Q18,110 30,124 M22,84 Q2,110 22,136', 'none', 'stroke="#FF3D8B" stroke-width="5"');
  },
};

/* ---------- word → picture ---------- */
const kidS = (shirt, pants, extra = {}) => kid({ shirt, pants, ...extra });
const PICS = {
  // lekce 1
  'teddy bear': A.teddy,
  'monkey': A.monkey,
  'face': () => bigFace({ hl: 'face' }),
  'eyes': () => bigFace({ hl: 'eyes' }),
  'ears': () => bigFace({ hl: 'ears' }),
  'nose': () => bigFace({ hl: 'nose' }),
  'mouth': () => bigFace({ hl: 'mouth' }),
  'up': () => G('translate(30 0)', arrow(100, 110, 1, '#5CCB6A')) + P('M58,110 Q50,140 62,176', 'none', 'stroke-width="3"') + E(58, 82, 24, 30, '#FF5A4E') + P('M54,112 L62,112 L58,106Z', '#FF5A4E', 'stroke-width="3"') + E(50, 70, 5, 9, '#fff', NS + ' opacity=".6"'),
  'down': () => G('translate(-28 0)', arrow(100, 96, -1, '#FFA63D')) + C(142, 158, 24, '#4DA3FF') + P('M130,112 L130,124 M144,104 L144,120 M156,112 L156,124', 'none', 'stroke-width="4"') + E(178, 184, 34, 5, '#000', NS + ' opacity=".1"'),
  'rainbow': O.rainbow,
  'ball': O.ball,
  // lekce 2
  'smile': () => moodFace('happy').replace(/<path d="M68,96[^>]*\/>|<path d="M112,96[^>]*\/>/g, '') + eye(80, 92, 1.3) + eye(120, 92, 1.3),
  'friend': () => G('translate(-38 18) scale(.74)', bust({ shirt: '#FF8A65', front: P('M58,84 Q58,44 100,44 Q142,44 142,84 Q130,64 100,66 Q72,64 58,84Z', '#3D2A1E') })) +
                  G('translate(90 18) scale(.74)', bust({ shirt: '#8C6CF0', back: C(56, 92, 16, '#E0A030') + C(144, 92, 16, '#E0A030'), front: P('M58,88 Q56,44 100,44 Q144,44 142,88 Q126,60 100,64 Q74,60 58,88Z', '#E0A030') })) +
                  P('M100,40 C92,26 74,34 86,50 L100,62 L114,50 C126,34 108,26 100,40Z', '#FF5A7E', 'stroke-width="4"'),
  'apple': O.apple,
  'banana': O.banana,
  'potato': O.potato,
  'boy': () => kid({ shirt: '#5CCB6A', pants: '#3F4C9A', cap: '#E8434A', pose: 'wave' }),
  'car': O.car,
  'big': () => twoStars('big'),
  'small': () => twoStars('small'),
  'give': () => G('translate(-14 70) scale(.62)', kid({ shirt: '#FF8A65', pose: 'wave' })) +
     G('translate(90 70) scale(.62)', kid({ shirt: '#8C6CF0', hair: '#E0A030' })) +
     G('translate(76 34) scale(.24)', O.ball(), 'stroke-width="18"') +
     P('M58,80 Q100,30 142,80', 'none', 'stroke="#FF3D8B" stroke-width="5" stroke-dasharray="2 10"') + P('M132,70 L144,84 L150,66', 'none', 'stroke="#FF3D8B" stroke-width="5"'),
  'stop': O.stop,
  'choose': () => G('translate(8 92) scale(.48)', O.apple()) + G('translate(96 92) scale(.48)', O.banana()) +
     G('translate(60 128) scale(.8) translate(-106 -164) rotate(90 100 100)', pointHand('#8C6CF0')) +
     `<text x="160" y="56" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="700" font-size="46" fill="#FF3D8B" stroke-width="4" paint-order="stroke">?</text>`,
  'stand up': () => G('translate(-14 0)', kid({ shirt: '#FF8A65', pants: '#3F4C9A', pose: 'up' })) + G('translate(64 0) scale(.75) translate(30 30)', arrow(100, 100, 1, '#5CCB6A')),
  'sit down': () => R(56, 70, 88, 16, 6, '#B5713F') + R(60, 84, 12, 60, 4, '#B5713F') + R(128, 84, 12, 60, 4, '#B5713F') +
     R(48, 130, 104, 16, 6, '#C98B55') + R(54, 146, 10, 40, 4, '#B5713F') + R(136, 146, 10, 40, 4, '#B5713F') +
     G('translate(0 40)', limb('M90,90 L86,124', '#3F4C9A', 14) + limb('M110,90 L114,124', '#3F4C9A', 14) + E(84, 130, 12, 7, '#E8505B') + E(116, 130, 12, 7, '#E8505B') +
       R(76, 40, 48, 56, 18, '#FFC93C') + limb('M82,52 L72,86', '#FFC93C') + limb('M118,52 L128,86', '#FFC93C') + C(72, 86, 8, SKIN) + C(128, 86, 8, SKIN) +
       C(100, 12, 27, SKIN) + P('M73,12 Q72,-18 100,-18 Q128,-18 127,12 Q118,-4 100,-2 Q84,-4 73,12Z', '#7A4A2A') + eye(91, 16) + eye(109, 16) + cheeks(84, 116, 26, 5) + smile(100, 24, 8)) +
     G('translate(156 70) scale(.5) translate(-100 -100)', arrow(100, 100, -1, '#FFA63D')),
  'turn around': () => P('M40,150 A60,22 0 1 0 100,128', 'none', 'stroke="#FF3D8B" stroke-width="7"') + P('M92,120 L106,128 L92,138Z', '#FF3D8B', 'stroke="#FF3D8B" stroke-width="4"') +
     G('translate(100 180) scale(.86) translate(-100 -180)', kid({ shirt: '#2FB3A8', pants: '#3F4C9A', pose: 'wave' })) +
     P('M40,150 A60,22 0 0 0 160,150', 'none', 'stroke="#FF3D8B" stroke-width="7"'),
  // lekce 3
  'pencil': O.pencil,
  'happy': () => moodFace('happy'),
  'sad': () => moodFace('sad'),
  'tired': () => moodFace('tired'),
  'horse': A.horse, 'cow': A.cow, 'sheep': A.sheep, 'pig': A.pig,
  'duck': A.duck, 'dog': A.dog, 'cat': A.cat, 'hen': A.hen,
  // lekce 4
  'head': () => kid({ hl: 'head', shirt: '#8C6CF0' }),
  'arm': () => kid({ hl: 'arm', shirt: '#FF8A65', pose: 'wave' }),
  'leg': () => kid({ hl: 'leg', shirt: '#5CCB6A' }),
  'shoulders': () => kid({ hl: 'shoulders', shirt: '#4DA3FF' }),
  'knee': () => kid({ hl: 'knee', shirt: '#FFC93C' }),
  'toes': () => foot('toes'),
  'foot': () => foot('foot'),
  'point': () => G('translate(0 6)', pointHand('#8C6CF0')) + P('M176,80 L192,72 M178,96 L196,96 M176,112 L192,120', 'none', 'stroke="#FF3D8B" stroke-width="5"'),
  'tap': () => G('translate(100 150) scale(.85) translate(-106 -164) rotate(90 100 100)', pointHand('#2FB3A8')) + E(100, 176, 40, 12, '#E8434A') + P('M54,160 L42,150 M146,160 L158,150 M100,150 L100,150', 'none', 'stroke="#FF3D8B" stroke-width="5"'),
  'please': () => R(64, 150, 72, 44, 12, '#4DA3FF') +
     P('M100,36 Q80,38 74,78 L66,152 L100,152Z', SKIN) + P('M100,36 Q120,38 126,78 L134,152 L100,152Z', SKIN) +
     P('M100,40 L100,150', 'none', 'stroke-width="4"') + P('M86,70 L82,122 M114,70 L118,122', 'none', 'stroke-width="3" stroke-opacity=".5"') +
     P('M44,56 C36,42 18,50 30,66 L44,78 L58,66 C70,50 52,42 44,56Z', '#FF5A7E', 'stroke-width="4"') + sparkle(160, 50, .8),
  // lekce 5
  'mum': () => bust({ shirt: '#FF7AB8',
      back: P('M52,96 Q48,40 100,40 Q152,40 148,96 L156,160 Q132,166 122,146 L78,146 Q68,166 44,160Z', '#8B4A2A'),
      front: P('M58,90 Q62,50 100,48 Q138,50 142,90 Q120,64 100,72 Q78,62 58,90Z', '#8B4A2A'),
      mouth: P('M89,108 Q100,118 111,108', 'none', 'stroke="#D2405A" stroke-width="5"'),
      extra: C(58, 108, 4, '#FFD23F', 'stroke-width="2.5"') + C(142, 108, 4, '#FFD23F', 'stroke-width="2.5"') }),
  'dad': () => bust({ shirt: '#4DA3FF',
      collar: P('M84,146 L100,166 L116,146Z', '#fff', 'stroke-width="4"'),
      front: P('M58,84 Q58,46 100,46 Q142,46 142,84 Q132,62 100,64 Q70,62 58,84Z', '#3D2A1E'),
      mouth: P('M80,108 Q90,100 100,106 Q110,100 120,108 Q110,114 100,110 Q90,114 80,108Z', '#3D2A1E', 'stroke-width="3"') + smile(100, 116, 8) }),
  'sister': () => bust({ kid: true, shirt: '#B28CFF',
      back: C(48, 96, 18, '#E0A030') + C(152, 96, 18, '#E0A030'),
      front: P('M58,88 Q56,44 100,44 Q144,44 142,88 Q126,60 100,64 Q74,60 58,88Z', '#E0A030') + C(60, 78, 6, '#FF5A7E', 'stroke-width="3"') + C(140, 78, 6, '#FF5A7E', 'stroke-width="3"') }),
  'brother': () => bust({ kid: true, shirt: '#5CCB6A',
      collar: P('M44,176 L156,176 M36,192 L164,192', 'none', 'stroke="#fff" stroke-width="7"'),
      front: P('M58,86 L62,54 L74,62 L82,44 L94,56 L104,40 L114,56 L126,46 L130,62 L142,58 L142,86 Q126,64 100,68 Q74,64 58,86Z', '#E8743A') }),
  'baby': () => P('M24,204 Q28,146 100,140 Q172,146 176,204Z', '#BDE7FF') + C(66, 172, 5, '#fff', NS) + C(132, 180, 5, '#fff', NS) + C(100, 190, 5, '#fff', NS) +
      C(50, 92, 11, SKIN) + C(150, 92, 11, SKIN) + C(100, 90, 52, SKIN) +
      P('M100,40 Q90,26 102,22 Q114,26 106,34', 'none', 'stroke="#C98B55" stroke-width="5"') +
      eye(80, 88, 1.1) + eye(120, 88, 1.1) + cheeks(70, 130, 106, 9) +
      E(100, 120, 18, 8, '#FF8FA3') + C(100, 120, 7, '#FFD23F') + C(100, 134, 8, 'none', 'stroke="#FF8FA3" stroke-width="5"'),
  'grandma': () => bust({ shirt: '#8C6CF0',
      back: C(100, 40, 18, '#C9C6D9'),
      front: P('M56,96 Q50,48 100,48 Q150,48 144,96 Q140,68 120,66 Q100,76 80,66 Q60,68 56,96Z', '#C9C6D9'),
      extra: glasses + C(76, 168, 5, '#fff') + C(100, 172, 5, '#fff') + C(124, 168, 5, '#fff') }),
  'grandpa': () => bust({ shirt: '#5CCB6A',
      front: E(60, 82, 10, 18, '#E6E4EE') + E(140, 82, 10, 18, '#E6E4EE'),
      mouth: P('M78,108 Q90,98 100,104 Q110,98 122,108 Q110,116 100,110 Q90,116 78,108Z', '#E6E4EE', 'stroke-width="3"') + smile(100, 118, 7),
      collar: P('M90,150 L100,160 L110,150 L110,166 L100,160 L90,166Z', '#E8434A', 'stroke-width="3.5"'),
      extra: glasses }),
  'school': O.school,
  'be quiet': () => bigFace({ mouth: E(100, 146, 7, 6, '#B53450', 'stroke-width="4"'), eyes: eye(80, 102, 1.4) + eye(120, 102, 1.4) }) +
      R(92, 112, 16, 58, 8, SKIN) + R(78, 156, 44, 40, 16, SKIN) +
      P('M150,140 Q160,150 150,160 M160,132 Q176,150 160,168', 'none', 'stroke="#4DA3FF" stroke-width="4.5"'),
  'shout': O.megaphoneKid,
  'clean up': O.broom,
  'tidy': O.toybox,
  // barvy
  // lekce 6
  'sun': () => sunPic(),
  'hungry': () => C(84, 112, 58, '#FFD866') +
      P('M58,96 Q68,86 78,96', 'none') + P('M90,96 Q100,86 110,96', 'none') +
      P('M62,124 Q84,148 106,124Z', '#D2405A', 'stroke-width="4.5"') + E(98, 136, 11, 8, '#FF8FA3', 'stroke-width="3.5"') +
      P('M66,132 Q62,146 66,152 Q72,146 66,132Z', '#6EC3FF', 'stroke-width="3"') + cheeks(52, 116, 118, 7) +
      C(146, 66, 6, '#fff', 'stroke-width="3.5"') + C(158, 48, 9, '#fff', 'stroke-width="3.5"') +
      E(160, 30, 38, 26, '#fff', 'stroke-width="4"') + G('translate(160 30) scale(.32) translate(-100 -110)', O.apple(), 'stroke-width="12"'),
  'winter': () => snowman(),
  'autumn': () => R(90, 110, 20, 74, 6, '#9A5B33') + P('M100,140 L78,120 M100,130 L122,112', 'none', 'stroke="#9A5B33" stroke-width="8"') +
      C(70, 92, 32, '#FF9426') + C(130, 92, 32, '#E8504A') + C(100, 64, 38, '#FFB443') + C(100, 104, 26, '#FF7A3D', NS) +
      leaf(36, 160, '#E8504A', -30) + leaf(160, 150, '#FFB443', 40) + leaf(150, 186, '#FF9426', 10) + leaf(46, 128, '#FFB443', 20) +
      E(100, 186, 70, 6, '#000', NS + ' opacity=".08"'),
  'body': () => ring(100, 98, 60, 90) + kid({ shirt: '#FF8A65', pants: '#3F4C9A', pose: 'up' }),
  'chin': () => bigFace({ hl: 'chin' }),
  'tongue': () => bigFace({ hl: 'mouth', mouth: P('M80,138 Q100,158 120,138Z', '#B53450', 'stroke-width="4.5"') + P('M88,146 Q86,174 100,176 Q114,174 112,146Z', '#FF7A93', 'stroke-width="4"') + P('M100,152 L100,166', 'none', 'stroke-width="3" stroke-opacity=".5"') }),
  'teeth': () => bigFace({ hl: 'mouth', mouth: P('M76,136 Q100,166 124,136Z', '#B53450', 'stroke-width="4.5"') + P('M79,138 L121,138 L117,148 L83,148Z', '#fff', 'stroke-width="3"') + P('M90,138 L90,148 M100,138 L100,149 M110,138 L110,148', 'none', 'stroke-width="2.5"') }),
  'finger': () => fingerUp(),
  'baby brother': () => babyPic('#BDE7FF', P('M48,84 Q50,30 100,30 Q150,30 152,84 Q126,60 100,62 Q74,60 48,84Z', '#4DA3FF') + C(100, 26, 10, '#FFD23F')),
  'baby sister': () => babyPic('#FFD0E0', P('M100,40 Q90,26 102,22 Q114,26 106,34', 'none', 'stroke="#C98B55" stroke-width="5"') +
      P('M100,44 L74,30 L76,58Z', '#FF5A9E', 'stroke-width="4"') + P('M100,44 L126,30 L124,58Z', '#FF5A9E', 'stroke-width="4"') + C(100, 44, 8, '#FF5A9E')),
  'frog': () => frog(),
  'pink': () => O.splat('#FF8FC8'),
  'pancake': () => pancakes(),
  'green like a frog': () => likePic(O.splat('#3DBE5A'), frog()),
  'pink like a pig': () => likePic(O.splat('#FF8FC8'), A.pig()),
  'yellow like the sun': () => likePic(O.splat('#FFD62E'), sunPic()),

  'red': () => O.splat('#F0453F'), 'blue': () => O.splat('#3F8EF0'), 'green': () => O.splat('#3DBE5A'),
  'yellow': () => O.splat('#FFD62E'), 'orange': () => O.splat('#FF9426'), 'purple': () => O.splat('#9B5CE8'),
  'black': () => O.splat('#2E2A47'), 'white': () => O.splat('#FFFFFF'), 'brown': () => O.splat('#9A5B33'),
  // čísla
  'one': () => O.number(1), 'two': () => O.number(2), 'three': () => O.number(3), 'four': () => O.number(4), 'five': () => O.number(5),
  'six': () => O.number(6), 'seven': () => O.number(7), 'eight': () => O.number(8), 'nine': () => O.number(9), 'ten': () => O.number(10),
  // pomocné obrázky pro ovládání (nejsou to slovíčka)
  '_turtle': () => E(100, 160, 70, 8, '#000', NS + ' opacity=".08"') +
     E(52, 150, 12, 9, '#7FD48A') + E(146, 150, 12, 9, '#7FD48A') +
     C(160, 116, 20, '#7FD48A') + eye(166, 112) + smile(166, 122, 5) +
     P('M36,146 Q36,70 100,70 Q164,70 164,146Z', '#5CCB6A') +
     P('M70,100 L100,86 L130,100 L120,130 L80,130Z', '#3DA552', 'stroke-width="4"') +
     P('M36,146 L164,146', 'none'),
  '_uk': () => `<clipPath id="ukc"><rect x="20" y="50" width="160" height="100" rx="14"/></clipPath>` +
     `<g clip-path="url(#ukc)">` + R(20, 50, 160, 100, 0, '#2F5BBF', NS) +
     P('M20,50 L180,150 M180,50 L20,150', 'none', 'stroke="#fff" stroke-width="26"') +
     P('M20,50 L180,150 M180,50 L20,150', 'none', 'stroke="#E8434A" stroke-width="9"') +
     P('M100,50 L100,150 M20,100 L180,100', 'none', 'stroke="#fff" stroke-width="34"') +
     P('M100,50 L100,150 M20,100 L180,100', 'none', 'stroke="#E8434A" stroke-width="18"') + `</g>` +
     R(20, 50, 160, 100, 14, 'none'),
  '_cz': () => `<clipPath id="czc"><rect x="20" y="50" width="160" height="100" rx="14"/></clipPath>` +
     `<g clip-path="url(#czc)">` + R(20, 50, 160, 50, 0, '#fff', NS) + R(20, 100, 160, 50, 0, '#E8434A', NS) +
     P('M20,50 L100,100 L20,150Z', '#2F5BBF', NS) + `</g>` + R(20, 50, 160, 100, 14, 'none'),
  '_rock': () => P('M30,170 Q26,120 60,104 Q84,70 120,86 Q160,92 170,130 Q176,160 170,170Z', '#A9A3BF') +
     P('M62,120 Q74,110 88,116 M120,108 Q136,104 146,118', 'none', 'stroke-width="4"') + E(80, 100, 10, 6, '#fff', NS + ' opacity=".5"'),
  '_bush': () => C(62, 130, 34, '#4FBF63') + C(138, 130, 34, '#4FBF63') + C(100, 104, 44, '#5CCB6A') + R(40, 130, 120, 42, 18, '#5CCB6A', NS) +
     P('M30,172 L170,172', 'none') + C(84, 96, 6, '#FF5A7E', 'stroke-width="3"') + C(124, 118, 6, '#FF5A7E', 'stroke-width="3"') + C(70, 140, 6, '#FF5A7E', 'stroke-width="3"'),
  '_star': () => P(star(100, 104, 84, 38), '#FFD23F', 'stroke-width="9"'),
  '_cards': () => G('rotate(-12 100 110)', R(40, 40, 96, 128, 16, '#FFB3C7')) +
     G('rotate(8 100 110)', R(64, 36, 96, 128, 16, '#fff') + G('translate(78 56) scale(.34)', O.apple(), 'stroke-width="14"') + R(82, 130, 60, 10, 5, '#C9C6D9', NS)),
};

// big × small: always both stars, the arrow points at the one being asked for
/* ---------- lekce 6 ---------- */
function sunPic(){
  let s = '';
  for (let i = 0; i < 10; i++){
    const a = i / 10 * Math.PI * 2, x1 = 100 + 56 * Math.cos(a), y1 = 100 + 56 * Math.sin(a), x2 = 100 + 84 * Math.cos(a), y2 = 100 + 84 * Math.sin(a);
    s += P(`M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`, 'none', 'stroke-width="17"') + P(`M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`, 'none', 'stroke="#FFB443" stroke-width="9"');
  }
  return s + C(100, 100, 48, '#FFD23F') + eye(84, 94, 1.1) + eye(116, 94, 1.1) + smile(100, 110, 12) + cheeks(74, 126, 112, 7);
}
function leaf(x, y, col, rot){
  return G(`translate(${x} ${y}) rotate(${rot})`, P('M0,-14 Q12,-4 0,14 Q-12,-4 0,-14Z', col, 'stroke-width="3.5"') + P('M0,-10 L0,12', 'none', 'stroke-width="2.5"'));
}
function snowman(){
  const flake = (x, y, s) => G(`translate(${x} ${y}) scale(${s})`, P('M0,-10 L0,10 M-9,-5 L9,5 M-9,5 L9,-5', 'none', 'stroke="#6EC3FF" stroke-width="4"'));
  return E(100, 186, 70, 7, '#DDF1FF', 'stroke-width="4"') +
    C(100, 146, 40, '#fff') + C(100, 84, 30, '#fff') +
    P('M74,106 Q100,118 126,106 L128,116 Q100,128 72,116Z', '#E8434A', 'stroke-width="4"') + P('M112,114 L118,144 L130,140 L122,112Z', '#E8434A', 'stroke-width="4"') +
    R(76, 52, 48, 8, 3, '#2E2A47') + R(84, 24, 32, 32, 4, '#2E2A47') + R(84, 44, 32, 6, 1, '#4DA3FF', NS) +
    eye(90, 80) + eye(110, 80) + P('M100,88 L122,94 L100,96Z', '#FF9426', 'stroke-width="3.5"') +
    C(100, 138, 4, INK, NS) + C(100, 156, 4, INK, NS) +
    limb('M68,138 L38,116', '#9A5B33', 5) + limb('M132,138 L162,114', '#9A5B33', 5) +
    flake(30, 40, 1) + flake(170, 50, .8) + flake(150, 170, .7) + flake(36, 170, .7) + flake(60, 20, .6);
}
function fingerUp(){
  return ring(136, 94, 36, 24) + G('translate(0 10)', pointHand('#8C6CF0'));
}
function babyPic(blanket, hair){
  return P('M24,204 Q28,146 100,140 Q172,146 176,204Z', blanket) + C(66, 172, 5, '#fff', NS) + C(132, 180, 5, '#fff', NS) + C(100, 190, 5, '#fff', NS) +
    C(50, 92, 11, SKIN) + C(150, 92, 11, SKIN) + C(100, 90, 52, SKIN) + hair +
    eye(80, 88, 1.1) + eye(120, 88, 1.1) + cheeks(70, 130, 106, 9) +
    E(100, 120, 18, 8, '#FF8FA3') + C(100, 120, 7, '#FFD23F') + C(100, 134, 8, 'none', 'stroke="#FF8FA3" stroke-width="5"');
}
function frog(){
  return E(100, 172, 76, 7, '#000', NS + ' opacity=".08"') +
    E(50, 160, 30, 14, '#3DBE5A') + E(150, 160, 30, 14, '#3DBE5A') +
    E(100, 124, 66, 50, '#5CCB6A') + E(100, 140, 40, 26, '#B8EE9C', NS) +
    C(68, 76, 22, '#5CCB6A') + C(132, 76, 22, '#5CCB6A') + C(68, 76, 13, '#fff') + C(132, 76, 13, '#fff') + eye(70, 78) + eye(130, 78) +
    P('M64,112 Q100,140 136,112', 'none', 'stroke-width="5"') + cheeks(56, 144, 110, 8) +
    E(70, 168, 14, 8, '#5CCB6A') + E(130, 168, 14, 8, '#5CCB6A');
}
function pancakes(){
  let s = E(100, 166, 84, 22, '#fff') + E(100, 162, 62, 13, '#EEF3FF', NS);
  [150, 132, 114, 96].forEach(y => s += P(`M42,${y} Q42,${y + 18} 100,${y + 18} Q158,${y + 18} 158,${y} Q158,${y - 16} 100,${y - 16} Q42,${y - 16} 42,${y}Z`, '#F3B25C') + P(`M48,${y + 2} Q100,${y + 12} 152,${y + 2}`, 'none', 'stroke="#D58A33" stroke-width="3"'));
  s += P('M52,90 Q60,72 100,74 Q140,72 150,90 Q152,104 144,108 Q138,118 132,104 Q118,96 100,100 Q86,98 74,108 Q66,120 62,104 Q50,100 52,90Z', '#9A4A1E', 'stroke-width="4"');
  s += R(88, 70, 26, 16, 5, '#FFE27A') + E(84, 82, 5, 3, '#fff', NS + ' opacity=".6"');
  return s + sparkle(168, 46, .7) + sparkle(30, 60, .5);
}
function likePic(splat, pic){
  return G('translate(150 150) scale(.5) translate(-100 -104)', splat, 'stroke-width="10"') +
    G('translate(76 78) scale(.68) translate(-100 -104)', pic, 'stroke-width="7.4"') +
    P('M112,132 Q118,118 128,116', 'none', 'stroke="#FF3D8B" stroke-width="5"') + P('M118,110 L130,115 L122,126', 'none', 'stroke="#FF3D8B" stroke-width="5"');
}
function twoStars(which){
  const face = P(star(100, 108, 70, 32), '#FFD23F') + eye(88, 104, 1.1) + eye(112, 104, 1.1) + smile(100, 118, 9) + cheeks(80, 120, 118, 6);
  const at = (x, y, sc) => G(`translate(${x} ${y}) scale(${sc}) translate(-100 -108)`, face, `stroke-width="${(5 / sc).toFixed(1)}"`);
  const big = { x: 68, y: 122, top: 64 }, small = { x: 162, y: 156, top: 136 };
  const t = which === 'big' ? big : small;
  return E(100, 182, 84, 6, '#000', NS + ' opacity=".08"') +
    C(t.x, t.y + 4, which === 'big' ? 64 : 28, 'rgba(255,255,255,.6)', `stroke="${HL}" stroke-width="4" stroke-dasharray="9 7"`) +
    at(big.x, big.y, .8) + at(small.x, small.y, .3) +
    G(`translate(${t.x} ${t.top - 22}) scale(.42) translate(-100 -100)`, arrow(100, 100, -1, HL), 'stroke-width="12"');
}

function foot(which){
  let s = '';
  if (which === 'foot') s += ring(104, 112, 62, 84);
  s += P('M66,66 Q56,124 66,160 Q78,186 110,182 Q140,176 136,142 Q132,112 142,82 Q148,58 122,54 Q92,50 66,66Z', SKIN);
  s += E(96, 130, 22, 26, SKIN2, NS + ' opacity=".5"');
  if (which === 'toes') s += ring(106, 46, 52, 22);
  s += C(76, 50, 13, SKIN) + C(100, 40, 10, SKIN) + C(119, 40, 9, SKIN) + C(135, 47, 8, SKIN) + C(147, 59, 7, SKIN);
  return s;
}

window.PICS = PICS;
window.PH = { INK, SKIN, SKIN2, BLUSH, C, E, P, R, G, NS, limb, eye, cheeks, smile, sparkle, star, kid, bust, arrow };
window.drawPic = function(key, cls = ''){
  const fn = PICS[key];
  const inner = fn ? fn() : `<text x="100" y="115" text-anchor="middle" font-size="40" fill="${INK}">${key}</text>`;
  return `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#wobble)" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
};
})();
