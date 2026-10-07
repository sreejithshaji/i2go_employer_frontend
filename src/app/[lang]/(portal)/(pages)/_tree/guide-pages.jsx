import { cache } from 'react';
import { connection } from 'next/server';
import { notFound, permanentRedirect } from 'next/navigation';
import { Box } from '@mui/material';
import Breadcrumbs from '@/components/breadcrumbs';
import JsonLd from '@/components/json-ld';
import PageIntro from '@/components/page-intro';
import { getGuides, resolveGuideSlug } from '@/app/modules/guides/_1-domain/guide_service';
import { format } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { paths } from '@/lib/i18n/routes';
import { breadcrumbLd, faqLd } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import { dateLabel } from '@/lib/portal/format';
import GuideView, { GuideCard } from '../../client/guides/guide-view';

// Guides (PLAN.md 11.12): /de/ratgeber[/thema] and /en/guides[/topic].
// Content lives in the database (guides table, edited in the admin panel);
// drafts are 404. Rendered per request so an edit shows up straight away. An
// old slug (changed in the admin panel) redirects permanently to the current one.

// One lookup per request, shared by generateMetadata and the page.
const loadGuide = cache(async (lang, slug) => resolveGuideSlug(lang, slug));

export async function guidesIndexMetadata({ params }, only) {
    const { lang } = await params;
    if (lang !== only) return {};
    const t = getDictionary(lang);
    return pageMetadata({
        lang,
        title: t.meta.guidesTitle,
        description: t.meta.guidesDescription,
        pathsByLang: { de: paths('de').guides, en: paths('en').guides },
    });
}

export async function GuidesIndexPage({ params, only }) {
    const { lang } = await params;
    if (lang !== only) notFound();
    await connection();
    const t = getDictionary(lang);
    const p = paths(lang);
    const guides = await getGuides(lang).catch(() => []);
    return (
        <>
            <JsonLd data={breadcrumbLd([{ name: t.nav.home, path: p.home }, { name: t.nav.guides, path: p.guides }])} />
            <PageIntro>{t.seo.guidesIntro}</PageIntro>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' } }}>
                {guides.map((guide) => (
                    <GuideCard key={guide.key} href={p.guide(guide.slug)} title={guide.title} description={guide.description} readLabel={t.seo.readGuide} />
                ))}
            </Box>
        </>
    );
}

export async function guideMetadata({ params }, only) {
    const { lang, topic } = await params;
    if (lang !== only) return {};
    const resolved = await loadGuide(lang, topic).catch(() => null);
    const guide = resolved?.guide;
    if (!guide) return {};
    return pageMetadata({
        lang,
        title: guide.title,
        description: guide.description,
        pathsByLang: { de: paths('de').guide(guide.slugs.de), en: paths('en').guide(guide.slugs.en) },
    });
}

export async function GuidePage({ params, only }) {
    const { lang, topic } = await params;
    if (lang !== only) notFound();
    await connection();
    const resolved = await loadGuide(lang, topic);
    if (!resolved) notFound();
    if (resolved.redirectTo) permanentRedirect(paths(lang).guide(resolved.redirectTo.slug));
    const { guide } = resolved;
    const t = getDictionary(lang);
    const p = paths(lang);
    const crumbs = [
        { label: t.nav.home, href: p.home },
        { label: t.nav.guides, href: p.guides },
        { label: guide.title, href: p.guide(guide.slug) },
    ];
    return (
        <>
            <JsonLd
                data={[
                    breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href }))),
                    guide.faq.length > 0 ? faqLd(guide.faq) : null,
                ]}
            />
            <Breadcrumbs label={t.common.breadcrumb} items={crumbs} />
            <GuideView
                guide={guide}
                labels={{
                    updated: format(t.seo.updated, { date: dateLabel(guide.updated, lang) }),
                    onThisPage: t.seo.onThisPage,
                    faq: t.seo.faq,
                    ctaTitle: t.seo.guideCtaTitle,
                    ctaText: t.seo.guideCtaText,
                }}
                ctaHref={p.hub}
                ctaLabel={t.common.browseCandidates}
            />
        </>
    );
}
