// @MX:NOTE: [AUTO] 영수증 API 서비스 레이어 - Receipts 페이지에서 사용
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 실제 API URL 교체 필요 - TODO 주석으로 마킹된 위치 확인

/**
 * 영수증 API 서비스 레이어
 * 실제 엔드포인트 연동 시 TODO 주석 부분을 교체하세요.
 */

const ADMIN_API_BASE = '/api/admin'; // TODO: 실제 관리자 API 베이스 URL로 교체

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * 영수증 목록 조회
 * @param {Object} params - 필터 파라미터
 * @returns {Promise<Array>}
 */
export const getReceipts = async (params = {}) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const query = new URLSearchParams(
  //   Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  // ).toString();
  // const response = await fetch(`${ADMIN_API_BASE}/receipts?${query}`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) throw new Error('영수증 목록 조회 실패');
  // return response.json();

  throw new Error('getReceipts: 실제 API 미연동');
};

/**
 * 영수증 발행 처리
 * @param {string|number} orderNo - 주문 번호
 * @param {Object} receiptData - 영수증 데이터
 * @returns {Promise<Object>}
 */
export const issueReceipt = async (orderNo, receiptData) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/receipts/${orderNo}`, {
  //   method: 'PUT',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(receiptData),
  // });
  // if (!response.ok) throw new Error('영수증 발행 실패');
  // return response.json();

  throw new Error('issueReceipt: 실제 API 미연동');
};
