import { Box, Card, Typography } from '@mui/material';
import { FiUsers } from 'react-icons/fi';
import { tokens } from '@/app/theme';

export default function EmptyState({ icon = <FiUsers size={28} />, title, message, action }) {
    return (
        <Card sx={{ py: 6, px: 3, textAlign: 'center' }}>
            <Box
                sx={{
                    width: 64, height: 64, borderRadius: '50%', mx: 'auto', mb: 2,
                    display: 'grid', placeItems: 'center', bgcolor: tokens.primarySoft, color: 'primary.main',
                }}
            >
                {icon}
            </Box>
            <Typography variant="h6" component="h2">{title}</Typography>
            {message && (
                <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 420, mx: 'auto' }}>{message}</Typography>
            )}
            {action && <Box sx={{ mt: 2.5 }}>{action}</Box>}
        </Card>
    );
}
