import { useEffect } from 'react';

import { number } from 'prop-types';

import { useCategoriesActionContext, useCategoriesStateContext } from '@shopby/react-components';

import CategoryContent from './CategoryContent';
import MenuBreadCrumb from './MenuBreadCrumb';
import MenuGrid from './MenuGrid';

const CategoryMenu = ({ categoryNo, depth }) => {
  const { searchCategoryMenu, toggleCallout } = useCategoriesActionContext();
  const { currentCategory } = useCategoriesStateContext();

  useEffect(() => {
    searchCategoryMenu({ categoryNo, depth });
    toggleCallout(false);
  }, [categoryNo, depth]);

  useEffect(() => {
    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setGlobalObjectSb({
      currentCategory,
    });
  }, [currentCategory, categoryNo, depth]);

  return (
    <>
      <MenuBreadCrumb />
      <MenuGrid />
      <CategoryContent depth={depth} />
    </>
  );
};

export default CategoryMenu;

CategoryMenu.propTypes = {
  categoryNo: number,
  depth: number,
};
