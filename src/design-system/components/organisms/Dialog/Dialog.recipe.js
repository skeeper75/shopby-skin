/**
 * Dialog 레시피 정의
 *
 * 각 슬롯(Backdrop, Content, Header, Body, Footer 등)에 대한 스타일 상수.
 * CSS 토큰 변수(--huni-*)를 활용한 테마 대응 스타일.
 *
 * @MX:NOTE: [AUTO] Dialog 컴파운드 컴포넌트의 슬롯별 스타일 정의
 * @MX:SPEC: SPEC-DS-006
 */

/**
 * Backdrop(오버레이) 기본 스타일
 */
export const backdropStyles = [
  'fixed inset-0 z-50',
  'bg-black/50',
  'data-[state=open]:animate-[backdrop-fade-in_var(--huni-duration-normal)_var(--huni-easing-default)]',
  'data-[state=closed]:animate-[backdrop-fade-out_var(--huni-duration-normal)_var(--huni-easing-default)]',
];

/**
 * Positioner(센터링 래퍼) 스타일
 */
export const positionerStyles = [
  'fixed inset-0 z-50',
  'flex items-center justify-center',
  'p-[var(--huni-space-4)]',
];

/**
 * Content(본문 패널) 스타일
 */
export const contentStyles = [
  'relative w-full',
  'bg-[var(--huni-bg-layer-floating)]',
  'rounded-[var(--huni-radius-4)]',
  'shadow-[var(--huni-shadow-xl)]',
  'p-[var(--huni-space-6)]',
  'max-w-[400px]',
  'outline-none',
  'data-[state=open]:animate-[dialog-fade-in_var(--huni-duration-normal)_var(--huni-easing-default)]',
  'data-[state=closed]:animate-[dialog-fade-out_var(--huni-duration-normal)_var(--huni-easing-default)]',
];

/**
 * Header 슬롯 스타일
 */
export const headerStyles = ['mb-[var(--huni-space-4)]'];

/**
 * Title 슬롯 스타일
 */
export const titleStyles = [
  'text-[var(--huni-fg-neutral)]',
  'text-[18px] font-bold leading-tight',
];

/**
 * Description 슬롯 스타일
 */
export const descriptionStyles = [
  'text-[var(--huni-fg-neutral-subtle)]',
  'text-[14px] whitespace-pre-wrap',
  'mt-[var(--huni-space-2)]',
];

/**
 * Body 슬롯 스타일
 */
export const bodyStyles = ['mb-[var(--huni-space-6)]'];

/**
 * Footer 슬롯 스타일
 */
export const footerStyles = [
  'flex justify-end',
  'gap-[var(--huni-space-3)]',
];

/**
 * CSS 키프레임 정의 문자열
 * Tailwind @keyframes로 주입하거나, 글로벌 CSS에서 선언할 수 있다.
 */
export const dialogKeyframes = `
@keyframes dialog-fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes dialog-fade-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}
@keyframes backdrop-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes backdrop-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
`;
