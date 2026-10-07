import 'server-only';
import { createPublicSupabase } from '@/lib/supabase/server';

/** Every technical skill with its German name and slugs (migration 0019). */
export async function findSkills() {
    const { data, error } = await createPublicSupabase()
        .from('technical_skills')
        .select('id, name:skill_name, name_de, slug_de, slug_en')
        .order('skill_name');
    if (error) throw error;
    return data || [];
}
