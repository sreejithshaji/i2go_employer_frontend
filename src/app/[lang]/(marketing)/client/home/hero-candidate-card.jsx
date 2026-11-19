'use client';

import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import CandidateCard from '@/app/[lang]/(portal)/client/components/candidate-card';
import { useI18n } from '@/features/i18n';
import { plural } from '@/lib/i18n/config';
import { brand as b } from '@/app/theme';

const pulse = keyframes`
  from { transform: scale(1); opacity: 0.55; }
  to   { transform: scale(2.6); opacity: 0; }
`;

/**
 * Visual of the dark hero (plan §15, D19): the newest live profile as the
 * real portal card (same anonymisation and locked photo for guests as the
 * lists), with a floating "{n} live profiles" badge. No stock photo.
 * The caller renders nothing when there is no candidate.
 */
export default function HeroCandidateCard({ candidate, total = 0 }) {
    const { t } = useI18n();
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                maxWidth: { xs: 320, md: 300, lg: 340 },
                justifySelf: { md: 'end' },
                mt: { xs: 5, md: 0 },
                mb: { xs: 2, md: 0 },
                // Phones under 390px: text and CTAs only.
                '@media (max-width: 389.95px)': { display: 'none' },
            }}
        >
            {/* Soft cyan halo so the white card sits in the dark scene */}
            <Box aria-hidden sx={{ position: 'absolute', inset: '-18%', background: b.glow, opacity: 0.8, pointerEvents: 'none' }} />
            <Box
                sx={{
                    position: 'relative',
                    textAlign: 'left',
                    borderRadius: '16px',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(31,200,255,0.18)',
                    '& .MuiCard-root': { borderRadius: '16px' },
                }}
            >
                <CandidateCard candidate={candidate} />
            </Box>
            {total > 0 && (
                <Box
                    sx={{
                        position: 'absolute',
                        // Hangs off the card's bottom edge, so it never covers the card's stats.
                        left: { xs: 12, md: -24 },
                        bottom: -22,
                        display: 'inline-flex', alignItems: 'center', gap: 1.25,
                        px: 1.75, py: 1.1, borderRadius: 999,
                        bgcolor: b.graphite, border: `1px solid ${b.darkPanelBorder}`,
                        boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
                        color: b.onDark.text, fontSize: 13.5, fontWeight: 800, whiteSpace: 'nowrap',
                    }}
                >
                    <Box aria-hidden sx={{ position: 'relative', width: 8, height: 8 }}>
                        <Box sx={{ position: 'absolute', inset: 0, borderRadius: 999, bgcolor: b.cyan }} />
                        <Box
                            sx={{
                                position: 'absolute', inset: 0, borderRadius: 999, bgcolor: b.cyan,
                                animation: `${pulse} 1.8s ${b.ease} infinite`,
                                '@media (prefers-reduced-motion: reduce)': { animation: 'none !important', opacity: 0 },
                            }}
                        />
                    </Box>
                    {plural(t.landing.hero.statLive, total)}
                </Box>
            )}
        </Box>
    );
}
