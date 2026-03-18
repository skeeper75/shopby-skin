import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { object, string } from 'prop-types';

import { Button, Icon, useAuthActionContext } from '@shopby/react-components';

import CashReceiptInfo from '../../components/CashReceiptInfo';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { deliverableProduct } from '../../utils';
import ReceiptInfo from '../OrderDetail/ReceiptInfo';

import OrdererInfo from './OrdererInfo';
import OrderProductTable from './OrderProductTable';
import PaymentInfo from './PaymentInfo';
import ShippingAddressInfo from './ShippingAddressInfo';

// @MX:NOTE: [AUTO] 예상 제작 완료일 계산 - 영업일 기준 3~5일, 주말/공휴일 제외
const getEstimatedProductionDate = () => {
  const now = new Date();
  let businessDays = 0;
  const target = new Date(now);

  while (businessDays < 4) {
    target.setDate(target.getDate() + 1);
    const day = target.getDay();
    if (day !== 0 && day !== 6) {
      businessDays += 1;
    }
  }

  return target.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
};

const OrderSuccess = ({ orderInfo, orderNo, orderConfig }) => {
  const [searchParams] = useSearchParams();
  const { isSignedIn } = useAuthActionContext();
  const navigate = useNavigate();

  const estimatedDate = useMemo(() => getEstimatedProductionDate(), []);

  useLayoutChanger({
    title: '주문완료',
    hasCancelBtnOnHeader: true,
  });

  useEffect(() => {
    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setGlobalObjectSb({
      order: orderInfo,
    });
  }, []);

  const handleSearchOrdersBtnClick = () => {
    navigate(isSignedIn() ? `/orders/${orderNo}` : '/sign-in');
  };

  const handleContinueBtnClick = () => {
    navigate('/');
  };

  return (
    <div className="order-confirm">
      {/* Huni 주문 완료 헤더 */}
      <section className="l-panel order-confirm__message">
        <div className="flex flex-col items-center gap-3 py-4">
          {/* 성공 아이콘 */}
          <div className="w-16 h-16 rounded-full bg-[#5538B6]/10 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5538B6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-bold text-[#424242] tracking-[-0.05em]">주문이 완료되었습니다!</h2>
            <p className="text-sm text-[#979797] mt-1 tracking-[-0.05em]">
              {orderInfo.orderer.ordererName} 고객님, 결제가 완료되었습니다.
            </p>
          </div>

          <div className="text-center bg-[#F6F6F6] rounded-[5px] px-4 py-2 w-full max-w-xs">
            <p className="text-xs text-[#979797] tracking-[-0.05em]">주문번호</p>
            <p className="text-sm font-bold text-[#5538B6] mt-0.5 tracking-[-0.05em]">{orderNo}</p>
          </div>

          {/* 예상 제작 완료일 */}
          <div className="w-full max-w-xs bg-[#5538B6]/5 border border-[#5538B6]/20 rounded-[5px] px-4 py-3">
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5538B6"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p className="text-xs font-semibold text-[#5538B6] tracking-[-0.05em]">예상 제작 완료일</p>
            </div>
            <p className="text-sm font-bold text-[#424242] mt-1 tracking-[-0.05em]">{estimatedDate}</p>
            <p className="text-xs text-[#979797] mt-0.5 tracking-[-0.05em]">
              영업일 기준 3~5일 소요 (도서산간 지역은 추가 소요될 수 있습니다)
            </p>
          </div>
        </div>
      </section>

      <OrderProductTable />
      <OrdererInfo />
      {deliverableProduct(searchParams) && <ShippingAddressInfo />}
      <PaymentInfo />
      {orderInfo.payType === 'ACCOUNT' && orderConfig.cashReceipt && (
        <CashReceiptInfo
          cashReceiptInfo={orderInfo.cashReceiptInfo}
          payInfo={orderInfo.payInfo}
          receiptInfos={orderInfo.receiptInfos}
          orderNo={orderInfo.orderNo}
        />
      )}

      <ReceiptInfo
        orderNo={orderNo}
        payType={orderInfo?.payType}
        receiptInfos={orderInfo?.receiptInfos}
        visibleReceiptBtn={orderConfig?.visibleReceiptBtn}
        viewShopSpecification={orderConfig?.viewShopSpecification}
        useSimpleReceipt={orderConfig?.useSimpleReceipt}
        usePaymentReceipt={orderConfig?.usePaymentReceipt}
        shopSpecificationFields={orderConfig?.shopSpecificationFields}
        defaultOrderStatusType={orderInfo?.defaultOrderStatusType}
      />

      {/* 버튼 그룹 */}
      <section className="order-confirm__btn-group">
        <Button
          className="order-confirm__orders-btn"
          theme="dark"
          label="주문내역 조회"
          onClick={handleSearchOrdersBtnClick}
        />
        <Button
          className="order-confirm__continue-btn"
          label="계속 쇼핑하기"
          onClick={handleContinueBtnClick}
        />
      </section>
    </div>
  );
};

export default OrderSuccess;

OrderSuccess.propTypes = {
  orderInfo: object.isRequired,
  orderNo: string.isRequired,
  orderConfig: object.isRequired,
};
