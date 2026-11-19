'use client';

import { useEffect, useState } from 'react';

/**
 * Index of the active step for a step rail: the last of the elements `ids`
 * whose top has passed the anchor line (`anchor` × viewport height), or 0
 * before the first one. Read once per animation frame while scrolling; it
 * stays 0 without JS. This is state, not motion, so it runs under reduced
 * motion too.
 */
export function useActiveStep(ids, { anchor = 0.5 } = {}) {
    const [active, setActive] = useState(0);
    const key = ids.join('|');

    useEffect(() => {
        const nodes = key.split('|').map((id) => document.getElementById(id)).filter(Boolean);
        if (nodes.length === 0) return undefined;
        let frame = 0;
        const update = () => {
            frame = 0;
            const line = window.innerHeight * anchor;
            let index = 0;
            nodes.forEach((node, i) => {
                if (node.getBoundingClientRect().top <= line) index = i;
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
    }, [key, anchor]);

    return active;
}
