'use client';

import { useMemo } from 'react';
import { paths } from '@/lib/i18n/routes';
import { I18nContext } from './i18n-context';

/**
 * Gives client components the page language. `dictionary` is the current
 * language's strings (from the [lang] layout); `slugMaps` lets the language
 * switcher translate category, skill and guide slugs.
 */
export default function I18nProvider({ lang, dictionary, slugMaps, children }) {
    const value = useMemo(() => ({ lang, t: dictionary, p: paths(lang), slugMaps }), [lang, dictionary, slugMaps]);
    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
