// Site-wide SEO settings (PLAN.md 11).
//
// SITE_URL is the one canonical host (11.15), e.g. https://www.i2go.de. It is
// read on the server only. Until it is set, every page is noindex and
// robots.txt disallows everything, so preview and local deployments never end
// up in search results.

export const SITE_URL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
export const SITE_INDEXABLE = Boolean(process.env.SITE_URL);

/** Category and skill pages with fewer live candidates than this are noindex (11.6). */
export const MIN_INDEXABLE_CANDIDATES = 3;

export const absoluteUrl = (path = '/') => `${SITE_URL}${path}`;
