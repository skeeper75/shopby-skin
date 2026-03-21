---
id: SPEC-SKINFIX-001
type: acceptance
tags: [SPEC-SKINFIX-001, acceptance-criteria, design-system, skin-fix]
---

# SPEC-SKINFIX-001: 수락 기준

## Module 0: CSS 변수 정의 복원

### AC-FIX-01: 의미론적 alias 토큰 정의 확인

**Given** `src/design-system/tokens/colors.css`에 alias 토큰이 추가된 상태에서
**When** 빌드를 실행하고 브라우저에서 페이지를 로드할 때
**Then** 다음 CSS 변수가 유효한 값으로 해석되어야 한다:
- `--huni-stroke-default` → `--huni-stroke-neutral-muted`와 동일한 값
- `--huni-fg-default` → `--huni-fg-neutral`과 동일한 값
- `--huni-bg-muted` → `#F9FAFB`
- `--huni-bg-brand-bold` → `--huni-purple-600`과 동일한 값
- `--huni-text-primary` → `--huni-color-text-dark`와 동일한 값

### AC-FIX-02: 축약 alias 토큰 정의 확인

**Given** typography.css, spacing.css, radius.css에 축약 alias가 추가된 상태에서
**When** `--huni-font-size-sm`, `--huni-spacing-md`, `--huni-radius-sm`을 참조할 때
**Then** 대응하는 기존 토큰 값으로 올바르게 해석되어야 한다

### AC-FIX-03: 미정의 변수 제로 확인

**Given** 모든 alias 토큰이 추가된 상태에서
**When** 전체 코드베이스에서 `var(--huni-` 패턴을 검색할 때
**Then** 모든 참조 변수가 토큰 파일에 정의되어 있어야 한다 (미정의 변수 0개)

---

## Module 1: 네비게이션 및 페이지 연결성 복원

### AC-NAV-01: BottomNav 카테고리 링크 동작

**Given** 모바일 뷰포트(375px)에서 사이트를 열었을 때
**When** 하단 네비게이션의 카테고리 아이콘을 클릭하면
**Then** `/products` 페이지로 이동하여 상품 목록이 정상 렌더링되어야 한다 (404 없음)

### AC-NAV-02: Footer 커스텀 링크 존재

**Given** 사이트의 아무 페이지 하단 Footer를 볼 때
**When** Footer 영역을 확인하면
**Then** 다음 링크가 모두 존재하고 클릭 시 해당 페이지로 이동해야 한다:
- 회사소개 → `/about`
- 찾아오시는 길 → `/directions`
- 작업 가이드 → `/guide/work`
- 공지사항 → `/notice`
- FAQ → `/faq`
- 고객센터 → `/customer-center`

### AC-NAV-03: 모바일 메뉴 링크 존재

**Given** 모바일 뷰포트에서 햄버거 메뉴(Sheet)를 열었을 때
**When** 메뉴 항목을 확인하면
**Then** 공지사항, FAQ, 작업 가이드, 회사소개 링크가 존재해야 한다

---

## Module 2: 하드코딩 색상 토큰 마이그레이션

### AC-COLOR-01: 쇼핑몰 페이지 하드코딩 제거

**Given** Module 2 수정이 완료된 상태에서
**When** FAQ, Terms, Reviews, Notice, CustomerCenter, OrderSheet 페이지 코드를 검색할 때
**Then** `#5538B6`, `#424242`, `#979797`, `#F6F6F6`, `#565656`, `#CACACA` 하드코딩이 0건이어야 한다

### AC-COLOR-02: 시각적 일관성 유지

**Given** 하드코딩 색상을 토큰으로 변환한 후
**When** FAQ 페이지를 데스크톱(1280px)과 모바일(375px)에서 볼 때
**Then** 기존과 동일한 시각적 결과를 보여야 한다 (색상값 동일, 레이아웃 변화 없음)

---

## Module 3: PageShell 표준화

### AC-SHELL-01: PageShell 적용 확인

**Given** 모든 대상 페이지에 PageShell이 적용된 상태에서
**When** BulkInquiry, BusinessConsultation, AboutUs, Directions 페이지를 1280px 뷰포트에서 볼 때
**Then** 콘텐츠가 중앙 정렬되고 maxWidth 기준으로 제한되며, 반응형 패딩이 적용되어야 한다

### AC-SHELL-02: 비표준 너비 제거 확인

**Given** PageShell 적용 후
**When** 전체 코드베이스에서 `max-w-[1200px]` 패턴을 검색할 때
**Then** 0건이어야 한다 (모두 PageShell maxWidth prop으로 대체)

---

## Module 4: Tailwind 색상 체계 통일

### AC-THEME-01: primary 색상 통일

**Given** `--point-color`가 `--huni-color-primary`(`#5538B6`)로 오버라이드된 상태에서
**When** Tailwind `text-primary`, `bg-primary` 클래스를 사용하는 요소를 확인할 때
**Then** 모두 Huni 보라색(#5538B6)으로 렌더링되어야 한다 (빨간색 #f92626 아님)

---

## Module 5: Tailwind JIT 패턴 정규화

### AC-JIT-01: var() 래핑 확인

**Given** JIT 패턴 정규화가 완료된 상태에서
**When** 전체 코드베이스에서 `bg-\[--huni-` 패턴(var() 없이)을 검색할 때
**Then** 0건이어야 한다 (모두 `bg-[var(--huni-*)]` 형식으로 변환)

### AC-JIT-02: 빌드 정상 동작

**Given** 모든 Module 수정이 완료된 상태에서
**When** `npm run build`를 실행할 때
**Then** 빌드가 에러 없이 완료되어야 한다

---

## 통합 검증

### AC-INTEG-01: 전체 네비게이션 플로우

**Given** 모든 모듈 수정이 완료된 상태에서
**When** 사용자가 메인 → 카테고리 → 상품상세 → 장바구니 → FAQ → 회사소개 순서로 탐색할 때
**Then** 모든 페이지 간 이동이 정상 동작하고, 디자인이 일관되며, 404가 발생하지 않아야 한다

### AC-INTEG-02: 모바일 탐색 플로우

**Given** 모바일 뷰포트(375px)에서
**When** BottomNav 카테고리 → Sheet 메뉴 FAQ → Footer 고객센터 순서로 탐색할 때
**Then** 모든 링크가 정상 작동하고 레이아웃이 깨지지 않아야 한다
