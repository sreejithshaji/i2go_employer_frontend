import { notFound } from 'next/navigation';
import { getCandidates, readErrorKind } from '@/app/modules/candidates/_1-domain/candidate_service';
import { getCategories, getLanguages, getListingStats } from '@/app/modules/candidates/_1-domain/category_service';
import JsonLd from '@/components/json-ld';
import { format, localName } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { paths } from '@/lib/i18n/routes';
import { breadcrumbLd } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import CandidatesView from '../../client/candidates/candidates-view';
import { JobLinks } from '../../client/components/seo-links';
import { LinkSection } from '../../client/seo/landing-header';
import { listCanonical, readFilters } from './shared';

// All candidates (/de/fachkraefte, /en/candidates; PLAN.md 11.1). `only` is the
// language the route folder belongs to: /en/fachkraefte is a 404.

export async function hubMetadata({ params, searchParams }, only) {
    const { lang } = await params;
    if (lang !== only) return {};
    const t = getDictionary(lang);
    const filters = await readFilters(searchParams);
    const hub = paths(lang).hub;
    return pageMetadata({
        lang,
        title: filters.page > 1 ? format(t.meta.hubPageTitle, { page: filters.page }) : t.meta.hubTitle,
        description: t.meta.hubDescription,
        pathsByLang: { de: paths('de').hub, en: paths('en').hub },
        canonical: listCanonical(hub, filters),
    });
}

export default async function HubPage({ params, searchParams, only }) {
    const { lang } = await params;
    if (lang !== only) notFound();
    const t = getDictionary(lang);
    const p = paths(lang);
    const filters = await readFilters(searchParams);
    const [result, categories, stats, languages] = await Promise.all([
        getCandidates(filters).catch((error) => ({ error })),
        // Without categories the list still works; the category filter is just empty.
        getCategories().catch(() => []),
        getListingStats().catch(() => null),
        // Without languages the language filters are hidden (e.g. before migration 0024).
        getLanguages().catch(() => []),
    ]);
    const jobs = stats
        ? categories
            .map((c) => ({ id: c.id, name: localName(c, lang), href: p.category(c[`slug_${lang}`]), count: stats.categoryCount(c.id) }))
            .filter((c) => c.count > 0)
            .sort((a, b) => a.name.localeCompare(b.name, lang))
        : [];

    return (
        <>
            <JsonLd data={breadcrumbLd([{ name: t.nav.home, path: p.home }, { name: t.nav.candidates, path: p.hub }])} />
            <CandidatesView
                candidates={result.candidates ?? []}
                total={result.total ?? 0}
                categories={categories}
                languages={languages}
                error={result.error ? readErrorKind(result.error) : false}
            />
            {jobs.length > 0 && (
                <LinkSection title={t.seo.allCategories}>
                    <JobLinks items={jobs} />
                </LinkSection>
            )}
        </>
    );
}
