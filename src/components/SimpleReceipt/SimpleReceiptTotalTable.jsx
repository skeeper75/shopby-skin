import { object } from 'prop-types';

import { convertToKoreanCurrency } from '@shopby/shared/utils';

const SimpleReceiptTotalTable = ({ orderSimpleReceipt }) => (
  <div className="simple-receipt-content-total">
    <table>
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <tbody>
        <tr className="align-center">
          <td>주문일자</td>
          <td>공급대가총액</td>
          <td>비 고</td>
        </tr>
        <tr>
          <td className="align-center">{orderSimpleReceipt.orderYmd}</td>
          <td className="align-center">{convertToKoreanCurrency(orderSimpleReceipt.totalOrderAmount)}</td>
          <td className="align-center"></td>
        </tr>
        <tr className="align-center">
          <td colSpan="3">위 금액을 정히 영수( 청구 )함</td>
        </tr>
      </tbody>
    </table>
  </div>
);
export default SimpleReceiptTotalTable;

SimpleReceiptTotalTable.propTypes = {
  orderSimpleReceipt: object,
};
