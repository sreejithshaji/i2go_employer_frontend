'use client';

import { Box, Typography } from '@mui/material';
import { useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';
import Container from '../components/container';
import Eyebrow from '../components/eyebrow';
import HeroBackground from './hero-background';
import HeroPhoto, { WIDE_HERO } from './hero-photo';
import HeroSearch from './hero-search';
import HeroStats from './hero-stats';
import CategoryGrid from './category-grid';
import CandidateTicker from './candidate-ticker';

/**
 * Top of the homepage (plan §15, R3): a dark hero over the animated
 * background with the eyebrow pill, the page's only H1 (accent phrase in
 * cyan), lead, the candidate search and the animated stat cards, over a
 * recruitment photo that fills the right side (HeroPhoto).
 * `total`: live profiles; `jobs`: live categories;
 * `filters`: { suggestions, professions, germanLevels, germanCertificate } (9A.5, 9A.9.2);
 * `germanB1`: live candidates with German B1 or higher.
 * Stats (D18) come from real data only; a stat with 0 is hidden. The live
 * profiles and professions cards link to the candidate hub.
 * `categories`: every active category for the one-row slider along the
 * bottom of the hero; `latest`: newest candidates for the "Just joined"
 * ticker under it. From 900px the hero fills the screen (at least 640px) so
 * all of it shows without scrolling; on short screens (under 760px tall) the
 * lead and the portal button are hidden to make room.
 */
export default function HeroSection({ total = 0, jobs = [], categories = [], latest = [], filters, germanB1 = 0 }) {
    const { t, p } = useI18n();
    const h = t.landing.hero;
    const professions = filters?.professions?.length ?? 0;
    const stats = [
        total > 0 && { key: 'live', count: total, forms: h.statLive, label: h.statLiveCaption, tag: h.statLiveTag, href: p.hub },
        professions > 0 && { key: 'professions', count: professions, forms: h.statProfessions, label: h.statProfessionsCaption, href: p.hub },
        germanB1 > 0 && { key: 'german', count: germanB1, forms: h.statGerman, label: h.statGermanCaption },
    ].filter(Boolean);

    return (
        <Box component="section" aria-labelledby="hero-title">
            <Box
                data-nav-tone="dark"
                sx={{
                    position: 'relative', overflow: 'hidden', isolation: 'isolate', color: b.onDark.text,
                    '--focus-color': b.cyan,
                    display: 'flex', flexDirection: 'column',
                    // The screen height minus whatever part of the nav sits above the hero.
                    minHeight: { md: `max(640px, calc(100svh - ${b.navHeight}px + var(--nav-overlap, 0px)))` },
                }}
            >
                <HeroBackground />
                <HeroPhoto />
                <Container
                    wide
                    sx={{
                        // Shares the spare height with the category row below (equal grow), and sits at
                        // the bottom of its half so the stats stay close to the categories.
                        position: 'relative', flex: '1 1 auto',
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
                        columnGap: 6,
                        alignItems: 'end',
                        // Plus the nav height when the nav lies over the hero (--nav-overlap, MarketingShell).
                        pt: { xs: 'calc(40px + var(--nav-overlap, 0px))', md: 'calc(40px + var(--nav-overlap, 0px))' },
                        pb: 0,
                    }}
                >
                    <Box sx={{ maxWidth: 680, minWidth: 0 }}>
                        <EyebrowPill>{h.eyebrow}</EyebrowPill>
                        <Typography
                            id="hero-title"
                            component="h1"
                            sx={{
                                m: 0, mt: { xs: 2, md: 2.5 },
                                fontSize: { xs: 32, md: 40, lg: 48 }, lineHeight: 1.08, fontWeight: 800,
                                letterSpacing: { xs: '-0.9px', md: '-1.4px', lg: '-1.8px' }, color: b.onDark.text,
                                textWrap: 'balance',
                                // From 1280px (WIDE_HERO) each part is one line, which may run past the 680px
                                // text column. Below that it wraps inside the column, so it stays off the
                                // bright part of the photo (the German title is the longest).
                                '& > span': { display: { md: 'block' } },
                                [WIDE_HERO]: { width: 'max-content', maxWidth: 'none', '& > span': { whiteSpace: 'nowrap' } },
                            }}
                        >
                            <span>
                                {h.titleStart}
                                <Box component="span" sx={{ color: b.gold }}>{h.titleEmployers}</Box>
                            </span>
                            {' '}
                            <span>
                                {h.titleJoin}
                                <Box component="span" sx={{ color: b.cyan }}>{h.titleAccent}</Box>
                            </span>
                        </Typography>
                        <Typography
                            component="p"
                            sx={{ m: 0, mt: 2, maxWidth: 560, fontSize: { xs: 15, md: 15.5 }, lineHeight: 1.6, fontWeight: 500, color: b.onDark.body, ...hideWhenShort }}
                        >
                            {h.lead}
                        </Typography>
                        <HeroSearch jobs={jobs} suggestions={filters?.suggestions} tone="dark" />
                        <HeroStats stats={stats} />
                    </Box>
                </Container>
                {/* Category row: same column as the text (starts where the H1 starts), centred
                    vertically between the stat cards and the "Just joined" ticker. */}
                <Container
                    wide
                    sx={{ position: 'relative', flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 3 }}
                >
                    <CategoryGrid jobs={categories} tone="dark" singleRow sx={{ py: 0 }} />
                </Container>
                <Container wide sx={{ position: 'relative', pb: { xs: 4, md: 3 } }}>
                    <CandidateTicker candidates={latest} />
                </Container>
            </Box>
        </Box>
    );
}

// Desktop screens too short to show the whole hero without scrolling.
const hideWhenShort = { '@media (min-width: 900px) and (max-height: 760px)': { display: 'none' } };

/** Rounded pill around the eyebrow, with a small cyan dot. */
function EyebrowPill({ children }) {
    return (
        <Box
            sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, borderRadius: 999,
                border: `1px solid ${b.darkPanelBorder}`, bgcolor: 'rgba(31,200,255,0.06)',
                backdropFilter: 'blur(6px)',
            }}
        >
            <Box aria-hidden sx={{ width: 6, height: 6, borderRadius: 999, bgcolor: b.cyan, boxShadow: `0 0 10px ${b.cyan}` }} />
            <Eyebrow tone="dark">{children}</Eyebrow>
        </Box>
    );
}
