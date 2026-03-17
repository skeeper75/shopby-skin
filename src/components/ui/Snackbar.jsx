// @MX:ANCHOR: Snackbar Compound Component - 토스트 알림
// @MX:REASON: fan_in >= 3 (장바구니, 결제, 옵션저장 등 다수 사용)
// SPEC-DS-006

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Toast Provider
 */
const ToastProvider = ToastPrimitive.Provider;

/**
 * Toast Root
 */
const Toast = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const toastVariants = cva(
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all',
    {
      variants: {
        variant: {
          default: 'border bg-white text-[--huni-fg-default]',
          success: 'border-[--huni-stroke-success] bg-[--huni-bg-success] text-[--huni-fg-success]',
          error: 'border-[--huni-stroke-error] bg-[--huni-bg-error] text-[--huni-fg-error]',
          info: 'border-[--huni-stroke-info] bg-[--huni-bg-info] text-[--huni-fg-info]',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    }
  );

  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitive.Root.displayName;

/**
 * Toast Action
 */
const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

/**
 * Toast Close
 */
const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

/**
 * Toast Title
 */
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

/**
 * Toast Description
 */
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

/**
 * Toast Icon
 */
const ToastIcon = ({ variant }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  return icons[variant || 'info'] || icons.info;
};

/**
 * Toast Viewport
 */
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

export {
  ToastProvider,
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  ToastIcon,
  ToastViewport,
};
