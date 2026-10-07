'use client';

import NextLink from 'next/link';
import { Box } from '@mui/material';

/**
 * Visible breadcrumbs (PLAN.md 11.13). items: [{ label, href? }]; the last one
 * is the current page. Pages in the SEO tree render the same items as JSON-LD.
 */
export default function Breadcrumbs({ items, label = 'Breadcrumb', sx }) {
    return (
        <Box component="nav" aria-label={label} sx={{ fontSize: 13, mb: 2.5, ...sx }}>
            <Box component="ol" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, m: 0, p: 0, listStyle: 'none' }}>
                {items.map((crumb, i) => (
                    <Box key={`${crumb.label}-${i}`} component="li" sx={{ display: 'inline-flex', gap: 0.75, minWidth: 0 }}>
                        {crumb.href && i < items.length - 1 ? (
                            <Box component={NextLink} href={crumb.href} sx={{ color: 'primary.main', fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                {crumb.label}
                            </Box>
                        ) : (
                            <Box component="span" aria-current="page" sx={{ color: 'text.disabled' }}>{crumb.label}</Box>
                        )}
                        {i < items.length - 1 && <Box component="span" aria-hidden sx={{ color: 'primary.main' }}>/</Box>}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
