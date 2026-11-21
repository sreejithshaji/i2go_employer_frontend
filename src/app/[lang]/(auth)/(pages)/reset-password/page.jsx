import { getDictionary } from '@/lib/i18n/dictionaries';
import ResetPasswordView from '../../client/reset-password/reset-password-view';

// Account page: never indexed (robots.txt disallows it too, 11.10.2).
export async function generateMetadata({ params }) {
    const { lang } = await params;
    return { title: getDictionary(lang).meta.resetPassword, robots: { index: false, follow: false } };
}

export default function ResetPasswordPage() {
    return <ResetPasswordView />;
}
