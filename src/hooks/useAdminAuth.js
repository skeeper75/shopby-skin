import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      // TODO: 실제 API 연동 시 fetchHttpRequest 사용
      // const response = await fetchHttpRequest({
      //   url: 'admin/login',
      //   method: 'POST',
      //   requestBody: { id, password },
      // });

      // 목업 로그인 처리 (개발용 - 프로덕션에서는 실제 API로 교체 필요)
      if (process.env.NODE_ENV === 'production') {
        console.error('목업 인증은 프로덕션 환경에서 사용할 수 없습니다.');
        return { success: false, message: '인증 서비스를 사용할 수 없습니다.' };
      }

      if (id === 'admin' && password === 'admin1234') {
        const mockAdminData = {
          name: '관리자',
          role: 'super_admin',
          permissions: ['all'],
          id: 'admin',
        };
        // 개발용 목업 토큰 - 실제 배포 시 서버에서 발급받은 JWT 토큰으로 교체 필요
        // sessionStorage 사용은 탭 단위 격리가 되어 XSS 외의 위협에는 안전하나,
        // 프로덕션에서는 httpOnly 쿠키 방식을 권장
        const mockToken = 'mock_admin_token_' + Date.now();

        sessionStorage.setItem(ADMIN_TOKEN_KEY, mockToken);
        sessionStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(mockAdminData));
        setAdmin(mockAdminData);
        setIsAuthenticated(true);

        return { success: true };
      }

      return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    } catch (error) {
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    }
  }, []);

  /**
   * 관리자 로그아웃
   * 세션 스토리지에서 토큰과 관리자 정보를 제거합니다.
   */
  const logout = useCallback(() => {
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
