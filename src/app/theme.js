import { createTheme } from '@mui/material/styles';

// The visual language of the reference site in homepage-redesign-plan.md §1:
// the homepage since Part A, the whole employer portal since Task 14.
// UI_UX.md documents each value (§2 colour, §3 type, §4 radii and shadows).
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
    // Blue-grey tint for the light homepage hero and employer section: a step darker than bg1/bg2.
    tint1: '#DCE5EC',
    tint2: '#D2DCE5',
    heroTint1: '#CFDAE3', // the homepage hero: one step darker than tint1/tint2
    heroTint2: '#C6D2DC',
    mutedOnTint: '#4A5560', // secondary text on tint1/tint2 (≥ 5.4:1; `muted` drops to 4.1:1 there)

    // Accent. `accent` (3.6:1 on white) is for borders, ticks, nodes and
    // large text; small text uses `accentText` (6.0:1, from the CTA gradient).
    accent: '#0F8FC7',
    accentText: '#0B6A94',
    accentInk: '#06364B',
    accentSoft: '#F1F7FA',
    accentLine: '#D3E5EE',
    ok: '#12996B', // ticks, dots and fills only (3.6:1 on white)
    okText: '#0E7F59', // small success text (5.0:1 on white)
    okSoft: '#E4F8EF',
    danger: '#D92D20',

    // Dark surfaces. Cyan appears only on these.
    navy: '#03070C',
    navy2: '#060D15',
    graphite: '#0B1420',
    cyan: '#1FC8FF',
    gold: '#FFC94D', // EU-flag gold, softened; for dark surfaces
    goldText: '#9A6700', // the same gold for light surfaces (5.3:1 on white); "European Employers" in the hero H1
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
    darkPanelBase: 'linear-gradient(135deg, #04090F, #0B1420)', // darkPanel without its glow, for panels with a DriftGlow
    darkPanelBorder: 'rgba(31,200,255,0.12)',
    glow: 'radial-gradient(closest-side, rgba(31,200,255,0.2), transparent 72%)',

    // Focus outline of every interactive element on the marketing pages (plan §10):
    // 2px accent on light, cyan on dark, 3px from the element.
    focusRing: { outline: '2px solid #0F8FC7', outlineOffset: 3 },
    focusRingDark: { outline: '2px solid #1FC8FF', outlineOffset: 3 },

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

// Portal tokens. Since Task 14.2 (homepage-redesign-plan.md) every value is
// the `brand` equivalent, so pages that still read `tokens.*` already show the
// reference design. The names are removed page by page and deleted in 14.7.
export const tokens = {
    primary: brand.accentText,
    primaryHover: brand.accentInk,
    primaryLight: brand.accent,
    primarySoft: brand.accentSoft,
    primarySoftHover: brand.accentLine,

    background: brand.bg1,
    surface: brand.surface,
    surfaceMuted: brand.surface3,
    border: brand.line,
    borderStrong: brand.line2,

    textPrimary: brand.ink2,
    textSecondary: brand.muted,
    textMuted: brand.faint,

    success: brand.ok,
    successSoft: brand.okSoft,
    successText: brand.okText,
    warning: '#F59E0B',
    warningSoft: '#FFFBEB',
    warningText: '#B45309',
    danger: brand.danger,
    dangerSoft: '#FEF3F2',
    dangerText: '#B42318',

    sidebarBg: brand.graphite,
    sidebarText: brand.onDark.body,
    sidebarHoverBg: brand.onDark.hover,

    radiusXs: 6,
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: brand.radiusMd,
    radiusXl: brand.radiusLg,
    radius2xl: 32,

    shadowXs: brand.shadow1,
    shadowCard: brand.shadow1,
    shadowCardHover: brand.shadow2,
    shadowPopover: brand.shadow3,
    shadowPrimary: brand.ctaShadow,
    focusRing: '0 0 0 3px rgba(15,143,199,0.28)',

    // Frosted glass (sticky search header on Candidates).
    glassBg: 'rgba(247,248,250,0.72)',
    glassBlur: 'blur(16px) saturate(180%)',
    glassSurface: 'rgba(255,255,255,0.72)',
    glassBorder: 'rgba(255,255,255,0.8)',

    ease: brand.ease,
    sidebarWidth: 248,
    sidebarCollapsedWidth: 88,
};

const t = tokens;
const b = brand;

// The legacy tokens as CSS custom properties (removed with `tokens` in 14.7).
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

// Reference headings: extra-bold ink with tight negative tracking (plan §1.3).
const headingFont = { fontWeight: 800, color: b.ink };

const theme = createTheme({
    palette: {
        mode: 'light',
        // `accentText`, not `accent`: white text and small text on white need ≥ 4.5:1.
        primary: { main: b.accentText, dark: b.accentInk, light: b.accent, contrastText: '#fff' },
        success: { main: b.ok, dark: b.okText, contrastText: '#fff' },
        error: { main: b.danger },
        warning: { main: t.warning },
        background: { default: b.bg1, paper: b.surface },
        text: { primary: b.ink2, secondary: b.muted, disabled: b.faint },
        divider: b.line,
        action: { hover: b.surface3, selected: b.accentSoft },
    },
    shape: { borderRadius: t.radiusMd },
    typography: {
        fontFamily: b.fontFamily,
        fontSize: 14,
        h1: { ...headingFont, fontSize: 28, lineHeight: '34px', letterSpacing: '-0.8px' },
        h2: { ...headingFont, fontSize: 40, lineHeight: '46px', letterSpacing: '-1.4px' },
        h3: { ...headingFont, fontSize: 26, lineHeight: '32px', letterSpacing: '-0.7px' },
        h4: { ...headingFont, fontSize: 26, lineHeight: '32px', letterSpacing: '-0.7px' },
        h5: { ...headingFont, fontSize: 20, lineHeight: '26px', letterSpacing: '-0.4px' },
        h6: { ...headingFont, fontSize: 17, lineHeight: '24px', letterSpacing: '-0.3px' },
        subtitle1: { fontSize: 16, lineHeight: '24px', fontWeight: 700, letterSpacing: '-0.2px', color: b.ink },
        subtitle2: { fontSize: 13, lineHeight: '20px', fontWeight: 600 },
        body1: { fontSize: 14.5, lineHeight: '23px' },
        body2: { fontSize: 13, lineHeight: '20px' },
        caption: { fontSize: 12, lineHeight: '18px' },
        // The reference eyebrow: 11px, 800, wide tracking (use color="primary").
        overline: { fontSize: 11, lineHeight: '16px', fontWeight: 800, letterSpacing: '0.14em' },
        button: { textTransform: 'none', fontWeight: 700, fontSize: 14, lineHeight: '20px' },
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
                // The portal's primary action looks like the homepage cta (gradient,
                // 2px lift), without the arrow chip unless the page passes an endIcon.
                contained: {
                    fontWeight: 800,
                    letterSpacing: '-0.1px',
                    borderRadius: b.radiusButton,
                    background: b.ctaGradient,
                    boxShadow: b.ctaShadow,
                    '&:hover': { background: b.ctaGradient, boxShadow: b.ctaShadow, transform: 'translateY(-1px)', filter: 'saturate(1.05)' },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid var(--focus-color, #0F8FC7)', outlineOffset: 3, boxShadow: b.ctaShadow },
                    '&.Mui-disabled': { background: b.line, boxShadow: 'none', color: b.muted },
                },
                outlined: {
                    borderColor: b.line2,
                    color: b.ink2,
                    backgroundColor: b.surface,
                    borderRadius: b.radiusButton,
                    '&:hover': { borderColor: b.lineHover, backgroundColor: b.surface },
                },
                text: { '&:hover': { backgroundColor: 'rgba(13,42,66,0.05)' } },
            },
            variants: [
                // Secondary action in the reference chip style: surface-3 + line-2 hairline.
                {
                    props: { variant: 'soft' },
                    style: {
                        backgroundColor: b.surface3,
                        color: b.ink2,
                        border: `1px solid ${b.line2}`,
                        borderRadius: b.radiusButton,
                        '&:hover': { backgroundColor: b.surface, borderColor: b.lineHover },
                        '&:active': { transform: 'scale(0.98)' },
                        '&.Mui-disabled': { color: b.faint, backgroundColor: b.surface3, borderColor: b.line },
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
                        // Accent by default; cyan inside dark sections, which set --focus-color (cyan on white is under 3:1).
                        '&:focus-visible': { outline: '2px solid var(--focus-color, #0F8FC7)', outlineOffset: 3, boxShadow: b.ctaShadow },
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
                        '&:focus-visible': { outline: '2px solid var(--focus-color, #0F8FC7)', outlineOffset: 3, boxShadow: 'none' },
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
        // Reference card: white, 1px hairline, very soft cool shadow.
        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: { root: { borderRadius: b.radiusMd, boxShadow: b.shadow1, border: `1px solid ${b.line}` } },
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
        // Reference chips: pills; selected/filled ones are graphite with white text.
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 999, fontWeight: 700, fontSize: 12 },
                filled: { backgroundColor: b.graphite, color: '#fff' },
                outlined: { backgroundColor: b.surface3, borderColor: b.line2, color: b.ink2 },
                deleteIcon: { color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } },
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
            styleOverrides: { tooltip: { backgroundColor: b.graphite, borderRadius: t.radiusSm, fontSize: 12, fontWeight: 600, padding: '6px 10px' }, arrow: { color: b.graphite } },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: b.radiusLg, boxShadow: b.shadow3, border: `1px solid ${b.line}` },
                paperFullScreen: { borderRadius: 0, border: 0 },
            },
        },
        MuiBackdrop: { styleOverrides: { root: { '&:not(.MuiBackdrop-invisible)': { backgroundColor: 'rgba(3,7,12,0.48)' } } } },
        MuiDialogTitle: { styleOverrides: { root: { fontSize: 19, fontWeight: 800, letterSpacing: '-0.4px', color: b.ink, padding: '24px 24px 8px' } } },
        MuiDialogContent: { styleOverrides: { root: { padding: '8px 24px 16px' } } },
        MuiDialogActions: { styleOverrides: { root: { padding: '8px 24px 24px', gap: 4 } } },
        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: t.radiusMd, alignItems: 'center' },
                standardError: { backgroundColor: t.dangerSoft, color: t.dangerText, border: '1px solid rgba(239,68,68,0.2)' },
                standardInfo: { backgroundColor: b.accentSoft, color: b.accentInk, border: `1px solid ${b.accentLine}` },
                standardSuccess: { backgroundColor: b.okSoft, color: b.okText, border: '1px solid rgba(18,153,107,0.2)' },
                standardWarning: { backgroundColor: t.warningSoft, color: t.warningText, border: '1px solid rgba(245,158,11,0.2)' },
            },
        },
        MuiSnackbarContent: {
            styleOverrides: { root: { backgroundColor: b.graphite, borderRadius: t.radiusMd, fontSize: 14, fontWeight: 600 } },
        },
        MuiSkeleton: {
            defaultProps: { animation: 'wave' },
            styleOverrides: { root: { backgroundColor: t.surfaceMuted } },
        },
        MuiDivider: { styleOverrides: { root: { borderColor: t.border } } },
        MuiAvatar: { styleOverrides: { colorDefault: { backgroundColor: b.accentSoft, color: b.accentText, fontWeight: 700 } } },
        MuiLink: { styleOverrides: { root: { color: b.accentText, fontWeight: 700, textDecorationColor: 'rgba(11,106,148,0.3)', '&:hover': { color: b.accentInk } } } },
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
