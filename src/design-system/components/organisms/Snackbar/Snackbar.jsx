/**
 * Snackbar 시각 컴포넌트
 *
 * SnackbarRegion: 화면 하단 중앙에 고정되는 스낵바 렌더링 영역
 * SnackbarToast: 개별 스낵바 아이템 (자동 dismiss + 액션 버튼 + 닫기 버튼)
 *
 * @MX:NOTE: [AUTO] Context 기반 프로그래매틱 Snackbar의 시각 렌더러
 * @MX:SPEC: SPEC-DS-006
 */
import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useSnackbarState } from './useSnackbar';

// ---------------------------------------------------------------------------
// 타입별 스타일 매핑
// ---------------------------------------------------------------------------

const TYPE_STYLES = {
  default: 'bg-[var(--huni-bg-neutral-inverted)] text-[var(--huni-fg-neutral-inverted)]',
  positive: 'bg-[var(--huni-bg-positive-solid)] text-white',
  warning: 'bg-[var(--huni-bg-warning-solid)] text-white',
  critical: 'bg-[var(--huni-bg-critical-solid)] text-white',
};

// ---------------------------------------------------------------------------
// SnackbarToast: 개별 스낵바 아이템
// ---------------------------------------------------------------------------

/**
 * 개별 Snackbar 토스트
 *
 * - 자동 dismiss 타이머 (duration)
 * - 퇴장 애니메이션 후 큐 제거
 * - 액션 버튼 / 닫기 버튼
 *
 * @MX:WARN: [AUTO] 타이머 + 애니메이션 상태 복합 관리
 * @MX:REASON: duration 타이머, dismissed 상태, 퇴장 애니메이션 타이머가 병렬로 동작하여 경합 가능
 */
const SnackbarToast = forwardRef(
  ({ snackbar, onDismiss, onRemove, ...props }, ref) => {
    const { id, title, description, type = 'default', duration, actionLabel, onAction, dismissed } =
      snackbar;

    const [exiting, setExiting] = useState(false);
    const timerRef = useRef(null);

    // 자동 dismiss 타이머
    useEffect(() => {
      if (duration && duration > 0) {
        timerRef.current = setTimeout(() => {
          onDismiss(id);
        }, duration);
      }
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [id, duration, onDismiss]);

    // dismissed → 퇴장 애니메이션 → 큐 제거
    useEffect(() => {
      if (dismissed) {
        setExiting(true);
        const exitTimer = setTimeout(() => {
          snackbar.onClose?.();
          onRemove(id);
        }, 200); // 퇴장 애니메이션 길이
        return () => clearTimeout(exitTimer);
      }
    }, [dismissed, id, onRemove, snackbar]);

    /** 닫기 버튼 클릭 */
    const handleClose = useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      onDismiss(id);
    }, [id, onDismiss]);

    /** 액션 버튼 클릭 */
    const handleAction = useCallback(() => {
      onAction?.();
      handleClose();
    }, [onAction, handleClose]);

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        data-type={type}
        data-state={exiting ? 'closed' : 'open'}
        className={cn(
          'min-w-[320px] max-w-[480px]',
          'p-[var(--huni-space-4)]',
          'rounded-[var(--huni-radius-2)]',
          'shadow-[var(--huni-shadow-lg)]',
          'flex items-start gap-[var(--huni-space-3)]',
          TYPE_STYLES[type] ?? TYPE_STYLES.default,
          // 진입/퇴장 애니메이션
          exiting
            ? 'animate-[snackbar-exit_200ms_var(--huni-easing-default)_forwards]'
            : 'animate-[snackbar-enter_200ms_var(--huni-easing-default)]',
        )}
        {...props}
      >
        {/* 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-[14px] font-semibold leading-tight">{title}</p>
          )}
          {description && (
            <p className="text-[13px] opacity-90 mt-0.5 leading-snug">
              {description}
            </p>
          )}
        </div>

        {/* 액션 버튼 */}
        {actionLabel && (
          <button
            type="button"
            className={cn(
              'shrink-0 text-[13px] font-semibold underline',
              'opacity-90 hover:opacity-100 transition-opacity',
              'cursor-pointer bg-transparent border-none p-0',
              'text-inherit',
            )}
            onClick={handleAction}
          >
            {actionLabel}
          </button>
        )}

        {/* 닫기 버튼 */}
        <button
          type="button"
          aria-label="닫기"
          className={cn(
            'shrink-0 p-0.5 rounded-sm',
            'opacity-70 hover:opacity-100 transition-opacity',
            'cursor-pointer bg-transparent border-none',
            'text-inherit',
          )}
          onClick={handleClose}
        >
          <X size={16} />
        </button>
      </div>
    );
  },
);
SnackbarToast.displayName = 'SnackbarToast';

// ---------------------------------------------------------------------------
// SnackbarRegion: 스낵바 스택 렌더링 영역
// ---------------------------------------------------------------------------

/**
 * Snackbar 스택 렌더링 영역
 *
 * 화면 하단 중앙에 고정되어 visible 스낵바들을 역순(최신=아래)으로 표시한다.
 */
const SnackbarRegion = forwardRef(({ className, ...props }, ref) => {
  const { snackbars, allSnackbars, dismiss, remove } = useSnackbarState();

  // dismissed 상태인 스낵바도 퇴장 애니메이션을 위해 렌더링
  const renderQueue = allSnackbars.filter(
    (s) => snackbars.some((v) => v.id === s.id) || s.dismissed,
  );

  if (renderQueue.length === 0) return null;

  return (
    <div
      ref={ref}
      aria-label="알림"
      className={cn(
        'fixed z-[9999]',
        'bottom-[var(--huni-space-6)] left-1/2 -translate-x-1/2',
        'flex flex-col-reverse gap-[var(--huni-space-2)]',
        'pointer-events-none',
        className,
      )}
      {...props}
    >
      {renderQueue.map((snackbar) => (
        <div key={snackbar.id} className="pointer-events-auto">
          <SnackbarToast
            snackbar={snackbar}
            onDismiss={dismiss}
            onRemove={remove}
          />
        </div>
      ))}
    </div>
  );
});
SnackbarRegion.displayName = 'Snackbar.Region';

// ---------------------------------------------------------------------------
// 컴파운드 내보내기
// ---------------------------------------------------------------------------

/**
 * Snackbar 컴파운드 컴포넌트
 *
 * @example
 *   // 앱 루트
 *   <Snackbar.Provider>
 *     <App />
 *     <Snackbar.Region />
 *   </Snackbar.Provider>
 *
 *   // 사용처
 *   const snackbar = useSnackbar();
 *   snackbar.create({ title: '저장 완료', type: 'positive' });
 */
const Snackbar = Object.assign(SnackbarRegion, {
  Region: SnackbarRegion,
  Toast: SnackbarToast,
});

export { Snackbar, SnackbarToast };

/**
 * CSS 키프레임 정의 문자열
 * Tailwind @keyframes 또는 글로벌 CSS에서 선언해야 한다.
 */
export const snackbarKeyframes = `
@keyframes snackbar-enter {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes snackbar-exit {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(16px); }
}
`;
