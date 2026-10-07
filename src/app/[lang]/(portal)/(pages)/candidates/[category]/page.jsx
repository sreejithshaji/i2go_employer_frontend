import CategoryPage, { categoryMetadata } from '../../_tree/category-page';

// /en/candidates/[category]: a category landing page (module in _tree/).
export const generateMetadata = (props) => categoryMetadata(props, 'en');

export default function Page(props) {
    return <CategoryPage {...props} only="en" />;
}
