import 'server-only';
import { cache } from 'react';
import { PAGE_SIZE } from '@/lib/portal/constants';
import { createSignedPhotoUrls, createSignedVideoUrl } from '../_0-database/candidate_media_repo';
import {
    CandidateReadLimitError, callerIsEmployer, findLiveCandidateById, findLiveCandidateByPublicNo, findLiveCandidates,
    findLiveCandidatesByIds,
} from '../_0-database/candidate_repo';
import { getLanguages } from './category_service';

export { CandidateReadLimitError };

/**
 * Why a candidate read failed, for the page to word in its language:
 * 'readLimit' (the employer read limit, HTTP 429) or 'error'.
 */
export function readErrorKind(error) {
    return error instanceof CandidateReadLimitError ? 'readLimit' : 'error';
}

// The single place that decides where candidate data comes from: signed-in
// employers get employer_candidates() (full name, age band, photo, video,
// company and institution names), everyone else the public_candidates() teaser.
// Every candidate gets `name` (full name or "Arjun N.") and `full_profile`, so
// views don't need to know which function the data came from.

const SIGNED_URL_SECONDS = 60 * 60;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_IDS = 200;

/** Whether this request's visitor is a signed-in employer. Once per request. */
export const viewerIsEmployer = cache(async () => {
    try {
        return await callerIsEmployer();
    } catch {
        // Can't tell: fall back to the teaser rather than failing the page.
        return false;
    }
});

const withName = (c) => ({ ...c, name: c.full_name || c.display_name, full_profile: c.full_name != null });

// Swaps each candidate's photo path for a signed URL (null if it can't be signed).
// The teaser has no photo paths, so guests skip the storage call.
async function withPhotoUrls(candidates) {
    const paths = [...new Set(candidates.map((c) => c.profile_picture_url).filter(Boolean))];
    const urls = {};
    if (paths.length > 0) {
        try {
            for (const item of await createSignedPhotoUrls(paths, SIGNED_URL_SECONDS)) {
                if (item.signedUrl) urls[item.path] = item.signedUrl;
            }
        } catch {
            // No photos is better than no list; cards fall back to initials.
        }
    }
    return candidates.map((c) => withName({ ...c, photo_url: urls[c.profile_picture_url] ?? null }));
}

/** Rank of a level name in a language's list (case-insensitive), or null. */
const rankOf = (language, name) => (name
    ? language?.levels.find((l) => l.name.toLowerCase() === name.toLowerCase())?.rank ?? null
    : null);

/**
 * The URL's language filters as the portal functions' p_languages (migration
 * 0024): German (?de, ?cert) and one other language (?lang, ?lvl).
 */
async function languageFilters({ germanLevel, germanCertified, languageId, languageLevel }) {
    if (!germanLevel && !germanCertified && !languageId) return [];
    const languages = await getLanguages();
    const result = [];
    const german = languages.find((l) => l.code === 'de');
    if (german && (germanLevel || germanCertified)) {
        result.push({ id: german.id, min_rank: rankOf(german, germanLevel), certified: germanCertified || null });
    }
    const other = languageId && languages.find((l) => l.id === languageId && l.code !== 'de');
    if (other) result.push({ id: other.id, min_rank: rankOf(other, languageLevel) });
    return result;
}

/**
 * One page of live candidates.
 * filters: { q, categoryIds: number[], skillIds: number[], minExperience, germanLevel, germanCertified,
 * languageId, languageLevel, page } (lib/portal/filters.js)
 * Returns { candidates, total }.
 */
export async function getCandidates(filters = {}) {
    const { q, categoryIds = [], skillIds = [], minExperience } = filters;
    const page = Number.isInteger(filters.page) && filters.page > 0 ? filters.page : 1;
    const where = { search: q?.trim() || null, categoryIds, skillIds, minExperience, languages: await languageFilters(filters) };
    const full = await viewerIsEmployer();

    let { rows, count } = await findLiveCandidates(where, { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE }, { full });
    // Past the last page there are no rows to carry the total; ask for it.
    if (count == null && page > 1) {
        ({ count } = await findLiveCandidates(where, { offset: 0, limit: 1 }, { full }));
    }
    return { candidates: await withPhotoUrls(rows), total: Number(count ?? 0) };
}

/**
 * Live candidates by id, in no particular order. The ids can come from the
 * browser (server actions), so anything that isn't a UUID is dropped.
 */
export async function getCandidatesByIds(ids) {
    if (!Array.isArray(ids)) return [];
    const valid = [...new Set(ids.filter((id) => typeof id === 'string' && UUID_RE.test(id)))].slice(0, MAX_IDS);
    if (valid.length === 0) return [];
    return withPhotoUrls(await findLiveCandidatesByIds(valid, { full: await viewerIsEmployer() }));
}

/** True for a candidate uuid (old /candidates/<uuid> links). */
export const isCandidateUuid = (value) => typeof value === 'string' && UUID_RE.test(value);

/** One live candidate by uuid, without media (to redirect old links), or null. */
export async function getCandidateRefById(id) {
    if (!isCandidateUuid(id)) return null;
    return findLiveCandidateById(id, { full: false });
}

/** One live candidate by public number, without media (to redirect short links), or null. */
export async function getCandidateRefByPublicNo(publicNo) {
    if (!Number.isSafeInteger(publicNo) || publicNo <= 0) return null;
    return findLiveCandidateByPublicNo(publicNo, { full: false });
}

/** One live candidate by public number with signed photo and video URLs, or null if not listed. */
export async function getCandidateByPublicNo(publicNo) {
    if (!Number.isSafeInteger(publicNo) || publicNo <= 0) return null;
    const row = await findLiveCandidateByPublicNo(publicNo, { full: await viewerIsEmployer() });
    if (!row) return null;

    const [candidate] = await withPhotoUrls([row]);
    candidate.video_url = null;
    if (candidate.intro_video_url) {
        try {
            candidate.video_url = await createSignedVideoUrl(candidate.intro_video_url, SIGNED_URL_SECONDS);
        } catch {
            // The profile still shows without the video.
        }
    }
    return candidate;
}
