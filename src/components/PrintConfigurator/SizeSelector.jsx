import { cn } from '../../lib/utils';
import OptionChipGroup from './OptionChipGroup';

const SIZE_OPTIONS = [
  { value: 'A4', label: 'A4' },
  { value: 'A5', label: 'A5' },
  { value: 'A3', label: 'A3' },
  { value: 'B5', label: 'B5' },
  { value: 'CUSTOM', label: '맞춤 사이즈' },
];

// @MX:NOTE: [AUTO] 사이즈 선택 + 맞춤 사이즈 입력 - CUSTOM 선택 시 가로/세로 mm 입력 필드 노출
const SizeSelector = ({ selected, customWidth, customHeight, onSelect, onCustomChange, error }) => (
  <div>
    <OptionChipGroup
      label="사이즈"
      options={SIZE_OPTIONS}
      selected={selected}
      onSelect={onSelect}
      error={error}
    />
    {selected === 'CUSTOM' && (
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={customWidth}
            onChange={(e) => onCustomChange('customWidth', e.target.value)}
            placeholder="가로"
            min={1}
            className="w-20 h-[44px] border border-[#CACACA] rounded-[5px] px-3 text-sm text-[#424242] tracking-[-0.05em] focus:outline-none focus:border-[#5538B6]"
          />
          <span className="text-xs text-[#979797]">mm</span>
        </div>
        <span className="text-[#CACACA]">×</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={customHeight}
            onChange={(e) => onCustomChange('customHeight', e.target.value)}
            placeholder="세로"
            min={1}
            className="w-20 h-[44px] border border-[#CACACA] rounded-[5px] px-3 text-sm text-[#424242] tracking-[-0.05em] focus:outline-none focus:border-[#5538B6]"
          />
          <span className="text-xs text-[#979797]">mm</span>
        </div>
      </div>
    )}
  </div>
);

export default SizeSelector;
