import { GuidesIndexPage, guidesIndexMetadata } from '../_tree/guide-pages';

// /de/ratgeber: guides for employers (module in _tree/).
export const generateMetadata = (props) => guidesIndexMetadata(props, 'de');

export default function Page(props) {
    return <GuidesIndexPage {...props} only="de" />;
}
