'use client';

import NextLink from 'next/link';
import { Box } from '@mui/material';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import Container from '../components/container';
import HairlineList from '../components/hairline-list';
import SectionHeading, { textLinkSx } from './section-heading';

/**
 * "Guides for employers" (plan §6, row "Guides (SEO)"): the newest guides as
 * a hairline list plus "All guides", the internal links into the guide pages
 * (PLAN.md 11.12.3). The job links live in the category grid (R1, 6.4).
 * Hidden when there are no guides.
 *
 * guides: [{ slug, title, description }]
 */
export default function SeoLinksSection({ guides = [] }) {
    const { t, p } = useI18n();
    const m = t.landing.more;
    if (guides.length === 0) return null;
    return (
        <Box component="section" id="guides" aria-labelledby="guides-title" sx={{ py: { xs: 6, md: 9 } }}>
            <Container>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
                    <SectionHeading id="guides-title">{m.guidesTitle}</SectionHeading>
                    <Box component={NextLink} href={p.guides} sx={{ ...textLinkSx, flexShrink: 0 }}>
                        {m.allGuides}
                        <FiArrowRight size={16} aria-hidden />
                    </Box>
                </Box>
                <HairlineList
                    columns={3}
                    items={guides.map((g) => ({ key: g.slug, label: g.title, text: g.description, icon: <FiBookOpen />, href: p.guide(g.slug) }))}
                />
            </Container>
        </Box>
    );
}
