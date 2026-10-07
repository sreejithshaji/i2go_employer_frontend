import 'server-only';
import { createPublicSupabase } from '@/lib/supabase/server';

/**
 * Live candidates per category (skill_id null) and per category + skill:
 * [{ category_id, skill_id, live_count, last_updated }] (portal_listing_stats(), 0019).
 */
export async function findListingStats() {
    const { data, error } = await createPublicSupabase().rpc('portal_listing_stats');
    if (error) throw error;
    return data || [];
}
