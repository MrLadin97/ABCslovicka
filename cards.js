/* =====================================================================
   SBĚRATELSKÉ KARTIČKY + obrázky do miniher (auto, motorka)
   Čím vzácnější karta, tím propracovanější obrázek (pozadí, scéna).
   ===================================================================== */
(function(){
const { INK, SKIN, C, E, P, R, G, NS, limb, eye, cheeks, smile, sparkle, star } = window.PH;
const wheel = (x, y, r) => C(x, y, r, '#3B3550') + C(x, y, r * .45, '#C9C6D9', NS) + C(x, y, r * .15, INK, NS);
const lg = (id, stops, x2 = 0, y2 = 1) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`;
const bg = (fill) => R(-10, -10, 220, 220, 0, fill, NS);
const dots = (list, col = '#fff', r = 2.5) => list.map(([x, y]) => C(x, y, r, col, NS)).join('');

const CARDS = [
  /* ---------- COMMON: jednoduché obrázky ---------- */
  { id: 'ladybird', en: 'ladybird', cz: 'beruška', tier: 0, draw: () =>
    P('M24,150 Q40,40 176,46 Q150,168 24,150Z', '#7FD48A') + P('M40,140 Q100,100 160,56', 'none', 'stroke="#4FA85C" stroke-width="4"') +
    P('M78,58 Q70,36 58,34 M122,58 Q130,36 142,34', 'none', 'stroke-width="4"') + C(58, 34, 5, INK) + C(142, 34, 5, INK) +
    E(100, 116, 54, 50, '#F0453F') + P('M100,66 L100,166', 'none', 'stroke-width="4"') +
    P('M62,72 Q100,40 138,72 Q120,86 100,86 Q80,86 62,72Z', INK) + C(88, 70, 6, '#fff', NS) + C(112, 70, 6, '#fff', NS) + C(89, 71, 3, INK, NS) + C(113, 71, 3, INK, NS) +
    C(74, 106, 9, INK, NS) + C(126, 106, 9, INK, NS) + C(80, 140, 8, INK, NS) + C(120, 140, 8, INK, NS) +
    E(76, 98, 6, 4, '#fff', NS + ' opacity=".5"') },
  { id: 'snail', en: 'snail', cz: 'šnek', tier: 0, draw: () =>
    P('M22,164 Q20,140 50,138 L140,136 L148,100 Q150,78 166,78 Q182,80 180,102 Q178,140 160,158 Q140,168 22,164Z', '#F6E39A') +
    P('M156,80 L150,50 M172,82 L178,52', 'none', 'stroke-width="4"') + C(150, 48, 7, '#fff') + C(178, 50, 7, '#fff') + C(151, 49, 3, INK, NS) + C(179, 51, 3, INK, NS) +
    smile(168, 112, 7) + E(160, 104, 5, 3, '#FF9DB0', NS + ' opacity=".8"') +
    C(90, 100, 50, '#E8955A') + P('M90,100 m-8,0 a8,8 0 1 1 16,0 a16,16 0 1 1 -32,0 a26,26 0 1 1 52,0 a36,36 0 1 1 -72,4', 'none', 'stroke="#B5612E" stroke-width="5"') },
  { id: 'fish', en: 'fish', cz: 'rybka', tier: 0, draw: () =>
    C(160, 50, 8, '#CDEBFF') + C(172, 30, 5, '#CDEBFF') + C(150, 26, 4, '#CDEBFF') +
    P('M140,104 L184,70 Q176,104 184,138Z', '#FF8A3D') +
    P('M86,70 Q100,40 124,66Z', '#FF8A3D') + P('M90,138 Q104,162 120,140Z', '#FF8A3D') +
    E(96, 104, 58, 40, '#FFA63D') + P('M110,68 Q100,104 110,140 M128,74 Q120,104 128,134', 'none', 'stroke="#fff" stroke-width="7"') +
    eye(64, 96, 1.3) + P('M40,112 Q48,118 56,112', 'none', 'stroke-width="4"') + E(66, 112, 7, 4, '#FF9DB0', NS) },
  { id: 'butterfly', en: 'butterfly', cz: 'motýl', tier: 0, draw: () =>
    G('rotate(-12 100 100)', E(60, 72, 42, 38, '#FF7AB8')) + G('rotate(12 100 100)', E(140, 72, 42, 38, '#B28CFF')) +
    G('rotate(20 100 100)', E(70, 134, 28, 30, '#FFD23F')) + G('rotate(-20 100 100)', E(130, 134, 28, 30, '#5CCB9A')) +
    C(56, 70, 12, '#fff', 'stroke-width="3.5"') + C(144, 70, 12, '#fff', 'stroke-width="3.5"') + C(70, 136, 8, '#fff', 'stroke-width="3"') + C(130, 136, 8, '#fff', 'stroke-width="3"') +
    R(90, 66, 20, 96, 10, '#5A3E7A') + C(100, 58, 16, '#5A3E7A') +
    P('M94,44 Q84,22 74,20 M106,44 Q116,22 126,20', 'none', 'stroke-width="4"') + C(74, 20, 4, INK) + C(126, 20, 4, INK) +
    C(94, 56, 3.5, '#fff', NS) + C(106, 56, 3.5, '#fff', NS) },

  /* ---------- RARE: auta a stroje se zemí ---------- */
  { id: 'fire-engine', en: 'fire engine', cz: 'hasičské auto', tier: 1, draw: () =>
    R(-10, 162, 220, 50, 0, '#9ED98F', NS) + P('M-10,162 L210,162', 'none') +
    R(14, 84, 128, 66, 8, '#E8434A') + P('M142,96 L172,96 Q186,98 188,118 L188,150 L142,150Z', '#E8434A') +
    P('M150,104 L174,104 Q180,106 180,120 L150,120Z', '#BDE7FF', 'stroke-width="4"') +
    P('M10,74 L140,74 M10,62 L140,62', 'none', 'stroke="#C9C6D9" stroke-width="6"') + P('M24,62 L24,74 M46,62 L46,74 M68,62 L68,74 M90,62 L90,74 M112,62 L112,74 M134,62 L134,74', 'none', 'stroke="#C9C6D9" stroke-width="4"') +
    R(156, 80, 18, 12, 4, '#4DA3FF') + P('M150,74 L146,66 M165,72 L165,62 M180,74 L184,66', 'none', 'stroke="#4DA3FF" stroke-width="3"') +
    R(14, 118, 174, 10, 0, '#fff', NS) + R(30, 96, 30, 16, 4, '#FFD23F', 'stroke-width="3.5"') + R(70, 96, 30, 16, 4, '#FFD23F', 'stroke-width="3.5"') +
    wheel(48, 152, 18) + wheel(156, 152, 18) },
  { id: 'tractor', en: 'tractor', cz: 'traktor', tier: 1, draw: () =>
    R(-10, 168, 220, 50, 0, '#C79A62', NS) + P('M-10,168 L210,168', 'none') +
    C(150, 36, 9, '#E6E4EE') + C(162, 22, 7, '#E6E4EE') + C(172, 10, 5, '#E6E4EE') +
    R(142, 46, 10, 50, 3, '#5A5470') +
    P('M30,110 L30,52 L96,52 L104,110Z', '#4FBF63') + P('M40,62 L86,62 L92,104 L40,104Z', '#BDE7FF', 'stroke-width="4"') +
    R(30, 106, 150, 34, 10, '#4FBF63') + R(150, 112, 34, 14, 4, '#FFD23F', 'stroke-width="3.5"') +
    C(62, 140, 40, '#3B3550') + C(62, 140, 20, '#FFD23F') + C(62, 140, 6, INK, NS) +
    P('M30,140 A32,32 0 0 1 94,140', 'none', 'stroke="#5A5470" stroke-width="5" stroke-dasharray="6 6"') +
    C(158, 156, 18, '#3B3550') + C(158, 156, 8, '#FFD23F') },
  { id: 'helicopter', en: 'helicopter', cz: 'vrtulník', tier: 1, draw: () =>
    bg('#CDEBFF') + C(36, 150, 16, '#fff', NS) + C(56, 156, 14, '#fff', NS) + C(170, 60, 12, '#fff', NS) + C(186, 64, 10, '#fff', NS) +
    P('M20,40 L180,40', 'none', 'stroke-width="7"') + R(96, 40, 8, 20, 3, '#5A5470') +
    P('M118,96 L182,86 L186,100 L120,114Z', '#FFC93C') + C(184, 92, 14, 'none', 'stroke-width="4"') + P('M184,78 L184,106', 'none', 'stroke-width="4"') +
    E(92, 104, 52, 42, '#FFC93C') + P('M50,96 Q52,66 92,66 L92,104 L46,104Z', '#BDE7FF', 'stroke-width="4"') +
    C(74, 88, 10, SKIN, 'stroke-width="3.5"') + P('M64,84 Q74,70 84,84', '#E8434A', 'stroke-width="3.5"') +
    P('M58,150 L60,140 M118,150 L116,140 M40,152 L140,152', 'none', 'stroke-width="5"') },
  { id: 'digger', en: 'digger', cz: 'bagr', tier: 1, draw: () =>
    R(-10, 166, 220, 50, 0, '#C79A62', NS) + P('M-10,166 L210,166', 'none') + P('M150,166 Q170,140 196,166Z', '#A9763A') +
    R(18, 136, 110, 30, 15, '#3B3550') + C(36, 151, 9, '#C9C6D9') + C(64, 151, 9, '#C9C6D9') + C(92, 151, 9, '#C9C6D9') + C(112, 151, 8, '#C9C6D9') +
    R(24, 104, 100, 34, 6, '#FFC93C') + P('M30,104 L30,58 L78,58 L86,104Z', '#FFC93C') + P('M40,68 L72,68 L76,98 L40,98Z', '#BDE7FF', 'stroke-width="4"') +
    limb('M100,108 L136,52', '#FFB020', 16) + limb('M136,52 L170,100', '#FFB020', 12) +
    P('M156,96 L186,96 L180,124 Q168,130 156,118Z', '#8A8698') + P('M160,124 L162,132 M170,126 L172,134 M180,124 L182,130', 'none', 'stroke-width="4"') },

  /* ---------- EPIC: celá scéna s pozadím ---------- */
  { id: 'dinosaur', en: 'dinosaur', cz: 'dinosaurus', tier: 2, draw: () =>
    lg('gDinoSky', ['#FFE6A8', '#FFC48A']) + bg('url(#gDinoSky)') +
    P('M110,120 L150,40 L170,40 L206,120Z', '#9A6B4E') + P('M150,40 L170,40 L166,54 L156,52Z', '#FF5A2E') +
    C(156, 26, 10, '#B8B2C6', NS) + C(170, 16, 8, '#B8B2C6', NS) +
    P('M-10,150 Q50,128 110,146 T210,140 L210,210 L-10,210Z', '#7FCB6A') +
    P('M10,150 Q4,120 22,112 Q16,138 30,150Z', '#3FA552') + P('M176,150 Q190,116 200,120 Q186,134 188,150Z', '#3FA552') +
    P('M24,138 Q4,140 6,124 Q30,128 52,116Z', '#4FBF63') +
    E(88, 126, 46, 34, '#4FBF63') + E(92, 134, 28, 18, '#C9F2A6', NS) +
    P('M60,108 L54,96 L66,102 L66,88 L76,98 L80,84 L88,96 L96,84 L100,96', '#3FA552', 'stroke-width="3.5"') +
    limb('M76,152 L72,176', '#4FBF63', 16) + limb('M106,152 L110,176', '#4FBF63', 16) +
    limb('M118,112 L130,72', '#4FBF63', 22) +
    P('M112,46 Q112,30 140,30 Q176,32 178,52 Q178,72 150,74 L124,74 Q112,70 112,46Z', '#4FBF63') +
    P('M140,74 L144,80 L148,74 L152,80 L156,74', '#fff', 'stroke-width="3"') +
    eye(134, 44, 1.1) + E(166, 46, 3, 2, INK, NS) +
    limb('M120,118 L134,126', '#4FBF63', 8) + sparkle(30, 30, .8, '#fff') },
  { id: 'whale', en: 'whale', cz: 'velryba', tier: 2, draw: () =>
    lg('gWhaleSea', ['#4DA3FF', '#2F6FC7']) + bg('#BDE7FF') + C(168, 30, 16, '#FFD23F') +
    R(-10, 92, 220, 120, 0, 'url(#gWhaleSea)', NS) + P('M-10,92 Q10,82 30,92 T70,92 T110,92 T150,92 T190,92 T230,92', 'none', 'stroke="#fff" stroke-width="5"') +
    P('M86,52 Q80,30 70,30 M86,52 Q86,26 86,20 M86,52 Q92,30 102,30', 'none', 'stroke="#8FD3FF" stroke-width="6"') + C(70, 28, 5, '#8FD3FF', NS) + C(86, 18, 5, '#8FD3FF', NS) + C(102, 28, 5, '#8FD3FF', NS) +
    P('M24,120 Q24,62 92,62 Q150,62 166,108 L190,86 Q196,112 186,124 Q198,140 190,158 L164,132 Q140,170 84,170 Q24,168 24,120Z', '#3E7BD6') +
    P('M30,132 Q60,168 120,160 Q90,140 30,132Z', '#CDE7FF') + P('M50,144 L58,150 M70,150 L76,156 M90,152 L94,158', 'none', 'stroke-width="3"') +
    eye(56, 112, 1.2) + P('M30,124 Q44,132 58,126', 'none', 'stroke-width="4"') + E(68, 126, 7, 4, '#FF9DB0', NS) +
    C(30, 190, 4, '#CDEBFF', NS) + C(170, 180, 6, '#CDEBFF', NS) },
  { id: 'owl', en: 'owl', cz: 'sova', tier: 2, draw: () =>
    bg('#27305E') + C(152, 46, 30, '#FFF2B0', 'stroke="#FFF2B0"') + C(140, 40, 6, '#F2DE8A', NS) + C(162, 56, 4, '#F2DE8A', NS) +
    dots([[26, 30], [60, 18], [96, 36], [24, 90], [184, 110], [120, 14], [180, 160]], '#FFF2B0', 2.5) + sparkle(40, 56, .5, '#FFF2B0') +
    P('M-10,170 Q60,160 110,170 Q160,178 210,164', 'none', 'stroke="#8B5A3C" stroke-width="16"') +
    P('M60,60 L68,30 L84,52 M140,60 L132,30 L116,52', '#A86B3C') +
    E(100, 110, 50, 62, '#A86B3C') + E(100, 128, 32, 38, '#E8C49A', NS) +
    P('M86,118 l6,6 l6,-6 M102,118 l6,6 l6,-6 M94,136 l6,6 l6,-6 M86,152 l6,6 l6,-6 M102,152 l6,6 l6,-6', 'none', 'stroke="#B5815A" stroke-width="3"') +
    P('M52,100 Q40,140 64,160 Q60,130 70,104Z', '#8A5530') + P('M148,100 Q160,140 136,160 Q140,130 130,104Z', '#8A5530') +
    C(80, 82, 20, '#fff') + C(120, 82, 20, '#fff') + C(80, 82, 11, '#FFC93C', NS) + C(120, 82, 11, '#FFC93C', NS) + C(80, 82, 6, INK, NS) + C(120, 82, 6, INK, NS) + C(82, 79, 2.5, '#fff', NS) + C(122, 79, 2.5, '#fff', NS) +
    P('M92,96 L108,96 L100,110Z', '#FF9A3D', 'stroke-width="3.5"') +
    P('M84,170 l-6,8 M92,170 l0,10 M108,170 l0,10 M116,170 l6,8', 'none', 'stroke="#F2A93B" stroke-width="5"') },
  { id: 'robot', en: 'robot', cz: 'robot', tier: 2, draw: () =>
    bg('#BFEFE6') + P('M0,40 L40,40 L40,80 L80,80 M200,150 L160,150 L160,110 L130,110 M0,170 L30,170 L30,130', 'none', 'stroke="#8FD8C8" stroke-width="4"') +
    C(80, 80, 5, '#8FD8C8', NS) + C(130, 110, 5, '#8FD8C8', NS) + C(30, 130, 5, '#8FD8C8', NS) +
    P('M100,30 L100,14', 'none', 'stroke-width="4"') + C(100, 12, 7, '#FF5A4E') +
    R(60, 30, 80, 60, 18, '#B8C2D6') + R(70, 42, 60, 32, 10, '#2E2A47') + C(88, 58, 7, '#5CF0E0', NS) + C(112, 58, 7, '#5CF0E0', NS) + P('M92,66 Q100,70 108,66', 'none', 'stroke="#5CF0E0" stroke-width="3"') +
    R(52, 54, 10, 20, 4, '#8A93AA') + R(138, 54, 10, 20, 4, '#8A93AA') +
    R(84, 90, 32, 10, 3, '#8A93AA') +
    R(56, 98, 88, 62, 14, '#B8C2D6') + R(70, 110, 30, 22, 6, '#2E2A47') + P('M74,124 L80,118 L86,126 L92,114 L96,124', 'none', 'stroke="#5CF0E0" stroke-width="3"') +
    C(118, 114, 6, '#FF5A4E') + C(132, 114, 6, '#FFD23F') + C(118, 132, 6, '#5CCB6A') + C(132, 132, 6, '#4DA3FF') +
    limb('M56,110 L32,136', '#8A93AA', 10) + limb('M144,110 L168,136', '#8A93AA', 10) + C(30, 140, 9, '#B8C2D6') + C(170, 140, 9, '#B8C2D6') +
    R(70, 160, 20, 22, 4, '#8A93AA') + R(110, 160, 20, 22, 4, '#8A93AA') + R(62, 180, 36, 12, 6, '#5A5470') + R(102, 180, 36, 12, 6, '#5A5470') },

  /* ---------- LEGENDARY: nejpropracovanější scény ---------- */
  { id: 'dragon', en: 'dragon', cz: 'drak', tier: 3, draw: () =>
    lg('gDragSky', ['#FF9A5A', '#B65CC8', '#5A3E9A']) + lg('gFire', ['#FFE04D', '#FF5A2E'], 1, 0) + bg('url(#gDragSky)') +
    C(40, 40, 18, '#FFE6A8', 'stroke="#FFE6A8"') + dots([[150, 20], [180, 44], [120, 30], [20, 80]], '#FFE6A8', 2) +
    P('M-10,170 L30,120 L60,150 L100,104 L140,150 L170,126 L210,170 L210,210 L-10,210Z', '#4A3870') +
    P('M120,150 L120,122 L128,116 L136,122 L136,150Z M142,150 L142,130 L150,124 L158,130 L158,150Z', '#2E2A47', 'stroke="none"') +
    P('M70,80 Q30,20 60,10 Q70,40 90,30 Q90,56 112,52 Q104,74 86,88Z', '#2FB3A8') + P('M70,80 L60,14 M80,74 L88,34 M90,80 L110,54', 'none', 'stroke="#1F8A80" stroke-width="3"') +
    P('M40,138 Q20,150 14,130 Q28,136 40,124Z', '#2FB3A8') +
    P('M40,130 Q60,90 110,96 Q140,100 150,120 Q130,140 100,142 Q70,146 40,130Z', '#3FCBBE') +
    P('M60,128 Q90,136 128,124', 'none', 'stroke="#FFE6A8" stroke-width="8"') +
    P('M50,124 L46,114 L56,118 L56,106 L66,112 L70,100 L78,108', '#1F8A80', 'stroke-width="3"') +
    limb('M84,140 L80,160', '#3FCBBE', 10) + limb('M116,138 L122,156', '#3FCBBE', 10) +
    P('M140,108 Q150,80 172,84 Q190,88 186,104 Q182,118 160,118 Q146,118 140,108Z', '#3FCBBE') +
    P('M156,84 L150,66 L164,80 M168,84 L172,66 L176,86', '#FFE6A8', 'stroke-width="3"') +
    eye(166, 96, .9) + C(184, 102, 2, INK, NS) +
    P('M186,108 Q206,96 214,112 Q200,110 206,124 Q192,116 186,108Z', 'url(#gFire)', 'stroke-width="3"') + C(204, 92, 4, '#FFE04D', NS) +
    P('M76,98 Q96,50 132,60 Q112,70 120,90 Q100,80 94,100Z', '#2FB3A8') + P('M96,96 L118,64 M106,96 L126,76', 'none', 'stroke="#1F8A80" stroke-width="3"') +
    sparkle(26, 104, .6, '#FFE6A8') },
  { id: 'unicorn', en: 'unicorn', cz: 'jednorožec', tier: 3, draw: () =>
    lg('gUniSky', ['#D9C8FF', '#FFD6EA']) + lg('gHorn', ['#FFF2B0', '#FFC93C']) + bg('url(#gUniSky)') +
    ['#FF5A4E', '#FFA63D', '#FFE04D', '#5CCB6A', '#4DA3FF', '#8C6CF0'].map((c, i) => P(`M${-20 + i * 9},180 A${120 - i * 9},${120 - i * 9} 0 0 1 ${220 - i * 9},180`, 'none', `stroke="${c}" stroke-width="9" opacity=".75"`)).join('') +
    C(30, 170, 18, '#fff', NS) + C(54, 176, 16, '#fff', NS) + C(170, 174, 18, '#fff', NS) + C(150, 180, 14, '#fff', NS) +
    sparkle(30, 40, .6, '#fff') + sparkle(176, 30, .7, '#FFE04D') + sparkle(160, 120, .5, '#fff') +
    P('M78,200 L80,140 Q70,120 82,108 L120,108 Q134,120 128,150 L132,200Z', '#fff') +
    P('M70,92 Q60,50 96,40 Q130,34 144,62 Q156,90 150,110 Q146,124 128,122 Q118,120 116,108 Q100,112 86,104 Q72,104 70,92Z', '#fff') +
    P('M110,44 L132,6 L122,48Z', 'url(#gHorn)', 'stroke-width="4"') + P('M114,36 L126,32 M117,26 L128,22', 'none', 'stroke="#E6A817" stroke-width="3"') +
    P('M104,42 Q80,30 70,56 Q56,70 66,90 Q50,104 62,126 Q50,146 68,160 Q60,134 76,118 Q66,100 80,84 Q72,64 96,56Z', '#FF7AB8') +
    P('M100,48 Q84,52 80,68 Q70,84 82,96', 'none', 'stroke="#B28CFF" stroke-width="8"') + P('M92,50 Q76,66 74,80', 'none', 'stroke="#5CC4FF" stroke-width="6"') +
    eye(124, 74, 1.2) + P('M116,64 L112,58 M122,62 L122,55 M128,63 L132,57', 'none', 'stroke-width="3"') +
    E(140, 104, 4, 3, INK, NS) + E(130, 90, 7, 4, '#FF9DB0', NS) + P('M132,112 Q138,116 144,112', 'none', 'stroke-width="3.5"') },
  { id: 'astronaut', en: 'astronaut', cz: 'astronaut', tier: 3, draw: () =>
    lg('gSpace', ['#1B1F4A', '#3A2D7A']) + lg('gVisor', ['#5CC4FF', '#8C6CF0'], 1, 1) + bg('url(#gSpace)') +
    dots([[20, 20], [50, 60], [90, 16], [140, 30], [186, 70], [30, 120], [176, 150], [70, 186], [120, 180], [190, 20]], '#fff', 2) + sparkle(40, 90, .5, '#fff') + sparkle(170, 110, .45, '#FFE04D') +
    C(160, 46, 26, '#FF9A6B') + P('M124,52 Q160,30 198,40', 'none', 'stroke="#FFD6A8" stroke-width="6"') + P('M144,38 Q152,46 146,56 M168,56 Q176,60 174,68', 'none', 'stroke="#E8743A" stroke-width="4"') +
    C(34, 170, 16, '#4DA3FF') + P('M24,164 Q32,160 34,170 Q40,178 46,172', '#5CCB6A', 'stroke-width="3"') +
    G('rotate(-12 100 120)',
      R(60, 92, 80, 70, 24, '#fff') + R(54, 96, 14, 50, 6, '#C9C6D9') +
      R(80, 112, 40, 22, 6, '#E6E4EE', 'stroke-width="3.5"') + C(90, 123, 4, '#FF5A4E', NS) + C(102, 123, 4, '#5CCB6A', NS) + C(114, 123, 4, '#FFD23F', NS) +
      limb('M62,110 L40,82', '#fff', 16) + C(38, 78, 11, '#C9C6D9') +
      limb('M138,112 L160,134', '#fff', 16) + C(162, 138, 11, '#C9C6D9') +
      limb('M80,160 L76,188', '#fff', 18) + limb('M120,160 L126,188', '#fff', 18) + R(62, 184, 28, 14, 6, '#C9C6D9') + R(114, 184, 28, 14, 6, '#C9C6D9') +
      C(100, 66, 36, '#fff') + E(100, 68, 26, 20, 'url(#gVisor)') + P('M84,58 Q90,52 98,54', 'none', 'stroke="#fff" stroke-width="4"') +
      C(100, 30, 5, '#FF5A4E', 'stroke-width="3"')) },
  { id: 'racing-car', en: 'racing car', cz: 'závodní auto', tier: 3, draw: () =>
    lg('gRaceSky', ['#FFE9A8', '#FFC24D']) + lg('gGold', ['#FFF2B0', '#FFC93C', '#E6A817']) + bg('url(#gRaceSky)') +
    (() => { let s = ''; for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) s += R(120 + i * 12, 24 + j * 12, 12, 12, 0, (i + j) % 2 ? '#fff' : INK, NS); return s; })() +
    R(120, 24, 72, 36, 0, 'none', 'stroke-width="3"') + P('M118,22 L118,96', 'none', 'stroke-width="5"') +
    R(-10, 150, 220, 60, 0, '#6B6585', NS) + P('M-10,176 L30,176 M60,176 L100,176 M130,176 L170,176 M200,176 L230,176', 'none', 'stroke="#fff" stroke-width="5"') + P('M-10,150 L210,150', 'none') +
    P('M10,110 L4,120 M14,124 L0,130 M10,138 L-2,142', 'none', 'stroke="#fff" stroke-width="4"') +
    P('M20,138 L20,118 Q22,108 34,106 L70,104 L86,84 Q92,78 104,78 L120,78 Q130,80 136,92 L172,100 Q190,104 192,120 L192,138Z', '#E8434A') +
    R(18, 92, 24, 8, 3, INK) + R(26, 98, 6, 12, 2, INK) +
    P('M92,88 Q98,84 110,84 L118,84 L120,100 L88,100Z', '#BDE7FF', 'stroke-width="3.5"') +
    C(110, 76, 12, '#FFD23F') + P('M100,74 L120,74', 'none', 'stroke-width="3"') +
    C(150, 118, 16, '#fff', 'stroke-width="3.5"') + `<text x="150" y="126" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="700" font-size="22" fill="${INK}" stroke="none">1</text>` +
    P('M36,124 L130,124', 'none', 'stroke="url(#gGold)" stroke-width="8"') +
    wheel(52, 140, 20) + wheel(160, 140, 20) + sparkle(70, 40, .8, '#fff') + sparkle(30, 70, .5, '#fff') },
];

/* ---------- obrázky do miniher ---------- */
Object.assign(window.PICS, {
  '_carTop': () => R(46, 34, 14, 32, 5, '#3B3550') + R(140, 34, 14, 32, 5, '#3B3550') + R(46, 134, 14, 32, 5, '#3B3550') + R(140, 134, 14, 32, 5, '#3B3550') +
    R(56, 18, 88, 166, 32, '#E8434A') + R(90, 18, 8, 166, 0, '#fff', NS + ' opacity=".9"') + R(102, 18, 8, 166, 0, '#fff', NS + ' opacity=".9"') +
    P('M68,62 Q100,48 132,62 L126,88 L74,88Z', '#BDE7FF', 'stroke-width="4"') + R(72, 92, 56, 40, 10, '#C9303A') +
    P('M74,136 L126,136 L130,152 Q100,160 70,152Z', '#BDE7FF', 'stroke-width="4"') +
    E(74, 26, 8, 5, '#FFE04D', 'stroke-width="3"') + E(126, 26, 8, 5, '#FFE04D', 'stroke-width="3"'),
  '_carTop2': () => R(46, 34, 14, 32, 5, '#3B3550') + R(140, 34, 14, 32, 5, '#3B3550') + R(46, 134, 14, 32, 5, '#3B3550') + R(140, 134, 14, 32, 5, '#3B3550') +
    R(56, 18, 88, 166, 32, '#4DA3FF') +
    P('M68,138 Q100,152 132,138 L126,112 L74,112Z', '#BDE7FF', 'stroke-width="4"') + R(72, 68, 56, 40, 10, '#3A86D9') +
    P('M74,64 L126,64 L130,48 Q100,40 70,48Z', '#BDE7FF', 'stroke-width="4"') +
    E(74, 176, 8, 5, '#FF5A4E', 'stroke-width="3"') + E(126, 176, 8, 5, '#FF5A4E', 'stroke-width="3"'),
  '_cone': () => R(46, 46, 108, 108, 18, '#E8743A') + C(100, 100, 40, '#FF9A3D') + C(100, 100, 26, '#fff') + C(100, 100, 14, '#FF9A3D'),
  '_moto': () => wheel(48, 150, 30) + wheel(156, 150, 30) +
    P('M48,150 L84,118 M156,150 L140,96', 'none', 'stroke-width="8"') +
    P('M70,124 L104,100 L144,104 L150,128 L96,136Z', '#E8434A') + R(84, 130, 46, 10, 5, '#C9C6D9') +
    P('M60,112 Q80,100 104,104 L100,116 L64,120Z', '#3B3550') +
    P('M134,94 L150,86', 'none', 'stroke-width="6"') +
    limb('M84,106 L96,64', '#4DA3FF', 18) + limb('M100,76 L142,90', '#4DA3FF', 10) + C(144, 90, 7, SKIN) +
    limb('M84,110 L112,122 L108,146', '#3F4C9A', 12) + E(112, 148, 10, 6, '#E8505B') +
    C(102, 46, 22, '#FFD23F') + P('M106,34 Q126,36 124,54 L106,54Z', '#2E2A47', 'stroke-width="4"') + P('M84,40 Q100,30 116,36', 'none', 'stroke="#E8434A" stroke-width="5"'),
});

CARDS.forEach(c => window.PICS['card:' + c.id] = c.draw);
window.CARDS = CARDS;
window.TIERS = [
  { name: 'Běžná', price: 10, color: '#7FD48A' },
  { name: 'Vzácná', price: 25, color: '#4DA3FF' },
  { name: 'Epická', price: 50, color: '#9B5CE8' },
  { name: 'Legendární', price: 100, color: '#FFB020' },
];
})();
