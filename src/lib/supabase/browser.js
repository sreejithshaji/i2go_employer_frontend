import { createBrowserClient } from '@supabase/ssr';
import { cookieOptions } from './cookie';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Check your .env file.');
}

// Same Supabase project as the mobile app. Guests use the publishable key;
// signed-in employers send their session token. The session is kept in
// cookies (@supabase/ssr), so server components and actions see it too
// (lib/supabase/server.js). createBrowserClient returns one shared instance.
export const supabase = createBrowserClient(supabaseUrl, supabasePublishableKey, { cookieOptions });
