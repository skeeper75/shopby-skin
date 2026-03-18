import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { string, arrayOf, func, shape, bool, number } from 'prop-types';

import {
  Button,
  AngleTopDown,
  Icon,
  VisibleComponent,
  useInquiryActionContext,
  useProductInquiryActionContext,
  useModalActionContext,
  useAuthActionContext,
} from '@shopby/react-components';

import { binaryFileDownload } from '../../utils';
import FoldingImagesByOneRow from '../FoldingImagesByOnRow';
import FullModal from '../FullModal/FullModal';
import ReportForm from '../ReportForm';
import Sanitized from '../Sanitized';

const InquiryItem = ({
  inquiryTypeLabel = '',
  registerName = '',
  title = '',
  content = '',
  isReplied = false,
  registerDate = '',
  images = [],
  answers = [],
  canModify = true,
  isMine = false,
  isSecreted = false,
  inquiryNo,
  onModify,
  onDelete,
  productNo,
  cancelReportable,
  myInquiry,
}) => {
  const [isActive, setIsActive] = useState(false);
  const { fetchInquiryFileDownload } = useInquiryActionContext();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { postProductInquiryReport, cancelProductInquiryReport } = useProductInquiryActionContext();
  const { openAlert, openConfirm } = useModalActionContext();
  const { isSignedIn } = useAuthActionContext();
  const navigate = useNavigate();
  const { t } = useTranslation(['board', 'common', 'auth']);

  const { modifier: inquiryStatusModifier, label: inquiryStatusLabel } = useMemo(() => {
    if (isReplied) {
      return {
        modifier: 'answered',
        label: '답변완료',
      };
    }

    return {
      modifier: 'ready',
      label: '답변대기',
    };
  }, [isReplied]);

  const _canModify = useMemo(() => {
    if (canModify) return true;

    if (isReplied) return false;

    if (isMine) return true;

    return false;
  }, [isReplied, canModify, isMine]);

  const handleModifyButtonClick = () => {
    onModify();
  };

  const handleDeleteButtonClick = () => {
    onDelete();
  };

  const handleFileDownloadClick = (fileDownloadType) => async (uploadedFileName, fileName) => {
    const { data: blob } = await fetchInquiryFileDownload({
      queryString: {
        uploadedFileName,
        type: fileDownloadType,
      },
      pathVariable: { inquiryNo },
      useAccessToken: true,
    });

    binaryFileDownload(blob, fileName);
  };

  const handleOpenReportClick = () => {
    if (!isSignedIn()) {
      openAlert({
        message: t('loginRequired', { ns: 'auth' }),
        onClose: () => {
          navigate('/sign-in', {
            state: {
              from: `${location.pathname}${location.search}`,
            },
            replace: true,
          });
        },
      });

      return;
    }

    setIsReportOpen(true);
  };

  const handleCloseReportClick = () => {
    setIsReportOpen(false);
  };

  const handleCancelReportClick = () => {
    openConfirm({
      message: t('reportCancelMessage', { ns: 'board' }),
      confirmLabel: t('confirm', { ns: 'common' }),
      onConfirm: async () => {
        const { status } = await cancelProductInquiryReport({
          productNo,
          inquiryNo,
        });

        if (status === 204) {
          openAlert({
            message: t('reportCancelSuccessMessage'),
            onClose: () => {
              location.reload();
            },
          });
        }
      },
    });
  };

  const handleSubmitReport = ({ reportType, reportContent }) => {
    openConfirm({
      message: t('reportMessage', { ns: 'board' }),
      onConfirm: async () => {
        const { status } = await postProductInquiryReport({
          productNo,
          inquiryNo,
          reportType,
          reason: reportContent,
        });

        if (status === 204) {
          openAlert({
            message: t('reportSuccessMessage', { ns: 'board' }),
            onClose: () => {
              setIsReportOpen(false);
              location.reload();
            },
          });
        }
      },
    });
  };

  return (
    <div className={`inquiry-item ${isActive ? 'is-active' : ''}`}>
      <div className="inquiry-item__top">
        <span className="inquiry-item__info">
          {inquiryTypeLabel && <p>{`문의유형 -  ${inquiryTypeLabel}`}</p>}
          <p>{registerName}</p>
          <VisibleComponent
            shows={myInquiry}
            FalsyComponent={
              <>
                <span>|</span>
                <VisibleComponent
                  shows={cancelReportable === 'Y'}
                  TruthyComponent={
                    <button onClick={handleCancelReportClick}>{t('reportCancel', { ns: 'board' })}</button>
                  }
                  FalsyComponent={<button onClick={handleOpenReportClick}>{t('report', { ns: 'board' })}</button>}
                />
              </>
            }
          />
        </span>
        <p className="inquiry-item__date">{registerDate}</p>
      </div>
      <div className="inquiry-item__bottom">
        <FoldingImagesByOneRow
          isActive={isActive}
          inquiryNo={inquiryNo}
          onFileDownload={handleFileDownloadClick('INQUIRY')}
          images={images.map(({ attachFileUrl, originFileName }) => ({
            src: attachFileUrl,
            name: originFileName,
          }))}
          resize="100x100"
        />
        <div className="inquiry-item__content">
          <div className="inquiry-item__info">
            <p className={`inquiry-item__status-label inquiry-item__status-label--${inquiryStatusModifier}`}>
              {inquiryStatusLabel}
            </p>
            <VisibleComponent shows={isSecreted} TruthyComponent={<Icon name="lock" />} />
            <VisibleComponent
              shows={isSecreted && !isMine}
              TruthyComponent={'비밀글입니다.'}
              FalsyComponent={<p className="inquiry-item__title">{title}</p>}
            />
            <VisibleComponent
              shows={!(isSecreted && !isMine)}
              TruthyComponent={
                <AngleTopDown className="inquiry-item__angle-top-down" onToggle={() => setIsActive((prev) => !prev)} />
              }
            />
          </div>
          <div className="inquiry-item__text inquiry-item__text--question">
            <Icon name="q" />

            <div className="inquiry-item__qna-text editor">
              <Sanitized html={content} />
            </div>
          </div>

          <VisibleComponent
            shows={_canModify}
            TruthyComponent={
              <div className="board-form__buttons--small">
                <Button label="삭제" onClick={handleDeleteButtonClick} className="inquiry-form__btn--delete" />
                <Button label="수정" onClick={handleModifyButtonClick} className="inquiry-form__btn--modify" />
              </div>
            }
          />

          <VisibleComponent
            shows={answers.length > 0}
            TruthyComponent={answers.map(({ no, content, registerYmdt }, index) => (
              <div key={`${no}-${index}`} className={'inquiry-item__text inquiry-item__text--answer'}>
                <Icon name="a" />

                <div className="inquiry-item__qna-text">
                  <Sanitized html={content} />
                  <span className="inquiry-item__date">답변일 : {registerYmdt}</span>
                </div>
              </div>
            ))}
          />

          <VisibleComponent
            shows={isReportOpen}
            TruthyComponent={
              <FullModal title={t('reportFormTitle')}>
                <ReportForm onClose={handleCloseReportClick} onSubmit={handleSubmitReport} />
              </FullModal>
            }
          />
        </div>
      </div>
    </div>
  );
};

InquiryItem.propTypes = {
  onModify: func.isRequired,
  onDelete: func.isRequired,
  registerName: string,
  inquiryTypeLabel: string,
  isReplied: bool,
  title: string,
  content: string,
  registerDate: string,
  images: arrayOf(
    shape({
      imageUrl: string,
      originFileName: string,
    })
  ),
  isMine: bool,
  isSecreted: bool,
  canModify: bool,
  answers: arrayOf(
    shape({
      no: number,
      content: string,
      registerYmdt: string,
    })
  ),
  canAttach: bool,
  productNo: number,
  inquiryNo: number,
  cancelReportable: string,
  myInquiry: bool,
};

export default InquiryItem;
