# SPEC-SKIN-001: 인증/회원가입 - 구현 계획

> **SPEC ID**: SPEC-SKIN-001
> **문서 유형**: 구현 계획 (plan.md)

## 1. 마일스톤 (우선순위 기반)

### Primary Goal: 로그인 + 회원가입 기본 플로우
- 로그인 페이지 UI 구현 (SignIn 기반)
- 회원가입 스텝 폼 UI 구현 (약관 -> 정보입력 -> 완료)
- Shopby API 연동 (로그인, 회원가입, 이메일 중복확인)
- Huni 디자인 토큰 적용

### Secondary Goal: 찾기 + 인증
- 아이디 찾기 페이지
- 비밀번호 찾기 페이지
- 휴대전화 SMS 인증 UI (타이머, 재발송)

### Optional Goal: 외부 연동
- 알림톡 연동 (NHN Cloud 계약 후)
- SNS 로그인 (네이버/카카오/구글)

## 2. 기술적 접근

### Aurora Skin 재사용 전략
- SignIn.jsx: 로직 재사용, UI 전면 리디자인 (Toss 스타일)
- SignUp.jsx: 기존 폼 로직 유지, 스텝 폼 구조로 래핑
- FindId.jsx / FindPassword.jsx: 로직 유지, 디자인 변경
- utils/api.js: fetchHttpRequest 공통 함수 그대로 활용

### 신규 컴포넌트 개발
- StepIndicator: 회원가입 단계 표시 컴포넌트
- PhoneVerification: SMS 인증 + 타이머 컴포넌트
- PasswordStrength: 비밀번호 강도 표시

### 디자인 토큰 적용
- Tailwind CSS config에 Huni 색상 변수 추가
- shadcn/ui 컴포넌트 테마 오버라이드
- 폼 컴포넌트 공통 스타일 정의

## 3. 아키텍처

```
pages/
  SignIn/           <- Aurora 기반 리디자인
  SignUp/           <- 스텝 폼으로 재구성
  SignUpConfirm/    <- Aurora 기반 리디자인
  FindId/           <- Aurora 기반 리디자인
  FindPassword/     <- Aurora 기반 + 알림톡 연동

components/
  auth/
    StepIndicator/    <- 신규
    PhoneVerification/ <- 신규
    PasswordToggle/   <- 신규
    TermsAgreement/   <- 신규
```

## 4. 리스크 및 대응

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| 알림톡 서비스 미계약 | Medium | 비밀번호 찾기를 이메일 방식으로 우선 구현 |
| Shopby API 인증 스펙 변경 | Low | Aurora 기존 로직 참조 |
| SMS 인증 비용 | Low | 하루 발송 한도 설정 |
