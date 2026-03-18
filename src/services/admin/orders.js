// @MX:ANCHOR: [AUTO] 주문 관리 API 서비스 레이어 - Orders, FileCheck, StatusChange 등에서 사용
// @MX:REASON: fan_in >= 5 (Orders, FileCheck, StatusChange, PrintOrders, DeferredPayment)
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 실제 API URL 교체 필요 - TODO 주석으로 마킹된 위치 확인

/**
 * 주문 관리 API 서비스 레이어
 * - 주문 목록 조회 (필터/검색/페이징)
 * - 주문 상세 조회
 * - 주문 상태 변경 (단건/일괄)
 *
 * 실제 엔드포인트 연동 시 TODO 주석 부분을 교체하세요.
 */

const ADMIN_API_BASE = '/api/admin'; // TODO: 실제 관리자 API 베이스 URL로 교체

/**
 * Authorization 헤더 생성
 * @returns {Object}
 */
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * 주문 목록 조회
 * @param {Object} params - 필터/검색/페이징 파라미터
 * @param {string} [params.keyword] - 검색어
 * @param {string} [params.searchTarget] - 검색 대상 (all, orderNo, customerName, productName)
 * @param {string} [params.status] - 주문 상태 필터
 * @param {string} [params.category] - 카테고리 필터
 * @param {string} [params.startDate] - 시작 날짜 (YYYY-MM-DD)
 * @param {string} [params.endDate] - 종료 날짜 (YYYY-MM-DD)
 * @param {number} [params.page] - 페이지 번호 (1부터)
 * @param {number} [params.pageSize] - 페이지 크기
 * @returns {Promise<{ orders: Array, total: number, page: number, pageSize: number }>}
 */
export const getOrders = async (params = {}) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const query = new URLSearchParams(
  //   Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  // ).toString();
  // const response = await fetch(`${ADMIN_API_BASE}/orders?${query}`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) throw new Error('주문 목록 조회 실패');
  // return response.json();

  throw new Error('getOrders: 실제 API 미연동 - Mock 데이터 사용 중');
};

/**
 * 주문 상세 조회
 * @param {string|number} orderNo - 주문 번호
 * @returns {Promise<Object>} 주문 상세 데이터
 */
export const getOrderDetail = async (orderNo) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/orders/${orderNo}`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) throw new Error('주문 상세 조회 실패');
  // return response.json();

  throw new Error('getOrderDetail: 실제 API 미연동');
};

/**
 * 주문 상태 변경 (단건)
 * @param {string|number} orderNo - 주문 번호
 * @param {string} status - 변경할 상태
 * @param {string} [memo] - 상태 변경 메모
 * @returns {Promise<Object>} 변경된 주문 데이터
 */
export const updateOrderStatus = async (orderNo, status, memo = '') => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/orders/${orderNo}/status`, {
  //   method: 'PUT',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify({ status, memo }),
  // });
  // if (!response.ok) throw new Error('주문 상태 변경 실패');
  // return response.json();

  throw new Error('updateOrderStatus: 실제 API 미연동');
};

/**
 * 주문 상태 일괄 변경
 * @param {Array<string|number>} orderNos - 주문 번호 배열
 * @param {string} status - 변경할 상태
 * @returns {Promise<{ success: number, failed: number }>}
 */
export const batchUpdateOrderStatus = async (orderNos, status) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/orders/batch-status`, {
  //   method: 'PUT',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify({ orderNos, status }),
  // });
  // if (!response.ok) throw new Error('일괄 상태 변경 실패');
  // return response.json();

  throw new Error('batchUpdateOrderStatus: 실제 API 미연동');
};
