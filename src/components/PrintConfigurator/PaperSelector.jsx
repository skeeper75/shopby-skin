import { useState, useRef, useEffect } from 'react';

import { cn } from '../../lib/utils';

const PAPER_OPTIONS = [
  { value: 'ART_COAT_130', label: '아트코트지 130g' },
  { value: 'ART_COAT_200', label: '아트코트지 200g' },
  { value: 'MATTE_COAT_130', label: '매트코트지 130g' },
  { value: 'MATTE_COAT_200', label: '매트코트지 200g' },
  { value: 'GENERAL_COPY', label: '일반복사지 80g' },
];

// @MX:NOTE: [AUTO] 용지 선택 커스텀 드롭다운 - RULE-1: 네이티브 select 미사용, 커스텀 드롭다운 구현
const PaperSelector = ({ selected, onSelect, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selectedLabel = PAPER_OPTIONS.find((o) => o.value === selected)?.label ?? '용지를 선택해주세요';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <p className="text-sm font-semibold text-[#424242] mb-2 tracking-[-0.05em]">용지</p>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full h-[44px] flex items-center justify-between px-3 border rounded-[5px] text-sm tracking-[-0.05em] bg-white transition-colors',
          selected ? 'border-[#5538B6] text-[#424242]' : 'border-[#CACACA] text-[#979797]',
          isOpen && 'border-[#5538B6]'
        )}
      >
        <span>{selectedLabel}</span>
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
        <ul className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#CACACA] rounded-[5px] shadow-sm overflow-hidden">
          {PAPER_OPTIONS.map(({ value, label }) => (
            <li key={value}>
              <button
                type="button"
                onClick={() => {
                  onSelect(value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2.5 text-sm tracking-[-0.05em] hover:bg-[#F6F6F6] transition-colors',
                  selected === value ? 'text-[#5538B6] font-semibold' : 'text-[#424242]'
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1 text-xs text-[#EF4444] tracking-[-0.05em]">{error}</p>}
    </div>
  );
};

export default PaperSelector;
