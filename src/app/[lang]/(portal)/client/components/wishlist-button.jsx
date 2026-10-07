'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, IconButton, Portal, Snackbar, Tooltip } from '@mui/material';
import { keyframes } from '@emotion/react';
import { FiHeart } from 'react-icons/fi';
import { loginHref, useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { tokens } from '@/app/theme';

const pop = keyframes`
    0% { transform: scale(1); }
    40% { transform: scale(1.3); }
    100% { transform: scale(1); }
`;

/**
 * Wishlist heart. Employers add or remove the candidate; guests are sent to sign in
 * (and come back to this page). Hidden for signed-in candidate/admin accounts, which
 * can't keep a wishlist. variant: "icon" (cards, phone bar) or "button" (profile header).
 */
export default function WishlistButton({ candidateId, size = 'medium', variant = 'icon' }) {
    const { user, isEmployer, savedIds, toggleSaved } = useAuth();
    const { t, p } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    const [toast, setToast] = useState(null); // { message, link }
    const [popKey, setPopKey] = useState(0);

    if (user && !isEmployer) return null;
    const inList = isEmployer && savedIds.includes(candidateId);
    const label = !user ? t.wishlistButton.signInToAdd : inList ? t.wishlistButton.remove : t.wishlistButton.add;

    const handleClick = async (event) => {
        // The button sits inside the card's link.
        event.preventDefault();
        event.stopPropagation();
        if (!user) {
            // Read at click time so the current filters come back after sign-in.
            router.push(loginHref(window.location.pathname + window.location.search));
            return;
        }
        try {
            await toggleSaved(candidateId);
            if (!inList) setPopKey((k) => k + 1);
            setToast({
                message: inList ? t.wishlistButton.removed : t.wishlistButton.added,
                link: !inList && pathname !== p.wishlist,
            });
        } catch {
            setToast({ message: t.wishlistButton.failed });
        }
    };

    const heart = (
        <FiHeart
            key={popKey}
            size={variant === 'button' || size !== 'small' ? 20 : 18}
            fill={inList ? 'currentColor' : 'none'}
            style={{ animation: popKey ? `${pop} 320ms ${tokens.ease}` : undefined }}
        />
    );

    return (
        <>
            {variant === 'button' ? (
                <Button
                    variant="outlined"
                    size="large"
                    onClick={handleClick}
                    aria-pressed={inList}
                    startIcon={heart}
                    sx={{
                        flexShrink: 0,
                        '& .MuiButton-startIcon': { color: inList ? tokens.danger : 'text.secondary' },
                        '&:hover .MuiButton-startIcon': { color: tokens.danger },
                    }}
                >
                    {inList ? t.wishlistButton.inWishlist : t.wishlistButton.add}
                </Button>
            ) : (
                <Tooltip title={label}>
                    <IconButton
                        size={size}
                        onClick={handleClick}
                        aria-pressed={inList}
                        aria-label={label}
                        sx={{ color: inList ? tokens.danger : 'text.secondary', '&:hover': { color: tokens.danger } }}
                    >
                        {heart}
                    </IconButton>
                </Tooltip>
            )}
            {/* Portal: cards use transforms, which would trap a fixed-position toast */}
            <Portal>
                <Snackbar
                    open={!!toast}
                    autoHideDuration={4000}
                    onClose={() => setToast(null)}
                    message={toast?.message}
                    action={toast?.link ? (
                        <Button component={NextLink} href={p.wishlist} size="small" sx={{ color: '#93C5FD', minHeight: 32 }}>
                            {t.wishlistButton.view}
                        </Button>
                    ) : null}
                />
            </Portal>
        </>
    );
}
