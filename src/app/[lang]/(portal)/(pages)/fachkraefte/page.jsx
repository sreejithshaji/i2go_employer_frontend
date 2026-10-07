import HubPage, { hubMetadata } from '../_tree/hub-page';

// /de/fachkraefte: the candidate hub in this route's language (module in _tree/).
export const generateMetadata = (props) => hubMetadata(props, 'de');

export default function Page(props) {
    return <HubPage {...props} only="de" />;
}
