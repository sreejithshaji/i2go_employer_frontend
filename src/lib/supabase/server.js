import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookieOptions } from './cookie';

function env() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Check your .env file.');
    }
    return { url, key };
}

/**
 * Supabase client for server components and server actions, acting as the
 * visitor: anon for guests, the signed-in user from the session cookies
 * otherwise. RLS and the portal functions decide what each one sees
 * (public_candidates() for everyone, employer_candidates() for employers).
 *
 * Server components can't write cookies, so a refreshed token is dropped
 * there; src/proxy.js refreshes the session before the page renders.
 */
export async function createServerSupabase() {
    const { url, key } = env();
    const cookieStore = await cookies();
    return createServerClient(url, key, {
        cookieOptions,
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                } catch {
                    // Called from a server component; the proxy keeps the session fresh.
                }
            },
        },
    });
}

/** Reads and refreshes the session for one proxy request. Used by src/proxy.js only. */
export function createProxySupabase(request, onSetCookies) {
    const { url, key } = env();
    return createServerClient(url, key, {
        cookieOptions,
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet, headers) {
                onSetCookies(cookiesToSet, headers);
            },
        },
    });
}

/**
 * Anon client without the visitor's session, for public data that is the same
 * for everyone (categories, skills, live counts). Pages, the sitemap and the
 * layout can use it without making the response depend on cookies.
 */
export function createPublicSupabase() {
    const { url, key } = env();
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
