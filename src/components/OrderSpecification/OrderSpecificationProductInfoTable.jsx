import { object } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared/utils';

import Sanitized from '../Sanitized';

const MIN_TABLE_ROW = 5;
const createEmptyRow = (num) => Array.from({ length: num }, () => '');

const EmptyTableRow = ({ orderSpecifications, orderConfig }) => {
  const { totalOrderCount = 0, deliveryAmt = 0, totalCouponDiscountAmount = 0, subPayAmt = 0 } = orderSpecifications;

  const deliveryRow = deliveryAmt > 0 ? 1 : 0;
  const discountRow = totalCouponDiscountAmount > 0 ? 1 : 0;
  const accumulationRow = subPayAmt > 0 ? 1 : 0;

  const rowCount = totalOrderCount + deliveryRow + discountRow + accumulationRow;
  const emptyCnt = rowCount < MIN_TABLE_ROW ? MIN_TABLE_ROW - rowCount : 1;

  return (
    <>
      <tr>
        <td></td>
        <td></td>
        {orderConfig?.visibleProductNo && <td></td>}
        <td>== 이하여백 ==</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>

      {createEmptyRow(emptyCnt).map((_, idx) => (
        <tr key={idx}>
          <td>&nbsp;</td>
          <td></td>
          {orderConfig?.visibleProductNo && <td></td>}
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      ))}
    </>
  );
};

EmptyTableRow.propTypes = {
  orderSpecifications: object,
  orderConfig: object,
};

const OrderSpecificationProductInfoTable = ({ orderSpecifications, orderConfig }) => {
  const totalDiscountAmt = orderSpecifications.totalCouponDiscountAmount + orderSpecifications.additionalDiscountAmt;

  return (
    <div className="order-specification-content-bottom">
      <p className="number"></p>
      <table className="order-specification-info">
        <colgroup>
          <col width="50px" />
          <col width="20%" />
          {orderConfig?.visibleProductNo && <col width="10%" />}
          <col />
          <col width="10%" />
          <col width="5%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th>순번</th>
            <th>주문번호</th>
            {orderConfig?.visibleProductNo && <th>상품번호 (옵션/상품관리코드)</th>}
            <th>상품/품목명</th>
            <th>단 가</th>
            <th>수 량</th>
            <th>금 액</th>
          </tr>
        </thead>
        <tbody>
          {orderSpecifications.orderOptions?.map((orderOption, idx) => (
            <tr key={`${orderOption.orderNo}_${idx}`}>
              <td>{idx + 1}</td>
              <td>{orderOption.orderNo}</td>

              <VisibleComponent
                shows={orderConfig?.visibleProductNo}
                TruthyComponent={
                  <td>
                    {orderOption.mallProductNo}
                    {orderOption.optionManagementCd ? orderOption.optionManagementCd : orderOption.productManagementCd}
                  </td>
                }
              />
              <td>
                <div className="order-specification-info__product-name-wrapper">
                  <VisibleComponent
                    shows={orderOption.isFreeGift}
                    TruthyComponent={<span className="badge badge--round free-gift">사은품</span>}
                  />
                  <VisibleComponent
                    shows={orderOption.claimStatusTypeLabel}
                    TruthyComponent={
                      <span className="order-specification-info__claim-status-type-label">
                        {orderOption.claimStatusTypeLabel}
                      </span>
                    }
                  />
                  <Sanitized
                    html={orderOption.unescapedProductName}
                    className="order-specification-info__product-name"
                  />
                </div>
                {orderOption.usesOption ? `${orderOption.optionName}:${orderOption.optionValue}` : ''}
              </td>
              <td className="align-right">
                {orderOption.isFreeGift ? 0 : convertToKoreanCurrency(orderOption.immediateDiscountedPrice ?? 0)}
              </td>
              <td>{convertToKoreanCurrency(orderOption.orderCnt ?? 0)}</td>
              <td className="align-right">
                {orderOption.isFreeGift
                  ? 0
                  : convertToKoreanCurrency(orderOption.immediateDiscountedPrice * (orderOption.orderCnt ?? 0))}
              </td>
            </tr>
          ))}

          <VisibleComponent
            shows={orderConfig?.visibleDeliveryAmt}
            TruthyComponent={
              <tr>
                <td>-</td>
                <td>-</td>
                {orderConfig?.visibleProductNo && <td>-</td>}
                <td>배송비 합계</td>
                <td className="align-right">{convertToKoreanCurrency(orderSpecifications.deliveryAmt ?? 0)}</td>
                <td>-</td>
                <td className="align-right">{convertToKoreanCurrency(orderSpecifications.deliveryAmt ?? 0)}</td>
              </tr>
            }
          />

          <VisibleComponent
            shows={orderConfig?.visibleDiscountAmt}
            TruthyComponent={
              <tr>
                <td>-</td>
                <td>-</td>
                {orderConfig?.visibleProductNo && <td>-</td>}
                <td>총 할인 금액</td>
                <td className="align-right">{convertToKoreanCurrency(totalDiscountAmt ?? 0)}</td>
                <td>-</td>
                <td className="align-right">{convertToKoreanCurrency(totalDiscountAmt ?? 0)}</td>
              </tr>
            }
          />

          {orderSpecifications.externalPayInfo?.map((payInfo, idx) => {
            if (!payInfo.payAmt) {
              return null;
            }

            return (
              <tr key={`${payInfo.authKey}_${idx}`}>
                <td>-</td>
                <td>-</td>
                {orderConfig?.visibleProductNo && <td>-</td>}
                <td>{payInfo.externalPayName}</td>
                <td className="align-right">- {convertToKoreanCurrency(payInfo.payAmt ?? 0)}</td>
                <td>-</td>
                <td className="align-right">- {convertToKoreanCurrency(payInfo.payAmt ?? 0)}</td>
              </tr>
            );
          })}

          <VisibleComponent
            shows={orderConfig?.visibleSubPayAmt}
            TruthyComponent={
              <tr>
                <td>-</td>
                <td>-</td>
                {orderConfig?.visibleProductNo && <td>-</td>}
                <td>적립금</td>
                <td className="align-right">- {convertToKoreanCurrency(orderSpecifications.subPayAmt ?? 0)}</td>
                <td>-</td>
                <td className="align-right">- {convertToKoreanCurrency(orderSpecifications.subPayAmt ?? 0)}</td>
              </tr>
            }
          />

          <EmptyTableRow orderSpecifications={orderSpecifications} orderConfig={orderConfig} />

          <tr className="total">
            <td colSpan={orderConfig?.totalVisibleSpanCount}>합계</td>
            <td>{convertToKoreanCurrency(orderSpecifications.totalOrderCount ?? 0)}</td>
            <td className="align-right">{convertToKoreanCurrency(orderSpecifications.totalOrderAmount ?? 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderSpecificationProductInfoTable;

OrderSpecificationProductInfoTable.propTypes = {
  orderSpecifications: object,
  orderConfig: object,
};
