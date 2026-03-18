// @MX:ANCHOR: [AUTO] 관리자 인증 서비스 레이어 - useAdminAuth 훅에서 사용
// @MX:REASON: fan_in >= 2 (useAdminAuth, 향후 추가 훅), 관리자 인증 API 단일 진입점
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 실제 API URL 교체 필요 - TODO 주석으로 마킹된 위치 확인

/**
 * 관리자 인증 API 서비스 레이어
 * - JWT 기반 인증
 * - RBAC 4단계 권한 (super_admin, admin, operator, viewer)
 *
 * 실제 엔드포인트 연동 시 TODO 주석 부분을 교체하세요.
 */

const ADMIN_API_BASE = '/api/admin'; // TODO: 실제 관리자 API 베이스 URL로 교체

/**
 * 관리자 로그인
 * @param {string} id - 관리자 아이디
 * @param {string} password - 관리자 비밀번호
 * @returns {Promise<{ token: string, admin: { id: string, name: string, role: string, permissions: string[] } }>}
 */
export const loginAdmin = async (id, password) => {
  // TODO: 실제 API 연동 시 아래 주석 해제 후 목업 코드 제거
  // const response = await fetch(`${ADMIN_API_BASE}/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ id, password }),
  // });
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message ?? '로그인 실패');
  // }
  // return response.json();

  // 목업 구현 (개발 전용)
  if (process.env.NODE_ENV === 'production') {
    throw new Error('인증 서비스를 사용할 수 없습니다.');
  }

  if (id === 'admin' && password === 'admin1234') {
    return {
      token: 'mock_admin_token_' + Date.now(),
      admin: {
        id: 'admin',
        name: '관리자',
        role: 'super_admin',
        permissions: ['all'],
      },
    };
  }

  throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
};

/**
 * 관리자 로그아웃 (서버 토큰 무효화)
 * @param {string} token - 현재 JWT 토큰
 * @returns {Promise<void>}
 */
export const logoutAdmin = async (token) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // await fetch(`${ADMIN_API_BASE}/logout`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
};

/**
 * 현재 토큰 유효성 검증
 * @param {string} token - JWT 토큰
 * @returns {Promise<{ valid: boolean, admin?: object }>}
 */
export const verifyAdminToken = async (token) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/verify`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // if (!response.ok) return { valid: false };
  // const admin = await response.json();
  // return { valid: true, admin };

  // 목업: 토큰 존재 시 유효로 처리
  return { valid: !!token };
};

/**
 * RBAC 권한 레벨 정의
 * super_admin > admin > operator > viewer
 */
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
};

/**
 * 역할별 권한 계층 확인
 * @param {string} userRole - 현재 사용자 역할
 * @param {string} requiredRole - 필요한 최소 역할
 * @returns {boolean}
 */
export const hasMinimumRole = (userRole, requiredRole) => {
  const hierarchy = [
    ADMIN_ROLES.VIEWER,
    ADMIN_ROLES.OPERATOR,
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.SUPER_ADMIN,
  ];
  const userLevel = hierarchy.indexOf(userRole);
  const requiredLevel = hierarchy.indexOf(requiredRole);
  return userLevel >= requiredLevel;
};
