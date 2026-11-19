'use client';

// Lets any code tell the top progress bar (navigation-progress.jsx) that a
// navigation has started. Link clicks are picked up on their own; call
// startNavigation() before router.push / replace / back, which no click reveals.

const listeners = new Set();

/** @param {() => void} listener @returns {() => void} unsubscribe */
export function subscribeToNavigationStart(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** The URL without its hash, which never triggers a navigation. */
function pageKey(url) {
    return url.pathname + url.search;
}

/**
 * Starts the progress bar. With `href`, nothing happens when it points at the
 * page already on screen (Next doesn't navigate then, so the bar would never finish).
 * @param {string} [href]
 */
export function startNavigation(href) {
    if (typeof window === 'undefined') return;
    if (href != null) {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin || pageKey(url) === pageKey(window.location)) return;
    }
    listeners.forEach((listener) => listener());
}

/**
 * The URL a click will navigate to inside this app, or null: only plain
 * left-clicks on same-origin links opened in this tab. Clicks on a button
 * nested in a link (a card's wishlist heart) don't count, since those buttons
 * stop the link.
 * @param {MouseEvent} event
 * @returns {URL | null}
 */
export function internalLinkTarget(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
    const link = event.target.closest?.('a[href]');
    if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return null;
    const control = event.target.closest('button, input, select, textarea, label, [role="button"]');
    if (control && control !== link && link.contains(control)) return null;
    const url = new URL(link.href, window.location.href);
    return url.origin === window.location.origin ? url : null;
}

/** Whether `url` is a different page from the one on screen (hash-only changes aren't). */
export function isOtherPage(url) {
    return pageKey(url) !== pageKey(window.location);
}
