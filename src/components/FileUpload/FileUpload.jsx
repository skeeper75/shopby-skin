import { forwardRef } from 'react';

import { func, arrayOf, shape, number, string } from 'prop-types';

import { useFileActionContext, useFileStateContext } from '@shopby/react-components';
import { convertMegaBytesToBytes } from '@shopby/shared';

const DEFAULT_LIMIT_COUNT = 10;
const DEFAULT_LIMIT_FILE_SIZE_IN_MB = 5;

const FileUpload = forwardRef(
  (
    {
      accept = 'image/*',
      limitFileSizeInMB = DEFAULT_LIMIT_FILE_SIZE_IN_MB,
      limitCount = DEFAULT_LIMIT_COUNT,
      onChange,
    },
    ref
  ) => {
    const { uploadedFiles } = useFileStateContext();
    const { uploadAttachments } = useFileActionContext();

    const checkDuplicateFiles = (files) =>
      !![...files].filter(({ name }) => uploadedFiles.find(({ originalFileName }) => originalFileName === name)).length;

    const validateFiles = (files) => {
      const isDuplicateFiles = checkDuplicateFiles(files);
      if (isDuplicateFiles) {
        throw new Error('이미 업로드된 파일 입니다.');
      }

      const limitFileSizeInBytes = convertMegaBytesToBytes(limitFileSizeInMB);
      const isGreaterThanAllowedSize = [...files].some((file) => file.size > limitFileSizeInBytes);
      if (isGreaterThanAllowedSize) {
        throw new Error(`업로드 용량은 ${limitFileSizeInMB}MB 이하로만 가능합니다.`);
      }

      const isGreaterThanAllowedCount = uploadedFiles.length + files.length > limitCount;
      if (isGreaterThanAllowedCount) {
        throw new Error(`첨부 파일은 ${limitCount}개 까지 등록 가능합니다.`);
      }
    };

    const handleInputChange = async (event) => {
      const { files } = event.target;

      validateFiles(files);

      const { data } = await uploadAttachments(files, {
        limitFileSizeInMegaBytes: limitFileSizeInMB,
        limitCount,
      });

      onChange?.(data.uploadedFiles);

      if (data.rejectedFiles.length > 0) {
        const joinedRejectedMessage = data.rejectedFiles.map(({ message }) => message).join('<br>');
        throw new Error(joinedRejectedMessage);
      }
    };

    return <input hidden ref={ref} type="file" multiple accept={accept} onChange={handleInputChange} />;
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;

FileUpload.propTypes = {
  files: arrayOf(
    shape({
      imageUrl: string,
      originalFileName: string,
      uploadedFileName: string,
    })
  ),
  onChange: func,
  verifyFiles: func,
  limitCount: number,
  limitFileSizeInMB: number,
  accept: string,
  setIsLoading: func,
};
