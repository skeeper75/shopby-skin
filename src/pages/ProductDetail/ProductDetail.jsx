import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  TabsProvider,
  useProductDetailStateContext,
  ProductReviewProvider,
  useProductReviewStateContext,
  useTabsActiveContext,
  ProductInquiryProvider,
  useProductInquiryStateContext,
  ProductOptionProvider,
  ProductOptionProviderV2,
  CouponByProductProvider,
  OrderSheetProvider,
  useProductInquiryActionContext,
  useProductDetailActionContext,
  useProductOptionActionContext,
  useProductOptionActionContextV2,
  NaverPayProvider,
  useMallStateContext,
  AppCardProvider,
  MyShippingAddressProvider,
  useProductReviewActionContext,
  useProductOptionStateContextV2,
  InquiryProvider,
  RestockNotificationProvider,
  ExtraProductOptionProvider,
  useExtraProductOptionActionContext,
} from '@shopby/react-components';

import AdminBanner from '../../components/AdminBanner';
import { EXTERNAL_CUSTOM_ORDER_SHEET_TERMS } from '../../constants';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import useResponsive from '../../hooks/useResponsive';

import Content from './Content';
import ImageSlider from './ImageSlider';
import HuniPurchase from './Purchase/HuniPurchase';
import Purchase from './Purchase';
import RelatedProduct from './RelatedProduct';
import Summary from './Summary';

// @MX:NOTE: [AUTO] isPrintProduct - 상품명 또는 카테고리로 인쇄 상품 여부 판별 (임시 로직, 실제 API 필드로 교체 권장)
const isPrintProduct = (productDetail) => {
  const name = productDetail?.baseInfo?.productName ?? '';
  return name.includes('인쇄') || name.includes('출력') || name.includes('프린트');
};

const makeTabs = ({ reviewCount = 0, inquiryCount = 0, hasGuide = false } = {}) => {
  const tabs = [
    {
      value: 'DETAIL',
      label: '상품 상세정보',
    },
    {
      value: 'REVIEW',
      label: `상품후기 (${reviewCount})`,
    },
    {
      value: 'INQUIRY',
      label: `상품 Q&A (${inquiryCount})`,
    },
  ];

  if (hasGuide) {
    tabs.push({
      value: 'SHIPPING_CLAIM',
      label: '배송/교환/반품',
    });
  }

  return tabs;
};

const ProductDetailContent = () => {
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));
  const channelType = searchParams.get('channelType');

  const {
    productDetail: { productName, guide, ...productInfo },
    originProductDetail,
  } = useProductDetailStateContext();

  const { fetchConfiguration: fetchProductReviewConfiguration } = useProductReviewActionContext();
  const { fetchConfiguration: fetchProductInquiryConfiguration } = useProductInquiryActionContext();
  const { fetchProductDetail, fetchRelatedProducts } = useProductDetailActionContext();
  const { fetchSelectorOptions } = useProductOptionActionContext();
  const { fetchOptions, fetchOptionSelector, fetchAdditionalDiscount } = useProductOptionActionContextV2();
  const { options } = useProductOptionStateContextV2();
  const { updateTabs } = useTabsActiveContext();
  const { totalCount: reviewCount } = useProductReviewStateContext();
  const { totalCount: inquiryCount } = useProductInquiryStateContext();
  const { searchInquiries } = useProductInquiryActionContext();
  const { relatedProducts, productDetail } = useProductDetailStateContext();
  const { fetchExtraProducts } = useProductDetailActionContext();
  const { setBaseProductPaymentMeans, fetchExtraProductOptions, fetchExtraProductOptionSelector } =
    useExtraProductOptionActionContext();

  useLayoutChanger({ hasBackBtnOnHeader: true, title: productName });

  useEffect(() => {
    if (!originProductDetail) return;

    (async () => {
      await fetchOptions({
        productNo,
        productInfo,
        cacheOption: {
          type: 'MEMORY',
          timeBySeconds: 180,
        },
      });

      fetchOptionSelector();
    })();

    // 외부스크립트, sb객체 등록 기능. 삭제금지
    if (originProductDetail?.baseInfo?.productNo !== productNo) {
      return;
    }

    ShopbyExternalScript?.setGlobalObjectSb({ product: originProductDetail });
  }, [originProductDetail]);

  useEffect(() => {
    searchInquiries();

    if (productNo > 0) {
      fetchProductDetail({
        productNo,
        channelType,
      });

      fetchProductReviewConfiguration({
        cacheOption: {
          type: 'MEMORY',
          timeBySeconds: 180,
        },
      });

      fetchProductInquiryConfiguration({
        cacheOption: {
          type: 'MEMORY',
          timeBySeconds: 180,
        },
      });

      fetchRelatedProducts({
        productNo,
        cacheOption: {
          type: 'MEMORY',
          timeBySeconds: 180,
        },
      });
    }
  }, [productNo]);

  const hasGuide = useMemo(() => Object.entries(guide).some(([, content]) => Boolean(content)), [guide]);

  useEffect(
    () =>
      updateTabs(
        makeTabs({
          reviewCount,
          inquiryCount,
          hasGuide,
        })
      ),
    [reviewCount, inquiryCount, hasGuide]
  );

  useEffect(() => {
    const option = options?.[productNo];
    if (!option) {
      return;
    }

    const { data } = fetchAdditionalDiscount(productNo);

    fetchSelectorOptions({
      option,
      additionalDiscount: data,
    });
  }, [options]);

  useEffect(() => {
    if (!productDetail?.baseInfo?.paymentMeans) return;

    setBaseProductPaymentMeans(productDetail.baseInfo.paymentMeans);

    (async () => {
      const { data: extraProductsResult } = await fetchExtraProducts({ productNo });

      if (extraProductsResult) {
        const productNos = extraProductsResult.extraProducts.map((product) => product.productNo);

        await fetchExtraProductOptions(productNos, {
          productInfo: productDetail,
          extraProducts: extraProductsResult.extraProducts,
        });

        await fetchExtraProductOptionSelector();
      }
    })();
  }, [productDetail]);

  const printProduct = isPrintProduct(productDetail);

  return (
    <div className="product-detail max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 데스크톱: 2컬럼 레이아웃 (이미지 | 요약+구매) / 모바일: 단일 컬럼 */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        {/* 좌측: 상품 이미지 갤러리 */}
        <div className="w-full">
          <ImageSlider />
        </div>
        {/* 우측: 요약 정보 + 인쇄 상품이면 HuniPurchase 인라인 표시 */}
        <div className="mt-4 lg:mt-0">
          <Summary />
          {printProduct && (
            <div className="mt-6">
              <HuniPurchase />
            </div>
          )}
        </div>
      </div>
      {relatedProducts?.length > 0 && (
        <div className="mt-8">
          <RelatedProduct />
        </div>
      )}
      <AdminBanner bannerId="BNDETAIL" />
      <div className="mt-8">
        <Content />
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { clientId, mallProfile } = useMallStateContext();
  const [searchParams] = useSearchParams();
  const { isMobile } = useResponsive();
  const productNo = Number(searchParams.get('productNo'));

  const initialTabs = useMemo(() => makeTabs(), []);

  return (
    <ProductReviewProvider productNo={productNo}>
      <ProductInquiryProvider productNo={productNo}>
        <InquiryProvider>
          <TabsProvider
            initialState={{
              currentTab: 'DETAIL',
              tabs: initialTabs,
            }}
          >
            <OrderSheetProvider
              clientId={clientId}
              mallProfile={mallProfile}
              customTerms={EXTERNAL_CUSTOM_ORDER_SHEET_TERMS}
            >
              <MyShippingAddressProvider>
                <NaverPayProvider
                  clientId={clientId}
                  mallProfile={mallProfile}
                  platform={isMobile ? 'MOBILE_WEB' : 'PC'}
                >
                  <ProductOptionProvider productNo={productNo}>
                    <ProductOptionProviderV2>
                      <ExtraProductOptionProvider productNo={productNo}>
                        <CouponByProductProvider productNo={productNo}>
                          <ProductDetailContent />
                        </CouponByProductProvider>

                        {/* 일반 상품은 기존 Purchase, 인쇄 상품은 ProductDetailContent 내 HuniPurchase 사용 */}
                        <AppCardProvider>
                          <RestockNotificationProvider>
                            <Purchase />
                          </RestockNotificationProvider>
                        </AppCardProvider>
                      </ExtraProductOptionProvider>
                    </ProductOptionProviderV2>
                  </ProductOptionProvider>
                </NaverPayProvider>
              </MyShippingAddressProvider>
            </OrderSheetProvider>
          </TabsProvider>
        </InquiryProvider>
      </ProductInquiryProvider>
    </ProductReviewProvider>
  );
};

export default ProductDetail;
