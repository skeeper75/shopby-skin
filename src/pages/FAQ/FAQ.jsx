import { useState, useMemo, useEffect } from 'react';

import {
  ArticleProvider,
  useArticleStateContext,
  useArticleActionContext,
  useMallStateContext,
  useInfiniteScroll,
  InfiniteScrollLoader,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import ListSkeleton from '../../components/ListSkeleton/ListSkeleton';
import Sanitized from '../../components/Sanitized';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { TextField } from '../../components/ui/TextField';
import { cn } from '../../lib/utils';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { fetchHttpRequest } from '../../utils/api';

// @MX:NOTE: [AUTO] FAQ 페이지 - SPEC-SKIN-004 REQ-SKIN-004-002 아코디언 + 검색 + 카테고리 탭
// @MX:SPEC: SPEC-SKIN-004 REQ-SKIN-004-002

// FAQ 카테고리 목록
const FAQ_CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'signup', label: '회원가입/로그인' },
  { value: 'order', label: '주문/배송/결제' },
  { value: 'refund', label: '취소/환불' },
  { value: 'receipt', label: '영수증' },
];

const EmptyFAQContent = () => (
  <div className="flex items-center justify-center py-16 text-sm text-[#979797]">
    <p>등록된 FAQ가 없습니다.</p>
  </div>
);

// 개별 FAQ 아이템 (아코디언)
const FAQAccordionItem = ({ faq, value, isOpen, onToggle }) => {
  const [answer, setAnswer] = useState('');
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

  // 아코디언 열릴 때 답변 로드
  const handleToggle = async () => {
    onToggle(value);

    if (!isOpen && !answer) {
      setIsLoadingAnswer(true);
      try {
        const data = await fetchHttpRequest({
          url: `boards/faq/articles/${faq.postNo}`,
          method: 'GET',
        });
        setAnswer(data?.content ?? '');
      } catch {
        setAnswer('내용을 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingAnswer(false);
      }
    }
  };

  return (
    <AccordionItem
      value={value}
      className={cn(
        'border-b border-[#CACACA] last:border-b-0 transition-colors',
        isOpen && 'bg-[#EEEBF9]'
      )}
    >
      <AccordionTrigger
        onClick={handleToggle}
        className={cn(
          'px-4 py-4 text-sm font-semibold text-[#424242] hover:no-underline hover:bg-[#EEEBF9] transition-colors',
          '[&[data-state=open]>svg]:text-[#5538B6] [&[data-state=open]]:text-[#5538B6]'
        )}
      >
        <span className="flex items-start gap-2 text-left">
          <span className="shrink-0 font-bold text-[#5538B6]">Q.</span>
          <span>{faq.title}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="flex items-start gap-2">
          <span className="shrink-0 font-bold text-[#979797]">A.</span>
          {isLoadingAnswer ? (
            <span className="text-sm text-[#979797]">불러오는 중...</span>
          ) : (
            <Sanitized
              html={answer}
              className="text-sm text-[#565656] leading-relaxed [&_*]:max-w-full"
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// @MX:NOTE: [FAQContent] FAQ 메인 콘텐츠 - 카테고리 탭 + 검색 필터링 + 아코디언 + GET /boards/faq API
const FAQContent = () => {
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItem, setOpenItem] = useState('');

  const { boardsCategories } = useMallStateContext();
  const {
    boardPosts: { totalCount },
  } = useArticleStateContext();
  const { fetchBoardPosts } = useArticleActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const faqNo = useMemo(
    () => boardsCategories.find(({ boardId }) => boardId.toLowerCase().includes('faq'))?.boardNo ?? 0,
    [boardsCategories]
  );

  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (requestOption) => {
      try {
        const { data } = await fetchBoardPosts(requestOption);
        return data?.items ?? [];
      } catch (error) {
        catchError(error);
        return [];
      }
    },
    requestOption: {
      pageNumber: 1,
      pageSize: INFINITY_SCROLL_PAGE_SIZE,
      boardNoOrId: 'faq',
    },
  });

  const handleIntersect = () => {
    onIntersect({ totalCount });
  };

  // 실시간 클라이언트 사이드 필터링
  const filteredItems = useMemo(() => {
    if (!keyword.trim()) return accumulativeItems;
    const lower = keyword.toLowerCase();
    return accumulativeItems.filter((item) => item.title?.toLowerCase().includes(lower));
  }, [accumulativeItems, keyword]);

  // 검색어 입력 핸들러 (실시간 필터링)
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setKeyword(e.target.value);
  };

  // 카테고리 변경
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setOpenItem('');
    const query = { boardNoOrId: faqNo || 'faq' };
    if (category !== 'all') query.categoryName = category;
    fetchInitialItems({ requestOption: query });
  };

  // 아코디언 열기/닫기 토글
  const handleToggle = (value) => {
    setOpenItem((prev) => (prev === value ? '' : value));
  };

  useEffect(() => {
    if (!faqNo) return;
    fetchInitialItems({ requestOption: { boardNoOrId: faqNo } });
  }, [faqNo]);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: 'FAQ',
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#424242]">자주 묻는 질문</h1>
      </div>

      {/* 검색 바 */}
      <div className="mb-6">
        <TextField
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          placeholder="검색어를 입력하세요"
          className="h-[46px]"
        />
      </div>

      {/* 카테고리 탭 */}
      <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
        <TabsList className="w-full h-auto p-0 bg-transparent border-b border-[#CACACA] rounded-none mb-4 justify-start overflow-x-auto flex-nowrap">
          {FAQ_CATEGORIES.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                'rounded-none border-b-2 border-transparent pb-3 px-4 text-sm whitespace-nowrap',
                'data-[state=active]:border-[#5538B6] data-[state=active]:text-[#5538B6] data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none',
                'hover:text-[#5538B6] text-[#979797]'
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {FAQ_CATEGORIES.map(({ value }) => (
          <TabsContent key={value} value={value} className="mt-0">
            {isLoading ? (
              <ListSkeleton isLoading={isLoading} />
            ) : filteredItems.length === 0 ? (
              <EmptyFAQContent />
            ) : (
              <Accordion type="single" value={openItem} className="border border-[#CACACA] rounded-md overflow-hidden">
                {filteredItems.map((faq) => (
                  <FAQAccordionItem
                    key={faq.postNo}
                    faq={faq}
                    value={String(faq.postNo)}
                    isOpen={openItem === String(faq.postNo)}
                    onToggle={handleToggle}
                  />
                ))}
              </Accordion>
            )}

            {accumulativeItems.length > 0 && (
              <InfiniteScrollLoader
                onIntersect={handleIntersect}
                disabled={isInfiniteScrollDisabled}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const FAQ = () => (
  <ArticleProvider>
    <FAQContent />
  </ArticleProvider>
);

export default FAQ;
