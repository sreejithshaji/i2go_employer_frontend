import { createTheme } from '@mui/material/styles';

// Design tokens. UI_UX.md documents each one; add new values there first.
export const tokens = {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primaryLight: '#3B82F6',
    primarySoft: '#EFF6FF',
    primarySoftHover: '#DBEAFE',

    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceMuted: '#F1F5F9',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',

    textPrimary: '#1F2937',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',

    success: '#10B981',
    successSoft: '#ECFDF5',
    successText: '#047857',
    warning: '#F59E0B',
    warningSoft: '#FFFBEB',
    warningText: '#B45309',
    danger: '#EF4444',
    dangerSoft: '#FEF2F2',
    dangerText: '#B91C1C',

    sidebarBg: '#2563EB',
    sidebarText: 'rgba(255,255,255,0.80)',
    sidebarHoverBg: 'rgba(255,255,255,0.10)',

    radiusXs: 6,
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: 16,
    radiusXl: 20,
    radius2xl: 32,

    shadowXs: '0 1px 2px rgba(15,23,42,0.04)',
    shadowCard: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.04)',
    shadowCardHover: '0 2px 4px rgba(15,23,42,0.04), 0 12px 32px rgba(37,99,235,0.10)',
    shadowPopover: '0 12px 32px rgba(15,23,42,0.12)',
    shadowPrimary: '0 6px 16px rgba(37,99,235,0.24)',
    focusRing: '0 0 0 3px rgba(59,130,246,0.25)',

    // Frosted glass (sticky search header on Candidates).
    glassBg: 'rgba(248,250,252,0.72)',
    glassBlur: 'blur(16px) saturate(180%)',
    glassSurface: 'rgba(255,255,255,0.62)',
    glassBorder: 'rgba(255,255,255,0.8)',

    ease: 'cubic-bezier(0.2, 0, 0, 1)',
    sidebarWidth: 220,
    sidebarCollapsedWidth: 88,
};

// Marketing pages (the homepage) only: the visual language of the reference
// site in homepage-redesign-plan.md §1. Portal pages keep `tokens` above.
// UI_UX.md → "Marketing pages (homepage)" documents each value.
export const brand = {
    fontFamily: "var(--font-jakarta), system-ui, -apple-system, 'Segoe UI', sans-serif",

    // Light surfaces
    ink: '#0A0F16',
    ink2: '#2C3641',
    muted: '#5D6873',
    faint: '#98A1AB', // icons and decoration only (2.6:1 on white)
    line: '#E2E7EC',
    line2: '#CED6DE',
    lineHover: '#9AA7B3',
    bg1: '#F7F8FA',
    bg2: '#EFF1F3',
    surface: '#FFFFFF',
    surface2: '#FDFDFE',
    surface3: '#F3F5F7',

    // Accent. `accent` (3.6:1 on white) is for borders, ticks, nodes and
    // large text; small text uses `accentText` (6.0:1, from the CTA gradient).
    accent: '#0F8FC7',
    accentText: '#0B6A94',
    accentInk: '#06364B',
    accentSoft: '#F1F7FA',
    accentLine: '#D3E5EE',
    ok: '#12996B',
    okSoft: '#E4F8EF',
    danger: '#D92D20',

    // Dark surfaces. Cyan appears only on these.
    navy: '#03070C',
    navy2: '#060D15',
    graphite: '#0B1420',
    cyan: '#1FC8FF',
    gold: '#FFC94D', // EU-flag gold, softened; "European Employers" in the hero H1
    onDark: {
        text: '#FFFFFF',
        body: 'rgba(255,255,255,0.64)', // body text (≥ 4.5:1 on navy)
        bodyStrong: 'rgba(255,255,255,0.78)', // small text that can sit over the hero photo (≥ 4.5:1 there)
        subtle: 'rgba(255,255,255,0.50)', // small meta text, the lowest for text
        line: 'rgba(255,255,255,0.07)', // hairlines, timeline track
        border: 'rgba(255,255,255,0.10)',
        ring: 'rgba(255,255,255,0.16)', // timeline node ring
        hover: 'rgba(255,255,255,0.045)',
    },
    darkSection: 'radial-gradient(380px 240px at 18% -6%, rgba(31,200,255,0.043), transparent 70%), linear-gradient(180deg, #03070C 0%, #060D15 100%)',
    darkPanel: 'radial-gradient(520px 280px at 88% -20%, rgba(31,200,255,0.12), transparent 66%), linear-gradient(135deg, #04090F, #0B1420)',
    darkPanelBorder: 'rgba(31,200,255,0.12)',
    glow: 'radial-gradient(closest-side, rgba(31,200,255,0.2), transparent 72%)',

    // Primary call to action: the only gradient on a control.
    ctaGradient: 'linear-gradient(135deg, #0E7FAE 0%, #0B6A94 55%, #084F70 100%)',
    ctaShadow: '0 6px 14px rgba(6,54,75,0.26), inset 0 1px rgba(255,255,255,0.2)',

    radiusSm: 10,
    radiusMd: 16,
    radiusPanel: 18,
    radiusLg: 20,
    radiusXl: 26,
    radiusButton: 14,

    shadow1: '0 1px 2px rgba(13,26,43,0.04)',
    shadow2: '0 8px 20px rgba(13,26,43,0.07)',
    shadow3: '0 18px 44px rgba(13,26,43,0.12)',
    shadowDarkPanel: '0 12px 32px rgba(6,14,26,0.14)',

    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    navHeight: 78,
    navHeightMobile: 64,
    contentMax: 1080,
    wideMax: 1440, // nav and hero column, so the hero text sits further left
    readingMax: 820,
};

const t = tokens;
const b = brand;

// The same tokens as CSS custom properties (see UI_UX.md → Color Tokens).
const cssVars = {
    '--color-primary': t.primary,
    '--color-primary-hover': t.primaryHover,
    '--color-primary-light': t.primaryLight,
    '--color-primary-soft': t.primarySoft,
    '--color-primary-soft-hover': t.primarySoftHover,
    '--color-background': t.background,
    '--color-surface': t.surface,
    '--color-surface-muted': t.surfaceMuted,
    '--color-border': t.border,
    '--color-border-strong': t.borderStrong,
    '--color-text-primary': t.textPrimary,
    '--color-text-secondary': t.textSecondary,
    '--color-text-muted': t.textMuted,
    '--color-success': t.success,
    '--color-warning': t.warning,
    '--color-danger': t.danger,
    '--radius-sm': `${t.radiusSm}px`,
    '--radius-md': `${t.radiusMd}px`,
    '--radius-lg': `${t.radiusLg}px`,
    '--radius-xl': `${t.radiusXl}px`,
    '--shadow-card': t.shadowCard,
    '--shadow-popover': t.shadowPopover,
};

const headingFont = { fontWeight: 600, letterSpacing: '-0.01em', color: t.textPrimary };

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: t.primary, dark: t.primaryHover, light: t.primaryLight, contrastText: '#fff' },
        success: { main: t.success, contrastText: '#fff' },
        error: { main: t.danger },
        warning: { main: t.warning },
        background: { default: t.background, paper: t.surface },
        text: { primary: t.textPrimary, secondary: t.textSecondary, disabled: t.textMuted },
        divider: t.border,
        action: { hover: t.surfaceMuted, selected: t.primarySoft },
    },
    shape: { borderRadius: t.radiusMd },
    typography: {
        fontFamily: "var(--font-poppins), system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        fontSize: 14,
        h1: { ...headingFont, fontSize: 26, lineHeight: '34px' },
        h2: { ...headingFont, fontWeight: 700, fontSize: 40, lineHeight: '48px' },
        h3: { ...headingFont, fontSize: 26, lineHeight: '34px' },
        h4: { ...headingFont, fontSize: 26, lineHeight: '34px' },
        h5: { ...headingFont, fontSize: 20, lineHeight: '28px' },
        h6: { ...headingFont, fontSize: 18, lineHeight: '26px' },
        subtitle1: { fontSize: 16, lineHeight: '24px', fontWeight: 600 },
        subtitle2: { fontSize: 13, lineHeight: '20px', fontWeight: 500 },
        body1: { fontSize: 14, lineHeight: '22px' },
        body2: { fontSize: 13, lineHeight: '20px' },
        caption: { fontSize: 12, lineHeight: '18px' },
        overline: { fontSize: 12, lineHeight: '16px', fontWeight: 600, letterSpacing: '0.08em' },
        button: { textTransform: 'none', fontWeight: 600, fontSize: 14, lineHeight: '20px' },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ':root': cssVars,
                body: { backgroundColor: t.background },
                '@media (prefers-reduced-motion: reduce)': {
                    '*, *::before, *::after': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: t.radiusMd,
                    minHeight: 40,
                    paddingInline: 18,
                    transition: `background-color 150ms ${t.ease}, box-shadow 150ms ${t.ease}, border-color 150ms ${t.ease}, color 150ms ${t.ease}, transform 100ms ${t.ease}`,
                    '&:focus-visible': { boxShadow: t.focusRing },
                    '& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)': { fontSize: 16 },
                },
                sizeSmall: { minHeight: 36, paddingInline: 14, fontSize: 13 },
                sizeLarge: { minHeight: 48, paddingInline: 24, fontSize: 15 },
                contained: {
                    '&:hover': { backgroundColor: t.primaryHover, boxShadow: t.shadowPrimary },
                    '&:active': { transform: 'scale(0.98)' },
                    '&.Mui-disabled': { backgroundColor: t.border, color: t.textMuted },
                },
                outlined: {
                    borderColor: t.border,
                    color: t.textPrimary,
                    backgroundColor: t.surface,
                    '&:hover': { borderColor: t.borderStrong, backgroundColor: t.surfaceMuted },
                },
                text: { '&:hover': { backgroundColor: t.primarySoft } },
            },
            variants: [
                {
                    props: { variant: 'soft' },
                    style: {
                        backgroundColor: t.primarySoft,
                        color: t.primary,
                        '&:hover': { backgroundColor: t.primarySoftHover },
                        '&:active': { transform: 'scale(0.98)' },
                        '&.Mui-disabled': { color: t.textMuted, backgroundColor: t.surfaceMuted },
                    },
                },
                // Marketing pages: gradient call to action. The end icon becomes the round arrow chip.
                {
                    props: { variant: 'cta' },
                    style: {
                        fontFamily: b.fontFamily,
                        fontSize: 15,
                        fontWeight: 800,
                        letterSpacing: '-0.2px',
                        color: '#fff',
                        background: b.ctaGradient,
                        boxShadow: b.ctaShadow,
                        borderRadius: b.radiusButton,
                        minHeight: 50,
                        paddingInlineStart: 24,
                        paddingInlineEnd: 18,
                        transition: `transform 280ms ${b.ease}, box-shadow 280ms ${b.ease}, filter 280ms ${b.ease}`,
                        '& .MuiButton-endIcon': {
                            width: 28, height: 28, marginLeft: 13, marginRight: 0, borderRadius: 999,
                            display: 'grid', placeItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)',
                            transition: `transform 300ms ${b.ease}, background-color 300ms ${b.ease}`,
                        },
                        '& .MuiButton-endIcon > *:nth-of-type(1)': { fontSize: 15 },
                        '&:hover': { transform: 'translateY(-2px)', filter: 'saturate(1.05)', boxShadow: b.ctaShadow },
                        '&:hover .MuiButton-endIcon': { transform: 'translateX(2px)', backgroundColor: 'rgba(255,255,255,0.3)' },
                        '&:focus-visible': { outline: `2px solid ${b.cyan}`, outlineOffset: 3, boxShadow: b.ctaShadow },
                        '&.Mui-disabled': { color: '#fff', opacity: 0.6, filter: 'saturate(0.3)' },
                    },
                },
                {
                    props: { variant: 'cta', size: 'small' },
                    style: {
                        fontSize: 14, minHeight: 40, paddingInlineStart: 16, paddingInlineEnd: 10, borderRadius: 12,
                        '& .MuiButton-endIcon': { width: 24, height: 24, marginLeft: 10 },
                        '& .MuiButton-endIcon > *:nth-of-type(1)': { fontSize: 13 },
                    },
                },
                // Marketing pages: quiet secondary action next to a cta.
                {
                    props: { variant: 'ghost' },
                    style: {
                        fontFamily: b.fontFamily,
                        fontSize: 14,
                        fontWeight: 700,
                        color: b.ink2,
                        borderRadius: 13,
                        minHeight: 48,
                        paddingInline: 18,
                        transition: `background-color 250ms ${b.ease}, color 250ms ${b.ease}`,
                        '&:hover': { backgroundColor: 'rgba(13,42,66,0.05)', color: b.ink },
                        '&:focus-visible': { outline: `2px solid ${b.accent}`, outlineOffset: 2, boxShadow: 'none' },
                    },
                },
                {
                    props: { variant: 'ghost', size: 'small' },
                    style: { fontSize: 14, minHeight: 40, paddingInline: 14, borderRadius: 12 },
                },
            ],
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: t.radiusMd,
                    color: t.textSecondary,
                    transition: `background-color 150ms ${t.ease}, color 150ms ${t.ease}`,
                    '&:hover': { backgroundColor: t.surfaceMuted },
                    '&:focus-visible': { boxShadow: t.focusRing },
                },
            },
        },
        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: { root: { borderRadius: t.radiusLg, boxShadow: t.shadowCard, border: 'none' } },
        },
        MuiPaper: {
            styleOverrides: { rounded: { borderRadius: t.radiusLg } },
        },
        MuiTextField: { defaultProps: { fullWidth: true, size: 'small' } },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: t.radiusMd,
                    backgroundColor: t.surface,
                    transition: `box-shadow 150ms ${t.ease}`,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: t.border },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.borderStrong },
                    '&.Mui-focused': { boxShadow: t.focusRing },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: t.primary, borderWidth: 1 },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: t.danger },
                },
                input: { '&::placeholder': { color: t.textMuted, opacity: 1 } },
                inputSizeSmall: { paddingTop: 9.5, paddingBottom: 9.5 },
            },
        },
        MuiInputLabel: { styleOverrides: { root: { color: t.textSecondary } } },
        MuiFormHelperText: {
            styleOverrides: { root: { fontSize: 12, marginLeft: 2, marginTop: 4, '&.Mui-error': { color: t.dangerText } } },
        },
        MuiInputAdornment: { styleOverrides: { root: { color: t.textMuted } } },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: t.radiusSm, fontWeight: 500, fontSize: 12 },
                filled: { backgroundColor: t.primarySoft, color: t.primary },
                deleteIcon: { color: t.primaryLight, '&:hover': { color: t.primary } },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: { borderRadius: t.radiusLg, boxShadow: t.shadowPopover, border: `1px solid ${t.border}`, minWidth: 220 },
                list: { padding: 6 },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                paper: { borderRadius: t.radiusLg, boxShadow: t.shadowPopover, border: `1px solid ${t.border}`, marginTop: 6 },
                listbox: { padding: 6 },
                option: { borderRadius: t.radiusSm, minHeight: 36, fontSize: 14 },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: t.radiusSm,
                    minHeight: 36,
                    fontSize: 14,
                    '&:hover': { backgroundColor: t.surfaceMuted },
                    '&.Mui-selected': { backgroundColor: t.primarySoft, color: t.primary, fontWeight: 500 },
                    '&.Mui-selected:hover': { backgroundColor: t.primarySoftHover },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: { tooltip: { backgroundColor: t.textPrimary, borderRadius: t.radiusSm, fontSize: 12, padding: '6px 10px' } },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: t.radiusLg, boxShadow: t.shadowPopover },
                paperFullScreen: { borderRadius: 0 },
            },
        },
        MuiBackdrop: { styleOverrides: { root: { '&:not(.MuiBackdrop-invisible)': { backgroundColor: 'rgba(15,23,42,0.40)' } } } },
        MuiDialogTitle: { styleOverrides: { root: { fontSize: 18, fontWeight: 600, padding: '24px 24px 8px' } } },
        MuiDialogContent: { styleOverrides: { root: { padding: '8px 24px 16px' } } },
        MuiDialogActions: { styleOverrides: { root: { padding: '8px 24px 24px', gap: 4 } } },
        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: t.radiusMd, alignItems: 'center' },
                standardError: { backgroundColor: t.dangerSoft, color: t.dangerText, border: '1px solid rgba(239,68,68,0.2)' },
                standardInfo: { backgroundColor: t.primarySoft, color: t.primaryHover, border: '1px solid rgba(37,99,235,0.2)' },
                standardSuccess: { backgroundColor: t.successSoft, color: t.successText, border: '1px solid rgba(16,185,129,0.2)' },
                standardWarning: { backgroundColor: t.warningSoft, color: t.warningText, border: '1px solid rgba(245,158,11,0.2)' },
            },
        },
        MuiSnackbarContent: {
            styleOverrides: { root: { backgroundColor: t.textPrimary, borderRadius: t.radiusMd, fontSize: 14 } },
        },
        MuiSkeleton: {
            defaultProps: { animation: 'wave' },
            styleOverrides: { root: { backgroundColor: t.surfaceMuted } },
        },
        MuiDivider: { styleOverrides: { root: { borderColor: t.border } } },
        MuiAvatar: { styleOverrides: { colorDefault: { backgroundColor: t.primarySoft, color: t.primary, fontWeight: 600 } } },
        MuiLink: { styleOverrides: { root: { color: t.primary, fontWeight: 500, textDecorationColor: 'rgba(37,99,235,0.3)' } } },
    },
});

export default theme;

// The portal theme with the marketing font (Plus Jakarta Sans) on every text
// style. Used by the marketing layout's ThemeProvider, so menus and drawers,
// which render in portals outside the layout element, get the font too.
const TEXT_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'overline', 'button'];
export const marketingTheme = createTheme(theme, {
    typography: {
        fontFamily: brand.fontFamily,
        ...Object.fromEntries(TEXT_VARIANTS.map((variant) => [variant, { fontFamily: brand.fontFamily }])),
    },
});
