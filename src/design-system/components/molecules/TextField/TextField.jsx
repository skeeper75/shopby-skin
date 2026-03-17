/**
 * TextField Compound Component
 *
 * Input과 Textarea를 통합하는 텍스트 입력 컴포넌트.
 * FieldContext와 연동하여 aria-* 속성을 자동 연결한다.
 *
 * @MX:NOTE: [AUTO] 7개 slot을 가진 compound component - Root, Input, Textarea, PrefixIcon, SuffixIcon, ClearButton 포함
 * @MX:SPEC: SPEC-DS-006
 */
import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useFieldContext } from '../Field/FieldContext';
import { textFieldRootRecipe } from './TextField.recipe';

// ────────────────────────────────────────────
// TextField.Root
// ────────────────────────────────────────────

/**
 * TextField 최상위 래퍼.
 * FieldContext가 존재하면 aria 속성을 자동으로 연결한다.
 */
const Root = forwardRef(function TextFieldRoot(
  {
    className,
    variant,
    size,
    disabled,
    readOnly,
    invalid,
    children,
    ...props
  },
  ref
) {
  const fieldCtx = useFieldContext();
  const [isFocused, setIsFocused] = useState(false);

  // FieldContext에서 상태 병합
  const isDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const isInvalid = invalid ?? fieldCtx?.invalid ?? false;
  const isReadOnly = readOnly ?? false;

  return (
    <div
      ref={ref}
      data-focus={isFocused ? '' : undefined}
      data-invalid={isInvalid ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
      data-readonly={isReadOnly ? '' : undefined}
      className={cn(
        textFieldRootRecipe({ variant, size }),
        // 포커스 상태
        isFocused && !isInvalid && 'border-[var(--huni-stroke-neutral-contrast)] border-2',
        // 에러 상태
        isInvalid && 'border-[var(--huni-stroke-critical)] border-2',
        // 비활성 상태
        isDisabled && 'bg-[var(--huni-bg-disabled)] cursor-not-allowed',
        className
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {/* children에 isDisabled, isReadOnly, fieldCtx 전달 */}
      {typeof children === 'function'
        ? children({ isDisabled, isReadOnly, isInvalid, fieldCtx })
        : children}
    </div>
  );
});
Root.displayName = 'TextField.Root';

// ────────────────────────────────────────────
// TextField.Input
// ────────────────────────────────────────────

/** 텍스트 입력 필드. forwardRef로 외부에서 ref 접근 가능. */
const Input = forwardRef(function TextFieldInput(
  { className, disabled, readOnly, ...props },
  ref
) {
  const fieldCtx = useFieldContext();

  // FieldContext에서 aria 속성 자동 연결
  const ariaProps = {};
  if (fieldCtx) {
    ariaProps['aria-labelledby'] = fieldCtx.labelId;
    ariaProps['aria-describedby'] = fieldCtx.invalid
      ? fieldCtx.errorId
      : fieldCtx.helperId;
    ariaProps['aria-invalid'] = fieldCtx.invalid || undefined;
    ariaProps['aria-required'] = fieldCtx.required || undefined;
    ariaProps.id = fieldCtx.fieldId;
  }

  return (
    <input
      ref={ref}
      disabled={disabled ?? fieldCtx?.disabled}
      readOnly={readOnly}
      className={cn(
        'w-full bg-transparent outline-none px-[var(--huni-space-3,12px)]',
        'text-[var(--huni-fg-neutral)] placeholder:text-[var(--huni-fg-neutral-subtle)]',
        'disabled:cursor-not-allowed',
        className
      )}
      {...ariaProps}
      {...props}
    />
  );
});
Input.displayName = 'TextField.Input';

// ────────────────────────────────────────────
// TextField.Textarea
// ────────────────────────────────────────────

/**
 * 멀티라인 텍스트 입력. autoresize를 지원한다.
 * @param {number} [minRows=3] - 최소 행 수
 * @param {number} [maxHeight] - 최대 높이 (px)
 */
const Textarea = forwardRef(function TextFieldTextarea(
  { className, minRows = 3, maxHeight, disabled, readOnly, onChange, ...props },
  ref
) {
  const internalRef = useRef(null);
  const textareaRef = ref || internalRef;
  const fieldCtx = useFieldContext();

  // 자동 높이 조절
  const adjustHeight = useCallback(() => {
    const el = typeof textareaRef === 'function' ? null : textareaRef?.current;
    if (!el) return;

    // 높이 리셋 후 scrollHeight로 재설정
    el.style.height = 'auto';
    let newHeight = el.scrollHeight;

    if (maxHeight && newHeight > maxHeight) {
      newHeight = maxHeight;
      el.style.overflowY = 'auto';
    } else {
      el.style.overflowY = 'hidden';
    }

    el.style.height = `${newHeight}px`;
  }, [textareaRef, maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  const handleChange = useCallback(
    (e) => {
      onChange?.(e);
      adjustHeight();
    },
    [onChange, adjustHeight]
  );

  // FieldContext에서 aria 속성 자동 연결
  const ariaProps = {};
  if (fieldCtx) {
    ariaProps['aria-labelledby'] = fieldCtx.labelId;
    ariaProps['aria-describedby'] = fieldCtx.invalid
      ? fieldCtx.errorId
      : fieldCtx.helperId;
    ariaProps['aria-invalid'] = fieldCtx.invalid || undefined;
    ariaProps['aria-required'] = fieldCtx.required || undefined;
    ariaProps.id = fieldCtx.fieldId;
  }

  return (
    <textarea
      ref={textareaRef}
      rows={minRows}
      disabled={disabled ?? fieldCtx?.disabled}
      readOnly={readOnly}
      onChange={handleChange}
      className={cn(
        'w-full bg-transparent outline-none px-[var(--huni-space-3,12px)] py-[var(--huni-space-2,8px)]',
        'text-[var(--huni-fg-neutral)] placeholder:text-[var(--huni-fg-neutral-subtle)]',
        'resize-none disabled:cursor-not-allowed',
        className
      )}
      {...ariaProps}
      {...props}
    />
  );
});
Textarea.displayName = 'TextField.Textarea';

// ────────────────────────────────────────────
// TextField.PrefixIcon / SuffixIcon
// ────────────────────────────────────────────

/** 입력 필드 좌측 아이콘 래퍼. */
const PrefixIcon = forwardRef(function TextFieldPrefixIcon(
  { className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        'flex items-center pl-[var(--huni-space-3,12px)] text-[var(--huni-fg-neutral-subtle)]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
PrefixIcon.displayName = 'TextField.PrefixIcon';

/** 입력 필드 우측 아이콘 래퍼. */
const SuffixIcon = forwardRef(function TextFieldSuffixIcon(
  { className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        'flex items-center pr-[var(--huni-space-3,12px)] text-[var(--huni-fg-neutral-subtle)]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
SuffixIcon.displayName = 'TextField.SuffixIcon';

// ────────────────────────────────────────────
// TextField.ClearButton
// ────────────────────────────────────────────

/**
 * 입력값 삭제 버튼.
 * value가 존재하고 clearable이 true일 때만 표시된다.
 */
const ClearButton = forwardRef(function TextFieldClearButton(
  { className, onClick, visible = true, ...props },
  ref
) {
  if (!visible) return null;

  return (
    <button
      ref={ref}
      type="button"
      tabIndex={-1}
      aria-label="입력값 지우기"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center pr-[var(--huni-space-3,12px)]',
        'text-[var(--huni-fg-neutral-subtle)] hover:text-[var(--huni-fg-neutral)]',
        'transition-colors cursor-pointer',
        className
      )}
      {...props}
    >
      <X size={16} />
    </button>
  );
});
ClearButton.displayName = 'TextField.ClearButton';

// ────────────────────────────────────────────
// 통합 Export
// ────────────────────────────────────────────

export const TextField = {
  Root,
  Input,
  Textarea,
  PrefixIcon,
  SuffixIcon,
  ClearButton,
};
