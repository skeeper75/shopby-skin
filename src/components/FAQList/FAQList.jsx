import { useState, useCallback, useEffect } from 'react';

import { number, string, array, bool } from 'prop-types';

import {
  Icon,
  IconBtn,
  VisibleComponent,
  useArticleActionContext,
  useArticleStateContext,
  useBoardConfigurationContextAction,
  useAuthStateContext,
  useModalActionContext,
} from '@shopby/react-components';
import { BOARD_PERMISSION_CONFIG_TYPE } from '@shopby/shared/constants';

import ListSkeleton from '../../components/ListSkeleton/ListSkeleton';
import Sanitized from '../Sanitized';

const EmptyFAQList = () => (
  <div className="empty-list">
    <p>등록된 FAQ가 없습니다.</p>
  </div>
);

const LockedFAQ = ({ articleNo }) => (
  <li key={articleNo} className={'faq-list__content-wrap customer-center__content-warp'}>
    <div className="faq-list__content faq-list__question customer-center__content customer-center__content--question">
      <Icon className="ico ico--lock" name="lock" />
      <p>비밀글입니다.</p>
    </div>
  </li>
);

LockedFAQ.propTypes = {
  articleNo: number,
};

const FAQList = ({ questions, faqNo, isLoading }) => {
  const { openAlert } = useModalActionContext();
  const { checkDisplayableState } = useBoardConfigurationContextAction();
  const { fetchBoardPostDetail } = useArticleActionContext();
  const { boardPostDetail } = useArticleStateContext();
  const { profile } = useAuthStateContext();

  const [selectedAnswerNo, setSelectedAnswerNo] = useState(0);

  const showsAnswer = useCallback(
    (articleNo, postNo) => selectedAnswerNo === articleNo && articleNo === postNo,
    [selectedAnswerNo]
  );
  const handleQuestionClick = (articleNo) => {
    const { data: readable } = checkDisplayableState({
      profile,
      boardNo: faqNo,
      permissionType: BOARD_PERMISSION_CONFIG_TYPE.READ_PERMISSION,
    });

    if (!readable) {
      openAlert({
        message: '게시글 읽기 권한이 없습니다.',
      });

      return;
    }

    setSelectedAnswerNo((prevNo) => (prevNo === articleNo ? 0 : articleNo));
  };

  useEffect(() => {
    selectedAnswerNo > 0 &&
      fetchBoardPostDetail({
        boardNo: faqNo,
        postNo: selectedAnswerNo,
      });
  }, [selectedAnswerNo]);
  if (isLoading) return <ListSkeleton isLoading={isLoading} />;

  return (
    <VisibleComponent
      shows={questions.length > 0}
      TruthyComponent={
        <ul className="faq-list">
          {questions.map((faq) => (
            <VisibleComponent
              key={faq.postNo}
              shows={faq.secreted}
              TruthyComponent={<LockedFAQ key={faq.postNo} articleNo={faq.postNo} />}
              FalsyComponent={
                <li
                  key={faq.postNo}
                  className={`faq-list__content-wrap customer-center__content-warp${
                    showsAnswer(faq.postNo, boardPostDetail.postNo) ? ' is-open' : ''
                  }`}
                  onClick={() => handleQuestionClick(faq.postNo)}
                >
                  <div className="faq-list__content faq-list__question customer-center__content customer-center__content--question">
                    <span className="ico ico--q"></span>
                    <p>
                      {faq.noticed ? '[공지]' : ''} {faq.title}
                    </p>
                    <IconBtn className="arrow" iconType="angle-down" />
                  </div>
                  {showsAnswer(faq.postNo, boardPostDetail.postNo) && boardPostDetail.content && (
                    <div className="faq-list__content editor faq-list__answer customer-center__content customer-center__content--answer">
                      <span className="ico ico--a"></span>
                      <Sanitized className="sanitize-wrap" html={boardPostDetail.content} style={{ width: '100%' }} />
                    </div>
                  )}
                </li>
              }
            />
          ))}
        </ul>
      }
      FalsyComponent={<EmptyFAQList />}
    />
  );
};

export default FAQList;

FAQList.displayName = 'FAQList';

FAQList.propTypes = {
  faqNo: number,
  pageSize: number,
  keyword: string,
  questions: array,
  isLoading: bool,
};
