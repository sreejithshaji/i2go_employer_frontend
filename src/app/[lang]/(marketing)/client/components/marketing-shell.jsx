'use client';

import NextLink from 'next/link';
import { Alert, Box, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { brand as b, marketingTheme } from '@/app/theme';
import Container from './container';
import MarketingFooter from './marketing-footer';
import MarketingNav, { useNavOverlay } from './marketing-nav';

/** The same account notices as AppShell, so employers with outdated terms are still asked to accept them here. */
function Notices() {
    const { profile, needsTerms, isOtherAccount } = useAuth();
    const { t, p } = useI18n();
    if (!needsTerms && !isOtherAccount) return null;
    return (
        <Container sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {needsTerms && (
                <Alert
                    severity="warning"
                    action={<Button component={NextLink} href={p.terms} color="inherit" size="small">{t.shell.reviewTerms}</Button>}
                >
                    {profile?.terms_version ? t.shell.termsChanged : t.shell.termsNeeded}
                </Alert>
            )}
            {isOtherAccount && <Alert severity="info">{t.shell.candidateAccount}</Alert>}
        </Container>
    );
}

const skipLinkSx = {
    position: 'absolute', left: 16, top: -100, zIndex: 30, px: 2, py: 1.25, borderRadius: `${b.radiusSm}px`,
    bgcolor: b.graphite, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none',
    '&:focus': { top: 12, outline: `2px solid ${b.cyan}`, outlineOffset: 3 },
};

/**
 * Frame of the marketing pages (the homepage): top navigation, account
 * notices, content and footer, in the marketing font and palette. No sidebar
 * (homepage-redesign-plan.md, D1). `fontClass` defines --font-jakarta.
 */
export default function MarketingShell({ fontClass, children }) {
    const { t } = useI18n();
    const overlay = useNavOverlay();
    return (
        <ThemeProvider theme={marketingTheme}>
            <Box
                className={fontClass}
                sx={{
                    position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
                    bgcolor: b.bg1, color: b.ink, fontFamily: b.fontFamily, WebkitFontSmoothing: 'antialiased',
                    // How far the nav overlaps the page (homepage hero, plan 9A.6); the hero adds it to its top padding.
                    '--nav-overlap': overlay ? { xs: `${b.navHeightMobile}px`, md: `${b.navHeight}px` } : '0px',
                }}
            >
                <Box component="a" href="#main" sx={skipLinkSx}>{t.landing.nav.skipToContent}</Box>
                <MarketingNav fontClass={fontClass} overlay={overlay} />
                <Notices />
                <Box component="main" id="main" tabIndex={-1} sx={{ flex: 1, outline: 'none' }}>
                    {children}
                </Box>
                <MarketingFooter />
            </Box>
        </ThemeProvider>
    );
}
