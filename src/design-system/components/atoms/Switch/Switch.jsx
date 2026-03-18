/**
 * Switch — 토글 스위치 Compound Component
 *
 * @radix-ui/react-switch 기반 접근성 준수 스위치.
 * Switch.Root, Switch.Control, Switch.Thumb, Switch.Label로 구성.
 *
 * @MX:NOTE: [AUTO] Radix Switch 기반 compound component 패턴
 * @MX:SPEC: SPEC-DS-006
 */
import { forwardRef } from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../../utils/cn';
import { useFocusVisible, focusRingClass } from '../../../utils/focusRing';
import { SlotProvider, useSlotClass } from './Switch.recipe';

// === Root ===
const SwitchRoot = forwardRef(function SwitchRoot(
  { size = 'md', className, children, ...props },
  ref
) {
  return (
    <SlotProvider size={size}>
      <label
        ref={ref}
        className={cn(
          'inline-flex items-center gap-[var(--huni-space-2)] cursor-pointer select-none',
          props.disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        {children}
      </label>
    </SlotProvider>
  );
});
SwitchRoot.displayName = 'Switch.Root';

// === Control ===
const SwitchControl = forwardRef(function SwitchControl(
  { className, children, ...props },
  ref
) {
  const slotClass = useSlotClass('control');
  const { isFocusVisible, focusProps } = useFocusVisible();

  return (
    <RadixSwitch.Root
      ref={ref}
      className={cn(
        slotClass,
        // off 상태: 중립 배경
        'bg-[var(--huni-bg-neutral-weak)]',
        // on 상태: 브랜드 배경 (Radix data-state=checked)
        'data-[state=checked]:bg-[var(--huni-bg-brand-solid)]',
        // 비활성
        'data-[disabled]:bg-[var(--huni-bg-disabled)]',
        // 포커스 링
        isFocusVisible && focusRingClass,
        className
      )}
      {...focusProps}
      {...props}
    >
      {children}
    </RadixSwitch.Root>
  );
});
SwitchControl.displayName = 'Switch.Control';

// === Thumb ===
const SwitchThumb = forwardRef(function SwitchThumb(
  { className, ...props },
  ref
) {
  const slotClass = useSlotClass('thumb');

  return (
    <RadixSwitch.Thumb
      ref={ref}
      className={cn(
        slotClass,
        // 위치 전환: off → 왼쪽, on → 오른쪽
        'translate-x-0.5 data-[state=checked]:translate-x-[calc(100%+2px)]',
        className
      )}
      {...props}
    />
  );
});
SwitchThumb.displayName = 'Switch.Thumb';

// === Label ===
const SwitchLabel = forwardRef(function SwitchLabel(
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
SwitchLabel.displayName = 'Switch.Label';

// === Compound Export ===
const Switch = SwitchRoot;
Switch.Root = SwitchRoot;
Switch.Control = SwitchControl;
Switch.Thumb = SwitchThumb;
Switch.Label = SwitchLabel;

export { Switch };
export default Switch;
