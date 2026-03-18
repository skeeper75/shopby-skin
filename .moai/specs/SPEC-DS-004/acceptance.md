# SPEC-DS-004 수용 기준

## AC-1: Figma 디자인 추출

### Scenario: 전체 노드 추출
**Given** Figma REST API 토큰이 유효한 상태에서
**When** PRODUCT_PRINT_OPTION 섹션(id: 1647:129)을 depth=4로 요청하면
**Then** 298개 요소의 id, type, name, position, size, fills, strokes, characters가 모두 포함된 JSON이 생성되어야 한다

### Scenario: 원본 스크린샷 캡처
**Given** Figma 파일에 접근 가능한 상태에서
**When** PRODUCT_PRINT_OPTION 섹션의 이미지를 요청하면
**Then** 전체 섹션과 Zone별(6개) 스크린샷이 PNG로 저장되어야 한다

---

## AC-2: 컴포넌트 자동 분류

### Scenario: 최소 컴포넌트 수 식별
**Given** 298개 플랫 요소가 추출된 상태에서
**When** RECTANGLE 크기 패턴과 TEXT 위치 패턴을 분석하면
**Then** 최소 13개 재사용 컴포넌트가 식별되어야 한다

### Scenario: Atomic Design 계층 분류
**Given** 13개 컴포넌트가 식별된 상태에서
**When** 컴포넌트를 Atomic Design으로 분류하면
**Then** Atoms(3종), Molecules(8종), Organisms(2종)으로 정확히 매핑되어야 한다

### Edge Case: 애매한 패턴
**Given** 크기가 유사하지만 용도가 다른 요소(예: 116x50 vs 115x50)가 있을 때
**When** 분류 알고리즘이 적용되면
**Then** stroke 색상(#cacaca vs #5538b6)으로 선택/미선택 상태를 구분해야 한다

---

## AC-3: Pencil 컴포넌트 생성

### Scenario: 디자인 토큰 등록
**Given** Pencil .pen 파일이 생성된 상태에서
**When** set_variables로 디자인 토큰을 등록하면
**Then** 6개 색상 변수(primary, border, surface, disabled, bg, text)가 모두 등록되어야 한다

### Scenario: 전체 컴포넌트 생성
**Given** 디자인 토큰이 등록된 상태에서
**When** batch_design으로 13개 컴포넌트를 생성하면
**Then** 모든 컴포넌트가 .pen 파일에 존재하고, batch_get으로 조회 가능해야 한다

### Scenario: batch_design 분할 실행
**Given** batch_design 25개 작업 제한이 있을 때
**When** 13개 컴포넌트를 3~4회로 분할 생성하면
**Then** 모든 배치가 에러 없이 완료되고 컴포넌트 간 참조가 정상이어야 한다

---

## AC-4: 시각적 검증

### Scenario: 피델리티 검증
**Given** Pencil 컴포넌트와 Figma 원본 스크린샷이 모두 있는 상태에서
**When** 색상, 크기, 간격을 비교하면
**Then** 모든 컴포넌트가 90% 이상 피델리티를 달성해야 한다

### Scenario: 자동 수정 루프
**Given** 피델리티 90% 미만인 컴포넌트가 발견되었을 때
**When** batch_design으로 수정하고 재캡처하면
**Then** 최대 3회 반복 내에 90%+ 달성하거나, 수동 검토로 전환되어야 한다

---

## AC-5: React 코드 생성

### Scenario: TypeScript 타입 안전성
**Given** .pen 컴포넌트에서 React 코드가 생성된 상태에서
**When** `tsc --noEmit`을 실행하면
**Then** 타입 에러가 0이어야 한다

### Scenario: ESLint 준수
**Given** React 컴포넌트 코드가 생성된 상태에서
**When** ESLint를 실행하면
**Then** 에러가 0이어야 한다

### Scenario: 독립 렌더링
**Given** 13개 React 컴포넌트가 생성된 상태에서
**When** 각 컴포넌트를 단독으로 임포트하면
**Then** 의존성 에러 없이 렌더링되어야 한다

---

## AC-6: 컴포넌트 상태 연동

### Scenario: 박 선택 → 크기입력 표시
**Given** 박(앞면) 옵션이 표시된 상태에서
**When** 사용자가 "박없음"을 선택하면
**Then** 박 크기 직접입력과 칼라 선택 UI가 숨겨져야 한다

### Scenario: 박 선택 → 크기입력 표시 (역방향)
**Given** "박없음"이 선택된 상태에서
**When** 사용자가 "박있음"을 선택하면
**Then** 박 크기 직접입력과 칼라 선택 UI가 표시되어야 한다

---

## 품질 게이트

| 항목 | 기준 |
|------|------|
| 컴포넌트 수 | >= 13개 |
| .pen 파일 생성 | 정상 |
| 시각적 피델리티 | >= 90% |
| TypeScript 에러 | 0 |
| ESLint 에러 | 0 |
| 디자인 토큰 매핑 | 6개 전부 |
| MX 태그 | ANCHOR, WARN, NOTE 각 1개+ |
