import { useState, useMemo } from 'react';

import { string, number, shape, object, oneOf, func } from 'prop-types';

import {
  Button,
  VisibleComponent,
  useModalActionContext,
  useMyShippingAddressActionContext,
} from '@shopby/react-components';
import { parsePhoneNumber } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal';
import ShippingAddressForm from '../../../components/ShippingAddressForm';

const ShippingAddressItem = ({
  refs,
  addressNo,
  addressName,
  receiverName,
  receiverZipCd,
  receiverAddress,
  receiverDetailAddress,
  receiverJibunAddress,
  receiverContact1,
  receiverContact2,
  defaultYn,
  getCheckMessageToSubmitForm,
  shippingEtcInfo,
  state: receiverState,
  city: receiverCity,
  countryCd,
  receiverMobileCountryCd,
  ...restDetail
}) => {
  const { fetchMyShippingAddress, modifyMyShippingAddress, deleteMyShippingAddress } =
    useMyShippingAddressActionContext();
  const { openConfirm, openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const [isOpen, setIsOpen] = useState(false);
  const {
    carrierNumber: mobileCarrierNumber,
    firstSerial: mobileFirstSerial,
    secondSerial: mobileSecondSerial,
  } = useMemo(() => parsePhoneNumber(receiverContact1), [receiverContact1]);
  const {
    carrierNumber: phoneCarrierNumber,
    firstSerial: phoneFirstSerial,
    secondSerial: phoneSecondSerial,
  } = useMemo(() => parsePhoneNumber(receiverContact2), [receiverContact2]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleShippingAddressFormModify = async () => {
    const {
      addressNameRef: {
        current: { value: addressName },
      },
      receiverNameRef,
      receiverFirstNameRef,
      receiverLastNameRef,
      addressFormRef,
      globalAddressFormRef,
      globalAddressJpFormRef,
      mobilePhoneNumberInputRef: { current: mobilePhoneNumberInput },
      phoneNumberInputRef: { current: phoneNumberInput },
      globalMobilePhoneNumberInputRef: { current: globalMobilePhoneNumberInput },
      willBeSavedAsDefaultAddressRef: {
        current: { checked: willBeSavedAsDefaultAddress },
      },
    } = refs;

    const receiverFirstName = receiverFirstNameRef.current?.value;
    const receiverLastName = receiverLastNameRef.current?.value;
    const receiverName = receiverNameRef.current?.value || `${receiverFirstName} ${receiverLastName}`;

    const {
      address,
      addressDetail,
      jibunAddress = '',
      zipCode,
      countryCode,
      city,
      state,
    } = Object.assign(
      {},
      addressFormRef.current?.addressForm,
      globalAddressFormRef.current?.getValue(),
      globalAddressJpFormRef.current?.getValue()
    );

    const { value: globalMobilePhoneNumber, regionCode } = Object.assign({}, globalMobilePhoneNumberInput?.getValue());

    const form = {
      ...restDetail,
      addressNo,
      addressName,
      receiverFirstName,
      receiverLastName,
      willBeSavedAsDefaultAddress,
      receiverName,
      receiverZipCd: zipCode,
      receiverJibunAddress: jibunAddress,
      receiverAddress: address,
      receiverDetailAddress: addressDetail,
      receiverContact1: mobilePhoneNumberInput?.getValue() ?? globalMobilePhoneNumber,
      receiverContact2: phoneNumberInput?.getValue() ?? '',
      receiverState: state,
      receiverCity: city,
      countryCd: countryCode,
      receiverMobileCountryCd: regionCode,
    };

    const message = getCheckMessageToSubmitForm(form);

    if (message) {
      openAlert({
        message,
      });

      return;
    }

    try {
      await modifyMyShippingAddress(form);

      openAlert({
        message: '배송지 정보가 수정되었습니다.',
        onClose: async () => {
          await fetchMyShippingAddress();

          closeModal();
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  const handleShippingAddressDelete = () => {
    openConfirm({
      message: '배송지를 삭제하시겠습니까?',
      confirmLabel: '확인',
      onConfirm: async () => {
        try {
          await deleteMyShippingAddress({
            addressNo,
          });

          await fetchMyShippingAddress();
        } catch (e) {
          catchError(e);
        }
      },
    });
  };

  return (
    <>
      <li key={addressNo} className="profile-shipping-address__list-item">
        <p className="profile-shipping-address__name">{addressName}</p>
        <p className="profile-shipping-address__receiver">{receiverName}</p>
        <p className="profile-shipping-address__zip-code">{receiverZipCd}</p>
        <p className="profile-shipping-address__base-address">{receiverAddress}</p>
        <p className="profile-shipping-address__detail-address">{receiverDetailAddress}</p>
        <p className="profile-shipping-address__mobile">{receiverContact1 ?? receiverContact2}</p>
        <VisibleComponent
          shows={defaultYn === 'Y'}
          TruthyComponent={<p className="profile-shipping-address__default-address">기본 배송지</p>}
        />
        <div className="profile-shipping-address__buttons--sm">
          <Button label="수정" onClick={() => setIsOpen(true)} />
          <Button label="삭제" onClick={() => handleShippingAddressDelete()} />
        </div>
      </li>
      <VisibleComponent
        shows={isOpen}
        TruthyComponent={
          <FullModal title="배송지 수정" onClose={() => setIsOpen(false)}>
            <ShippingAddressForm
              refs={refs}
              onClose={() => setIsOpen(false)}
              className="profile-shipping-address__form"
              addressName={addressName}
              receiverName={receiverName}
              zipCode={receiverZipCd}
              roadAddress={receiverAddress}
              jibunAddress={receiverJibunAddress}
              addressDetail={receiverDetailAddress}
              willBeSavedAsDefaultAddress={defaultYn === 'Y'}
              mobileNumber={{
                carrierNumber: mobileCarrierNumber,
                firstSerial: mobileFirstSerial,
                secondSerial: mobileSecondSerial,
              }}
              phoneNumber={{
                carrierNumber: phoneCarrierNumber,
                firstSerial: phoneFirstSerial,
                secondSerial: phoneSecondSerial,
              }}
              receiverFirstName={shippingEtcInfo?.receiverFirstName}
              receiverLastName={shippingEtcInfo?.receiverLastName}
              state={receiverState}
              city={receiverCity}
              receiverContact1={receiverContact1}
              receiverContact2={receiverContact2}
              countryCd={countryCd}
              receiverMobileCountryCd={receiverMobileCountryCd}
            >
              <div className="shipping-address-form__buttons">
                <Button theme="dark" label="취소" onClick={closeModal} />
                <Button theme="caution" label="수정" onClick={handleShippingAddressFormModify} />
              </div>
            </ShippingAddressForm>
          </FullModal>
        }
      />
    </>
  );
};

export default ShippingAddressItem;

ShippingAddressItem.propTypes = {
  addressNo: number,
  addressName: string,
  receiverName: string,
  receiverZipCd: string,
  receiverAddress: string,
  receiverJibunAddress: string,
  receiverDetailAddress: string,
  receiverContact1: string,
  receiverContact2: string,
  defaultYn: oneOf(['Y', 'N']),
  refs: shape({
    addressNameRef: object,
    receiverNameRef: object,
    addressFormRef: object,
    mobilePhoneNumberInputRef: object,
    phoneNumberInputRef: object,
  }),
  getCheckMessageToSubmitForm: func,
  shippingEtcInfo: object,
  state: string,
  city: string,
  countryCd: string,
  receiverMobileCountryCd: string,
};
