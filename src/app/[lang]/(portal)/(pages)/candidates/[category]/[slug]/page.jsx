import ChildPage, { childMetadata } from '../../../_tree/child-page';

// /en/candidates/[category]/[skill | k-<number>]: a skill page or a candidate (module in _tree/).
export const generateMetadata = (props) => childMetadata(props, 'en');

export default function Page(props) {
    return <ChildPage {...props} only="en" />;
}
