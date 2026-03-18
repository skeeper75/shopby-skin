import { number, string, array, object } from 'prop-types';

import { convertToKoreanCurrency, PG_TYPES_MAP } from '@shopby/shared';

import ClaimOrderOptionLabel from './ClaimOrderOptionLabel';

const ClaimDetailRefundInfo = ({
  claimClassType,
  refundOrderOptions,
  refundProductTotalAmt,
  refundDeliveryAmt,
  subtractionTotalAmt,
  refundSubPayAmt,
  refundMainPayAmt,
  refundTypeLabel,
  cardInfo,
  payType,
}) => (
  <section className="l-panel">
    <p className="order-detail__section-title">환불 정보</p>
    <dl className="order-detail__section-content">
      {claimClassType !== 'ORDER_CANCEL' && (
        <>
          <dt>환불 상품</dt>
          <dd>
            {refundOrderOptions.map((refundOrderOption, idx) => (
              <ClaimOrderOptionLabel key={idx} claimOrderOption={refundOrderOption} />
            ))}
          </dd>
        </>
      )}
      <dt>환불 상품 금액</dt>
      <dd>{convertToKoreanCurrency(refundProductTotalAmt)}원</dd>
      <dt>환불 배송비</dt>
      <dd>{convertToKoreanCurrency(refundDeliveryAmt)}원</dd>
      <dt>환불 차감 금액</dt>
      <dd>{convertToKoreanCurrency(subtractionTotalAmt)}원</dd>
      <dt>환불 적립금</dt>
      <dd>{convertToKoreanCurrency(refundSubPayAmt)}원</dd>
      <dt>환불 금액</dt>
      <dd>{convertToKoreanCurrency(refundMainPayAmt)}원</dd>
      <dt>환불 수단</dt>
      <dd>
        {refundTypeLabel}
        {payType === PG_TYPES_MAP.APP_CARD && (
          <div className="app-card-payment">
            {cardInfo?.cardName}/{cardInfo?.installmentPeriodLabel}
          </div>
        )}
      </dd>
    </dl>
  </section>
);

export default ClaimDetailRefundInfo;

ClaimDetailRefundInfo.propTypes = {
  claimClassType: string,
  refundOrderOptions: array,
  refundProductTotalAmt: number,
  refundDeliveryAmt: number,
  subtractionTotalAmt: number,
  refundSubPayAmt: number,
  refundMainPayAmt: number,
  refundTypeLabel: string,
  cardInfo: object,
  payType: string,
};
