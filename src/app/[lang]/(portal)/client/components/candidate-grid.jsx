'use client';

import { Children, isValidElement, useEffect, useState } from 'react';
import { Box, Card, Skeleton, Stack } from '@mui/material';
import { tokens } from '@/app/theme';
import Reveal, { STAGGER } from '@/app/[lang]/(marketing)/client/components/reveal';

/** How many columns the grid lays out right now (auto-fill), kept live on resize. */
function useColumnCount() {
    const [node, setNode] = useState(null);
    const [count, setCount] = useState(1);
    useEffect(() => {
        if (!node || typeof ResizeObserver === 'undefined') return undefined;
        const read = () => setCount(getComputedStyle(node).gridTemplateColumns.split(' ').filter(Boolean).length || 1);
        const observer = new ResizeObserver(read);
        observer.observe(node);
        return () => observer.disconnect();
    }, [node]);
    return [setNode, count];
}

/**
 * Responsive grid for candidate cards: as many 260px+ columns as fit. Each
 * card rises in as it scrolls into view (plan 14.10), staggered by its column
 * so a row enters left to right like the homepage's latest candidates.
 * Skeletons are not animated.
 */
export default function CandidateGrid({ children }) {
    const [ref, columns] = useColumnCount();
    return (
        <Box ref={ref} sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(260px, 1fr))' } }}>
            {Children.map(children, (child, i) => (
                isValidElement(child) && child.type !== GridSkeleton ? (
                    // display: grid so the card stretches to the row height, as it did as a direct grid item.
                    <Reveal key={child.key} delay={(i % columns) * STAGGER} sx={{ display: 'grid', minWidth: 0 }}>{child}</Reveal>
                ) : child
            ))}
        </Box>
    );
}

export function GridSkeleton({ count = 6 }) {
    return Array.from({ length: count }, (_, i) => (
        <Card key={i} sx={{ overflow: 'hidden' }}>
            <Box sx={{ height: 56, bgcolor: tokens.primarySoft }} />
            <Box sx={{ px: 3, pb: 2.5, mt: '-36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton variant="circular" width={72} height={72} sx={{ boxShadow: '0 0 0 4px #fff' }} />
                <Skeleton width="55%" height={26} sx={{ mt: 1.25 }} />
                <Skeleton variant="rounded" width={90} height={22} sx={{ mt: 1, borderRadius: 999 }} />
                <Skeleton variant="rounded" width="100%" height={44} sx={{ mt: 1.5, borderRadius: `${tokens.radiusMd}px` }} />
                <Skeleton width="100%" sx={{ mt: 1.5 }} />
                <Skeleton width="80%" />
                <Stack spacing={1} sx={{ width: '100%', mt: 2 }}>
                    {[0, 1].map((n) => (
                        <Stack key={n} direction="row" sx={{ justifyContent: 'space-between' }}>
                            <Skeleton width="45%" />
                            <Skeleton width={68} />
                        </Stack>
                    ))}
                </Stack>
            </Box>
        </Card>
    ));
}
