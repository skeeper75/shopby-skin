import { useMemo } from 'react';

import { string, array, object, bool } from 'prop-types';

import { Button, VisibleComponent } from '@shopby/react-components';

const receiptLabelMap = {
  SPECIFICATION: '거래명세서',
  SPECIFICATION_BRIEF: '간이영수증',
  SALE_STATEMENT: '신용카드 거래 매출전표',
  TRADE_STATEMENT: '가상계좌,실시간계좌이체 매출전표',
  CASH_RECEIPT: '현금영수증',
};

const ReceiptInfo = ({
  orderNo,
  payType,
  receiptInfos,
  visibleReceiptBtn,
  viewShopSpecification,
  useSimpleReceipt,
  usePaymentReceipt,
  defaultOrderStatusType,
}) => {
  const openReceipt = (receiptType, receiptUrl) => {
    const url =
      receiptUrl ||
      (receiptType === 'SPECIFICATION' ? `/order-specification/${orderNo}` : `/simple-receipt/${orderNo}`);

    window.open(url, 'orderSpecificationPopup', 'popup');
  };

  const visibleReceipt = {
    viewShopSpecification,
    viewSimpleReceipt: useSimpleReceipt && payType === 'ACCOUNT',
    viewPaymentReceipt: usePaymentReceipt && receiptInfos?.length > 0,
  };

  const isVisibleReceiptBtn = useMemo(
    () => defaultOrderStatusType !== 'DEPOSIT_WAIT' && Object.values(visibleReceipt).some((visible) => visible),
    [defaultOrderStatusType, visibleReceipt]
  );

  return (
    <VisibleComponent
      shows={isVisibleReceiptBtn}
      TruthyComponent={
        <section className="l-panel order-detail-info">
          <div className="order-detail__list-btn-wrap receipt-info">
            <dl>
              {visibleReceipt.viewSimpleReceipt && (
                <>
                  <dt>간이영수증</dt>
                  <dd>
                    <Button onClick={() => openReceipt('SPECIFICATION_BRIEF')}>간이영수증 출력</Button>
                  </dd>
                </>
              )}

              {visibleReceipt.viewShopSpecification && (
                <>
                  <dt>거래명세서</dt>
                  <dd>
                    <Button onClick={() => openReceipt('SPECIFICATION')}>거래명세서 출력</Button>
                  </dd>
                </>
              )}

              <VisibleComponent
                shows={visibleReceiptBtn?.pgReceipt}
                TruthyComponent={receiptInfos?.map(({ receiptType, url }, index) => (
                  <>
                    <dt>{receiptLabelMap[receiptType]}</dt>
                    <dd>
                      <Button key={index} onClick={() => openReceipt(receiptType, url)}>
                        결제영수증 출력
                      </Button>
                    </dd>
                  </>
                ))}
              />
            </dl>
          </div>
        </section>
      }
    />
  );
};

export default ReceiptInfo;

ReceiptInfo.propTypes = {
  orderNo: string,
  payType: string,
  receiptInfos: array,
  visibleReceiptBtn: object,

  viewShopSpecification: bool,
  useSimpleReceipt: bool,
  usePaymentReceipt: bool,
  shopSpecificationFields: array,
  defaultOrderStatusType: string,
};
