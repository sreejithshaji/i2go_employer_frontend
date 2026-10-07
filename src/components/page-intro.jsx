import { Box, Stack, Typography } from '@mui/material';

/** The description line under the header, with optional actions on the right. */
export default function PageIntro({ children, actions }) {
    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>{children}</Typography>
            {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
        </Stack>
    );
}
