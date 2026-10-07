import HubPage, { hubMetadata } from '../_tree/hub-page';

// /en/candidates: the candidate hub in this route's language (module in _tree/).
export const generateMetadata = (props) => hubMetadata(props, 'en');

export default function Page(props) {
    return <HubPage {...props} only="en" />;
}
