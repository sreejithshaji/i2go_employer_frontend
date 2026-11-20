import { Box, Typography } from '@mui/material';
import { FiInfo } from 'react-icons/fi';
import { brand as b } from '@/app/theme';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Eyebrow from '@/app/[lang]/(marketing)/client/components/eyebrow';

/**
 * A legal page (14.5b): an 820px reading column on the page canvas, no card.
 * There's an eyebrow, an 800 title and an "as of" line. Each section starts
 * under a 1px hairline. Each page has a German and an English text; the German
 * one is binding, and English pages pass `notice` (t.legal.germanPrevails) to
 * say so.
 */
export default function LegalDocument({ lang = 'en', notice, title, asOf, intro, children }) {
    return (
        <Box component="article" lang={lang} sx={{ maxWidth: b.readingMax }}>
            <Eyebrow sx={{ mb: 1 }}>{getDictionary(lang).legal.eyebrow}</Eyebrow>
            <Typography component="h2" sx={{ fontSize: { xs: 24, md: 30 }, lineHeight: 1.2, fontWeight: 800, letterSpacing: { xs: '-0.5px', md: '-0.8px' }, color: b.ink }}>
                {title}
            </Typography>
            {asOf && <Typography sx={{ mt: 1, fontSize: 13.5, fontWeight: 600, color: b.muted }}>{asOf}</Typography>}
            {notice && (
                <Box sx={{ mt: 3, display: 'flex', gap: 1.25, alignItems: 'flex-start', p: 2, borderRadius: `${b.radiusSm}px`, bgcolor: b.accentSoft, border: `1px solid ${b.accentLine}` }}>
                    <Box aria-hidden sx={{ display: 'flex', mt: '2px', color: b.accentText }}><FiInfo size={16} /></Box>
                    <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: b.ink2 }}>{notice}</Typography>
                </Box>
            )}
            {intro && <Typography sx={{ mt: 2.5, fontSize: 16, lineHeight: 1.7, color: b.muted }}>{intro}</Typography>}
            <Box
                sx={{
                    mt: { xs: 3, md: 4 },
                    color: b.muted,
                    fontSize: 15,
                    '& > section, & > * > section': { borderTop: `1px solid ${b.line}`, pt: { xs: 2.5, md: 3 }, pb: { xs: 1, md: 1.5 } },
                    '& h3': { color: b.ink, fontSize: { xs: 17, md: 18 }, lineHeight: 1.35, fontWeight: 800, letterSpacing: '-0.2px', m: 0, mb: 1.25, scrollMarginTop: 96 },
                    '& h4': { color: b.ink2, fontSize: 15, fontWeight: 700, mt: 2, mb: 0.75 },
                    '& p': { m: 0, mb: 1.5, lineHeight: 1.75 },
                    '& ul, & ol': { m: 0, mb: 1.5, pl: 3, lineHeight: 1.75 },
                    '& li': { mb: 0.5 },
                    '& strong': { color: b.ink2, fontWeight: 700 },
                    '& a': { color: b.accentText, fontWeight: 600, textUnderlineOffset: '2px', borderRadius: '4px', '&:focus-visible': b.focusRing },
                    '& address': { fontStyle: 'normal', lineHeight: 1.75, mb: 1.5 },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

/** A numbered or plain section heading with an anchor id. */
export function LegalSection({ id, title, children }) {
    return (
        <Box component="section" id={id}>
            <h3>{title}</h3>
            {children}
        </Box>
    );
}
