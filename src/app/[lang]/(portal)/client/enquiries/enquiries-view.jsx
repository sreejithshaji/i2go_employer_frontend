'use client';

import NextLink from 'next/link';
import CtaButton from '@/app/[lang]/(marketing)/client/components/cta-button';
import { Alert, Avatar, Box, Card, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { FiBriefcase, FiCalendar, FiInbox } from 'react-icons/fi';
import EmptyState from '@/components/empty-state';
import PageIntro from '@/components/page-intro';
import { useI18n } from '@/features/i18n';
import { candidateHref } from '@/lib/i18n/routes';
import { dateLabel, initials } from '@/lib/portal/format';
import { useMyEnquiries } from './use-my-enquiries';
import { StatusPill, StatusProgress, enquiryStep } from './enquiry-status';
import { brand as b, tokens } from '@/app/theme';

/** The signed-in employer's enquiries and their status. */
export default function EnquiriesView() {
    const { enquiries, candidates, error } = useMyEnquiries();
    const { lang, t, p } = useI18n();

    return (
        <>
            <PageIntro>{t.enquiries.intro}</PageIntro>

            {error ? (
                <Alert severity="error">{t.enquiries.loadError}</Alert>
            ) : enquiries === null ? (
                <Card>
                    {[0, 1, 2].map((i) => (
                        <Box key={i} sx={{ px: 3, py: 2.5, borderTop: i ? `1px solid ${tokens.border}` : 'none' }}>
                            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                <Skeleton variant="circular" width={44} height={44} />
                                <Box sx={{ flex: 1 }}><Skeleton width="30%" height={22} /><Skeleton width="45%" /></Box>
                                <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 999 }} />
                            </Stack>
                        </Box>
                    ))}
                </Card>
            ) : enquiries.length === 0 ? (
                <EmptyState
                    icon={<FiInbox size={28} />}
                    title={t.enquiries.emptyTitle}
                    message={t.enquiries.emptyText}
                    action={<CtaButton href={p.hub}>{t.common.browseCandidates}</CtaButton>}
                />
            ) : (
                <Card component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                    {enquiries.map((e, i) => {
                        const candidate = candidates[e.candidate_id];
                        const statusKey = enquiryStep(e.status);
                        const status = t.enquiries.status[statusKey];
                        const sentOn = dateLabel(e.created_at, lang);
                        return (
                            <Box component="li" key={e.id}>
                                {i > 0 && <Divider />}
                                <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5, transition: `background-color 150ms ${tokens.ease}`, '&:hover': { bgcolor: b.surface2 } }}>
                                    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                                        <Avatar src={candidate?.photo_url || undefined} sx={{ width: 44, height: 44, bgcolor: tokens.primarySoft, color: 'primary.main', fontWeight: 600, fontSize: 15 }}>
                                            {candidate ? initials(candidate.name) : '?'}
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
                                                <Box sx={{ minWidth: 0 }}>
                                                    {candidate ? (
                                                        <Typography component={NextLink} href={candidateHref(lang, candidate)} variant="subtitle1" sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                                            {candidate.name}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="subtitle1" color="text.secondary">{t.enquiries.noLongerListed}</Typography>
                                                    )}
                                                    <Stack direction="row" spacing={2} sx={{ color: 'text.secondary', flexWrap: 'wrap' }}>
                                                        {e.job_title && (
                                                            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', minWidth: 0 }}>
                                                                <FiBriefcase size={14} color={tokens.textMuted} />
                                                                <Typography variant="body2" noWrap>{e.job_title}</Typography>
                                                            </Stack>
                                                        )}
                                                        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                                                            <FiCalendar size={14} color={tokens.textMuted} />
                                                            <Typography variant="body2">{sentOn}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                                <StatusPill status={statusKey} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, flexShrink: 0 }}>{status.label}</StatusPill>
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-line' }}>
                                                {e.message}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Box sx={{ mt: 2, ml: { xs: 0, sm: '60px' }, pt: 2, borderTop: `1px solid ${b.line}`, display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 380px) 1fr' }, alignItems: { md: 'start' } }}>
                                        <StatusProgress
                                            status={statusKey}
                                            label={t.enquiries.progressLabel}
                                            labels={{ received: t.enquiries.status.received.label, forwarded: t.enquiries.status.forwarded.label, closed: t.enquiries.status.closed.label }}
                                        />
                                        <Typography variant="body2" sx={{ color: b.muted, fontSize: 13, pt: { md: '1px' } }}>{status.text}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Card>
            )}
        </>
    );
}
