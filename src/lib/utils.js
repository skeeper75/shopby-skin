import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 충돌하는 클래스를 해결합니다.
 *
 * @param {...(string|object|array)} inputs - 클래스 이름 또는 조건부 객체
 * @returns {string} 병합된 클래스 문자열
 */
// @MX:ANCHOR: [AUTO] [cn] Tailwind 클래스 결합 유틸리티 - clsx + tailwind-merge, 전체 UI 컴포넌트에서 사용
// @MX:REASON: fan_in >= 3, 모든 shadcn/ui 기반 컴포넌트에서 필수 의존
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
