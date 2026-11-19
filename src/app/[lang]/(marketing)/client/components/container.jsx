import { Box } from '@mui/material';
import { brand as b } from '@/app/theme';

/**
 * Centred content column of the marketing pages: 1080px wide plus 40px
 * gutters on desktop, 16px gutters below 900px (homepage-redesign-plan.md §9).
 * `wide`: the 1440px column of the nav and the hero.
 */
export default function Container({ wide = false, sx, children, ...props }) {
    return (
        <Box
            {...props}
            sx={{ width: '100%', maxWidth: (wide ? b.wideMax : b.contentMax) + 80, mx: 'auto', px: { xs: 2, md: 5 }, ...sx }}
        >
            {children}
        </Box>
    );
}
