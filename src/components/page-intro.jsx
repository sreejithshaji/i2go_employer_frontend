import { Box, Stack, Typography } from '@mui/material';
import { brand as b } from '@/app/theme';

/**
 * The lead line under the page title, with optional actions on the right.
 * Same as the homepage section leads (14.2c): 16px muted, a 640px measure.
 */
export default function PageIntro({ children, actions }) {
    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: { xs: 3, md: 4 }, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
            <Typography sx={{ maxWidth: 640, fontSize: { xs: 15, md: 16 }, lineHeight: 1.65, color: b.muted }}>{children}</Typography>
            {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
        </Stack>
    );
}
