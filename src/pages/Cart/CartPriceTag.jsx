import { useCartStateContext, useCurrencyStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import PriceTag from '../../components/PriceTag';

// @MX:NOTE: [AUTO] 장바구니 가격 요약 - 소계/배송비/할인/총액 분기 표시 추가
const CartPriceTag = () => {
  const { paymentInfo } = useCartStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  const paymentDetails = [
    {
      name: '상품금액 합계',
      amountLabel: convertToKoreanCurrency(paymentInfo.standardAmt),
    },
    {
      name: '할인금액 합계',
      amountLabel: `- ${convertToKoreanCurrency(paymentInfo.discountAmt)}`,
    },
    {
      name: '배송비 합계',
      amountLabel: paymentInfo.totalPrePaidDeliveryAmt === 0
        ? '무료'
        : `+ ${convertToKoreanCurrency(paymentInfo.totalPrePaidDeliveryAmt)}`,
    },
  ];

  const hasDiscount = paymentInfo.discountAmt > 0;
  const hasFreeShipping = paymentInfo.totalPrePaidDeliveryAmt === 0;

  return (
    <>
      <PriceTag
        finalAmount={{
          name: '총 결제금액',
          amountLabel: convertToKoreanCurrency(paymentInfo.totalAmt),
        }}
        details={paymentDetails}
        currencyLabel={currencyLabel}
      >
        {/* 적립금 */}
        <span className="cart__mileage">
          예상적립&nbsp;<em>{convertToKoreanCurrency(paymentInfo.accumulationAmtWhenBuyConfirm)}</em>&nbsp;M
        </span>

        {/* 혜택 배지 */}
        {(hasDiscount || hasFreeShipping) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hasDiscount && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#EF4444] text-white">
                {convertToKoreanCurrency(paymentInfo.discountAmt)} 할인 적용
              </span>
            )}
            {hasFreeShipping && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#22C55E] text-white">
                무료 배송
              </span>
            )}
          </div>
        )}
      </PriceTag>
    </>
  );
};

export default CartPriceTag;
