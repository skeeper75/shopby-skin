import { useEffect, useState } from 'react';

import {
  CheckMemberPasswordProvider,
  MemberWithdrawalProvider,
  OpenIdSignInProvider,
  useAuthStateContext,
  CustomTermsProvider,
  MemberModificationProvider,
  VisibleComponent,
  useTermsActionContext,
  useTermsStateContext,
} from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import CheckMemberPassword from '../../components/CheckMemberPassword';
import { PI_TERMS_KEYS, PI_TERMS_MAP } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import CheckOpenIdMember from './CheckOpenIdMember';
import MemberWithdrawalContent from './MemberWithdrawalContent';

const MemberWithdrawal = () => {
  const { fetchTerms } = useTermsActionContext();
  const { terms } = useTermsStateContext();

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    hasBottomNav: true,
    title: '회원탈퇴',
  });

  const { profile } = useAuthStateContext();

  const myPageToken = sessionStorage.getItem('MY_PAGE_TOKEN');
  const [visibleForm, setVisibleForm] = useState(!!myPageToken);

  const onAuthenticationBtnClick = () => {
    setVisibleForm(true);
  };

  useEffect(() => {
    visibleForm && fetchTerms(PI_TERMS_KEYS);
  }, []);

  return (
    <MemberWithdrawalProvider terms={terms} PI_TERMS_MAP={PI_TERMS_MAP}>
      <MemberModificationProvider terms={terms} PI_TERMS_MAP={PI_TERMS_MAP}>
        <CheckMemberPasswordProvider>
          <OpenIdSignInProvider PI_TERMS_MAP={PI_TERMS_MAP} terms={terms}>
            <VisibleComponent
              shows={visibleForm}
              TruthyComponent={
                <>
                  <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
                    <MemberWithdrawalContent />
                  </CustomTermsProvider>
                </>
              }
              FalsyComponent={
                <VisibleComponent
                  shows={profile?.memberType === 'MALL'}
                  TruthyComponent={<CheckMemberPassword onAuthenticationBtnClick={onAuthenticationBtnClick} />}
                  FalsyComponent={
                    <CheckOpenIdMember onAuthenticationBtnClick={onAuthenticationBtnClick} reauthenticate={true} />
                  }
                />
              }
            />
          </OpenIdSignInProvider>
        </CheckMemberPasswordProvider>
      </MemberModificationProvider>
    </MemberWithdrawalProvider>
  );
};

export default MemberWithdrawal;
