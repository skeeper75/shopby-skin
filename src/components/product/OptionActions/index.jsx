// @MX:NOTE: OptionActions - 옵션 저장/견적서/장바구니 액션 컴포넌트
// SPEC-SKIN-003 TAG-003: 옵션 저장, 견적서, 장바구니 기능

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/Dialog';
import { Snackbar } from '../../ui/Snackbar';

/**
 * OptionActions Props
 */
interface OptionActionsProps {
  selections: Record<string, any>;
  productNo: number;
  productType: string;
  isLoggedIn: boolean;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

/**
 * 견적서 다이얼로그 콘텐츠
 */
const QuotationDialog = ({ open, onClose, selections, productType }) => {
  if (!selections || Object.keys(selections).length === 0) {
    return null;
  }

  const formatPrice = (price) => price?.toLocaleString() || '0';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>견적서</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 상품 정보 */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">인쇄 견적서</h3>
            <p className="text-sm text-[--huni-fg-muted]">선택하신 옵션에 대한 견적 내역입니다.</p>
          </div>

          {/* 옵션 내역 */}
          <div className="space-y-2">
            {Object.entries(selections).map(([step, selection]) => {
              if (!selection || !selection.label) return null;

              return (
                <div key={step} className="flex justify-between py-2 border-b">
                  <span className="text-sm text-[--huni-fg-muted]">{getStepLabel(step)}</span>
                  <span className="text-sm font-medium">{selection.label}</span>
                </div>
              );
            })}
          </div>

          {/* 가격 요약 */}
          <div className="bg-[--huni-bg-muted] p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">총 견적 금액</span>
              <span className="text-xl font-bold text-[--huni-fg-brand]">
                {formatPrice(selections.totalPrice)}원
              </span>
            </div>
          </div>

          {/* 비고 */}
          <div className="text-xs text-[--huni-fg-muted]">
            * 상단 가격은 예상 견적가이며, 실제 주문 시 변동될 수 있습니다.
            <br />
            * 대량 주문의 경우 별도 문의 바랍니다.
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[--huni-bg-brand] text-white rounded-md hover:bg-[--huni-bg-brand-bold] transition-colors"
          >
            인쇄
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[--huni-stroke-default] rounded-md hover:bg-[--huni-bg-muted] transition-colors"
          >
            닫기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * 단계 라벨 헬퍼
 */
const getStepLabel = (step: string): string => {
  const labels: Record<string, string> = {
    'paper-type': '용지종류',
    'paper-thickness': '용지두께',
    'size': '사이즈',
    'quantity': '수량',
    'print-sides': '인쇄면수',
    'finishing': '후가공',
    'coating': '코팅',
    'delivery-date': '납기일',
  };
  return labels[step] || step;
};

/**
 * OptionActions 컴포넌트
 */
const OptionActions = ({
  selections,
  productNo,
  productType,
  isLoggedIn,
  onAddToCart,
  onBuyNow,
}: OptionActionsProps) => {
  const [quotationOpen, setQuotationOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', variant: 'success' });

  /**
   * 옵션 저장 핸들러
   */
  const handleSaveOptions = async () => {
    if (!isLoggedIn) {
      setSnackbar({
        show: true,
        message: '로그인이 필요한 서비스입니다.',
        variant: 'error',
      });
      return;
    }

    try {
      // API 호출: POST /custom/print-options
      // await fetch('/api/custom/print-options', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ productNo, selections }),
      // });

      setSnackbar({
        show: true,
        message: '옵션이 저장되었습니다.',
        variant: 'success',
      });
    } catch (error) {
      setSnackbar({
        show: true,
        message: '옵션 저장에 실패했습니다.',
        variant: 'error',
      });
    }
  };

  /**
   * 장바구니 추가 핸들러
   */
  const handleAddToCart = async () => {
    try {
      if (onAddToCart) {
        onAddToCart();
      }

      setSnackbar({
        show: true,
        message: '장바구니에 추가되었습니다.',
        variant: 'success',
      });
    } catch (error) {
      setSnackbar({
        show: true,
        message: '장바구니 추가에 실패했습니다.',
        variant: 'error',
      });
    }
  };

  /**
   * 바로 구매 핸들러
   */
  const handleBuyNow = async () => {
    try {
      if (onBuyNow) {
        onBuyNow();
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: '주문서 작성에 실패했습니다.',
        variant: 'error',
      });
    }
  };

  const isOptionsComplete = selections['paper-type'] &&
                             selections['paper-thickness'] &&
                             selections['size'] &&
                             selections['quantity'] &&
                             selections['print-sides'];

  return (
    <>
      {/* 액션 버튼 그룹 */}
      <div className="space-y-3">
        {/* 주 버튼들 */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!isOptionsComplete}
            className="flex-1 h-[50px] bg-[--huni-bg-brand] text-white rounded-md font-medium hover:bg-[--huni-bg-brand-bold] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            장바구니
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!isOptionsComplete}
            className="flex-1 h-[50px] bg-[--huni-bg-brand-bold] text-white rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            바로구매
          </button>
        </div>

        {/* 보조 버튼들 */}
        <div className="flex gap-2">
          <button
            onClick={handleSaveOptions}
            disabled={!isOptionsComplete}
            className="flex-1 h-[50px] border border-[--huni-stroke-brand] text-[--huni-fg-brand] rounded-md font-medium hover:bg-[--huni-bg-brand-subtle] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            옵션저장
          </button>
          <button
            onClick={() => setQuotationOpen(true)}
            disabled={!isOptionsComplete}
            className="flex-1 h-[50px] border border-[--huni-stroke-brand] text-[--huni-fg-brand] rounded-md font-medium hover:bg-[--huni-bg-brand-subtle] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            견적서
          </button>
        </div>
      </div>

      {/* 견적서 다이얼로그 */}
      <QuotationDialog
        open={quotationOpen}
        onClose={() => setQuotationOpen(false)}
        selections={selections}
        productType={productType}
      />

      {/* Snackbar */}
      {snackbar.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-3 rounded-md shadow-lg ${
            snackbar.variant === 'success'
              ? 'bg-[--huni-bg-success] text-[--huni-fg-success]'
              : 'bg-[--huni-bg-error] text-[--huni-fg-error]'
          }`}>
            {snackbar.message}
          </div>
        </div>
      )}
    </>
  );
};

export default OptionActions;
