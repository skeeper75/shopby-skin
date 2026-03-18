/**
 * Chip — 칩 Compound Component
 *
 * 필터, 태그, 선택 상태 등을 표현하는 소형 인터랙티브 요소.
 * Chip.Root, Chip.Label, Chip.Icon, Chip.DeleteButton, Chip.Count로 구성.
 *
 * @MX:NOTE: [AUTO] Radix 미사용, 커스텀 구현 compound component 패턴
 * @MX:SPEC: SPEC-DS-006
 */
import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getStateDataAttributes } from '../../../utils/pseudo';
import { useFocusVisible, focusRingClass } from '../../../utils/focusRing';
import { SlotProvider, useSlotClass } from './Chip.recipe';

/**
 * variant + selected 조합에 따른 스타일 매핑
 */
const VARIANT_STYLES = {
  solid: {
    selected:
      'bg-[var(--huni-bg-brand-weak)] text-[var(--huni-fg-brand)]',
    unselected:
      'bg-[var(--huni-bg-neutral-weak)] text-[var(--huni-fg-neutral)]',
  },
  outlineStrong: {
    selected:
      'border border-[var(--huni-stroke-neutral-contrast)] text-[var(--huni-fg-neutral)]',
    unselected:
      'border border-[var(--huni-stroke-neutral-contrast)] text-[var(--huni-fg-neutral)]',
  },
  outlineWeak: {
    selected:
      'border border-[var(--huni-stroke-neutral-muted)] text-[var(--huni-fg-neutral)]',
    unselected:
      'border border-[var(--huni-stroke-neutral-muted)] text-[var(--huni-fg-neutral)]',
  },
};

const DISABLED_STYLE = 'bg-[var(--huni-bg-disabled)] text-[var(--huni-fg-disabled)] border-transparent cursor-not-allowed';

// === Root ===
const ChipRoot = forwardRef(function ChipRoot(
  {
    size = 'md',
    variant = 'solid',
    selected = false,
    disabled = false,
    onClick,
    className,
    children,
    ...props
  },
  ref
) {
  const { isFocusVisible, focusProps } = useFocusVisible();
  const stateAttrs = getStateDataAttributes({ selected, disabled });
  const variantStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES.solid;

  return (
    <SlotProvider size={size}>
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          // recipe root 스타일 (크기/레이아웃)
          'inline-flex items-center justify-center rounded-[var(--huni-radius-full)] transition-colors duration-[var(--huni-duration-fast)] ease-[var(--huni-easing-default)] cursor-pointer select-none',
          // 사이즈별 패딩/높이
          size === 'xs' && 'h-6 px-2 gap-1 text-[12px] leading-[16px]',
          size === 'sm' && 'h-7 px-2.5 gap-1 text-[13px] leading-[18px]',
          size === 'md' && 'h-8 px-3 gap-1.5 text-[14px] leading-[19px]',
          // variant + selected 스타일
          disabled
            ? DISABLED_STYLE
            : selected
              ? variantStyle.selected
              : variantStyle.unselected,
          // 포커스 링
          isFocusVisible && focusRingClass,
          className
        )}
        {...stateAttrs}
        {...focusProps}
        {...props}
      >
        {children}
      </button>
    </SlotProvider>
  );
});
ChipRoot.displayName = 'Chip.Root';

// === Label ===
const ChipLabel = forwardRef(function ChipLabel(
  { className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn('truncate', className)}
      {...props}
    >
      {children}
    </span>
  );
});
ChipLabel.displayName = 'Chip.Label';

// === Icon ===
const ChipIcon = forwardRef(function ChipIcon(
  { className, children, ...props },
  ref
) {
  const slotClass = useSlotClass('icon');

  return (
    <span
      ref={ref}
      className={cn(slotClass, className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  );
});
ChipIcon.displayName = 'Chip.Icon';

// === DeleteButton ===
const ChipDeleteButton = forwardRef(function ChipDeleteButton(
  { onDelete, className, ...props },
  ref
) {
  const slotClass = useSlotClass('deleteButton');

  const handleClick = (e) => {
    // 부모 button의 onClick 전파 방지
    e.stopPropagation();
    onDelete?.(e);
  };

  return (
    <span
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      className={cn(slotClass, className)}
      aria-label="삭제"
      {...props}
    >
      <X size={12} aria-hidden="true" />
    </span>
  );
});
ChipDeleteButton.displayName = 'Chip.DeleteButton';

// === Count ===
const ChipCount = forwardRef(function ChipCount(
  { className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn('ml-0.5 opacity-70', className)}
      {...props}
    >
      {children}
    </span>
  );
});
ChipCount.displayName = 'Chip.Count';

// === Compound Export ===
const Chip = ChipRoot;
Chip.Root = ChipRoot;
Chip.Label = ChipLabel;
Chip.Icon = ChipIcon;
Chip.DeleteButton = ChipDeleteButton;
Chip.Count = ChipCount;

export { Chip };
export default Chip;
