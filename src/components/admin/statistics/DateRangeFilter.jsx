// @MX:ANCHOR: [AUTO] DateRangeFilter - 기간 필터 컴포넌트 (preset + custom)
// @MX:REASON: [AUTO] fan_in >= 3 (DashboardPage, SalesPage, 각 통계 페이지 등 다수 사용)
// @MX:SPEC: SPEC-SKIN-008

import { useState } from 'react';
import { cn } from '../../../lib/utils';

/** 프리셋 기간 정의 */
const PRESETS = [
  { label: '오늘', days: 0 },
  { label: '이번주', days: 7 },
  { label: '이번달', days: 30 },
  { label: '3개월', days: 90 },
];

/**
 * 날짜를 YYYY-MM-DD 형식으로 반환합니다.
 * @param {Date} date
 * @returns {string}
 */
const toISODate = (date) => date.toISOString().split('T')[0];

/**
 * 기간 필터 컴포넌트
 * @param {Object} props
 * @param {{from: string, to: string}} props.value - 현재 선택 기간
 * @param {function} props.onChange - 변경 핸들러 ({from, to}) => void
 */
const DateRangeFilter = ({ value, onChange }) => {
  const [activePreset, setActivePreset] = useState(null);

  const handlePreset = (preset) => {
    const today = new Date();
    const from = preset.days === 0 ? today : new Date(today.getTime() - preset.days * 86400000);
    setActivePreset(preset.label);
    onChange({ from: toISODate(from), to: toISODate(today) });
  };

  const handleCustomChange = (field, val) => {
    setActivePreset(null);
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* 프리셋 버튼 */}
      <div className="flex gap-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => handlePreset(preset)}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium border transition-colors',
              activePreset === preset.label
                ? 'bg-[--huni-bg-brand] text-white border-[--huni-bg-brand]'
                : 'bg-white text-[--huni-fg-default] border-[--huni-stroke-default] hover:border-[--huni-bg-brand] hover:text-[--huni-bg-brand]'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* 구분선 */}
      <div className="w-px h-6 bg-[--huni-stroke-default]" />

      {/* 직접 입력 */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value?.from ?? ''}
          onChange={(e) => handleCustomChange('from', e.target.value)}
          className="h-9 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
        />
        <span className="text-[--huni-fg-muted] text-sm">~</span>
        <input
          type="date"
          value={value?.to ?? ''}
          onChange={(e) => handleCustomChange('to', e.target.value)}
          className="h-9 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
