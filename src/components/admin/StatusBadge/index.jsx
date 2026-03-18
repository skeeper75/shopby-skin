// @MX:ANCHOR: [AUTO] 주문 상태 뱃지 - Orders, FileCheck, StatusChange, PrintOrders, DeferredPayment, Receipts, OrderDetailPanel에서 사용
// @MX:REASON: fan_in=7, 관리자 주문관리 전역에서 상태 표시 담당
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 테스트 미작성 - 상태별 스타일 매핑 검증 필요

import { Chip } from '../../../components/ui/Chip';

/**
 * 주문 상태 뱃지 컴포넌트
 * - Huni Design System Chip 기반
 * - 상태별 variant 매핑 지원
 *
 * @param {Object} props
 * @param {string} props.status - 주문 상태 텍스트
 * @param {string} props.className - 추가 스타일 클래스
 */

// @MX:NOTE: [AUTO] 주문 상태 → Chip variant 매핑 - 11단계 상태 지원
const STATUS_VARIANT_MAP = {
  접수중: 'primary',
  접수: 'primary',
  파일확인: 'primary',
  제작중: 'warning',
  제작진행: 'warning',
  제작진행중: 'warning',
  제작완료: 'warning',
  배송중: 'success',
  배송완료: 'success',
  완료: 'default',
  취소: 'error',
  미결제: 'warning',
  부분결제: 'primary',
  결제완료: 'success',
};

const StatusBadge = ({ status, className = '' }) => {
  const variant = STATUS_VARIANT_MAP[status] ?? 'default';

  return (
    <Chip variant={variant} size="sm" className={className}>
      {status}
    </Chip>
  );
};

export default StatusBadge;
