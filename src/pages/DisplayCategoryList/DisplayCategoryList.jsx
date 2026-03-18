import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { ProductSearchProvider, CategoriesProvider, VisibleComponent } from '@shopby/react-components';

import { PageShell } from '../../components/Layout';
import PrintFilterSidebar from '../../components/PrintFilter/PrintFilterSidebar';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import DisplayCategoryListWrap from './DisplayCategoryListWrap';
import CategoryMenu from './menu/CategoryMenu';

// @MX:NOTE: [AUTO] 인쇄 옵션 필터를 포함한 카테고리 목록 페이지 - 데스크톱에서 사이드바, 모바일에서 접기/펴기 UI
const DisplayCategoryList = () => {
  const { t } = useTranslation('title');
  const [printFilter, setPrintFilter] = useState({ sizes: [], papers: [], coatings: [] });
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const categoryNo = Number(searchParams.get('categoryNo'));
  const depth = Number(searchParams.get('depth') ?? 1);

  if (keyword) {
    useLayoutChanger({
      hasBackBtnOnHeader: true,
      hasBottomNav: true,
      hasCartBtnOnHeader: true,
      title: keyword,
      hasSearchKeywordHeader: true,
    });
  } else {
    useLayoutChanger({
      hasBackBtnOnHeader: true,
      hasBottomNav: true,
      hasCartBtnOnHeader: true,
      title: t('상품 목록'),
    });
  }

  return (
    <PageShell maxWidth="7xl">
    <ProductSearchProvider>
      <VisibleComponent
        shows={!keyword}
        TruthyComponent={
          <CategoriesProvider>
            <CategoryMenu categoryNo={categoryNo} depth={depth} />
          </CategoriesProvider>
        }
      />

      {/* 모바일 필터 토글 버튼 */}
      <div className="lg:hidden px-4 py-2">
        <button
          type="button"
          onClick={() => setShowMobileFilter((prev) => !prev)}
          className="flex items-center gap-2 text-sm text-[#424242] border border-[#CACACA] rounded-[5px] px-3 py-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          인쇄 옵션 필터
        </button>
        {showMobileFilter && (
          <div className="mt-3">
            <PrintFilterSidebar onFilterChange={setPrintFilter} />
          </div>
        )}
      </div>

      {/* 데스크톱: 사이드바 + 목록 2컬럼 레이아웃 */}
      <div className="flex gap-6 px-4">
        <div className="hidden lg:block">
          <PrintFilterSidebar onFilterChange={setPrintFilter} />
        </div>
        <div className="flex-1 min-w-0">
          <DisplayCategoryListWrap printFilter={printFilter} />
        </div>
      </div>
    </ProductSearchProvider>
    </PageShell>
  );
};

export default DisplayCategoryList;
