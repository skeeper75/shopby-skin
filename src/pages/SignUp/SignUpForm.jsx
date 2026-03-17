import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { shape, object } from 'prop-types';

import {
  useSignUpActionContext,
  useSignUpStateContext,
  useMallStateContext,
  VisibleComponent,
} from '@shopby/react-components';
import { classNames } from '@shopby/shared';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import { REQUIRED, NOT_USED } from '../../constants/form';

import SignUpAddressForm from './SignUpAddressForm';
import SignUpBirthdayForm from './SignUpBirthdayForm';
import SignUpEmailForm from './SignUpEmailForm';
import SignUpExtraInfosForm from './SignUpExtraInfosForm';
import SignUpNicknameForm from './SignUpNicknameForm';
import SignUpSexForm from './SignUpSexForm';
import SignUpSmsForm from './SignUpSmsForm';
import SignUpTelephoneNumberForm from './SignUpTelephoneNumberForm';
import ValidationStatus from './ValidationStatus';

// Huni Design System Components
import { TextField } from '../../design-system/components/molecules/TextField/TextField';
import { Field } from '../../design-system/components/molecules/Field/Field';
import { Icon } from '../../components/ui/Icon';

// eslint-disable-next-line complexity
const SignUpForm = ({ refs: { emailRef, mobilePhoneNumberInputRef, globalAddressRef, globalAddressJpRef } }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const {
    verifyUserId,
    verifyUserPassword,
    confirmUserPassword,
    verifyUserName,
    setSignUpMemberInfo,
    setValidationStatus,
    setTimerTime,
    setAuthenticationReSend,
  } = useSignUpActionContext();

  const {
    signUpMemberInfo: { memberId, password, passwordCheck, memberName, firstName, lastName },
    timerTime,
    authenticationsRemainTimeBySeconds,
  } = useSignUpStateContext();

  const {
    mallJoinConfig,
    memberJoinConfig: {
      sex: sexConfig,
      email: emailConfig,
      address: addressConfig,
      phoneNo: phoneNoConfig,
      birthday: birthdayConfig,
      memberId: memberIdConfig,
      mobileNo: mobileNoConfig,
      nickname: nicknameConfig,
      password: passwordConfig,
      memberName: memberNameConfig,
    },
    exchangeTo,
    isGlobalForm,
  } = useMallStateContext();

  const { t } = useTranslation(['form']);

  const resetValidationStatus = (key) => {
    setValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };
  const isMemberNameEmpty = () => {
    if (!memberName) {
      setValidationStatus((prev) => ({ ...prev, memberName: { result: false, message: '이름을 입력해주세요.' } }));

      return true;
    }
    resetValidationStatus('memberName');

    return false;
  };

  useEffect(() => {
    if (
      mallJoinConfig.authenticationTimeType !== 'JOIN_TIME' ||
      mallJoinConfig.authenticationType !== AUTHENTICATION_TYPE.SMS_AUTHENTICATION
    ) {
      setValidationStatus((prev) => ({
        ...prev,
        certificatedNumber: { result: true, message: '' },
      }));
    }
  }, [mallJoinConfig]);

  const handleFormValueChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleGlobalNameChange = ({ target: { name, value } }) => {
    const nameInfo = { firstName, lastName, [name]: value };
    const memberName =
      exchangeTo === 'JPY' ? `${nameInfo.lastName}${nameInfo.firstName}` : `${nameInfo.firstName}${nameInfo.lastName}`;

    setSignUpMemberInfo((prev) => ({ ...prev, [name]: value, memberName }));
  };

  const handleVerifyUserId = () => verifyUserId();
  const handleVerifyUserPassword = () => verifyUserPassword();
  const handleConfirmUserPassword = () => {
    if (!passwordCheck) {
      setValidationStatus((prev) => ({
        ...prev,
        passwordCheck: { result: false, message: '비밀번호를 입력해주세요.' },
      }));

      return;
    }
    confirmUserPassword();
  };
  const handleVerifyUserName = () => {
    if (memberNameConfig === REQUIRED && !(!!memberName || (!!firstName && !!lastName))) {
      isMemberNameEmpty();

      return;
    }
    verifyUserName();
  };

  const startTimer = () => {
    const timeFormat = () => {
      let minute = Math.floor(authenticationsRemainTimeBySeconds / 60).toString();
      let second = (authenticationsRemainTimeBySeconds % 60).toString();

      if (minute.length === 1) minute = `0${minute}`;
      if (second.length === 1) second = `0${second}`;

      setTimerTime({ minute, second });
    };
    timeFormat();
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (Number(timerTime.second) > 0) {
        setTimerTime((prev) => ({
          ...prev,
          second: String(Number(timerTime.second) - 1),
        }));
      }
      if (Number(timerTime.second) === 0) {
        if (Number(timerTime.minute) === 0) {
          clearInterval(timer);
          if (authenticationsRemainTimeBySeconds !== 0) {
            setAuthenticationReSend(true);
            setValidationStatus((prev) => ({
              ...prev,
              certificatedNumber: { result: false, message: '유효시간이 만료되었습니다.' },
            }));
          }
        } else {
          setTimerTime((prev) => ({
            ...prev,
            minute: String(Number(timerTime.minute) - 1),
            second: '59',
          }));
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerTime]);
  useEffect(() => {
    if (authenticationsRemainTimeBySeconds === 0) {
      return;
    }
    startTimer();
  }, [authenticationsRemainTimeBySeconds]);

  useEffect(() => {
    if (
      [AUTHENTICATION_TYPE.NOT_USED, AUTHENTICATION_TYPE.AUTHENTICATION_BY_PHONE].includes(
        mallJoinConfig.authenticationType
      )
    ) {
      setValidationStatus((prev) => ({
        ...prev,
        certificatedNumber: { result: true, message: '' },
      }));
      setSignUpMemberInfo((prev) => ({ ...prev, certificatedNumber: 'NOT_USED' }));
    }
  }, [password]);

  return (
    <>
      {memberIdConfig !== NOT_USED && (
        <div className="sign-up-form__item">
          {/* 아이디 필드 - Huni Field + TextField */}
          <Field.Root required={memberIdConfig === REQUIRED}>
            <Field.Label>{t('id-label')}</Field.Label>
            <Field.Control>
              <TextField.Root>
                <TextField.Input
                  name="memberId"
                  value={memberId}
                  placeholder={t('id-label')}
                  onChange={handleFormValueChange}
                  onBlur={() => {
                    handleVerifyUserId();
                  }}
                  minLength={5}
                />
              </TextField.Root>
            </Field.Control>
          </Field.Root>
          <ValidationStatus name="memberId" />
        </div>
      )}
      {passwordConfig !== NOT_USED && (
        <>
          {/* 비밀번호 필드 - Huni Field + TextField + eye toggle */}
          <div className="sign-up-form__item">
            <Field.Root required={passwordConfig === REQUIRED}>
              <Field.Label>{t('password-label')}</Field.Label>
              <Field.Control>
                <TextField.Root>
                  <TextField.Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('password-placeholder')}
                    onChange={handleFormValueChange}
                    onBlur={handleVerifyUserPassword}
                    minLength={8}
                    maxLength={20}
                    autoComplete="off"
                  />
                  <TextField.SuffixIcon>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex items-center justify-center cursor-pointer"
                    >
                      <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                    </button>
                  </TextField.SuffixIcon>
                </TextField.Root>
              </Field.Control>
            </Field.Root>
            <ValidationStatus name="password" />
          </div>

          {/* 비밀번호 확인 필드 - Huni Field + TextField + eye toggle */}
          <div className="sign-up-form__item">
            <Field.Root required={passwordConfig === REQUIRED}>
              <Field.Label>{t('passwordCheck-label')}</Field.Label>
              <Field.Control>
                <TextField.Root>
                  <TextField.Input
                    name="passwordCheck"
                    type={showPasswordCheck ? 'text' : 'password'}
                    placeholder={t('passwordCheck-label')}
                    onChange={handleFormValueChange}
                    onBlur={handleConfirmUserPassword}
                    minLength={8}
                    maxLength={20}
                    autoComplete="off"
                  />
                  <TextField.SuffixIcon>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPasswordCheck ? '비밀번호 숨기기' : '비밀번호 보기'}
                      onClick={() => setShowPasswordCheck((prev) => !prev)}
                      className="flex items-center justify-center cursor-pointer"
                    >
                      <Icon name={showPasswordCheck ? 'EyeOff' : 'Eye'} size={16} />
                    </button>
                  </TextField.SuffixIcon>
                </TextField.Root>
              </Field.Control>
            </Field.Root>
            <ValidationStatus name="passwordCheck" />
          </div>
        </>
      )}
      {memberNameConfig !== NOT_USED && (
        <div className="sign-up-form__item">
          {/* 이름 필드 - Huni Field + TextField (Global/일반용) */}
          <Field.Root required={memberNameConfig === REQUIRED}>
            <Field.Label>{t('memberName-label')}</Field.Label>
            <Field.Control className={classNames('sign-up-form__input-wrap', { 'global-name-field': isGlobalForm })}>
              <VisibleComponent
                shows={isGlobalForm}
                TruthyComponent={
                  <>
                    <TextField.Root>
                      <TextField.Input
                        name="lastName"
                        value={lastName}
                        placeholder={t('lastName-label')}
                        onChange={handleGlobalNameChange}
                        onBlur={handleVerifyUserName}
                      />
                    </TextField.Root>
                    <TextField.Root>
                      <TextField.Input
                        name="firstName"
                        value={firstName}
                        placeholder={t('firstName-label')}
                        onChange={handleGlobalNameChange}
                        onBlur={handleVerifyUserName}
                      />
                    </TextField.Root>
                  </>
                }
                FalsyComponent={
                  <TextField.Root>
                    <TextField.Input
                      name="memberName"
                      value={memberName}
                      placeholder={t('memberName-label')}
                      onChange={handleFormValueChange}
                      onBlur={handleVerifyUserName}
                    />
                  </TextField.Root>
                }
              />
            </Field.Control>
          </Field.Root>
          <ValidationStatus name="memberName" />
        </div>
      )}
      {nicknameConfig !== NOT_USED && <SignUpNicknameForm />}
      {emailConfig !== NOT_USED && <SignUpEmailForm ref={emailRef} />}
      {mobileNoConfig !== NOT_USED && <SignUpSmsForm ref={mobilePhoneNumberInputRef} />}
      {phoneNoConfig !== NOT_USED && <SignUpTelephoneNumberForm />}
      {addressConfig !== NOT_USED && <SignUpAddressForm refs={{ globalAddressRef, globalAddressJpRef }} />}
      {birthdayConfig !== NOT_USED && <SignUpBirthdayForm />}
      {sexConfig !== NOT_USED && <SignUpSexForm />}
      <SignUpExtraInfosForm />
    </>
  );
};

export default SignUpForm;

SignUpForm.propTypes = {
  refs: shape({
    emailRef: object,
    mobilePhoneNumberInputRef: object,
  }),
};
