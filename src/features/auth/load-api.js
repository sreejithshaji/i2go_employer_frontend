// The browser Supabase client is the largest script on the portal (~70 kB
// gzip, PLAN.md 11.14.3), and guests never need it: their pages are rendered
// on the server. So it is loaded only when there is a session cookie, or when
// someone signs in or signs up.

import { isAuthCookie } from '@/lib/supabase/cookie';

let api = null;
const waiting = new Set();

/** Loads browser-api.js once; every caller gets the same module. */
export function loadAuthApi() {
    if (!api) {
        api = import('./browser-api');
        const listeners = [...waiting];
        waiting.clear();
        api.then((mod) => listeners.forEach((listener) => listener(mod)));
    }
    return api;
}

/** Calls onLoad(module) once the API is loaded, by whoever loads it. Returns a cancel function. */
export function whenAuthApiLoaded(onLoad) {
    let cancelled = false;
    const listener = (mod) => {
        if (!cancelled) onLoad(mod);
    };
    if (api) api.then(listener);
    else waiting.add(listener);
    return () => {
        cancelled = true;
        waiting.delete(listener);
    };
}

/**
 * Whether the browser holds this portal's session cookie (lib/supabase/cookie.js,
 * possibly split into .0, .1, …). @supabase/ssr keeps it readable by scripts,
 * because the browser client itself reads it.
 */
export function hasSessionCookie() {
    return document.cookie.split(';').some((c) => isAuthCookie(c.split('=')[0].trim()));
}

export async function signIn(email, password) {
    return (await loadAuthApi()).signIn(email, password);
}

export async function signUp(details) {
    return (await loadAuthApi()).signUp(details);
}
