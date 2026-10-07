import { LOCALE_TAGS, plural } from '@/lib/i18n/config';

// Display helpers shared by the portal views. `t` is the page's dictionary
// (lib/i18n/dictionaries), `lang` its language.

const capitalize = (value) => value[0].toUpperCase() + value.slice(1);

/** 'intermediate' → 'Intermediate' / 'Fortgeschritten'; '-' when empty. */
export const levelLabel = (value, t) => (value ? t?.levels?.[value] ?? capitalize(value) : '-');

/**
 * The candidate's German level from the portal's languages list (migration
 * 0024): { level: 'B1', certified: true }, or null when none is given.
 */
export function germanLevel(languages, lang) {
    const de = (languages || []).find((l) => l.code === 'de');
    if (!de?.level) return null;
    return { level: lang === 'de' && de.level_de ? de.level_de : de.level, certified: !!de.certified };
}

/** "B1 · certified", "Fluent", or "-" for one entry of a candidate's languages. */
export function languageLevelLabel(entry, t, lang) {
    if (!entry?.level) return '-';
    const level = lang === 'de' && entry.level_de ? entry.level_de : entry.level;
    return entry.certified ? `${level} · ${t.profile.certified}` : level;
}

/** Number with up to one decimal, in the page language: 2.5 → "2,5" in German. */
const decimal = (n, lang) => (Number.isInteger(n) ? String(n) : n.toLocaleString(LOCALE_TAGS[lang] ?? 'en-GB', { maximumFractionDigits: 1 }));

/** 7 → "7 years" / "7 Jahre". */
export function yearsLabel(value, t, lang) {
    if (value == null) return null;
    const n = Number(value);
    return plural(t.years, n, { count: decimal(n, lang) });
}

/** Short form for the card stat strip: "7 yrs" / "7 J.". */
export function shortYearsLabel(value, t, lang) {
    if (value == null) return null;
    const n = Number(value);
    return plural(t.card.years, n, { count: decimal(n, lang) });
}

/** '2021-03-01' → 'Mar 2021' / 'März 2021'. */
export function monthLabel(date, lang) {
    if (!date) return null;
    return new Date(date).toLocaleDateString(LOCALE_TAGS[lang] ?? 'en-GB', { month: 'short', year: 'numeric' });
}

/** '2026-10-06' → '6 Oct 2026' / '6. Okt. 2026'. */
export function dateLabel(date, lang) {
    if (!date) return null;
    return new Date(date).toLocaleDateString(LOCALE_TAGS[lang] ?? 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const initials = (name = '') =>
    name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
