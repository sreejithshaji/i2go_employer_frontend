'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import { Box, Stack, Typography } from '@mui/material';
import { FiHeart, FiMessageCircle, FiSearch, FiUserCheck } from 'react-icons/fi';
import { LanguageSwitcher, useI18n } from '@/features/i18n';
import { tokens } from '@/app/theme';

const BENEFIT_ICONS = [<FiSearch key="search" size={20} />, <FiHeart key="heart" size={20} />, <FiMessageCircle key="message" size={20} />, <FiUserCheck key="check" size={20} />];

function LogoMark({ size = 44 }) {
    return (
        <Box sx={{ width: size, height: size, borderRadius: `${tokens.radiusMd}px`, bgcolor: '#fff', display: 'grid', placeItems: 'center', boxShadow: tokens.shadowXs, flexShrink: 0 }}>
            <Image src="/images/i2go_mark.png" alt="" width={Math.round(size * 0.86)} height={Math.round(size * 0.5)} style={{ objectFit: 'contain' }} />
        </Box>
    );
}

/** Split screen: blue brand panel (desktop) and the form. */
export default function AuthCard({ title, subtitle, children }) {
    const { t, p } = useI18n();
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.paper' }}>
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' }, flexDirection: 'column', width: '45%', maxWidth: 640,
                    bgcolor: tokens.sidebarBg, color: '#fff', p: { md: 5, lg: 7 }, position: 'relative', overflow: 'hidden',
                }}
            >
                <Box aria-hidden sx={{ position: 'absolute', right: -140, bottom: -140, width: 460, height: 460, borderRadius: '50%', border: '70px solid rgba(255,255,255,0.06)' }} />
                <Box component={NextLink} href={p.home} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: '#fff' }}>
                    <LogoMark />
                    <Box>
                        <Typography sx={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: '24px' }}>I2Go</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{t.common.brandTag}</Typography>
                    </Box>
                </Box>
                <Box sx={{ my: 'auto', py: 6, position: 'relative', maxWidth: 440 }}>
                    <Typography variant="h2" sx={{ color: '#fff', fontSize: { md: 32, lg: 40 }, lineHeight: { md: '40px', lg: '48px' } }}>
                        {t.auth.panelTitle}
                    </Typography>
                    <Stack spacing={2.5} sx={{ mt: 5 }}>
                        {t.auth.benefits.map((b, i) => (
                            <Stack key={b.title} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                <Box sx={{ width: 40, height: 40, borderRadius: `${tokens.radiusMd}px`, bgcolor: 'rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                    {BENEFIT_ICONS[i]}
                                </Box>
                                <Box>
                                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>{b.title}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>{b.text}</Typography>
                                </Box>
                            </Stack>
                        ))}
                    </Stack>
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', position: 'relative' }}>
                    © {new Date().getFullYear()} I2Go Europe
                </Typography>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: { xs: 5, md: 8 }, bgcolor: { xs: 'background.default', sm: 'background.paper' } }}>
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    {/* Logo on phones (the brand panel is hidden there) and the language link */}
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: { xs: 'space-between', md: 'flex-end' }, mb: { xs: 4, md: 2 } }}>
                        <Box component={NextLink} href={p.home} sx={{ display: { xs: 'inline-flex', md: 'none' }, alignItems: 'center', gap: 1.25, textDecoration: 'none', color: 'text.primary' }}>
                            <LogoMark size={40} />
                            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>I2Go</Typography>
                        </Box>
                        <LanguageSwitcher sx={{ color: 'text.secondary', fontSize: 14, fontWeight: 500, '&:hover': { color: 'primary.main' } }} />
                    </Stack>
                    <Typography variant="h4" component="h1">{title}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>{subtitle}</Typography>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
