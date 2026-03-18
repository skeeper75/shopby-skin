import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { object } from 'prop-types';

import {
  Accordion,
  EmailInput,
  PhoneNumberInput,
  SelectBox,
  TextField,
  useAuthActionContext,
  useOrderSheetActionContext,
  useOrderSheetStateContext,
  GlobalPhoneNumberInput,
  VisibleComponent,
  useMallStateContext,
} from '@shopby/react-components';
import { ParameterTypeError, getCountryCodeForRegion } from '@shopby/shared';

import { EMAIL_DOMAIN_OPTIONS } from '../../constants/form';
import { getDefaultCountryCode, getCountryPhoneNumberLength } from '../../utils';

const OrdererInfoForm = ({ refs }) => {
  const { t } = useTranslation('common');
  const {
    ordererInfo: {
      ordererName,
      emailId,
      emailDomain,
      phoneNumber,
      domainSelectorValue,
      guestInfo,
      firstName,
      lastName,
      mobileCountryCode,
      contact1,
    },
  } = useOrderSheetStateContext();
  const { updateOrdererInfo } = useOrderSheetActionContext();
  const { isSignedIn } = useAuthActionContext();
  const { exchangeTo, isGlobalForm } = useMallStateContext();

  const defaultCountryCode = getDefaultCountryCode(exchangeTo);

  useEffect(() => {
    if (!isSignedIn()) {
      const defaultMobileCountryCd = getCountryCodeForRegion(defaultCountryCode).toString();

      updateOrdererInfo({
        guestInfo: { password: '', passwordForConfirmation: '' },
        mobileCountryCd: defaultMobileCountryCd,
      });
    }
  }, []);

  const handleOrdererNameChange = ({ currentTarget: { value } }) => {
    updateOrdererInfo({ ordererName: value });
  };

  const handleEmailDomainSelect = ({ currentTarget: { value } }) => {
    updateOrdererInfo({
      emailDomain: value,
      domainSelectorValue: value,
    });
  };

  const handleEmailDomainInputChange = ({ currentTarget: { value } }) => {
    updateOrdererInfo({
      emailDomain: value,
      domainSelectorValue: '',
    });
  };

  const handleEmailIdInputChange = ({ currentTarget: { value } }) => {
    updateOrdererInfo({
      emailId: value,
    });
  };

  const handlePhoneCarrierNumberSelect = ({ currentTarget: { value: carrierNumber } }) => {
    updateOrdererInfo({ phoneNumber: { carrierNumber } });
  };

  const handleOrdererContactChange = ({ currentTarget: { name, value } }) => {
    updateOrdererInfo({
      [name]: value,
    });
  };

  const handleGlobalNameChange = ({ currentTarget: { name, value } }) => {
    const nextOrdererName = { firstName, lastName, [name]: value };

    updateOrdererInfo({
      ordererName: `${nextOrdererName.firstName} ${nextOrdererName.lastName}`,
      [name]: value,
    });
  };

  const handleOrdererRegionSelect = (_, { countryCode, regionCode, name }) => {
    updateOrdererInfo({
      mobileCountryCd: countryCode.toString(),
      mobileCountryCode: regionCode,
      [name]: '',
    });
  };

  /**
   *
   * @param {ChangeEvent} param0
   * @param {'first' | 'second'} type
   */
  const handlePhoneSerialNumberChange = ({ currentTarget: { value } }, type) => {
    if (!['FIRST', 'SECOND'].includes(type)) {
      ParameterTypeError.of({ parameterName: 'type', functionName: handlePhoneSerialNumberChange.name });
    }

    const typeByLowerCase = type.toLowerCase();

    updateOrdererInfo({ phoneNumber: { [`${typeByLowerCase}Serial`]: value } });
  };

  const handleNonMemberInfoChange = ({ currentTarget: { value } }, type) => {
    if (!['password', 'passwordForConfirmation'].includes(type)) {
      ParameterTypeError.of({ parameterName: 'type', functionName: handleNonMemberInfoChange.name });
    }

    updateOrdererInfo({ guestInfo: { [type]: value } });
  };

  const countryCode = mobileCountryCode || defaultCountryCode;

  return (
    <section className="l-panel">
      <Accordion title={t('ordererInfo', { ns: 'order' })} isOpen={true}>
        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('ordererName', { ns: 'order' })}</label>
          <VisibleComponent
            shows={isGlobalForm}
            TruthyComponent={
              <div className="flex gap-10">
                {exchangeTo === 'JPY' ? (
                  <>
                    <TextField
                      ref={refs.lastNameInputRef}
                      name="lastName"
                      value={lastName}
                      onChange={handleGlobalNameChange}
                      maxLength={20}
                      placeholder="Last Name"
                    />
                    <TextField
                      ref={refs.firstNameInputRef}
                      name="firstName"
                      value={firstName}
                      onChange={handleGlobalNameChange}
                      maxLength={20}
                      placeholder="First Name"
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      ref={refs.firstNameInputRef}
                      name="firstName"
                      value={firstName}
                      onChange={handleGlobalNameChange}
                      maxLength={20}
                      placeholder="First Name"
                    />
                    <TextField
                      ref={refs.lastNameInputRef}
                      name="lastName"
                      value={lastName}
                      onChange={handleGlobalNameChange}
                      maxLength={20}
                      placeholder="Last Name"
                    />
                  </>
                )}
              </div>
            }
            FalsyComponent={
              <TextField
                ref={refs.ordererNameInputRef}
                name="ordererName"
                value={ordererName}
                onChange={handleOrdererNameChange}
                maxLength={20}
              />
            }
          />
        </div>
        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('email')}</label>
          <EmailInput
            ref={refs.emailInputRef}
            id={emailId}
            domain={emailDomain}
            onIdChange={handleEmailIdInputChange}
            onDomainChange={handleEmailDomainInputChange}
          />
          <SelectBox
            className="order-sheet__domain-select"
            value={domainSelectorValue}
            hasEmptyOption={true}
            emptyOptionLabel={t('directInput')}
            options={EMAIL_DOMAIN_OPTIONS}
            onSelect={handleEmailDomainSelect}
          />
        </div>
        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('mobilePhoneNumber')}</label>
          <VisibleComponent
            shows={isGlobalForm}
            TruthyComponent={
              <GlobalPhoneNumberInput
                ref={refs.phoneNumberInputRef}
                name="contact1"
                countryCode={countryCode}
                value={contact1}
                onBlur={handleOrdererContactChange}
                onRegionSelect={handleOrdererRegionSelect}
                maxLength={getCountryPhoneNumberLength(countryCode).MAX}
              />
            }
            FalsyComponent={
              <PhoneNumberInput
                ref={refs.phoneNumberInputRef}
                carrierNumber={phoneNumber?.carrierNumber}
                firstSerial={phoneNumber?.firstSerial}
                secondSerial={phoneNumber?.secondSerial}
                onCarrierNumberSelect={handlePhoneCarrierNumberSelect}
                onFirstSerialChange={(e) => handlePhoneSerialNumberChange(e, 'FIRST')}
                onSecondSerialChange={(e) => handlePhoneSerialNumberChange(e, 'SECOND')}
              />
            }
          />
        </div>
        {guestInfo && (
          <>
            <div className="order-sheet__item">
              <label className="order-sheet__item-subject">{t('password')}</label>
              <TextField
                ref={refs.passwordInputRef}
                onChange={(e) => handleNonMemberInfoChange(e, 'password')}
                type="password"
                maxLength={20}
                valid={'NO_SPACE'}
              />
              <ul className="order-sheet__alert-msg">
                <li>비회원 주문 조회 시 사용할 비밀번호를 영문/숫자/특수문자 조합하여 8~20자 이내로 입력해주세요.</li>
              </ul>
            </div>
            <div className="order-sheet__item">
              <label className="order-sheet__item-subject">{t('passwordForConfirmation')}</label>
              <TextField
                ref={refs.passwordForConfirmationInputRef}
                onChange={(e) => handleNonMemberInfoChange(e, 'passwordForConfirmation')}
                type="password"
                maxLength={20}
                valid={'NO_SPACE'}
              />
              <ul className="order-sheet__alert-msg">
                <li>비회원 주문확인 시 비밀번호 확인이 필요합니다.</li>
              </ul>
            </div>
          </>
        )}
      </Accordion>
    </section>
  );
};

export default OrdererInfoForm;

OrdererInfoForm.displayName = 'OrdererInfoForm';
OrdererInfoForm.propTypes = {
  refs: object,
};
