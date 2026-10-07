'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/browser';
import { getEnquiryCandidates } from '../../(pages)/enquiries/actions';

// Read in the browser with the employer's session (my_enquiries()). Candidate
// details come from a server action, which sees the same session through cookies.

/** The signed-in employer's enquiries (newest first) and the listed candidates by id. error: 'error' or null. */
export function useMyEnquiries() {
    const [enquiries, setEnquiries] = useState(null);
    const [candidates, setCandidates] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data: rows, error: rpcError } = await supabase.rpc('my_enquiries');
                if (rpcError) throw rpcError;
                const ids = [...new Set((rows || []).map((r) => r.candidate_id).filter(Boolean))];
                // Candidates who are no longer listed simply don't come back.
                const result = ids.length > 0 ? await getEnquiryCandidates(ids) : { candidates: [] };
                if (cancelled) return;
                setCandidates(Object.fromEntries((result.candidates || []).map((c) => [c.id, c])));
                setEnquiries(rows || []);
            } catch {
                if (!cancelled) setError('error');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return { enquiries, candidates, error };
}
