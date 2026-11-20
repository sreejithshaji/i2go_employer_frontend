'use client';

import NextLink from 'next/link';
import { Box } from '@mui/material';
import { brand as b } from '@/app/theme';

// The homepage hero's category chip (hero-search.jsx): hairline pill, lift on hover.
const chipSx = {
    display: 'inline-flex', alignItems: 'center', gap: 0.75,
    minHeight: { xs: 44, md: 38 }, px: 1.75, borderRadius: 999,
    bgcolor: b.surface3, border: `1px solid ${b.line2}`,
    fontSize: 13.5, fontWeight: 700, color: b.ink2, textDecoration: 'none',
    transition: `border-color 280ms ${b.ease}, background-color 280ms ${b.ease}, transform 280ms ${b.ease}`,
    '&:hover': { bgcolor: b.surface, borderColor: b.lineHover, transform: 'translateY(-1px)' },
    '&:focus-visible': b.focusRing,
    '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
};

/**
 * Links into the SEO tree (category or skill pages) as chips with a count:
 * items [{ id, name, href, count? }]. Crawlable plain links (PLAN.md 11.4.4).
 */
export function JobLinks({ items }) {
    return (
        <Box component="ul" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, m: 0, p: 0, listStyle: 'none' }}>
            {items.map((item) => (
                <Box component="li" key={item.id}>
                    <Box component={NextLink} href={item.href} sx={chipSx}>
                        {item.name}
                        {item.count != null && (
                            <Box component="span" sx={{ fontSize: 11.5, fontWeight: 800, color: b.accentText, fontVariantNumeric: 'tabular-nums' }}>
                                {item.count}
                            </Box>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
