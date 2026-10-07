import { absoluteUrl } from './config';

// Structured data (PLAN.md 11.11). No Person schema for candidates.

export function organizationLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'I2Go',
        url: absoluteUrl('/'),
        logo: absoluteUrl('/images/i2go_logo.png'),
    };
}

export function websiteLd(lang, description) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'I2Go',
        url: absoluteUrl(`/${lang}`),
        inLanguage: lang,
        description,
    };
}

/** items: [{ name, path }], from home to the current page. */
export function breadcrumbLd(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

/** faq: [{ q, a }]. */
export function faqLd(faq) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
        })),
    };
}
