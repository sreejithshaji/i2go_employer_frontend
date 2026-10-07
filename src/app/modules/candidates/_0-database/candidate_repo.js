import 'server-only';
import { createServerSupabase } from '@/lib/supabase/server';

// Live candidates through the portal functions (migration 0014). Never query
// the candidate tables directly: anon and employers have no access.
//   public_candidates()   the anonymised teaser, for everyone
//   employer_candidates() adds full name, age band, photo, video, company and
//                         institution names; no rows unless the caller is an employer
// `full` picks employer_candidates(); the service decides (candidate_service.js).
// Since 0019 both also filter by skill and by public number (k-1042 in URLs),
// and since 0024 by language: p_languages is a list of { id, min_rank?, certified? }
// that must all match.

const source = (full) => (full ? 'employer_candidates' : 'public_candidates');

/** True when the session belongs to an active employer (public.users row). */
export async function callerIsEmployer() {
    const supabase = await createServerSupabase();
    // Reads the cookie only; guests skip the database call.
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    const { data, error } = await supabase.rpc('is_employer');
    if (error) throw error;
    return data === true;
}

/** Thrown when an employer has read too many candidates in a short time (HTTP 429). */
export class CandidateReadLimitError extends Error {}

// Filtering, counting and paging happen inside the functions (migration 0014),
// with a page-size cap of 50 (200 for an id list). Each row carries total_count.
async function call(full, args) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.rpc(source(full), args);
    if (error) {
        if (error.code === 'PT429') throw new CandidateReadLimitError(error.message);
        throw error;
    }
    return data || [];
}

/**
 * One range of live candidates, newest first, with the total for paging.
 * where: { search, categoryIds, skillIds, minExperience, languages: [{ id, min_rank?, certified? }] }. Employers search the full
 * name, everyone else the display name ("Arjun N."); the function escapes
 * LIKE wildcards.
 */
export async function findLiveCandidates(where, { offset, limit }, { full }) {
    const { search, categoryIds = [], skillIds = [], minExperience, languages = [] } = where;
    const rows = await call(full, {
        p_search: search || null,
        p_category_ids: categoryIds.length > 0 ? categoryIds : null,
        p_skill_ids: skillIds.length > 0 ? skillIds : null,
        p_min_experience: minExperience || null,
        // Only sent when set: the argument exists since migration 0024.
        ...(languages.length > 0 ? { p_languages: languages } : {}),
        p_offset: offset,
        p_limit: limit,
    });
    return { rows, count: rows[0]?.total_count ?? null };
}

/** Live candidates by id (up to 200), in no particular order. */
export function findLiveCandidatesByIds(ids, { full }) {
    return call(full, { p_ids: ids, p_limit: ids.length });
}

/** One live candidate, or null if it isn't listed. */
export async function findLiveCandidateById(id, { full }) {
    const [row] = await call(full, { p_ids: [id], p_limit: 1 });
    return row ?? null;
}

/** One live candidate by public number, or null if it isn't listed. */
export async function findLiveCandidateByPublicNo(publicNo, { full }) {
    const [row] = await call(full, { p_public_no: publicNo, p_limit: 1 });
    return row ?? null;
}
