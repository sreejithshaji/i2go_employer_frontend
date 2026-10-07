import { LOCALES, isLocale } from './config';

// URL tree per language (PLAN.md 11.1). The SEO tree has translated segments;
// account and legal pages keep the same name in both languages.
//
//   /de/fachkraefte                       all candidates (hub)
//   /de/fachkraefte/[kategorie]           category landing page
//   /de/fachkraefte/[kategorie]/[skill]   skill within a category
//   /de/fachkraefte/[kategorie]/k-[nr]    one candidate (noindex)
//   /de/ratgeber/[thema]                  guides
//   /en/candidates/...  /en/guides/...    the same tree in English

const SEGMENTS = {
    de: { hub: 'fachkraefte', guides: 'ratgeber' },
    en: { hub: 'candidates', guides: 'guides' },
};

export const hubSegment = (lang) => SEGMENTS[lang].hub;
export const guidesSegment = (lang) => SEGMENTS[lang].guides;

/** "k-1042" → 1042; anything else → null. */
export function parseCandidateSegment(segment) {
    const match = /^k-(\d{1,12})$/.exec(segment ?? '');
    return match ? Number(match[1]) : null;
}

/** Every portal URL for one language. */
export function paths(lang) {
    const base = `/${lang}`;
    const hub = `${base}/${SEGMENTS[lang].hub}`;
    const guides = `${base}/${SEGMENTS[lang].guides}`;
    return {
        home: base,
        hub,
        category: (categorySlug) => `${hub}/${categorySlug}`,
        skill: (categorySlug, skillSlug) => `${hub}/${categorySlug}/${skillSlug}`,
        candidate: (categorySlug, publicNo) => `${hub}/${categorySlug}/k-${publicNo}`,
        /** Short form; redirects to the candidate's canonical URL. */
        candidateShort: (publicNo) => `${hub}/k-${publicNo}`,
        guides,
        guide: (slug) => `${guides}/${slug}`,
        login: `${base}/login`,
        signup: `${base}/signup`,
        wishlist: `${base}/wishlist`,
        enquiries: `${base}/enquiries`,
        privacy: `${base}/privacy`,
        terms: `${base}/terms`,
        impressum: `${base}/impressum`,
    };
}

/**
 * The candidate's main category: the lowest category id, so every candidate
 * has one stable URL wherever it's linked from.
 */
export function primaryCategory(candidate) {
    const categories = candidate?.categories ?? [];
    return categories.reduce((first, c) => (!first || c.id < first.id ? c : first), null);
}

/** Canonical URL of a candidate profile in one language. */
export function candidateHref(lang, candidate) {
    const category = primaryCategory(candidate);
    const p = paths(lang);
    return category ? p.candidate(category[`slug_${lang}`], candidate.public_no) : p.candidateShort(candidate.public_no);
}

/**
 * The same page in another language, for the language switcher and hreflang.
 * slugMaps: { categories, skills, guides }, each [{ de, en }]. A slug without a
 * translation drops back to its parent page.
 */
export function translatePath(pathname, toLang, slugMaps = {}) {
    const [, fromLang, ...rest] = pathname.split('/');
    if (!isLocale(fromLang)) return paths(toLang).home;
    if (fromLang === toLang) return pathname;
    const map = (list, slug) => (list ?? []).find((item) => item[fromLang] === slug)?.[toLang] ?? null;
    const [first, second, third] = rest;
    const out = [toLang];

    if (first === SEGMENTS[fromLang].hub) {
        out.push(SEGMENTS[toLang].hub);
        if (second) {
            if (parseCandidateSegment(second) != null) return `/${[...out, second].join('/')}`;
            const category = map(slugMaps.categories, second);
            if (!category) return `/${out.join('/')}`;
            out.push(category);
            if (third) {
                if (parseCandidateSegment(third) != null) out.push(third);
                else {
                    const skill = map(slugMaps.skills, third);
                    if (skill) out.push(skill);
                }
            }
        }
        return `/${out.join('/')}`;
    }
    if (first === SEGMENTS[fromLang].guides) {
        out.push(SEGMENTS[toLang].guides);
        const guide = second && map(slugMaps.guides, second);
        if (guide) out.push(guide);
        return `/${out.join('/')}`;
    }
    return `/${[...out, ...rest].join('/')}`.replace(/\/$/, '');
}

/**
 * Where a URL without a language goes (old links, typed URLs): the same page
 * under the chosen language. Old Vite-era paths are mapped too.
 */
export function localizeLegacyPath(pathname, lang) {
    const p = paths(lang);
    const rest = pathname.replace(/\/+$/, '');
    if (rest === '') return p.home;
    if (rest === '/saved') return p.wishlist;
    if (rest === '/people' || rest === '/candidates') return p.hub;
    // Old profile links (/candidates/<uuid>): the hub's [category] route resolves them.
    if (rest.startsWith('/candidates/')) return `${p.hub}/${rest.slice('/candidates/'.length)}`;
    return `/${lang}${rest}`;
}

export { LOCALES };
