import { useMemo } from 'react';

import { useOrderSheetStateContext, useCurrencyStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import PriceTag from '../../components/PriceTag';

const PaymentInfo = () => {
  const {
    orderSheet,
    paymentInfo: {
      paymentAmt,
      totalStandardAmt,
      productCouponAmt,
      cartCouponAmt,
      deliveryAmt,
      usedAccumulationAmt,
      remoteDeliveryAmt,
      totalAdditionalDiscountAmt,
      totalImmediateDiscountAmt,
      deliveryCouponAmt,
    },
  } = useOrderSheetStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  const totalDiscountAmt = useMemo(
    () => productCouponAmt + cartCouponAmt + totalAdditionalDiscountAmt + totalImmediateDiscountAmt - deliveryCouponAmt,
    [productCouponAmt, cartCouponAmt, totalAdditionalDiscountAmt, totalImmediateDiscountAmt, deliveryCouponAmt]
  );
  const totalDeliveryAmt = useMemo(() => deliveryAmt + remoteDeliveryAmt, [deliveryAmt, remoteDeliveryAmt]);

  const finalAmount = useMemo(
    () => ({
      name: '최종 결제금액',
      amountLabel: convertToKoreanCurrency(paymentAmt),
    }),
    [paymentAmt]
  );

  const details = useMemo(
    () => [
      {
        name: '상품금액 합계',
        amountLabel: convertToKoreanCurrency(totalStandardAmt),
      },
      {
        name: '할인금액 합계',
        amountLabel: `- ${convertToKoreanCurrency(totalDiscountAmt)}`,
      },
      {
        name: '적립금 사용 금액 합계',
        amountLabel: `- ${convertToKoreanCurrency(usedAccumulationAmt)}`,
      },
      {
        name: '배송비 합계',
        amountLabel: `+ ${convertToKoreanCurrency(totalDeliveryAmt)}`,
      },
      {
        name: '배송비 할인 금액',
        amountLabel: `- ${convertToKoreanCurrency(deliveryCouponAmt)}`,
      },
    ],
    [totalStandardAmt, totalDiscountAmt, usedAccumulationAmt, totalDeliveryAmt, deliveryCouponAmt]
  );

  const numberOfCOD = useMemo(
    () =>
      orderSheet?.deliveryGroups.reduce(
        (acc, { deliveryPayType }) => (deliveryPayType === 'PAY_ON_DELIVERY' ? acc + 1 : acc),
        0
      ) ?? 0,
    [orderSheet]
  );

  return (
    <section className="l-panel order-sheet__payment-info">
      {/* 인쇄 전액 결제 안내 - 인쇄 주문은 선불 전액 결제만 가능 */}
      <div className="mb-3 flex items-start gap-2 bg-[#F6F6F6] rounded-[5px] px-3 py-2.5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5538B6"
          strokeWidth="2"
          className="mt-0.5 shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs text-[#424242] tracking-[-0.05em] leading-relaxed">
          인쇄 상품은 <strong className="text-[#5538B6]">선불 전액 결제</strong>로 진행됩니다.
          주문 확인 후 제작이 시작되므로 취소/환불 시 별도 규정이 적용됩니다.
        </p>
      </div>

      <PriceTag finalAmount={finalAmount} details={details} isUpsideDown={true} currencyLabel={currencyLabel}>
        {numberOfCOD !== 0 && (
          <dl className="order-sheet__number-of-COD">
            <dt>- 착불 배송</dt>
            <dd>{numberOfCOD} 건</dd>
          </dl>
        )}
      </PriceTag>
    </section>
  );
};

export default PaymentInfo;
