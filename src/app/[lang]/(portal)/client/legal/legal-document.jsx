import { Alert, Box, Card, Typography } from '@mui/material';

/**
 * Card with a title, an "as of" line and readable prose for the legal pages.
 * Each page has a German and an English text; the German one is binding, and
 * English pages pass `notice` (t.legal.germanPrevails) to say so.
 */
export default function LegalDocument({ lang = 'en', notice, title, asOf, intro, children }) {
    return (
        <Card component="article" lang={lang} sx={{ p: { xs: 2.5, md: 5 }, maxWidth: 860, mx: 'auto' }}>
            {notice && <Alert severity="info" sx={{ mb: 3 }}>{notice}</Alert>}
            <Typography variant="h4" component="h2" sx={{ fontSize: { xs: 24, md: 28 } }}>{title}</Typography>
            {asOf && <Typography variant="body2" sx={{ color: 'text.disabled', mt: 0.5 }}>{asOf}</Typography>}
            {intro && <Typography color="text.secondary" sx={{ mt: 2 }}>{intro}</Typography>}
            <Box
                sx={{
                    mt: 3,
                    color: 'text.secondary',
                    '& h3': { color: 'text.primary', fontSize: 18, fontWeight: 600, mt: 4, mb: 1, scrollMarginTop: 96 },
                    '& p': { m: 0, mb: 1.5, lineHeight: 1.7 },
                    '& ul': { m: 0, mb: 1.5, pl: 3, lineHeight: 1.7 },
                    '& li': { mb: 0.5 },
                    '& strong': { color: 'text.primary', fontWeight: 600 },
                    '& a': { color: 'primary.main', fontWeight: 500 },
                    '& address': { fontStyle: 'normal', lineHeight: 1.7, mb: 1.5 },
                }}
            >
                {children}
            </Box>
        </Card>
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
