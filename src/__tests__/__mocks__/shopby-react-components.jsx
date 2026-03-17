import React from 'react';

// 기본 noop 컨텍스트 값
const noopFn = vi.fn();
const noopAsync = vi.fn().mockResolvedValue({ data: {} });

// Provider 팩토리 - children만 렌더링하는 래퍼
const createProvider = (name) => {
  const Provider = ({ children }) => <>{children}</>;
  Provider.displayName = name;
  return Provider;
};

// 상태 컨텍스트 훅 팩토리
const createStateHook = (defaultValue) => vi.fn(() => defaultValue);

// 액션 컨텍스트 훅 팩토리
const createActionHook = (methods) => {
  const actionObj = {};
  for (const method of methods) {
    actionObj[method] = noopAsync;
  }
  return vi.fn(() => actionObj);
};

// --- Providers ---
export const TabsProvider = createProvider('TabsProvider');
export const ProductReviewProvider = createProvider('ProductReviewProvider');
export const ProductInquiryProvider = createProvider('ProductInquiryProvider');
export const ProductOptionProvider = createProvider('ProductOptionProvider');
export const ProductOptionProviderV2 = createProvider('ProductOptionProviderV2');
export const CouponByProductProvider = createProvider('CouponByProductProvider');
export const OrderSheetProvider = createProvider('OrderSheetProvider');
export const NaverPayProvider = createProvider('NaverPayProvider');
export const AppCardProvider = createProvider('AppCardProvider');
export const MyShippingAddressProvider = createProvider('MyShippingAddressProvider');
export const InquiryProvider = createProvider('InquiryProvider');
export const RestockNotificationProvider = createProvider('RestockNotificationProvider');
export const ExtraProductOptionProvider = createProvider('ExtraProductOptionProvider');
export const CartProvider = createProvider('CartProvider');
export const ProductSearchProvider = createProvider('ProductSearchProvider');
export const CategoriesProvider = createProvider('CategoriesProvider');
export const MyPayProvider = createProvider('MyPayProvider');
export const CashReceiptProvider = createProvider('CashReceiptProvider');
export const MyOrderProvider = createProvider('MyOrderProvider');

// --- State Hooks ---
export const useProductDetailStateContext = createStateHook({
  productDetail: {
    productName: '테스트 상품',
    guide: {},
  },
  originProductDetail: { baseInfo: { productNo: 1 } },
  relatedProducts: [],
});

export const useProductReviewStateContext = createStateHook({
  totalCount: 10,
});

export const useProductInquiryStateContext = createStateHook({
  totalCount: 5,
});

export const useProductOptionStateContextV2 = createStateHook({
  options: {},
});

export const useMallStateContext = createStateHook({
  clientId: 'test-client',
  mallProfile: { mallName: '테스트몰' },
  cartConfig: { storagePeriod: 30, storageMaxQuantity: 100 },
  accumulationConfig: { accumulationName: '적립금' },
  mallJoinConfig: { isMemberInfoUpdatableWithOrdererInfo: true },
  exchangeRate: 1,
  isGlobalForm: false,
  exchangeTo: 'KRW',
});

export const useCartStateContext = createStateHook({
  checkedProducts: [],
  checkedCartNos: [],
  cartDetail: null,
  checkingStatusPerCartNo: {},
});

export const useOrderSheetStateContext = createStateHook({
  ordererInfo: {},
  shippingAddressInfo: {},
  termsStatus: {},
  orderSheet: null,
  needsDepositBankForm: false,
  bankAccountToDeposit: null,
  remitterName: '',
  selectedPayMethod: null,
  myPayInfo: null,
  accumulationInputValue: 0,
  selectedCoupon: null,
  blockUseAccumulationWhenUseCoupon: false,
  paymentInfo: { minAccumulationLimit: 0 },
  appCardInfo: null,
  freeGiftInfos: [],
  selectedFreeGiftInfoMap: new Map(),
  noSelectFreeGiftConditionIds: [],
});

export const useAuthStateContext = createStateHook({
  profile: null,
});

export const useMyShippingAddressStateContext = createStateHook({
  defaultAddress: null,
});

export const useCashReceiptStateContext = createStateHook({
  cashReceiptIssuePurposeType: null,
  cashReceiptKeyType: null,
  cashReceiptKey: null,
  applyCashReceipt: false,
});

export const useOrderConfigStateContext = createStateHook({
  orderConfig: { cashReceipt: false },
});

// --- Action Hooks ---
export const useProductReviewActionContext = createActionHook(['fetchConfiguration']);
export const useProductInquiryActionContext = createActionHook(['fetchConfiguration', 'searchInquiries']);
export const useProductDetailActionContext = createActionHook([
  'fetchProductDetail', 'fetchRelatedProducts', 'fetchExtraProducts',
]);
export const useProductOptionActionContext = createActionHook(['fetchSelectorOptions']);
export const useProductOptionActionContextV2 = createActionHook([
  'fetchOptions', 'fetchOptionSelector', 'fetchAdditionalDiscount',
]);
export const useTabsActiveContext = vi.fn(() => ({
  updateTabs: vi.fn(),
  currentTab: 'DETAIL',
}));
export const useCartActionContext = createActionHook([
  'fetchCartDetail', 'checkOrderOnlyExtraProduct',
  'convertExtraProductsWithoutBaseProductNoToGeneralProducts',
]);
export const useNaverPayActionContext = createActionHook([
  'showNaverPayButton', 'prepareNaverPay', 'checkUsesNaverPayOrder',
]);
export const useOrderSheetActionContext = createActionHook([
  'order', 'fetchOrderSheet', 'updateOrdererInfo',
  'updateShippingAddressInfo', 'resetShippingAddressInfo', 'makeOrderSheet',
]);
export const useModalActionContext = vi.fn(() => ({
  openAlert: vi.fn(),
}));
export const useMyShippingAddressActionContext = createActionHook(['fetchMyShippingAddress']);
export const useExtraProductOptionActionContext = createActionHook([
  'setBaseProductPaymentMeans', 'fetchExtraProductOptions', 'fetchExtraProductOptionSelector',
]);
export const useAuthActionContext = vi.fn(() => ({
  isSignedIn: vi.fn(() => false),
}));
export const useAppCardActionContext = vi.fn(() => ({
  setOrderResponse: vi.fn(),
}));

export const DEFAULT_ORDER_SHEET_PROVIDER_STATE = {
  ordererInfo: {
    phoneNumber: '',
  },
};

// --- UI Components ---
export const Button = ({ label, onClick, className, ...props }) => (
  <button onClick={onClick} className={className} {...props}>{label}</button>
);
export const Icon = ({ name }) => <span data-testid={`icon-${name}`}>{name}</span>;
export const Checkbox = ({ label, onChange, className }) => (
  <label className={className}>
    <input type="checkbox" onChange={onChange} />
    {label}
  </label>
);
export const VisibleComponent = ({ shows, TruthyComponent, FalsyComponent }) => (
  shows ? TruthyComponent || null : FalsyComponent || null
);
export const ThumbList = ({ children, className, style }) => (
  <div className={className} style={style} data-testid="thumb-list">{children}</div>
);
export const ThumbItem = ({ children, href, src, alt, productNo }) => (
  <div data-testid={`thumb-item-${productNo}`} data-href={href}>
    <img src={src} alt={alt} />
    {children}
  </div>
);
export const InfiniteScrollLoader = ({ onIntersect, disabled }) => (
  <div data-testid="infinite-scroll" data-disabled={disabled} />
);
