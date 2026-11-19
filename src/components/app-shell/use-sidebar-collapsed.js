'use client';

import { useState, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'i2go.sidebarCollapsed';
const listeners = new Set();
// Used when storage is blocked: the choice then lasts until the page reloads.
let fallback = false;

function read() {
    try {
        return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return fallback;
    }
}

function subscribe(listener) {
    listeners.add(listener);
    window.addEventListener('storage', listener); // Other tabs
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', listener);
    };
}

/**
 * [collapsed, toggle, animate]: whether the desktop sidebar shows icons only,
 * remembered in this browser. The server always renders it expanded. `animate`
 * turns true on the first toggle, so the width slides when the user clicks but
 * not when a collapsed sidebar is restored on page load.
 */
export function useSidebarCollapsed() {
    const collapsed = useSyncExternalStore(subscribe, read, () => false);
    const [animate, setAnimate] = useState(false);

    const toggle = () => {
        setAnimate(true);
        fallback = !collapsed;
        try {
            localStorage.setItem(STORAGE_KEY, fallback ? '1' : '0');
        } catch {
            // Not remembered across reloads.
        }
        listeners.forEach((listener) => listener());
    };

    return [collapsed, toggle, animate];
}
