import { RequireEmployer } from '@/features/auth';
import { getDictionary } from '@/lib/i18n/dictionaries';
import WishlistView from '../../client/wishlist/wishlist-view';

// Account page: never indexed (robots.txt disallows it too, 11.10.2).
export async function generateMetadata({ params }) {
    const { lang } = await params;
    return { title: getDictionary(lang).meta.wishlist, robots: { index: false, follow: false } };
}

export default function WishlistPage() {
    return (
        <RequireEmployer>
            <WishlistView />
        </RequireEmployer>
    );
}
