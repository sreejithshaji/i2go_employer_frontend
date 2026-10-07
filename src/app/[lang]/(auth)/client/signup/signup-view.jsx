'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Alert, Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, Link, Stack, TextField, Typography,
} from '@mui/material';
import { Redirect, signUp, useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { format } from '@/lib/i18n/config';
import { TERMS_VERSION } from '@/lib/portal/legal';
import AuthCard from '../components/auth-card';

/** Employer signup form. `next` is the safe return path; `keepNext` keeps it on the link to sign in. */
export default function SignupView({ next, keepNext }) {
    const { user, ready } = useAuth();
    const router = useRouter();
    const { t, p } = useI18n();

    const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '', terms: false });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);

    if (ready && user && !loading) return <Redirect to={next} />;

    const set = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = {};
        if (!form.fullName.trim()) nextErrors.fullName = t.auth.errName;
        if (form.password.length < 12) nextErrors.password = t.auth.errPassword;
        if (form.confirm !== form.password) nextErrors.confirm = t.auth.errConfirm;
        if (!form.terms) nextErrors.terms = t.auth.errTerms;
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setLoading(true);
        setError(null);
        const { data, error: signUpError } = await signUp({
            email: form.email.trim(),
            password: form.password,
            fullName: form.fullName.trim(),
            termsVersion: TERMS_VERSION,
            redirectTo: `${window.location.origin}${next}`,
        });
        setLoading(false);
        if (signUpError) {
            setError(signUpError.message);
            return;
        }
        if (data.session) router.replace(next);
        else setCheckEmail(true); // email confirmation is on
    };

    if (checkEmail) {
        return (
            <AuthCard title={t.auth.checkEmailTitle} subtitle={format(t.auth.checkEmailText, { email: form.email.trim() })}>
                <Button component={NextLink} href={p.hub} variant="outlined">{t.common.browseCandidates}</Button>
            </AuthCard>
        );
    }

    return (
        <AuthCard title={t.auth.signupTitle} subtitle={t.auth.signupSubtitle}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                    <TextField label={t.auth.yourName} required value={form.fullName} onChange={set('fullName')} error={!!errors.fullName} helperText={errors.fullName} autoComplete="name" size="medium" />
                    <TextField label={t.auth.workEmail} type="email" required value={form.email} onChange={set('email')} autoComplete="email" size="medium" />
                    <TextField label={t.auth.password} type="password" required value={form.password} onChange={set('password')} error={!!errors.password} helperText={errors.password || t.auth.passwordHelp} autoComplete="new-password" size="medium" />
                    <TextField label={t.auth.confirmPassword} type="password" required value={form.confirm} onChange={set('confirm')} error={!!errors.confirm} helperText={errors.confirm} autoComplete="new-password" size="medium" />
                    <FormControl error={!!errors.terms}>
                        <FormControlLabel
                            control={<Checkbox checked={form.terms} onChange={(e) => setForm((f) => ({ ...f, terms: e.target.checked }))} />}
                            label={
                                <Typography variant="body2">
                                    {t.auth.acceptPrefix}{' '}
                                    <Link component={NextLink} href={p.terms} target="_blank">{t.auth.acceptTerms}</Link>
                                    {' '}{t.auth.acceptMiddle}{' '}
                                    <Link component={NextLink} href={`${p.privacy}#employers`} target="_blank">{t.auth.acceptPrivacy}</Link>
                                    {t.auth.acceptSuffix ? ` ${t.auth.acceptSuffix}` : ''}.
                                </Typography>
                            }
                            sx={{ alignItems: 'flex-start', '& .MuiCheckbox-root': { mt: -0.75 } }}
                        />
                        {errors.terms && <FormHelperText>{errors.terms}</FormHelperText>}
                    </FormControl>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}>
                        {loading ? t.auth.creating : t.auth.create}
                    </Button>
                </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                {t.auth.haveAccount} <Link component={NextLink} href={`${p.login}${keepNext ? `?next=${encodeURIComponent(next)}` : ''}`}>{t.common.signIn}</Link>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, textAlign: 'center' }}>
                {t.auth.candidatesHint}
            </Typography>
        </AuthCard>
    );
}
