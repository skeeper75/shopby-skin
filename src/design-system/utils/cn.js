/**
 * 클래스명 병합 유틸리티
 *
 * clsx로 조건부 클래스를 조합하고, tailwind-merge로 충돌 해결.
 *
 * @MX:ANCHOR: [AUTO] 모든 컴포넌트에서 className 병합에 사용되는 공통 헬퍼 (fan_in >= 26)
 * @MX:REASON: 디자인시스템 전 컴포넌트가 의존하는 핵심 유틸리티. 변경 시 전체 컴포넌트 영향.
 * @MX:SPEC: SPEC-DS-006
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 조건부 클래스명을 병합하고 Tailwind 충돌을 해결한다.
 *
 * @param {...(string|Object|Array)} inputs - clsx 호환 입력값
 * @returns {string} 병합된 클래스명
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
