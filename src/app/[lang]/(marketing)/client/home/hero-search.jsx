'use client';

import { useId, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, InputBase, Typography } from '@mui/material';
import { FiSearch } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';
import CtaButton from '../components/cta-button';
import { startNavigation } from '@/components/navigation-progress/progress-store';

const MAX_CHIPS = 6;
const MAX_CHIPS_MOBILE = 4;
const MAX_SUGGESTIONS = 6;
const MIN_QUERY = 2;

// Lower case without accents, so "kochin" finds "Köchin".
const fold = (text) => (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// How well `text` matches `q` (both folded): 0 starts with it, 1 a word starts
// with it, 2 contains it, null no match.
function rank(text, q) {
    const at = text.indexOf(q);
    if (at < 0) return null;
    if (at === 0) return 0;
    return /[\s/(-]/.test(text[at - 1]) ? 1 : 2;
}

/**
 * Up to MAX_SUGGESTIONS items whose name or other-language name (`alt`)
 * matches `query`: best match first, professions before skills, then by
 * live count and name.
 */
function findSuggestions(items, query) {
    const q = fold(query.trim());
    if (q.length < MIN_QUERY) return [];
    return items
        .map((item) => {
            const own = rank(fold(item.name), q);
            const alt = rank(fold(item.alt), q);
            const score = Math.min(own ?? 9, alt == null ? 9 : alt + 0.5);
            return score < 9 ? { item, score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.score - b.score
            || (a.item.kind === b.item.kind ? 0 : a.item.kind === 'profession' ? -1 : 1)
            || (b.item.count ?? 0) - (a.item.count ?? 0)
            || a.item.name.localeCompare(b.item.name))
        .slice(0, MAX_SUGGESTIONS)
        .map(({ item }) => item);
}

/**
 * Candidate search of the hero (plan §6 row 2, R1): a plain GET form to the
 * hub with `q`, so it works before JS has loaded (the hub reads `q` in
 * lib/portal/filters.js). Below it the most popular job categories as chips
 * with their live counts. `jobs`: [{ id, name, href, count }], most first.
 * `tone="dark"` for the navy hero: glowing form, translucent chips.
 *
 * While typing, a suggestion list (ARIA combobox, plan 9A.9.2) shows matching
 * live professions and skills from `suggestions`
 * ({ key, kind, name, alt, href, count? }, see page.jsx): a profession opens
 * its category page, a skill the hub searched for it. ↑ ↓ pick, Enter opens
 * the picked one (or submits the form when none is picked), Esc closes.
 */
export default function HeroSearch({ jobs = [], suggestions = [], tone = 'light' }) {
    const dark = tone === 'dark';
    const { t, p } = useI18n();
    const h = t.landing.hero;
    const popular = jobs.slice(0, MAX_CHIPS);
    const router = useRouter();
    const listId = useId();
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const matches = useMemo(() => findSuggestions(suggestions, query), [suggestions, query]);
    const expanded = open && matches.length > 0;
    const optionId = (i) => `${listId}-${i}`;

    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (!matches.length) return;
            event.preventDefault();
            setOpen(true);
            const step = event.key === 'ArrowDown' ? 1 : -1;
            // Cycles through the options and back to the input (-1).
            setActive((i) => {
                const next = i + step;
                if (next >= matches.length) return -1;
                return next < -1 ? matches.length - 1 : next;
            });
        } else if (event.key === 'Enter' && expanded && active >= 0 && matches[active]) {
            event.preventDefault();
            setOpen(false);
            startNavigation(matches[active].href);
            router.push(matches[active].href);
        } else if (event.key === 'Escape' && expanded) {
            event.preventDefault();
            setOpen(false);
            setActive(-1);
        }
    };
    return (
        <Box sx={{ mt: { xs: 3.5, md: 4.5 }, maxWidth: 760 }}>
            <Box
                component="form"
                method="get"
                action={p.hub}
                role="search"
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    gap: { xs: 1.25, md: 0.75 },
                    p: { md: '6px' },
                    borderRadius: { md: `${b.radiusButton + 4}px` },
                    border: { md: `1px solid ${b.line}` },
                    bgcolor: { md: b.surface },
                    boxShadow: { md: dark ? '0 18px 48px rgba(0,0,0,0.4), 0 0 0 4px rgba(31,200,255,0.08)' : b.shadow1 },
                    transition: `border-color 200ms ${b.ease}, box-shadow 200ms ${b.ease}`,
                    '@media (min-width: 900px)': {
                        '&:focus-within': {
                            borderColor: b.accent,
                            boxShadow: dark ? '0 18px 48px rgba(0,0,0,0.4), 0 0 0 4px rgba(31,200,255,0.22)' : b.shadow2,
                        },
                    },
                }}
            >
                <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <Box
                    component="label"
                    sx={{
                        flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1.25, px: 2, cursor: 'text',
                        height: { xs: 56, md: 50 },
                        borderRadius: `${b.radiusButton}px`,
                        border: { xs: `1px solid ${b.line}`, md: 'none' },
                        bgcolor: b.surface,
                        '@media (max-width: 899.95px)': {
                            '&:focus-within': { borderColor: b.accent },
                        },
                    }}
                >
                    <Box component="span" sx={visuallyHidden}>{h.searchLabel}</Box>
                    <Box component="span" aria-hidden sx={{ display: 'flex', color: b.faint }}>
                        <FiSearch size={20} />
                    </Box>
                    <InputBase
                        name="q"
                        type="search"
                        placeholder={h.searchPlaceholder}
                        autoComplete="off"
                        enterKeyHint="search"
                        value={query}
                        onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1); }}
                        onFocus={() => setOpen(true)}
                        onBlur={() => setOpen(false)}
                        onKeyDown={onKeyDown}
                        inputProps={{
                            role: 'combobox',
                            'aria-autocomplete': 'list',
                            'aria-expanded': expanded,
                            'aria-controls': listId,
                            'aria-activedescendant': expanded && active >= 0 ? optionId(active) : undefined,
                        }}
                        sx={{
                            flex: 1, minWidth: 0, fontSize: 15, fontWeight: 500, color: b.ink,
                            '& input::placeholder': { color: b.muted, opacity: 1 },
                            '& input::-webkit-search-cancel-button': { cursor: 'pointer' },
                        }}
                    />
                </Box>
                <Box
                    component="ul"
                    id={listId}
                    role="listbox"
                    aria-label={h.suggestionsLabel}
                    hidden={!expanded}
                    // Keep focus in the input so a click doesn't close the list first.
                    onMouseDown={(event) => event.preventDefault()}
                    sx={listSx}
                >
                    {expanded && matches.map((item, i) => (
                        <Box
                            component="li"
                            key={item.key}
                            id={optionId(i)}
                            role="option"
                            aria-selected={i === active}
                            onMouseEnter={() => setActive(i)}
                            sx={{ listStyle: 'none' }}
                        >
                            <Box
                                component={NextLink}
                                href={item.href}
                                tabIndex={-1}
                                onClick={() => setOpen(false)}
                                sx={{ ...optionSx, bgcolor: i === active ? b.accentSoft : 'transparent' }}
                            >
                                <Box component="span" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.name}
                                </Box>
                                <Box component="span" sx={{ fontSize: 12, fontWeight: 600, color: b.muted }}>
                                    {item.kind === 'profession' ? h.suggestProfession : h.suggestSkill}
                                </Box>
                                {item.count > 0 && (
                                    <Box component="span" sx={{ minWidth: 24, textAlign: 'right', fontSize: 12, fontWeight: 800, color: b.accentText }}>
                                        {item.count}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
                </Box>
                <CtaButton type="submit" sx={{ flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>
                    {h.searchButton}
                </CtaButton>
            </Box>

            {popular.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                    <Typography component="span" sx={{ fontSize: 12.5, fontWeight: 700, color: dark ? b.onDark.body : b.muted, mr: 0.5 }}>
                        {h.popular}
                    </Typography>
                    <Box component="ul" sx={{ display: 'contents', listStyle: 'none', m: 0, p: 0 }}>
                        {popular.map((job, i) => (
                            <Box
                                component="li"
                                key={job.id}
                                sx={{ display: { xs: i < MAX_CHIPS_MOBILE ? 'block' : 'none', md: 'block' } }}
                            >
                                <Box component={NextLink} href={job.href} sx={dark ? chipDarkSx : chipSx}>
                                    {job.name}
                                    <Box component="span" sx={{ fontSize: 11.5, fontWeight: 800, color: dark ? b.cyan : b.accentText }}>
                                        {job.count}
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

const chipSx = {
    display: 'inline-flex', alignItems: 'center', gap: 0.75,
    minHeight: { xs: 44, md: 36 }, px: 1.75, borderRadius: 999,
    bgcolor: b.surface3, border: `1px solid ${b.line2}`,
    fontSize: 13, fontWeight: 700, color: b.ink2, textDecoration: 'none',
    transition: `border-color 280ms ${b.ease}, background-color 280ms ${b.ease}, transform 280ms ${b.ease}`,
    '&:hover': { bgcolor: b.surface, borderColor: b.lineHover, transform: 'translateY(-1px)' },
    '&:focus-visible': { outline: `2px solid ${b.accent}`, outlineOffset: 3 },
};

const chipDarkSx = {
    ...chipSx,
    bgcolor: 'rgba(255,255,255,0.05)', border: `1px solid ${b.onDark.border}`, color: b.onDark.text,
    backdropFilter: 'blur(6px)',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(31,200,255,0.35)', transform: 'translateY(-1px)' },
    '&:focus-visible': { outline: `2px solid ${b.cyan}`, outlineOffset: 3 },
};

const listSx = {
    position: 'absolute', zIndex: 10, top: 'calc(100% + 8px)', left: 0, right: 0,
    m: 0, p: 0.75, maxHeight: 320, overflowY: 'auto',
    bgcolor: b.surface, border: `1px solid ${b.line}`, borderRadius: `${b.radiusButton}px`,
    boxShadow: b.shadow3,
    '&[hidden]': { display: 'none' },
};

const optionSx = {
    display: 'flex', alignItems: 'center', gap: 1.5,
    minHeight: 44, px: 1.5, borderRadius: `${b.radiusSm}px`,
    fontSize: 14.5, fontWeight: 600, color: b.ink, textDecoration: 'none',
};

const visuallyHidden = {
    // '1px' as strings: in sx a bare 1 means 100%.
    position: 'absolute', width: '1px', height: '1px', p: 0, m: '-1px', overflow: 'hidden',
    clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};
