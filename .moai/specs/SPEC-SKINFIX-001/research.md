---
id: SPEC-SKINFIX-001
type: research
tags: [SPEC-SKINFIX-001, design-system, skin-fix, token-alignment, navigation, page-connectivity]
---

# SPEC-SKINFIX-001: 스킨 정합성 복원 리서치

## 1. 진단 개요

후니프린팅 shopby Aurora 스킨(huniprinting48.shopby.co.kr)의 전수 감사 결과, 디자인 시스템의 기본 원칙이 지켜지지 않고 있음을 확인. 3가지 레이어 간 정합성 불일치가 근본 원인.

```
[Layer 1] shopby Aurora 기본 스킨 (벤더 CSS)
    ↕ CSS 우선순위 충돌
[Layer 2] Huni 디자인 토큰 시스템 (--huni-* 정의)
    ↕ 참조 불일치
[Layer 3] 실제 페이지 구현 코드 (사용처)
```

### 문제 분류

| 심각도 | 문제 | 파일 수 | 영향 |
|--------|------|---------|------|
| P0 Critical | CSS 변수 미정의 (사용하지만 정의 없음) | 55+ 사용처 | 스타일 적용 안 됨 → 디자인 깨짐 |
| P0 Critical | 모바일 네비게이션 링크 404 | 1 파일 | 카테고리 접근 불가 |
| P1 High | 하드코딩 색상 (토큰 미사용) | 17 페이지 | 브랜드 일관성 파괴 |
| P1 High | PageShell 미채택 51% | 22 페이지 | 너비/패딩 불일치 |
| P2 Medium | 이중 색상 체계 (shopby red vs Huni purple) | 전역 | 브랜드 혼란 |
| P2 Medium | Tailwind JIT 위험 패턴 | 47 파일 | 잠재적 스타일 누락 |
| P2 Medium | 페이지 발견성 부족 (Footer/메뉴 링크 누락) | 10+ 페이지 | 사용자 접근 불가 |

---

## 2. 상세 분석

### 2.1 CSS 변수 미정의 (P0 Critical)

코드에서 사용되지만 `src/design-system/tokens/colors.css`에 정의되지 않은 변수. 런타임에 fallback 없이 스타일이 적용되지 않아 디자인이 깨지는 직접적 원인.

**Group A: 즉시 alias 가능 (기존 토큰으로 매핑)**

| 미정의 변수 | 사용 파일 수 | 매핑 대상 (정의됨) |
|-----------|-----------|------------------|
| `--huni-stroke-default` | 15+ | `--huni-stroke-neutral-muted` |
| `--huni-fg-default` | 12+ | `--huni-fg-neutral` |
| `--huni-fg-muted` | 12+ | `--huni-fg-neutral-subtle` |
| `--huni-fg-error` | 6+ | `--huni-fg-critical` |
| `--huni-bg-surface` | 12+ | `--huni-bg-layer-default` |
| `--huni-text-primary` | 15+ | `--huni-color-text-dark` |
| `--huni-text-secondary` | 15+ | `--huni-color-text-medium` |
| `--huni-text-muted` | 20+ | `--huni-color-text-muted` |
| `--huni-border-subtle` | 2 | `--huni-stroke-neutral-weak` |
| `--huni-color-error` | 8+ | `--huni-fg-critical` |

**Group B: 신규 정의 필요**

| 미정의 변수 | 사용 파일 수 | 권장 값 |
|-----------|-----------|--------|
| `--huni-bg-muted` | 17+ | `#F9FAFB` (gray-50 계열) |
| `--huni-bg-hover` | 2 | `var(--huni-purple-50)` |
| `--huni-bg-brand-bold` | 8+ | `var(--huni-purple-600)` |

**Group C: 축약 alias 필요 (크기/간격/반경)**

| 패턴 | 사용 파일 수 | 매핑 방식 |
|------|-----------|----------|
| `--huni-font-size-xs~xl` | 20~30+ | `--huni-typo-size-t1~t6` alias |
| `--huni-font-weight-semibold` | 10+ | `--huni-typo-weight-medium` alias |
| `--huni-spacing-xs~xl` | 15~30+ | `--huni-space-1~8` alias |
| `--huni-radius-xs~md` | 5~40+ | `--huni-radius-0_5~2` alias |

**주요 영향 파일**:
- `src/pages/Cart/index.jsx`: 라인 23, 65, 72, 227, 293, 328
- `src/pages/admin/vendor/VendorDetailPage.jsx`: 라인 64, 73, 77, 93, 106, 113, 135, 136
- `src/design-system/components/molecules/CTAButton.jsx`: `--huni-bg-brand-solid` 참조

### 2.2 네비게이션 및 페이지 연결성 (P0~P2)

**P0: BottomNav 카테고리 링크 404**
- 파일: `src/components/BottomNav/BottomNav.jsx`
- 현재: 카테고리 버튼 → `/display-category-list`
- 라우터: `/products` 또는 `/display/:sectionsId`로 등록
- 결과: 모바일에서 카테고리 클릭 시 404 (NotFound)

**P1: Footer 링크 부족**
- 현재: shopby 기본 약관 링크만 (이용약관, 개인정보처리방침, 이용안내)
- 누락: FAQ(`/faq`), 공지사항(`/notice`), 고객센터(`/customer-center`), 찾아오시는 길(`/directions`), 작업 가이드(`/guide/work`), 회사소개(`/about`)

**P2: 모바일 Sheet 메뉴 링크 부족**
- 현재: 로그인/마이페이지, 카테고리, 주문조회, 장바구니, 고객센터
- 누락: FAQ, 공지사항, 작업가이드, 회사소개

### 2.3 하드코딩 색상 (P1 High)

| 하드코딩 값 | 대응 토큰 | 발견 페이지 수 |
|-----------|----------|-------------|
| `#5538B6` | `--huni-color-primary` / `--huni-purple-500` | 8 |
| `#424242` | `--huni-color-text-dark` / `--huni-gray-900` | 9 |
| `#979797` | `--huni-color-text-muted` | 6 |
| `#F6F6F6` | `--huni-color-bg-section` | 5 |
| `#565656` | `--huni-color-text-medium` | 4 |
| `#CACACA` | `--huni-color-border-default` | 3 |
| `#EEEBF9` | `--huni-color-primary-light-3` | 2 |

### 2.4 PageShell 미채택 (P1 High)

SPEC-LAYOUT-001에서 생성한 PageShell을 사용하지 않는 페이지 ~22개:
BulkInquiry, BusinessConsultation, DesignConsultation, AboutUs, Directions, WorkGuide, ExperienceGroup, MemberModification 등

### 2.5 이중 색상 체계 (P2 Medium)

```
Tailwind `primary` = var(--point-color) = #f92626 (shopby 기본 빨간색)
Tailwind `huni-primary` = var(--huni-color-primary) = #5538B6 (Huni 보라색)
```

### 2.6 CSS 로딩 순서 (정상)

1. `@shopby/shared/styles/aurora` (벤더)
2. `./globals.css` (Tailwind + 오버라이드)
3. `./assets/style.css` (추가 커스텀)

---

## 3. 근본 원인

1. **토큰 네이밍 불일치**: 정의명과 사용명이 다름
2. **소급 적용 누락**: 레이아웃 컴포넌트 생성 후 기존 페이지 미적용
3. **네비게이션 경로 분산 관리**: 라우터/Header/BottomNav/Footer 각각 독립 관리
4. **디자인 시스템 채택 강제 메커니즘 부재**: lint 규칙이나 리뷰 게이트 없음

---

## 4. 실행 순서

SPEC-SKINFIX-001 (기반 복원) → SPEC-DESIGN-001 (신규 확장)

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-03-19 | 1.0.0 | 초기 리서치 - 3개 병렬 에이전트 탐색 결과 종합 |
