'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import usePagination from '@mui/material/usePagination';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { format } from '@/lib/i18n/config';
import { tokens } from '@/app/theme';

/**
 * "Showing 13–24 of 57" on the left, Previous / page numbers / Next on the right.
 * page is 1-based; onChange(page).
 */
export default function Pagination({ page, count, total, pageSize, onChange }) {
    const { t } = useI18n();
    const { items } = usePagination({ count, page, onChange: (_e, p) => onChange(p), siblingCount: 1 });
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);
    const prev = items.find((i) => i.type === 'previous');
    const next = items.find((i) => i.type === 'next');
    const numbers = items.filter((i) => i.type === 'page' || i.type.endsWith('ellipsis'));
    // "Showing {range} of {total}": the range is bold, so the template is split around it.
    const [before, after] = format(t.pagination.range, { total }).split('{range}');

    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 4, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
                {before}<Box component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>{from}–{to}</Box>{after}
            </Typography>
            <Stack direction="row" spacing={1.5} component="nav" aria-label={t.pagination.label} sx={{ alignItems: 'center' }}>
                <Button variant="outlined" startIcon={<FiChevronsLeft />} disabled={prev.disabled} onClick={prev.onClick} sx={{ borderRadius: 999 }}>
                    {t.pagination.previous}
                </Button>
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, p: 0.5, borderRadius: 999, bgcolor: tokens.primarySoft }}>
                    {numbers.map((item, i) =>
                        item.type === 'page' ? (
                            <Box
                                key={item.page}
                                component="button"
                                type="button"
                                onClick={item.onClick}
                                aria-current={item.selected ? 'page' : undefined}
                                aria-label={format(t.pagination.page, { n: item.page })}
                                sx={{
                                    minWidth: 36, height: 36, px: 1, border: 0, borderRadius: 999, cursor: 'pointer',
                                    font: 'inherit', fontSize: 14, fontWeight: 600,
                                    bgcolor: item.selected ? 'primary.main' : 'transparent',
                                    color: item.selected ? '#fff' : 'primary.main',
                                    transition: `background-color 150ms ${tokens.ease}`,
                                    '&:hover': { bgcolor: item.selected ? 'primary.dark' : tokens.primarySoftHover },
                                    '&:focus-visible': { outline: 'none', boxShadow: tokens.focusRing },
                                }}
                            >
                                {item.page}
                            </Box>
                        ) : (
                            <Box key={`e${i}`} component="span" sx={{ minWidth: 24, textAlign: 'center', color: 'primary.main' }}>…</Box>
                        ),
                    )}
                </Box>
                <Typography variant="body2" sx={{ display: { xs: 'block', sm: 'none' }, color: 'text.secondary' }}>
                    {page} / {count}
                </Typography>
                <Button variant="outlined" endIcon={<FiChevronsRight />} disabled={next.disabled} onClick={next.onClick} sx={{ borderRadius: 999 }}>
                    {t.pagination.next}
                </Button>
            </Stack>
        </Stack>
    );
}
