import { RequireEmployer } from '@/features/auth';
import { getDictionary } from '@/lib/i18n/dictionaries';
import EnquiriesView from '../../client/enquiries/enquiries-view';

// Account page: never indexed (robots.txt disallows it too, 11.10.2).
export async function generateMetadata({ params }) {
    const { lang } = await params;
    return { title: getDictionary(lang).meta.enquiries, robots: { index: false, follow: false } };
}

export default function EnquiriesPage() {
    return (
        <RequireEmployer>
            <EnquiriesView />
        </RequireEmployer>
    );
}
