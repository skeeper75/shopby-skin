# A-1: 로그인/회원 (6 화면)

## 목차

- [SCR-A1-LOGIN: 일반 로그인](#scr-a1-login)
- [SCR-A1-FIND-ID: 아이디 찾기](#scr-a1-find-id)
- [SCR-A1-FIND-PW: 비밀번호 찾기](#scr-a1-find-pw)
- [SCR-A1-SIGNUP: 회원가입](#scr-a1-signup)
- [SCR-A1-SNS-LOGIN: SNS 로그인](#scr-a1-sns-login)
- [SCR-A1-SNS-EXT: SNS 확장](#scr-a1-sns-ext)

---

## SCR-A1-LOGIN

**일반 로그인 | NATIVE | 우선순위 1 | 규모 S**

### 1. 화면 개요

- ID: SCR-A1-LOGIN
- 화면명: 일반 로그인
- 분류: NATIVE (shopby 스킨 구현)
- 우선순위: 1 (필수)
- 규모: S (소형, 3 상태)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│  [← 뒤로]   로그인          │ ← header (48px)
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │   후니프린팅 로고    │   │ ← logo (48px)
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │  아이디              │   │ ← input (44px)
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │  비밀번호      [👁]  │   │ ← input (44px)
│   └─────────────────────┘   │
│   [ ] 로그인 상태 유지      │ ← checkbox
│                             │
│   ┌─────────────────────┐   │
│   │      로그인          │   │ ← CTA (44px, primary)
│   └─────────────────────┘   │
│                             │
│   ─────── 또는 ──────       │ ← divider
│                             │
│   ┌─────────────────────┐   │
│   │  [K] 카카오로 로그인 │   │ ← #FEE500 (44px)
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │  [N] 네이버로 로그인 │   │ ← #03C75A (44px)
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │  [G] Google로 로그인 │   │ ← white+border (44px)
│   └─────────────────────┘   │
│                             │
│   아이디 찾기 · 비밀번호 찾기 · 회원가입 │
└─────────────────────────────┘
```

**데스크탑 (1280px)**
```
┌──────────────────────────────────────────────────────────────┐
│  [로고]         GNB 메뉴                    [장바구니][마이]  │ ← GNB
├──────────────────────────────────────────────────────────────┤
│                                                              │
│              ┌──────────────────────────┐                   │
│              │     후니프린팅 로고       │                   │
│              │                          │                   │
│              │  ┌────────────────────┐  │                   │
│              │  │  아이디            │  │                   │
│              │  └────────────────────┘  │                   │
│              │  ┌────────────────────┐  │                   │
│              │  │  비밀번호   [👁]   │  │                   │
│              │  └────────────────────┘  │                   │
│              │  [ ] 로그인 상태 유지    │  │                   │
│              │  ┌────────────────────┐  │                   │
│              │  │       로그인        │  │  ← maxWidth="lg"  │
│              │  └────────────────────┘  │                   │
│              │  ─────── 또는 ──────    │                   │
│              │  [K카카오][N네이버][G구글]│                   │
│              │  아이디찾기·PW찾기·회원가입│                   │
│              └──────────────────────────┘                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PageShell (maxWidth="lg")
└── LoginCard
    ├── BrandLogo
    ├── LoginForm
    │   ├── TextField (id="username", autoComplete="username")
    │   ├── PasswordField (id="password", toggleVisible)
    │   ├── RememberMeCheckbox
    │   └── SubmitButton ("로그인", variant="primary")
    ├── Divider ("또는")
    └── SNSLoginButtons
        ├── SNSButton (provider="kakao", color="#FEE500")
        ├── SNSButton (provider="naver", color="#03C75A")
        ├── SNSButton (provider="google", variant="outlined")
        └── AuthLinks
            ├── Link → /member/find-id
            ├── Link → /member/find-password
            └── Link → /member/join
```

### 4. Props/States 정의

**LoginForm Props**
- `redirectUrl?: string` — 로그인 후 이동 경로 (기본: `/`)
- `rememberMeDefault?: boolean` — 로그인 유지 기본값

**LoginForm States**
- `username: string` — 아이디 입력값
- `password: string` — 비밀번호 입력값
- `rememberMe: boolean` — 로그인 유지 체크 여부
- `isLoading: boolean` — 로그인 요청 중
- `error: string | null` — 에러 메시지
- `showPassword: boolean` — 비밀번호 표시 토글

**SNSLoginButtons Props**
- `providers: ('kakao' | 'naver' | 'google')[]` — 표시할 SNS 순서
- `redirectUrl?: string` — OAuth 완료 후 이동 경로

### 5. shopby API 매핑

**일반 로그인**
- Method: `POST`
- Path: `/auth/token`
- Auth Level: 인증 불필요
- Request Body:
  - `memberId: string` — 아이디
  - `password: string` — 비밀번호
  - `keepLogin: boolean` — 로그인 유지
- Response Fields:
  - `accessToken: string`
  - `refreshToken: string`
  - `expireIn: number`

**토큰 갱신**
- Method: `PUT`
- Path: `/auth/token`
- Request Body: `{ refreshToken: string }`

### 6. 데이터 플로우

```
사용자 입력 (아이디/비밀번호)
  → LoginForm.handleSubmit()
  → POST /auth/token { memberId, password, keepLogin }
  → 성공: accessToken 저장 (localStorage/sessionStorage)
         → redirectUrl로 이동
  → 실패: error state 설정
         → 에러 메시지 인라인 표시
```

### 7. 인터랙션 상태 (S: 3가지)

- **idle**: 기본 입력 폼 표시, 제출 버튼 활성화
- **loading**: 제출 버튼 스피너 표시, 모든 입력 비활성화
- **error**: 인라인 에러 메시지 표시, 폼 재입력 가능

### 8. 에러 처리

- `INVALID_CREDENTIALS` (401): "아이디 또는 비밀번호가 올바르지 않습니다."
- `ACCOUNT_LOCKED` (423): "계정이 잠겼습니다. 고객센터에 문의하세요."
- `NETWORK_ERROR`: "네트워크 오류가 발생했습니다. 다시 시도해주세요."
- 5회 연속 실패: 잠금 경고 메시지 표시

### 9. 접근성 요구사항

- `<form>` role, `aria-label="로그인 폼"`
- 에러 메시지: `aria-live="polite"`, `role="alert"`
- 비밀번호 토글 버튼: `aria-label="비밀번호 표시/숨기기"`
- 탭 순서: 아이디 → 비밀번호 → 로그인 유지 → 로그인 버튼 → SNS 버튼
- 자동완성: `autoComplete="username"`, `autoComplete="current-password"`
- 엔터 키로 폼 제출 가능

---

## SCR-A1-FIND-ID

**아이디 찾기 | NATIVE | 우선순위 1 | 규모 S**

### 1. 화면 개요

- ID: SCR-A1-FIND-ID
- 화면명: 아이디 찾기
- 분류: NATIVE
- 우선순위: 1 (필수)
- 규모: S (소형, 3 상태)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│  [← 뒤로]   아이디 찾기     │
├─────────────────────────────┤
│                             │
│   이름과 휴대폰 번호로       │
│   가입한 아이디를 찾습니다.  │
│                             │
│   ┌─────────────────────┐   │
│   │  이름                │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │  휴대폰 번호   [인증]│   │ ← 인증 버튼 (44px)
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │  인증번호    [3:00]  │   │ ← countdown
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │    아이디 찾기       │   │ ← CTA (44px, primary)
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │  ← 결과 영역 (성공 시)
│   │  찾은 아이디: hu***  │   │
│   │  [로그인하기]        │   │
│   └─────────────────────┘   │
└─────────────────────────────┘
```

**데스크탑 (1280px)**: PageShell maxWidth="lg" + 카드 중앙 배치 (로그인 화면과 동일 구조)

### 3. 컴포넌트 트리

```
PageShell (maxWidth="lg")
└── FindIdCard
    ├── PageTitle ("아이디 찾기")
    ├── FindIdForm
    │   ├── TextField (name, id="name")
    │   ├── PhoneVerificationField
    │   │   ├── TextField (id="phone")
    │   │   └── Button ("인증번호 발송")
    │   ├── VerificationInput (+ CountdownTimer)
    │   └── SubmitButton ("아이디 찾기")
    └── FindIdResult (조건부 렌더)
        ├── MaskedIdDisplay
        └── LoginButton
```

### 4. Props/States 정의

**States**
- `name: string`, `phone: string`, `verificationCode: string`
- `isCodeSent: boolean` — 인증번호 발송 여부
- `isVerified: boolean` — 인증 완료 여부
- `countdown: number` — 남은 시간(초), 기본 180
- `foundId: string | null` — 찾은 아이디 (마스킹 처리)
- `step: 'input' | 'loading' | 'result' | 'error'`

### 5. shopby API 매핑

**인증번호 발송**
- Method: `POST`
- Path: `/members/find-id`
- Request: `{ name: string, mobileNo: string }`
- Response: `{ verificationId: string }`

**아이디 조회**
- Method: `POST`
- Path: `/members/find-id/verify`
- Request: `{ verificationId, code: string }`
- Response: `{ memberId: string }` — 마스킹된 아이디

### 6. 데이터 플로우

```
이름 + 휴대폰 입력 → [인증번호 발송] 버튼
  → POST /members/find-id
  → 성공: isCodeSent=true, 카운트다운 시작(180초)
  → 인증번호 입력 후 [아이디 찾기]
  → POST /members/find-id/verify
  → 성공: foundId 표시, step='result'
  → 실패: 에러 메시지 표시
```

### 7. 인터랙션 상태 (S: 3가지)

- **input**: 이름/휴대폰 입력 단계, 인증번호 필드 숨김
- **loading**: API 호출 중, 버튼 비활성화
- **result**: 아이디 표시, 로그인 바로가기 버튼 노출

### 8. 에러 처리

- 회원 없음: "입력하신 정보와 일치하는 아이디가 없습니다."
- 인증 시간 초과: "인증 시간이 만료되었습니다. 다시 시도해주세요." + 재발송 버튼
- 인증번호 불일치: "인증번호가 올바르지 않습니다."

### 9. 접근성 요구사항

- 카운트다운: `aria-live="polite"`, `aria-label="인증 만료까지 남은 시간 {n}초"`
- 결과 영역: `aria-live="assertive"` — 아이디 찾기 결과 즉시 안내
- 인증번호 입력: `inputMode="numeric"`, `maxLength={6}`

---

## SCR-A1-FIND-PW

**비밀번호 찾기 | NATIVE | 우선순위 1 | 규모 S**

### 1. 화면 개요

- ID: SCR-A1-FIND-PW
- 화면명: 비밀번호 찾기
- 분류: NATIVE
- 우선순위: 1 (필수)
- 규모: S (소형, 3 상태)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│  [← 뒤로]  비밀번호 찾기    │
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │  아이디              │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │  휴대폰 번호   [인증]│   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │  인증번호    [3:00]  │   │
│   └─────────────────────┘   │
│                             │
│   ── 인증 완료 후 표시 ──    │
│   ┌─────────────────────┐   │
│   │  새 비밀번호   [👁]  │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │  비밀번호 확인 [👁]  │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │   비밀번호 변경      │   │ ← CTA
│   └─────────────────────┘   │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PageShell (maxWidth="lg")
└── FindPwCard
    ├── FindPwForm (step 1: 본인인증)
    │   ├── TextField (id="memberId")
    │   ├── PhoneVerificationField
    │   └── VerificationInput (+ CountdownTimer)
    └── ResetPwForm (step 2: 비밀번호 재설정, 조건부 렌더)
        ├── PasswordField (id="newPassword")
        ├── PasswordField (id="confirmPassword")
        └── SubmitButton ("비밀번호 변경")
```

### 4. Props/States 정의

**States**
- `step: 'verify' | 'reset' | 'done'`
- `memberId, phone, verificationCode: string`
- `resetToken: string | null` — 인증 성공 후 발급
- `newPassword, confirmPassword: string`
- `passwordStrength: 'weak' | 'medium' | 'strong'`

### 5. shopby API 매핑

**본인인증 요청**
- Method: `POST`
- Path: `/members/find-password`
- Request: `{ memberId, mobileNo }`
- Response: `{ verificationId }`

**비밀번호 변경**
- Method: `PUT`
- Path: `/members/password`
- Request: `{ verificationId, code, password: string }`
- Auth Level: 인증 불필요 (토큰 발급 전 단계)

### 6. 데이터 플로우

```
아이디 + 휴대폰 입력 → 인증번호 발송
  → 인증번호 확인 → step='reset', resetToken 저장
  → 새 비밀번호 입력 → PUT /members/password
  → 성공: step='done', 로그인 페이지로 이동 (3초 후)
```

### 7. 인터랙션 상태 (S: 3가지)

- **verify**: 본인인증 단계 (아이디 + 휴대폰 인증)
- **reset**: 비밀번호 재설정 단계 (새 비밀번호 입력)
- **done**: 완료 메시지 + 자동 리다이렉트

### 8. 에러 처리

- 일치 정보 없음: "아이디 또는 휴대폰 번호를 확인해주세요."
- 비밀번호 불일치: "비밀번호가 일치하지 않습니다." (실시간 검증)
- 비밀번호 정책 위반: "영문, 숫자, 특수문자 조합 8자 이상 입력해주세요."

### 9. 접근성 요구사항

- 비밀번호 강도 표시: `aria-label="비밀번호 강도: {strength}"`
- 단계 전환 시: `aria-live="polite"` 안내 메시지
- 비밀번호 확인 실시간 검증: `aria-describedby`로 오류 연결

---

## SCR-A1-SIGNUP

**회원가입 | NATIVE | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-A1-SIGNUP
- 화면명: 회원가입
- 분류: NATIVE
- 우선순위: 1 (필수)
- 규모: M (중형, 4 상태 + 다단계 인터랙션)

### 2. 와이어프레임 레이아웃

**모바일 (375px) — 스텝 구조**
```
┌─────────────────────────────┐
│  [← 뒤로]   회원가입        │
│  ●──●──●  (1/3 약관 동의)   │ ← 스텝 인디케이터
├─────────────────────────────┤
│                             │
│  [STEP 1] 약관 동의          │
│  ┌─────────────────────┐    │
│  │ [✓] 전체 동의        │    │ ← 전체 선택
│  │ ─────────────────── │    │
│  │ [✓] 이용약관 (필수)  │    │
│  │ [✓] 개인정보처리(필수)│   │
│  │ [ ] 마케팅 수신(선택) │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │       다음           │    │ ← CTA (44px)
│  └─────────────────────┘    │
└─────────────────────────────┘

[STEP 2] 정보 입력
┌─────────────────────────────┐
│  ●──●──●  (2/3 정보 입력)   │
│                             │
│  ┌─────────────────────┐    │
│  │  아이디      [중복확인]│   │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  비밀번호            │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  비밀번호 확인       │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  이름                │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  이메일              │    │
│  └─────────────────────┘    │
│  ┌──────────────[인증]──┐   │
│  │  휴대폰 번호          │   │
│  └──────────────────────┘   │
│  ┌─────────────────────┐    │
│  │  인증번호    [3:00]  │    │
│  └─────────────────────┘    │
│                             │
│  [회원 유형]                  │
│  ( ) 일반 회원  (●) B2B 사업자 │
│                             │
│  ── B2B 선택 시 표시 ──      │
│  ┌─────────────────────┐    │
│  │  사업자등록번호      │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  상호명              │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  대표자명            │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │      가입 완료       │    │ ← CTA
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**데스크탑 (1280px)**
```
┌──────────────────────────────────────────────────────────────┐
│  GNB                                                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  회원가입                                             │   │
│  │  ●──────●──────●  1.약관동의 > 2.정보입력 > 3.완료   │   │
│  │                                                      │   │
│  │  [약관 동의 / 정보 입력 폼 — maxWidth="xl"]          │   │
│  │  (데스크탑: 좌우 2컬럼 레이아웃 적용 가능)            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PageShell (maxWidth="xl")
└── SignUpWizard (step: 1 | 2 | 3)
    ├── StepIndicator (currentStep, totalSteps=3)
    │
    ├── [Step 1] TermsAgreement
    │   ├── AllAgreeCheckbox
    │   ├── TermsItem (required: true) "이용약관"
    │   ├── TermsItem (required: true) "개인정보처리방침"
    │   └── TermsItem (required: false) "마케팅 수신 동의"
    │
    ├── [Step 2] SignUpForm (FormLayout)
    │   ├── MemberIdField (+ DuplicateCheckButton)
    │   ├── PasswordField
    │   ├── PasswordConfirmField
    │   ├── NameField
    │   ├── EmailField
    │   ├── PhoneVerification (PhoneField + CountdownTimer)
    │   ├── MemberTypeSelector (일반 | B2B)
    │   └── [B2B] BusinessInfoForm (조건부 렌더)
    │       ├── BusinessNumberField
    │       ├── CompanyNameField
    │       └── CEONameField
    │
    └── [Step 3] SignUpComplete
        ├── SuccessIcon
        ├── WelcomeMessage
        └── LoginButton
```

### 4. Props/States 정의

**SignUpWizard States**
- `step: 1 | 2 | 3` — 현재 단계
- `terms: { service: boolean, privacy: boolean, marketing: boolean }`
- `memberId: string`, `idCheckStatus: 'unchecked' | 'available' | 'taken'`
- `password: string`, `confirmPassword: string`
- `name: string`, `email: string`, `phone: string`
- `isPhoneVerified: boolean`
- `memberType: 'individual' | 'business'`
- `businessInfo: { number: string, companyName: string, ceoName: string } | null`
- `isLoading: boolean`, `errors: Record<string, string>`

### 5. shopby API 매핑

**아이디 중복 확인**
- Method: `GET`
- Path: `/members/id-duplicate-check?memberId={id}`
- Response: `{ duplicated: boolean }`

**휴대폰 인증**
- Method: `POST`
- Path: `/members/sms-auth`
- Request: `{ mobileNo, purpose: 'JOIN' }`

**회원가입**
- Method: `POST`
- Path: `/members`
- Auth Level: 인증 불필요
- Request Body:
  - `memberId, password, memberName, email, mobileNo`
  - `agreements: { service, privacy, marketing }`
  - `memberType: 'INDIVIDUAL' | 'BUSINESS'`
  - `businessInfo?: { businessRegistrationNo, companyName, representativeName }`

### 6. 데이터 플로우

```
[Step 1] 약관 체크 → 필수 동의 확인 → [다음]
  → step=2

[Step 2] 정보 입력
  → 아이디 입력 + [중복확인] → GET /members/id-duplicate-check
  → 휴대폰 [인증] → POST /members/sms-auth → 카운트다운 시작
  → 인증번호 입력 → isPhoneVerified=true
  → 모든 필드 검증 통과 → [가입 완료]
  → POST /members
  → 성공: step=3

[Step 3] 완료 → [로그인하기] → /member/login
```

### 7. 인터랙션 상태 (M: 4가지 + 상세 인터랙션)

- **step1-terms**: 약관 동의 단계, 전체 동의 토글 연동
- **step2-input**: 정보 입력 단계, 실시간 필드 검증
- **step2-loading**: 가입 요청 중, 전체 폼 비활성화
- **step3-complete**: 가입 완료, 환영 메시지

**상세 인터랙션:**
- 전체 동의 체크박스: 개별 항목 모두 체크/해제 연동
- 아이디 중복 확인: 중복 여부에 따라 인라인 녹색/빨간색 표시
- 비밀번호 강도: 입력 중 실시간 강도 바 표시
- B2B 전환: memberType 변경 시 사업자 정보 폼 슬라이드 확장
- 사업자번호: 자동 하이픈 삽입 (000-00-00000 형식)

### 8. 에러 처리

- 아이디 형식 오류: "영문, 숫자 조합 4~16자로 입력해주세요."
- 아이디 중복: "이미 사용 중인 아이디입니다."
- 비밀번호 불일치: "비밀번호가 일치하지 않습니다."
- 휴대폰 인증 미완료: "휴대폰 인증을 완료해주세요."
- 사업자번호 형식 오류: "올바른 사업자등록번호를 입력해주세요."
- 이미 가입된 이메일: "이미 가입된 이메일 주소입니다."

### 9. 접근성 요구사항

- `<form>` 단계별 `aria-label` 변경: "약관 동의", "회원 정보 입력"
- 스텝 인디케이터: `aria-label="3단계 중 {n}단계"`, `aria-current="step"`
- 필수 항목: `aria-required="true"`, 레이블에 "(필수)" 텍스트 포함
- 중복 확인 결과: `aria-live="polite"` 실시간 안내
- 비밀번호: `autoComplete="new-password"`
- B2B 섹션 전환: `aria-expanded`, `aria-controls` 적용
- 모든 터치 타겟: 최소 44×44px 유지

---

## SCR-A1-SNS-LOGIN

**SNS 로그인 | NATIVE | 우선순위 2 | 규모 S**

### 1. 화면 개요

- ID: SCR-A1-SNS-LOGIN
- 화면명: SNS 로그인 처리
- 분류: NATIVE (OAuth 콜백 처리)
- 우선순위: 2
- 규모: S (소형, 3 상태)

### 2. 와이어프레임 레이아웃

**OAuth 콜백 처리 페이지 (모바일/데스크탑 공통)**
```
┌─────────────────────────────┐
│                             │
│      [로딩 스피너]           │
│   카카오 로그인 처리 중...   │
│                             │
└─────────────────────────────┘
```
OAuth 리다이렉트 후 처리 중 상태만 표시. UI 최소화.

### 3. 컴포넌트 트리

```
OAuthCallbackPage
├── LoadingSpinner
├── StatusMessage
└── [오류 시] ErrorCard
    ├── ErrorMessage
    └── RetryButton / LoginButton
```

### 4. Props/States 정의

**States**
- `provider: 'kakao' | 'naver' | 'google'`
- `status: 'processing' | 'success' | 'error' | 'need-signup'`
- `errorCode: string | null`

### 5. shopby API 매핑

**SNS 토큰 교환**
- Method: `POST`
- Path: `/auth/oauth/token`
- Request: `{ provider, code, state, redirectUri }`
- Response:
  - 기존 회원: `{ accessToken, refreshToken }`
  - 신규: `{ needsSignup: true, oauthToken }` → 간편가입 플로우로 이동

### 6. 데이터 플로우

```
SNSButton 클릭
  → OAuth 제공자 인증 페이지로 리다이렉트
  → 사용자 동의 → 콜백 URL로 리다이렉트 (code, state 포함)
  → POST /auth/oauth/token { provider, code }
  → 기존 회원: 토큰 저장 → 메인으로 이동
  → 신규: oauthToken 저장 → SNS 간편가입 (/member/sns-join) 이동
```

### 7. 인터랙션 상태 (S: 3가지)

- **processing**: 스피너 + 처리 중 메시지
- **success**: 짧은 성공 메시지 → 자동 이동
- **error**: 에러 메시지 + 재시도 / 일반 로그인 버튼

### 8. 에러 처리

- 사용자 취소: 로그인 페이지로 조용히 복귀
- 토큰 교환 실패: "로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요."
- `state` 불일치 (CSRF): "보안 오류가 발생했습니다." + 재로그인 유도

### 9. 접근성 요구사항

- 처리 중 상태: `aria-live="polite"`, `aria-busy="true"`
- 오류 시: `aria-live="assertive"`, `role="alert"`

---

## SCR-A1-SNS-EXT

**SNS 확장 (간편가입) | EXTERNAL | 우선순위 3 | 규모 M**

### 1. 화면 개요

- ID: SCR-A1-SNS-EXT
- 화면명: SNS 간편가입 (신규 SNS 연동 회원)
- 분류: EXTERNAL (OAuth 제공자 페이지 포함)
- 우선순위: 3
- 규모: M (중형)

### 2. 와이어프레임 레이아웃

**모바일 (375px) — SNS 간편가입 폼**
```
┌─────────────────────────────┐
│  [← 뒤로]  SNS 간편가입     │
├─────────────────────────────┤
│  카카오 계정으로              │
│  간편하게 가입합니다.         │
│                             │
│  ┌─────────────────────┐    │
│  │  이름          (자동)│    │ ← SNS 프로필에서 가져옴
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  이메일        (자동)│    │
│  └─────────────────────┘    │
│  ┌──────────────[인증]──┐   │
│  │  휴대폰 번호 (필수)   │   │
│  └──────────────────────┘   │
│  ┌─────────────────────┐    │
│  │  인증번호    [3:00]  │    │
│  └─────────────────────┘    │
│                             │
│  약관 동의 (SCR-A1-SIGNUP    │
│           Step 1과 동일)    │
│                             │
│  ┌─────────────────────┐    │
│  │     가입 완료        │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PageShell (maxWidth="lg")
└── SnsSignupCard
    ├── ProviderBadge (provider 아이콘 + 이름)
    ├── SnsSignupForm
    │   ├── TextField (name, prefilled, readonly)
    │   ├── TextField (email, prefilled, readonly)
    │   ├── PhoneVerification
    │   └── TermsAgreement (SCR-A1-SIGNUP Step 1 재사용)
    └── SubmitButton ("가입 완료")
```

### 4. Props/States 정의

**States**
- `oauthToken: string` — 이전 단계에서 전달
- `provider: 'kakao' | 'naver' | 'google'`
- `prefilled: { name, email }` — OAuth 프로필 정보
- `phone: string`, `verificationCode: string`
- `isPhoneVerified: boolean`
- `terms: TermsState`

### 5. shopby API 매핑

**SNS 간편가입**
- Method: `POST`
- Path: `/members/oauth`
- Request:
  - `oauthToken: string`
  - `mobileNo: string`
  - `smsVerificationCode: string`
  - `agreements: TermsAgreements`

### 6. 데이터 플로우

```
oauthToken + 프로필 정보 수신 (이전 단계)
  → 휴대폰 인증 완료
  → 약관 동의 확인
  → POST /members/oauth
  → 성공: accessToken 발급 → 메인으로 이동
```

### 7. 인터랙션 상태 (M: 4가지)

- **input**: 폼 입력 단계
- **verifying**: 휴대폰 인증 카운트다운
- **loading**: 가입 요청 중
- **complete**: 가입 완료 → 자동 이동

### 8. 에러 처리

- oauthToken 만료: "로그인 세션이 만료되었습니다. 다시 시작해주세요." + SNS 로그인 재시도
- 이미 가입된 SNS: "이미 연결된 {provider} 계정입니다. 로그인을 시도해보세요."

### 9. 접근성 요구사항

- 자동 입력 필드: `aria-readonly="true"`, `aria-label="{field} (자동 입력됨)"`
- provider 배지: `aria-label="{provider} 계정으로 가입"`
- SCR-A1-SIGNUP의 약관 동의 컴포넌트 접근성 그대로 상속
