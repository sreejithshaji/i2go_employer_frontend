'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import usePagination from '@mui/material/usePagination';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { format } from '@/lib/i18n/config';
import { brand as b } from '@/app/theme';

/**
 * "Showing 13–24 of 57" on the left, Previous / page numbers / Next on the right.
 * page is 1-based; onChange(page). Homepage look (14.9): graphite selected page
 * with a cyan numeral on a hairline surface3 track, soft Previous / Next.
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
            <Typography sx={{ fontSize: 14, color: b.muted }}>
                {before}<Box component="strong" sx={{ color: b.ink, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{from}–{to}</Box>{after}
            </Typography>
            <Stack direction="row" spacing={1.5} component="nav" aria-label={t.pagination.label} sx={{ alignItems: 'center' }}>
                <Button variant="soft" startIcon={<FiChevronsLeft />} disabled={prev.disabled} onClick={prev.onClick} sx={{ borderRadius: 999, minHeight: 40 }}>
                    {t.pagination.previous}
                </Button>
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, p: 0.5, borderRadius: 999, bgcolor: b.surface3, border: `1px solid ${b.line2}` }}>
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
                                    font: 'inherit', fontSize: 14, fontWeight: item.selected ? 800 : 700,
                                    fontVariantNumeric: 'tabular-nums',
                                    bgcolor: item.selected ? b.graphite : 'transparent',
                                    color: item.selected ? b.cyan : b.ink2,
                                    transition: `background-color 200ms ${b.ease}, color 200ms ${b.ease}`,
                                    '&:hover': item.selected ? {} : { bgcolor: b.surface, color: b.ink },
                                    '&:focus-visible': b.focusRing,
                                    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                                }}
                            >
                                {item.page}
                            </Box>
                        ) : (
                            <Box key={`e${i}`} component="span" sx={{ minWidth: 24, textAlign: 'center', color: b.faint }}>…</Box>
                        ),
                    )}
                </Box>
                <Typography sx={{ display: { xs: 'block', sm: 'none' }, fontSize: 14, fontWeight: 700, color: b.ink2, fontVariantNumeric: 'tabular-nums' }}>
                    {page} / {count}
                </Typography>
                <Button variant="soft" endIcon={<FiChevronsRight />} disabled={next.disabled} onClick={next.onClick} sx={{ borderRadius: 999, minHeight: 40 }}>
                    {t.pagination.next}
                </Button>
            </Stack>
        </Stack>
    );
}
