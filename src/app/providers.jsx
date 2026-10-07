'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from '@/features/auth';
import { I18nProvider } from '@/features/i18n';
import theme from './theme';

/** App-wide client providers: page language, MUI theme, CSS reset and the auth session. */
export default function Providers({ lang, dictionary, slugMaps, children }) {
    return (
        <I18nProvider lang={lang} dictionary={dictionary} slugMaps={slugMaps}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
        </I18nProvider>
    );
}
