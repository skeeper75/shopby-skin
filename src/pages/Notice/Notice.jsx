import { useEffect, useRef, useState } from 'react';

import { uniqueId } from 'lodash-es';
import { number } from 'prop-types';

import {
  ArticleProvider,
  useArticleStateContext,
  useArticleActionContext,
  useMallStateContext,
  VisibleComponent,
  useInfiniteScroll,
  InfiniteScrollLoader,
  Icon,
  useBoardConfigurationContextAction,
  useAuthStateContext,
  useModalActionContext,
} from '@shopby/react-components';
import { BOARD_PERMISSION_CONFIG_TYPE } from '@shopby/shared/constants';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import ListSkeleton from '../../components/ListSkeleton/ListSkeleton';
import { NOTICE_BOARD_ID } from '../../constants/board';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import NoticeDetailModal from './NoticeDetailModal';

const EmptyNoticeContent = () => (
  <div className="empty-list">
    <p>등록된 공지사항이 없습니다.</p>
  </div>
);

const LockedNotice = ({ articleNo }) => (
  <li className="notice__list-item--locked" key={articleNo}>
    <Icon className="ico ico--lock" name="lock" />
    <p>비밀글입니다.</p>
  </li>
);

LockedNotice.propTypes = {
  articleNo: number,
};

const NoticeContent = () => {
  const noticesRef = useRef();

  const { openAlert } = useModalActionContext();
  const { checkDisplayableState } = useBoardConfigurationContextAction();
  const { fetchBoardPosts } = useArticleActionContext();
  const { profile } = useAuthStateContext();

  const {
    boardPosts: { totalCount },
  } = useArticleStateContext();
  const { mallName, boardsCategories } = useMallStateContext();
  const { catchError } = useErrorBoundaryActionContext();
  const notice = boardsCategories.find(({ boardId }) => boardId === NOTICE_BOARD_ID);

  const [noticeNo, setNoticeNo] = useState(null);

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (requestOption) => {
      try {
        const { data } = await fetchBoardPosts(requestOption);

        return data.items;
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
    onIntersect({
      totalCount,
    });
  };

  useEffect(() => {
    fetchInitialItems({
      requestOption: {
        boardNo: 'notice',
      },
    });
  }, []);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    title: notice?.boardName,
  });

  return (
    <div className="notice">
      <div className="notice__title">
        <p>{mallName} 에서 알려드립니다.</p>
      </div>
      <VisibleComponent
        shows={totalCount > 0}
        TruthyComponent={
          <>
            <ul className="notice__list" ref={noticesRef}>
              {accumulativeItems.map((item) => (
                <VisibleComponent
                  key={uniqueId(item.postNo)}
                  shows={item.secreted}
                  TruthyComponent={<LockedNotice key={item.postNo} articleNo={item.postNo} />}
                  FalsyComponent={
                    <li data-post-no={item.postNo}>
                      <button
                        className="notice__list-button"
                        onClick={() => {
                          const { data: readable } = checkDisplayableState({
                            profile,
                            boardId: NOTICE_BOARD_ID,
                            permissionType: BOARD_PERMISSION_CONFIG_TYPE.READ_PERMISSION,
                          });

                          if (!readable) {
                            openAlert({
                              message: '게시글 읽기 권한이 없습니다.',
                            });

                            return;
                          }

                          setNoticeNo(() => item.postNo);
                        }}
                      >
                        <div>
                          <p className="notice__category-label">{item.noticed ? '[공지]' : ''}</p>
                          <p className="notice__date">{item.registerYmdt.split(' ').at(0)}</p>
                        </div>
                        <p className="notice__tit">{item.title}</p>
                      </button>
                    </li>
                  }
                />
              ))}
            </ul>
            <VisibleComponent
              shows={accumulativeItems.length > 0}
              TruthyComponent={
                <InfiniteScrollLoader
                  debounceTime={10}
                  onIntersect={handleIntersect}
                  disabled={isInfiniteScrollDisabled}
                />
              }
            />
            <ListSkeleton isLoading={isLoading} />
          </>
        }
        FalsyComponent={<EmptyNoticeContent />}
      />

      {noticeNo && (
        <NoticeDetailModal
          accumulativeItems={accumulativeItems}
          noticeNo={noticeNo}
          onClose={() => {
            setNoticeNo(null);
          }}
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
