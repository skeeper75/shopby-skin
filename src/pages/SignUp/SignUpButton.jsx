import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { shape, object } from 'prop-types';

import {
  useSignUpActionContext,
  useSignUpStateContext,
  useModalActionContext,
  useCustomTermsStateContext,
  useMallStateContext,
  useIdentificationVerificationStateContext,
  useMarketingReceiveAgreementStateContext,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE, TEXT_CONTENT_TYPES } from '@shopby/shared/constants';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { REQUIRED } from '../../constants/form';

// eslint-disable-next-line complexity
const SignUpButton = ({ refs: { emailRef, mobilePhoneNumberInputRef } }) => {
  const [verifiable, setVerifiable] = useState(false);

  const { state } = useLocation();
  const { postProfile } = useSignUpActionContext();
  const { openAlert } = useModalActionContext();
  const { isSignedUp } = useSignUpStateContext();
  const { AUTHENTICATION_BY_EMAIL, AUTHENTICATION_BY_PHONE, SMS_AUTHENTICATION } = AUTHENTICATION_TYPE;

  const {
    mallJoinConfig: { authenticationTimeType, authenticationType },
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
    isGlobalForm,
  } = useMallStateContext();
  const { setValidationStatus, setIsCertificated, getConfigMemberExtraInfo } = useSignUpActionContext();
  const {
    validationStatus,
    signUpMemberInfo: {
      address,
      birthDate,
      birthMonth,
      birthYear,
      carrierNumber,
      detailAddress,
      emailDomain,
      emailId,
      firstSerial,
      memberId,
      memberName,
      nickname,
      passwordCheck,
      phoneNo,
      secondSerial,
      sex,
      extraInfo,
      firstName,
      lastName,
      mobileNo,
    },
    isCertificated,
  } = useSignUpStateContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { agreedAllRequiredTerms, agreedTermsNos } = useCustomTermsStateContext();
  const { isCiExist, ci } = useIdentificationVerificationStateContext();
  const { agreementTermStatus } = useMarketingReceiveAgreementStateContext();

  const navigate = useNavigate();

  const isValidEmailAuthentication = useMemo(() => {
    const isEmailAuthentication =
      authenticationTimeType !== 'JOIN_TIME' || authenticationType !== AUTHENTICATION_BY_EMAIL;
    const isEmailEmpty = !emailId || !emailDomain;

    return isEmailAuthentication || isEmailEmpty;
  }, [authenticationTimeType, authenticationType, emailId, emailDomain]);

  const isValidMobileNoAuthentication = useMemo(() => {
    const isMobileNoEmpty = !carrierNumber || !firstSerial || !secondSerial;

    return authenticationTimeType !== 'JOIN_TIME' || isMobileNoEmpty;
  }, [carrierNumber, firstSerial, secondSerial]);

  const isMemberIdEmpty = () => {
    if (!memberId) {
      setValidationStatus((prev) => ({ ...prev, memberId: { result: false, message: '아이디를 입력해주세요.' } }));

      return true;
    }

    return false;
  };
  const isPasswordEmpty = () => {
    if (!passwordCheck) {
      setValidationStatus((prev) => ({
        ...prev,
        password: { result: false, message: '비밀번호를 입력해주세요.' },
        passwordCheck: { result: false, message: '비밀번호를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isAddressEmpty = () => {
    if (!address || !detailAddress) {
      setValidationStatus((prev) => ({
        ...prev,
        address: { result: false, message: '주소를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isBirthdayEmpty = () => {
    if (!birthYear || !birthMonth || !birthDate) {
      setValidationStatus((prev) => ({
        ...prev,
        birthday: { result: false, message: '생년월일을 선택해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const validateEmailAuthentication = () => {
    if (isValidEmailAuthentication) {
      return true;
    }

    if (!isCertificated) {
      setValidationStatus((prev) => ({
        ...prev,
        email: { result: false, message: '이메일 인증을 진행해주세요.' },
      }));

      return false;
    }

    if (validationStatus.certificatedNumber.message === '인증을 완료하였습니다.') {
      setValidationStatus((prev) => ({
        ...prev,
        email: { result: true, message: '' },
      }));
    }

    return true;
  };

  const validateSMSAuthentication = () => {
    if (isValidMobileNoAuthentication || authenticationType !== SMS_AUTHENTICATION) {
      return true;
    }

    if (!isCertificated) {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message: '휴대폰 번호 인증을 진행해주세요.' },
      }));

      return false;
    }

    setValidationStatus((prev) => ({
      ...prev,
      mobileNo: { result: true, message: '' },
    }));

    return true;
  };

  const validateMobileNoAuthentication = () => {
    if (isValidMobileNoAuthentication || authenticationType !== AUTHENTICATION_BY_PHONE) {
      return true;
    }

    if (!isCertificated) {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message: '휴대폰 번호 인증을 진행해주세요.' },
      }));

      return false;
    }

    setValidationStatus((prev) => ({
      ...prev,
      mobileNo: { result: true, message: '' },
    }));

    return true;
  };

  const validateExtraInfos = () => {
    const invalidExtraInfos = extraInfo
      ?.filter(({ status, extraInfoType, extraInfoOptionTextContent, extraInfoOptionNos }) => {
        const value = TEXT_CONTENT_TYPES.includes(extraInfoType) ? extraInfoOptionTextContent : extraInfoOptionNos;

        return status === REQUIRED && !value?.length;
      })
      .map((extraInfo) => ({
        ...extraInfo,
        result: false,
        message: `${extraInfo.extraInfoName}을(를) 입력해주세요.`,
      }));

    const isInvalidExtraInfos = !!invalidExtraInfos.length;

    setValidationStatus((prev) => ({
      ...prev,
      extraInfo: isInvalidExtraInfos ? invalidExtraInfos : [],
    }));

    return isInvalidExtraInfos;
  };

  const isEmailEmpty = () => {
    if (!emailId || !emailDomain) {
      setValidationStatus((prev) => ({
        ...prev,
        email: { result: false, message: '이메일을 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isMemberNameEmpty = () => {
    if (!memberName) {
      setValidationStatus((prev) => ({ ...prev, memberName: { result: false, message: '이름을 입력해주세요.' } }));

      return true;
    }

    return false;
  };
  const isGlobalNameEmpty = () => {
    if (!lastName) {
      setValidationStatus((prev) => ({ ...prev, memberName: { result: false, message: '성을 입력해주세요.' } }));

      return true;
    }

    if (!firstName) {
      setValidationStatus((prev) => ({ ...prev, memberName: { result: false, message: '이름을 입력해주세요.' } }));

      return true;
    }

    return false;
  };
  const isNicknameEmpty = () => {
    if (!nickname) {
      setValidationStatus((prev) => ({
        ...prev,
        nickname: { result: false, message: '닉네임을 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isPhoneNoEmpty = () => {
    if (!phoneNo) {
      setValidationStatus((prev) => ({
        ...prev,
        phoneNo: { result: false, message: '전화번호를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isMobileNoEmpty = () => {
    if (mobileNo) return false;

    if (!carrierNumber || !firstSerial || !secondSerial) {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message: '휴대폰 번호를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isSexEmpty = () => {
    if (sex !== 'M' && sex !== 'F') {
      setValidationStatus((prev) => ({
        ...prev,
        sex: { result: false, message: '성별을 선택해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isMobileRequired = useMemo(() => {
    const isMobileAuthentication =
      authenticationType === AUTHENTICATION_BY_PHONE || authenticationType === SMS_AUTHENTICATION;

    if (authenticationTimeType === 'JOIN_TIME' && isMobileAuthentication) {
      return true;
    }

    return false;
  }, [authenticationTimeType, authenticationType]);

  // eslint-disable-next-line complexity
  const validate = () => {
    const isMemberIdInvalid = memberIdConfig === REQUIRED && isMemberIdEmpty();
    const isAddressInvalid = addressConfig === REQUIRED && isAddressEmpty();
    const isBirthdayInvalid = birthdayConfig === REQUIRED && isBirthdayEmpty();
    const isEmailInvalid = emailConfig === REQUIRED && isEmailEmpty();
    const isMobileNoInvalid = (mobileNoConfig === REQUIRED || isMobileRequired) && isMobileNoEmpty();
    const isNicknameInvalid = nicknameConfig === REQUIRED && isNicknameEmpty();
    const isPasswordInvalid = passwordConfig === REQUIRED && isPasswordEmpty();
    const isPhoneNoInvalid = phoneNoConfig === REQUIRED && isPhoneNoEmpty();
    const isSexInvalid = sexConfig === REQUIRED && isSexEmpty();
    const isMemberNameInvalid =
      memberNameConfig === REQUIRED && (isGlobalForm ? isGlobalNameEmpty() : isMemberNameEmpty());
    const isExtraInfoInvalid = validateExtraInfos();

    return (
      isMemberIdInvalid ||
      isAddressInvalid ||
      isBirthdayInvalid ||
      isEmailInvalid ||
      isMobileNoInvalid ||
      isNicknameInvalid ||
      isPasswordInvalid ||
      isPhoneNoInvalid ||
      isSexInvalid ||
      isMemberNameInvalid ||
      isExtraInfoInvalid
    );
  };

  const handleSignUp = async () => {
    await getConfigMemberExtraInfo();
    setVerifiable(true);
  };

  // eslint-disable-next-line complexity
  const submit = async () => {
    if (validate()) {
      openAlert({
        message: '필수 입력 사항을 확인 바랍니다.',
      });
      setVerifiable(false);

      return;
    }

    if (!agreedAllRequiredTerms) {
      openAlert({
        message: '필수 항목을 체크해 주세요.',
      });
      setVerifiable(false);

      return;
    }

    if (!validationStatus.birthday.result) {
      openAlert({
        message: '생년월일을 확인해주세요.',
      });
      setVerifiable(false);

      return;
    }

    if (!validateEmailAuthentication()) {
      openAlert({
        message: '이메일 인증을 진행해주세요.',
        onClose: () => emailRef.current?.focusId(),
      });
      setVerifiable(false);

      return;
    }

    if (!validateSMSAuthentication() || !validateMobileNoAuthentication()) {
      openAlert({
        message: '휴대폰 번호 인증을 진행해주세요.',
        onClose: () => mobilePhoneNumberInputRef.current?.focusFirstSerial(),
      });
      setVerifiable(false);

      return;
    }

    const errorMessage = Object.values(validationStatus)
      .filter(({ result }) => !result)
      ?.at(0)?.message;

    if (errorMessage) {
      openAlert({
        message: errorMessage,
      });
      setVerifiable(false);

      return;
    }

    try {
      const marketingTermsAgreements = agreementTermStatus.marketingInfoUsage.checked
        ? [agreementTermStatus.marketingInfoUsage.termsType]
        : [];

      await postProfile({
        customTermsNos: agreedTermsNos,
        marketingTermsAgreements,
      });
    } catch (e) {
      catchError(e);
    } finally {
      setVerifiable(false);
    }
  };

  useEffect(() => {
    verifiable && submit();
  }, [verifiable]);

  useEffect(() => {
    if (isSignedUp === true) {
      navigate('/sign-up-confirm', {
        replace: true,
        state: {
          memberId,
          ...state,
        },
      });
    }
  }, [isSignedUp]);

  useEffect(() => {
    validateEmailAuthentication();
    validateSMSAuthentication();
    validateMobileNoAuthentication();
  }, [isCertificated]);

  const validateCiExist = () => {
    if (ci && !isCiExist) {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: true, message: '' },
      }));
      setIsCertificated(true);
    }
  };

  useEffect(() => {
    validateCiExist();
  }, [isCiExist, ci]);

  return (
    <div className="sign-up-form__confirm">
      <button className="" onClick={handleSignUp}>
        회원가입
      </button>
    </div>
  );
};

export default SignUpButton;

SignUpButton.propTypes = {
  refs: shape({
    emailRef: object,
    mobilePhoneNumberInputRef: object,
  }),
};
