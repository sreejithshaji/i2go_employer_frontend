'use client';

import { useEffect, useState } from 'react';

/**
 * Index of the last of the elements `ids` whose top has passed the anchor
 * line, or -1 before the first one. Read once per animation frame while
 * scrolling. This is state, not motion, so it runs under reduced motion too.
 *
 * The anchor line is `anchor` × viewport height (0.5 = the middle of the
 * screen). With `reach` (px), it's no lower than `reach` below the first
 * element's `scroll-margin-top`: after a jump to a short step (a rail link or
 * a URL with #step), the next step's top can already be above the middle of a
 * tall screen, and would be marked instead. `reach` must stay below the
 * shortest step's height plus the gap between steps.
 *
 * `initial` is the value before JS has run (and stays without JS).
 */
export function useActiveStep(ids, { anchor = 0.5, reach, initial = 0 } = {}) {
    const [active, setActive] = useState(initial);
    const key = ids.join('|');

    useEffect(() => {
        const nodes = key.split('|').map((id) => document.getElementById(id)).filter(Boolean);
        if (nodes.length === 0) return undefined;
        let frame = 0;
        const update = () => {
            frame = 0;
            let line = window.innerHeight * anchor;
            if (reach != null) {
                // Read each time: the scroll margin changes at the breakpoint.
                const margin = parseFloat(getComputedStyle(nodes[0]).scrollMarginTop) || 0;
                line = Math.min(line, margin + reach);
            }
            let index = -1;
            nodes.forEach((node, i) => {
                // +1: a step that a jump put exactly on the line counts as passed.
                if (node.getBoundingClientRect().top <= line + 1) index = i;
            });
            setActive(index);
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
        };
    }, [key, anchor, reach]);

    return active;
}
