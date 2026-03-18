import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useProductSectionListActionContext, useProductSectionListStateContext } from '@shopby/react-components';

import GalleryListPage from '../../components/GalleryListPage';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const PER_PAGE_COUNT = 10;
const SORT_BY = [
  { value: 'SALE', label: '판매량순' },
  { value: 'LOW_PRICE', label: '낮은가격순' },
  { value: 'HIGH_PRICE', label: '높은가격순' },
  { value: 'REVIEW', label: '상품후기순' },
  { value: 'REGISTER', label: '등록일순' },
];

const pageScriptType = 'DISPLAY_SECTION';

const ProductSectionListWrap = () => {
  const { sectionsId } = useParams();
  const {
    sortType,
    label,
    productTotalCount,
    pageNumber,
    accumulationProducts,
    displaySectionResponse,
    isLoading,
    isStoreScroll,
    scrollY,
  } = useProductSectionListStateContext();
  const { fetchProductSectionList, updateSortType } = useProductSectionListActionContext();
  const [queryString, setQueryString] = useState({
    pageNumber,
    sectionsId,
    pageSize: PER_PAGE_COUNT,
    by: sortType,
    soldOut: true,
    cacheOption: {
      key: window.location.href,
      type: 'MEMORY',
      timeBySeconds: 180,
    },
  });
  const [disabled, setDisabled] = useState(false);
  const productSectionListWrapRef = useRef(false);

  const { t } = useTranslation('title');

  const handleIntersect = () => {
    setDisabled(true);
    if (accumulationProducts.length >= productTotalCount) return;

    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setPageScriptType(pageScriptType, true);

    setQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasBottomNav: true,
    hasCartBtnOnHeader: true,
    title: t(label),
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    if (productSectionListWrapRef.current) {
      // 외부스크립트, sb객체 등록 기능. 삭제금지
      ShopbyExternalScript?.setPageScriptType(pageScriptType, true);

      setQueryString((prev) => ({ ...prev, pageNumber: 1, by: sortType }));
    }
  }, [sortType]);

  useEffect(() => {
    fetchProductSectionList(queryString);
    setDisabled(false);
  }, [queryString]);

  useEffect(() => {
    if (!displaySectionResponse) return;

    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setGlobalObjectSb({
      displaySection: displaySectionResponse,
    });
  }, [displaySectionResponse]);

  useEffect(() => {
    if (isStoreScroll && scrollY) {
      window.scrollTo({
        top: scrollY,
        behavior: 'smooth',
      });
    }
  }, [scrollY]);

  useEffect(() => {
    productSectionListWrapRef.current = true;
  }, []);

  return (
    <GalleryListPage
      totalCount={productTotalCount}
      products={accumulationProducts}
      sortType={sortType}
      sortBy={SORT_BY}
      updateSortType={updateSortType}
      handleIntersect={handleIntersect}
      disabled={disabled}
      isLoading={isLoading}
    />
  );
};

export default ProductSectionListWrap;
