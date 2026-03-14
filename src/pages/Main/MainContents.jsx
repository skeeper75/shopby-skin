import { useEffect, useMemo } from 'react';

import { oneOf } from 'prop-types';

import { useProductSectionActionContext, useProductSectionStateContext } from '@shopby/react-components';

import AdminBanner from '../../components/AdminBanner';
import { SECTION_CODE } from '../../constants/display';
import { cn } from '../../lib/utils';

import Hero from './Hero';
import ProductSectionWrap from './ProductSectionWrap';
import CategoryQuickLinks from './CategoryQuickLinks';

// @MX:ANCHOR: [AUTO] 메인 페이지 콘텐츠 루트 컴포넌트 - 모든 홈페이지 섹션을 조합
// @MX:REASON: Hero, ProductSectionWrap, AdminBanner, CategoryQuickLinks 등 다수 컴포넌트가 의존
// @MX:SPEC: SPEC-SKIN-001 TAG-009

const MainContents = ({ platformType }) => {
  const { scrollY, isStoreScroll } = useProductSectionStateContext();
  const { fetchDisplaySections } = useProductSectionActionContext();

  const sectionCodes = useMemo(() => SECTION_CODE[platformType], [platformType]);

  useEffect(() => {
    fetchDisplaySections({
      sectionCodes: sectionCodes,
      cacheOption: {
        timeBySeconds: 180,
        type: 'MEMORY',
      },
    });
  }, []);

  useEffect(() => {
    if (isStoreScroll && scrollY) {
      window.scrollTo({
        top: scrollY,
        behavior: 'smooth',
      });
    }
  }, [scrollY]);

  return (
    <div className={cn('main-view', 'min-h-screen bg-background')}>
      {/* 히어로 배너 슬라이더 - 기존 Shopby 배너 데이터 활용 */}
      <section className="w-full">
        <Hero bannerId="BNSLIDE" />
      </section>

      {/* 카테고리 퀵 링크 그리드 */}
      <section className="py-6 lg:py-10">
        <div className="max-w-7xl mx-auto px-4">
          <CategoryQuickLinks />
        </div>
      </section>

      {/* 상품 섹션 1 - 베스트셀러 */}
      <section className="py-6 lg:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ProductSectionWrap platformType={platformType} sectionsId={sectionCodes[0]} />
        </div>
      </section>

      {/* 프로모션 배너 1 */}
      <section className="py-4 lg:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-lg overflow-hidden">
            <AdminBanner bannerId="BANNER01" />
          </div>
        </div>
      </section>

      {/* 상품 섹션 2 - 신상품 */}
      <section className="py-6 lg:py-10 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ProductSectionWrap platformType={platformType} sectionsId={sectionCodes[1]} />
        </div>
      </section>

      {/* 프로모션 배너 2 */}
      <section className="py-4 lg:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-lg overflow-hidden">
            <AdminBanner bannerId="BANNER02" />
          </div>
        </div>
      </section>

      {/* 상품 섹션 3 */}
      <section className="py-6 lg:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ProductSectionWrap platformType={platformType} sectionsId={sectionCodes[2]} />
        </div>
      </section>

      {/* 프로모션 배너 3 */}
      <section className="py-4 lg:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-lg overflow-hidden">
            <AdminBanner bannerId="BANNER03" />
          </div>
        </div>
      </section>

      {/* 상품 섹션 4 */}
      <section className="py-6 lg:py-10 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ProductSectionWrap platformType={platformType} sectionsId={sectionCodes[3]} />
        </div>
      </section>

      {/* 프로모션 배너 4 & 5 */}
      <section className="py-4 lg:py-6">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="rounded-lg overflow-hidden">
            <AdminBanner bannerId="BANNER04" />
          </div>
          <div className="rounded-lg overflow-hidden">
            <AdminBanner bannerId="BANNER05" />
          </div>
        </div>
      </section>

      {/* 상품 섹션 5 */}
      <section className="py-6 lg:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ProductSectionWrap platformType={platformType} sectionsId={sectionCodes[4]} />
        </div>
      </section>

      {/* 하단 배너 */}
      <section className="py-4 lg:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-lg overflow-hidden">
            <AdminBanner bannerId="BNBOTTOM" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainContents;

MainContents.propTypes = {
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
};
