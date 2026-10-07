/**
 * Name of this portal's Supabase session cookie (may be split into .0, .1, …).
 * Not the default sb-<project>-auth-token: the admin portal signs in to the
 * same project, and on localhost cookies are shared across ports, so with the
 * default name an admin session would show up here as a signed-in account.
 */
export const AUTH_COOKIE = 'sb-employer-auth-token';

export const cookieOptions = { name: AUTH_COOKIE };

/** Whether a cookie name is (a chunk of) this portal's session cookie. */
export function isAuthCookie(name) {
    return name === AUTH_COOKIE || name.startsWith(`${AUTH_COOKIE}.`);
}
