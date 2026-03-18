import { Function, oneOf, string } from 'prop-types';

import {
  Button,
  useCashReceiptStateContext,
  useCashReceiptActionContext,
  useModalActionContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { cashReceiptKeyTypeOptions } from '../../constants/form';
import CashReceiptForm from '../CashReceiptForm';
import TitleModal from '../TitleModal';

const CashReceiptFormModal = ({ onClose, orderNo, status }) => {
  const { cashReceiptKey, cashReceiptKeyType, cashReceiptIssuePurposeType } = useCashReceiptStateContext();
  const { fetchOrderCashReceipt, updateOrderCashReceipt } = useCashReceiptActionContext();
  const { openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const handleCloseCashReceiptModal = () => {
    onClose();
  };

  const requestOrderCashReceipt = async () => {
    const { data } = await fetchOrderCashReceipt(orderNo, {
      cashReceiptKey,
      cashReceiptKeyType,
      cashReceiptIssuePurposeType,
    });

    try {
      if (data.resultType === 'FAIL') {
        throw new Error(data.resultMsg);
      }

      if (data.resultType === 'ISSUE') {
        openAlert({ message: '현금영수증이 발급 되었습니다.' });

        return;
      }

      if (data.resultType === 'REQUEST') {
        openAlert({
          message: data.resultMsg,
          onClose: () => {
            location.reload();
          },
        });
      }
    } catch (error) {
      openAlert({ message: error.message });
    }
  };

  const modifyOrderCashReceipt = async () => {
    try {
      await updateOrderCashReceipt(orderNo, {
        cashReceiptKey,
        cashReceiptKeyType,
        cashReceiptIssuePurposeType,
      });

      openAlert({
        message: '현금영수증 요청이 수정 되었습니다.',
        onClose: () => {
          location.reload();
        },
      });

      handleCloseCashReceiptModal();
    } catch (error) {
      catchError(error);
    }
  };

  const handleConfirmReceiptClick = () => {
    const selectedCashReceiptKeyType = cashReceiptKeyTypeOptions.find(({ value }) => value === cashReceiptKeyType);
    if (!selectedCashReceiptKeyType) return;

    if (selectedCashReceiptKeyType.maxLength < cashReceiptKey.length) {
      openAlert({
        message: `${selectedCashReceiptKeyType.label}를 확인 해주세요.`,
      });

      return;
    }

    status === 'MODIFY' ? modifyOrderCashReceipt() : requestOrderCashReceipt();
  };

  return (
    <TitleModal title="현금영수증 신청" className="cash-receipt-modal" onClose={handleCloseCashReceiptModal}>
      <div className="cash-receipt">
        <div className="cash-receipt__items">
          <CashReceiptForm />
          <div className="cash-receipt__btn-wrap">
            <Button theme="dark" label="취소" onClick={handleCloseCashReceiptModal} />
            <Button label="저장" onClick={handleConfirmReceiptClick} />
          </div>
        </div>
      </div>
    </TitleModal>
  );
};

export default CashReceiptFormModal;

CashReceiptFormModal.propTypes = {
  onClose: Function,
  status: oneOf(['REQUEST', 'MODIFY']),
  orderNo: string,
};
