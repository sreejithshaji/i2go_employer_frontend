import 'server-only';
import { createPublicSupabase } from '@/lib/supabase/server';

// Master data is the same for everyone, so it's read without the session.

/**
 * Active job categories with German names, slugs and landing-page intros
 * (migration 0019), and the optional search-result title and description (0021).
 */
export async function findActiveCategories() {
    const { data, error } = await createPublicSupabase()
        .from('assigned_job_categories')
        .select('id, name, name_de, slug_de, slug_en, description_de, description_en, seo_title_de, seo_title_en, seo_description_de, seo_description_en')
        .eq('is_active', true)
        .order('name');
    if (error) throw error;
    return data || [];
}

/** The row an old slug points to, or null: { target_id }. kind: 'category' | 'skill'. */
export async function findSlugRedirect(kind, lang, slug) {
    const { data, error } = await createPublicSupabase()
        .from('slug_redirects')
        .select('target_id')
        .eq('kind', kind)
        .eq('lang', lang)
        .eq('old_slug', slug)
        .maybeSingle();
    if (error) throw error;
    return data ?? null;
}
