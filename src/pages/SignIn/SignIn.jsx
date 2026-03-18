import { useTranslation } from 'react-i18next';

import { SignInProvider, OpenIdSignInProvider, useTermsStateContext } from '@shopby/react-components';

import { PI_TERMS_MAP } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { PageShell } from '../../components/Layout';

import SignInForm from './SignInForm';

const SignIn = () => {
  const { terms } = useTermsStateContext();

  const { t } = useTranslation('title');

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signIn'),
  });

  return (
    // 데스크탑에서 카드 스타일 중앙 정렬 (최대 448px), 모바일은 전체 너비
    <PageShell maxWidth="md" className="lg:py-12">
      <SignInProvider>
        <OpenIdSignInProvider PI_TERMS_MAP={PI_TERMS_MAP} terms={terms}>
          <SignInForm />
        </OpenIdSignInProvider>
      </SignInProvider>
    </PageShell>
  );
};

export default SignIn;

SignIn.propTypes = {};
