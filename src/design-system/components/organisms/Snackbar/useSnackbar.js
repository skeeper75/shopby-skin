/**
 * Snackbar 프로그래매틱 API
 *
 * Context + useReducer 기반의 Snackbar 상태 관리.
 * SnackbarProvider로 앱을 감싸고, useSnackbar() 훅으로 생성/해제한다.
 *
 * 사용법:
 *   const snackbar = useSnackbar();
 *   snackbar.create({ title: '저장 완료', type: 'positive', duration: 3000 });
 *   snackbar.dismiss(id);
 *
 * @MX:ANCHOR: [AUTO] 앱 전역 토스트 알림 시스템의 핵심 상태 관리
 * @MX:REASON: 주문확인, 장바구니, 에러 알림 등 다수 페이지에서 호출되는 공용 API
 * @MX:SPEC: SPEC-DS-006
 */
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useMemo,
} from 'react';

/** @internal Snackbar 컨텍스트 */
const SnackbarContext = createContext(null);

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

const ACTIONS = Object.freeze({
  ADD: 'ADD',
  DISMISS: 'DISMISS',
  REMOVE: 'REMOVE',
});

/**
 * Snackbar 큐 리듀서
 *
 * @param {{ queue: Array }} state
 * @param {{ type: string, payload: * }} action
 * @returns {{ queue: Array }}
 */
function snackbarReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return { ...state, queue: [...state.queue, action.payload] };
    case ACTIONS.DISMISS:
      return {
        ...state,
        queue: state.queue.map((s) =>
          s.id === action.payload ? { ...s, dismissed: true } : s,
        ),
      };
    case ACTIONS.REMOVE:
      return {
        ...state,
        queue: state.queue.filter((s) => s.id !== action.payload),
      };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Snackbar 상태 Provider
 *
 * @param {{ children: React.ReactNode, maxVisible?: number }} props
 */
function SnackbarProvider({ children, maxVisible = 3 }) {
  const [state, dispatch] = useReducer(snackbarReducer, { queue: [] });
  const idCounter = useRef(0);

  /** 새 Snackbar를 생성하고 id를 반환한다. */
  const create = useCallback(
    ({
      title,
      description,
      type = 'default',
      duration = 3000,
      onClose,
      actionLabel,
      onAction,
    }) => {
      const id = ++idCounter.current;
      dispatch({
        type: ACTIONS.ADD,
        payload: {
          id,
          title,
          description,
          type,
          duration,
          onClose,
          actionLabel,
          onAction,
          dismissed: false,
          createdAt: Date.now(),
        },
      });
      return id;
    },
    [],
  );

  /** Snackbar를 dismissed 상태로 전환한다 (퇴장 애니메이션 트리거). */
  const dismiss = useCallback((id) => {
    dispatch({ type: ACTIONS.DISMISS, payload: id });
  }, []);

  /** Snackbar를 큐에서 완전히 제거한다. */
  const remove = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE, payload: id });
  }, []);

  const visibleSnackbars = useMemo(
    () => state.queue.filter((s) => !s.dismissed).slice(0, maxVisible),
    [state.queue, maxVisible],
  );

  const contextValue = useMemo(
    () => ({
      snackbars: visibleSnackbars,
      allSnackbars: state.queue,
      create,
      dismiss,
      remove,
    }),
    [visibleSnackbars, state.queue, create, dismiss, remove],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
    </SnackbarContext.Provider>
  );
}
SnackbarProvider.displayName = 'SnackbarProvider';

// ---------------------------------------------------------------------------
// 훅
// ---------------------------------------------------------------------------

/**
 * Snackbar 생성/해제 훅
 *
 * @returns {{ create: Function, dismiss: Function }}
 * @throws {Error} SnackbarProvider 바깥에서 호출 시
 */
function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error(
      'useSnackbar는 SnackbarProvider 내부에서만 사용할 수 있습니다.',
    );
  }
  return { create: ctx.create, dismiss: ctx.dismiss };
}

/**
 * Snackbar 내부 상태 전체 접근 훅 (Region 컴포넌트용)
 *
 * @returns {{ snackbars: Array, allSnackbars: Array, create: Function, dismiss: Function, remove: Function }}
 * @throws {Error} SnackbarProvider 바깥에서 호출 시
 */
function useSnackbarState() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error(
      'useSnackbarState는 SnackbarProvider 내부에서만 사용할 수 있습니다.',
    );
  }
  return ctx;
}

export { SnackbarProvider, useSnackbar, useSnackbarState, SnackbarContext };
