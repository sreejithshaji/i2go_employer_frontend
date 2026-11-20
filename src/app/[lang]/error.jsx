'use client';

import { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';
import EmptyState from '@/components/empty-state';
import { useI18n } from '@/features/i18n';

// Unexpected errors on any page (inside the language layout, so the
// dictionary is there). Errors in that layout itself go to app/global-error.jsx.
export default function ErrorPage({ error, retry }) {
    const { t } = useI18n();
    useEffect(() => {
        console.error(error);
    }, [error]);
    return (
        <Box component="main" sx={{ maxWidth: 640, mx: 'auto', px: 2, py: { xs: 6, md: 10 } }}>
            <EmptyState
                titleAs="h1"
                icon={<FiAlertTriangle />}
                title={t.error.title}
                message={t.error.text}
                action={<Button variant="cta" onClick={() => retry()}>{t.common.retry}</Button>}
            />
        </Box>
    );
}
