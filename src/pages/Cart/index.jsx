// @MX:NOTE: Cart 페이지 - Huni DS v2로 마이그레이션
// SPEC-SKIN-003 TAG-005: 장바구니 기능

import React, { useState } from 'react';
import {
  useCartStateContext,
  useCartActionContext,
} from '@shopby/react-components';
import { Chip } from '../../components/ui/Chip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog';
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport } from '../../components/ui/Snackbar';
import { Divider } from '../../components/ui/Divider';
import { Skeleton } from '../../components/ui/Skeleton';
import { Checkbox } from '../../components/ui/Checkbox';

/**
 * CartItem 컴포넌트 - 장바구니 아이템
 */
const CartItem = ({ item, selected, onSelect, onRemove, onUpdateQuantity }) => {
  const isPrintProduct = item.product?.productType === 'print';

  return (
    <div className="flex items-start gap-4 p-4 border border-[--huni-stroke-default] rounded-lg">
      {/* 선택 체크박스 */}
      <div className="pt-2">
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
        />
      </div>

      {/* 상품 이미지 */}
      <img
        src={item.product?.imageUrl || '/images/placeholder.jpg'}
        alt={item.product?.productName}
        className="w-24 h-24 object-cover rounded-md"
      />

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-[--huni-fg-default] truncate">
          {item.product?.productName}
        </h3>

        {/* 인쇄 옵션 표시 (Chip 형태) */}
        {isPrintProduct && item.printOptions && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(item.printOptions).map(([step, option]) => {
              if (!option || !option.label) return null;

              return (
                <Chip key={step} variant="outline" size="sm">
                  {getStepLabel(step)}: {option.label}
                </Chip>
              );
            })}
          </div>
        )}

        {/* 수량 및 가격 */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.cartNo, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center border border-[--huni-stroke-default] rounded hover:bg-[--huni-bg-muted]"
            >
              -
            </button>
            <span className="w-12 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.cartNo, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-[--huni-stroke-default] rounded hover:bg-[--huni-bg-muted]"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="font-bold text-[--huni-fg-brand]">
              {item.price?.toLocaleString()}원
            </p>
            <button
              onClick={() => onRemove(item.cartNo)}
              className="text-sm text-[--huni-fg-muted] hover:text-[--huni-fg-error]"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 단계 라벨 헬퍼
 */
const getStepLabel = (step: string): string => {
  const labels: Record<string, string> = {
    'paper-type': '용지',
    'paper-thickness': '두께',
    'size': '사이즈',
    'quantity': '수량',
    'print-sides': '면',
    'finishing': '후가공',
    'coating': '코팅',
  };
  return labels[step] || step;
};

/**
 * Cart 메인 컴포넌트
 */
const Cart = () => {
  const { cart, loading } = useCartStateContext();
  const { deleteCart, updateCartQuantity } = useCartActionContext();

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [toasts, setToasts] = useState([]);

  // 토스트 알림 표시
  const showToast = (message, variant = 'default') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, variant, open: true }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  /**
   * 전체선택 토글
   */
  const toggleSelectAll = () => {
    if (selectedItems.size === cart?.products?.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart?.products?.map(item => item.cartNo) || []));
    }
  };

  /**
   * 개별 아이템 선택 토글
   */
  const toggleItemSelection = (cartNo: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(cartNo)) {
      newSelected.delete(cartNo);
    } else {
      newSelected.add(cartNo);
    }
    setSelectedItems(newSelected);
  };

  /**
   * 아이템 삭제
   */
  const handleRemoveItem = async (cartNo: number) => {
    try {
      await deleteCart({ cartNos: [cartNo] });
      showToast('상품이 삭제되었습니다.', 'success');
    } catch (error) {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  /**
   * 수량 업데이트
   */
  const handleUpdateQuantity = async (cartNo: number, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateCartQuantity({ cartNo, quantity });
    } catch (error) {
      showToast('수량 변경에 실패했습니다.', 'error');
    }
  };

  /**
   * 선택 주문 (장바구니 -> 주문서)
   */
  const handleSelectedOrder = () => {
    if (selectedItems.size === 0) {
      showToast('선택한 상품이 없습니다.');
      return;
    }

    setShowCheckoutDialog(true);
  };

  /**
   * 주문하기 확인
   */
  const handleConfirmCheckout = () => {
    const cartNos = Array.from(selectedItems).join(',');
    window.location.href = `/order-sheet?cartNos=${cartNos}`;
  };

  /**
   * 총 금액 계산
   */
  const calculateTotal = () => {
    if (!cart?.products) return 0;

    return cart.products
      .filter(item => selectedItems.has(item.cartNo))
      .reduce((sum, item) => sum + (item.price || 0), 0);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" variant="card" />
        ))}
      </div>
    );
  }

  if (!cart?.products || cart.products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-[--huni-fg-muted] mb-4">장바구니가 비어있습니다.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-[--huni-bg-brand] text-white rounded-md hover:bg-[--huni-bg-brand-bold]"
        >
          쇼핑 계속하기
        </button>
      </div>
    );
  }

  return (
    <ToastProvider>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">장바구니</h1>

      {/* 전체선택 및 삭제 */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={selectedItems.size === cart.products.length}
            onCheckedChange={toggleSelectAll}
          />
          <span>전체선택 ({cart.products.length}개)</span>
        </label>

        <button
          onClick={() => {
            selectedItems.forEach(cartNo => handleRemoveItem(cartNo));
            setSelectedItems(new Set());
          }}
          className="text-sm text-[--huni-fg-error] hover:underline"
          disabled={selectedItems.size === 0}
        >
          선택 삭제
        </button>
      </div>

      {/* 장바구니 아이템 목록 */}
      <div className="space-y-4 mb-6">
        {cart.products.map((item) => (
          <CartItem
            key={item.cartNo}
            item={item}
            selected={selectedItems.has(item.cartNo)}
            onSelect={() => toggleItemSelection(item.cartNo)}
            onRemove={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))}
      </div>

      <Divider />

      {/* 주문 요약 */}
      <div className="flex items-center justify-between py-4">
        <div className="text-lg">
          총 주문금액 ({selectedItems.size}개)
        </div>
        <div className="text-2xl font-bold text-[--huni-fg-brand]">
          {calculateTotal().toLocaleString()}원
        </div>
      </div>

      {/* 주문 버튼 */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSelectedOrder}
          disabled={selectedItems.size === 0}
          className="flex-1 h-[50px] bg-[--huni-bg-brand] text-white rounded-md font-medium hover:bg-[--huni-bg-brand-bold] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          선택 주문 ({selectedItems.size}개)
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="flex-1 h-[50px] border border-[--huni-stroke-brand] text-[--huni-fg-brand] rounded-md font-medium hover:bg-[--huni-bg-brand-subtle]"
        >
          쇼핑 계속하기
        </button>
      </div>

      {/* 주문 확인 다이얼로그 */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주문 확인</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>선택하신 {selectedItems.size}개 상품을 주문하시겠습니까?</p>
            <p className="text-lg font-bold text-[--huni-fg-brand] mt-2">
              총 금액: {calculateTotal().toLocaleString()}원
            </p>
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowCheckoutDialog(false)}
              className="px-4 py-2 border border-[--huni-stroke-default] rounded-md hover:bg-[--huni-bg-muted]"
            >
              쇼핑 계속
            </button>
            <button
              onClick={handleConfirmCheckout}
              className="px-4 py-2 bg-[--huni-bg-brand] text-white rounded-md hover:bg-[--huni-bg-brand-bold]"
            >
              주문하기
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast 알림 */}
      {toasts.map((toast) => (
        <Toast key={toast.id} open={toast.open} variant={toast.variant}>
          <ToastDescription>{toast.message}</ToastDescription>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </div>
    </ToastProvider>
  );
};

export default Cart;
