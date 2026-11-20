'use client';

import NextLink from 'next/link';
import { Box, Card, Link, Typography } from '@mui/material';
import { FiArrowRight, FiBookOpen, FiExternalLink } from 'react-icons/fi';
import { brand as b } from '@/app/theme';
import CtaButton from '@/app/[lang]/(marketing)/client/components/cta-button';
import DriftGlow from '@/app/[lang]/(marketing)/client/components/drift-glow';
import Eyebrow from '@/app/[lang]/(marketing)/client/components/eyebrow';
import Reveal from '@/app/[lang]/(marketing)/client/components/reveal';

const num = (i) => String(i + 1).padStart(2, '0');

/** One guide card on the guides index: { href, title, description }. */
export function GuideCard({ href, title, description, readLabel }) {
    return (
        <Card
            component={NextLink}
            href={href}
            sx={{
                p: 3, display: 'flex', flexDirection: 'column', textDecoration: 'none',
                transition: `transform 280ms ${b.ease}, box-shadow 280ms ${b.ease}, border-color 280ms ${b.ease}`,
                '&:hover': { transform: 'translateY(-1px)', borderColor: b.lineHover, boxShadow: b.shadow2 },
                '&:hover .guide-read svg': { transform: 'translateX(2px)' },
                '&:focus-visible': b.focusRing,
                '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' } },
            }}
        >
            <Box aria-hidden sx={{ width: 40, height: 40, mb: 2, borderRadius: '12px', display: 'grid', placeItems: 'center', color: b.cyan, bgcolor: b.graphite }}>
                <FiBookOpen size={18} />
            </Box>
            <Typography component="h2" sx={{ fontSize: 17, lineHeight: 1.35, fontWeight: 800, letterSpacing: '-0.2px', color: b.ink }}>{title}</Typography>
            <Typography sx={{ mt: 0.75, flex: 1, fontSize: 14, lineHeight: 1.6, color: b.muted }}>{description}</Typography>
            <Typography className="guide-read" sx={{ mt: 2, fontSize: 14, fontWeight: 700, color: b.accentText, display: 'inline-flex', alignItems: 'center', gap: 0.5, '& svg': { transition: `transform 280ms ${b.ease}` } }}>
                {readLabel} <FiArrowRight aria-hidden />
            </Typography>
        </Card>
    );
}

// Section heading with the two-digit number (as on the candidate profile, 14.4a);
// the number is decoration, so screen readers read only the title.
function SectionHeading({ index, children }) {
    return (
        <Typography component="h2" sx={{ mb: 1.5, display: 'flex', alignItems: 'baseline', gap: 1.25, fontSize: { xs: 19, md: 22 }, lineHeight: 1.3, fontWeight: 800, letterSpacing: '-0.4px', color: b.ink }}>
            <Box component="span" aria-hidden sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: b.accentText, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                {index}
            </Box>
            <span>{children}</span>
        </Typography>
    );
}

const sectionSx = { borderTop: `1px solid ${b.line}`, pt: { xs: 3, md: 3.5 }, pb: { xs: 1.5, md: 2 }, scrollMarginTop: 96 };

/**
 * A guide (PLAN.md 11.12; restyled in 14.5b). It has an eyebrow, an h1 and an
 * intro, then contents, numbered sections with optional external links, FAQ
 * and a call to action, all in the 820px reading column and split by
 * hairlines. All text comes from the guides table (admin panel → Guides);
 * `labels` are the dictionary strings it needs.
 */
export default function GuideView({ guide, labels, ctaHref, ctaLabel }) {
    const hasFaq = guide.faq.length > 0;
    return (
        <Box component="article" sx={{ maxWidth: b.readingMax }}>
            <Eyebrow sx={{ mb: 1 }}>{labels.eyebrow}</Eyebrow>
            <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 38 }, lineHeight: { xs: '34px', md: '44px' }, fontWeight: 800, letterSpacing: { xs: '-0.6px', md: '-1.2px' }, color: b.ink }}>
                {guide.title}
            </Typography>
            <Typography sx={{ mt: 1.25, fontSize: 13.5, fontWeight: 600, color: b.muted }}>{labels.updated}</Typography>
            <Typography sx={{ mt: 2.5, fontSize: { xs: 16, md: 17 }, lineHeight: 1.7, color: b.muted }}>{guide.intro}</Typography>

            <Box component="nav" aria-label={labels.onThisPage} sx={{ mt: { xs: 3.5, md: 4.5 }, mb: { xs: 1, md: 2 } }}>
                <Eyebrow component="h2" sx={{ mb: 1, color: b.muted }}>{labels.onThisPage}</Eyebrow>
                <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', columnGap: 4, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
                    {[...guide.sections.map((s) => ({ id: s.id, label: s.heading })), ...(hasFaq ? [{ id: 'faq', label: labels.faq }] : [])].map((item, i) => (
                        <Box component="li" key={item.id} sx={{ borderTop: `1px solid ${b.line}` }}>
                            <Box
                                component="a"
                                href={`#${item.id}`}
                                sx={{
                                    display: 'flex', alignItems: 'baseline', gap: 1.25, py: 1.25, minHeight: 44, boxSizing: 'border-box',
                                    textDecoration: 'none', color: b.ink2, fontSize: 14, fontWeight: 700, lineHeight: 1.45, borderRadius: '6px',
                                    transition: `color 200ms ${b.ease}`,
                                    '&:hover': { color: b.accentText },
                                    '&:focus-visible': b.focusRing,
                                }}
                            >
                                <Box component="span" aria-hidden sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: b.accentText, fontVariantNumeric: 'tabular-nums' }}>{num(i)}</Box>
                                {item.label}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {guide.sections.map((section, i) => (
                <Reveal component="section" key={section.id} id={section.id} sx={sectionSx}>
                    <SectionHeading index={num(i)}>{section.heading}</SectionHeading>
                    {section.paragraphs.map((text, j) => (
                        <Typography key={j} sx={{ mb: 1.5, fontSize: 15.5, lineHeight: 1.75, color: b.muted }}>{text}</Typography>
                    ))}
                    {section.links?.length > 0 && (
                        <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 1, mb: 1.5, p: 0, display: 'grid', gap: 0.75 }}>
                            {section.links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} target="_blank" rel="noopener" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontSize: 14.5, fontWeight: 700, color: b.accentText, borderRadius: '4px', '&:focus-visible': b.focusRing }}>
                                        {link.label} <FiExternalLink size={14} aria-hidden />
                                    </Link>
                                </li>
                            ))}
                        </Box>
                    )}
                </Reveal>
            ))}

            {hasFaq && (
                <Reveal component="section" id="faq" sx={sectionSx}>
                    <SectionHeading index={num(guide.sections.length)}>{labels.faq}</SectionHeading>
                    <Box component="dl" sx={{ m: 0 }}>
                        {guide.faq.map((item, j) => (
                            <Box key={item.q} sx={{ py: 2, borderTop: j === 0 ? 'none' : `1px solid ${b.line}` }}>
                                <Typography component="dt" sx={{ fontSize: 15.5, lineHeight: 1.45, fontWeight: 800, color: b.ink2 }}>{item.q}</Typography>
                                <Typography component="dd" sx={{ m: 0, mt: 0.75, fontSize: 15, lineHeight: 1.7, color: b.muted }}>{item.a}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Reveal>
            )}

            {/* Dark panel, like the employer CTA and the profile's enquiry panel (14.4a). */}
            <Reveal
                sx={{
                    '--focus-color': b.cyan,
                    position: 'relative', overflow: 'hidden', isolation: 'isolate',
                    mt: { xs: 3, md: 4 }, p: { xs: 3, md: 4 },
                    borderRadius: `${b.radiusPanel}px`, background: b.darkPanelBase, border: `1px solid ${b.darkPanelBorder}`, boxShadow: b.shadowDarkPanel,
                    display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2.5, md: 3 }, alignItems: { md: 'center' },
                }}
            >
                <DriftGlow color="rgba(31,200,255,0.16)" sx={{ zIndex: -1, width: 420, height: 300, top: -150, right: -80 }} />
                <Box sx={{ flex: 1 }}>
                    <Typography component="h2" sx={{ fontSize: { xs: 20, md: 22 }, lineHeight: 1.3, fontWeight: 800, letterSpacing: '-0.4px', color: b.onDark.text }}>{labels.ctaTitle}</Typography>
                    <Typography sx={{ mt: 0.75, fontSize: 15, lineHeight: 1.65, color: b.onDark.body }}>{labels.ctaText}</Typography>
                </Box>
                <CtaButton href={ctaHref} sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', md: 'center' } }}>{ctaLabel}</CtaButton>
            </Reveal>
        </Box>
    );
}
