'use client';

import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import {
    FiArrowRight, FiAward, FiBookOpen, FiBriefcase, FiCalendar, FiCheck, FiClipboard, FiFileText, FiGlobe, FiHeart,
    FiRefreshCw, FiShield, FiVideo, FiZap,
} from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { plural } from '@/lib/i18n/config';
import { brand as b } from '@/app/theme';
import HairlineList from '../components/hairline-list';
import StatBlock from '../components/stat-block';
import { textLinkSx } from './section-heading';

/*
 * The visuals of the six employer steps (plan §4.3, R1). Real data or a
 * picture of an existing feature only: no illustrations, no invented figures.
 * Drawn for the light employer section.
 */

const linkSx = textLinkSx;

/** 01: "{total} profiles live now" across the live categories, linking up to the category grid (#jobs). */
export function PoolVisual({ total, jobs }) {
    const { t, p } = useI18n();
    const pool = t.landing.employer.pool;
    return (
        <Box>
            {total > 0 && (
                <StatBlock
                    bare
                    value={plural(pool.total, total)}
                    label={jobs.length > 0 ? plural(t.landing.hero.statCategories, jobs.length) : undefined}
                    sx={{ borderTop: `1px solid ${b.line2}`, borderBottom: `1px solid ${b.line2}`, py: 2, maxWidth: 560, '& p + p': { color: b.mutedOnTint } }}
                />
            )}
            <Box
                component={jobs.length > 0 ? 'a' : NextLink}
                href={jobs.length > 0 ? '#jobs' : p.hub}
                sx={{ ...linkSx, mt: 1 }}
            >
                {jobs.length > 0 ? pool.byJob : t.landing.employer.explore.browseAll}
                <FiArrowRight size={16} aria-hidden />
            </Box>
        </Box>
    );
}

const exploreIcons = [<FiBriefcase key="w" />, <FiBookOpen key="e" />, <FiZap key="s" />, <FiGlobe key="l" />, <FiVideo key="v" />];

/** 02: what a profile shows, as a hairline list, and the way into the hub. No cards: the strip under the hero shows them. */
export function ExploreVisual() {
    const { t, p } = useI18n();
    const explore = t.landing.employer.explore;
    return (
        <Box>
            <HairlineList
                lineColor={b.line2}
                textColor={b.mutedOnTint}
                columns={2}
                items={explore.items.map((item, i) => ({ key: item.label, label: item.label, text: item.text, icon: exploreIcons[i] }))}
                sx={{ maxWidth: 680 }}
            />
            <Box component={NextLink} href={p.hub} sx={{ ...linkSx, mt: 1 }}>
                {explore.browseAll}
                <FiArrowRight size={16} aria-hidden />
            </Box>
        </Box>
    );
}

/** 03: the reference's selected card (accent border, soft accent tile with a heart, round tick) showing a saved candidate. */
export function ShortlistVisual() {
    const { t } = useI18n();
    const s = t.landing.employer.shortlist;
    return (
        <Box
            sx={{
                position: 'relative', maxWidth: 560, display: 'flex', alignItems: 'flex-start', gap: 2,
                p: { xs: 2.25, md: 2.5 }, pr: { xs: 6, md: 7 }, borderRadius: `${b.radiusMd}px`,
                bgcolor: b.surface, border: `1.5px solid ${b.accent}`, boxShadow: '0 0 0 4px rgba(15,143,199,0.1)',
            }}
        >
            <Box aria-hidden sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: b.accentSoft, color: b.accentText }}>
                <FiHeart size={20} fill="currentColor" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography component="p" sx={{ m: 0, fontSize: 15, lineHeight: 1.45, fontWeight: 800, color: b.ink }}>{s.title}</Typography>
                <Typography component="p" sx={{ m: 0, mt: 0.5, fontSize: 14, lineHeight: 1.6, fontWeight: 500, color: b.muted }}>{s.text}</Typography>
            </Box>
            <Box
                aria-hidden
                sx={{
                    position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderRadius: '50%',
                    display: 'grid', placeItems: 'center', bgcolor: b.accentText, color: '#fff',
                }}
            >
                <FiCheck size={14} strokeWidth={3} />
            </Box>
        </Box>
    );
}

/** 04: the reference's three mini steps (ringed circle, accent numeral): enquiry → interview → decision (D5). */
export function MeetVisual() {
    const { t } = useI18n();
    const steps = t.landing.employer.meet;
    return (
        <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
            {steps.map((step, i) => (
                <Box
                    component="li"
                    key={step.title}
                    sx={{
                        display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: 'flex-start', gap: { xs: 1.75, md: 1.5 },
                        p: 2.25, borderRadius: `${b.radiusMd}px`, bgcolor: b.surface, border: `1px solid ${b.line}`, boxShadow: b.shadow1,
                    }}
                >
                    <Box
                        aria-hidden
                        sx={{
                            width: 32, height: 32, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center',
                            bgcolor: b.accentSoft, border: `1.5px solid ${b.accentLine}`, boxSizing: 'border-box', color: b.accentText, fontSize: 13, fontWeight: 800,
                        }}
                    >
                        {i + 1}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography component="p" sx={{ m: 0, fontSize: 15, lineHeight: 1.45, fontWeight: 800, color: b.ink }}>{step.title}</Typography>
                        <Typography component="p" sx={{ m: 0, mt: 0.5, fontSize: 13.5, lineHeight: 1.55, fontWeight: 500, color: b.muted }}>{step.text}</Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

const manageIcons = [<FiFileText key="d" />, <FiShield key="v" />, <FiCalendar key="a" />, <FiRefreshCw key="c" />, <FiAward key="w" />, <FiClipboard key="o" />];

/** 05: what the team takes over, as a two-column hairline checklist. */
export function ManageVisual() {
    const { t } = useI18n();
    return (
        <HairlineList
            lineColor={b.line2}
            textColor={b.mutedOnTint}
            columns={2}
            items={t.landing.employer.manage.map((label, i) => ({ key: label, label, icon: manageIcons[i] }))}
            sx={{ maxWidth: 680 }}
        />
    );
}

/** 06: closing stat-style cards, phrases only (no invented numbers). Hands off into the CTA panel below. */
export function WelcomeVisual() {
    const { t } = useI18n();
    return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
            {t.landing.employer.welcome.map((item) => (
                <StatBlock key={item.value} value={item.value} label={item.caption} sx={{ '& p:first-of-type': { fontSize: 19, letterSpacing: '-0.5px' } }} />
            ))}
        </Box>
    );
}
