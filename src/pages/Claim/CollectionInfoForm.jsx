import { useMemo } from 'react';

import { shape, object } from 'prop-types';

import {
  PhoneNumberInput,
  Radio,
  SelectBox,
  TextField,
  useClaimActionContext,
  useClaimStateContext,
  useMallStateContext,
  useModalActionContext,
  useNextActionActionContext,
  VisibleComponent,
  GlobalAddressForm,
  GlobalAddressJapanForm,
  GlobalPhoneNumberInput,
} from '@shopby/react-components';
import { getCountriesOptions } from '@shopby/shared';

import AddressForm from '../../components/AddressForm';
import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import {
  DELIVERY_COMPANY_OPTIONS,
  DELIVERY_MEMO_MAX_LENGTH,
  INVOICE_NO_MAX_LENGTH,
  NAME_INPUT_MAX_LENGTH,
  PHONE_CARRIER_NUMBERS_BY_STRING,
  PHONE_NUMBER_INPUT_SECTIONS,
  RETURN_WAY_OPTIONS,
} from '../../constants/form';

const CollectionInfoForm = ({ refs }) => {
  const { receiverNameInputRef, searchZipCodeBtnRef, mobilePhoneNumberInputRef, phoneNumberInputRef } = refs ?? {};

  const {
    claimInfo,
    returnWay,
    returnAddress: {
      receiverName,
      receiverContact1,
      receiverContact2,
      receiverZipCd,
      receiverAddress,
      receiverDetailAddress,
      deliveryMemo,
      countryCd,
      receiverCity,
      receiverState,
      receiverFirstName,
      receiverLastName,
      receiverMobileCountryCd,
    },
    buyerReturnInfo: { deliveryCompany, invoiceNo },
  } = useClaimStateContext();
  const { mallName, isGlobalForm, exchangeTo } = useMallStateContext();
  const { openAlert } = useModalActionContext();
  const { checkNextActionStatus } = useNextActionActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const isMallShippingArea = claimInfo.originalOption?.shippingAreaType === 'MALL_SHIPPING_AREA';

  const { updateReturnWay, updateReturnAddress, updateBuyerReturnInfo } = useClaimActionContext();

  const returnWarehouse = useMemo(() => {
    const { receiverName = '', contact = '', summary = '' } = claimInfo?.returnWarehouse ?? {};

    return {
      receiverName,
      contact: contact ? contact : '-',
      summary,
    };
  }, [claimInfo]);

  const handleReceiverNameTextFieldChange = ({ currentTarget: { value } }) => {
    updateReturnAddress({ receiverName: value });
  };

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    updateReturnAddress({ receiverDetailAddress: '' });
    updateReturnAddress({ receiverZipCd: zipCode, receiverAddress: roadAddress, receiverJibunAddress: jibunAddress });
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    updateReturnAddress({ receiverDetailAddress: addressDetail });
  };

  const handleMobilePhoneNumberChange = ({ currentTarget: { value } }, type) => {
    if (PHONE_NUMBER_INPUT_SECTIONS.includes(type)) {
      updateReturnAddress({
        receiverContact1: {
          [type]: value,
        },
      });
    }
  };

  const handlePhoneNumberChange = ({ currentTarget: { value } }, type) => {
    if (PHONE_NUMBER_INPUT_SECTIONS.includes(type)) {
      updateReturnAddress({
        receiverContact2: {
          [type]: value,
        },
      });
    }
  };

  const handleDeliveryMemoTextFieldChange = ({ currentTarget: { value: deliveryMemo } }) => {
    updateReturnAddress({ deliveryMemo });
  };

  const handleDeliveryCompanySelect = ({ currentTarget: { value: deliveryCompany } }) => {
    updateBuyerReturnInfo({ deliveryCompany });
  };

  const handleInvoiceNoTextFieldChange = ({ currentTarget: { value: invoiceNo } }) => {
    updateBuyerReturnInfo({ invoiceNo });
  };

  const handleReturnWayChange = (value) => {
    const { data } = checkNextActionStatus({
      pgType: claimInfo.payType,
      nextActionType: 'RETURN',
      returnWay: value,
    });

    if (data?.canDoNextAction) {
      updateReturnWay(value);
    } else {
      data?.reason &&
        openAlert({
          message: data.reason,
        });
    }
  };

  const handleCountryCodeChange = (event) => {
    const { value } = event.target;

    updateReturnAddress({
      countryCd: value,
    });
  };

  const handleGlobalNameChange = ({ currentTarget: { name, value } }) => {
    const nameInfo = { receiverFirstName, receiverLastName, [name]: value };

    const memberName =
      exchangeTo === 'JPY'
        ? `${nameInfo.receiverLastName}${nameInfo.receiverFirstName}`
        : `${nameInfo.receiverFirstName}${nameInfo.receiverLastName}`;

    updateReturnAddress({
      [name]: value,
      receiverName: memberName,
    });
  };

  const handleReturnAddressChange = ({ currentTarget: { name, value } }) => {
    updateReturnAddress({
      [name]: value,
    });
  };

  const handleAddressJpSearch = ({ prefCode, zipCode, city, address }) => {
    updateReturnAddress({
      receiverAddress: address,
      receiverZipCd: zipCode,
      receiverCity: city,
      receiverState: prefCode,
    });
  };

  const returnType = useMemo(() => {
    if (claimInfo.payType === 'NAVER_PAY') {
      return 'BUYER_DIRECT_RETURN';
    }

    return returnWay;
  }, [returnWay, claimInfo.payType]);

  const countriesOptions = useMemo(() => getCountriesOptions(), []);

  return (
    <section className="claim__section claim__section--no-padding claim__address">
      <p className="claim__title">반품 수거 정보</p>
      <div className="claim__address-form">
        <div className="claim__address-form-item">
          <p className="claim__address-form-title">반품 수거 방법</p>
          <div className="claim__radio-wrap">
            {RETURN_WAY_OPTIONS.map((option) => (
              <Radio
                key={option.value}
                className={`claim__radio${option.value === returnWay ? ' claim__radio--checked' : ''}`}
                name="collection-method"
                {...option}
                checked={option.value === returnType}
                onClick={() => handleReturnWayChange(option.value)}
                onChange={() => handleReturnWayChange(option.value)}
              />
            ))}
          </div>
        </div>

        {returnType === 'SELLER_COLLECT' && (
          <>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">반품자명</p>
              <VisibleComponent
                shows={isGlobalForm}
                TruthyComponent={
                  <div className="flex gap-10">
                    <TextField
                      name="receiverFirstName"
                      value={receiverFirstName}
                      onChange={handleGlobalNameChange}
                      maxLength={20}
                      placeholder="First Name"
                    />
                    <TextField
                      name="receiverLastName"
                      value={receiverLastName}
                      onChange={handleGlobalNameChange}
                      maxLength={20}
                      placeholder="Last Name"
                    />
                  </div>
                }
                FalsyComponent={
                  <TextField
                    ref={receiverNameInputRef}
                    value={receiverName}
                    onChange={handleReceiverNameTextFieldChange}
                    maxLength={NAME_INPUT_MAX_LENGTH}
                  />
                }
              />
            </div>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">수거지 주소</p>
              <VisibleComponent
                shows={isGlobalForm}
                TruthyComponent={
                  <SelectBox
                    className="select-field address-form__country-code"
                    name="countryCd"
                    value={countryCd}
                    options={countriesOptions}
                    hasEmptyOption={false}
                    onSelect={handleCountryCodeChange}
                  />
                }
              />

              <VisibleComponent
                shows={new Set(['KR', 'JP']).has(countryCd)}
                TruthyComponent={
                  <>
                    <VisibleComponent
                      shows={countryCd === 'KR'}
                      TruthyComponent={
                        <AddressForm
                          ref={searchZipCodeBtnRef}
                          zipCode={receiverZipCd}
                          address={receiverAddress}
                          addressDetail={receiverDetailAddress}
                          onAddressItemClick={handleAddressItemClick}
                          onAddressDetailChange={handleAddressDetailChange}
                        />
                      }
                    />
                    <VisibleComponent
                      shows={countryCd === 'JP'}
                      TruthyComponent={
                        <GlobalAddressJapanForm
                          className="global-form"
                          zipCodeName="receiverZipCd"
                          addressName="receiverAddress"
                          detailAddressName="receiverDetailAddress"
                          cityName="receiverCity"
                          stateName="receiverState"
                          address={receiverAddress}
                          detailAddress={receiverDetailAddress}
                          state={receiverState}
                          city={receiverCity}
                          zipCode={receiverZipCd}
                          onSearch={handleAddressJpSearch}
                          onDetailAddressChange={handleReturnAddressChange}
                          onError={catchError}
                        />
                      }
                    />
                  </>
                }
                FalsyComponent={
                  <GlobalAddressForm
                    className="global-form"
                    countryCode={countryCd}
                    address={receiverAddress}
                    detailAddress={receiverDetailAddress}
                    state={receiverState}
                    city={receiverCity}
                    zipCode={receiverZipCd}
                    zipCodeName="receiverZipCd"
                    addressName="receiverAddress"
                    detailAddressName="receiverDetailAddress"
                    cityName="receiverCity"
                    stateName="receiverState"
                    onAddressChange={handleReturnAddressChange}
                    onDetailAddressChange={handleReturnAddressChange}
                    onStateChange={handleReturnAddressChange}
                    onCityChange={handleReturnAddressChange}
                    onZipCodeChange={handleReturnAddressChange}
                  />
                }
              />
            </div>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">휴대폰 번호</p>
              <VisibleComponent
                shows={isGlobalForm}
                TruthyComponent={
                  <GlobalPhoneNumberInput
                    ref={mobilePhoneNumberInputRef}
                    name="receiverContact1"
                    regionCodeName="receiverMobileCountryCd"
                    value={receiverContact1}
                    countryCode={receiverMobileCountryCd}
                    onBlur={handleReturnAddressChange}
                    onRegionSelect={handleReturnAddressChange}
                  />
                }
                FalsyComponent={
                  <PhoneNumberInput
                    ref={mobilePhoneNumberInputRef}
                    carrierNumber={receiverContact1?.carrierNumber}
                    firstSerial={receiverContact1?.firstSerial}
                    secondSerial={receiverContact1?.secondSerial}
                    onCarrierNumberSelect={(e) => handleMobilePhoneNumberChange(e, 'carrierNumber')}
                    onFirstSerialChange={(e) => handleMobilePhoneNumberChange(e, 'firstSerial')}
                    onSecondSerialChange={(e) => handleMobilePhoneNumberChange(e, 'secondSerial')}
                  />
                }
              />
            </div>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">전화 번호</p>
              <VisibleComponent
                shows={isGlobalForm}
                TruthyComponent={
                  <PhoneNumberInput
                    useNormalType
                    name="receiverContact2"
                    value={receiverContact2}
                    onChange={handleReturnAddressChange}
                  />
                }
                FalsyComponent={
                  <PhoneNumberInput
                    ref={phoneNumberInputRef}
                    carrierNumbersByString={PHONE_CARRIER_NUMBERS_BY_STRING}
                    carrierNumber={receiverContact2?.carrierNumber}
                    firstSerial={receiverContact2?.firstSerial}
                    secondSerial={receiverContact2?.secondSerial}
                    onCarrierNumberSelect={(e) => handlePhoneNumberChange(e, 'carrierNumber')}
                    onFirstSerialChange={(e) => handlePhoneNumberChange(e, 'firstSerial')}
                    onSecondSerialChange={(e) => handlePhoneNumberChange(e, 'secondSerial')}
                  />
                }
              />
            </div>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">수거 시 참고 사항</p>
              <TextField
                placeholder="수거 시 요청사항을 입력해주세요."
                value={deliveryMemo}
                onChange={handleDeliveryMemoTextFieldChange}
                maxLength={DELIVERY_MEMO_MAX_LENGTH}
              />
            </div>
          </>
        )}

        {returnType === 'BUYER_DIRECT_RETURN' && (
          <>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">반품 주소지</p>
              <dl className="claim__return-address">
                <dt>이름</dt>
                <dd>{isMallShippingArea ? mallName : returnWarehouse.receiverName}</dd>
                <dt>주소</dt>
                <dd>{returnWarehouse.summary}</dd>
                <dt>전화번호</dt>
                <dd>{returnWarehouse.contact}</dd>
              </dl>
            </div>
            <div className="claim__address-form-item ">
              <p className="claim__address-form-title">반품 접수 정보</p>
              <SelectBox
                className="claim__select-box"
                hasEmptyOption={true}
                emptyOptionLabel="택배사를 선택하세요"
                options={DELIVERY_COMPANY_OPTIONS}
                value={deliveryCompany}
                onSelect={handleDeliveryCompanySelect}
              />
              <TextField
                placeholder="송장번호"
                value={invoiceNo}
                maxLength={INVOICE_NO_MAX_LENGTH}
                onChange={handleInvoiceNoTextFieldChange}
                valid={'NUMBER'}
              />
              <p className="claim__address-form-tip">※ 반품 접수 정보 입력은 필수가 아닙니다.</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CollectionInfoForm;

CollectionInfoForm.propTypes = {
  refs: shape({
    receiverNameInputRef: object,
    searchZipCodeBtnRef: object,
    mobilePhoneNumberInputRef: object,
    phoneNumberInputRef: object,
  }),
};
