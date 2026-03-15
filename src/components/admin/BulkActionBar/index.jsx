import { useState, useCallback } from 'react';

// @MX:NOTE: [AUTO] 주문 상태 흐름 정의 - 순차적 상태 변경만 허용
const ORDER_STATUSES = [
  '접수',
  '파일확인',
  '제작진행',
  '제작완료',
  '배송중',
  '배송완료',
];

/**
 * 일괄 액션 툴바 컴포넌트
 * - 항목 선택 시 표시되는 하단 고정 툴바
 * - 선택된 건수 표시, 상태 변경 드롭다운, 액션 버튼
 *
 * @param {Object} props
 * @param {number} props.selectedCount - 선택된 항목 수
 * @param {Function} props.onStatusChange - 상태 변경 콜백 (status)
 * @param {Function} props.onPrint - 주문서 출력 콜백
 * @param {Function} props.onSms - SMS 발송 콜백
 * @param {Function} props.onClear - 선택 해제 콜백
 * @param {boolean} props.visible - 표시 여부
 */
const BulkActionBar = ({
  selectedCount = 0,
  onStatusChange,
  onPrint,
  onSms,
  onClear,
  visible = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  // 상태 변경 실행
  const handleStatusChange = useCallback(() => {
    if (!selectedStatus) {
      alert('변경할 상태를 선택해주세요.');
      return;
    }
    onStatusChange?.(selectedStatus);
    setSelectedStatus('');
  }, [selectedStatus, onStatusChange]);

  if (!visible || selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#5538B6] shadow-lg px-6 py-3">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        {/* 선택된 건수 표시 */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center bg-[#5538B6] text-white text-sm font-semibold rounded-full px-3 py-1">
            {selectedCount}건 선택됨
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-[#979797] hover:text-[#424242] underline"
          >
            선택 해제
          </button>
        </div>

        {/* 액션 영역 */}
        <div className="flex items-center gap-3">
          {/* 상태 변경 드롭다운 + 버튼 */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-[36px] px-3 text-sm border border-[#CACACA] rounded focus:outline-none focus:border-[#5538B6] text-[#424242]"
            >
              <option value="">상태 선택</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleStatusChange}
              className="h-[36px] px-4 bg-[#5538B6] text-white text-sm rounded hover:bg-[#4530A0] transition-colors"
            >
              일괄 변경
            </button>
          </div>

          {/* 주문서 출력 */}
          <button
            type="button"
            onClick={onPrint}
            className="h-[36px] px-4 border border-[#CACACA] text-[#424242] text-sm rounded hover:bg-[#F6F6F6] transition-colors"
          >
            주문서 출력
          </button>

          {/* SMS 발송 */}
          <button
            type="button"
            onClick={onSms}
            className="h-[36px] px-4 border border-[#CACACA] text-[#424242] text-sm rounded hover:bg-[#F6F6F6] transition-colors"
          >
            SMS 발송
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;
