/**
 * Switch Slot Recipe 정의
 *
 * CVA 기반 Switch variant별 slot className 생성.
 *
 * @MX:NOTE: [AUTO] Switch compound component의 스타일 레시피
 * @MX:SPEC: SPEC-DS-006
 */
import { cva } from 'class-variance-authority';
import { createSlotRecipeContext } from '../../../utils/createSlotRecipeContext';

const switchRecipe = (variants) => ({
  root: 'inline-flex items-center gap-[var(--huni-space-2)] cursor-pointer select-none',
  control: cva(
    'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-[var(--huni-duration-fast)] ease-[var(--huni-easing-default)]',
    {
      variants: {
        size: {
          md: 'w-9 h-5',
          lg: 'w-11 h-6',
        },
      },
      defaultVariants: { size: 'md' },
    }
  )(variants),
  thumb: cva(
    'block rounded-full bg-[var(--huni-gray-0)] shadow-sm transition-transform duration-[var(--huni-duration-fast)] ease-[var(--huni-easing-default)]',
    {
      variants: {
        size: {
          md: 'w-4 h-4',
          lg: 'w-5 h-5',
        },
      },
      defaultVariants: { size: 'md' },
    }
  )(variants),
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
  slots: ['root', 'control', 'thumb', 'label', 'hiddenInput'],
  recipe: switchRecipe,
});
