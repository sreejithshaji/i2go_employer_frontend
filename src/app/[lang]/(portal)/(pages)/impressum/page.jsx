import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/seo/metadata';
import ImpressumView from '../../client/legal/impressum-view';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const t = getDictionary(lang);
    return pageMetadata({
        lang,
        title: t.meta.impressum,
        description: undefined,
        pathsByLang: { de: '/de/impressum', en: '/en/impressum' },
    });
}

export default async function ImpressumPage({ params }) {
    const { lang } = await params;
    return <ImpressumView lang={lang} />;
}
