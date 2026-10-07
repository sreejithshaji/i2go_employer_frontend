'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { TURNSTILE_SITE_KEY } from '@/lib/config';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise = null;

function loadScript() {
    if (window.turnstile) return Promise.resolve();
    if (!scriptPromise) {
        scriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = SCRIPT_SRC;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => {
                scriptPromise = null;
                reject(new Error('Could not load the bot check'));
            };
            document.head.appendChild(script);
        });
    }
    return scriptPromise;
}

/**
 * Cloudflare Turnstile widget. Calls onToken with a token when the check
 * passes, and with null when it expires or fails. Renders nothing when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY isn't set (submit-enquiry only requires a token
 * once TURNSTILE_SECRET_KEY is set on the function).
 */
export default function Turnstile({ onToken }) {
    const containerRef = useRef(null);
    const onTokenRef = useRef(onToken);
    useEffect(() => {
        onTokenRef.current = onToken;
    }, [onToken]);

    useEffect(() => {
        if (!TURNSTILE_SITE_KEY) return undefined;
        let widgetId = null;
        let cancelled = false;

        loadScript()
            .then(() => {
                if (cancelled || !containerRef.current) return;
                widgetId = window.turnstile.render(containerRef.current, {
                    sitekey: TURNSTILE_SITE_KEY,
                    callback: (token) => onTokenRef.current(token),
                    'expired-callback': () => onTokenRef.current(null),
                    'error-callback': () => onTokenRef.current(null),
                });
            })
            .catch(() => onTokenRef.current(null));

        return () => {
            cancelled = true;
            if (widgetId !== null) window.turnstile?.remove(widgetId);
        };
    }, []);

    if (!TURNSTILE_SITE_KEY) return null;
    return <Box ref={containerRef} sx={{ minHeight: 65 }} />;
}
