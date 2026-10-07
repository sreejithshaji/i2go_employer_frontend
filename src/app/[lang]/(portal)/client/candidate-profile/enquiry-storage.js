// Browser-side memory for the enquiry form: which candidates this browser
// enquired about in the last 24 hours (candidate id and time only), so the
// form isn't sent twice. Listed on the privacy page (PLAN.md 10.11).
// Contact details used to be kept too; that key is removed on first use.

const LEGACY_CONTACT_KEY = 'i2go.enquiryContact';
const SENT_KEY = 'i2go.enquiriesSent';
const SENT_WINDOW_MS = 24 * 60 * 60 * 1000; // same window as the server's duplicate check

function readStorage(key, fallback) {
    try {
        localStorage.removeItem(LEGACY_CONTACT_KEY);
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.removeItem(LEGACY_CONTACT_KEY);
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage can be blocked; it's only a convenience.
    }
}

/** True when this browser sent an enquiry about the candidate in the last 24 hours. */
export function wasEnquiredRecently(candidateId) {
    const sentAt = readStorage(SENT_KEY, {})[candidateId];
    return !!sentAt && Date.now() - sentAt < SENT_WINDOW_MS;
}

export function markEnquired(candidateId) {
    const sent = readStorage(SENT_KEY, {});
    const now = Date.now();
    for (const [id, at] of Object.entries(sent)) {
        if (now - at >= SENT_WINDOW_MS) delete sent[id];
    }
    sent[candidateId] = now;
    writeStorage(SENT_KEY, sent);
}
