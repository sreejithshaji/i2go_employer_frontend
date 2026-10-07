import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/seo/metadata';
import PrivacyView from '../../client/legal/privacy-view';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const t = getDictionary(lang);
    return pageMetadata({
        lang,
        title: t.meta.privacy,
        description: t.meta.privacyDescription,
        pathsByLang: { de: '/de/privacy', en: '/en/privacy' },
    });
}

export default async function PrivacyPage({ params }) {
    const { lang } = await params;
    return <PrivacyView lang={lang} />;
}
