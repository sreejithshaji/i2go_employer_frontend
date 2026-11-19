'use client';

import { Box, Typography } from '@mui/material';
import { useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';
import Container from '../components/container';
import CtaButton from '../components/cta-button';
import Eyebrow from '../components/eyebrow';
import ProgressStrip, { PROGRESS_STRIP_HEIGHT } from '../components/progress-strip';
import StepChapter from '../components/step-chapter';
import StepRail from '../components/step-rail';
import { useActiveStep } from '../components/use-active-step';
import EmployerCta, { useEmployerCta } from './employer-cta';
import { ExploreVisual, ManageVisual, MeetVisual, PoolVisual, ShortlistVisual, WelcomeVisual } from './employer-steps';

const ID = 'employer-step';

/**
 * "For employers" (plan §4, §6 rows 5–6), the dark navy section: opening, then from 900px a sticky
 * rail beside the six step chapters; below 900px a sticky progress strip
 * instead of the rail. Ends with the dark CTA panel. No `overflow` on the
 * section, so the rail and strip can stick. Anchor: #employers.
 * `total` and `jobs` feed step 01.
 */
export default function EmployerStory({ total = 0, jobs = [] }) {
    const { t } = useI18n();
    const e = t.landing.employer;
    const active = useActiveStep(e.steps.map((_, i) => `${ID}-${i + 1}`));
    const railCta = useEmployerCta();

    const visuals = [
        <PoolVisual key="pool" total={total} jobs={jobs} />,
        <ExploreVisual key="explore" />,
        <ShortlistVisual key="shortlist" />,
        <MeetVisual key="meet" />,
        <ManageVisual key="manage" />,
        <WelcomeVisual key="welcome" />,
    ];
    const scrollMargin = { xs: b.navHeightMobile + PROGRESS_STRIP_HEIGHT + 16, md: b.navHeight + 24 };

    return (
        <Box
            component="section"
            id="employers"
            aria-labelledby="employers-title"
            sx={{
                scrollMarginTop: { xs: b.navHeightMobile, md: b.navHeight },
                background: b.darkSection, color: b.onDark.text,
                py: { xs: 7, md: 12 },
            }}
        >
            <Container>
                <Eyebrow tone="dark">{e.eyebrow}</Eyebrow>
                <Typography
                    id="employers-title"
                    component="h2"
                    sx={{
                        m: 0, mt: 1.5, maxWidth: 820,
                        fontSize: { xs: 32, md: 48 }, lineHeight: 1.08, fontWeight: 800,
                        letterSpacing: { xs: '-0.8px', md: '-1.8px' }, color: b.onDark.text,
                    }}
                >
                    {e.title}
                </Typography>
                <Typography component="p" sx={{ m: 0, mt: 2.25, maxWidth: 680, fontSize: 16.5, lineHeight: 1.65, fontWeight: 500, color: b.onDark.body }}>
                    {e.lead}
                </Typography>

                <Box
                    sx={{
                        mt: { xs: 4, md: 7 }, display: 'grid', alignItems: 'start',
                        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '260px minmax(0, 1fr)' }, columnGap: { md: 7 },
                    }}
                >
                    <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: b.navHeight + 24 }}>
                        <StepRail steps={e.steps} active={active} idPrefix={ID} label={e.railLabel} />
                        {railCta.primary && (
                            <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${b.onDark.border}` }}>
                                <CtaButton href={railCta.primary.href} size="small">{railCta.primary.label}</CtaButton>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <ProgressStrip count={e.steps.length} active={active} idPrefix={ID} label={e.mobileProgress} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 6, md: 8 } }}>
                            {e.steps.map((step, i) => (
                                <StepChapter
                                    key={step.title}
                                    id={`${ID}-${i + 1}`}
                                    index={i}
                                    title={step.title}
                                    text={step.text}
                                    scrollMargin={scrollMargin}
                                >
                                    {visuals[i]}
                                </StepChapter>
                            ))}
                        </Box>
                    </Box>
                </Box>

                <EmployerCta />
            </Container>
        </Box>
    );
}
