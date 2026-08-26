import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ============================================================
// supabase-config.js — إعداد Supabase المركزي (بمثابة Firebase Wrapper)
// ============================================================

export const SUPABASE_URL = 'https://nthqrfsdshsreqdoksyv.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_kHd5Y4bBnUDJxCFV-aKg-Q_T9XRJckN';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// Firebase Auth Wrapper
// ============================================================
export function getAuth(app) {
    return supabase.auth;
}

export function onAuthStateChanged(auth, callback) {
    // جلب الجلسة الحالية أولاً
    supabase.auth.getSession().then(({ data: { session } }) => {
        const user = session ? formatUser(session.user) : null;
        callback(user);
    });

    // مراقبة التغييرات
    return supabase.auth.onAuthStateChange((event, session) => {
        const user = session ? formatUser(session.user) : null;
        callback(user);
    });
}

function formatUser(su) {
    if (!su) return null;
    return {
        uid: su.id,
        email: su.email,
        displayName: su.user_metadata?.name || su.user_metadata?.displayName || 'مستخدم',
        photoURL: su.user_metadata?.avatar_url || su.user_metadata?.photoURL || null
    };
}

// ============================================================
// Firebase Database Wrapper
// ============================================================
export function getDatabase(app) {
    return supabase;
}

export function ref(db, path) {
    return { db, path };
}

function parsePath(path) {
    const parts = path.split('/').filter(Boolean);
    return { table: parts[0], id: parts[1], field: parts[2], extra: parts.slice(3) };
}

export async function get(refObj) {
    const { table, id, field } = parsePath(refObj.path);
    if (!table) return { exists: () => false, val: () => null };

    let query = supabase.from(table).select('*');
    if (id) query = query.eq('id', id);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
        return { exists: () => false, val: () => null };
    }

    if (id) {
        const row = data[0];
        if (field) {
            return {
                exists: () => row[field] !== undefined && row[field] !== null,
                val: () => row[field]
            };
        }
        return { exists: () => true, val: () => row };
    } else {
        const obj = {};
        data.forEach(r => obj[r.id] = r);
        return { exists: () => true, val: () => obj };
    }
}

export async function set(refObj, value) {
    const { table, id, field } = parsePath(refObj.path);
    if (!table || !id) return;

    if (field) {
        await supabase.from(table).update({ [field]: value }).eq('id', id);
    } else if (value === null) {
        await supabase.from(table).delete().eq('id', id);
    } else {
        // تحديث أو إدخال (Upsert)
        await supabase.from(table).upsert({ id, ...value });
    }
}

export async function push(refObj, data) {
    const { table } = parsePath(refObj.path);
    // توليد ID فريد يشبه Firebase Push ID
    const newId = 'sb_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    await supabase.from(table).insert({ id: newId, ...data });
    return { key: newId };
}

export async function update(refObj, data) {
    const { table, id } = parsePath(refObj.path);
    if (!table || !id) return;
    await supabase.from(table).update(data).eq('id', id);
}

// محاكاة Realtime - onValue
const realtimeSubscriptions = {};

export function onValue(refObj, callback) {
    const { table, id, field } = parsePath(refObj.path);
    if (!table) return () => {};

    // استدعاء فوري أولي
    get(refObj).then(snap => callback(snap));

    // إنشاء اشتراك
    const channelName = `public:${table}${id ? `:${id}` : ''}`;
    let filter = undefined;
    if (id) filter = `id=eq.${id}`;

    const channel = supabase.channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: table, filter: filter }, payload => {
            get(refObj).then(snap => callback(snap));
        })
        .subscribe();

    realtimeSubscriptions[refObj.path] = channel;

    // دالة الإلغاء
    return () => {
        supabase.removeChannel(channel);
        delete realtimeSubscriptions[refObj.path];
    };
}

// محاكاة runTransaction 
export async function runTransaction(refObj, updateFunction) {
    const { table, id, field } = parsePath(refObj.path);
    if (!table || !id || !field) return;

    // Supabase RPC is better, but we can do a read-modify-write as a fallback
    // In a real system, you'd use a postgres function. Here we just read and write.
    const { data } = await supabase.from(table).select(field).eq('id', id).single();
    const currentVal = data ? data[field] : null;
    const newVal = updateFunction(currentVal);
    
    if (newVal !== undefined) {
        await supabase.from(table).update({ [field]: newVal }).eq('id', id);
    }
}

// ============================================================
// Firebase App Placeholder
// ============================================================
export function initializeApp(config) {
    return { name: '[DEFAULT]' };
}
export function getApps() {
    return [{ name: '[DEFAULT]' }];
}
export function getApp() {
    return { name: '[DEFAULT]' };
}
export async function signInWithEmailAndPassword(auth, email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { user: formatUser(data.user) };
}

export async function createUserWithEmailAndPassword(auth, email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return { user: formatUser(data.user) };
}

export async function signOut(auth) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function updateProfile(user, { displayName, photoURL }) {
    const { error } = await supabase.auth.updateUser({
        data: { name: displayName, avatar_url: photoURL }
    });
    if (error) throw error;
}
