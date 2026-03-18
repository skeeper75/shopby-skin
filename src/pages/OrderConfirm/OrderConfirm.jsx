import { useEffect } from 'react';

import {
  OrderConfirmProvider,
  useOrderConfirmStateContext,
  CashReceiptProvider,
  MyOrderProvider,
  useOrderConfigStateContext,
} from '@shopby/react-components';

import { PageShell } from '../../components/Layout';

import useResponsive from '../../hooks/useResponsive';

import OrderFail from './OrderFail';
import OrderSuccess from './OrderSuccess';

const OrderConfirmContent = () => {
  const { orderInfo, orderNo, message, isSuccess } = useOrderConfirmStateContext();
  const { orderConfig } = useOrderConfigStateContext();
  const { isMobile } = useResponsive();

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
  <PageShell maxWidth="5xl">
    <OrderConfirmProvider>
      <MyOrderProvider>
        <CashReceiptProvider>
          <OrderConfirmContent />
        </CashReceiptProvider>
      </MyOrderProvider>
    </OrderConfirmProvider>
  </PageShell>
);

export default OrderConfirm;
