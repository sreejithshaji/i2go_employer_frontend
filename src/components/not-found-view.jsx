'use client';

import NextLink from 'next/link';
import { Button } from '@mui/material';
import { useI18n } from '@/features/i18n';
import EmptyState from './empty-state';

export default function NotFound() {
    const { t, p } = useI18n();
    return (
        <EmptyState
            title={t.notFound.title}
            message={t.notFound.text}
            action={<Button component={NextLink} href={p.hub} variant="contained">{t.common.browseCandidates}</Button>}
        />
    );
}
