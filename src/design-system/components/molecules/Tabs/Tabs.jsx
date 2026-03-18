/**
 * Tabs Compound Component
 *
 * Radix UI Tabs를 기반으로 line / chip variant, 애니메이션 인디케이터를 제공하는
 * 탭 네비게이션 컴포넌트.
 *
 * @MX:NOTE: [AUTO] 7개 slot을 가진 Radix 기반 compound component - Root, List, Trigger, Content, Indicator, Carousel, CarouselContent 포함
 * @MX:SPEC: SPEC-DS-006
 */
import React, { forwardRef, createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../../utils/cn';
import { tabsTriggerRecipe } from './Tabs.recipe';

// ────────────────────────────────────────────
// 내부 컨텍스트 (variant/size/layout/chipStyle 전파)
// ────────────────────────────────────────────

const TabsContext = createContext({
  variant: 'line',
  size: 'sm',
  layout: 'fill',
  chipStyle: 'solid',
});

function useTabsContext() {
  return useContext(TabsContext);
}

// ────────────────────────────────────────────
// Tabs.Root
// ────────────────────────────────────────────

/**
 * Tabs 최상위 래퍼. Radix Tabs.Root를 감싼다.
 * variant, size, layout, chipStyle을 컨텍스트로 전파한다.
 */
const Root = forwardRef(function TabsRoot(
  {
    className,
    variant = 'line',
    size = 'sm',
    layout = 'fill',
    chipStyle = 'solid',
    children,
    ...props
  },
  ref
) {
  return (
    <TabsContext.Provider value={{ variant, size, layout, chipStyle }}>
      <RadixTabs.Root ref={ref} className={cn(className)} {...props}>
        {children}
      </RadixTabs.Root>
    </TabsContext.Provider>
  );
});
Root.displayName = 'Tabs.Root';

// ────────────────────────────────────────────
// Tabs.List
// ────────────────────────────────────────────

/** 탭 목록 래퍼. 스크롤 가능한 수평 레이아웃. */
const List = forwardRef(function TabsList({ className, children, ...props }, ref) {
  const { variant } = useTabsContext();

  return (
    <RadixTabs.List
      ref={ref}
      className={cn(
        'relative flex',
        // line variant일 때만 하단 보더
        variant === 'line' && 'border-b border-[var(--huni-stroke-neutral-muted)]',
        // chip variant일 때 간격
        variant === 'chip' && 'gap-[var(--huni-space-1,4px)]',
        // 가로 스크롤 가능
        'overflow-x-auto scrollbar-none',
        className
      )}
      {...props}
    >
      {children}
    </RadixTabs.List>
  );
});
List.displayName = 'Tabs.List';

// ────────────────────────────────────────────
// Tabs.Trigger
// ────────────────────────────────────────────

/** 개별 탭 트리거 버튼. */
const Trigger = forwardRef(function TabsTrigger(
  { className, children, ...props },
  ref
) {
  const { variant, size, layout, chipStyle } = useTabsContext();

  return (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(
        tabsTriggerRecipe({ variant, size, layout }),
        // line variant 색상
        variant === 'line' && [
          'text-[var(--huni-fg-neutral-subtle)]',
          'data-[state=active]:text-[var(--huni-fg-neutral)]',
        ],
        // chip solid variant 색상
        variant === 'chip' && chipStyle === 'solid' && [
          'text-[var(--huni-fg-neutral)] bg-[var(--huni-bg-neutral-weak)]',
          'data-[state=active]:bg-[var(--huni-bg-neutral-inverted)] data-[state=active]:text-[var(--huni-fg-neutral-inverted)]',
        ],
        // chip outline variant 색상
        variant === 'chip' && chipStyle === 'outline' && [
          'text-[var(--huni-fg-neutral)] border border-[var(--huni-stroke-neutral-muted)]',
          'data-[state=active]:bg-[var(--huni-bg-neutral-inverted)] data-[state=active]:text-[var(--huni-fg-neutral-inverted)] data-[state=active]:border-transparent',
        ],
        className
      )}
      {...props}
    >
      {children}
    </RadixTabs.Trigger>
  );
});
Trigger.displayName = 'Tabs.Trigger';

// ────────────────────────────────────────────
// Tabs.Indicator
// ────────────────────────────────────────────

/**
 * line variant 전용 애니메이션 인디케이터.
 * 활성 트리거의 위치/너비를 추적하여 하단에 2px 바를 표시한다.
 * CSS transition으로 부드럽게 이동한다.
 */
const Indicator = forwardRef(function TabsIndicator(
  { className, ...props },
  ref
) {
  const { variant } = useTabsContext();
  const [style, setStyle] = useState({ left: 0, width: 0 });
  const indicatorRef = useRef(null);
  const mergedRef = ref || indicatorRef;

  // 활성 트리거 위치 업데이트
  const updatePosition = useCallback(() => {
    const el = typeof mergedRef === 'function' ? null : mergedRef?.current;
    if (!el) return;

    const list = el.parentElement;
    if (!list) return;

    const activeTrigger = list.querySelector('[data-state="active"]');
    if (!activeTrigger) return;

    const listRect = list.getBoundingClientRect();
    const triggerRect = activeTrigger.getBoundingClientRect();

    setStyle({
      left: triggerRect.left - listRect.left + list.scrollLeft,
      width: triggerRect.width,
    });
  }, [mergedRef]);

  useEffect(() => {
    updatePosition();

    // MutationObserver로 data-state 변경 감지
    const el = typeof mergedRef === 'function' ? null : mergedRef?.current;
    const list = el?.parentElement;
    if (!list) return;

    const observer = new MutationObserver(updatePosition);
    observer.observe(list, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true,
    });

    // 리사이즈 시에도 위치 재계산
    window.addEventListener('resize', updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition, mergedRef]);

  // chip variant에서는 인디케이터 불필요
  if (variant !== 'line') return null;

  return (
    <span
      ref={mergedRef}
      className={cn(
        'absolute bottom-0 h-[2px] bg-[var(--huni-fg-neutral)]',
        'transition-all duration-[var(--huni-duration-s2,150ms)] ease-[var(--huni-easing-standard,ease)]',
        className
      )}
      style={style}
      {...props}
    />
  );
});
Indicator.displayName = 'Tabs.Indicator';

// ────────────────────────────────────────────
// Tabs.Content
// ────────────────────────────────────────────

/** 탭 콘텐츠 패널. */
const Content = forwardRef(function TabsContent({ className, children, ...props }, ref) {
  return (
    <RadixTabs.Content ref={ref} className={cn(className)} {...props}>
      {children}
    </RadixTabs.Content>
  );
});
Content.displayName = 'Tabs.Content';

// ────────────────────────────────────────────
// Tabs.Carousel / CarouselContent (placeholder)
// ────────────────────────────────────────────

/** 캐러셀 레이아웃 래퍼 (placeholder). */
const Carousel = forwardRef(function TabsCarousel({ className, children, ...props }, ref) {
  return (
    <div ref={ref} className={cn('overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
});
Carousel.displayName = 'Tabs.Carousel';

/** 캐러셀 콘텐츠 래퍼 (placeholder). */
const CarouselContent = forwardRef(function TabsCarouselContent(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn('flex', className)} {...props}>
      {children}
    </div>
  );
});
CarouselContent.displayName = 'Tabs.CarouselContent';

// ────────────────────────────────────────────
// 통합 Export
// ────────────────────────────────────────────

export const Tabs = {
  Root,
  List,
  Trigger,
  Content,
  Indicator,
  Carousel,
  CarouselContent,
};
