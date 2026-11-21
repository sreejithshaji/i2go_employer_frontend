import { getDictionary } from '@/lib/i18n/dictionaries';
import ForgotPasswordView from '../../client/forgot-password/forgot-password-view';

// Account page: never indexed (robots.txt disallows it too, 11.10.2).
export async function generateMetadata({ params }) {
    const { lang } = await params;
    return { title: getDictionary(lang).meta.forgotPassword, robots: { index: false, follow: false } };
}

export default function ForgotPasswordPage() {
    return <ForgotPasswordView />;
}
