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

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

/**
 * Background photo of the dark hero: a recruiter's handshake with a
 * professional man. On desktop it fills the right part and fades into the
 * dark scene towards the text; on phones it sits behind everything, dimmed,
 * so the text stays readable. Decorative (alt="", aria-hidden).
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
                opacity: { xs: 0.28, md: 1 },
                // Fade the left edge into the dark hero (desktop) / bottom on phones.
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
            {/* Navy tint + bottom shade so the photo matches the dark theme */}
            <Box
                sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(3,7,12,0.15) 0%, rgba(3,7,12,0.05) 45%, rgba(3,7,12,0.7) 100%), linear-gradient(90deg, rgba(8,30,52,0.35), rgba(8,30,52,0.1))',
                }}
            />
            {/* Desktop: darken the left part, where the long (German) H1 runs onto the photo,
                so the title keeps ≥ 3:1 over the bright window. The face on the right stays clear. */}
            <Box
                sx={{
                    position: 'absolute', inset: 0, display: { xs: 'none', md: 'block' },
                    background: 'linear-gradient(90deg, rgba(3,7,12,0.75) 0%, rgba(3,7,12,0.6) 45%, rgba(3,7,12,0) 72%)',
                }}
            />
        </Box>
    );
}
