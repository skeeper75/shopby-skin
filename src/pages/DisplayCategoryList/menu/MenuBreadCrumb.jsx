import { Link } from 'react-router-dom';

import { useCategoriesActionContext, useCategoriesStateContext } from '@shopby/react-components';

import MenuCallout from './MenuCallout';

const MenuBreadCrumb = () => {
  const { parentCategories, currentCategories, isVisibleCallout } = useCategoriesStateContext();
  const { toggleCallout } = useCategoriesActionContext();

  if (!parentCategories.categoryInfo.label) return <></>;

  return (
    <section className="breadcrumb">
      <div className="breadcrumb__section">
        <span className="breadcrumb__link">
          <Link
            to={`/products?categoryNo=${parentCategories.categoryInfo?.categoryNo}&depth=${parentCategories.categoryInfo?.depth}`}
          >
            {parentCategories.categoryInfo?.label}
          </Link>
        </span>{' '}
        <label className="breadcrumb__toggle">
          <input type="checkbox" onChange={(e) => toggleCallout(e.target.checked)} checked={isVisibleCallout} />
          <span>{currentCategories.categoryInfo?.label ?? '전체보기'}</span>
        </label>
      </div>
      {isVisibleCallout && <MenuCallout />}
    </section>
  );
};
export default MenuBreadCrumb;
