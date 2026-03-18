import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  SignInProvider,
  OpenIdSignInProvider,
  useTermsActionContext,
  useTermsStateContext,
} from '@shopby/react-components';

import { PI_TERMS_MAP, PI_TERMS_KEYS } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import GuestOrderForm from './GuestOrderForm';

const GuestOrder = () => {
  const { fetchTerms } = useTermsActionContext();
  const { terms } = useTermsStateContext();
  const { t } = useTranslation('title');

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('searchGuestOrder'),
  });

  useEffect(() => {
    fetchTerms(PI_TERMS_KEYS);
  }, []);

  return (
    <SignInProvider>
      <OpenIdSignInProvider PI_TERMS_MAP={PI_TERMS_MAP} terms={terms}>
        <GuestOrderForm />
      </OpenIdSignInProvider>
    </SignInProvider>
  );
};

export default GuestOrder;
