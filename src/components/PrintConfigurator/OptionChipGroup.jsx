import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] 인쇄 옵션 칩 그룹 - 선택 상태: 흰 배경 + 테두리 강조 (RULE-2)
const OptionChipGroup = ({ options, selected, onSelect, error, label }) => (
  <div>
    {label && (
      <p className="text-sm font-semibold text-[#424242] mb-2 tracking-[-0.05em]">{label}</p>
    )}
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, label: optLabel, disabled: optDisabled }) => (
        <button
          key={value}
          type="button"
          disabled={optDisabled}
          onClick={() => onSelect(value)}
          className={cn(
            'px-4 py-2 text-sm rounded-[5px] border transition-colors tracking-[-0.05em] font-medium',
            selected === value
              ? 'bg-white border-[#5538B6] text-[#5538B6]'
              : 'bg-white border-[#CACACA] text-[#424242] hover:border-[#5538B6]',
            optDisabled && 'opacity-40 cursor-not-allowed'
          )}
        >
          {optLabel}
        </button>
      ))}
    </div>
    {error && <p className="mt-1 text-xs text-[#EF4444] tracking-[-0.05em]">{error}</p>}
  </div>
);

export default OptionChipGroup;
