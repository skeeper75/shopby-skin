import { useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { string, arrayOf, oneOf, shape } from 'prop-types';

import { VisibleComponent, useInquiryActionContext, Slider, Slide } from '@shopby/react-components';
import { getUrlWithAdditionalSearchParams } from '@shopby/shared/utils';

import FullModal from '../../../components/FullModal';
import Sanitized from '../../../components/Sanitized';
import { isImageType, binaryFileDownload } from '../../../utils';

const PersonalInquiryDetailReplyItem = ({ replyType, content, attachFiles = [], registerYmdt, inquiryNo }) => {
  const { fetchInquiryFileDownload } = useInquiryActionContext();
  const [isImageDetailOpen, setIsImageDetailOpen] = useState(false);
  const [modalDetailImages, setModalDetailImages] = useState([]);
  const [modalDetailImageIndex, setModalDetailImageIndex] = useState(0);

  const { images, files } = useMemo(
    () =>
      attachFiles.reduce(
        (acc, cur) => {
          if (isImageType(cur.originalFileName)) {
            acc.images.push(cur);
          } else {
            acc.files.push(cur);
          }

          return acc;
        },
        { images: [], files: [] }
      ),
    [attachFiles]
  );

  const handleFileDownloadClick = async (attachFile) => {
    const { data: blob } = await fetchInquiryFileDownload({
      queryString: {
        uploadedFileName: attachFile.uploadedFileName,
        type: attachFile.type,
      },
      pathVariable: { inquiryNo },
      useAccessToken: true,
    });
    binaryFileDownload(blob, attachFile.originalFileName);
  };

  const handleImageClick = (images, index) => {
    setModalDetailImages(images);
    setModalDetailImageIndex(index);
    setIsImageDetailOpen(true);
  };

  return (
    <div className="inquiry-item__reply">
      <VisibleComponent
        shows={replyType === 'QUESTION'}
        TruthyComponent={<strong className="reply-icon reply-icon--question">Q</strong>}
        FalsyComponent={<strong className="reply-icon reply-icon--answer">A</strong>}
      />

      <div className="inquiry-item__reply-content">
        <VisibleComponent
          shows={replyType === 'ANSWER'}
          TruthyComponent={
            <div className="inquiry-item__top-writer">
              <span className="font-noto bold">운영자</span>
              <span className="inquiry-item__date">{dayjs(registerYmdt).format('YYYY-MM-DD')}</span>
            </div>
          }
        />
        <Sanitized html={content} />
        <div className="article-view__content--attach">
          <div className="article-view__content--attach-images">
            <ul className="inquiry-item__reply-image-list">
              {images.map(({ originalFileName, uploadedFileName }, index) => (
                <li className="folding-images-by-one-row__image-item" key={uploadedFileName}>
                  <img
                    src={getUrlWithAdditionalSearchParams({
                      url: uploadedFileName,
                      additionalSearchParams: '80x80',
                    })}
                    width="80"
                    alt={originalFileName}
                    loading="lazy"
                    onError={(event) => {
                      event.target.src = '//rlyfaazj0.toastcdn.net/no_img.png?80x80';
                    }}
                    onClick={() => handleImageClick(images, index)}
                  />
                  <button className="folding-images-by-one-row__image-zoom-in">
                    <span className="ico ico--magnet-white-12"></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="article-view__content--attach-files">
            <ul>
              {files.map(({ originalFileName, uploadedFileName }) => (
                <li key={uploadedFileName}>
                  <span className="ico ico--clip-16 article-list__item-title-icon"></span>
                  <span
                    className="article-view__content--attach-file-name"
                    onClick={() =>
                      handleFileDownloadClick({
                        originalFileName,
                        uploadedFileName,
                        type: replyType === 'QUESTION' ? 'INQUIRY' : 'INQUIRY_ANSWER',
                      })
                    }
                  >
                    {originalFileName}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <VisibleComponent
        shows={isImageDetailOpen}
        TruthyComponent={
          <FullModal title="첨부파일" onClose={() => setIsImageDetailOpen(false)}>
            <div className="attach-file__detail-images">
              <Slider className="product-image-slider" navigation initialSlide={modalDetailImageIndex}>
                {modalDetailImages.map(({ uploadedFileName, originalFileName }) => (
                  <Slide key={uploadedFileName}>
                    <img src={uploadedFileName} alt={originalFileName} key={uploadedFileName} />
                  </Slide>
                ))}
              </Slider>
            </div>
          </FullModal>
        }
      />
    </div>
  );
};

export default PersonalInquiryDetailReplyItem;

PersonalInquiryDetailReplyItem.propTypes = {
  replyType: oneOf(['ANSWER', 'QUESTION']),
  content: string,
  attachFiles: arrayOf(
    shape({
      originalFileName: string,
      uploadedFileName: string,
    })
  ),
  registerYmdt: string,
  inquiryNo: string,
};
