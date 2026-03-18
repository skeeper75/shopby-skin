import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

import {
  OrderConfirmProvider,
  useOrderConfirmStateContext,
  CashReceiptProvider,
  MyOrderProvider,
  useOrderConfigStateContext,
} from '@shopby/react-components';

import OrderFail from './OrderFail';
import OrderSuccess from './OrderSuccess';

const OrderConfirmContent = () => {
  const { orderInfo, orderNo, message, isSuccess } = useOrderConfirmStateContext();
  const { orderConfig } = useOrderConfigStateContext();

  useEffect(() => {
    if (!isMobile && opener) {
      opener.location.href = self.location.href;
      setTimeout(() => {
        self.close();
      }, 500);
    }
  }, []);

  if (!isSuccess) {
    return <OrderFail message={message} />;
  }

  if (!orderInfo) return <></>;

  return <OrderSuccess orderInfo={orderInfo} orderNo={orderNo} orderConfig={orderConfig} />;
};

const OrderConfirm = () => (
  <OrderConfirmProvider>
    <MyOrderProvider>
      <CashReceiptProvider>
        <OrderConfirmContent />
      </CashReceiptProvider>
    </MyOrderProvider>
  </OrderConfirmProvider>
);

export default OrderConfirm;
