import { Box, Card, Typography } from '@mui/material';
import { FiUsers } from 'react-icons/fi';
import { brand as b } from '@/app/theme';

/**
 * Nothing to show (14.5c): a hairline card with a graphite tile and a cyan
 * icon (the rail's active look), an 800 title, a muted line and an optional
 * action. Pass a `cta` button for a way forward, `ghost` for a reset.
 * `titleAs="h1"` when it is the whole page (404, error).
 */
export default function EmptyState({ icon = <FiUsers />, title, message, action, titleAs = 'h2' }) {
    return (
        <Card sx={{ py: { xs: 5, md: 7 }, px: 3, textAlign: 'center' }}>
            <Box
                aria-hidden
                sx={{
                    width: 56, height: 56, borderRadius: `${b.radiusMd}px`, mx: 'auto', mb: 2.5,
                    display: 'grid', placeItems: 'center', bgcolor: b.graphite, color: b.cyan,
                    boxShadow: b.shadow1, '& svg': { width: 24, height: 24 },
                }}
            >
                {icon}
            </Box>
            <Typography component={titleAs} sx={{ fontSize: { xs: 19, md: 21 }, lineHeight: 1.3, fontWeight: 800, letterSpacing: '-0.4px', color: b.ink }}>{title}</Typography>
            {message && (
                <Typography sx={{ mt: 0.75, maxWidth: 440, mx: 'auto', fontSize: 15, lineHeight: 1.65, color: b.muted }}>{message}</Typography>
            )}
            {action && <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>{action}</Box>}
        </Card>
    );
}
