import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  SignUpProvider,
  IdentificationVerificationProvider,
  AgeVerificationProvider,
  CustomTermsProvider,
  MarketingReceiveAgreementProvider,
  useTermsActionContext,
  useTermsStateContext,
} from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import { PI_TERMS_KEYS, PI_TERMS_MAP } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { PageShell } from '../../components/Layout';

import SignUpButton from './SignUpButton';
import SignUpForm from './SignUpForm';
import TermsForm from './TermsForm';
import TermsModal from './TermsModal';

const SignUp = () => {
  const { t } = useTranslation('title');
  const { fetchTerms } = useTermsActionContext();
  const { terms } = useTermsStateContext();
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signUp'),
  });

  const refs = {
    emailRef: useRef(),
    mobilePhoneNumberInputRef: useRef(),
    globalAddressRef: useRef(),
    globalAddressJpRef: useRef(),
  };

  const [isTermsFullModalOpen, setIsTermsFullModalOpen] = useState(false);

  useEffect(() => {
    fetchTerms(PI_TERMS_KEYS);
  }, []);

  return (
    // 데스크탑에서 카드 스타일 중앙 정렬 (최대 448px), 모바일은 전체 너비
    <PageShell maxWidth="md" className="lg:py-12">
      <SignUpProvider terms={terms} PI_TERMS_MAP={PI_TERMS_MAP}>
        <AgeVerificationProvider>
          <IdentificationVerificationProvider>
            <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
              <MarketingReceiveAgreementProvider>
                <div className="sign-up-form">
                  <SignUpForm refs={refs} />
                  <TermsForm setIsTermsFullModalOpen={() => setIsTermsFullModalOpen(true)} />
                  <SignUpButton refs={refs} />
                </div>
              </MarketingReceiveAgreementProvider>
            </CustomTermsProvider>
            {isTermsFullModalOpen && <TermsModal onClose={() => setIsTermsFullModalOpen(false)} />}
          </IdentificationVerificationProvider>
        </AgeVerificationProvider>
      </SignUpProvider>
    </PageShell>
  );
};

export default SignUp;
