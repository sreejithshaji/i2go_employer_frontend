import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';

/** The reference's `drift`: the glow wanders a little and breathes, back and forth. */
const drift = keyframes`
    from { transform: translate3d(0, 0, 0) scale(1); }
    to { transform: translate3d(56px, 36px, 0) scale(1.08); }
`;

/**
 * Soft radial glow that drifts slowly behind a section (plan §10: 18s,
 * alternate, decorative). Place it inside a positioned parent that clips it;
 * `sx` sets its size and position. Still under reduced motion. Pure CSS, so it
 * needs no JavaScript and never hides content.
 */
export default function DriftGlow({ color, sx }) {
    return (
        <Box
            aria-hidden
            sx={{
                position: 'absolute', pointerEvents: 'none',
                background: `radial-gradient(closest-side, ${color}, transparent 72%)`,
                animation: `${drift} 18s ease-in-out infinite alternate`,
                willChange: 'transform',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                ...sx,
            }}
        />
    );
}
