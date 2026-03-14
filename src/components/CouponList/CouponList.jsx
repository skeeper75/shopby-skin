import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { debounce } from 'lodash-es';
import { bool, string } from 'prop-types';

import {
  Coupon,
  useCouponByProductStateContext,
  useCouponByProductActionContext,
  VisibleComponent,
  Icon,
  useModalActionContext,
  useCurrencyStateContext,
} from '@shopby/react-components';
import { CLIENT_ERROR, convertToKoreanCurrency } from '@shopby/shared';

import { COUPON_DOWNLOAD_BUTTON_DEBOUNCE_TIME } from '../../constants/debounceTime';

const COUPON_TYPE_LABEL = {
  PRODUCT: '상품',
  CART: '주문',
  CART_DELIVERY: '장바구니 배송비',
  'CART:DELIVERY_DEFAULT': '배송비 금액',
  'CART:DELIVERY_ALL': '배송비 금액',
};

// 쿠폰 할인 정보
const getDiscountInfo = (coupon, { currencyLabel }) => {
  const limitSalePrice = coupon.useConstraint.minSalePrice;

  if (coupon.discountInfo.discountRate) {
    return {
      amount: coupon.discountInfo.discountRate,
      unit: '%',
      maxAmount: coupon.discountInfo.maxDiscountAmt,
      limitSalePrice,
    };
  }

  return {
    amount: convertToKoreanCurrency(coupon.discountInfo.discountAmt),
    unit: currencyLabel,
    maxAmount: 0,
    limitSalePrice,
  };
};

const IssuedCoupon = () => (
  <div className="coupon__issued">
    <Icon name="check-white" />
    <p>발급완료</p>
  </div>
);

const EmptyCoupons = () => (
  <div className="empty-list">
    <p>등록된 쿠폰이 없습니다.</p>
  </div>
);

/* eslint-disable complexity */
const Coupons = ({ allIssued, channelType }) => {
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();
  const { coupons } = useCouponByProductStateContext();
  const { downloadCouponByCouponNo, fetchIssuableCouponsByProductNo } = useCouponByProductActionContext();
  const { openAlert } = useModalActionContext();
  const navigate = useNavigate();

  const [shouldPreventDoubleDownload, setShouldPreventDoubleDownload] = useState(false);
  const [issuedCouponNos, setIssuedCouponNos] = useState([]);

  if (!coupons.length) return <EmptyCoupons />;

  const downloadableCoupons = useMemo(() => coupons.filter(({ downloadable }) => downloadable), [coupons]);

  const fetchCoupons = () => {
    setShouldPreventDoubleDownload(false);

    fetchIssuableCouponsByProductNo({
      channelType,
    });
  };

  const handleDownloadCoupon = debounce(
    useCallback(({ couponNo }) => {
      (async () => {
        if (shouldPreventDoubleDownload) return;

        setShouldPreventDoubleDownload(true);

        try {
          await downloadCouponByCouponNo({
            couponNo,
            channelType,
          });

          setIssuedCouponNos((prev) => [...prev, couponNo]);

          fetchCoupons();
        } catch (e) {
          const message = e?.error?.serverError?.message;
          const replaceUrl = {
            [CLIENT_ERROR.EXPIRED_REFRESH_TOKEN]: `/sign-in`,
          }[e?.error?.code];

          if (message) {
            await openAlert({
              message,
              onClose: () => {
                if (replaceUrl) {
                  navigate(replaceUrl, {
                    replace: true,
                    state: {
                      from: `${location.pathname}${location.search}`,
                    },
                  });
                }
              },
            });
          }

          fetchCoupons();
        }
      })();
    }, []),
    COUPON_DOWNLOAD_BUTTON_DEBOUNCE_TIME
  );

  return (
    <ul className="coupons">
      {downloadableCoupons.map((coupon) => {
        const { amount, unit, maxAmount, limitSalePrice } = getDiscountInfo(coupon, { currencyLabel });
        const hasBeenIssued = allIssued ? allIssued : issuedCouponNos.includes(coupon.couponNo);
        const modifier = hasBeenIssued ? 'issued' : '';

        const couponTypeLabel =
          COUPON_TYPE_LABEL[`${coupon.couponType}:${coupon.couponSubType}`] ?? COUPON_TYPE_LABEL[coupon.couponType];

        return (
          <li className={`coupon__wrap${modifier ? ` coupon__wrap--${modifier}` : ''}`} key={coupon.couponNo}>
            <Coupon
              couponName={coupon.couponName}
              DiscountComponent={
                <p className="coupon__discount-information">
                  <VisibleComponent
                    shows={coupon.couponSubType === 'DELIVERY_DEFAULT' || coupon.couponSubType === 'DELIVERY_ALL'}
                    TruthyComponent={<span>최대&nbsp;</span>}
                  />
                  <span className="coupon__discount-amount">
                    {amount} {unit}
                  </span>
                  <span className="coupon__discount-label">{couponTypeLabel} 할인</span>
                </p>
              }
              disabled={!coupon.downloadable || shouldPreventDoubleDownload}
              onDownloadCoupon={() => !shouldPreventDoubleDownload && handleDownloadCoupon(coupon)}
            >
              <VisibleComponent shows={!!modifier} TruthyComponent={<IssuedCoupon />} />
              <VisibleComponent
                shows={maxAmount > 0}
                TruthyComponent={
                  <p>
                    최대 {convertToKoreanCurrency(maxAmount)} {currencyLabel} 할인
                  </p>
                }
              />
              <VisibleComponent
                shows={limitSalePrice > 0}
                TruthyComponent={
                  <p>
                    {convertToKoreanCurrency(limitSalePrice)} {currencyLabel} 이상 구매 시 사용가능
                  </p>
                }
              />
            </Coupon>
          </li>
        );
      })}
    </ul>
  );
};

export default Coupons;

Coupons.propTypes = {
  allIssued: bool,
  channelType: string,
};
