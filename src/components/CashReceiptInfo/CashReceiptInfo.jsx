import { useMemo, useState } from 'react';

import { array, object, string, bool } from 'prop-types';

import { Button, useCashReceiptActionContext } from '@shopby/react-components';

import CashReceiptFormModal from '../CashReceiptFormModal';

const CashReceiptInfo = ({ cashReceiptInfo, payInfo, receiptInfos, orderNo, useCashReceipt }) => {
  const [isCashReceiptModalOpen, setIsCashReceiptModalOpen] = useState(false);

  const { changeCashReceiptIssuePurposeType, changeCashReceiptKeyType, changeCashReceiptKey } =
    useCashReceiptActionContext();

  const openReceiptInfo = (url) => {
    window.open(url, 'receiptInfo', 'popup');
  };

  const handleRequestReceiptClick = () => {
    changeCashReceiptKey('');
    changeCashReceiptIssuePurposeType('INCOME_TAX_DEDUCTION');
    changeCashReceiptKeyType('MOBILE_NO');
    setIsCashReceiptModalOpen(true);
  };

  const handleModifyReceiptClick = () => {
    if (!cashReceiptInfo) {
      return;
    }

    const { cashReceiptKey, cashReceiptIssuePurposeType, cashReceiptKeyType } = cashReceiptInfo;
    changeCashReceiptKey(cashReceiptKey);
    changeCashReceiptIssuePurposeType(cashReceiptIssuePurposeType);
    changeCashReceiptKeyType(cashReceiptKeyType);
    setIsCashReceiptModalOpen(true);
  };

  const closeCashReceiptModal = () => {
    setIsCashReceiptModalOpen(false);
  };

  /* eslint-disable complexity */
  const cashReceiptButtonStatus = useMemo(() => {
    /**
     * 보기
     * [COMPLETE]
     * - 현금영수증 발급 완료
     */
    if (cashReceiptInfo?.cashReceiptIssueType === 'COMPLETE') {
      return 'COMPLETE';
    }

    /**
     *
     * 발급실패
     * [FAIL]
     * - 거래금액 0원으로 변경 된 경우
     */
    if (cashReceiptInfo?.cashReceiptIssueType === 'FAIL') {
      return 'FAIL';
    }

    /**
     * 신청불가
     * [EXPIRED]
     * - 결제완료일 부터 5일 경과
     */
    if (payInfo?.bankInfo?.depositYmdt) {
      const expireCashReceiptDate = new Date();

      expireCashReceiptDate.setDate(new Date(payInfo.bankInfo.depositYmdt).getDate() + 5);
      if (payInfo.bankInfo.depositYmdt && expireCashReceiptDate < new Date()) {
        return 'EXPIRED';
      }
    }

    /**
     * 신청
     * - 입금대기 + 현금영수증 발행 신청 이력이 없는 경우
     * - 결제완료 + 현금영수증 발행 신청 이력이 없는 경우 + 결제완료 시점으로부터 5일이 지나지 않은 주문
     */
    if (!cashReceiptInfo) {
      return 'REQUEST';
    }

    /**
     * 수정
     * [REQUEST]
     * - 입금대기 + 현금영수증 발행 신청 이력이 았는 경우
     */
    if (cashReceiptInfo.cashReceiptIssueType === 'REQUEST' && cashReceiptInfo.cashReceiptKey) {
      return 'MODIFY';
    }

    return '';
  }, []);

  const cashReceiptInfos = receiptInfos.filter(({ receiptType }) => receiptType === 'CASH_RECEIPT') ?? [];

  const cashReceiptActionMap = {
    REQUEST: <Button onClick={handleRequestReceiptClick}>현금영수증 신청</Button>,
    MODIFY: <Button onClick={handleModifyReceiptClick}>현금영수증 수정</Button>,
    FAIL: <div>발급실패</div>,
    EXPIRED: <div>신청불가 (기간만료)</div>,
  };

  /**
   * 몰 설정 현금영수증 사용안함 + 현금영수증 신청 이력이 없는 경우 노출 안함
   * (몰 설정에서 현금영수증 사용안함 + 외부 결제모듈을 통해 현금영수증 신청되는 케이스가 있음 -> 이 경우에는 보기 버튼 노출)
   */
  if (!useCashReceipt && cashReceiptInfos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="l-panel order-detail-info">
        <p className="order-detail-info__item-title">현금영수증</p>
        <div className="order-detail-info__item">
          <div className="order-detail-info__btn-wrap">
            {useCashReceipt && cashReceiptActionMap[cashReceiptButtonStatus]}
            {cashReceiptInfos.map(({ url }, index) => (
              <Button key={index} onClick={() => openReceiptInfo(url)}>
                현금영수증 보기
              </Button>
            ))}
          </div>
        </div>
      </section>

      {isCashReceiptModalOpen && (
        <CashReceiptFormModal orderNo={orderNo} status={cashReceiptButtonStatus} onClose={closeCashReceiptModal} />
      )}
    </>
  );
};

export default CashReceiptInfo;

CashReceiptInfo.propTypes = {
  cashReceiptInfo: object,
  payInfo: object,
  receiptInfos: array,
  orderNo: string,
  useCashReceipt: bool,
};
