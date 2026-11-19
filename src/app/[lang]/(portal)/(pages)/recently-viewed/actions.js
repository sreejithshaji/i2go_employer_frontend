'use server';

import { getCandidatesByIds, readErrorKind } from '@/app/modules/candidates/_1-domain/candidate_service';

/**
 * Details of the recently viewed candidates. The ids come from the browser's
 * own list (6.20); the service picks what the caller may see from the session
 * cookies (employer view or the teaser), so guests get the teaser.
 * error: 'readLimit' or 'error'; the view words it in the page language.
 */
export async function getRecentlyViewedCandidates(ids) {
    try {
        return { success: true, candidates: await getCandidatesByIds(ids) };
    } catch (error) {
        return { success: false, error: readErrorKind(error) };
    }
}
