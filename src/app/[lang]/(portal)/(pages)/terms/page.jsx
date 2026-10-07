import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/seo/metadata';
import TermsView from '../../client/legal/terms-view';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const t = getDictionary(lang);
    return pageMetadata({
        lang,
        title: t.meta.terms,
        description: t.meta.termsDescription,
        pathsByLang: { de: '/de/terms', en: '/en/terms' },
    });
}

export default async function TermsPage({ params }) {
    const { lang } = await params;
    return <TermsView lang={lang} />;
}
