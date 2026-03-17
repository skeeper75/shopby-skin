/**
 * TextField CVA 레시피
 *
 * outline / underline variant, md / lg 사이즈를 정의한다.
 *
 * @MX:NOTE: [AUTO] TextField의 시각적 variant를 관리하는 CVA 레시피
 * @MX:SPEC: SPEC-DS-006
 */
import { cva } from 'class-variance-authority';

/** TextField Root 래퍼의 variant 레시피 */
export const textFieldRootRecipe = cva(
  'relative flex items-center w-full rounded-[var(--huni-radius-1)] border transition-colors duration-[var(--huni-duration-s2,150ms)] ease-[var(--huni-easing-standard,ease)]',
  {
    variants: {
      variant: {
        outline: 'border-[var(--huni-stroke-neutral-weak)]',
        underline:
          'border-0 border-b border-[var(--huni-stroke-neutral-weak)] rounded-none',
      },
      size: {
        md: 'h-10 text-[14px]',
        lg: 'h-[52px] text-[16px]',
      },
    },
    defaultVariants: { variant: 'outline', size: 'md' },
  }
);
