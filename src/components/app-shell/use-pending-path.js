'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// A navigation that hasn't arrived after this long is treated as abandoned.
const GIVE_UP_MS = 15000;
// Prefetched pages arrive within about this long; only slower ones get a skeleton, so it never just flashes.
const SKELETON_AFTER_MS = 120;

/**
 * { pendingPath, slow }: the path of an internal link that was just clicked,
 * until the new page is on screen (null otherwise), and whether that is taking
 * long enough to show a skeleton. Lets the shell switch the menu, title and a
 * skeleton straight away while the server renders the page.
 *
 * This is instead of loading.jsx, which would make Next stream every page:
 * clients without JavaScript (crawlers, link previews) would then get the
 * skeleton with the real content hidden (ARCHITECTURE.md, Part 2).
 *
 * Only plain left-clicks on same-origin links to another path count. Query-only
 * changes (filters) are left to the views, which dim their lists instead.
 */
export function usePendingPath() {
    const pathname = usePathname();
    const [pending, setPending] = useState(null);
    const [slow, setSlow] = useState(false);

    // The new page arrived (or we went elsewhere): clear while rendering, not in an effect.
    const [lastPathname, setLastPathname] = useState(pathname);
    if (pathname !== lastPathname) {
        setLastPathname(pathname);
        setPending(null);
        setSlow(false);
    }

    useEffect(() => {
        const onClick = (event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = event.target.closest?.('a[href]');
            if (!link || link.target && link.target !== '_self' || link.hasAttribute('download')) return;
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
            setPending(url.pathname);
            setSlow(false);
        };
        const clear = () => { setPending(null); setSlow(false); };
        // Capture phase: next/link calls preventDefault() before a bubbling listener would run.
        document.addEventListener('click', onClick, true);
        window.addEventListener('popstate', clear);
        return () => {
            document.removeEventListener('click', onClick, true);
            window.removeEventListener('popstate', clear);
        };
    }, []);

    useEffect(() => {
        if (!pending) return undefined;
        const showSkeleton = setTimeout(() => setSlow(true), SKELETON_AFTER_MS);
        const giveUp = setTimeout(() => { setPending(null); setSlow(false); }, GIVE_UP_MS);
        return () => { clearTimeout(showSkeleton); clearTimeout(giveUp); };
    }, [pending]);

    return { pendingPath: pending, slow };
}
