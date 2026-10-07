import 'server-only';
import { createPublicSupabase } from '@/lib/supabase/server';

/**
 * Languages with their levels (migration 0024): { id, language_name, name_de,
 * code, has_certificate, language_levels: [{ name, name_de, rank }] }.
 * Master data is the same for everyone, so it's read without the session.
 */
export async function findLanguagesWithLevels() {
    const { data, error } = await createPublicSupabase()
        .from('languages')
        .select('id, language_name, name_de, code, has_certificate, language_levels (name, name_de, rank)')
        .order('language_name');
    if (error) throw error;
    return data || [];
}
