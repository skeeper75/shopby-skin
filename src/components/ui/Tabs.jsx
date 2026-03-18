// @MX:ANCHOR: Tabs Compound Component - Radix UI 기반
// @MX:REASON: fan_in >= 3 (카테고리, 상세탭 등 다수 사용)
// SPEC-DS-006

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Tabs Root
 */
const Tabs = TabsPrimitive.Root;

/**
 * Tabs List - 탭 목록 컨테이너
 */
const TabsList = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const listVariants = cva(
    'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
    {
      variants: {
        variant: {
          default: 'bg-[--huni-bg-muted]',
          brand: 'bg-[--huni-bg-brand-subtle]',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    }
  );

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(listVariants({ variant }), className)}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * Tabs Trigger - 개별 탭
 */
const TabsTrigger = React.forwardRef(({ className, variant = 'brand', ...props }, ref) => {
  const triggerVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]',
    {
      variants: {
        variant: {
          default: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
          brand: 'data-[state=active]:bg-white data-[state=active]:text-[--huni-fg-brand] data-[state=active]:border-b-2 data-[state=active]:border-[--huni-stroke-brand]',
        },
      },
      defaultVariants: {
        variant: 'brand',
      },
    }
  );

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(triggerVariants({ variant }), className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * Tabs Content - 탭 콘텐츠
 */
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
