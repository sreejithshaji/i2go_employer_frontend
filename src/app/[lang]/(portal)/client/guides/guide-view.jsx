'use client';

import NextLink from 'next/link';
import { Box, Button, Card, Link, Stack, Typography } from '@mui/material';
import { FiArrowRight, FiBookOpen, FiExternalLink } from 'react-icons/fi';
import { tokens } from '@/app/theme';

/** One guide card on the guides index: { href, title, description }. */
export function GuideCard({ href, title, description, readLabel }) {
    return (
        <Card component={NextLink} href={href} sx={{ p: 3, display: 'flex', flexDirection: 'column', textDecoration: 'none', transition: `box-shadow 200ms ${tokens.ease}`, '&:hover': { boxShadow: tokens.shadowCardHover } }}>
            <Box sx={{ width: 40, height: 40, mb: 2, borderRadius: `${tokens.radiusMd}px`, display: 'grid', placeItems: 'center', color: 'primary.main', bgcolor: tokens.primarySoft }}>
                <FiBookOpen size={20} />
            </Box>
            <Typography variant="subtitle1" component="h2" sx={{ color: 'text.primary' }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, flex: 1 }}>{description}</Typography>
            <Typography variant="body2" sx={{ mt: 2, color: 'primary.main', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                {readLabel} <FiArrowRight />
            </Typography>
        </Card>
    );
}

/**
 * A guide (PLAN.md 11.12): h1, intro, contents, sections with optional
 * external links, FAQ and a call to action. All text comes from
 * the guides table (admin panel → Guides); `labels` are the dictionary strings it needs.
 */
export default function GuideView({ guide, labels, ctaHref, ctaLabel }) {
    return (
        <Box component="article" sx={{ maxWidth: 860 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 26, md: 34 }, lineHeight: { xs: '34px', md: '42px' } }}>{guide.title}</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.disabled' }}>{labels.updated}</Typography>
            <Typography sx={{ mt: 2, fontSize: 17, lineHeight: 1.7, color: 'text.secondary' }}>{guide.intro}</Typography>

            <Card component="nav" aria-label={labels.onThisPage} sx={{ mt: 3, p: 2.5 }}>
                <Typography variant="subtitle2" component="h2" sx={{ mb: 1 }}>{labels.onThisPage}</Typography>
                <Box component="ol" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.5 } }}>
                    {guide.sections.map((section) => (
                        <li key={section.id}><Link href={`#${section.id}`} underline="hover">{section.heading}</Link></li>
                    ))}
                    {guide.faq.length > 0 && <li><Link href="#faq" underline="hover">{labels.faq}</Link></li>}
                </Box>
            </Card>

            {guide.sections.map((section) => (
                <Box component="section" key={section.id} id={section.id} sx={{ mt: 4, scrollMarginTop: 96 }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>{section.heading}</Typography>
                    {section.paragraphs.map((text, i) => (
                        <Typography key={i} sx={{ mb: 1.5, lineHeight: 1.75, color: 'text.secondary' }}>{text}</Typography>
                    ))}
                    {section.links?.length > 0 && (
                        <Stack spacing={0.75}>
                            {section.links.map((link) => (
                                <Link key={link.href} href={link.href} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 500 }}>
                                    {link.label} <FiExternalLink size={14} aria-hidden />
                                </Link>
                            ))}
                        </Stack>
                    )}
                </Box>
            ))}

            {guide.faq.length > 0 && (
                <Box component="section" id="faq" sx={{ mt: 5, scrollMarginTop: 96 }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 2 }}>{labels.faq}</Typography>
                    <Stack spacing={1.5}>
                        {guide.faq.map((item) => (
                            <Card key={item.q} sx={{ p: { xs: 2, md: 2.5 } }}>
                                <Typography variant="subtitle1" component="h3">{item.q}</Typography>
                                <Typography color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.7 }}>{item.a}</Typography>
                            </Card>
                        ))}
                    </Stack>
                </Box>
            )}

            <Card sx={{ mt: 5, p: { xs: 2.5, md: 3 }, bgcolor: 'primary.main', color: '#fff', boxShadow: 'none', borderRadius: `${tokens.radiusXl}px` }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="h2" sx={{ color: '#fff' }}>{labels.ctaTitle}</Typography>
                        <Typography sx={{ mt: 0.5, color: 'rgba(255,255,255,0.85)' }}>{labels.ctaText}</Typography>
                    </Box>
                    <Button component={NextLink} href={ctaHref} size="large" endIcon={<FiArrowRight />} sx={{ flexShrink: 0, bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: tokens.primarySoft } }}>
                        {ctaLabel}
                    </Button>
                </Stack>
            </Card>
        </Box>
    );
}
