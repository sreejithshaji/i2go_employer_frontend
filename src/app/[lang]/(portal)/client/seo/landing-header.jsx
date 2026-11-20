import { Box, Typography } from '@mui/material';
import { brand as b } from '@/app/theme';
import Eyebrow from '@/app/[lang]/(marketing)/client/components/eyebrow';
import StatBlock from '@/app/[lang]/(marketing)/client/components/stat-block';

/**
 * Top of a category or skill landing page (PLAN.md 11.4.3, 11.5.1), in the
 * homepage heading pattern (14.8): eyebrow, heavy tight H1, a row of real
 * figures, the intro text and a hairline. All in the server HTML.
 * stats: [{ value, label }]; when empty, `emptyLine` is shown instead.
 */
export default function LandingHeader({ eyebrow, title, stats = [], emptyLine, intro }) {
    return (
        <Box component="header" sx={{ mb: { xs: 3, md: 4 }, maxWidth: 820 }}>
            {eyebrow && <Eyebrow sx={{ mb: 1 }}>{eyebrow}</Eyebrow>}
            <Typography
                variant="h1"
                sx={{
                    fontSize: { xs: 30, md: 40 }, lineHeight: 1.1, fontWeight: 800,
                    letterSpacing: { xs: '-0.8px', md: '-1.4px' }, color: b.ink,
                }}
            >
                {title}
            </Typography>
            {stats.length > 0 ? (
                <Box
                    component="ul"
                    sx={{
                        display: 'flex', flexWrap: 'wrap', m: 0, mt: 2.5, p: 0, listStyle: 'none',
                        rowGap: 1.5,
                        // Hairline between figures (reference stat row on the canvas).
                        '& > li + li': { borderLeft: `1px solid ${b.line}`, pl: { xs: 2.5, md: 3 } },
                        '& > li': { pr: { xs: 2.5, md: 3 } },
                    }}
                >
                    {stats.map((s) => (
                        <Box component="li" key={s.label}>
                            <StatBlock bare value={s.value} label={s.label} />
                        </Box>
                    ))}
                </Box>
            ) : emptyLine && (
                <Typography sx={{ mt: 1.5, color: b.muted, fontSize: 15, lineHeight: 1.6 }}>{emptyLine}</Typography>
            )}
            {intro && (
                <Typography sx={{ mt: 2.5, color: b.muted, fontSize: 16, lineHeight: 1.65, maxWidth: 680 }}>{intro}</Typography>
            )}
            <Box sx={{ mt: { xs: 3, md: 3.5 }, height: '1px', bgcolor: b.line }} />
        </Box>
    );
}

/** A titled, numbered block of links under the list (skills, other jobs, guides). */
export function LinkSection({ number, title, children }) {
    return (
        <Box component="section" sx={{ mt: { xs: 5, md: 6 }, pt: { xs: 3, md: 3.5 }, borderTop: `1px solid ${b.line}` }}>
            <Typography
                component="h2"
                sx={{ m: 0, mb: 2, display: 'flex', alignItems: 'baseline', gap: 1.25, fontSize: { xs: 18, md: 20 }, fontWeight: 800, letterSpacing: '-0.4px', color: b.ink }}
            >
                {number != null && (
                    <Box component="span" aria-hidden sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: b.accentText, fontVariantNumeric: 'tabular-nums' }}>
                        {String(number).padStart(2, '0')}
                    </Box>
                )}
                {title}
            </Typography>
            {children}
        </Box>
    );
}
