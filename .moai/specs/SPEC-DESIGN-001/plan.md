---
id: SPEC-DESIGN-001
type: plan
tags: [SPEC-DESIGN-001, implementation-plan, design-first]
---

# SPEC-DESIGN-001: 구현 계획

## 1. 구현 전략 개요

디자인-퍼스트 접근법으로 4개 Phase를 순차 실행한다. 각 Phase 내에서는 토큰 → 디자인 → 구현 → 검증 순서를 따른다.

### 기술 접근 방식

| 영역 | 전략 |
|------|------|
| 디자인 토큰 | CSS Custom Properties, `--huni-*` 네이밍 |
| 디자인 도구 | Pencil MCP (.pen 파일) |
| 컴포넌트 구현 | React 18 + Plain CSS + Huni Design Tokens |
| 관리자 영역 | Tailwind CSS + Huni Design Tokens |
| 스토리북 | 기존 `src/design-system/__stories__/` 확장 |
| 시각 검증 | Pencil get_screenshot + 수동 대조 |

---

## 2. Phase별 구현 계획

### Phase 1: 디자인 토큰 확장 + Design System 핵심 (P1)

**목표**: 45개 디자인 토큰 추가 + DateRangePicker, StepIndicator 구현

| 작업 | 분류 | 규모 | 파일 |
|------|------|------|------|
| 주문 상태 토큰 (7개) | Token | S | `tokens/status.css` |
| 인쇄 생산 상태 토큰 (8개) | Token | S | `tokens/production.css` |
| SNS 브랜드 토큰 (9개) | Token | S | `tokens/sns.css` |
| 관리자 전용 토큰 (8개) | Token | S | `tokens/admin.css` |
| z-index 스케일 (7개) | Token | S | `tokens/z-index.css` |
| 차트 팔레트 (6개) | Token | S | `tokens/chart.css` |
| index.css 업데이트 | Token | S | `tokens/index.css` |
| Storybook 토큰 스토리 | Story | M | `__stories__/tokens/` |
| DateRangePicker | DS Molecule | M | `components/molecules/DateRangePicker/` |
| StepIndicator | DS Molecule | M | `components/molecules/StepIndicator/` |

**마일스톤**: 모든 신규 토큰이 Storybook에서 시각화되고, DateRangePicker/StepIndicator가 동작
**의존성**: 없음 (독립 실행 가능)

---

### Phase 2: 쇼핑몰 핵심 컴포넌트 (P1)

**목표**: 핵심 구매 여정에 필요한 23개 쇼핑몰 컴포넌트 디자인 및 구현

#### 2A: 인증 컴포넌트 (9개)

| 컴포넌트 | 규모 | 디자인 우선순위 | 의존성 |
|----------|------|--------------|--------|
| LoginForm | M | P1 | SNS 토큰 |
| SNSLoginButtons | S | P1 | SNS 토큰 |
| FindIdForm | S | P2 | VerificationInput |
| FindPwForm | S | P2 | VerificationInput |
| VerificationInput | S | P1 | Timer 로직 |
| SignUpForm | L | P1 | TermsAgreement, PhoneVerification |
| TermsAgreement | S | P1 | Checkbox (DS) |
| PhoneVerification | S | P1 | VerificationInput |
| BusinessInfoForm | M | P2 | TextField (DS), Field (DS) |

#### 2B: 주문/결제 + 인쇄특화 (7개)

| 컴포넌트 | 규모 | 디자인 우선순위 | 의존성 |
|----------|------|--------------|--------|
| OrderTrackerTimeline | L | P1 | StepIndicator, 생산 상태 토큰 |
| DropzoneUploader | L | P1 | FileValidationAlert |
| FileValidationAlert | M | P1 | StatusBadge 확장 |
| PreviewRenderer | L | P1 | - |
| CartItemCard | M | P1 | HuniOptionPreview 확장 |
| PaperSampleCard | M | P1 | ColorChip (DS) |
| QuantityPricingTable | M | P2 | - |

#### 2C: 프린팅머니 + 마이페이지 (7개)

| 컴포넌트 | 규모 | 디자인 우선순위 | 의존성 |
|----------|------|--------------|--------|
| AccountBalanceWidget | M | P1 | - |
| TransactionHistory | M | P2 | DateRangePicker |
| ChargeAmountSelector | M | P2 | QuantityInput (DS) |
| OrderCard | M | P1 | StatusBadge, DateRangeFilter |
| SavedOptionCard | M | P2 | HuniOptionPreview |
| RealTimePriceWidget | M | P1 | HuniPriceCalculator 확장 |
| ProductRecommendGrid | M | P3 | ResponsiveGrid |

**마일스톤**: 인쇄 상품 주문 플로우의 전체 UI 컴포넌트 완성
**주요 위험**: OrderTrackerTimeline의 8단계 상태 매핑 복잡도, DropzoneUploader의 파일 검증 UX

---

### Phase 3: 관리자 도메인 컴포넌트 (P2)

**목표**: 8개 관리자 컴포넌트 디자인 및 구현

| 컴포넌트 | 규모 | 디자인 우선순위 | 의존성 |
|----------|------|--------------|--------|
| StageKanban | XL | P2 | 생산 상태 토큰, DragDrop |
| QualityChecklist | M | P2 | Checkbox (DS) |
| ComparisonViewer | L | P2 | - |
| WorkerAssignment | M | P3 | DropdownSelect (DS) |
| FilterSection | M | P2 | DateRangePicker, DropdownSelect |
| StatusFilterTabs | M | P2 | Tabs (DS), BadgeLabel (DS) |
| DetailDrawer | L | P2 | OrderDetailPanel 패턴 |
| TreeView | M | P3 | CategoryTree 패턴 |

**마일스톤**: 관리자 인쇄 생산관리 UI 완성
**주요 위험**: StageKanban의 드래그앤드롭 성능

---

### Phase 4: 정보/가이드 컴포넌트 (P3)

**목표**: 5개 정보/가이드 컴포넌트 디자인 및 구현

| 컴포넌트 | 규모 | 의존성 |
|----------|------|--------|
| TimelineHistory | M | - |
| KakaoMap | M | Kakao Map API |
| ImageZoom | M | - |
| LegalDocument | S | TOCNav |
| TOCNav | M | IntersectionObserver |

**마일스톤**: 정보 페이지 UI 완성
**주요 위험**: Kakao Map API 변경

---

## 3. Phase 간 의존성 맵

```
Phase 1 (토큰+DS) ────> Phase 2 (쇼핑몰 컴포넌트)
                              |
                              v
                        Phase 3 (관리자 컴포넌트)
                              |
                              v
                        Phase 4 (정보/가이드)
```

- Phase 1은 모든 Phase의 선행 조건
- Phase 2와 Phase 3은 Phase 1 완료 후 병렬 가능
- Phase 4는 Phase 2 이후

---

## 4. 디자인-퍼스트 실행 상세

### 각 컴포넌트별 디자인 프로세스

1. **토큰 확인**: 해당 컴포넌트에 필요한 토큰이 모두 정의되었는지 확인
2. **Pencil 디자인**: `.pen` 파일에 컴포넌트 시각 디자인
   - 모바일(375px) 뷰
   - 데스크톱(1280px) 뷰
   - 상태 변형 (default/hover/active/disabled/error)
3. **디자인 리뷰**: 사용자에게 디자인 확인 요청
4. **React 구현**: 승인된 디자인 기반 구현
5. **Storybook 스토리**: 모든 Props 변형 문서화
6. **시각 검증**: Pencil 스크린샷 vs 실제 렌더링 비교

### 디자인 파일 구조

```
.moai/designs/
├── tokens/           # 토큰 시각화 .pen 파일
├── components/       # 컴포넌트별 .pen 파일
│   ├── shop/         # 쇼핑몰 도메인
│   ├── admin/        # 관리자 도메인
│   └── ds/           # Design System 확장
└── pages/            # 페이지 레이아웃 .pen 파일
```

---

## 5. 리스크 분석

### High 위험

| 리스크 | 영향 Phase | 대응 방안 |
|--------|----------|----------|
| StageKanban 드래그앤드롭 복잡도 | Phase 3 | react-beautiful-dnd 또는 @dnd-kit 라이브러리 평가 |
| OrderTrackerTimeline 상태 매핑 | Phase 2 | STAT_010~STAT_900 → 8단계 매핑 테이블 사전 정의 |

### Medium 위험

| 리스크 | 영향 Phase | 대응 방안 |
|--------|----------|----------|
| Pencil MCP 디자인 정밀도 한계 | 전체 | 핵심 컴포넌트는 Figma 병행 |
| DropzoneUploader 파일 크기 제한 | Phase 2 | 프론트엔드 + 백엔드 양쪽 검증 |
| Kakao Map API 변경 | Phase 4 | 래퍼 컴포넌트로 격리 |

### Low 위험

| 리스크 | 영향 Phase | 대응 방안 |
|--------|----------|----------|
| deprecated --po-* 토큰 충돌 | Phase 1 | 호환 레이어 유지, 점진적 마이그레이션 |
| Storybook 버전 호환 | 전체 | 기존 스토리 패턴 준수 |

---

## 6. 기술 제약사항

### 디자인 시스템 제약

- 기존 24개 DS 컴포넌트의 API 변경 금지 (하위 호환성)
- `--huni-*` 네이밍 표준 필수
- `src/design-system/` 경로에 DS 컴포넌트 배치
- 도메인 컴포넌트는 `src/components/` 경로에 배치

### shopby 플랫폼 제약

- NATIVE 기능의 Core API 변경 불가
- @shopby/react-components Provider 체인 순서 유지
- MegaMenuCategories 등 기존 shopby 컴포넌트는 CSS 오버라이드만

### 레이아웃 제약

- 모든 쇼핑몰 컴포넌트는 PageShell 내에서 사용
- 모바일 우선 (375px 기본)
- 관리자 영역: Desktop 전용 (>=1024px)

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-03-19 | 1.0.0 | 초안 작성 - 4 Phase 구현 계획 |
