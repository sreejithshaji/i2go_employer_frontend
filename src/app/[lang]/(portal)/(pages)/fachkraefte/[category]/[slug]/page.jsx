import ChildPage, { childMetadata } from '../../../_tree/child-page';

// /de/fachkraefte/[category]/[skill | k-<number>]: a skill page or a candidate (module in _tree/).
export const generateMetadata = (props) => childMetadata(props, 'de');

export default function Page(props) {
    return <ChildPage {...props} only="de" />;
}
