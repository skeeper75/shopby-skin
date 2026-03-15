import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { cn } from '../../../lib/utils';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import useAdminAuth from '../../../hooks/useAdminAuth';

// @MX:NOTE: [AUTO] 관리자 로그인 페이지 - 후니프린팅 로고 중앙 배치, ID/PW 입력 폼
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 테스트 미작성 - 로그인 성공/실패 시나리오, 유효성 검사 검증 필요
/**
 * 관리자 로그인 페이지
 * - 중앙 정렬 로그인 폼
 * - 후니프린팅 로고
 * - ID/비밀번호 입력
 * - 로그인 성공 시 /admin/dashboard로 리다이렉트
 * - 실패 시 에러 메시지 표시
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [formData, setFormData] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ id: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드 에러 초기화
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필드별 유효성 검사
    const newFieldErrors = { id: '', password: '' };
    let hasFieldError = false;

    if (!formData.id.trim()) {
      newFieldErrors.id = '아이디를 입력해주세요.';
      hasFieldError = true;
    }
    if (!formData.password) {
      newFieldErrors.password = '비밀번호를 입력해주세요.';
      hasFieldError = true;
    }

    if (hasFieldError) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.id, formData.password);

      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.message);
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-[1024px] bg-[#F6F6F6] flex items-center justify-center">
      <div className="w-[400px] bg-white rounded-lg shadow-md p-10">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold text-[#5538B6]"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            후니프린팅
          </h1>
          <p className="text-sm text-[#979797] mt-1">관리자 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-id" className="block text-sm font-medium text-[#424242] mb-1.5">
              아이디
            </label>
            <Input
              id="admin-id"
              name="id"
              type="text"
              value={formData.id}
              onChange={handleChange}
              placeholder="관리자 아이디를 입력하세요"
              className={cn(
                'border-[#CACACA] focus-visible:ring-[#5538B6]',
                fieldErrors.id && 'border-red-400'
              )}
              disabled={isLoading}
              autoComplete="username"
              aria-invalid={!!fieldErrors.id}
              aria-describedby={fieldErrors.id ? 'id-error' : undefined}
            />
            {fieldErrors.id && (
              <p id="id-error" className="text-xs text-red-500 mt-1" role="alert">
                {fieldErrors.id}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-[#424242] mb-1.5">
              비밀번호
            </label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              className={cn(
                'border-[#CACACA] focus-visible:ring-[#5538B6]',
                fieldErrors.password && 'border-red-400'
              )}
              disabled={isLoading}
              autoComplete="current-password"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password && (
              <p id="password-error" className="text-xs text-red-500 mt-1" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded" role="alert">
              {error}
            </p>
          )}

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full h-[36px] rounded text-sm font-medium',
              'bg-[#5538B6] text-white hover:bg-[#4530A0] disabled:opacity-50'
            )}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
