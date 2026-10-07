// Portal languages (PLAN.md 11.3). German first: every URL starts with /de or /en.

export const LOCALES = ['de', 'en'];
export const DEFAULT_LOCALE = 'de';

export const isLocale = (value) => LOCALES.includes(value);

/** BCP 47 tags for dates and numbers, and for hreflang / og:locale. */
export const LOCALE_TAGS = { de: 'de-DE', en: 'en-GB' };

/** The first path segment when it's a locale ('/en/candidates' → 'en'), else null. */
export function localeOfPath(pathname = '') {
    const first = pathname.split('/')[1];
    return isLocale(first) ? first : null;
}

/**
 * Best match for an Accept-Language header ("en-US,en;q=0.9,de;q=0.8"), or the
 * default. Only the language part counts; region and quality order decide.
 */
export function matchLocale(acceptLanguage) {
    const ranked = String(acceptLanguage || '')
        .split(',')
        .map((part, index) => {
            const [tag, ...params] = part.trim().split(';');
            const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
            return { lang: tag.trim().toLowerCase().split('-')[0], q: q ? Number(q.slice(2)) || 0 : 1, index };
        })
        .filter((entry) => entry.lang && entry.q > 0)
        .sort((a, b) => b.q - a.q || a.index - b.index);
    return ranked.find((entry) => isLocale(entry.lang))?.lang ?? DEFAULT_LOCALE;
}

/** Fills {placeholders}: format('{count} candidates', { count: 3 }). */
export function format(template, values = {}) {
    return String(template ?? '').replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}

/** Picks the singular or plural template: plural(t.count, n) with { one, other }. */
export function plural(forms, count, values = {}) {
    return format(count === 1 ? forms.one : forms.other, { count, ...values });
}

/** Master data name in the page language: German name when there is one. */
export const localName = (item, lang) => (lang === 'de' && item?.name_de ? item.name_de : item?.name ?? '');
