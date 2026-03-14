import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { string } from 'prop-types';

import {
  Button,
  Checkbox,
  useModalActionContext,
  useOpenIdSignInActionContext,
  useOpenIdSignInValueContext,
  useCustomTermsActionContext,
  useCustomTermsStateContext,
} from '@shopby/react-components';

import { CustomTerms } from '../../components/CustomTerms';
import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import FullModal from '../../components/FullModal';
import Sanitized from '../../components/Sanitized';
import { DEFAULT_REQUIRED_TERMS_KEYS } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { createRequiredTermStatus, getUsedRequiredTermsTypes } from '../../utils/terms';

const OpenIdSignUpAgreement = ({ orderSheetNo, previousPath, nextPath }) => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signUpAgreement'),
  });
  const navigate = useNavigate();
  const {
    fetchTerms,
    getTerms,
    openIdSignUp,
    allCheck,
    singleCheck,
    updateTermsInfo,
    updateIsTermsContentFullModalOpen,
    removePath,
    setTermStatus,
    checkedAllRequiredTerms,
  } = useOpenIdSignInActionContext();
  const { allChecked, termStatus, termsInfo, isTermsContentFullModalOpen } = useOpenIdSignInValueContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { openAlert } = useModalActionContext();

  // 약관 추가항목 관리
  const { isAllChecked, agreedAllRequiredTerms, agreedTermsNos } = useCustomTermsStateContext();
  const { updateCheckStateBy } = useCustomTermsActionContext();

  const locationState = useMemo(() => {
    const shouldCertifyAsAdult = nextPath === '/adult-certification';

    return {
      from: shouldCertifyAsAdult ? previousPath : nextPath,
      to: shouldCertifyAsAdult ? nextPath : previousPath,
    };
  }, [previousPath, nextPath]);

  const DEFAULT_TERM_STATUS = {
    checked: false,
    required: true,
  };

  const initTermStatus = async () => {
    const res = await fetchTerms({ termsTypes: DEFAULT_REQUIRED_TERMS_KEYS.join(',') });

    const usedRequiredTermsTypes = getUsedRequiredTermsTypes(res?.data);

    const requiredTermStatus = createRequiredTermStatus(usedRequiredTermsTypes, DEFAULT_TERM_STATUS, 'label');

    setTermStatus((prev) => {
      const optionalTerms = prev.filter((term) => !term.required && term.termsType);
      return [...requiredTermStatus, ...optionalTerms];
    });
  };

  const handleAllCheck = (isChecked) => {
    allCheck(isChecked);
    updateCheckStateBy({
      checked: isChecked,
    });
  };

  const handleSingleCheck = (isChecked, label) => {
    singleCheck({ isChecked, label });
  };

  const handleGetTerms = ({ termsTypes, title }) => {
    getTerms({ termsTypes });
    updateTermsInfo({ title });
  };

  const handleOpenIdSignUp = async () => {
    if (!checkedAllRequiredTerms() || !agreedAllRequiredTerms) {
      openAlert({
        message: '필수 항목을 체크해 주세요.',
      });

      return;
    }

    try {
      await openIdSignUp({
        customTermsNos: agreedTermsNos,
      });

      navigate('/sign-up-confirm', {
        state: {
          orderSheetNo,
          ...locationState,
          shouldRoute: true,
        },
        replace: true,
      });

      removePath();
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    initTermStatus();
  }, []);

  return (
    <div className="open-id-agreement-form">
      <div className="open-id-agreement-form__input-wrap">
        <div className="open-id-agreement-form__checkbox--check-all">
          <Checkbox
            label="아래 약관에 모두 동의합니다."
            checked={allChecked && isAllChecked}
            onChange={(e) => {
              handleAllCheck(e.target.checked);
            }}
          />
        </div>
      </div>
      <ul className="open-id-agreement-form__agree-list">
        {termStatus?.map((item, idx) => (
          <li key={idx}>
            <div className="open-id-agreement-form__checkbox--check-single">
              <Checkbox
                label={item.label}
                checked={item.checked}
                onChange={() => handleSingleCheck(item.checked, item.label)}
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

      {isTermsContentFullModalOpen && (
        <FullModal
          className="agreement"
          title={termsInfo.title}
          onClose={() => updateIsTermsContentFullModalOpen(false)}
        >
          <Sanitized html={termsInfo.contents} />
        </FullModal>
      )}

      <div className="open-id-agreement-form__confirm">
        <Button label="동의" onClick={handleOpenIdSignUp} />
      </div>
    </div>
  );
};

export default OpenIdSignUpAgreement;
OpenIdSignUpAgreement.propTypes = {
  orderSheetNo: string,
  previousPath: string,
  nextPath: string,
};
