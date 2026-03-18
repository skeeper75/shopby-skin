// @MX:NOTE: [AUTO] 파일 확인 API 서비스 레이어 - FileCheck 페이지에서 사용
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 실제 API URL 교체 필요 - TODO 주석으로 마킹된 위치 확인

/**
 * 파일 확인 API 서비스 레이어
 * - 주문 파일 수동 확인 처리
 * - 확인 결과 기록
 *
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
 * 주문 파일 확인 처리
 * @param {string|number} orderNo - 주문 번호
 * @param {Object} checkResult
 * @param {string} checkResult.status - 확인 결과 (approved|rejected|pending)
 * @param {string} [checkResult.memo] - 확인 메모
 * @returns {Promise<Object>} 처리 결과
 */
export const checkOrderFile = async (orderNo, checkResult) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/orders/${orderNo}/file-check`, {
  //   method: 'PUT',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(checkResult),
  // });
  // if (!response.ok) throw new Error('파일 확인 처리 실패');
  // return response.json();

  throw new Error('checkOrderFile: 실제 API 미연동');
};

/**
 * 재업로드 요청
 * @param {string|number} orderNo - 주문 번호
 * @param {string} reason - 재업로드 요청 사유
 * @returns {Promise<Object>}
 */
export const requestFileReupload = async (orderNo, reason) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/orders/${orderNo}/reupload`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify({ reason }),
  // });
  // if (!response.ok) throw new Error('재업로드 요청 실패');
  // return response.json();

  throw new Error('requestFileReupload: 실제 API 미연동');
};
