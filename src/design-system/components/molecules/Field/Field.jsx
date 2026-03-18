/**
 * Field Compound Component
 *
 * 폼 필드의 레이블, 도움말, 에러 메시지, 문자 수 카운트를 구조화하는
 * compound component. FieldContext를 통해 하위 input과 자동 연동한다.
 *
 * @MX:NOTE: [AUTO] 10개 slot을 가진 compound component - Label, Header, Control, HelperText, ErrorText, CharacterCount, Footer, RequiredIndicator 포함
 * @MX:SPEC: SPEC-DS-006
 */
import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { FieldProvider, useFieldContext } from './FieldContext';

// ────────────────────────────────────────────
// Field.Root
// ────────────────────────────────────────────

/** 필드 최상위 래퍼. FieldProvider를 포함한다. */
const Root = forwardRef(function FieldRoot(
  { className, disabled, invalid, required, id, children, ...props },
  ref
) {
  return (
    <FieldProvider disabled={disabled} invalid={invalid} required={required} id={id}>
      <div ref={ref} className={cn('flex flex-col w-full', className)} {...props}>
        {children}
      </div>
    </FieldProvider>
  );
});
Root.displayName = 'Field.Root';

// ────────────────────────────────────────────
// Field.Label
// ────────────────────────────────────────────

/** 필드 레이블. htmlFor로 input과 연결된다. */
const Label = forwardRef(function FieldLabel({ className, children, ...props }, ref) {
  const ctx = useFieldContext();

  return (
    <label
      ref={ref}
      id={ctx?.labelId}
      htmlFor={ctx?.fieldId}
      className={cn(
        'text-[14px] font-medium leading-[var(--huni-leading-t4,20px)] text-[var(--huni-fg-neutral)]',
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
});
Label.displayName = 'Field.Label';

// ────────────────────────────────────────────
// Field.RequiredIndicator
// ────────────────────────────────────────────

/** 필수 입력 표시(*). required=true일 때만 렌더링된다. */
const RequiredIndicator = forwardRef(function FieldRequiredIndicator(
  { className, children, ...props },
  ref
) {
  const ctx = useFieldContext();

  if (!ctx?.required) return null;

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('ml-[2px] text-[var(--huni-fg-critical)]', className)}
      {...props}
    >
      {children ?? '*'}
    </span>
  );
});
RequiredIndicator.displayName = 'Field.RequiredIndicator';

// ────────────────────────────────────────────
// Field.Header
// ────────────────────────────────────────────

/** Label + RequiredIndicator를 묶는 헤더 영역. */
const Header = forwardRef(function FieldHeader({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex items-center mb-[var(--huni-space-1_5,6px)]', className)}
      {...props}
    >
      {children}
    </div>
  );
});
Header.displayName = 'Field.Header';

// ────────────────────────────────────────────
// Field.Control
// ────────────────────────────────────────────

/** input 요소를 감싸는 래퍼. */
const Control = forwardRef(function FieldControl({ className, children, ...props }, ref) {
  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
});
Control.displayName = 'Field.Control';

// ────────────────────────────────────────────
// Field.HelperText
// ────────────────────────────────────────────

/** 입력 도움말 텍스트. 에러 상태가 아닐 때 표시된다. */
const HelperText = forwardRef(function FieldHelperText(
  { className, children, ...props },
  ref
) {
  const ctx = useFieldContext();

  return (
    <p
      ref={ref}
      id={ctx?.helperId}
      className={cn(
        'text-[12px] leading-[var(--huni-leading-t2,16px)] text-[var(--huni-fg-neutral-subtle)] mt-[var(--huni-space-1,4px)]',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});
HelperText.displayName = 'Field.HelperText';

// ────────────────────────────────────────────
// Field.ErrorText
// ────────────────────────────────────────────

/** 에러 메시지 텍스트. invalid 상태일 때 HelperText 대신 표시한다. */
const ErrorText = forwardRef(function FieldErrorText(
  { className, children, ...props },
  ref
) {
  const ctx = useFieldContext();

  return (
    <p
      ref={ref}
      id={ctx?.errorId}
      role="alert"
      className={cn(
        'text-[12px] leading-[var(--huni-leading-t2,16px)] text-[var(--huni-fg-critical)] mt-[var(--huni-space-1,4px)]',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});
ErrorText.displayName = 'Field.ErrorText';

// ────────────────────────────────────────────
// Field.CharacterCount
// ────────────────────────────────────────────

/**
 * 문자 수 카운트 표시.
 * @param {number} current - 현재 문자 수
 * @param {number} max - 최대 문자 수
 */
const CharacterCount = forwardRef(function FieldCharacterCount(
  { className, current = 0, max, ...props },
  ref
) {
  const exceeded = max !== undefined && current > max;
  const empty = current === 0;

  return (
    <span
      ref={ref}
      data-empty={empty ? '' : undefined}
      data-exceeded={exceeded ? '' : undefined}
      className={cn(
        'text-[12px] text-[var(--huni-fg-neutral-subtle)]',
        exceeded && 'text-[var(--huni-fg-critical)]',
        className
      )}
      {...props}
    >
      {current}{max !== undefined && `/${max}`}
    </span>
  );
});
CharacterCount.displayName = 'Field.CharacterCount';

// ────────────────────────────────────────────
// Field.Footer
// ────────────────────────────────────────────

/** HelperText/ErrorText + CharacterCount를 묶는 푸터 영역. */
const Footer = forwardRef(function FieldFooter({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex justify-between items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
});
Footer.displayName = 'Field.Footer';

// ────────────────────────────────────────────
// 통합 Export
// ────────────────────────────────────────────

export const Field = {
  Root,
  Label,
  RequiredIndicator,
  Header,
  Control,
  HelperText,
  ErrorText,
  CharacterCount,
  Footer,
};
