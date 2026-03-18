// @MX:ANCHOR: Field Compound Component - 폼 필드 래퍼
// @MX:REASON: fan_in >= 3 (모든 폼 필드에서 사용)
// SPEC-DS-006

import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * Field Context Provider
 */
const FieldContext = React.createContext({});

/**
 * Field Root - 컨테이너
 */
const Field = React.forwardRef(({ id, error, disabled, required, className, children, ...props }, ref) => (
  <FieldContext.Provider value={{ id, error, disabled, required }}>
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  </FieldContext.Provider>
));
Field.displayName = 'Field';

/**
 * Field Label - 라벨
 */
const FieldLabel = React.forwardRef(({ className, children, ...props }, ref) => {
  const { required, disabled } = React.useContext(FieldContext);

  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[--huni-fg-error] ml-1">*</span>}
    </label>
  );
});
FieldLabel.displayName = 'FieldLabel';

/**
 * Field Description - 설명 텍스트
 */
const FieldDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[--huni-fg-muted]', className)}
    {...props}
  />
));
FieldDescription.displayName = 'FieldDescription';

/**
 * Field Error - 에러 메시지
 */
const FieldError = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error } = React.useContext(FieldContext);

  if (!error) return null;

  return (
    <p
      ref={ref}
      className={cn('text-sm text-[--huni-fg-error]', className)}
      {...props}
    >
      {children || error}
    </p>
  );
});
FieldError.displayName = 'FieldError';

export { Field, FieldLabel, FieldDescription, FieldError };
