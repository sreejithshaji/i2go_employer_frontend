'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import { Box, Stack, Typography } from '@mui/material';
import { LanguageSwitcher, useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';
import { COMPANY } from '@/lib/portal/legal';
import Eyebrow from '@/app/[lang]/(marketing)/client/components/eyebrow';
import HeroBackground from '@/app/[lang]/(marketing)/client/home/hero-background';

function LogoMark({ size = 44 }) {
    return (
        <Box sx={{ width: size, height: size, borderRadius: `${Math.round(size * 0.3)}px`, bgcolor: '#fff', border: `1px solid ${b.line}`, display: 'grid', placeItems: 'center', boxShadow: b.shadow1, flexShrink: 0 }}>
            <Image src="/images/i2go_mark.png" alt="" width={Math.round(size * 0.86)} height={Math.round(size * 0.5)} style={{ objectFit: 'contain' }} />
        </Box>
    );
}

/**
 * Split screen (14.6): the homepage hero's navy panel with its animated
 * background on the left (from 900px), the form on the right. The benefits are
 * a numbered hairline list, like the employer steps.
 */
export default function AuthCard({ title, subtitle, children }) {
    const { t, p } = useI18n();
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: b.surface }}>
            <Box
                sx={{
                    '--focus-color': b.cyan,
                    display: { xs: 'none', md: 'flex' }, flexDirection: 'column', width: '45%', maxWidth: 640,
                    color: b.onDark.text, p: { md: 5, lg: 7 }, position: 'relative', overflow: 'hidden', isolation: 'isolate',
                }}
            >
                <Box sx={{ position: 'absolute', inset: 0, zIndex: -1 }}><HeroBackground /></Box>

                <Box
                    component={NextLink}
                    href={p.home}
                    sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: b.onDark.text, borderRadius: '12px', '&:focus-visible': b.focusRingDark }}
                >
                    <LogoMark />
                    <Box>
                        <Typography sx={{ color: b.onDark.text, fontSize: 20, fontWeight: 800, letterSpacing: '-0.4px', lineHeight: '24px' }}>I2Go</Typography>
                        <Typography sx={{ color: b.onDark.bodyStrong, fontSize: 12, fontWeight: 600 }}>{t.common.brandTag}</Typography>
                    </Box>
                </Box>

                <Box sx={{ my: 'auto', py: 6, maxWidth: 460 }}>
                    <Typography component="h2" sx={{ color: b.onDark.text, fontWeight: 800, fontSize: { md: 32, lg: 40 }, lineHeight: { md: '38px', lg: '46px' }, letterSpacing: { md: '-1px', lg: '-1.4px' } }}>
                        {t.auth.panelTitle}
                    </Typography>
                    <Box component="ol" sx={{ listStyle: 'none', m: 0, mt: 5, p: 0 }}>
                        {t.auth.benefits.map((item, i) => (
                            <Box component="li" key={item.title} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: 2, borderTop: `1px solid ${b.onDark.border}` }}>
                                <Box
                                    aria-hidden
                                    sx={{
                                        width: 30, height: 30, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center',
                                        border: `1px solid ${b.onDark.ring}`, bgcolor: 'rgba(31,200,255,0.06)',
                                        color: b.cyan, fontSize: 11.5, fontWeight: 800, letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </Box>
                                <Box sx={{ pt: '3px' }}>
                                    <Typography sx={{ color: b.onDark.text, fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{item.title}</Typography>
                                    <Typography sx={{ mt: 0.25, color: b.onDark.bodyStrong, fontSize: 13.5, lineHeight: 1.55 }}>{item.text}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Typography sx={{ color: b.onDark.bodyStrong, fontSize: 12, fontWeight: 600 }}>
                    © {new Date().getFullYear()} {COMPANY.name}
                </Typography>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: { xs: 5, md: 8 }, bgcolor: { xs: b.bg1, sm: b.surface } }}>
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    {/* Logo on phones (the brand panel is hidden there) and the language link */}
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: { xs: 'space-between', md: 'flex-end' }, mb: { xs: 4, md: 2 } }}>
                        <Box component={NextLink} href={p.home} sx={{ display: { xs: 'inline-flex', md: 'none' }, alignItems: 'center', gap: 1.25, textDecoration: 'none', color: b.ink, borderRadius: '12px', '&:focus-visible': b.focusRing }}>
                            <LogoMark size={40} />
                            <Typography sx={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.4px' }}>I2Go</Typography>
                        </Box>
                        <LanguageSwitcher sx={{ color: b.muted, fontSize: 14, fontWeight: 600, '&:hover': { color: b.accentText } }} />
                    </Stack>
                    <Eyebrow sx={{ mb: 1 }}>{t.common.brandTag}</Eyebrow>
                    <Typography component="h1" sx={{ fontSize: { xs: 28, md: 32 }, lineHeight: 1.2, fontWeight: 800, letterSpacing: { xs: '-0.6px', md: '-1px' }, color: b.ink }}>{title}</Typography>
                    <Typography sx={{ mt: 1, mb: 4, fontSize: 15.5, lineHeight: 1.6, color: b.muted }}>{subtitle}</Typography>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
