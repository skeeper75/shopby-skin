import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 커스텀 드롭다운 선택 컴포넌트
 * RULE-1: native <select> 사용 금지, custom div로 구현
 * Figma 기준: RECT 461x45, "▼" 인디케이터
 *
 * @MX:NOTE: [AUTO] 커스텀 드롭다운 선택 (RULE-1: NO native select)
 * @MX:SPEC: SPEC-DS-004
 */

const dropdownTriggerVariants = cva(
  'flex items-center rounded cursor-pointer transition-all select-none',
  {
    variants: {
      state: {
        default:
          'bg-white border border-[var(--po-border-default)] hover:border-[var(--po-primary-secondary)]',
        open:
          'bg-white border-2 border-[var(--po-primary)]',
        disabled:
          'bg-[var(--po-bg-section)] border border-[var(--po-border-default)] cursor-not-allowed',
      },
      size: {
        default: 'w-[461px] h-[45px] px-3',
        full: 'w-full h-[45px] px-3',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'default',
    },
  }
);

const DropdownSelect = React.forwardRef(
  (
    {
      className,
      size,
      options = [],
      value,
      onChange,
      placeholder = '선택해 주세요',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // 선택된 옵션의 라벨 가져오기
    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    // 현재 상태 결정
    const currentState = disabled ? 'disabled' : isOpen ? 'open' : 'default';

    // 드롭다운 토글
    const handleToggle = useCallback(() => {
      if (!disabled) {
        setIsOpen((prev) => !prev);
      }
    }, [disabled]);

    // 옵션 선택
    const handleSelect = useCallback(
      (optionValue) => {
        onChange?.(optionValue);
        setIsOpen(false);
      },
      [onChange]
    );

    // 외부 클릭 감지로 닫기
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // 키보드 접근성
    const handleKeyDown = useCallback(
      (event) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleToggle();
        }
      },
      [handleToggle]
    );

    return (
      <div ref={containerRef} className={cn('relative', className)} {...props}>
        {/* RULE-1: custom div 트리거, NO native select */}
        <div
          ref={ref}
          role="listbox"
          tabIndex={disabled ? -1 : 0}
          className={cn(dropdownTriggerVariants({ state: currentState, size }))}
          style={{ fontFamily: 'var(--po-font-family)' }}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-disabled={disabled}
        >
          <span
            className={cn(
              'flex-1 text-[13px] truncate',
              selectedLabel
                ? 'text-[var(--po-text-dark)]'
                : 'text-[var(--po-text-muted)]'
            )}
          >
            {selectedLabel || placeholder}
          </span>
          <span
            className={cn(
              'text-[10px] text-[var(--po-text-muted)] transition-transform ml-2',
              isOpen && 'rotate-180'
            )}
          >
            ▼
          </span>
        </div>

        {/* 옵션 목록 */}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 top-full left-0 mt-1 w-full',
              'bg-white border border-[var(--po-border-default)] rounded shadow-lg',
              'max-h-[200px] overflow-y-auto'
            )}
          >
            {options.map((option) => (
              <div
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={cn(
                  'px-3 py-2.5 text-[13px] cursor-pointer transition-colors',
                  option.value === value
                    ? 'bg-[var(--po-primary-light-3)] text-[var(--po-primary)] font-medium'
                    : 'text-[var(--po-text-dark)] hover:bg-[var(--po-bg-section)]',
                  option.disabled && 'text-[var(--po-text-muted)] cursor-not-allowed'
                )}
                style={{ fontFamily: 'var(--po-font-family)' }}
                onClick={() => !option.disabled && handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DropdownSelect.displayName = 'DropdownSelect';

export { DropdownSelect, dropdownTriggerVariants };
