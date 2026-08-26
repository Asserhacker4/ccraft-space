import { db, get, ref } from "./supabase-config.js";



// نسخ السكربت
window.copyScript = (id) => {
  const codeEl = document.getElementById(`code-${id}`);
  if (!codeEl) return alert("خطأ في السكربت");
  navigator.clipboard.writeText(codeEl.innerText)
    .then(() => alert("تم نسخ السكربت!"))
    .catch(() => alert("حدث خطأ أثناء النسخ"));
}

// قراءة البحث من الرابط
function getSearchQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('search') ? params.get('search').toLowerCase().trim() : '';
}

// تعديل الرابط عند البحث
function updateURLQuery(query) {
  const url = new URL(window.location);
  if(query) url.searchParams.set('search', query);
  else url.searchParams.delete('search');
  window.history.replaceState(null, '', url);
}

// تحميل السكربتات وعرضها
export async function loadScripts() {
  const list = document.getElementById('scriptsList');
  list.innerHTML = '';
  const snapshot = await get(ref(db, 'scripts'));

  if(snapshot.exists()) {
    const scripts = snapshot.val();
    const query = getSearchQuery();
    let anyMatch = false;

    Object.keys(scripts).forEach(id => {
      const s = scripts[id];
      const title = s.title.toLowerCase();
      const category = s.category.toLowerCase();
      const match = !query || title.includes(query) || category.includes(query);

      const div = document.createElement('div');
      div.className = 'script-card';
      div.dataset.id = id;
      div.innerHTML = `
        <h3>${s.title}</h3>
        <pre id="code-${id}">${s.code}</pre>
        <p>Category: ${s.category}</p>
        <button onclick="copyScript('${id}')">نسخ السكربت</button>
      `;
      div.style.display = match ? "block" : "none";
      if(match) anyMatch = true;
      list.appendChild(div);
    });

    // رسالة عدم وجود تطابق
    const oldMsg = document.getElementById('noMatchMsg');
    if(oldMsg) oldMsg.remove();
    if(!anyMatch) {
      const p = document.createElement('p');
      p.id = 'noMatchMsg';
      p.innerText = 'لا توجد سكربتات مطابقة.';
      p.style.color = 'red';
      list.appendChild(p);
    }

  } else {
    list.innerHTML = '<p>لا توجد سكربتات حتى الآن.</p>';
  }
}

// البحث عند الزر أو الكتابة
function handleSearch() {
  const input = document.getElementById('searchScripts');
  const query = input.value.toLowerCase().trim();
  updateURLQuery(query);
  loadScripts();
}

// ربط كل حاجة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchScripts');
  const searchBtn = document.getElementById('searchButton');

  // عرض قيمة البحث لو موجودة في الرابط
  if(searchInput) searchInput.value = getSearchQuery();

  // البحث مباشر أثناء الكتابة
  if(searchInput) searchInput.addEventListener('input', handleSearch);

  // البحث عند الضغط على الزر
  if(searchBtn) searchBtn.addEventListener('click', handleSearch);

  // تحميل السكربتات أول مرة
  loadScripts();
});
