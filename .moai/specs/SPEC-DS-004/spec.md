---
id: SPEC-DS-004
version: "1.0.0"
status: draft
created: "2026-03-16"
updated: "2026-03-16"
author: "지니"
priority: P1
issue_number: 0
---

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2026-03-16 | 초안 작성 |

---

# SPEC-DS-004: Figma Flat Design → Pencil Component → Code Generation Pipeline

## 1. 개요

후니프린팅 Figma 디자인 파일의 PRODUCT_PRINT_OPTION 섹션(298개 플랫 요소)을 분석하여, 재사용 가능한 13개 컴포넌트를 자동 식별하고, Pencil(.pen) 파일로 컴포넌트 라이브러리를 생성한 뒤, 시각적 검증을 거쳐 React + Tailwind CSS 코드를 생성하는 파이프라인을 구축한다.

## 2. 배경

- 디자이너가 컴포넌트 설계 경험이 없어 Figma 디자인이 완전히 플랫(FRAME 0개)
- 동일 패턴이 12개 상품 타입(PRINT, BOOK, STATIONERY 등)에 반복됨
- 수동 컴포넌트화는 비효율적 → AI 기반 자동 식별 및 변환 필요
- 기존 innojini-huni-design-system 스킬(v4.1.0)에 컴포넌트 사양은 정의됨

## 3. 요구사항 (EARS 형식)

### R1: Figma 디자인 추출 [Event-Driven]

**When** 시스템이 Figma REST API를 통해 PRODUCT_PRINT_OPTION 섹션(id: 1647:129)에 접근할 때,
**the system shall** 298개 요소의 위치(x,y), 크기(width,height), 색상(fills,strokes), 텍스트(characters)를 JSON으로 추출하고 원본 스크린샷을 캡처해야 한다.

### R2: 컴포넌트 자동 분류 [Event-Driven]

**When** 추출된 298개 요소를 AI가 분석할 때,
**the system shall** RECTANGLE 크기 패턴(155x50, 116x50, 461x45 등)과 TEXT 위치 패턴을 기반으로 최소 13개 재사용 컴포넌트를 식별하고, Atomic Design 계층(Atoms 3종, Molecules 8종, Organisms 2종)으로 분류해야 한다.

### R3: Pencil 컴포넌트 생성 [Event-Driven]

**When** 분류된 컴포넌트 목록이 확정될 때,
**the system shall** Pencil MCP의 set_variables로 디자인 토큰(6개 색상)을 등록하고, batch_design으로 13개 컴포넌트를 .pen 파일에 Atoms → Molecules → Organisms 순서로 생성해야 한다.

### R4: 시각적 검증 [State-Driven]

**While** Pencil 컴포넌트가 생성된 상태에서,
**the system shall** get_screenshot으로 캡처한 결과와 Figma 원본 스크린샷을 비교하여, 색상/크기/간격의 피델리티가 90% 이상인지 검증하고, 불일치 시 자동 수정해야 한다.

### R5: React 코드 생성 [Event-Driven]

**When** 시각적 검증을 통과한 .pen 컴포넌트가 확정될 때,
**the system shall** batch_get으로 .pen JSON 구조를 읽어 각 컴포넌트를 독립적인 React + Tailwind CSS 파일로 변환하고, TypeScript 타입 에러 0, ESLint 에러 0을 달성해야 한다.

### R6: 컴포넌트 간 상태 연동 [Unwanted Behavior]

**If** 사용자가 "박없음"을 선택하면,
**the system shall** 박 크기 입력 및 칼라 선택 UI를 숨겨야 한다.
이와 같은 조건부 렌더링 로직을 모든 연동 컴포넌트에 적용해야 한다.

## 4. 범위

### 포함
- PRODUCT_PRINT_OPTION 섹션의 13개 컴포넌트
- 디자인 토큰 (색상 6종)
- Pencil .pen 컴포넌트 라이브러리
- React + Tailwind CSS 코드
- 시각적 검증 프로세스

### 제외
- 나머지 11개 상품 타입 섹션 (향후 SPEC에서 확장)
- 백엔드 API 연동
- E2E 테스트
- 모바일 반응형 (Phase 2에서 처리)

## 5. 기술 스택

- **디자인 추출**: Figma REST API v1
- **컴포넌트 렌더링**: Pencil MCP (batch_design, set_variables)
- **검증**: Pencil get_screenshot
- **코드 생성**: React 19 + Tailwind CSS + TypeScript
- **디자인 시스템**: shadcn/ui Nova 스타일 베이스

## 6. 대상 컴포넌트 (13종)

### Atoms (3종)
| 컴포넌트 | 설명 | Figma 패턴 |
|---------|------|-----------|
| BadgeLabel | "추천" 등 배지 | RECT 32x14 #5538b6 |
| InfoTooltip | "!" 정보 아이콘 + 팝오버 | TEXT + VECTOR 16x19 |
| ColorChip | 박 칼라 선택 칩 | GROUP 50x50 (ELLIPSE + RECT) |

### Molecules (8종)
| 컴포넌트 | 설명 | Figma 패턴 |
|---------|------|-----------|
| OptionLabel | 섹션 제목 | TEXT (사이즈, 종이, 인쇄 등) |
| SizeOptionChip | 크기 선택 칩 | RECT 155x50 + TEXT |
| RadioOption | 2~3지선다 선택 | RECT 116x50 + TEXT |
| DropdownSelect | 드롭다운 선택 | RECT 461x45 + TEXT + "▼" |
| CounterOption | 개수 선택 (없음/1/2/3) | 4x RECT 140x50 |
| SizeInput | 크기 직접입력 | RECT + TEXT (가로 X 세로) |
| QuantityInput | 수량 입력 | RECT 461x50 + TEXT |
| CTAButton | CTA 버튼 | RECT 465x50 #5538b6 |

### Organisms (2종)
| 컴포넌트 | 설명 | 구성 |
|---------|------|------|
| CollapsibleSection | 접이식 섹션 | OptionLabel + 토글 + 자식 |
| PriceSummary | 가격 요약 | 항목별 가격 + 합계 |
