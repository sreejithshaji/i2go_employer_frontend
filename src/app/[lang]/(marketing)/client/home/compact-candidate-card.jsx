'use client';

import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { FiArrowUpRight, FiBriefcase, FiGlobe } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { localName } from '@/lib/i18n/config';
import { candidateHref } from '@/lib/i18n/routes';
import { shortYearsLabel } from '@/lib/portal/format';
import { brand as b } from '@/app/theme';
import LinkPendingOverlay from '@/components/link-pending-overlay';
import { CandidateAvatar, LanguageChip, MAX_LANGUAGES, sortedLanguages } from '@/app/[lang]/(portal)/client/components/candidate-card-parts';

export { CandidateAvatar };

/**
 * Candidate card for the homepage strip: photo, name, job category, current
 * role with experience, and the languages they speak (German first, with
 * level and a tick when certified). Links to the profile. `tabIndex` lets a
 * hidden duplicate copy (the looping strip) stay out of the tab order.
 */
export default function CompactCandidateCard({ candidate, tabIndex }) {
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
            tabIndex={tabIndex}
            sx={{
                position: 'relative', display: 'flex', flexDirection: 'column', gap: 1.25, height: '100%', minWidth: 0,
                p: 1.75, borderRadius: `${b.radiusMd}px`,
                bgcolor: b.surface, border: `1px solid ${b.line}`, boxShadow: b.shadow1,
                color: 'inherit', textDecoration: 'none',
                // Card hover of the marketing pages (plan §10).
                transition: `border-color 280ms ${b.ease}, box-shadow 280ms ${b.ease}, transform 280ms ${b.ease}`,
                '&:hover': { borderColor: b.lineHover, boxShadow: b.shadow2, transform: 'translateY(-1px)' },
                '&:hover .card-arrow': { color: b.accent, transform: 'translate(2px, -2px)' },
                '&:focus-visible': b.focusRing,
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
                        <Typography noWrap sx={{ fontSize: 11.5, fontWeight: 600, lineHeight: '16px', color: b.okText }}>
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
