'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Alert, Avatar, Box, Button, ButtonBase, Divider, Drawer, IconButton, ListItemIcon, Menu, MenuItem,
    Stack, Tooltip, Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { keyframes } from '@emotion/react';
import { FiArrowLeft, FiBookOpen, FiChevronDown, FiClock, FiHeart, FiHome, FiInbox, FiLogOut, FiMenu, FiSidebar, FiUsers } from 'react-icons/fi';
import Breadcrumbs from '@/components/breadcrumbs';
import ScrollToTop from '@/components/scroll-to-top';
import { SignInButton, useAuth } from '@/features/auth';
import { LanguageSwitcher, useI18n } from '@/features/i18n';
import { format, isLocale } from '@/lib/i18n/config';
import { guidesSegment, hubSegment, parseCandidateSegment } from '@/lib/i18n/routes';
import { CandidateDetailSkeleton, CandidateListSkeleton } from '@/app/[lang]/(portal)/client/components/page-skeletons';
import { HeaderSlotContext } from './header-slot';
import { usePendingPath } from './use-pending-path';
import { startNavigation } from '@/components/navigation-progress/progress-store';
import { useSidebarCollapsed } from './use-sidebar-collapsed';
import { initials } from '@/lib/portal/format';
import { legalLinks } from '@/lib/portal/legal';
import MarketingFooter from '@/app/[lang]/(marketing)/client/components/marketing-footer';
import Eyebrow from '@/app/[lang]/(marketing)/client/components/eyebrow';
import { brand, tokens } from '@/app/theme';

// Wishlist is shown to guests too (it leads to sign in); candidate accounts can't keep one.
// Recently viewed (6.20) lives in the browser, so guests and employers both have it.
function navItems({ user, isEmployer, wishlistCount, t, p }) {
    return [
        { to: p.home, label: t.nav.home, icon: <FiHome size={20} />, end: true },
        { to: p.hub, label: t.nav.findCandidate, icon: <FiUsers size={20} /> },
        { to: p.guides, label: t.nav.guides, icon: <FiBookOpen size={20} /> },
        ...(!user || isEmployer
            ? [
                { to: p.wishlist, label: t.nav.wishlist, icon: <FiHeart size={20} />, badge: isEmployer && wishlistCount > 0 ? wishlistCount : null },
                { to: p.recentlyViewed, label: t.nav.recentlyViewed, icon: <FiClock size={20} /> },
            ]
            : []),
        ...(isEmployer ? [{ to: p.enquiries, label: t.nav.enquiries, icon: <FiInbox size={20} /> }] : []),
    ];
}

/**
 * Header title, back arrow and breadcrumbs for each route. Pages in the SEO
 * tree (category, skill, candidate, guide) render their own breadcrumbs, and
 * category, skill and guide pages their own h1 (`titleAs` keeps the header's
 * title out of the outline).
 */
function routeMeta(pathname, lang, t, p) {
    const segments = pathname.split('/').filter(Boolean).slice(1);
    const [first] = segments;
    const home = { label: t.nav.home, to: p.home };
    if (first === hubSegment(lang)) {
        if (segments.length === 1) {
            // No visible title or breadcrumb (the h1 stays for screen readers). On desktop the
            // page renders its search bar into the header row (see headerSlot).
            return { title: t.meta.hubTitle, hideTitle: true, headerSearch: true };
        }
        if (parseCandidateSegment(segments[segments.length - 1]) != null) {
            return { title: t.shell.profileTitle, back: true };
        }
        return { title: t.nav.candidates, hideTitle: true, titleAs: 'p', headerSearch: true };
    }
    if (first === guidesSegment(lang)) {
        return segments.length === 1
            ? { title: t.seo.guidesTitle, crumbs: [home, { label: t.nav.guides }] }
            : { title: t.nav.guides, titleAs: 'p' };
    }
    if (first === 'wishlist') return { title: t.nav.wishlist, crumbs: [home, { label: t.nav.wishlist }] };
    if (first === 'recently-viewed') return { title: t.nav.recentlyViewed, crumbs: [home, { label: t.nav.recentlyViewed }] };
    if (first === 'enquiries') return { title: t.nav.enquiries, crumbs: [home, { label: t.nav.enquiries }] };
    if (['impressum', 'privacy', 'terms'].includes(first) && segments.length === 1) {
        return { title: t.legal[first], crumbs: [home, { label: t.legal[first] }] };
    }
    return { title: t.shell.homeTitle };
}

const pageIn = keyframes`
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: none; }
`;

const bg = tokens.background;
const b = brand;

// Scrolled past 8px, like the homepage nav (marketing-nav.jsx readTone): the
// sticky header only draws its hairline once content slides under it.
const subscribeScroll = (onChange) => {
    window.addEventListener('scroll', onChange, { passive: true });
    return () => window.removeEventListener('scroll', onChange);
};
const readScrolled = () => window.scrollY > 8;
const readNotScrolled = () => false;

// The homepage nav's light glass (marketing-nav.jsx `surfaces.light`).
const navGlass = 'rgba(252,254,255,0.72)';
const navBlur = 'blur(16px)';
const navHairline = 'rgba(13,42,66,0.06)';

// Light rail (your choice, 2026-11-19): white with a hairline edge, like the homepage's
// light top bar. Dark navy stays for highlight panels; it shows up here only in the
// active item, the reference's "selected" state (graphite pill, cyan icon, plan §1.7).
const navItemSx = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    minHeight: 48,
    mx: 1.5,
    px: 1,
    borderRadius: `${b.radiusSm + 2}px`,
    color: b.ink2,
    fontSize: 13.5,
    fontWeight: 700,
    letterSpacing: '-0.1px',
    textDecoration: 'none',
    transition: `background-color 250ms ${b.ease}, color 250ms ${b.ease}`,
    '& .nav-tile': {
        width: 34, height: 34, flexShrink: 0, borderRadius: '10px', display: 'grid', placeItems: 'center',
        bgcolor: b.surface3, border: `1px solid ${b.line}`, color: b.muted,
        transition: `background-color 250ms ${b.ease}, color 250ms ${b.ease}, border-color 250ms ${b.ease}`,
    },
    // Decorative two-digit numbers (aria-hidden), as on the reference rail.
    '& .nav-num': {
        ml: 'auto', pr: 0.5, fontSize: 9, fontWeight: 800, letterSpacing: '0.17em', color: b.faint,
        fontVariantNumeric: 'tabular-nums',
    },
    '&:hover': { color: b.ink, bgcolor: 'rgba(13,42,66,0.05)' },
    '&:hover .nav-tile': { color: b.ink, borderColor: b.line2, bgcolor: b.surface },
    '&:focus-visible': b.focusRing,
    '& .nav-badge': {
        ml: 'auto', minWidth: 22, height: 20, px: 0.75, borderRadius: 999,
        display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800,
        bgcolor: b.accentSoft, color: b.accentText, border: `1px solid ${b.accentLine}`,
    },
    '& .nav-badge + .nav-num': { ml: 1 },
    '&.active, &.active:hover': { color: '#fff', bgcolor: b.graphite, boxShadow: b.shadow2 },
    '&.active .nav-tile': { bgcolor: 'rgba(31,200,255,0.10)', color: b.cyan, borderColor: 'rgba(31,200,255,0.28)' },
    '&.active .nav-num': { color: b.cyan },
    '&.active .nav-badge': { bgcolor: 'rgba(31,200,255,0.14)', color: b.cyan, borderColor: 'rgba(31,200,255,0.28)' },
};

// Labels fade out when the sidebar is collapsed to icons; a count badge moves onto the icon.
const fadeSx = { whiteSpace: 'nowrap', transition: `opacity 150ms ${b.ease}` };
const collapsedSx = {
    '& .fade, & .nav-num': { opacity: 0 },
    '& .nav-badge': { position: 'absolute', top: 2, left: 30, ml: 0, minWidth: 18, height: 18, px: 0.5, fontSize: 10 },
};

function Brand() {
    const { t, p } = useI18n();
    return (
        <Box
            component={NextLink}
            href={p.home}
            sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', mx: 2.25,
                borderRadius: `${b.radiusSm}px`, '&:focus-visible': b.focusRing,
            }}
        >
            {/* White badge tile with the reference's cyan hairline along the bottom edge */}
            <Box
                sx={{
                    position: 'relative', width: 44, height: 44, borderRadius: '13px', bgcolor: '#fff', overflow: 'hidden', border: `1px solid ${b.line}`,
                    display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: b.shadow1,
                    '&::after': {
                        content: '""', position: 'absolute', left: 6, right: 6, bottom: 0, height: 1.5,
                        background: `linear-gradient(90deg, transparent, ${brand.cyan}, transparent)`,
                    },
                }}
            >
                <Image src="/images/i2go_mark.png" alt="" width={36} height={21} style={{ objectFit: 'contain' }} />
            </Box>
            <Box className="fade" sx={fadeSx}>
                <Typography sx={{ color: b.ink, fontFamily: 'inherit', fontSize: 18, fontWeight: 800, letterSpacing: '-0.4px', lineHeight: '22px' }}>I2Go</Typography>
                <Typography sx={{ color: b.muted, fontFamily: 'inherit', fontSize: 11, fontWeight: 600 }}>{t.common.brandTag}</Typography>
            </Box>
        </Box>
    );
}

function isActive(pathname, item) {
    return item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
}

/**
 * The skeleton for a page in this shell that the server renders per request
 * (the candidate tree), shown while a click on a link to it is under way. Other
 * pages are static or load their own data, and appear at once. Home has its own
 * layout ((marketing)) and no skeleton here.
 */
function pendingSkeleton(path) {
    const [lang, first, ...rest] = path.split('/').filter(Boolean);
    if (!isLocale(lang) || first !== hubSegment(lang)) return null;
    return parseCandidateSegment(rest[rest.length - 1]) != null ? <CandidateDetailSkeleton /> : <CandidateListSkeleton />;
}

/**
 * Sidebar contents; the drawer version also carries the account controls. `pathname` may be a page still loading.
 * `collapsed` (desktop only) shows the icons alone, with the labels as tooltips.
 */
function SidebarContent({ items, pathname, onNavigate, account, collapsed = false }) {
    const { lang, t } = useI18n();
    return (
        <Box
            sx={{
                position: 'relative', height: '100%', color: b.ink2, fontFamily: b.fontFamily,
                bgcolor: b.surface, borderRight: `1px solid ${b.line}`,
                ...(collapsed && collapsedSx),
            }}
        >
            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', pt: 3.5, pb: 3, overflowY: 'auto', overflowX: 'hidden' }}>
                <Brand />
                <Box sx={{ mx: 2.25, mt: 3.5, mb: 1.5, height: '1px', bgcolor: b.line }} />
                <Box component="nav" aria-label={t.common.mainNav} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 1 }}>
                    {items.map((item, i) => (
                        <Tooltip key={item.to} title={collapsed ? item.label : ''} placement="right">
                            <Box
                                component={NextLink}
                                href={item.to}
                                className={isActive(pathname, item) ? 'active' : undefined}
                                aria-current={isActive(pathname, item) ? 'page' : undefined}
                                onClick={onNavigate}
                                sx={navItemSx}
                            >
                                <Box component="span" className="nav-tile">{item.icon}</Box>
                                <Box component="span" className="fade" sx={fadeSx}>{item.label}</Box>
                                {item.badge != null && (
                                    <Box component="span" className="nav-badge" aria-label={format(t.nav.wishlistBadge, { count: item.badge })}>
                                        {item.badge}
                                    </Box>
                                )}
                                <Box component="span" className="nav-num" aria-hidden>{String(i + 1).padStart(2, '0')}</Box>
                            </Box>
                        </Tooltip>
                    ))}
                </Box>
                {/* The site footer lives under the page content (MarketingFooter); the drawer adds the account card here */}
                {account && <Box sx={{ mt: 'auto', px: 2.25, pt: 4 }}>{account}</Box>}
                {/* Legal links, one click from every page (Impressum: §5 DDG); collapsed, the page footer still has them */}
                <Box
                    component="nav"
                    aria-label={t.common.legalNav}
                    sx={{
                        mt: account ? 2 : 'auto', mx: 2.25, pt: account ? 0 : 2.5,
                        borderTop: account ? 'none' : `1px solid ${b.line}`,
                        display: collapsed ? 'none' : 'flex', flexWrap: 'wrap', columnGap: 1.5, rowGap: 0.5,
                    }}
                >
                    {legalLinks(lang).map((link) => (
                        <Box
                            key={link.href}
                            component={NextLink}
                            href={link.href}
                            onClick={onNavigate}
                            sx={{
                                color: b.muted, fontSize: 11.5, fontWeight: 600, textDecoration: 'none', borderRadius: '4px',
                                '&:hover': { color: b.ink, textDecoration: 'underline' }, '&:focus-visible': b.focusRing,
                            }}
                        >
                            {t.legal[link.key]}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

/** Sidebar, header, breadcrumbs and footer around every page except login and signup, in the page language. */
export default function AppShell({ children }) {
    const { user, profile, isEmployer, isOtherAccount, needsTerms, savedIds, signOutAndGo } = useAuth();
    const { lang, t, p } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    // A link just clicked: menu, title and a skeleton switch to it before the page arrives.
    const { pendingPath, slow } = usePendingPath();
    const shownPath = pendingPath ?? pathname;
    const skeleton = pendingPath && slow ? pendingSkeleton(pendingPath) : null;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [collapsed, toggleCollapsed, animateCollapse] = useSidebarCollapsed();
    const [menuAnchor, setMenuAnchor] = useState(null);
    // Element in the header row that a page can portal content into (Candidates' search bar, via HeaderSlotContext).
    const [headerSlot, setHeaderSlot] = useState(null);

    const items = navItems({ user, isEmployer, wishlistCount: savedIds.length, t, p });
    const meta = routeMeta(shownPath, lang, t, p);
    const scrolled = useSyncExternalStore(subscribeScroll, readScrolled, readNotScrolled);
    const displayName = profile?.full_name || user?.email || '';

    // Home first, then the session ends (AuthProvider: home is outside this shell).
    const handleSignOut = () => {
        setMenuAnchor(null);
        setDrawerOpen(false);
        signOutAndGo(p.home);
    };

    // Whether the user has moved to another page since the shell loaded, so Back has a page of ours
    // to return to. Compared with the first path (not counted) so effects running twice in dev don't matter.
    const firstPath = useRef(pathname);
    const navigated = useRef(false);
    useEffect(() => {
        if (pathname !== firstPath.current) navigated.current = true;
    }, [pathname]);

    // Back to the list the user came from (keeping its filters), or to all candidates.
    const goBack = () => {
        if (navigated.current) {
            startNavigation();
            router.back();
        } else {
            startNavigation(p.hub);
            router.push(p.hub);
        }
    };

    const railButtonSx = {
        color: b.ink2, fontWeight: 700, border: `1px solid ${b.line2}`, bgcolor: b.surface, borderRadius: `${b.radiusButton}px`,
        '&:hover': { bgcolor: b.surface, borderColor: b.lineHover }, '&:focus-visible': b.focusRing,
    };
    const drawerAccount = (
        <Box sx={{ p: 2, borderRadius: `${b.radiusMd}px`, bgcolor: b.surface3, border: `1px solid ${b.line}` }}>
            {user ? (
                <>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: b.graphite, color: b.cyan, border: '1px solid rgba(31,200,255,0.28)', fontSize: 13, fontWeight: 800 }}>
                            {initials(displayName) || '?'}
                        </Avatar>
                        <Typography noWrap sx={{ color: b.ink, fontFamily: 'inherit', fontWeight: 700, minWidth: 0 }}>{displayName}</Typography>
                    </Stack>
                    <Button fullWidth onClick={handleSignOut} startIcon={<FiLogOut />} sx={railButtonSx}>
                        {t.common.signOut}
                    </Button>
                </>
            ) : (
                <Stack spacing={1}>
                    <Button variant="cta" size="small" component={NextLink} href={p.signup} onClick={() => setDrawerOpen(false)}>
                        {t.common.createAccount}
                    </Button>
                    <SignInButton onClick={() => setDrawerOpen(false)} sx={railButtonSx}>
                        {t.common.signIn}
                    </SignInButton>
                </Stack>
            )}
            <LanguageSwitcher
                onNavigate={() => setDrawerOpen(false)}
                sx={{ mt: 1.5, color: b.muted, fontSize: 13, fontWeight: 600, '&:hover': { color: b.ink } }}
            />
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: bg }}>
            <Box
                component="aside"
                sx={{
                    display: { xs: 'none', md: 'block' }, flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
                    width: collapsed ? tokens.sidebarCollapsedWidth : tokens.sidebarWidth,
                    transition: animateCollapse ? `width 200ms ${b.ease}` : 'none',
                }}
            >
                <SidebarContent items={items} pathname={shownPath} collapsed={collapsed} />
            </Box>

            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                slotProps={{ paper: { sx: { width: 288, border: 0, bgcolor: b.surface, borderRadius: 0 } } }}
                sx={{ display: { md: 'none' } }}
            >
                <SidebarContent items={items} pathname={shownPath} onNavigate={() => setDrawerOpen(false)} account={drawerAccount} />
            </Drawer>

            <Box sx={{ flex: 1, minWidth: 0, bgcolor: bg, display: 'flex', flexDirection: 'column' }}>
                <Box
                    component="header"
                    sx={{
                        position: { xs: 'sticky', md: meta.headerSearch ? 'sticky' : 'static' }, top: 0, zIndex: 10,
                        display: 'flex', alignItems: { xs: 'center', md: meta.headerSearch ? 'flex-start' : 'center' },
                        gap: { xs: 1, md: 2 },
                        minHeight: { xs: 64, md: meta.headerSearch ? 88 : 112 }, px: { xs: 2, md: 4, lg: 5 }, py: { md: meta.headerSearch ? 2 : 0 },
                        // Frosted glass behind the sticky search row; the blur lives here (not on the
                        // search card) because a nested backdrop-filter can't see past its parent.
                        // Phones: the homepage's light frosted top bar (matches the light rail, 13.1b).
                        // Desktop: the homepage nav's white glass, hairline only after scrolling (14.12).
                        bgcolor: { xs: 'rgba(255,255,255,0.86)', md: meta.headerSearch ? navGlass : 'transparent' },
                        backdropFilter: { xs: 'blur(14px) saturate(180%)', md: meta.headerSearch ? navBlur : 'none' },
                        WebkitBackdropFilter: { xs: 'blur(14px) saturate(180%)', md: meta.headerSearch ? navBlur : 'none' },
                        borderBottom: {
                            xs: `1px solid ${b.line}`,
                            md: `1px solid ${meta.headerSearch && scrolled ? navHairline : 'transparent'}`,
                        },
                        transition: `border-color 250ms ${b.ease}`,
                    }}
                >
                    <Tooltip title={collapsed ? t.common.expandMenu : t.common.collapseMenu}>
                        <IconButton
                            onClick={toggleCollapsed}
                            aria-label={collapsed ? t.common.expandMenu : t.common.collapseMenu}
                            aria-expanded={!collapsed}
                            sx={{ display: { xs: 'none', md: 'inline-flex' }, color: b.muted, ml: -1, mt: { md: meta.headerSearch ? 0.5 : 0 }, '&:hover': { color: b.ink } }}
                        >
                            <FiSidebar size={20} />
                        </IconButton>
                    </Tooltip>
                    {meta.back && (
                        <Tooltip title={t.common.back}>
                            <IconButton onClick={goBack} aria-label={t.common.back} sx={{ color: 'text.primary', ml: { xs: -1, md: 0 } }}>
                                <FiArrowLeft size={22} />
                            </IconButton>
                        </Tooltip>
                    )}
                    {/* Homepage heading pattern (14.2c): eyebrow, then a heavy, tight title.
                        The lead line under it is each page's PageIntro. */}
                    <Box sx={meta.hideTitle ? visuallyHidden : { minWidth: 0 }}>
                        <Eyebrow sx={{ display: { xs: 'none', md: 'block' }, mb: 0.75 }}>{t.common.brandTag}</Eyebrow>
                        <Typography
                            variant="h1"
                            component={meta.titleAs ?? 'h1'}
                            noWrap
                            sx={{ fontSize: { xs: 20, md: 32 }, lineHeight: { xs: '26px', md: '38px' }, letterSpacing: { xs: '-0.4px', md: '-1px' } }}
                        >
                            {meta.title}
                        </Typography>
                    </Box>
                    {meta.headerSearch && (
                        <>
                            <Box ref={setHeaderSlot} sx={{ display: { xs: 'none', md: 'block' }, flex: 1, minWidth: 0 }} />
                            <Box component={NextLink} href={p.home} sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.25, textDecoration: 'none' }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '11px', bgcolor: '#fff', border: `1px solid ${b.line}`, boxShadow: b.shadow1, display: 'grid', placeItems: 'center' }}>
                                    <Image src="/images/i2go_mark.png" alt="" width={32} height={19} style={{ objectFit: 'contain' }} />
                                </Box>
                                <Typography sx={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.4px', color: b.ink }}>I2Go</Typography>
                            </Box>
                        </>
                    )}
                    <Box sx={{ flex: 1, display: { md: meta.headerSearch ? 'none' : 'block' } }} />

                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, flexShrink: 0,
                            // Centred against the 56px search bar when it shares the row.
                            minHeight: meta.headerSearch ? 56 : undefined,
                            '& .MuiButton-root': { whiteSpace: 'nowrap' },
                        }}
                    >
                        <LanguageSwitcher
                            sx={{
                                height: 40, px: 1.25, borderRadius: 999, color: b.muted, fontSize: 14, fontWeight: 700,
                                '&:hover': { color: b.ink, bgcolor: b.surface, boxShadow: b.shadow1 },
                                '&:focus-visible': { outline: 'none', boxShadow: tokens.focusRing },
                            }}
                        />
                        {user ? (
                            <>
                                <ButtonBase
                                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                                    aria-label={t.common.account}
                                    aria-haspopup="menu"
                                    sx={{
                                        gap: 1.5, py: 0.75, pl: 0.75, pr: 1.5, borderRadius: 999, textAlign: 'left',
                                        transition: `background-color 150ms ${b.ease}`,
                                        '&:hover': { bgcolor: b.surface, boxShadow: b.shadow1 },
                                        '&:focus-visible': { boxShadow: tokens.focusRing },
                                    }}
                                >
                                    <Avatar sx={{ width: 40, height: 40, bgcolor: b.graphite, color: b.cyan, border: '1px solid rgba(31,200,255,0.28)', fontSize: 15, fontWeight: 800 }}>
                                        {initials(displayName) || '?'}
                                    </Avatar>
                                    {/* Avatar only at laptop widths when the search bar shares the row */}
                                    <Box
                                        sx={{
                                            maxWidth: 200,
                                            display: { md: meta.headerSearch ? 'none' : 'block' },
                                            '@media (min-width:1360px)': { display: 'block' },
                                        }}
                                    >
                                        <Typography noWrap sx={{ fontWeight: 700, color: b.ink, lineHeight: '20px' }}>{displayName}</Typography>
                                        <Typography variant="caption" color="text.secondary">{isEmployer ? t.common.employer : t.common.signedIn}</Typography>
                                    </Box>
                                    <FiChevronDown color={b.muted} />
                                </ButtonBase>
                                <Menu
                                    anchorEl={menuAnchor}
                                    open={!!menuAnchor}
                                    onClose={() => setMenuAnchor(null)}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    slotProps={{ paper: { sx: { mt: 1 } } }}
                                >
                                    <Box sx={{ px: 1.5, py: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: b.ink }}>{displayName}</Typography>
                                        {profile?.full_name && (
                                            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                        )}
                                    </Box>
                                    <Divider sx={{ my: 0.5 }} />
                                    <MenuItem onClick={handleSignOut}>
                                        <ListItemIcon sx={{ color: 'text.secondary' }}><FiLogOut size={18} /></ListItemIcon>
                                        {t.common.signOut}
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <SignInButton>{t.common.signIn}</SignInButton>
                                <Button component={NextLink} href={p.signup} variant="cta">{t.common.createAccount}</Button>
                            </>
                        )}
                    </Box>

                    <IconButton
                        sx={{ display: { xs: 'inline-flex', md: 'none' }, color: b.ink, mr: -1 }}
                        onClick={() => setDrawerOpen(true)}
                        aria-label={t.common.openMenu}
                    >
                        <FiMenu size={22} />
                    </IconButton>
                </Box>

                <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 4, lg: 5 }, pt: { xs: 2.5, md: 0.5 }, pb: { xs: 5, md: 8 }, width: '100%', maxWidth: 1440 }}>
                    {meta.crumbs && (
                        <Breadcrumbs
                            label={t.common.breadcrumb}
                            items={meta.crumbs.map((crumb) => ({ label: crumb.label, href: crumb.to }))}
                            sx={{ mt: { md: -1 } }}
                        />
                    )}

                    {needsTerms && pathname !== p.terms && (
                        <Alert
                            severity="warning"
                            sx={{ mb: 3 }}
                            action={<Button component={NextLink} href={p.terms} color="inherit" size="small">{t.shell.reviewTerms}</Button>}
                        >
                            {profile?.terms_version ? t.shell.termsChanged : t.shell.termsNeeded}
                        </Alert>
                    )}
                    {isOtherAccount && (
                        <Alert severity="info" sx={{ mb: 3 }}>{t.shell.candidateAccount}</Alert>
                    )}

                    {skeleton ? (
                        <Box key={pendingPath} aria-busy="true">{skeleton}</Box>
                    ) : (
                        <Box key={pathname} sx={{ animation: `${pageIn} 240ms ${b.ease}` }}>
                            <HeaderSlotContext.Provider value={meta.headerSearch ? headerSlot : null}>
                                {children}
                            </HeaderSlotContext.Provider>
                        </Box>
                    )}

                </Box>

                {/* The homepage footer. Outside <main>, which grows (flex: 1), so it sits at
                    the bottom of the window on short pages. */}
                <MarketingFooter />
            </Box>
            {/* Lifted on candidate profiles, which have a sticky action bar on phones. */}
            <ScrollToTop raised={Boolean(meta.back)} />
        </Box>
    );
}
