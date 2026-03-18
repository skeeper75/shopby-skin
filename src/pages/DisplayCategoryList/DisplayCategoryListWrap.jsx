import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useProductSearchActionContext, useProductSearchStateContext } from '@shopby/react-components';

import GalleryListPage from '../../components/GalleryListPage';

const PER_PAGE_COUNT = 10;
const PARAM_TYPE = {
  KEYWORD: 'keyword',
  CATEGORY_NO: 'categoryNo',
};
const SORT_BY = [
  { value: 'POPULAR', label: '인기순' },
  { value: 'LOW_PRICE', label: '낮은가격순' },
  { value: 'HIGH_PRICE', label: '높은가격순' },
  { value: 'REVIEW', label: '상품후기순' },
  { value: 'RECENT_PRODUCT', label: '등록일순' },
];

const DisplayCategoryListWrap = () => {
  const {
    pageNumber,
    totalCount,
    sortType,
    accumulationProducts,
    productSearchResponse,
    isLoading,
    scrollY,
    isStoreScroll,
  } = useProductSearchStateContext();
  const { searchProductsBy, updateSortType } = useProductSearchActionContext();

  const [disabled, setDisabled] = useState(false);
  const [searchParams] = useSearchParams();

  const keywords = useMemo(() => searchParams.get(PARAM_TYPE.KEYWORD), [searchParams]);
  const categoryNos = useMemo(() => searchParams.get(PARAM_TYPE.CATEGORY_NO), [searchParams]);
  const [queryString, setQueryString] = useState({
    categoryNos: categoryNos ?? '',
    keywords,
    pageNumber,
    sortType,
    pageSize: PER_PAGE_COUNT,
    soldOut: true,
    saleStatus: 'ALL_CONDITIONS',
  });
  const displayCategoryListWrapRef = useRef(false);
  const pageScriptType = keywords ? 'PRODUCT_SEARCH' : 'PRODUCT_LIST';

  const handleIntersect = () => {
    setDisabled(true);
    if (accumulationProducts.length >= totalCount) return;

    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setPageScriptType(pageScriptType, true);

    setQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (displayCategoryListWrapRef.current) {
      // 외부스크립트, sb객체 등록 기능. 삭제금지
      ShopbyExternalScript?.setPageScriptType(pageScriptType, true);

      setQueryString((prev) => ({
        ...prev,
        sortType,
        pageNumber: 1,
        categoryNos,
        keywords,
      }));
    }
  }, [sortType, categoryNos, keywords]);

  useEffect(() => {
    searchProductsBy(queryString);
    setDisabled(false);
  }, [queryString]);

  useEffect(() => {
    if (!productSearchResponse) return;

    if (searchParams.get('keyword')) {
      // 외부스크립트, sb객체 등록 기능. 삭제금지
      ShopbyExternalScript?.setGlobalObjectSb({
        searchedProduct: productSearchResponse,
        currentCategory: null,
      });

      return;
    }
    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setGlobalObjectSb({
      searchedProduct: productSearchResponse,
    });
  }, [productSearchResponse, searchParams]);

  useEffect(() => {
    if (isStoreScroll && scrollY) {
      window.scrollTo({
        top: scrollY,
        behavior: 'smooth',
      });
    }
  }, [scrollY]);

  useEffect(() => {
    displayCategoryListWrapRef.current = true;
  }, []);

  return (
    <>
      <GalleryListPage
        totalCount={totalCount}
        products={accumulationProducts}
        sortType={sortType}
        sortBy={SORT_BY}
        updateSortType={updateSortType}
        handleIntersect={handleIntersect}
        disabled={disabled}
        isLoading={isLoading}
      />
    </>
  );
};

export default DisplayCategoryListWrap;
