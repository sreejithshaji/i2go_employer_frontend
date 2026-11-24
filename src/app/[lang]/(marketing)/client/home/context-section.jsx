'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { FiAlertCircle, FiCheck, FiTrendingUp } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';
import Container from '../components/container';
import PortalButton from '../components/portal-button';
import Eyebrow from '../components/eyebrow';
import Reveal, { STAGGER } from '../components/reveal';
import SectionHeading from './section-heading';
import { EUROPE_PATHS } from './map-outlines';

/**
 * "Why it matters" (plan §6 row 3). No cards: the section itself is the
 * picture. Its background runs from a cool blue wash with a Europe map outline
 * (left) to a warm gold wash with an abstract field of talent (right): dots
 * with arcs flowing towards Europe from origins that aren't labelled
 * (global-talent-plan.md). The challenge and the opportunity sit straight on
 * it, joined in the middle by a medallion where a handshake turns into the
 * i2GO mark as you scroll. Below 900px the wash runs top to bottom, Europe
 * above the talent field, and the columns stack with the medallion between
 * them.
 */
export default function ContextSection() {
    const { t } = useI18n();
    const c = t.landing.context;
    const sectionRef = useRef(null);
    const europeDot = useRef(null);
    const talentDot = useRef(null);
    // The rings, dot flashes and border glow share one timeline: they all
    // start paused and play together while the section is on screen, so the
    // glow stays in step with the ring hits.
    const [live, setLive] = useState(false);
    // The beats (rings, dot sparks, border glow) only start once the
    // handshake has turned into the i2GO logo.
    const [logo, setLogo] = useState(false);
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') { setLive(true); return undefined; }
        const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <Box
            ref={sectionRef}
            component="section"
            aria-labelledby="context-title"
            data-live={live ? 'true' : 'false'}
            data-beat={logo ? 'on' : 'off'}
            sx={{
                // Ring hit time inside each 2.6s ring cycle (from the ring's
                // easing and the dot's distance from the medallion edge).
                '--hit': { xs: '0.28s', md: '0.4s' },
                '&[data-live="false"] .ctx-anim': { animationPlayState: 'paused' },
                // Before the logo shows: no animation at all, and the rings
                // hidden. Switching back on restarts every beat together, so
                // the glow stays in step with the rings.
                '&[data-beat="off"] .ctx-anim, &[data-beat="off"] .ctx-anim::after': { animation: 'none' },
                '&[data-beat="off"] .ctx-ring': { opacity: 0 },
                position: 'relative', overflow: 'hidden', isolation: 'isolate',
                background: {
                    xs: `linear-gradient(180deg, ${EUROPE.wash} 0%, #F4F7F9 46%, #F8F5F1 54%, ${TALENT.wash} 100%)`,
                    md: `linear-gradient(90deg, ${EUROPE.wash} 0%, #F4F7F9 42%, #F8F5F1 58%, ${TALENT.wash} 100%)`,
                },
                borderTop: `1px solid ${b.line}`, borderBottom: `1px solid ${b.line}`,
                py: { xs: 6, md: 10 },
            }}
        >
            <EuropeLayer dotRef={europeDot} />
            <TalentLayer dotRef={talentDot} />
            <Container>
                <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto' }}>
                    <Reveal>
                        <Eyebrow component="h2" id="context-title">{c.label}</Eyebrow>
                    </Reveal>
                    <Reveal delay={STAGGER}>
                        <SectionHeading component="p" sx={{ mt: 1.25 }}>{c.title}</SectionHeading>
                    </Reveal>
                </Box>
                <Box
                    sx={{
                        mt: { xs: 4, md: 6 }, display: 'grid', alignItems: 'center',
                        gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
                        rowGap: 4, columnGap: { md: 7 },
                    }}
                >
                    <Column
                        delay={2 * STAGGER}
                        theme={EUROPE}
                        icon={<FiAlertCircle size={18} />}
                        label={c.challengeLabel}
                        title={c.challengeTitle}
                        text={c.challengeText}
                        points={c.challengePoints}
                    />
                    <Bridge label={c.bridgeLabel} startRef={europeDot} endRef={talentDot} onLogo={setLogo} />
                    <Column
                        delay={3 * STAGGER}
                        theme={TALENT}
                        icon={<FiTrendingUp size={18} />}
                        label={c.opportunityLabel}
                        title={c.opportunityTitle}
                        text={c.opportunityText}
                        points={c.opportunityPoints}
                    />
                </Box>
                <Reveal sx={{ mt: { xs: 4, md: 6 }, display: 'flex', justifyContent: 'center' }}>
                    <PortalButton />
                </Reveal>
            </Container>
        </Box>
    );
}

/**
 * Palettes. Europe is a cool blue (the brand accent), the talent side a warm
 * gold (the brand's goldText family).
 * Small text keeps ≥ 4.5:1 on the wash.
 */
const EUROPE = {
    wash: '#E1F0F8',
    label: b.accentText,
    badgeBg: 'rgba(15,143,199,0.12)',
    badge: b.accentText,
    rule: 'rgba(15,143,199,0.18)',
    map: b.accent,
    mapFill: 'rgba(15,143,199,0.06)',
    node: b.accentLine,
    glow: '#1AA9E6',
};
const TALENT = {
    wash: '#FBF0D6',
    label: b.goldText,
    badgeBg: 'rgba(154,103,0,0.12)',
    badge: b.goldText,
    rule: 'rgba(154,103,0,0.2)',
    map: '#C9971E',
    node: '#F1E0B5',
    glow: '#F2B632',
};

/** Slow float of the background maps: a small drift, tilt and breath. */
const drift = keyframes`
    0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
    33% { transform: translate3d(14px, -12px, 0) rotate(1.5deg) scale(1.02); }
    66% { transform: translate3d(-10px, 10px, 0) rotate(-1deg) scale(0.99); }
`;

/**
 * Border glow. Each outline gets two bright segments that start at the point
 * nearest the bridge dot and run around the border in opposite directions,
 * fading as they go. Fires on every second beat only (the strong ring). `--o` (start offset), `--L` (segment length), `--run`
 * (distance travelled) and `--d` (ripple delay) are set per outline in JS.
 */
const traceFwd = keyframes`
    0% { stroke-dashoffset: var(--o); opacity: 0; }
    5% { opacity: 0.75; }
    45% { opacity: 0.65; }
    70%, 100% { stroke-dashoffset: calc(var(--o) - var(--run)); opacity: 0; }
`;
const traceBwd = keyframes`
    0% { stroke-dashoffset: calc(var(--o) + var(--L)); opacity: 0; }
    5% { opacity: 0.75; }
    45% { opacity: 0.65; }
    70%, 100% { stroke-dashoffset: calc(var(--o) + var(--L) + var(--run)); opacity: 0; }
`;

// Europe's tiny islands stay unlit; only outlines with some length glow.
const EUROPE_GLOW = EUROPE_PATHS.filter((d) => d.length > 500);

/**
 * Finds, for each glow outline, the border point nearest the bridge dot and
 * writes the dash variables onto its group. Reruns on resize, since the
 * layout (and so the dot's place on the map) changes at the breakpoint.
 */
function useGlowAnchors(svgRef, dotRef) {
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return undefined;
        let frame = 0;
        const place = () => {
            const dot = dotRef.current;
            const ctm = svg.getScreenCTM();
            if (!dot || !ctm) return;
            const r = dot.getBoundingClientRect();
            const p = new DOMPoint(r.left + r.width / 2, r.top + r.height / 2).matrixTransform(ctm.inverse());
            const groups = [...svg.querySelectorAll('[data-glow]')];
            const found = groups.map((g) => {
                const path = g.querySelector('path');
                const len = path.getTotalLength();
                let best = 0;
                let bestDist = Infinity;
                const steps = 240;
                for (let i = 0; i < steps; i += 1) {
                    const at = path.getPointAtLength((len * i) / steps);
                    const dist = Math.hypot(at.x - p.x, at.y - p.y);
                    if (dist < bestDist) { bestDist = dist; best = (len * i) / steps; }
                }
                return { g, len, best, bestDist };
            });
            const nearest = Math.min(...found.map((f) => f.bestDist));
            found.forEach(({ g, len, best, bestDist }) => {
                const seg = len * 0.14;
                g.style.setProperty('--o', String(-best));
                g.style.setProperty('--L', String(seg));
                g.style.setProperty('--run', String(len * 0.45));
                // Outlines further from the dot light up a moment later.
                g.style.setProperty('--d', `${Math.min(0.5, (bestDist - nearest) * 0.0025).toFixed(3)}s`);
                g.style.strokeDasharray = `${seg} ${len - seg}`;
            });
            svg.dataset.ready = 'true';
        };
        const onResize = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(place); };
        place();
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', onResize); };
    }, [svgRef, dotRef]);
}

/**
 * Shared frame of the two background layers: a large square SVG hugging one
 * edge of the section (Europe left, talent right; top and bottom on phones),
 * fading out at its edges and drifting slowly.
 */
const LayerFrame = ({ side, svgRef, children }) => {
    const europe = side === 'europe';
    const place = europe
        ? { top: { xs: '-2%', md: '50%' }, left: { xs: 'auto', md: 'max(-80px, calc(50% - 800px))' }, right: { xs: '-28%', md: 'auto' } }
        : { top: { xs: 'auto', md: '50%' }, bottom: { xs: '-2%', md: 'auto' }, right: { xs: '-24%', md: 'max(-40px, calc(50% - 760px))' } };
    return (
        <Box
            aria-hidden
            sx={{
                ...place,
                position: 'absolute', zIndex: -1, pointerEvents: 'none',
                transform: { xs: 'none', md: 'translateY(-50%)' },
                height: { xs: '52%', md: '118%' }, aspectRatio: '1 / 1',
                maskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
            }}
        >
            <Box
                ref={svgRef}
                component="svg"
                viewBox="0 0 400 400"
                preserveAspectRatio="xMidYMid meet"
                sx={{
                    display: 'block', width: '100%', height: '100%',
                    strokeLinejoin: 'round',
                    transformOrigin: '50% 50%',
                    animation: `${drift} ${europe ? 18 : 22}s ease-in-out ${europe ? 0 : -6}s infinite ${europe ? 'normal' : 'reverse'}`,
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                    // Glow stays hidden until its start points are measured.
                    '&:not([data-ready="true"]) .glow-layer': { visibility: 'hidden' },
                }}
            >
                <defs>
                    <filter id={`map-glow-${side}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                {children}
            </Box>
        </Box>
    );
};

/**
 * Europe's map outline. Each strong ring hit on the bridge dot sends a glow
 * along the borders.
 */
function EuropeLayer({ dotRef }) {
    const svgRef = useRef(null);
    useGlowAnchors(svgRef, dotRef);
    // Once per 2.6s cycle: only the first (strong) ring sends the glow.
    const run = (name) => `${name} 2.6s linear calc(var(--hit) + var(--d, 0s)) infinite`;
    return (
        <LayerFrame side="europe" svgRef={svgRef}>
            <Box
                component="g"
                sx={{
                    fill: EUROPE.mapFill, stroke: EUROPE.map, strokeWidth: 1,
                    opacity: { xs: 0.35, md: 0.5 },
                    '& path': { vectorEffect: 'non-scaling-stroke' },
                }}
            >
                {EUROPE_PATHS.map((d, i) => <path key={i} d={d} />)}
            </Box>
            <Box
                component="g"
                className="glow-layer"
                sx={{
                    fill: 'none', stroke: EUROPE.glow, strokeWidth: { xs: 1.15, md: 1 }, strokeLinecap: 'round',
                    filter: { xs: 'none', md: 'url(#map-glow-europe)' },
                    '& path': { opacity: 0 },
                    '& .fwd': { animation: run(traceFwd) },
                    '& .bwd': { animation: run(traceBwd) },
                    '@media (prefers-reduced-motion: reduce)': { display: 'none' },
                }}
            >
                {EUROPE_GLOW.map((d, i) => (
                    <g key={i} data-glow="">
                        <path className="ctx-anim fwd" d={d} />
                        <path className="ctx-anim bwd" d={d} />
                    </g>
                ))}
            </Box>
        </LayerFrame>
    );
}

/*
 * Talent field: a halftone dot cloud with no country shape. A cheap,
 * deterministic wave mix decides which grid dots stay, so the cloud has soft
 * clusters that hint at land without drawing any real coastline.
 */
const C = 200; // centre of the 400×400 box
const wave = (x, y) => Math.sin(x * 0.045 + 1.3) * Math.cos(y * 0.052 - 0.7)
    + 0.6 * Math.sin((x + y) * 0.031 + 2.1) + 0.35 * Math.cos((x - y) * 0.07);
const TALENT_DOTS = (() => {
    const dots = [];
    for (let row = 0, y = 26; y <= 374; row += 1, y += 12) {
        for (let x = 26 + (row % 2) * 6; x <= 374; x += 12) {
            if (Math.hypot(x - C, y - C) <= 170 && wave(x, y) > -0.15) dots.push([x, y]);
        }
    }
    return dots;
})();
/** Origins the arcs start from; only those far enough from the landing point are used. */
const ORIGINS = [[286, 96], [332, 170], [318, 262], [262, 330], [176, 318], [226, 226], [268, 160], [120, 268], [200, 92], [150, 150], [340, 226]];
/** How far from the centre the arcs land, towards the bridge dot (inside the fade-out). */
const LAND_R = 128;
const MIN_ARC = 110;

/**
 * A flight-path arc from an origin to the landing point. It bows upwards on
 * horizontal runs (desktop) and outwards on vertical runs (phones).
 */
function arcPath([ox, oy], { x: tx, y: ty }) {
    const dx = tx - ox;
    const dy = ty - oy;
    const d = Math.hypot(dx, dy);
    const nx = -dy / d;
    const ny = dx / d;
    const s = Math.abs(ny) > 0.3 ? (ny < 0 ? 1 : -1) : (Math.sign(ox - tx) * Math.sign(nx) || 1);
    const k = 0.24 * d * s;
    const cx = (ox + tx) / 2 + nx * k;
    const cy = (oy + ty) / 2 + ny * k;
    return `M${ox} ${oy}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${tx} ${ty}`;
}

/**
 * Finds the landing point: on the line from the field's centre towards the
 * bridge dot, LAND_R from the centre. Reruns on resize (the layout changes at
 * the breakpoint).
 */
function useLanding(svgRef, dotRef) {
    const [land, setLand] = useState(null);
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return undefined;
        let frame = 0;
        const place = () => {
            const dot = dotRef.current;
            const ctm = svg.getScreenCTM();
            if (!dot || !ctm) return;
            const r = dot.getBoundingClientRect();
            const p = new DOMPoint(r.left + r.width / 2, r.top + r.height / 2).matrixTransform(ctm.inverse());
            const dx = p.x - C;
            const dy = p.y - C;
            const d = Math.hypot(dx, dy) || 1;
            const x = Math.round(C + (dx / d) * LAND_R);
            const y = Math.round(C + (dy / d) * LAND_R);
            setLand((prev) => (prev && prev.x === x && prev.y === y ? prev : { x, y }));
        };
        const onResize = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(place); };
        place();
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', onResize); };
    }, [svgRef, dotRef]);
    return land;
}

/**
 * A bright streak along an arc (pathLength 1, streak 0.22 long). It runs from
 * the origin and reaches the landing point at 40% of the 2.6s cycle, so the
 * delay `--hit - 1.04s` lands it as the strong ring hits the bridge dot.
 */
const inflow = keyframes`
    0% { stroke-dashoffset: 0.22; opacity: 0; }
    8% { opacity: 0.9; }
    40% { stroke-dashoffset: -0.78; opacity: 0.9; }
    50%, 100% { stroke-dashoffset: -1; opacity: 0; }
`;
/** The landing point flashes when the streaks arrive. */
const landFlash = keyframes`
    0% { transform: scale(1); opacity: 0.9; }
    30%, 100% { transform: scale(2.6); opacity: 0; }
`;

/**
 * The talent side: the dot cloud, faint dashed arcs from a few origins to
 * the landing point facing the bridge, and on every strong beat a streak
 * along each arc flowing in towards Europe. Under reduced motion only the
 * still dots and arcs show.
 */
function TalentLayer({ dotRef }) {
    const svgRef = useRef(null);
    const land = useLanding(svgRef, dotRef);
    const arcs = useMemo(
        () => (land ? ORIGINS.filter(([x, y]) => Math.hypot(x - land.x, y - land.y) > MIN_ARC).map((o) => ({ o, d: arcPath(o, land) })) : []),
        [land],
    );
    return (
        <LayerFrame side="talent" svgRef={svgRef}>
            <Box component="g" sx={{ opacity: { xs: 0.35, md: 0.5 } }}>
                <g fill={TALENT.map} opacity={0.55}>
                    {TALENT_DOTS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} />)}
                </g>
                <g fill="none" stroke={TALENT.map} strokeWidth={0.9} strokeDasharray="2 3" strokeLinecap="round">
                    {arcs.map(({ d }) => <path key={d} d={d} />)}
                </g>
                <g fill={TALENT.map}>
                    {arcs.map(({ o: [x, y] }) => (
                        <g key={`${x}-${y}`}>
                            <circle cx={x} cy={y} r={5.5} fill="none" stroke={TALENT.map} strokeWidth={0.8} opacity={0.6} />
                            <circle cx={x} cy={y} r={2.6} />
                        </g>
                    ))}
                    {land && <circle cx={land.x} cy={land.y} r={3.4} stroke="#fff" strokeWidth={1} />}
                </g>
            </Box>
            {land && (
                <Box
                    component="g"
                    sx={{
                        '@media (prefers-reduced-motion: reduce)': { display: 'none' },
                        '& .streak': {
                            opacity: 0,
                            animation: `${inflow} 2.6s cubic-bezier(0.45, 0, 0.3, 1) calc(var(--hit) - 1.04s + var(--d, 0s)) infinite`,
                        },
                        '& .land': {
                            opacity: 0, transformBox: 'fill-box', transformOrigin: 'center',
                            animation: `${landFlash} 2.6s ease-out var(--hit) infinite`,
                        },
                    }}
                >
                    <g
                        fill="none" stroke={TALENT.glow} strokeWidth={1.4} strokeLinecap="round"
                        filter="url(#map-glow-talent)"
                    >
                        {arcs.map(({ d }, i) => (
                            <path
                                key={d} d={d} pathLength={1} strokeDasharray="0.22 2"
                                className="ctx-anim streak"
                                style={{ '--d': `${((((i * 37) % 7) / 7) * 0.24 - 0.12).toFixed(2)}s` }}
                            />
                        ))}
                    </g>
                    <circle className="ctx-anim land" cx={land.x} cy={land.y} r={3.4} fill={TALENT.glow} />
                </Box>
            )}
        </LayerFrame>
    );
}

function Column({ theme, icon, label, title, text, points = [], delay = 0 }) {
    return (
        <Reveal
            delay={delay}
            sx={{
                minWidth: 0, position: 'relative', zIndex: 0,
                // Soft light halo so the map lines fade out behind the text.
                '&::before': {
                    content: '""', position: 'absolute', zIndex: -1, inset: { xs: '-24px -16px', md: '-48px -56px' },
                    background: 'radial-gradient(closest-side, rgba(255,255,255,0.82) 55%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <Box
                sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1.25, py: 0.75, pl: 0.75, pr: 2,
                    borderRadius: 999, bgcolor: '#fff', border: `1px solid ${theme.rule}`,
                    boxShadow: '0 4px 14px rgba(10,15,22,0.06)',
                }}
            >
                <Box aria-hidden sx={{ width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, bgcolor: theme.badgeBg, color: theme.badge }}>
                    {icon}
                </Box>
                <Eyebrow sx={{ color: theme.label, fontSize: 13, letterSpacing: '0.12em' }}>{label}</Eyebrow>
            </Box>
            <SectionHeading component="h3" sx={{ mt: 2.5 }}>{title}</SectionHeading>
            <Typography component="p" sx={{ m: 0, mt: 1.5, maxWidth: 460, fontSize: { xs: 15.5, md: 16.5 }, lineHeight: 1.65, fontWeight: 500, color: b.ink }}>
                {text}
            </Typography>
            {points.length > 0 && (
                <Box
                    component="ul"
                    sx={{ listStyle: 'none', m: 0, mt: 3, pt: 2.5, px: 0, pb: 0, maxWidth: 440, borderTop: `1px solid ${theme.rule}`, display: 'grid', gap: 1.25 }}
                >
                    {points.map((point) => (
                        <Box component="li" key={point} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                            <Box aria-hidden sx={{ mt: '1px', width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, bgcolor: theme.badgeBg, color: theme.badge }}>
                                <FiCheck size={13} strokeWidth={3} />
                            </Box>
                            <Typography component="span" sx={{ fontSize: 15, lineHeight: 1.55, fontWeight: 600, color: b.ink }}>
                                {point}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Reveal>
    );
}

/** Strong beat: this ring sends the glow into the maps. */
const pulse = keyframes`
    0% { transform: scale(1); opacity: 0.55; }
    100% { transform: scale(1.7); opacity: 0; }
`;
/** Soft beat in between: fainter and shorter, no glow. */
const pulseSoft = keyframes`
    0% { transform: scale(1); opacity: 0.28; }
    100% { transform: scale(1.45); opacity: 0; }
`;
/**
 * Spark on a bridge dot when a ring reaches it, over the full 2.6s cycle:
 * a bright flash for the strong ring, a faint one for the soft ring at 1.3s.
 */
const dotFlash = keyframes`
    0% { transform: scale(1); opacity: 0.9; }
    27.5%, 49.99% { transform: scale(3.2); opacity: 0; }
    50% { transform: scale(1); opacity: 0.4; }
    77.5%, 100% { transform: scale(2.2); opacity: 0; }
`;

/**
 * Handshake medallion between the columns: Europe (left/top) and the talent
 * field (right/bottom) joined by a dashed line with a node at each end, two soft
 * rings pulsing out from the middle (static under reduced motion), a strong
 * one and a soft one. Both spark the dots, but only the strong ring sends the
 * glow into the maps. On
 * phones the line runs vertically between the stacked columns.
 */
function Bridge({ label, startRef, endRef, onLogo }) {
    const lineSx = {
        position: 'absolute', zIndex: 0,
        top: { xs: -22, md: '50%' }, bottom: { xs: -22, md: 'auto' },
        left: { xs: '50%', md: -36 }, right: { xs: 'auto', md: -36 },
        width: { xs: 0, md: 'auto' }, height: { xs: 'auto', md: 0 },
        borderLeft: { xs: `2px dashed ${b.accent}`, md: 'none' },
        borderTop: { xs: 'none', md: `2px dashed ${b.accent}` },
        transform: { xs: 'translateX(-1px)', md: 'translateY(-1px)' },
        opacity: 0.55,
    };
    const nodeSx = (side) => ({
        position: 'absolute', zIndex: 0, width: 10, height: 10, borderRadius: '50%',
        bgcolor: side === 'start' ? EUROPE.map : TALENT.map,
        boxShadow: `0 0 0 4px ${side === 'start' ? EUROPE.node : TALENT.node}`,
        ...(side === 'start'
            ? { top: { xs: -27, md: 'calc(50% - 5px)' }, left: { xs: 'calc(50% - 5px)', md: -41 } }
            : { bottom: { xs: -27, md: 'auto' }, top: { md: 'calc(50% - 5px)' }, left: { xs: 'calc(50% - 5px)', md: 'auto' }, right: { md: -41 } }),
        '&::after': {
            content: '""', position: 'absolute', inset: 0, borderRadius: '50%',
            bgcolor: side === 'start' ? EUROPE.glow : TALENT.glow, opacity: 0,
            animation: `${dotFlash} 2.6s ease-out var(--hit) infinite`,
            animationPlayState: 'inherit',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        },
    });
    const ringSx = (delay, soft) => ({
        position: 'absolute', inset: 0, borderRadius: '50%', border: `${soft ? 1.5 : 2}px solid ${b.accent}`,
        animation: `${soft ? pulseSoft : pulse} 2.6s ${b.ease} ${delay}s infinite`,
        '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 },
    });
    return (
        <Box sx={{ display: 'grid', placeItems: 'center', py: { xs: 1, md: 0 } }}>
            <Box role="img" aria-label={label} sx={{ position: 'relative', width: { xs: 120, md: 156 }, height: { xs: 120, md: 156 } }}>
                <Box aria-hidden sx={lineSx} />
                <Box aria-hidden ref={startRef} className="ctx-anim" sx={nodeSx('start')} />
                <Box aria-hidden ref={endRef} className="ctx-anim" sx={nodeSx('end')} />
                <Box aria-hidden className="ctx-anim ctx-ring" sx={ringSx(0)} />
                <Box aria-hidden className="ctx-anim ctx-ring" sx={ringSx(1.3, true)} />
                <Box
                    aria-hidden
                    sx={{
                        position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
                        border: '3px solid transparent',
                        background: `linear-gradient(${VIDEO_BG}, ${VIDEO_BG}) padding-box, linear-gradient(90deg, ${EUROPE.map}, ${TALENT.map}) border-box`,
                        boxShadow: '0 0 0 6px rgba(255,255,255,0.9), 0 14px 30px rgba(10,15,22,0.18)',
                    }}
                >
                    <HandshakeVideo onLogo={onLogo} />
                </Box>
            </Box>
        </Box>
    );
}

/** Background colour baked into the video's square padding. */
const VIDEO_BG = '#E5E4DD';

/** Frame sprite: 78 frames of 312px in a 9-column grid. */
const SPRITE = { src: '/images/handshake-frames.webp', frames: 78, cols: 9, size: 312 };

/**
 * The beats start once the animation passes 2.5s of the source video. The
 * sprite holds every frame of the 24fps, 3.25s clip, so 2.5s is frame 60.
 */
const BEAT_FROM = (2.5 * 24) / (SPRITE.frames - 1);

/**
 * Handshake that turns into the i2GO mark, driven by scroll rather than time.
 * The frames (public/images/handshake-frames.webp, a sprite sheet cut from
 * the handshake clip: square, padded in VIDEO_BG) are drawn onto a
 * canvas. The animation starts at its first frame once the medallion's bottom
 * edge is 20% up from the bottom of the screen and reaches its last frame, the
 * logo, when the medallion's centre is 40% down the screen. Scrolling back up
 * plays it backwards.
 * To keep it smooth with a mouse wheel (which scrolls in coarse steps), the
 * shown progress eases towards the scroll position each animation frame, and
 * neighbouring frames are cross-faded so motion is continuous between them.
 * Under reduced motion it shows the logo frame as a still.
 * `onLogo(true|false)` fires whenever the animation crosses BEAT_FROM.
 */
function HandshakeVideo({ onLogo }) {
    const boxRef = useRef(null);
    const canvasRef = useRef(null);
    const [still, setStill] = useState(false);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => setStill(mq.matches);
        sync();
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);
    useEffect(() => {
        if (still) { onLogo(true); return undefined; }
        const canvas = canvasRef.current;
        const box = boxRef.current;
        if (!canvas || !box) return undefined;
        const ctx = canvas.getContext('2d');
        const sprite = new window.Image();
        let loaded = false;
        let target = 0;
        let shown = -1; // -1 = nothing drawn yet
        let last = 0;
        let frame = 0;
        let running = false;
        let atLogo = null;

        const measure = () => {
            const vh = window.innerHeight;
            const r = box.getBoundingClientRect();
            // Start: medallion's bottom edge 20% up from the bottom of the
            // screen. End: its centre at 40% of the screen height.
            const start = vh * 0.8 - r.height;
            const end = vh * 0.4 - r.height / 2;
            return Math.min(1, Math.max(0, (start - r.top) / (start - end)));
        };
        const fit = () => {
            const px = Math.round(box.clientWidth * Math.min(window.devicePixelRatio || 1, 2));
            if (px && canvas.width !== px) { canvas.width = px; canvas.height = px; }
        };
        const drawFrame = (i, alpha) => {
            const sx = (i % SPRITE.cols) * SPRITE.size;
            const sy = Math.floor(i / SPRITE.cols) * SPRITE.size;
            ctx.globalAlpha = alpha;
            ctx.drawImage(sprite, sx, sy, SPRITE.size, SPRITE.size, 0, 0, canvas.width, canvas.height);
        };
        const draw = (p) => {
            const pos = p * (SPRITE.frames - 1);
            const i = Math.floor(pos);
            const mix = pos - i;
            drawFrame(i, 1);
            if (mix > 0.01 && i + 1 < SPRITE.frames) drawFrame(i + 1, mix);
            ctx.globalAlpha = 1;
            const isLogo = p >= BEAT_FROM;
            if (isLogo !== atLogo) { atLogo = isLogo; onLogo(isLogo); }
        };
        const tick = (now) => {
            const dt = last ? Math.min(now - last, 64) : 16;
            last = now;
            if (shown < 0) shown = target;
            // Ease towards the scroll position (~100ms time constant, frame-rate independent).
            shown += (target - shown) * (1 - Math.exp(-dt / 100));
            const done = Math.abs(target - shown) < 0.0005;
            if (done) shown = target;
            draw(shown);
            if (done) { running = false; last = 0; return; }
            frame = requestAnimationFrame(tick);
        };
        const update = () => {
            target = measure();
            if (!loaded || running) return;
            running = true;
            frame = requestAnimationFrame(tick);
        };
        const onResize = () => { fit(); if (loaded && shown >= 0) draw(shown); update(); };

        sprite.decoding = 'async';
        sprite.onload = () => {
            loaded = true;
            fit();
            target = measure();
            shown = target;
            draw(shown);
            setReady(true);
        };
        sprite.src = SPRITE.src;

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', onResize);
        return () => {
            cancelAnimationFrame(frame);
            sprite.onload = null;
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', onResize);
        };
    }, [still, onLogo]);

    return (
        <Box ref={boxRef} sx={{ position: 'absolute', inset: 0, bgcolor: VIDEO_BG }}>
            {still ? (
                <Image src="/images/handshake-end.webp" alt="" fill sizes="(max-width: 900px) 120px, 156px" style={{ objectFit: 'cover' }} />
            ) : (
                <>
                    {!ready && (
                        <Image src="/images/handshake-start.webp" alt="" fill sizes="(max-width: 900px) 120px, 156px" style={{ objectFit: 'cover' }} />
                    )}
                    <Box
                        component="canvas"
                        ref={canvasRef}
                        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                    />
                </>
            )}
        </Box>
    );
}
