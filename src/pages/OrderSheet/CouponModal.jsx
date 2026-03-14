import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { string, shape, number, arrayOf, func } from 'prop-types';

import {
  Button,
  Radio,
  useModalActionContext,
  OrderSheetCouponProvider,
  useOrderSheetCouponStateContext,
  useOrderSheetCouponActionContext,
  useMallStateContext,
  useOrderSheetStateContext,
  useOrderSheetActionContext,
  VisibleComponent,
  useCurrencyStateContext,
} from '@shopby/react-components';
import { CLIENT_ERROR, ParameterTypeError, convertToKoreanCurrency } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import FullModal from '../../components/FullModal';
import InfoList from '../../components/InfoList';
import Sanitized from '../../components/Sanitized';

const COUPON_TYPES = ['PRODUCT', 'CART'];

const CouponModalContent = ({ orderSheetNo, initialCoupon, onClose, onApplyCouponBtnClick }) => {
  const {
    couponAmount: { cartCouponDiscountAmt, productCouponDiscountAmt },
    couponStatus,
    promotionConfigsCoupon,
  } = useOrderSheetCouponStateContext();
  const {
    accumulationConfig: { accumulationName },
  } = useMallStateContext();
  const { selectCouponIndividually, isUsingCoupon, fetchCouponStatus, getSelectedCoupon, fetchPromotionConfigsCoupon } =
    useOrderSheetCouponActionContext();
  const { accumulationInputValue, blockUseAccumulationWhenUseCoupon } = useOrderSheetStateContext();
  const { updateAccumulationInputValue } = useOrderSheetActionContext();
  const allCouponAmt = useMemo(() => cartCouponDiscountAmt + productCouponDiscountAmt);
  const { openAlert, openConfirm } = useModalActionContext();
  const navigate = useNavigate();
  const { catchError } = useErrorBoundaryActionContext();
  const { cartCouponSubType } = getSelectedCoupon();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  const couponNotices = useMemo(
    () => [
      '상품 쿠폰과 장바구니 쿠폰은 함께 사용할 수 있습니다. 단, 일부 상품은 중복사용이 제외 됩니다.',
      '쿠폰 사용불가 상품은 쿠폰할인 적용이 불가합니다.',
      `쿠폰할인 시 구매 ${accumulationName} 적립이 불가합니다.`,
      'PAYCO 전용 쿠폰은 PAYCO 결제만 가능합니다.',
      '주문적용 쿠폰과 배송비 금액 할인 쿠폰은 중복 적용이 불가합니다.',
    ],
    [accumulationName]
  );

  useEffect(() => {
    if (!orderSheetNo) return;

    const fetchCoupon = async () => {
      try {
        await fetchCouponStatus(orderSheetNo, initialCoupon);
        await fetchPromotionConfigsCoupon();
      } catch (e) {
        catchError(e);
      }
    };

    fetchCoupon();
  }, [orderSheetNo]);

  const handleCouponSelect = async (couponIssueNo, type, productNo) => {
    if (!COUPON_TYPES.includes(type))
      ParameterTypeError.of({ parameterName: 'type', functionName: handleCouponSelect.name });

    try {
      await selectCouponIndividually({
        couponIssueNo,
        type,
        productNo,
      });
    } catch (e) {
      const message = e?.message ?? e?.description;
      const replacedUrl = {
        [CLIENT_ERROR.EXPIRED_REFRESH_TOKEN]: `/sign-in`,
      }[e?.code];

      openAlert({
        message,
        onClose: () => {
          if (replacedUrl) {
            navigate(replacedUrl, {
              replace: true,
              state: {
                from: `${location.pathname}${location.search}`,
              },
            });
          }
        },
      });
    }
  };

  const handleApplyCouponBtnClick = () => {
    const selectedCoupon = getSelectedCoupon();

    if (!blockUseAccumulationWhenUseCoupon) {
      onApplyCouponBtnClick?.(selectedCoupon);

      return;
    }

    const { cartCouponIssueNo, productCoupons } = selectedCoupon;

    const isCouponSelected = cartCouponIssueNo || productCoupons?.length;

    const isUseAccumulationWhenUseCoupon = accumulationInputValue && isCouponSelected;

    if (isUseAccumulationWhenUseCoupon) {
      openConfirm({
        message: (
          <>
            쿠폰 적용 시 적립금 사용이 불가합니다. <br />
            쿠폰을 적용하시겠습니까?
          </>
        ),
        confirmLabel: '확인',
        onConfirm: () => {
          updateAccumulationInputValue(0);
          onApplyCouponBtnClick?.(selectedCoupon);
        },
        cancelLabel: '취소',
        onCancel: () => null,
      });
    } else {
      onApplyCouponBtnClick?.(selectedCoupon);
    }
  };

  return (
    <FullModal title="상품 쿠폰 조회 및 적용" onClose={onClose} className="coupon-modal">
      <div className="coupon-modal__summary">
        <div className="coupon-modal__summary-item">
          <p>상품 쿠폰</p>
          <p>
            <span className="bold">{convertToKoreanCurrency(productCouponDiscountAmt)}</span> {currencyLabel}
          </p>
        </div>
        <span className="coupon-modal__formula-symbol"> + </span>
        <div className="coupon-modal__summary-item">
          <VisibleComponent
            shows={cartCouponSubType === 'DELIVERY_DEFAULT' || cartCouponSubType === 'DELIVERY_ALL'}
            TruthyComponent={<p>배송비 할인</p>}
            FalsyComponent={<p>장바구니 쿠폰</p>}
          />
          <p>
            <span className="bold">{convertToKoreanCurrency(cartCouponDiscountAmt)} </span> {currencyLabel}
          </p>
        </div>
        <span className="coupon-modal__formula-symbol"> = </span>
        <div className="coupon-modal__summary-item">
          <p>할인금액 합계</p>
          <p>
            <em className="bold highlight">
              {convertToKoreanCurrency(allCouponAmt)} {currencyLabel}
            </em>
          </p>
        </div>
      </div>
      <div className="coupon-modal__details">
        <div className="coupon-modal__coupon-details">
          <section className="coupon-modal__coupon-section">
            <p className="coupon-modal__coupon-type">상품 쿠폰</p>
            <ul className="info-list__items">
              <li>상품쿠폰은 상품당 한 쿠폰만 적용됩니다.</li>
            </ul>
            {couponStatus?.products.map(({ productName, productNo, productCoupons }) => (
              <div key={productNo}>
                <p>
                  <Sanitized html={productName} />
                </p>
                <div className="coupon-modal__controller">
                  <div className="coupon-modal__controller-item">
                    <Radio
                      id={`coupon-controller-${productNo}-0`}
                      name={`coupon-controller-${productNo}`}
                      value="0"
                      onChange={() => handleCouponSelect(null, 'PRODUCT', productNo)}
                      checked={!isUsingCoupon('PRODUCT', productNo)}
                    />
                    <label htmlFor={`coupon-controller-${productNo}-0`}>선택 없음</label>
                  </div>
                  {productCoupons.map(({ couponIssueNo, couponName, useEndYmdt, couponDiscountAmt, selected }) => (
                    <div key={`${productNo}-${couponIssueNo}`} className="coupon-modal__controller-item">
                      <Radio
                        id={`coupon-controller-${productNo}-${couponIssueNo}`}
                        name={`coupon-controller-${productNo}`}
                        value={couponIssueNo}
                        onChange={() => handleCouponSelect(couponIssueNo, 'PRODUCT', productNo)}
                        checked={selected}
                      />
                      <label htmlFor={`coupon-controller-${productNo}-${couponIssueNo}`}>
                        {couponName}
                        <br />
                        <span className="coupon-modal__date">(~{useEndYmdt.slice(0, 10)})</span>
                      </label>
                      <span className="coupon-modal__coupon-amount">
                        {convertToKoreanCurrency(couponDiscountAmt)}
                        {currencyLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
          <section className="coupon-modal__coupon-section">
            <p className="coupon-modal__coupon-type">장바구니 쿠폰</p>
            <ul className="info-list__items">
              {!promotionConfigsCoupon?.allowCartCouponWhenUnusableProductsExist && (
                <li>쿠폰불가 상품 구매 시 사용이 불가합니다.</li>
              )}
              <li>주문적용 쿠폰과 배송비 금액 할인 쿠폰은 중복 적용이 불가합니다. </li>
            </ul>
            <div className="coupon-modal__controller">
              <div className="coupon-modal__controller-item">
                <Radio
                  id={`coupon-controller-cart-0`}
                  name="coupon-controller-cart"
                  value="0"
                  onChange={() => handleCouponSelect(null, 'CART')}
                  checked={!isUsingCoupon('CART')}
                />
                <label htmlFor={`coupon-controller-cart-0`}>선택 없음</label>
              </div>
              {couponStatus?.cartCoupons.map(
                ({ couponIssueNo, couponName, selected, useEndYmdt, couponDiscountAmt, couponSubType }) => (
                  <div key={couponIssueNo} className="coupon-modal__controller-item">
                    <Radio
                      id={`coupon-controller-cart-${couponIssueNo}`}
                      name="coupon-controller-cart"
                      value={couponIssueNo}
                      onChange={() => handleCouponSelect(couponIssueNo, 'CART')}
                      checked={selected}
                    />
                    <label htmlFor={`coupon-controller-cart-${couponIssueNo}`}>
                      {couponName}
                      <br />
                      <span className="coupon-modal__date">(~{useEndYmdt.slice(0, 10)})</span>
                    </label>
                    <span className="coupon-modal__coupon-amount">
                      <VisibleComponent
                        shows={couponSubType === 'DELIVERY_DEFAULT' || couponSubType === 'DELIVERY_ALL'}
                        TruthyComponent={<span>최대&nbsp;</span>}
                      />
                      {convertToKoreanCurrency(couponDiscountAmt)}
                      {currencyLabel}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>
          <Button className="coupon-modal__apply-btn" label="쿠폰 적용" onClick={handleApplyCouponBtnClick} />
        </div>

        <InfoList className="coupon-modal__info" title="쿠폰할인 유의사항" infos={couponNotices} />
      </div>
    </FullModal>
  );
};

const CouponModal = ({ orderSheetNo, initialCoupon, onClose, onApplyCouponBtnClick }) => {
  if (!orderSheetNo) return <></>;

  return (
    <OrderSheetCouponProvider>
      <CouponModalContent
        orderSheetNo={orderSheetNo}
        initialCoupon={initialCoupon}
        onClose={onClose}
        onApplyCouponBtnClick={onApplyCouponBtnClick}
      />
    </OrderSheetCouponProvider>
  );
};

export default CouponModal;

CouponModalContent.propTypes = {
  orderSheetNo: string.isRequired,
  initialCoupon: shape({
    productCoupons: arrayOf(
      shape({
        productNo: number.isRequired,
        couponIssueNo: number.isRequired,
      })
    ),
    cartCouponIssueNo: number.isRequired,
    promotionCode: string.isRequired,
    channelType: string,
  }),
  onClose: func,
  onApplyCouponBtnClick: func,
};

CouponModal.propTypes = {
  orderSheetNo: string,
  initialCoupon: shape({
    productCoupons: arrayOf(
      shape({
        productNo: number.isRequired,
        couponIssueNo: number.isRequired,
      })
    ),
    cartCouponIssueNo: number.isRequired,
    promotionCode: string.isRequired,
    channelType: string,
  }),
  onClose: func,
  onApplyCouponBtnClick: func,
};
