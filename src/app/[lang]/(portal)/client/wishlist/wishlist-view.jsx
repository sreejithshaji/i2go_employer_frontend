'use client';

import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Alert, Button, Typography } from '@mui/material';
import { FiHeart, FiUsers } from 'react-icons/fi';
import { useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { plural } from '@/lib/i18n/config';
import CandidateCard from '@/app/[lang]/(portal)/client/components/candidate-card';
import CandidateGrid, { GridSkeleton } from '@/app/[lang]/(portal)/client/components/candidate-grid';
import EmptyState from '@/components/empty-state';
import PageIntro from '@/components/page-intro';
import { getWishlistCandidates } from '../../(pages)/wishlist/actions';

/** The signed-in employer's wishlist; ids from the auth session, details from a server action. */
export default function WishlistView() {
    const { savedIds } = useAuth();
    const { t, p } = useI18n();
    const [candidates, setCandidates] = useState(null);
    const [error, setError] = useState(null);

    // Refetches when the wishlist changes; the current cards stay on screen meanwhile.
    const idsKey = [...savedIds].sort().join(',');
    useEffect(() => {
        let cancelled = false;
        getWishlistCandidates(idsKey ? idsKey.split(',') : []).then((result) => {
            if (cancelled) return;
            setError(result.success ? null : result.error);
            if (result.success) setCandidates(result.candidates);
        });
        return () => {
            cancelled = true;
        };
    }, [idsKey]);

    // Newest added first, and only those still in the wishlist.
    const ordered = (candidates || [])
        .filter((c) => savedIds.includes(c.id))
        .sort((a, b) => savedIds.indexOf(a.id) - savedIds.indexOf(b.id));
    const unavailable = candidates ? savedIds.filter((id) => !candidates.some((c) => c.id === id)).length : 0;

    return (
        <>
            <PageIntro
                actions={ordered.length > 0 && (
                    <Button component={NextLink} href={p.hub} variant="soft" startIcon={<FiUsers />}>{t.wishlist.browseMore}</Button>
                )}
            >
                {t.wishlist.intro}
            </PageIntro>

            {error ? (
                <Alert severity="error">{error === 'readLimit' ? t.list.readLimit : t.wishlist.loadError}</Alert>
            ) : candidates === null ? (
                <CandidateGrid><GridSkeleton count={3} /></CandidateGrid>
            ) : ordered.length === 0 ? (
                <EmptyState
                    icon={<FiHeart size={28} />}
                    title={t.wishlist.emptyTitle}
                    message={t.wishlist.emptyText}
                    action={<Button component={NextLink} href={p.hub} variant="contained">{t.common.browseCandidates}</Button>}
                />
            ) : (
                <CandidateGrid>
                    {ordered.map((c) => <CandidateCard key={c.id} candidate={c} />)}
                </CandidateGrid>
            )}

            {unavailable > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                    {plural(t.wishlist.unavailable, unavailable)}
                </Typography>
            )}
        </>
    );
}
