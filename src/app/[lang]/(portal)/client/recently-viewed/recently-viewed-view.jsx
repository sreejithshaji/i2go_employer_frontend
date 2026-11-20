'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import NextLink from 'next/link';
import CtaButton from '@/app/[lang]/(marketing)/client/components/cta-button';
import { Alert, Button, Snackbar, Stack, Typography } from '@mui/material';
import { FiClock, FiTrash2, FiUsers } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { plural } from '@/lib/i18n/config';
import CandidateCard from '@/app/[lang]/(portal)/client/components/candidate-card';
import CandidateGrid, { GridSkeleton } from '@/app/[lang]/(portal)/client/components/candidate-grid';
import EmptyState from '@/components/empty-state';
import PageIntro from '@/components/page-intro';
import { clearRecent, getRecentIds, subscribeRecent } from '../candidate-profile/recently-viewed-storage';
import { getRecentlyViewedCandidates } from '../../(pages)/recently-viewed/actions';

// The ids as one string, so the snapshot is stable between reads.
const readIdsKey = () => getRecentIds().join(',');
const serverIdsKey = () => null; // unknown on the server: show the skeleton

/** Candidates opened in this browser (6.20); ids from localStorage, details from a server action. */
export default function RecentlyViewedView() {
    const { t, p } = useI18n();
    const idsKey = useSyncExternalStore(subscribeRecent, readIdsKey, serverIdsKey);
    const [result, setResult] = useState(null); // { key, candidates } | { key, error }
    const [toast, setToast] = useState(false);

    // Refetches when the list changes; the current cards stay on screen meanwhile.
    useEffect(() => {
        if (!idsKey) return;
        let cancelled = false;
        getRecentlyViewedCandidates(idsKey.split(',')).then((r) => {
            if (!cancelled) setResult(r.success ? { candidates: r.candidates } : { error: r.error });
        });
        return () => {
            cancelled = true;
        };
    }, [idsKey]);

    const ids = idsKey ? idsKey.split(',') : [];
    const candidates = idsKey === '' ? [] : result?.candidates ?? null;
    // Most recently viewed first, and only those still in the list.
    const ordered = (candidates || [])
        .filter((c) => ids.includes(c.id))
        .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    const unavailable = candidates ? ids.filter((id) => !candidates.some((c) => c.id === id)).length : 0;
    const error = idsKey ? result?.error : null;

    const handleClear = () => {
        clearRecent();
        setToast(true);
    };

    return (
        <>
            <PageIntro
                actions={ids.length > 0 && (
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        <Button component={NextLink} href={p.hub} variant="soft" startIcon={<FiUsers />}>{t.wishlist.browseMore}</Button>
                        <Button onClick={handleClear} variant="outlined" color="inherit" startIcon={<FiTrash2 />}>{t.recentlyViewed.clear}</Button>
                    </Stack>
                )}
            >
                {t.recentlyViewed.intro}
            </PageIntro>

            {error ? (
                <Alert severity="error">{error === 'readLimit' ? t.list.readLimit : t.recentlyViewed.loadError}</Alert>
            ) : candidates === null ? (
                <CandidateGrid><GridSkeleton count={3} /></CandidateGrid>
            ) : ordered.length === 0 ? (
                <EmptyState
                    icon={<FiClock size={28} />}
                    title={t.recentlyViewed.emptyTitle}
                    message={t.recentlyViewed.emptyText}
                    action={<CtaButton href={p.hub}>{t.common.browseCandidates}</CtaButton>}
                />
            ) : (
                <CandidateGrid>
                    {ordered.map((c) => <CandidateCard key={c.id} candidate={c} />)}
                </CandidateGrid>
            )}

            {unavailable > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                    {plural(t.recentlyViewed.unavailable, unavailable)}
                </Typography>
            )}

            <Snackbar open={toast} autoHideDuration={3000} onClose={() => setToast(false)} message={t.recentlyViewed.cleared} />
        </>
    );
}
