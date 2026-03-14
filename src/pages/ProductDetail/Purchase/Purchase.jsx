import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { bool } from 'prop-types';

import {
  LikeBtn,
  useModalActionContext,
  VisibleComponent,
  Button,
  useProductDetailStateContext,
  IconBtn,
  useProductDetailActionContext,
  useAuthActionContext,
  IconSVG,
  useNaverPayActionContext,
  useProductOptionActionContextV2,
  useProductOptionStateContextV2,
  useCartActionContext,
  useOrderSheetActionContext,
  useOrderConfigStateContext,
  useAuthStateContext,
  useCurrencyStateContext,
  useExtraProductOptionActionContext,
  useExtraProductOptionStateContext,
} from '@shopby/react-components';
import {
  CLIENT_ERROR,
  convertToKoreanCurrency,
  getRestockNotificationButtonVisibility,
  getRestockNotiVisible,
  getHasSoldOutOption,
  isAgeVerified,
} from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import RestockNotificationModal from '../../../components/RestockNotificationModal';

import ExtraProductOptionSelector from './ExtraProductOptionSelector';
import ExtraProductSelectedOptions from './ExtraProductSelectedOptions';
import OptionQuantity from './OptionQuantityV2';
import OptionSelector from './OptionSelectorV2';
import OrderSheetAppCard from './OrderSheetAppCard';

const UNPURCHASABLE_STATUS = ['READY', 'FINISHED', 'STOP', 'PROHIBITION'];
const RESTOCK_NOTI_VISIBLE_STATUS = ['READY', 'ONSALE', 'FINISHED'];

const CLIENT_ERROR_CODES = [
  CLIENT_ERROR.NOT_SELECTED_REQUIRED_OPTION,
  CLIENT_ERROR.NOT_SELECTED_OPTION,
  CLIENT_ERROR.NOT_SELECTED_REQUIRED_OPTION,
  CLIENT_ERROR.NOT_INSERTED_REQUIRED_TEXT_OPTION,
  CLIENT_ERROR.PRODUCT_FAIL_MIN_COUNT,
  CLIENT_ERROR.PRODUCT_FAIL_MAX_COUNT,
  CLIENT_ERROR.NOT_INSERTED_REQUIRED_TEXT_OPTION,
];

// eslint-disable-next-line complexity
const Purchase = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productNo = Number(searchParams.get('productNo'));
  const channelType = searchParams.get('channelType');

  const {
    productDetail: { isSoldOut, likeStatus, limitations, baseInfo },
    originProductDetail,
  } = useProductDetailStateContext();
  const { showNaverPayButton, prepareNaverPay, checkUsesNaverPayOrder } = useNaverPayActionContext();
  const { fetchUserOptionSelections } = useProductOptionActionContextV2();
  const { updateLikeStatus } = useProductDetailActionContext();
  const { openAlert, openConfirm } = useModalActionContext();
  const { isSignedIn } = useAuthActionContext();
  const [visible, setVisible] = useState(false);
  const [visibleOrderSheetAppCard, setVisibleOrderSheetAppCard] = useState(false);
  const { catchError } = useErrorBoundaryActionContext();
  const { totalPrice, options } = useProductOptionStateContextV2();
  const { extraProductTotalPrice } = useExtraProductOptionStateContext();
  const { addCart } = useCartActionContext();
  const { profile } = useAuthStateContext();
  const { makeOrderSheet, setOrderSheetNo } = useOrderSheetActionContext();
  const { orderConfig } = useOrderConfigStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();
  const { fetchExtraProductUserOptionSelections } = useExtraProductOptionActionContext();

  const [usesNaverPayOrder, setUsesNaverPayOrder] = useState(false);

  const [visibleRestockNotificationModal, setVisibleRestockNotificationModal] = useState(false);
  // 전체 총액 계산 (본상품 + 추가상품)
  const totalPriceWithExtraProducts = useMemo(
    () => (totalPrice || 0) + (extraProductTotalPrice || 0),
    [totalPrice, extraProductTotalPrice]
  );

  const unpurchasable = useMemo(
    () => UNPURCHASABLE_STATUS.includes(originProductDetail?.status.saleStatusType) || isSoldOut,
    [originProductDetail?.status]
  );

  const hasSoldOutOption = useMemo(() => {
    if (!productNo || !options[productNo]) {
      return false;
    }

    const { flatOptions } = options[productNo];

    return getHasSoldOutOption(flatOptions);
  }, [options, productNo]);

  const isRestockNotiVisible = useMemo(
    () => getRestockNotiVisible(originProductDetail, RESTOCK_NOTI_VISIBLE_STATUS),
    [originProductDetail]
  );

  const visibleRestockNotificationButton = useMemo(
    () =>
      getRestockNotificationButtonVisibility({
        usableRestockNoti: baseInfo?.usableRestockNoti,
        isRestockNotiVisible,
        hasSoldOutOption,
      }),
    [baseInfo?.usableRestockNoti, isRestockNotiVisible, hasSoldOutOption]
  );

  const handleMakeOrderBtnClick = async () => {
    try {
      const { data } = await fetchUserOptionSelections();

      const { data: extraProductData } = await fetchExtraProductUserOptionSelections();
      const baseProductNo = productNo;

      const baseProductOptions = data.map((item) => ({
        ...item,
        productNo,
        orderCnt: item.count,
        additionalProductNo: 0,
        channelType,
      }));

      const extraProductOptions = extraProductData.map((item) => ({
        ...item,
        baseProductNo,
        channelType,
        productNo: Number(item.productNo),
        orderCnt: item.count,
      }));

      const products = [...baseProductOptions, ...extraProductOptions];

      const { data: orderSheet } = await makeOrderSheet({
        cartNos: null,
        channelType,
        productCoupons: null,
        products,
      });

      isSignedIn()
        ? navigate(`/order/${orderSheet.orderSheetNo}`)
        : navigate('/sign-in', { state: { orderSheetNo: orderSheet.orderSheetNo } });
    } catch (context) {
      const alertOnlyErrorMessage = CLIENT_ERROR_CODES.includes(context.error?.code);

      if (alertOnlyErrorMessage) {
        openAlert({
          message: context.error.description,
        });

        return;
      }

      catchError(context, () => navigate(0));
    }
  };

  const isInvalidMinorPurchaseYn = (options) => {
    const hasMinorPurchaseYnProduct = options.some((option) => option.minorPurchaseYn === 'N');

    return hasMinorPurchaseYnProduct && !isAgeVerified();
  };

  const handleCartBtnClick = async () => {
    try {
      const { data } = await fetchUserOptionSelections();

      const { data: extraProductData } = await fetchExtraProductUserOptionSelections();
      const baseProductNo = productNo;

      const baseProductOptions = data.map((item) => ({
        ...item,
        channelType,
        productNo,
        orderCnt: item.count,
      }));

      const extraProductOptions = extraProductData.map((item) => ({
        ...item,
        baseProductNo,
        channelType,
        productNo: Number(item.productNo),
        orderCnt: item.count,
      }));

      const products = [...baseProductOptions, ...extraProductOptions];

      if (isInvalidMinorPurchaseYn(products)) {
        openConfirm({
          message: '성인인증이 필요한 상품입니다.',
          confirmLabel: '확인',
          onConfirm: () => {
            navigate('/adult-certification');
          },
        });

        return;
      }

      await addCart(products, profile?.memberStatus);

      openConfirm({
        message: '장바구니에 담았습니다.',
        confirmLabel: '장바구니 가기',
        onConfirm: () => {
          navigate('/cart');
        },
        cancelLabel: '쇼핑계속하기',
      });
    } catch (context) {
      const alertOnlyErrorMessage = CLIENT_ERROR_CODES.includes(context.error?.code);

      if (alertOnlyErrorMessage) {
        openAlert({
          message: context.error.description,
        });

        return;
      }

      catchError(context, () => navigate(0));
    }
  };

  const handleAppCardOrderBtnClick = async () => {
    try {
      const { data } = await fetchUserOptionSelections();

      const { data: orderSheet } = await makeOrderSheet({
        cartNos: null,
        channelType,
        productCoupons: null,
        products: data.map((item) => ({
          ...item,
          productNo,
          orderCnt: item.count,
          additionalProductNo: 0,
          channelType,
        })),
      });

      setOrderSheetNo(orderSheet.orderSheetNo);
      setVisibleOrderSheetAppCard(true);
    } catch (context) {
      const alertOnlyErrorMessage = CLIENT_ERROR_CODES.includes(context.error?.code);

      if (alertOnlyErrorMessage) {
        openAlert({
          message: context.error.description,
        });

        return;
      }

      catchError(context, () => navigate(0));
    }
  };

  const handleCloseOrderSheetAppCard = () => {
    setVisibleOrderSheetAppCard(false);
  };

  useEffect(() => {
    (async () => {
      if (!productNo) {
        return;
      }

      if (!orderConfig) {
        return;
      }

      setUsesNaverPayOrder(
        await checkUsesNaverPayOrder({
          cacheOption: {
            type: 'MEMORY',
            timeBySeconds: 180,
          },
        })
      );
    })();
  }, [orderConfig]);

  useEffect(() => {
    showNaverPayButton({
      containerElementId: 'naver-pay',
      usesWishListButton: true,
      redirectUrlAfterBuying: location.href, // backUrl
      redirectUrlAfterWishing: location.href, // backUrl
      isVisible: usesNaverPayOrder && limitations?.naverPayHandling,
      onBeforeBuyButtonClick: async () => {
        const { data } = await fetchUserOptionSelections();
        const { data: extraProductData } = await fetchExtraProductUserOptionSelections();

        const baseProductsOptions = data.map((item) => ({
          ...item,
          productNo,
        }));

        const extraProductOptions = extraProductData.map((item) => ({
          ...item,
          productNo: Number(item.productNo),
          baseProductNo: productNo,
        }));

        const productOptions = [...baseProductsOptions, ...extraProductOptions];

        const naverPayItems = productOptions.map(
          ({
            orderCnt,
            optionInputs,
            optionNo,
            additionalProductN = 0,
            channelType: _channelType,
            productNo,
            baseProductNo,
          }) => ({
            orderCnt,
            channelType: _channelType ? _channelType : channelType,
            optionInputs,
            optionNo,
            productNo,
            additionalProductN,
            baseProductNo,
          })
        );

        prepareNaverPay({ items: naverPayItems });
      },
      onBeforeWishListButtonClick: () => {
        prepareNaverPay({ productNo });
      },
      cacheOption: {
        type: 'MEMORY',
        timeBySeconds: 180,
      },
    });
  }, [usesNaverPayOrder, limitations?.naverPayHandling]);

  return (
    <>
      {/* 구매 영역: 데스크톱에서는 sticky로 우측에 고정 */}
      <div className="purchase product-detail lg:sticky lg:top-4 lg:mt-6 bg-card rounded-lg lg:border lg:border-border lg:p-6 lg:shadow-sm">
        <VisibleComponent
          shows={!unpurchasable}
          TruthyComponent={
            <IconBtn
              className={`purchase__opener ${visible ? 'is-show' : ''}`}
              iconType="angle-down"
              label={`구매 하기 옵션 ${visible ? '닫기' : '열기'}`}
              onClick={() => setVisible((prevVisible) => !prevVisible)}
            />
          }
        />

        <VisibleComponent
          shows={unpurchasable}
          TruthyComponent={
            <div className="purchase__button-wrap flex flex-col sm:flex-row gap-2 w-full">
              <VisibleComponent
                shows={visibleRestockNotificationButton}
                TruthyComponent={
                  <Button
                    className="purchase__restock-btn w-full sm:w-auto"
                    label="재입고알림"
                    theme="default"
                    onClick={() => {
                      setVisibleRestockNotificationModal(true);
                    }}
                  />
                }
              />
              <Button
                className="purchase__buy-btn purchase__buy-btn--unpurchasable w-full"
                disabled={isSoldOut}
                theme="dark"
                label="구매불가"
              />
            </div>
          }
        />

        <VisibleComponent
          shows={!isSoldOut && !visible && !unpurchasable}
          TruthyComponent={
            <div className="purchase__button-wrap flex items-center gap-2 w-full">
              <LikeBtn
                className="purchase__like-btn shrink-0"
                productNo={productNo}
                isActive={likeStatus.isLiked}
                count={likeStatus.count}
                shopby-script-action="TOGGLE_LIKE_STATUS"
                shopby-like-status={likeStatus.isLiked?.toString?.()}
                shopby-product-no={productNo}
                onClick={({ count, isActive }) =>
                  updateLikeStatus({
                    count,
                    isLiked: isActive,
                  })
                }
              >
                <IconSVG
                  fill={likeStatus.isLiked ? 'var(--point-color)' : 'var(--default-color)'}
                  strokeWidth={0}
                  size={40}
                  name="fill-heart"
                />
              </LikeBtn>
              <VisibleComponent
                shows={visibleRestockNotificationButton}
                TruthyComponent={
                  <Button
                    className="purchase__restock-btn"
                    theme="default"
                    label="재입고알림"
                    onClick={() => {
                      setVisibleRestockNotificationModal(true);
                    }}
                  />
                }
              />

              <Button className="purchase__buy-btn flex-1" theme="caution" label="구매하기" onClick={() => setVisible(true)} />
            </div>
          }
        />

        <div className="purchase__option space-y-4" hidden={!visible}>
          {/* 본상품 옵션 선택 */}
          <div className="space-y-3">
            <OptionSelector />
          </div>

          {/* 추가상품 옵션 선택 */}
          <div className="space-y-3">
            <ExtraProductOptionSelector />
          </div>

          <div className="purchase__quantity-box space-y-3 border-t border-border pt-4">
            <OptionQuantity />

            {/* 추가상품 선택된 옵션들 수량 변경 */}
            <ExtraProductSelectedOptions />
          </div>

          {/* 총 상품 금액 표시 */}
          <p className="purchase__total flex items-center justify-between py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">총 상품 금액</span>
            <em className="not-italic">
              <span className="text-2xl font-bold text-primary">{convertToKoreanCurrency(totalPriceWithExtraProducts)}</span>
              <span className="text-sm ml-1">{currencyLabel}</span>
            </em>
          </p>

          {/* 액션 버튼: 모바일 세로, 데스크톱 가로 */}
          <div className="purchase__btns flex flex-col sm:flex-row gap-2">
            <Button
              theme="dark"
              onClick={handleCartBtnClick}
              shopby-script-action="ADD_TO_CART"
              shopby-product-no={productNo}
            >
              장바구니
            </Button>
            <Button theme="caution" onClick={handleMakeOrderBtnClick}>
              구매하기
            </Button>
            {orderConfig?.useAppCard && (
              <Button theme="caution" className="purchase__app-card-order-btn" onClick={handleAppCardOrderBtnClick}>
                앱카드 결제
              </Button>
            )}
          </div>
          <div id="naver-pay" className="purchase__naver-pay-btn mt-3" />
        </div>
      </div>
      <VisibleComponent
        shows={visibleOrderSheetAppCard}
        TruthyComponent={<OrderSheetAppCard onClose={handleCloseOrderSheetAppCard} />}
      />
      <VisibleComponent
        shows={visibleRestockNotificationModal}
        TruthyComponent={<RestockNotificationModal onClose={() => setVisibleRestockNotificationModal(false)} />}
      />
    </>
  );
};

export default Purchase;

Purchase.propTypes = {
  isSoldOut: bool,
};
