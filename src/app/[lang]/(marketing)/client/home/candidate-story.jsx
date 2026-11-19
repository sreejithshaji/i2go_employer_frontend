'use client';

import { Box, Typography } from '@mui/material';
import { useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';
import ContactPills, { mailtoHref } from '../components/contact-pills';
import Container from '../components/container';
import CtaButton from '../components/cta-button';
import Eyebrow from '../components/eyebrow';
import Timeline from '../components/timeline';

/**
 * "For candidates" (plan §5, §6 rows 7–8): the light section (white band
 * between hairlines) with a soft accent glow and contour lines, the opening, the six-step timeline (step 01 holds
 * the contact action, step 03 the app note, D4) and the closing CTA set apart
 * by a hairline. Anchor: #candidates. Contact data from COMPANY only (D6).
 */
export default function CandidateStory() {
    const { t } = useI18n();
    const c = t.landing.candidate;
    const subject = c.contact.mailSubject;

    const steps = c.steps.map((step, i) => ({
        key: step.title,
        title: step.title,
        text: step.text,
        extra: i === 0 ? <ContactPanel subject={subject} /> : i === 2 ? <AppNote>{c.appNote}</AppNote> : null,
    }));

    return (
        <Box
            component="section"
            id="candidates"
            aria-labelledby="candidates-title"
            sx={{
                position: 'relative', overflow: 'hidden', isolation: 'isolate',
                scrollMarginTop: { xs: b.navHeightMobile, md: b.navHeight },
                bgcolor: b.surface, color: b.ink,
                borderTop: `1px solid ${b.line}`, borderBottom: `1px solid ${b.line}`,
                py: { xs: 7, md: 12 },
            }}
        >
            <Backdrop />
            <Container sx={{ position: 'relative', maxWidth: b.readingMax + 80 }}>
                <Eyebrow>{c.eyebrow}</Eyebrow>
                <Typography
                    id="candidates-title"
                    component="h2"
                    sx={{
                        m: 0, mt: 1.5,
                        fontSize: { xs: 32, md: 48 }, lineHeight: 1.08, fontWeight: 800,
                        letterSpacing: { xs: '-0.8px', md: '-1.8px' }, color: b.ink,
                    }}
                >
                    {c.title}
                </Typography>
                <Typography component="p" sx={{ m: 0, mt: 2.25, maxWidth: 680, fontSize: 16.5, lineHeight: 1.65, fontWeight: 500, color: b.muted }}>
                    {c.lead}
                </Typography>

                <Box sx={{ mt: { xs: 5, md: 7 } }}>
                    <Timeline steps={steps} idPrefix="candidate-step" label={c.railLabel} />
                </Box>

                <CandidateCta subject={subject} />
            </Container>
        </Box>
    );
}

/** Step 01's action: the one bordered panel in the timeline (plan §5.2). */
function ContactPanel({ subject }) {
    const { t } = useI18n();
    return (
        <Box
            sx={{
                p: { xs: 2, md: 2.5 }, borderRadius: `${b.radiusMd}px`, maxWidth: 620,
                border: `1px solid ${b.line}`, bgcolor: b.bg1,
                display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, gap: 1.5, flexWrap: 'wrap',
            }}
        >
            <CtaButton href={mailtoHref(subject)} sx={{ justifyContent: { xs: 'space-between', md: 'center' } }}>
                {t.landing.candidate.contact.button}
            </CtaButton>
            <ContactPills subject={subject} />
        </Box>
    );
}

/** Small secondary line about the I2Go Portal app (D4). */
function AppNote({ children }) {
    return (
        <Typography component="p" sx={{ m: 0, maxWidth: 620, fontSize: 13, lineHeight: 1.55, fontWeight: 600, color: b.muted }}>
            {children}
        </Typography>
    );
}

/** Closing CTA at the end of the section, set apart by a hairline (plan §5.4). */
function CandidateCta({ subject }) {
    const { t } = useI18n();
    const cta = t.landing.candidate.cta;
    return (
        <Box component="section" aria-labelledby="candidate-cta-title" sx={{ mt: { xs: 7, md: 10 }, pt: { xs: 5, md: 7 }, borderTop: `1px solid ${b.line}` }}>
            <Typography
                id="candidate-cta-title"
                component="h3"
                sx={{ m: 0, maxWidth: 680, fontSize: { xs: 28, md: 40 }, lineHeight: 1.1, fontWeight: 800, letterSpacing: { xs: '-0.7px', md: '-1.4px' }, color: b.ink }}
            >
                {cta.title}
            </Typography>
            <Typography component="p" sx={{ m: 0, mt: 2, maxWidth: 620, fontSize: 16.5, lineHeight: 1.65, fontWeight: 500, color: b.muted }}>
                {cta.text}
            </Typography>
            <Box sx={{ mt: { xs: 3.5, md: 4 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, gap: 1.5, flexWrap: 'wrap' }}>
                <CtaButton href={mailtoHref(subject)} sx={{ justifyContent: { xs: 'space-between', md: 'center' } }}>
                    {cta.primary}
                </CtaButton>
                <ContactPills subject={subject} />
            </Box>
            <Typography component="p" sx={{ m: 0, mt: 2.5, fontSize: 13, lineHeight: 1.55, fontWeight: 600, color: b.muted }}>
                {cta.paidBy}
            </Typography>
        </Box>
    );
}

// Contour lines: irregular concentric rings around the bottom-left corner,
// computed once (deterministic, so server and client render the same paths).
const CONTOURS = Array.from({ length: 9 }, (_, k) => {
    const R = 120 + k * 58;
    const points = Array.from({ length: 73 }, (_, j) => {
        const a = (j / 72) * Math.PI * 2;
        const r = R * (1 + 0.07 * Math.sin(3 * a + k * 0.5) + 0.045 * Math.cos(5 * a + 1 + k * 0.3));
        return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
    });
    return `M${points.join('L')}Z`;
});

/** Decoration of the section: soft accent glow top-left, contour lines bottom-left fading upward. */
function Backdrop() {
    return (
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
            <Box
                className="candidate-glow"
                sx={{ position: 'absolute', top: { xs: -160, md: -220 }, left: { xs: -160, md: -120 }, width: { xs: 420, md: 640 }, height: { xs: 420, md: 640 }, background: 'radial-gradient(closest-side, rgba(15,143,199,0.08), transparent 72%)' }}
            />
            <Box
                component="svg"
                viewBox="-640 -640 1280 1280"
                sx={{
                    position: 'absolute', left: { xs: -380, md: -320 }, bottom: { xs: -380, md: -320 },
                    width: { xs: 760, md: 1040 }, height: { xs: 760, md: 1040 },
                    maskImage: 'linear-gradient(to top, #000 30%, transparent 75%)',
                    WebkitMaskImage: 'linear-gradient(to top, #000 30%, transparent 75%)',
                }}
            >
                {CONTOURS.map((d) => (
                    <path key={d.slice(0, 24)} d={d} fill="none" stroke="rgba(10,15,22,0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}
            </Box>
        </Box>
    );
}
