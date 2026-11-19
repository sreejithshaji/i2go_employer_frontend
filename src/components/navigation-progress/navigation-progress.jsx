'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Box } from '@mui/material';
import { internalLinkTarget, isOtherPage, subscribeToNavigationStart } from './progress-store';

// Grows quickly at first, then slows towards CAP so it never looks finished early.
const TICK_MS = 200;
const CAP = 0.9;
const FIRST_STEP = 0.15;
// Fade-out after the page arrives.
const FINISH_MS = 400;
// A navigation that hasn't arrived after this long is treated as abandoned.
const GIVE_UP_MS = 15000;

/**
 * A thin bar along the top of the window from the moment an internal link is
 * clicked (or startNavigation() is called) until the new URL is on screen, so
 * every navigation answers the click straight away, on every layout.
 *
 * Done without loading.jsx, which would make Next stream pages and hide their
 * content from clients without JavaScript (ARCHITECTURE.md, Part 2).
 */
function Bar() {
    const pathname = usePathname();
    const search = useSearchParams().toString();
    const url = `${pathname}?${search}`;
    // null: hidden; 0..1 while loading; 1 while fading out.
    const [progress, setProgress] = useState(null);
    const [finishing, setFinishing] = useState(false);

    // The new page arrived: finish while rendering, not in an effect.
    const [lastUrl, setLastUrl] = useState(url);
    if (url !== lastUrl) {
        setLastUrl(url);
        if (progress !== null && !finishing) {
            setProgress(1);
            setFinishing(true);
        }
    }

    useEffect(() => {
        const start = () => {
            setFinishing(false);
            setProgress((p) => (p === null || p >= 1 ? FIRST_STEP : p));
        };
        // Capture phase: next/link calls preventDefault() before a bubbling listener would run.
        const onClick = (event) => {
            const target = internalLinkTarget(event);
            if (target && isOtherPage(target)) start();
        };
        document.addEventListener('click', onClick, true);
        const unsubscribe = subscribeToNavigationStart(start);
        return () => {
            document.removeEventListener('click', onClick, true);
            unsubscribe();
        };
    }, []);

    const loading = progress !== null && !finishing;
    useEffect(() => {
        if (!loading) return undefined;
        const tick = setInterval(() => setProgress((p) => (p === null ? p : p + (CAP - p) * 0.08)), TICK_MS);
        const giveUp = setTimeout(() => setFinishing(true), GIVE_UP_MS);
        return () => { clearInterval(tick); clearTimeout(giveUp); };
    }, [loading]);

    useEffect(() => {
        if (!finishing) return undefined;
        const hide = setTimeout(() => { setProgress(null); setFinishing(false); }, FINISH_MS);
        return () => clearTimeout(hide);
    }, [finishing]);

    if (progress === null) return null;
    return (
        <Box
            role="progressbar"
            aria-label="Loading"
            aria-busy={loading}
            sx={{
                position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 'tooltip', pointerEvents: 'none',
                opacity: finishing ? 0 : 1,
                transition: `opacity 250ms ease ${finishing ? '150ms' : '0ms'}`,
            }}
        >
            <Box
                sx={{
                    height: '100%', bgcolor: 'primary.main', transformOrigin: 'left',
                    transform: `scaleX(${progress})`, transition: `transform ${TICK_MS}ms ease-out`,
                    boxShadow: (theme) => `0 0 8px ${theme.palette.primary.main}`,
                }}
            />
        </Box>
    );
}

/** Mounted once in the app providers. */
export default function NavigationProgress() {
    // useSearchParams needs a Suspense boundary on statically rendered pages.
    return <Suspense fallback={null}><Bar /></Suspense>;
}
