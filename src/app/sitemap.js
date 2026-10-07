import { getCategories, getListingStats, getSkills, isIndexableCount } from '@/app/modules/candidates/_1-domain/category_service';
import { getGuides } from '@/app/modules/guides/_1-domain/guide_service';
import { LOCALES } from '@/lib/i18n/config';
import { paths } from '@/lib/i18n/routes';
import { absoluteUrl } from '@/lib/seo/config';

// sitemap.xml (PLAN.md 11.10.1): home, hubs, guides, and category and skill
// pages that pass the thin-page rule, in both languages with hreflang
// alternates. Never candidate pages (11.7.2) or account pages.
// Rebuilt at most once an hour; it only reads public data.
export const revalidate = 3600;

// One <url> per language, each listing both as alternates.
function entries(pathFor, { lastModified, priority }) {
    const languages = Object.fromEntries(LOCALES.map((lang) => [lang, absoluteUrl(pathFor(lang))]));
    return LOCALES.map((lang) => ({
        url: languages[lang],
        lastModified,
        priority,
        alternates: { languages },
    }));
}

export default async function sitemap() {
    const urls = [
        ...entries((lang) => paths(lang).home, { priority: 1 }),
        ...entries((lang) => paths(lang).hub, { priority: 0.9 }),
        ...entries((lang) => paths(lang).guides, { priority: 0.6 }),
    ];

    try {
        for (const guide of await getGuides('de')) {
            urls.push(...entries((lang) => paths(lang).guide(guide.slugs[lang]), { lastModified: new Date(guide.updated), priority: 0.7 }));
        }
    } catch {
        // Database unreachable: leave the guides out this time.
    }

    try {
        const [categories, skills, stats] = await Promise.all([getCategories(), getSkills(), getListingStats()]);
        for (const category of categories) {
            if (!isIndexableCount(stats.categoryCount(category.id))) continue;
            urls.push(...entries((lang) => paths(lang).category(category[`slug_${lang}`]), {
                lastModified: stats.lastUpdated(category.id) ?? undefined,
                priority: 0.8,
            }));
            for (const skill of skills) {
                if (!isIndexableCount(stats.skillCount(category.id, skill.id))) continue;
                urls.push(...entries((lang) => paths(lang).skill(category[`slug_${lang}`], skill[`slug_${lang}`]), {
                    lastModified: stats.lastUpdated(category.id, skill.id) ?? undefined,
                    priority: 0.6,
                }));
            }
        }
    } catch {
        // Database unreachable: serve the static part rather than an error.
    }
    return urls;
}
