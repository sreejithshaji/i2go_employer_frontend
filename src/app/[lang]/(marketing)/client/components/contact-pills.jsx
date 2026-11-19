'use client';

import { Box } from '@mui/material';
import { FiMail, FiPhone } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { COMPANY } from '@/lib/portal/legal';
import { brand as b } from '@/app/theme';

/** mailto: link to the company address with a prefilled subject. */
export function mailtoHref(subject) {
    return `mailto:${COMPANY.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}

/** tel: link built from COMPANY.phone. */
export const telHref = () => `tel:${COMPANY.phone.replace(/[^\d+]/g, '')}`;

const pillSx = {
    display: 'inline-flex', alignItems: 'center', gap: 1, minHeight: 44, px: 1.75, maxWidth: '100%',
    borderRadius: 999, border: `1px solid ${b.line2}`, bgcolor: b.surface,
    boxShadow: b.shadow1,
    color: b.ink, fontSize: 14, fontWeight: 700, textDecoration: 'none', overflowWrap: 'anywhere',
    transition: `border-color 200ms ${b.ease}, background-color 200ms ${b.ease}`,
    '& svg': { color: b.accentText, flexShrink: 0 },
    '&:hover': { borderColor: b.lineHover, bgcolor: b.surface3 },
    '&:focus-visible': { outline: `2px solid ${b.accent}`, outlineOffset: 2 },
};

/**
 * Email and phone as pills on the light candidate section (plan §5.4), from COMPANY only (D6).
 * Each has an accessible name that says what it is ("Email: …").
 */
export default function ContactPills({ subject, sx }) {
    const { t } = useI18n();
    const c = t.landing.candidate.contact;
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ...sx }}>
            <Box component="a" href={mailtoHref(subject)} aria-label={`${c.email}: ${COMPANY.email}`} sx={pillSx}>
                <FiMail size={16} aria-hidden />
                {COMPANY.email}
            </Box>
            <Box component="a" href={telHref()} aria-label={`${c.phone}: ${COMPANY.phone}`} sx={pillSx}>
                <FiPhone size={16} aria-hidden />
                {COMPANY.phone}
            </Box>
        </Box>
    );
}
