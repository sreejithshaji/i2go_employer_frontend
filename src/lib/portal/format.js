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

// Month names are spelled out here rather than taken from toLocaleDateString:
// Node and browsers ship different locale data (en-GB September is "Sep" in
// one and "Sept" in another), which breaks hydration of server-rendered dates.
const SHORT_MONTHS = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    de: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
};

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

// Timestamps are shown in German time on both server and browser, so they
// render the same everywhere. Numeric parts don't depend on locale data.
const BERLIN_PARTS = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', year: 'numeric', month: 'numeric', day: 'numeric' });

/** { year, month (1–12), day } of a 'YYYY-MM-DD' date (as written) or a timestamp (in Berlin time), or null. */
function dateParts(date) {
    const plain = DATE_ONLY.exec(String(date));
    if (plain) return { year: Number(plain[1]), month: Number(plain[2]), day: Number(plain[3]) };
    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return null;
    const parts = Object.fromEntries(BERLIN_PARTS.formatToParts(value).map((p) => [p.type, p.value]));
    return { year: Number(parts.year), month: Number(parts.month), day: Number(parts.day) };
}

const shortMonth = (month, lang) => (SHORT_MONTHS[lang] ?? SHORT_MONTHS.en)[month - 1];

/** '2021-03-01' → 'Mar 2021' / 'März 2021'. */
export function monthLabel(date, lang) {
    const d = date && dateParts(date);
    if (!d) return null;
    return `${shortMonth(d.month, lang)} ${d.year}`;
}

/** '2026-10-06' → '6 Oct 2026' / '6. Okt. 2026'. */
export function dateLabel(date, lang) {
    const d = date && dateParts(date);
    if (!d) return null;
    return lang === 'de' ? `${d.day}. ${shortMonth(d.month, lang)} ${d.year}` : `${d.day} ${shortMonth(d.month, lang)} ${d.year}`;
}

export const initials = (name = '') =>
    name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
