'use client';

import CtaButton from '@/app/[lang]/(marketing)/client/components/cta-button';
import { useI18n } from '@/features/i18n';
import EmptyState from './empty-state';

export default function NotFound() {
    const { t, p } = useI18n();
    return (
        <EmptyState
            title={t.notFound.title}
            message={t.notFound.text}
            action={<CtaButton href={p.hub}>{t.common.browseCandidates}</CtaButton>}
        />
    );
}
