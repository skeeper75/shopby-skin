/**
 * Dialog 컴파운드 컴포넌트
 *
 * @radix-ui/react-dialog 기반의 모달 다이얼로그.
 * 슬롯: Root, Trigger, Backdrop, Positioner, Content,
 *        Header, Title, Description, Body, Footer, Action
 *
 * lazyMount: 최초 열림 시까지 Content를 마운트하지 않음.
 * unmountOnExit: 닫힘 애니메이션 완료 후 Content 언마운트.
 *
 * @MX:NOTE: [AUTO] Radix Dialog 프리미티브를 감싸는 Huni 디자인 시스템 Dialog
 * @MX:SPEC: SPEC-DS-006
 */
import React, { forwardRef, useState, useCallback, useEffect, useRef } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../../utils/cn';
import {
  backdropStyles,
  positionerStyles,
  contentStyles,
  headerStyles,
  titleStyles,
  descriptionStyles,
  bodyStyles,
  footerStyles,
} from './Dialog.recipe';

// ---------------------------------------------------------------------------
// Root: lazyMount + unmountOnExit 지원
// ---------------------------------------------------------------------------

/**
 * Dialog 루트 컨테이너
 *
 * @MX:WARN: [AUTO] lazyMount/unmountOnExit 상태 관리로 복잡도 존재
 * @MX:REASON: 최초 열림 추적(hasOpened)과 닫힘 애니메이션 완료 추적(shouldRender)이 결합됨
 */
function DialogRoot({
  open,
  onOpenChange,
  defaultOpen = false,
  children,
  ...props
}) {
  // 제어/비제어 모드 지원
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open !== undefined ? open : internalOpen;

  // lazyMount: 한 번이라도 열렸는지 추적
  const [hasOpened, setHasOpened] = useState(defaultOpen);
  // unmountOnExit: 닫힘 애니메이션 동안 렌더링 유지
  const [shouldRender, setShouldRender] = useState(defaultOpen);

  const handleOpenChange = useCallback(
    (nextOpen) => {
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);

      if (nextOpen) {
        setHasOpened(true);
        setShouldRender(true);
      }
    },
    [onOpenChange],
  );

  // 닫힐 때 애니메이션 종료 후 언마운트
  useEffect(() => {
    if (!isOpen && hasOpened) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // --huni-duration-normal 기본값과 동기화
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasOpened]);

  return (
    <RadixDialog.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <DialogRootContext.Provider value={{ hasOpened, shouldRender, isOpen }}>
        {children}
      </DialogRootContext.Provider>
    </RadixDialog.Root>
  );
}
DialogRoot.displayName = 'Dialog.Root';

/** @internal Dialog 내부 상태 컨텍스트 */
const DialogRootContext = React.createContext({
  hasOpened: false,
  shouldRender: false,
  isOpen: false,
});

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const DialogTrigger = forwardRef(({ asChild = true, children, ...props }, ref) => (
  <RadixDialog.Trigger ref={ref} asChild={asChild} {...props}>
    {children}
  </RadixDialog.Trigger>
));
DialogTrigger.displayName = 'Dialog.Trigger';

// ---------------------------------------------------------------------------
// Backdrop (Overlay)
// ---------------------------------------------------------------------------

const DialogBackdrop = forwardRef(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={cn(...backdropStyles, className)}
    {...props}
  />
));
DialogBackdrop.displayName = 'Dialog.Backdrop';

// ---------------------------------------------------------------------------
// Positioner (센터링 래퍼)
// ---------------------------------------------------------------------------

const DialogPositioner = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(...positionerStyles, className)} {...props}>
    {children}
  </div>
));
DialogPositioner.displayName = 'Dialog.Positioner';

// ---------------------------------------------------------------------------
// Content (Radix Dialog.Content를 Positioner+Backdrop과 결합)
// ---------------------------------------------------------------------------

/**
 * Dialog 콘텐츠 패널
 *
 * Backdrop + Positioner를 자동으로 렌더링하며, lazyMount/unmountOnExit를 지원한다.
 */
const DialogContent = forwardRef(
  ({ className, children, style, ...props }, ref) => {
    const { hasOpened, shouldRender } = React.useContext(DialogRootContext);

    // lazyMount: 한 번도 열리지 않았으면 렌더링하지 않음
    if (!hasOpened) return null;
    // unmountOnExit: 닫힘 애니메이션 완료 후 언마운트
    if (!shouldRender) return null;

    return (
      <RadixDialog.Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <RadixDialog.Content
            ref={ref}
            className={cn(...contentStyles, className)}
            style={style}
            {...props}
          >
            {children}
          </RadixDialog.Content>
        </DialogPositioner>
      </RadixDialog.Portal>
    );
  },
);
DialogContent.displayName = 'Dialog.Content';

// ---------------------------------------------------------------------------
// Header / Title / Description
// ---------------------------------------------------------------------------

const DialogHeader = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(...headerStyles, className)} {...props}>
    {children}
  </div>
));
DialogHeader.displayName = 'Dialog.Header';

const DialogTitle = forwardRef(({ className, children, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={cn(...titleStyles, className)}
    {...props}
  >
    {children}
  </RadixDialog.Title>
));
DialogTitle.displayName = 'Dialog.Title';

const DialogDescription = forwardRef(
  ({ className, children, ...props }, ref) => (
    <RadixDialog.Description
      ref={ref}
      className={cn(...descriptionStyles, className)}
      {...props}
    >
      {children}
    </RadixDialog.Description>
  ),
);
DialogDescription.displayName = 'Dialog.Description';

// ---------------------------------------------------------------------------
// Body / Footer
// ---------------------------------------------------------------------------

const DialogBody = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(...bodyStyles, className)} {...props}>
    {children}
  </div>
));
DialogBody.displayName = 'Dialog.Body';

const DialogFooter = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(...footerStyles, className)} {...props}>
    {children}
  </div>
));
DialogFooter.displayName = 'Dialog.Footer';

// ---------------------------------------------------------------------------
// Action (Radix Dialog.Close 래핑 — 클릭 시 자동 닫힘)
// ---------------------------------------------------------------------------

const DialogAction = forwardRef(
  ({ asChild = false, children, ...props }, ref) => (
    <RadixDialog.Close ref={ref} asChild={asChild} {...props}>
      {children}
    </RadixDialog.Close>
  ),
);
DialogAction.displayName = 'Dialog.Action';

// ---------------------------------------------------------------------------
// 컴파운드 내보내기
// ---------------------------------------------------------------------------

/**
 * Dialog 컴파운드 컴포넌트
 *
 * 사용 예시:
 *   <Dialog.Root>
 *     <Dialog.Trigger><button>열기</button></Dialog.Trigger>
 *     <Dialog.Content>
 *       <Dialog.Header>
 *         <Dialog.Title>제목</Dialog.Title>
 *         <Dialog.Description>설명</Dialog.Description>
 *       </Dialog.Header>
 *       <Dialog.Body>내용</Dialog.Body>
 *       <Dialog.Footer>
 *         <Dialog.Action asChild><button>확인</button></Dialog.Action>
 *       </Dialog.Footer>
 *     </Dialog.Content>
 *   </Dialog.Root>
 *
 * @MX:ANCHOR: [AUTO] 디자인 시스템의 공용 모달 인터페이스
 * @MX:REASON: 주문/결제/확인 플로우 등 다수 페이지에서 참조되는 핵심 UI 컴포넌트
 */
const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Backdrop: DialogBackdrop,
  Positioner: DialogPositioner,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Action: DialogAction,
});

export { Dialog };
