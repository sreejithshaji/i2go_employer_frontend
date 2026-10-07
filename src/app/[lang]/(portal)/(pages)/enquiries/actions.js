'use server';

import { getCandidatesByIds, readErrorKind } from '@/app/modules/candidates/_1-domain/candidate_service';

/**
 * Details of the candidates the employer enquired about. The enquiry rows come
 * from my_enquiries() with the browser session; the service picks what the
 * caller may see from the session cookies. Candidates who are no longer listed
 * don't come back. error: 'readLimit' or 'error'.
 */
export async function getEnquiryCandidates(ids) {
    try {
        return { success: true, candidates: await getCandidatesByIds(ids) };
    } catch (error) {
        return { success: false, error: readErrorKind(error) };
    }
}
