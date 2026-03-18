import { useEffect, useMemo } from 'react';

import {
  Button,
  Checkbox,
  useMemberModificationActionContext,
  useMemberModificationStateContext,
  useAuthStateContext,
  useCustomTermsActionContext,
} from '@shopby/react-components';

import { CustomTerms } from '../../components/CustomTerms';
import FullModal from '../../components/FullModal';
import { MarketingReceiveAgreement } from '../../components/MarketingReceiveAgreement';
import Sanitized from '../../components/Sanitized';
import { DEFAULT_REQUIRED_TERMS_KEYS } from '../../constants/common';
import { createRequiredTermStatus, getUsedRequiredTermsTypes } from '../../utils/terms';

const MemberModificationTermsForm = () => {
  const { profile } = useAuthStateContext();
  const {
    getTerms,
    checkSingle,
    updateTermsInfo,
    updateIsTermsContentFullModalOpen,
    updateTermStatus,
    updateValidationStatus,
    updateMemberModificationInfo,
  } = useMemberModificationActionContext();
  const {
    termStatus,
    termsInfo,
    isTermsContentFullModalOpen,
    memberModificationInfo: { smsAgreed, directMailAgreed },
    receiveAgreementInfo: { smsAgreeYmdt, directMailAgreeYmdt, directMailDisagreeYmdt, smsDisagreeYmdt },
  } = useMemberModificationStateContext();

  const { updateInitialCustomTermsNos } = useCustomTermsActionContext();

  const DEFAULT_TERM_STATUS = {
    checked: true,
    require: true,
    disabled: true,
  };

  const smsReceiveInfo = useMemo(
    () => ({
      id: 'smsAgreed',
      title: 'SMS 수신 동의',
      checked: smsAgreed,
      smsAgreed,
      smsAgreeYmdt,
      smsDisagreeYmdt,
      originalSmsAgreed: profile?.smsAgreed,
    }),
    [smsAgreed, smsAgreeYmdt, smsDisagreeYmdt, profile?.smsAgreed]
  );

  const emailReceiveInfo = useMemo(
    () => ({
      id: 'directMailAgreed',
      title: '이메일 수신 동의',
      checked: directMailAgreed,
      directMailAgreed,
      directMailAgreeYmdt,
      directMailDisagreeYmdt,
      originalDirectMailAgreed: profile?.directMailAgreed,
    }),
    [directMailAgreed, directMailAgreeYmdt, directMailDisagreeYmdt, profile?.directMailAgreed]
  );

  const handleCheckSingle = (isChecked, label) => {
    checkSingle({ isChecked, label });
  };

  const handleGetTerms = async ({ termsTypes, title }) => {
    const terms = await getTerms({ termsTypes });
    const termContentValues = Object.values(terms);
    const [termData] = termContentValues;
    const { contents } = termData;

    updateIsTermsContentFullModalOpen(true);
    updateTermsInfo({ title, contents });
  };

  const initTermStatus = async () => {
    const res = await getTerms({ termsTypes: DEFAULT_REQUIRED_TERMS_KEYS.join(',') });

    const usedRequiredTermsTypes = getUsedRequiredTermsTypes(res);

    const requiredTermStatus = createRequiredTermStatus(usedRequiredTermsTypes, DEFAULT_TERM_STATUS, 'label').map(
      (term) => {
        const isAgreed = profile?.agreedTerms?.includes(term.termsType);

        return {
          ...term,
          checked: isAgreed,
          disabled: isAgreed,
        };
      }
    );

    updateTermStatus((prev) => {
      const optionalTerms = prev.filter((term) => !term.require);

      return [...requiredTermStatus, ...optionalTerms];
    });
  };

  useEffect(() => {
    initTermStatus();

    const customTermsNos = profile?.customTermsAgreement
      ?.filter(({ isAgree }) => isAgree)
      .map(({ customTermsNo }) => customTermsNo);
    customTermsNos?.length > 0 && updateInitialCustomTermsNos(customTermsNos);
  }, [profile]);

  useEffect(() => {
    const termStatusItems = [...termStatus];
    const requireTypeItem = termStatusItems.filter((el) => el.require);
    const checkJoinRequireAgreements = requireTypeItem.filter((el) => el.checked === false);

    if (checkJoinRequireAgreements.length !== 0) {
      updateValidationStatus((prev) => ({
        ...prev,
        joinTermsAgreements: { result: false, message: '필수 항목을 체크해 주세요.' },
      }));
    } else {
      updateValidationStatus((prev) => ({
        ...prev,
        joinTermsAgreements: { result: true, message: '' },
      }));
    }
  }, [termStatus]);

  return (
    <div className="member-modification-form__item">
      <p className="member-modification-form__tit">약관동의 현황</p>

      <div className="member-modification-form__agree-wrap">
        <ul className="member-modification-form__agree-list">
          {termStatus?.map((item, idx) => (
            <li key={idx}>
              <div className="member-modification-form__checkbox--check-single">
                <Checkbox
                  label={item.label}
                  checked={item.checked}
                  onChange={() => handleCheckSingle(item.checked, item.label)}
                  disabled={item?.disabled}
                />
                {item.termsType && (
                  <Button
                    label="보기"
                    onClick={() => {
                      handleGetTerms({ termsTypes: item.termsType, title: item.label });
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
          setSmsReceiveInfo={(checked) => updateMemberModificationInfo({ smsAgreed: checked })}
          setEmailReceiveInfo={(checked) => updateMemberModificationInfo({ directMailAgreed: checked })}
          getTerms={getTerms}
        />

        {isTermsContentFullModalOpen && (
          <FullModal
            className="agreement"
            title={termsInfo.title}
            onClose={() => updateIsTermsContentFullModalOpen(false)}
          >
            <Sanitized html={termsInfo.contents} />
          </FullModal>
        )}
      </div>
    </div>
  );
};

export default MemberModificationTermsForm;
