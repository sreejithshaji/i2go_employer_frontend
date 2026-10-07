'use client';

import NextLink from 'next/link';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { FiArrowRight, FiBookOpen, FiMessageCircle, FiSearch, FiUserCheck } from 'react-icons/fi';
import CandidateCard from '@/app/[lang]/(portal)/client/components/candidate-card';
import CandidateGrid from '@/app/[lang]/(portal)/client/components/candidate-grid';
import { JobLinks } from '@/app/[lang]/(portal)/client/components/seo-links';
import { useI18n } from '@/features/i18n';
import { format } from '@/lib/i18n/config';
import { tokens } from '@/app/theme';

const STEP_ICONS = [<FiSearch key="search" size={20} />, <FiMessageCircle key="message" size={20} />, <FiUserCheck key="check" size={20} />];

/**
 * Landing page, from the server: `latest` (up to 6 newest candidates), `jobs`
 * (categories with live candidates: { id, name, href, count }) and `guides`
 * ({ slug, title, description }).
 */
export default function HomeView({ latest, jobs = [], guides = [] }) {
    const { t, p } = useI18n();
    return (
        <>
            <Card
                sx={{
                    position: 'relative', overflow: 'hidden', bgcolor: 'primary.main', color: '#fff', boxShadow: 'none',
                    borderRadius: `${tokens.radiusXl}px`, p: { xs: 3, sm: 4, md: 6 },
                }}
            >
                {/* Two soft rings for depth; decorative only */}
                <Box aria-hidden sx={{ position: 'absolute', right: -120, top: -120, width: 420, height: 420, borderRadius: '50%', border: '64px solid rgba(255,255,255,0.06)', display: { xs: 'none', md: 'block' } }} />
                <Box aria-hidden sx={{ position: 'absolute', right: 120, bottom: -160, width: 260, height: 260, borderRadius: '50%', border: '40px solid rgba(255,255,255,0.05)', display: { xs: 'none', md: 'block' } }} />
                <Box sx={{ position: 'relative', maxWidth: 640 }}>
                    <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)' }}>{t.home.overline}</Typography>
                    <Typography variant="h2" component="h2" sx={{ color: '#fff', fontSize: { xs: 28, md: 40 }, lineHeight: { xs: '36px', md: '48px' }, mt: 1 }}>
                        {t.home.heroTitle}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: { xs: 14, md: 16 }, lineHeight: 1.65, mt: 2, maxWidth: 540 }}>
                        {t.home.heroText}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
                        <Button
                            component={NextLink}
                            href={p.hub}
                            size="large"
                            endIcon={<FiArrowRight />}
                            sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: tokens.primarySoft } }}
                        >
                            {t.home.ctaBrowse}
                        </Button>
                        <Button
                            component={NextLink}
                            href={p.signup}
                            size="large"
                            sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.4)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' } }}
                        >
                            {t.home.ctaSignup}
                        </Button>
                    </Stack>
                </Box>
            </Card>

            <Box component="section" sx={{ mt: { xs: 4, md: 5 } }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2.5 }}>{t.home.howItWorks}</Typography>
                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
                    {t.home.steps.map((step, i) => (
                        <Card key={step.title} sx={{ p: 3 }}>
                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ width: 44, height: 44, borderRadius: `${tokens.radiusMd}px`, display: 'grid', placeItems: 'center', color: 'primary.main', bgcolor: tokens.primarySoft }}>
                                    {STEP_ICONS[i]}
                                </Box>
                                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>{format(t.home.step, { n: i + 1 })}</Typography>
                            </Stack>
                            <Typography variant="subtitle1" component="h3">{step.title}</Typography>
                            <Typography color="text.secondary" sx={{ mt: 0.5 }}>{step.text}</Typography>
                        </Card>
                    ))}
                </Box>
            </Box>

            {latest.length > 0 && (
                <Box component="section" sx={{ mt: { xs: 4, md: 5 } }}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography variant="h6" component="h2">{t.home.latest}</Typography>
                        <Button component={NextLink} href={p.hub} endIcon={<FiArrowRight />}>{t.home.seeAll}</Button>
                    </Stack>
                    <CandidateGrid>
                        {latest.map((c) => <CandidateCard key={c.id} candidate={c} />)}
                    </CandidateGrid>
                </Box>
            )}

            {jobs.length > 0 && (
                <Box component="section" sx={{ mt: { xs: 4, md: 5 } }}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2.5 }}>{t.home.byJob}</Typography>
                    <JobLinks items={jobs} />
                </Box>
            )}

            {guides.length > 0 && (
                <Box component="section" sx={{ mt: { xs: 4, md: 5 } }}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography variant="h6" component="h2">{t.home.guides}</Typography>
                        <Button component={NextLink} href={p.guides} endIcon={<FiArrowRight />}>{t.home.allGuides}</Button>
                    </Stack>
                    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
                        {guides.map((guide) => (
                            <Card key={guide.slug} component={NextLink} href={p.guide(guide.slug)} sx={{ p: 3, textDecoration: 'none', transition: `box-shadow 200ms ${tokens.ease}`, '&:hover': { boxShadow: tokens.shadowCardHover } }}>
                                <Box sx={{ width: 40, height: 40, mb: 2, borderRadius: `${tokens.radiusMd}px`, display: 'grid', placeItems: 'center', color: 'primary.main', bgcolor: tokens.primarySoft }}>
                                    <FiBookOpen size={20} />
                                </Box>
                                <Typography variant="subtitle1" component="h3" sx={{ color: 'text.primary' }}>{guide.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{guide.description}</Typography>
                            </Card>
                        ))}
                    </Box>
                </Box>
            )}
        </>
    );
}
