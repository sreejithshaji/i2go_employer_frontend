import { connection } from 'next/server';
import { countCandidates, getCandidates } from '@/app/modules/candidates/_1-domain/candidate_service';
import { getCategories, getLanguages, getListingStats, getSkills } from '@/app/modules/candidates/_1-domain/category_service';
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

// Every active category with its live count, most first: links into the SEO
// tree (11.12.3). The category slider shows all; the rest use only live ones.
async function loadAllJobs(lang) {
    const [categories, stats] = await Promise.all([getCategories(), getListingStats()]);
    return categories
        .map((c) => ({ id: c.id, name: localName(c, lang), href: paths(lang).category(c[`slug_${lang}`]), count: stats.categoryCount(c.id) }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, lang));
}

// Suggestions for the hero search box (plan 9A.9.2): live professions (with
// their live count, linking to the category page) and live skills (linking to
// the hub searched for that skill, which migration 0031 matches). `alt` is the
// other language's name, so "chef" and "Koch" both find a profession.
// Shape: { key, kind: 'profession' | 'skill', name, alt, href, count? }.
async function loadSearchSuggestions(lang) {
    const [categories, skills, stats] = await Promise.all([getCategories(), getSkills(), getListingStats()]);
    const other = lang === 'de' ? 'en' : 'de';
    const live = new Set(stats.rows.filter((r) => r.skill_id != null && Number(r.live_count) > 0).map((r) => r.skill_id));
    const professions = categories
        .map((c) => ({ c, count: stats.categoryCount(c.id) }))
        .filter(({ count }) => count > 0)
        .map(({ c, count }) => ({
            key: `c${c.id}`, kind: 'profession', name: localName(c, lang), alt: localName(c, other),
            href: paths(lang).category(c[`slug_${lang}`]), count,
        }));
    const skillItems = skills
        .filter((s) => live.has(s.id))
        .map((s) => {
            const name = localName(s, lang);
            return {
                key: `s${s.id}`, kind: 'skill', name, alt: localName(s, other),
                href: `${paths(lang).hub}?q=${encodeURIComponent(name)}`,
            };
        });
    return [...professions, ...skillItems];
}

// Hero search (plan §15, D16/D18): every active category, A–Z, for the
// profession select and the "professions we recruit for" stat; the German
// levels (lowest first) for the level select. Values are the hub's URL values.
async function loadHeroFilters(lang) {
    const [categories, languages, suggestions] = await Promise.all([
        getCategories(),
        getLanguages(),
        loadSearchSuggestions(lang).catch(() => []),
    ]);
    const german = languages.find((l) => l.code === 'de');
    return {
        suggestions,
        professions: categories
            .map((c) => ({ id: c.id, name: localName(c, lang) }))
            .sort((a, b) => a.name.localeCompare(b.name, lang)),
        germanLevels: (german?.levels ?? []).map((l) => ({ value: l.name, label: localName(l, lang), rank: l.rank })),
        germanCertificate: Boolean(german?.has_certificate),
    };
}

// The homepage strip shows the fullest of the newest profiles first (category,
// languages, role, experience, bio, photo), newest first within a tie, so the
// first impression is a real profile rather than a half-filled one.
function completeness(c) {
    return (c.categories?.length > 0 ? 3 : 0)
        + (c.languages?.length > 0 ? 2 : 0)
        + (c.work_experience?.length > 0 ? 1 : 0)
        + (c.experience != null ? 1 : 0)
        + (c.bio ? 1 : 0)
        + (c.photo_blurhash || c.photo_url ? 1 : 0);
}

function showcase(candidates) {
    return candidates
        .map((c, i) => ({ c, i, score: completeness(c) }))
        .sort((x, y) => y.score - x.score || x.i - y.i)
        .map(({ c }) => c);
}

export default async function HomePage({ params }) {
    const { lang } = await params;
    // Render per request, not at build time: the cards carry signed photo URLs
    // that expire after an hour, so a cached page could show broken photos
    // (PLAN.md 9.7.7). Same as the candidate lists and the profiles.
    await connection();
    // The candidate strip, the counts and the job links are optional: the page renders without them.
    // `total` (live profiles) feeds the hero stat and employer step 01.
    // `germanB1` counts live candidates with German B1 or higher (same rule as ?de=B1).
    const [{ latest, total }, allJobs, guides, heroFilters, germanB1] = await Promise.all([
        getCandidates({ page: 1 })
            .then(({ candidates, total: count }) => ({ latest: showcase(candidates).slice(0, 6), total: count }))
            .catch(() => ({ latest: [], total: 0 })),
        loadAllJobs(lang).catch(() => []),
        getGuides(lang).then((list) => list.slice(0, 3).map(({ slug, title, description }) => ({ slug, title, description }))).catch(() => []),
        loadHeroFilters(lang).catch(() => ({ professions: [], germanLevels: [], germanCertificate: false })),
        countCandidates({ germanLevel: 'B1' }).catch(() => 0),
    ]);
    const jobs = allJobs.filter((c) => c.count > 0);
    return (
        <HomeView
            latest={latest}
            jobs={jobs}
            categories={allJobs}
            guides={guides}
            total={total}
            heroFilters={heroFilters}
            germanB1={germanB1}
        />
    );
}
