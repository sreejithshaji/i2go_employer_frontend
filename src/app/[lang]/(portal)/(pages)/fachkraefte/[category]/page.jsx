import CategoryPage, { categoryMetadata } from '../../_tree/category-page';

// /de/fachkraefte/[category]: a category landing page (module in _tree/).
export const generateMetadata = (props) => categoryMetadata(props, 'de');

export default function Page(props) {
    return <CategoryPage {...props} only="de" />;
}
