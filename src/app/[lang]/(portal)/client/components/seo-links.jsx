'use client';

import NextLink from 'next/link';
import { Box } from '@mui/material';
import { tokens } from '@/app/theme';

const chipSx = {
    display: 'inline-flex', alignItems: 'center', gap: 1, minHeight: 40, px: 2, borderRadius: 999,
    bgcolor: tokens.surface, border: `1px solid ${tokens.border}`, color: 'text.primary',
    fontSize: 14, fontWeight: 500, textDecoration: 'none',
    transition: `border-color 150ms ${tokens.ease}, color 150ms ${tokens.ease}`,
    '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
    '&:focus-visible': { outline: 'none', boxShadow: tokens.focusRing },
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
                            <Box component="span" sx={{ minWidth: 22, height: 22, px: 0.75, borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, bgcolor: tokens.primarySoft, color: 'primary.main' }}>
                                {item.count}
                            </Box>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
