/**
 * Chip Slot Recipe 정의
 *
 * CVA 기반 Chip variant별 slot className 생성.
 *
 * @MX:NOTE: [AUTO] Chip compound component의 스타일 레시피
 * @MX:SPEC: SPEC-DS-006
 */
import { cva } from 'class-variance-authority';
import { createSlotRecipeContext } from '../../../utils/createSlotRecipeContext';

const chipRecipe = (variants) => ({
  root: cva(
    'inline-flex items-center justify-center rounded-[var(--huni-radius-full)] transition-colors duration-[var(--huni-duration-fast)] ease-[var(--huni-easing-default)] cursor-pointer select-none',
    {
      variants: {
        size: {
          xs: 'h-6 px-2 gap-1 text-[12px] leading-[16px]',
          sm: 'h-7 px-2.5 gap-1 text-[13px] leading-[18px]',
          md: 'h-8 px-3 gap-1.5 text-[14px] leading-[19px]',
        },
      },
      defaultVariants: { size: 'md' },
    }
  )(variants),
  label: 'truncate',
  icon: cva('shrink-0', {
    variants: {
      size: {
        xs: 'w-3 h-3',
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
      },
    },
    defaultVariants: { size: 'md' },
  })(variants),
  deleteButton: cva(
    'inline-flex items-center justify-center rounded-full shrink-0 hover:bg-black/10 transition-colors',
    {
      variants: {
        size: {
          xs: 'w-3.5 h-3.5',
          sm: 'w-4 h-4',
          md: 'w-4.5 h-4.5',
        },
      },
      defaultVariants: { size: 'md' },
    }
  )(variants),
  count: 'ml-0.5 opacity-70',
});

export const { SlotProvider, useSlotContext, useSlotClass } = createSlotRecipeContext({
  slots: ['root', 'label', 'icon', 'deleteButton', 'count'],
  recipe: chipRecipe,
});
