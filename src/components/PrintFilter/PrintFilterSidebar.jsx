import { useState } from 'react';

import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] 인쇄 옵션 필터 사이드바 - 사이즈/용지/코팅 조건으로 상품 목록 필터링
const SIZE_OPTIONS = [
  { value: 'A4', label: 'A4' },
  { value: 'A5', label: 'A5' },
  { value: 'A3', label: 'A3' },
  { value: 'B5', label: 'B5' },
  { value: 'CUSTOM', label: '맞춤 사이즈' },
];

const PAPER_OPTIONS = [
  { value: 'ART_COAT_130', label: '아트코트지 130g' },
  { value: 'ART_COAT_200', label: '아트코트지 200g' },
  { value: 'MATTE_COAT_130', label: '매트코트지 130g' },
  { value: 'MATTE_COAT_200', label: '매트코트지 200g' },
  { value: 'GENERAL_COPY', label: '일반복사지 80g' },
];

const COATING_OPTIONS = [
  { value: 'NONE', label: '무코팅' },
  { value: 'GLOSSY', label: '유광 코팅' },
  { value: 'MATTE', label: '무광 코팅' },
  { value: 'SOFT_TOUCH', label: '소프트터치 코팅' },
];

const FilterSection = ({ title, options, selected, onToggle }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-[#424242] mb-3 tracking-[-0.05em]">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onToggle(value)}
          className={cn(
            'px-3 py-1.5 text-xs rounded-[5px] border transition-colors tracking-[-0.05em]',
            selected.includes(value)
              ? 'bg-white border-[#5538B6] text-[#5538B6] font-semibold'
              : 'bg-white border-[#CACACA] text-[#424242] hover:border-[#5538B6]'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

// @MX:ANCHOR: [AUTO] PrintFilterSidebar - 카테고리 목록 페이지에서 인쇄 필터 제공
// @MX:REASON: DisplayCategoryList, 검색 결과 페이지에서 공통 사용
const PrintFilterSidebar = ({ onFilterChange, className }) => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [selectedCoatings, setSelectedCoatings] = useState([]);

  const toggle = (setter, getter) => (value) => {
    setter((prev) => {
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      return next;
    });
  };

  const handleApply = () => {
    onFilterChange?.({
      sizes: selectedSizes,
      papers: selectedPapers,
      coatings: selectedCoatings,
    });
  };

  const handleReset = () => {
    setSelectedSizes([]);
    setSelectedPapers([]);
    setSelectedCoatings([]);
    onFilterChange?.({ sizes: [], papers: [], coatings: [] });
  };

  return (
    <aside className={cn('w-full lg:w-56 shrink-0', className)}>
      <div className="bg-white border border-[#CACACA] rounded-[5px] p-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-[#424242] tracking-[-0.05em]">인쇄 옵션 필터</h2>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#979797] underline hover:text-[#5538B6] tracking-[-0.05em]"
          >
            초기화
          </button>
        </div>

        <FilterSection
          title="사이즈"
          options={SIZE_OPTIONS}
          selected={selectedSizes}
          onToggle={toggle(setSelectedSizes, selectedSizes)}
        />
        <FilterSection
          title="용지"
          options={PAPER_OPTIONS}
          selected={selectedPapers}
          onToggle={toggle(setSelectedPapers, selectedPapers)}
        />
        <FilterSection
          title="코팅"
          options={COATING_OPTIONS}
          selected={selectedCoatings}
          onToggle={toggle(setSelectedCoatings, selectedCoatings)}
        />

        <button
          type="button"
          onClick={handleApply}
          className="w-full h-[50px] bg-[#5538B6] text-white text-sm font-semibold rounded-[5px] tracking-[-0.05em] hover:bg-[#3B2573] transition-colors"
        >
          필터 적용
        </button>
      </div>
    </aside>
  );
};

export default PrintFilterSidebar;
