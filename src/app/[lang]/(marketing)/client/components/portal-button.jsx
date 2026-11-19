'use client';

import { useI18n } from '@/features/i18n';
import CtaButton from './cta-button';

/**
 * "Find your candidates": the primary CTA button linking to the
 * candidate hub, used in several spots on the landing page.
 */
export default function PortalButton({ label, ...props }) {
    const { t, p } = useI18n();
    return (
        <CtaButton href={p.hub} {...props}>
            {label ?? t.landing.portalButton}
        </CtaButton>
    );
}
