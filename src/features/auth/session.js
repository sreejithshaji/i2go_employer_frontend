import { supabase } from '@/lib/supabase/browser';

// Browser-side auth calls. The session is kept in cookies (@supabase/ssr), so
// the server sees the same user (lib/supabase/server.js).

export function getSession() {
    return supabase.auth.getSession();
}

/** Calls onChange(session) on every auth change; returns an unsubscribe function. */
export function onSessionChange(onChange) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => onChange(next));
    return () => subscription.unsubscribe();
}

/** The employer row in public.users, or null for candidate/admin accounts. */
export async function getEmployerProfile(userId) {
    const { data } = await supabase
        .from('users')
        .select('id, email, full_name, terms_version, terms_accepted_at')
        .eq('id', userId)
        .maybeSingle();
    return data ?? null;
}

export function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
}

/**
 * No account_type, so the signup trigger creates an employer (public.users).
 * termsVersion is the version of the employer terms the user accepted on the
 * form; the trigger stores it with the server time.
 */
export function signUp({ email, password, fullName, termsVersion, redirectTo }) {
    return supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName, terms_version: termsVersion },
            emailRedirectTo: redirectTo,
        },
    });
}

export function signOut() {
    return supabase.auth.signOut();
}

/** Records that the signed-in employer accepted this version of the terms. */
export async function acceptTerms(version) {
    const { error } = await supabase.rpc('accept_employer_terms', { p_version: version });
    if (error) throw error;
}
