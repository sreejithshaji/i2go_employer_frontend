import { NextResponse } from 'next/server';
import { localeOfPath, matchLocale } from '@/lib/i18n/config';
import { localizeLegacyPath } from '@/lib/i18n/routes';
import { isAuthCookie } from '@/lib/supabase/cookie';
import { createProxySupabase } from '@/lib/supabase/server';

/**
 * 1. Language (PLAN.md 11.1.3, 11.3.2): every page lives under /de or /en. A
 *    URL without one (/, old links like /candidates/<uuid>, /terms) is
 *    redirected to the visitor's language from Accept-Language (German by
 *    default). The redirect is temporary (307) because it depends on that
 *    header; the pages themselves have fixed URLs with hreflang.
 *
 * 2. Session: keeps the Supabase session cookies fresh. Server components can
 *    read cookies but not write them, so an expired access token is refreshed
 *    here, before the page renders, and the new cookies go both to the page
 *    (request) and back to the browser (response). Guests have no session
 *    cookie and skip it.
 */
export async function proxy(request) {
    const { pathname, search } = request.nextUrl;

    if (!localeOfPath(pathname)) {
        const lang = matchLocale(request.headers.get('accept-language'));
        const url = request.nextUrl.clone();
        url.pathname = localizeLegacyPath(pathname, lang);
        url.search = search;
        const response = NextResponse.redirect(url, 307);
        response.headers.set('Vary', 'Accept-Language');
        return response;
    }

    const hasSession = request.cookies.getAll().some(({ name }) => isAuthCookie(name));
    if (!hasSession) return NextResponse.next();

    let response = NextResponse.next({ request });
    const supabase = createProxySupabase(request, (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
    });
    // Validates the token and refreshes it when it has expired.
    await supabase.auth.getClaims();
    return response;
}

export const config = {
    // Pages and server actions only; not static files, images, /api (share images), the app icons
    // (app/favicon.ico, icon.png, apple-icon.png), robots.txt or the sitemap.
    matcher: ['/((?!_next/static|_next/image|api/|images/|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml).*)'],
};
