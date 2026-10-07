import { notFound } from 'next/navigation';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { getSlugMaps } from '@/app/modules/candidates/_1-domain/category_service';
import JsonLd from '@/components/json-ld';
import { getGuideSlugMap } from '@/app/modules/guides/_1-domain/guide_service';
import { LOCALES, isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { SITE_INDEXABLE, SITE_URL } from '@/lib/seo/config';
import { organizationLd, websiteLd } from '@/lib/seo/json-ld';
import { poppins } from '../fonts';
import Providers from '../providers';

// Every page lives under /de or /en (PLAN.md 11.1, 11.3). src/proxy.js sends
// URLs without a language to one; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const t = getDictionary(lang);
    return {
        metadataBase: new URL(SITE_URL),
        title: { default: t.meta.defaultTitle, template: '%s · I2Go' },
        description: t.meta.description,
        // Pages with their own metadata set these again (lib/seo/metadata.js).
        openGraph: { type: 'website', siteName: 'I2Go', images: [{ url: `/api/og?lang=${lang}`, width: 1200, height: 630, alt: 'I2Go' }] },
        twitter: { card: 'summary_large_image', images: [`/api/og?lang=${lang}`] },
        // Until SITE_URL is set (11.15), nothing is indexed (lib/seo/config.js).
        robots: SITE_INDEXABLE ? undefined : { index: false, follow: false },
    };
}

export const viewport = {
    themeColor: '#2563EB',
};

// Slugs for the language switcher. Without the database the switcher falls
// back to the parent page, so a failure here mustn't break every page.
async function loadSlugMaps() {
    const [master, guides] = await Promise.all([
        getSlugMaps().catch(() => ({ categories: [], skills: [] })),
        getGuideSlugMap().catch(() => []),
    ]);
    return { ...master, guides };
}

export default async function RootLayout({ children, params }) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const t = getDictionary(lang);
    const slugMaps = await loadSlugMaps();

    return (
        <html lang={lang} className={poppins.variable}>
            <body>
                <JsonLd data={[organizationLd(), websiteLd(lang, t.meta.description)]} />
                {/* Collects MUI (Emotion) styles on the server and puts them in the HTML */}
                <AppRouterCacheProvider>
                    <Providers lang={lang} dictionary={t} slugMaps={slugMaps}>{children}</Providers>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
