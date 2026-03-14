import { number } from 'prop-types';

import { useCategoriesStateContext } from '@shopby/react-components';

const getCategoryContent = (category, depth) => {
  if (!category) return null;

  if (category.depth === depth) {
    return category.content;
  }

  return getCategoryContent(category.children?.[0], depth);
};

const CategoryContent = ({ depth }) => {
  const { currentCategory } = useCategoriesStateContext();

  if (!currentCategory.multiLevelCategories?.length) return null;

  const content = getCategoryContent(currentCategory.multiLevelCategories[0], depth);

  if (!content) return null;

  return (
    <div
      className="category-content top-content"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    ></div>
  );
};

export default CategoryContent;

CategoryContent.propTypes = {
  depth: number,
};
