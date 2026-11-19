'use client';

import { useEffect, useState } from 'react';

/**
 * How far the viewport has moved through an element, from 0 (the anchor line
 * hasn't reached its top) to 1 (past its bottom). The anchor line is at
 * `anchor` × viewport height (0.5 = the middle of the screen). Used for the
 * timeline and rail line fills (plan §10).
 *
 * Returns a ref. The value is written to the element as the CSS variable
 * `--scroll-progress` on every animation frame while scrolling, without a
 * React render; children use it, e.g. `transform: scaleY(var(--scroll-progress, 1))`.
 * Without JS the variable is unset, so give it a fallback that shows the
 * content in its finished state.
 */
export function useScrollProgress({ anchor = 0.5 } = {}) {
    const [node, setNode] = useState(null);

    useEffect(() => {
        if (!node) return undefined;
        let frame = 0;
        const update = () => {
            frame = 0;
            const rect = node.getBoundingClientRect();
            const line = window.innerHeight * anchor;
            const progress = rect.height > 0 ? Math.min(1, Math.max(0, (line - rect.top) / rect.height)) : 0;
            node.style.setProperty('--scroll-progress', progress.toFixed(4));
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
            node.style.removeProperty('--scroll-progress');
        };
    }, [node, anchor]);

    return setNode;
}
