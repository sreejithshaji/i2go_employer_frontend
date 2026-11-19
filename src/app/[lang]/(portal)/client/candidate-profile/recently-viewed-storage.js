// Browser-side list of the candidate profiles this browser opened (candidate id
// and time only), for the "Recently viewed" page. Works signed in or not; it
// never leaves the browser. Listed on the privacy page (PLAN.md 6.20.5).

const KEY = 'i2go.recentlyViewed';
const MAX_ENTRIES = 20;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/** Fired on window when the list changes in this tab (other tabs get the storage event). */
export const RECENTLY_VIEWED_EVENT = 'i2go:recently-viewed';

// Newest first, valid entries only, nothing older than 30 days, at most 20.
function prune(entries) {
    const now = Date.now();
    const seen = new Set();
    return (Array.isArray(entries) ? entries : [])
        .filter((e) => e && typeof e.id === 'string' && Number.isFinite(e.at) && now - e.at < MAX_AGE_MS)
        .sort((a, b) => b.at - a.at)
        .filter((e) => !seen.has(e.id) && seen.add(e.id))
        .slice(0, MAX_ENTRIES);
}

function read() {
    try {
        return prune(JSON.parse(localStorage.getItem(KEY)));
    } catch {
        return [];
    }
}

function write(entries) {
    try {
        if (entries.length === 0) localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, JSON.stringify(entries));
        window.dispatchEvent(new Event(RECENTLY_VIEWED_EVENT));
    } catch {
        // Storage can be blocked; the list is only a convenience.
    }
}

/** Candidate ids viewed in this browser, newest first. */
export function getRecentIds() {
    return read().map((e) => e.id);
}

/** Moves the candidate to the top of the list (or adds it). */
export function recordView(candidateId) {
    if (typeof candidateId !== 'string' || !candidateId) return;
    write(prune([{ id: candidateId, at: Date.now() }, ...read().filter((e) => e.id !== candidateId)]));
}

/** Empties the list. */
export function clearRecent() {
    write([]);
}

/** Calls onChange when the list changes here or in another tab; returns the unsubscribe. */
export function subscribeRecent(onChange) {
    const onStorage = (event) => {
        if (event.key === KEY || event.key === null) onChange();
    };
    window.addEventListener(RECENTLY_VIEWED_EVENT, onChange);
    window.addEventListener('storage', onStorage);
    return () => {
        window.removeEventListener(RECENTLY_VIEWED_EVENT, onChange);
        window.removeEventListener('storage', onStorage);
    };
}
