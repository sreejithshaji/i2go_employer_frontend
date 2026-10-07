'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material';
import { Redirect, signIn, useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import AuthCard from '../components/auth-card';

/** Sign-in form. `next` is the safe return path; `keepNext` keeps it on the link to signup. */
export default function LoginView({ next, keepNext }) {
    const { user, ready } = useAuth();
    const router = useRouter();
    const { t, p } = useI18n();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    if (ready && user && !loading) return <Redirect to={next} />;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const { error: signInError } = await signIn(email.trim(), password);
        setLoading(false);
        if (signInError) {
            setError(signInError.message === 'Invalid login credentials' ? t.auth.wrongPassword : signInError.message);
            return;
        }
        router.replace(next);
    };

    return (
        <AuthCard title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField label={t.auth.email} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" size="medium" />
                    <TextField label={t.auth.password} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" size="medium" />
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}>
                        {loading ? t.auth.signingIn : t.common.signIn}
                    </Button>
                </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                {t.auth.newHere}{' '}
                <Link component={NextLink} href={`${p.signup}${keepNext ? `?next=${encodeURIComponent(next)}` : ''}`}>{t.auth.createAccountLink}</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                {t.auth.browseWithout}
            </Typography>
        </AuthCard>
    );
}
