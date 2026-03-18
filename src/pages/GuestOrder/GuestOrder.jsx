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
import { PageShell } from '../../components/Layout';

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
    // 비회원 주문 조회 폼 최대 너비 제한 및 반응형 패딩 적용
    <PageShell maxWidth="5xl">
      <SignInProvider>
        <OpenIdSignInProvider PI_TERMS_MAP={PI_TERMS_MAP} terms={terms}>
          <GuestOrderForm />
        </OpenIdSignInProvider>
      </SignInProvider>
    </PageShell>
  );
};

export default GuestOrder;
