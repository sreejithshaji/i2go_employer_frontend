'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import { FiGlobe } from 'react-icons/fi';
import { LOCALES } from '@/lib/i18n/config';
import { translatePath } from '@/lib/i18n/routes';
import { useI18n } from './i18n-context';

/**
 * Link to the same page in the other language (PLAN.md 11.3.4). Category,
 * skill and guide slugs are translated; filters in the query string aren't
 * carried over. sx styles the link; `showIcon` adds a globe.
 */
export default function LanguageSwitcher({ sx, showIcon = true, onNavigate }) {
    const { lang, t, slugMaps } = useI18n();
    const pathname = usePathname();
    const other = LOCALES.find((l) => l !== lang);
    const name = t.common.languageNames[other];

    return (
        <Box
            component={NextLink}
            href={translatePath(pathname, other, slugMaps)}
            hrefLang={other}
            lang={other}
            onClick={onNavigate}
            aria-label={`${t.common.language}: ${name}`}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, textDecoration: 'none', ...sx }}
        >
            {showIcon && <FiGlobe size={16} aria-hidden />}
            {name}
        </Box>
    );
}
