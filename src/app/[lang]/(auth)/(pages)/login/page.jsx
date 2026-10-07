import { safeNext } from '@/features/auth';
import { getDictionary } from '@/lib/i18n/dictionaries';
import LoginView from '../../client/login/login-view';

// Account page: never indexed (robots.txt disallows it too, 11.10.2).
export async function generateMetadata({ params }) {
    const { lang } = await params;
    return { title: getDictionary(lang).meta.signIn, robots: { index: false, follow: false } };
}

export default async function LoginPage({ params, searchParams }) {
    const [{ lang }, { next }] = await Promise.all([params, searchParams]);
    const raw = Array.isArray(next) ? next[0] : next;
    return <LoginView next={safeNext(raw, lang)} keepNext={!!raw} />;
}
