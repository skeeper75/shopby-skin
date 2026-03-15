import { useState, useCallback, useEffect } from 'react';

// @MX:NOTE: [AUTO] 빠른 기간 선택 버튼 (오늘/1주/1개월/3개월) 포함 날짜 범위 선택기
// @MX:SPEC: SPEC-SKIN-005
/**
 * 기간 선택 컴포넌트
 * - 시작일/종료일 input[type="date"] 기반
 * - 빠른 기간 선택 (오늘, 1주, 1개월, 3개월)
 *
 * @param {Object} props
 * @param {string} props.startDate - 시작일 (YYYY-MM-DD)
 * @param {string} props.endDate - 종료일 (YYYY-MM-DD)
 * @param {Function} props.onChange - 날짜 변경 콜백 ({ startDate, endDate })
 */
const DatePicker = ({ startDate: initialStart, endDate: initialEnd, onChange }) => {
  const [startDate, setStartDate] = useState(initialStart || '');
  const [endDate, setEndDate] = useState(initialEnd || '');

  // 외부 props 동기화
  useEffect(() => {
    if (initialStart !== undefined) setStartDate(initialStart);
    if (initialEnd !== undefined) setEndDate(initialEnd);
  }, [initialStart, initialEnd]);

  // 날짜 변경 핸들러
  const handleStartChange = useCallback(
    (e) => {
      const newStart = e.target.value;
      setStartDate(newStart);
      onChange?.({ startDate: newStart, endDate });
    },
    [endDate, onChange]
  );

  const handleEndChange = useCallback(
    (e) => {
      const newEnd = e.target.value;
      setEndDate(newEnd);
      onChange?.({ startDate, endDate: newEnd });
    },
    [startDate, onChange]
  );

  // 빠른 기간 선택 헬퍼
  const setQuickRange = useCallback(
    (days) => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);

      const formatDate = (d) => d.toISOString().split('T')[0];
      const newStart = formatDate(start);
      const newEnd = formatDate(end);

      setStartDate(newStart);
      setEndDate(newEnd);
      onChange?.({ startDate: newStart, endDate: newEnd });
    },
    [onChange]
  );

  // 빠른 선택 버튼 목록
  const quickRanges = [
    { label: '오늘', days: 0 },
    { label: '1주', days: 7 },
    { label: '1개월', days: 30 },
    { label: '3개월', days: 90 },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 빠른 기간 선택 버튼 */}
      <div className="flex items-center gap-1">
        {quickRanges.map(({ label, days }) => (
          <button
            key={label}
            type="button"
            onClick={() => setQuickRange(days)}
            className="h-[32px] px-3 text-xs border border-[#CACACA] rounded hover:bg-[#EEEBF9] hover:border-[#5538B6] text-[#424242] transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* 시작일 */}
      <input
        type="date"
        value={startDate}
        onChange={handleStartChange}
        className="h-[36px] px-3 text-sm border border-[#CACACA] rounded focus:outline-none focus:border-[#5538B6] text-[#424242]"
      />

      <span className="text-[#979797] text-sm">~</span>

      {/* 종료일 */}
      <input
        type="date"
        value={endDate}
        onChange={handleEndChange}
        className="h-[36px] px-3 text-sm border border-[#CACACA] rounded focus:outline-none focus:border-[#5538B6] text-[#424242]"
      />
    </div>
  );
};

export default DatePicker;
