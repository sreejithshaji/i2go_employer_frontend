'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Alert, Box, Button, CircularProgress, Link, Stack, Typography } from '@mui/material';
import { updatePassword } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import AuthCard from '../components/auth-card';
import PasswordField from '@/components/password-field';
import { useRecoverySession } from './use-recovery-session';

/**
 * Where the reset email's link lands (PLAN.md 12.3): a new password form once
 * the link has opened a session, or a way to ask for a new link.
 */
export default function ResetPasswordView() {
    const { t, p } = useI18n();
    const status = useRecoverySession();

    const [form, setForm] = useState({ password: '', confirm: '' });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const set = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = {};
        if (form.password.length < 12) nextErrors.password = t.auth.errPassword;
        if (form.confirm !== form.password) nextErrors.confirm = t.auth.errConfirm;
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setLoading(true);
        setError(null);
        let failed = null;
        try {
            ({ error: failed } = await updatePassword(form.password));
        } catch (thrown) {
            failed = thrown;
        }
        setLoading(false);
        if (failed) {
            setError(failed.code === 'same_password' ? t.auth.samePassword : t.auth.resetSaveError);
            return;
        }
        setDone(true);
    };

    if (status === 'checking') {
        return (
            <AuthCard title={t.auth.resetTitle} subtitle={t.auth.checkingLink}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={28} /></Box>
            </AuthCard>
        );
    }

    if (status === 'invalid') {
        return (
            <AuthCard title={t.auth.resetInvalidTitle} subtitle={t.auth.resetInvalidText}>
                <Stack spacing={2}>
                    <Button component={NextLink} href={p.forgotPassword} variant="contained" size="large">{t.auth.requestNewLink}</Button>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                    <Link component={NextLink} href={p.login}>{t.auth.backToLogin}</Link>
                </Typography>
            </AuthCard>
        );
    }

    if (done) {
        return (
            <AuthCard title={t.auth.resetDoneTitle} subtitle={t.auth.resetDoneText}>
                <Button component={NextLink} href={p.hub} variant="contained" size="large" fullWidth>{t.common.browseCandidates}</Button>
            </AuthCard>
        );
    }

    return (
        <AuthCard title={t.auth.resetTitle} subtitle={t.auth.resetSubtitle}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                    <PasswordField label={t.auth.newPassword} showLabel={t.auth.showPassword} hideLabel={t.auth.hidePassword} required value={form.password} onChange={set('password')} error={!!errors.password} helperText={errors.password || t.auth.passwordHelp} autoComplete="new-password" size="medium" autoFocus />
                    <PasswordField label={t.auth.confirmPassword} showLabel={t.auth.showPassword} hideLabel={t.auth.hidePassword} required value={form.confirm} onChange={set('confirm')} error={!!errors.confirm} helperText={errors.confirm} autoComplete="new-password" size="medium" />
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}>
                        {loading ? t.auth.savingPassword : t.auth.savePassword}
                    </Button>
                </Stack>
            </Box>
        </AuthCard>
    );
}
