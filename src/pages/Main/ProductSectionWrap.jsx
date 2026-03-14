import { Link } from 'react-router-dom';

import { cloneDeep } from 'lodash-es';
import { oneOf, string } from 'prop-types';

import { IconSVG, useProductSectionStateContext } from '@shopby/react-components';

import GallerySkeleton from '../../components/GallerySkeleton';
import ProductSectionListRouter from '../../components/ProductSectionListRouter';
import { cn } from '../../lib/utils';

// @MX:ANCHOR: [AUTO] 상품 섹션 래퍼 - 섹션별 상품 목록과 더보기 링크를 렌더링
// @MX:REASON: MainContents에서 5개 섹션이 이 컴포넌트를 사용 (fan_in >= 5)
// @MX:SPEC: SPEC-SKIN-001 TAG-009

const ProductSectionWrap = ({ platformType, sectionsId }) => {
  const { sectionData, isLoading } = useProductSectionStateContext();

  if (isLoading) {
    return (
      <article className="product-section l-panel">
        <GallerySkeleton rowCount={1} colCount={3} isLoading={isLoading} />
      </article>
    );
  }

  const section = sectionData?.get(sectionsId);
  const {
    displayConfig: { displayType, displayWidth, displayHeight },
    label = '',
    products = [],
  } = section ?? { displayConfig: {} };

  if (!products.length) return <></>;
  const sliceProducts = cloneDeep(products).slice(0, displayHeight * displayWidth);

  return (
    <article className={cn('product-section l-panel')}>
      <h2 className={cn('text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-foreground')}>
        {label}
      </h2>
      <ProductSectionListRouter
        platformType={platformType}
        displayType={displayType}
        products={sliceProducts}
      />
      <div className="flex justify-center mt-4 lg:mt-6">
        <Link
          className={cn(
            'product-section__more btn',
            'inline-flex items-center gap-1.5 px-6 py-2.5',
            'text-sm font-medium text-muted-foreground',
            'border border-border rounded-full',
            'hover:bg-accent hover:text-accent-foreground transition-colors'
          )}
          to={`/display/${sectionsId}`}
        >
          더보기
          <span className="product-section__more-ico">
            <IconSVG name="angle-r" size={16} />
          </span>
        </Link>
      </div>
    </article>
  );
};

export default ProductSectionWrap;

ProductSectionWrap.propTypes = {
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
  sectionsId: string,
};
