/**
 * Radio Slot Recipe 정의
 *
 * CVA 기반 RadioGroup variant별 slot className 생성.
 *
 * @MX:NOTE: [AUTO] RadioGroup compound component의 스타일 레시피
 * @MX:SPEC: SPEC-DS-006
 */
import { cva } from 'class-variance-authority';
import { createSlotRecipeContext } from '../../../utils/createSlotRecipeContext';

const radioRecipe = (variants) => ({
  root: 'flex flex-col gap-[var(--huni-space-1)]',
  item: 'inline-flex items-center gap-[var(--huni-space-2)] cursor-pointer select-none',
  itemControl: cva(
    'flex items-center justify-center rounded-full border transition-colors duration-[var(--huni-duration-fast)] ease-[var(--huni-easing-default)]',
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
  itemIndicator: cva('rounded-full bg-[var(--huni-fg-neutral-inverted)]', {
    variants: {
      size: {
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5',
      },
    },
    defaultVariants: { size: 'md' },
  })(variants),
  itemLabel: cva('select-none text-[var(--huni-fg-neutral)]', {
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
  slots: ['root', 'item', 'itemControl', 'itemIndicator', 'itemLabel', 'hiddenInput'],
  recipe: radioRecipe,
});
