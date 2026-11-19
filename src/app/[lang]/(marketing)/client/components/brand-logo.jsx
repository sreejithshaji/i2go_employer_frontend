import Image from 'next/image';
import NextLink from 'next/link';
import { Box } from '@mui/material';
import { brand as b } from '@/app/theme';

// The logo file is 512 × 300.
const RATIO = 512 / 300;

/**
 * I2Go logo linking home. The logo file is used unchanged (UI_UX.md).
 * `dark`: white name and cyan focus ring, over the dark hero.
 * `large`: logo only, as tall as the nav allows (44px phone, 56px from md),
 * without the "I2Go" name; used in the top bar.
 */
export default function BrandLogo({ href, onClick, dark = false, large = false, sx }) {
    return (
        <Box
            component={NextLink}
            href={href}
            onClick={onClick}
            aria-label="I2Go"
            sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1.25, flexShrink: 0, textDecoration: 'none', borderRadius: `${b.radiusSm}px`,
                '&:focus-visible': { outline: `2px solid ${dark ? b.cyan : b.accent}`, outlineOffset: 4 },
                ...sx,
            }}
        >
            {large ? (
                <Box sx={{ position: 'relative', height: { xs: 44, md: 56 }, width: { xs: Math.round(44 * RATIO), md: Math.round(56 * RATIO) } }}>
                    <Image src="/images/i2go_mark.png" alt="" fill sizes="96px" style={{ objectFit: 'contain' }} priority />
                </Box>
            ) : (
                <>
                    <Image src="/images/i2go_mark.png" alt="" width={41} height={24} style={{ objectFit: 'contain' }} priority />
                    <Box component="span" sx={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: dark ? b.onDark.text : b.ink, lineHeight: 1, transition: `color 200ms ${b.ease}` }}>
                        I2Go
                    </Box>
                </>
            )}
        </Box>
    );
}
