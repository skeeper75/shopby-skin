import { useEffect, useRef, useState } from 'react';

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import NoticeDetailModal from './NoticeDetailModal';

// @MX:NOTE: [AUTO] Notice 페이지 - SPEC-SKIN-004 REQ-SKIN-004-001 카테고리 탭 + 배지 + 페이지네이션
// @MX:SPEC: SPEC-SKIN-004 REQ-SKIN-004-001

// 공지사항 카테고리 탭 목록
const NOTICE_CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'event', label: '이벤트' },
  { value: 'notice', label: '공지' },
  { value: 'product', label: '상품' },
];

// 카테고리 배지 색상 매핑
const BADGE_VARIANT_MAP = {
  event: 'secondary',
  notice: 'default',
  product: 'outline',
};

// 카테고리 표시 라벨 매핑
const CATEGORY_LABEL_MAP = {
  event: '이벤트',
  notice: '공지',
  product: '상품',
};

const EmptyNoticeContent = () => (
  <div className="flex items-center justify-center py-16 text-sm text-[#979797]">
    <p>등록된 공지사항이 없습니다.</p>
  </div>
);

// 개별 공지 아이템
const NoticeItem = ({ item, onClick }) => {
  const date = item.registerYmdt?.split(' ')[0] ?? '';
  const categoryKey = item.noticed ? 'notice' : (item.categoryName?.toLowerCase() ?? '');
  const badgeLabel = CATEGORY_LABEL_MAP[categoryKey];

  return (
    <li className="border-b border-[#CACACA] last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="w-full px-4 py-4 text-left hover:bg-[#EEEBF9] transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {badgeLabel && (
                <Badge
                  variant={BADGE_VARIANT_MAP[categoryKey] ?? 'default'}
                  className={cn(
                    'text-xs shrink-0',
                    categoryKey === 'notice' && 'bg-[#5538B6] text-white hover:bg-[#5538B6]'
                  )}
                >
                  {badgeLabel}
                </Badge>
              )}
            </div>
            <p className="text-sm text-[#424242] font-medium truncate">{item.title}</p>
          </div>
          <span className="text-xs text-[#979797] shrink-0 mt-0.5">{date}</span>
        </div>
      </button>
    </li>
  );
};

// @MX:NOTE: [NoticeContent] 공지사항 메인 콘텐츠 - 카테고리 필터(전체/이벤트/공지/상품) + 페이지네이션 + GET /boards/notice API
const NoticeContent = () => {
  const noticesRef = useRef();
  const [activeCategory, setActiveCategory] = useState('all');
  const [noticeNo, setNoticeNo] = useState(null);

  const { fetchBoardPosts } = useArticleActionContext();
  const {
    boardPosts: { totalCount },
  } = useArticleStateContext();
  const { mallName, boardsCategories } = useMallStateContext();
  const { catchError } = useErrorBoundaryActionContext();

  const notice = boardsCategories.find(({ boardId }) => boardId === 'notice');

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
      page: 1,
      pageSize: INFINITY_SCROLL_PAGE_SIZE,
      boardNoOrId: 'notice',
    },
    pageKey: 'page',
    uniqKey: 'postNo',
  });

  const handleIntersect = () => {
    onIntersect({ totalCount });
  };

  // 카테고리 탭 변경 시 API 재조회
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const query = { boardNoOrId: 'notice' };
    if (category !== 'all') query.categoryName = category;

    fetchInitialItems({ requestOption: query });
  };

  useEffect(() => {
    fetchInitialItems({ requestOption: { boardNoOrId: 'notice' } });
  }, []);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    title: notice?.boardName ?? '공지사항',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#424242]">공지사항</h1>
        {mallName && <p className="mt-1 text-sm text-[#979797]">{mallName}에서 알려드립니다.</p>}
      </div>

      {/* 카테고리 탭 */}
      <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
        <TabsList className="w-full h-auto p-0 bg-transparent border-b border-[#CACACA] rounded-none mb-4 justify-start">
          {NOTICE_CATEGORIES.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                'rounded-none border-b-2 border-transparent pb-3 px-4 text-sm',
                'data-[state=active]:border-[#5538B6] data-[state=active]:text-[#5538B6] data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none',
                'hover:text-[#5538B6] text-[#979797]'
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {NOTICE_CATEGORIES.map(({ value }) => (
          <TabsContent key={value} value={value} className="mt-0">
            {totalCount === 0 && !isLoading ? (
              <EmptyNoticeContent />
            ) : (
              <ul ref={noticesRef} className="divide-y divide-[#CACACA]">
                {accumulativeItems.map((item) => (
                  <NoticeItem
                    key={item.postNo}
                    item={item}
                    onClick={() => setNoticeNo(item.postNo)}
                  />
                ))}
              </ul>
            )}

            <ListSkeleton isLoading={isLoading} />

            {accumulativeItems.length > 0 && (
              <InfiniteScrollLoader
                debounceTime={10}
                onIntersect={handleIntersect}
                disabled={isInfiniteScrollDisabled}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* 상세 모달 */}
      {noticeNo && (
        <NoticeDetailModal
          accumulativeItems={accumulativeItems}
          noticeNo={noticeNo}
          onClose={() => setNoticeNo(null)}
          noticesRef={noticesRef}
        />
      )}
    </div>
  );
};

const Notice = () => (
  <ArticleProvider>
    <NoticeContent />
  </ArticleProvider>
);

export default Notice;
