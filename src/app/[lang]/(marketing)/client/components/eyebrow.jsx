import { Typography } from '@mui/material';
import { brand as b } from '@/app/theme';

/**
 * Small tracked label above a heading (reference `.eyebrow`, plan §1.3):
 * 11px, weight 800, .14em, uppercase. `tone="dark"` turns it cyan for the navy
 * sections; on light it uses `accentText`, because the reference accent is
 * too light for 11px text on white.
 */
export default function Eyebrow({ tone = 'light', component = 'p', sx, children, ...props }) {
    return (
        <Typography
            component={component}
            {...props}
            sx={{
                fontSize: 11,
                lineHeight: 1.4,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: tone === 'dark' ? b.cyan : b.accentText,
                m: 0,
                ...sx,
            }}
        >
            {children}
        </Typography>
    );
}
