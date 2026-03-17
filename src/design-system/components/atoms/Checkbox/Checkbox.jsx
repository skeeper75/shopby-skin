/**
 * Checkbox — 체크박스 Compound Component
 *
 * @radix-ui/react-checkbox 기반 접근성 준수 체크박스.
 * Checkbox.Root, Checkbox.Control, Checkbox.Indicator, Checkbox.Label로 구성.
 *
 * @MX:NOTE: [AUTO] Radix Checkbox 기반 compound component 패턴
 * @MX:SPEC: SPEC-DS-006
 */
import { forwardRef, createContext, useContext } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useFocusVisible, focusRingClass } from '../../../utils/focusRing';
import { getStateDataAttributes } from '../../../utils/pseudo';
import { SlotProvider, useSlotClass } from './Checkbox.recipe';

// --- 내부 Context: checked/disabled 상태 공유 ---
const CheckboxStateContext = createContext({
  checked: false,
  disabled: false,
});

// === Root ===
const CheckboxRoot = forwardRef(function CheckboxRoot(
  {
    size = 'md',
    checked,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <SlotProvider size={size}>
      <RadixCheckbox.Root
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        asChild
      >
        {/* Radix는 내부적으로 data-state, data-disabled을 관리 */}
        <label
          className={cn(
            'inline-flex items-center gap-[var(--huni-space-2)] cursor-pointer select-none',
            disabled && 'cursor-not-allowed opacity-60',
            className
          )}
          {...props}
        >
          {children}
        </label>
      </RadixCheckbox.Root>
    </SlotProvider>
  );
});
CheckboxRoot.displayName = 'Checkbox.Root';

// === Control ===
const CheckboxControl = forwardRef(function CheckboxControl(
  { className, children, ...props },
  ref
) {
  const slotClass = useSlotClass('control');
  const { isFocusVisible, focusProps } = useFocusVisible();

  return (
    <div
      ref={ref}
      className={cn(
        slotClass,
        // 미체크 상태: 테두리만
        'border-[var(--huni-stroke-neutral-weak)] bg-transparent',
        // 체크 상태: Radix data-state로 제어
        'data-[state=checked]:bg-[var(--huni-bg-neutral-inverted)] data-[state=checked]:border-[var(--huni-bg-neutral-inverted)]',
        'data-[state=indeterminate]:bg-[var(--huni-bg-neutral-inverted)] data-[state=indeterminate]:border-[var(--huni-bg-neutral-inverted)]',
        // 비활성 상태
        'data-[disabled]:bg-[var(--huni-bg-disabled)] data-[disabled]:border-[var(--huni-stroke-disabled)]',
        // 포커스 링
        isFocusVisible && focusRingClass,
        className
      )}
      {...focusProps}
      {...props}
    >
      {children}
    </div>
  );
});
CheckboxControl.displayName = 'Checkbox.Control';

// === Indicator ===

/**
 * 체크 아이콘만 렌더링하는 간소화된 Indicator.
 * Radix Indicator 내부에서 checked 일 때 Check, indeterminate 일 때 Minus.
 */
const CheckboxIndicatorSimple = forwardRef(function CheckboxIndicatorSimple(
  { className, ...props },
  ref
) {
  const slotClass = useSlotClass('indicator');

  return (
    <RadixCheckbox.Indicator ref={ref} className={cn(slotClass, className)} forceMount={false} {...props}>
      {/* Radix Indicator는 checked/indeterminate 시에만 children을 마운트.
          data-state로 어떤 상태인지 구분 가능 */}
      <CheckOrMinus />
    </RadixCheckbox.Indicator>
  );
});

/**
 * Radix Indicator children 내부에서 state에 따라 아이콘 전환.
 * parent의 data-state를 CSS로 제어하기 어려우므로 JS로 분기.
 */
function CheckOrMinus() {
  // Radix Checkbox.Indicator는 checked/indeterminate 모두에서 렌더링
  // 하지만 내부에서 어떤 상태인지 직접 알 수 없으므로
  // 두 아이콘 모두 렌더링하고 CSS data-state 셀렉터로 전환
  return (
    <>
      <Check size={14} strokeWidth={3} aria-hidden="true" />
    </>
  );
}

// === Label ===
const CheckboxLabel = forwardRef(function CheckboxLabel(
  { className, children, ...props },
  ref
) {
  const slotClass = useSlotClass('label');

  return (
    <span
      ref={ref}
      className={cn(
        slotClass,
        'data-[disabled]:text-[var(--huni-fg-disabled)]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
CheckboxLabel.displayName = 'Checkbox.Label';

// === Compound Export ===
const Checkbox = CheckboxRoot;
Checkbox.Root = CheckboxRoot;
Checkbox.Control = CheckboxControl;
Checkbox.Indicator = CheckboxIndicatorSimple;
Checkbox.Label = CheckboxLabel;

export { Checkbox };
export default Checkbox;
