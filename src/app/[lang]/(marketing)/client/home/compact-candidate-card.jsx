'use client';

import NextLink from 'next/link';
import { Avatar, Box, Typography } from '@mui/material';
import { FiArrowUpRight, FiBriefcase, FiCheck, FiGlobe } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { localName } from '@/lib/i18n/config';
import { candidateHref } from '@/lib/i18n/routes';
import { initials, shortYearsLabel } from '@/lib/portal/format';
import { brand as b } from '@/app/theme';
import LinkPendingOverlay from '@/components/link-pending-overlay';
import LockedPhoto, { showsLockedPhoto } from '@/app/[lang]/(portal)/client/components/locked-photo';

const MAX_LANGUAGES = 3;

/** Photo (or locked blurhash / initials for guests) with a small verified tick. */
export function CandidateAvatar({ candidate, size = 44 }) {
    const locked = showsLockedPhoto(candidate);
    return (
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
                src={candidate.photo_url || undefined}
                alt=""
                sx={{ width: size, height: size, fontSize: size * 0.36, fontWeight: 700, bgcolor: b.accentSoft, color: b.accentText }}
            >
                {locked ? <LockedPhoto hash={candidate.photo_blurhash} iconSize={Math.round(size * 0.28)} /> : initials(candidate.name)}
            </Avatar>
            {candidate.is_verified && (
                <Box
                    component="span"
                    aria-hidden
                    sx={{
                        position: 'absolute', right: -2, bottom: -2, width: 16, height: 16, borderRadius: 999,
                        display: 'grid', placeItems: 'center', bgcolor: b.ok, color: '#fff', boxShadow: '0 0 0 2px #fff',
                    }}
                >
                    <FiCheck size={10} strokeWidth={3.5} />
                </Box>
            )}
        </Box>
    );
}

/** German first (what employers filter on), then the strongest level. */
function sortedLanguages(languages = []) {
    return [...languages].sort((x, y) => (y.code === 'de') - (x.code === 'de') || (y.level_rank ?? 0) - (x.level_rank ?? 0));
}

function LanguageChip({ entry, lang }) {
    const level = lang === 'de' && entry.level_de ? entry.level_de : entry.level;
    const german = entry.code === 'de';
    return (
        <Box
            component="li"
            sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5, minWidth: 0, maxWidth: '100%',
                height: 24, px: 1, borderRadius: 999, fontSize: 11.5, lineHeight: '16px', whiteSpace: 'nowrap',
                bgcolor: german ? b.accentSoft : b.surface3,
                border: `1px solid ${german ? b.accentLine : b.line}`,
                color: german ? b.accentText : b.ink2,
            }}
        >
            <Box component="span" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{localName(entry, lang)}</Box>
            {level && <Box component="span" sx={{ color: german ? b.accentText : b.muted, fontWeight: 500 }}>· {level}</Box>}
            {entry.certified && <FiCheck size={11} strokeWidth={3} aria-hidden style={{ color: b.ok, flexShrink: 0 }} />}
        </Box>
    );
}

/**
 * Candidate card for the homepage strip: photo, name, job category, current
 * role with experience, and the languages they speak (German first, with
 * level and a tick when certified). Links to the profile.
 */
export default function CompactCandidateCard({ candidate }) {
    const { lang, t } = useI18n();
    const category = candidate.categories?.[0];
    const role = (candidate.work_experience || []).find((w) => w.is_current)?.position || candidate.work_experience?.[0]?.position;
    const years = shortYearsLabel(candidate.experience, t, lang);
    const work = [role, years].filter(Boolean).join(' · ');
    const languages = sortedLanguages(candidate.languages);
    const shown = languages.slice(0, MAX_LANGUAGES);
    const more = languages.length - shown.length;

    return (
        <Box
            component={NextLink}
            href={candidateHref(lang, candidate)}
            sx={{
                position: 'relative', display: 'flex', flexDirection: 'column', gap: 1.25, height: '100%', minWidth: 0,
                p: 1.75, borderRadius: `${b.radiusMd}px`,
                bgcolor: b.surface, border: `1px solid ${b.line}`, boxShadow: b.shadow1,
                color: 'inherit', textDecoration: 'none',
                transition: `border-color 200ms ${b.ease}, box-shadow 200ms ${b.ease}, transform 200ms ${b.ease}`,
                '&:hover': { borderColor: b.accentLine, boxShadow: b.shadow2, transform: 'translateY(-2px)' },
                '&:hover .card-arrow': { color: b.accent, transform: 'translate(2px, -2px)' },
                '&:focus-visible': { outline: `2px solid ${b.accent}`, outlineOffset: 2 },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <CandidateAvatar candidate={candidate} size={52} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography component="h3" noWrap sx={{ m: 0, fontSize: 15.5, fontWeight: 800, lineHeight: '21px', color: b.ink }}>
                        {candidate.name}
                    </Typography>
                    {category && (
                        <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, lineHeight: '19px', color: b.accentText }}>
                            {localName(category, lang)}
                            {candidate.categories.length > 1 && (
                                <Box component="span" sx={{ color: b.muted, fontWeight: 600 }}> +{candidate.categories.length - 1}</Box>
                            )}
                        </Typography>
                    )}
                    {candidate.is_verified && (
                        <Typography noWrap sx={{ fontSize: 11.5, fontWeight: 600, lineHeight: '16px', color: b.ok }}>
                            {t.card.verifiedBy}
                        </Typography>
                    )}
                </Box>
                <Box className="card-arrow" aria-hidden sx={{ alignSelf: 'flex-start', color: b.faint, transition: `color 200ms ${b.ease}, transform 200ms ${b.ease}` }}>
                    <FiArrowUpRight size={18} />
                </Box>
            </Box>

            {work && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, color: b.muted }}>
                    <FiBriefcase size={13} aria-hidden style={{ flexShrink: 0 }} />
                    <Typography noWrap sx={{ fontSize: 12.5, lineHeight: '18px', color: b.ink2 }}>{work}</Typography>
                </Box>
            )}

            {shown.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mt: 'auto', pt: 1.25, borderTop: `1px solid ${b.line}` }}>
                    <Box sx={{ color: b.faint, pt: '5px', flexShrink: 0 }}>
                        <FiGlobe size={13} aria-hidden />
                    </Box>
                    <Box component="ul" aria-label={t.card.languages} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexWrap: 'wrap', gap: 0.5, minWidth: 0 }}>
                        {shown.map((l) => <LanguageChip key={l.id ?? l.name} entry={l} lang={lang} />)}
                        {more > 0 && (
                            <Box component="li" sx={{ display: 'inline-flex', alignItems: 'center', height: 24, px: 0.75, fontSize: 11.5, fontWeight: 700, color: b.muted }}>
                                +{more}
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
            <LinkPendingOverlay />
        </Box>
    );
}
