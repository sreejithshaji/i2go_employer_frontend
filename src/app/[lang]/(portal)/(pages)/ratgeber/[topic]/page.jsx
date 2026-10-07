import { GuidePage, guideMetadata } from '../../_tree/guide-pages';

// /de/ratgeber/[topic]: one guide (module in _tree/).
export const generateMetadata = (props) => guideMetadata(props, 'de');

export default function Page(props) {
    return <GuidePage {...props} only="de" />;
}
