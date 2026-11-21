import { DEFAULT_LOCALE, localeOfPath } from '@/lib/i18n/config';
import { paths } from '@/lib/i18n/routes';

/** Sign-in URL (in the language of `path`) that brings the user back to `path` afterwards. */
export function loginHref(path) {
    const lang = localeOfPath(path) ?? DEFAULT_LOCALE;
    return `${paths(lang).login}?next=${encodeURIComponent(path)}`;
}

/** Only same-site paths, so ?next= can't send people elsewhere. Falls back to the candidate hub. */
export function safeNext(value, lang = DEFAULT_LOCALE) {
    return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : paths(lang).hub;
}

/**
 * Signup URL in the language of `path`. From a candidate page (the hub tree) it
 * brings the new employer back to that page; from anywhere else signup ends
 * on the candidate hub (safeNext's fallback).
 */
export function signupHref(path) {
    const lang = localeOfPath(path) ?? DEFAULT_LOCALE;
    const p = paths(lang);
    const inHub = path === p.hub || path.startsWith(`${p.hub}/`) || path.startsWith(`${p.hub}?`);
    return inHub ? `${p.signup}?next=${encodeURIComponent(path)}` : p.signup;
}
