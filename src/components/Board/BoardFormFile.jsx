import { forwardRef } from 'react';

import { string, shape, arrayOf, number, func, bool } from 'prop-types';

import { Button, VisibleComponent } from '@shopby/react-components';
import { getUrlWithAdditionalSearchParams } from '@shopby/shared/utils';

import { BOARD_IMAGE } from '../../constants/image';
import { isImageType } from '../../utils';
import FileUpload from '../FileUpload';

const BoardFormFile = forwardRef(
  ({ configuration, onClick, files = [], onChange, onDelete, canAttach = true, accept }, ref) => {
    const handleFilesChange = (selectedFiles) => {
      if (!selectedFiles.length) return;

      onChange?.([...files, ...selectedFiles]);
    };

    const handleImageDelete = (file) => {
      if (!file) return;

      onDelete?.(file);
    };

    return (
      <>
        <VisibleComponent
          shows={canAttach}
          TruthyComponent={
            <>
              <FileUpload
                className="board-form__file-upload"
                ref={ref}
                onChange={handleFilesChange}
                limitFileSizeInMB={configuration?.LIMIT_MEGA_BYTES}
                limitCount={configuration?.LIMIT_COUNT}
                accept={accept}
              />
              <Button className="board-form__upload-btn" label="파일 첨부하기" onClick={onClick} />
              <ul className="board-form__image-files">
                {files.map((file, index) => {
                  const isImage = isImageType(file.originalFileName);

                  return (
                    <li key={index} className="attach-file__item">
                      {isImage && (
                        <img
                          src={getUrlWithAdditionalSearchParams({
                            url: file.uploadedFileName,
                            additionalSearchParams: BOARD_IMAGE.THUMB_NAIL_SIZE,
                          })}
                          alt={file.originalFileName}
                          loading="lazy"
                        />
                      )}
                      <div className="attach-file__name" title={file.originalFileName}>
                        {file.originalFileName}
                      </div>
                      <button className="attach-file__remove-button" onClick={() => handleImageDelete(file)}>
                        <span className="ico ico--circle-x-gray-bg"></span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="board-form__notice-wrap">
                <p className="board-form__notice-text">
                  파일명에는 특수 문자 &apos; &quot; ` &lt; &gt; ; . 을 포함할 수 없습니다.
                </p>
                <p className="board-form__notice-text">
                  업로드 용량은 {configuration?.LIMIT_MEGA_BYTES}MB 이하로만 가능 합니다.
                </p>
              </div>
            </>
          }
        />
      </>
    );
  }
);

BoardFormFile.displayName = 'BoardFormFile';

BoardFormFile.propTypes = {
  configuration: shape({
    LIMIT_MEGA_BYTES: number,
    LIMIT_COUNT: number,
  }),
  files: arrayOf(
    shape({
      type: string,
      uploadedFileName: string,
      originalFileName: string,
    })
  ),
  onClick: func,
  onChange: func,
  onDelete: func,
  canAttach: bool,
  validateFiles: func,
  accept: string,
};

export default BoardFormFile;
