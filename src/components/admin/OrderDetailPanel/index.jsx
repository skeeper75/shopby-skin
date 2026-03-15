import { useCallback } from 'react';
import StatusBadge from '../StatusBadge';

// @MX:NOTE: [AUTO] 주문 상세 슬라이드인 패널 - 주문/상품/배송/결제/파일 5개 섹션 표시
// @MX:SPEC: SPEC-SKIN-005
/**
 * 주문 상세 슬라이드인 패널 컴포넌트
 * - 오른쪽에서 슬라이드 인 되는 주문 상세 정보 패널
 * - 섹션: 주문정보, 상품정보, 배송정보, 결제정보, 파일정보
 *
 * @param {Object} props
 * @param {Object} props.order - 주문 데이터
 * @param {boolean} props.isOpen - 패널 열림 상태
 * @param {Function} props.onClose - 닫기 콜백
 * @param {Function} props.onStatusChange - 상태 변경 콜백
 * @param {Function} props.onFileCheck - 파일 확인 콜백
 * @param {Function} props.onPrint - 주문서 출력 콜백
 */
const OrderDetailPanel = ({
  order,
  isOpen = false,
  onClose,
  onStatusChange,
  onFileCheck,
  onPrint,
}) => {
  // 배경 클릭 시 닫기
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    },
    [onClose]
  );

  if (!isOpen || !order) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30"
      onClick={handleBackdropClick}
    >
      {/* 슬라이드인 패널 */}
      <div className="absolute right-0 top-0 h-full w-[480px] bg-white shadow-lg overflow-y-auto animate-slide-in">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-[#CACACA] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-[#424242]">주문 상세</h2>
            <StatusBadge status={order.status} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#979797] hover:text-[#424242] text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 주문정보 섹션 */}
          <Section title="주문정보">
            <InfoRow label="주문번호" value={order.orderNo} />
            <InfoRow label="주문일시" value={order.orderDate} />
            <InfoRow label="주문자" value={order.customerName} />
            <InfoRow label="연락처" value={order.phone} />
            <InfoRow label="이메일" value={order.email} />
          </Section>

          {/* 상품정보 섹션 */}
          <Section title="상품정보">
            <InfoRow label="상품명" value={order.productName} />
            <InfoRow label="옵션" value={order.option} />
            <InfoRow label="수량" value={`${order.quantity}개`} />
            <InfoRow label="카테고리" value={order.category} />
          </Section>

          {/* 배송정보 섹션 */}
          <Section title="배송정보">
            <InfoRow label="수령인" value={order.receiverName} />
            <InfoRow label="연락처" value={order.receiverPhone} />
            <InfoRow label="주소" value={order.address} />
            <InfoRow label="배송메모" value={order.deliveryMemo || '-'} />
            {order.trackingNumber && (
              <InfoRow label="운송장번호" value={order.trackingNumber} />
            )}
          </Section>

          {/* 결제정보 섹션 */}
          <Section title="결제정보">
            <InfoRow label="결제방법" value={order.paymentMethod} />
            <InfoRow label="상품금액" value={formatPrice(order.productPrice)} />
            <InfoRow label="배송비" value={formatPrice(order.shippingFee)} />
            <InfoRow
              label="총 결제금액"
              value={formatPrice(order.totalPrice)}
              highlight
            />
          </Section>

          {/* 파일정보 섹션 */}
          {order.files?.length > 0 && (
            <Section title="파일정보">
              {order.files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 text-sm"
                >
                  <span className="text-[#424242] truncate max-w-[250px]">
                    {file.name}
                  </span>
                  <span className="text-[#979797] text-xs">
                    {file.size} | {file.uploadDate}
                  </span>
                </div>
              ))}
            </Section>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => onStatusChange?.(order)}
              className="flex-1 h-[36px] bg-[#5538B6] text-white text-sm rounded hover:bg-[#4530A0] transition-colors"
            >
              상태변경
            </button>
            <button
              type="button"
              onClick={() => onFileCheck?.(order)}
              className="flex-1 h-[36px] border border-[#5538B6] text-[#5538B6] text-sm rounded hover:bg-[#EEEBF9] transition-colors"
            >
              파일확인
            </button>
            <button
              type="button"
              onClick={() => onPrint?.(order)}
              className="flex-1 h-[36px] border border-[#CACACA] text-[#424242] text-sm rounded hover:bg-[#F6F6F6] transition-colors"
            >
              주문서출력
            </button>
          </div>
        </div>
      </div>

      {/* 슬라이드인 애니메이션 스타일 */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

// 정보 행 컴포넌트
const InfoRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-start py-1.5 text-sm">
    <span className="text-[#979797] min-w-[80px] shrink-0">{label}</span>
    <span
      className={`text-right ${
        highlight ? 'font-semibold text-[#5538B6]' : 'text-[#424242]'
      }`}
    >
      {value || '-'}
    </span>
  </div>
);

// 섹션 컴포넌트
const Section = ({ title, children }) => (
  <div className="border border-[#CACACA] rounded-lg overflow-hidden">
    <div className="bg-[#F6F6F6] px-4 py-2.5">
      <h3 className="text-sm font-semibold text-[#424242]">{title}</h3>
    </div>
    <div className="px-4 py-3">{children}</div>
  </div>
);

// 가격 포맷 헬퍼
const formatPrice = (price) => {
  if (price === undefined || price === null) return '-';
  return `${Number(price).toLocaleString()}원`;
};

export default OrderDetailPanel;
