import { supabase } from '@/lib/supabase/browser';

// Wishlist rows for the signed-in employer (candidate_wishlist), read and
// written from the browser with the employer's session; RLS limits each
// employer to their own rows.

export async function getSavedIds(userId) {
    const { data, error } = await supabase
        .from('candidate_wishlist')
        .select('candidate_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => row.candidate_id);
}

export async function saveCandidate(userId, candidateId) {
    const { error } = await supabase
        .from('candidate_wishlist')
        .insert({ user_id: userId, candidate_id: candidateId });
    // Already saved (unique violation) counts as success.
    if (error && error.code !== '23505') throw error;
}

export async function unsaveCandidate(userId, candidateId) {
    const { error } = await supabase
        .from('candidate_wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('candidate_id', candidateId);
    if (error) throw error;
}
