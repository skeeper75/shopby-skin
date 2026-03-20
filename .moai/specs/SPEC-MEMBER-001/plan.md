---
id: SPEC-MEMBER-001
artifact: plan
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-MEMBER-001: 구현 계획서

> A1A2-MEMBER 로그인/회원 도메인 구현 전략

---

## 1. 구현 개요

### 1.1 범위

후니프린팅 shopby Enterprise 기반 로그인/회원 도메인의 18개 기능을 4개 Phase로 나누어 구현한다. shopby NATIVE Provider를 최대한 활용하는 Tier 1 중심 전략을 따르며, 기존 Aurora Skin 코드베이스에 최소 침습적으로 통합한다.

### 1.2 접근 방식

- **Provider 우선**: shopby 공식 Provider는 교체하지 않고 래핑(wrapping)만 수행
- **최소 침습**: 기존 Provider 체인 구조 유지, 신규 Provider는 페이지 수준에서만 추가
- **PC 우선 설계**: 인쇄 업종 특성상 PC 주문 비중이 높으므로 PC 최적화 후 모바일 대응
- **기존 컴포넌트 재사용**: Timer, TermsContent, PasswordChanger 등 기존 컴포넌트를 최대한 활용

### 1.3 개발 방법론

DDD (ANALYZE-PRESERVE-IMPROVE) 방식 적용. 기존 7,000+ 라인의 인증/회원 코드가 존재하므로 기존 동작을 보존하면서 점진적으로 개선한다.

---

## 2. 아키텍처 결정사항

### 2.1 3-Tier Hybrid 배치

| Tier | 해당 기능 | 구현 방식 |
|------|----------|----------|
| Tier 1 (NATIVE/SKIN) | 로그인, 회원가입, 찾기, SNS 카카오/네이버, 비회원, 등급 | shopby Provider 활용 |
| Tier 2 (CUSTOM) | 구글/애플 OAuth (P2), 관리자 인증 (Mock) | 자체 개발 |
| Tier 3 (Admin) | 관리자 회원관리, 쿠폰, 프린팅머니 | shopby Admin API 직접 호출 |

### 2.2 Provider 통합 전략

- 기존 App Root 10개 Provider 체인 순서 변경 없음
- AuthProvider(5번째)가 MemberProvider를 래핑하는 구조 유지
- 신규 Provider(FindIdProvider, MemberGradeProvider 등)는 각 페이지 컴포넌트 내부에서 래핑

### 2.3 토큰 관리 전략

- accessToken/refreshToken은 `@shopby/shared`의 `memberAuth`에 위임
- 자동 로그인: refreshToken을 localStorage에 영구 저장
- 일반 로그인: refreshToken을 sessionStorage 또는 메모리에 임시 저장
- 401 응답 시: refreshToken으로 토큰 갱신 후 원래 요청 재시도 (기존 `reRequestShopApi` 개선 필요)

### 2.4 보안 결정사항

- React JSX 이스케이핑 + Sanitized 컴포넌트로 XSS 방어
- shopby JWT Bearer Token 방식으로 CSRF 공격 표면 최소화
- 비밀번호 평문 저장/전달 전면 금지
- Rate Limiting: 로그인 5회/5분, SMS 발송 1분 간격, 이메일 중복확인 debounce 300ms

---

## 3. 구현 단계

### Phase 1: Core Auth (P1 핵심) - 최우선

**목표**: 로그인/로그아웃/토큰 관리 기반 구축 및 SNS 로그인 연동

| TAG | 기능 | 작업 파일 | 완료 조건 | 의존성 |
|-----|------|----------|----------|--------|
| TAG-001 | Authentication Foundation | `api.js`, `SignIn.jsx`, `SignInForm.jsx` | 이메일 로그인, 401 토큰 갱신, 자동로그인 동작 | 없음 |
| TAG-002 | SNS Login (카카오/네이버) | `OpenIdSignIn/index.js`, `OpenIdCallback/index.js` | 카카오/네이버 OAuth 완료, 최초 가입 추가 정보 | TAG-001 |

**핵심 리스크**: `reRequestShopApi` 토큰 갱신 버그 - TAG-001에서 최우선 검증

### Phase 2: Registration (P1 회원가입) - 우선

**목표**: 약관동의 ~ 가입완료 전체 플로우 구현

| TAG | 기능 | 작업 파일 | 완료 조건 | 의존성 |
|-----|------|----------|----------|--------|
| TAG-003 | Terms Agreement | `SignUpTerms.jsx` (신규) | 전체동의, 필수/선택 분리, 아코디언, 14세 확인 | 없음 |
| TAG-004 | Registration Form | `SignUpForm.jsx` (신규), `SmsAuthField` (신규) | 이메일 debounce 중복확인, SMS 3분 타이머, 비밀번호 강도 | TAG-003 |
| TAG-005 | Registration Complete | `SignUpComplete.jsx` (신규) | 환영 메시지, 쿠폰/적립금 혜택 표시 | TAG-004 |

### Phase 3: Account Management (P1 계정관리) - 주요

**목표**: 아이디/비밀번호 찾기, 회원정보 관리, 비회원 주문, 등급 조회

| TAG | 기능 | 작업 파일 | 완료 조건 | 의존성 |
|-----|------|----------|----------|--------|
| TAG-006 | Find ID / Find Password | `FindId/index.js`, `FindPassword/index.js` | 이름+휴대전화 찾기, 재설정 링크 발송 | TAG-001 |
| TAG-007 | Member Profile | `MemberModification`, `ChangePassword`, `MemberWithdrawal` | 프로필 수정, 비밀번호 변경, 탈퇴 처리 | TAG-001 |
| TAG-008 | Guest Order | `GuestOrder/index.js` | 주문번호+휴대전화 조회, 회원가입 유도 | 없음 |
| TAG-009 | Member Grade | `MyGrade/index.js`, `MemberGradeBadge`, `MemberGradeProgress` | 등급 표시, 프로그레스 바, 혜택 비교표 | TAG-001 |

### Phase 4: Admin Operations (P2 관리자) - 후순위

**목표**: 관리자 회원관리, 쿠폰, 프린팅머니 관리 기능

| TAG | 기능 | 작업 파일 | 완료 조건 | 의존성 |
|-----|------|----------|----------|--------|
| TAG-010 | Admin Member Management | `admin/Members/` 전체 | 회원 DataTable, 검색/필터, 상세 패널 | TAG-001 |
| TAG-011 | Admin Coupon & PrintingMoney | `CouponManagement.jsx`, `PrintingMoneyManagement.jsx` | 쿠폰 발급, 적립금 충전/차감 | TAG-010 |
| TAG-012 | Admin Grade Settings | `GradeManagement.jsx` | 등급 조건/혜택 설정 UI | TAG-010 |

### Phase 5: P2 External OAuth - 선택

**목표**: 구글/애플 로그인 (별도 SPEC 분리 권장)

| TAG | 기능 | 비고 | 의존성 |
|-----|------|------|--------|
| TAG-013 | Google OAuth | shopby 미지원, 자체 구현 | TAG-001 |
| TAG-014 | Apple Sign In | shopby 미지원, 자체 구현 | TAG-001 |

### TAG 의존성 요약

```
[TAG-001] --> [TAG-002] (SNS 로그인은 기본 인증 필요)
     |-------> [TAG-006] (찾기 기능)
     |-------> [TAG-007] (프로필 관리)
     |-------> [TAG-009] (등급 조회)
     |-------> [TAG-010] --> [TAG-011] (관리자 쿠폰/적립금)
                         --> [TAG-012] (관리자 등급 설정)

[TAG-003] --> [TAG-004] --> [TAG-005] (회원가입 순차 플로우)

[TAG-008] (비회원 주문 - 독립)
```

---

## 4. 파일 영향도 분석

### 4.1 기존 파일 수정 (13개)

| 파일 | 수정 내용 | 복잡도 | Phase |
|------|----------|--------|-------|
| `src/utils/api.js` | 401 토큰 갱신 로직 보강 | 고 | 1 |
| `src/pages/SignIn/SignIn.jsx` | SNS 공식 디자인 버튼, 실패 메시지 개선 | 소 | 1 |
| `src/pages/SignIn/SignInForm.jsx` | 자동로그인 체크박스, 실패 횟수 안내 | 중 | 1 |
| `src/components/OpenIdSignIn/index.js` | 카카오/네이버 공식 버튼 스타일 | 중 | 1 |
| `src/pages/OpenIdCallback/index.js` | SNS 최초 가입 추가 정보 분기 | 중 | 1 |
| `src/pages/SignUp/index.js` | Provider 래핑 확인, AuthenticationProvider 추가 | 소 | 2 |
| `src/pages/FindId/index.js` | FindIdProvider 래핑 | 소 | 3 |
| `src/pages/FindPassword/index.js` | FindPasswordProvider 래핑 | 소 | 3 |
| `src/pages/ChangePassword/index.js` | ChangePasswordProvider 확인/추가 | 소 | 3 |
| `src/pages/MemberModification/index.js` | MyProfileProvider, 비밀번호 확인 플로우 | 중 | 3 |
| `src/pages/MemberWithdrawal/index.js` | WithdrawalProvider, 탈퇴 안내 UI | 중 | 3 |
| `src/pages/MyPage/MyGrade/index.js` | MemberGradeProvider, 등급 안내 UI | 중 | 3 |
| `src/pages/GuestOrder/index.js` | GuestOrderProvider, 비회원 주문조회 | 중 | 3 |

### 4.2 신규 파일 생성 (10개)

| 파일 | 목적 | 복잡도 | Phase |
|------|------|--------|-------|
| `src/pages/SignUp/SignUpTerms.jsx` | 약관동의 단계 UI | 중 | 2 |
| `src/pages/SignUp/SignUpForm.jsx` | 정보입력 단계 UI | 고 | 2 |
| `src/pages/SignUp/SignUpComplete.jsx` | 가입완료 화면 | 소 | 2 |
| `src/pages/SignUp/SignUpAdditionalInfo.jsx` | SNS 최초 로그인 추가 정보 | 중 | 1 |
| `src/components/SmsAuthField/index.js` | 휴대전화 인증 공통 컴포넌트 | 고 | 2 |
| `src/components/PasswordStrength/index.js` | 비밀번호 강도 표시 | 소 | 2 |
| `src/components/MemberGradeBadge/index.js` | 회원등급 배지 | 소 | 3 |
| `src/components/MemberGradeProgress/index.js` | 등급 프로그레스 바 | 소 | 3 |
| `src/hooks/useAuthRedirect.js` | 인증 상태 라우팅 훅 | 소 | 1 |
| `src/hooks/useSmsAuth.js` | SMS 인증 상태/액션 훅 | 중 | 2 |

### 4.3 Admin 전용 파일 (P2, 6개)

| 파일 | 목적 | Phase |
|------|------|-------|
| `src/pages/admin/Members/index.js` | 회원 목록/검색 (기존 Mock -> 실제) | 4 |
| `src/pages/admin/Members/MemberDetail.jsx` | 회원 상세 패널 | 4 |
| `src/pages/admin/Members/CouponManagement.jsx` | 쿠폰 발급/조회 | 4 |
| `src/pages/admin/Members/PrintingMoneyManagement.jsx` | 프린팅머니 관리 | 4 |
| `src/pages/admin/Members/GradeManagement.jsx` | 등급 설정 UI | 4 |
| `src/services/adminAuth.js` | 관리자 인증 서비스 | 4 |

---

## 5. 의존성

### 5.1 외부 의존성

| 의존 대상 | 필요 사항 | 상태 |
|----------|----------|------|
| shopby Enterprise API | 회원/인증 API 전체 | 사용 가능 |
| 카카오 OAuth | 개발자 앱 등록, REST API 키 | 설정 필요 |
| 네이버 OAuth | 개발자 앱 등록, Client ID/Secret | 설정 필요 |
| NHN Cloud SMS | SMS 발송 API 계약 | 별도 계약 필요 |
| shopby 관리자 설정 | 자동메일, 쿠폰 규칙, 등급 산정 주기 | 사전 설정 필요 |

### 5.2 내부 SPEC 의존성

| SPEC | 관계 | 영향도 |
|------|------|--------|
| SPEC-LAYOUT-001/002 | 선행 (완료) | 반응형 레이아웃 기반 |
| SPEC-DESIGN-001/002 | 선행 (진행중) | 디자인 시스템 컴포넌트 |
| SPEC-ORDER (예정) | 후행 | 비회원 주문 플로우 연동 |
| SPEC-MYPAGE (예정) | 후행 | 로그인 기반 접근 제어 |
| SPEC-PAYMENT (예정) | 후행 | 프린팅머니 결제 연동 |

### 5.3 신규 라이브러리

| 기능 | 결정 | 근거 |
|------|------|------|
| 이메일 debounce | 직접 구현 또는 `use-debounce` | 간단한 유틸이므로 직접 구현 권장 |
| 비밀번호 강도 | 정규식 기반 직접 구현 | 간단 규칙(영문/숫자/특수/8자)이므로 zxcvbn 불필요 |
| SMS 타이머 | 기존 `Timer` 컴포넌트 재사용 | `src/components/Timer/index.js` 존재 |
| 폼 검증 | shopby Provider 내장 검증 활용 | 추가 라이브러리 불필요 |

---

## 6. 리스크 및 대응

| 리스크 | 영향 | 가능성 | 대응 방안 |
|--------|------|--------|----------|
| `reRequestShopApi` 토큰 갱신 버그 | 고 | 중 | TAG-001에서 최우선 검증, shopby SDK 내부 동작 확인 |
| SNS 최초 가입 추가 정보 플로우 복잡성 | 중 | 중 | OpenIdCallback에서 분기, 별도 추가 정보 페이지 생성 |
| 카카오/네이버 디자인 가이드 준수 | 저 | 고 | 각 플랫폼 개발자 문서의 공식 버튼 에셋 사용 |
| 관리자 API CORS 이슈 | 중 | 고 | 현재 Mock 체계 유지, 서버 API 연동 시 별도 SPEC |
| SMS 발송 비용 과다 (봇 공격) | 저 | 저 | debounce + 1분 재발송 간격 + IP별 제한 |
| 비밀번호 변경 후 세션 동기화 | 중 | 중 | 변경 후 즉시 logout() 호출, 재로그인 유도 |
| shopby API 다운 시 로그인 불가 | 고 | 저 | 유지보수 공지 화면, fallback UI 표시 |
| 이메일 전환 시 기존 회원 혼란 | 고 | 중 | 마이그레이션 안내 이메일 + 고객지원 기간 설정 |

---

## 7. MX 태그 전략

### 7.1 ANCHOR 대상 (fan_in >= 3)

| 파일 | 대상 | 이유 |
|------|------|------|
| `src/utils/api.js` | `fetchHttpRequest` | fan_in >= 10, 모든 API 호출의 단일 진입점 |
| `src/utils/api.js` | `initializeShopApi` | fan_in >= 5, 앱 초기화 시 필수 호출 |
| `src/pages/SignIn/SignIn.jsx` | `SignIn` 컴포넌트 | MemberProvider + OpenIdSignInProvider 복합 래핑 |

### 7.2 WARN 대상 (위험 패턴)

| 파일 | 대상 | 경고 이유 |
|------|------|----------|
| `src/utils/api.js` | `reRequestShopApi` | 토큰 갱신 없이 재시도 - 무한 루프 가능성 |
| `src/utils/api.js` | `makeHeaderOption` | accessToken을 모든 요청 헤더에 포함 - 노출 위험 |
| `src/pages/SignIn/SignInForm.jsx` | 비밀번호 필드 | 비밀번호 상태 관리 - XSS 주의 |

### 7.3 NOTE 대상 (컨텍스트 전달)

| 파일 | 대상 | 주석 이유 |
|------|------|----------|
| `src/pages/SignIn/SignIn.jsx` | OpenIdSignInProvider 래핑 | PI_TERMS_MAP 전달 이유 |
| `src/pages/OpenIdCallback/index.js` | SNS 최초 가입 분기 | 추가 정보 입력 조건 |
| `src/hooks/useSmsAuth.js` | 타이머 로직 | 3분 타이머, 1분 재발송 간격 근거 |
| `src/constants/common.js` | SNS 제공자 상수 | KAKAO/NAVER는 NATIVE, GOOGLE/APPLE은 P2 EXTERNAL |

### 7.4 TODO 대상 (미구현)

| 대상 | 내용 |
|------|------|
| Google OAuth Provider | P2 구현 예정 |
| Apple Sign In Provider | P2 구현 예정 |
| Admin 실제 API 연동 | 현재 Mock, 서버 API 확정 후 구현 |

---

## 부록: 기존 컴포넌트 재사용 맵

| 신규 기능 | 재사용 가능 기존 컴포넌트 |
|----------|----------------------|
| SMS 인증 타이머 | `src/components/Timer/index.js` |
| 약관 내용 표시 | `src/components/TermsContent/index.js` |
| 약관 상세 | `src/components/TermsDetail/index.js` |
| 마케팅 수신 동의 | `src/components/MarketingReceiveAgreement/index.js` |
| 비밀번호 변경 | `src/components/PasswordChanger/index.js` |
| 비밀번호 확인 | `src/components/CheckMemberPassword/index.js` |
