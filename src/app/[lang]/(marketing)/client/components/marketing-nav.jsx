'use client';

import { useState, useSyncExternalStore } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Avatar, Box, Button, ButtonBase, Divider, Drawer, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography,
} from '@mui/material';
import { FiArrowRight, FiChevronDown, FiHeart, FiInbox, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { SignInButton, SignUpButton, useAuth } from '@/features/auth';
import { LanguageSwitcher, useI18n } from '@/features/i18n';
import { initials } from '@/lib/portal/format';
import { brand as b } from '@/app/theme';
import BrandLogo from './brand-logo';
import Container from './container';

/** In-page anchors first, then the two portal sections that matter to visitors. */
function navLinks(t, p) {
    return [
        { href: `${p.home}#employers`, label: t.landing.nav.employers },
        { href: `${p.home}#candidates`, label: t.landing.nav.candidates },
        { href: p.hub, label: t.landing.nav.browse },
        { href: p.guides, label: t.landing.nav.guides },
    ];
}

const focusRing = b.focusRing;

const linkSx = {
    px: 1.5, py: 1, borderRadius: `${b.radiusSm}px`, fontSize: 14, fontWeight: 700, color: b.ink2, textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: `background-color 250ms ${b.ease}, color 250ms ${b.ease}`,
    '&:hover': { bgcolor: 'rgba(13,42,66,0.05)', color: b.ink },
    '&:focus-visible': focusRing,
};

// Dark glass over sections marked `data-nav-tone="dark"` (readTone): white text,
// hairline borders.
const linkDarkSx = {
    ...linkSx,
    color: 'rgba(255,255,255,0.82)',
    '&:hover': { bgcolor: b.onDark.hover, color: b.onDark.text },
    '&:focus-visible': b.focusRingDark,
};

// The reference's language pill (.lang-btn).
const languagePillSx = {
    minHeight: 34, px: 1.25, gap: 0.75, borderRadius: 999, border: `1px solid ${b.line}`, bgcolor: b.surface,
    color: b.ink2, fontSize: 13, fontWeight: 700, letterSpacing: '0.3px',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7)',
    transition: `border-color 200ms ${b.ease}, background-color 200ms ${b.ease}`,
    '&:hover': { borderColor: b.line2 },
    '&:focus-visible': focusRing,
};

const languagePillDarkSx = {
    ...languagePillSx,
    bgcolor: 'transparent', borderColor: b.onDark.ring, color: b.onDark.text, boxShadow: 'none',
    '&:hover': { borderColor: 'rgba(255,255,255,0.32)' },
    '&:focus-visible': b.focusRingDark,
};

const noopSubscribe = () => () => {};
const subscribeScroll = (onChange) => {
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange);
    return () => {
        window.removeEventListener('scroll', onChange);
        window.removeEventListener('resize', onChange);
    };
};

/**
 * What the bar lies over: 'top' (not scrolled past 8px yet), 'dark' (a
 * section marked `data-nav-tone="dark"` is under the middle of the bar) or
 * 'light'. Over dark sections the light glass looks grey, so the bar turns
 * to dark glass there (plan 10.3).
 */
const readTone = () => {
    if (window.scrollY <= 8) return 'top';
    const bar = document.querySelector('[data-marketing-nav]');
    const rect = bar?.getBoundingClientRect();
    const y = rect ? (rect.top + rect.bottom) / 2 : 0;
    for (const section of document.querySelectorAll('[data-nav-tone="dark"]')) {
        const r = section.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) return 'dark';
    }
    return 'light';
};

const glass = { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' };
const surfaces = {
    clear: { bgcolor: 'transparent', borderBottom: '1px solid transparent' },
    light: { ...glass, bgcolor: 'rgba(252,254,255,0.72)', borderBottom: '1px solid rgba(13,42,66,0.06)' },
    dark: { ...glass, bgcolor: 'rgba(6,13,21,0.72)', borderBottom: `1px solid ${b.onDark.line}`, '--focus-color': b.cyan },
};

/**
 * Whether the nav lies over the dark homepage hero (plan 9A.6): only on the
 * homepage and only without account notices, which sit between the nav and
 * the page. MarketingShell uses it too, to let the hero start under the nav.
 */
export function useNavOverlay() {
    const pathname = usePathname();
    const { p } = useI18n();
    const { needsTerms, isOtherAccount } = useAuth();
    const isHome = pathname === p.home || pathname === `${p.home}/`;
    return isHome && !needsTerms && !isOtherAccount;
}

/** Signed-in account button and its menu. On the homepage, signing out simply ends the session here. */
function AccountMenu({ fontClass, dark }) {
    const { user, profile, isEmployer, signOut } = useAuth();
    const { t, p } = useI18n();
    const [anchor, setAnchor] = useState(null);
    const displayName = profile?.full_name || user?.email || '';

    const handleSignOut = () => {
        setAnchor(null);
        signOut();
    };

    return (
        <>
            <ButtonBase
                onClick={(e) => setAnchor(e.currentTarget)}
                aria-label={t.common.account}
                aria-haspopup="menu"
                aria-expanded={!!anchor}
                sx={{
                    gap: 1, py: 0.5, pl: 0.5, pr: 1.25, borderRadius: 999,
                    border: `1px solid ${dark ? b.onDark.ring : b.line}`, bgcolor: dark ? 'transparent' : b.surface,
                    transition: `border-color 200ms ${b.ease}, background-color 200ms ${b.ease}`,
                    '&:hover': { borderColor: dark ? 'rgba(255,255,255,0.32)' : b.line2 },
                    '&:focus-visible': dark ? b.focusRingDark : focusRing,
                }}
            >
                <Avatar sx={{ width: 30, height: 30, bgcolor: b.graphite, color: '#fff', fontSize: 12, fontWeight: 800 }}>
                    {initials(displayName) || '?'}
                </Avatar>
                <Box component="span" sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 700, color: dark ? b.onDark.text : b.ink2 }}>
                    {displayName}
                </Box>
                <FiChevronDown size={16} color={dark ? b.onDark.body : b.muted} aria-hidden />
            </ButtonBase>
            <Menu
                className={fontClass}
                anchorEl={anchor}
                open={!!anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { fontFamily: b.fontFamily, mt: 1, borderRadius: `${b.radiusMd}px`, border: `1px solid ${b.line}`, boxShadow: b.shadow3 } } }}
            >
                <Box sx={{ px: 1.5, py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: b.ink }}>{displayName}</Typography>
                    {profile?.full_name && <Typography variant="caption" sx={{ color: b.muted }}>{user.email}</Typography>}
                </Box>
                <Divider sx={{ my: 0.5, borderColor: b.line }} />
                {isEmployer && (
                    <MenuItem component={NextLink} href={p.wishlist} onClick={() => setAnchor(null)}>
                        <ListItemIcon sx={{ color: b.muted }}><FiHeart size={18} /></ListItemIcon>
                        {t.nav.wishlist}
                    </MenuItem>
                )}
                {isEmployer && (
                    <MenuItem component={NextLink} href={p.enquiries} onClick={() => setAnchor(null)}>
                        <ListItemIcon sx={{ color: b.muted }}><FiInbox size={18} /></ListItemIcon>
                        {t.nav.enquiries}
                    </MenuItem>
                )}
                <MenuItem onClick={handleSignOut}>
                    <ListItemIcon sx={{ color: b.muted }}><FiLogOut size={18} /></ListItemIcon>
                    {t.common.signOut}
                </MenuItem>
            </Menu>
        </>
    );
}

/** Phone menu: the same links and actions in a white drawer from the right. */
function MobileMenu({ open, onClose, fontClass }) {
    const { user, profile, isEmployer, signOut } = useAuth();
    const { t, p } = useI18n();
    const displayName = profile?.full_name || user?.email || '';
    const rowSx = {
        display: 'flex', alignItems: 'center', minHeight: 48, px: 1.5, borderRadius: `${b.radiusSm}px`,
        fontSize: 16, fontWeight: 700, color: b.ink, textDecoration: 'none',
        '&:hover': { bgcolor: b.surface3 },
        '&:focus-visible': focusRing,
    };

    return (
        <Drawer
            className={fontClass}
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{ paper: { sx: { fontFamily: b.fontFamily, width: 'min(320px, 88vw)', borderRadius: 0, bgcolor: b.surface, p: 2, display: 'flex', flexDirection: 'column' } } }}
        >
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <BrandLogo href={p.home} onClick={onClose} />
                <IconButton onClick={onClose} aria-label={t.landing.nav.closeMenu} sx={{ color: b.ink, '&:focus-visible': focusRing }}>
                    <FiX size={22} />
                </IconButton>
            </Stack>
            <Box component="nav" aria-label={t.common.mainNav} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {navLinks(t, p).map((link) => (
                    <Box key={link.href} component={NextLink} href={link.href} onClick={onClose} sx={rowSx}>{link.label}</Box>
                ))}
                {isEmployer && <Box component={NextLink} href={p.wishlist} onClick={onClose} sx={rowSx}>{t.nav.wishlist}</Box>}
                {isEmployer && <Box component={NextLink} href={p.enquiries} onClick={onClose} sx={rowSx}>{t.nav.enquiries}</Box>}
            </Box>
            <Box sx={{ mt: 'auto', pt: 3, borderTop: `1px solid ${b.line}` }}>
                {user ? (
                    <Stack spacing={1.5}>
                        <Typography noWrap sx={{ fontWeight: 700, color: b.ink }}>{displayName}</Typography>
                        <Button variant="ghost" startIcon={<FiLogOut />} onClick={() => { onClose(); signOut(); }} sx={{ justifyContent: 'flex-start', border: `1px solid ${b.line}` }}>
                            {t.common.signOut}
                        </Button>
                    </Stack>
                ) : (
                    <Stack spacing={1}>
                        <SignUpButton variant="cta" onClick={onClose} endIcon={<FiArrowRight />} sx={{ justifyContent: 'space-between' }}>
                            {t.landing.nav.register}
                        </SignUpButton>
                        <SignInButton variant="ghost" onClick={onClose} sx={{ border: `1px solid ${b.line}` }}>
                            {t.common.signIn}
                        </SignInButton>
                    </Stack>
                )}
                <LanguageSwitcher onNavigate={onClose} sx={{ ...languagePillSx, mt: 2 }} />
            </Box>
        </Drawer>
    );
}

/**
 * Sticky top bar of the marketing pages: translucent, blurred, one hairline
 * below (the reference's footer bar used as a header). `fontClass` puts the
 * marketing font on the menu and drawer, which render outside the layout.
 *
 * `overlay` (useNavOverlay, homepage): the bar lies over the light hero
 * (negative bottom margin) and is transparent with the usual dark text until
 * the page has scrolled 8px, then fades to the translucent bar in 200ms (plan 9A.6).
 * In the server HTML it isn't sticky, so without JS it scrolls away with the
 * hero. The bar turns to dark glass over any section marked
 * `data-nav-tone="dark"` (readTone).
 */
export default function MarketingNav({ fontClass, overlay = false }) {
    const { user } = useAuth();
    const { t, p } = useI18n();
    const [drawerOpen, setDrawerOpen] = useState(false);
    // false in the server HTML and while hydrating, true after.
    const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
    const tone = useSyncExternalStore(subscribeScroll, readTone, () => 'top');

    const clear = overlay && tone === 'top';
    // White text and cyan focus rings only over a dark section; the hero is light.
    const dark = tone === 'dark';
    const fade = `background-color 200ms ${b.ease}, border-color 200ms ${b.ease}, backdrop-filter 200ms ${b.ease}`;

    return (
        <Box
            component="header"
            data-marketing-nav=""
            sx={{
                position: overlay && !mounted ? 'relative' : 'sticky', top: 0, zIndex: 20,
                mb: overlay ? { xs: `-${b.navHeightMobile}px`, md: `-${b.navHeight}px` } : 0,
                transition: fade,
                ...surfaces[clear ? 'clear' : dark ? 'dark' : 'light'],
            }}
        >
            <Container wide sx={{ display: 'flex', alignItems: 'center', gap: 2, height: { xs: b.navHeightMobile, md: b.navHeight } }}>
                <BrandLogo href={p.home} dark={dark} large />

                <Box component="nav" aria-label={t.common.mainNav} sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.25, mx: 'auto' }}>
                    {navLinks(t, p).map((link) => (
                        <Box key={link.href} component={NextLink} href={link.href} sx={dark ? linkDarkSx : linkSx}>{link.label}</Box>
                    ))}
                </Box>

                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', ml: { xs: 'auto', lg: 0 }, flexShrink: 0 }}>
                    <LanguageSwitcher showIcon={false} sx={dark ? languagePillDarkSx : languagePillSx} />
                    <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
                        {user ? (
                            <AccountMenu fontClass={fontClass} dark={dark} />
                        ) : (
                            <>
                                <SignInButton
                                    variant="ghost"
                                    size="small"
                                    sx={dark ? { color: b.onDark.text, '&:hover': { bgcolor: b.onDark.hover } } : undefined}
                                >
                                    {t.common.signIn}
                                </SignInButton>
                                <SignUpButton variant="cta" size="small" endIcon={<FiArrowRight />}>
                                    {t.landing.nav.register}
                                </SignUpButton>
                            </>
                        )}
                    </Box>
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        aria-label={t.common.openMenu}
                        aria-expanded={drawerOpen}
                        sx={{ display: { xs: 'inline-flex', lg: 'none' }, color: dark ? b.onDark.text : b.ink, mr: -1, '&:focus-visible': dark ? b.focusRingDark : b.focusRing }}
                    >
                        <FiMenu size={22} />
                    </IconButton>
                </Stack>
            </Container>
            <MobileMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} fontClass={fontClass} />
        </Box>
    );
}
