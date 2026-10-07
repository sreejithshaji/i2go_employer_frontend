import { notFound, permanentRedirect } from 'next/navigation';
import {
    getCandidateRefById, getCandidateRefByPublicNo, getCandidates, isCandidateUuid, readErrorKind,
} from '@/app/modules/candidates/_1-domain/candidate_service';
import {
    getCategories, getLanguages, getCategorySkills, getListingStats, isIndexableCount, resolveCategorySlug,
} from '@/app/modules/candidates/_1-domain/category_service';
import Breadcrumbs from '@/components/breadcrumbs';
import JsonLd from '@/components/json-ld';
import { getGuides } from '@/app/modules/guides/_1-domain/guide_service';
import { format, localName, plural } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { candidateHref, parseCandidateSegment, paths } from '@/lib/i18n/routes';
import { breadcrumbLd } from '@/lib/seo/json-ld';
import { pageMetadata, shortDescription } from '@/lib/seo/metadata';
import CandidatesView from '../../client/candidates/candidates-view';
import { JobLinks } from '../../client/components/seo-links';
import LandingHeader, { LinkSection } from '../../client/seo/landing-header';
import { listCanonical, queryString, readFilters } from './shared';

// /de/fachkraefte/[kategorie] and /en/candidates/[category] (PLAN.md 11.4).
// The same segment also takes candidate short links (k-1042) and old profile
// links (/candidates/<uuid>), which redirect to the candidate's canonical URL.

async function resolve(lang, slug) {
    const publicNo = parseCandidateSegment(slug);
    if (publicNo != null) {
        const ref = await getCandidateRefByPublicNo(publicNo);
        return ref ? { redirect: candidateHref(lang, ref) } : null;
    }
    if (isCandidateUuid(slug)) {
        const ref = await getCandidateRefById(slug);
        return ref ? { redirect: candidateHref(lang, ref) } : null;
    }
    const resolved = await resolveCategorySlug(lang, slug);
    if (!resolved) return null;
    if (resolved.redirectTo) return { redirect: paths(lang).category(resolved.redirectTo[`slug_${lang}`]), keepQuery: true };
    return { category: resolved.category };
}

export async function categoryMetadata({ params, searchParams }, only) {
    const { lang, category: slug } = await params;
    if (lang !== only) return {};
    const resolved = await resolve(lang, slug).catch(() => null);
    if (!resolved?.category) return {};
    const t = getDictionary(lang);
    const { category } = resolved;
    const [filters, stats] = await Promise.all([readFilters(searchParams), getListingStats().catch(() => null)]);
    const name = localName(category, lang);
    const count = stats?.categoryCount(category.id) ?? 0;
    // Title and description set in the admin panel (0021) win over the automatic
    // ones; page 2+ keeps the automatic title so every page's title stays unique.
    const seoTitle = category[`seo_title_${lang}`];
    const seoDescription = category[`seo_description_${lang}`];
    return pageMetadata({
        lang,
        title: filters.page > 1
            ? format(t.meta.categoryPageTitle, { name, page: filters.page })
            : seoTitle || format(t.meta.categoryTitle, { name }),
        description: seoDescription || shortDescription(category[`description_${lang}`] || t.meta.hubDescription),
        pathsByLang: { de: paths('de').category(category.slug_de), en: paths('en').category(category.slug_en) },
        canonical: listCanonical(paths(lang).category(category[`slug_${lang}`]), filters),
        // Thin-page rule (11.6): fewer than 3 live candidates → noindex, still reachable.
        noindex: !isIndexableCount(count),
        imageCategory: category[`slug_${lang}`],
    });
}

export default async function CategoryPage({ params, searchParams, only }) {
    const { lang, category: slug } = await params;
    if (lang !== only) notFound();
    const resolved = await resolve(lang, slug);
    if (!resolved) notFound();
    if (resolved.redirect) permanentRedirect(resolved.redirect + (resolved.keepQuery ? await queryString(searchParams) : ''));

    const { category } = resolved;
    const t = getDictionary(lang);
    const p = paths(lang);
    const filters = await readFilters(searchParams);
    const [result, stats, skills, categories, guideList, languages] = await Promise.all([
        getCandidates({ ...filters, categoryIds: [category.id] }).catch((error) => ({ error })),
        getListingStats().catch(() => null),
        getCategorySkills(category.id).catch(() => []),
        getCategories().catch(() => []),
        getGuides(lang).catch(() => []),
        // Without languages the language filters are hidden (e.g. before migration 0024).
        getLanguages().catch(() => []),
    ]);

    const name = localName(category, lang);
    const count = stats ? stats.categoryCount(category.id) : result.total ?? 0;
    const crumbs = [
        { label: t.nav.home, href: p.home },
        { label: t.nav.candidates, href: p.hub },
        { label: name, href: p.category(category[`slug_${lang}`]) },
    ];
    // Only skill pages that pass the thin-page rule are linked (11.5.2).
    const skillLinks = skills
        .filter((s) => s.indexable)
        .map((s) => ({ id: s.id, name: localName(s, lang), href: p.skill(category[`slug_${lang}`], s[`slug_${lang}`]), count: s.count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, lang));
    const otherJobs = (stats ? categories : [])
        .filter((c) => c.id !== category.id && stats.categoryCount(c.id) > 0)
        .map((c) => ({ id: c.id, name: localName(c, lang), href: p.category(c[`slug_${lang}`]), count: stats.categoryCount(c.id) }))
        .sort((a, b) => a.name.localeCompare(b.name, lang));
    const guides = guideList.slice(0, 3).map((g) => ({ id: g.key, name: g.title, href: p.guide(g.slug) }));

    return (
        <>
            <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} />
            <Breadcrumbs label={t.common.breadcrumb} items={crumbs} />
            <LandingHeader
                title={name}
                countLine={count > 0 ? plural(t.seo.countLine, count) : t.seo.noneYet}
                intro={category[`description_${lang}`]}
            />
            <CandidatesView
                candidates={result.candidates ?? []}
                total={result.total ?? 0}
                categories={categories}
                languages={languages}
                error={result.error ? readErrorKind(result.error) : false}
                scoped
            />
            {skillLinks.length > 0 && (
                <LinkSection title={t.seo.skillsInCategory}>
                    <JobLinks items={skillLinks} />
                </LinkSection>
            )}
            {otherJobs.length > 0 && (
                <LinkSection title={t.seo.otherCategories}>
                    <JobLinks items={otherJobs} />
                </LinkSection>
            )}
            {guides.length > 0 && (
                <LinkSection title={t.seo.guidesTitle}>
                    <JobLinks items={guides} />
                </LinkSection>
            )}
        </>
    );
}
