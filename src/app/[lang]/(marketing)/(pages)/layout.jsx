import { jakarta } from '@/app/fonts';
import MarketingShell from '../client/components/marketing-shell';

/**
 * Marketing pages (the homepage): top navigation and footer instead of the
 * portal sidebar (homepage-redesign-plan.md, D1). Same root layout as the
 * portal ([lang]/layout.jsx), so moving between them is a normal client
 * navigation. The marketing font is loaded here only.
 */
export default function MarketingLayout({ children }) {
    return <MarketingShell fontClass={jakarta.variable}>{children}</MarketingShell>;
}
