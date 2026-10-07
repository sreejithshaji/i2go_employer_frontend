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
};

const t = tokens;

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
