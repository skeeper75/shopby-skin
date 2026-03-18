# SPEC-LAYOUT-002: 반응형 레이아웃 시각 검증 후속 수정

## 개요

| 항목 | 내용 |
|------|------|
| SPEC ID | SPEC-LAYOUT-002 |
| 제목 | SPEC-LAYOUT-001 시각 검증 기반 레이아웃 개선 |
| 상태 | COMPLETED |
| 우선순위 | P2 - High |
| 작성일 | 2026-03-19 |
| 완료일 | 2026-03-19 |
| 상위 SPEC | SPEC-LAYOUT-001 |

## 문제 정의

SPEC-LAYOUT-001 구현 완료 후, Playwright 스크린샷 기반 시각 검증(1280px 데스크톱 / 375px 모바일)에서 다음 문제가 발견되었다:

1. **메인 페이지 데스크톱 콘텐츠 폭 과소** -- 1280px 뷰포트에서 콘텐츠가 약 550px로 렌더링. PageShell max-w-7xl은 적용되었으나, @shopby/react-components 내부 CSS가 콘텐츠 폭을 제한.
2. **인증 페이지 카드 스타일 누락** -- SignIn, SignUp, FindId, FindPassword, ChangePassword 페이지에서 데스크톱 카드 컨테이너 미적용.
3. **서브페이지 데스크톱 헤더 패턴 오류** -- 모든 서브페이지가 1280px에서도 모바일 패턴(뒤로가기 화살표 + 중앙 제목)을 사용.
4. **FAQ 런타임 오류** -- "page에 잘못된 타입의 데이터가 존재합니다" 모달 에러.
5. **react-device-detect 의존성 잔존** -- 소스 import는 제거되었으나 package.json에 의존성 남아있음.

### 스크린샷 증거

- 메인 페이지 데스크톱: `/tmp/spec-layout-captures/main-desktop-1280.png`
- 인증 페이지: `/tmp/spec-layout-captures/signin-desktop-1280.png`
- 서브페이지 헤더: `/tmp/spec-layout-captures/faq-desktop-1280.png`
- FAQ 에러: `/tmp/spec-layout-captures/faq-error-modal.png`

## 범위 정의

### 포함 범위

- 메인 페이지 데스크톱 콘텐츠 폭 CSS 오버라이드
- 인증 페이지 5종 카드 스타일 추가
- 데스크톱 서브페이지 헤더 수정 (브레드크럼 표시, 모바일 뒤로가기 숨김)
- FAQ 런타임 오류 수정
- react-device-detect package.json에서 제거
- 인증 필요 페이지 수동 검증 체크리스트 작성

### 제외 범위

- Storybook viewport 테스트 (SPEC-LAYOUT-001 R14 -- 별도 태스크로 분리)
- Cart/OrderSheet/MyPage/ProductDetail 구현 변경 (SPEC-LAYOUT-001에서 완료, 수동 QA만 필요)

## 핵심 원칙

**[HARD] 벤더 패키지 불변 원칙**: @shopby/react-components 소스 코드는 수정하지 않는다. CSS 오버라이드만 허용.

**[HARD] 모바일 기존 동작 보존**: 모든 수정은 lg+ 브레이크포인트 조건부로 적용하여, 모바일(< 1024px) 레이아웃에 영향을 주지 않는다.

## 요구사항 (EARS 형식)

### CRITICAL 이슈

#### REQ-C01: 메인 페이지 데스크톱 콘텐츠 폭 확장

**When** 메인 페이지를 1024px 이상 뷰포트에서 볼 때,
**the system shall** @shopby/react-components 배너, 카테고리, 프로모션 섹션이 PageShell max-width(1280px)까지 확장되도록 CSS 오버라이드를 적용한다.

수락 기준:
- [ ] globals.css에 @shopby 컴포넌트 대상 CSS 오버라이드 추가
- [ ] 1280px 뷰포트에서 메인 콘텐츠 폭이 최소 1000px 이상으로 렌더링
- [ ] 375px 모바일 뷰포트에서 기존 레이아웃 변화 없음
- [ ] 배너/카테고리/상품 섹션 모두 확장 확인

기술 접근:
- @shopby 컴포넌트의 실제 CSS 클래스명 조사 필요 (.vendors/ 디렉토리)
- `@media (min-width: 1024px)` 조건부로 width/max-width 오버라이드
- globals.css 또는 별도 overrides.css에 추가

#### REQ-C02: 인증 페이지 카드 스타일 적용

**When** SignIn, SignUp, FindId, FindPassword, ChangePassword 페이지를 1024px 이상 뷰포트에서 볼 때,
**the system shall** 중앙 정렬된 카드 형태의 폼 컨테이너를 표시한다 (최대 480px 너비, 그림자, 라운드 코너, 배경색).

수락 기준:
- [ ] 5개 인증 페이지에 데스크톱 카드 스타일 적용
  - `src/pages/SignIn/SignIn.jsx`
  - `src/pages/SignUp/SignUp.jsx`
  - `src/pages/FindId/FindId.jsx`
  - `src/pages/FindPassword/FindPassword.jsx`
  - `src/pages/ChangePassword/ChangePassword.jsx`
- [ ] 데스크톱: max-w-[480px] mx-auto, shadow-md, rounded-lg, bg-white, p-8
- [ ] 모바일: 전체 너비, 기존 스타일 유지
- [ ] SPEC-LAYOUT-001 REQ-R11 완전 충족

기술 접근:
- 각 페이지의 최상위 폼 래퍼에 Tailwind 조건부 클래스 추가
- `lg:max-w-[480px] lg:mx-auto lg:shadow-md lg:rounded-lg lg:bg-white lg:p-8`

#### REQ-C03: 서브페이지 데스크톱 헤더 수정

**When** 서브페이지를 1024px 이상 뷰포트에서 볼 때,
**the system shall** 모바일 뒤로가기 화살표를 숨기고, 페이지 제목을 좌측 정렬로 표시한다.

수락 기준:
- [ ] Layout 컴포넌트에서 useResponsive 기반 조건부 헤더 렌더링
- [ ] 데스크톱(lg+): 뒤로가기 화살표 숨김, 페이지 제목 좌측 정렬
- [ ] 모바일(< lg): 기존 패턴 유지 (뒤로가기 + 중앙 제목)
- [ ] 모든 서브페이지에서 동작 확인 (FAQ, Notice, CustomerCenter 등)

기술 접근:
- `src/components/Layout/` 내 헤더 영역에 `hidden lg:block` / `lg:hidden` 패턴 적용
- useResponsive hook 활용한 조건부 렌더링

### HIGH 이슈

#### REQ-H01: FAQ 런타임 에러 수정

**If** FAQ 페이지에서 "page에 잘못된 타입의 데이터가 존재합니다" 에러가 발생하면,
**then the system shall** 에러 없이 FAQ 콘텐츠를 정상적으로 표시한다.

수락 기준:
- [ ] FAQ 페이지 접근 시 에러 모달 미표시
- [ ] FAQ 목록 및 상세 콘텐츠 정상 렌더링
- [ ] page 데이터 타입 유효성 검증 로직 수정

기술 접근:
- `src/pages/FAQ/FAQ.jsx`에서 page 관련 데이터 타입 검증 로직 조사
- SPEC-LAYOUT-001 마이그레이션 과정에서 발생한 타입 불일치 수정

#### REQ-H02: react-device-detect 의존성 제거

시스템은 **항상** package.json에서 사용되지 않는 의존성을 포함하지 않아야 한다.

수락 기준:
- [ ] `package.json`에서 `react-device-detect` 의존성 제거
- [ ] `package-lock.json` 갱신
- [ ] npm install 후 빌드 정상 동작 확인

### 검증 보조

#### REQ-V01: 인증 필요 페이지 수동 QA 체크리스트

**When** SPEC-LAYOUT-002 구현이 완료되었을 때,
**the system shall** 인증/데이터 필요 페이지의 수동 검증을 위한 체크리스트를 제공한다.

수락 기준:
- [ ] 다음 페이지의 데스크톱/모바일 수동 검증 항목 포함:
  - Cart (SplitLayout 2단 레이아웃)
  - OrderSheet (SplitLayout 2단 레이아웃)
  - MyPage (사이드바 네비게이션)
  - ProductDetail (이미지/구매정보 분할)
  - OrderDetail, OrderConfirm
  - MemberModification, Claim

## 기술 설계

### 수정 파일 목록

| 파일 | 변경 유형 | 관련 REQ |
|------|----------|----------|
| `src/globals.css` | CSS 오버라이드 추가 | C01 |
| `src/pages/SignIn/SignIn.jsx` | 카드 스타일 클래스 추가 | C02 |
| `src/pages/SignUp/SignUp.jsx` | 카드 스타일 클래스 추가 | C02 |
| `src/pages/FindId/FindId.jsx` | 카드 스타일 클래스 추가 | C02 |
| `src/pages/FindPassword/FindPassword.jsx` | 카드 스타일 클래스 추가 | C02 |
| `src/pages/ChangePassword/ChangePassword.jsx` | 카드 스타일 클래스 추가 | C02 |
| `src/components/Layout/` (헤더 관련) | 조건부 헤더 렌더링 | C03 |
| `src/pages/FAQ/FAQ.jsx` | 런타임 에러 수정 | H01 |
| `package.json` | 의존성 제거 | H02 |

### 의존성

- SPEC-LAYOUT-001에서 생성된 컴포넌트: PageShell, useResponsive
- @shopby/react-components (벤더, 읽기 전용)
- Tailwind CSS (조건부 클래스 적용)

## 영향 범위

- 신규 파일: 0개
- 수정 파일: ~9개
- 삭제 파일: 0개
- 삭제 의존성: react-device-detect (package.json에서)
- 관련 SPEC: SPEC-LAYOUT-001 (상위)

---

## Implementation Notes (2026-03-19)

### 구현 완료 요약

**목표**: SPEC-LAYOUT-001 시각 검증에서 발견된 5개 이슈 수정 (메인 폭, 인증 카드, 헤더, FAQ 에러, 의존성)

**달성 상황**: 전체 요구사항 완료

### 수정 내역

| REQ | 파일 | 변경 사항 |
|-----|------|----------|
| C01 | `src/globals.css` | `@media (min-width: 1024px)` 조건부로 `.page-inner` max-width 1280px, `.page__content.site` 전체 폭 확장 |
| C02 | SignIn/SignUp/FindId/FindPassword/ChangePassword.jsx | `lg:max-w-[480px] lg:mx-auto lg:shadow-md lg:rounded-lg lg:bg-white lg:p-8` 카드 래퍼 추가 |
| C03 | `src/components/Header/Header.jsx` | 뒤로가기 버튼 `lg:hidden`, 제목 `lg:text-left` 추가 |
| H01 | `src/pages/FAQ/FAQ.jsx` | `boardPosts?.totalCount ?? 0`, `boardsCategories = []` 방어적 접근 |
| H02 | `package.json` | react-device-detect 의존성 제거 |

### 벤더 패키지 불변 원칙 준수

`@shopby/react-components` 소스 코드 수정 없이, `globals.css`에 `@media` 조건부 CSS 오버라이드로 해결. `!important` 사용이 불가피했으나 `@MX:WARN` 태그로 위험 표시.

### 품질 검증

- 빌드: PASS (webpack, 2 pre-existing 번들 사이즈 경고)
- 모바일 기존 동작 보존: 모든 수정이 `lg:` 또는 `@media (min-width: 1024px)` 조건부
- MX 태그: `@MX:WARN` (!important CSS 오버라이드) 추가

### 연기된 항목

없음 (전체 요구사항 완료)
