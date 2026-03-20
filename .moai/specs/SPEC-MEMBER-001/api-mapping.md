# SPEC-MEMBER-001: API Mapping Table

> shopby Enterprise API 및 Provider 매핑 - A1A2-MEMBER 도메인 화면설계 기준 문서
>
> 작성일: 2026-03-20 | 작성: expert-backend (MoAI)

---

## 1. Screen-to-API Matrix

### 1.1 로그인 (SignIn)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-----------------|-------------|--------|-------------|----------|-------------|
| SignIn | 이메일+비밀번호 입력 후 로그인 | `SignInProvider` > `useSignInActionContext().signIn()` | `/auth/token` | POST | `{ memberId, password }` | `{ accessToken, refreshToken, expireIn }` | 401: 이메일/비밀번호 불일치, 423: 계정 잠금 (5회 실패) |
| SignIn | 자동 로그인 체크 후 로그인 | `SignInProvider` > `useSignInActionContext().updateSignInInfo({ keepLogin })` | `/auth/token` | POST | 동일 (keepLogin으로 refreshToken localStorage 저장 여부 결정) | 동일 | 동일 |
| SignIn | 비회원 주문 조회 | `SignInProvider` > `useSignInActionContext().searchGuestOrders()` | `/guest/orders` | GET | `{ orderNo, password, orderRequestType }` (query) | `{ orderInfo, orderProducts }` | 404: 주문번호/비밀번호 불일치 |
| SignIn | 휴면회원 해제 | `SignInProvider` > `useSignInActionContext().reactivateDormantAccount()` | `/members/dormant` | PUT | `{ authType: 'NONE' }` | `{ result: boolean }` | 400: 해제 실패 |
| SignIn | 90일 미변경 비밀번호 변경 | `CheckMemberPasswordProvider` > `PasswordChanger` | `/profile/password` | PUT | `{ currentPassword, newPassword }` | `{ result: boolean }` | 400: 규칙 미충족 |
| Header | 로그아웃 | `MemberProvider` > `useMemberActionContext().logout()` (`useAuthActionContext().signOut()`) | `/auth/token` | DELETE | (없음, Authorization 헤더) | 204 No Content | - |

### 1.2 SNS 로그인 (OpenIdSignIn / OpenIdCallback)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-----------------|-------------|--------|-------------|----------|-------------|
| SignIn | 카카오 버튼 클릭 | `OpenIdSignInProvider` > `useOpenIdSignInActionContext().openIdSignIn({ provider: 'KAKAO' })` | `/auth/openid/KAKAO` | GET | `{ redirectUri }` (query) | `{ redirectUrl }` (카카오 OAuth 페이지) | 500: 설정 오류 |
| SignIn | 네이버 버튼 클릭 | `OpenIdSignInProvider` > `useOpenIdSignInActionContext().openIdSignIn({ provider: 'NAVER' })` | `/auth/openid/NAVER` | GET | `{ redirectUri }` (query) | `{ redirectUrl }` (네이버 OAuth 페이지) | 500: 설정 오류 |
| OpenIdCallback | 카카오/네이버 인증 콜백 | `OpenIdSignInProvider` > `useOpenIdSignInActionContext().postOauthOpenId()` | `/auth/openid/{provider}/callback` | POST | `{ code, redirectUri }` | `{ accessToken, refreshToken, isDormantMember }` | 회원 미등록 시 profileInfo.memberStatus='WAITING' |
| OpenIdCallback | SNS 프로필 조회 | `OpenIdSignInProvider` > `useOpenIdSignInActionContext().getProfile()` | `/auth/openid/profile` | GET | (없음) | `{ memberStatus, oauthIdNo, ordinaryMemberResponse }` | - |
| OpenIdCallback | SNS 최초가입 약관동의 | `OpenIdSignInProvider` > `OpenIdSignUpAgreement` 컴포넌트 | `/members` (회원가입 + OpenID 연동) | POST | `{ agreedTermsNos, mobileNo, memberName }` | `{ accessToken, refreshToken }` | 400: 필수 정보 누락 |
| OpenIdCallback | SNS 카카오싱크 가입 | `OpenIdSignInProvider` > `OpenIdSignUpKakaosync` 컴포넌트 | `/members` (카카오싱크 연동) | POST | 카카오싱크 전용 필드 | `{ accessToken, refreshToken }` | 400: 연동 실패 |
| OpenIdCallback | 기존 계정 OpenID 연동 | `OpenIdSignInProvider` > `useOpenIdSignInActionContext().updateOauthOpenId()` | `/auth/openid/{provider}` (연동 업데이트) | PUT | `{ redirectUri, code, provider, state }` | `{ accessToken }` | 400: 연동 실패 |

### 1.3 아이디 찾기 (FindId)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-----------------|-------------|--------|-------------|----------|-------------|
| FindId (EMAIL 탭) | 이름+이메일로 찾기 | `FindAccountProvider` > `useFindAccountActionContext().findId()` | `/members/id` | POST | `{ findMethod: 'EMAIL', email, memberName }` | `{ memberId, joinYmdt }` | 404: 일치 계정 없음 |
| FindId (SMS 탭) | 이름+휴대전화로 찾기 | `FindAccountProvider` > `useFindAccountActionContext().findId()` | `/members/id` | POST | `{ findMethod: 'SMS', mobileNo, memberName }` | `{ memberId, joinYmdt }` | 404: 일치 계정 없음 |
| FindIdResult | 마스킹 이메일 확인 | (프론트엔드 마스킹 처리) | - | - | - | API 응답의 memberId를 프론트에서 마스킹 표시 | - |
| FindIdResult | 전체 이메일 발송 | `FindAccountProvider` > `useFindAccountActionContext()` | `/members/id/send-email` | POST | `{ memberId, memberName }` | `{ result: boolean }` | 500: 발송 실패 |

### 1.4 비밀번호 찾기 (FindPassword)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-----------------|-------------|--------|-------------|----------|-------------|
| FindPassword (EMAIL 탭) | 아이디로 계정 검색 | `FindAccountProvider` > `useFindAccountActionContext().searchAccount()` | `/members/password` (계정 확인) | GET/POST | `{ memberId }` | `{ result: boolean, authType }` | 404: 계정 없음 |
| FindPassword (SMS 탭) | 휴대전화로 계정 검색 | `FindAccountProvider` > `useFindAccountActionContext().searchAccount()` | `/members/password` | GET/POST | `{ mobileNo, memberName }` | `{ result: boolean }` | 404: 계정 없음 |
| FindPasswordAuthentication | 비밀번호 재설정 이메일 발송 | `AuthenticationProvider` + `FindAccountProvider` | `/members/password/send-email` | POST | `{ memberId, memberName, mobileNo }` | `{ result: boolean }` | 429: 1분 내 재발송 차단 |
| FindPasswordAuthentication | SMS 인증 후 비밀번호 변경 | `AuthenticationProvider` | `/members/password` | PUT | `{ memberId, newPassword, authenticationNumber }` | `{ result: boolean }` | 400: 인증번호 만료/불일치 |

### 1.5 회원가입 (SignUp)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-----------------|-------------|--------|-------------|----------|-------------|
| SignUp (TermsForm) | 약관 목록 조회 | `TermsProvider` > `useTermsActionContext().fetchTerms()` | `/terms` | GET | `{ termsTypes }` (query) | `{ terms: [{ termsNo, title, required, contents }] }` | - |
| SignUp (TermsForm) | 약관 상세 조회 | `TermsProvider` | `/terms/{termsNo}` | GET | - | `{ termsNo, title, contents }` | - |
| SignUp (EmailForm) | 이메일 형식 검증 후 중복확인 | `SignUpProvider` > `useSignUpActionContext().verifyUserEmail()` | `/members/id/exist` | GET | `memberId={email}` (query) | `{ exist: boolean }` | - |
| SignUp (EmailForm) | 이메일 인증번호 발송 | `SignUpProvider` > `useSignUpActionContext().postAuthenticationsEmail()` | `/members/authentication/email` | POST | `{ email }` | `{ result: boolean, expireAt }` | 429: 1분 내 재발송 |
| SignUp (EmailForm) | 이메일 인증번호 확인 | `SignUpProvider` > `useSignUpActionContext().getAuthenticationsEmail()` | `/members/authentication/email/verify` | POST | `{ email, certificatedNumber }` | `{ result: boolean }` | 400: 인증번호 불일치/만료 |
| SignUp (SmsForm) | SMS 인증번호 발송 | `SignUpProvider` > `useSignUpActionContext().postAuthenticationsMobile()` | `/members/authentication/sms` | POST | `{ mobileNo }` | `{ result: boolean, expireAt }` | 429: 1분 내 재발송 |
| SignUp (SmsForm) | SMS 인증번호 확인 | `SignUpProvider` > `useSignUpActionContext().confirmAuthentication()` | `/members/authentication/sms/verify` | POST | `{ mobileNo, authenticationNumber }` | `{ result: boolean, ci }` | 400: 인증번호 불일치/만료 |
| SignUp (SmsForm) | 본인인증(PASS) | `IdentificationVerificationProvider` | `/members/authentication/ci` | POST | PASS 인증 결과 | `{ ci, isCiExist }` | 400: 인증 실패 |
| SignUp (Button) | 회원가입 제출 | `SignUpProvider` > `useSignUpActionContext().postProfile()` | `/members` | POST | `{ memberId, password, memberName, mobileNo, email, agreedTermsNos, customTermsNos, marketingTermsAgreements }` | `{ isSignedUp: boolean }` | 400: 필드 검증 실패, 409: 중복 가입 |

### 1.6 비회원 주문 (GuestOrder)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-----------------|-------------|--------|-------------|----------|-------------|
| GuestOrder | 주문번호+비밀번호로 조회 | 직접 `fetchHttpRequest` 호출 | `/guest/orders` | GET | `{ orderNo, orderPassword }` (query) | `{ orderInfo, orderOptions }` | 404: 주문 없음 |
| GuestOrder | 비회원 토큰 발급 | `GuestOrderProvider` | `/guest/token` | POST | `{ orderNo, mobileNo }` | `{ guestToken }` | 401: 인증 실패 |

### 1.7 토큰 갱신 (공통)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-----------------|-------------|--------|-------------|----------|-------------|
| (전역) | accessToken 만료 시 자동 갱신 | `@shopby/shared` > `memberAuth` | `/oauth2` | PUT | `{ refreshToken }` | `{ accessToken }` | 401: refreshToken 만료 -> 로그인 페이지 이동 |

### 1.8 회원정보수정 / 비밀번호변경 / 탈퇴 (MyPage 연관)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-----------------|-------------|--------|-------------|----------|-------------|
| MemberModification | 비밀번호 확인 (수정 전 인증) | `MyProfileProvider` | `/profile/password/verify` | POST | `{ password }` | `{ result: boolean }` | 401: 비밀번호 불일치 |
| MemberModification | 프로필 조회 | `MyProfileProvider` | `/profile` | GET | (없음) | `{ memberId, memberName, mobileNo, email, grade, ... }` | 401: 미인증 |
| MemberModification | 프로필 수정 | `MyProfileProvider` | `/profile` | PUT | `{ memberName, mobileNo, nickname, birthday, address }` | `{ result: boolean }` | 400: 검증 실패 |
| ChangePassword | 비밀번호 변경 | `ChangePasswordProvider` | `/profile/password` | PUT | `{ currentPassword, newPassword }` | `{ result: boolean }` | 400: 규칙 미충족, 409: 최근 3개 비밀번호 동일 |
| MemberWithdrawal | 탈퇴 전 안내 조회 | `WithdrawalProvider` | `/profile` | GET | (없음) | `{ remainingPoint, remainingCoupon, pendingOrders }` | - |
| MemberWithdrawal | 회원 탈퇴 | `WithdrawalProvider` | `/members` | DELETE | `{ password, reason, detailReason }` | 204 No Content | 400: 미완료 주문 존재, 401: 비밀번호 불일치 |

### 1.9 회원등급 (MyGrade)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-----------------|-------------|--------|-------------|----------|-------------|
| MyGrade | 전체 등급 목록 조회 | `MemberGradeProvider` | `/members/grades` | GET | (없음) | `{ grades: [{ gradeNo, gradeName, accumulationRate, condition }] }` | - |
| MyGrade | 내 현재 등급 조회 | `MemberGradeProvider` | `/profile/grade` | GET | (없음) | `{ gradeName, gradeNo, currentAmount, nextGradeAmount }` | 401: 미인증 |
| MyPage 상단 | 등급 배지 + 프로그레스 표시 | `MemberProvider` 또는 `MemberGradeProvider` | `/profile` | GET | (없음) | 프로필 내 grade 포함 | - |

---

## 2. Provider Usage Map

| Provider 명 | Import 경로 | 사용 화면 | Context Values (State) | Action Methods |
|-------------|------------|----------|----------------------|----------------|
| **MemberProvider** (=AuthProvider 내부) | `@shopby/react-components` | App Root (글로벌 5번째) | `isLogin`, `memberInfo` | `login()`, `logout()` |
| **SignInProvider** | `@shopby/react-components` | SignIn, OpenIdCallback | `signInInfo { memberId, password, keepLogin }`, `guestOrderInfo`, `isDormantMember`, `daysFromLastPasswordChange` | `signIn()`, `updateSignInInfo()`, `searchGuestOrders()`, `reactivateDormantAccount()` |
| **OpenIdSignInProvider** | `@shopby/react-components` | SignIn, OpenIdCallback | `isAgreement`, `isKakaosync`, `profileInfo`, `openIdInfo` | `openIdSignIn()`, `postOauthOpenId()`, `getProfile()`, `setPathToLocalStorage()`, `updateOauthOpenId()`, `updateIsAgreement()`, `updateIsKakaosync()` |
| **SignUpProvider** | `@shopby/react-components` | SignUp | `signUpMemberInfo { memberId, emailId, emailDomain, ... }`, `validationStatus`, `isCertificated`, `isSignedUp`, `timerTime`, `authenticationsRemainTimeBySeconds` | `postProfile()`, `verifyUserEmail()`, `validateEmail()`, `validateMobile()`, `postAuthenticationsEmail()`, `getAuthenticationsEmail()`, `postAuthenticationsMobile()`, `confirmAuthentication()`, `setSignUpMemberInfo()`, `setValidationStatus()` |
| **FindAccountProvider** | `@shopby/react-components` | FindId, FindPassword | `findAccountInfo { memberName, memberId, emailId, emailDomain }`, `isNotExistMemberInfo`, `isFindIdFullModalOpen`, `isFindPasswordFullModalOpen` | `findId()`, `searchAccount()`, `updateFindAccountInfo()`, `setIsFindIdFullModalOpen()`, `setIsFindPasswordFullModalOpen()` |
| **AuthenticationProvider** | `@shopby/react-components` | FindPassword, (SignUp - 인증 시점 설정에 따라) | 인증 상태, 타이머 | SMS 인증 발송/확인, 이메일 인증 |
| **IdentificationVerificationProvider** | `@shopby/react-components` | SignUp (본인인증 시) | `isIdentificationVerificationReSend`, `isCiExist`, `ci` | PASS 본인인증 |
| **AgeVerificationProvider** | `@shopby/react-components` | SignUp | 나이 검증 상태 | 나이 검증 |
| **CustomTermsProvider** | `@shopby/react-components` | SignUp, OpenIdCallback | `agreedAllRequiredTerms`, `agreedTermsNos` | 커스텀 약관 동의 관리 |
| **MarketingReceiveAgreementProvider** | `@shopby/react-components` | SignUp | `agreementTermStatus` | 마케팅 수신 동의 |
| **TermsProvider** | `@shopby/react-components` | App Root (글로벌 6번째) | `terms` | `fetchTerms()` |
| **TabsProvider** | `@shopby/react-components` | FindId, FindPassword | `currentTab`, `tabs` | 탭 전환 |
| **MallProvider** | `@shopby/react-components` | App Root (글로벌 2번째) | `openIdJoinConfig`, `mallName`, `mallJoinConfig`, `memberJoinConfig` | 몰 설정 조회 |
| **CheckMemberPasswordProvider** | `@shopby/react-components` | SignIn (장기 미변경 팝업) | 비밀번호 확인 상태 | 비밀번호 확인 |
| **MyProfileProvider** | `@shopby/react-components` | MemberModification | 프로필 정보 | 프로필 조회/수정 |
| **ChangePasswordProvider** | `@shopby/react-components` | ChangePassword | 변경 상태 | 비밀번호 변경 |
| **WithdrawalProvider** | `@shopby/react-components` | MemberWithdrawal | 탈퇴 상태 | 탈퇴 처리 |
| **MemberGradeProvider** | `@shopby/react-components` | MyGrade | 등급 정보 | 등급 조회 |
| **GuestOrderProvider** | `@shopby/react-components` | GuestOrder | 비회원 주문 상태 | 비회원 주문 조회 |
| **ModalProvider** | `@shopby/react-components` | App Root (글로벌 1번째) | 모달 상태 | `openAlert()`, `openConfirm()` |

---

## 3. Token/Auth Flow

### 3.1 전체 인증 라이프사이클

```
[1] 로그인 요청
    POST /auth/token { memberId, password }
         |
         v
[2] 토큰 발급
    Response: { accessToken (30분), refreshToken, expireIn }
         |
         v
[3] 토큰 저장 (memberAuth.set)
    - accessToken: @shopby/shared memberAuth 내부 관리
    - refreshToken (자동로그인 ON): localStorage
    - refreshToken (자동로그인 OFF): sessionStorage 또는 메모리
         |
         v
[4] API 요청 시 자동 첨부
    src/utils/api.js > makeHeaderOption()
    -> Authorization 헤더에 accessToken 자동 추가
         |
         v
[5] accessToken 만료 (30분 후)
    API 응답 401 Unauthorized
         |
         v
[6] 토큰 자동 갱신
    src/utils/api.js > checkIsUnAuthorizedShopApi() 감지
    PUT /oauth2 { refreshToken }
    -> 새 accessToken 발급
    -> memberAuth.set(newAccessToken)
    -> 원래 요청 재시도
         |
         v
[7] refreshToken도 만료된 경우
    갱신 실패 -> memberAuth.clear()
    -> 로그인 페이지로 리다이렉트
         |
         v
[8] 로그아웃
    DELETE /auth/token
    memberAuth.clear()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    -> 메인 페이지로 리다이렉트
```

### 3.2 토큰 저장 위치 상세

| 토큰 | 저장 위치 | 관리 주체 | 조건 |
|------|----------|----------|------|
| accessToken | `@shopby/shared` `memberAuth` 내부 | SDK 자동 관리 | 항상 |
| refreshToken | `localStorage` | `memberAuth.set()` | 자동로그인(keepLogin) 선택 시 |
| refreshToken | `sessionStorage` 또는 메모리 | `memberAuth.set()` | 자동로그인 미선택 시 |
| guestToken | `sessionStorage` | 직접 관리 | 비회원 주문 조회 시 |

### 3.3 401 인터셉터 현재 구현 (주의사항)

```
src/utils/api.js 구조:

fetchHttpRequest()
  -> fetch(uri, request)
  -> 응답 401 확인: checkIsUnAuthorizedShopApi()
     - PUT oauth2 요청은 제외 (무한 루프 방지)
     - accessToken이 존재하고 shopAPI 요청인 경우만 처리
  -> reRequestShopApi(uri, request)
     [경고] 현재 구현은 토큰 갱신 없이 원본 요청을 단순 재시도
     실제 토큰 갱신은 @shopby/shared의 apiCreator 내부에서 처리되는 것으로 추정
     TAG-001에서 최우선 검증 필요
```

### 3.4 SNS 로그인 토큰 플로우

```
[1] 카카오/네이버 버튼 클릭
    GET /auth/openid/{KAKAO|NAVER}?redirectUri=...
    -> 카카오/네이버 OAuth 페이지로 리다이렉트
         |
         v
[2] 사용자 OAuth 인증 완료
    -> /callback/auth-callback?code=xxx 로 리다이렉트
         |
         v
[3] 콜백 처리 (OpenIdCallbackForm)
    POST /auth/openid/{provider}/callback { code, redirectUri }
         |
         +--> 기존 회원: { accessToken, refreshToken } 발급 -> 메인 이동
         |
         +--> 휴면 회원: isDormantMember=true -> 휴면 해제 확인
         |
         +--> 최초 가입 (WAITING): profileInfo.memberStatus='WAITING'
              -> isKakaosync=true (카카오싱크) 또는 isAgreement=true (일반)
              -> 약관동의 + 추가정보 입력 화면 표시
              -> 가입 완료 시 토큰 발급
```

---

## 4. API Dependencies Between Screens

### 4.1 화면 간 API 의존성 다이어그램

```
MallProvider (앱 시작)
  |-- mallJoinConfig: 로그인 식별자, 인증 방식, openIdJoinConfig
  |-- memberJoinConfig: 필수/선택 필드 설정
  |
  +-> TermsProvider (앱 시작)
  |     |-- terms: 약관 목록 (PI_TERMS_KEYS 기준)
  |     +-> SignUp에서 약관 표시
  |     +-> OpenIdCallback에서 SNS 가입 시 약관 표시
  |
  +-> AuthProvider/MemberProvider (앱 시작)
        |-- isLogin, memberInfo: 인증 상태
        |
        +-> SignInProvider (SignIn 페이지)
        |     |-- signIn() -> POST /auth/token
        |     |-- searchGuestOrders() -> GET /guest/orders
        |     +-> OpenIdSignInProvider (SignIn, OpenIdCallback)
        |           |-- openIdSignIn() -> GET /auth/openid/{provider}
        |           |-- postOauthOpenId() -> POST /auth/openid/{provider}/callback
        |           +-- getProfile() -> GET /auth/openid/profile
        |
        +-> FindAccountProvider (FindId, FindPassword)
        |     |-- findId() -> POST /members/id
        |     |-- searchAccount() -> GET/POST /members/password
        |     +-> AuthenticationProvider (FindPassword)
        |           |-- 이메일 인증 또는 SMS 인증 후 비밀번호 재설정
        |
        +-> SignUpProvider (SignUp)
        |     |-- verifyUserEmail() -> GET /members/id/exist
        |     |-- postAuthenticationsEmail() -> POST /members/authentication/email
        |     |-- postAuthenticationsMobile() -> POST /members/authentication/sms
        |     |-- postProfile() -> POST /members (가입 완료)
        |     +-> IdentificationVerificationProvider (본인인증)
        |     +-> CustomTermsProvider (커스텀 약관)
        |     +-> MarketingReceiveAgreementProvider (마케팅 동의)
        |
        +-> MyProfileProvider (MemberModification)
        |     |-- /profile/password/verify -> 비밀번호 확인
        |     |-- GET /profile -> 프로필 조회
        |     +-- PUT /profile -> 프로필 수정
        |
        +-> ChangePasswordProvider (ChangePassword)
        |     +-- PUT /profile/password -> 비밀번호 변경
        |
        +-> WithdrawalProvider (MemberWithdrawal)
        |     +-- DELETE /members -> 회원 탈퇴
        |
        +-> MemberGradeProvider (MyGrade)
              |-- GET /members/grades -> 등급 목록
              +-- GET /profile/grade -> 내 등급
```

### 4.2 Provider 간 데이터 공유

| 공유 데이터 | 제공 Provider | 소비 화면 | 전달 방식 |
|------------|-------------|----------|----------|
| `terms` | TermsProvider (글로벌) | SignIn, SignUp, OpenIdCallback | `useTermsStateContext()` |
| `PI_TERMS_MAP` | `constants/common.js` 상수 | SignIn, SignUp, OpenIdCallback | Props 전달 |
| `openIdJoinConfig.providers` | MallProvider (글로벌) | SignIn (SNS 버튼 영역) | `useMallStateContext()` |
| `mallJoinConfig` | MallProvider (글로벌) | SignUp (인증 방식/필수필드 결정) | `useMallStateContext()` |
| `memberJoinConfig` | MallProvider (글로벌) | SignUp (필드 필수/선택 설정) | `useMallStateContext()` |
| `isSignedIn()` | AuthProvider (글로벌) | SignIn (이미 로그인 시 리다이렉트) | `useAuthActionContext()` |
| `accessToken` | `@shopby/shared` > `memberAuth` | `src/utils/api.js` (모든 API 요청) | `memberAuth.get()` |

### 4.3 API 호출 순서 제약

| 순서 | 선행 API | 후행 API | 이유 |
|------|---------|---------|------|
| 1 | `initializeShopApi()` (앱 시작) | 모든 shopby API | clientId, baseURL 설정 필수 |
| 2 | `POST /auth/token` (로그인) | `GET /profile`, `PUT /profile`, `DELETE /members` | accessToken 필요 |
| 3 | `GET /members/id/exist` (중복확인) | `POST /members` (가입) | 이메일 중복 사전 확인 필수 |
| 4 | `POST /members/authentication/sms` (발송) | `POST /members/authentication/sms/verify` (확인) | 인증번호 발급 후 확인 |
| 5 | `/profile/password/verify` (비밀번호 확인) | `PUT /profile` (프로필 수정) | 수정 전 본인 인증 |
| 6 | `GET /auth/openid/{provider}` (URL 생성) | OAuth 리다이렉트 -> 콜백 | OpenID 플로우 순서 |
| 7 | `POST /auth/openid/{provider}/callback` (콜백) | `GET /auth/openid/profile` (프로필) | 토큰 발급 후 프로필 조회 |

---

## 5. shopby API Endpoint 종합 목록

| # | Endpoint | Method | 기능 | Provider | Tier |
|---|----------|--------|------|----------|------|
| 1 | `/auth/token` | POST | 로그인 (토큰 발급) | SignInProvider | NATIVE |
| 2 | `/auth/token` | DELETE | 로그아웃 (토큰 삭제) | MemberProvider | NATIVE |
| 3 | `/oauth2` | PUT | accessToken 갱신 | memberAuth (SDK) | NATIVE |
| 4 | `/profile` | GET | 회원 프로필 조회 | MyProfileProvider | NATIVE |
| 5 | `/profile` | PUT | 회원 프로필 수정 | MyProfileProvider | NATIVE |
| 6 | `/profile/password` | PUT | 비밀번호 변경 | ChangePasswordProvider | NATIVE |
| 7 | `/profile/password/verify` | POST | 비밀번호 확인 (본인인증) | MyProfileProvider | NATIVE |
| 8 | `/profile/grade` | GET | 내 회원등급 조회 | MemberGradeProvider | NATIVE |
| 9 | `/members` | POST | 회원가입 | SignUpProvider | NATIVE |
| 10 | `/members` | DELETE | 회원탈퇴 | WithdrawalProvider | NATIVE |
| 11 | `/members/id` | POST | 아이디(이메일) 찾기 | FindAccountProvider | NATIVE |
| 12 | `/members/id/exist` | GET | 이메일 중복 확인 | SignUpProvider | NATIVE |
| 13 | `/members/id/send-email` | POST | 아이디 이메일 발송 | FindAccountProvider | NATIVE |
| 14 | `/members/password` | PUT | 비밀번호 재설정 | FindAccountProvider | NATIVE |
| 15 | `/members/password/send-email` | POST | 비밀번호 재설정 이메일 발송 | FindAccountProvider | NATIVE |
| 16 | `/members/authentication/sms` | POST | SMS 인증번호 발송 | SignUpProvider | NATIVE |
| 17 | `/members/authentication/sms/verify` | POST | SMS 인증번호 확인 | SignUpProvider | NATIVE |
| 18 | `/members/authentication/email` | POST | 이메일 인증번호 발송 | SignUpProvider | NATIVE |
| 19 | `/members/authentication/email/verify` | POST | 이메일 인증번호 확인 | SignUpProvider | NATIVE |
| 20 | `/members/authentication/ci` | POST | 본인인증(PASS) | IdentificationVerificationProvider | NATIVE |
| 21 | `/members/grades` | GET | 회원등급 목록 | MemberGradeProvider | NATIVE |
| 22 | `/members/dormant` | PUT | 휴면회원 해제 | SignInProvider | NATIVE |
| 23 | `/auth/openid/{provider}` | GET | SNS OAuth URL 생성 | OpenIdSignInProvider | NATIVE |
| 24 | `/auth/openid/{provider}/callback` | POST | SNS OAuth 콜백 처리 | OpenIdSignInProvider | NATIVE |
| 25 | `/auth/openid/profile` | GET | SNS 프로필 조회 | OpenIdSignInProvider | NATIVE |
| 26 | `/terms` | GET | 약관 목록 조회 | TermsProvider | NATIVE |
| 27 | `/terms/{termsNo}` | GET | 약관 상세 조회 | TermsProvider | NATIVE |
| 28 | `/guest/orders` | GET | 비회원 주문 조회 | GuestOrderProvider / fetchHttpRequest | NATIVE |
| 29 | `/guest/orders` | POST | 비회원 주문 생성 | GuestOrderProvider | NATIVE |
| 30 | `/guest/token` | POST | 비회원 토큰 발급 | GuestOrderProvider | NATIVE |

---

## 6. fetchHttpRequest 직접 호출 패턴

Provider가 아닌 `fetchHttpRequest`를 직접 호출하는 케이스:

| 파일 | 호출 방식 | API | 이유 |
|------|----------|-----|------|
| `src/pages/GuestOrder/GuestOrderForm.jsx` | `fetchHttpRequest({ url: 'guest/orders', ... })` | 비회원 주문 조회 | 커스텀 UI로 직접 호출 |
| `src/pages/Reviews/index.jsx` | `fetchHttpRequest({ url: 'products/...', ... })` | 리뷰 조회 | Provider 미사용 |
| `src/components/InquiryForm/index.jsx` | `fetchHttpRequest({ url: '...', method: POST })` | 문의 등록 | 직접 호출 |
| `src/pages/FAQ/FAQ.jsx` | `fetchHttpRequest({ url: 'boards/...', ... })` | FAQ 조회 | 직접 호출 |

회원 도메인에서는 대부분 Provider를 통해 API를 호출하며, `fetchHttpRequest` 직접 호출은 비회원 주문 조회 등 제한적 경우에만 사용.

---

## 7. 관리자 API (P2 - Admin Operations)

shopby Admin API는 현재 Mock 체계. 실제 연동 시 `fetchHttpRequest` 사용 예정.

| 기능 | Endpoint (예상) | Method | 현재 상태 |
|------|----------------|--------|----------|
| 회원 목록 조회 | `/admin/members` | GET | Mock (src/services/admin/member.js) |
| 회원 상세 조회 | `/admin/members/{id}` | GET | Mock |
| 탈퇴회원 목록 | `/admin/members/withdrawn` | GET | Mock |
| 프린팅머니 지급 | `/admin/members/{id}/printing-money` | POST | Mock |
| 회원 상태 변경 | `/admin/members/{id}/status` | PUT | Mock |
| 쿠폰 목록 조회 | `/admin/coupons` | GET | Mock (src/services/admin/coupon.js) |
| 쿠폰 생성 | `/admin/coupons` | POST | Mock |
| 쿠폰 발급 | `/admin/coupons/{id}/issue` | POST | Mock |
| 등급 관리 | `/admin/members/grades` | GET/POST/PUT | Mock |

---

*문서 작성: expert-backend (MoAI)*
*참조: SPEC-MEMBER-001/spec.md, architecture-design.md, research-shopby-auth.md*
*코드베이스: src/pages/SignIn, SignUp, FindId, FindPassword, OpenIdCallback, GuestOrder, src/utils/api.js*
