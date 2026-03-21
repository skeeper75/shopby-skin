---
id: SPEC-SKINFIX-001
version: "1.0.0"
status: draft
created: "2026-03-19"
updated: "2026-03-19"
author: MoAI
priority: P1
issue_number: 0
tags: [SPEC-SKINFIX-001, design-system, skin-fix, token-alignment, navigation]
related_specs: [SPEC-DESIGN-001, SPEC-LAYOUT-001, SPEC-LAYOUT-002]
---

# SPEC-SKINFIX-001: 후니프린팅 스킨 디자인 시스템 정합성 복원

## 1. 개요

후니프린팅 shopby Aurora 스킨의 디자인 시스템 기본 원칙 위반 사항을 수정한다. 디자인 토큰이 정의되어 있으나 실제 페이지 코드가 이를 올바르게 참조하지 않아 **디자인이 깨지고, 페이지 간 연결이 끊어져 있는 문제**를 해결한다.

### 범위 요약

| 모듈 | 수정 대상 | 파일 수 |
|------|----------|---------|
| Module 0 | CSS 변수 alias 정의 복원 | 1~2 파일 (토큰) |
| Module 1 | 네비게이션 및 페이지 연결 | 3~4 파일 |
| Module 2 | 하드코딩 색상 → 토큰 전환 | 17 페이지 |
| Module 3 | PageShell 표준 적용 | ~22 페이지 |
| Module 4 | Tailwind 색상 체계 통일 | 1 파일 (config) + 전역 |
| Module 5 | Tailwind JIT 패턴 정규화 | 47 파일 |
| **합계** | | **~90 파일** |

### 핵심 원칙

#### [HARD] 디자인 토큰 참조 원칙
시스템은 **항상** `src/design-system/tokens/`에 정의된 CSS 변수만 참조해야 한다. 코드에서 사용하는 모든 `--huni-*` 변수는 토큰 파일에 정의가 존재해야 한다.

#### [HARD] 하드코딩 색상 금지
시스템은 **절대** 페이지 코드에서 hex 색상값(`#5538B6`, `#424242` 등)을 직접 사용하지 않는다. 반드시 `--huni-*` 토큰을 참조한다.

#### [HARD] PageShell 컨테이너 필수
시스템은 **항상** 모든 쇼핑몰 콘텐츠 페이지에서 `PageShell` 컴포넌트를 최상위 컨테이너로 사용한다.

#### [HARD] 네비게이션 경로 일치
시스템은 **항상** Header, BottomNav, Footer, Sheet 메뉴의 링크 경로가 라우터 정의와 일치해야 한다.

### 참조 문서

- `research.md`: 전수 감사 결과, 근본 원인 분석
- SPEC-LAYOUT-001/002: 반응형 레이아웃 시스템 (COMPLETED)
- SPEC-DESIGN-001: 디자인 시스템 확장 (DRAFT, 본 SPEC 이후 실행)

---

## 2. 요구사항

### Module 0: CSS 변수 정의 복원 (P0 Critical)

> 전수 감사 결과 23개 이상의 CSS 변수가 코드에서 사용되지만 토큰 파일에 정의되지 않아 스타일이 적용되지 않음

#### REQ-FIX-01: 의미론적 alias 토큰 추가

**WHEN** 코드에서 `--huni-stroke-default`, `--huni-fg-default`, `--huni-bg-muted` 등 미정의 변수를 참조할 때 **THEN** `src/design-system/tokens/colors.css`에 alias 정의를 추가하여 기존 토큰으로 매핑해야 한다.

추가할 alias:

| alias 변수 | 매핑 대상 |
|-----------|----------|
| `--huni-stroke-default` | `var(--huni-stroke-neutral-muted)` |
| `--huni-fg-default` | `var(--huni-fg-neutral)` |
| `--huni-fg-muted` | `var(--huni-fg-neutral-subtle)` |
| `--huni-fg-error` | `var(--huni-fg-critical)` |
| `--huni-bg-surface` | `var(--huni-bg-layer-default)` |
| `--huni-bg-muted` | `#F9FAFB` |
| `--huni-bg-hover` | `var(--huni-purple-50)` |
| `--huni-bg-brand-bold` | `var(--huni-purple-600)` |
| `--huni-text-primary` | `var(--huni-color-text-dark)` |
| `--huni-text-secondary` | `var(--huni-color-text-medium)` |
| `--huni-text-muted` | `var(--huni-color-text-muted)` |
| `--huni-border-subtle` | `var(--huni-stroke-neutral-weak)` |
| `--huni-color-error` | `var(--huni-fg-critical)` |

#### REQ-FIX-02: 축약 alias 토큰 추가

**WHEN** 코드에서 `--huni-font-size-*`, `--huni-spacing-*`, `--huni-radius-*` 등 축약형 변수를 참조할 때 **THEN** 해당 토큰 파일에 축약 alias를 추가해야 한다.

추가 위치:
- `typography.css`: `--huni-font-size-xs` ~ `--huni-font-size-xl`, `--huni-font-weight-semibold`
- `spacing.css`: `--huni-spacing-xs` ~ `--huni-spacing-xl`
- `radius.css`: `--huni-radius-xs` ~ `--huni-radius-md`

---

### Module 1: 네비게이션 및 페이지 연결성 복원 (P0~P1)

#### REQ-NAV-01: BottomNav 카테고리 링크 수정

**WHEN** 모바일 하단 네비게이션의 카테고리 버튼을 클릭할 때 **THEN** 상품 목록 페이지(`/products`)로 이동해야 한다.

수정: `src/components/BottomNav/BottomNav.jsx`
- 현재: `/display-category-list` (라우터 미등록 → 404)
- 변경: `/products` (라우터 등록 경로)

#### REQ-NAV-02: Footer 커스텀 링크 추가

**WHEN** Footer를 렌더링할 때 **THEN** 다음 커스텀 페이지 링크를 포함해야 한다:

| 링크 텍스트 | 경로 | 그룹 |
|-----------|------|------|
| 회사소개 | `/about` | 회사 정보 |
| 찾아오시는 길 | `/directions` | 회사 정보 |
| 작업 가이드 | `/guide/work` | 고객 지원 |
| 공지사항 | `/notice` | 고객 지원 |
| FAQ | `/faq` | 고객 지원 |
| 고객센터 | `/customer-center` | 고객 지원 |
| 대량주문 문의 | `/bulk-inquiry` | 주문 지원 |

#### REQ-NAV-03: 모바일 메뉴 링크 보강

**WHEN** 모바일 Sheet 메뉴를 열 때 **THEN** 주요 서비스 페이지로의 링크를 제공해야 한다:

추가 링크: 공지사항(`/notice`), FAQ(`/faq`), 작업 가이드(`/guide/work`), 회사소개(`/about`)

---

### Module 2: 하드코딩 색상 토큰 마이그레이션 (P1 High)

#### REQ-COLOR-01: 쇼핑몰 페이지 토큰 전환

**WHEN** 쇼핑몰 페이지 코드에서 hex 색상이 발견되면 **THEN** 대응하는 `--huni-*` 토큰으로 변환해야 한다.

변환 규칙:

| 하드코딩 | Tailwind 토큰 클래스 |
|---------|---------------------|
| `#5538B6` | `text-[var(--huni-color-primary)]` 또는 `text-huni-primary` |
| `#424242` | `text-[var(--huni-color-text-dark)]` |
| `#979797` | `text-[var(--huni-color-text-muted)]` |
| `#F6F6F6` | `bg-[var(--huni-color-bg-section)]` |
| `#565656` | `text-[var(--huni-color-text-medium)]` |
| `#CACACA` | `border-[var(--huni-color-border-default)]` |
| `#EEEBF9` | `bg-[var(--huni-color-primary-light-3)]` |

대상 파일: FAQ.jsx, Terms/index.jsx, Reviews/index.jsx, Notice.jsx, CustomerCenter.jsx, OrderSheet.jsx 등 17개

#### REQ-COLOR-02: 관리자 페이지 토큰 전환

**WHEN** 관리자 페이지에서 인라인 스타일로 색상이 하드코딩되면 **THEN** `--huni-*` 토큰으로 변환해야 한다.

우선 대상: MemberDetailDrawer, BoardList, QuickReplyPanel, MemberPage, ActivityTimeline 등 주요 관리자 컴포넌트

---

### Module 3: PageShell 표준화 (P1 High)

#### REQ-SHELL-01: 미채택 페이지 PageShell 적용

**WHEN** 쇼핑몰 콘텐츠 페이지가 PageShell 없이 렌더링될 때 **THEN** PageShell로 감싸서 표준 레이아웃을 적용해야 한다.

대상 페이지 및 권장 maxWidth:

| 페이지 | 현재 패턴 | 권장 maxWidth |
|--------|----------|-------------|
| BulkInquiry | `max-w-[1200px]` | `xl` (1280px) |
| BusinessConsultation | `max-w-[1200px]` | `xl` |
| DesignConsultation | 인라인 max-w | `xl` |
| AboutUs | 인라인 max-w | `7xl` |
| Directions | `max-w-[1200px]` | `xl` |
| WorkGuide | `max-w-[1200px]` | `7xl` |
| ExperienceGroup | `max-w-[1200px]` | `xl` |
| MemberModification | Plain CSS 혼재 | `4xl` |

#### REQ-SHELL-02: 비표준 너비 클래스 제거

**WHEN** PageShell 적용 후 **THEN** 기존 인라인 `max-w-[숫자px]` 클래스를 제거해야 한다.

---

### Module 4: Tailwind 색상 체계 통일 (P2 Medium)

#### REQ-THEME-01: shopby point-color 오버라이드

**WHEN** shopby Aurora 스킨이 로드될 때 **THEN** `--point-color` CSS 변수를 Huni 브랜드 보라색(`#5538B6`)으로 오버라이드하여 Tailwind `primary` 색상을 통일해야 한다.

수정: `src/globals.css` 또는 `src/design-system/tokens/colors.css`의 `:root`에 추가:
```
--point-color: var(--huni-color-primary);
```

이렇게 하면 Tailwind `text-primary`, `bg-primary` 등이 Huni 보라색으로 통일됨.

---

### Module 5: Tailwind JIT 패턴 정규화 (P2 Medium)

#### REQ-JIT-01: var() 래핑 표준화

**WHEN** Tailwind 클래스에서 CSS 변수를 참조할 때 **THEN** `bg-[var(--huni-*)]` 형식(var() 포함)을 사용해야 한다.

현재 위험 패턴: `bg-[--huni-bg-muted]` (var() 없이) → 47개 파일
변경 대상: `bg-[var(--huni-bg-muted)]` 형식으로 통일

---

## 3. 실행 순서

| 순서 | 모듈 | 위험도 | 의존성 |
|------|------|--------|--------|
| 1 | Module 0: CSS 변수 alias | 낮음 | 없음 (토큰 파일만 수정) |
| 2 | Module 4: 색상 체계 통일 | 낮음 | Module 0 이후 |
| 3 | Module 1: 네비게이션 수정 | 낮음 | 없음 |
| 4 | Module 3: PageShell 적용 | 중간 | Module 0 이후 |
| 5 | Module 2: 하드코딩 색상 전환 | 중간 | Module 0 이후 |
| 6 | Module 5: JIT 패턴 정규화 | 낮음 | Module 0 이후 |

---

## 4. 추적성

| 태그 | 대상 |
|------|------|
| SPEC-SKINFIX-001 | 본 스킨 정합성 복원 SPEC |
| SPEC-DESIGN-001 | 디자인 시스템 확장 (본 SPEC 이후 실행) |
| SPEC-LAYOUT-001 | 반응형 레이아웃 시스템 (완료, PageShell 생성) |
| SPEC-LAYOUT-002 | 시각 검증 후속 수정 (완료) |

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-03-19 | 1.0.0 | 초안 작성 - 6개 모듈, 90+ 파일 수정 범위 |
