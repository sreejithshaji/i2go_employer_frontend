import { cache } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { getCandidateByPublicNo, getCandidates, readErrorKind } from '@/app/modules/candidates/_1-domain/candidate_service';
import {
    getCategories, getLanguages, getCategorySkills, getListingStats, isIndexableCount, resolveCategorySlug, resolveSkillSlug,
} from '@/app/modules/candidates/_1-domain/category_service';
import Breadcrumbs from '@/components/breadcrumbs';
import JsonLd from '@/components/json-ld';
import { format, localName, plural } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { candidateHref, parseCandidateSegment, paths, primaryCategory } from '@/lib/i18n/routes';
import { breadcrumbLd } from '@/lib/seo/json-ld';
import { pageMetadata, shortDescription } from '@/lib/seo/metadata';
import CandidateProfileView from '../../client/candidate-profile/candidate-profile-view';
import CandidatesView from '../../client/candidates/candidates-view';
import { JobLinks } from '../../client/components/seo-links';
import LandingHeader, { LinkSection } from '../../client/seo/landing-header';
import { listCanonical, queryString, readFilters } from './shared';

// /de/fachkraefte/[kategorie]/[slug] and /en/candidates/[category]/[slug]:
//   k-1042  one candidate (11.7): noindex, follow; one canonical URL under the
//           candidate's main category, other categories redirect there
//   [skill] candidates of the category with that skill (11.5)

// One fetch per request, shared by generateMetadata and the page.
const loadCandidate = cache(async (publicNo) => {
    try {
        return { candidate: await getCandidateByPublicNo(publicNo), error: false };
    } catch (error) {
        return { candidate: null, error: readErrorKind(error) };
    }
});

// The skill page's category and skill, or a redirect for old slugs, or null.
const loadSkillPage = cache(async (lang, categorySlug, skillSlug) => {
    const [category, skill] = await Promise.all([resolveCategorySlug(lang, categorySlug), resolveSkillSlug(lang, skillSlug)]);
    if (!category || !skill) return null;
    const c = category.category ?? category.redirectTo;
    const s = skill.skill ?? skill.redirectTo;
    if (category.redirectTo || skill.redirectTo) return { redirect: paths(lang).skill(c[`slug_${lang}`], s[`slug_${lang}`]) };
    const stats = await getListingStats();
    const count = stats.skillCount(c.id, s.id);
    return count > 0 ? { category: c, skill: s, count } : null;
});

const candidatePaths = (candidate) => ({ de: candidateHref('de', candidate), en: candidateHref('en', candidate) });

export async function childMetadata({ params, searchParams }, only) {
    const { lang, category: categorySlug, slug } = await params;
    if (lang !== only) return {};
    const t = getDictionary(lang);

    const publicNo = parseCandidateSegment(slug);
    if (publicNo != null) {
        const { candidate } = await loadCandidate(publicNo);
        if (!candidate) return { title: t.shell.profileTitle, robots: { index: false, follow: true } };
        const category = primaryCategory(candidate);
        return pageMetadata({
            lang,
            title: candidate.name,
            description: format(t.meta.candidateDescription, { name: candidate.name, category: localName(category, lang) }),
            pathsByLang: candidatePaths(candidate),
            // Candidate pages are never indexed but pass link equity (11.7.1).
            noindex: true,
            // Share image of the category, never the candidate's photo (11.9.2).
            imageCategory: category?.[`slug_${lang}`],
        });
    }

    const page = await loadSkillPage(lang, categorySlug, slug).catch(() => null);
    if (!page?.category) return {};
    const filters = await readFilters(searchParams);
    const name = localName(page.category, lang);
    const skillName = localName(page.skill, lang);
    return pageMetadata({
        lang,
        title: format(t.meta.skillTitle, { name, skill: skillName }),
        description: shortDescription(format(t.seo.skillIntro, { category: name, skill: skillName })),
        pathsByLang: {
            de: paths('de').skill(page.category.slug_de, page.skill.slug_de),
            en: paths('en').skill(page.category.slug_en, page.skill.slug_en),
        },
        canonical: listCanonical(paths(lang).skill(page.category[`slug_${lang}`], page.skill[`slug_${lang}`]), filters),
        noindex: !isIndexableCount(page.count),
        imageCategory: page.category[`slug_${lang}`],
    });
}

async function CandidatePage({ lang, categorySlug, slug, publicNo }) {
    const { candidate, error } = await loadCandidate(publicNo);
    const t = getDictionary(lang);
    const p = paths(lang);
    if (error) return <CandidateProfileView key={publicNo} candidate={null} error={error} />;
    // Hidden or deleted: a real 404 (11.7.3).
    if (!candidate) notFound();

    const canonical = candidateHref(lang, candidate);
    if (`${p.hub}/${categorySlug}/${slug}` !== canonical) permanentRedirect(canonical);

    const category = primaryCategory(candidate);
    const crumbs = [
        { label: t.nav.home, href: p.home },
        { label: t.nav.candidates, href: p.hub },
        ...(category ? [{ label: localName(category, lang), href: p.category(category[`slug_${lang}`]) }] : []),
        { label: candidate.name, href: canonical },
    ];
    return (
        <>
            <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} />
            <Breadcrumbs label={t.common.breadcrumb} items={crumbs} />
            {/* Keyed by id so state like "Enquiry sent" doesn't carry over to the next profile. */}
            <CandidateProfileView key={candidate.id} candidate={candidate} error={false} />
        </>
    );
}

async function SkillPage({ lang, categorySlug, slug, searchParams }) {
    const page = await loadSkillPage(lang, categorySlug, slug);
    if (!page) notFound();
    if (page.redirect) permanentRedirect(page.redirect + await queryString(searchParams));

    const t = getDictionary(lang);
    const p = paths(lang);
    const { category, skill, count } = page;
    const filters = await readFilters(searchParams);
    const [result, categories, skills, languages] = await Promise.all([
        getCandidates({ ...filters, categoryIds: [category.id], skillIds: [skill.id] }).catch((error) => ({ error })),
        getCategories().catch(() => []),
        getCategorySkills(category.id).catch(() => []),
        // Without languages the language filters are hidden (e.g. before migration 0024).
        getLanguages().catch(() => []),
    ]);

    const name = localName(category, lang);
    const skillName = localName(skill, lang);
    const categoryPath = p.category(category[`slug_${lang}`]);
    const crumbs = [
        { label: t.nav.home, href: p.home },
        { label: t.nav.candidates, href: p.hub },
        { label: name, href: categoryPath },
        { label: skillName, href: p.skill(category[`slug_${lang}`], skill[`slug_${lang}`]) },
    ];
    const siblings = skills
        .filter((s) => s.indexable && s.id !== skill.id)
        .map((s) => ({ id: s.id, name: localName(s, lang), href: p.skill(category[`slug_${lang}`], s[`slug_${lang}`]), count: s.count }));

    return (
        <>
            <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} />
            <Breadcrumbs label={t.common.breadcrumb} items={crumbs} />
            <LandingHeader
                title={format(t.meta.skillTitle, { name, skill: skillName })}
                countLine={plural(t.seo.countLine, count)}
                intro={format(t.seo.skillIntro, { category: name, skill: skillName })}
            />
            <CandidatesView
                candidates={result.candidates ?? []}
                total={result.total ?? 0}
                categories={categories}
                languages={languages}
                error={result.error ? readErrorKind(result.error) : false}
                scoped
            />
            <LinkSection title={t.seo.skillsInCategory}>
                <JobLinks items={[{ id: 'category', name, href: categoryPath }, ...siblings]} />
            </LinkSection>
        </>
    );
}

export default async function ChildPage({ params, searchParams, only }) {
    const { lang, category: categorySlug, slug } = await params;
    if (lang !== only) notFound();
    const publicNo = parseCandidateSegment(slug);
    return publicNo != null
        ? <CandidatePage lang={lang} categorySlug={categorySlug} slug={slug} publicNo={publicNo} />
        : <SkillPage lang={lang} categorySlug={categorySlug} slug={slug} searchParams={searchParams} />;
}
