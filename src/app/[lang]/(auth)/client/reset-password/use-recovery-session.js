'use client';

import { useEffect, useState } from 'react';
import { loadAuthApi } from '@/features/auth';

/** Supabase reports a failed link as error / error_code in the query (PKCE) or the hash. */
function linkErrorInUrl() {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return query.get('error_code') || query.get('error') || hash.get('error_code') || hash.get('error') || null;
}

/**
 * The session a reset link opens (PLAN.md 12.3). The link lands here with
 * ?code=…; loading the browser client exchanges it for a recovery session
 * (detectSessionInUrl). That needs the code verifier cookie this browser set
 * when it asked for the link: from another browser, or once the code is used or
 * expired, there is no session. The client is loaded here because a guest's
 * AuthProvider doesn't load it (load-api.js).
 *
 * Returns 'checking' | 'ready' | 'invalid'.
 */
export function useRecoverySession() {
    const [status, setStatus] = useState('checking');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            let next = 'invalid';
            if (!linkErrorInUrl()) {
                try {
                    const { data } = await (await loadAuthApi()).getSession();
                    if (data.session) next = 'ready';
                } catch {
                    // Network failure: treated like a bad link, which offers a new one.
                }
            }
            if (!cancelled) setStatus(next);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return status;
}
