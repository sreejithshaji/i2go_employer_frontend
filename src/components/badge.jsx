import { Box } from '@mui/material';
import { tokens } from '@/app/theme';

const TONES = {
    neutral: { bg: tokens.surfaceMuted, color: tokens.textSecondary },
    primary: { bg: tokens.primarySoft, color: tokens.primary },
    success: { bg: tokens.successSoft, color: tokens.successText },
    warning: { bg: tokens.warningSoft, color: tokens.warningText },
    danger: { bg: tokens.dangerSoft, color: tokens.dangerText },
};

/** Small status pill. tone: neutral | primary | success | warning | danger. */
export default function Badge({ tone = 'neutral', icon, children, sx }) {
    const { bg, color } = TONES[tone] ?? TONES.neutral;
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5, height: 24, px: 1.25,
                borderRadius: 999, bgcolor: bg, color, fontSize: 12, fontWeight: 600, lineHeight: '16px',
                whiteSpace: 'nowrap', ...sx,
            }}
        >
            {icon}
            {children}
        </Box>
    );
}
