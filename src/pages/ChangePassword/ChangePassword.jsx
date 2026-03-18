import { useTranslation } from 'react-i18next';

import { FindAccountProvider } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';
import { PageShell } from '../../components/Layout';

import ChangePasswordContent from './ChangePasswordContent';

export const ChangePassword = () => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    title: t('findPassword'),
  });

  return (
    // 데스크탑에서 카드 스타일 중앙 정렬 (최대 448px), 모바일은 전체 너비
    <PageShell maxWidth="md" className="lg:py-12">
      <FindAccountProvider>
        <ChangePasswordContent />
      </FindAccountProvider>
    </PageShell>
  );
};
