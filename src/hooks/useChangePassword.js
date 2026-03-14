import { useState } from 'react';

import { checkPassword, INVALID_PASSWORD_MESSAGE_MAP } from '@shopby/shared';

const useChangePassword = () => {
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [message, setMessage] = useState('');

  const handleChangePassword = ({ currentTarget: { value } }) => {
    setPassword(value);
  };

  const validatePassword = () => {
    const { isValid, message } = checkPassword(password);

    setIsValid(isValid);
    setMessage(INVALID_PASSWORD_MESSAGE_MAP[message]);
  };

  return {
    password,
    handleChangePassword,
    validatePassword,
    isValid,
    message,
  };
};

export default useChangePassword;
