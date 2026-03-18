import { object } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared/utils';

import Sanitized from '../Sanitized';

const SimpleReceiptSummaryTable = ({ orderSimpleReceipt }) => (
  <div className="simple-receipt-content-bottom">
    <table className="simple-receipt-content-bottom__order-options-table">
      <colgroup>
        <col width="10%" />
        <col />
        <col width="10%" />
        <col width="15%" />
        <col width="15%" />
      </colgroup>
      <tbody>
        <tr className="align-center">
          <td>NO</td>
          <td>품 목</td>
          <td>수량</td>
          <td>단가</td>
          <td>금액</td>
        </tr>
        {orderSimpleReceipt.orderOptions?.map((orderOption, idx) => (
          <tr key={`${orderOption.orderNo}_${idx}`}>
            <td className="align-center">{idx + 1}</td>
            <td className="align-center">
              <div className="simple-receipt-content-bottom__product-name-wrapper">
                {orderOption.isFreeGift && <span className="badge badge--round free-gift">사은품</span>}
                <VisibleComponent
                  shows={orderOption.claimStatusTypeLabel}
                  TruthyComponent={
                    <span className="simple-receipt-content-bottom__claim-status-type-label">
                      {orderOption.claimStatusTypeLabel}
                    </span>
                  }
                />
                <Sanitized
                  html={orderOption.unescapedProductName}
                  className="simple-receipt-content-bottom__product-name"
                />
              </div>
              {orderOption.usesOption ? `${orderOption.optionName}:${orderOption.optionValue}` : ''}
            </td>
            <td className="align-center">{convertToKoreanCurrency(orderOption.orderCnt)}</td>
            <td className="align-center">
              {orderOption.isFreeGift ? 0 : convertToKoreanCurrency(orderOption.immediateDiscountedPrice)}
            </td>
            <td className="align-center">
              {orderOption.isFreeGift
                ? 0
                : convertToKoreanCurrency(orderOption.immediateDiscountedPrice * orderOption.orderCnt)}
            </td>
          </tr>
        ))}

        <tr>
          <td className="align-center">-</td>
          <td className="align-center">배송비 합계</td>
          <td className="align-center">-</td>
          <td className="align-center">{convertToKoreanCurrency(orderSimpleReceipt.deliveryAmt)}</td>
          <td className="align-center">{convertToKoreanCurrency(orderSimpleReceipt.deliveryAmt)}</td>
        </tr>

        <tr>
          <td className="align-center">-</td>
          <td className="align-center">총 할인금액</td>
          <td className="align-center">-</td>
          <td className="align-center">- {convertToKoreanCurrency(orderSimpleReceipt.additionalDiscountAmt)}</td>
          <td className="align-center">- {convertToKoreanCurrency(orderSimpleReceipt.additionalDiscountAmt)}</td>
        </tr>

        <tr>
          <td className="align-center">-</td>
          <td className="align-center">쿠폰할인</td>
          <td className="align-center">-</td>
          <td className="align-center">- {convertToKoreanCurrency(orderSimpleReceipt.totalCouponDiscountAmount)}</td>
          <td className="align-center">- {convertToKoreanCurrency(orderSimpleReceipt.totalCouponDiscountAmount)}</td>
        </tr>

        {orderSimpleReceipt.externalPayInfo?.map((payInfo, idx) => {
          if (!payInfo.payAmt) {
            return null;
          }

          return (
            <tr key={`${payInfo.externalPayKey}_${idx}`}>
              <td className="align-center">-</td>
              <td className="align-center">{payInfo.externalPayName}</td>
              <td className="align-center">-</td>
              <td className="align-center">- {convertToKoreanCurrency(payInfo.payAmt)}</td>
              <td className="align-center">- {convertToKoreanCurrency(payInfo.payAmt)}</td>
            </tr>
          );
        })}

        <tr>
          <td className="align-center">-</td>
          <td className="align-center">적립금</td>
          <td className="align-center">-</td>
          <td className="align-center">- {convertToKoreanCurrency(orderSimpleReceipt.payAmt)}</td>
          <td className="align-center">- {convertToKoreanCurrency(orderSimpleReceipt.payAmt)}</td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
        <tr className="align-center">
          <td colSpan="6">
            <p className="terms">부가가치세법시행규칙 제25조 규정에 의한 ( 영수증 )으로 개정.</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default SimpleReceiptSummaryTable;

SimpleReceiptSummaryTable.propTypes = {
  orderSimpleReceipt: object,
};
