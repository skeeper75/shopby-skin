/* eslint-disable complexity */

import { useEffect, useMemo } from 'react';

import {
  TextField,
  Button,
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  useIdentificationVerificationStateContext,
  PhoneNumberInput,
  useMallStateContext,
  GlobalPhoneNumberInput,
  VisibleComponent,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import IdentificationVerificationBtn from '../../components/IdentificationVerificationBtn/IdentificationVerificationBtn';
import Timer from '../../components/Timer';
import { REQUIRED } from '../../constants/form';
import { getDefaultCountryCode, getCountryPhoneNumberLength } from '../../utils';

import ValidationStatus from './ValidationStatus';

const MemberModificationSmsForm = () => {
  const {
    updateNewMobileNo,
    updateCertificatedNumber,
    authenticateMobile,
    confirmAuthenticationMobileNo,
    updateIsAuthenticationReSend,
    updateValidationStatus,
    updateCarrierNumber,
    updateFirstSerial,
    updateSecondSerial,
    validateMobile,
    updateMemberModificationInfo,
    setMemberModificationInfo,
  } = useMemberModificationActionContext();

  const {
    newMobileNo,
    carrierNumber,
    firstSerial,
    secondSerial,
    certificatedNumber,
    authenticationsRemainTimeBySeconds,
    isAuthenticationReSend,
    memberModificationInfo,
  } = useMemberModificationStateContext();
  const { isIdentificationVerificationReSend, isCiExist } = useIdentificationVerificationStateContext();
  const {
    mallJoinConfig: { authenticationTimeType, authenticationType },
    memberJoinConfig: { mobileNo: mobileNoConfig },
    exchangeTo,
    isGlobalForm,
  } = useMallStateContext();
  const { AUTHENTICATION_BY_PHONE, SMS_AUTHENTICATION } = AUTHENTICATION_TYPE;

  const identificationBtnLabel = isIdentificationVerificationReSend ? '재인증' : '휴대폰 본인인증';
  const authenticationBtnLabel = isAuthenticationReSend ? `재인증` : `인증번호 발송`;
  const defaultCountryCode = getDefaultCountryCode(exchangeTo);

  const resetValidationStatus = (key) => {
    updateValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const isMobileType = useMemo(() => {
    if (authenticationType === AUTHENTICATION_BY_PHONE || authenticationType === SMS_AUTHENTICATION) {
      return true;
    }

    return false;
  }, [authenticationType]);

  const isMobileRequired = useMemo(() => {
    const isMobileAuthentication = isMobileType && authenticationTimeType === 'JOIN_TIME';

    if (mobileNoConfig === REQUIRED || isMobileAuthentication) {
      return true;
    }

    return false;
  }, [authenticationTimeType, isMobileType]);

  const isMobileNoEmpty = () => {
    if (!carrierNumber || !firstSerial || !secondSerial) {
      updateValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message: '휴대폰 번호를 입력해주세요.' },
      }));

      return true;
    }
    resetValidationStatus('mobileNo');

    return false;
  };

  const handlePhoneCarrierNumberSelect = ({ currentTarget: { value } }) => {
    updateCarrierNumber(value);
    updateNewMobileNo(`${value}${firstSerial}${secondSerial}`);
  };

  const handlePhoneFirstSerialNumberChange = ({ currentTarget: { value } }) => {
    updateFirstSerial(value);
    updateNewMobileNo(`${carrierNumber}${value}${secondSerial}`);
  };

  const handlePhoneSecondSerialNumberChange = ({ currentTarget: { value } }) => {
    updateSecondSerial(value);
    updateNewMobileNo(`${carrierNumber}${firstSerial}${value}`);
  };

  const handleCertificatedNumber = ({ currentTarget: { value } }) => {
    updateCertificatedNumber(value);
  };

  const handleOnSecondSerialBlur = () => {
    if (!firstSerial && !secondSerial) {
      if (isMobileRequired) {
        isMobileNoEmpty();

        return;
      }
      resetValidationStatus('mobileNo');

      return;
    }
    validateMobile();
  };

  const handleSetNewPhoneNumber = (newNumber) => {
    updateNewMobileNo(newNumber);
    updateCarrierNumber(newNumber.slice(0, 3));
    updateFirstSerial(newNumber.slice(3, 7));
    updateSecondSerial(newNumber.slice(7));
  };

  const handleUpdateNewMemberModificationInfo = ({ birthday, name, sexCode, ...rest }) => {
    updateMemberModificationInfo({ birthday, memberName: name, sex: sexCode === '01' ? 'M' : 'F', ...rest });
  };

  const handleAuthenticateMobile = (newMobileNo) => {
    if (!validateMobile()) {
      return;
    }
    authenticateMobile(newMobileNo);
  };

  const handleGlobalMobileNoChange = ({ target: { value, name } }, { regionCode }) => {
    let validationStatus = { result: true, message: '' };
    const { MAX: maxLength, MIN: minLength } = getCountryPhoneNumberLength(regionCode);

    if (value.length < minLength && value.length < maxLength) {
      validationStatus = {
        result: false,
        message: `휴대폰번호는 ${minLength}자~${maxLength}자 이내로 입력해주세요.`,
      };
    }

    if (!value.length) {
      validationStatus = {
        result: false,
        message: '휴대폰 번호를 입력해주세요.',
      };
    }

    updateValidationStatus((prev) => ({
      ...prev,
      mobileNo: validationStatus,
    }));

    updateNewMobileNo(value);
    setMemberModificationInfo((prev) => ({ ...prev, mobileCountryCode: regionCode, [name]: value }));
  };

  const handleRegionSelect = ({ target: { name } }, { countryCode, regionCode }) => {
    setMemberModificationInfo((prev) => ({
      ...prev,
      [name]: countryCode.toString(),
      mobileCountryCode: regionCode,
      mobileNo: '',
    }));
    updateNewMobileNo('');
  };

  useEffect(() => {
    updateValidationStatus((prev) => ({
      ...prev,
      mobileNo: isCiExist
        ? { result: false, message: '휴대폰 번호가 이미 사용중입니다.' }
        : { result: true, message: '' },
    }));
  }, [isCiExist]);

  const isSmsAuthentication = useMemo(() => {
    if (authenticationType === SMS_AUTHENTICATION && authenticationsRemainTimeBySeconds) {
      return true;
    }

    return false;
  }, [authenticationType, authenticationsRemainTimeBySeconds]);

  const isSocialMember = useMemo(() => !!memberModificationInfo?.providerType, [memberModificationInfo?.providerType]);

  return (
    <>
      <div className="member-modification-form__item">
        <label htmlFor="mobileNo" className="member-modification-form__tit">
          휴대폰번호
          {isMobileRequired && <div className="required"></div>}
        </label>
        <div className="member-modification-form__input-wrap">
          <VisibleComponent
            shows={isGlobalForm}
            TruthyComponent={
              <GlobalPhoneNumberInput
                value={memberModificationInfo.mobileNo}
                countryCode={memberModificationInfo.mobileCountryCode || defaultCountryCode}
                name="mobileNo"
                regionCodeName="mobileCountryCd"
                onBlur={handleGlobalMobileNoChange}
                onRegionSelect={handleRegionSelect}
                maxLength={
                  getCountryPhoneNumberLength(memberModificationInfo.mobileCountryCode || defaultCountryCode).MAX
                }
              />
            }
            FalsyComponent={
              <PhoneNumberInput
                name="mobileNo"
                id="mobileNo"
                carrierNumber={carrierNumber}
                firstSerial={firstSerial}
                secondSerial={secondSerial}
                onCarrierNumberSelect={handlePhoneCarrierNumberSelect}
                onFirstSerialChange={handlePhoneFirstSerialNumberChange}
                onSecondSerialChange={handlePhoneSecondSerialNumberChange}
                onSecondSerialBlur={handleOnSecondSerialBlur}
                carrierNumberDisabled={!isSocialMember && isMobileType && isAuthenticationReSend}
                firstSerialDisabled={!isSocialMember && isMobileType && isAuthenticationReSend}
                secondSerialDisabled={!isSocialMember && isMobileType && isAuthenticationReSend}
              />
            }
          />
        </div>
        {!isSocialMember && authenticationType === SMS_AUTHENTICATION && (
          <Button
            className="member-modification-form__btn--certificate"
            label={authenticationBtnLabel}
            onClick={() => {
              isAuthenticationReSend ? updateIsAuthenticationReSend(false) : handleAuthenticateMobile(newMobileNo);
            }}
          />
        )}
        {!isSocialMember && authenticationType === AUTHENTICATION_BY_PHONE && (
          <>
            <IdentificationVerificationBtn
              className="member-modification-form__btn--certificate"
              label={identificationBtnLabel}
              type="memberModify"
              onSetNewPhoneNumber={handleSetNewPhoneNumber}
              onUpdateMemberModificationInfo={handleUpdateNewMemberModificationInfo}
            />
            <ValidationStatus name="certificatedNumber" />
          </>
        )}
        <ValidationStatus name="mobileNo" />
      </div>

      {!isSocialMember && isSmsAuthentication && (
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
              confirmAuthenticationMobileNo(certificatedNumber);
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

export default MemberModificationSmsForm;
