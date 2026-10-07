import 'server-only';
import { createPublicSupabase } from '@/lib/supabase/server';

// Guides for employers (migration 0022). They are the same for everyone, so
// they're read without the session; RLS only returns published ones.

const COLUMNS = 'id, position, slug_de, slug_en, title_de, title_en, description_de, description_en, intro_de, intro_en, '
    + 'sections_de, sections_en, faq_de, faq_en, content_updated_on';

/** Published guides in display order. */
export async function findPublishedGuides() {
    const { data, error } = await createPublicSupabase()
        .from('guides')
        .select(COLUMNS)
        .eq('is_published', true)
        .order('position')
        .order('id');
    if (error) throw error;
    return data || [];
}

/** The guide an old slug points to, or null: { target_id }. */
export async function findGuideRedirect(lang, slug) {
    const { data, error } = await createPublicSupabase()
        .from('slug_redirects')
        .select('target_id')
        .eq('kind', 'guide')
        .eq('lang', lang)
        .eq('old_slug', slug)
        .maybeSingle();
    if (error) throw error;
    return data ?? null;
}
