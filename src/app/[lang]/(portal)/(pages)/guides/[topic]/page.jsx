import { GuidePage, guideMetadata } from '../../_tree/guide-pages';

// /en/guides/[topic]: one guide (module in _tree/).
export const generateMetadata = (props) => guideMetadata(props, 'en');

export default function Page(props) {
    return <GuidePage {...props} only="en" />;
}
