import { cn } from '../../lib/utils';

const formatKRW = (amount) =>
  amount != null ? `${amount.toLocaleString()}원` : '-';

// @MX:ANCHOR: [AUTO] Huni 가격 계산 바 - 데스크톱 sticky / 모바일 fixed bottom
// @MX:REASON: HuniPurchase, MobileOptionSheet에서 사용
const HuniPriceCalculator = ({ priceInfo, isCalculating, onAddCart, onBuyNow, className }) => {
  if (!priceInfo && !isCalculating) return null;

  return (
    <div
      className={cn(
        'bg-white border-t border-[#CACACA]',
        'lg:sticky lg:bottom-0 lg:rounded-[5px] lg:border lg:shadow-sm lg:p-4',
        'fixed bottom-0 left-0 right-0 p-4 lg:relative z-30',
        className
      )}
    >
      {isCalculating ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-[#F6F6F6] rounded w-1/2" />
          <div className="h-8 bg-[#F6F6F6] rounded w-3/4" />
        </div>
      ) : (
        <>
          {/* 가격 상세 - 데스크톱에서만 노출 */}
          <div className="hidden lg:block space-y-1.5 mb-4">
            <div className="flex justify-between text-sm tracking-[-0.05em]">
              <span className="text-[#979797]">상품금액</span>
              <span className="text-[#424242]">{formatKRW(priceInfo?.subtotal)}</span>
            </div>
            {priceInfo?.discount > 0 && (
              <div className="flex justify-between text-sm tracking-[-0.05em]">
                <span className="text-[#979797]">수량 할인</span>
                <span className="text-[#EF4444]">- {formatKRW(priceInfo.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm tracking-[-0.05em]">
              <span className="text-[#979797]">배송비</span>
              <span className="text-[#424242]">
                {priceInfo?.shipping === 0 ? '무료' : formatKRW(priceInfo?.shipping)}
              </span>
            </div>
            <div className="border-t border-[#CACACA] pt-2 flex justify-between font-bold tracking-[-0.05em]">
              <span className="text-[#424242]">총 결제금액</span>
              <span className="text-xl text-[#5538B6]">{formatKRW(priceInfo?.total)}</span>
            </div>
          </div>

          {/* 모바일: 총액만 표시 */}
          <div className="lg:hidden flex items-center justify-between mb-3">
            <span className="text-sm text-[#424242] tracking-[-0.05em]">총 결제금액</span>
            <span className="text-lg font-bold text-[#5538B6]">{formatKRW(priceInfo?.total)}</span>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onAddCart}
              className="flex-1 h-[50px] border-2 border-[#5538B6] text-[#5538B6] text-sm font-bold rounded-[5px] tracking-[-0.05em] hover:bg-[#F6F6F6] transition-colors"
            >
              장바구니
            </button>
            <button
              type="button"
              onClick={onBuyNow}
              className="flex-1 h-[50px] bg-[#3B2573] text-white text-sm font-bold rounded-[5px] tracking-[-0.05em] hover:bg-[#5538B6] transition-colors"
            >
              구매하기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HuniPriceCalculator;
