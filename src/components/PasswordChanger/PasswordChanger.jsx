import { useState, useEffect } from 'react';

import { bool, func } from 'prop-types';

import {
  VisibleComponent,
  Button,
  useModalActionContext,
  useCheckMemberPasswordActionContext,
  useSignInActionContext,
} from '@shopby/react-components';

import useChangePassword from '../../hooks/useChangePassword';
import { useErrorBoundaryActionContext } from '../ErrorBoundary';
import { TextField, Field, FieldLabel, Divider } from '../ui';

const PasswordChanger = ({ useNextChanger = false, onSubmit, onNext }) => {
  const { changePassword } = useSignInActionContext();
  const { openAlert } = useModalActionContext();

  const { checkPassword } = useCheckMemberPasswordActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const currentPasswordChanger = useChangePassword();
  const newPasswordChanger = useChangePassword();
  const newPasswordCheckChanger = useChangePassword();

  const [isInvalidPasswordCheck, setIsInvalidPasswordCheck] = useState(false);

  const getInvalidMessage = () => {
    if (!currentPasswordChanger.password) return '현재 비밀번호를 입력해주세요.';

    if (!newPasswordChanger.password) return '새로운 비밀번호를 입력해주세요.';

    if (newPasswordChanger.password !== newPasswordCheckChanger.password)
      return '비밀번호와 비밀번호 확인 값이 일치하지 않습니다.';

    if (!newPasswordChanger.isValid) return newPasswordChanger.message;

    if (newPasswordChanger.password === currentPasswordChanger.password) {
      return '현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.';
    }

    return '';
  };

  const handleSubmit = async () => {
    newPasswordChanger.validatePassword();

    const invalidMessage = getInvalidMessage();

    if (invalidMessage) {
      openAlert({
        message: invalidMessage,
      });

      return;
    }

    try {
      await checkPassword(currentPasswordChanger.password);
      await changePassword({
        currentPassword: currentPasswordChanger.password,
        newPassword: newPasswordChanger.password,
        willChangeNextTime: false,
      });

      openAlert({
        message: '회원님의 비밀번호가 안전하게 변경되었습니다.',
        onClose: () => {
          onSubmit?.();
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  const handleNext = async () => {
    try {
      await changePassword({
        willChangeNextTime: true,
      });

      openAlert({
        message: '해당 안내는 90일 뒤에 다시 안내됩니다.',
        onClose: () => {
          onNext?.();
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    setIsInvalidPasswordCheck(newPasswordChanger.password !== newPasswordCheckChanger.password);
  }, [newPasswordChanger.password, newPasswordCheckChanger.password]);

  return (
    <>
      {/* @MX:NOTE: Huni TextField+Field로 마이그레이션 (SPEC-SKIN-002) */}
      <div className="password-changer">
        <Field className="password-changer__field">
          <FieldLabel htmlFor="current-password">현재 비밀번호</FieldLabel>
          <TextField
            id="current-password"
            className="password-changer__current"
            placeholder="현재 비밀번호"
            type="password"
            onChange={currentPasswordChanger.handleChangePassword}
          />
        </Field>
        <Divider />
        <Field className="password-changer__field">
          <FieldLabel htmlFor="new-password">새 비밀번호</FieldLabel>
          <TextField
            id="new-password"
            className="password-changer__new"
            placeholder="새 비밀번호"
            type="password"
            onChange={newPasswordChanger.handleChangePassword}
            onBlur={newPasswordChanger.validatePassword}
          />
          {!newPasswordChanger.isValid && (
            <p className="password-changer__caution text-sm text-[--huni-fg-error]">{newPasswordChanger.message}</p>
          )}
        </Field>
        <Field className="password-changer__field">
          <FieldLabel htmlFor="new-password-check">새 비밀번호 확인</FieldLabel>
          <TextField
            id="new-password-check"
            className="password-changer__new-check"
            placeholder="새 비밀번호 확인"
            type="password"
            onChange={newPasswordCheckChanger.handleChangePassword}
          />
          {isInvalidPasswordCheck && (
            <p className="password-changer__caution text-sm text-[--huni-fg-error]">비밀번호와 비밀번호 확인 값이 일치하지 않습니다.</p>
          )}
        </Field>
      </div>
      <div className="password-changer__buttons">
        <VisibleComponent
          shows={useNextChanger}
          TruthyComponent={<Button theme="dark" label="다음에 변경" onClick={handleNext} />}
        />
        <Button theme="caution" label="비밀번호 변경" onClick={handleSubmit} />
      </div>
    </>
  );
};

export default PasswordChanger;

PasswordChanger.propTypes = {
  useNextChanger: bool,
  onSubmit: func,
  onNext: func,
};
