# SPEC-DS-004 구현 계획

## 실행 전략

5단계 파이프라인으로 진행. 각 Phase는 검증 루프(max 3회)를 포함하며, --loop --auto 모드에서 자동 진행.

---

## Phase 1: Figma 디자인 추출

### 작업
1. Figma REST API로 PRODUCT_PRINT_OPTION (id: 1647:129) 전체 노드 추출 (depth=4)
2. 원본 스크린샷 캡처 (전체 + Zone별)
3. 디자인 토큰 수집 (색상, 타이포그래피, 간격)

### 에이전트
- expert-frontend (Figma REST API 호출)

### 산출물
- `designs/figma-extract.json` — 전체 노드 데이터
- `designs/screenshots/` — 원본 스크린샷
- `src/design-system/tokens/` — 디자인 토큰 CSS

### 검증
- 298개 요소 모두 추출 확인
- 스크린샷 정상 캡처 확인

---

## Phase 2: 컴포넌트 자동 분류

### 작업
1. 298개 요소를 RECTANGLE 크기 패턴으로 1차 그룹핑
2. TEXT Y좌표로 섹션 경계 식별
3. GROUP 요소의 자식 구조 분석
4. 13개 컴포넌트로 최종 분류
5. Atomic Design 계층 매핑 (Atoms 3 / Molecules 8 / Organisms 2)

### 에이전트
- expert-frontend (패턴 분석 및 분류)

### 산출물
- `designs/component-map.json` — 컴포넌트 분류 결과
- research.md 업데이트

### 검증
- 13종 이상 컴포넌트 식별 확인
- 각 컴포넌트에 최소 2개 이상 인스턴스 매핑 확인

---

## Phase 3: Pencil 컴포넌트 생성

### 작업
1. Pencil open_document로 .pen 파일 생성
2. set_variables로 디자인 토큰 등록:
   - --color-primary: #5538b6
   - --color-border: #cacaca
   - --color-surface: #ffffff
   - --color-disabled: #d9d9d9
   - --color-bg: #f6f6f6
   - --color-text: #000000
3. get_style_guide로 스타일 가이드 적용
4. batch_design으로 컴포넌트 생성 (25개 제한 → 3~4회 분할):
   - Batch 1: Atoms (BadgeLabel, InfoTooltip, ColorChip) + Molecules 전반 (OptionLabel, SizeOptionChip, RadioOption)
   - Batch 2: Molecules 후반 (DropdownSelect, CounterOption, SizeInput, QuantityInput, CTAButton)
   - Batch 3: Organisms (CollapsibleSection, PriceSummary) + 조합 프레임

### 에이전트
- expert-frontend (Pencil MCP 조작)

### 산출물
- `designs/huni-components.pen` — 컴포넌트 라이브러리

### 검증 루프 (max 3회)
1. get_screenshot으로 각 컴포넌트 스크린샷
2. Figma 원본과 비교
3. 불일치 시 batch_design으로 수정

---

## Phase 4: 시각적 검증

### 작업
1. Pencil get_screenshot으로 전체 컴포넌트 캡처
2. Figma 원본 스크린샷과 비교 (색상, 크기, 간격)
3. 피델리티 90% 미만 컴포넌트 식별
4. batch_design으로 자동 수정
5. 재캡처 및 재검증

### 에이전트
- expert-frontend (검증 + 수정)

### 산출물
- 검증 리포트 (통과/미통과 항목)
- 수정된 .pen 파일

### 검증 루프 (max 3회)
- 모든 컴포넌트가 90%+ 피델리티 달성까지 반복

---

## Phase 5: React + Tailwind 코드 생성

### 작업
1. Pencil batch_get으로 .pen JSON 구조 읽기
2. 각 컴포넌트를 React + TypeScript로 변환:
   - Props 인터페이스 정의
   - Tailwind CSS 클래스 적용
   - 디자인 토큰 → CSS 변수 매핑
3. 컴포넌트 간 상태 연동 구현 (R6)
4. index.ts에 re-export

### 에이전트
- expert-frontend (코드 생성)
- manager-quality (타입체크 + 린트)

### 산출물
```
src/design-system/
  tokens/colors.css
  components/
    atoms/BadgeLabel.tsx, InfoTooltip.tsx, ColorChip.tsx
    molecules/OptionLabel.tsx, SizeOptionChip.tsx, RadioOption.tsx,
             DropdownSelect.tsx, CounterOption.tsx, SizeInput.tsx,
             QuantityInput.tsx, CTAButton.tsx
    organisms/CollapsibleSection.tsx, PriceSummary.tsx
  index.ts
```

### 검증 루프 (max 3회)
1. TypeScript 타입체크 (tsc --noEmit) → 에러 0
2. ESLint → 에러 0
3. 각 컴포넌트 독립 렌더링 가능 확인

---

## MX 태그 전략

| 대상 | MX 타입 | 이유 |
|------|---------|------|
| 디자인 토큰 CSS 변수 | @MX:ANCHOR | 전체 컴포넌트에 영향 |
| CollapsibleSection 상태 로직 | @MX:WARN | 조건부 렌더링 복잡도 |
| 각 컴포넌트 export | @MX:NOTE | 용도 및 Props 설명 |
| Phase 3~5 미완료 항목 | @MX:TODO | 구현 진행 추적 |

---

## 위험 완화

| 위험 | 영향 | 완화 |
|------|------|------|
| Figma MCP 토큰 만료 | 디자인 추출 불가 | REST API 직접 호출 (확인됨) |
| Pencil batch_design 25개 제한 | 한 번에 모든 컴포넌트 생성 불가 | 3~4회 분할 배치 |
| 플랫 요소 그룹핑 오류 | 잘못된 컴포넌트 분리 | Y좌표 + 이름 패턴 이중 검증 |
| 12개 상품 타입 확장성 | 컴포넌트가 특정 상품에만 동작 | Props 기반 제네릭 설계 |

---

## 의존성

- Figma Personal Access Token (FIGMA_ACCESS_TOKEN in .env) ✅ 확인됨
- Pencil MCP 서버 가동 필요
- shadcn/ui + Tailwind CSS 프로젝트 설정 (memory에서 확인됨)
- innojini-huni-design-system 스킬 v4.1.0 참조

## 예상 에이전트 체인

```
expert-frontend (Phase 1~5 주 담당)
  → manager-quality (Phase 5 검증)
    → manager-docs (완료 후 스킬 업데이트)
```
