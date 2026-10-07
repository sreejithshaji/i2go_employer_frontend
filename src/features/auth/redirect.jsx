'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Replaces the current URL with `to` (React Router's <Navigate replace>). */
export default function Redirect({ to }) {
    const router = useRouter();
    useEffect(() => {
        router.replace(to);
    }, [router, to]);
    return null;
}
