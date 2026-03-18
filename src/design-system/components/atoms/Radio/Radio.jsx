/**
 * RadioGroup — 라디오 버튼 그룹 Compound Component
 *
 * @radix-ui/react-radio-group 기반 접근성 준수 라디오 그룹.
 * RadioGroup.Root, RadioGroup.Item, RadioGroup.ItemControl,
 * RadioGroup.ItemIndicator, RadioGroup.ItemLabel로 구성.
 *
 * @MX:NOTE: [AUTO] Radix RadioGroup 기반 compound component 패턴
 * @MX:SPEC: SPEC-DS-006
 */
import { forwardRef } from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../../../utils/cn';
import { useFocusVisible, focusRingClass } from '../../../utils/focusRing';
import { SlotProvider, useSlotClass } from './Radio.recipe';

// === Root ===
const RadioGroupRoot = forwardRef(function RadioGroupRoot(
  { size = 'md', className, children, ...props },
  ref
) {
  return (
    <SlotProvider size={size}>
      <RadixRadioGroup.Root
        ref={ref}
        className={cn(
          'flex flex-col gap-[var(--huni-space-1)]',
          className
        )}
        {...props}
      >
        {children}
      </RadixRadioGroup.Root>
    </SlotProvider>
  );
});
RadioGroupRoot.displayName = 'RadioGroup.Root';

// === Item ===
const RadioGroupItem = forwardRef(function RadioGroupItem(
  { className, children, value, disabled, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={cn(
        'inline-flex items-center gap-[var(--huni-space-2)] cursor-pointer select-none',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
      {...props}
    >
      {children}
      {/* Radix hidden input은 RadioGroup.Item 내부에서 자동 생성 */}
    </label>
  );
});
RadioGroupItem.displayName = 'RadioGroup.Item';

// === ItemControl ===
const RadioGroupItemControl = forwardRef(function RadioGroupItemControl(
  { value, disabled, className, children, ...props },
  ref
) {
  const slotClass = useSlotClass('itemControl');
  const { isFocusVisible, focusProps } = useFocusVisible();

  return (
    <RadixRadioGroup.Item
      ref={ref}
      value={value}
      disabled={disabled}
      className={cn(
        slotClass,
        // 미선택: 테두리만
        'border-[var(--huni-stroke-neutral-weak)] bg-transparent',
        // 선택: Radix data-state=checked로 제어
        'data-[state=checked]:bg-[var(--huni-bg-neutral-inverted)] data-[state=checked]:border-[var(--huni-bg-neutral-inverted)]',
        // 비활성
        'data-[disabled]:bg-[var(--huni-bg-disabled)] data-[disabled]:border-[var(--huni-stroke-disabled)]',
        // 포커스 링
        isFocusVisible && focusRingClass,
        className
      )}
      {...focusProps}
      {...props}
    >
      {children}
    </RadixRadioGroup.Item>
  );
});
RadioGroupItemControl.displayName = 'RadioGroup.ItemControl';

// === ItemIndicator ===
const RadioGroupItemIndicator = forwardRef(function RadioGroupItemIndicator(
  { className, ...props },
  ref
) {
  const slotClass = useSlotClass('itemIndicator');

  return (
    <RadixRadioGroup.Indicator
      ref={ref}
      className={cn(slotClass, className)}
      {...props}
    />
  );
});
RadioGroupItemIndicator.displayName = 'RadioGroup.ItemIndicator';

// === ItemLabel ===
const RadioGroupItemLabel = forwardRef(function RadioGroupItemLabel(
  { className, children, ...props },
  ref
) {
  const slotClass = useSlotClass('itemLabel');

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
RadioGroupItemLabel.displayName = 'RadioGroup.ItemLabel';

// === Compound Export ===
const RadioGroup = RadioGroupRoot;
RadioGroup.Root = RadioGroupRoot;
RadioGroup.Item = RadioGroupItem;
RadioGroup.ItemControl = RadioGroupItemControl;
RadioGroup.ItemIndicator = RadioGroupItemIndicator;
RadioGroup.ItemLabel = RadioGroupItemLabel;

export { RadioGroup };
export default RadioGroup;
