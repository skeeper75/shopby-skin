/**
 * 인쇄 옵션 디자인 시스템 - 통합 진입점
 *
 * @MX:ANCHOR: [AUTO] [index.js] 디자인 시스템 컴포넌트 통합 re-export
 * @MX:REASON: fan_in >= 13, 외부에서 디자인 시스템 접근 시 단일 진입점
 * @MX:SPEC: SPEC-DS-004
 */

// === Atoms ===
export { BadgeLabel, badgeLabelVariants } from './components/atoms/BadgeLabel';
export { InfoTooltip, triggerVariants } from './components/atoms/InfoTooltip';
export { ColorChip, colorChipVariants } from './components/atoms/ColorChip';

// === Atoms (SPEC-DS-006) ===
export { Divider } from './components/atoms/Divider';
export { Icon } from './components/atoms/Icon';
export { Skeleton } from './components/atoms/Skeleton';
export { Checkbox } from './components/atoms/Checkbox';
export { RadioGroup } from './components/atoms/Radio';
export { Switch } from './components/atoms/Switch';
export { Chip } from './components/atoms/Chip';

// === Molecules ===
export { OptionLabel } from './components/molecules/OptionLabel';
export { SizeOptionChip, sizeOptionChipVariants } from './components/molecules/SizeOptionChip';
export { RadioOption, radioOptionVariants } from './components/molecules/RadioOption';
export { DropdownSelect, dropdownTriggerVariants } from './components/molecules/DropdownSelect';
export { CounterOption, counterVariants } from './components/molecules/CounterOption';
export { SizeInput, sizeInputVariants } from './components/molecules/SizeInput';
export { QuantityInput, quantityInputVariants } from './components/molecules/QuantityInput';
export { CTAButton, ctaButtonVariants } from './components/molecules/CTAButton';

// === Molecules (SPEC-DS-006) ===
export { Field } from './components/molecules/Field';
export { TextField } from './components/molecules/TextField';
export { Tabs } from './components/molecules/Tabs';
export { default as Pagination } from './components/molecules/Pagination';

// === Organisms ===
export { CollapsibleSection, sectionVariants } from './components/organisms/CollapsibleSection';
export { PriceSummary, priceSummaryVariants, PriceRow } from './components/organisms/PriceSummary';

// === Organisms (SPEC-DS-006) ===
export { Dialog } from './components/organisms/Dialog';
export { Snackbar, SnackbarProvider, useSnackbar } from './components/organisms/Snackbar';

// === Utilities ===
export { createSlotRecipeContext } from './utils/createSlotRecipeContext';
export { getStateDataAttributes, dataSelectors } from './utils/pseudo';
export { useFocusVisible, focusRingClass, focusRingStyle } from './utils/focusRing';
export { cn } from './utils/cn';
