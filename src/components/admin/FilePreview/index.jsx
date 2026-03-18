import { useCallback } from 'react';

// @MX:NOTE: [AUTO] PDF는 iframe, 이미지는 img 태그로 미리보기 - 지원하지 않는 형식은 에러 메시지 표시
// @MX:SPEC: SPEC-SKIN-005
/**
 * 파일 미리보기 모달 컴포넌트
 * - PDF (iframe) 및 이미지 (img) 미리보기 지원
 * - 확인완료 / 재업로드 요청 버튼
 *
 * @param {Object} props
 * @param {Object} props.file - 파일 정보 { name, url, type, size, uploadDate }
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {Function} props.onClose - 닫기 콜백
 * @param {Function} props.onApprove - 확인완료 콜백
 * @param {Function} props.onReupload - 재업로드 요청 콜백
 */
const FilePreview = ({
  file,
  isOpen = false,
  onClose,
  onApprove,
  onReupload,
}) => {
  // 배경 클릭 시 닫기
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    },
    [onClose]
  );

  // 파일 타입 판별 (PDF vs 이미지)
  const isPdf = file?.type === 'application/pdf' || file?.name?.endsWith('.pdf');

  if (!isOpen || !file) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-[720px] max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CACACA]">
          <h3 className="text-lg font-semibold text-[#424242]">파일 미리보기</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#979797] hover:text-[#424242] text-xl"
          >
            ✕
          </button>
        </div>

        {/* 파일 정보 */}
        <div className="px-6 py-3 bg-[#F6F6F6] border-b border-[#CACACA]">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[#424242] truncate max-w-[400px]">
              {file.name}
            </span>
            <div className="flex items-center gap-4 text-[#979797]">
              <span>{file.size}</span>
              <span>{file.uploadDate}</span>
            </div>
          </div>
        </div>

        {/* 미리보기 영역 */}
        <div className="flex-1 overflow-auto p-4 min-h-[400px] flex items-center justify-center bg-[#FAFAFA]">
          {isPdf ? (
            <iframe
              src={file.url}
              title={file.name}
              className="w-full h-[500px] border border-[#CACACA] rounded"
            />
          ) : (
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-[500px] object-contain rounded"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML =
                  '<p class="text-[#979797] text-sm">미리보기를 지원하지 않는 파일 형식입니다.</p>';
              }}
            />
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#CACACA]">
          <button
            type="button"
            onClick={() => onReupload?.(file)}
            className="h-[36px] px-5 border border-[#CACACA] text-[#424242] text-sm rounded hover:bg-[#F6F6F6] transition-colors"
          >
            재업로드 요청
          </button>
          <button
            type="button"
            onClick={() => onApprove?.(file)}
            className="h-[36px] px-5 bg-[#5538B6] text-white text-sm rounded hover:bg-[#4530A0] transition-colors"
          >
            확인완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
