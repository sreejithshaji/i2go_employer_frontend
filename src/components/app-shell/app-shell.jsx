'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Alert, Avatar, Box, Button, ButtonBase, Divider, Drawer, IconButton, ListItemIcon, Menu, MenuItem,
    Stack, Tooltip, Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { keyframes } from '@emotion/react';
import { FiArrowLeft, FiBookOpen, FiChevronDown, FiHeart, FiHome, FiInbox, FiLogOut, FiMenu, FiUsers } from 'react-icons/fi';
import Breadcrumbs from '@/components/breadcrumbs';
import { SignInButton, useAuth } from '@/features/auth';
import { LanguageSwitcher, useI18n } from '@/features/i18n';
import { format, isLocale } from '@/lib/i18n/config';
import { guidesSegment, hubSegment, parseCandidateSegment } from '@/lib/i18n/routes';
import { CandidateDetailSkeleton, CandidateListSkeleton, HomeSkeleton } from '@/app/[lang]/(portal)/client/components/page-skeletons';
import { HeaderSlotContext } from './header-slot';
import { usePendingPath } from './use-pending-path';
import { initials } from '@/lib/portal/format';
import { legalLinks } from '@/lib/portal/legal';
import { tokens } from '@/app/theme';

// Wishlist is shown to guests too (it leads to sign in); candidate accounts can't keep one.
function navItems({ user, isEmployer, wishlistCount, t, p }) {
    return [
        { to: p.home, label: t.nav.home, icon: <FiHome size={20} />, end: true },
        { to: p.hub, label: t.nav.candidates, icon: <FiUsers size={20} /> },
        { to: p.guides, label: t.nav.guides, icon: <FiBookOpen size={20} /> },
        ...(!user || isEmployer
            ? [{ to: p.wishlist, label: t.nav.wishlist, icon: <FiHeart size={20} />, badge: isEmployer && wishlistCount > 0 ? wishlistCount : null }]
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
    if (segments.length === 0) return { title: t.shell.homeTitle };
    if (first === hubSegment(lang)) {
        if (segments.length === 1) {
            // No visible title or breadcrumb (the h1 stays for screen readers). On desktop the
            // page renders its search bar into the header row (see headerSlot).
            return { title: t.nav.candidates, hideTitle: true, headerSearch: true };
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
const navItemSx = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    height: 52,
    pl: 2.5,
    ml: 2,
    borderRadius: '12px 0 0 12px',
    color: tokens.sidebarText,
    fontSize: 15,
    fontWeight: 500,
    textDecoration: 'none',
    transition: `background-color 150ms ${tokens.ease}, color 150ms ${tokens.ease}`,
    '&:hover': { color: '#fff', bgcolor: tokens.sidebarHoverBg },
    '&:focus-visible': { outline: '2px solid #fff', outlineOffset: -2 },
    '& .nav-badge': {
        ml: 'auto', mr: 2, minWidth: 22, height: 22, px: 0.75, borderRadius: 999,
        display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600,
        bgcolor: 'rgba(255,255,255,0.18)', color: '#fff',
    },
    '&.active .nav-badge': { bgcolor: tokens.primarySoftHover, color: 'primary.main' },
    // The active item takes the canvas colour and "cuts into" the sidebar,
    // with inverted corners above and below it (as in UI_UX.md → Navigation).
    '&.active': {
        bgcolor: bg,
        color: 'primary.main',
        fontWeight: 600,
        borderRadius: '999px 0 0 999px',
        '&::before, &::after': {
            content: '""', position: 'absolute', right: 0, width: 20, height: 20, pointerEvents: 'none',
        },
        '&::before': { top: -20, borderBottomRightRadius: 20, boxShadow: `6px 6px 0 6px ${bg}` },
        '&::after': { bottom: -20, borderTopRightRadius: 20, boxShadow: `6px -6px 0 6px ${bg}` },
    },
};

function Brand() {
    const { t, p } = useI18n();
    return (
        <Box component={NextLink} href={p.home} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', px: 2.5 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: `${tokens.radiusMd}px`, bgcolor: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Image src="/images/i2go_mark.png" alt="" width={38} height={22} style={{ objectFit: 'contain' }} />
            </Box>
            <Box>
                <Typography sx={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: '24px' }}>I2Go</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{t.common.brandTag}</Typography>
            </Box>
        </Box>
    );
}

/** One-line site footer under the page content (wraps on narrow screens), with the legal links (10.10.3). */
function PageFooter() {
    const { lang, t } = useI18n();
    const linkSx = { color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } };
    const parts = [
        <Box key="name" component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>{t.common.footerName}</Box>,
        `© ${new Date().getFullYear()} I2Go Europe`,
        t.common.footerCandidates,
        ...legalLinks(lang).map((link) => (
            <Box key={link.href} component={NextLink} href={link.href} sx={linkSx}>
                {t.legal[link.key]}
            </Box>
        )),
        <LanguageSwitcher key="language" showIcon={false} sx={linkSx} />,
    ];
    return (
        <Box
            component="footer"
            sx={{
                mt: 3,
                display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center',
                columnGap: 1, fontSize: 12, lineHeight: '18px', color: 'text.disabled',
            }}
        >
            {parts.map((part, i) => (
                <Box key={i} component="span" sx={{ display: 'inline-flex', gap: 1 }}>
                    {i > 0 && <Box component="span" aria-hidden>·</Box>}
                    {part}
                </Box>
            ))}
        </Box>
    );
}

function isActive(pathname, item) {
    return item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
}

/**
 * The skeleton for a page the server renders per request (home and the
 * candidate tree), shown while a click on a link to it is under way. Other
 * pages are static or load their own data, and appear at once.
 */
function pendingSkeleton(path) {
    const [lang, first, ...rest] = path.split('/').filter(Boolean);
    if (!isLocale(lang)) return null;
    if (!first) return <HomeSkeleton />;
    if (first !== hubSegment(lang)) return null;
    return parseCandidateSegment(rest[rest.length - 1]) != null ? <CandidateDetailSkeleton /> : <CandidateListSkeleton />;
}

/** Sidebar contents; the drawer version also carries the account controls. `pathname` may be a page still loading. */
function SidebarContent({ items, pathname, onNavigate, account }) {
    const { lang, t } = useI18n();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: tokens.sidebarBg, color: '#fff', pt: 4, pb: 3, overflowY: 'auto', overflowX: 'hidden' }}>
            <Brand />
            <Box component="nav" aria-label={t.common.mainNav} sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1, py: 2.5 }}>
                {items.map((item) => (
                    <Box
                        key={item.to}
                        component={NextLink}
                        href={item.to}
                        className={isActive(pathname, item) ? 'active' : undefined}
                        aria-current={isActive(pathname, item) ? 'page' : undefined}
                        onClick={onNavigate}
                        sx={navItemSx}
                    >
                        {item.icon}
                        {item.label}
                        {item.badge != null && (
                            <Box component="span" className="nav-badge" aria-label={format(t.nav.wishlistBadge, { count: item.badge })}>
                                {item.badge}
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
            {/* The site footer lives under the page content (PageFooter); the drawer adds the account card here */}
            {account && <Box sx={{ mt: 'auto', px: 2.5, pt: 4 }}>{account}</Box>}
            {/* Legal links, one click from every page (Impressum: §5 DDG) */}
            <Box component="nav" aria-label={t.common.legalNav} sx={{ mt: account ? 2 : 'auto', px: 2.5, pt: account ? 0 : 4, display: 'flex', flexWrap: 'wrap', columnGap: 1.5, rowGap: 0.5 }}>
                {legalLinks(lang).map((link) => (
                    <Box
                        key={link.href}
                        component={NextLink}
                        href={link.href}
                        onClick={onNavigate}
                        sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, textDecoration: 'none', '&:hover': { color: '#fff', textDecoration: 'underline' } }}
                    >
                        {t.legal[link.key]}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

/** Sidebar, header, breadcrumbs and footer around every page except login and signup, in the page language. */
export default function AppShell({ children }) {
    const { user, profile, isEmployer, isOtherAccount, needsTerms, savedIds, signOut } = useAuth();
    const { lang, t, p } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    // A link just clicked: menu, title and a skeleton switch to it before the page arrives.
    const { pendingPath, slow } = usePendingPath();
    const shownPath = pendingPath ?? pathname;
    const skeleton = pendingPath && slow ? pendingSkeleton(pendingPath) : null;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    // Element in the header row that a page can portal content into (Candidates' search bar, via HeaderSlotContext).
    const [headerSlot, setHeaderSlot] = useState(null);

    const items = navItems({ user, isEmployer, wishlistCount: savedIds.length, t, p });
    const meta = routeMeta(shownPath, lang, t, p);
    const displayName = profile?.full_name || user?.email || '';

    // Go home first and end the session once we're there. Signing out on a page that
    // needs an employer (Wishlist, My enquiries) would otherwise redirect to login.
    const signOutOnHome = useRef(false);
    useEffect(() => {
        if (signOutOnHome.current && pathname === p.home) {
            signOutOnHome.current = false;
            signOut();
        }
    }, [pathname, signOut, p.home]);

    const handleSignOut = () => {
        setMenuAnchor(null);
        setDrawerOpen(false);
        if (pathname === p.home) {
            signOut();
        } else {
            signOutOnHome.current = true;
            router.push(p.home);
        }
    };

    // Whether the user has moved to another page since the shell loaded, so Back has a page of ours
    // to return to. Compared with the first path (not counted) so effects running twice in dev don't matter.
    const firstPath = useRef(pathname);
    const navigated = useRef(false);
    useEffect(() => {
        if (pathname !== firstPath.current) navigated.current = true;
    }, [pathname]);

    // Back to the list the user came from (keeping its filters), or to all candidates.
    const goBack = () => (navigated.current ? router.back() : router.push(p.hub));

    const drawerAccount = (
        <Box sx={{ p: 2, borderRadius: `${tokens.radiusLg}px`, bgcolor: 'rgba(255,255,255,0.10)' }}>
            {user ? (
                <>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#fff', color: 'primary.main', fontSize: 14, fontWeight: 600 }}>
                            {initials(displayName) || '?'}
                        </Avatar>
                        <Typography noWrap sx={{ color: '#fff', fontWeight: 600, minWidth: 0 }}>{displayName}</Typography>
                    </Stack>
                    <Button fullWidth onClick={handleSignOut} startIcon={<FiLogOut />} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                        {t.common.signOut}
                    </Button>
                </>
            ) : (
                <Stack spacing={1}>
                    <Button component={NextLink} href={p.signup} onClick={() => setDrawerOpen(false)} sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: tokens.primarySoft } }}>
                        {t.common.createAccount}
                    </Button>
                    <SignInButton onClick={() => setDrawerOpen(false)} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                        {t.common.signIn}
                    </SignInButton>
                </Stack>
            )}
            <LanguageSwitcher
                onNavigate={() => setDrawerOpen(false)}
                sx={{ mt: 1.5, color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, '&:hover': { color: '#fff' } }}
            />
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: { xs: bg, md: tokens.sidebarBg } }}>
            <Box
                component="aside"
                sx={{ display: { xs: 'none', md: 'block' }, width: tokens.sidebarWidth, flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}
            >
                <SidebarContent items={items} pathname={shownPath} />
            </Box>

            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                slotProps={{ paper: { sx: { width: 280, border: 0, bgcolor: tokens.sidebarBg, borderRadius: 0 } } }}
                sx={{ display: { md: 'none' } }}
            >
                <SidebarContent items={items} pathname={shownPath} onNavigate={() => setDrawerOpen(false)} account={drawerAccount} />
            </Drawer>

            <Box sx={{ flex: 1, minWidth: 0, bgcolor: bg, borderTopLeftRadius: { md: tokens.radius2xl }, display: 'flex', flexDirection: 'column' }}>
                <Box
                    component="header"
                    sx={{
                        position: { xs: 'sticky', md: meta.headerSearch ? 'sticky' : 'static' }, top: 0, zIndex: 10,
                        display: 'flex', alignItems: { xs: 'center', md: meta.headerSearch ? 'flex-start' : 'center' },
                        gap: { xs: 1, md: 2 },
                        minHeight: { xs: 64, md: 88 }, px: { xs: 2, md: 4, lg: 5 }, py: { md: meta.headerSearch ? 2 : 0 },
                        // Frosted glass behind the sticky search row; the blur lives here (not on the
                        // search card) because a nested backdrop-filter can't see past its parent.
                        bgcolor: { xs: 'rgba(255,255,255,0.9)', md: meta.headerSearch ? tokens.glassBg : 'transparent' },
                        borderTopLeftRadius: { md: meta.headerSearch ? tokens.radius2xl : 0 },
                        backdropFilter: { xs: 'blur(12px)', md: meta.headerSearch ? tokens.glassBlur : 'none' },
                        WebkitBackdropFilter: { xs: 'blur(12px)', md: meta.headerSearch ? tokens.glassBlur : 'none' },
                        borderBottom: { xs: `1px solid ${tokens.border}`, md: 'none' },
                    }}
                >
                    {meta.back && (
                        <Tooltip title={t.common.back}>
                            <IconButton onClick={goBack} aria-label={t.common.back} sx={{ color: 'text.primary', ml: -1 }}>
                                <FiArrowLeft size={22} />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Typography
                        variant="h1"
                        component={meta.titleAs ?? 'h1'}
                        noWrap
                        sx={meta.hideTitle ? visuallyHidden : { fontSize: { xs: 20, md: 26 }, minWidth: 0 }}
                    >
                        {meta.title}
                    </Typography>
                    {meta.headerSearch && (
                        <>
                            <Box ref={setHeaderSlot} sx={{ display: { xs: 'none', md: 'block' }, flex: 1, minWidth: 0 }} />
                            <Box component={NextLink} href={p.home} sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.25, textDecoration: 'none' }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: `${tokens.radiusMd}px`, bgcolor: '#fff', border: `1px solid ${tokens.border}`, display: 'grid', placeItems: 'center' }}>
                                    <Image src="/images/i2go_mark.png" alt="" width={32} height={19} style={{ objectFit: 'contain' }} />
                                </Box>
                                <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary' }}>I2Go</Typography>
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
                                height: 40, px: 1.25, borderRadius: 999, color: 'text.secondary', fontSize: 14, fontWeight: 500,
                                '&:hover': { color: 'primary.main', bgcolor: tokens.surface, boxShadow: tokens.shadowXs },
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
                                        transition: `background-color 150ms ${tokens.ease}`,
                                        '&:hover': { bgcolor: tokens.surface, boxShadow: tokens.shadowXs },
                                        '&:focus-visible': { boxShadow: tokens.focusRing },
                                    }}
                                >
                                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', color: '#fff', fontSize: 15, fontWeight: 600 }}>
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
                                        <Typography noWrap sx={{ fontWeight: 600, lineHeight: '20px' }}>{displayName}</Typography>
                                        <Typography variant="caption" color="text.secondary">{isEmployer ? t.common.employer : t.common.signedIn}</Typography>
                                    </Box>
                                    <FiChevronDown color={tokens.textSecondary} />
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
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayName}</Typography>
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
                                <Button component={NextLink} href={p.signup} variant="contained">{t.common.createAccount}</Button>
                            </>
                        )}
                    </Box>

                    <IconButton
                        sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.primary', mr: -1 }}
                        onClick={() => setDrawerOpen(true)}
                        aria-label={t.common.openMenu}
                    >
                        <FiMenu size={22} />
                    </IconButton>
                </Box>

                <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 4, lg: 5 }, pt: { xs: 2, md: 0 }, pb: 3, width: '100%', maxWidth: 1440 }}>
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
                        <Box key={pathname} sx={{ animation: `${pageIn} 200ms ${tokens.ease}` }}>
                            <HeaderSlotContext.Provider value={meta.headerSearch ? headerSlot : null}>
                                {children}
                            </HeaderSlotContext.Provider>
                        </Box>
                    )}

                    <PageFooter />
                </Box>
            </Box>
        </Box>
    );
}
