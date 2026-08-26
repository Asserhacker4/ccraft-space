import { get, getAuth, getDatabase, onAuthStateChanged, ref, signOut } from "./supabase-config.js";



export function guardAgainstBanned(app, options = {}) {
    const auth = getAuth(app);
    const db   = getDatabase(app);
    const redirectTo = options.redirectTo || 'login.html';

    onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        let banned = false;
        try {
            const snap = await get(ref(db, `users/${user.uid}/banned`));
            banned = snap.exists() && snap.val() === true;
        } catch (e) {
            return;
        }

        if (!banned) return;

        try { await signOut(auth); } catch (e) { /* تجاهل */ }

        const msgEl = document.getElementById('banGuardMsg');
        const text = '🚫 حسابك محظور من CCRAFT SPACE. لو ده خطأ، تواصل مع الإدارة.';
        if (msgEl) {
            msgEl.textContent = text;
            msgEl.style.display = 'block';
            setTimeout(() => { location.href = redirectTo; }, 2500);
        } else {
            alert(text);
            location.href = redirectTo;
        }
    });
}
