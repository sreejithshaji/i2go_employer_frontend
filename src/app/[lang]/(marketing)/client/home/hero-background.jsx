'use client';

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import { brand as b } from '@/app/theme';
import { useInView } from '../components/use-in-view';

/**
 * Animated background of the hero (homepage-redesign-plan.md §15.4, R3).
 * `tone`: 'dark' (navy, the default; the auth pages) or 'light' (blue-grey
 * `heroTint1` to `heroTint2` with the lattice in the brand blue; the homepage hero).
 * Decoration only: `aria-hidden`, no pointer events, inline SVG + CSS, so it
 * renders on the server and without JS. Only `transform` and `opacity` animate.
 *
 * Layers, back to front:
 *  1. Base: `brand.darkSection` (dark) or a heroTint1-to-heroTint2 wash (light).
 *  2. Lattice: diamond grid (two diagonal line sets, 42px) with a dot in each
 *     diamond, cyan at low opacity; the layer is 110% so it can drift.
 *  3. Light band: the same lattice, brighter, seen through a soft radial mask
 *     that travels diagonally. The inner lattice counter-moves so it stays
 *     aligned with layer 2 and only the "light" moves.
 *  4. Hexagons: three nested outlines rotating at different speeds, floating
 *     slightly; a small second cluster bottom-right from 1200px.
 *  5. Scrim: navy (dark) or heroTint1 (light) gradient behind the text column, for contrast.
 *
 * Motion pauses while the hero is off-screen or the tab is hidden, and is
 * off under `prefers-reduced-motion` (static frame, not the global 0.01ms
 * rule, which would make the alternating loops flicker).
 */

const TILE = 42;
const ACCENT = '#0F8FC7';

const TONES = {
    dark: {
        base: b.darkSection,
        lattice: b.cyan, line: 0.12, dot: 0.24, litLine: 0.42, litDot: 0.7,
        node: b.cyan, ringScale: 1,
        glow: b.glow, glowOpacity: 0.55,
        scrim: {
            xs: 'linear-gradient(180deg, rgba(3,7,12,0.45) 0%, rgba(3,7,12,0.25) 60%, rgba(3,7,12,0.6) 100%)',
            md: 'linear-gradient(90deg, rgba(3,7,12,0.6) 0%, rgba(3,7,12,0.35) 40%, rgba(3,7,12,0) 64%)',
        },
    },
    light: {
        base: `radial-gradient(520px 320px at 18% -6%, rgba(15,143,199,0.10), transparent 70%), linear-gradient(180deg, ${b.heroTint1} 0%, ${b.heroTint2} 100%)`,
        lattice: ACCENT, line: 0.09, dot: 0.2, litLine: 0.24, litDot: 0.45,
        node: ACCENT, ringScale: 0.75,
        glow: 'radial-gradient(closest-side, rgba(15,143,199,0.14), transparent 72%)', glowOpacity: 0.7,
        scrim: {
            xs: 'linear-gradient(180deg, rgba(207,218,227,0.7) 0%, rgba(207,218,227,0.55) 60%, rgba(198,210,220,0.8) 100%)',
            md: 'linear-gradient(90deg, rgba(207,218,227,0.75) 0%, rgba(207,218,227,0.45) 40%, rgba(207,218,227,0) 64%)',
        },
    },
};

const drift = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-84px, -42px, 0); }
`;
// The band and its counter-move use the same timing, so they cancel exactly.
const band = keyframes`
  from { transform: translate3d(-28%, -22%, 0); }
  to   { transform: translate3d(34%, 26%, 0); }
`;
const bandCounter = keyframes`
  from { transform: translate3d(28%, 22%, 0); }
  to   { transform: translate3d(-34%, -26%, 0); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const float = keyframes`
  from { transform: translate3d(0, -8px, 0); }
  to   { transform: translate3d(0, 10px, 0); }
`;

/** One tile of the lattice; the dots sit on the tile edges and join up when tiled. */
function LatticeSvg({ id, color, line, dot }) {
    const h = TILE / 2;
    return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <defs>
                <pattern id={id} width={TILE} height={TILE} patternUnits="userSpaceOnUse">
                    <path d={`M0 0L${TILE} ${TILE}M${TILE} 0L0 ${TILE}`} stroke={color} strokeOpacity={line} strokeWidth="1" fill="none" />
                    <g fill={color} fillOpacity={dot}>
                        <circle cx={h} cy="0" r="1.1" />
                        <circle cx={h} cy={TILE} r="1.1" />
                        <circle cx="0" cy={h} r="1.1" />
                        <circle cx={TILE} cy={h} r="1.1" />
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}

/** Regular hexagon (pointy top) around (0,0), as a polygon `points` string. */
function hexPoints(r) {
    return Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
    }).join(' ');
}

const RINGS = [
    { r: 96, opacity: 0.4, width: 1.5, duration: '60s', direction: 'normal' },
    { r: 150, opacity: 0.32, width: 1.25, duration: '90s', direction: 'reverse' },
    { r: 196, opacity: 0.18, width: 1, duration: '120s', direction: 'normal' },
];

function Hexagons({ node, ringScale, sx }) {
    return (
        <Box sx={{ position: 'absolute', animation: `${float} 12s ease-in-out infinite alternate`, ...sx }}>
            <svg viewBox="-200 -200 400 400" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
                {RINGS.map((ring) => (
                    // `sx`, not `style`: Emotion only injects the keyframes when they're used in its styles.
                    <Box
                        component="g"
                        key={ring.r}
                        sx={{
                            transformBox: 'view-box',
                            transformOrigin: '50% 50%',
                            animation: `${spin} ${ring.duration} linear infinite ${ring.direction}`,
                        }}
                    >
                        <polygon
                            points={hexPoints(ring.r)}
                            fill="none"
                            stroke={ACCENT}
                            strokeOpacity={ring.opacity * ringScale}
                            strokeWidth={ring.width}
                            vectorEffect="non-scaling-stroke"
                        />
                        {/* Small nodes on the inner hexagon's corners, turning with it. */}
                        {ring === RINGS[0] && (
                            <g fill={node} fillOpacity="0.5">
                                {hexPoints(ring.r).split(' ').map((p) => {
                                    const [cx, cy] = p.split(',');
                                    return <circle key={p} cx={cx} cy={cy} r="2.5" />;
                                })}
                            </g>
                        )}
                    </Box>
                ))}
            </svg>
        </Box>
    );
}

export default function HeroBackground({ tone = 'dark' }) {
    const c = TONES[tone] ?? TONES.dark;
    const [ref, inView] = useInView({ once: false, rootMargin: '0px', threshold: 0 });
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const onChange = () => setHidden(document.visibilityState === 'hidden');
        onChange();
        document.addEventListener('visibilitychange', onChange);
        return () => document.removeEventListener('visibilitychange', onChange);
    }, []);

    // `inView` is null before the observer reports: treat as visible.
    const paused = inView === false || hidden;

    return (
        <Box
            ref={ref}
            aria-hidden
            data-paused={paused ? 'true' : 'false'}
            sx={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                background: c.base,
                '&[data-paused="true"] *': { animationPlayState: 'paused' },
                '@media (prefers-reduced-motion: reduce)': {
                    '& *': { animation: 'none !important' },
                },
            }}
        >
            {/* 2 + 3: drifting lattice with its light band */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: '-5%',
                    animation: `${drift} 24s ease-in-out infinite alternate`,
                    willChange: 'transform',
                }}
            >
                <LatticeSvg id="i2go-hero-lattice" color={c.lattice} line={c.line} dot={c.dot} />
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        animation: `${band} 11s ease-in-out infinite alternate`,
                        WebkitMaskImage: 'radial-gradient(ellipse 30% 42% at 50% 50%, #000 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
                        maskImage: 'radial-gradient(ellipse 30% 42% at 50% 50%, #000 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
                    }}
                >
                    <Box sx={{ position: 'absolute', inset: 0, animation: `${bandCounter} 11s ease-in-out infinite alternate` }}>
                        <LatticeSvg id="i2go-hero-lattice-lit" color={c.lattice} line={c.litLine} dot={c.litDot} />
                    </Box>
                </Box>
            </Box>

            {/* Soft glow behind the hexagons */}
            <Box
                sx={{
                    position: 'absolute',
                    top: { xs: '2%', md: '8%' },
                    right: { xs: '-30%', md: '-6%' },
                    width: { xs: 360, md: 620 },
                    height: { xs: 360, md: 620 },
                    background: c.glow,
                    opacity: c.glowOpacity,
                }}
            />

            {/* 4: hexagons, 50% on phones, 75% on tablets, full from 1200px */}
            <Hexagons
                node={c.node}
                ringScale={c.ringScale}
                sx={{
                    top: { xs: '4%', md: '6%' },
                    right: { xs: '-22%', sm: '-10%', md: '-4%', lg: '2%' },
                    width: { xs: 220, md: 330, lg: 440 },
                    height: { xs: 220, md: 330, lg: 440 },
                }}
            />
            <Hexagons
                node={c.node}
                ringScale={c.ringScale}
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    bottom: '-6%',
                    right: '28%',
                    width: 170,
                    height: 170,
                    opacity: 0.6,
                    animationDelay: '-6s',
                }}
            />

            {/* 5: scrim behind the text column (left on desktop, whole area on phones) */}
            <Box sx={{ position: 'absolute', inset: 0, background: c.scrim }} />
        </Box>
    );
}
