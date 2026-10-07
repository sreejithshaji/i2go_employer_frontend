'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Stack, Typography } from '@mui/material';
import { useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { TERMS_DATE, TERMS_VERSION } from '@/lib/portal/legal';
import { tokens } from '@/app/theme';
import LegalDocument from './legal-document';
import { TERMS_INTRO, TermsDe, TermsEn } from './terms-text';

/** Shown to a signed-in employer who hasn't accepted this version yet. */
function AcceptPanel() {
    const { acceptTerms } = useAuth();
    const { t, p } = useI18n();
    const [checked, setChecked] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);

    const accept = async () => {
        setSaving(true);
        setError(null);
        try {
            await acceptTerms();
            setDone(true);
        } catch {
            setError(t.terms.acceptError);
        } finally {
            setSaving(false);
        }
    };

    if (done) {
        return (
            <Alert severity="success" sx={{ mb: 3 }} action={<Button component={NextLink} href={p.hub} color="inherit" size="small">{t.common.browseCandidates}</Button>}>
                {t.terms.accepted}
            </Alert>
        );
    }
    return (
        <Box sx={{ mb: 3, p: { xs: 2, md: 2.5 }, borderRadius: `${tokens.radiusLg}px`, bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primarySoftHover}` }}>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{t.terms.acceptTitle}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{t.terms.acceptText}</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 1.5, alignItems: { sm: 'center' } }}>
                <FormControlLabel
                    control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
                    label={t.terms.acceptLabel}
                    sx={{ flex: 1, mr: 0 }}
                />
                <Button variant="contained" disabled={!checked || saving} onClick={accept} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}>
                    {t.terms.acceptButton}
                </Button>
            </Stack>
            {error && <Alert severity="error" sx={{ mt: 1.5 }}>{error}</Alert>}
        </Box>
    );
}

/** Employer terms of use (PLAN.md 10.7, 10.17); the text is in terms-text.jsx. */
export default function TermsView({ lang }) {
    const { needsTerms } = useAuth();
    const { t } = useI18n();
    // Once shown, the panel stays: accepting turns needsTerms off, and the
    // panel then shows its confirmation instead of disappearing.
    const [showPanel, setShowPanel] = useState(false);
    if (needsTerms && !showPanel) setShowPanel(true);
    const Body = lang === 'en' ? TermsEn : TermsDe;
    return (
        <>
            {showPanel && <Box sx={{ maxWidth: 860, mx: 'auto' }}><AcceptPanel /></Box>}
            <LegalDocument
                lang={lang}
                notice={t.legal.germanPrevails}
                title={TERMS_INTRO[lang] ?? TERMS_INTRO.de}
                asOf={lang === 'en' ? `Version ${TERMS_VERSION} · as of ${TERMS_DATE.en}` : `Fassung ${TERMS_VERSION} · Stand: ${TERMS_DATE.de}`}
            >
                <Body lang={lang} />
            </LegalDocument>
        </>
    );
}
