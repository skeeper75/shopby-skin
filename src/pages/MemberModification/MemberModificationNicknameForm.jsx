import { useTranslation } from 'react-i18next';

import {
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  TextField,
  useMallStateContext,
} from '@shopby/react-components';

import { NICKNAME_MAX_LENGTH, REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const MemberModificationNicknameForm = () => {
  const { t } = useTranslation(['form']);

  const {
    memberJoinConfig: { nickname: nicknameConfig },
  } = useMallStateContext();

  const { verifyExistNickname, updateNewNickname, updateValidationStatus } = useMemberModificationActionContext();

  const {
    memberModificationInfo: { nickname },
    newNickname,
  } = useMemberModificationStateContext();

  const resetValidationStatus = (key) => {
    updateValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };
  const handleNicknameChange = ({ currentTarget: { value } }) => {
    const newValue = value.replace(value, value.substring(0, NICKNAME_MAX_LENGTH));
    updateNewNickname(newValue);
  };

  const isNicknameEmpty = () => {
    if (!newNickname) {
      updateValidationStatus((prev) => ({
        ...prev,
        nickname: { result: false, message: '닉네임을 입력해주세요.' },
      }));

      return true;
    }
    resetValidationStatus('nickname');

    return false;
  };

  const handleVerifyUserNickname = () => {
    if (!newNickname) {
      if (nicknameConfig === REQUIRED) {
        isNicknameEmpty();

        return;
      }
      resetValidationStatus('nickname');

      return;
    }
    if (newNickname === nickname) {
      updateValidationStatus((prev) => ({ ...prev, nickname: { result: true, message: '' } }));

      return;
    }
    verifyExistNickname(newNickname);
  };

  return (
    <div className="member-modification-form__item">
      <label htmlFor="nickname" className="member-modification-form__tit">
        {t('nickname-label')}
        {nicknameConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="member-modification-form__input-wrap">
        <TextField
          name="nickname"
          id="nickname"
          value={newNickname}
          maxLength={NICKNAME_MAX_LENGTH}
          placeholder={t('nickname-label')}
          onChange={handleNicknameChange}
          onBlur={handleVerifyUserNickname}
        />
      </div>
      <ValidationStatus name={'nickname'} />
    </div>
  );
};

export default MemberModificationNicknameForm;

MemberModificationNicknameForm.propTypes = {};
