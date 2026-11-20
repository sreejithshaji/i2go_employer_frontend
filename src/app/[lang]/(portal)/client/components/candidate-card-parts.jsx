'use client';

import { Avatar, Box } from '@mui/material';
import { FiCheck } from 'react-icons/fi';
import { localName } from '@/lib/i18n/config';
import { initials } from '@/lib/portal/format';
import { brand as b } from '@/app/theme';
import LockedPhoto, { showsLockedPhoto } from './locked-photo';

// Pieces of the one candidate card design (Task 14.3a), shared by the portal
// card (candidate-card.jsx) and the homepage strip (compact-candidate-card.jsx).

export const MAX_LANGUAGES = 3;

/**
 * Photo (or locked blurhash / initials for guests) with a small verified tick.
 * `size` gives a round avatar; `width` + `height` give a rounded portrait.
 */
export function CandidateAvatar({ candidate, size = 44, width, height }) {
    const locked = showsLockedPhoto(candidate);
    const portrait = Boolean(width && height);
    const w = portrait ? width : size;
    const h = portrait ? height : size;
    const base = Math.min(w, h);
    const tick = portrait ? 22 : 16;
    return (
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
                src={candidate.photo_url || undefined}
                alt=""
                variant={portrait ? 'rounded' : 'circular'}
                sx={{
                    width: w, height: h, fontSize: base * 0.36, fontWeight: 700, bgcolor: b.accentSoft, color: b.accentText,
                    ...(portrait && { borderRadius: '12px', border: `1px solid ${b.line}`, '& img': { objectPosition: 'center 25%' } }),
                }}
            >
                {locked ? <LockedPhoto hash={candidate.photo_blurhash} iconSize={Math.round(base * 0.28)} /> : initials(candidate.name)}
            </Avatar>
            {candidate.is_verified && (
                <Box
                    component="span"
                    aria-hidden
                    sx={{
                        position: 'absolute', right: portrait ? -5 : -2, bottom: portrait ? -5 : -2, width: tick, height: tick, borderRadius: 999,
                        display: 'grid', placeItems: 'center', bgcolor: b.ok, color: '#fff', boxShadow: '0 0 0 2px #fff',
                    }}
                >
                    <FiCheck size={portrait ? 13 : 10} strokeWidth={3.5} />
                </Box>
            )}
        </Box>
    );
}

/** German first (what employers filter on), then the strongest level. */
export function sortedLanguages(languages = []) {
    return [...languages].sort((x, y) => (y.code === 'de') - (x.code === 'de') || (y.level_rank ?? 0) - (x.level_rank ?? 0));
}

export function LanguageChip({ entry, lang }) {
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
