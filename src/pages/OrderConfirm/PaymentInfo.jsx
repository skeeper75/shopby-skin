import { useOrderConfirmStateContext, useCurrencyStateContext } from '@shopby/react-components';

import OrderDetailPaymentInfo from '../../components/OrderDetailPaymentInfo';

const PaymentInfo = () => {
  const {
    orderInfo: {
      payTypeLabel,
      payType,
      payInfo: { bankInfo, cardInfo },
      lastOrderAmount: {
        standardAmt,
        deliveryAmt,
        remoteDeliveryAmt,
        cartCouponDiscountAmt,
        productCouponDiscountAmt,
        additionalDiscountAmt,
        immediateDiscountAmt,
        subPayAmt,
        chargeAmt,
      },
      accumulationAmtWhenBuyConfirm,
    },
  } = useOrderConfirmStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  const totalDeliveryAmt = deliveryAmt + remoteDeliveryAmt;
  const totalDiscountAmt =
    cartCouponDiscountAmt + productCouponDiscountAmt + additionalDiscountAmt + immediateDiscountAmt;

  return (
    <OrderDetailPaymentInfo
      payType={payType}
      payTypeLabel={payTypeLabel}
      bankName={bankInfo?.bankName}
      bankAccount={bankInfo?.account}
      bankDepositorName={bankInfo?.depositorName}
      bankAmt={bankInfo?.bankAmt}
      remitterName={bankInfo?.remitterName}
      paymentExpirationYmdt={bankInfo?.paymentExpirationYmdt}
      totalStandardAmt={standardAmt}
      totalDeliveryAmt={totalDeliveryAmt}
      totalDiscountAmt={totalDiscountAmt}
      subPayAmt={subPayAmt}
      chargeAmt={chargeAmt}
      accumulationAmtWhenBuyConfirm={accumulationAmtWhenBuyConfirm}
      cardInfo={cardInfo}
      currencyLabel={currencyLabel}
    />
  );
};

export default PaymentInfo;
