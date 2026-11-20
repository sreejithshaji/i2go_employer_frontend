'use client';

import { useAuth } from '@/features/auth';
import EmployerCta from '@/app/[lang]/(marketing)/client/home/employer-cta';

/**
 * The homepage's navy employer panel at the end of the candidate list,
 * category and skill pages (plan 14.11), for guests only. Shown once the
 * session is known to be empty, so signed-in employers and candidate accounts
 * never see it flash in. Without JS it isn't rendered; the header's
 * "Create account" covers that case.
 */
export default function GuestEmployerCta() {
    const { ready, session } = useAuth();
    if (!ready || session) return null;
    return <EmployerCta headingLevel="h2" sx={{ mt: { xs: 5, md: 7 }, p: { xs: 3, md: 5.5 } }} />;
}
