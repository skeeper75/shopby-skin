import { useState, useMemo } from 'react';

import { string, shape, bool, object } from 'prop-types';

import {
  Checkbox,
  PhoneNumberInput,
  TextField,
  useMallStateContext,
  VisibleComponent,
  GlobalAddressForm,
  GlobalAddressJapanForm,
  GlobalPhoneNumberInput,
  SelectBox,
} from '@shopby/react-components';
import { ParameterTypeError, classNames, getCountriesOptions } from '@shopby/shared';

import { PHONE_CARRIER_NUMBERS_BY_STRING } from '../../constants/form';
import { getDefaultCountryCode, getCountryPhoneNumberLength } from '../../utils';
import AddressForm from '../AddressForm';
import { useErrorBoundaryActionContext } from '../ErrorBoundary';
const DEFAULT_CONTACT = {
  carrierNumber: '',
  firstSerial: '',
  secondSerial: '',
};

const ShippingAddressForm = ({
  refs: {
    addressNameRef,
    receiverNameRef,
    receiverFirstNameRef,
    receiverLastNameRef,
    addressFormRef,
    mobilePhoneNumberInputRef,
    phoneNumberInputRef,
    willBeSavedAsDefaultAddressRef,
    globalAddressFormRef,
    globalAddressJpFormRef,
    globalMobilePhoneNumberInputRef,
  },
  className = '',
  addressName: initialAddressName = '',
  receiverName: initialReceiverName = '',
  receiverFirstName: initialReceiverFirstName = '',
  receiverLastName: initialReceiverLastName = '',
  zipCode: initialZipCode = '',
  roadAddress: initialRoadAddress = '',
  jibunAddress: initialJibunAddress = '',
  addressDetail: initialAddressDetail = '',
  state,
  city,
  willBeSavedAsDefaultAddress: initialWillBeSavedAsDefaultAddress = false,
  mobileNumber: initialMobileNumber = {
    ...DEFAULT_CONTACT,
  },
  phoneNumber: initialPhoneNumber = {
    ...DEFAULT_CONTACT,
  },
  receiverContact1,
  receiverContact2,
  countryCd,
  receiverMobileCountryCd,
  children,
}) => {
  const { exchangeTo, isGlobalForm } = useMallStateContext();
  const defaultCountryCode = countryCd ?? getDefaultCountryCode(exchangeTo);

  const [addressName, setAddressName] = useState(initialAddressName);
  const [receiverName, setReceiverName] = useState(initialReceiverName);
  const [receiverFirstName, setReceiverFirstName] = useState(initialReceiverFirstName);
  const [receiverLastName, setReceiverLastName] = useState(initialReceiverLastName);
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [roadAddress, setRoadAddress] = useState(initialRoadAddress);
  const [jibunAddress, setJibunAddress] = useState(initialJibunAddress);
  const [addressDetail, setAddressDetail] = useState(initialAddressDetail);
  const [willBeSavedAsDefaultAddress, setWillBeSavedAsDefaultAddress] = useState(initialWillBeSavedAsDefaultAddress);
  const [mobileNumber, setMobileNumber] = useState(initialMobileNumber);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [mobileCountryCode, setMobileCountryCode] = useState(receiverMobileCountryCd ?? defaultCountryCode);

  const { catchError } = useErrorBoundaryActionContext();

  const handleAddressNameChange = ({ currentTarget: { value } }) => {
    setAddressName(value);
  };

  const handleReceiverNameChange = ({ currentTarget: { value } }) => {
    setReceiverName(value);
  };

  const handleReceiverFirstNameChange = ({ currentTarget: { value } }) => {
    setReceiverFirstName(value);
  };

  const handleReceiverLastNameChange = ({ currentTarget: { value } }) => {
    setReceiverLastName(value);
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    setAddressDetail(addressDetail);
  };

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    setZipCode(zipCode);
    setRoadAddress(roadAddress);
    setJibunAddress(jibunAddress);
  };

  const handlePhoneSerialNumberChange = ({ currentTarget: { value } }, type, isMobile = false) => {
    if (!['FIRST', 'SECOND'].includes(type)) {
      ParameterTypeError.of({ parameterName: 'type', functionName: handlePhoneSerialNumberChange.name });
    }

    const typeByLowerCase = type.toLowerCase();
    const setFunction = isMobile ? setMobileNumber : setPhoneNumber;

    setFunction((prev) => ({
      ...prev,
      [`${typeByLowerCase}Serial`]: value,
    }));
  };

  const handleCarrierNumberSelect = ({ currentTarget: { value } }, isMobile = false) => {
    const setFunction = isMobile ? setMobileNumber : setPhoneNumber;

    setFunction((prev) => ({
      ...prev,
      carrierNumber: value,
    }));
  };

  const handleSaveAsDefaultBtnClick = ({ currentTarget: { checked } }) => {
    setWillBeSavedAsDefaultAddress(checked);
  };

  const handleCountryCodeChange = (event) => {
    const { value } = event.target;

    setCountryCode(value);
    phoneNumberInputRef.current.setPhoneNumber('');
  };

  const handleMobileRegionSelect = (_, { regionCode }) => {
    setMobileCountryCode(regionCode);
    globalMobilePhoneNumberInputRef.current.setMobileNo('');
  };

  const countriesOptions = useMemo(() => getCountriesOptions(), []);

  return (
    <div className={`shipping-address-form ${className}`}>
      <div className="shipping-address-form__item">
        <label className="shipping-address-form__item--label">배송지명</label>
        <TextField ref={addressNameRef} value={addressName} onChange={handleAddressNameChange} />
      </div>
      <div className="shipping-address-form__item">
        <label className="shipping-address-form__item--label">받는 사람</label>
        <VisibleComponent
          shows={isGlobalForm}
          TruthyComponent={
            <div className="flex gap-10">
              <TextField
                ref={receiverFirstNameRef}
                name="receiverFirstName"
                value={receiverFirstName}
                onChange={handleReceiverFirstNameChange}
                maxLength={20}
                placeholder="First Name"
              />
              <TextField
                ref={receiverLastNameRef}
                name="receiverLastName"
                value={receiverLastName}
                onChange={handleReceiverLastNameChange}
                maxLength={20}
                placeholder="Last Name"
              />
            </div>
          }
          FalsyComponent={<TextField ref={receiverNameRef} value={receiverName} onChange={handleReceiverNameChange} />}
        />
      </div>
      <div className="shipping-address-form__item">
        <label className="shipping-address-form__item--label">주소</label>
        <VisibleComponent
          shows={isGlobalForm}
          TruthyComponent={
            <SelectBox
              className="select-field address-form__country-code"
              name="countryCd"
              value={countryCode}
              options={countriesOptions}
              hasEmptyOption={false}
              onSelect={handleCountryCodeChange}
            />
          }
        />

        <VisibleComponent
          shows={new Set(['KR', 'JP']).has(countryCode)}
          TruthyComponent={
            <>
              <VisibleComponent
                shows={countryCode === 'KR'}
                TruthyComponent={
                  <AddressForm
                    className={classNames({ 'global-form': isGlobalForm })}
                    ref={addressFormRef}
                    jibunAddress={jibunAddress}
                    zipCode={zipCode}
                    address={roadAddress}
                    addressDetail={addressDetail}
                    onAddressDetailChange={handleAddressDetailChange}
                    onAddressItemClick={handleAddressItemClick}
                  />
                }
              />

              <VisibleComponent
                shows={countryCode === 'JP'}
                TruthyComponent={
                  <GlobalAddressJapanForm
                    className="global-form"
                    ref={globalAddressJpFormRef}
                    address={roadAddress}
                    detailAddress={addressDetail}
                    state={state}
                    city={city}
                    zipCode={zipCode}
                    detailAddressName="addressDetail"
                    zipCodeName="zipCode"
                    onError={catchError}
                  />
                }
              />
            </>
          }
          FalsyComponent={
            <GlobalAddressForm
              className="global-form"
              ref={globalAddressFormRef}
              countryCode={countryCode}
              address={roadAddress}
              detailAddress={addressDetail}
              state={state}
              city={city}
              zipCode={zipCode}
              detailAddressName="addressDetail"
              zipCodeName="zipCode"
            />
          }
        />
      </div>
      <div className="shipping-address-form__item">
        <label className="shipping-address-form__item--label">휴대폰 번호</label>
        <VisibleComponent
          shows={isGlobalForm}
          TruthyComponent={
            <GlobalPhoneNumberInput
              ref={globalMobilePhoneNumberInputRef}
              name="contact1"
              value={receiverContact1}
              countryCode={mobileCountryCode}
              onRegionSelect={handleMobileRegionSelect}
              maxLength={getCountryPhoneNumberLength(mobileCountryCode).MAX}
            />
          }
          FalsyComponent={
            <PhoneNumberInput
              ref={mobilePhoneNumberInputRef}
              carrierNumber={mobileNumber.carrierNumber}
              firstSerial={mobileNumber.firstSerial}
              secondSerial={mobileNumber.secondSerial}
              onFirstSerialChange={(e) => handlePhoneSerialNumberChange(e, 'FIRST', true)}
              onSecondSerialChange={(e) => handlePhoneSerialNumberChange(e, 'SECOND', true)}
              onCarrierNumberSelect={(e) => handleCarrierNumberSelect(e, true)}
            />
          }
        />
      </div>
      <VisibleComponent
        shows={!isGlobalForm}
        TruthyComponent={
          <div className="shipping-address-form__item">
            <label className="shipping-address-form__item--label">전화번호</label>
            <PhoneNumberInput
              ref={phoneNumberInputRef}
              carrierNumbersByString={PHONE_CARRIER_NUMBERS_BY_STRING}
              carrierNumber={phoneNumber.carrierNumber}
              firstSerial={phoneNumber.firstSerial}
              secondSerial={phoneNumber.secondSerial}
              onFirstSerialChange={(e) => handlePhoneSerialNumberChange(e, 'FIRST')}
              onSecondSerialChange={(e) => handlePhoneSerialNumberChange(e, 'SECOND')}
              onCarrierNumberSelect={handleCarrierNumberSelect}
            />
          </div>
        }
        FalsyComponent={
          <div className="shipping-address-form__item">
            <label className="shipping-address-form__item--label">전화번호</label>
            <PhoneNumberInput
              ref={phoneNumberInputRef}
              useNormalType
              value={receiverContact2}
              maxLength={getCountryPhoneNumberLength(countryCode).MAX}
            />
          </div>
        }
      />
      <div className="shipping-address-form__item">
        <Checkbox
          ref={willBeSavedAsDefaultAddressRef}
          label="기본 배송지로 저장"
          onChange={handleSaveAsDefaultBtnClick}
          checked={willBeSavedAsDefaultAddress}
        />
      </div>
      {children}
    </div>
  );
};

export default ShippingAddressForm;

ShippingAddressForm.displayName = 'ShippingAddressForm';

ShippingAddressForm.propTypes = {
  className: string,
  addressName: string,
  receiverName: string,
  receiverFirstName: string,
  receiverLastName: string,
  zipCode: string,
  roadAddress: string,
  jibunAddress: string,
  addressDetail: string,
  willBeSavedAsDefaultAddress: bool,
  mobileNumber: shape({
    carrierNumber: string,
    firstSerial: string,
    secondSerial: string,
  }),
  phoneNumber: shape({
    carrierNumber: string,
    firstSerial: string,
    secondSerial: string,
  }),
  refs: shape({
    addressNameRef: object,
    receiverNameRef: object,
    addressFormRef: object,
    mobilePhoneNumberInputRef: object,
    phoneNumberInputRef: object,
    willBeSavedAsDefaultAddressRef: object,
  }),
  children: object,
  state: string,
  city: string,
  countryCd: string,
  receiverMobileCountryCd: string,
  receiverContact1CountryCd: string,
  receiverContact1: string,
  receiverContact2CountryCd: string,
  receiverContact2: string,
};
