import { useTranslation } from 'react-i18next';

import { useMallStateContext, useSignUpStateContext, useSignUpActionContext, Radio } from '@shopby/react-components';

import { REQUIRED, SEX_SELECT_OPTIONS } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const SignUpSexForm = () => {
  const { t } = useTranslation(['form']);

  const {
    memberJoinConfig: { sex: sexConfig },
  } = useMallStateContext();

  const { setSignUpMemberInfo, setValidationStatus } = useSignUpActionContext();

  const {
    signUpMemberInfo: { sex },
  } = useSignUpStateContext();

  const resetValidationStatus = (key) => {
    setValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const validateSex = (sexSelect) => {
    if (sexConfig === REQUIRED && sexSelect !== 'M' && sexSelect !== 'F') {
      setValidationStatus((prev) => ({ ...prev, sex: { result: false, message: '성별을 선택해주세요.' } }));

      return false;
    }
    resetValidationStatus('sex');

    return true;
  };
  const handleSexSelect = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, sex: event.target.value }));
    validateSex(event.target.value);
  };

  return (
    <div className="sign-up-form__item">
      <label htmlFor="sex" className="sign-up-form__tit">
        {t('sex-label')}
        {sexConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="sign-up-form__input-wrap">
        <div className="sex-input">
          {SEX_SELECT_OPTIONS.map(({ label, value }) => (
            <Radio
              label={label}
              key={value}
              name={'sex'}
              value={value}
              checked={sex === value}
              onChange={handleSexSelect}
            />
          ))}
        </div>
      </div>
      <ValidationStatus name={'sex'} />
    </div>
  );
};

export default SignUpSexForm;
