import { useModalActionContext } from '@shopby/react-components';

const useAppCardValidateForm = () => {
  const { openAlert } = useModalActionContext();

  const validateForm = ({
    shippingAddressInfo: { receiverName, zipCode, roadAddress, addressDetail },
    termsStatus,
    appCardInfo,
  }) => {
    const shippingAddressInfoValidation = {
      isReceiverNameEmpty: () => {
        if (receiverName) return false;

        openAlert({
          message: '받는 사람을 입력해주세요.',
        });

        return true;
      },
      isReceiverAddressEmpty: () => {
        if (zipCode && roadAddress) return false;

        openAlert({
          message: '배송지 주소를 입력해주세요.',
        });

        return true;
      },
      isAddressDetailEmpty: () => {
        if (addressDetail) return false;

        openAlert({
          message: '상세 주소를 입력해주세요.',
        });

        return true;
      },
    };

    const appCardValidation = {
      isAppCardPaymentNotSelected: () => {
        if (appCardInfo && appCardInfo.cardCode) return false;

        openAlert({
          message: '카드를 선택해 주세요.',
        });

        return true;
      },
    };

    const termsStatusValidation = {
      isSomeRequiredTermNotChecked: () => {
        const requiredTermsStatusValues = Object.values(termsStatus).filter(({ isRequired }) => isRequired);
        if (requiredTermsStatusValues.every(({ isChecked }) => isChecked)) return false;

        openAlert({
          message: '필수 항목을 체크해 주세요.',
        });

        return true;
      },
    };

    const validations = [
      ...Object.values(shippingAddressInfoValidation),
      ...Object.values(termsStatusValidation),
      ...Object.values(appCardValidation),
    ];

    return validations.flat().every((validation) => !validation());
  };

  return {
    validateForm,
  };
};

export default useAppCardValidateForm;
