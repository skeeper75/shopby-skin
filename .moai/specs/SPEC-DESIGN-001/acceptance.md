---
id: SPEC-DESIGN-001
type: acceptance
tags: [SPEC-DESIGN-001, acceptance-criteria]
---

# SPEC-DESIGN-001: 인수 조건

## AC-1: 디자인 토큰 완성도

### Scenario 1: 토큰 파일 구조

**Given** 디자인 토큰 확장이 완료되었을 때
**When** `src/design-system/tokens/` 디렉토리를 확인하면
**Then** 다음 6개 신규 토큰 파일이 존재해야 한다:
- `status.css` (7개 변수)
- `production.css` (8개 변수)
- `sns.css` (9개 변수)
- `admin.css` (8개 변수)
- `z-index.css` (7개 변수)
- `chart.css` (6개 변수)
**And** `index.css`에 모든 신규 파일이 @import되어야 한다
**And** 모든 변수명이 `--huni-` 접두사를 사용해야 한다

### Scenario 2: 토큰 Storybook 시각화

**Given** 토큰 파일이 추가되었을 때
**When** Storybook을 실행하면
**Then** 각 토큰 카테고리별 시각화 스토리가 렌더링되어야 한다

---

## AC-2: Design System 컴포넌트

### Scenario 3: DateRangePicker 동작

**Given** DateRangePicker가 구현되었을 때
**When** 사용자가 "1개월" 프리셋을 클릭하면
**Then** 시작일이 오늘-30일, 종료일이 오늘로 설정되어야 한다
**And** onChange 콜백이 {startDate, endDate}로 호출되어야 한다

**Given** 사용자가 시작일을 종료일보다 이후로 설정하면
**When** 날짜를 선택하면
**Then** 종료일이 자동으로 시작일로 조정되어야 한다

### Scenario 4: StepIndicator 반응형

**Given** StepIndicator가 구현되었을 때
**When** 모바일(375px) 뷰포트에서 렌더링하면
**Then** 수직(vertical) 레이아웃으로 표시되어야 한다
**And** 현재 단계는 `--huni-color-primary` 색상이어야 한다
**And** 완료 단계는 `--huni-fg-positive` 색상이어야 한다
**And** 대기 단계는 `--huni-fg-disabled` 색상이어야 한다

**When** 데스크톱(1280px) 뷰포트에서 렌더링하면
**Then** 수평(horizontal) 레이아웃으로 표시되어야 한다

---

## AC-3: 쇼핑몰 인증 컴포넌트

### Scenario 5: SNSLoginButtons 순서 및 색상

**Given** SNSLoginButtons가 구현되었을 때
**When** 렌더링하면
**Then** 버튼 순서가 카카오 > 네이버 > 구글 > 애플이어야 한다
**And** 카카오 버튼 배경색은 `--huni-sns-kakao`(#FEE500)이어야 한다
**And** 모바일에서 버튼은 전체 너비(100%)이어야 한다
**And** 데스크톱에서 버튼은 최대 550px 카드 내에 중앙 정렬이어야 한다

### Scenario 6: VerificationInput 타이머

**Given** VerificationInput에 인증번호가 발송되었을 때
**When** 타이머가 시작되면
**Then** 3분(180초) 카운트다운이 표시되어야 한다
**And** 시간 초과 시 재발송 버튼이 활성화되어야 한다
**And** 6자리 입력 완료 시 자동 검증이 트리거되어야 한다

---

## AC-4: 주문/결제 컴포넌트

### Scenario 7: OrderTrackerTimeline 상태 표시

**Given** 주문 상태가 "인쇄중"(STAT_050)일 때
**When** OrderTrackerTimeline을 렌더링하면
**Then** 접수~인쇄중까지 5단계가 완료/활성 표시되어야 한다
**And** 후가공~배송중 3단계는 대기 표시되어야 한다
**And** 각 단계의 색상은 `--huni-production-*` 토큰을 사용해야 한다

### Scenario 8: DropzoneUploader 파일 검증

**Given** DropzoneUploader가 구현되었을 때
**When** 사용자가 300dpi 미만 이미지를 드롭하면
**Then** FileValidationAlert에 해상도 경고가 표시되어야 한다
**And** 파일은 업로드되되 경고와 함께 표시되어야 한다

**When** 사용자가 RGB 모드 파일을 드롭하면
**Then** CMYK 변환 필요 알림이 표시되어야 한다

### Scenario 9: CartItemCard 인쇄사양 표시

**Given** 장바구니에 인쇄 상품이 있을 때
**When** CartItemCard를 렌더링하면
**Then** 사이즈, 용지, 코팅, 마감, 수량, 단가가 모두 표시되어야 한다
**And** 파일 미리보기 썸네일이 표시되어야 한다
**And** 수량 변경 시 가격이 실시간 업데이트되어야 한다

---

## AC-5: 관리자 컴포넌트

### Scenario 10: StageKanban 드래그앤드롭

**Given** StageKanban이 구현되었을 때
**When** 관리자가 주문 카드를 "인쇄중" → "후가공" 단계로 드래그하면
**Then** 카드가 해당 단계 컬럼으로 이동해야 한다
**And** 상태 변경 API가 호출되어야 한다
**And** 이동 불가능한 단계(역방향)로는 드래그가 방지되어야 한다

### Scenario 11: FilterSection 접기/펼치기

**Given** FilterSection이 구현되었을 때
**When** "상세검색" 토글을 클릭하면
**Then** 추가 필터 필드가 펼쳐져야 한다
**And** "초기화" 클릭 시 모든 필터가 기본값으로 리셋되어야 한다

---

## AC-6: 디자인-퍼스트 검증

### Scenario 12: Pencil 디자인 대조

**Given** 컴포넌트 구현이 완료되었을 때
**When** Pencil 디자인(.pen)과 실제 렌더링을 대조하면
**Then** 색상, 간격, 타이포그래피가 디자인 토큰 기준으로 일치해야 한다
**And** 모바일/데스크톱 양쪽 뷰포트에서 레이아웃이 일치해야 한다

### Scenario 13: 기존 DS 컴포넌트 재사용 비율

**Given** 모든 신규 컴포넌트 구현이 완료되었을 때
**When** import 문을 분석하면
**Then** 신규 컴포넌트의 70% 이상이 기존 DS 컴포넌트(24종)를 1개 이상 사용해야 한다

---

## AC-7: 품질 게이트

### Scenario 14: Storybook 커버리지

**Given** 모든 컴포넌트가 구현되었을 때
**When** Storybook을 확인하면
**Then** 모든 38개 컴포넌트에 대해 최소 1개 스토리가 존재해야 한다
**And** Props 변형이 문서화되어야 한다

### Scenario 15: 접근성 (a11y)

**Given** 인터랙티브 컴포넌트가 구현되었을 때
**When** 접근성을 검증하면
**Then** 모든 버튼/입력 필드에 적절한 ARIA 라벨이 있어야 한다
**And** 키보드 네비게이션이 가능해야 한다
**And** 색상 대비가 WCAG AA 기준(4.5:1)을 충족해야 한다

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-03-19 | 1.0.0 | 초안 작성 - 15개 시나리오 |
