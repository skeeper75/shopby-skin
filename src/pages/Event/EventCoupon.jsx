import { useNavigate } from 'react-router-dom';

import { oneOf, bool, number, string, shape, arrayOf } from 'prop-types';

import {
  useCouponByProductActionContext,
  useEventActionContextV2,
  useModalActionContext,
} from '@shopby/react-components';
import { CLIENT_ERROR, CLIENT_ERROR_MESSAGE, getUrlWithAdditionalSearchParams, isSignedIn } from '@shopby/shared';

import CouponItem from '../MyPage/Coupon/CouponItem';

const EventCoupon = ({ coupons, channelType }) => {
  const navigate = useNavigate();

  const { updateCoupons } = useEventActionContextV2();
  const { downloadCouponByCouponNo } = useCouponByProductActionContext();
  const { openAlert } = useModalActionContext();

  const handleCouponDownload = async (couponNo) => {
    if (!isSignedIn()) {
      openAlert({
        message: CLIENT_ERROR_MESSAGE[CLIENT_ERROR.NO_AUTHORIZATION],
        onClose: () => {
          navigate('/sign-in');
        },
      });
    }

    const { data } = await downloadCouponByCouponNo({ couponNo, channelType });

    if (data?.couponNo === couponNo) {
      updateCoupons(
        coupons.map((coupon) => ({
          ...coupon,
          issued: coupon.couponNo === couponNo,
        }))
      );

      openAlert({
        message: '쿠폰이 발급되었습니다.',
      });
    }
  };

  return (
    <article className="event-coupon-list">
      <ul>
        {coupons.map((item) =>
          item.imageUrl ? (
            <li key={item.couponNo}>
              <button
                onClick={() => {
                  handleCouponDownload(item.couponNo);
                }}
              >
                <img
                  src={getUrlWithAdditionalSearchParams({
                    url: item.imageUrl,
                    additionalSearchParams: '460x460',
                  })}
                  alt={item.couponName}
                />
              </button>
            </li>
          ) : (
            <CouponItem
              key={item.couponNo}
              coupon={{
                minSalePrice: item.useConstraint.minSalePrice,
                discountRate: item.discountInfo.discountRate,
                maxAmount: item.discountInfo.maxDiscountAmt,
                discountAmt: item.discountInfo.discountAmt,
                limitSalePrice: '',
                couponType: item.couponType.couponType,
                issueYmdt: item.dateInfo.issueStartYmdt,
                expireYmdt: item.dateInfo.issueEndYmdt,
                couponName: item.couponName,
                ...item,
              }}
              customElement={
                <button
                  className="event-coupon-download"
                  onClick={() => {
                    handleCouponDownload(item.couponNo);
                  }}
                ></button>
              }
            />
          )
        )}
      </ul>
    </article>
  );
};

export default EventCoupon;

EventCoupon.propTypes = {
  channelType: string,
  coupons: arrayOf(
    shape({
      couponNo: number,
      couponName: string,
      couponType: oneOf(['PRODUCT', 'CART', 'CART_DELIVERY']),
      couponTargetType: oneOf(['ALL_PRODUCT', 'PRODUCT', 'BRAND', 'CATEGORY', 'PARTNER', 'EVENT']),
      allianceRefererType: oneOf(['DIRECT', 'NAVER_KNOWLEDGE_SHOPPING']),
      downloadable: bool,
      imageUrl: string,
      discountInfo: shape({
        fixedAmt: bool,
        discountAmt: number,
        discountRate: number,
        maxDiscountAmt: number,
        freeDelivery: bool,
        useOtherCoupon: bool,
        skippedAccumulationAmt: bool,
      }),
      dateInfo: shape({
        issueStartYmdt: string,
        issueEndYmdt: string,
        issueStartHour: number,
        issueEndHour: number,
        issueDaysOfWeek: string,
      }),
      couponStatus: shape({
        totalIssuableCnt: number,
        totalIssuedCnt: number,
        totalIssuedCntToday: number,
        issuableCnt: number,
        myIssuedCnt: number,
        myIssuedCntToday: number,
      }),
    })
  ),
};
