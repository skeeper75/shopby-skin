import { forwardRef, useEffect } from 'react';

import {
  useMallStateContext,
  useSignUpActionContext,
  useSignUpStateContext,
  TextField,
  EmailInput,
  Button,
  SelectBox,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import { EMAIL_DOMAIN_OPTIONS, REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

// eslint-disable-next-line complexity
const SignUpEmailForm = forwardRef((_, ref) => {
  const {
    mallJoinConfig,
    memberJoinConfig: { email: emailConfig },
  } = useMallStateContext();
  const {
    setValidationStatus,
    verifyUserEmail,
    validateEmail,
    postAuthenticationsEmail,
    getAuthenticationsEmail,
    setSignUpMemberInfo,
  } = useSignUpActionContext();

  const {
    signUpMemberInfo: { emailId, emailDomain, domainSelectorValue, certificatedNumber },
    timerTime,
    authenticationsRemainTimeBySeconds,
    authenticationReSend,
  } = useSignUpStateContext();

  const resetValidationStatus = (key) => {
    setValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const isEmailEmpty = () => {
    if (!emailId || !emailDomain) {
      setValidationStatus((prev) => ({
        ...prev,
        email: { result: false, message: '이메일을 입력해주세요.' },
      }));

      return true;
    }

    resetValidationStatus('email');

    return false;
  };

  const handleFormValueChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleEmailIdInputChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, emailId: event.target.value }));
  };

  const handleEmailDomainInputChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, emailDomain: event.target.value, domainSelectorValue: '직접 입력' }));
  };

  const handleEmailDomainSelect = ({ currentTarget }) => {
    setSignUpMemberInfo((prev) => ({
      ...prev,
      emailDomain: currentTarget.value,
      domainSelectorValue: currentTarget.value,
    }));
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
    verifyUserEmail();
  };
  const handleVerifyEmail = () => {
    postAuthenticationsEmail();
  };
  const handleConfirmEmailAuthentication = () => getAuthenticationsEmail();

  useEffect(() => {
    if (!emailDomain || (!emailId && !validateEmail())) {
      return;
    }
    verifyUserEmail();
  }, [domainSelectorValue]);

  return (
    <>
      <div className="sign-up-form__item">
        <label htmlFor="email" className="sign-up-form__tit">
          이메일 주소
          {emailConfig === REQUIRED && <div className="required"></div>}
        </label>
        <div className="sign-up-form__input-wrap">
          <EmailInput
            ref={ref}
            id={emailId}
            domain={emailDomain}
            onIdChange={handleEmailIdInputChange}
            onIdBlur={handleDomainBlur}
            onDomainChange={handleEmailDomainInputChange}
            onDomainBlur={handleDomainBlur}
          />
          <SelectBox
            hasEmptyOption={true}
            emptyOptionLabel={domainSelectorValue}
            onSelect={handleEmailDomainSelect}
            options={EMAIL_DOMAIN_OPTIONS}
          />
          <ValidationStatus name="email" />

          {mallJoinConfig.authenticationTimeType === 'JOIN_TIME' &&
          mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL ? (
            <Button
              className="authentication-btn"
              label={authenticationReSend ? `재인증` : `인증번호 발송`}
              onClick={() => {
                handleVerifyEmail();
              }}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      {mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL &&
      authenticationsRemainTimeBySeconds ? (
        <div className="sign-up-form__item">
          <label htmlFor="certificatedNumber" className="sign-up-form__tit">
            인증번호
          </label>
          <div className="sign-up-form__input-wrap">
            <TextField
              name="certificatedNumber"
              id="certificatedNumber"
              value={certificatedNumber}
              placeholder="인증번호를 입력해주세요."
              onChange={handleFormValueChange}
              maxLength={6}
              valid="NO_SPACE"
            />
            <Button label={'확인'} onClick={handleConfirmEmailAuthentication} />
          </div>
          {timerTime ? (
            <span className="timer">
              <span className="timer__text">유효시간</span>
              <span className="timer__number">{timerTime.minute}</span>
              <span className="timer__middle-sign">:</span>
              <span className="timer__number">{timerTime.second}</span>
            </span>
          ) : (
            ''
          )}
          <ValidationStatus name="certificatedNumber" />
        </div>
      ) : (
        ''
      )}
    </>
  );
});

export default SignUpEmailForm;

SignUpEmailForm.displayName = 'SignUpEmailForm';
