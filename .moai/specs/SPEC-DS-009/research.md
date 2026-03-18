# SPEC-DS-009 리서치 결과

## 개요

후니 디자인시스템 v6.0 — 인터랙티브 플레이그라운드 및 토큰 파이프라인 구축을 위한 종합 리서치 결과를 정리한다.

---

## 1. 코드베이스 리서치 (Researcher)

### 1.1 후니 디자인시스템 현황

- **컴포넌트 수**: 29개 exported 컴포넌트 (26개 활성 사용)
- **아키텍처**: 3-layer (Figma tokens + cva + Radix)
  - Atoms: BadgeLabel, InfoTooltip 등
  - Molecules: CTAButton, CounterOption, DropdownSelect, OptionLabel, QuantityInput, RadioOption, SizeInput, SizeOptionChip 등
  - Organisms: CollapsibleSection, PriceSummary 등
- **패턴**: Slot recipe context pattern
- **CSS**: ~8K 토큰 규모의 CSS 커스텀 프로퍼티
- **디렉토리**: `src/design-system/`
  - `components/atoms/`
  - `components/molecules/`
  - `components/organisms/`
  - `tokens/` (typography.css 등)

### 1.2 seed.design 참고 분석

- **파이프라인**: rootage YAML -> qvism-preset -> CSS -> React
- **컴포넌트**: 71+ React 컴포넌트
- **문서화**: Next.js + Fumadocs + Storybook
- **교훈**: 26개 컴포넌트 규모에는 과도한 인프라

### 1.3 현재 갭 분석

| 항목 | 현재 상태 | 목표 상태 |
|------|-----------|-----------|
| 토큰 파이프라인 | 없음 (수동 CSS) | 표준화된 네이밍 컨벤션 |
| 인터랙티브 문서 | 없음 | Storybook 플레이그라운드 |
| 컴포넌트 테스트 | 없음 | Vitest + play functions |
| 접근성 검증 | 없음 | axe-core 기반 WCAG 2.2 AA |
| 비주얼 리그레션 | 없음 | Chromatic 통합 |

---

## 2. 국제 리서치 (Analyst)

### 2.1 Material Design 3

- **토큰 아키텍처**: 3계층 (Reference -> System -> Component)
- **M3 Expressive**: 최신 표현적 디자인 패턴
- **교훈**: 3계층 토큰 아키텍처가 업계 표준
- **출처**: https://m3.material.io/foundations/design-tokens

### 2.2 Shopify Polaris

- **방향**: Web Components 전환
- **강점**: commerce-specific 패턴 (가격, 배지, 카트 등)
- **교훈**: 이커머스 도메인 특화 컴포넌트 설계 참고
- **출처**: https://www.shopify.com/partners/blog/polaris-unified-and-for-the-web

### 2.3 Ant Design 5

- **토큰 시스템**: Seed/Map/Alias 3-tier 토큰
- **ConfigProvider**: 런타임 테마 변경 지원
- **교훈**: Seed -> Map -> Alias 파이프라인 구조 참고
- **출처**: https://ant.design/docs/react/customize-theme/

### 2.4 Toss Design System

- **철학**: "가드레일" — 올바른 사용을 쉽게, 잘못된 사용을 어렵게
- **API 패턴**: Flat + Compound 하이브리드
- **ROI**: 4,500시간 절감 달성
- **교훈**: 가드레일 패턴을 컴포넌트 API 설계에 적용
- **출처**: https://toss.tech/article/rethinking-design-system

### 2.5 seed.design (당근)

- **토큰**: Scale + Semantic 2계층
- **컴포넌트**: Headless + Styled 이중 제공
- **교훈**: 2계층으로도 충분한 규모 (26개 컴포넌트)
- **출처**: https://seed-design.io/

### 2.6 카카오스타일 DS

- **리빌딩 경험**: 프론트엔드 디자인시스템 재구축 사례
- **교훈**: 점진적 마이그레이션 전략의 중요성
- **출처**: https://devblog.kakaostyle.com/ko/2024-12-13-1-rebuilding-frontend-design-system/

### 2.7 LINE Design

- **체계적 문서화**: 디자인 원칙부터 컴포넌트까지 계층화
- **교훈**: 문서화 구조 참고
- **출처**: https://designsystem.line.me/

---

## 3. 표준 및 도구 리서치

### 3.1 W3C DTCG 2025.10

- **상태**: 첫 번째 안정 버전 도달
- **포맷**: 벤더 중립적 토큰 포맷 (`$value`, `$type`)
- **교훈**: 네이밍 컨벤션을 DTCG 호환으로 정비
- **출처**: https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/

### 3.2 Style Dictionary

- **호환성**: DTCG 포맷 완전 지원
- **기능**: 다중 플랫폼 변환 (CSS, iOS, Android)
- **결론**: Phase 2에서 필요 시 도입 (현재 규모에는 과도)
- **출처**: https://styledictionary.com/

### 3.3 WCAG 2.2

- **커스텀 UI**: ARIA 역할/속성 필수
- **키보드**: 모든 인터랙션 키보드 접근 가능
- **색상 대비**: 최소 3:1 (UI 컴포넌트), 4.5:1 (텍스트)
- **출처**: https://www.w3.org/TR/WCAG22/

### 3.4 Storybook 8

- **업계 표준**: 인터랙티브 컴포넌트 문서화 도구
- **기능**: autodocs, a11y addon, interactions addon
- **Webpack 5 빌더**: 기존 프로젝트 설정 재활용 가능
- **출처**: https://storybook.js.org/

### 3.5 Fumadocs

- **구조**: Content -> Core -> UI
- **특징**: MDX 기반, Fumadocs Story로 플레이그라운드
- **결론**: 26개 컴포넌트에는 과도, React 19 + TS 필요
- **출처**: https://www.fumadocs.dev/

### 3.6 Chromatic

- **비주얼 리그레션**: Storybook 네이티브 통합
- **TurboSnap**: 변경된 스토리만 비교하여 비용 최적화
- **CI/CD**: GitHub Actions 네이티브 통합
- **출처**: https://www.chromatic.com/

---

## 4. 산업/학술 리서치

### 4.1 Design Token Architecture (Martin Fowler)

- **핵심**: 토큰 기반 UI 아키텍처의 확장성과 일관성
- **교훈**: 토큰을 디자인 결정의 single source of truth로 활용
- **출처**: https://martinfowler.com/articles/design-token-based-ui-architecture.html

### 4.2 DS Maturity Model (Sparkbox)

- **4단계 모델**: Building -> Growing -> Adopted -> Thriving
- **후니 현재**: Stage 1-2 (Building ~ Growing)
- **목표**: Stage 2-3 (Growing ~ Adopted)
- **출처**: https://sparkbox.com/foundry/design_system_maturity_model

### 4.3 CDD (Component-Driven Development)

- **효율성**: 30-50% 개발 효율 향상
- **방법론**: Bottom-up 컴포넌트 개발 -> 페이지 조합
- **교훈**: Storybook이 CDD 실현의 핵심 도구
- **출처**: https://www.chromatic.com/blog/component-driven-development/

### 4.4 Design System ROI

- **평균 ROI**: 5년간 170%
- **절감 영역**: 개발 시간, QA 시간, 디자인 일관성
- **출처**: https://www.smashingmagazine.com/2022/09/formula-roi-design-system/

---

## 5. 아키텍트 설계 권고 (Architect)

### 5.1 플레이그라운드 도구 선택

| 도구 | 점수 | 호환성 | 비고 |
|------|------|--------|------|
| **Storybook 8 + Webpack 5** | **8.65/10** | **최고** | 기존 webpack 설정 재활용 |
| Fumadocs | 6.2/10 | 낮음 | React 19 + TS + 다른 빌드 필요 |
| Docusaurus | 5.8/10 | 중간 | 컴포넌트 플레이그라운드 약함 |

**결론**: Storybook 8 + Webpack 5 빌더 채택

### 5.2 토큰 파이프라인 전략

- **Phase 1**: CSS 커스텀 프로퍼티 네이밍 표준화 (`--huni-{category}-{name}`)
- **Phase 2**: 필요 시 Style Dictionary 도입 (별도 SPEC)
- **근거**: 26개 컴포넌트 규모에서는 CSS 표준화만으로 충분

### 5.3 디렉토리 구조 제안

```
src/design-system/
  __stories__/
    atoms/
      BadgeLabel.stories.jsx
      InfoTooltip.stories.jsx
    molecules/
      CTAButton.stories.jsx
      DropdownSelect.stories.jsx
      ...
    organisms/
      CollapsibleSection.stories.jsx
      PriceSummary.stories.jsx
    tokens/
      Colors.stories.jsx
      Typography.stories.jsx
      Spacing.stories.jsx
      Radius.stories.jsx
```

### 5.4 테스트 전략

| 레이어 | 도구 | 대상 |
|--------|------|------|
| 단위 테스트 | Vitest | 컴포넌트 로직 |
| 인터랙션 테스트 | Storybook play functions | 사용자 상호작용 |
| 접근성 테스트 | @storybook/addon-a11y (axe-core) | WCAG 2.2 AA |
| 비주얼 리그레션 | Chromatic | 시각적 변경 감지 |

### 5.5 배포 전략

- **Storybook 호스팅**: Chromatic (비주얼 테스트 + 호스팅 통합)
- **CI/CD**: GitHub Actions -> Chromatic 자동 배포
- **TurboSnap**: 변경된 스토리만 스냅샷 비교

### 5.6 리스크 평가

| 리스크 | 수준 | 대응 |
|--------|------|------|
| Webpack 5 호환성 | 낮음 | 기존 설정 재활용 가능 |
| JSX (비-TS) 환경 | 낮음 | Storybook JSX 완전 지원 |
| 26개 스토리 작성 부담 | 중간 | Phase별 점진적 작성 |
| Chromatic 비용 | 낮음 | 무료 티어 5,000 스냅샷/월 |
| 토큰 네이밍 마이그레이션 | 중간 | 점진적 변경 + Tailwind 매핑 |

---

## 6. 종합 결론

1. **Storybook 8 + Webpack 5**가 최적의 플레이그라운드 솔루션
2. **토큰 표준화**는 CSS 네이밍 컨벤션 정비로 시작 (Style Dictionary는 별도 SPEC)
3. **접근성(WCAG 2.2 AA)**은 axe-core 기반 자동 검증으로 구현
4. **비주얼 리그레션**은 Chromatic으로 CI/CD 통합
5. **스킬 문서 v6.0**은 리서치 결과를 반영한 가이드 강화
6. **Fumadocs/seed.design 스타일 풀 문서 사이트**는 현재 규모에 부적합하므로 제외
