'use client';

import { Suspense } from 'react';
import NextLink from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@mui/material';
import { loginHref, signupHref } from './login-href';

function ButtonWithQuery({ pathname, hrefFor, ...props }) {
    const query = useSearchParams().toString();
    return <Button component={NextLink} href={hrefFor(query ? `${pathname}?${query}` : pathname)} {...props} />;
}

/**
 * Button to an auth page that returns to the current page, filters included.
 * useSearchParams needs a Suspense boundary, so the static HTML gets the
 * same button without the query string.
 */
function ReturnButton({ hrefFor, ...props }) {
    const pathname = usePathname();
    return (
        <Suspense fallback={<Button component={NextLink} href={hrefFor(pathname)} {...props} />}>
            <ButtonWithQuery pathname={pathname} hrefFor={hrefFor} {...props} />
        </Suspense>
    );
}

/** "Sign in" button that returns to the current page. */
export default function SignInButton(props) {
    return <ReturnButton hrefFor={loginHref} {...props} />;
}

/** "Create account" button; returns to the current candidate page (signupHref). */
export function SignUpButton(props) {
    return <ReturnButton hrefFor={signupHref} {...props} />;
}
