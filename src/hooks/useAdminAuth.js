import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginAdmin, logoutAdmin } from '../services/admin/auth';

// @MX:ANCHOR: [AUTO] 관리자 인증 상태 관리 훅 - Login, AdminLayout 등 전체 관리자 페이지에서 사용
// @MX:REASON: fan_in=2 (현재), 모든 보호된 관리자 페이지에서 필수 의존
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 테스트 미작성 - 로그인/로그아웃/인증상태 단위 테스트 필요

// 관리자 토큰/정보 저장 키
const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_INFO_KEY = 'admin_info';

/**
 * 관리자 인증 상태를 관리하는 커스텀 훅
 * - 로그인/로그아웃 기능
 * - 관리자 정보 (이름, 역할, 권한)
 * - 인증 상태 확인
 */
const useAdminAuth = () => {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_INFO_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem(ADMIN_TOKEN_KEY);
  });

  // 토큰 변경 시 인증 상태 동기화
  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    setIsAuthenticated(!!token);
  }, []);

  /**
   * 관리자 로그인
   * @param {string} id - 관리자 아이디
   * @param {string} password - 관리자 비밀번호
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  const login = useCallback(async (id, password) => {
    try {
      // auth 서비스 레이어를 통해 로그인 (실제 API 또는 Mock)
      const { token, admin: adminData } = await loginAdmin(id, password);

      // sessionStorage 사용은 탭 단위 격리가 되어 XSS 외의 위협에는 안전하나,
      // 프로덕션에서는 httpOnly 쿠키 방식을 권장
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      sessionStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(adminData));
      setAdmin(adminData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message ?? '로그인 중 오류가 발생했습니다.' };
    }
  }, []);

  /**
   * 관리자 로그아웃
   * 세션 스토리지에서 토큰과 관리자 정보를 제거합니다.
   */
  const logout = useCallback(async () => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    // 서버 토큰 무효화 (실패해도 로컬 세션은 초기화)
    try {
      await logoutAdmin(token);
    } catch {
      // 서버 로그아웃 실패 시 로컬 세션만 초기화
    }
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_INFO_KEY);
    setAdmin(null);
    setIsAuthenticated(false);
  }, []);

  return {
    admin,
    isAuthenticated,
    login,
    logout,
  };
};

export default useAdminAuth;
