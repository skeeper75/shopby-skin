import { useEffect } from 'react';

import { string } from 'prop-types';

import {
  useMyOrderStateContext,
  useMyOrderActionContext,
  useOrderConfigStateContext,
  useOrderConfigActionContext,
} from '@shopby/react-components';

import SimpleReceiptInfoTable from './SimpleReceiptInfoTable';
import SimpleReceiptSummaryTable from './SimpleReceiptSummaryTable';
import SimpleReceiptTotalTable from './SimpleReceiptTotalTable';

const SimpleReceiptDetail = ({ orderNo }) => {
  const { orderSimpleReceipt } = useMyOrderStateContext();
  const { fetchProfileOrdersSimpleReceiptByOrderNo } = useMyOrderActionContext();
  const { orderConfig } = useOrderConfigStateContext();
  const { fetchOrderConfig } = useOrderConfigActionContext();

  useEffect(() => {
    if (!orderNo) {
      return;
    }

    fetchProfileOrdersSimpleReceiptByOrderNo({ orderNo });
  }, [orderNo]);

  useEffect(() => {
    fetchOrderConfig({
      cacheOption: {
        type: 'MEMORY',
        timeBySeconds: 180,
      },
    });
  }, []);

  if (!orderNo) {
    return <></>;
  }

  return (
    <div className="simple-receipt-content">
      <div className="simple-receipt-content-top">
        <SimpleReceiptInfoTable orderSimpleReceipt={orderSimpleReceipt} orderConfig={orderConfig} />
        <SimpleReceiptTotalTable orderSimpleReceipt={orderSimpleReceipt} orderConfig={orderConfig} />
        <SimpleReceiptSummaryTable orderSimpleReceipt={orderSimpleReceipt} orderConfig={orderConfig} />
      </div>
    </div>
  );
};

export default SimpleReceiptDetail;

SimpleReceiptDetail.propTypes = {
  orderNo: string,
};
