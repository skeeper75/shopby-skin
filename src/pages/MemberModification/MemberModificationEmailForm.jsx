/* eslint-disable complexity */
import { useMemo, useRef, useState, useEffect } from 'react';

import {
  Button,
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  EmailInput,
  SelectBox,
  useMallStateContext,
  TextField,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import Timer from '../../components/Timer/Timer';
import { EMAIL_DOMAIN_OPTIONS, REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const MemberModificationEmailForm = () => {
  const {
    updateNewEmail,
    updateCertificatedNumber,
    verifyExistEmail,
    authenticateEmail,
    confirmAuthenticationEmail,
    updateIsAuthenticationReSend,
    updateValidationStatus,
    validateEmail,
  } = useMemberModificationActionContext();

  const {
    newEmail,
    certificatedNumber,
    authenticationsRemainTimeBySeconds,
    isAuthenticationReSend,
    memberModificationInfo,
    validationStatus,
  } = useMemberModificationStateContext();
  const {
    mallJoinConfig,
    memberJoinConfig: { email: emailConfig },
  } = useMallStateContext();

  const [emailId = '', emailDomain = ''] = useMemo(() => newEmail?.split('@') ?? [], [newEmail]);
  const emailRef = useRef(null);
  const [domainSelectorValue, setDomainSelectorValue] = useState('');

  const resetValidationStatus = (key) => {
    updateValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const isEmailEmpty = () => {
    if (!emailId || !emailDomain) {
      updateValidationStatus((prev) => ({
        ...prev,
        email: { result: false, message: '이메일을 입력해주세요.' },
      }));

      return true;
    }

    resetValidationStatus('email');

    return false;
  };

  const handleEmailIdInputChange = ({ currentTarget: { value } }) => {
    updateNewEmail(`${value}@${emailDomain}`);
  };
  const handleEmailDomainInputChange = ({ currentTarget: { value } }) => {
    updateNewEmail(`${emailId}@${value}`);
    setDomainSelectorValue('');
  };
  const handleEmailDomainSelect = ({ currentTarget: { value } }) => {
    updateNewEmail(`${emailId}@${value}`);
    setDomainSelectorValue(value);
  };

  const handleCertificatedNumber = ({ currentTarget: { value } }) => {
    updateCertificatedNumber(value);
  };

  const handleDomainBlur = () => {
    if (!emailId && !emailDomain) {
      if (emailConfig !== REQUIRED) {
        resetValidationStatus('email');

        return;
      }
      isEmailEmpty();

      return;
    }
    if (!validateEmail()) {
      return;
    }

    verifyExistEmail(newEmail);
  };

  const handleAuthenticateEmail = () => {
    if (!validateEmail()) {
      return;
    }
    if (!validationStatus.email.result) {
      return;
    }
    authenticateEmail(newEmail);
  };

  const isEmailAuthentication = useMemo(() => {
    if (
      mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL &&
      authenticationsRemainTimeBySeconds
    ) {
      return true;
    }

    return false;
  }, [mallJoinConfig, authenticationsRemainTimeBySeconds]);

  const isEmailType = useMemo(() => {
    if (mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL) {
      return true;
    }

    return false;
  }, [mallJoinConfig]);

  const isSocialMember = useMemo(() => !!memberModificationInfo?.providerType, [memberModificationInfo?.providerType]);

  useEffect(() => {
    if (!emailDomain || (!emailId && !validateEmail())) {
      return;
    }

    if (newEmail === memberModificationInfo.email) {
      updateValidationStatus((prev) => ({
        ...prev,
        email: { result: true, message: '같은 이메일일 경우 인증을 하지 않습니다.' },
      }));

      return;
    }

    verifyExistEmail(newEmail);
  }, [domainSelectorValue]);

  return (
    <>
      <div className="member-modification-form__item">
        <label htmlFor="emailId" className="member-modification-form__tit">
          이메일
          {emailConfig === REQUIRED && <div className="required"></div>}
        </label>
        <div className="member-modification-form__input-wrap">
          <EmailInput
            ref={emailRef}
            id={emailId}
            domain={emailDomain}
            onIdChange={handleEmailIdInputChange}
            onIdBlur={handleDomainBlur}
            onDomainChange={handleEmailDomainInputChange}
            onDomainBlur={handleDomainBlur}
            idDisabled={!isSocialMember && isEmailType && isAuthenticationReSend}
            domainDisabled={!isSocialMember && isEmailType && isAuthenticationReSend}
          />
          <SelectBox
            hasEmptyOption={true}
            emptyOptionLabel="직접 입력"
            value={domainSelectorValue}
            onSelect={handleEmailDomainSelect}
            options={EMAIL_DOMAIN_OPTIONS}
            disabled={!isSocialMember && isEmailType && isAuthenticationReSend}
          />
        </div>
        {mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL && !isSocialMember && (
          <Button
            className="member-modification-form__btn--certificate"
            label={isAuthenticationReSend ? `재인증` : `인증번호 발송`}
            onClick={() => {
              isAuthenticationReSend ? updateIsAuthenticationReSend(false) : handleAuthenticateEmail();
            }}
          />
        )}
        <ValidationStatus name="email" />
      </div>
      {!isSocialMember && isEmailAuthentication && (
        <div className="member-modification-form__item">
          <label htmlFor="certificatedNumber" className="member-modification-form__tit">
            인증번호
          </label>
          <div className="member-modification-form__input-wrap">
            <TextField
              name="certificatedNumber"
              id="certificatedNumber"
              value={certificatedNumber}
              placeholder="인증번호를 입력해주세요."
              onChange={handleCertificatedNumber}
              maxLength={6}
              valid="NO_SPACE"
            />
          </div>
          <Button
            className="member-modification-form__btn--certificate"
            label={'확인'}
            onClick={() => {
              confirmAuthenticationEmail(certificatedNumber);
            }}
          />
          <Timer
            seconds={authenticationsRemainTimeBySeconds}
            onTimeOutAction={() => {
              updateValidationStatus((prev) => ({
                ...prev,
                certificatedNumber: {
                  result: false,
                  message: '유효시간이 초과되었습니다. 다시 [인증번호 발송] 클릭하여 발급된 인증번호를 입력해주세요.',
                },
              }));
            }}
          />
          <ValidationStatus name="certificatedNumber" />
        </div>
      )}
    </>
  );
};

export default MemberModificationEmailForm;
