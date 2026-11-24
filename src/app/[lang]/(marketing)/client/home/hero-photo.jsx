import Image from 'next/image';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

// Slow "Ken Burns" push-in on the photo.
const zoom = keyframes`
  from { transform: scale(1.02); }
  to   { transform: scale(1.1); }
`;

/** From this width the H1 runs on one line per part and the photo fades in early (hero-section). */
export const WIDE_HERO = '@media (min-width: 1280px)';

const photoMask = {
    xs: 'linear-gradient(180deg, #000 0%, #000 55%, transparent 100%)',
    md: 'linear-gradient(90deg, transparent 0%, transparent 30%, rgba(0,0,0,0.55) 55%, #000 80%)',
};
const widePhotoMask = 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 22%, #000 48%)';

// Ends at --photo-opacity, so the fill-mode doesn't override the dimmer phone opacity.
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: var(--photo-opacity); }
`;

/**
 * Background photo of the light hero: a recruiter's handshake with a
 * professional man. On desktop it fills the right part and fades into the
 * light background towards the text; on phones it sits behind everything,
 * faded, so the text stays readable. Decorative (alt="", aria-hidden).
 * Photo: Vitaly Gariev on Unsplash (Unsplash License),
 * https://unsplash.com/photos/jEpZNyFSQwQ
 */
export default function HeroPhoto() {
    return (
        <Box
            aria-hidden
            sx={{
                position: 'absolute',
                top: 0, bottom: 0, right: 0,
                width: { xs: '100%', md: '62%' },
                overflow: 'hidden',
                pointerEvents: 'none',
                '--photo-opacity': { xs: 0.12, md: 1 },
                opacity: 'var(--photo-opacity)',
                // Fade the left edge into the light hero (desktop) / bottom on phones.
                // 900–1279px: the text column reaches further into the photo, so the fade starts later.
                maskImage: photoMask,
                WebkitMaskImage: photoMask,
                [WIDE_HERO]: { maskImage: widePhotoMask, WebkitMaskImage: widePhotoMask },
                animation: `${fadeIn} 1200ms ease-out both`,
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
        >
            <Box
                sx={{
                    position: 'absolute', inset: 0,
                    animation: `${zoom} 24s ease-in-out infinite alternate`,
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                }}
            >
                <Image
                    src="/images/hero-recruitment.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 62vw"
                    fetchPriority="high"
                    loading="eager"
                    style={{ objectFit: 'cover', objectPosition: '70% 30%' }}
                />
            </Box>
            {/* Soft light wash + bottom fade so the photo sits in the light hero and the
                category row and ticker below stay on a light ground */}
            <Box
                sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(207,218,227,0.08) 0%, rgba(207,218,227,0) 40%, rgba(198,210,220,0.92) 100%)',
                }}
            />
            {/* Desktop: lighten the left part, where the long (German) H1 runs onto the photo,
                so the dark title keeps its contrast there. The face on the right stays clear. */}
            <Box
                sx={{
                    position: 'absolute', inset: 0, display: { xs: 'none', md: 'block' },
                    background: 'linear-gradient(90deg, rgba(207,218,227,0.88) 0%, rgba(207,218,227,0.7) 45%, rgba(207,218,227,0) 72%)',
                }}
            />
        </Box>
    );
}
