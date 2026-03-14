import { useTranslation } from 'react-i18next';

import { SignInProvider, OpenIdSignInProvider, useTermsStateContext } from '@shopby/react-components';

import { PI_TERMS_MAP } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import SignInForm from './SignInForm';

const SignIn = () => {
  const { terms } = useTermsStateContext();

  const { t } = useTranslation('title');

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signIn'),
  });

  return (
    <SignInProvider>
      <OpenIdSignInProvider PI_TERMS_MAP={PI_TERMS_MAP} terms={terms}>
        <SignInForm />
      </OpenIdSignInProvider>
    </SignInProvider>
  );
};

export default SignIn;

SignIn.propTypes = {};
