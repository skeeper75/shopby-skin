import { useEffect, useState } from 'react';

import {
  Checkbox,
  useRestockNotificationActionContext,
  useRestockNotificationStateContext,
  useTermsActionContext,
  useTermsStateContext,
} from '@shopby/react-components';

import { PI_RESTOCK_NOTICE } from '../../constants/common';
import Sanitized from '../Sanitized';

const PrivacyInfoAgreement = () => {
  const { fetchTerms } = useTermsActionContext();
  const { terms } = useTermsStateContext();
  const { privacyInfoAgreement } = useRestockNotificationStateContext();
  const { updatePrivacyInfoAgreement } = useRestockNotificationActionContext();

  const [termsDetail, setTermsDetail] = useState('');

  const handlePrivacyInfoAgreementChange = () => {
    updatePrivacyInfoAgreement((prev) => !prev);
  };

  useEffect(() => {
    fetchTerms([PI_RESTOCK_NOTICE], {
      type: 'MEMORY',
      timeBySeconds: 180,
    });
  }, []);

  useEffect(() => {
    setTermsDetail(terms?.[PI_RESTOCK_NOTICE]);
  }, [terms]);

  return (
    <section className="restock-notification-form__agreement">
      <label className="form-check form-check--sm">
        <Checkbox checked={privacyInfoAgreement} onChange={handlePrivacyInfoAgreementChange} />
        <span className="form-check__label">[필수] 개인정보 수집 및 이용에 동의합니다.</span>
      </label>
      <Sanitized className="restock-notification-form__agreement-content" html={termsDetail.contents} />
    </section>
  );
};

PrivacyInfoAgreement.propTypes = {};

export default PrivacyInfoAgreement;
