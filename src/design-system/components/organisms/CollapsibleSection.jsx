import React, { useState, useCallback } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 접이식 옵션 섹션 컴포넌트
 * OptionLabel + 토글 아이콘 + 자식 콘텐츠
 * @radix-ui/react-collapsible 대신 네이티브 구현 (의존성 최소화)
 *
 * R6 상태 연동: '박없음' 선택 시 사이즈 입력 + 색상 선택 숨김
 *
 * @MX:WARN: [AUTO] 조건부 렌더링 복잡도 - R6 상태에 따른 자식 요소 표시/숨김 로직
 * @MX:REASON: R6 조건부 렌더링과 접기 상태가 결합되어 상태 관리 복잡도 증가
 * @MX:NOTE: [MIGRATION] SPEC-DS-006 Phase 5 - --po-* → --huni-* 시멘틱 토큰 마이그레이션 완료
 * @MX:SPEC: SPEC-DS-004
 */

const sectionVariants = cva(
  'w-full',
  {
    variants: {
      state: {
        default: '',
        hidden: 'hidden',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

const CollapsibleSection = React.forwardRef(
  (
    {
      className,
      state,
      title,
      defaultOpen = true,
      open: controlledOpen,
      onOpenChange,
      required = false,
      badge,
      tooltip,
      children,
      ...props
    },
    ref
  ) => {
    // 제어/비제어 모드 지원
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    // 토글 핸들러
    const handleToggle = useCallback(() => {
      const newState = !isOpen;
      setInternalOpen(newState);
      onOpenChange?.(newState);
    }, [isOpen, onOpenChange]);

    return (
      <div
        ref={ref}
        className={cn(sectionVariants({ state, className }))}
        {...props}
      >
        {/* 헤더 영역 */}
        <button
          type="button"
          className={cn(
            'w-full flex items-center gap-1.5 py-4',
            'cursor-pointer select-none'
          )}
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          {/* 섹션 제목 */}
          <span
            className="flex-1 text-left text-[14px] font-bold text-[var(--huni-fg-neutral)]"
            style={{ fontFamily: 'var(--po-font-family)' }}
          >
            {title}
          </span>

          {/* 필수 표시 */}
          {required && (
            <span className="text-red-500 text-sm font-bold">*</span>
          )}

          {/* 뱃지 (선택적) */}
          {badge}

          {/* 툴팁 (선택적) */}
          {tooltip}

          {/* 토글 아이콘 */}
          <span
            className={cn(
              'text-[12px] text-[var(--huni-fg-neutral-subtle)] transition-transform duration-200',
              isOpen ? 'rotate-0' : 'rotate-180'
            )}
          >
            ▲
          </span>
        </button>

        {/* 콘텐츠 영역 (접기/펼치기) */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-200',
            isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          )}
          role="region"
          aria-hidden={!isOpen}
        >
          <div className="pb-4 flex flex-col gap-2">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

CollapsibleSection.displayName = 'CollapsibleSection';

export { CollapsibleSection, sectionVariants };
