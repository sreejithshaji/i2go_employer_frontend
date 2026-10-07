import { LOCALES } from '@/lib/i18n/config';
import { absoluteUrl, SITE_INDEXABLE } from '@/lib/seo/config';

// robots.txt (PLAN.md 11.10.2). Account pages are disallowed. Candidate pages
// are NOT disallowed: they carry "noindex, follow", which crawlers can only
// see if they may fetch the page (11.7). Until SITE_URL is set, everything is
// disallowed (lib/seo/config.js).
export default function robots() {
    if (!SITE_INDEXABLE) {
        return { rules: { userAgent: '*', disallow: '/' } };
    }
    const accountPages = ['login', 'signup', 'wishlist', 'enquiries'];
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: LOCALES.flatMap((lang) => accountPages.map((page) => `/${lang}/${page}`)),
        },
        sitemap: absoluteUrl('/sitemap.xml'),
    };
}
