'use client';

import NextLink from 'next/link';
import { Box, Card, CardActionArea, Stack, Tooltip, Typography } from '@mui/material';
import { FiBriefcase, FiCheck, FiGlobe } from 'react-icons/fi';
import { useAuth } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { localName, plural } from '@/lib/i18n/config';
import { candidateHref } from '@/lib/i18n/routes';
import { shortYearsLabel } from '@/lib/portal/format';
import { brand as b } from '@/app/theme';
import LinkPendingOverlay from '@/components/link-pending-overlay';
import { showsLockedPhoto } from './locked-photo';
import { CandidateAvatar, LanguageChip, MAX_LANGUAGES, sortedLanguages } from './candidate-card-parts';
import WishlistButton from './wishlist-button';
import { SkillMeter } from './skill-bar';

/** Solid green "Verified" pill; sits over the avatar's bottom edge. */
export function VerifiedBadge({ size = 'medium' }) {
    const { t } = useI18n();
    const small = size === 'small';
    return (
        <Box
            component="span"
            title={t.card.verifiedBy}
            sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5, height: small ? 22 : 26, px: small ? 1 : 1.25,
                borderRadius: 999, bgcolor: b.ok, color: '#fff', fontSize: small ? 11 : 12, fontWeight: 600,
                boxShadow: '0 0 0 2px #fff', whiteSpace: 'nowrap',
            }}
        >
            <FiCheck size={small ? 12 : 14} strokeWidth={3} aria-hidden />
            {t.card.verified}
        </Box>
    );
}

/**
 * One candidate in a grid, in the homepage card design (14.3a): left-aligned,
 * hairline border, accent category, current role, German-first language chips
 * and the top two skills. Guests get the teaser (name "Arjun N.", no photo):
 * the avatar shows the blurred photo with a lock, or initials when there is no
 * blurhash; employers see the photo.
 */
export default function CandidateCard({ candidate }) {
    const { lang, t } = useI18n();
    const { user } = useAuth();
    const skills = candidate.skills || [];
    const categories = candidate.categories || [];
    const category = categories[0];
    const locked = showsLockedPhoto(candidate);
    const role = (candidate.work_experience || []).find((w) => w.is_current)?.position || candidate.work_experience?.[0]?.position;
    const work = [role, shortYearsLabel(candidate.experience, t, lang)].filter(Boolean).join(' · ');
    const languages = sortedLanguages(candidate.languages);
    const shown = languages.slice(0, MAX_LANGUAGES);
    const moreLanguages = languages.length - shown.length;

    return (
        <Card
            sx={{
                height: '100%', position: 'relative',
                transition: `border-color 280ms ${b.ease}, box-shadow 280ms ${b.ease}, transform 280ms ${b.ease}`,
                '&:hover': { borderColor: b.lineHover, boxShadow: b.shadow2, transform: 'translateY(-1px)' },
            }}
        >
            <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                <WishlistButton candidateId={candidate.id} size="small" />
            </Box>
            <CardActionArea
                component={NextLink}
                href={candidateHref(lang, candidate)}
                sx={{
                    height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start',
                    gap: 1.5, p: 1.5, textAlign: 'left',
                    '& .MuiCardActionArea-focusHighlight': { display: 'none' },
                    '&:focus-visible': { boxShadow: `inset 0 0 0 2px ${b.accent}` },
                }}
            >
                {/* Portrait photo beside the key details, so its height carries
                    name, category, role and verification instead of empty space. */}
                <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1.25, minWidth: 0 }}>
                    <Tooltip
                        title={locked ? (user ? t.card.photoEmployersOnly : t.card.photoHover) : ''}
                        arrow
                        placement="top"
                        disableInteractive
                    >
                        <Box><CandidateAvatar candidate={candidate} width={88} height={110} /></Box>
                    </Tooltip>
                    <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {/* Room on the right for the wishlist heart */}
                        <Typography component="h3" noWrap sx={{ m: 0, pr: 4, fontSize: 16, fontWeight: 800, lineHeight: '22px', letterSpacing: '-0.2px', color: b.ink }}>
                            {candidate.name}
                        </Typography>
                        {category && (
                            <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, lineHeight: '19px', color: b.accentText }}>
                                {localName(category, lang)}
                                {categories.length > 1 && (
                                    <Box component="span" sx={{ color: b.muted, fontWeight: 600 }}> +{categories.length - 1}</Box>
                                )}
                            </Typography>
                        )}
                        {work && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, minWidth: 0, color: b.muted }}>
                                <FiBriefcase size={13} aria-hidden style={{ flexShrink: 0, marginTop: 3 }} />
                                <Typography
                                    sx={{
                                        fontSize: 13, lineHeight: '18px', color: b.ink2,
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                    }}
                                >
                                    {work}
                                </Typography>
                            </Box>
                        )}
                        {candidate.is_verified && (
                            <Typography noWrap sx={{ mt: 'auto', fontSize: 11.5, fontWeight: 600, lineHeight: '16px', color: b.okText }}>
                                {t.card.verifiedBy}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {candidate.bio && (
                    <Typography
                        sx={{
                            fontSize: 13.5, lineHeight: '20px', color: b.muted, minHeight: 40,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}
                    >
                        {candidate.bio}
                    </Typography>
                )}

                {shown.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                        <Box sx={{ color: b.faint, pt: '5px', flexShrink: 0 }}>
                            <FiGlobe size={13} aria-hidden />
                        </Box>
                        <Box component="ul" aria-label={t.card.languages} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexWrap: 'wrap', gap: 0.5, minWidth: 0 }}>
                            {shown.map((l) => <LanguageChip key={l.id ?? l.name} entry={l} lang={lang} />)}
                            {moreLanguages > 0 && (
                                <Box component="li" sx={{ display: 'inline-flex', alignItems: 'center', height: 24, px: 0.75, fontSize: 11.5, fontWeight: 700, color: b.muted }}>
                                    +{moreLanguages}
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Top 2 skills behind a hairline, pinned to the bottom so rows line up */}
                {skills.length > 0 && (
                    <Box sx={{ mt: 'auto', pt: 1.5, borderTop: `1px solid ${b.line}` }}>
                        <Stack spacing={1}>
                            {skills.slice(0, 2).map((skill) => (
                                <SkillMeter key={skill.id} name={localName(skill, lang)} level={skill.proficiency_level} />
                            ))}
                        </Stack>
                        {skills.length > 2 && (
                            <Typography sx={{ display: 'block', mt: 0.75, fontSize: 12, fontWeight: 600, color: b.muted }}>
                                {plural(t.card.moreSkills, skills.length - 2)}
                            </Typography>
                        )}
                    </Box>
                )}
                <LinkPendingOverlay />
            </CardActionArea>
        </Card>
    );
}
