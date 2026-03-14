import { useMemo, useRef, useEffect } from 'react';

import { shape, object, bool } from 'prop-types';

import {
  SelectBox,
  VisibleComponent,
  useClaimActionContext,
  useClaimStateContext,
  Button,
  useFileStateContext,
  useFileActionContext,
} from '@shopby/react-components';
import { getUrlWithAdditionalSearchParams } from '@shopby/shared';

import FileUpload from '../../components/FileUpload';
import { CLAIM_REASON_DETAIL_MAX_LENGTH } from '../../constants/form';
import { CLAIM_IMAGE } from '../../constants/image';

const ClaimReasonForm = ({ refs, useImageUploader = false }) => {
  const fileUploadRef = useRef();
  const { claimReasonSelectRef, claimReasonDetailTextareaRef } = refs ?? {};
  const { claimInfo, claimReason, claimReasonDetail } = useClaimStateContext();
  const { updateClaimReason, updateClaimReasonDetail, updateClaimImageUrls } = useClaimActionContext();
  const { uploadedFiles } = useFileStateContext();
  const { deleteUploadedFile } = useFileActionContext();

  const claimReasonOptions = useMemo(
    () => claimInfo?.claimReasonTypes.map(({ claimReasonType: value, label }) => ({ label, value })) ?? [],
    [claimInfo?.claimReasonTypes]
  );

  const handleClaimReasonSelect = ({ currentTarget: { value } }) => {
    updateClaimReason(value);
  };

  const handleClaimReasonDetailChange = ({ currentTarget: { value } }) => {
    const isLengthOverflow = value.length > CLAIM_REASON_DETAIL_MAX_LENGTH;

    updateClaimReasonDetail(isLengthOverflow ? value.slice(0, CLAIM_REASON_DETAIL_MAX_LENGTH) : value);
  };

  const handleUploadButtonClick = () => {
    fileUploadRef.current.click();
  };

  useEffect(() => {
    const nextClaimImageUrls = uploadedFiles.map(({ uploadedFileName }) => uploadedFileName);
    updateClaimImageUrls(nextClaimImageUrls);
  }, [uploadedFiles]);

  return (
    <section className="claim__section claim__reason">
      <SelectBox
        ref={claimReasonSelectRef}
        className="claim__select-box"
        options={claimReasonOptions}
        hasEmptyOption={true}
        emptyOptionLabel="사유를 선택해주세요"
        value={claimReason}
        onSelect={handleClaimReasonSelect}
      />
      <p className="claim__sub-title">상세 사유</p>
      <textarea
        ref={claimReasonDetailTextareaRef}
        className="claim__reason-detail"
        placeholder="상세 사유를 입력해주세요"
        value={claimReasonDetail}
        onChange={handleClaimReasonDetailChange}
      />
      <VisibleComponent
        shows={useImageUploader}
        TruthyComponent={
          <>
            <FileUpload
              ref={fileUploadRef}
              className="board-form__file-upload"
              accept="image/*"
              limitFileSizeInMB={CLAIM_IMAGE.LIMIT_MEGA_BYTES}
              limitCount={CLAIM_IMAGE.LIMIT_COUNT}
            />
            <Button className="board-form__upload-btn" label="사진 첨부하기" onClick={handleUploadButtonClick} />
            <ul className="board-form__image-files">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="attach-file__item">
                  <img
                    src={getUrlWithAdditionalSearchParams({
                      url: file.uploadedFileName,
                      additionalSearchParams: CLAIM_IMAGE.THUMB_NAIL_SIZE,
                    })}
                    alt={file.originalFileName}
                    loading="lazy"
                  />
                  <div className="attach-file__name">{file.originalFileName}</div>
                  <button className="attach-file__remove-button" onClick={() => deleteUploadedFile(file)}>
                    <span className="ico ico--circle-x-gray-bg"></span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="board-form__notice-text">
              업로드 용량은 {CLAIM_IMAGE.LIMIT_MEGA_BYTES}MB 이하로만 가능 합니다.
            </p>
          </>
        }
      />
    </section>
  );
};

export default ClaimReasonForm;

ClaimReasonForm.propTypes = {
  refs: shape({
    claimReasonSelectRef: object,
    claimReasonDetailTextareaRef: object,
  }),
  useImageUploader: bool,
};
