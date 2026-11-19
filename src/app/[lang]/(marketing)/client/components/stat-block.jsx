import { Box, Typography } from '@mui/material';
import { brand as b } from '@/app/theme';

/**
 * A big figure over a one-line caption (reference stat card, plan §1.6).
 * `value` is a real figure or a short phrase ("One team"), never an invented
 * number. `tone="dark"` is for the navy sections; `bare` drops the card, for
 * a stat row that sits directly on the canvas.
 */
export default function StatBlock({ value, label, tone = 'light', bare = false, sx }) {
    const dark = tone === 'dark';
    const card = bare
        ? {}
        : {
            p: { xs: 2.25, md: 2.5 },
            borderRadius: `${b.radiusMd}px`,
            border: `1px solid ${dark ? b.onDark.border : b.line}`,
            bgcolor: dark ? 'rgba(255,255,255,0.03)' : b.surface2,
            boxShadow: dark ? 'none' : b.shadow1,
        };
    return (
        <Box sx={{ minWidth: 0, ...card, ...sx }}>
            <Typography
                component="p"
                sx={{ m: 0, fontSize: 23, lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.7px', color: dark ? b.onDark.text : b.ink }}
            >
                {value}
            </Typography>
            {label && <Typography
                component="p"
                sx={{ m: 0, mt: 0.5, fontSize: 12.5, lineHeight: 1.55, fontWeight: 600, color: dark ? b.onDark.subtle : b.muted }}
            >
                {label}
            </Typography>}
        </Box>
    );
}
