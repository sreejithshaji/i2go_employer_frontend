'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Alert, Box, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material';
import { requestPasswordReset } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { format } from '@/lib/i18n/config';
import AuthCard from '../components/auth-card';

/**
 * Asks Supabase to email a reset link (PLAN.md 12.2). The link opens the reset
 * page in this language. The confirmation is the same whether or not an account
 * exists, so the form can't be used to find out who has one.
 */
export default function ForgotPasswordView() {
    const { t, p } = useI18n();

    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sentTo, setSentTo] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const address = email.trim();
        setLoading(true);
        setError(null);
        let failed = null;
        try {
            ({ error: failed } = await requestPasswordReset(address, `${window.location.origin}${p.resetPassword}`));
        } catch (thrown) {
            failed = thrown;
        }
        setLoading(false);
        if (failed) {
            setError(failed.status === 429 || failed.code === 'over_email_send_rate_limit' ? t.auth.resetRateLimited : t.auth.resetSendError);
            return;
        }
        setSentTo(address);
    };

    const backLink = (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            <Link component={NextLink} href={p.login}>{t.auth.backToLogin}</Link>
        </Typography>
    );

    if (sentTo) {
        return (
            <AuthCard title={t.auth.resetSentTitle} subtitle={format(t.auth.resetSentText, { email: sentTo })}>
                {backLink}
            </AuthCard>
        );
    }

    return (
        <AuthCard title={t.auth.forgotTitle} subtitle={t.auth.forgotSubtitle}>
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField label={t.auth.email} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" size="medium" autoFocus />
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}>
                        {loading ? t.auth.sendingLink : t.auth.sendLink}
                    </Button>
                </Stack>
            </Box>
            {backLink}
        </AuthCard>
    );
}
