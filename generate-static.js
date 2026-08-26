/**
 * generate-static.js
 * ------------------------------------------------------------
 * بيسحب كل السكربتات من Firebase Realtime Database ويولّد
 * كروت HTML ثابتة (نصوص حقيقية) ويحقنها جوه scripts.html
 * بين علامتين خاصتين، عشان بوت Google يشوف محتوى حقيقي
 * فور ما يفتح الصفحة، قبل ما JavaScript يشتغل أصلاً.
 *
 * الاستخدام:
 *   node generate-static.js
 *
 * شغّله قبل كل رفعة (push) على GitHub Pages، أو حطه كـ
 * GitHub Action يشتغل تلقائي كل ما تتغير بيانات السكربتات.
 * ------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

// ---- إعدادات ----
const FIREBASE_URL  = 'https://ccraft-space-scripts-default-rtdb.firebaseio.com/scripts.json';
const HTML_FILE      = path.join(__dirname, 'scripts.html');
const START_MARKER  = '<!--STATIC_SCRIPTS_START-->';
const END_MARKER    = '<!--STATIC_SCRIPTS_END-->';

function escHTML(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- بناء كارت HTML واحد (نسخة مبسطة، ثابتة، بدون تفاعل) ----
function buildCard(s) {
    const avg = s.votes ? (s.rating / s.votes) : 0;
    const stars = [1, 2, 3, 4, 5]
        .map(n => `<span class="sc-star${n <= Math.round(avg) ? ' filled' : ''}">★</span>`)
        .join('');

    const codeFull = escHTML(s.code || '-- لا يوجد كود');
    const codeSnippet = escHTML((s.code || '').replace(/\s+/g, ' ').trim().slice(0, 70));

    return `
<div class="script-card" data-cat="${escHTML(s.category || 'other')}" data-static="1">
    ${s.image ? `<div style="overflow:hidden;border-radius:20px 20px 0 0"><img class="sc-thumb" src="${escHTML(s.image)}" alt="${escHTML(s.title || 'سكربت')}" loading="lazy"></div>` : ''}
    <div class="sc-body">
        <div class="sc-header">
            <div class="sc-title">${escHTML(s.title || 'بدون عنوان')}</div>
            ${s.verified ? '<span style="background:rgba(74,222,128,0.15);color:#4ade80;border:1px solid rgba(74,222,128,0.3);padding:2px 9px;border-radius:50px;font-size:0.62rem;font-weight:900;flex-shrink:0">✅ موثوق</span>' : ''}
        </div>
        <div class="sc-badges">
            <span class="sc-cat">📁 ${escHTML(s.category || '—')}</span>
            ${s.map ? `<span class="sc-map">🗺️ ${escHTML(s.map)}</span>` : ''}
            ${s.key ? '<span class="sc-key-badge">🔑 يتطلب مفتاح</span>' : ''}
        </div>
        <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.6;margin:0">${escHTML((s.description || '').slice(0, 140))}</p>
        <div class="sc-code-snippet">💻 ${codeSnippet}${(s.code || '').length > 70 ? '…' : ''}</div>
        <div class="sc-stats">
            <span class="sc-stat">👍 <strong>${s.likes || 0}</strong></span>
            <span class="sc-stat">👤 ${escHTML(s.author || 'مجهول')}</span>
            <span style="margin-right:auto"></span>
            <div class="sc-stars">${stars}<span class="sc-avg">${s.votes ? avg.toFixed(1) : '—'}</span></div>
        </div>
        <button type="button" class="sc-preview-btn" onclick="event.stopPropagation(); toggleCodePreview(this)">👁️ معاينة سريعة</button>
        <pre class="sc-code-full" onclick="event.stopPropagation()">${codeFull}</pre>
    </div>
    <div class="sc-footer">
        <a class="sc-btn view" href="script.html?id=${encodeURIComponent(s.id)}" style="text-decoration:none;display:flex">👁️ عرض</a>
    </div>
</div>`.trim();
}

async function main() {
    console.log('⏳ بجيب بيانات السكربتات من Firebase...');
    const res = await fetch(FIREBASE_URL);
    if (!res.ok) throw new Error(`فشل الجلب من Firebase: ${res.status}`);
    const data = await res.json();

    if (!data) {
        console.log('⚠️ مفيش سكربتات في قاعدة البيانات.');
        return;
    }

    const scripts = Object.entries(data)
        .map(([id, s]) => ({ id, ...s }))
        .filter(s => s.id && s.title && s.title.trim()); // ✅ استبعاد السجلات التالفة (بدون id أو عنوان)
    // الأحدث أولاً
    scripts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    console.log(`✅ لقيت ${scripts.length} سكربت.`);

    const cardsHTML = scripts.map(buildCard).join('\n');

    if (!fs.existsSync(HTML_FILE)) {
        throw new Error(`مش لاقي الملف: ${HTML_FILE} — حط الملف في نفس مجلد السكريبت ده.`);
    }

    let html = fs.readFileSync(HTML_FILE, 'utf8');

    if (!html.includes(START_MARKER) || !html.includes(END_MARKER)) {
        throw new Error(
            `لازم تحط العلامتين دول جوه scripts.html داخل <div id="scriptsList">:\n` +
            `${START_MARKER}\n${END_MARKER}\n` +
            `بدل الـ loading-grid (أو حواليه).`
        );
    }

    const startIdx = html.indexOf(START_MARKER) + START_MARKER.length;
    const endIdx = html.indexOf(END_MARKER);

    html = html.slice(0, startIdx) + '\n' + cardsHTML + '\n' + html.slice(endIdx);

    fs.writeFileSync(HTML_FILE, html, 'utf8');
    console.log(`✅ تم تحديث ${HTML_FILE} بمحتوى ثابت لـ ${scripts.length} سكربت.`);

    // ---- ملف بيانات ثابت لصفحة script.html (كل السكربتات بالكامل) ----
    const dataMap = {};
    for (const s of scripts) {
        dataMap[s.id] = {
            title: s.title || 'بدون عنوان',
            description: s.description || '',
            code: s.code || '',
            category: s.category || '',
            map: s.map || '',
            author: s.author || 'مجهول',
            authorUid: s.authorUid || '',
            image: s.image || '',
            key: s.key || '',
            likes: s.likes || 0,
            rating: s.rating || 0,
            votes: s.votes || 0,
            timestamp: s.timestamp || 0
        };
    }

    const dataFile = path.join(__dirname, 'scripts-data.js');
    const dataJS = `// ⚠️ ملف مولّد تلقائيًا بواسطة generate-static.js — لا تعدّله يدويًا
window.__SCRIPTS_DATA__ = ${JSON.stringify(dataMap)};
`;
    fs.writeFileSync(dataFile, dataJS, 'utf8');
    console.log(`✅ تم إنشاء ${dataFile} ببيانات ${scripts.length} سكربت لصفحة script.html.`);
}

main().catch(err => {
    console.error('❌ خطأ:', err.message);
    process.exit(1);
});
