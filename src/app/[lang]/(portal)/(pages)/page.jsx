import { connection } from 'next/server';
import { getCandidates } from '@/app/modules/candidates/_1-domain/candidate_service';
import { getCategories, getListingStats } from '@/app/modules/candidates/_1-domain/category_service';
import { getGuides } from '@/app/modules/guides/_1-domain/guide_service';
import { localName } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { paths } from '@/lib/i18n/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import HomeView from '../client/home/home-view';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const t = getDictionary(lang);
    return pageMetadata({
        lang,
        title: `${t.meta.homeTitle} · I2Go`,
        absoluteTitle: true,
        description: t.meta.homeDescription,
        pathsByLang: { de: paths('de').home, en: paths('en').home },
    });
}

// Categories with live candidates, most first: links into the SEO tree (11.12.3).
async function loadJobs(lang) {
    const [categories, stats] = await Promise.all([getCategories(), getListingStats()]);
    return categories
        .map((c) => ({ id: c.id, name: localName(c, lang), href: paths(lang).category(c[`slug_${lang}`]), count: stats.categoryCount(c.id) }))
        .filter((c) => c.count > 0)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, lang));
}

export default async function HomePage({ params }) {
    const { lang } = await params;
    // Render per request, not at build time: the cards carry signed photo URLs
    // that expire after an hour, so a cached page could show broken photos
    // (PLAN.md 9.7.7). Same as the candidate lists and the profiles.
    await connection();
    // The latest-candidates strip and the job links are optional: the page renders without them.
    const [latest, jobs, guides] = await Promise.all([
        getCandidates({ page: 1 }).then(({ candidates }) => candidates.slice(0, 6)).catch(() => []),
        loadJobs(lang).catch(() => []),
        getGuides(lang).then((list) => list.slice(0, 3).map(({ slug, title, description }) => ({ slug, title, description }))).catch(() => []),
    ]);
    return <HomeView latest={latest} jobs={jobs} guides={guides} />;
}
