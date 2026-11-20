'use client';

import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { LanguageSwitcher, useI18n } from '@/features/i18n';
import { COMPANY, legalLinks } from '@/lib/portal/legal';
import { brand as b } from '@/app/theme';
import BrandLogo from './brand-logo';
import Container from './container';

const headingSx = { fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: b.accentText, mb: 1.5 };
const linkSx = {
    color: b.ink2, fontSize: 14, fontWeight: 600, textDecoration: 'none', width: 'fit-content', borderRadius: '4px',
    '&:hover': { color: b.ink, textDecoration: 'underline' },
    '&:focus-visible': b.focusRing,
};

/** Company, contact and legal links (Impressum one click from every page), then the copyright row. */
export default function MarketingFooter() {
    const { lang, t, p } = useI18n();
    const tel = COMPANY.phone.replace(/[^\d+]/g, '');

    return (
        <Box component="footer" sx={{ bgcolor: b.bg1, borderTop: `1px solid ${b.line}`, pt: { xs: 5, md: 7 }, pb: 'calc(24px + env(safe-area-inset-bottom))' }}>
            <Container>
                <Box sx={{ display: 'grid', gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr 1fr' } }}>
                    <Box>
                        <BrandLogo href={p.home} />
                        <Typography sx={{ mt: 2, maxWidth: 340, fontSize: 14, lineHeight: 1.6, color: b.muted }}>{t.landing.footer.tagline}</Typography>
                        <Box component="address" sx={{ mt: 2, fontStyle: 'normal', fontSize: 13, lineHeight: 1.6, color: b.muted }}>
                            <Box sx={{ fontWeight: 700, color: b.ink2 }}>{COMPANY.name}</Box>
                            {COMPANY.addressLines[lang].map((line) => <Box key={line}>{line}</Box>)}
                        </Box>
                    </Box>

                    <Box>
                        <Typography component="h2" sx={headingSx}>{t.landing.footer.contact}</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box component="a" href={`mailto:${COMPANY.email}`} sx={linkSx}>{COMPANY.email}</Box>
                            <Box component="a" href={`tel:${tel}`} sx={linkSx}>{COMPANY.phone}</Box>
                            <Box component="a" href={`https://${COMPANY.website}`} target="_blank" rel="noopener" sx={linkSx}>{COMPANY.website}</Box>
                        </Box>
                    </Box>

                    <Box component="nav" aria-label={t.common.legalNav}>
                        <Typography component="h2" sx={headingSx}>{t.landing.footer.legal}</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {legalLinks(lang).map((link) => (
                                <Box key={link.href} component={NextLink} href={link.href} sx={linkSx}>{t.legal[link.key]}</Box>
                            ))}
                            <LanguageSwitcher sx={{ ...linkSx, gap: 0.75 }} />
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        mt: { xs: 4, md: 6 }, pt: 2.5, borderTop: `1px solid ${b.line}`,
                        display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5, fontSize: 12.5, fontWeight: 600, color: b.muted,
                    }}
                >
                    <span>© {new Date().getFullYear()} {COMPANY.name}</span>
                    <span>{t.common.footerCandidates}</span>
                </Box>
            </Container>
        </Box>
    );
}
