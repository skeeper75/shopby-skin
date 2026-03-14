import { useTranslation } from 'react-i18next';

import {
  TextField,
  useSignUpActionContext,
  useSignUpStateContext,
  useMallStateContext,
} from '@shopby/react-components';

import { NICKNAME_MAX_LENGTH, REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const SignUpNicknameForm = () => {
  const { t } = useTranslation(['form']);

  const {
    memberJoinConfig: { nickname: nicknameConfig },
  } = useMallStateContext();
  const { verifyUserNickname, setSignUpMemberInfo, setValidationStatus } = useSignUpActionContext();

  const {
    signUpMemberInfo: { nickname },
  } = useSignUpStateContext();
  const resetValidationStatus = (key) => {
    setValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };
  const isNicknameEmpty = () => {
    if (!nickname) {
      setValidationStatus((prev) => ({
        ...prev,
        nickname: { result: false, message: '닉네임을 입력해주세요.' },
      }));

      return true;
    }
    resetValidationStatus('nickname');

    return false;
  };

  const handleVerifyUserNickname = () => {
    if (!nickname) {
      if (nicknameConfig === REQUIRED) {
        isNicknameEmpty();

        return;
      }
      resetValidationStatus('nickname');

      return;
    }
    verifyUserNickname();
  };

  const handleNicknameChange = (event) => {
    const { name, value } = event.target;
    const newValue = value.replace(value, value.substring(0, NICKNAME_MAX_LENGTH));
    setSignUpMemberInfo((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <div className="sign-up-form__item">
      <label htmlFor="nickname" className="sign-up-form__tit">
        {t('nickname-label')}
        {nicknameConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="sign-up-form__input-wrap">
        <TextField
          name="nickname"
          id="nickname"
          value={nickname}
          maxLength={NICKNAME_MAX_LENGTH}
          placeholder={t('nickname-label')}
          onChange={handleNicknameChange}
          onBlur={() => {
            handleVerifyUserNickname();
          }}
        />
      </div>
      <ValidationStatus name={'nickname'} />
    </div>
  );
};

export default SignUpNicknameForm;

SignUpNicknameForm.propTypes = {};
