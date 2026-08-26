// userId ثابت لكل متصفح (شخص واحد) - نفس اللي عندك بس هنسميه userId
let userId = localStorage.getItem('ccraft_presence_id');
if (!userId) {
    userId = 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('ccraft_presence_id', userId);
}

// tabId مختلف لكل تاب - مش مخزّن في localStorage عشان يبقى unique للتاب ده بس
const tabId = 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);

const myTabRef = ref(db, `presence/${userId}/${tabId}`);
const currentPage = (location.pathname.split('/').pop() || 'index.html');

function markOnline() {
    set(myTabRef, { online: true, ts: Date.now(), page: currentPage });
}

onValue(ref(db, '.info/connected'), (snap) => {
    if (snap.val() === true) {
        onDisconnect(myTabRef).remove();
        markOnline();
    }
});

setInterval(markOnline, 25000);

window.addEventListener('pagehide', (e) => {
    if (e.persisted) return; // الصفحة راحت bfcache مش اتقفلت فعلاً
    try { set(myTabRef, null); } catch (err) {}
});
