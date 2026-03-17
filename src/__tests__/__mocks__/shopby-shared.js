export const calculateDiscountedPrice = vi.fn(({ salePrice = 0, immediateDiscountAmt = 0, additionDiscountAmt = 0 }) =>
  salePrice - immediateDiscountAmt - additionDiscountAmt
);

export const THUMB_LIST_TYPE = {
  GALLERY: 'GALLERY',
  LIST: 'LIST',
};

export const getPlatformByMobile = vi.fn((isMobile) => (isMobile ? 'MOBILE_WEB' : 'PC'));

export const isSignedIn = vi.fn(() => false);

export const parsePhoneNumber = vi.fn((number, options) => number);

export const PG_TYPES_MAP = {
  APP_CARD: 'APP_CARD',
};
