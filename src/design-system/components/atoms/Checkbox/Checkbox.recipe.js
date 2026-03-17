/**
 * Checkbox Slot Recipe 정의
 *
 * CVA 기반 variant별 slot className 생성.
 *
 * @MX:NOTE: [AUTO] Checkbox compound component의 스타일 레시피
 * @MX:SPEC: SPEC-DS-006
 */
import { cva } from 'class-variance-authority';
import { createSlotRecipeContext } from '../../../utils/createSlotRecipeContext';

const checkboxRecipe = (variants) => ({
  root: 'inline-flex items-center gap-[var(--huni-space-2)] cursor-pointer select-none',
  control: cva(
    'flex items-center justify-center rounded-[var(--huni-radius-0_5)] border transition-colors duration-[var(--huni-duration-fast)] ease-[var(--huni-easing-default)]',
    {
      variants: {
        size: {
          md: 'w-5 h-5',
          lg: 'w-6 h-6',
        },
      },
      defaultVariants: { size: 'md' },
    }
  )(variants),
  indicator: 'text-[var(--huni-fg-neutral-inverted)]',
  label: cva('select-none text-[var(--huni-fg-neutral)]', {
    variants: {
      size: {
        md: 'text-[14px] leading-[19px]',
        lg: 'text-[16px] leading-[22px]',
      },
    },
    defaultVariants: { size: 'md' },
  })(variants),
  hiddenInput: 'sr-only',
});

export const { SlotProvider, useSlotContext, useSlotClass } = createSlotRecipeContext({
  slots: ['root', 'control', 'indicator', 'label', 'hiddenInput'],
  recipe: checkboxRecipe,
});
