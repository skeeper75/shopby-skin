import React from 'react';
import { cn } from '../../../lib/utils';

/**
 * 옵션 섹션 타이틀 컴포넌트
 * 옵션 그룹의 제목 표시 (RULE-5: props로 전달, 하드코딩 금지)
 *
 * @MX:NOTE: [AUTO] 옵션 섹션 제목 텍스트 (API/DB 데이터 표시용)
 * @MX:NOTE: [MIGRATION] SPEC-DS-006 Phase 5 - --po-* → --huni-* 시멘틱 토큰 마이그레이션 완료
 * @MX:SPEC: SPEC-DS-004
 */

const OptionLabel = React.forwardRef(
  ({ className, children, required = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-1.5',
          className
        )}
        {...props}
      >
        <span
          className="text-[var(--huni-text-t4)] font-bold text-[var(--huni-fg-neutral)]"
          style={{ fontFamily: 'var(--huni-font-family)', fontSize: 'var(--huni-text-t4)' }}
        >
          {children}
        </span>
        {/* 필수 표시 */}
        {required && (
          <span className="text-red-500 text-sm font-bold">*</span>
        )}
      </div>
    );
  }
);

OptionLabel.displayName = 'OptionLabel';

export { OptionLabel };
