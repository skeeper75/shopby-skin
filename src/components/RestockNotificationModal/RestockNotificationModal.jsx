import PropTypes from 'prop-types';

import {
  Button,
  useModalActionContext,
  useRestockNotificationActionContext,
  useRestockNotificationStateContext,
} from '@shopby/react-components';
import {
  APPLICANT_NAME_VALIDATE_TYPE,
  APPLICANT_PHONE_VALIDATE_TYPE,
  PRIVACY_INFO_AGREEMENT_VALIDATE_TYPE,
  NOTICE_TYPE,
  SELECTED_OPTION_NOS_VALIDATE_TYPE,
  REG_EX_FOR_VALIDATION,
} from '@shopby/shared';

import { RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE, RESTOCK_NOTIFICATION_LENGTH_MAP } from '../../constants/form';
import FullModal from '../FullModal';
import RestockNotificationForm from '../RestockNotificationForm';

const restockNotificationFormVerifyMap = {
  selectedOptionNos: (values = []) => {
    const isNotSelectedAnyOptions = values.length < 1;

    if (isNotSelectedAnyOptions) {
      return {
        message:
          RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE.SELECTED_OPTION_NOS[
            SELECTED_OPTION_NOS_VALIDATE_TYPE.NOT_SELECTED
          ],
        isValid: false,
      };
    }

    return {
      message: '',
      isValid: true,
    };
  },
  name: (value = '') => {
    if (!value) {
      return {
        message: RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE.NAME[APPLICANT_NAME_VALIDATE_TYPE.NOT_WRITTEN],
        isValid: false,
      };
    }

    const isInvalidNameFormat = value.match(REG_EX_FOR_VALIDATION.NO_SPECIAL_SPACE);

    if (isInvalidNameFormat) {
      return {
        message: RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE.NAME[APPLICANT_NAME_VALIDATE_TYPE.INVALID_FORMAT],
        isValid: false,
      };
    }

    const isInvalidNameLength = value.length > RESTOCK_NOTIFICATION_LENGTH_MAP.MAX_NAME_LENGTH;

    if (isInvalidNameLength) {
      return {
        message: RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE.NAME[APPLICANT_NAME_VALIDATE_TYPE.LENGTH_IS_INVALID],
        isValid: false,
      };
    }

    return {
      message: '',
      isValid: true,
    };
  },
  phone: (value = '') => {
    if (!value) {
      return {
        message: RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE.PHONE[APPLICANT_PHONE_VALIDATE_TYPE.NOT_WRITTEN],
        isValid: false,
      };
    }

    const isInvalidPhoneFormat = value.match(REG_EX_FOR_VALIDATION.NUMBER);

    if (isInvalidPhoneFormat) {
      return {
        message: RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE.PHONE[APPLICANT_PHONE_VALIDATE_TYPE.INVALID_FORMAT],
        isValid: false,
      };
    }

    const isInvalidPhoneLength =
      value.length < RESTOCK_NOTIFICATION_LENGTH_MAP.MIN_PHONE_LENGTH ||
      value.length > RESTOCK_NOTIFICATION_LENGTH_MAP.MAX_PHONE_LENGTH;

    if (isInvalidPhoneLength) {
      return {
        message: RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE.PHONE[APPLICANT_PHONE_VALIDATE_TYPE.LENGTH_IS_INVALID],
        isValid: false,
      };
    }

    return {
      message: '',
      isValid: true,
    };
  },
  privacyInfoAgreement: (value = false) => {
    if (!value) {
      return {
        message:
          RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE.PRIVACY_INFO_AGREEMENT[
            PRIVACY_INFO_AGREEMENT_VALIDATE_TYPE.NOT_SELECTED
          ],
        isValid: false,
      };
    }

    return {
      message: '',
      isValid: true,
    };
  },
};

const RestockNotificationModal = ({ onClose }) => {
  const { postProductsRestock } = useRestockNotificationActionContext();
  const { name, phone, selectedOptionNos, privacyInfoAgreement } = useRestockNotificationStateContext();
  const { resetNotificationFormData } = useRestockNotificationActionContext();

  const { openAlert } = useModalActionContext();

  const validateRestockNotificationForm = (request) => {
    const errors = Object.keys(restockNotificationFormVerifyMap)?.map((key) => {
      const { message, isValid } = restockNotificationFormVerifyMap[key](request[key]);

      return {
        field: key,
        message,
        isValid,
      };
    });

    return errors.filter((error) => !error.isValid);
  };

  const handleClose = () => {
    resetNotificationFormData();

    onClose();
  };

  const handleSubmit = async () => {
    const request = {
      name,
      phone,
      selectedOptionNos,
      privacyInfoAgreement,
    };

    const invalidRequest = validateRestockNotificationForm(request);

    if (invalidRequest?.length) {
      const [error] = invalidRequest;

      openAlert({
        message: error.message,
      });

      return;
    }

    try {
      const res = await postProductsRestock({ name, phone, optionNos: selectedOptionNos, privacyInfoAgreement });

      if (res.status === 204) {
        openAlert({
          message: RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE.SUCCESS[NOTICE_TYPE.SUCCESS],
          onClose: handleClose,
        });
      }
    } catch ({ error }) {
      const detail = error?.serverError?.result?.detail;

      Object.values(detail).forEach((value) => {
        openAlert({
          message: value,
        });
      });
    }
  };

  return (
    <FullModal title="상품 재입고 알림 신청" className="restock-notification__modal" onClose={handleClose}>
      <div className="restock-notification">
        <RestockNotificationForm />
        <div className="restock-notification__btn-wrap">
          <Button className="restock-notification__cancel-btn" theme="dark" label="취소" onClick={handleClose} />
          <Button className="restock-notification__submit-btn" theme="caution" label="저장" onClick={handleSubmit} />
        </div>
      </div>
    </FullModal>
  );
};

RestockNotificationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default RestockNotificationModal;
