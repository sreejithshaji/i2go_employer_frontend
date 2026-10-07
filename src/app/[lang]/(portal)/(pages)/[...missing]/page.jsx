import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';

// Any path no other route matches: the shell's 404 page in the visitor's language.
export async function generateMetadata({ params }) {
    const { lang } = await params;
    return { title: getDictionary(lang).meta.notFound };
}

export default function MissingPage() {
    notFound();
}
