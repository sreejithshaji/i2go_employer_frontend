import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { FiArrowRight } from 'react-icons/fi';
import { brand as b } from '@/app/theme';
import Reveal, { STAGGER } from './reveal';

/**
 * Rows separated only by a 1px top hairline, no boxes (reference
 * `.ggrid/.gitem`, plan §1.6). Each item: { key?, label, text?, icon?, href? }.
 * With `href` the whole row is a link with an arrow at the end. `columns`
 * applies from 900px; below that the list is one column. `reveal` gives each
 * row the entrance (plan §10), staggered by column.
 */
export default function HairlineList({ items, columns = 1, tone = 'light', reveal = false, sx, ...props }) {
    const dark = tone === 'dark';
    const colors = {
        line: dark ? b.onDark.line : b.line,
        label: dark ? b.onDark.text : b.ink2,
        text: dark ? b.onDark.body : b.muted,
        icon: dark ? b.onDark.subtle : b.faint,
        hover: dark ? b.cyan : b.accentText,
        focus: dark ? b.focusRingDark : b.focusRing,
    };
    return (
        <Box
            component="ul"
            {...props}
            sx={{
                listStyle: 'none', m: 0, p: 0,
                display: 'grid', columnGap: 4,
                gridTemplateColumns: { xs: '1fr', md: `repeat(${columns}, minmax(0, 1fr))` },
                ...sx,
            }}
        >
            {items.map((item, i) => {
                const key = item.key ?? item.href ?? item.label;
                const liSx = { borderTop: `1px solid ${colors.line}` };
                return reveal ? (
                    <Reveal component="li" key={key} delay={(i % columns + 1) * STAGGER} sx={liSx}>
                        <Row item={item} colors={colors} />
                    </Reveal>
                ) : (
                    <Box component="li" key={key} sx={liSx}>
                        <Row item={item} colors={colors} />
                    </Box>
                );
            })}
        </Box>
    );
}

function Row({ item, colors }) {
    const link = item.href != null;
    const body = (
        <>
            {item.icon && (
                <Box aria-hidden sx={{ color: colors.icon, display: 'flex', flexShrink: 0, mt: '2px', '& svg': { width: 16, height: 16 } }}>
                    {item.icon}
                </Box>
            )}
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography component="span" className="hl-label" sx={{ display: 'block', fontSize: 14, lineHeight: 1.45, fontWeight: 700, color: colors.label, transition: `color 200ms ${b.ease}` }}>
                    {item.label}
                </Typography>
                {item.text && (
                    <Typography component="span" sx={{ display: 'block', mt: 0.25, fontSize: 12.5, lineHeight: 1.55, fontWeight: 500, color: colors.text }}>
                        {item.text}
                    </Typography>
                )}
            </Box>
            {link && (
                <Box aria-hidden className="hl-arrow" sx={{ color: colors.icon, display: 'flex', flexShrink: 0, mt: '2px', transition: `transform 280ms ${b.ease}, color 200ms ${b.ease}` }}>
                    <FiArrowRight size={16} />
                </Box>
            )}
        </>
    );
    const rowSx = { display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.75, minHeight: 44 };
    if (!link) return <Box sx={rowSx}>{body}</Box>;
    return (
        <Box
            component={NextLink}
            href={item.href}
            sx={{
                ...rowSx,
                textDecoration: 'none',
                borderRadius: '6px',
                '&:hover .hl-label, &:hover .hl-arrow': { color: colors.hover },
                '&:hover .hl-arrow': { transform: 'translateX(2px)' },
                '&:focus-visible': colors.focus,
            }}
        >
            {body}
        </Box>
    );
}
