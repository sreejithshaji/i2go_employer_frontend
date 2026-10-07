'use server';

import { getCandidatesByIds, readErrorKind } from '@/app/modules/candidates/_1-domain/candidate_service';

/**
 * Details of the candidates in a wishlist. The ids come from the browser (the
 * wishlist is read with the employer's session); the service picks what the
 * caller may see from the session cookies (employer view or the teaser).
 * error: 'readLimit' or 'error'; the view words it in the page language.
 */
export async function getWishlistCandidates(ids) {
    try {
        return { success: true, candidates: await getCandidatesByIds(ids) };
    } catch (error) {
        return { success: false, error: readErrorKind(error) };
    }
}
