import { matchPath } from 'react-router-dom';

import { isArray } from 'lodash-es';

const PATH_MAP = {
  '/': 'MAIN',
  '/product-detail': 'PRODUCT',
  '/sign-up-confirm': 'MEMBER_JOIN_COMPLETE',
  '/my-page': 'MY_PAGE',
  '/products': ['PRODUCT_LIST', 'PRODUCT_SEARCH'],
  '/display/:sectionsId': 'DISPLAY_SECTION',
  '/cart': 'CART',
  '/order/confirm': 'ORDER_COMPLETE',
  '/order/:orderSheetNo': 'ORDER',
  '/orders/:orderNo': 'ORDER_DETAIL',
  '/sign-in': 'LOGIN',
};

export const determinePageScriptType = ({ search, pathname }) => {
  const matchedPath = Object.keys(PATH_MAP)?.find((key) => {
    const match = matchPath(key, pathname); // 경로 매칭

    return match ? PATH_MAP[key] : null; // 매칭된 경로만 반환
  });

  const pathKey = PATH_MAP[matchedPath];

  if (isArray(pathKey)) {
    return search.includes('keyword') ? 'PRODUCT_SEARCH' : 'PRODUCT_LIST';
  }

  return pathKey || null;
};
