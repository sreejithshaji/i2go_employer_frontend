'use client';

import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { FiBriefcase, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { plural } from '@/lib/i18n/config';
import { brand as b } from '@/app/theme';

const COUNT_MS = 1400;
const STAGGER_MS = 140;

const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Gentle, endless bob once the card has landed.
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
`;

// Ring that grows out of the live dot and fades.
const ping = keyframes`
  from { transform: scale(1); opacity: 0.6; }
  to   { transform: scale(2.8); opacity: 0; }
`;

// Icon tile glow breathing in and out.
const breathe = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(15,143,199,0.0), 0 0 10px rgba(15,143,199,0.10); }
  50%      { box-shadow: 0 0 0 5px rgba(15,143,199,0.08), 0 0 16px rgba(15,143,199,0.18); }
`;

// Light travelling along the accent bar.
const flow = keyframes`
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
`;

const ICONS = { live: FiUsers, professions: FiBriefcase, german: FiMessageCircle };

const sheen = keyframes`
  from { transform: translateX(-120%); }
  to   { transform: translateX(220%); }
`;

/**
 * Stat cards inside the light hero: white cards that rise in one after the
 * other while their figure counts up from 0, then float gently; each has an
 * icon tile with a breathing glow (the live card adds a pinging dot) and an
 * accent bar with light flowing along it. `stats`: [{ key, count, forms,
 * label, href? }] where `forms` is the plural pair ({ one, other }) for the
 * figure; with `href` the whole card is a link.
 * Only real figures; the caller drops a stat with 0. With reduced motion the
 * final figures show at once and nothing moves.
 */
export default function HeroStats({ stats = [] }) {
    if (stats.length === 0) return null;
    return (
        <Box
            component="ul"
            sx={{
                listStyle: 'none', m: 0, p: 0, mt: { xs: 3.5, md: 4 },
                display: 'grid', gap: 1.5,
                gridTemplateColumns: { xs: '1fr', sm: `repeat(${Math.min(stats.length, 3)}, minmax(0, 1fr))` },
            }}
        >
            {stats.map((s, i) => (
                <StatCard key={s.key} stat={s} index={i} delay={300 + i * STAGGER_MS} />
            ))}
        </Box>
    );
}

function StatCard({ stat, index, delay }) {
    const value = useCountUp(stat.count, delay);
    const Icon = ICONS[stat.key] ?? FiUsers;
    const live = stat.key === 'live';
    const link = stat.href ? { component: NextLink, href: stat.href } : {};
    return (
        <Box component="li" sx={{ minWidth: 0, display: 'flex' }}>
        <Box
            {...link}
            sx={{
                position: 'relative', overflow: 'hidden', minWidth: 0, flex: 1, display: 'block',
                textDecoration: 'none', color: 'inherit',
                '&:focus-visible': b.focusRing,
                p: { xs: 2, md: 2.25 },
                borderRadius: `${b.radiusMd}px`,
                border: `1px solid ${b.line}`,
                bgcolor: 'rgba(255,255,255,0.86)',
                backdropFilter: 'blur(8px)',
                boxShadow: b.shadow2,
                animation: `${rise} 700ms ${b.ease} ${delay}ms both`,
                transition: `border-color 280ms ${b.ease}, transform 280ms ${b.ease}`,
                '&:hover': { borderColor: b.accentLine, boxShadow: b.shadow3, transform: 'translateY(-2px)' },
                // One light sweep across the card after it lands.
                '&::after': {
                    content: '""', position: 'absolute', inset: 0, width: '40%', pointerEvents: 'none',
                    background: 'linear-gradient(100deg, transparent, rgba(15,143,199,0.08), transparent)',
                    transform: 'translateX(-120%)',
                    animation: `${sheen} 1200ms ${b.ease} ${delay + 600}ms 1 both`,
                },
                '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                    '&::after': { display: 'none' },
                },
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    // Offset per card so they don't bob in step.
                    animation: `${float} 5s ease-in-out ${delay + 900 + index * 700}ms infinite`,
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                }}
            >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box
                    aria-hidden
                    sx={{
                        width: 36, height: 36, borderRadius: '10px', display: 'grid', placeItems: 'center',
                        color: b.accentText, bgcolor: b.accentSoft, border: `1px solid ${b.accentLine}`,
                        animation: `${breathe} 3.2s ease-in-out ${index * 600}ms infinite`,
                        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                    }}
                >
                    <Icon size={18} />
                </Box>
                {live && stat.tag && (
                    <Box aria-hidden sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: b.okText }}>
                        <Box sx={{ position: 'relative', width: 7, height: 7 }}>
                            <Box sx={{ position: 'absolute', inset: 0, borderRadius: 999, bgcolor: b.ok }} />
                            <Box
                                sx={{
                                    position: 'absolute', inset: 0, borderRadius: 999, bgcolor: b.ok,
                                    animation: `${ping} 1.6s ${b.ease} infinite`,
                                    '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 },
                                }}
                            />
                        </Box>
                        {stat.tag}
                    </Box>
                )}
            </Box>
            <Box
                aria-hidden
                sx={{
                    width: 40, height: 3, borderRadius: 999, mb: 1.25,
                    background: `linear-gradient(90deg, rgba(15,143,199,0.35), ${b.accent}, #8FDDFA, ${b.accent}, rgba(15,143,199,0.35))`,
                    backgroundSize: '200% 100%',
                    animation: `${flow} 2.8s linear infinite`,
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                }}
            />
            {/* The final figure for screen readers; the counting one is visual only. */}
            <Typography component="p" sx={{ m: 0, fontSize: { xs: 20, md: 22 }, lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.6px', color: b.ink }}>
                <Box component="span" aria-hidden sx={{ fontVariantNumeric: 'tabular-nums' }}>
                    {plural(stat.forms, value)}
                </Box>
                <Box component="span" sx={visuallyHidden}>{plural(stat.forms, stat.count)}</Box>
            </Typography>
            <Typography component="p" sx={{ m: 0, mt: 0.5, fontSize: 12, lineHeight: 1.5, fontWeight: 600, color: b.muted }}>
                {stat.label}
            </Typography>
            </Box>
        </Box>
        </Box>
    );
}

/**
 * Counts from 0 to `target` after `delay` ms (ease-out). The server and the
 * first client render show `target`, so the page is right without JS; the
 * card is still invisible (rise animation) when the count restarts at 0.
 */
function useCountUp(target, delay) {
    const [value, setValue] = useState(target);
    useEffect(() => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || target <= 1) return undefined;
        let frame;
        let start;
        // The first frame lands at t = 0, so the count restarts from 0.
        const tick = (now) => {
            if (start === undefined) start = now + delay;
            const t = Math.min(1, Math.max(0, (now - start) / COUNT_MS));
            setValue(Math.round(target * (1 - (1 - t) ** 3)));
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, delay]);
    return value;
}

const visuallyHidden = {
    position: 'absolute', width: '1px', height: '1px', p: 0, m: '-1px', overflow: 'hidden',
    clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};
