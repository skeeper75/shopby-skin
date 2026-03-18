import { useEffect, useMemo } from 'react';

import { string, bool } from 'prop-types';

import {
  useMyOrderStateContext,
  useMyOrderActionContext,
  useOrderConfigStateContext,
  useOrderConfigActionContext,
} from '@shopby/react-components';

import OrderSpecificationOrderInfoTable from './OrderSpecificationOrderInfoTable';
import OrderSpecificationProductInfoTable from './OrderSpecificationProductInfoTable';

const MAX_TOTAL_VISIBLE_SPAN_COUNT = 5;

const OrderSpecificationDetail = ({ orderNo, isPrint }) => {
  const { orderSpecifications } = useMyOrderStateContext();
  const { fetchProfileOrdersSpecificationsByOrderNo } = useMyOrderActionContext();
  const { orderConfig: _orderConfig } = useOrderConfigStateContext();
  const { fetchOrderConfig } = useOrderConfigActionContext();

  const orderConfig = useMemo(() => {
    if (!_orderConfig) {
      return {};
    }

    const visibleProductNo = _orderConfig?.shopSpecificationFields?.includes('PRODUCT_NO'); // 상품번호
    const visibleDeliveryAmt = _orderConfig?.shopSpecificationFields?.includes('DELIVERY_AMT'); // 총 배송비
    const visibleDiscountAmt = _orderConfig?.shopSpecificationFields?.includes('DISCOUNT_AMT'); // 총 할인금액
    const visibleSubPayAmt = _orderConfig?.shopSpecificationFields?.includes('SUB_PAY_AMT'); // 적립금

    const totalVisibleSpanCount = MAX_TOTAL_VISIBLE_SPAN_COUNT - (visibleProductNo ? 0 : 1);

    return {
      ..._orderConfig,
      visibleProductNo,
      visibleDeliveryAmt,
      visibleDiscountAmt,
      visibleSubPayAmt,
      totalVisibleSpanCount,
    };
  }, [_orderConfig]);

  useEffect(() => {
    if (!orderNo) {
      return;
    }

    fetchProfileOrdersSpecificationsByOrderNo({ orderNo });
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
    <div className="order-specification-content">
      {!isPrint && (
        <p className="order-specification-notice">
          ※ 거래명세서 출력 시점에 취소, 교환, 반품, 환불이 진행중인 상품은 출력되지 않습니다.
        </p>
      )}
      <p className="order-specification-title">거래명세서</p>
      <OrderSpecificationOrderInfoTable orderSpecifications={orderSpecifications} orderConfig={orderConfig} />
      <OrderSpecificationProductInfoTable orderSpecifications={orderSpecifications} orderConfig={orderConfig} />

      <div className="order-specification-bottom-notice">
        <p className="order-specification-bottom-notice-text">
          본 영수증은 구매내역 확인용으로 사용할 수 있으며, 법적 증빙서류가 필요하신 경우 신용카드 매출전표 또는
          현금영수증을 출력하시기 바랍니다.
        </p>

        <p className="order-specification-bottom-notice-text">{orderConfig?.specificationAdditionalInfo}</p>
      </div>
    </div>
  );
};

export default OrderSpecificationDetail;

OrderSpecificationDetail.propTypes = {
  orderNo: string,
  isPrint: bool,
};
