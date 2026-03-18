import { useSearchParams, Link } from 'react-router-dom';

import { useCategoriesStateContext } from '@shopby/react-components';

const MenuCalloutItem = () => {
  const { parentCategories, currentCategories } = useCategoriesStateContext();
  const [searchParams] = useSearchParams();

  if (!parentCategories.categoryInfo.label) return <></>;

  const currentCategoryNo = Number(searchParams.get('categoryNo'));

  return (
    <div className="category-callout__sub">
      <nav className="category-callout__sub-nav">
        <Link
          className="category-callout__link"
          to={`/products?categoryNo=${parentCategories?.categoryInfo?.categoryNo}`}
        >
          전체보기 {'>'}
        </Link>
        {currentCategories.categories?.map((category) => (
          <Link
            key={category.categoryNo}
            className={`${currentCategoryNo === category.categoryNo ? 'is-active' : ''} category-callout__link`}
            to={`/products?categoryNo=${category.categoryNo}&depth=${category.depth}`}
          >
            {category.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MenuCalloutItem;
