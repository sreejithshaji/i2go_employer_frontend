'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TERMS_VERSION } from '@/lib/portal/legal';
import { hasSessionCookie, loadAuthApi, whenAuthApiLoaded } from './load-api';
import { AuthContext } from './use-auth';

const NO_IDS = [];

/**
 * Session state for the portal. Login is optional: guests can browse and
 * send enquiries. A signed-in user with a row in public.users is an employer
 * and also gets saved candidates and "My enquiries". Candidate (app) and
 * admin accounts have no such row and are treated as guests here.
 *
 * The session lives in cookies, and the server renders employers a different
 * candidate view (names, photos), so the page is re-rendered on the server
 * whenever the signed-in user changes.
 *
 * The Supabase client loads only when there is a session cookie, or once
 * someone signs in (load-api.js). A guest without one is known to be signed
 * out at once and never downloads it. Another tab signing in sets the
 * cookie; it is checked again when this tab gets focus.
 */
export default function AuthProvider({ children }) {
    // undefined until the stored session has been read.
    const [session, setSession] = useState(undefined);
    // Employer profile and wishlist ids, tagged with the user they belong to. Only
    // the async load writes it, so a different (or no) user simply doesn't match.
    const [loaded, setLoaded] = useState({ userId: null, profile: null, savedIds: [] });

    useEffect(() => {
        let unsubscribe = () => {};
        const cancelLoad = whenAuthApiLoaded((api) => {
            api.getSession().then(({ data }) => setSession(data.session));
            unsubscribe = api.onSessionChange(setSession);
        });
        const check = () => {
            if (hasSessionCookie()) loadAuthApi();
        };
        if (hasSessionCookie()) loadAuthApi();
        // Async like getSession(), so the first render matches the server's.
        else Promise.resolve().then(() => setSession((s) => (s === undefined ? null : s)));
        window.addEventListener('focus', check);
        return () => {
            cancelLoad();
            unsubscribe();
            window.removeEventListener('focus', check);
        };
    }, []);

    const sessionKnown = session !== undefined;
    const userId = session?.user?.id ?? null;

    // Sign-in, sign-out or a switch of account: fetch the server components again.
    // Not on the first read of the session, which the server already rendered for.
    const router = useRouter();
    const renderedFor = useRef(undefined);
    useEffect(() => {
        if (!sessionKnown) return;
        if (renderedFor.current !== undefined && renderedFor.current !== userId) router.refresh();
        renderedFor.current = userId;
    }, [sessionKnown, userId, router]);
    const current = userId && loaded.userId === userId ? loaded : null;
    const profile = current?.profile ?? null;
    const savedIds = current?.savedIds ?? NO_IDS;
    // Ready once the session is read and, when signed in, that user's data has loaded.
    const ready = sessionKnown && (!userId || !!current);

    // Load the employer profile and saved candidates whenever the user changes.
    useEffect(() => {
        if (!userId) return undefined;
        let cancelled = false;
        (async () => {
            // Deferred so it doesn't run inside the auth callback (supabase-js
            // can deadlock when queries run there).
            await Promise.resolve();
            let data = null;
            try {
                data = await (await loadAuthApi()).getEmployerProfile(userId);
            } catch {
                // Network failure: treat as not an employer rather than loading forever.
            }
            let ids = [];
            if (data) {
                try {
                    ids = await (await loadAuthApi()).getSavedIds(userId);
                } catch {
                    // Saved list is a convenience; the page still works without it.
                }
            }
            if (!cancelled) setLoaded({ userId, profile: data, savedIds: ids });
        })();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    const setSavedIds = useCallback(
        (update) => setLoaded((l) => (l.userId === userId ? { ...l, savedIds: update(l.savedIds) } : l)),
        [userId],
    );

    const toggleSaved = useCallback(
        async (candidateId) => {
            if (!userId) return;
            const wasSaved = savedIds.includes(candidateId);
            setSavedIds((ids) => (wasSaved ? ids.filter((id) => id !== candidateId) : [candidateId, ...ids]));
            try {
                const api = await loadAuthApi();
                if (wasSaved) await api.unsaveCandidate(userId, candidateId);
                else await api.saveCandidate(userId, candidateId);
            } catch (error) {
                // Roll back the optimistic change.
                setSavedIds((ids) => (wasSaved ? [candidateId, ...ids] : ids.filter((id) => id !== candidateId)));
                throw error;
            }
        },
        [userId, savedIds, setSavedIds],
    );

    const signOut = useCallback(async () => (await loadAuthApi()).signOut(), []);

    // Records acceptance of the current terms, then reloads the server view:
    // full profiles need accepted terms (is_employer(), migration 0016).
    const acceptTerms = useCallback(async () => {
        if (!userId) return;
        const api = await loadAuthApi();
        await api.acceptTerms(TERMS_VERSION);
        const fresh = await api.getEmployerProfile(userId);
        setLoaded((l) => (l.userId === userId ? { ...l, profile: fresh } : l));
        router.refresh();
    }, [userId, router]);

    const value = useMemo(
        () => ({
            ready,
            session: session ?? null,
            user: session?.user ?? null,
            profile,
            isEmployer: !!profile,
            // An employer who hasn't accepted the current terms sees only the teaser.
            needsTerms: !!profile && profile.terms_version !== TERMS_VERSION,
            acceptTerms,
            // Signed in with an account that isn't an employer (a candidate's app account).
            isOtherAccount: !!session && ready && !profile,
            savedIds,
            toggleSaved,
            signOut,
        }),
        [ready, session, profile, savedIds, toggleSaved, signOut, acceptTerms],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

