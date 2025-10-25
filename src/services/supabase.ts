// Supabase configuration
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
    throw new Error('Supabase configuration is required');
}

// Create and export the Supabase client with public schema as default
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    db: {
        schema: 'public'
    }
});

// Create a client specifically for masters schema
export const supabaseMasters = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    db: {
        schema: 'masters'
    }
});

// Export the client as default for backward compatibility (public schema)
export const getSupabaseClient = () => supabase;

// Export masters schema client
export const getMastersClient = () => supabaseMasters;

export default getSupabaseClient;