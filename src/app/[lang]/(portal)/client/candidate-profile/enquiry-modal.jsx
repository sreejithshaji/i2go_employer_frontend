'use client';

import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import {
    Alert, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel,
    FormHelperText, Link, Stack, TextField, Typography, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FiCheckCircle, FiSend } from 'react-icons/fi';
import { useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { format } from '@/lib/i18n/config';
import { getFormToken, submitEnquiry } from './submit-enquiry';
import { markEnquired } from './enquiry-storage';
import { TURNSTILE_SITE_KEY } from '@/lib/config';
import { TERMS_VERSION } from '@/lib/portal/legal';
import { brand as b } from '@/app/theme';
import Turnstile from './turnstile';

// Matches the limits in the submit-enquiry edge function.
const LIMITS = {
    employer_name: 120,
    company_name: 160,
    email: 254,
    phone: 32,
    job_title: 120,
    location: 120,
    message: 4000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function initialForm(profile, user) {
    // Signed-in employers start with their name and email. Nothing is kept
    // from earlier enquiries (no contact details in browser storage, 10.11).
    return {
        employer_name: profile?.full_name || '',
        company_name: '',
        email: user?.email || '',
        phone: '',
        job_title: '',
        location: '',
        message: '',
    };
}

function validate(form, t, { guest, acceptTerms }) {
    const errors = {};
    if (guest && !acceptTerms) errors.terms = t.enquiry.errTerms;
    if (!form.employer_name.trim()) errors.employer_name = t.enquiry.errName;
    if (!form.email.trim()) errors.email = t.enquiry.errEmail;
    else if (!EMAIL_RE.test(form.email.trim())) errors.email = t.enquiry.errEmailInvalid;
    if (!form.message.trim()) errors.message = t.enquiry.errMessage;
    for (const [field, max] of Object.entries(LIMITS)) {
        if (form[field].trim().length > max) errors[field] = format(t.enquiry.errTooLong, { max });
    }
    return errors;
}

/**
 * One numbered group of fields: a 26px graphite circle with a cyan numeral
 * (as in the homepage's "What happens next"), then the group title. A fieldset,
 * so screen readers announce the title with each field; the number is visual only.
 */
function FieldGroup({ number, title, children }) {
    return (
        <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
            <Box component="legend" sx={{ p: 0, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                    component="span"
                    aria-hidden
                    sx={{
                        width: 26, height: 26, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center',
                        bgcolor: b.graphite, color: b.cyan, fontSize: 11.5, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {String(number).padStart(2, '0')}
                </Box>
                <Box component="span" sx={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.2px', color: b.ink }}>{title}</Box>
            </Box>
            <Stack spacing={2}>{children}</Stack>
        </Box>
    );
}

/**
 * The "Send enquiry" form, for guests and for signed-in employers who accepted
 * the terms (the profile page only opens it for them; submit-enquiry checks
 * again). A guest must tick the employer terms (guest-enquiry-plan.md, G1);
 * the function stores the version with the enquiry. The I2Go team reviews
 * each enquiry before anything reaches the candidate.
 */
export default function EnquiryDialog({ open, onClose, candidate, onSent }) {
    const { profile, user } = useAuth();
    const { t, p } = useI18n();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [form, setForm] = useState(() => initialForm(profile, user));
    const [errors, setErrors] = useState({});
    const [token, setToken] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null); // { message, severity }
    const [sent, setSent] = useState(false);
    // Guest: no session. Decided when the form opens (see below), so signing in
    // in another tab doesn't switch the form halfway through.
    const [guest, setGuest] = useState(!user);
    const [acceptTerms, setAcceptTerms] = useState(false);
    // Signed "form opened at" token (fetched on open) and the honeypot input.
    const formToken = useRef(null);
    const honeypot = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        let cancelled = false;
        formToken.current = null;
        getFormToken().then((t) => {
            if (!cancelled) formToken.current = t;
        });
        return () => {
            cancelled = true;
        };
    }, [open]);

    // Fresh form each time it opens (prefilled from the account or last enquiry).
    // Done while rendering when `open` turns true, not in an effect. Only on open:
    // a token refresh changes `user` and mustn't wipe what's typed.
    const [wasOpen, setWasOpen] = useState(open);
    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) {
            setForm(initialForm(profile, user));
            setErrors({});
            setSubmitError(null);
            setSent(false);
            setToken(null);
            setGuest(!user);
            setAcceptTerms(false);
        }
    }

    const set = (field) => (event) => {
        setForm((f) => ({ ...f, [field]: event.target.value }));
        if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate(form, t, { guest, acceptTerms });
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        if (TURNSTILE_SITE_KEY && !token) {
            setSubmitError({ message: t.enquiry.completeCheck, severity: 'error' });
            return;
        }

        setSubmitting(true);
        setSubmitError(null);
        try {
            const trimmed = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
            // Opened while offline: fetch the token now (the server may then ask to send again).
            if (!formToken.current) formToken.current = await getFormToken();
            await submitEnquiry(t, {
                ...trimmed,
                candidate_id: candidate.id,
                form_token: formToken.current,
                website: honeypot.current?.value ?? '',
                ...(guest ? { accept_terms: true, terms_version: TERMS_VERSION } : {}),
                ...(token ? { turnstile_token: token } : {}),
            });
            markEnquired(candidate.id);
            setSent(true);
            onSent?.();
        } catch (error) {
            const duplicate = error.status === 409;
            if (duplicate) {
                // Already sent recently: nothing more to do.
                markEnquired(candidate.id);
                onSent?.();
            }
            setSubmitError({ message: error.message, severity: duplicate ? 'info' : 'error' });
            setToken(null); // Turnstile tokens are single-use
            // Form token expired: get a new one so "Send" works again.
            if (error.status === 400 && /expired/i.test(error.message)) formToken.current = await getFormToken();
        } finally {
            setSubmitting(false);
        }
    };

    const firstName = candidate?.name?.split(' ')[0] || t.enquiry.thisCandidate;

    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
            {sent ? (
                <>
                    <DialogContent sx={{ textAlign: 'center', py: 6 }}>
                        <Box sx={{ width: 72, height: 72, mx: 'auto', mb: 2, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: b.okSoft, color: b.ok }}>
                            <FiCheckCircle size={36} aria-hidden />
                        </Box>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-0.4px' }}>{t.enquiry.sentTitle}</Typography>
                        <Typography color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                            {format(t.enquiry.sentText, { name: firstName, email: form.email.trim() })}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
                        <Button variant="cta" onClick={onClose} sx={{ minWidth: 140 }}>{t.enquiry.done}</Button>
                    </DialogActions>
                </>
            ) : (
                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <DialogTitle sx={{ pb: 0.5 }}>{format(t.enquiry.title, { name: candidate?.name })}</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                            {guest && <>{t.enquiry.guestNote}{' '}</>}
                            {t.enquiry.intro}{' '}
                            {t.enquiry.privacyPrefix} <Link component={NextLink} href={`${p.privacy}#enquiries`} target="_blank">{t.enquiry.privacyLink}</Link>.
                        </Typography>
                        <Stack spacing={3}>
                            <FieldGroup number={1} title={t.enquiry.groupYou}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField label={t.enquiry.name} required value={form.employer_name} onChange={set('employer_name')} error={!!errors.employer_name} helperText={errors.employer_name} autoComplete="name" />
                                    <TextField label={t.enquiry.company} value={form.company_name} onChange={set('company_name')} error={!!errors.company_name} helperText={errors.company_name} autoComplete="organization" />
                                </Stack>
                            </FieldGroup>
                            <FieldGroup number={2} title={t.enquiry.groupContact}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField label={t.enquiry.email} type="email" required value={form.email} onChange={set('email')} error={!!errors.email} helperText={errors.email} autoComplete="email" />
                                    <TextField label={t.enquiry.phone} type="tel" value={form.phone} onChange={set('phone')} error={!!errors.phone} helperText={errors.phone} autoComplete="tel" />
                                </Stack>
                            </FieldGroup>
                            <FieldGroup number={3} title={t.enquiry.groupRole}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField label={t.enquiry.jobTitle} value={form.job_title} onChange={set('job_title')} error={!!errors.job_title} helperText={errors.job_title} />
                                    <TextField label={t.enquiry.location} value={form.location} onChange={set('location')} error={!!errors.location} helperText={errors.location} placeholder={t.enquiry.locationPlaceholder} />
                                </Stack>
                                <TextField
                                    label={t.enquiry.message}
                                    required
                                    multiline
                                    minRows={4}
                                    value={form.message}
                                    onChange={set('message')}
                                    error={!!errors.message}
                                    helperText={errors.message || t.enquiry.messageHelp}
                                />
                            </FieldGroup>
                            {/* Honeypot: hidden from people and screen readers; bots that fill every field give themselves away */}
                            <Box aria-hidden sx={{ position: 'absolute', left: -10000, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                                <label htmlFor="enquiry-website">Website</label>
                                <input ref={honeypot} id="enquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                            </Box>
                            {guest && (
                                <Box>
                                    <FormControlLabel
                                        sx={{ alignItems: 'flex-start', mr: 0 }}
                                        control={(
                                            <Checkbox
                                                checked={acceptTerms}
                                                onChange={(event) => {
                                                    setAcceptTerms(event.target.checked);
                                                    if (errors.terms) setErrors((e) => ({ ...e, terms: undefined }));
                                                }}
                                                required
                                                sx={{ mt: -0.75 }}
                                                slotProps={{ input: { 'aria-describedby': errors.terms ? 'enquiry-terms-error' : undefined, 'aria-invalid': !!errors.terms } }}
                                            />
                                        )}
                                        label={(
                                            <Typography variant="body2" component="span">
                                                {t.enquiry.termsPrefix}{' '}
                                                <Link component={NextLink} href={p.terms} target="_blank" onClick={(event) => event.stopPropagation()}>{t.enquiry.termsLink}</Link>.
                                            </Typography>
                                        )}
                                    />
                                    {errors.terms && <FormHelperText id="enquiry-terms-error" error sx={{ ml: 4 }}>{errors.terms}</FormHelperText>}
                                </Box>
                            )}
                            <Turnstile onToken={setToken} />
                            {submitError && <Alert severity={submitError.severity}>{submitError.message}</Alert>}
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} disabled={submitting} variant="ghost">{t.enquiry.cancel}</Button>
                        <Button
                            type="submit"
                            variant="cta"
                            disabled={submitting}
                            endIcon={submitting ? <CircularProgress size={14} color="inherit" /> : <FiSend aria-hidden />}
                        >
                            {submitting ? t.enquiry.sending : t.enquiry.send}
                        </Button>
                    </DialogActions>
                </Box>
            )}
        </Dialog>
    );
}
