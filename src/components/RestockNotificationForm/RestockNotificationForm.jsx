import ApplicantInfoForm from './ApplicantInfoForm';
import PrivacyInfoAgreement from './PrivacyInfoAgreement';
import SoldOutOptionList from './SoldOutOptionList';

const RestockNotificationForm = () => (
  <div className="restock-notification-form">
    <SoldOutOptionList />
    <ApplicantInfoForm />
    <PrivacyInfoAgreement />
  </div>
);

RestockNotificationForm.propTypes = {};

export default RestockNotificationForm;
