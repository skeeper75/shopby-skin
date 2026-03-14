import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  ArticleProvider,
  useMallStateContext,
  useArticleActionContext,
  useArticleStateContext,
  Button,
  useBoardConfigurationContextState,
  useModalActionContext,
  VisibleComponent,
  useBoardConfigurationContextAction,
  useAuthStateContext,
} from '@shopby/react-components';
import { isSignedIn } from '@shopby/shared';

import FAQList from '../../components/FAQList/FAQList';
import GoToList from '../../components/GoToList';
import { FAQ_BOARD_ID } from '../../constants/board';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const FAQ = () => {
  const navigate = useNavigate();

  const { boardConfig } = useBoardConfigurationContextState();
  const { checkDisplayableState } = useBoardConfigurationContextAction();
  const { fetchBoardPosts } = useArticleActionContext();
  const { openAlert } = useModalActionContext();
  const {
    isLoading,
    boardPosts: { items, totalCount },
  } = useArticleStateContext();

  const { profile } = useAuthStateContext();

  const [displayableStatus, setDisplayableStatus] = useState(false);

  const faqConfig = useMemo(
    () => boardConfig.boardConfigs.find(({ boardId }) => boardId?.toLowerCase().includes(FAQ_BOARD_ID)),
    [boardConfig.boardConfigs]
  );

  const inquiryButtonLabel = useMemo(() => {
    const { name } = boardConfig?.inquiryConfig ?? {};
    return name ? name : '1:1문의';
  }, [boardConfig?.inquiryConfig?.name]);

  const faqFlag = useMemo(() => {
    if (!faqConfig?.used) return '--not-used';

    if (!totalCount) return '--empty';

    return '';
  }, [faqConfig, totalCount]);

  const goToPersonalInquiryPage = () => {
    if (!isSignedIn()) {
      openAlert({
        message: '로그인하셔야 본 서비스를 이용하실 수 있습니다.',
      });
    }
    navigate('/my-page/personal-inquiry');
  };

  useEffect(() => {
    if (!faqConfig?.boardNo || !displayableStatus) return;

    fetchBoardPosts({
      boardNoOrId: faqConfig?.boardNo,
      page: 1,
      pageSize: 5,
    });
  }, [faqConfig?.boardNo, displayableStatus]);

  useEffect(() => {
    if (!faqConfig?.boardNo) {
      return;
    }

    const { data } = checkDisplayableState({
      profile,
      boardId: FAQ_BOARD_ID,
    });

    setDisplayableStatus(data);
  }, [faqConfig?.boardNo]);

  return (
    <div className={`customer-center__faq${faqFlag}`}>
      <p className="customer-center__faq-title">{faqConfig?.name ?? 'FAQ'}</p>
      <VisibleComponent
        shows={displayableStatus}
        TruthyComponent={<FAQList isLoading={isLoading} questions={items} faqNo={faqConfig?.boardNo} />}
        FalsyComponent={
          <div className="empty-list">
            <p>존재하지 않는 게시판입니다.</p>
          </div>
        }
      />
      <GoToList
        title="전체보기"
        disabled={!displayableStatus}
        onClick={() => {
          navigate('/faq');
        }}
      />
      <div className="customer-center__inquiry">
        <Button className="customer-center__inquiry-button" onClick={goToPersonalInquiryPage}>
          {inquiryButtonLabel}
        </Button>
      </div>
    </div>
  );
};

const CustomerServiceCenterInformation = () => {
  const {
    mall: { serviceCenter },
  } = useMallStateContext();

  return (
    <div className="customer-center__information">
      <p className="customer-center__name">고객센터</p>
      <p>{serviceCenter.phoneNo}</p>
      <p>{serviceCenter.email}</p>
    </div>
  );
};

const CustomerCenterContent = () => {
  const { t } = useTranslation('title');

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasBottomNav: true,
    hasCartBtnOnHeader: true,
    title: t('customerCenter'),
  });

  return (
    <div className="customer-center">
      <FAQ />
      <CustomerServiceCenterInformation />
    </div>
  );
};

const CustomerCenter = () => (
  <ArticleProvider>
    <CustomerCenterContent />
  </ArticleProvider>
);

export default CustomerCenter;
