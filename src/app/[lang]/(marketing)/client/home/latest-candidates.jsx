'use client';

import NextLink from 'next/link';
import { Box } from '@mui/material';
import { FiArrowRight } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { plural } from '@/lib/i18n/config';
import { brand as b } from '@/app/theme';
import Container from '../components/container';
import SectionHeading, { textLinkSx } from './section-heading';
import CompactCandidateCard from './compact-candidate-card';

/**
 * Newest candidates (plan §6 row 2a, R1), kept low: up to 6 compact cards
 * (3 × 2 from 900px; below that a two-row sideways strip that scrolls inside
 * its own box). The "Just joined" ticker lives in the hero. Hidden when empty.
 */
export default function LatestCandidates({ latest = [], total = 0 }) {
    const { t, p } = useI18n();
    if (latest.length === 0) return null;
    const l = t.landing.latest;
    return (
        <Box component="section" aria-labelledby="latest-title" sx={{ py: { xs: 4, md: 5 } }}>
            <Container>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: { xs: 1, md: 1.5 } }}>
                    <SectionHeading id="latest-title">{l.title}</SectionHeading>
                    <Box component={NextLink} href={p.hub} sx={{ ...textLinkSx, flexShrink: 0 }}>
                        {plural(l.seeAll, Math.max(total, latest.length))}
                        <FiArrowRight size={16} aria-hidden />
                    </Box>
                </Box>
                <Box sx={{ display: 'grid', gap: 1.5 }}>
                    <Box
                        component="ul"
                        aria-labelledby="latest-title"
                        tabIndex={0}
                        sx={{
                            listStyle: 'none', m: 0, p: 0,
                            display: 'grid', gap: 1.5,
                            gridTemplateColumns: { md: 'repeat(3, minmax(0, 1fr))' },
                            borderRadius: `${b.radiusMd}px`,
                            '&:focus-visible': { outline: `2px solid ${b.accent}`, outlineOffset: 4 },
                            '@media (max-width: 899.95px)': {
                                gridTemplateRows: 'repeat(2, auto)',
                                gridAutoFlow: 'column',
                                gridAutoColumns: 'min(78%, 280px)',
                                overflowX: 'auto',
                                scrollSnapType: 'x mandatory',
                                overscrollBehaviorX: 'contain',
                                // Room for the hover lift and shadows inside the scroll box.
                                py: 0.5, my: -0.5,
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' },
                            },
                        }}
                    >
                        {latest.map((c) => (
                            <Box component="li" key={c.id} sx={{ minWidth: 0, scrollSnapAlign: 'start' }}>
                                <CompactCandidateCard candidate={c} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
