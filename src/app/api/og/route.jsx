import { getCategories } from '@/app/modules/candidates/_1-domain/category_service';
import { DEFAULT_LOCALE, isLocale, localName } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { renderOgImage } from './render-og-image';

// Share images (PLAN.md 11.9.2): /api/og?lang=de for the site, plus
// &category=<slug> for a category and the pages below it. Text comes from the
// dictionary and the category table only, so the URL can't be used to render
// arbitrary text. A route handler rather than opengraph-image files: pages set
// their own openGraph (title, URL), which would drop file-based images.
export const revalidate = 86400;

export async function GET(request) {
    const params = new URL(request.url).searchParams;
    const lang = isLocale(params.get('lang')) ? params.get('lang') : DEFAULT_LOCALE;
    const slug = params.get('category');
    const t = getDictionary(lang);
    const category = slug
        ? await getCategories().then((list) => list.find((c) => c[`slug_${lang}`] === slug)).catch(() => null)
        : null;
    return renderOgImage({
        eyebrow: t.common.brandTag,
        title: category ? localName(category, lang) : t.meta.homeTitle,
        footer: category ? t.meta.homeTitle : t.home.heroTitle,
    });
}
