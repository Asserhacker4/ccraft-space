import { db, get, push, ref, set, update } from "./supabase-config.js";



export const publishScript = async () => {
  const title = document.getElementById('scriptTitle').value.trim();
  const code = document.getElementById('scriptCode').value.trim();
  const category = document.getElementById('category').value.trim();

  let username = localStorage.getItem("username");

  if (!username) {
    username = prompt("اكتب اسمك:");
    if (!username) return alert("لازم تكتب اسم");
    localStorage.setItem("username", username);
  }

  if (!title || !code || !category) {
    return alert("مطلوب كل الحقول!");
  }

  const newScriptRef = push(ref(db, 'scripts'));

  try {
    await set(newScriptRef, {
      title,
      code,
      category,
      username,
      timestamp: Date.now(),
      rating: 0,
      votes: 0
    });

    // تحديث النقاط
    const userRef = ref(db, 'users/' + username);
    const snap = await get(userRef);

    if (snap.exists()) {
      const data = snap.val();

      await update(userRef, {
        points: (data.points || 0) + 5,
        scripts: (data.scripts || 0) + 1
      });

    } else {
      await set(userRef, {
        name: username,
        points: 5,
        scripts: 1
      });
    }

    alert("تم نشر السكربت + حصلت على 5 نقاط 🔥");
    document.getElementById('publishForm').reset();

  } catch (err) {
    console.error(err);
    alert("فشل النشر");
  }
};
