import AppShell from '@/components/app-shell/app-shell';

/** Sidebar, header and footer around every page except login and signup. */
export default function ShellLayout({ children }) {
    return <AppShell>{children}</AppShell>;
}
