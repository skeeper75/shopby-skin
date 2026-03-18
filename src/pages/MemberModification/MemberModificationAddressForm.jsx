import { useEffect, useMemo } from 'react';

import {
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  useMallStateContext,
  GlobalAddressForm,
  GlobalAddressJapanForm,
  VisibleComponent,
  SelectBox,
} from '@shopby/react-components';
import { classNames, getCountriesOptions } from '@shopby/shared';

import AddressForm from '../../components/AddressForm';
import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const MemberModificationAddressForm = () => {
  const { catchError } = useErrorBoundaryActionContext();

  const {
    memberJoinConfig: { address: addressConfig },
    isGlobalForm,
  } = useMallStateContext();

  const { updateMemberModificationInfo, updateValidationStatus, setMemberModificationInfo } =
    useMemberModificationActionContext();

  const {
    memberModificationInfo: { zipCd, address, detailAddress, city, state, countryCd },
  } = useMemberModificationStateContext();

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    updateMemberModificationInfo({
      zipCd: zipCode,
      address: roadAddress,
      jibunAddress,
    });
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    updateMemberModificationInfo({ detailAddress: addressDetail });
  };

  const handleAddressChange = ({ target }) => {
    const { value, name } = target;

    updateMemberModificationInfo({
      [name]: value,
    });
  };

  const isDetailAddressEmpty = () => {
    if (!detailAddress && zipCd && address) {
      updateValidationStatus((prev) => ({ ...prev, address: { result: false, message: '상세 주소를 입력해주세요.' } }));

      return true;
    }
    updateValidationStatus((prev) => ({ ...prev, address: { result: true, message: '' } }));

    return false;
  };

  const handleAddressJpSearch = ({ address, city, town, zipCode }) => {
    setMemberModificationInfo((prev) => ({
      ...prev,
      city,
      zipCd: zipCode,
      state: town,
      address,
    }));
  };

  const handleCountryCodeChange = (event) => {
    const { value } = event.target;

    setMemberModificationInfo((prev) => ({
      ...prev,
      countryCd: value,
      telephoneNo: '',
    }));
  };

  useEffect(() => {
    isDetailAddressEmpty();
  }, [zipCd, address, detailAddress]);

  const countriesOptions = useMemo(() => getCountriesOptions(), []);

  return (
    <div className="member-modification-form__item">
      <label htmlFor="address" className="member-modification-form__tit">
        주소
        {addressConfig === REQUIRED && <div className="required"></div>}
      </label>

      <div className="member-modification-form__input-wrap">
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
                    className="global-form"
                    address={address}
                    detailAddress={detailAddress}
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
              className="global-form"
              address={address}
              detailAddress={detailAddress}
              state={state}
              city={city}
              zipCode={zipCd}
              onAddressChange={handleAddressChange}
              onDetailAddressChange={handleAddressChange}
              onStateChange={handleAddressChange}
              onCityChange={handleAddressChange}
              onZipCodeChange={handleAddressChange}
            />
          }
        />
        <ValidationStatus name="address" />
      </div>
    </div>
  );
};

export default MemberModificationAddressForm;

MemberModificationAddressForm.propTypes = {};
