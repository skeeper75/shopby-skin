import { bool, node, string } from 'prop-types';

import { cn } from '../../design-system/utils';

/**
 * 반응형 폼 레이아웃 컴포넌트
 *
 * 모바일: 라벨과 입력 필드 수직 스택
 * 데스크톱: 라벨과 입력 필드 수평 배치
 *
 * @MX:NOTE: [AUTO] SPEC-LAYOUT-001 반응형 폼 레이아웃 프리미티브
 * @MX:TODO: [AUTO] FormLayout, FormRow 컴포넌트 단위 테스트 미작성
 * @MX:SPEC: SPEC-LAYOUT-001
 */

const FormLayout = ({ children, className }) => (
  <div className={cn('space-y-4 lg:space-y-6', className)}>
    {children}
  </div>
);

FormLayout.propTypes = {
  children: node,
  className: string,
};

/**
 * 폼 행 컴포넌트
 *
 * 모바일: 수직 스택 / 데스크톱: 수평 배치 (라벨 + 입력)
 */
const FormRow = ({ label, children, required = false, className }) => (
  <div className={cn('lg:grid lg:grid-cols-12 lg:items-start lg:gap-4', className)}>
    <label className={cn('block text-sm font-medium text-gray-700 mb-1 lg:mb-0 lg:col-span-3 lg:pt-2')}>
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <div className="lg:col-span-9">
      {children}
    </div>
  </div>
);

FormRow.propTypes = {
  /** 필드 라벨 */
  label: node.isRequired,
  /** 입력 필드 */
  children: node,
  /** 필수 표시 여부 */
  required: bool,
  /** 추가 CSS 클래스 */
  className: string,
};

FormLayout.Row = FormRow;

export default FormLayout;
