/**
 * Candidate list filters from the URL, so searches can be shared and survive
 * "back". Used by the /candidates page (server) and its view (client).
 * There's no gender or age filter (AGG; PLAN.md 10.4.2), so old ?gender=,
 * ?minAge= and ?maxAge= links are ignored.
 * params: URLSearchParams
 */
export function parseFilters(params) {
    const num = (key) => {
        const value = Number(params.get(key));
        return Number.isFinite(value) && value > 0 ? value : null;
    };
    const text = (key) => (params.get(key) || '').trim().slice(0, 40) || null;
    return {
        q: params.get('q') || '',
        categoryIds: (params.get('categories') || '').split(',').map(Number).filter((n) => n > 0),
        minExperience: num('exp'),
        // Languages (migration 0024): ?de=B1 German at B1 or higher, ?cert=1
        // certified German only, ?lang=1&lvl=Fluent another language (at that
        // level or higher). Level names are matched against the language's
        // own list on the server; unknown ones are ignored.
        germanLevel: text('de'),
        germanCertified: params.get('cert') === '1',
        languageId: num('lang'),
        languageLevel: text('lvl'),
        page: num('page') || 1,
    };
}

/** Next's searchParams object ({ key: string | string[] }) as URLSearchParams. */
export function toURLSearchParams(searchParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
        const first = Array.isArray(value) ? value[0] : value;
        if (first != null) params.set(key, first);
    }
    return params;
}
