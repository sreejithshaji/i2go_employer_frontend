import { DEFAULT_LOCALE, LOCALE_TAGS, LOCALES } from '@/lib/i18n/config';
import { SITE_INDEXABLE } from './config';

/**
 * Metadata for one page in one language.
 *   pathsByLang  { de, en }: the page in each language (hreflang + x-default)
 *   canonical    path for rel=canonical; defaults to this language's path.
 *                Filters canonicalise to the clean path; page 2+ to itself (11.8).
 *   noindex      robots "noindex, follow" (thin pages, candidates; 11.6, 11.7)
 *   absoluteTitle  skip the "· I2Go" template
 *   imageCategory  category slug for the share image (/api/og), else the site image
 *
 * Nested fields (openGraph, twitter, robots) replace the layout's, so this
 * sets all of them: the share image and, until SITE_URL is set, noindex.
 */
export function pageMetadata({ lang, title, description, pathsByLang, canonical, noindex = false, absoluteTitle = false, imageCategory }) {
    const self = canonical ?? pathsByLang?.[lang];
    const languages = pathsByLang
        ? { ...Object.fromEntries(LOCALES.map((l) => [l, pathsByLang[l]])), 'x-default': pathsByLang[DEFAULT_LOCALE] }
        : undefined;
    const image = {
        url: `/api/og?lang=${lang}${imageCategory ? `&category=${encodeURIComponent(imageCategory)}` : ''}`,
        width: 1200,
        height: 630,
        alt: 'I2Go',
    };
    const robots = !SITE_INDEXABLE ? { index: false, follow: false } : noindex ? { index: false, follow: true } : null;
    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates: self ? { canonical: self, languages } : undefined,
        openGraph: {
            type: 'website',
            siteName: 'I2Go',
            title,
            description,
            url: self,
            locale: LOCALE_TAGS[lang].replace('-', '_'),
            alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => LOCALE_TAGS[l].replace('-', '_')),
            images: [image],
        },
        twitter: { card: 'summary_large_image', title, description, images: [image.url] },
        ...(robots ? { robots } : {}),
    };
}

/** Plain-text description of at most ~155 characters, cut at a word. */
export function shortDescription(text, max = 155) {
    const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max - 1);
    return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
}
