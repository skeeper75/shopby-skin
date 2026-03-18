import { useEffect } from 'react';

import { bool } from 'prop-types';

import { Radio, useCashReceiptStateContext, useCashReceiptActionContext } from '@shopby/react-components';

import CashReceiptForm from '../../components/CashReceiptForm';

const CashReceipt = (props) => {
  const { cashReceiptRequired } = props;
  const { applyCashReceipt } = useCashReceiptStateContext();
  const { changeApplyCashReceipt } = useCashReceiptActionContext();

  const handleVisibleChange = ({ target }) => {
    changeApplyCashReceipt(target.value === 'true');
  };

  useEffect(() => {
    changeApplyCashReceipt(true);

    return () => {
      changeApplyCashReceipt(false);
    };
  }, []);

  return (
    <section className="l-panel cash-receipt">
      <p className="order-sheet__cash-receipt-title">현금영수증 발급</p>
      <div className="cash-receipt__items">
        <div className="cash-receipt__item">
          <label className="cash-receipt__item-subject">신청여부</label>
          <div className="radio-field__content">
            <Radio
              isRounded={true}
              label="신청 안 함"
              value={false}
              checked={!applyCashReceipt}
              onClick={handleVisibleChange}
              readOnly
              disabled={cashReceiptRequired}
            />
            <Radio
              isRounded={true}
              label="신청함"
              value={true}
              checked={applyCashReceipt}
              onClick={handleVisibleChange}
              readOnly
              disabled={cashReceiptRequired}
            />
          </div>
        </div>
        {applyCashReceipt && <CashReceiptForm />}
      </div>
    </section>
  );
};

export default CashReceipt;

CashReceipt.propTypes = {
  cashReceiptRequired: bool,
};
