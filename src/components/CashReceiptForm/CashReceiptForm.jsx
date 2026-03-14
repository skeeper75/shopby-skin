import { useMemo } from 'react';

import {
  TextField,
  SelectBox,
  Radio,
  useCashReceiptStateContext,
  useCashReceiptActionContext,
} from '@shopby/react-components';
import { CASH_RECEIPT_KEY_TYPE, CASH_RECEIPT_ISSUE_PURPOSE_TYPE } from '@shopby/shared';

import { cashReceiptKeyTypeMap, cashReceiptKeyTypeOptions } from '../../constants/form';

const CashReceiptForm = () => {
  const { cashReceiptIssuePurposeType, cashReceiptKeyType, cashReceiptKey } = useCashReceiptStateContext();
  const { changeCashReceiptIssuePurposeType, changeCashReceiptKeyType, changeCashReceiptKey } =
    useCashReceiptActionContext();

  const purposeTypeOptions = useMemo(() => {
    if (cashReceiptIssuePurposeType === CASH_RECEIPT_ISSUE_PURPOSE_TYPE.INCOME_TAX_DEDUCTION) {
      return cashReceiptKeyTypeOptions.filter(({ value }) => value !== CASH_RECEIPT_KEY_TYPE.BUSINESS_NO);
    }

    return cashReceiptKeyTypeOptions.filter(({ value }) => value !== CASH_RECEIPT_KEY_TYPE.MOBILE_NO);
  }, [cashReceiptIssuePurposeType]);

  const handleChangeIssuePurposeType = ({ target }) => {
    changeCashReceiptIssuePurposeType(target.value);
  };

  const handleChangeKeyType = ({ target }) => {
    changeCashReceiptKeyType(target.value);
  };

  const handleChangeKey = ({ target }) => {
    changeCashReceiptKey(target.value.replaceAll(/\D+/g, ''));
  };

  return (
    <>
      <div className="cash-receipt__item">
        <label className="cash-receipt__item-subject">발급정보</label>
        <div className="radio-field__content">
          <Radio
            isRounded={true}
            label="소득공제용"
            value={CASH_RECEIPT_ISSUE_PURPOSE_TYPE.INCOME_TAX_DEDUCTION}
            checked={cashReceiptIssuePurposeType === CASH_RECEIPT_ISSUE_PURPOSE_TYPE.INCOME_TAX_DEDUCTION}
            onClick={handleChangeIssuePurposeType}
            readOnly
          />
          <Radio
            isRounded={true}
            label="지출증빙용"
            value={CASH_RECEIPT_ISSUE_PURPOSE_TYPE.PROOF_EXPENDITURE}
            checked={cashReceiptIssuePurposeType === CASH_RECEIPT_ISSUE_PURPOSE_TYPE.PROOF_EXPENDITURE}
            onClick={handleChangeIssuePurposeType}
            readOnly
          />
        </div>
      </div>
      <div className="cash-receipt__item">
        <SelectBox
          className="cash-receipt-key-type"
          value={cashReceiptKeyType}
          onSelect={handleChangeKeyType}
          options={purposeTypeOptions}
          hasEmptyOption={false}
        />
        <TextField
          value={cashReceiptKey}
          valid="NO_SPECIAL"
          onChange={handleChangeKey}
          placeholder={`${cashReceiptKeyTypeMap[cashReceiptKeyType]} - 없이 입력`}
        />
      </div>
    </>
  );
};

export default CashReceiptForm;
