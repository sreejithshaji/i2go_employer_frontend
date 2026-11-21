'use client';

import { useEffect, useState, useSyncExternalStore, useTransition } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import CtaButton from '@/app/[lang]/(marketing)/client/components/cta-button';
import { usePathname, useRouter } from 'next/navigation';
import {
    Alert, Avatar, Box, Button, Card, Skeleton, Stack, Tooltip, Typography,
} from '@mui/material';
import { FiAward, FiBookOpen, FiBriefcase, FiCheck, FiFileText, FiGlobe, FiLock, FiSend } from 'react-icons/fi';
import Badge from '@/components/badge';
import { VerifiedBadge } from '@/app/[lang]/(portal)/client/components/candidate-card';
import LockedPhoto, { showsLockedPhoto } from '@/app/[lang]/(portal)/client/components/locked-photo';
import SkillBar from '@/app/[lang]/(portal)/client/components/skill-bar';
import EmptyState from '@/components/empty-state';
import { wasEnquiredRecently } from './enquiry-storage';
import { recordView } from './recently-viewed-storage';
import WishlistButton from '@/app/[lang]/(portal)/client/components/wishlist-button';
import { loginHref, useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { format, localName } from '@/lib/i18n/config';
import { initials, languageLevelLabel, monthLabel, yearsLabel } from '@/lib/portal/format';
import { brand as b, tokens } from '@/app/theme';
import DriftGlow from '@/app/[lang]/(marketing)/client/components/drift-glow';
import Reveal from '@/app/[lang]/(marketing)/client/components/reveal';
import { CandidateDetailSkeleton } from '../components/page-skeletons';
import { startNavigation } from '@/components/navigation-progress/progress-store';

// Loaded after the page, not in its first bundle (PLAN.md 11.14.3): only signed-in employers open it.
const EnquiryDialog = dynamic(() => import('./enquiry-modal'), { ssr: false });

/**
 * Profile section card with a numbered heading (plan 14.4a): the two-digit
 * number as a small eyebrow in `accentText`, then the title. The number is
 * part of the heading text only visually (aria-hidden), so screen readers hear
 * just the title. Rises in as it scrolls into view (plan 14.10).
 */
function Section({ number, title, children }) {
    return (
        <Reveal component="section">
            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'baseline', gap: 1.25, fontWeight: 800 }}>
                    <Box component="span" aria-hidden sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: b.accentText, fontVariantNumeric: 'tabular-nums' }}>
                        {String(number).padStart(2, '0')}
                    </Box>
                    {title}
                </Typography>
                {children}
            </Card>
        </Reveal>
    );
}

// One row of a hairline list (reference `.gitem`): 1px top line, faint icon, no box.
function Entry({ icon, title, subtitle, meta }) {
    return (
        <Box component="li" sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.75, borderTop: `1px solid ${b.line}` }}>
            {icon && (
                <Box aria-hidden sx={{ display: 'flex', flexShrink: 0, mt: '3px', color: b.faint, '& svg': { width: 16, height: 16 } }}>
                    {icon}
                </Box>
            )}
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, color: b.ink2 }}>{title}</Typography>
                {subtitle && <Typography variant="body2" sx={{ color: b.muted, mt: 0.25 }}>{subtitle}</Typography>}
                {meta && <Typography variant="body2" sx={{ color: b.muted, fontSize: 12.5, fontWeight: 600, mt: 0.25 }}>{meta}</Typography>}
            </Box>
        </Box>
    );
}

function EntryList({ children }) {
    return <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, mb: -1.75 }}>{children}</Box>;
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

    // "Recently viewed" (6.20): guests and employers only. Waits for the session,
    // so a signed-in candidate or admin account is never recorded.
    const candidateId = candidate?.id;
    useEffect(() => {
        if (candidateId && ready && !isOtherAccount) recordView(candidateId);
    }, [candidateId, ready, isOtherAccount]);

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
                action={<CtaButton href={p.hub}>{t.common.browseCandidates}</CtaButton>}
            />
        );
    }

    const c = candidate;
    const facts = [
        c.age_band && format(t.profile.age, { band: c.age_band }),
        c.experience != null && format(t.profile.experienceFact, { years: yearsLabel(c.experience, t, lang) }),
    ].filter(Boolean);

    // Who can send an enquiry (submit-enquiry enforces the same):
    // guests, through the form with the terms checkbox (guest-enquiry-plan.md);
    // signed-in employers who accepted the terms. Employers without terms go
    // to the terms page; candidate accounts get no button. Disabled until the
    // session is known, so a signed-in employer never gets the guest form.
    const loginLink = loginHref(pathname);
    const isGuest = ready && !user;
    const enquiry = enquired
        ? { label: t.profile.enquirySent, icon: <FiCheck />, disabled: true }
        : !ready
            ? { label: t.profile.sendEnquiry, icon: <FiSend />, disabled: true }
            : isGuest
                ? { label: t.profile.sendEnquiry, icon: <FiSend />, onClick: () => setEnquiryOpen(true) }
                : needsTerms
                    ? { label: t.profile.acceptTermsToEnquire, icon: <FiFileText />, onClick: () => { startNavigation(p.terms); router.push(p.terms); } }
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
    // Section numbers in reading order, counting only the sections shown.
    const shown = [
        c.bio && 'about', c.video_url && 'video', c.work_experience.length > 0 && 'work',
        c.education.length > 0 && 'education', c.skills.length > 0 && 'skills', c.languages.length > 0 && 'languages',
    ].filter(Boolean);
    const num = (key) => shown.indexOf(key) + 1;
    const lockedPhoto = showsLockedPhoto(c);
    const linkSx = { color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } };

    return (
        <Box sx={{ pb: { xs: 'calc(88px + env(safe-area-inset-bottom, 0px))', sm: 0 } }}>
            <Card sx={{ p: { xs: 2.5, md: 4 }, mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <Tooltip
                            title={lockedPhoto ? (user ? t.card.photoEmployersOnly : t.card.photoHover) : ''}
                            arrow
                            placement="top"
                            disableInteractive
                        >
                            <Avatar
                                src={c.photo_url || undefined}
                                alt={c.name}
                                sx={{ width: 112, height: 112, fontSize: 36, bgcolor: tokens.primarySoft, color: 'primary.main', fontWeight: 600, boxShadow: `0 0 0 4px #fff, ${tokens.shadowCard}` }}
                            >
                                {lockedPhoto ? <LockedPhoto hash={c.photo_blurhash} iconSize={20} /> : initials(c.name)}
                            </Avatar>
                        </Tooltip>
                        {c.is_verified && <Box sx={{ mt: -1.5, position: 'relative' }}><VerifiedBadge /></Box>}
                        {lockedPhoto && !user && (
                            <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
                                <Box component={NextLink} href={loginLink} sx={linkSx}>{t.card.photoSignIn}</Box>
                            </Typography>
                        )}
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
                        <Section number={num('about')} title={t.profile.about}>
                            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{c.bio}</Typography>
                        </Section>
                    )}

                    {c.video_url && (
                        <Section number={num('video')} title={t.profile.video}>
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
                        <Section number={num('work')} title={t.profile.work}>
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
                        <Section number={num('education')} title={t.profile.education}>
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
                        <Section number={num('skills')} title={t.profile.skills}>
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
                        <Section number={num('languages')} title={t.profile.languages}>
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
            {/* The reference dark panel: navy, hairline cyan edge, drifting cyan glow */}
            <Reveal
                component="section"
                aria-label={format(t.profile.enquireAria, { name: firstName })}
                sx={{
                    position: 'relative', overflow: 'hidden', isolation: 'isolate',
                    mt: 3, p: { xs: 3, md: 4 }, borderRadius: `${b.radiusPanel}px`,
                    background: b.darkPanelBase, border: `1px solid ${b.darkPanelBorder}`, boxShadow: b.shadowDarkPanel,
                    '--focus-color': b.cyan,
                }}
            >
                <DriftGlow color="rgba(31,200,255,0.14)" sx={{ zIndex: -1, top: -220, right: { xs: -280, md: -100 }, width: { xs: 560, md: 680 }, height: 440 }} />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2.5, md: 3 }} sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
                    <Box aria-hidden sx={{ width: 46, height: 46, flexShrink: 0, borderRadius: `${b.radiusButton}px`, display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,0.05)', border: `1px solid ${b.onDark.border}`, color: b.cyan }}>
                        <FiAward size={21} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography component="h2" sx={{ m: 0, fontSize: { xs: 22, md: 26 }, lineHeight: 1.15, fontWeight: 800, letterSpacing: '-0.7px', color: b.onDark.text }}>
                            {format(t.profile.interested, { name: firstName })}
                        </Typography>
                        <Typography sx={{ mt: 1, maxWidth: 560, fontSize: 15, lineHeight: 1.6, fontWeight: 500, color: b.onDark.body }}>
                            {enquiry ? t.profile.ctaText : t.profile.ctaTextNoButton}
                        </Typography>
                        {isGuest && !enquired && (
                            <Typography sx={{ mt: 1, maxWidth: 560, fontSize: 14, lineHeight: 1.6, fontWeight: 500, color: b.onDark.body }}>
                                {t.profile.guestSignInPrefix}{' '}
                                <Box
                                    component={NextLink}
                                    href={loginLink}
                                    onClick={() => startNavigation(loginLink)}
                                    sx={{ color: b.cyan, fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                >
                                    {t.profile.guestSignInLink}
                                </Box>
                                {t.profile.guestSignInRest}
                            </Typography>
                        )}
                    </Box>
                    {enquiry && (
                        <Button
                            variant="cta"
                            endIcon={enquiry.icon}
                            disabled={enquiry.disabled}
                            onClick={enquiry.onClick}
                            sx={{ flexShrink: 0, width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'space-between', md: 'center' } }}
                        >
                            {enquiry.label}
                        </Button>
                    )}
                </Stack>
            </Reveal>

            {/* Sticky action bar on phones (14.13): the phone top bar's light frosted
                glass and hairline, with the homepage cta for the enquiry. */}
            <Box
                sx={{
                    display: { xs: 'flex', sm: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 10,
                    gap: 1, alignItems: 'center',
                    px: 2, pt: 1.5, pb: 'calc(12px + env(safe-area-inset-bottom, 0px))',
                    bgcolor: 'rgba(255,255,255,0.86)',
                    backdropFilter: 'blur(14px) saturate(180%)', WebkitBackdropFilter: 'blur(14px) saturate(180%)',
                    borderTop: `1px solid ${b.line}`,
                }}
            >
                <WishlistButton candidateId={c.id} />
                {enquiry && (
                    <Button
                        variant="cta"
                        endIcon={enquiry.icon}
                        disabled={enquiry.disabled}
                        onClick={enquiry.onClick}
                        sx={{ flex: 1, minWidth: 0, justifyContent: 'space-between', whiteSpace: 'nowrap' }}
                    >
                        {enquiry.label}
                    </Button>
                )}
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
