'use client';

import { useState, useSyncExternalStore, useTransition } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Alert, Avatar, Box, Button, Card, Divider, Skeleton, Stack, Typography,
} from '@mui/material';
import { FiAward, FiBookOpen, FiBriefcase, FiCheck, FiFileText, FiGlobe, FiLock, FiLogIn, FiSend } from 'react-icons/fi';
import Badge from '@/components/badge';
import { VerifiedBadge } from '@/app/[lang]/(portal)/client/components/candidate-card';
import SkillBar from '@/app/[lang]/(portal)/client/components/skill-bar';
import EmptyState from '@/components/empty-state';
import { wasEnquiredRecently } from './enquiry-storage';
import WishlistButton from '@/app/[lang]/(portal)/client/components/wishlist-button';
import { loginHref, useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { format, localName } from '@/lib/i18n/config';
import { initials, languageLevelLabel, monthLabel, yearsLabel } from '@/lib/portal/format';
import { tokens } from '@/app/theme';
import { CandidateDetailSkeleton } from '../components/page-skeletons';

// Loaded after the page, not in its first bundle (PLAN.md 11.14.3): only signed-in employers open it.
const EnquiryDialog = dynamic(() => import('./enquiry-modal'), { ssr: false });

function Section({ title, children }) {
    return (
        <Card component="section" sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2.5 }}>{title}</Typography>
            {children}
        </Card>
    );
}

function Entry({ icon, title, subtitle, meta }) {
    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
            {icon && (
                <Box sx={{ width: 36, height: 36, flexShrink: 0, borderRadius: `${tokens.radiusMd}px`, display: 'grid', placeItems: 'center', bgcolor: tokens.primarySoft, color: 'primary.main' }}>
                    {icon}
                </Box>
            )}
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
                {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
                {meta && <Typography variant="body2" sx={{ color: 'text.disabled', mt: 0.25 }}>{meta}</Typography>}
            </Box>
        </Stack>
    );
}

function EntryList({ children }) {
    return <Stack spacing={2} divider={<Divider flexItem />}>{children}</Stack>;
}

// The browser remembers recent enquiries (localStorage), which the server
// can't see: it renders "not sent", and the browser reads the real value.
const noSubscribe = () => () => {};

/**
 * Candidate profile. `candidate` comes from the server (null when the profile
 * isn't listed); `error` is 'error' when it couldn't be loaded, or a reason to
 * show instead of the generic one ('readLimit'). Guests get the
 * teaser (`full_profile` false): "Arjun N.", no photo, video, age, company or
 * institution names, plus a prompt to sign in for the rest.
 */
export default function CandidateProfileView({ candidate, error }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, ready, isEmployer, isOtherAccount, needsTerms } = useAuth();
    const { lang, t, p } = useI18n();
    const [retrying, startRetry] = useTransition();

    // null until first opened: the dialog's code (and the Supabase client it
    // sends with) only loads then. Kept mounted afterwards for the close animation.
    const [enquiryOpen, setEnquiryOpen] = useState(null);
    const [sentNow, setSentNow] = useState(false);
    const sentBefore = useSyncExternalStore(
        noSubscribe,
        () => (candidate ? wasEnquiredRecently(candidate.id) : false),
        () => false,
    );
    const enquired = sentNow || sentBefore;

    if (retrying) {
        return <CandidateDetailSkeleton />;
    }
    if (error) {
        return (
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => startRetry(() => router.refresh())}>{t.common.retry}</Button>}>
                {error === 'readLimit' ? t.list.readLimit : t.profile.loadError}
            </Alert>
        );
    }
    if (!candidate) {
        return (
            <EmptyState
                title={t.profile.unavailableTitle}
                message={t.profile.unavailableText}
                action={<Button component={NextLink} href={p.hub} variant="contained">{t.common.browseCandidates}</Button>}
            />
        );
    }

    const c = candidate;
    const facts = [
        c.age_band && format(t.profile.age, { band: c.age_band }),
        c.experience != null && format(t.profile.experienceFact, { years: yearsLabel(c.experience, t, lang) }),
    ].filter(Boolean);

    // Only signed-in employers who accepted the terms can send an enquiry
    // (submit-enquiry enforces the same). Guests are sent to sign in and back,
    // employers without terms to the terms page; candidate accounts get no button.
    const loginLink = loginHref(pathname);
    const enquiry = enquired
        ? { label: t.profile.enquirySent, icon: <FiCheck />, disabled: true }
        : !user
            ? { label: t.profile.signInToEnquire, icon: <FiLogIn />, onClick: () => router.push(loginLink) }
            : !ready
                ? { label: t.profile.sendEnquiry, icon: <FiSend />, disabled: true }
                : needsTerms
                    ? { label: t.profile.acceptTermsToEnquire, icon: <FiFileText />, onClick: () => router.push(p.terms) }
                    : isEmployer
                        ? { label: t.profile.sendEnquiry, icon: <FiSend />, onClick: () => setEnquiryOpen(true) }
                        : null;

    const enquireButton = enquiry && (
        <Button
            variant="contained"
            size="large"
            startIcon={enquiry.icon}
            disabled={enquiry.disabled}
            onClick={enquiry.onClick}
            sx={{ flexShrink: 0, minWidth: 168 }}
        >
            {enquiry.label}
        </Button>
    );

    const firstName = c.name.split(' ')[0];
    const linkSx = { color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } };

    return (
        <Box sx={{ pb: { xs: 10, sm: 0 } }}>
            <Card sx={{ p: { xs: 2.5, md: 4 }, mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <Avatar
                            src={c.photo_url || undefined}
                            alt={c.name}
                            sx={{ width: 112, height: 112, fontSize: 36, bgcolor: tokens.primarySoft, color: 'primary.main', fontWeight: 600, boxShadow: `0 0 0 4px #fff, ${tokens.shadowCard}` }}
                        >
                            {initials(c.name)}
                        </Avatar>
                        {c.is_verified && <Box sx={{ mt: -1.5, position: 'relative' }}><VerifiedBadge /></Box>}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h4" component="h2" sx={{ wordBreak: 'break-word', fontSize: { xs: 22, md: 26 } }}>{c.name}</Typography>
                        {facts.length > 0 && <Typography color="text.secondary" sx={{ mt: 0.5 }}>{facts.join(' · ')}</Typography>}
                        {c.is_verified && (
                            <Typography variant="body2" sx={{ color: tokens.successText, mt: 0.5, fontWeight: 500 }}>{t.card.verifiedBy}</Typography>
                        )}
                        {c.categories.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                                {c.categories.map((cat) => <Badge key={cat.id} tone="primary">{localName(cat, lang)}</Badge>)}
                            </Box>
                        )}
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', display: { xs: 'none', sm: 'flex' }, alignSelf: { sm: 'center' } }}>
                        <WishlistButton candidateId={c.id} variant="button" />
                        {enquireButton}
                    </Stack>
                </Stack>
                {!c.full_profile && !isOtherAccount && (
                    <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, pt: 2.5, borderTop: `1px solid ${tokens.border}`, alignItems: 'flex-start' }}>
                        <Box sx={{ color: 'primary.main', mt: '2px', flexShrink: 0 }}><FiLock size={16} aria-hidden /></Box>
                        <Typography variant="body2" color="text.secondary">
                            {user ? (
                                t.profile.lockedSignedIn
                            ) : (
                                <>
                                    <Box component={NextLink} href={loginLink} sx={linkSx}>{t.profile.lockedGuestLink}</Box>
                                    {t.profile.lockedGuestRest}
                                </>
                            )}
                        </Typography>
                    </Stack>
                )}
            </Card>

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 340px' }, alignItems: 'start' }}>
                <Stack spacing={3} sx={{ minWidth: 0 }}>
                    {c.bio && (
                        <Section title={t.profile.about}>
                            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{c.bio}</Typography>
                        </Section>
                    )}

                    {c.video_url && (
                        <Section title={t.profile.video}>
                            <Box
                                component="video"
                                src={c.video_url}
                                controls
                                preload="metadata"
                                playsInline
                                sx={{ display: 'block', width: '100%', maxHeight: 480, borderRadius: `${tokens.radiusMd}px`, bgcolor: '#000' }}
                            />
                        </Section>
                    )}

                    {c.work_experience.length > 0 && (
                        <Section title={t.profile.work}>
                            <EntryList>
                                {c.work_experience.map((w, i) => (
                                    <Entry
                                        key={i}
                                        icon={<FiBriefcase size={18} />}
                                        title={w.position}
                                        subtitle={[w.company_name, w.location].filter(Boolean).join(' · ')}
                                        meta={[monthLabel(w.start_date, lang), w.is_current ? t.profile.present : monthLabel(w.end_date, lang)].filter(Boolean).join(' – ')}
                                    />
                                ))}
                            </EntryList>
                        </Section>
                    )}

                    {c.education.length > 0 && (
                        <Section title={t.profile.education}>
                            <EntryList>
                                {c.education.map((e, i) => (
                                    <Entry
                                        key={i}
                                        icon={<FiBookOpen size={18} />}
                                        title={[e.degree_type, e.course_name].filter(Boolean).join(', ')}
                                        subtitle={[e.specialization, e.institution_name, e.university_name].filter(Boolean).join(' · ')}
                                        meta={e.year_of_passing ? format(t.profile.passed, { year: e.year_of_passing }) : null}
                                    />
                                ))}
                            </EntryList>
                        </Section>
                    )}
                </Stack>

                <Stack spacing={3} sx={{ minWidth: 0 }}>
                    {c.skills.length > 0 && (
                        <Section title={t.profile.skills}>
                            <Stack spacing={2}>
                                {c.skills.map((s) => (
                                    <SkillBar
                                        key={s.id}
                                        name={localName(s, lang)}
                                        level={s.proficiency_level}
                                        meta={s.years_of_experience != null ? yearsLabel(s.years_of_experience, t, lang) : null}
                                    />
                                ))}
                            </Stack>
                        </Section>
                    )}

                    {c.languages.length > 0 && (
                        <Section title={t.profile.languages}>
                            <EntryList>
                                {c.languages.map((l) => (
                                    <Entry
                                        key={l.name}
                                        icon={<FiGlobe size={18} />}
                                        title={localName(l, lang)}
                                        meta={languageLevelLabel(l, t, lang)}
                                    />
                                ))}
                            </EntryList>
                        </Section>
                    )}

                </Stack>
            </Box>

            {/* Enquiry call to action: one full-width row under the profile (stacks on phones) */}
            <Card
                component="section"
                aria-label={format(t.profile.enquireAria, { name: firstName })}
                sx={{ mt: 3, p: { xs: 2.5, md: 3 }, bgcolor: 'primary.main', color: '#fff', borderRadius: `${tokens.radiusXl}px`, boxShadow: 'none' }}
            >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 3 }} sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
                    <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: `${tokens.radiusMd}px`, display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,0.15)' }}>
                        <FiAward size={22} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" component="h2" sx={{ color: '#fff' }}>{format(t.profile.interested, { name: firstName })}</Typography>
                        <Typography sx={{ mt: 0.5, color: 'rgba(255,255,255,0.8)' }}>
                            {enquiry ? t.profile.ctaText : t.profile.ctaTextNoButton}
                        </Typography>
                    </Box>
                    {enquiry && (
                        <Button
                            size="large"
                            startIcon={enquiry.icon}
                            disabled={enquiry.disabled}
                            onClick={enquiry.onClick}
                            sx={{
                                flexShrink: 0, minWidth: 200, width: { xs: '100%', md: 'auto' },
                                bgcolor: '#fff', color: 'primary.main',
                                '&:hover': { bgcolor: tokens.primarySoft },
                                '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' },
                            }}
                        >
                            {enquiry.label}
                        </Button>
                    )}
                </Stack>
            </Card>

            {/* Sticky action bar on phones */}
            <Box
                sx={{
                    display: { xs: 'flex', sm: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 10,
                    gap: 1, p: 1.5, alignItems: 'center', bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
                    borderTop: `1px solid ${tokens.border}`,
                    '& > button:last-of-type': { flex: 1 },
                }}
            >
                <WishlistButton candidateId={c.id} />
                {enquireButton}
            </Box>

            {enquiryOpen !== null && (
                <EnquiryDialog
                    open={enquiryOpen}
                    onClose={() => setEnquiryOpen(false)}
                    candidate={c}
                    onSent={() => setSentNow(true)}
                />
            )}
        </Box>
    );
}
