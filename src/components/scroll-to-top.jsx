'use client';

import { useSyncExternalStore } from 'react';
import { ButtonBase } from '@mui/material';
import { FiArrowUp } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';

// Shown once the visitor has scrolled about a screen down.
const THRESHOLD = 600;

const subscribe = (onChange) => {
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange);
    return () => {
        window.removeEventListener('scroll', onChange);
        window.removeEventListener('resize', onChange);
    };
};
const readVisible = () => window.scrollY > THRESHOLD;
const readHidden = () => false;

function scrollUp() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}

/**
 * Floating "back to top" circle, bottom right. Frosted and translucent so the
 * content under it stays readable; hidden (and not clickable) near the top.
 * `raised` lifts it above a page's sticky bottom bar on phones (candidate profile).
 */
export default function ScrollToTop({ raised = false }) {
    const { t } = useI18n();
    const visible = useSyncExternalStore(subscribe, readVisible, readHidden);
    return (
        <ButtonBase
            onClick={scrollUp}
            aria-label={t.common.backToTop}
            title={t.common.backToTop}
            tabIndex={visible ? 0 : -1}
            aria-hidden={!visible}
            sx={{
                position: 'fixed', zIndex: 20,
                right: { xs: 16, md: 28 },
                bottom: {
                    xs: `calc(${raised ? 88 : 20}px + env(safe-area-inset-bottom, 0px))`,
                    sm: 28,
                },
                width: 44, height: 44, borderRadius: '50%',
                color: b.ink,
                bgcolor: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(10px) saturate(160%)', WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                border: '1px solid rgba(13,42,66,0.12)',
                boxShadow: '0 6px 18px rgba(10,15,22,0.12)',
                opacity: visible ? 0.75 : 0,
                transform: visible ? 'none' : 'translateY(12px) scale(0.9)',
                pointerEvents: visible ? 'auto' : 'none',
                transition: `opacity 250ms ${b.ease}, transform 250ms ${b.ease}, background-color 200ms ${b.ease}`,
                '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.85)' },
                '&:focus-visible': { opacity: 1, ...b.focusRing },
                '@media (prefers-reduced-motion: reduce)': { transition: 'opacity 150ms linear', transform: 'none' },
            }}
        >
            <FiArrowUp size={20} />
        </ButtonBase>
    );
}
