'use client';

import { useEffect, useState } from 'react';
import { brand as b } from '@/app/theme';

const REDUCED = '(prefers-reduced-motion: reduce)';

/**
 * Whether an element is in the viewport (IntersectionObserver), for entrance
 * animations and the active step. Returns [ref, inView]; pass `ref` as the
 * element's ref.
 *
 * `inView` is `null` until the observer has reported, and stays `null`
 * without JS, without IntersectionObserver and under reduced motion. Treat
 * `null` as visible: content is hidden only once JS has run and found it
 * below the fold, so crawlers and no-JS visitors see the whole page (plan §10).
 *
 * `once` (default) stops observing after the first time it's seen, so an
 * entrance plays once. Pass `once: false` for a live value (active step).
 */
export function useInView({ once = true, rootMargin = '0px 0px -10% 0px', threshold = 0 } = {}) {
    const [node, setNode] = useState(null);
    const [inView, setInView] = useState(null);

    useEffect(() => {
        if (!node || typeof IntersectionObserver === 'undefined') return undefined;
        // A live value (once: false) is state, not motion, so it's tracked under reduced motion too.
        if (once && window.matchMedia?.(REDUCED).matches) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
                if (entry.isIntersecting && once) observer.disconnect();
            },
            { rootMargin, threshold },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [node, once, rootMargin, threshold]);

    return [setNode, inView];
}

/**
 * `sx` for the reference's `stepin` entrance (opacity and translateY 22px →
 * 0, 500ms, ease-brand). Hidden only when `inView === false`. `delay` in ms
 * staggers siblings (plan §10: 60ms steps).
 */
export function revealSx(inView, delay = 0) {
    if (inView === false) return { opacity: 0, transform: 'translateY(22px)' };
    return {
        opacity: 1,
        transform: 'none',
        transition: `opacity 500ms ${b.ease} ${delay}ms, transform 500ms ${b.ease} ${delay}ms`,
    };
}
