import { GuidesIndexPage, guidesIndexMetadata } from '../_tree/guide-pages';

// /en/guides: guides for employers (module in _tree/).
export const generateMetadata = (props) => guidesIndexMetadata(props, 'en');

export default function Page(props) {
    return <GuidesIndexPage {...props} only="en" />;
}
