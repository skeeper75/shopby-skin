import { useEffect, useMemo, useState } from 'react';

import { bool } from 'prop-types';

import {
  Button,
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  useMallStateContext,
  useCustomTermsStateContext,
  useModalActionContext,
  useCheckMemberPasswordStateContext,
  useCheckMemberPasswordActionContext,
  useAuthStateContext,
  useMarketingReceiveAgreementStateContext,
  useMarketingReceiveAgreementActionContext,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE, CLIENT_ERROR, CLIENT_ERROR_MESSAGE, TEXT_CONTENT_TYPES } from '@shopby/shared/constants';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { NOT_USED, REQUIRED } from '../../constants/form';

import MemberModificationAddressForm from './MemberModificationAddressForm';
import MemberModificationBirthdayForm from './MemberModificationBirthdayForm';
import MemberModificationEmailForm from './MemberModificationEmailForm';
import MemberModificationExtraInfosForm from './MemberModificationExtraInfosForm';
import MemberModificationMemberNameForm from './MemberModificationMemberNameForm';
import MemberModificationNicknameForm from './MemberModificationNicknameForm';
import MemberModificationPasswordForm from './MemberModificationPasswordForm';
import MemberModificationSexForm from './MemberModificationSexForm';
import MemberModificationSmsForm from './MemberModificationSmsForm';
import MemberModificationTelephoneNumberForm from './MemberModificationTelephoneNumberForm';
import MemberModificationTermsForm from './MemberModificationTermsForm';

// eslint-disable-next-line complexity
const MemberModificationForm = () => {
  const [verifiable, setVerifiable] = useState(false);

  const { setProfile, modifyProfile, updateIsAuthenticationReSend, updateValidationStatus, getConfigMemberExtraInfo } =
    useMemberModificationActionContext();
  const { profile } = useAuthStateContext();

  const {
    validationStatus,
    memberModificationInfo: {
      providerType,
      address,
      detailAddress,
      memberName,
      telephoneNo,
      sex,
      nickname,
      memberId,
      extraInfo,
      mobileNo,
      smsAgreed,
      directMailAgreed,
    },
    newNickname,
    birthYear,
    birthMonth,
    birthDate,
    newEmail,
    carrierNumber,
    firstSerial,
    secondSerial,
    newPassword,
    newPasswordCheck,
    isNewPasswordDisplay,
  } = useMemberModificationStateContext();

  const {
    mallJoinConfig: { authenticationTimeType, authenticationType },
    memberJoinConfig: {
      password: passwordConfig,
      sex: sexConfig,
      email: emailConfig,
      address: addressConfig,
      phoneNo: phoneNoConfig,
      birthday: birthdayConfig,
      mobileNo: mobileNoConfig,
      nickname: nicknameConfig,
      memberName: memberNameConfig,
      smsAgreement,
      emailAgreement,
    },
    isGlobalForm,
  } = useMallStateContext();

  const isSmsAgreed = smsAgreement !== NOT_USED && smsAgreed;
  const isEmailAgreed = emailAgreement !== NOT_USED && directMailAgreed;

  const {
    checkPasswordMemberInfo: { password: currentPassword },
  } = useCheckMemberPasswordStateContext();

  const { AUTHENTICATION_BY_PHONE, SMS_AUTHENTICATION } = AUTHENTICATION_TYPE;

  const { catchError } = useErrorBoundaryActionContext();
  const { openAlert } = useModalActionContext();

  // 약관 추가항목 관리
  const { agreedAllRequiredTerms, agreedTermsNos } = useCustomTermsStateContext();

  const { postProfileNonMasking } = useCheckMemberPasswordActionContext();

  const { agreementTermStatus } = useMarketingReceiveAgreementStateContext();
  const { setAgreementTermStatus } = useMarketingReceiveAgreementActionContext();

  const isPasswordEmpty = () => {
    if (!newPasswordCheck) {
      updateValidationStatus((prev) => ({
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
      updateValidationStatus((prev) => ({
        ...prev,
        address: { result: false, message: '주소를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isBirthdayEmpty = () => {
    if (!birthYear || !birthMonth || !birthDate) {
      updateValidationStatus((prev) => ({
        ...prev,
        birthday: { result: false, message: '생년월일을 선택해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isEmailEmpty = () => {
    const [emailId = '', emailDomain = ''] = newEmail?.split('@') ?? [];

    if (!emailId && !emailDomain) {
      updateValidationStatus((prev) => ({
        ...prev,
        email: { result: false, message: '이메일을 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isNicknameEmpty = () => {
    if (!newNickname) {
      updateValidationStatus((prev) => ({
        ...prev,
        nickname: { result: false, message: '닉네임을 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isPhoneNoEmpty = () => {
    if (!telephoneNo) {
      updateValidationStatus((prev) => ({
        ...prev,
        phoneNo: { result: false, message: '전화번호를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const checkMobilePhoneNoEmpty = () => {
    if (!mobileNo) {
      updateValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message: '휴대폰 번호를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isMobileNoEmpty = () => {
    if (!carrierNumber || !firstSerial || !secondSerial) {
      const message =
        authenticationType === AUTHENTICATION_BY_PHONE
          ? '휴대폰 번호 인증을 진행해주세요.'
          : '휴대폰 번호를 입력해주세요.';
      updateValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message },
      }));

      return true;
    }

    return false;
  };

  const isSexEmpty = () => {
    if (sex !== 'M' && sex !== 'F') {
      updateValidationStatus((prev) => ({
        ...prev,
        sex: { result: false, message: '성별을 선택해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const validateMarketingReceiveAgreementTerms = () => {
    const { marketingInfoUsage, marketingReceive } = agreementTermStatus;

    const isReceiveAgreementChecked = marketingReceive?.checked || isSmsAgreed || isEmailAgreed;

    if (!marketingInfoUsage?.checked && isReceiveAgreementChecked) {
      updateValidationStatus((prev) => ({
        ...prev,
        marketingReceiveAgreementTerms: {
          result: false,
          message: CLIENT_ERROR_MESSAGE[CLIENT_ERROR.REQUIRE_MARKETING_PRIVACY_AGREE_NOTIFICATION],
        },
      }));

      return false;
    }

    return true;
  };

  const validateExtraInfos = () => {
    const extraInfos =
      extraInfo?.map((memberExtraInfo) => {
        const { extraInfoOptionNos, extraInfoOptionTextContent } =
          extraInfo?.find((extraInfo) => extraInfo.extraInfoNo === memberExtraInfo.extraInfoNo) ?? {};

        return {
          ...memberExtraInfo,
          extraInfoOptionNos: extraInfoOptionNos ?? [],
          extraInfoOptionTextContent: extraInfoOptionTextContent ?? '',
          isValid: true,
          message: '',
        };
      }) ?? [];

    const invalidExtraInfos = extraInfos
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

    updateValidationStatus((prev) => ({
      ...prev,
      extraInfo: isInvalidExtraInfos ? invalidExtraInfos : [],
    }));

    return isInvalidExtraInfos;
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
  const validateRequireItems = () => {
    const isPasswordInvalid = isNewPasswordDisplay && isPasswordEmpty();
    const isAddressInvalid = addressConfig === REQUIRED && isAddressEmpty();
    const isBirthdayInvalid = birthdayConfig === REQUIRED && isBirthdayEmpty();
    const isEmailInvalid = emailConfig === REQUIRED && isEmailEmpty();
    const isMobileNoInvalid =
      (mobileNoConfig === REQUIRED || isMobileRequired) &&
      (isGlobalForm ? checkMobilePhoneNoEmpty() : isMobileNoEmpty());
    const isNicknameInvalid = nicknameConfig === REQUIRED && isNicknameEmpty();
    const isPhoneNoInvalid = phoneNoConfig === REQUIRED && isPhoneNoEmpty();
    const isSexInvalid = sexConfig === REQUIRED && isSexEmpty();
    const isExtraInfoInvalid = validateExtraInfos();

    return (
      isPasswordInvalid ||
      isAddressInvalid ||
      isBirthdayInvalid ||
      isEmailInvalid ||
      isMobileNoInvalid ||
      isNicknameInvalid ||
      isPhoneNoInvalid ||
      isSexInvalid ||
      isExtraInfoInvalid
    );
  };

  const resetPassword = () => {
    if (isNewPasswordDisplay) {
      return;
    }
    validationStatus.password.result = true;
    validationStatus.passwordCheck.result = true;
  };

  const validate = () => {
    resetPassword();

    const isInvalidRequiredTerms = !agreedAllRequiredTerms || !validationStatus?.joinTermsAgreements?.result;

    if (validateRequireItems()) {
      openAlert({
        message: '필수 입력 사항을 확인 바랍니다.',
      });

      return true;
    }

    if (isInvalidRequiredTerms) {
      openAlert({
        message: '필수 항목을 체크해 주세요.',
      });

      return true;
    }

    if (!validationStatus?.address?.result) {
      openAlert({
        message: '상세 주소를 입력해주세요.',
      });

      return true;
    }

    if (!validationStatus.birthday.result) {
      openAlert({
        message: '생년월일을 확인해주세요.',
      });

      return true;
    }

    if (!validateMarketingReceiveAgreementTerms()) {
      openAlert({
        message: CLIENT_ERROR_MESSAGE[CLIENT_ERROR.REQUIRE_MARKETING_PRIVACY_AGREE_NOTIFICATION],
      });

      return true;
    }

    return false;
  };

  const modifyProfileRequest = {
    customTermsNos: agreedTermsNos,
    password: isNewPasswordDisplay ? newPassword : null,
    currentPassword: currentPassword ? currentPassword : null,
    marketingTermsAgreements: agreementTermStatus.marketingInfoUsage.checked
      ? [agreementTermStatus.marketingInfoUsage.termsType]
      : [],
  };

  const handleModifyBtnClick = async () => {
    await getConfigMemberExtraInfo();
    setVerifiable(true);
  };

  const modify = async () => {
    if (validate()) {
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
      const modifyResult = await modifyProfile(modifyProfileRequest);

      if (modifyResult) {
        location.href = '/my-page';
      }
    } catch (e) {
      catchError(e);
    } finally {
      setVerifiable(false);
    }
  };

  const handleOpenIdAuthentication = async () => {
    const { data } = await postProfileNonMasking();

    setProfile(data);
    sessionStorage.removeItem('MY_PAGE_TOKEN');
  };

  useEffect(() => {
    verifiable && modify();
  }, [verifiable]);

  useEffect(() => {
    if (authenticationType !== AUTHENTICATION_TYPE.NOT_USED) {
      updateIsAuthenticationReSend(true);
    }
  }, [authenticationType]);

  useEffect(() => {
    const myPageToken = sessionStorage.getItem('MY_PAGE_TOKEN');

    if (!profile || !myPageToken) return;

    if (profile.memberType === 'MALL') {
      sessionStorage.removeItem('MY_PAGE_TOKEN');

      return;
    }

    handleOpenIdAuthentication();
  }, [profile]);

  useEffect(() => {
    if (isSmsAgreed || isEmailAgreed) {
      setAgreementTermStatus((prev) => ({
        ...prev,
        marketingReceive: { ...prev.marketingReceive, checked: true },
      }));
    }
  }, [isSmsAgreed, isEmailAgreed]);

  return (
    <div className="member-modification">
      <div className="member-modification-name">
        <p>
          {memberName || nickname || memberId}
          <span>({providerType ? providerType : '쇼핑몰'} 아이디 회원)</span>
        </p>
      </div>
      <section className="l-panel">
        <div className="member-modification-form">
          {passwordConfig !== NOT_USED && <MemberModificationPasswordForm />}
          {memberNameConfig !== NOT_USED && <MemberModificationMemberNameForm />}
          {nicknameConfig !== NOT_USED && <MemberModificationNicknameForm />}
          {emailConfig !== NOT_USED && <MemberModificationEmailForm />}
          {mobileNoConfig !== NOT_USED && <MemberModificationSmsForm />}
          {phoneNoConfig !== NOT_USED && <MemberModificationTelephoneNumberForm />}
          {addressConfig !== NOT_USED && <MemberModificationAddressForm />}
          {birthdayConfig !== NOT_USED && <MemberModificationBirthdayForm />}
          {sexConfig !== NOT_USED && <MemberModificationSexForm />}
          <MemberModificationExtraInfosForm />
        </div>
      </section>
      <section className="l-panel">
        <div className="member-modification-form">
          <MemberModificationTermsForm />
          <div className="member-modification-form__button-wrap">
            <Button label="정보 수정" onClick={handleModifyBtnClick} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberModificationForm;

MemberModificationForm.propTypes = {
  isPasswordCheckModalOpen: bool,
};
