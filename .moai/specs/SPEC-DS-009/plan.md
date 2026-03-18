---
id: SPEC-DS-009
version: 1.0.0
status: draft
created: 2026-03-17
updated: 2026-03-17
---

# SPEC-DS-009 구현 계획

## 개요

후니 디자인시스템 v6.0의 인터랙티브 플레이그라운드 및 토큰 파이프라인 구축을 위한 단계별 구현 계획이다.

---

## Phase 1: Storybook 기본 셋업 + 대표 컴포넌트 스토리 + 토큰 갤러리 — 우선순위 최고

### 목표
Storybook 8 환경을 구축하고, 대표 5개 컴포넌트 스토리와 토큰 갤러리를 작성하여 플레이그라운드의 기본 구조를 확립한다.

### 태스크

**T1.1: Storybook 8 초기 설정**

- Storybook 8 + @storybook/react-webpack5 설치
- `.storybook/main.js` 설정 (기존 webpack.config 재활용)
- `.storybook/preview.js` 설정 (글로벌 데코레이터, Tailwind CSS 로드)
- `.storybook/manager.js` 설정 (사이드바 카테고리 정렬)
- `package.json` scripts 추가 (`storybook`, `build-storybook`)
- 관련 요구사항: R1.1

**T1.2: 대표 5개 컴포넌트 스토리 작성**

- 선정 기준: 각 레이어 대표 + 다양한 인터랙션 패턴
- atoms: BadgeLabel (단순 표시형)
- molecules: CTAButton (클릭 인터랙션), DropdownSelect (복합 인터랙션)
- organisms: CollapsibleSection (상태 관리), PriceSummary (데이터 표시)
- autodocs 활성화 확인
- 관련 요구사항: R1.2, R1.4, R1.5

**T1.3: 토큰 갤러리 스토리 작성**

- Colors.stories.jsx: 색상 토큰 swatch 그리드
- Typography.stories.jsx: Noto Sans weight/size 조합 표시
- Spacing.stories.jsx: 간격 스케일 시각화
- Radius.stories.jsx: 모서리 반경 비교
- 관련 요구사항: R1.3

### 산출물

- `.storybook/` 설정 디렉토리
- 5개 컴포넌트 스토리 파일
- 4개 토큰 갤러리 스토리 파일
- `yarn storybook` 실행 가능한 상태

### 리스크

| 리스크 | 수준 | 대응 |
|--------|------|------|
| Webpack 설정 충돌 | 낮음 | webpackFinal에서 기존 설정 병합 |
| Tailwind CSS 로딩 실패 | 낮음 | preview.js에서 글로벌 CSS import |

---

## Phase 2: 전체 컴포넌트 스토리 + a11y 검증 + autodocs — 우선순위 높음

### 목표
나머지 21개 컴포넌트 스토리를 작성하고, 접근성 검증 체계를 통합한다.

### 태스크

**T2.1: 나머지 21개 컴포넌트 스토리 작성**

- atoms: InfoTooltip + 기타
- molecules: CounterOption, OptionLabel, QuantityInput, RadioOption, SizeInput, SizeOptionChip + 기타
- organisms: 기타
- 각 스토리에 주요 variant/state 시나리오 포함
- 관련 요구사항: R1.2

**T2.2: 접근성(a11y) addon 통합**

- @storybook/addon-a11y 설치 및 설정
- preview.js에 a11y 글로벌 파라미터 설정
- 모든 스토리에 a11y 검증 활성화
- 관련 요구사항: R2.1

**T2.3: 접근성 위반 사항 수정**

- axe-core 스캔 결과 기반 위반 사항 식별
- 키보드 내비게이션 검증 및 수정
- 색상 대비 검증 및 수정 (3:1 UI, 4.5:1 텍스트)
- ARIA 역할/속성 검증 및 수정
- 관련 요구사항: R2.2, R2.3, R2.4

**T2.4: autodocs 최적화**

- JSX 환경에서 autodocs 동작 확인
- argTypes 수동 보완 (JSDoc 또는 defaultProps 기반)
- 컴포넌트 설명 및 사용 예시 추가
- 관련 요구사항: R1.4

### 산출물

- 26개 전체 컴포넌트 스토리
- a11y 검증 패널 동작
- 접근성 위반 0건 달성 (또는 알려진 이슈 문서화)
- autodocs 자동 생성 문서

### 리스크

| 리스크 | 수준 | 대응 |
|--------|------|------|
| 21개 스토리 작성 부담 | 중간 | 템플릿 기반 일괄 작성 |
| JSX autodocs 제한 | 중간 | argTypes 수동 보완 |
| a11y 위반 수정 범위 | 중간 | 심각도별 우선순위 수정 |

---

## Phase 3: Chromatic 연동 + CI/CD + 비주얼 리그레션 — 우선순위 중간

### 목표
Chromatic을 연동하여 PR 단위 비주얼 리그레션 테스트 파이프라인을 구축한다.

### 태스크

**T3.1: Chromatic 초기 설정**

- chromatic 패키지 설치
- Chromatic 프로젝트 생성 및 프로젝트 토큰 발급
- GitHub Secrets에 `CHROMATIC_PROJECT_TOKEN` 등록
- 관련 요구사항: R3.1

**T3.2: GitHub Actions 워크플로우 작성**

- `.github/workflows/chromatic.yml` 작성
- PR 이벤트 트리거 설정
- TurboSnap 활성화 (`--only-changed`)
- 빌드 캐시 최적화
- 관련 요구사항: R3.2, R3.3

**T3.3: 비주얼 리뷰 프로세스 수립**

- PR에 Chromatic 비주얼 diff 링크 자동 첨부
- 의도적 변경 vs 비의도적 변경 구분 프로세스
- 리뷰어 승인 플로우 정의
- 관련 요구사항: R3.4

### 산출물

- Chromatic 프로젝트 연동
- GitHub Actions CI 워크플로우
- PR 비주얼 리뷰 프로세스 문서

### 리스크

| 리스크 | 수준 | 대응 |
|--------|------|------|
| Chromatic 무료 티어 초과 | 낮음 | TurboSnap으로 스냅샷 최소화 |
| CI 빌드 시간 | 중간 | 캐시 + --only-changed |

---

## Phase 4: 토큰 네이밍 표준화 + Tailwind 매핑 — 우선순위 중간

### 목표
CSS 커스텀 프로퍼티의 네이밍을 `--huni-{category}-{name}` 패턴으로 통일하고, Tailwind CSS와의 매핑을 동기화한다.

### 태스크

**T4.1: 토큰 인벤토리 작성**

- 기존 CSS 커스텀 프로퍼티 전수 조사
- 카테고리별 분류 (color, typo, space, radius, shadow)
- 신규 네이밍 매핑 테이블 작성
- 관련 요구사항: R4.1

**T4.2: 토큰 네이밍 마이그레이션**

- `--huni-color-*`, `--huni-typo-*`, `--huni-space-*` 등 적용
- 기존 네이밍에 deprecated alias 제공 (하위 호환성)
- 컴포넌트 내부 참조 업데이트
- 관련 요구사항: R4.1, R4.4

**T4.3: Tailwind CSS 매핑 동기화**

- `tailwind.config.js` extend 섹션에 `--huni-*` 변수 매핑
- 유틸리티 클래스와 CSS 변수 일치 확인
- 관련 요구사항: R4.3

**T4.4: 토큰 갤러리 업데이트**

- Phase 1의 토큰 갤러리 스토리를 표준화된 네이밍으로 업데이트
- 토큰 네이밍 규칙 설명 추가
- 관련 요구사항: R4.2

### 산출물

- 토큰 인벤토리 문서
- 표준화된 CSS 커스텀 프로퍼티
- deprecated alias 매핑
- 업데이트된 tailwind.config.js
- 업데이트된 토큰 갤러리 스토리

### 리스크

| 리스크 | 수준 | 대응 |
|--------|------|------|
| 광범위한 CSS 변경 | 중간 | deprecated alias로 하위 호환 |
| Tailwind 매핑 충돌 | 낮음 | 점진적 변경 + 테스트 |

---

## Phase 5: 스킬 문서 v6.0 업데이트 — 우선순위 높음

### 목표
innojini-huni-design-system 스킬 문서를 v6.0으로 업데이트하여 리서치 결과와 베스트 프랙티스를 반영한다.

### 태스크

**T5.1: 토큰 아키텍처 가이드 작성**

- 3계층 토큰 아키텍처 설명 (Primitive -> Semantic -> Component)
- Material Design 3, Ant Design 5, seed.design 참고
- `--huni-*` 네이밍 컨벤션 가이드
- 관련 요구사항: R5.1

**T5.2: 접근성 체크리스트 작성**

- WCAG 2.2 AA 기준 컴포넌트별 체크리스트
- 키보드 내비게이션, ARIA, 색상 대비 항목
- axe-core 검증 방법 안내
- 관련 요구사항: R5.2

**T5.3: CDD 방법론 가이드 작성**

- Component-Driven Development 원칙 설명
- Toss DS "가드레일" 철학 적용 가이드
- Bottom-up 개발 워크플로우
- 관련 요구사항: R5.3

**T5.4: Storybook 연동 가이드 작성**

- 새 컴포넌트 스토리 작성 절차 (단계별)
- 스토리 파일 구조 및 네이밍 규칙
- autodocs 활용 방법
- a11y 검증 활용 방법
- 관련 요구사항: R5.4

### 산출물

- 업데이트된 innojini-huni-design-system SKILL.md (v6.0)
- 토큰 아키텍처 가이드 모듈
- 접근성 체크리스트 모듈
- CDD 방법론 가이드 모듈
- Storybook 연동 가이드 모듈

### 리스크

| 리스크 | 수준 | 대응 |
|--------|------|------|
| 스킬 문서 500줄 제한 | 중간 | 모듈 분리 활용 |

---

## 기술적 접근 방식

### Storybook 설정 전략

```
기존 webpack.config.js
  └── .storybook/main.js (webpackFinal에서 merge)
        ├── Tailwind CSS PostCSS 설정 공유
        ├── 경로 alias 공유
        └── 기존 loader 설정 재활용
```

### 토큰 표준화 전략

```
Phase 1: CSS 네이밍 표준화
  --primary-color → --huni-color-primary (+ deprecated alias)

Phase 2 (별도 SPEC): Style Dictionary 도입
  tokens.json → CSS + Tailwind + Figma 동기화
```

### 테스트 피라미드

```
          [Chromatic]          — 비주얼 리그레션
         [a11y addon]         — 접근성 자동 검증
        [play functions]      — 인터랙션 테스트
       [Vitest 단위 테스트]    — 컴포넌트 로직
```

---

## 의존성 다이어그램

```
Phase 1 (Storybook 셋업)
    │
    ├──→ Phase 2 (전체 스토리 + a11y)
    │        │
    │        └──→ Phase 3 (Chromatic CI/CD)
    │
    └──→ Phase 4 (토큰 표준화)
              │
              └──→ Phase 5 (스킬 문서)
                     ↑
                     └── Phase 1~4 결과 반영
```

---

## Traceability

| TAG | 요구사항 | Phase | 태스크 |
|-----|----------|-------|--------|
| SPEC-DS-009-R1 | Storybook 플레이그라운드 | Phase 1-2 | T1.1~T1.3, T2.1, T2.4 |
| SPEC-DS-009-R2 | WCAG 2.2 AA 접근성 | Phase 2 | T2.2, T2.3 |
| SPEC-DS-009-R3 | Chromatic 비주얼 리그레션 | Phase 3 | T3.1~T3.3 |
| SPEC-DS-009-R4 | 토큰 표준화 | Phase 4 | T4.1~T4.4 |
| SPEC-DS-009-R5 | 스킬 문서 v6.0 | Phase 5 | T5.1~T5.4 |
