import { TERMS_TYPE_KEY } from '@shopby/shared';

export const INFINITY_SCROLL_PAGE_SIZE = 6;

export const YorN = {
  Y: 'Y',
  N: 'N',
};

export const META_TAG_KEY = {
  PRODUCT: 'PRODUCT',
  COMMON: 'COMMON',
  EVENT: 'EVENT',
};

export const WITHDRAWAL_OAUTH_ID_NO = 'withdrawalOauthIdNo';
export const WITHDRAWAL_OAUTH_ID_NO_COMPARE_RESULT = 'withdrawalOauthIdNoCompareResult';

export const PATH_DATA = 'pathData';

export const PI_TERMS_MAP = {
  PI_COLLECTION_AND_USE_OPTIONAL: '개인정보 수집/이용',
  PI_PROCESS_CONSIGNMENT: '개인정보 처리/위탁',
  PI_THIRD_PARTY_PROVISION: '개인정보 제 3자 제공',
};

export const PI_TERMS_KEYS = Object.keys(PI_TERMS_MAP);

export const PI_RESTOCK_NOTICE = 'PI_RESTOCK_NOTICE';

export const NO_IMG_URL = '//shopby-images.cdn-nhncommerce.com/no_img.png';

export const { USE, PI_COLLECTION_AND_USE_REQUIRED, PI_14_AGE } = TERMS_TYPE_KEY;

export const DEFAULT_REQUIRED_TERMS_KEYS = [USE, PI_COLLECTION_AND_USE_REQUIRED, PI_14_AGE];
