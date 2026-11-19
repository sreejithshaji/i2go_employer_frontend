'use client';

import { Box, Typography } from '@mui/material';
import { FiArrowRight } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';
import Container from '../components/container';
import Eyebrow from '../components/eyebrow';

/**
 * "Choose your journey" (plan §6 row 4): two equal panels linking to the
 * employer story (#employers, dark panel — matches the navy section) and the
 * candidate story (#candidates, light card — matches the light section).
 * Clicks scroll smoothly to the section (instant under reduced motion).
 * Stacked below 900px.
 */
export default function JourneyDoors() {
    const { t } = useI18n();
    const d = t.landing.doors;
    return (
        <Box component="section" aria-labelledby="doors-title" sx={{ py: { xs: 4, md: 5 } }}>
            <Container>
                <Eyebrow component="h2" id="doors-title">{d.label}</Eyebrow>
                <Box sx={{ mt: { xs: 2, md: 2.5 }, display: 'grid', gap: { xs: 1.5, md: 3 }, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                    <Door href="#employers" copy={d.employer} meta={`01–06 · ${d.steps}`} dark />
                    <Door href="#candidates" copy={d.candidate} meta={`01–06 · ${d.steps}`} />
                </Box>
            </Container>
        </Box>
    );
}

function smoothScrollTo(event, href) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // scrollIntoView honours the section's scroll-margin-top (clears the sticky nav).
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.history.pushState(null, '', href);
}

function Door({ href, copy, meta, dark = false }) {
    const c = dark
        ? { title: b.onDark.text, text: b.onDark.body, meta: b.onDark.subtle, chipBg: 'rgba(255,255,255,0.08)', chipBgHover: 'rgba(255,255,255,0.16)', chip: b.cyan, focus: b.cyan }
        : { title: b.ink, text: b.muted, meta: b.muted, chipBg: b.accentSoft, chipBgHover: b.accentLine, chip: b.accentText, focus: b.accent };
    const surface = dark
        ? { background: b.darkPanel, border: `1px solid ${b.darkPanelBorder}`, boxShadow: b.shadowDarkPanel }
        : { bgcolor: b.surface, border: `1px solid ${b.line}`, boxShadow: b.shadow1 };
    const hover = dark
        ? { transform: 'translateY(-1px)', boxShadow: b.shadow3 }
        : { transform: 'translateY(-1px)', borderColor: b.lineHover, boxShadow: b.shadow2 };
    return (
        <Box
            component="a"
            href={href}
            onClick={(event) => smoothScrollTo(event, href)}
            sx={{
                ...surface,
                position: 'relative', display: 'flex', flexDirection: 'column',
                p: { xs: 2.5, md: 3 }, borderRadius: `${b.radiusLg}px`, textDecoration: 'none', overflow: 'hidden',
                transition: `transform 280ms ${b.ease}, border-color 280ms ${b.ease}, box-shadow 280ms ${b.ease}`,
                '&:hover': hover,
                '&:hover .door-chip': { bgcolor: c.chipBgHover, transform: 'translateX(2px)' },
                '&:focus-visible': { outline: `2px solid ${c.focus}`, outlineOffset: 3 },
            }}
        >
            <Eyebrow tone={dark ? 'dark' : 'light'}>{copy.eyebrow}</Eyebrow>
            <Typography component="h3" sx={{ m: 0, mt: 1, fontSize: { xs: 20, md: 24 }, lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.8px', color: c.title }}>
                {copy.title}
            </Typography>
            <Typography component="p" sx={{ m: 0, mt: 0.75, maxWidth: 420, fontSize: 15, lineHeight: 1.65, fontWeight: 500, color: c.text }}>
                {copy.text}
            </Typography>
            <Box sx={{ mt: 'auto', pt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Typography component="span" sx={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', color: c.meta }}>
                    {meta}
                </Typography>
                <Box
                    aria-hidden
                    className="door-chip"
                    sx={{
                        width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
                        bgcolor: c.chipBg, color: c.chip, transition: `background-color 280ms ${b.ease}, transform 280ms ${b.ease}`,
                    }}
                >
                    <FiArrowRight size={18} />
                </Box>
            </Box>
        </Box>
    );
}
