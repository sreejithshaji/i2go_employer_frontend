'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { FiLock } from 'react-icons/fi';
import { decode, isBlurhashValid } from 'blurhash';

// Guests get a blurhash instead of the photo (PLAN.md 10.18): a short string of
// smeared colours, made at upload, that can't be turned back into a face. No
// photo path or storage URL reaches the browser.

const SIZE = 32;

/** True when the candidate has no signed photo but a blurhash to show instead. */
export const showsLockedPhoto = (candidate) => !candidate.photo_url
    && typeof candidate.photo_blurhash === 'string'
    && isBlurhashValid(candidate.photo_blurhash).result;

/**
 * The blurhash filling its parent (an Avatar), with a lock in the middle.
 * Painted after mount, since there is no canvas on the server.
 */
export default function LockedPhoto({ hash, iconSize = 18 }) {
    const canvas = useRef(null);

    useEffect(() => {
        const context = canvas.current?.getContext('2d');
        if (!context) return;
        try {
            const image = context.createImageData(SIZE, SIZE);
            image.data.set(decode(hash, SIZE, SIZE));
            context.putImageData(image, 0, 0);
        } catch {
            // Leaves the avatar background; the lock still shows.
        }
    }, [hash]);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <canvas ref={canvas} width={SIZE} height={SIZE} aria-hidden style={{ display: 'block', width: '100%', height: '100%' }} />
            <Box
                aria-hidden
                sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: iconSize * 2, height: iconSize * 2, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.85)', color: 'primary.main', boxShadow: '0 1px 4px rgba(15,23,42,0.15)',
                }}
            >
                <FiLock size={iconSize} />
            </Box>
        </Box>
    );
}
