'use client';

import { useContext, useEffect, useMemo, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Alert, Autocomplete, Box, Button, Card, Checkbox, Collapse, FormControlLabel, InputAdornment, MenuItem, Stack, TextField, Typography, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FiBriefcase, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import CandidateCard from '@/app/[lang]/(portal)/client/components/candidate-card';
import { HeaderSlotContext } from '@/components/app-shell/header-slot';
import CandidateGrid, { GridSkeleton } from '@/app/[lang]/(portal)/client/components/candidate-grid';
import EmptyState from '@/components/empty-state';
import Pagination from '@/components/pagination';
import { useI18n } from '@/features/i18n';
import { format, localName, plural } from '@/lib/i18n/config';
import { PAGE_SIZE } from '@/lib/portal/constants';
import { parseFilters } from '@/lib/portal/filters';
import { tokens } from '@/app/theme';

const EXPERIENCE_YEARS = [1, 2, 5, 10];

// Fields inside the search bar: borderless on desktop (the bar is the field),
// soft grey on phones so they still read as inputs.
const barFieldSx = {
    '& .MuiOutlinedInput-root': {
        minHeight: { xs: 48, md: 40 },
        bgcolor: { xs: tokens.surfaceMuted, md: 'transparent' },
        '&.Mui-focused': { boxShadow: { md: 'none' } },
    },
    '& .MuiOutlinedInput-notchedOutline': { border: { md: 0 } },
};

// From this width the header row has room for the Filters/Search labels; between md and
// this the buttons are icon-only so the bar fits beside the account controls.
const LABELS_QUERY = '(min-width:1360px)';
const LABELS_MEDIA = `@media ${LABELS_QUERY}`;

// Button text that hides while the bar is in its compact (icon-only) state.
const barLabelSx = { display: { xs: 'inline', md: 'none' }, [LABELS_MEDIA]: { display: 'inline' } };

// Drops the start icon's spacing while a bar button shows only its icon.
const compactIconSx = {
    '& .MuiButton-startIcon': { mr: { md: 0 }, ml: { md: 0 } },
    [LABELS_MEDIA]: { '& .MuiButton-startIcon': { mr: 1, ml: -0.5 } },
};

/**
 * Candidate list with search and filters, on the hub and on category and skill
 * pages. The server renders `candidates`, `total` and `categories` for the
 * filters in the URL; a filter change pushes a new URL and the server sends the
 * new list (the skeleton shows meanwhile). `scoped` hides the category field
 * (the page is already one category). `error`: false, 'error' or 'readLimit'
 * (the employer read limit).
 */
export default function CandidatesView({ candidates, total, categories, languages = [], error, scoped = false }) {
    const { lang, t } = useI18n();
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [loading, startTransition] = useTransition();
    // Pushes a history entry like React Router did, so Back undoes a filter change.
    const setParams = (next) => {
        const query = next.toString();
        startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
    };
    const filters = useMemo(() => parseFilters(params), [params]);

    const [search, setSearch] = useState(filters.q);
    const [showFilters, setShowFilters] = useState(false);
    // Desktop renders the search bar into the header slot that AppShell provides.
    const headerSlot = useContext(HeaderSlotContext);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
    const isWide = useMediaQuery(LABELS_QUERY, { noSsr: true });
    const searchInHeader = isDesktop && !!headerSlot;

    // Once the page scrolls under the sticky header, the bar gets a stronger shadow.
    const [searchStuck, setSearchStuck] = useState(false);
    useEffect(() => {
        const onScroll = () => setSearchStuck(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Updates URL params; any filter change goes back to page 1.
    const update = (changes, { keepPage = false } = {}) => {
        const next = new URLSearchParams(params.toString());
        for (const [key, value] of Object.entries(changes)) {
            if (value === '' || value == null || (Array.isArray(value) && value.length === 0)) next.delete(key);
            else next.set(key, Array.isArray(value) ? value.join(',') : String(value));
        }
        if (!keepPage) next.delete('page');
        setParams(next);
    };

    // Keep the search box in step with the URL (back/forward, Clear filters).
    // Adjusted while rendering when the URL's q changes, not in an effect.
    const [syncedQ, setSyncedQ] = useState(filters.q);
    if (filters.q !== syncedQ) {
        setSyncedQ(filters.q);
        if (search.trim() !== filters.q) setSearch(filters.q);
    }

    // Debounced name search.
    useEffect(() => {
        if (search.trim() === filters.q) return undefined;
        const timer = setTimeout(() => update({ q: search.trim() }), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const pageCount = Math.ceil(total / PAGE_SIZE);
    const categoryOptions = useMemo(
        () => [...categories].sort((a, b) => localName(a, lang).localeCompare(localName(b, lang), lang)),
        [categories, lang],
    );
    const selectedCategories = categoryOptions.filter((c) => filters.categoryIds.includes(c.id));
    // Filters behind the Filters button (categories have their own field).
    const hiddenFilterCount = [filters.minExperience, filters.germanLevel, filters.germanCertified, filters.languageId].filter(Boolean).length;
    // Language filters (migration 0024): German on its own, plus one other language.
    const german = languages.find((l) => l.code === 'de');
    const otherLanguages = languages
        .filter((l) => l.code !== 'de')
        .sort((a, b) => localName(a, lang).localeCompare(localName(b, lang), lang));
    const otherLanguage = otherLanguages.find((l) => l.id === filters.languageId);
    const levelName = (level) => localName(level, lang);
    // The URL keeps the English level name; match it case-insensitively.
    const levelValue = (language, name) => language?.levels.find((l) => l.name.toLowerCase() === (name ?? '').toLowerCase())?.name ?? '';
    const anyFilter = hiddenFilterCount > 0 || filters.categoryIds.length > 0 || !!filters.q;

    const clearAll = () => {
        setSearch('');
        setParams(new URLSearchParams());
    };

    // The Search button applies the typed name right away instead of after the debounce.
    const submitSearch = (event) => {
        event.preventDefault();
        if (search.trim() !== filters.q) update({ q: search.trim() });
    };

    const searchCard = (
        <Card
            component="form"
            role="search"
            onSubmit={submitSearch}
            sx={{
                p: { xs: 2, md: 1 }, pl: { md: 1.5 }, borderRadius: `${tokens.radiusXl}px`,
                transition: `box-shadow 200ms ${tokens.ease}, background-color 200ms ${tokens.ease}`,
                // In the header: a translucent glass panel over the header's blur.
                ...(searchInHeader
                    ? {
                        bgcolor: tokens.glassSurface,
                        border: `1px solid ${tokens.glassBorder}`,
                        boxShadow: searchStuck
                            ? `0 0 0 1px rgba(226,232,240,0.6), ${tokens.shadowPopover}`
                            : `inset 0 1px 0 rgba(255,255,255,0.6), ${tokens.shadowCard}`,
                    }
                    : { boxShadow: tokens.shadowCard }),
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.5}
                divider={<Box sx={{ display: { xs: 'none', md: 'block' }, width: '1px', height: 24, bgcolor: 'divider', alignSelf: 'center' }} />}
                sx={{ alignItems: { md: 'center' } }}
            >
                <TextField
                    placeholder={t.list.searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ ...barFieldSx, flex: { md: '1 1 0' }, minWidth: 0 }}
                    slotProps={{
                        input: { startAdornment: <InputAdornment position="start"><FiSearch size={18} color={tokens.primary} /></InputAdornment> },
                        htmlInput: { 'aria-label': t.list.searchPlaceholder },
                    }}
                />
                {!scoped && <Autocomplete
                    multiple
                    options={categoryOptions}
                    value={selectedCategories}
                    getOptionLabel={(option) => localName(option, lang)}
                    isOptionEqualToValue={(a, b) => a.id === b.id}
                    onChange={(_e, value) => update({ categories: value.map((c) => c.id) })}
                    renderInput={(props) => (
                        <TextField
                            {...props}
                            placeholder={selectedCategories.length ? '' : t.list.categoriesPlaceholder}
                            slotProps={{
                                input: {
                                    ...props.InputProps,
                                    startAdornment: (
                                        <>
                                            <InputAdornment position="start"><FiBriefcase size={18} color={tokens.primary} /></InputAdornment>
                                            {props.InputProps.startAdornment}
                                        </>
                                    ),
                                },
                                htmlInput: { ...props.inputProps, 'aria-label': t.list.categoriesLabel },
                            }}
                        />
                    )}
                    sx={{ width: { xs: '100%', md: 'auto' }, flex: { md: '1 1 0' }, minWidth: 0, maxWidth: { md: 360 }, ...barFieldSx }}
                    size="small"
                    limitTags={isWide ? 2 : 1}
                />}
                {/* Laptop widths (md only): icon-only buttons so the bar fits beside the account controls */}
                <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
                    <Button
                        variant="soft"
                        startIcon={<FiSliders />}
                        onClick={() => setShowFilters((v) => !v)}
                        aria-expanded={showFilters}
                        aria-label={hiddenFilterCount > 0 ? format(t.list.filtersActive, { count: hiddenFilterCount }) : t.list.filters}
                        sx={{
                            minHeight: { xs: 48, md: 40 }, minWidth: { md: 40 }, px: { xs: 2.5, md: 1.25 },
                            flex: { xs: 1, md: 'none' }, ...compactIconSx,
                            [LABELS_MEDIA]: { ...compactIconSx[LABELS_MEDIA], px: 2.5 },
                            ...(showFilters && { bgcolor: tokens.primarySoftHover }),
                        }}
                    >
                        <Box component="span" sx={barLabelSx}>{t.list.filters}{hiddenFilterCount > 0 ? ' ·' : ''}</Box>
                        {hiddenFilterCount > 0 && (
                            // Flex items drop trailing spaces, so the gap after "Filters ·" is a margin.
                            <Box component="span" sx={{ ml: { xs: 0.5, md: 0.75 }, [LABELS_MEDIA]: { ml: 0.5 } }}>{hiddenFilterCount}</Box>
                        )}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<FiSearch />}
                        aria-label={t.list.search}
                        sx={{
                            minHeight: { xs: 48, md: 40 }, minWidth: { md: 40 }, px: { xs: 3, md: 1.25 },
                            flex: { xs: 1, md: 'none' }, ...compactIconSx,
                            [LABELS_MEDIA]: { ...compactIconSx[LABELS_MEDIA], px: 3 },
                        }}
                    >
                        <Box component="span" sx={barLabelSx}>{t.list.search}</Box>
                    </Button>
                </Stack>
            </Stack>
            <Collapse in={showFilters}>
                <Box
                    sx={{
                        display: 'grid', gap: 1.5, mt: 1.5, pt: 2, px: { md: 1 }, pb: { md: 1 },
                        borderTop: `1px solid ${tokens.border}`,
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    }}
                >
                    <TextField select label={t.list.experience} value={filters.minExperience ? String(filters.minExperience) : ''} onChange={(e) => update({ exp: e.target.value })}>
                        <MenuItem value="">{t.list.experienceAny}</MenuItem>
                        {EXPERIENCE_YEARS.map((n) => <MenuItem key={n} value={String(n)}>{format(t.list.experienceMin, { count: n })}</MenuItem>)}
                    </TextField>
                    {german && (
                        <TextField select label={t.list.german} value={levelValue(german, filters.germanLevel)} onChange={(e) => update({ de: e.target.value })}>
                            <MenuItem value="">{t.list.levelAny}</MenuItem>
                            {german.levels.map((level) => <MenuItem key={level.name} value={level.name}>{format(t.list.levelMin, { level: levelName(level) })}</MenuItem>)}
                        </TextField>
                    )}
                    {german?.has_certificate && (
                        <FormControlLabel
                            control={<Checkbox checked={filters.germanCertified} onChange={(e) => update({ cert: e.target.checked ? '1' : '' })} />}
                            label={t.list.germanCertified}
                            sx={{ mr: 0 }}
                        />
                    )}
                    {otherLanguages.length > 0 && (
                        <TextField select label={t.list.otherLanguage} value={otherLanguage ? String(otherLanguage.id) : ''} onChange={(e) => update({ lang: e.target.value, lvl: '' })}>
                            <MenuItem value="">{t.list.languageAny}</MenuItem>
                            {otherLanguages.map((l) => <MenuItem key={l.id} value={String(l.id)}>{localName(l, lang)}</MenuItem>)}
                        </TextField>
                    )}
                    {otherLanguage && (
                        <TextField select label={t.list.otherLanguageLevel} value={levelValue(otherLanguage, filters.languageLevel)} onChange={(e) => update({ lvl: e.target.value })}>
                            <MenuItem value="">{t.list.levelAny}</MenuItem>
                            {otherLanguage.levels.map((level) => <MenuItem key={level.name} value={level.name}>{format(t.list.levelMin, { level: levelName(level) })}</MenuItem>)}
                        </TextField>
                    )}
                </Box>
            </Collapse>
        </Card>
    );

    return (
        <>
            {/* Desktop: the search bar lives in the (sticky) header row, next to the account controls */}
            {/* Before hydration (server HTML) the desktop copy stays hidden until it moves into the header, so the list doesn't jump */}
            {searchInHeader ? createPortal(searchCard, headerSlot) : <Box sx={{ mb: 3, display: { md: 'none' } }}>{searchCard}</Box>}

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3, mt: { md: 1 }, minHeight: 44 }}>
                <Box>
                    <Typography variant="subtitle1" component="h2" aria-live="polite">
                        {loading ? t.list.loading : plural(t.list.showing, total)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {anyFilter ? t.list.matching : t.list.newest}
                    </Typography>
                </Box>
                {anyFilter && (
                    <Button variant="soft" size="small" startIcon={<FiX />} onClick={clearAll}>{t.common.clearFilters}</Button>
                )}
            </Stack>

            {error && !loading ? (
                <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => startTransition(() => router.refresh())}>{t.common.retry}</Button>}>
                    {error === 'readLimit' ? t.list.readLimit : t.list.loadError}
                </Alert>
            ) : loading ? (
                <CandidateGrid><GridSkeleton count={8} /></CandidateGrid>
            ) : candidates.length === 0 ? (
                <EmptyState
                    title={t.list.emptyTitle}
                    message={anyFilter ? t.list.emptyFiltered : t.list.emptyNone}
                    action={anyFilter ? <Button variant="contained" onClick={clearAll}>{t.common.clearFilters}</Button> : null}
                />
            ) : (
                <>
                    <CandidateGrid>
                        {candidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)}
                    </CandidateGrid>
                    {pageCount > 1 && (
                        <Pagination
                            count={pageCount}
                            page={Math.min(filters.page, pageCount)}
                            total={total}
                            pageSize={PAGE_SIZE}
                            onChange={(page) => {
                                update({ page: page > 1 ? page : '' }, { keepPage: true });
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    )}
                </>
            )}
        </>
    );
}
