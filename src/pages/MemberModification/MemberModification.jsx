import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  MemberModificationProvider,
  IdentificationVerificationProvider,
  AgeVerificationProvider,
  CheckMemberPasswordProvider,
  useAuthStateContext,
  VisibleComponent,
  OpenIdSignInProvider,
  CustomTermsProvider,
  useTermsActionContext,
  useTermsStateContext,
  MarketingReceiveAgreementProvider,
} from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import CheckMemberPassword from '../../components/CheckMemberPassword';
import { PI_TERMS_KEYS, PI_TERMS_MAP } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import CheckOpenIdMember from '../MemberWithdrawal/CheckOpenIdMember';
import { PageShell } from '../../components/Layout';

import MemberModificationForm from './MemberModificationForm';

const MemberModification = () => {
  const { profile } = useAuthStateContext();
  const { fetchTerms } = useTermsActionContext();
  const { terms } = useTermsStateContext();

  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('memberModification'),
  });

  const myPageToken = sessionStorage.getItem('MY_PAGE_TOKEN');
  const [visibleProfileForm, setVisibleProfileForm] = useState(!!myPageToken);

  const onAuthenticationBtnClick = () => {
    setVisibleProfileForm(true);
  };

  useEffect(() => {
    visibleProfileForm && fetchTerms(PI_TERMS_KEYS);
  }, [visibleProfileForm]);

  return (
    // 회원 정보 수정 폼 최대 너비 제한 및 반응형 패딩 적용
    <PageShell maxWidth="4xl">
      <MemberModificationProvider terms={terms} PI_TERMS_MAP={PI_TERMS_MAP}>
        <OpenIdSignInProvider PI_TERMS_MAP={PI_TERMS_MAP} terms={terms}>
          <IdentificationVerificationProvider>
            <AgeVerificationProvider>
              <CheckMemberPasswordProvider>
                <MarketingReceiveAgreementProvider>
                  <VisibleComponent
                    shows={visibleProfileForm}
                    TruthyComponent={
                      <>
                        <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
                          <MemberModificationForm />
                        </CustomTermsProvider>
                      </>
                    }
                    FalsyComponent={
                      profile && (
                        <VisibleComponent
                          shows={profile.memberType === 'MALL'}
                          TruthyComponent={<CheckMemberPassword onAuthenticationBtnClick={onAuthenticationBtnClick} />}
                          FalsyComponent={
                            <CheckOpenIdMember
                              onAuthenticationBtnClick={onAuthenticationBtnClick}
                              reauthenticate={true}
                            />
                          }
                        />
                      )
                    }
                  />
                </MarketingReceiveAgreementProvider>
              </CheckMemberPasswordProvider>
            </AgeVerificationProvider>
          </IdentificationVerificationProvider>
        </OpenIdSignInProvider>
      </MemberModificationProvider>
    </PageShell>
  );
};

export default MemberModification;

MemberModification.propTypes = {};
