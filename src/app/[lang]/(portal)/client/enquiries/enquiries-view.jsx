'use client';

import NextLink from 'next/link';
import { Alert, Avatar, Box, Button, Card, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { FiBriefcase, FiCalendar, FiInbox } from 'react-icons/fi';
import Badge from '@/components/badge';
import EmptyState from '@/components/empty-state';
import PageIntro from '@/components/page-intro';
import { useI18n } from '@/features/i18n';
import { candidateHref } from '@/lib/i18n/routes';
import { dateLabel, initials } from '@/lib/portal/format';
import { useMyEnquiries } from './use-my-enquiries';
import { tokens } from '@/app/theme';

// my_enquiries() collapses internal statuses into these three; labels in t.enquiries.status.
const STATUS_TONES = { received: 'warning', forwarded: 'primary', closed: 'neutral' };

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
                    action={<Button component={NextLink} href={p.hub} variant="contained">{t.common.browseCandidates}</Button>}
                />
            ) : (
                <Card component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                    {enquiries.map((e, i) => {
                        const candidate = candidates[e.candidate_id];
                        const statusKey = STATUS_TONES[e.status] ? e.status : 'received';
                        const status = { ...t.enquiries.status[statusKey], tone: STATUS_TONES[statusKey] };
                        const sentOn = dateLabel(e.created_at, lang);
                        return (
                            <Box component="li" key={e.id}>
                                {i > 0 && <Divider />}
                                <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5, transition: `background-color 150ms ${tokens.ease}`, '&:hover': { bgcolor: tokens.background } }}>
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
                                                <Badge tone={status.tone} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, flexShrink: 0 }}>{status.label}</Badge>
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-line' }}>
                                                {e.message}
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.disabled' }}>{status.text}</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        );
                    })}
                </Card>
            )}
        </>
    );
}
