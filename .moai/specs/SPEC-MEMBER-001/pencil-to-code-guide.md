---
id: SPEC-MEMBER-001
artifact: pencil-to-code-guide
version: "1.0.0"
created: "2026-03-20"
author: MoAI (expert-frontend)
status: draft
---

# Pencil-to-Code Best Practices Guide

> SPEC-MEMBER-001 회원/로그인 도메인 42개 화면을 위한 .pen 디자인-코드 변환 가이드

---

## 1. .pen 파일 구조 - 코드 준비 설계

### 1.1 노드 네이밍 컨벤션

.pen 파일의 모든 노드에 시맨틱 이름을 부여하여 React 컴포넌트 트리와 1:1 매핑한다.

**네이밍 규칙**:

| 접두사 | 용도 | React 매핑 |
|--------|------|------------|
| `SCR-MBR-XXX_` | 화면 최상위 프레임 | 페이지 컴포넌트 |
| `Section:` | 논리적 섹션 | `<section>` 또는 wrapper `<div>` |
| `Group:` | 시각적 그룹 | `<div>`, `<form>`, `<fieldset>` |
| `Comp:` | 재사용 컴포넌트 인스턴스 | 디자인 시스템 컴포넌트 |
| `Text:` | 텍스트 요소 | `<h1>`~`<h6>`, `<p>`, `<span>`, `<label>` |

**SCR-MBR-001 (로그인 페이지) 노드 트리 예시**:

```
Frame: "SCR-MBR-001_LoginPage" (1280x900, fill: --bg-secondary)
  +-- Section: "LoginCard" (max-w: 480, centered)
  |     +-- Group: "HeaderArea"
  |     |     +-- Image: "Logo" (후니프린팅 로고)
  |     |     +-- Text: "PageTitle" -> <h1> "로그인"
  |     +-- Group: "FormArea"
  |     |     +-- Comp: "EmailField" -> <TextField label="이메일" type="email">
  |     |     +-- Comp: "PasswordField" -> <TextField label="비밀번호" type="password">
  |     |     +-- Comp: "AutoLoginCheckbox" -> <Checkbox label="자동 로그인">
  |     +-- Group: "ActionArea"
  |     |     +-- Comp: "LoginButton" -> <Button variant="primary" fullWidth>
  |     +-- Group: "LinkArea"
  |     |     +-- Text: "FindIdLink" -> <a href="/member/find-id">
  |     |     +-- Text: "Divider" -> <span> "|"
  |     |     +-- Text: "FindPwLink" -> <a href="/member/find-password">
  |     |     +-- Text: "Divider" -> <span> "|"
  |     |     +-- Text: "SignUpLink" -> <a href="/member/signup">
  |     +-- Group: "SNSArea"
  |           +-- Text: "SNSDivider" -> "간편 로그인"
  |           +-- Group: "SNSButtons"
  |                 +-- Comp: "KakaoButton" -> <SNSButton provider="kakao">
  |                 +-- Comp: "NaverButton" -> <SNSButton provider="naver">
```

**SCR-MBR-012 (회원가입 정보입력) 노드 트리 예시**:

```
Frame: "SCR-MBR-012_SignUpForm" (1280x1200)
  +-- Section: "StepIndicator" -> Step 2/3 표시
  +-- Section: "FormCard" (max-w: 480, centered)
  |     +-- Group: "EmailGroup"
  |     |     +-- Comp: "EmailField" -> <TextField label="이메일">
  |     |     +-- State: "EmailAvailable" -> 초록 체크 (SCR-MBR-013)
  |     |     +-- State: "EmailDuplicate" -> 빨간 X (SCR-MBR-014)
  |     +-- Group: "PasswordGroup"
  |     |     +-- Comp: "PasswordField" -> <TextField label="비밀번호">
  |     |     +-- Comp: "PasswordStrength" -> <PasswordStrength> (SCR-MBR-018)
  |     |     +-- Comp: "PasswordConfirmField" -> <TextField label="비밀번호 확인">
  |     +-- Group: "NameGroup"
  |     |     +-- Comp: "NameField" -> <TextField label="이름">
  |     +-- Group: "PhoneGroup"
  |     |     +-- Comp: "PhoneField" -> <SmsAuthField> (SCR-MBR-015~017)
  |     +-- Group: "SubmitArea"
  |           +-- Comp: "SubmitButton" -> <Button variant="primary" fullWidth disabled>
```

### 1.2 화면 프레임 사이징 규칙

| 레이아웃 유형 | 프레임 너비 | 프레임 높이 | 적용 화면 |
|--------------|------------|------------|----------|
| 카드 스타일 인증 | 1280px | auto (콘텐츠 기반) | SCR-MBR-001, 003, 005, 008, 009, 011, 012, 019, 021 |
| 마이페이지 | 1280px | auto | SCR-MBR-024~028 |
| 모달 | 480px | auto | SCR-MBR-004, 022, 030, 035~037 |
| 관리자 | 1440px | auto | SCR-MBR-031~042 |

### 1.3 파일 구성 전략

42개 화면을 관리 가능한 .pen 파일로 분할한다.

```
designs/
  member-auth.pen          # SCR-MBR-001~010 (인증 10개 화면)
  member-registration.pen  # SCR-MBR-011~020 (회원가입 10개 화면)
  member-management.pen    # SCR-MBR-021~030 (회원관리 10개 화면)
  member-admin.pen         # SCR-MBR-031~042 (관리자 12개 화면)
  member-components.pen    # 공유 재사용 컴포넌트
```

---

## 2. 디자인 토큰 전략

### 2.1 Pencil set_variables 매핑

Huni Design System 토큰을 Pencil 변수로 등록하고, 이를 CSS 변수 및 코드로 변환한다.

**Color Tokens**:

| Pencil Variable | 값 | CSS Variable | 용도 |
|-----------------|-----|-------------|------|
| `primary` | `#5538B6` | `--primary-color` | 브랜드 주색, CTA 버튼 |
| `primary-dark` | `#3D2A8A` | `--primary-dark` | 호버 상태 |
| `primary-light` | `#F0ECFA` | `--primary-light` | 배경 강조 |
| `error` | `#DC2626` | `--error-color` | 오류 메시지, 유효성 실패 |
| `success` | `#16A34A` | `--success-color` | 성공 상태 (이메일 사용 가능) |
| `warning` | `#F59E0B` | `--warning-color` | 비밀번호 강도 '보통' |
| `text-primary` | `#171717` | `--text-primary` | 본문 텍스트 |
| `text-secondary` | `#525252` | `--text-secondary` | 보조 텍스트 |
| `text-tertiary` | `#A3A3A3` | `--text-tertiary` | 비활성 텍스트 |
| `border` | `#E5E5E5` | `--border-color` | 기본 테두리 |
| `border-error` | `#DC2626` | `--border-error` | 오류 필드 테두리 |
| `border-success` | `#16A34A` | `--border-success` | 성공 필드 테두리 |
| `bg-primary` | `#FFFFFF` | `--bg-primary` | 카드/컨텐츠 배경 |
| `bg-secondary` | `#F5F5F5` | `--bg-secondary` | 페이지 배경 |
| `kakao-yellow` | `#FEE500` | `--kakao-bg` | 카카오 버튼 배경 |
| `naver-green` | `#03C75A` | `--naver-bg` | 네이버 버튼 배경 |

**Typography Tokens**:

| Pencil Variable | 값 | CSS Variable | 용도 |
|-----------------|-----|-------------|------|
| `font-family` | `'Noto Sans KR', sans-serif` | `--font-sans` | 전체 글꼴 |
| `font-h1` | `24px / 700` | `--font-h1` | 페이지 제목 |
| `font-h2` | `20px / 600` | `--font-h2` | 섹션 제목 |
| `font-h3` | `18px / 600` | `--font-h3` | 카드 제목 |
| `font-body` | `14px / 400` | `--font-body` | 본문 텍스트 |
| `font-caption` | `12px / 400` | `--font-caption` | 캡션, 도움말 |
| `font-label` | `14px / 500` | `--font-label` | 입력 필드 라벨 |

**Spacing Tokens (4px 그리드)**:

| Pencil Variable | 값 | 용도 |
|-----------------|-----|------|
| `space-1` | `4px` | 인라인 요소 간격 |
| `space-2` | `8px` | 아이콘-텍스트 간격 |
| `space-3` | `12px` | 필드 내 패딩 |
| `space-4` | `16px` | 섹션 내 간격 |
| `space-6` | `24px` | 그룹 간 간격 |
| `space-8` | `32px` | 섹션 간 간격 |
| `space-12` | `48px` | 페이지 패딩 |

**Component Tokens**:

| Pencil Variable | 값 | 용도 |
|-----------------|-----|------|
| `card-max-width` | `480px` | 인증 카드 최대 너비 |
| `input-height` | `44px` | 입력 필드 높이 |
| `button-height` | `48px` | 버튼 높이 |
| `button-height-sm` | `36px` | 작은 버튼 높이 |
| `radius-sm` | `4px` | 작은 라운딩 |
| `radius-md` | `8px` | 입력 필드, 카드 |
| `radius-lg` | `12px` | 모달, 대형 카드 |
| `radius-full` | `9999px` | 배지, 태그 |

### 2.2 set_variables 호출 예시

```
set_variables({
  "primary": "#5538B6",
  "primary-dark": "#3D2A8A",
  "primary-light": "#F0ECFA",
  "error": "#DC2626",
  "success": "#16A34A",
  "text-primary": "#171717",
  "text-secondary": "#525252",
  "border": "#E5E5E5",
  "bg-primary": "#FFFFFF",
  "bg-secondary": "#F5F5F5",
  "font-family": "'Noto Sans KR', sans-serif",
  "card-max-width": "480px",
  "input-height": "44px",
  "button-height": "48px",
  "radius-md": "8px"
})
```

### 2.3 CSS 변수 출력 (SKIN 모드)

```css
/* src/assets/css/variables.css - SKIN 모드용 */
:root {
  --primary-color: #5538B6;
  --primary-dark: #3D2A8A;
  --primary-light: #F0ECFA;
  --error-color: #DC2626;
  --success-color: #16A34A;
  --warning-color: #F59E0B;
  --text-primary: #171717;
  --text-secondary: #525252;
  --text-tertiary: #A3A3A3;
  --border-color: #E5E5E5;
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --font-sans: 'Noto Sans KR', sans-serif;
  --card-max-width: 480px;
  --input-height: 44px;
  --button-height: 48px;
  --radius-md: 8px;
}
```

---

## 3. 상태 표현 전략

### 3.1 권장 접근: 변이 프레임 그룹 (Option B)

42개 화면 중 State 유형이 9개이므로, 부모 화면 프레임 옆에 State 변이 프레임을 나란히 배치한다.

**구조**:
```
Canvas Layout:
+--------------------+  +--------------------+  +--------------------+
| SCR-MBR-001        |  | SCR-MBR-001        |  | SCR-MBR-001        |
| _LoginPage         |  | _LoginPage_Error   |  | _LoginPage_Locked  |
| [기본 상태]          |  | [로그인 실패]        |  | [계정 잠금]          |
+--------------------+  +--------------------+  +--------------------+
         |                       |                        |
    positionPadding: 100    positionDirection: "right"
```

**네이밍 패턴**: `SCR-MBR-XXX_ScreenName_StateName`

| 기본 화면 | State 변이 | 프레임 이름 |
|----------|----------|------------|
| SCR-MBR-001 로그인 | 로그인 실패 | `SCR-MBR-001_LoginPage_Error` |
| SCR-MBR-001 로그인 | 계정 잠금 | `SCR-MBR-001_LoginPage_Locked` |
| SCR-MBR-012 정보입력 | 이메일 사용 가능 | `SCR-MBR-012_SignUpForm_EmailOk` |
| SCR-MBR-012 정보입력 | 이메일 중복 | `SCR-MBR-012_SignUpForm_EmailDup` |
| SCR-MBR-012 정보입력 | SMS 인증중 | `SCR-MBR-012_SignUpForm_SmsActive` |
| SCR-MBR-012 정보입력 | SMS 인증완료 | `SCR-MBR-012_SignUpForm_SmsOk` |
| SCR-MBR-012 정보입력 | SMS 만료 | `SCR-MBR-012_SignUpForm_SmsExpired` |
| SCR-MBR-012 정보입력 | 폼 오류 | `SCR-MBR-012_SignUpForm_FormError` |
| SCR-MBR-010 링크 만료 | - | `SCR-MBR-009_ResetPw_LinkExpired` |

**장점**:
- batch_get으로 패턴 검색 가능 (`patterns: [{ name: "SCR-MBR-012_" }]`)
- 각 상태를 독립적으로 get_screenshot 가능
- Copy(C) 연산으로 기본 프레임에서 State 프레임을 빠르게 파생 가능
- Git diff에서 상태별 변경 추적 가능

**State 변이 생성 패턴**:
```
// 기본 프레임에서 State 변이 복사
errorState=C("SCR-MBR-001_LoginPage", document, {
  name: "SCR-MBR-001_LoginPage_Error",
  positionDirection: "right",
  positionPadding: 100,
  descendants: {
    "FormArea/ErrorMessage": { content: "이메일 또는 비밀번호가 일치하지 않습니다" }
  }
})
```

### 3.2 State 프레임과 코드 매핑

State 프레임은 코드에서 조건부 렌더링으로 변환된다.

| .pen State 프레임 | React 코드 패턴 |
|------------------|----------------|
| `_Error` 접미사 | `{error && <ErrorMessage>}` |
| `_Loading` 접미사 | `{isLoading && <Spinner>}` |
| `_Disabled` 접미사 | `<Button disabled={true}>` |
| `_Active` 접미사 | `<Input className="border-success">` |

---

## 4. 컴포넌트 라이브러리 전략

### 4.1 member-components.pen 재사용 컴포넌트 목록

| 컴포넌트 ID | 이름 | reusable | 사용 화면 | 코드 매핑 |
|------------|------|----------|----------|----------|
| `CMP-TextField` | TextField | true | 전 화면 | `src/design-system/components/atoms/TextField` |
| `CMP-Button` | Button | true | 전 화면 | `src/design-system/components/atoms/Button` |
| `CMP-Checkbox` | Checkbox | true | SCR-001, 011 | `src/design-system/components/atoms/Checkbox` |
| `CMP-SmsAuthField` | SmsAuthField | true | SCR-012, 003 | `src/components/SmsAuthField/index.js` |
| `CMP-PasswordStrength` | PasswordStrength | true | SCR-012, 009, 027 | `src/components/PasswordStrength/index.js` |
| `CMP-MemberGradeBadge` | MemberGradeBadge | true | SCR-024, 025 | `src/components/MemberGradeBadge/index.js` |
| `CMP-MemberGradeProgress` | MemberGradeProgress | true | SCR-024 | `src/components/MemberGradeProgress/index.js` |
| `CMP-SNSButton` | SNSButton | true | SCR-001 | `src/components/OpenIdSignIn/index.js` |
| `CMP-AuthCard` | AuthCard | true | 인증 전체 | 레이아웃 래퍼 (max-w: 480, centered) |
| `CMP-StepIndicator` | StepIndicator | true | SCR-011, 012, 019 | 회원가입 진행 단계 표시 |
| `CMP-InlineError` | InlineError | true | 전 화면 | 필드 하단 오류 메시지 |
| `CMP-InlineSuccess` | InlineSuccess | true | SCR-013, 016 | 필드 하단 성공 메시지 |
| `CMP-TermsAccordion` | TermsAccordion | true | SCR-011 | 약관 보기 아코디언 |
| `CMP-GradeCompareTable` | GradeCompareTable | true | SCR-025 | 등급 비교표 |

### 4.2 batch_get으로 컴포넌트 추출

```
// 재사용 컴포넌트만 검색
batch_get(
  filePath: "designs/member-components.pen",
  patterns: [{ reusable: true }],
  readDepth: 2,
  searchDepth: 3
)
```

### 4.3 huni-design-system 플러그인과 SSOT 관계

```
SSOT 체인:

huni-design-system 플러그인 (컴포넌트 스펙 원본)
       |
       v
member-components.pen (시각적 인스턴스, 플러그인 스펙 참조)
       |
       v
src/design-system/ (구현 코드, 플러그인 스펙 준수)
```

**규칙**:
- member-components.pen의 컴포넌트는 huni-design-system 플러그인 스펙을 참조하여 생성
- .pen에서 컴포넌트를 재정의하지 않음 (시각적 변이만 허용)
- 신규 컴포넌트가 필요하면 플러그인 스펙에 먼저 추가

---

## 5. 반응형 디자인 전략

### 5.1 권장: PC 기본 + 모바일 주석 (Annotation) 방식

42개 화면 전체를 두 배로 만드는 것은 비효율적이므로, PC 프레임을 기본으로 하고 모바일 변화를 주석으로 기록한다.

**핵심 레이아웃만 모바일 별도 프레임**:

| 화면 유형 | PC 프레임 | 모바일 프레임 | 비고 |
|----------|----------|-------------|------|
| 카드 스타일 인증 | 1280px (카드 480px) | 375px (풀스크린) | 모바일 프레임 필수 |
| 마이페이지 | 1280px (사이드바 + 콘텐츠) | 375px (사이드바 숨김) | 모바일 프레임 필수 |
| 모달 | 480px | 375px (풀스크린 시트) | 주석만 |
| 관리자 | 1440px | 모바일 미지원 | PC 전용 |

**모바일 프레임 네이밍**: `SCR-MBR-XXX_ScreenName_Mobile`

```
Canvas Layout:
+-------- 1280px --------+  +-375px-+
| SCR-MBR-001_LoginPage  |  | SCR-  |
|                         |  | MBR-  |
| [PC 카드 스타일]          |  | 001_  |
|                         |  | Login |
|                         |  | Page_ |
|                         |  | Mobile|
+-------------------------+  +-------+
```

### 5.2 반응형 주석 컨벤션

PC 프레임 내에 Note 노드로 반응형 동작을 문서화한다.

```
Note: "RESPONSIVE"
  - "< 768px: 카드 풀스크린, 패딩 16px"
  - "< 768px: SNS 버튼 세로 배치"
  - "< 768px: 링크 영역 세로 정렬"
```

이 주석은 코드 생성 시 Tailwind 반응형 클래스로 변환된다.

---

## 6. batch_get에서 React/Tailwind 매핑 규칙

### 6.1 레이아웃 속성 매핑

| .pen 노드 속성 | React/CSS 출력 (SKIN) | Tailwind 출력 (Admin) |
|---------------|----------------------|----------------------|
| `layout: "horizontal"` | `display: flex; flex-direction: row` | `flex flex-row` |
| `layout: "vertical"` | `display: flex; flex-direction: column` | `flex flex-col` |
| `gap: 16` | `gap: 16px` | `gap-4` |
| `gap: 12` | `gap: 12px` | `gap-3` |
| `gap: 24` | `gap: 24px` | `gap-6` |
| `padding: 16` | `padding: 16px` | `p-4` |
| `padding: [24, 16]` | `padding: 24px 16px` | `py-6 px-4` |
| `width: "fill_container"` | `width: 100%` | `w-full` |
| `height: "fill_container"` | `height: 100%` | `h-full` |
| `width: 480` | `max-width: 480px` (카드) | `max-w-[480px]` |

### 6.2 시각 속성 매핑

| .pen 노드 속성 | React/CSS 출력 (SKIN) | Tailwind 출력 (Admin) |
|---------------|----------------------|----------------------|
| `fill: "#5538B6"` | `background-color: var(--primary-color)` | `bg-[#5538B6]` 또는 `bg-primary` |
| `fill: "#FFFFFF"` | `background-color: var(--bg-primary)` | `bg-white` |
| `fill: "#F5F5F5"` | `background-color: var(--bg-secondary)` | `bg-neutral-100` |
| `stroke: "#E5E5E5"` | `border: 1px solid var(--border-color)` | `border border-neutral-200` |
| `stroke: "#DC2626"` | `border-color: var(--error-color)` | `border-red-600` |
| `cornerRadius: 8` | `border-radius: var(--radius-md)` | `rounded-lg` |
| `cornerRadius: 4` | `border-radius: var(--radius-sm)` | `rounded` |
| `cornerRadius: 9999` | `border-radius: 9999px` | `rounded-full` |
| `opacity: 0.5` | `opacity: 0.5` | `opacity-50` |

### 6.3 타이포그래피 매핑

| .pen 텍스트 속성 | React/CSS 출력 (SKIN) | Tailwind 출력 (Admin) |
|----------------|----------------------|----------------------|
| `fontSize: 24, fontWeight: 700` | `font-size: 24px; font-weight: 700` | `text-2xl font-bold` |
| `fontSize: 20, fontWeight: 600` | `font-size: 20px; font-weight: 600` | `text-xl font-semibold` |
| `fontSize: 16, fontWeight: 400` | `font-size: 16px` | `text-base` |
| `fontSize: 14, fontWeight: 400` | `font-size: 14px` | `text-sm` |
| `fontSize: 14, fontWeight: 500` | `font-size: 14px; font-weight: 500` | `text-sm font-medium` |
| `fontSize: 12, fontWeight: 400` | `font-size: 12px` | `text-xs` |
| `textColor: "#171717"` | `color: var(--text-primary)` | `text-neutral-900` |
| `textColor: "#525252"` | `color: var(--text-secondary)` | `text-neutral-600` |
| `textColor: "#DC2626"` | `color: var(--error-color)` | `text-red-600` |
| `textColor: "#16A34A"` | `color: var(--success-color)` | `text-green-600` |

### 6.4 SKIN vs Admin 코드 분기

| 대상 | 스타일링 방식 | 파일 위치 |
|------|-------------|----------|
| SKIN 화면 (SCR-MBR-001~030) | Plain CSS + CSS Variables | `src/pages/*/style.css` |
| Admin 화면 (SCR-MBR-031~042) | Tailwind CSS + shadcn/ui | `src/pages/admin/*/` |

SKIN 화면의 코드 생성 시 Tailwind 클래스가 아닌 CSS 변수 기반 스타일시트를 출력한다.

---

## 7. 코드 준비 .pen 파일 품질 체크리스트

### 7.1 구조 검증

- [ ] 모든 노드에 시맨틱 이름 부여 (React 컴포넌트 매핑 가능)
- [ ] 화면 프레임 이름이 `SCR-MBR-XXX_` 패턴 준수
- [ ] State 변이 프레임이 `_StateName` 접미사 사용
- [ ] 컴포넌트 인스턴스가 `Comp:` 접두사 사용
- [ ] 텍스트 노드가 `Text:` 접두사 사용

### 7.2 디자인 토큰 검증

- [ ] 모든 색상이 Pencil 변수 사용 (하드코딩 없음)
- [ ] Primary 컬러가 `#5538B6` (Huni Design System)
- [ ] 폰트 패밀리가 `Noto Sans KR`
- [ ] 간격이 4px 그리드 준수 (4, 8, 12, 16, 24, 32, 48)
- [ ] 입력 필드 높이가 44px, 버튼 높이가 48px

### 7.3 레이아웃 검증

- [ ] 모든 레이아웃에 Auto Layout 사용 (flexbox 매핑 가능)
- [ ] 카드 스타일 인증 페이지 max-width 480px
- [ ] 반응형 주석 또는 모바일 프레임 포함
- [ ] 관리자 화면 1440px 너비
- [ ] gap, padding 값이 토큰과 일치

### 7.4 컴포넌트 검증

- [ ] 재사용 컴포넌트가 member-components.pen에 정의
- [ ] reusable: true 설정
- [ ] huni-design-system 플러그인 스펙과 일치
- [ ] 컴포넌트 계층이 React 컴포넌트 트리 반영

### 7.5 상태/인터랙션 검증

- [ ] 모든 State 유형 화면에 변이 프레임 존재
- [ ] 오류 상태: 빨간 테두리 + 오류 메시지 텍스트
- [ ] 성공 상태: 초록 테두리 + 성공 메시지 텍스트
- [ ] 비활성 상태: opacity 50% 또는 회색 배경
- [ ] 로딩 상태: 스피너 또는 스켈레톤 표시

### 7.6 접근성 검증

- [ ] 인터랙티브 요소에 ARIA 라벨 주석 포함
- [ ] 포커스 순서 주석 (Tab order)
- [ ] 색상 대비 비율 4.5:1 이상 (텍스트)
- [ ] 오류 필드에 `aria-invalid` 주석
- [ ] 필수 필드에 `required` 주석

---

## 8. .pen에서 동작 코드까지 워크플로우

### Step 1: 디자인 토큰 설정

```
// 1-1. 에디터 상태 확인
get_editor_state()

// 1-2. 문서 열기/생성
open_document("designs/member-auth.pen")

// 1-3. 디자인 토큰 등록
set_variables({ ... })  // 섹션 2.2 참조
```

### Step 2: 컴포넌트 라이브러리 구축

```
// 2-1. member-components.pen에 재사용 컴포넌트 생성
open_document("designs/member-components.pen")

// 2-2. batch_design으로 컴포넌트 생성 (reusable: true)
batch_design([
  'textField=I(document, { type: "frame", name: "CMP-TextField", reusable: true, ... })',
  'label=I(textField, { type: "text", name: "Label", ... })',
  'input=I(textField, { type: "frame", name: "InputBox", ... })',
  'error=I(textField, { type: "text", name: "ErrorMessage", ... })'
])

// 2-3. 스크린샷으로 시각 검증
get_screenshot(nodeId: "CMP-TextField")
```

### Step 3: 화면 프레임 디자인

```
// 3-1. 인증 화면 .pen 열기
open_document("designs/member-auth.pen")

// 3-2. 빈 공간 찾기
find_empty_space_on_canvas(direction: "right", width: 1280, height: 900, padding: 100)

// 3-3. batch_design으로 화면 구성 (최대 25개 연산)
batch_design([
  'page=I(document, { type: "frame", name: "SCR-MBR-001_LoginPage", width: 1280, height: 900, ... })',
  'card=I(page, { type: "frame", name: "LoginCard", ... })',
  'header=I(card, { type: "frame", name: "HeaderArea", layout: "vertical", gap: 16 })',
  // ... 25개까지
])

// 3-4. 시각 검증
get_screenshot(nodeId: "SCR-MBR-001_LoginPage")
```

### Step 4: State 변이 생성

```
// 4-1. 기본 프레임 복사하여 State 변이 생성
batch_design([
  'errorState=C("SCR-MBR-001_LoginPage", document, {
    name: "SCR-MBR-001_LoginPage_Error",
    positionDirection: "right",
    positionPadding: 100
  })'
])

// 4-2. State 변이 내부 수정
batch_design([
  'U(errorState+"/FormArea", { ... })',  // 오류 메시지 추가
])

// 4-3. 변이 검증
get_screenshot(nodeId: errorState)
```

### Step 5: 코드 변환

```
// 5-1. 프레임 JSON 구조 추출
batch_get(
  filePath: "designs/member-auth.pen",
  patterns: [{ name: "SCR-MBR-001_LoginPage" }],
  readDepth: 5
)

// 5-2. 디자인 토큰 추출
get_variables(filePath: "designs/member-auth.pen")

// 5-3. 스크린샷으로 디자인 의도 확인
get_screenshot(filePath: "designs/member-auth.pen", nodeId: "SCR-MBR-001_LoginPage")

// 5-4. JSON 구조 분석 후 React 컴포넌트 매핑
//   - 섹션 6의 매핑 규칙 적용
//   - SKIN 화면: CSS 변수 기반 스타일시트
//   - Admin 화면: Tailwind 유틸리티 클래스

// 5-5. 코드 생성 결과와 스크린샷 비교 검증
```

### Step 6: 코드 검증

```
// 6-1. 생성된 코드를 브라우저에서 실행
// 6-2. 스크린샷과 브라우저 출력 비교
// 6-3. 반응형 동작 확인 (768px 이하)
// 6-4. 접근성 검사 (키보드 네비게이션, 스크린 리더)
// 6-5. 인터랙션 검증 (상태 전환, 유효성 검증)
```

---

## 9. 화면별 변환 예시

### 9.1 SCR-MBR-001 로그인 -> React 코드 구조

```
src/pages/SignIn/
  SignIn.jsx              <- SCR-MBR-001_LoginPage 전체
  SignInForm.jsx           <- Group: "FormArea"
  style.css                <- .pen 토큰에서 CSS 변수 생성

사용하는 컴포넌트:
  src/design-system/components/atoms/TextField  <- Comp: "EmailField"
  src/design-system/components/atoms/Button     <- Comp: "LoginButton"
  src/design-system/components/atoms/Checkbox   <- Comp: "AutoLoginCheckbox"
  src/components/OpenIdSignIn/index.js          <- Group: "SNSArea"
```

### 9.2 SCR-MBR-012 회원가입 정보입력 -> React 코드 구조

```
src/pages/SignUp/
  SignUpForm.jsx           <- SCR-MBR-012_SignUpForm 전체
  style.css                <- .pen 토큰에서 CSS 변수 생성

사용하는 컴포넌트:
  src/design-system/components/atoms/TextField  <- 이메일/비밀번호/이름 필드
  src/components/PasswordStrength/index.js      <- Comp: "PasswordStrength"
  src/components/SmsAuthField/index.js          <- Comp: "SmsAuthField"
  src/design-system/components/atoms/Button     <- Comp: "SubmitButton"

State 매핑:
  SCR-MBR-013 (이메일 사용가능) -> emailStatus === 'available' && <InlineSuccess>
  SCR-MBR-014 (이메일 중복)    -> emailStatus === 'duplicate' && <InlineError>
  SCR-MBR-015 (SMS 인증중)    -> smsState === 'pending' && <Timer>
  SCR-MBR-016 (SMS 완료)      -> smsState === 'verified' && disabled
  SCR-MBR-017 (SMS 만료)      -> smsState === 'expired' && <InlineError>
  SCR-MBR-018 (비밀번호 강도)   -> password.length > 0 && <PasswordStrength>
  SCR-MBR-020 (폼 오류)       -> fieldErrors[fieldName] && <InlineError>
```

### 9.3 SCR-MBR-025 등급별 혜택 비교표 -> React 코드 구조

```
src/pages/MyPage/MyGrade/
  index.js                  <- SCR-MBR-025_GradeCompare 전체
  style.css                 <- .pen 토큰에서 CSS 변수 생성

사용하는 컴포넌트:
  src/components/MemberGradeBadge/index.js      <- 각 등급 열의 배지
  src/components/MemberGradeProgress/index.js   <- 현재 등급 하이라이트

테이블 구조 (.pen에서 추출):
  +--------+--------+--------+--------+--------+
  | 항목    | 일반    | 실버   | 골드    | VIP    |
  +--------+--------+--------+--------+--------+
  | 조건    | 기본    | N원    | N원     | N원    |
  | 할인율  | -      | N%     | N%     | N%     |
  | 배송    | 유료    | 유료   | 조건부   | 무료   |
  | 쿠폰    | -      | N원    | N원     | N원    |
  +--------+--------+--------+--------+--------+

현재 등급 열: primary-light 배경 + primary 테두리로 하이라이트
```

---

## 10. 주의사항

### 10.1 Pencil MCP 제약

- .pen 파일은 순수 JSON이다. `pencil.export_to_react()` 같은 내보내기 API는 존재하지 않는다
- 코드 생성은 batch_get으로 JSON 읽기 -> 매핑 규칙 적용 -> 수동 생성의 프롬프트 기반 워크플로우이다
- .pen 파일을 Read/Grep 도구로 직접 읽지 않는다. 반드시 Pencil MCP 도구를 사용한다

### 10.2 SKIN/Admin 이중 스택

- SKIN 화면(SCR-001~030): Plain CSS + CSS Variables (`style.css` per page)
- Admin 화면(SCR-031~042): Tailwind CSS + shadcn/ui 패턴
- 동일 컴포넌트라도 SKIN/Admin에서 스타일링 방식이 다르다
- member-components.pen의 디자인 토큰은 두 스택 모두에 매핑 가능하도록 설계한다

### 10.3 shopby Provider 의존성

- 코드 생성 시 shopby Provider 래핑 구조를 반영해야 한다 (architecture-design.md 섹션 3 참조)
- 예: SignIn.jsx는 반드시 `SignInProvider` + `OpenIdSignInProvider`로 래핑
- .pen 디자인에는 Provider 구조가 표현되지 않으므로, 코드 생성 단계에서 수동 추가한다

### 10.4 기존 컴포넌트 재사용

- 신규 컴포넌트 생성 전 기존 `src/components/` 확인 필수
- Timer, TermsContent, TermsDetail, PasswordChanger, CheckMemberPassword 등 재사용 가능
- .pen에서 이미 존재하는 컴포넌트의 디자인을 새로 만들지 않고 참조만 한다

---

*작성: expert-frontend (MoAI)*
*참조: SPEC-MEMBER-001 screens.md, architecture-design.md*
*참조: pencil-renderer.md, pencil-code.md*
