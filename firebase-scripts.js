import { get, getDatabase, initializeApp, push, ref, set } from "./supabase-config.js";
// Firebase SDK






const db = getDatabase(app);

// نشر سكربت جديد
window.publishScript = async () => {
  const title = document.getElementById('scriptTitle').value;
  const code = document.getElementById('scriptCode').value;
  const category = document.getElementById('category').value;
  if (!title || !code || !category) return alert("مطلوب كل الحقول الأساسية");

  const newScriptRef = push(ref(db, 'scripts'));
  await set(newScriptRef, {
    title,
    code,
    category,
    timestamp: Date.now(),
    rating: 0,
    votes: 0
  });

  alert("تم نشر السكربت بنجاح!");
  document.getElementById('publishForm').reset();
};

// تحميل كل السكربتات وعرضها
window.loadScripts = async () => {
  const list = document.getElementById('scriptsList');
  if (!list) return; // لو الصفحة مش صفحة السكربتات
  list.innerHTML = '';
  const snapshot = await get(ref(db, 'scripts'));
  if (snapshot.exists()) {
    const scripts = snapshot.val();
    Object.keys(scripts).forEach(id => {
      const s = scripts[id];
      const div = document.createElement('div');
      div.className = 'script-card';
      div.dataset.id = id;
      div.innerHTML = `
        <h3>${s.title}</h3>
        <pre id="code-${id}">${s.code}</pre>
        <p>Category: ${s.category}</p>
        <button onclick="copyScript('${id}')">نسخ السكربت</button>
        <div class="rating" data-id="${id}">
          <span class="star" data-value="1">&#9733;</span>
          <span class="star" data-value="2">&#9733;</span>
          <span class="star" data-value="3">&#9733;</span>
          <span class="star" data-value="4">&#9733;</span>
          <span class="star" data-value="5">&#9733;</span>
          <span class="rating-info">${s.votes} تقييمات - ${s.rating.toFixed(1)} نجوم</span>
        </div>
      `;
      list.appendChild(div);
      attachRatingEvents(div, s);
    });
  }
};

// نسخ السكربت
window.copyScript = (id) => {
  const code = document.getElementById(`code-${id}`).innerText;
  navigator.clipboard.writeText(code);
  alert("تم نسخ السكربت!");
};

// التقييم
function attachRatingEvents(div, script) {
  const stars = div.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', async () => {
      const val = parseInt(star.dataset.value);
      const newRating = ((script.rating * script.votes) + val) / (script.votes + 1);
      await set(ref(db, `scripts/${div.dataset.id}/rating`), newRating);
      await set(ref(db, `scripts/${div.dataset.id}/votes`), script.votes + 1);
      loadScripts(); // تحديث فورًا
    });
  });
}

window.addEventListener('DOMContentLoaded', loadScripts);
