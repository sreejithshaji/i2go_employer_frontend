'use client';

import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { SignInButton, useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';
import CtaButton from '../components/cta-button';
import DriftGlow from '../components/drift-glow';
import Eyebrow from '../components/eyebrow';
import Reveal from '../components/reveal';

/**
 * Who sees which employer call to action (plan §4.4): guests register or sign
 * in, signed-in employers go to the hub and their wishlist, and a candidate
 * account gets neither (it sees the candidate-account note instead).
 */
export function useEmployerCta() {
    const { isEmployer, isOtherAccount } = useAuth();
    const { t, p } = useI18n();
    const c = t.landing.employer.cta;
    if (isOtherAccount) return { kind: 'candidate' };
    if (isEmployer) return { kind: 'employer', primary: { href: p.hub, label: c.signedInPrimary }, secondary: { href: p.wishlist, label: c.signedInSecondary } };
    return { kind: 'guest', primary: { href: p.signup, label: c.primary } };
}

const secondaryLinkBase = {
    display: 'inline-flex', alignItems: 'center', minHeight: 44, px: 0.5, minWidth: 0,
    fontSize: 15, fontWeight: 800, textDecoration: 'none', borderRadius: '6px',
    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
};

/** Colours of the panel: 'dark' (navy, portal pages) or 'light' (white with a blue wash, homepage). */
const TONES = {
    dark: {
        panel: { background: b.darkPanelBase, border: `1px solid ${b.darkPanelBorder}`, boxShadow: b.shadowDarkPanel },
        glow: 'rgba(31,200,255,0.12)', title: b.onDark.text, body: b.onDark.body, border: b.onDark.border,
        link: { ...secondaryLinkBase, color: b.cyan, '&:focus-visible': b.focusRingDark },
    },
    light: {
        panel: { background: `linear-gradient(135deg, ${b.surface} 0%, ${b.accentSoft} 100%)`, border: `1px solid ${b.accentLine}`, boxShadow: b.shadow2 },
        glow: 'rgba(15,143,199,0.10)', title: b.ink, body: b.muted, border: b.line,
        link: { ...secondaryLinkBase, color: b.accentText, '&:focus-visible': b.focusRing },
    },
};

/**
 * The employer story's closing panel: a `.dhero` panel with a soft glow,
 * the chapter-scale heading and the auth-aware actions. `tone`: 'dark'
 * (default, the portal pages) or 'light' (the homepage story). `headingLevel` is h3
 * inside the homepage story, h2 where it stands alone (portal pages, 14.11);
 * `sx` adjusts the outer spacing.
 */
export default function EmployerCta({ headingLevel = 'h3', tone = 'dark', sx }) {
    const k = TONES[tone] ?? TONES.dark;
    const secondaryLinkSx = k.link;
    const { t } = useI18n();
    const c = t.landing.employer.cta;
    const cta = useEmployerCta();

    return (
        <Reveal
            aria-labelledby="employer-cta-title"
            component="section"
            sx={{
                position: 'relative', overflow: 'hidden', isolation: 'isolate', mt: { xs: 6, md: 9 },
                p: { xs: 3, md: 7 }, borderRadius: `${b.radiusPanel}px`,
                ...k.panel,
                ...sx,
            }}
        >
            <DriftGlow color={k.glow} sx={{ zIndex: -1, top: -200, right: { xs: -260, md: -120 }, width: { xs: 560, md: 760 }, height: 460 }} />
            <Eyebrow tone={tone}>{c.eyebrow}</Eyebrow>
            <Typography
                id="employer-cta-title"
                component={headingLevel}
                sx={{
                    m: 0, mt: 1.5, maxWidth: 720,
                    fontSize: { xs: 32, md: 48 }, lineHeight: 1.08, fontWeight: 800,
                    letterSpacing: { xs: '-0.8px', md: '-1.8px' }, color: k.title,
                }}
            >
                {c.title}
            </Typography>
            <Typography component="p" sx={{ m: 0, mt: 2, maxWidth: 560, fontSize: 16.5, lineHeight: 1.65, fontWeight: 500, color: k.body }}>
                {c.text}
            </Typography>

            {cta.kind === 'candidate' ? (
                <Typography component="p" sx={{ m: 0, mt: 3.5, maxWidth: 560, pt: 2.5, borderTop: `1px solid ${k.border}`, fontSize: 14, lineHeight: 1.6, fontWeight: 600, color: k.body }}>
                    {t.shell.candidateAccount}
                </Typography>
            ) : (
                <Box
                    sx={{
                        mt: { xs: 3.5, md: 4.5 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'stretch', md: 'center' }, gap: { xs: 1.5, md: 3 },
                    }}
                >
                    <CtaButton href={cta.primary.href} sx={{ justifyContent: { xs: 'space-between', md: 'center' } }}>
                        {cta.primary.label}
                    </CtaButton>
                    {cta.kind === 'guest' ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 0.75, fontSize: 15, fontWeight: 600, color: k.body }}>
                            <span>{c.secondaryPrefix}</span>
                            <SignInButton variant="text" disableRipple sx={secondaryLinkSx}>{c.secondary}</SignInButton>
                        </Box>
                    ) : (
                        <Box component={NextLink} href={cta.secondary.href} sx={{ ...secondaryLinkSx, alignSelf: { xs: 'flex-start', md: 'center' } }}>
                            {cta.secondary.label}
                        </Box>
                    )}
                </Box>
            )}
        </Reveal>
    );
}
