'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useI18n } from '@/features/i18n';
import { levelLabel } from '@/lib/portal/format';
import { tokens } from '@/app/theme';

// Proficiency levels from the app, as a share of the bar.
const LEVELS = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };

/** Skill name with its proficiency level as a label and a bar (no made-up percentages). */
export default function SkillBar({ name, level, meta }) {
    const { t } = useI18n();
    const value = LEVELS[level];
    return (
        <Box sx={{ textAlign: 'left' }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography variant="body2" noWrap sx={{ color: 'text.primary', fontWeight: 500, minWidth: 0 }}>{name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, flexShrink: 0 }}>
                    {[value ? levelLabel(level, t) : null, meta].filter(Boolean).join(' · ')}
                </Typography>
            </Stack>
            {value && (
                <Box
                    role="meter"
                    aria-label={`${name}: ${levelLabel(level, t)}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={value}
                    aria-valuetext={levelLabel(level, t)}
                    sx={{ mt: 0.75, height: 4, borderRadius: `${tokens.radiusXs}px`, bgcolor: tokens.surfaceMuted, overflow: 'hidden' }}
                >
                    <Box sx={{ width: `${value}%`, height: '100%', borderRadius: 'inherit', bgcolor: 'primary.main' }} />
                </Box>
            )}
        </Box>
    );
}

const STEPS = ['beginner', 'intermediate', 'advanced', 'expert'];

/** Compact row for cards: skill name and a four-step level meter. */
export function SkillMeter({ name, level }) {
    const { t } = useI18n();
    const filled = STEPS.indexOf(level) + 1;
    return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ color: 'text.primary', fontWeight: 500, minWidth: 0 }}>{name}</Typography>
            {filled > 0 && (
                <Box
                    role="meter"
                    aria-label={`${name}: ${levelLabel(level, t)}`}
                    aria-valuemin={1}
                    aria-valuemax={4}
                    aria-valuenow={filled}
                    aria-valuetext={levelLabel(level, t)}
                    title={levelLabel(level, t)}
                    sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}
                >
                    {STEPS.map((step, i) => (
                        <Box
                            key={step}
                            sx={{ width: 14, height: 6, borderRadius: 999, bgcolor: i < filled ? 'primary.main' : tokens.primarySoftHover }}
                        />
                    ))}
                </Box>
            )}
        </Stack>
    );
}
