'use client';

import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { brand as b } from '@/app/theme';
import Reveal from './reveal';
import { useActiveStep } from './use-active-step';
import { useScrollProgress } from './use-scroll-progress';

const NODE = { xs: 28, md: 36 };
/** The line the fill and the node states follow (× viewport height). */
const ANCHOR = 0.55;

/**
 * Vertical timeline on the light candidate section (plan §5.2): white ring
 * nodes with an accent two-digit number, joined by a 1px hairline that
 * fills with the accent from top to bottom as the line scrolls past the anchor
 * line (`transform: scaleY`, no layout work), so it's full exactly when the
 * last node is reached. The line ends at the last node's centre
 * (`--timeline-end`, measured); without JS it runs to the end of the list and
 * the fill is complete. A node's ring turns accent when the fill reaches it
 * (250ms) and back when you scroll above it. Step text sits on the light surface; `children` of a step (its action or
 * note) goes under its text.
 *
 * steps: [{ key, title, text, extra? }]
 */
export default function Timeline({ steps, idPrefix, label }) {
    const trackRef = useScrollProgress({ anchor: ANCHOR });
    // Last node the fill has reached: a step's top is its node's top. Without JS all are reached, like the line.
    const reached = useActiveStep(steps.map((_, i) => `${idPrefix}-${i + 1}`), { anchor: ANCHOR, initial: steps.length - 1 });
    const listRef = useRef(null);

    useEffect(() => {
        const list = listRef.current;
        if (!list || typeof ResizeObserver === 'undefined') return undefined;
        const measure = () => {
            const last = list.lastElementChild;
            const node = last?.querySelector('[data-node]');
            if (!last || !node) return;
            list.style.setProperty('--timeline-end', `${last.offsetHeight - (node.offsetTop + node.offsetHeight / 2)}px`);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(list);
        measure();
        return () => observer.disconnect();
    }, []);

    return (
        <Box component="ol" ref={listRef} aria-label={label} sx={{ position: 'relative', listStyle: 'none', m: 0, p: 0 }}>
            {/* Track and fill run from the first node's centre to the last node's centre. */}
            <Box
                aria-hidden
                ref={trackRef}
                sx={{
                    position: 'absolute', top: { xs: NODE.xs / 2, md: NODE.md / 2 }, bottom: 'var(--timeline-end, 0px)', width: '1px',
                    left: { xs: NODE.xs / 2 - 0.5, md: NODE.md / 2 - 0.5 }, bgcolor: b.line,
                }}
            >
                <Box
                    sx={{
                        width: '100%', height: '100%', bgcolor: b.accent, transformOrigin: 'top',
                        transform: 'scaleY(var(--scroll-progress, 1))',
                    }}
                />
            </Box>
            {steps.map((step, i) => {
                const last = i === steps.length - 1;
                return (
                    <Box
                        component="li"
                        key={step.key}
                        id={`${idPrefix}-${i + 1}`}
                        sx={{
                            position: 'relative', display: 'grid', columnGap: { xs: 2, md: 3 },
                            gridTemplateColumns: { xs: `${NODE.xs}px minmax(0, 1fr)`, md: `${NODE.md}px minmax(0, 1fr)` },
                            pb: last ? 0 : { xs: 5, md: 6 },
                        }}
                    >
                        <Box
                            aria-hidden
                            data-node
                            sx={{
                                position: 'relative', zIndex: 1, width: NODE, height: NODE, borderRadius: '50%',
                                display: 'grid', placeItems: 'center', bgcolor: b.surface,
                                border: `1.5px solid ${i <= reached ? b.accent : b.line2}`, boxSizing: 'border-box',
                                boxShadow: i <= reached ? `${b.shadow1}, 0 0 0 4px ${b.accentLine}` : `${b.shadow1}, 0 0 0 4px transparent`,
                                transition: `border-color 250ms ${b.ease}, box-shadow 250ms ${b.ease}`,
                                color: b.accentText, fontSize: { xs: 10.5, md: 12 }, fontWeight: 800, letterSpacing: '0.06em',
                            }}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </Box>
                        {/* The text comes in on scroll (plan §10); node and line stay put. */}
                        <Reveal sx={{ minWidth: 0, pt: { xs: '2px', md: '5px' } }}>
                            <Typography component="h3" sx={{ m: 0, fontSize: { xs: 19, md: 22 }, lineHeight: 1.25, fontWeight: 800, letterSpacing: '-0.5px', color: b.ink }}>
                                <Box component="span" sx={visuallyHidden}>{String(i + 1).padStart(2, '0')} </Box>
                                {step.title}
                            </Typography>
                            <Typography component="p" sx={{ m: 0, mt: 1, maxWidth: 620, fontSize: 15, lineHeight: 1.65, fontWeight: 500, color: b.muted }}>
                                {step.text}
                            </Typography>
                            {step.extra && <Box sx={{ mt: 2.5 }}>{step.extra}</Box>}
                        </Reveal>
                    </Box>
                );
            })}
        </Box>
    );
}

const visuallyHidden = {
    position: 'absolute', width: 1, height: 1, p: 0, m: '-1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};
