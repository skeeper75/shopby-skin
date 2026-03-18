/* eslint-disable complexity */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { shape, object } from 'prop-types';

import {
  Accordion,
  Checkbox,
  PhoneNumberInput,
  SelectBox,
  TextField,
  useAuthActionContext,
  useMyShippingAddressActionContext,
  useMyShippingAddressStateContext,
  useOrderSheetActionContext,
  useOrderSheetStateContext,
  GlobalPhoneNumberInput,
  GlobalAddressForm,
  GlobalAddressJapanForm,
  VisibleComponent,
  useMallStateContext,
} from '@shopby/react-components';
import { parsePhoneNumber, ParameterTypeError, getCountriesOptions, classNames } from '@shopby/shared';

import AddressForm from '../../components/AddressForm';
import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { PHONE_CARRIER_NUMBERS_BY_STRING } from '../../constants/form';
import { getDefaultCountryCode, getCountryPhoneNumberLength } from '../../utils';

import useDeliveryMemoOptions from './useDeliveryMemoOptions';

const ShippingAddressInfoForm = ({
  refs: {
    receiverNameInputRef,
    addressFormRef,
    mobilePhoneNumberInputRef,
    receiverFirstNameInputRef,
    receiverLastNameInputRef,
    receiverExtraFirstNameInputRef,
    receiverExtraLastNameInputRef,
    globalAddressFormRef,
  },
}) => {
  const { t } = useTranslation(['common', 'order']);
  const { options: DELIVERY_MEMO_OPTIONS } = useDeliveryMemoOptions();
  const [deliveryMemo, setDeliveryMemo] = useState('');
  const [customDeliveryMemo, setCustomDeliveryMemo] = useState('');
  const {
    ordererInfo: {
      ordererName,
      phoneNumber: ordererPhoneNumber,
      firstName: ordererFirstName,
      lastName: ordererLastName,
      contact1: ordererContact1,
      contact2: ordererContact2,
      mobileCountryCode: ordererMobileCountryCode,
    },
    shippingAddressInfo: {
      addressNo,
      zipCode,
      roadAddress,
      receiverName,
      mobilePhoneNumber,
      phoneNumber,
      customsIdNumber,
      addressDetail,
      firstName,
      lastName,
      countryCd,
      extraFirstName,
      extraLastName,
      state,
      city,
      contact1,
      contact2,
      mobileCountryCd,
    },
    willAddressBeSaved,
    willBeSavedAsDefaultAddress,
    hasInternationalShippingProduct,
    orderSheet: { orderSheetAddress },
  } = useOrderSheetStateContext();

  const {
    updateShippingAddressInfo,
    updateWillBeSavedAsDefaultAddress,
    resetShippingAddressInfo,
    updateWillAddressBeSaved,
  } = useOrderSheetActionContext();

  const { catchError } = useErrorBoundaryActionContext();

  const { exchangeTo, isGlobalForm } = useMallStateContext();

  const { bookedAddresses } = useMyShippingAddressStateContext();
  const { isSignedIn: checkIsSignedIn } = useAuthActionContext();
  const { getShippingAddressByAddressNo } = useMyShippingAddressActionContext();
  const [isReceiverRadioChecked, setIsReceiverRadioChecked] = useState(false);
  const isSignedIn = useMemo(() => checkIsSignedIn(), []);

  const addressOptions = useMemo(
    () => [
      {
        label: '새로운 배송지',
        value: '0',
      },
      ...bookedAddresses.map(({ addressNo, addressName, receiverName }) => ({
        label: `${addressName ? `${addressName} | ` : ''}${receiverName}`,
        value: addressNo,
      })),
    ],
    [bookedAddresses]
  );

  const defaultCountryCode = getDefaultCountryCode(exchangeTo);

  const handleReceiverCheckboxChange = ({ currentTarget: { checked } }) => {
    if (checked) {
      updateShippingAddressInfo({
        receiverName: ordererName,
        mobilePhoneNumber: { ...ordererPhoneNumber },
        addressNo: 0,
        firstName: ordererFirstName,
        lastName: ordererLastName,
        contact1: ordererContact1 && ordererContact1.replace(/[^0-9]/g, ''),
        contact2: ordererContact2 && ordererContact2.replace(/[^0-9]/g, ''),
        mobileCountryCd: ordererMobileCountryCode,
        countryCd,
        roadAddress: orderSheetAddress?.memberAddress.address,
        addressDetail: orderSheetAddress?.memberAddress.detailAddress,
        zipCode: orderSheetAddress?.memberAddress.zipCd,
        state: orderSheetAddress?.memberAddress.receiverState,
        city: orderSheetAddress?.memberAddress.receiverCity,
      });
    }

    setIsReceiverRadioChecked(checked);
  };

  const handleAddressSelect = ({ currentTarget: { value } }) => {
    resetShippingAddressInfo();
    updateWillAddressBeSaved(false);
    updateWillBeSavedAsDefaultAddress(false);

    if (value === '0') return;
    const {
      addressNo,
      addressName,
      receiverName,
      receiverContact1,
      receiverContact2,
      receiverZipCd: zipCode,
      receiverDetailAddress: addressDetail,
      receiverAddress: roadAddress,
      receiverJibunAddress: jibunAddress,
      countryCd,
      state,
      city,
      shippingEtcInfo,
      receiverMobileCountryCd: mobileCountryCd,
    } = getShippingAddressByAddressNo(Number(value));

    const mobilePhoneNumber = receiverContact1 && parsePhoneNumber(receiverContact1);
    const phoneNumber = receiverContact2 && parsePhoneNumber(receiverContact2);

    updateShippingAddressInfo({
      addressNo,
      addressName,
      receiverName,
      zipCode,
      roadAddress,
      jibunAddress,
      addressDetail,
      countryCd,
      state,
      city,
      contact1: receiverContact1,
      contact2: receiverContact2,
      firstName: shippingEtcInfo?.receiverFirstName,
      lastName: shippingEtcInfo?.receiverLastName,
      mobileCountryCd,
    });

    if (mobilePhoneNumber) updateShippingAddressInfo({ mobilePhoneNumber });
    if (phoneNumber) updateShippingAddressInfo({ phoneNumber });
  };

  const handleReceiverNameChange = ({ currentTarget: { value } }) => {
    updateShippingAddressInfo({ addressNo: 0, receiverName: value });
  };

  const handlePhoneSerialNumberChange = ({ currentTarget: { value } }, type, isMobile = false) => {
    if (!['FIRST', 'SECOND'].includes(type)) {
      ParameterTypeError.of({ parameterName: 'type', functionName: handlePhoneSerialNumberChange.name });
    }

    const typeByLowerCase = type.toLowerCase();
    updateShippingAddressInfo({
      addressNo: 0,
      [isMobile ? 'mobilePhoneNumber' : 'phoneNumber']: {
        ...(isMobile ? mobilePhoneNumber : phoneNumber),
        [`${typeByLowerCase}Serial`]: value,
      },
    });
  };

  const handleCarrierNumberSelect = ({ currentTarget: { value } }, isMobile = false) => {
    updateShippingAddressInfo({
      addressNo: 0,
      [isMobile ? 'mobilePhoneNumber' : 'phoneNumber']: {
        ...(isMobile ? mobilePhoneNumber : phoneNumber),
        carrierNumber: value,
      },
    });
  };

  const handleDeliveryMemoSelect = ({ currentTarget: { value } }) => {
    if (deliveryMemo === 'DIRECT_INPUT') {
      setCustomDeliveryMemo('');
    }

    setDeliveryMemo(value);
    updateShippingAddressInfo({ deliveryMemo: value });
  };

  const handleCustomDeliveryMemoChange = ({ currentTarget: { value } }) => {
    if (deliveryMemo !== 'DIRECT_INPUT') return;

    setCustomDeliveryMemo(value);
    updateShippingAddressInfo({ deliveryMemo: value });
  };

  const handleSaveAsDefaultAddressBtnClick = ({ currentTarget: { checked } }) => {
    updateWillBeSavedAsDefaultAddress(checked);
    updateWillAddressBeSaved(checked);
  };

  const handleSaveAddressBtnClick = ({ currentTarget: { checked } }) => {
    updateWillAddressBeSaved(checked);

    if (willBeSavedAsDefaultAddress) {
      updateWillBeSavedAsDefaultAddress(false);
    }
  };

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    updateShippingAddressInfo({
      addressNo: 0,
      zipCode,
      roadAddress,
      jibunAddress,
    });
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    updateShippingAddressInfo({
      addressDetail,
    });
  };

  const handleCustomsIdNumberChange = ({ currentTarget: { value } }) => {
    updateShippingAddressInfo({ customsIdNumber: value });
  };

  const handleGlobalNameChange = ({ currentTarget: { name, value } }) => {
    const nextOrdererName = { firstName, lastName, [name]: value };

    updateShippingAddressInfo({
      receiverName: `${nextOrdererName.firstName} ${nextOrdererName.lastName}`,
      [name]: value,
    });
  };

  const handleOrdererContactChange = ({ currentTarget: { name, value } }, { regionCodeName, regionCode }) => {
    updateShippingAddressInfo({
      [name]: value,
      [regionCodeName]: regionCode,
    });
  };

  const handleOrdererRegionSelect = ({ currentTarget: { name } }, { regionCode, name: contactFieldName }) => {
    updateShippingAddressInfo({
      [name]: regionCode,
      [contactFieldName]: '',
    });
  };

  const handleAddressChange = ({ currentTarget: { name, value } }) => {
    updateShippingAddressInfo({
      [name]: value,
    });
  };

  const handleAddressJpSearch = ({ prefCode, zipCode, city, address }) => {
    updateShippingAddressInfo({
      receiverAddress: address,
      zipCode,
      city,
      state: prefCode,
    });
  };

  const handleCountryCodeChange = (event) => {
    const { value } = event.target;

    updateShippingAddressInfo({
      countryCd: value,
      contact2: '',
    });
  };

  const countriesOptions = useMemo(() => getCountriesOptions(), []);

  const mobileCountryCode = mobileCountryCd || defaultCountryCode;
  const countryCode = countryCd || defaultCountryCode;

  return (
    <section className="l-panel">
      <Accordion title={t('shippingAddressInfo', { ns: 'order' })} isOpen={true}>
        <div className="order-sheet__item">
          <SelectBox value={addressNo} options={addressOptions} onSelect={handleAddressSelect} />
        </div>
        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('receiverName', { ns: 'order' })}</label>
          <VisibleComponent
            shows={isGlobalForm}
            TruthyComponent={
              <div className="flex gap-10">
                <TextField
                  ref={receiverFirstNameInputRef}
                  name="firstName"
                  value={firstName}
                  onChange={handleGlobalNameChange}
                  maxLength={20}
                  placeholder="First Name"
                />
                <TextField
                  ref={receiverLastNameInputRef}
                  name="lastName"
                  value={lastName}
                  onChange={handleGlobalNameChange}
                  maxLength={20}
                  placeholder="Last Name"
                />
              </div>
            }
            FalsyComponent={
              <TextField ref={receiverNameInputRef} value={receiverName} onChange={handleReceiverNameChange} />
            }
          />
          <Checkbox
            label={t('isTheSameAsOrderer', { ns: 'order' })}
            onChange={handleReceiverCheckboxChange}
            checked={isReceiverRadioChecked}
          />
        </div>

        <VisibleComponent
          shows={exchangeTo === 'JPY'}
          TruthyComponent={
            <div className="order-sheet__item">
              <div>
                <label className="order-sheet__item-subject">{t('이름 읽는 법', { ns: 'order' })}</label>
                <div className="flex gap-10">
                  <TextField
                    ref={receiverExtraFirstNameInputRef}
                    name="extraFirstName"
                    value={extraFirstName}
                    onChange={handleGlobalNameChange}
                    maxLength={20}
                    placeholder="First Name"
                  />
                  <TextField
                    ref={receiverExtraLastNameInputRef}
                    name="extraLastName"
                    value={extraLastName}
                    onChange={handleGlobalNameChange}
                    maxLength={20}
                    placeholder="Last Name"
                  />
                </div>
              </div>
            </div>
          }
        />

        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('address')}</label>
          <div className="country-select-box">
            <VisibleComponent
              shows={isGlobalForm}
              TruthyComponent={
                <SelectBox
                  name="countryCd"
                  value={countryCd}
                  options={countriesOptions}
                  hasEmptyOption={false}
                  onSelect={handleCountryCodeChange}
                />
              }
            />
          </div>

          <VisibleComponent
            shows={new Set(['KR', 'JP']).has(countryCd)}
            TruthyComponent={
              <>
                <VisibleComponent
                  shows={countryCd === 'KR'}
                  TruthyComponent={
                    <AddressForm
                      className={classNames({ 'global-form': isGlobalForm })}
                      ref={addressFormRef}
                      zipCode={zipCode}
                      address={roadAddress}
                      addressDetail={addressDetail}
                      onAddressDetailChange={handleAddressDetailChange}
                      onAddressItemClick={handleAddressItemClick}
                    />
                  }
                />
                <VisibleComponent
                  shows={countryCd === 'JP'}
                  TruthyComponent={
                    <GlobalAddressJapanForm
                      ref={globalAddressFormRef}
                      className="global-form"
                      zipCodeName="zipCode"
                      addressName="receiverAddress"
                      detailAddressName="addressDetail"
                      address={roadAddress}
                      detailAddress={addressDetail}
                      state={state}
                      city={city}
                      zipCode={zipCode}
                      onSearch={handleAddressJpSearch}
                      onDetailAddressChange={handleAddressChange}
                      onError={catchError}
                    />
                  }
                />
              </>
            }
            FalsyComponent={
              <GlobalAddressForm
                ref={globalAddressFormRef}
                className="global-form"
                countryCode={countryCd}
                address={roadAddress}
                detailAddress={addressDetail}
                state={state}
                city={city}
                zipCode={zipCode}
                addressName="receiverAddress"
                detailAddressName="addressDetail"
                zipCodeName="zipCode"
                onAddressChange={handleAddressChange}
                onDetailAddressChange={handleAddressChange}
                onStateChange={handleAddressChange}
                onCityChange={handleAddressChange}
                onZipCodeChange={handleAddressChange}
              />
            }
          />
        </div>
        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('mobilePhoneNumber')}</label>
          <VisibleComponent
            shows={isGlobalForm}
            TruthyComponent={
              <GlobalPhoneNumberInput
                ref={mobilePhoneNumberInputRef}
                name="contact1"
                regionCodeName="mobileCountryCd"
                value={contact1}
                countryCode={mobileCountryCode}
                onBlur={handleOrdererContactChange}
                onRegionSelect={handleOrdererRegionSelect}
                maxLength={getCountryPhoneNumberLength(mobileCountryCode).MAX}
              />
            }
            FalsyComponent={
              <PhoneNumberInput
                ref={mobilePhoneNumberInputRef}
                carrierNumber={mobilePhoneNumber?.carrierNumber}
                firstSerial={mobilePhoneNumber?.firstSerial}
                secondSerial={mobilePhoneNumber?.secondSerial}
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
            <div className="order-sheet__item">
              <label className="order-sheet__item-subject">{t('phoneNumber')}</label>
              <PhoneNumberInput
                carrierNumbersByString={PHONE_CARRIER_NUMBERS_BY_STRING}
                carrierNumber={phoneNumber?.carrierNumber}
                firstSerial={phoneNumber?.firstSerial}
                secondSerial={phoneNumber?.secondSerial}
                onFirstSerialChange={(e) => handlePhoneSerialNumberChange(e, 'FIRST')}
                onSecondSerialChange={(e) => handlePhoneSerialNumberChange(e, 'SECOND')}
                onCarrierNumberSelect={handleCarrierNumberSelect}
              />
            </div>
          }
          FalsyComponent={
            <div className="order-sheet__item">
              <label className="order-sheet__item-subject">{t('phoneNumber')}</label>
              <PhoneNumberInput
                useNormalType
                name="contact2"
                value={contact2}
                onChange={handleAddressChange}
                maxLength={getCountryPhoneNumberLength(countryCode).MAX}
              />
            </div>
          }
        />
        <div className="order-sheet__item">
          <SelectBox value={deliveryMemo} options={DELIVERY_MEMO_OPTIONS} onSelect={handleDeliveryMemoSelect} />
          {deliveryMemo === 'DIRECT_INPUT' && (
            <TextField
              className="order-sheet__custom-memo"
              value={customDeliveryMemo}
              onChange={handleCustomDeliveryMemoChange}
              maxLength={30}
              placeholder={t('Please input your requests for delivery.', { ns: 'order' })}
            />
          )}
        </div>
        {hasInternationalShippingProduct && (
          <div className="order-sheet__item">
            <label className="order-sheet__item-subject" htmlFor="customs-id-input">
              개인통관고유부호
            </label>
            <TextField
              id={'customs-id-input'}
              value={customsIdNumber}
              onChange={handleCustomsIdNumberChange}
              maxLength={13}
              valid="ENGLISH_NUMBER"
              placeholder="P로 시작하는 13자리"
            />
            <span className="order-sheet__customs-id-issuance">
              개인통관고유부호 발급&nbsp;
              <a
                alt="link-for-customs-id-issuance"
                href="https://unipass.customs.go.kr/csp/persIndex.do"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기 &gt;
              </a>
            </span>
          </div>
        )}
        {isSignedIn && (
          <div className="order-sheet__item">
            <p>
              <Checkbox
                label={t('save as default shipping address', { ns: 'order' })}
                onChange={handleSaveAsDefaultAddressBtnClick}
                checked={willBeSavedAsDefaultAddress}
              />
            </p>
            {addressNo === 0 && (
              <p>
                <Checkbox
                  label={'배송지 관리 목록에 추가'}
                  onChange={handleSaveAddressBtnClick}
                  checked={willAddressBeSaved}
                />
              </p>
            )}
          </div>
        )}
      </Accordion>
    </section>
  );
};

ShippingAddressInfoForm.propTypes = {
  refs: shape({
    receiverNameInputRef: object,
    searchAddressBtnRef: object,
    mobilePhoneNumberInputRef: object,
    addressDetailInputRef: object,
    globalAddressFormRef: object,
  }),
};

export default ShippingAddressInfoForm;
