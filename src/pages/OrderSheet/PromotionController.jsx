import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  InputWithUnit,
  Button,
  useOrderSheetStateContext,
  useOrderSheetActionContext,
  useAuthActionContext,
  useModalActionContext,
  useCurrencyStateContext,
  DEFAULT_ORDER_SHEET_PROVIDER_STATE,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import CouponModal from './CouponModal';

const PromotionController = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    orderSheetNo,
    accumulationInputValue,
    paymentInfo: {
      availableMaxAccumulationAmt,
      accumulationAmt,
      cartCouponAmt,
      productCouponAmt,
      minAccumulationLimit,
    },
    selectedCoupon,
    blockUseAccumulationWhenUseCoupon,
  } = useOrderSheetStateContext();
  const { updateAccumulationInputValue, updateSelectedCoupon } = useOrderSheetActionContext();
  const { isSignedIn: checkIsSignedIn } = useAuthActionContext();
  const isSignedIn = useMemo(() => checkIsSignedIn(), []);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [accumulationChangeInputValue, setAccumulationChangeInputValue] = useState(accumulationInputValue);
  const allCouponAmt = useMemo(() => cartCouponAmt + productCouponAmt, [cartCouponAmt, productCouponAmt]);
  const { openConfirm } = useModalActionContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  const handleAccumulationInputChange = ({ currentTarget: { value } }) => {
    let valueByNumber = Number(value);

    if (valueByNumber > availableMaxAccumulationAmt) {
      valueByNumber = availableMaxAccumulationAmt;
    }

    setAccumulationChangeInputValue(valueByNumber);
  };

  const handleUseAllAccumulationBtnClick = () => {
    if (!blockUseAccumulationWhenUseCoupon) {
      updateAccumulationInputValue(availableMaxAccumulationAmt);

      return;
    }

    const isCouponSelected = selectedCoupon?.cartCouponIssueNo || selectedCoupon?.productCoupons?.length;

    if (isCouponSelected) {
      openConfirm({
        message: (
          <>
            적립금 사용 시 쿠폰 사용이 불가합니다.
            <br />
            적립금을 사용하시겠습니까?
          </>
        ),
        confirmLabel: '확인',
        onConfirm: () => {
          updateSelectedCoupon(DEFAULT_ORDER_SHEET_PROVIDER_STATE.selectedCoupon);
          updateAccumulationInputValue(availableMaxAccumulationAmt);
        },
        cancelLabel: '취소',
        onCancel: () => {
          updateAccumulationInputValue(0);
          setAccumulationChangeInputValue(0);
        },
      });
    } else {
      updateAccumulationInputValue(availableMaxAccumulationAmt);
    }
  };

  const validateUseAccumulationAndWhenUseCoupon = (accumulationValue) => {
    const { cartCouponIssueNo, productCoupons } = selectedCoupon;

    const isCouponSelected = cartCouponIssueNo || productCoupons?.length;

    if (isCouponSelected) {
      openConfirm({
        message: (
          <>
            적립금 사용 시 쿠폰 사용이 불가합니다.
            <br />
            적립금을 사용하시겠습니까?
          </>
        ),
        confirmLabel: '확인',
        onConfirm: () => {
          updateSelectedCoupon(DEFAULT_ORDER_SHEET_PROVIDER_STATE.selectedCoupon);
          updateAccumulationInputValue(accumulationValue);
        },
        cancelLabel: '취소',
        onCancel: () => {
          updateAccumulationInputValue(0);
          setAccumulationChangeInputValue(0);
        },
      });
    } else {
      updateAccumulationInputValue(accumulationValue);
    }
  };

  const handleAccumulationInputBlur = () => {
    const accumulationValue = Math.min(accumulationChangeInputValue, availableMaxAccumulationAmt);

    const isAccumulationValueLessThanMinOrZero = accumulationValue < minAccumulationLimit || !accumulationValue;

    if (isAccumulationValueLessThanMinOrZero || !blockUseAccumulationWhenUseCoupon) {
      updateAccumulationInputValue(accumulationValue);

      return;
    }

    validateUseAccumulationAndWhenUseCoupon(accumulationValue);
  };

  const handleOpenCouponModalBtnClick = () => {
    setIsCouponModalOpen(true);
  };

  const handleCouponModalCloseBtnClick = () => {
    setIsCouponModalOpen(false);
  };

  const handleCouponModalApplyCouponBtnClick = (selectedCoupon) => {
    setIsCouponModalOpen(false);
    updateAccumulationInputValue(0);
    updateSelectedCoupon(selectedCoupon);
  };

  const handleSignInBtnClick = () => {
    navigate('/sign-in', {
      state: {
        ...state,
      },
    });
  };

  useEffect(() => {
    setAccumulationChangeInputValue(accumulationInputValue);
  }, [accumulationInputValue]);

  if (!isSignedIn)
    return (
      <section className="l-panel order-sheet__promotion">
        <p className="order-sheet__promotion-title">
          <span>혜택 적용</span>
        </p>
        <div className="order-sheet__promotion-items order-sheet__promotion-items--guest">
          <div>
            <p>비회원으로 주문하실 경우 할인 쿠폰 사용이 불가능하며,</p>
            <p>
              <em>적립금 적립 및 혜택을 이용하실 수 없습니다.</em>
            </p>
          </div>
          <Button className="order-sheet__sign-in-btn" label="회원 로그인" onClick={handleSignInBtnClick} />
        </div>
      </section>
    );

  return (
    <section className="l-panel order-sheet__promotion">
      <p className="order-sheet__promotion-title">혜택 적용</p>
      <div className="order-sheet__promotion-items">
        <div className="order-sheet__item">
          <span className="order-sheet__item-subject">쿠폰할인</span>
          <p className="order-sheet__promotion-input">
            <InputWithUnit unitLabel={currencyLabel} value={allCouponAmt} valid="NUMBER" showsComma={true} disabled />
            <Button label="쿠폰 사용" onClick={handleOpenCouponModalBtnClick} />
            {isCouponModalOpen && (
              <CouponModal
                initialCoupon={selectedCoupon}
                orderSheetNo={orderSheetNo}
                onClose={handleCouponModalCloseBtnClick}
                onApplyCouponBtnClick={handleCouponModalApplyCouponBtnClick}
              />
            )}
          </p>
        </div>
        <div className="order-sheet__item">
          <label htmlFor="accumulation-input" className="order-sheet__item-subject">
            적립금
          </label>
          <p className="order-sheet__promotion-input">
            <InputWithUnit
              id="accumulation-input"
              unitLabel={currencyLabel}
              onChange={handleAccumulationInputChange}
              value={accumulationChangeInputValue}
              valid="NUMBER"
              showsComma={true}
              onBlur={handleAccumulationInputBlur}
            />
            <Button label="모두 사용" onClick={handleUseAllAccumulationBtnClick} />
          </p>
        </div>
        <div className="order-sheet__accumulation-amt">
          <p>
            보유 적립금: {convertToKoreanCurrency(accumulationAmt)}
            {currencyLabel}
          </p>
          <p>
            사용가능한 적립금: {convertToKoreanCurrency(availableMaxAccumulationAmt)}
            {currencyLabel}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PromotionController;
