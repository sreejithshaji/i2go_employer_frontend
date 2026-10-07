'use client';

import NextLink from 'next/link';
import { Avatar, Box, Card, CardActionArea, Stack, Typography } from '@mui/material';
import { FiCheck } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { localName, plural } from '@/lib/i18n/config';
import { candidateHref } from '@/lib/i18n/routes';
import { germanLevel, initials, shortYearsLabel } from '@/lib/portal/format';
import { tokens } from '@/app/theme';
import Badge from '@/components/badge';
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
                borderRadius: 999, bgcolor: 'success.main', color: '#fff', fontSize: small ? 11 : 12, fontWeight: 600,
                boxShadow: '0 0 0 2px #fff', whiteSpace: 'nowrap',
            }}
        >
            <FiCheck size={small ? 12 : 14} strokeWidth={3} aria-hidden />
            {t.card.verified}
        </Box>
    );
}

function Stat({ label, value }) {
    return (
        <Box sx={{ flex: 1, minWidth: 0, py: 0.75, px: 0.5 }}>
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 600, lineHeight: '18px', color: 'text.primary' }}>{value ?? '–'}</Typography>
            <Typography noWrap sx={{ fontSize: 11, lineHeight: '14px', color: 'text.disabled' }}>{label}</Typography>
        </Box>
    );
}

/**
 * One candidate in a grid. Guests get the teaser (name "Arjun N.", no photo),
 * so the avatar falls back to initials; employers see the photo.
 */
export default function CandidateCard({ candidate }) {
    const { lang, t } = useI18n();
    const skills = candidate.skills || [];
    const german = germanLevel(candidate.languages, lang);
    const categories = candidate.categories || [];

    return (
        <Card
            sx={{
                height: '100%', position: 'relative',
                transition: `box-shadow 200ms ${tokens.ease}, transform 200ms ${tokens.ease}`,
                '&:hover': { boxShadow: `0 0 0 1px ${tokens.primarySoftHover}, ${tokens.shadowCardHover}`, transform: 'translateY(-3px)' },
                '&:hover .card-avatar': { transform: 'scale(1.04)' },
            }}
        >
            {/* Verified badge top-left, mirroring the wishlist heart; clicks pass through to the card link */}
            {candidate.is_verified && (
                <Box sx={{ position: 'absolute', top: 14, left: 14, zIndex: 1, pointerEvents: 'none' }}>
                    <VerifiedBadge size="small" />
                </Box>
            )}
            <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, borderRadius: `${tokens.radiusMd}px`, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}>
                <WishlistButton candidateId={candidate.id} size="small" />
            </Box>
            <CardActionArea
                component={NextLink}
                href={candidateHref(lang, candidate)}
                sx={{
                    height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', textAlign: 'center',
                    '& .MuiCardActionArea-focusHighlight': { display: 'none' },
                    '&:focus-visible': { boxShadow: `inset 0 0 0 2px ${tokens.primaryLight}` },
                }}
            >
                {/* Cover band with a faint dot grid; the avatar overlaps its bottom edge */}
                <Box
                    aria-hidden
                    sx={{
                        height: 56, flexShrink: 0, bgcolor: tokens.primarySoft,
                        backgroundImage: 'radial-gradient(rgba(37,99,235,0.14) 1px, transparent 1px)',
                        backgroundSize: '12px 12px',
                    }}
                />

                <Box sx={{ px: { xs: 2.5, sm: 3 }, pb: 2.5, mt: '-36px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            className="card-avatar"
                            src={candidate.photo_url || undefined}
                            alt=""
                            sx={{
                                width: 72, height: 72, fontSize: 24, fontWeight: 600,
                                bgcolor: '#fff', color: 'primary.main',
                                boxShadow: `0 0 0 4px #fff, 0 6px 16px rgba(15,23,42,0.10)`,
                                transition: `transform 200ms ${tokens.ease}`,
                            }}
                        >
                            {initials(candidate.name)}
                        </Avatar>
                    </Box>

                    <Typography variant="subtitle1" component="h3" noWrap sx={{ mt: 1.25, fontSize: 17 }}>{candidate.name}</Typography>

                    {categories.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.75, mt: 0.75, maxHeight: 24, overflow: 'hidden' }}>
                            {categories.slice(0, 2).map((c) => <Badge key={c.id} tone="primary">{localName(c, lang)}</Badge>)}
                            {categories.length > 2 && <Badge tone="neutral">+{categories.length - 2}</Badge>}
                        </Box>
                    )}

                    <Stack
                        direction="row"
                        divider={<Box sx={{ width: '1px', my: 1, bgcolor: 'divider' }} />}
                        sx={{ mt: 1.5, borderRadius: `${tokens.radiusMd}px`, bgcolor: tokens.background, border: `1px solid ${tokens.border}` }}
                    >
                        <Stat label={t.card.experience} value={shortYearsLabel(candidate.experience, t, lang)} />
                        <Stat label={t.card.skills} value={skills.length} />
                        {/* German level matters most to employers in Germany; "✓" = certified (0024). */}
                        <Stat label={t.card.german} value={german ? `${german.level}${german.certified ? ' ✓' : ''}` : null} />
                    </Stack>

                    {candidate.bio && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1.5, minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                            {candidate.bio}
                        </Typography>
                    )}

                    {/* Top 2 skills. The bio always takes two lines, so skills line up across a row
                        whether or not a card has the "+N more" line. */}
                    {skills.length > 0 && (
                        <Box sx={{ pt: 2 }}>
                            <Stack spacing={1} sx={{ pt: 1.75, borderTop: `1px solid ${tokens.border}` }}>
                                {skills.slice(0, 2).map((skill) => (
                                    <SkillMeter key={skill.id} name={localName(skill, lang)} level={skill.proficiency_level} />
                                ))}
                            </Stack>
                            {skills.length > 2 && (
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: 'text.disabled', textAlign: 'left' }}>
                                    {plural(t.card.moreSkills, skills.length - 2)}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </CardActionArea>
        </Card>
    );
}
