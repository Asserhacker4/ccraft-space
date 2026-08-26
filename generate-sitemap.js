// generate-sitemap.js
// ============================================================
// بيولّد sitemap.xml من بيانات السكربتات في Firebase مباشرة
// (نفس القاعدة اللي بتقرا منها scripts-data.js) — من غير أي
// مفتاح سري، لأن قراءة scripts عندك عامة (public read).
// ============================================================
//
// تشغيله محليًا: node generate-sitemap.js
// الناتج: sitemap.xml في نفس المجلد — ارفعه في روت الريبو.
//
// أفضل حل: ضيفه كخطوة في نفس GitHub Actions workflow اللي بيولّد
// scripts-data.js، عشان يتحدث تلقائي مع كل سكربت جديد.
// ============================================================

const fs = require("fs");
const https = require("https");

const SITE_URL = "https://ccraftspace.ddnsking.com";
const FIREBASE_SCRIPTS_URL =
  "https://ccraft-space-scripts-default-rtdb.firebaseio.com/scripts.json";

// الصفحات الثابتة المهمة في الموقع — عدّل القائمة دي لو في صفحات ناقصة
const STATIC_PAGES = [
  { path: "/index.html", priority: "1.0", changefreq: "daily" },
  { path: "/scripts.html", priority: "0.9", changefreq: "hourly" },
  { path: "/apks.html", priority: "0.7", changefreq: "daily" },
  { path: "/community.html", priority: "0.6", changefreq: "daily" },
  { path: "/market.html", priority: "0.5", changefreq: "daily" },
  { path: "/leaderboard.html", priority: "0.4", changefreq: "daily" },
  { path: "/top-badges.html", priority: "0.4", changefreq: "daily" },
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function escapeXml(str) {
  return (str || "").replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
    }
  });
}

async function main() {
  console.log("جارٍ جلب بيانات السكربتات من Firebase...");
  const scripts = (await fetchJson(FIREBASE_SCRIPTS_URL)) || {};

  const urls = [];

  // الصفحات الثابتة
  const today = new Date().toISOString().split("T")[0];
  for (const page of STATIC_PAGES) {
    urls.push(
      `  <url>\n` +
        `    <loc>${SITE_URL}${page.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${page.changefreq}</changefreq>\n` +
        `    <priority>${page.priority}</priority>\n` +
        `  </url>`
    );
  }

  // صفحة كل سكربت
  let count = 0;
  for (const [id, s] of Object.entries(scripts)) {
    if (!s || !s.title || !s.title.trim()) continue; // تجاهل السجلات التالفة
    const lastmod = s.timestamp
      ? new Date(s.timestamp).toISOString().split("T")[0]
      : today;
    urls.push(
      `  <url>\n` +
        `    <loc>${SITE_URL}/script.html?id=${encodeURIComponent(id)}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>weekly</changefreq>\n` +
        `    <priority>0.8</priority>\n` +
        `  </url>`
    );
    count++;
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join("\n") +
    `\n</urlset>\n`;

  fs.writeFileSync("sitemap.xml", xml, "utf8");
  console.log(`✅ اتولّد sitemap.xml فيه ${count} سكربت + ${STATIC_PAGES.length} صفحة ثابتة`);
}

main().catch((err) => {
  console.error("❌ فشل توليد sitemap.xml:", err);
  process.exit(1);
});
