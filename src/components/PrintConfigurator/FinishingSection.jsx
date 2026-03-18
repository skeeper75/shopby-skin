import { useState } from 'react';

import { cn } from '../../lib/utils';

const FINISHING_OPTIONS = [
  { value: 'STAPLE', label: '스테이플 제본' },
  { value: 'BINDING_SPIRAL', label: '링 제본' },
  { value: 'FOLDING', label: '접지' },
  { value: 'PERFORATION', label: '타공' },
  { value: 'SCORING', label: '접음선 가공' },
];

// @MX:NOTE: [AUTO] 마감 옵션 섹션 - 접기/펴기 UI, 복수 선택 가능
const FinishingSection = ({ selected, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#CACACA] rounded-[5px] overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F6F6F6] text-sm font-semibold text-[#424242] tracking-[-0.05em]"
      >
        <span>
          마감 옵션
          {selected.length > 0 && (
            <span className="ml-2 text-xs text-[#5538B6]">({selected.length}개 선택됨)</span>
          )}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn('transition-transform', isOpen && 'rotate-180')}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 flex flex-wrap gap-2">
          {FINISHING_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className={cn(
                'px-3 py-2 text-sm rounded-[5px] border transition-colors tracking-[-0.05em]',
                selected.includes(value)
                  ? 'bg-white border-[#5538B6] text-[#5538B6] font-semibold'
                  : 'bg-white border-[#CACACA] text-[#424242] hover:border-[#5538B6]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinishingSection;
