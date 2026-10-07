import { parseFilters, toURLSearchParams } from '@/lib/portal/filters';

// Helpers for the SEO tree pages (hub, category, skill, candidate). This
// folder is private (leading underscore): no routes, only the page modules
// that the language-specific route folders render.

/** Filters from Next's searchParams. */
export async function readFilters(searchParams) {
    return parseFilters(toURLSearchParams(await searchParams));
}

/** Search, category, experience or language filters set (paging alone doesn't count). */
export const isFiltered = (filters) => Boolean(
    filters.q || filters.categoryIds.length || filters.minExperience
        || filters.germanLevel || filters.germanCertified || filters.languageId,
);

/**
 * rel=canonical for a list page (11.8): filtered views point to the clean
 * path; page 2+ of the unfiltered list points to itself.
 */
export function listCanonical(path, filters) {
    if (isFiltered(filters) || filters.page <= 1) return path;
    return `${path}?page=${filters.page}`;
}

/** Keeps the query string on redirects (old slugs with filters). */
export async function queryString(searchParams) {
    const query = toURLSearchParams(await searchParams).toString();
    return query ? `?${query}` : '';
}
