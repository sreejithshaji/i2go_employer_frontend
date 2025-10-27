// Supabase configuration
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
    throw new Error('Supabase configuration is required');
}

// Singleton pattern to prevent multiple client instances
let supabaseInstance: any = null;

export const supabase = (() => {
    if (!supabaseInstance) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            },
            db: {
                schema: 'public'
            },
            global: {
                headers: {
                    'X-Client-Info': 'supabase-js-web'
                }
            }
        });

        // Suppress the multiple instances warning in development
        if (import.meta.env.DEV) {
            const originalWarn = console.warn;
            console.warn = (...args) => {
                if (args[0]?.includes?.('Multiple GoTrueClient instances detected')) {
                    return; // Suppress this specific warning
                }
                originalWarn.apply(console, args);
            };
        }
    }
    return supabaseInstance;
})();

// Create a client specifically for masters schema
export const supabaseMasters = createClient(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: 'masters'
    }
});