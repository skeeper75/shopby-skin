// @MX:NOTE: [AUTO] VendorTypeFilter - 거래처 유형 필터 컴포넌트
// @MX:SPEC: SPEC-SKIN-008

import { cn } from '../../../lib/utils';

/** 거래처 유형 목록 */
const VENDOR_TYPES = ['전체', '오프라인매장', '온라인업체', '제조사', '기타'];

/**
 * 거래처 유형 필터 버튼 그룹
 * @param {Object} props
 * @param {string} props.value - 선택된 유형 ('전체' 또는 유형명)
 * @param {function} props.onChange - 변경 핸들러
 */
const VendorTypeFilter = ({ value = '전체', onChange }) => {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {VENDOR_TYPES.map((type) => {
        const isActive = value === type || (type === '전체' && !value);
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type === '전체' ? '' : type)}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium border transition-colors',
              isActive
                ? 'bg-[--huni-bg-brand] text-white border-[--huni-bg-brand]'
                : 'bg-white text-[--huni-fg-default] border-[--huni-stroke-default] hover:border-[--huni-bg-brand] hover:text-[--huni-bg-brand]'
            )}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
};

export default VendorTypeFilter;
