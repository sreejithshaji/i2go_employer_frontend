import { Box, Card, Skeleton, Stack } from '@mui/material';
import { tokens } from '@/app/theme';

/** Responsive grid for candidate cards: as many 260px+ columns as fit. */
export default function CandidateGrid({ children }) {
    return (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(260px, 1fr))' } }}>
            {children}
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
