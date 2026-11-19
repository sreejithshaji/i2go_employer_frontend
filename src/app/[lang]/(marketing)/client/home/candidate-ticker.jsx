'use client';

import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useI18n } from '@/features/i18n';
import { paths } from '@/lib/i18n/routes';
import { brand as b } from '@/app/theme';
import { CandidateAvatar } from './compact-candidate-card';

// The list is rendered twice back to back, so moving by -50% loops seamlessly.
const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const SECONDS_PER_ITEM = 3;

function Chip({ candidate }) {
    return (
        <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, pl: 0.5, pr: 1.5, py: 0.5, borderRadius: 999, bgcolor: b.onDark.hover, border: `1px solid ${b.onDark.border}` }}>
            <CandidateAvatar candidate={candidate} size={28} />
            <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 600, color: b.onDark.text }}>{candidate.name}</Typography>
        </Box>
    );
}

/**
 * Slim dark strip under the compact cards: a "Just joined" label, then
 * candidate photos and names scrolling sideways on a loop. Pauses on hover
 * and stays still for reduced motion; the copy is aria-hidden. The whole
 * strip links to the candidate hub.
 */
export default function CandidateTicker({ candidates = [] }) {
    const { lang, t } = useI18n();
    if (candidates.length === 0) return null;
    const duration = `${Math.max(candidates.length, 5) * SECONDS_PER_ITEM}s`;
    const listSx = { listStyle: 'none', m: 0, p: 0, pr: 1, display: 'flex', gap: 1 };

    return (
        <Box
            component={NextLink}
            href={paths(lang).hub}
            sx={{
                display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden', height: 48,
                borderRadius: 999, background: b.darkPanel, border: `1px solid ${b.darkPanelBorder}`,
                textDecoration: 'none', cursor: 'pointer', transition: 'border-color .2s',
                '&:hover': { borderColor: b.cyan },
                '&:focus-visible': { outline: `2px solid ${b.cyan}`, outlineOffset: 2 },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, pl: 2, pr: 1.5 }}>
                <Box aria-hidden sx={{ width: 8, height: 8, borderRadius: 999, bgcolor: b.cyan, boxShadow: '0 0 0 4px rgba(31,200,255,0.15)' }} />
                <Typography noWrap sx={{ fontSize: 13, fontWeight: 800, color: b.onDark.text }}>{t.landing.latest.tickerTitle}</Typography>
            </Box>
            <Box
                sx={{
                    flex: 1, minWidth: 0, overflow: 'hidden',
                    maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
                    '&:hover .ticker-track': { animationPlayState: 'paused' },
                }}
            >
                <Box
                    className="ticker-track"
                    sx={{
                        display: 'flex', width: 'max-content',
                        animation: `${scroll} ${duration} linear infinite`,
                        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                    }}
                >
                    <Box component="ul" sx={listSx}>
                        {candidates.map((c) => <Chip key={c.id} candidate={c} />)}
                    </Box>
                    <Box component="ul" aria-hidden sx={listSx}>
                        {candidates.map((c) => <Chip key={`dup-${c.id}`} candidate={c} />)}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
