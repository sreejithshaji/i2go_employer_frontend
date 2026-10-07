import 'server-only';
import { cache } from 'react';
import { findGuideRedirect, findPublishedGuides } from '../_0-database/guide_repo';

// Guides (PLAN.md 11.12), edited in the admin panel (Guides). Read once per
// request (React cache). Drafts never reach the portal.

const list = (value) => (Array.isArray(value) ? value : []);

/**
 * One guide in one language:
 *   { key, slug, slugs: { de, en }, updated ('YYYY-MM-DD'), title, description, intro,
 *     sections: [{ id, heading, paragraphs, links }], faq: [{ q, a }] }
 */
function toGuide(row, lang) {
    return {
        key: String(row.id),
        slug: row[`slug_${lang}`],
        slugs: { de: row.slug_de, en: row.slug_en },
        updated: row.content_updated_on,
        title: row[`title_${lang}`],
        description: row[`description_${lang}`],
        intro: row[`intro_${lang}`],
        sections: list(row[`sections_${lang}`]).map((s) => ({ ...s, paragraphs: list(s.paragraphs), links: list(s.links) })),
        faq: list(row[`faq_${lang}`]),
    };
}

const getRows = cache(async () => findPublishedGuides());

/** Published guides in one language, in display order. */
export async function getGuides(lang) {
    return (await getRows()).map((row) => toGuide(row, lang));
}

/**
 * A guide by its slug in one language: { guide } for a current slug,
 * { redirectTo: guide } for an old one (slug_redirects), or null.
 */
export async function resolveGuideSlug(lang, slug) {
    const rows = await getRows();
    const row = rows.find((r) => r[`slug_${lang}`] === slug);
    if (row) return { guide: toGuide(row, lang) };
    const redirect = await findGuideRedirect(lang, slug);
    const target = redirect && rows.find((r) => r.id === redirect.target_id);
    return target ? { redirectTo: toGuide(target, lang) } : null;
}

/** Slug pairs for the language switcher: [{ de, en }]. */
export async function getGuideSlugMap() {
    return (await getRows()).map((row) => ({ de: row.slug_de, en: row.slug_en }));
}
