import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FindAccountProvider, TabsProvider, AuthenticationProvider } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';
import { PageShell } from '../../components/Layout';

import FindPasswordContent from './FindPasswordContent';

const getTabs = () => [
  {
    value: 'EMAIL',
    label: '이메일인증',
  },
  {
    value: 'SMS',
    label: '휴대폰번호 인증',
  },
];

export const FindPassword = () => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    title: t('findPassword'),
  });

  const initialTabs = useMemo(() => getTabs(), []);

  return (
    // 데스크탑에서 카드 스타일 중앙 정렬 (최대 480px), 모바일은 전체 너비
    <PageShell maxWidth="md" className="lg:py-12">
      <div className="lg:max-w-[480px] lg:mx-auto lg:shadow-md lg:rounded-lg lg:bg-white lg:p-8">
        <AuthenticationProvider>
          <FindAccountProvider>
            <TabsProvider
              initialState={{
                currentTab: 'EMAIL',
                tabs: initialTabs,
              }}
            >
              <FindPasswordContent />
            </TabsProvider>
          </FindAccountProvider>
        </AuthenticationProvider>
      </div>
    </PageShell>
  );
};
