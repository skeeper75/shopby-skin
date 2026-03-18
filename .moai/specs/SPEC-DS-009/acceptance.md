---
id: SPEC-DS-009
version: 1.0.0
status: draft
created: 2026-03-17
updated: 2026-03-17
---

# SPEC-DS-009 인수 기준

## 개요

후니 디자인시스템 v6.0의 각 요구사항에 대한 Given-When-Then 형식의 인수 기준을 정의한다.

---

## R1: Storybook 플레이그라운드 구축

### AC-R1-01: 전체 컴포넌트 카테고리 분류 표시

```gherkin
Given DS 컴포넌트가 26개 존재할 때
When `yarn storybook` 명령을 실행하면
Then 모든 컴포넌트가 atoms/molecules/organisms 카테고리별로 분류되어 사이드바에 표시되어야 한다
And 각 카테고리 하위에 해당 컴포넌트 스토리가 나열되어야 한다
```

### AC-R1-02: 컴포넌트 프로퍼티 실시간 조작

```gherkin
Given CTAButton 스토리를 Storybook에서 열었을 때
When Controls 패널에서 variant prop을 "primary"에서 "secondary"로 변경하면
Then 캔버스의 CTAButton이 실시간으로 secondary 스타일로 업데이트되어야 한다
And 변경된 prop 값이 Controls 패널에 반영되어야 한다
```

### AC-R1-03: 토큰 갤러리 — 색상

```gherkin
Given 토큰 갤러리의 Colors 스토리를 열었을 때
When Colors 섹션을 확인하면
Then 모든 후니 색상 토큰(--huni-color-*)이 swatch 그리드로 표시되어야 한다
And 각 swatch에 토큰명과 HEX 값이 함께 표시되어야 한다
```

### AC-R1-04: 토큰 갤러리 — 타이포그래피

```gherkin
Given 토큰 갤러리의 Typography 스토리를 열었을 때
When Typography 섹션을 확인하면
Then Noto Sans의 모든 weight/size 조합이 시각적으로 표시되어야 한다
And 각 조합에 토큰명, font-weight, font-size 값이 명시되어야 한다
```

### AC-R1-05: autodocs 자동 문서 생성

```gherkin
Given DropdownSelect 컴포넌트 스토리에 autodocs가 활성화되어 있을 때
When Docs 탭을 클릭하면
Then 컴포넌트의 props 테이블이 자동 생성되어 표시되어야 한다
And 기본값, 타입, 설명이 포함되어야 한다
```

### AC-R1-06: Storybook 빌드 성공

```gherkin
Given Storybook 설정이 완료되었을 때
When `yarn build-storybook` 명령을 실행하면
Then 에러 없이 정적 사이트가 빌드되어야 한다
And 빌드 결과물이 storybook-static/ 디렉토리에 생성되어야 한다
```

---

## R2: 접근성(WCAG 2.2 AA) 검증 체계

### AC-R2-01: a11y 패널 위반 0건

```gherkin
Given DropdownSelect 컴포넌트를 Storybook에서 열었을 때
When Accessibility 패널(a11y addon)을 확인하면
Then WCAG 2.2 AA 위반 항목(Violations)이 0개여야 한다
And 불완전 항목(Incomplete)이 문서화되어 있어야 한다
```

### AC-R2-02: 키보드 내비게이션 — 포커스 트랩

```gherkin
Given Dialog 컴포넌트가 열린 상태일 때
When Tab 키로 포커스 이동을 시도하면
Then 포커스가 Dialog 내부 요소들 사이에서만 순환해야 한다 (포커스 트랩)
And Escape 키로 Dialog를 닫을 수 있어야 한다
```

### AC-R2-03: 키보드 내비게이션 — 드롭다운

```gherkin
Given DropdownSelect 컴포넌트가 포커스된 상태일 때
When Enter 또는 Space 키를 누르면
Then 드롭다운 메뉴가 열려야 한다
And 화살표 키로 옵션 간 이동이 가능해야 한다
And Enter 키로 옵션 선택이 가능해야 한다
```

### AC-R2-04: 색상 대비 검증

```gherkin
Given CTAButton 컴포넌트의 모든 variant를 확인할 때
When axe-core의 color-contrast 규칙을 적용하면
Then 텍스트 대비가 4.5:1 이상이어야 한다
And UI 요소 대비가 3:1 이상이어야 한다
```

### AC-R2-05: ARIA 속성 검증

```gherkin
Given RadioOption 컴포넌트를 확인할 때
When ARIA 역할/속성을 검사하면
Then role="radio"가 올바르게 적용되어 있어야 한다
And aria-checked 속성이 선택 상태를 반영해야 한다
And aria-label 또는 연결된 label이 존재해야 한다
```

---

## R3: 비주얼 리그레션 테스트 파이프라인

### AC-R3-01: 컴포넌트 변경 시 비주얼 diff 표시

```gherkin
Given PR에서 CTAButton의 배경색을 변경했을 때
When Chromatic CI가 실행되면
Then 변경된 CTAButton 스토리의 비주얼 diff가 Chromatic 대시보드에 표시되어야 한다
And PR에 Chromatic 리뷰 링크가 자동 첨부되어야 한다
```

### AC-R3-02: 로직만 변경 시 비주얼 변경 없음

```gherkin
Given 디자인 토큰 변경 없이 컴포넌트 내부 로직만 변경했을 때
When Chromatic CI가 실행되면
Then 비주얼 변경 없음(0 changes)으로 통과해야 한다
And PR 상태 체크가 성공으로 표시되어야 한다
```

### AC-R3-03: TurboSnap 최적화

```gherkin
Given 26개 컴포넌트 중 CTAButton만 변경된 PR이 있을 때
When Chromatic이 TurboSnap 모드로 실행되면
Then CTAButton 관련 스토리만 스냅샷 비교를 수행해야 한다
And 나머지 25개 컴포넌트는 스냅샷 비교를 건너뛰어야 한다
```

### AC-R3-04: GitHub Actions CI 통합

```gherkin
Given `.github/workflows/chromatic.yml` 파일이 존재할 때
When PR이 생성 또는 업데이트되면
Then GitHub Actions에서 Chromatic 워크플로우가 자동 실행되어야 한다
And 실행 결과가 PR의 status check에 표시되어야 한다
```

---

## R4: 디자인 토큰 체계 표준화

### AC-R4-01: 토큰 네이밍 컨벤션 준수

```gherkin
Given 토큰 CSS 파일(tokens/*.css)을 확인했을 때
When 모든 CSS 커스텀 프로퍼티 변수명을 검사하면
Then 신규 토큰은 `--huni-{category}-{name}` 패턴을 따라야 한다
And 카테고리는 color, typo, space, radius, shadow 중 하나여야 한다
```

### AC-R4-02: 하위 호환성 유지

```gherkin
Given 기존 토큰명(예: --primary-color)을 사용하는 코드가 존재할 때
When 토큰 네이밍 마이그레이션을 적용하면
Then 기존 토큰명이 deprecated alias로 유지되어야 한다
And 기존 토큰명을 사용하는 컴포넌트가 정상 동작해야 한다
```

### AC-R4-03: Tailwind CSS 매핑 동기화

```gherkin
Given `tailwind.config.js`의 theme.extend를 확인할 때
When `--huni-color-primary` 토큰이 존재하면
Then Tailwind 유틸리티 클래스(예: `bg-huni-primary`)로 사용 가능해야 한다
And CSS 변수 값과 Tailwind 유틸리티 결과가 일치해야 한다
```

### AC-R4-04: 토큰 갤러리 시각화

```gherkin
Given Storybook 토큰 갤러리의 Typography 섹션을 열었을 때
When 표시된 토큰 목록을 확인하면
Then `--huni-typo-*` 패턴의 모든 타이포그래피 토큰이 나열되어야 한다
And 각 토큰의 시각적 샘플과 CSS 값이 함께 표시되어야 한다
```

---

## R5: 스킬 문서 강화 및 베스트 프랙티스 통합

### AC-R5-01: 접근성 체크리스트 제공

```gherkin
Given innojini-huni-design-system 스킬 v6.0을 로드했을 때
When 접근성 섹션을 확인하면
Then WCAG 2.2 AA 체크리스트가 컴포넌트 유형별(atoms/molecules/organisms)로 제공되어야 한다
And 각 항목에 검증 방법과 예시가 포함되어야 한다
```

### AC-R5-02: Storybook 연동 가이드

```gherkin
Given 스킬 문서의 Storybook 연동 가이드 섹션을 확인했을 때
When 새 컴포넌트의 스토리 작성 절차를 확인하면
Then 파일 생성, 스토리 구조, args 설정, autodocs 활성화 단계가 순서대로 명시되어야 한다
And 각 단계에 코드 예시가 포함되어야 한다
```

### AC-R5-03: 토큰 아키텍처 가이드

```gherkin
Given 스킬 문서의 토큰 아키텍처 섹션을 확인했을 때
When 3계층 구조 설명을 확인하면
Then Primitive → Semantic → Component 3계층이 다이어그램과 함께 설명되어야 한다
And `--huni-*` 네이밍 컨벤션 규칙이 카테고리별로 명시되어야 한다
```

### AC-R5-04: CDD 방법론 가이드

```gherkin
Given 스킬 문서의 CDD 방법론 섹션을 확인했을 때
When Component-Driven Development 워크플로우를 확인하면
Then atom → molecule → organism → page 순서의 bottom-up 개발 절차가 명시되어야 한다
And Toss DS "가드레일" 패턴의 적용 방법이 포함되어야 한다
```

---

## Quality Gate 기준

### 전체 SPEC 완료 기준

| 항목 | 기준 | 검증 방법 |
|------|------|-----------|
| Storybook 빌드 | 에러 0건 | `yarn build-storybook` 성공 |
| 컴포넌트 스토리 | 26개 전체 작성 | 사이드바 목록 확인 |
| 토큰 갤러리 | 4개 섹션 완성 | Colors, Typography, Spacing, Radius |
| a11y 위반 | Critical/Serious 0건 | Storybook a11y 패널 |
| Chromatic CI | PR 트리거 동작 | GitHub Actions 로그 |
| 토큰 네이밍 | 100% 표준 패턴 준수 | CSS 변수명 검사 |
| 하위 호환성 | 기존 코드 동작 유지 | 전체 페이지 스모크 테스트 |
| 스킬 문서 | v6.0 업데이트 완료 | 4개 모듈 존재 확인 |

### Phase별 완료 기준

| Phase | 완료 기준 |
|-------|-----------|
| Phase 1 | `yarn storybook` 실행, 5개 스토리 + 4개 토큰 갤러리 표시 |
| Phase 2 | 26개 전체 스토리 표시, a11y Critical 위반 0건 |
| Phase 3 | PR 생성 시 Chromatic CI 자동 실행, 비주얼 diff 표시 |
| Phase 4 | 모든 토큰 `--huni-*` 패턴 준수, deprecated alias 동작 |
| Phase 5 | 스킬 v6.0 로드 시 4개 가이드 모듈 접근 가능 |

---

## Traceability

| TAG | 요구사항 | 인수 기준 |
|-----|----------|-----------|
| SPEC-DS-009-R1 | Storybook 플레이그라운드 | AC-R1-01 ~ AC-R1-06 |
| SPEC-DS-009-R2 | WCAG 2.2 AA 접근성 | AC-R2-01 ~ AC-R2-05 |
| SPEC-DS-009-R3 | Chromatic 비주얼 리그레션 | AC-R3-01 ~ AC-R3-04 |
| SPEC-DS-009-R4 | 토큰 표준화 | AC-R4-01 ~ AC-R4-04 |
| SPEC-DS-009-R5 | 스킬 문서 v6.0 | AC-R5-01 ~ AC-R5-04 |
