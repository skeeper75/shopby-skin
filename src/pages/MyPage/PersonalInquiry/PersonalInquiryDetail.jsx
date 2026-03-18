import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

import {
  InquiryProvider,
  InquiryFormProvider,
  ImageFileProvider,
  FileProvider,
  useInquiryFormStateContext,
  useInquiryFormActionContext,
  useInquiryStateContext,
  useInquiryActionContext,
  useModalActionContext,
  useMallStateContext,
  useFileActionContext,
  VisibleComponent,
} from '@shopby/react-components';
import { getUrlWithAdditionalSearchParams } from '@shopby/shared/utils';

import { BoardFormModification } from '../../../components/Board';
import FullModal from '../../../components/FullModal';
import { PERSONAL_INQUIRY_IMAGE, PERSONAL_INQUIRY_ACCEPT } from '../../../constants/image';
import useLayoutChanger from '../../../hooks/useLayoutChanger';

import PersonalInquiryDetailReplyItem from './PersonalInquiryDetailReplyItem';
import PersonalInquiryStatus from './PersonalInquiryStatus';

const PersonalInquiryDetailContent = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const { inquiryNo } = useParams();

  const { inquiryTypes = [] } = useMallStateContext();
  const { inquiryDetail } = useInquiryFormStateContext();
  const { fetchInquiryBy, deleteInquiryByInquiryNo, patchInquiryByInquiryNo } = useInquiryFormActionContext();
  const { fetchInquiryConfiguration } = useInquiryActionContext();
  const { openConfirm, openAlert } = useModalActionContext();
  const { setUploadedFiles } = useFileActionContext();
  const { inquiryConfiguration } = useInquiryStateContext();

  const [isModificationModalOpen, setIsModificationModalOpen] = useState(false);

  const { imageUrls } = inquiryDetail;
  const { originalImageUrls } = inquiryDetail;

  const questionFiles = useMemo(
    () =>
      imageUrls.map((url, index) => ({
        originalFileName: originalImageUrls[index],
        uploadedFileName: url,
      })),
    [imageUrls, originalImageUrls]
  );

  const handleDeleteButtonClick = () => {
    openConfirm({
      message: (
        <>
          삭제 시 복구가 불가능합니다. <br />
          정말 삭제하시겠습니까?
        </>
      ),
      onConfirm: async () => {
        await deleteInquiryByInquiryNo({
          inquiryNo,
        });
        navigate('/my-page/personal-inquiry');
      },
      confirmLabel: '삭제',
    });
  };

  const handleModifyButtonClick = () => {
    setIsModificationModalOpen(true);

    setUploadedFiles(questionFiles);
  };

  const handleFormModify = async () => {
    const { title, content, files } = formRef.current.formData;

    await patchInquiryByInquiryNo({
      inquiryNo: inquiryDetail.inquiryNo,
      inquiryTitle: title,
      inquiryContent: content,
      originalFileNames: files.map(({ originalFileName }) => originalFileName),
      uploadedFileNames: files.map(({ uploadedFileName }) => uploadedFileName),
      usesEmailNotificationWhenRegisteringAnswer: inquiryDetail.usesEmailNotificationWhenRegisteringAnswer,
      usesSmsNotificationWhenRegisteringAnswer: inquiryDetail.usesSmsNotificationWhenRegisteringAnswer,
    });

    openAlert({
      message: '게시글이 수정되었습니다.',
      onClose: () => {
        setIsModificationModalOpen(false);
        location.reload();
      },
    });
  };

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: `${inquiryConfiguration?.name ?? '1:1문의'} 상세`,
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  useEffect(() => {
    fetchInquiryConfiguration();
    fetchInquiryBy({ inquiryNo });
  }, [inquiryNo]);

  // 문의 유형 옵션
  const inquiryTypeSelectOptions = useMemo(
    () =>
      inquiryTypes.map(({ inquiryTypeNo, inquiryTypeName }) => ({
        label: inquiryTypeName,
        value: `${inquiryTypeNo}`,
      })),
    [inquiryTypes]
  );

  return (
    <div className="personal-inquiry">
      <div className="personal-inquiry-detail">
        <div className="inquiry-item">
          <div className="inquiry-item__top">
            <PersonalInquiryStatus inquiryStatus={inquiryDetail.inquiryStatus} />
            <div className="inquiry-item__top-writer">
              <span className="font-noto bold">{inquiryDetail.issuerName}</span>
              <span className="inquiry-item__date">
                {inquiryDetail.registerYmdt && dayjs(inquiryDetail.registerYmdt).format('YYYY-MM-DD')}
              </span>
            </div>
          </div>
          <div className="inquiry-item__bottom">
            <img
              src={getUrlWithAdditionalSearchParams({
                url: imageUrls[0],
                additionalSearchParams: '80x80',
              })}
              width="80"
              alt="1:1문의 이미지"
              className="inquiry-item__bottom-img"
              loading="lazy"
              onError={(event) => {
                event.target.src = '//rlyfaazj0.toastcdn.net/no_img.png?80x80';
              }}
            />
            <div className="inquiry-item__inquiry-info">
              <p className="inquiry-item__inquiry-type">문의유형 - {inquiryDetail.inquiryTypeInformation?.name}</p>
              <p className="inquiry-item__inquiry-title">
                <span className="ico ico--lock-black-16"></span>
                {inquiryDetail.inquiryTitle}
              </p>
            </div>
          </div>
        </div>

        <PersonalInquiryDetailReplyItem
          inquiryNo={inquiryNo}
          replyType="QUESTION"
          content={inquiryDetail.inquiryContent}
          attachFiles={questionFiles}
        />

        <VisibleComponent
          shows={inquiryDetail.answerInformation}
          TruthyComponent={
            <PersonalInquiryDetailReplyItem
              inquiryNo={inquiryNo}
              replyType="ANSWER"
              content={inquiryDetail.answerInformation?.content}
              attachFiles={inquiryDetail.answerInformation?.files}
              registerYmdt={inquiryDetail.answerInformation?.registerYmdt}
            />
          }
        />

        <VisibleComponent
          shows={inquiryDetail.inquiryStatus === 'ISSUED' || inquiryDetail.inquiryStatus === 'ASKED'}
          TruthyComponent={
            <div className="personal-inquiry-detail__btn-group inquiry-actions">
              <button className="btn btn--fill-dark btn--lg" onClick={handleModifyButtonClick}>
                수정
              </button>
              <button className="btn btn--fill-dark btn--lg" onClick={handleDeleteButtonClick}>
                삭제
              </button>
            </div>
          }
        />

        <div className="personal-inquiry-detail__btn-group">
          <Link to="/my-page/personal-inquiry">
            <button className="btn btn--fill-dark btn--lg personal-inquiry-detail__list-btn">목록</button>
          </Link>
        </div>
      </div>

      <VisibleComponent
        shows={isModificationModalOpen}
        TruthyComponent={
          <FullModal
            title={`${inquiryConfiguration?.name} 수정`}
            onClose={() => {
              setIsModificationModalOpen(false);
            }}
          >
            <BoardFormModification
              ref={formRef}
              className="personal-inquiry-form"
              canAttach={inquiryConfiguration.usesAttachment}
              typeSelectorOption={{
                value: `${inquiryDetail.inquiryTypeInformation.no}`,
                disabled: true,
                options: inquiryTypeSelectOptions,
              }}
              titleOption={{
                value: inquiryDetail.inquiryTitle,
              }}
              textOption={{
                value: inquiryDetail.inquiryContent,
              }}
              imageFileUploadOption={{
                configuration: PERSONAL_INQUIRY_IMAGE,
                accept: PERSONAL_INQUIRY_ACCEPT,
              }}
              onModify={handleFormModify}
              onCancel={() => {
                setIsModificationModalOpen(false);
              }}
              files={questionFiles}
            />
          </FullModal>
        }
      />
    </div>
  );
};

const PersonalInquiryDetail = () => (
  <InquiryProvider>
    <InquiryFormProvider>
      <ImageFileProvider>
        <FileProvider>
          <PersonalInquiryDetailContent />
        </FileProvider>
      </ImageFileProvider>
    </InquiryFormProvider>
  </InquiryProvider>
);

PersonalInquiryDetail.propTypes = {};

export default PersonalInquiryDetail;
