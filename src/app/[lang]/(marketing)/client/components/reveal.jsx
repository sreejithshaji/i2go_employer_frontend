'use client';

import { Box } from '@mui/material';
import { revealSx, useInView } from './use-in-view';

/** Stagger between siblings (plan §10). */
export const STAGGER = 60;

/**
 * The `stepin` entrance (plan §10, 10.1) on any block: fades and rises 22px
 * the first time it scrolls into view. `delay` (ms) staggers siblings: pass
 * `i * STAGGER`. `component` sets the element (e.g. "li" inside a list), and
 * other props and `sx` pass through.
 *
 * Content is hidden only once JS has run and found it below the fold, never
 * without JS or under reduced motion (`useInView`).
 */
export default function Reveal({ component = 'div', delay = 0, sx, children, ...props }) {
    const [ref, inView] = useInView();
    return (
        <Box ref={ref} component={component} data-reveal {...props} sx={{ ...revealSx(inView, delay), ...sx }}>
            {children}
        </Box>
    );
}
