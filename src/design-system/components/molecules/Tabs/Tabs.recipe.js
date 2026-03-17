/**
 * Tabs CVA 레시피
 *
 * line / chip variant, sm / md / lg 사이즈, fill / hug 레이아웃을 정의한다.
 *
 * @MX:NOTE: [AUTO] Tabs Trigger의 시각적 variant를 관리하는 CVA 레시피
 * @MX:SPEC: SPEC-DS-006
 */
import { cva } from 'class-variance-authority';

/** Tabs Trigger 버튼의 variant 레시피 */
export const tabsTriggerRecipe = cva(
  'relative flex items-center justify-center cursor-pointer font-bold transition-colors outline-none select-none',
  {
    variants: {
      variant: {
        line: 'bg-transparent pb-2',
        chip: 'rounded-[var(--huni-radius-full)]',
      },
      size: {
        sm: 'h-10 text-[14px] px-[var(--huni-space-3,12px)]',
        md: 'h-11 text-[16px] px-[var(--huni-space-4,16px)]',
        lg: 'h-10 text-[14px] px-[var(--huni-space-4,16px)]',
      },
      layout: {
        fill: 'flex-1',
        hug: '',
      },
    },
    defaultVariants: { variant: 'line', size: 'sm', layout: 'fill' },
  }
);
