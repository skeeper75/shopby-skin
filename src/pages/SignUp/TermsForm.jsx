import { useEffect, useMemo } from 'react';

import { func } from 'prop-types';

import {
  useSignUpActionContext,
  useSignUpStateContext,
  Checkbox,
  Button,
  useCustomTermsActionContext,
  useCustomTermsStateContext,
  useMarketingReceiveAgreementActionContext,
  useMarketingReceiveAgreementStateContext,
  useMallStateContext,
} from '@shopby/react-components';

import { CustomTerms } from '../../components/CustomTerms';
import { MarketingReceiveAgreement } from '../../components/MarketingReceiveAgreement';
import { DEFAULT_REQUIRED_TERMS_KEYS } from '../../constants/common';
import { NOT_USED } from '../../constants/form';
import { createRequiredTermStatus, getUsedRequiredTermsTypes } from '../../utils/terms';

const TermsForm = ({ setIsTermsFullModalOpen }) => {
  const {
    checkboxModalToggle,
    checkboxSingleCheck,
    checkboxAllCheck,
    setTermStatus,
    getTerms,
    setSmsReceiveInfo,
    setEmailReceiveInfo,
  } = useSignUpActionContext();
  const { termStatus, smsReceiveInfo, emailReceiveInfo } = useSignUpStateContext();

  const DEFAULT_TERM_STATUS = {
    checked: false,
    require: true,
    hasDetailView: true,
    isFullModalOpen: false,
  };
  const { memberJoinConfig } = useMallStateContext();
  const { emailAgreement, smsAgreement } = memberJoinConfig ?? {};

  // 약관 추가항목 관리
  const { isAllChecked: isAllCustomTermsChecked } = useCustomTermsStateContext();
  const { updateCheckStateBy } = useCustomTermsActionContext();

  const { setAgreementTermStatus } = useMarketingReceiveAgreementActionContext();
  const { agreementTermStatusList } = useMarketingReceiveAgreementStateContext();

  const isAllMarketingChecked = useMemo(() => {
    const allMarketingTermsChecked = agreementTermStatusList.every((agreement) => agreement.checked);
    const emailChecked = emailAgreement === NOT_USED || emailReceiveInfo.checked;
    const smsChecked = smsAgreement === NOT_USED || smsReceiveInfo.checked;

    return allMarketingTermsChecked && emailChecked && smsChecked;
  }, [agreementTermStatusList, emailAgreement, smsAgreement, emailReceiveInfo.checked, smsReceiveInfo.checked]);

  const handleAllCheckbox = (checked) => {
    setAgreementTermStatus((prev) => ({
      ...prev,
      marketingInfoUsage: { ...prev.marketingInfoUsage, checked },
      marketingReceive: { ...prev.marketingReceive, checked },
    }));

    if (emailAgreement !== NOT_USED) {
      setEmailReceiveInfo((prev) => ({ ...prev, checked }));
    }

    if (smsAgreement !== NOT_USED) {
      setSmsReceiveInfo((prev) => ({ ...prev, checked }));
    }
  };

  const isAllChecked = useMemo(
    () => termStatus.every(({ checked }) => checked) && isAllCustomTermsChecked && isAllMarketingChecked,
    [termStatus, isAllCustomTermsChecked, isAllMarketingChecked]
  );

  const handleModalToggle = (id) => checkboxModalToggle(id);
  const handleSingleCheck = (checked, id) => checkboxSingleCheck(checked, id);
  const handleAllCheck = (checked) => {
    checkboxAllCheck(checked);
    updateCheckStateBy({
      checked,
    });
    handleAllCheckbox(checked);
  };

  const initTermStatus = async () => {
    const res = await getTerms({ termsTypes: DEFAULT_REQUIRED_TERMS_KEYS.join(',') });

    const usedRequiredTermsTypes = getUsedRequiredTermsTypes(res);

    const requiredTermStatus = createRequiredTermStatus(usedRequiredTermsTypes, DEFAULT_TERM_STATUS, 'title');

    setTermStatus((prev) => {
      const optionalTerms = prev.filter((term) => !term.require);

      return [...requiredTermStatus, ...optionalTerms];
    });
  };

  useEffect(() => {
    initTermStatus();
  }, []);

  return (
    <>
      <div className="sign-up-form__item sign-up-form__agree-wrap">
        <p className="sign-up-form__tit">약관동의</p>
        <div className="sign-up-form__input-wrap">
          <div className="sign-up-form__checkbox--all">
            <Checkbox
              onChange={(e) => {
                handleAllCheck(e.target.checked);
              }}
              checked={isAllChecked}
              name="checkAll"
              label={'아래 약관에 모두 동의합니다.'}
            />
          </div>
          <ul className="sign-up-form__agree-list">
            {termStatus?.map((item) => (
              <li key={item.id}>
                <div className="sign-up-form__checkbox--partial">
                  <Checkbox
                    onChange={(e) => {
                      handleSingleCheck(e.target.checked, item.id);
                    }}
                    checked={item.checked}
                    label={item.title}
                  />
                  {item.hasDetailView && (
                    <Button
                      label={'보기'}
                      onClick={() => {
                        handleModalToggle(item.id);
                        setIsTermsFullModalOpen();
                      }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
          <CustomTerms />
          <MarketingReceiveAgreement
            smsReceiveInfo={smsReceiveInfo}
            emailReceiveInfo={emailReceiveInfo}
            setSmsReceiveInfo={(checked) => setSmsReceiveInfo((prev) => ({ ...prev, checked }))}
            setEmailReceiveInfo={(checked) => setEmailReceiveInfo((prev) => ({ ...prev, checked }))}
            getTerms={getTerms}
          />
        </div>
      </div>
      <div className="notice-list">
        <p className="notice-list__item">
          주문, 결제, 고객 상담 등 원활한 정보 제공을 위해 이메일 주소 및 휴대폰 번호는 정확히 기입하셔야 합니다.
        </p>
      </div>
    </>
  );
};

export default TermsForm;

TermsForm.propTypes = {
  setIsTermsFullModalOpen: func,
};
