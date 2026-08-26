#!/usr/bin/env node
/**
 * generate-scripts-data.js
 * ------------------------------------------------------------
 * يجيب كل السكربتات من Firebase Realtime Database ويطلع ملف
 * scripts-data.js (window.__SCRIPTS_DATA__) — ده اللي بيستخدمه
 * script.html (صفحة عرض السكربت) و scripts.html (صفحة القائمة)
 * كرسم أولي فوري قبل ما Firebase يرد، لصالح السيو وبوتات الزحف.
 *
 * ملاحظة: مقصودًا بيستبعد حقل الصورة (image) لأنها base64 كبيرة
 * جدًا — ده اللي كان بيخلي scripts.html توصل 1.5 ميجا. الصور
 * بترجع عادي أول ما Firebase يرد فعليًا (JS الحي مش متأثر).
 *
 * الاستخدام:
 *   node generate-scripts-data.js
 *
 * الأفضل تشغّله بشكل دوري (مثلاً كل ساعة عبر GitHub Actions cron
 * أو أي جدولة تانية عندك) عشان الملف الثابت يفضل قريب من الداتا
 * الحقيقية.
 * ------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATABASE_URL = 'https://ccraft-space-scripts-default-rtdb.firebaseio.com';
const OUTPUT_FILE = path.join(__dirname, 'scripts-data.js');

// الحقول اللي بنسيبها في الملف الثابت — من غير الصورة والتعليقات
// (دول بيتحمّلوا لايف من Firebase أول ما الصفحة تفتح)
const KEEP_FIELDS = [
    'title', 'code', 'description', 'category', 'map',
    'author', 'authorEmail', 'authorUid', 'timestamp',
    'rating', 'votes', 'likes', 'hasKey', 'key', 'tags', 'verified',
];

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                reject(new Error(`HTTP ${res.statusCode} — ${url}`));
                res.resume();
                return;
            }
            let raw = '';
            res.on('data', chunk => { raw += chunk; });
            res.on('end', () => {
                try { resolve(JSON.parse(raw)); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function slim(script) {
    const out = {};
    for (const field of KEEP_FIELDS) {
        if (script[field] !== undefined) out[field] = script[field];
    }
    return out;
}

async function main() {
    console.log('⏳ جارٍ جلب السكربتات من Firebase...');
    const raw = await fetchJSON(`${DATABASE_URL}/scripts.json`);

    if (!raw || typeof raw !== 'object') {
        throw new Error('الرد من Firebase فاضي أو غير متوقع — تأكد من DATABASE_URL وقواعد القراءة.');
    }

    const slimmed = {};
    let count = 0;
    for (const [id, script] of Object.entries(raw)) {
        if (!script || !script.title) continue; // تجاهل السجلات التالفة
        slimmed[id] = slim(script);
        count++;
    }

    const banner =
`/* ============================================================
   scripts-data.js — يتولّد أوتوماتيك، متعدلوش يدوي.
   آخر تحديث: ${new Date().toISOString()}
   عدد السكربتات: ${count}
   ============================================================ */
`;

    const body = `window.__SCRIPTS_DATA__ = ${JSON.stringify(slimmed)};\n`;

    fs.writeFileSync(OUTPUT_FILE, banner + body, 'utf8');

    const sizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
    console.log(`✅ تم إنشاء ${OUTPUT_FILE}`);
    console.log(`   ${count} سكربت — الحجم: ${sizeKB} كيلوبايت`);
}

main().catch(err => {
    console.error('❌ فشل توليد scripts-data.js:', err.message);
    process.exit(1);
});
