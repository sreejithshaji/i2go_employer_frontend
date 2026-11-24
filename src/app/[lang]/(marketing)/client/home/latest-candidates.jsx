'use client';

import NextLink from 'next/link';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import { FiArrowRight } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { plural } from '@/lib/i18n/config';
import Container from '../components/container';
import SectionHeading, { textLinkSx } from './section-heading';
import CompactCandidateCard from './compact-candidate-card';
import Reveal from '../components/reveal';

// Seconds per card for one full loop, so speed stays the same at any count.
const SECONDS_PER_CARD = 4;
// Each copy of a row must be wider than the view (4 cards from 900px), so
// short rows repeat their cards up to this many.
const MIN_CARDS_PER_COPY = 5;

// The row is rendered twice back to back, so moving by -50% loops seamlessly.
const slide = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

/**
 * Newest candidates (plan §6 row 2a, R1): up to 12 compact cards in two rows
 * that slide sideways in an endless loop, in opposite directions, 4 cards in
 * view from 900px (2 from 600px, about 1.3 below). One row when there are
 * fewer than 2 candidates. Hover or keyboard focus pauses both rows; with
 * reduced motion each is a plain sideways-scrolling strip. Card widths use
 * container units of the strip, so the 4 columns match the container.
 * Uses the wide (1440px) column, the same width as the hero's "Just joined" ticker.
 * Hidden when empty.
 */
export default function LatestCandidates({ latest = [], total = 0 }) {
    const { t, p } = useI18n();
    if (latest.length === 0) return null;
    const l = t.landing.latest;
    const rows = latest.length >= 2
        ? [latest.filter((_, i) => i % 2 === 0), latest.filter((_, i) => i % 2 === 1)]
        : [latest];
    return (
        <Box component="section" aria-labelledby="latest-title" sx={{ py: { xs: 4, md: 5 } }}>
            <Container wide>
                <Reveal sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: { xs: 1, md: 1.5 } }}>
                    <SectionHeading id="latest-title">{l.title}</SectionHeading>
                    <Box component={NextLink} href={p.hub} sx={{ ...textLinkSx, flexShrink: 0 }}>
                        {plural(l.seeAll, Math.max(total, latest.length))}
                        <FiArrowRight size={16} aria-hidden />
                    </Box>
                </Reveal>
                <Reveal
                    sx={{
                        display: 'grid', gap: 1,
                        '&:hover .lc-track, &:focus-within .lc-track': { animationPlayState: 'paused' },
                    }}
                >
                    {rows.map((row, i) => (
                        <SlideRow key={i} candidates={row} reverse={i === 1} />
                    ))}
                </Reveal>
            </Container>
        </Box>
    );
}

/** One looping row: the cards twice side by side, moved by half the width. */
function SlideRow({ candidates, reverse }) {
    // Repeat short rows so one copy always fills the view.
    const repeats = Math.ceil(MIN_CARDS_PER_COPY / candidates.length);
    const copy = Array.from({ length: repeats }, () => candidates).flat();
    const duration = Math.max(20, copy.length * SECONDS_PER_CARD);
    return (
        <Box
            sx={{
                containerType: 'inline-size',
                overflow: 'hidden',
                // Room for the hover lift and shadows inside the clipped box.
                py: 0.5,
                '@media (prefers-reduced-motion: reduce)': {
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    overscrollBehaviorX: 'contain',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                },
            }}
        >
            <Box
                className="lc-track"
                sx={{
                    display: 'flex', width: 'max-content',
                    animation: `${slide} ${duration}s linear infinite`,
                    animationDirection: reverse ? 'reverse' : 'normal',
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                }}
            >
                <CardList candidates={candidates} extra={copy.slice(candidates.length)} />
                <Box sx={{ display: 'contents', '@media (prefers-reduced-motion: reduce)': { display: 'none' } }}>
                    <CardList extra={copy} />
                </Box>
            </Box>
        </Box>
    );
}

/**
 * The cards: `candidates` are the real list, `extra` are repeats that are
 * hidden from screen readers and the tab order. Each item's right padding is
 * the gap, so the two copies line up for the loop.
 */
function CardList({ candidates = [], extra = [] }) {
    const items = [
        ...candidates.map((c) => ({ c, hidden: false })),
        ...extra.map((c) => ({ c, hidden: true })),
    ];
    return (
        <Box component="ul" aria-labelledby={candidates.length ? 'latest-title' : undefined} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex' }}>
            {items.map(({ c, hidden }, i) => (
                <Box
                    component="li"
                    key={`${i}-${c.id}`}
                    aria-hidden={hidden || undefined}
                    sx={{
                        flexShrink: 0, display: 'flex', minWidth: 0, pr: 1.5, scrollSnapAlign: 'start',
                        width: { xs: 'min(78cqi, 280px)', sm: '50cqi', md: '25cqi' },
                        '& > *': { flex: 1 },
                        '@media (prefers-reduced-motion: reduce)': hidden ? { display: 'none' } : {},
                    }}
                >
                    <CompactCandidateCard candidate={c} tabIndex={hidden ? -1 : undefined} />
                </Box>
            ))}
        </Box>
    );
}
