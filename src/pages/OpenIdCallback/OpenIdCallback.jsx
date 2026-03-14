import { SignInProvider, OpenIdSignInProvider, useTermsStateContext } from '@shopby/react-components';

import { PI_TERMS_MAP } from '../../constants/common';

import OpenIdCallbackForm from './OpenIdCallbackForm';

const OpenIdCallback = () => {
  const { terms } = useTermsStateContext();

  return (
    <SignInProvider>
      <OpenIdSignInProvider PI_TERMS_MAP={PI_TERMS_MAP} terms={terms}>
        <OpenIdCallbackForm />
      </OpenIdSignInProvider>
    </SignInProvider>
  );
};

export default OpenIdCallback;
