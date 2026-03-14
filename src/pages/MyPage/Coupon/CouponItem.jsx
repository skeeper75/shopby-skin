import { object, bool, shape, string, number, oneOf } from 'prop-types';

import { VisibleComponent, CouponUseButton, useModalActionContext, Icon } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

const COUPON_TYPE_LABEL = {
  PRODUCT: '상품',
  CART: '주문',
  CART_DELIVERY: '장바구니 배송비',
  'CART:DELIVERY_DEFAULT': '배송비 금액',
  'CART:DELIVERY_ALL': '배송비 금액',
};

// 쿠폰 할인 정보
const getDiscountInfo = (coupon, { currencyLabel }) => {
  const limitSalePrice = coupon.minSalePrice;

  if (coupon.couponType === 'GIFT') {
    const benefitAmt = coupon.benefitAmt ?? '-';

    return {
      amount: benefitAmt,
      unit: coupon.accumulationUnit,
      maxAmount: benefitAmt,
      limitSalePrice: benefitAmt,
    };
  }

  if (coupon.discountRate) {
    return {
      amount: coupon.discountRate,
      unit: '%',
      maxAmount: coupon.maxDiscountAmt,
      limitSalePrice,
    };
  }

  return {
    amount: convertToKoreanCurrency(coupon.discountAmt),
    unit: currencyLabel,
    maxAmount: 0,
    limitSalePrice,
  };
};

const UseButton = ({ coupon }) => {
  const { openAlert } = useModalActionContext();

  return (
    <VisibleComponent
      shows={coupon.couponType === 'GIFT' && !coupon.used}
      TruthyComponent={
        <CouponUseButton
          couponIssueNo={coupon.couponIssueNo}
          onError={({ error }) => {
            openAlert({
              message: error.serverError.message,
            });
          }}
          onClick={() => {
            openAlert({
              message: '혜택 지급이 완료되었습니다.',
              onClose: () => {
                location.reload();
              },
            });
          }}
        />
      }
    />
  );
};

UseButton.propTypes = {
  coupon: shape(),
};

/* eslint-disable complexity */
const CouponItem = ({ coupon, unissuable, customElement = <></>, currencyLabel = '원' }) => {
  const { amount, unit, maxAmount, limitSalePrice } = getDiscountInfo(coupon, { currencyLabel });
  const couponTypeLabel =
    COUPON_TYPE_LABEL[`${coupon.couponType}:${coupon.couponSubType}`] ?? COUPON_TYPE_LABEL[coupon.couponType];
  const issueDate = coupon.issueYmdt?.slice(0, 10);
  const expireDate = coupon.expireYmdt?.slice(0, 10);

  return (
    <li
      className={`my-page-coupon__list-item my-page-coupon__list-item--${unissuable ? 'unissuable' : 'issuable'} ${
        coupon.issued && 'coupon__wrap--issued'
      }`}
    >
      {coupon.issued && (
        <div className="coupon__issued">
          <Icon name="check-white" />
          <p>발급완료</p>
        </div>
      )}
      <div className="my-page-coupon__box">
        <div className="my-page-coupon__box--left">
          <p className="my-page-coupon__discounted-price">
            <VisibleComponent
              shows={coupon.couponSubType === 'DELIVERY_DEFAULT' || coupon.couponSubType === 'DELIVERY_ALL'}
              TruthyComponent={<span>최대&nbsp;</span>}
            />
            {convertToKoreanCurrency(amount)}
            <span className="my-page-coupon__unit">{unit}</span>
            <span className="my-page-coupon__discount-label">
              {coupon.couponType === 'GIFT' ? '지급' : `${couponTypeLabel} 할인`}
            </span>
          </p>
          <div className="my-page-coupon__content">
            <p className="my-page-coupon__name">{coupon.couponName}</p>
            <VisibleComponent
              shows={maxAmount > 0 && coupon.couponType !== 'GIFT'}
              TruthyComponent={
                <p className="my-page-coupon__max-amount">
                  최대 {convertToKoreanCurrency(maxAmount)} {currencyLabel} 할인
                </p>
              }
            />
            <VisibleComponent
              shows={limitSalePrice > 0 && coupon.couponType !== 'GIFT'}
              TruthyComponent={
                <p className="my-page-coupon__limit-sale-price">
                  {convertToKoreanCurrency(limitSalePrice)} {currencyLabel} 이상 구매 시 사용가능
                </p>
              }
            />
            <VisibleComponent
              shows={coupon.couponType === 'GIFT'}
              TruthyComponent={<p className="my-page-coupon__limit-sale-price">유효기간 내 사용 시 혜택 지급</p>}
            />
            <VisibleComponent shows={!unissuable} TruthyComponent={<UseButton coupon={coupon} />} />
          </div>
          <p className="my-page-coupon__date">{issueDate ? `${issueDate} ~ ${expireDate}` : `${expireDate}`}</p>
        </div>
        <div className="my-page-coupon__box--right">
          <p>COUPON</p>
        </div>
        {customElement}
      </div>
    </li>
  );
};

export default CouponItem;

CouponItem.propTypes = {
  coupon: shape({
    couponName: string,
  }),
  unissuable: bool,
  discountRate: number,
  discountAmt: number,
  issueYmdt: string,
  expireYmdt: string,
  maxDiscountAmt: number,
  minSalePrice: number,
  couponType: oneOf(['PRODUCT', 'CART', 'CART_DELIVERY']),
  customElement: object,
  currencyLabel: string,
};
