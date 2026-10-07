'use client';

import { Suspense } from 'react';
import NextLink from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@mui/material';
import { loginHref } from './login-href';

function SignInButtonWithQuery({ pathname, ...props }) {
    const query = useSearchParams().toString();
    return <Button component={NextLink} href={loginHref(query ? `${pathname}?${query}` : pathname)} {...props} />;
}

/**
 * "Sign in" button that returns to the current page, filters included.
 * useSearchParams needs a Suspense boundary, so the static HTML gets the
 * same button without the query string.
 */
export default function SignInButton(props) {
    const pathname = usePathname();
    return (
        <Suspense fallback={<Button component={NextLink} href={loginHref(pathname)} {...props} />}>
            <SignInButtonWithQuery pathname={pathname} {...props} />
        </Suspense>
    );
}
