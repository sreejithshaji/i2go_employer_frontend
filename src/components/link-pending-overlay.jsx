'use client';

import { useLinkStatus } from 'next/link';
import { Box, CircularProgress } from '@mui/material';

/**
 * Dims a clicked card link and shows a spinner on it while its page is still
 * on the way (not prefetched yet). Must sit inside the <Link>, whose box needs
 * position: relative. Always rendered and only faded in, so nothing shifts.
 */
export default function LinkPendingOverlay({ radius = 'inherit' }) {
    const { pending } = useLinkStatus();
    return (
        <Box
            aria-hidden
            sx={{
                position: 'absolute', inset: 0, zIndex: 2, borderRadius: radius, pointerEvents: 'none',
                display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,0.6)',
                opacity: pending ? 1 : 0,
                // A short delay on the way in, so prefetched pages don't flash it.
                transition: pending ? 'opacity 150ms ease 80ms' : 'opacity 100ms ease',
            }}
        >
            {pending && <CircularProgress size={24} thickness={5} />}
        </Box>
    );
}
