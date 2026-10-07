import { Box, Typography } from '@mui/material';
import { tokens } from '@/app/theme';

/**
 * Top of a category or skill landing page (PLAN.md 11.4.3, 11.5.1): the h1,
 * the live count and the intro text, all in the server HTML.
 */
export default function LandingHeader({ title, countLine, intro }) {
    return (
        <Box component="header" sx={{ mb: 3, maxWidth: 860 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 26, md: 32 }, lineHeight: { xs: '34px', md: '40px' } }}>{title}</Typography>
            {countLine && (
                <Typography sx={{ mt: 0.75, color: 'primary.main', fontWeight: 600 }}>{countLine}</Typography>
            )}
            {intro && (
                <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7, '& + &': { mt: 1 } }}>{intro}</Typography>
            )}
            <Box sx={{ mt: 2.5, height: '1px', bgcolor: tokens.border }} />
        </Box>
    );
}

/** A titled block of links under the list (skills, other jobs, guides). */
export function LinkSection({ title, children }) {
    return (
        <Box component="section" sx={{ mt: { xs: 4, md: 5 } }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>{title}</Typography>
            {children}
        </Box>
    );
}
