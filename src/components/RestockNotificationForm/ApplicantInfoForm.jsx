import {
  TextField,
  useRestockNotificationActionContext,
  useRestockNotificationStateContext,
} from '@shopby/react-components';
import { REG_EX_FOR_VALIDATION } from '@shopby/shared';

import { RESTOCK_NOTIFICATION_LENGTH_MAP } from '../../constants/form';

const ApplicantInfoForm = () => {
  const { name, phone } = useRestockNotificationStateContext();
  const { updateName, updatePhone } = useRestockNotificationActionContext();

  const processInputValue = ({ value, regex, maxLength }) => {
    const filteredValue = value.replace(regex, '');

    return filteredValue.substring(0, maxLength);
  };

  const handleNameChange = (e) => {
    const convertedName = processInputValue({
      value: e.target.value,
      regex: REG_EX_FOR_VALIDATION.NO_SPECIAL_SPACE,
      maxLength: RESTOCK_NOTIFICATION_LENGTH_MAP.MAX_NAME_LENGTH,
    });

    updateName(convertedName);
  };

  const handlePhoneChange = (e) => {
    const convertedPhone = processInputValue({
      value: e.target.value,
      regex: REG_EX_FOR_VALIDATION.NUMBER,
      maxLength: RESTOCK_NOTIFICATION_LENGTH_MAP.MAX_PHONE_LENGTH,
    });

    updatePhone(convertedPhone);
  };

  return (
    <section className="restock-notification-form__applicant-info">
      <div className="restock-notification-form__item">
        <label htmlFor="restock-applicant-name" className="restock-notification-form__label">
          신청자명
        </label>
        <div className="restock-notification-form__input-wrap">
          <span className="input-field input-field--sm">
            <TextField
              type="text"
              id="restock-applicant-name"
              name="applicantName"
              value={name}
              onChange={handleNameChange}
              maxLength={RESTOCK_NOTIFICATION_LENGTH_MAP.MAX_NAME_LENGTH}
            />
          </span>
        </div>
      </div>
      <div className="restock-notification-form__item">
        <label htmlFor="restock-applicant-phone" className="restock-notification-form__label">
          휴대폰번호
        </label>
        <div className="restock-notification-form__input-wrap">
          <span className="input-field input-field--sm">
            <TextField
              type="text"
              id="restock-applicant-phone"
              name="applicantPhone"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={RESTOCK_NOTIFICATION_LENGTH_MAP.MAX_PHONE_LENGTH}
            />
          </span>
        </div>
      </div>
    </section>
  );
};

ApplicantInfoForm.propTypes = {};

export default ApplicantInfoForm;
