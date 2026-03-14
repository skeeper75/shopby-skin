import { useEffect, useMemo, useState } from 'react';

import { number, func, array, object } from 'prop-types';

import {
  useArticleActionContext,
  useArticleStateContext,
  IconSVG,
  VisibleComponent,
  useMallStateContext,
  useBoardConfigurationContextAction,
  useAuthStateContext,
  useModalActionContext,
} from '@shopby/react-components';
import { BOARD_PERMISSION_CONFIG_TYPE, CLIENT_ERROR } from '@shopby/shared/constants';

import FullModal from '../../components/FullModal';
import GoToList from '../../components/GoToList';
import Sanitized from '../../components/Sanitized';
import { NOTICE_BOARD_ID } from '../../constants/board';
import { platformType } from '../../utils';

const NoticeDetailModal = ({ noticeNo: initialNoticeNo, onClose, accumulativeItems, noticesRef }) => {
  const { fetchBoardPostDetail } = useArticleActionContext();
  const {
    boardPostDetail,
    boardPosts: { totalCount },
  } = useArticleStateContext();
  const { boardsCategories } = useMallStateContext();
  const { openAlert } = useModalActionContext();
  const { checkDisplayableState } = useBoardConfigurationContextAction();

  const { profile } = useAuthStateContext();

  const [noticeNo, setNoticeNo] = useState(initialNoticeNo);

  const notice = boardsCategories.find(({ boardId }) => boardId === NOTICE_BOARD_ID);
  const noticesWithoutSecretArticles = useMemo(
    () => accumulativeItems.filter(({ secreted }) => !secreted),
    [accumulativeItems]
  );

  const getCurrentIndex = (noticeNo) => noticesWithoutSecretArticles.findIndex((item) => item.postNo === noticeNo);

  const scrollIntoView = () => {
    const currentEl = [...noticesRef.current.children].find((el) => Number(el.dataset?.postNo) === noticeNo);

    currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const nextNotice = useMemo(() => {
    const currentIndex = getCurrentIndex(noticeNo);

    if (currentIndex > 0) {
      return noticesWithoutSecretArticles[currentIndex - 1];
    }

    return null;
  }, [noticeNo, noticesWithoutSecretArticles]);

  const previousNotice = useMemo(() => {
    const currentIndex = getCurrentIndex(noticeNo);

    if (currentIndex < totalCount - 1) {
      return noticesWithoutSecretArticles[currentIndex + 1];
    }

    return null;
  }, [noticeNo, noticesWithoutSecretArticles]);

  useEffect(() => {
    (async () => {
      try {
        // 외부스크립트, sb객체 등록 기능. 삭제금지
        ShopbyExternalScript?.setPageScriptType();

        noticeNo > 0 && (await fetchBoardPostDetail({ postNo: noticeNo, boardNo: 'notice' }));

        // 외부스크립트, sb객체 등록 기능. 삭제금지
        ShopbyExternalScript?.setGlobalObjectSb({
          getPlatform: () => platformType,
          profile,
        });
      } catch (e) {
        if (e?.error?.code === CLIENT_ERROR.FORBIDDEN_ARTICLE_DETAIL) {
          openAlert({
            message: '게시글 읽기 권한이 없습니다.',
            onClose: () => {
              onClose?.();
            },
          });
        }
      }
    })();
  }, [noticeNo]);

  return (
    <FullModal title={notice.boardName} onClose={onClose}>
      <div className="notice-detail__title-box">
        <p className="notice-detail__title">
          {boardPostDetail.noticed && <span>[공지]</span>}
          {boardPostDetail.title}
        </p>
        <p className="notice-detail__date">{boardPostDetail.registerYmdt?.split(' ').at(0)}</p>
      </div>
      <div className="notice-detail__content editor">
        <Sanitized html={boardPostDetail.content} />
      </div>
      <div>
        <VisibleComponent
          shows={nextNotice}
          TruthyComponent={
            <button
              className="notice-detail__index notice-detail__index--next"
              onClick={() => {
                const { data: readable } = checkDisplayableState({
                  profile,
                  boardId: NOTICE_BOARD_ID,
                  permissionType: BOARD_PERMISSION_CONFIG_TYPE.READ_PERMISSION,
                });

                if (!readable) {
                  openAlert({
                    message: '게시글 읽기 권한이 없습니다.',
                    onClose: () => {
                      onClose?.();
                    },
                  });

                  return;
                }

                nextNotice.postNo > 0 && setNoticeNo(nextNotice.postNo);
              }}
            >
              <span className="notice-detail__index-angle">
                <IconSVG name="angle-r" fill="transparent" stroke="#3f434c" strokeWidth={6} />
              </span>
              <p className="notice-detail__index-text-flag">다음글</p>
              <p className="notice-detail__index-title">
                {nextNotice?.noticed && '[공지] '}
                {nextNotice?.title}
              </p>
            </button>
          }
        />
        <VisibleComponent
          shows={previousNotice}
          TruthyComponent={
            <button
              className="notice-detail__index notice-detail__index--previous"
              onClick={() => {
                const { data: readable } = checkDisplayableState({
                  profile,
                  boardId: NOTICE_BOARD_ID,
                  permissionType: BOARD_PERMISSION_CONFIG_TYPE.READ_PERMISSION,
                });

                if (!readable) {
                  openAlert({
                    message: '게시글 읽기 권한이 없습니다.',
                    onClose: () => {
                      onClose?.();
                    },
                  });

                  return;
                }

                previousNotice?.postNo > 0 && setNoticeNo(previousNotice?.postNo);
                accumulativeItems.length < totalCount && scrollIntoView();
              }}
            >
              <span className="notice-detail__index-angle">
                <IconSVG name="angle-r" fill="transparent" stroke="#3f434c" strokeWidth={6} />
              </span>
              <p className="notice-detail__index-text-flag">이전글</p>
              <p className="notice-detail__index-title">
                {previousNotice?.noticed && '[공지] '}
                {previousNotice?.title}
              </p>
            </button>
          }
        />
        <GoToList onClick={onClose} title="목록보기" />
      </div>
    </FullModal>
  );
};

NoticeDetailModal.propTypes = {
  noticeNo: number,
  currentIndex: number,
  onClose: func,
  accumulativeItems: array,
  noticesRef: object,
};

export default NoticeDetailModal;
