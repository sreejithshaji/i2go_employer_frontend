'use client';

import CtaButton from '@/app/[lang]/(marketing)/client/components/cta-button';
import { useI18n } from '@/features/i18n';
import EmptyState from './empty-state';

// The whole page on a 404, so its title is the page's h1. The <title> comes
// from the [...missing] route's metadata.
export default function NotFound() {
    const { t, p } = useI18n();
    return (
        <EmptyState
            titleAs="h1"
            title={t.notFound.title}
            message={t.notFound.text}
            action={<CtaButton href={p.hub}>{t.common.browseCandidates}</CtaButton>}
        />
    );
}
