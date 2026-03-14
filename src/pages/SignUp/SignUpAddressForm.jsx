import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { shape, object } from 'prop-types';

import {
  useMallStateContext,
  useSignUpActionContext,
  useSignUpStateContext,
  GlobalAddressForm,
  GlobalAddressJapanForm,
  VisibleComponent,
  SelectBox,
} from '@shopby/react-components';
import { classNames, getCountriesOptions } from '@shopby/shared';

import AddressForm from '../../components/AddressForm';
import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { REQUIRED } from '../../constants/form';
import { getDefaultCountryCode } from '../../utils';

import ValidationStatus from './ValidationStatus';
const SignUpAddressForm = ({ refs: { globalAddressRef, globalAddressJpRef } }) => {
  const { t } = useTranslation(['form']);
  const {
    memberJoinConfig: { address: addressConfig },
    exchangeTo,
    isGlobalForm,
  } = useMallStateContext();
  const { catchError } = useErrorBoundaryActionContext();

  const { setSignUpMemberInfo, setValidationStatus } = useSignUpActionContext();
  const {
    signUpMemberInfo: { zipCd, address, detailAddress, city, state, countryCd },
  } = useSignUpStateContext();

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    setSignUpMemberInfo((prev) => ({
      ...prev,
      zipCd: zipCode,
      address: roadAddress,
      jibunAddress,
    }));
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    setSignUpMemberInfo((prev) => ({ ...prev, detailAddress: addressDetail }));
  };

  const handleAddressChange = ({ target }) => {
    const { value, name } = target;

    setSignUpMemberInfo((prev) => ({ ...prev, [name]: value }));
  };

  const isAddressDetailEmpty = () => {
    if (!detailAddress && zipCd && address) {
      setValidationStatus((prev) => ({ ...prev, address: { result: false, message: '상세 주소를 입력해주세요.' } }));

      return true;
    }
    setValidationStatus((prev) => ({ ...prev, address: { result: true, message: '' } }));

    return false;
  };

  const handleAddressJpSearch = ({ address, city, zipCode, prefCode }) => {
    setSignUpMemberInfo((prev) => ({
      ...prev,
      city,
      zipCd: zipCode,
      state: prefCode,
      address,
    }));
  };

  const handleCountryCodeChange = (event) => {
    const { value } = event.target;

    setSignUpMemberInfo((prev) => ({ ...prev, countryCd: value, phoneNo: '' }));
  };

  useEffect(() => {
    isAddressDetailEmpty();
  }, [zipCd, address, detailAddress]);

  useEffect(() => {
    const countryCode = getDefaultCountryCode(exchangeTo);

    setSignUpMemberInfo((prev) => ({ ...prev, countryCd: countryCode }));
  }, [exchangeTo]);

  const countriesOptions = useMemo(() => getCountriesOptions(), []);

  return (
    <div className="sign-up-form__item">
      <label htmlFor="address" className="sign-up-form__tit">
        {t('address-label')}
        {addressConfig === REQUIRED && <div className="required"></div>}
      </label>

      <div className="sign-up-form__input-wrap">
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
                    className={classNames({ 'global-form': isGlobalForm })}
                    zipCode={zipCd}
                    address={address}
                    addressDetail={detailAddress}
                    onAddressItemClick={handleAddressItemClick}
                    onAddressDetailChange={handleAddressDetailChange}
                  />
                }
              />

              <VisibleComponent
                shows={countryCd === 'JP'}
                TruthyComponent={
                  <GlobalAddressJapanForm
                    className={classNames({ 'global-form': isGlobalForm })}
                    ref={globalAddressJpRef}
                    address={address}
                    addressDetail={detailAddress}
                    state={state}
                    city={city}
                    zipCode={zipCd}
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
              className={classNames({ 'global-form': isGlobalForm })}
              ref={globalAddressRef}
              address={address}
              addressDetail={detailAddress}
              state={state}
              city={city}
              zipCode={zipCd}
              countryCode={countryCd}
              countryCodeName="countryCd"
              onAddressChange={handleAddressChange}
              onDetailAddressChange={handleAddressChange}
              onStateChange={handleAddressChange}
              onCityChange={handleAddressChange}
              onZipCodeChange={handleAddressChange}
            />
          }
        />
      </div>
      <ValidationStatus name="address" />
    </div>
  );
};

export default SignUpAddressForm;

SignUpAddressForm.propTypes = {
  refs: shape({
    globalAddressRef: object,
  }),
};
