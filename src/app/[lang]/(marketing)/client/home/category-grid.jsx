'use client';

import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { FiArrowRight } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { plural } from '@/lib/i18n/config';
import { brand as b } from '@/app/theme';

// Seconds per card for one full loop, so speed stays the same at any count.
const SECONDS_PER_CARD = 3.5;
// From this many categories the slider splits into two rows going opposite ways.
const TWO_ROWS_FROM = 8;

const slide = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

/**
 * Every active job category with its live count, as hairline cards linking
 * into the SEO tree, sliding sideways in an endless loop (two rows in
 * opposite directions when there are many). Hover or keyboard focus pauses
 * it; with reduced motion it is a plain sideways-scrolling strip.
 * `jobs`: [{ id, name, href, count }]. `id="jobs"` is the target of employer
 * step 01 (Task 7.3). No visible heading: the section sits right under
 * the hero search and is named for screen readers by `aria-label`.
 * `tone="dark"` gives glass cards for the dark hero (like the stat cards);
 * `singleRow` keeps it to one row whatever the count.
 */
export default function CategoryGrid({ jobs = [], tone = 'light', singleRow = false, sx }) {
    const { t } = useI18n();
    if (jobs.length === 0) return null;
    const c = t.landing.categories;
    const rows = !singleRow && jobs.length >= TWO_ROWS_FROM
        ? [jobs.filter((_, i) => i % 2 === 0), jobs.filter((_, i) => i % 2 === 1)]
        : [jobs];
    return (
        <Box component="section" id="jobs" aria-label={c.title} sx={{ position: 'relative', py: { xs: 4, md: 6 }, scrollMarginTop: { xs: b.navHeightMobile, md: b.navHeight }, ...sx }}>
            <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 } }}>
                {rows.map((row, i) => (
                    <SlideRow key={i} jobs={row} reverse={i === 1} countForms={c.count} dark={tone === 'dark'} />
                ))}
            </Box>
        </Box>
    );
}

/** One looping row: the list twice side by side, moved by half its width. */
function SlideRow({ jobs, reverse, countForms, dark }) {
    const duration = Math.max(20, jobs.length * SECONDS_PER_CARD);
    return (
        <Box
            sx={{
                overflow: 'hidden',
                // Fade the cards in and out at the edges.
                maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
                '&:hover .cg-track, &:focus-within .cg-track': { animationPlayState: 'paused' },
                '@media (prefers-reduced-motion: reduce)': {
                    overflowX: 'auto', maskImage: 'none', WebkitMaskImage: 'none',
                    scrollSnapType: 'x proximity',
                },
            }}
        >
            <Box
                className="cg-track"
                sx={{
                    display: 'flex', width: 'max-content', py: 0.5,
                    animation: `${slide} ${duration}s linear infinite`,
                    animationDirection: reverse ? 'reverse' : 'normal',
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none', px: 2 },
                }}
            >
                <CardList jobs={jobs} countForms={countForms} dark={dark} />
                <Box sx={{ display: 'contents', '@media (prefers-reduced-motion: reduce)': { display: 'none' } }}>
                    <CardList jobs={jobs} countForms={countForms} dark={dark} duplicate />
                </Box>
            </Box>
        </Box>
    );
}

/** The cards; the duplicate copy is hidden from screen readers and the tab order. */
function CardList({ jobs, countForms, dark = false, duplicate = false }) {
    return (
        <Box component="ul" aria-hidden={duplicate || undefined} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex' }}>
            {jobs.map((job) => (
                <Box component="li" key={job.id} sx={{ flexShrink: 0, width: { xs: 220, md: 260 }, pr: { xs: 1.25, md: 2 }, display: 'flex', scrollSnapAlign: 'start' }}>
                    <Box component={NextLink} href={job.href} tabIndex={duplicate ? -1 : undefined} sx={dark ? darkCardSx : cardSx}>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography component="span" sx={{ display: 'block', fontSize: 13.5, lineHeight: 1.35, fontWeight: 800, color: dark ? b.onDark.text : b.ink2, overflowWrap: 'anywhere' }}>
                                {job.name}
                            </Typography>
                            <Typography component="span" sx={{ display: 'block', mt: 0.5, fontSize: 12, lineHeight: 1.5, fontWeight: 600, color: dark ? b.onDark.bodyStrong : b.muted }}>
                                {plural(countForms, job.count)}
                            </Typography>
                        </Box>
                        <Box aria-hidden className="cg-arrow" sx={{ display: 'flex', flexShrink: 0, color: dark ? b.onDark.subtle : b.faint, transition: `transform 280ms ${b.ease}, color 200ms ${b.ease}` }}>
                            <FiArrowRight size={16} />
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

const cardSx = {
    flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1.5,
    px: { xs: 1.75, md: 2.25 }, py: { xs: 1.75, md: 2 }, minHeight: 64,
    borderRadius: `${b.radiusMd}px`, border: `1px solid ${b.line}`, bgcolor: b.surface2, boxShadow: b.shadow1,
    textDecoration: 'none',
    transition: `transform 280ms ${b.ease}, border-color 280ms ${b.ease}, box-shadow 280ms ${b.ease}, background-color 280ms ${b.ease}`,
    '&:hover': { bgcolor: b.surface, borderColor: b.lineHover, transform: 'translateY(-1px)', boxShadow: b.shadow2 },
    '&:hover .cg-arrow': { color: b.accentText, transform: 'translateX(2px)' },
    '&:focus-visible': { outline: `2px solid ${b.accent}`, outlineOffset: 3 },
};

/** Glass card for the dark hero, matching the hero stat cards. */
const darkCardSx = {
    ...cardSx,
    border: `1px solid ${b.darkPanelBorder}`, bgcolor: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(8px)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(31,200,255,0.32)', transform: 'translateY(-1px)' },
    '&:hover .cg-arrow': { color: b.cyan, transform: 'translateX(2px)' },
    '&:focus-visible': { outline: `2px solid ${b.cyan}`, outlineOffset: 3 },
};
