import { useState, useMemo, useEffect } from 'react';

import {
  Button,
  TextField,
  ArticleProvider,
  useModalActionContext,
  InfiniteScrollLoader,
  useArticleStateContext,
  useArticleActionContext,
  useMallStateContext,
  useInfiniteScroll,
  VisibleComponent,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import FAQList from '../../components/FAQList/FAQList';
import ListSkeleton from '../../components/ListSkeleton/ListSkeleton';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const FAQContent = () => {
  const [keyword, setKeyword] = useState('');

  const { openAlert } = useModalActionContext();
  const { boardsCategories } = useMallStateContext();
  const {
    isLoading: isArticleLoading,
    boardPosts: { totalCount },
  } = useArticleStateContext();
  const { fetchBoardPosts } = useArticleActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const faqNo = useMemo(
    () => boardsCategories.find(({ boardId }) => boardId.toLowerCase().includes('faq'))?.boardNo ?? 0,
    [boardsCategories]
  );

  const handleKeywordChange = ({ currentTarget }) => {
    setKeyword(currentTarget.value);
  };

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (requestOption) => {
      try {
        requestOption.page = requestOption.pageNumber;

        const { data } = await fetchBoardPosts(requestOption);

        return data.items;
      } catch (error) {
        catchError(error);

        return [];
      }
    },
    requestOption: {
      pageNumber: 1,
      pageSize: INFINITY_SCROLL_PAGE_SIZE,
      boardNoOrId: 'faq',
      keyword,
    },
  });

  const handleSearchBtn = async () => {
    const _keyword = keyword.trim();

    if (!_keyword) {
      openAlert({
        message: '검색어를 입력하세요.',
      });
    }

    try {
      await fetchInitialItems({
        requestOption: {
          keyword,
        },
      });
    } catch (error) {
      catchError(error);
    }
  };

  const handleIntersect = () => {
    onIntersect({
      totalCount,
    });
  };

  useEffect(() => {
    if (!faqNo) return;

    fetchInitialItems({
      requestOption: {
        faqNo,
        keyword,
      },
    });
  }, [faqNo]);

  return (
    <div className="faq">
      <div className="faq__search">
        <TextField value={keyword} onChange={handleKeywordChange} placeholder="검색어를 입력하세요" />
        <Button theme="dark" label="검색" onClick={handleSearchBtn} />
      </div>
      <FAQList questions={accumulativeItems} faqNo={faqNo} isLoading={isArticleLoading} />

      <VisibleComponent
        shows={accumulativeItems.length > 0}
        TruthyComponent={
          <>
            <InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />
            <ListSkeleton className="faq-list" isLoading={isLoading} />
          </>
        }
      />
    </div>
  );
};

const FAQ = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: 'FAQ',
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  return (
    <ArticleProvider>
      <FAQContent />
    </ArticleProvider>
  );
};

export default FAQ;
