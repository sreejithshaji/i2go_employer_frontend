'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { startNavigation } from '@/components/navigation-progress/progress-store';

/** Replaces the current URL with `to` (React Router's <Navigate replace>). */
export default function Redirect({ to }) {
    const router = useRouter();
    useEffect(() => {
        startNavigation(to);
        router.replace(to);
    }, [router, to]);
    return null;
}
