/**
 * 주문 상태 뱃지 컴포넌트
 * - 상태별 색상 변형 지원
 *
 * @param {Object} props
 * @param {string} props.status - 주문 상태 텍스트
 * @param {string} props.className - 추가 스타일 클래스
 */

// @MX:ANCHOR: [AUTO] 주문 상태 뱃지 - Orders, FileCheck, StatusChange, PrintOrders, DeferredPayment, Receipts, OrderDetailPanel에서 사용
// @MX:REASON: fan_in=7, 관리자 주문관리 전역에서 상태 표시 담당
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 테스트 미작성 - 상태별 스타일 매핑 검증 필요

// @MX:NOTE: [AUTO] 주문 상태별 색상 매핑 - 후니프린팅 디자인 토큰 기반
// @MX:NOTE: [AUTO] 새로운 상태 추가 시 STATUS_STYLES에 bg/text 색상쌍 추가 필요
const STATUS_STYLES = {
  접수중: { bg: '#EEEBF9', text: '#5538B6' },
  접수: { bg: '#EEEBF9', text: '#5538B6' },
  파일확인: { bg: '#EEEBF9', text: '#5538B6' },
  제작중: { bg: '#FFF8E1', text: '#E6B93F' },
  제작진행: { bg: '#FFF8E1', text: '#E6B93F' },
  제작진행중: { bg: '#FFF8E1', text: '#E6B93F' },
  제작완료: { bg: '#FFF8E1', text: '#E6B93F' },
  배송중: { bg: '#E0F7F6', text: '#7AC8C4' },
  배송완료: { bg: '#E0F7F6', text: '#7AC8C4' },
  완료: { bg: '#F6F6F6', text: '#979797' },
  취소: { bg: '#FEE2E2', text: '#EF4444' },
  미결제: { bg: '#FFF8E1', text: '#E6B93F' },
  부분결제: { bg: '#EEEBF9', text: '#5538B6' },
  결제완료: { bg: '#E0F7F6', text: '#7AC8C4' },
};

// 기본 스타일 (매핑에 없는 상태용)
const DEFAULT_STYLE = { bg: '#F6F6F6', text: '#979797' };

const StatusBadge = ({ status, className = '' }) => {
  const style = STATUS_STYLES[status] || DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
