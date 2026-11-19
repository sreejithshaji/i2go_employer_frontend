import { getDictionary } from '@/lib/i18n/dictionaries';
import RecentlyViewedView from '../../client/recently-viewed/recently-viewed-view';

// Per-browser page: never indexed (robots.txt disallows it too, 11.10.2).
export async function generateMetadata({ params }) {
    const { lang } = await params;
    return { title: getDictionary(lang).meta.recentlyViewed, robots: { index: false, follow: false } };
}

export default function RecentlyViewedPage() {
    return <RecentlyViewedView />;
}
