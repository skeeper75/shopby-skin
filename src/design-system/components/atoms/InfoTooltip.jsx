import React, { useState, useRef, useCallback } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 정보 안내 툴팁 컴포넌트
 * "!" 아이콘 클릭 시 말풍선 팝오버 표시
 *
 * @MX:NOTE: [AUTO] 옵션 안내 등 추가 정보 표시용 툴팁 팝오버
 * @MX:SPEC: SPEC-DS-004
 */

// 트리거 아이콘 스타일
const triggerVariants = cva(
  'inline-flex items-center justify-center rounded-full cursor-pointer select-none',
  {
    variants: {
      size: {
        default: 'w-4 h-4 text-[10px]',
        sm: 'w-3 h-3 text-[8px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const InfoTooltip = React.forwardRef(
  ({ className, size, content = '', children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);

    // 팝오버 토글 핸들러
    const handleToggle = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    // 외부 클릭 시 닫기 처리
    const handleBlur = useCallback(() => {
      // 약간의 딜레이로 자식 요소 클릭 허용
      setTimeout(() => setIsOpen(false), 200);
    }, []);

    return (
      <span ref={ref} className={cn('relative inline-flex', className)} {...props}>
        {/* 트리거 아이콘 */}
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            triggerVariants({ size }),
            'bg-[var(--po-bg-light)] text-[var(--po-text-medium)] font-bold',
            'hover:bg-[var(--po-primary-light-2)] transition-colors'
          )}
          style={{ fontFamily: 'var(--po-font-family)' }}
          onClick={handleToggle}
          onBlur={handleBlur}
          aria-label="정보 보기"
          aria-expanded={isOpen}
        >
          !
        </button>

        {/* 팝오버 말풍선 */}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2',
              'px-3 py-2 rounded',
              'bg-[var(--po-text-dark)] text-white text-[11px] leading-relaxed',
              'whitespace-nowrap shadow-md'
            )}
            style={{ fontFamily: 'var(--po-font-family)' }}
            role="tooltip"
          >
            {content || children}
            {/* 말풍선 꼬리 */}
            <span
              className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--po-text-dark)]"
            />
          </div>
        )}
      </span>
    );
  }
);

InfoTooltip.displayName = 'InfoTooltip';

export { InfoTooltip, triggerVariants };
