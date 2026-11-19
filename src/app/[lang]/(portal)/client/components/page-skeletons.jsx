'use client';

import { Box, Card, Skeleton, Stack } from '@mui/material';
import CandidateGrid, { GridSkeleton } from './candidate-grid';

// Shown by the shell while a clicked link's page renders on the server
// (components/app-shell/use-pending-path.js), so navigation switches straight
// away. Shapes follow the real views.

/** A candidate profile (also used while a profile reloads after Retry). */
export function CandidateDetailSkeleton() {
    return (
        <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: { sm: 'center' } }}>
                    <Skeleton variant="circular" width={112} height={112} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton width="50%" height={40} />
                        <Skeleton width="35%" />
                        <Skeleton width="60%" />
                    </Box>
                </Stack>
            </Card>
            <Card sx={{ p: 3 }}><Skeleton width="20%" height={30} /><Skeleton /><Skeleton /><Skeleton width="70%" /></Card>
        </Stack>
    );
}

/** The candidate lists (hub, category and skill pages): a count line and a grid of cards. */
export function CandidateListSkeleton() {
    return (
        <Box>
            <Box sx={{ mb: 3, mt: { md: 1 }, minHeight: 44 }}>
                <Skeleton width={180} height={26} />
                <Skeleton width={240} />
            </Box>
            <CandidateGrid><GridSkeleton count={8} /></CandidateGrid>
        </Box>
    );
}
