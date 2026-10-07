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
