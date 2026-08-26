/**
 * avatar.js — CCRAFT SPACE Character System v2
 * نظام شخصيات محسّن مع ملابس مقفولة بالنقاط
 */

// ============================================================
// الألوان
// ============================================================

export const AVATAR_OPTIONS = {
    skinColors: [
        '#FDDBB4','#F1C27D','#E0AC69','#C68642',
        '#8D5524','#FFE0BD','#FFCD94','#D4956A',
    ],
    hairColors: [
        '#1a1a1a','#4a3000','#8B4513','#D2691E',
        '#DAA520','#C0C0C0','#ffffff',
        '#8b5cf6','#00f2fe','#f87171','#f472b6','#34d399','#fb923c',
    ],
    eyeColors: [
        '#1a1a2e','#2d5a27','#4a3000','#1565C0',
        '#6a0dad','#00838F','#be123c','#ea580c',
    ],
    lipColors: [
        '#c0686a','#e08080','#ff9999','#8B2252',
        '#d4736e','#f43f5e','#fb923c','#a855f7',
    ],
    outfitColors: [
        '#8b5cf6','#3b82f6','#10b981','#f59e0b',
        '#ef4444','#6366f1','#0ea5e9','#1a1a2e',
        '#ffffff','#f472b6','#14b8a6','#84cc16',
    ],
};

// ============================================================
// الأنماط مع نظام الفتح بالنقاط
// ============================================================

export const HAIR_STYLES = [
    { id:'short',   label:'قصير',    cost:0,   icon:'💇' },
    { id:'long',    label:'طويل',    cost:0,   icon:'👧' },
    { id:'curly',   label:'مجعد',    cost:0,   icon:'🌀' },
    { id:'bun',     label:'كعكة',    cost:50,  icon:'🍩' },
    { id:'mohawk',  label:'موهوك',   cost:100, icon:'⚡' },
    { id:'afro',    label:'أفرو',    cost:150, icon:'🌟' },
    { id:'ponytail',label:'ذيل حصان',cost:200, icon:'🎀' },
    { id:'none',    label:'بدون',    cost:0,   icon:'✨' },
];

export const EYE_STYLES = [
    { id:'normal',  label:'عادي',    cost:0,   icon:'👁️' },
    { id:'happy',   label:'سعيد',    cost:0,   icon:'😊' },
    { id:'cool',    label:'كول',     cost:50,  icon:'😎' },
    { id:'sleepy',  label:'نعسان',   cost:0,   icon:'😴' },
    { id:'star',    label:'نجوم',    cost:150, icon:'⭐' },
    { id:'heart',   label:'قلوب',    cost:200, icon:'❤️' },
];

export const OUTFIT_STYLES = [
    { id:'tshirt',   label:'تيشيرت',  cost:0,   icon:'👕' },
    { id:'hoodie',   label:'هودي',    cost:0,   icon:'🧥' },
    { id:'jacket',   label:'جاكيت',   cost:50,  icon:'🧣' },
    { id:'suit',     label:'بدلة',    cost:100, icon:'👔' },
    { id:'robe',     label:'عباءة',   cost:150, icon:'🧙' },
    { id:'armor',    label:'درع',     cost:300, icon:'⚔️' },
    { id:'royal',    label:'ملكي',    cost:500, icon:'👑' },
    { id:'ninja',    label:'نينجا',   cost:400, icon:'🥷' },
];

export const ACCESSORY_STYLES = [
    { id:'none',       label:'بدون',     cost:0,   icon:'—'  },
    { id:'glasses',    label:'نظارة',    cost:0,   icon:'👓' },
    { id:'headphones', label:'سماعة',    cost:50,  icon:'🎧' },
    { id:'hat',        label:'قبعة',     cost:50,  icon:'🎩' },
    { id:'crown',      label:'تاج',      cost:200, icon:'👑' },
    { id:'mask',       label:'قناع',     cost:150, icon:'🎭' },
    { id:'halo',       label:'هالة',     cost:300, icon:'😇' },
    { id:'devil',      label:'شيطاني',   cost:300, icon:'😈' },
    { id:'cat_ears',   label:'آذان قطة', cost:100, icon:'🐱' },
    { id:'flower',     label:'زهرة',     cost:75,  icon:'🌸' },
];

export const BACKGROUND_STYLES = [
    { id:'space',    label:'فضاء',     cost:0,   icon:'🌌' },
    { id:'galaxy',   label:'مجرة',     cost:100, icon:'✨' },
    { id:'sunset',   label:'غروب',     cost:150, icon:'🌅' },
    { id:'neon',     label:'نيون',     cost:200, icon:'💜' },
    { id:'fire',     label:'نار',      cost:250, icon:'🔥' },
    { id:'ice',      label:'جليد',     cost:250, icon:'❄️' },
];

// ============================================================
// Default character
// ============================================================

export const DEFAULT_CHAR = {
    skinColor:   '#F1C27D',
    hairColor:   '#1a1a1a',
    hairStyle:   'short',
    eyeColor:    '#1a1a2e',
    eyeStyle:    'normal',
    lipColor:    '#c0686a',
    outfitColor: '#8b5cf6',
    outfitStyle: 'tshirt',
    accessory:   'none',
    background:  'space',
};

// ============================================================
// بناء الـ SVG
// ============================================================

export function buildAvatar(char = {}, size = 80) {
    const c  = { ...DEFAULT_CHAR, ...char };
    const s  = size;
    const cx = s / 2;

    const headR  = s * 0.22;
    const headCY = s * 0.30;
    const bodyTop= headCY + headR - 2;
    const bodyH  = s * 0.30;
    const bodyW  = s * 0.38;
    const neckH  = s * 0.05;

    const bg = drawBackground(c, s, cx);

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
        <defs>
            <clipPath id="av-clip-${s}x${Math.random().toString(36).slice(2,6)}">
                <circle cx="${cx}" cy="${cx}" r="${cx - 1}"/>
            </clipPath>
            <radialGradient id="sg-${s}" cx="45%" cy="35%">
                <stop offset="0%" stop-color="${lighten(c.skinColor, 18)}"/>
                <stop offset="100%" stop-color="${c.skinColor}"/>
            </radialGradient>
            <filter id="shadow-${s}">
                <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3"/>
            </filter>
        </defs>

        <!-- خلفية -->
        ${bg}
        <circle cx="${cx}" cy="${cx}" r="${cx - 1}" fill="none" stroke="rgba(139,92,246,0.4)" stroke-width="1.5"/>

        <g clip-path="url(#av-clip-${s}x${Math.random().toString(36).slice(2,6)})">
            ${drawOutfit(c, cx, bodyTop, bodyW, bodyH, s)}

            <!-- رقبة -->
            <rect x="${cx - s*0.065}" y="${headCY + headR - 3}" width="${s*0.13}" height="${neckH + 5}"
                  fill="${c.skinColor}"/>

            <!-- رأس -->
            <ellipse cx="${cx}" cy="${headCY}" rx="${headR}" ry="${headR * 1.06}"
                     fill="url(#sg-${s})" filter="url(#shadow-${s})"/>

            <!-- أذنان -->
            <ellipse cx="${cx - headR + 1}" cy="${headCY + 2}" rx="${s*0.04}" ry="${s*0.05}" fill="${c.skinColor}"/>
            <ellipse cx="${cx + headR - 1}" cy="${headCY + 2}" rx="${s*0.04}" ry="${s*0.05}" fill="${c.skinColor}"/>
            <ellipse cx="${cx - headR + 2}" cy="${headCY + 2}" rx="${s*0.022}" ry="${s*0.03}" fill="${darken(c.skinColor, 8)}"/>
            <ellipse cx="${cx + headR - 2}" cy="${headCY + 2}" rx="${s*0.022}" ry="${s*0.03}" fill="${darken(c.skinColor, 8)}"/>

            ${drawHair(c, cx, headCY, headR, s)}
            ${drawEyes(c, cx, headCY, headR, s)}

            <!-- أنف -->
            <path d="M ${cx - s*0.025} ${headCY + headR*0.22} Q ${cx} ${headCY + headR*0.42} ${cx + s*0.025} ${headCY + headR*0.22}"
                  stroke="${darken(c.skinColor, 20)}" stroke-width="1" fill="none" opacity="0.5"/>

            ${drawMouth(c, cx, headCY, headR, s)}
            ${drawAccessory(c, cx, headCY, headR, s)}
        </g>
    </svg>`;
}

// ============================================================
// الخلفية
// ============================================================

function drawBackground(c, s, cx) {
    const bg = c.background || 'space';

    const bgs = {
        space:   `<circle cx="${cx}" cy="${cx}" r="${cx}" fill="#0a0a1e"/>
                  ${stars(s, cx, 12)}`,
        galaxy:  `<circle cx="${cx}" cy="${cx}" r="${cx}" fill="#0d0020"/>
                  <ellipse cx="${cx}" cy="${cx}" rx="${cx*0.7}" ry="${cx*0.3}" fill="rgba(139,92,246,0.15)" transform="rotate(-20,${cx},${cx})"/>
                  ${stars(s, cx, 18)}`,
        sunset:  `<defs><linearGradient id="sungrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#7c3aed"/>
                  </linearGradient></defs>
                  <circle cx="${cx}" cy="${cx}" r="${cx}" fill="url(#sungrad)"/>`,
        neon:    `<circle cx="${cx}" cy="${cx}" r="${cx}" fill="#0a001a"/>
                  <circle cx="${cx}" cy="${cx}" r="${cx*0.85}" fill="none" stroke="rgba(139,92,246,0.3)" stroke-width="2"/>
                  <circle cx="${cx}" cy="${cx}" r="${cx*0.65}" fill="none" stroke="rgba(0,242,254,0.2)" stroke-width="1.5"/>`,
        fire:    `<defs><radialGradient id="fireg" cx="50%" cy="80%">
                      <stop offset="0%" stop-color="#fbbf24"/><stop offset="60%" stop-color="#ef4444"/><stop offset="100%" stop-color="#1a0000"/>
                  </radialGradient></defs>
                  <circle cx="${cx}" cy="${cx}" r="${cx}" fill="url(#fireg)"/>`,
        ice:     `<defs><radialGradient id="iceg" cx="50%" cy="20%">
                      <stop offset="0%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#0c4a6e"/>
                  </radialGradient></defs>
                  <circle cx="${cx}" cy="${cx}" r="${cx}" fill="url(#iceg)"/>`,
    };
    return bgs[bg] || bgs.space;
}

function stars(s, cx, count) {
    return Array.from({length: count}, () => {
        const x = Math.random() * s;
        const y = Math.random() * s * 0.6;
        const r = 0.5 + Math.random() * 1;
        const op = 0.4 + Math.random() * 0.6;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="white" opacity="${op.toFixed(2)}"/>`;
    }).join('');
}

// ============================================================
// الشعر
// ============================================================

function drawHair(c, cx, cy, r, s) {
    const hc = c.hairColor;
    const hs = c.hairStyle;
    if (hs === 'none') return '';

    if (hs === 'short') return `
        <ellipse cx="${cx}" cy="${cy - r*0.6}" rx="${r*1.06}" ry="${r*0.58}" fill="${hc}"/>
        <rect x="${cx - r}" y="${cy - r*0.55}" width="${r*2}" height="${r*0.35}" fill="${hc}"/>
        <ellipse cx="${cx - r + 1}" cy="${cy}" rx="${s*0.048}" ry="${r*0.42}" fill="${hc}"/>
        <ellipse cx="${cx + r - 1}" cy="${cy}" rx="${s*0.048}" ry="${r*0.42}" fill="${hc}"/>
    `;
    if (hs === 'long') return `
        <ellipse cx="${cx}" cy="${cy - r*0.6}" rx="${r*1.06}" ry="${r*0.58}" fill="${hc}"/>
        <rect x="${cx - r}" y="${cy - r*0.55}" width="${r*2}" height="${r*0.35}" fill="${hc}"/>
        <rect x="${cx - r - 3}" y="${cy}" width="${r*0.55}" height="${r*1.9}" fill="${hc}" rx="7"/>
        <rect x="${cx + r - r*0.55 + 3}" y="${cy}" width="${r*0.55}" height="${r*1.9}" fill="${hc}" rx="7"/>
    `;
    if (hs === 'curly') return `
        <ellipse cx="${cx}" cy="${cy - r*0.5}" rx="${r*1.18}" ry="${r*0.68}" fill="${hc}"/>
        ${Array.from({length:8},(_,i)=>{
            const a=(i/8)*Math.PI*2-Math.PI/2;
            const ex=cx+(r+s*0.06)*Math.cos(a);
            const ey=cy-r*0.3+(r+s*0.06)*Math.sin(a)*0.5;
            return `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${s*0.058}" fill="${hc}"/>`;
        }).join('')}
    `;
    if (hs === 'bun') return `
        <ellipse cx="${cx}" cy="${cy - r*0.65}" rx="${r*1.06}" ry="${r*0.42}" fill="${hc}"/>
        <circle cx="${cx}" cy="${cy - r*1.08}" r="${r*0.42}" fill="${hc}"/>
        <circle cx="${cx}" cy="${cy - r*1.08}" r="${r*0.24}" fill="${darken(hc, 15)}"/>
        <path d="M ${cx - r*0.18} ${cy - r*0.82} Q ${cx} ${cy - r*1.06} ${cx + r*0.18} ${cy - r*0.82}"
              stroke="${darken(hc,10)}" stroke-width="1" fill="none"/>
    `;
    if (hs === 'mohawk') return `
        <ellipse cx="${cx}" cy="${cy - r*0.6}" rx="${r*1.06}" ry="${r*0.38}" fill="${hc}"/>
        <rect x="${cx - s*0.055}" y="${cy - r*1.7}" width="${s*0.11}" height="${r*1.15}" fill="${hc}" rx="5"/>
        <ellipse cx="${cx}" cy="${cy - r*1.7}" rx="${s*0.055}" ry="${s*0.04}" fill="${lighten(hc,20)}"/>
    `;
    if (hs === 'afro') return `
        <circle cx="${cx}" cy="${cy - r*0.3}" r="${r*1.28}" fill="${hc}"/>
        <circle cx="${cx - r*1.05}" cy="${cy + r*0.1}" r="${r*0.4}" fill="${hc}"/>
        <circle cx="${cx + r*1.05}" cy="${cy + r*0.1}" r="${r*0.4}" fill="${hc}"/>
    `;
    if (hs === 'ponytail') return `
        <ellipse cx="${cx}" cy="${cy - r*0.6}" rx="${r*1.06}" ry="${r*0.58}" fill="${hc}"/>
        <rect x="${cx - r}" y="${cy - r*0.55}" width="${r*2}" height="${r*0.35}" fill="${hc}"/>
        <path d="M ${cx + r*0.5} ${cy - r*0.3} Q ${cx + r*1.4} ${cy + r*0.5} ${cx + r*0.8} ${cy + r*1.5}"
              stroke="${hc}" stroke-width="${s*0.07}" fill="none" stroke-linecap="round"/>
        <circle cx="${cx + r*0.65}" cy="${cy - r*0.25}" r="${s*0.04}" fill="${darken(hc,15)}"/>
    `;
    return '';
}

// ============================================================
// العيون
// ============================================================

function drawEyes(c, cx, cy, r, s) {
    const ex1 = cx - r*0.38, ex2 = cx + r*0.38;
    const ey  = cy - r*0.06;
    const er  = s * 0.047;
    const ec  = c.eyeColor;
    const es  = c.eyeStyle;

    // حواجب (مشتركة)
    const brows = `
        <path d="M ${ex1-er*0.9} ${ey-er*1.5} Q ${ex1} ${ey-er*2.0} ${ex1+er*0.9} ${ey-er*1.5}"
              stroke="${c.hairColor}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <path d="M ${ex2-er*0.9} ${ey-er*1.5} Q ${ex2} ${ey-er*2.0} ${ex2+er*0.9} ${ey-er*1.5}"
              stroke="${c.hairColor}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    `;

    if (es === 'happy') return brows + `
        <path d="M ${ex1-er} ${ey} Q ${ex1} ${ey-er*1.3} ${ex1+er} ${ey}"
              stroke="${ec}" stroke-width="1.6" fill="${lighten(ec,50)}" stroke-linecap="round"/>
        <path d="M ${ex2-er} ${ey} Q ${ex2} ${ey-er*1.3} ${ex2+er} ${ey}"
              stroke="${ec}" stroke-width="1.6" fill="${lighten(ec,50)}" stroke-linecap="round"/>
    `;
    if (es === 'cool') return `
        <line x1="${ex1-er}" y1="${ey-er*0.4}" x2="${ex1+er}" y2="${ey-er*0.4}"
              stroke="${darken(c.hairColor,5)}" stroke-width="2" stroke-linecap="round"/>
        <line x1="${ex2-er}" y1="${ey-er*0.4}" x2="${ex2+er}" y2="${ey-er*0.4}"
              stroke="${darken(c.hairColor,5)}" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="${ex1}" cy="${ey+er*0.35}" rx="${er*0.92}" ry="${er*0.58}" fill="${ec}"/>
        <ellipse cx="${ex2}" cy="${ey+er*0.35}" rx="${er*0.92}" ry="${er*0.58}" fill="${ec}"/>
        <circle cx="${ex1+er*0.28}" cy="${ey+er*0.18}" r="${er*0.28}" fill="white"/>
        <circle cx="${ex2+er*0.28}" cy="${ey+er*0.18}" r="${er*0.28}" fill="white"/>
    `;
    if (es === 'sleepy') return brows + `
        <path d="M ${ex1-er} ${ey} Q ${ex1} ${ey+er*0.9} ${ex1+er} ${ey}"
              stroke="${ec}" stroke-width="1.5" fill="${lighten(ec,40)}" stroke-linecap="round"/>
        <path d="M ${ex2-er} ${ey} Q ${ex2} ${ey+er*0.9} ${ex2+er} ${ey}"
              stroke="${ec}" stroke-width="1.5" fill="${lighten(ec,40)}" stroke-linecap="round"/>
    `;
    if (es === 'star') return brows + `
        <text x="${ex1}" y="${ey+er*0.8}" font-size="${er*2}" fill="${ec}" text-anchor="middle">⭐</text>
        <text x="${ex2}" y="${ey+er*0.8}" font-size="${er*2}" fill="${ec}" text-anchor="middle">⭐</text>
    `;
    if (es === 'heart') return brows + `
        <text x="${ex1}" y="${ey+er*0.8}" font-size="${er*2}" fill="${ec}" text-anchor="middle">❤️</text>
        <text x="${ex2}" y="${ey+er*0.8}" font-size="${er*2}" fill="${ec}" text-anchor="middle">❤️</text>
    `;
    // normal
    return brows + `
        <ellipse cx="${ex1}" cy="${ey}" rx="${er}" ry="${er*1.12}" fill="white"/>
        <ellipse cx="${ex2}" cy="${ey}" rx="${er}" ry="${er*1.12}" fill="white"/>
        <circle cx="${ex1}" cy="${ey}" r="${er*0.68}" fill="${ec}"/>
        <circle cx="${ex2}" cy="${ey}" r="${er*0.68}" fill="${ec}"/>
        <circle cx="${ex1}" cy="${ey}" r="${er*0.3}" fill="#000" opacity="0.85"/>
        <circle cx="${ex2}" cy="${ey}" r="${er*0.3}" fill="#000" opacity="0.85"/>
        <circle cx="${ex1+er*0.24}" cy="${ey-er*0.24}" r="${er*0.15}" fill="white"/>
        <circle cx="${ex2+er*0.24}" cy="${ey-er*0.24}" r="${er*0.15}" fill="white"/>
    `;
}

// ============================================================
// الفم
// ============================================================

function drawMouth(c, cx, cy, r, s) {
    const my = cy + r * 0.5;
    const mw = r * 0.52;
    return `
        <path d="M ${cx-mw} ${my} Q ${cx} ${my+r*0.3} ${cx+mw} ${my}"
              stroke="${c.lipColor}" stroke-width="1.5" fill="${lighten(c.lipColor,20)}" opacity="0.9"
              stroke-linecap="round"/>
        <path d="M ${cx-mw*0.4} ${my} L ${cx+mw*0.4} ${my}"
              stroke="${darken(c.lipColor,10)}" stroke-width="0.7" opacity="0.5"/>
    `;
}

// ============================================================
// الملابس
// ============================================================

function drawOutfit(c, cx, bodyTop, bodyW, bodyH, s) {
    const oc  = c.outfitColor;
    const bx  = cx - bodyW/2;
    const by  = bodyTop + s*0.04;
    const os  = c.outfitStyle;

    const sleeve = (side) => {
        const sx = side === 'L' ? bx - s*0.07 : bx + bodyW - s*0.03;
        return `<rect x="${sx}" y="${by}" width="${s*0.10}" height="${bodyH*0.65}" fill="${oc}" rx="5"/>`;
    };

    if (os === 'tshirt') return `
        <rect x="${bx}" y="${by}" width="${bodyW}" height="${bodyH}" fill="${oc}" rx="8"/>
        ${sleeve('L')}${sleeve('R')}
        <path d="M ${cx-bodyW*0.22} ${by+2} Q ${cx} ${by+s*0.07} ${cx+bodyW*0.22} ${by+2}"
              stroke="${darken(oc,20)}" stroke-width="1.2" fill="none"/>
    `;
    if (os === 'hoodie') return `
        <rect x="${bx}" y="${by}" width="${bodyW}" height="${bodyH}" fill="${oc}" rx="10"/>
        <path d="M ${cx-bodyW*0.2} ${by} Q ${cx} ${by+bodyH*0.28} ${cx+bodyW*0.2} ${by}"
              fill="${darken(oc,18)}" opacity="0.7"/>
        <rect x="${cx-bodyW*0.28}" y="${by+bodyH*0.55}" width="${bodyW*0.56}" height="${bodyH*0.32}"
              fill="${darken(oc,22)}" rx="6" opacity="0.6"/>
        ${sleeve('L')}${sleeve('R')}
    `;
    if (os === 'jacket') return `
        <rect x="${bx}" y="${by}" width="${bodyW}" height="${bodyH}" fill="${oc}" rx="8"/>
        ${sleeve('L')}${sleeve('R')}
        <line x1="${cx}" y1="${by}" x2="${cx}" y2="${by+bodyH}" stroke="${darken(oc,28)}" stroke-width="2" opacity="0.6"/>
        <rect x="${bx+s*0.03}" y="${by+bodyH*0.5}" width="${bodyW*0.28}" height="${bodyH*0.32}" fill="${darken(oc,22)}" rx="4" opacity="0.5"/>
        <rect x="${bx+bodyW-bodyW*0.28-s*0.03}" y="${by+bodyH*0.5}" width="${bodyW*0.28}" height="${bodyH*0.32}" fill="${darken(oc,22)}" rx="4" opacity="0.5"/>
    `;
    if (os === 'suit') return `
        <rect x="${bx}" y="${by}" width="${bodyW}" height="${bodyH}" fill="${darken(oc,12)}" rx="8"/>
        <rect x="${cx-bodyW*0.2}" y="${by}" width="${bodyW*0.4}" height="${bodyH}" fill="white" opacity="0.9"/>
        <path d="M ${cx-bodyW*0.2} ${by} L ${cx-bodyW*0.06} ${by+bodyH*0.45}" stroke="${darken(oc,12)}" stroke-width="2.5" fill="none"/>
        <path d="M ${cx+bodyW*0.2} ${by} L ${cx+bodyW*0.06} ${by+bodyH*0.45}" stroke="${darken(oc,12)}" stroke-width="2.5" fill="none"/>
        <path d="M ${cx-s*0.03} ${by+s*0.02} L ${cx} ${by+bodyH*0.72} L ${cx+s*0.03} ${by+s*0.02} Z" fill="#ef4444"/>
        <rect x="${bx-s*0.06}" y="${by}" width="${s*0.10}" height="${bodyH*0.5}" fill="${darken(oc,12)}" rx="5"/>
        <rect x="${bx+bodyW-s*0.04}" y="${by}" width="${s*0.10}" height="${bodyH*0.5}" fill="${darken(oc,12)}" rx="5"/>
    `;
    if (os === 'robe') return `
        <path d="M ${cx-bodyW*0.12} ${by} L ${bx-s*0.05} ${by+bodyH} L ${bx+bodyW+s*0.05} ${by+bodyH} L ${cx+bodyW*0.12} ${by} Z"
              fill="${oc}" opacity="0.95"/>
        <line x1="${cx}" y1="${by}" x2="${cx}" y2="${by+bodyH}" stroke="${darken(oc,22)}" stroke-width="1.5" opacity="0.5"/>
        <text x="${cx-bodyW*0.22}" y="${by+bodyH*0.42}" font-size="${s*0.09}" fill="gold" opacity="0.7">✦</text>
        <text x="${cx+bodyW*0.1}" y="${by+bodyH*0.65}" font-size="${s*0.07}" fill="gold" opacity="0.5">✦</text>
    `;
    if (os === 'armor') return `
        <rect x="${bx}" y="${by}" width="${bodyW}" height="${bodyH}" fill="${darken(oc,5)}" rx="6"/>
        <path d="M ${cx-bodyW*0.35} ${by} L ${cx-bodyW*0.2} ${by+bodyH*0.5} L ${cx} ${by+bodyH*0.3} L ${cx+bodyW*0.2} ${by+bodyH*0.5} L ${cx+bodyW*0.35} ${by}"
              fill="${lighten(oc,15)}" opacity="0.6"/>
        <rect x="${bx-s*0.08}" y="${by}" width="${s*0.11}" height="${bodyH*0.75}" fill="${darken(oc,8)}" rx="4"/>
        <rect x="${bx+bodyW-s*0.03}" y="${by}" width="${s*0.11}" height="${bodyH*0.75}" fill="${darken(oc,8)}" rx="4"/>
        <circle cx="${cx}" cy="${by+bodyH*0.25}" r="${s*0.05}" fill="gold" opacity="0.8"/>
    `;
    if (os === 'royal') return `
        <rect x="${bx}" y="${by}" width="${bodyW}" height="${bodyH}" fill="${oc}" rx="8"/>
        <rect x="${bx-s*0.06}" y="${by}" width="${s*0.10}" height="${bodyH*0.65}" fill="${oc}" rx="5"/>
        <rect x="${bx+bodyW-s*0.04}" y="${by}" width="${s*0.10}" height="${bodyH*0.65}" fill="${oc}" rx="5"/>
        ${[0,1,2,3,4].map(i=>`<circle cx="${bx+bodyW*0.15+i*bodyW*0.18}" cy="${by+s*0.05}" r="${s*0.025}" fill="gold" opacity="0.9"/>`).join('')}
        <rect x="${cx-bodyW*0.3}" y="${by+bodyH*0.12}" width="${bodyW*0.6}" height="${bodyH*0.06}" fill="gold" opacity="0.5" rx="3"/>
        <rect x="${cx-bodyW*0.3}" y="${by+bodyH*0.45}" width="${bodyW*0.6}" height="${bodyH*0.06}" fill="gold" opacity="0.4" rx="3"/>
    `;
    if (os === 'ninja') return `
        <rect x="${bx}" y="${by}" width="${bodyW}" height="${bodyH}" fill="${darken(oc,30)}" rx="8"/>
        <rect x="${bx-s*0.07}" y="${by}" width="${s*0.11}" height="${bodyH*0.7}" fill="${darken(oc,30)}" rx="5"/>
        <rect x="${bx+bodyW-s*0.04}" y="${by}" width="${s*0.11}" height="${bodyH*0.7}" fill="${darken(oc,30)}" rx="5"/>
        <rect x="${cx-bodyW*0.4}" y="${by+bodyH*0.08}" width="${bodyW*0.8}" height="${bodyH*0.08}" fill="${oc}" opacity="0.5" rx="3"/>
    `;
    return `<rect x="${bx}" y="${by}" width="${bodyW}" height="${bodyH}" fill="${oc}" rx="8"/>`;
}

// ============================================================
// الإكسسوار
// ============================================================

function drawAccessory(c, cx, cy, r, s) {
    const ac = c.accessory;
    if (ac === 'none') return '';

    if (ac === 'glasses') return `
        <rect x="${cx-r*0.82}" y="${cy-r*0.14}" width="${r*0.62}" height="${r*0.52}" rx="${r*0.16}"
              stroke="#aaa" stroke-width="1.2" fill="rgba(100,200,255,0.12)"/>
        <rect x="${cx+r*0.20}" y="${cy-r*0.14}" width="${r*0.62}" height="${r*0.52}" rx="${r*0.16}"
              stroke="#aaa" stroke-width="1.2" fill="rgba(100,200,255,0.12)"/>
        <line x1="${cx-r*0.2}" y1="${cy+r*0.06}" x2="${cx+r*0.2}" y2="${cy+r*0.06}" stroke="#aaa" stroke-width="1"/>
        <line x1="${cx-r*0.82}" y1="${cy+r*0.12}" x2="${cx-r*1.0}" y2="${cy+r*0.05}" stroke="#aaa" stroke-width="1"/>
        <line x1="${cx+r*0.82}" y1="${cy+r*0.12}" x2="${cx+r*1.0}" y2="${cy+r*0.05}" stroke="#aaa" stroke-width="1"/>
    `;
    if (ac === 'headphones') return `
        <path d="M ${cx-r*0.95} ${cy} A ${r*0.95} ${r*0.95} 0 0 1 ${cx+r*0.95} ${cy}"
              stroke="#222" stroke-width="${s*0.045}" fill="none" stroke-linecap="round"/>
        <rect x="${cx-r*1.1}" y="${cy-r*0.18}" width="${r*0.38}" height="${r*0.58}" fill="#8b5cf6" rx="${r*0.1}"/>
        <rect x="${cx+r*0.72}" y="${cy-r*0.18}" width="${r*0.38}" height="${r*0.58}" fill="#8b5cf6" rx="${r*0.1}"/>
        <rect x="${cx-r*1.06}" y="${cy-r*0.05}" width="${r*0.3}" height="${r*0.3}" fill="#a78bfa" rx="${r*0.06}"/>
        <rect x="${cx+r*0.76}" y="${cy-r*0.05}" width="${r*0.3}" height="${r*0.3}" fill="#a78bfa" rx="${r*0.06}"/>
    `;
    if (ac === 'hat') return `
        <ellipse cx="${cx}" cy="${cy-r*0.82}" rx="${r*1.15}" ry="${r*0.22}" fill="${c.hairColor}"/>
        <rect x="${cx-r*0.68}" y="${cy-r*1.65}" width="${r*1.36}" height="${r*0.88}" fill="${c.hairColor}" rx="5"/>
        <rect x="${cx-r*0.58}" y="${cy-r*0.84}" width="${r*1.16}" height="${r*0.12}" fill="${lighten(c.hairColor,25)}" opacity="0.5"/>
    `;
    if (ac === 'crown') return `
        <path d="M ${cx-r*0.62} ${cy-r*0.95} L ${cx-r*0.62} ${cy-r*1.38} L ${cx-r*0.3} ${cy-r*1.12}
                 L ${cx} ${cy-r*1.5} L ${cx+r*0.3} ${cy-r*1.12} L ${cx+r*0.62} ${cy-r*1.38}
                 L ${cx+r*0.62} ${cy-r*0.95} Z"
              fill="gold" stroke="#b8860b" stroke-width="0.8"/>
        <circle cx="${cx}" cy="${cy-r*1.5}" r="${r*0.12}" fill="#ef4444"/>
        <circle cx="${cx-r*0.62}" cy="${cy-r*1.38}" r="${r*0.09}" fill="#3b82f6"/>
        <circle cx="${cx+r*0.62}" cy="${cy-r*1.38}" r="${r*0.09}" fill="#3b82f6"/>
        <rect x="${cx-r*0.58}" y="${cy-r*0.97}" width="${r*1.16}" height="${r*0.12}" fill="${lighten('gold',10)}" opacity="0.6" rx="2"/>
    `;
    if (ac === 'mask') return `
        <ellipse cx="${cx}" cy="${cy+r*0.22}" rx="${r*0.72}" ry="${r*0.38}" fill="rgba(0,0,0,0.7)" rx="8"/>
        <ellipse cx="${cx}" cy="${cy+r*0.22}" rx="${r*0.72}" ry="${r*0.38}" fill="none" stroke="${c.outfitColor}" stroke-width="1.5"/>
    `;
    if (ac === 'halo') return `
        <ellipse cx="${cx}" cy="${cy-r*1.18}" rx="${r*0.65}" ry="${r*0.14}" fill="none"
                 stroke="gold" stroke-width="2.5" opacity="0.9"/>
        <ellipse cx="${cx}" cy="${cy-r*1.18}" rx="${r*0.65}" ry="${r*0.14}" fill="none"
                 stroke="gold" stroke-width="6" opacity="0.15"/>
    `;
    if (ac === 'devil') return `
        <path d="M ${cx-r*0.5} ${cy-r*0.95} L ${cx-r*0.7} ${cy-r*1.45} L ${cx-r*0.3} ${cy-r*0.95}" fill="#ef4444" opacity="0.9"/>
        <path d="M ${cx+r*0.5} ${cy-r*0.95} L ${cx+r*0.7} ${cy-r*1.45} L ${cx+r*0.3} ${cy-r*0.95}" fill="#ef4444" opacity="0.9"/>
    `;
    if (ac === 'cat_ears') return `
        <path d="M ${cx-r*0.7} ${cy-r*0.85} L ${cx-r*0.55} ${cy-r*1.4} L ${cx-r*0.25} ${cy-r*0.88}" fill="${c.hairColor}"/>
        <path d="M ${cx+r*0.7} ${cy-r*0.85} L ${cx+r*0.55} ${cy-r*1.4} L ${cx+r*0.25} ${cy-r*0.88}" fill="${c.hairColor}"/>
        <path d="M ${cx-r*0.62} ${cy-r*0.9} L ${cx-r*0.52} ${cy-r*1.28} L ${cx-r*0.3} ${cy-r*0.92}" fill="pink" opacity="0.6"/>
        <path d="M ${cx+r*0.62} ${cy-r*0.9} L ${cx+r*0.52} ${cy-r*1.28} L ${cx+r*0.3} ${cy-r*0.92}" fill="pink" opacity="0.6"/>
    `;
    if (ac === 'flower') return `
        ${[0,1,2,3,4].map(i=>{
            const a=(i/5)*Math.PI*2;
            const fx=cx-r*0.85+Math.cos(a)*r*0.15;
            const fy=cy-r*0.82+Math.sin(a)*r*0.15;
            return `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="${r*0.11}" fill="#f472b6" opacity="0.9"/>`;
        }).join('')}
        <circle cx="${cx-r*0.85}" cy="${cy-r*0.82}" r="${r*0.09}" fill="#fbbf24"/>
    `;
    return '';
}

// ============================================================
// Helpers
// ============================================================

function hexToRgb(hex) {
    const h = hex.replace('#','');
    if (h.length !== 6) return [150,150,150];
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

function rgbToHex(r,g,b) {
    return '#'+[r,g,b].map(v=>Math.min(255,Math.max(0,Math.round(v))).toString(16).padStart(2,'0')).join('');
}

export function lighten(hex,pct) {
    try { const [r,g,b]=hexToRgb(hex); return rgbToHex(r+(255-r)*pct/100,g+(255-g)*pct/100,b+(255-b)*pct/100); }
    catch { return hex; }
}

export function darken(hex,pct) {
    try { const [r,g,b]=hexToRgb(hex); return rgbToHex(r*(1-pct/100),g*(1-pct/100),b*(1-pct/100)); }
    catch { return hex; }
}

export async function loadAvatar(uid, db, ref, get) {
    try { const s=await get(ref(db,`users/${uid}/avatar`)); return s.exists()?s.val():DEFAULT_CHAR; }
    catch { return DEFAULT_CHAR; }
}
