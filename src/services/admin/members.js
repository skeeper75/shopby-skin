// @MX:ANCHOR: [AUTO] 관리자 회원 API 서비스 레이어 - Members 페이지에서 사용
// @MX:REASON: fan_in >= 1 (Members), 관리자 CRUD API 단일 진입점
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 실제 API URL 교체 필요 - TODO 주석으로 마킹된 위치 확인

/**
 * 관리자 회원 API 서비스 레이어
 * - 관리자 목록 조회
 * - 관리자 추가/수정/삭제
 * - RBAC 4단계 권한 관리 (super_admin, admin, operator, viewer)
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
 * 관리자 목록 조회
 * @returns {Promise<Array<{ id: number, loginId: string, name: string, email: string, role: string, createdAt: string, lastLogin: string }>>}
 */
export const getAdminMembers = async () => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/members`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) throw new Error('관리자 목록 조회 실패');
  // return response.json();

  throw new Error('getAdminMembers: 실제 API 미연동 - Mock 데이터 사용 중');
};

/**
 * 관리자 추가
 * @param {Object} memberData
 * @param {string} memberData.loginId - 로그인 아이디
 * @param {string} memberData.name - 이름
 * @param {string} memberData.email - 이메일
 * @param {string} memberData.password - 비밀번호
 * @param {string} memberData.role - 역할 (super_admin|admin|operator|viewer)
 * @returns {Promise<Object>} 생성된 관리자 데이터
 */
export const createAdminMember = async (memberData) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/members`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(memberData),
  // });
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message ?? '관리자 추가 실패');
  // }
  // return response.json();

  throw new Error('createAdminMember: 실제 API 미연동');
};

/**
 * 관리자 역할 변경
 * @param {number} memberId - 관리자 ID
 * @param {string} role - 새 역할
 * @returns {Promise<Object>} 변경된 관리자 데이터
 */
export const updateAdminMemberRole = async (memberId, role) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/members/${memberId}/role`, {
  //   method: 'PUT',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify({ role }),
  // });
  // if (!response.ok) throw new Error('역할 변경 실패');
  // return response.json();

  throw new Error('updateAdminMemberRole: 실제 API 미연동');
};

/**
 * 관리자 삭제
 * @param {number} memberId - 관리자 ID
 * @returns {Promise<void>}
 */
export const deleteAdminMember = async (memberId) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/members/${memberId}`, {
  //   method: 'DELETE',
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) throw new Error('관리자 삭제 실패');

  throw new Error('deleteAdminMember: 실제 API 미연동');
};
