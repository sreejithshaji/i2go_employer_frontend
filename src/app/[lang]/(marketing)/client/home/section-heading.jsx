import { Typography } from '@mui/material';
import { brand as b } from '@/app/theme';

/**
 * Section heading of the homepage (step-title scale, UI_UX.md → Marketing
 * pages: 28/1.2, 22 below 900px, weight 800, -0.8px). `component` sets the
 * level; the default is h2.
 */
export default function SectionHeading({ component = 'h2', tone = 'light', sx, children, ...props }) {
    return (
        <Typography
            component={component}
            {...props}
            sx={{
                m: 0,
                fontSize: { xs: 22, md: 28 },
                lineHeight: 1.2,
                fontWeight: 800,
                letterSpacing: '-0.8px',
                color: tone === 'dark' ? b.onDark.text : b.ink,
                ...sx,
            }}
        >
            {children}
        </Typography>
    );
}

/** Small text link with an arrow (accent text on light), e.g. "See all". */
export const textLinkSx = {
    display: 'inline-flex', alignItems: 'center', gap: 0.75, minHeight: 44,
    fontSize: 14, fontWeight: 700, color: b.accentText, textDecoration: 'none', borderRadius: '6px',
    '& svg': { transition: `transform 280ms ${b.ease}` },
    '&:hover': { color: b.accentInk },
    '&:hover svg': { transform: 'translateX(2px)' },
    '&:focus-visible': b.focusRing,
};
