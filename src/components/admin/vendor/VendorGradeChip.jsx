// @MX:ANCHOR: [AUTO] VendorGradeChip - 거래처 등급 Chip 컴포넌트
// @MX:REASON: [AUTO] fan_in >= 3 (VendorPage, VendorDetailPage, VendorForm 등 다수 사용)
// @MX:SPEC: SPEC-SKIN-008

import { cn } from '../../../lib/utils';

/** 등급별 스타일 매핑 */
const GRADE_STYLES = {
  S: 'bg-purple-100 text-purple-700 border-purple-300',
  A: 'bg-blue-100 text-blue-700 border-blue-300',
  B: 'bg-green-100 text-green-700 border-green-300',
  C: 'bg-gray-100 text-gray-500 border-gray-300',
};

/**
 * 거래처 등급 Chip 컴포넌트
 * @param {Object} props
 * @param {'S'|'A'|'B'|'C'} props.grade - 거래처 등급
 * @param {'sm'|'md'} props.size - 크기
 * @param {string} props.className
 */
const VendorGradeChip = ({ grade, size = 'md', className }) => {
  const style = GRADE_STYLES[grade] ?? GRADE_STYLES.C;
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-semibold',
        style,
        sizeClass,
        className
      )}
    >
      {grade}
    </span>
  );
};

export default VendorGradeChip;
