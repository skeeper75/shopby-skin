---
id: SPEC-PRODUCT-001
artifact: interactions
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-PRODUCT-001: 인터랙션 정의서

> A10B4-PRODUCT 상품관리 도메인 상태 머신, 옵션 캐스케이딩 로직, 가격 계산 흐름

---

## 1. 상태 머신 (State Machines)

### 1.1 종속옵션 캐스케이딩 상태

```mermaid
stateDiagram-v2
    [*] --> ProductTypeSelection

    ProductTypeSelection --> SizeSelection : selectProductType

    SizeSelection --> MaterialSelection : selectSize [상품유형=실사/굿즈]
    SizeSelection --> PaperSelection : selectSize [상품유형=인쇄/제본/패키지]

    MaterialSelection --> FinishingSelection : selectMaterial
    PaperSelection --> FinishingSelection : selectPaper

    FinishingSelection --> QuantityInput : selectFinishing(s)
    FinishingSelection --> QuantityInput : skipFinishing

    QuantityInput --> PriceCalculated : inputQuantity

    PriceCalculated --> [*] : confirm

    note right of ProductTypeSelection
        상품유형 변경 시
        하위 전체 리셋
    end note

    note right of SizeSelection
        사이즈 변경 시
        소재/용지 이하 리셋
    end note

    state SizeSelection {
        [*] --> sizeIdle
        sizeIdle --> sizePopupOpen : clickSizeButton
        sizePopupOpen --> sizeSelected : confirmSelection
        sizePopupOpen --> sizeIdle : cancelPopup
    }

    state PaperSelection {
        [*] --> paperDisabled
        paperDisabled --> paperIdle : sizeSelected
        paperIdle --> paperPopupOpen : clickPaperButton
        paperPopupOpen --> paperSelected : confirmSelection
    }
```

### 1.2 가격 매트릭스 편집 상태

```mermaid
stateDiagram-v2
    [*] --> idle

    idle --> loading : openPricePopup
    loading --> editing : dataLoaded
    loading --> error : loadFailed

    editing --> saving : clickSave
    editing --> validationError : invalidInput
    editing --> confirmDiscard : clickClose [hasChanges]
    editing --> idle : clickClose [noChanges]

    validationError --> editing : fixError

    saving --> saved : saveSuccess
    saving --> saveError : saveFailed
    saving --> conflictDetected : versionConflict

    saved --> idle : closePopup
    saveError --> editing : retry
    conflictDetected --> reloading : acceptReload
    reloading --> editing : dataReloaded

    confirmDiscard --> idle : confirmDiscard
    confirmDiscard --> editing : cancelDiscard

    error --> idle : dismiss

    state editing {
        [*] --> pristine
        pristine --> dirty : editCell
        dirty --> dirty : editCell
        dirty --> pristine : undoAll
    }
```

### 1.3 상품등록 폼 상태

```mermaid
stateDiagram-v2
    [*] --> formInit

    formInit --> checkAutoSave : pageLoad
    checkAutoSave --> restorePrompt : autoSaveExists
    checkAutoSave --> emptyForm : noAutoSave

    restorePrompt --> filledForm : userRestore
    restorePrompt --> emptyForm : userDecline

    emptyForm --> filledForm : inputData
    filledForm --> filledForm : inputData
    filledForm --> autoSaving : timer30s
    autoSaving --> filledForm : autoSaveComplete

    filledForm --> validating : clickSave
    validating --> savingToShopby : allValid
    validating --> validationError : hasErrors

    savingToShopby --> savingToCustomDB : shopbySuccess
    savingToShopby --> saveError : shopbyFailed

    savingToCustomDB --> saveComplete : customDBSuccess
    savingToCustomDB --> rollbackShopby : customDBFailed

    saveComplete --> [*] : redirectToList
    saveError --> filledForm : retry
    rollbackShopby --> saveError : rollbackComplete
    validationError --> filledForm : fixErrors
```

---

## 2. 옵션 캐스케이딩 상세 로직

### 2.1 상위 옵션 변경 시 리셋 규칙

| 변경된 옵션 | 리셋 대상 | 확인 다이얼로그 |
|------------|----------|---------------|
| 상품유형 | 사이즈, 소재/용지, 후가공, 수량 | "상품유형 변경 시 모든 하위 옵션이 초기화됩니다" |
| 사이즈 | 소재/용지, 후가공 (일부) | "사이즈 변경 시 소재/용지 선택이 초기화됩니다" |
| 소재/용지 | 없음 (독립적) | 불필요 |
| 후가공 | 없음 (독립적) | 불필요 |

### 2.2 팝업 동작 규칙

| 팝업 | 열기 조건 | 데이터 소스 | 선택 방식 |
|------|----------|-----------|----------|
| 사이즈 | 상품유형 선택 완료 | `GET /cascading/sizes?productTypeId={id}` | 다중선택 체크박스 |
| 소재 | 사이즈 선택 완료 + 상품유형=실사/굿즈 | `GET /cascading/materials?sizeId={id}` | 다중선택 체크박스 |
| 용지 | 사이즈 선택 완료 + 상품유형=인쇄/제본 | `GET /cascading/papers?sizeId={id}` | 다중선택 체크박스 |

### 2.3 비활성화 상태 표시 규칙

```
[상품유형] ────> 선택됨: 활성화
                미선택: "상품유형을 먼저 선택하세요"

[사이즈]   ────> 상품유형 선택 시: 활성화
                미선택: 비활성화 + "상품유형을 먼저 선택하세요"

[소재/용지] ──> 사이즈 선택 시: 활성화 (상품유형에 따라 소재 또는 용지)
                미선택: 비활성화 + "사이즈를 먼저 선택하세요"

[후가공]   ────> 소재/용지 선택 시: 활성화
                미선택: 비활성화 + "소재/용지를 먼저 선택하세요"

[수량]     ────> 항상 활성화 (기본값: 100)
```

---

## 3. 가격 계산 흐름

### 3.1 가격 계산 시퀀스

```mermaid
sequenceDiagram
    participant UI as React Admin
    participant Hook as usePriceCalculation
    participant BFF as NestJS BFF
    participant DB as PostgreSQL

    UI->>Hook: 옵션 변경 이벤트
    Hook->>Hook: debounce(300ms)
    Hook->>BFF: POST /api/admin/price/simulate

    Note over BFF: 가격 계산 로직
    BFF->>DB: 가격 매트릭스 조회 (price_code + options)
    DB-->>BFF: 매트릭스 데이터

    BFF->>BFF: 기본 출력비 계산 (수량 x 단가)
    BFF->>BFF: 용지비 계산 (종류 x 평량 x 수량)
    BFF->>BFF: 코팅비 계산 (종류 x 면적)

    alt 후가공 선택됨
        BFF->>DB: 후가공 가격 조회
        DB-->>BFF: 후가공 단가
        BFF->>BFF: 후가공비 합산
    end

    alt 제본 상품
        BFF->>DB: 제본 가격 조회
        DB-->>BFF: 제본 단가
        BFF->>BFF: 제본비 계산 (방식 x 페이지수)
    end

    alt 당일출고
        BFF->>BFF: 할증 적용 (+30~50%)
    end

    BFF-->>Hook: { total, breakdown: {output, paper, coating, finishing, binding}, unitPrice }
    Hook-->>UI: 가격 렌더링
```

### 3.2 가격 구성 내역 표시 형식

```
┌─────────────────────────────────────────┐
│ 가격 구성 내역                            │
├─────────────────────────────────────────┤
│ 기본 출력비 (A4/양면/500매)    ₩30,000  │
│ 용지비 (스노우지 250g)         ₩5,000   │
│ 코팅비 (유광 양면)              ₩3,000   │
│ 후가공비 (금박 1도)             ₩15,000  │
│ 제본비                          ₩0      │
├─────────────────────────────────────────┤
│ 소계                            ₩53,000  │
│ 당일출고 할증 (+30%)           ₩15,900  │
├─────────────────────────────────────────┤
│ 최종 가격                       ₩68,900  │
│ 단가 (매당)                    ₩137.80  │
└─────────────────────────────────────────┘
```

---

## 4. 가격관리 팝업 상호작용

### 4.1 DP 계열 (디지털인쇄) 가격 그리드

```
           │  100매  │  500매  │ 1,000매 │ 5,000매 │ 10,000매 │
───────────┼─────────┼─────────┼─────────┼─────────┼──────────┤
편면/무코팅 │ 12,000  │ 30,000  │ 35,000  │ 75,000  │ 100,000  │
편면/유광   │ 15,000  │ 37,500  │ 43,750  │ 93,750  │ 125,000  │
양면/무코팅 │ 20,000  │ 50,000  │ 58,000  │ 125,000 │ 166,000  │
양면/유광   │ 25,000  │ 62,500  │ 72,500  │ 156,250 │ 208,000  │
```

**편집 규칙**:
- 셀 클릭 시 인라인 편집 (숫자만 입력)
- Tab 키로 다음 셀 이동
- Enter로 저장, ESC로 취소
- 변경된 셀은 노란색 하이라이트
- 0원 입력 시 빨간색 테두리 + "가격은 0원 이상이어야 합니다" 경고

### 4.2 PR 계열 (제본) 가격 그리드

```
           │ 20p 이하 │ 21~50p │ 51~100p │ 101~200p │ 201p+ │
───────────┼──────────┼────────┼─────────┼──────────┼───────┤
무선제본    │ 5,000    │ 8,000  │ 15,000  │ 25,000   │ 별도  │
중철제본    │ 3,000    │ 5,000  │ -       │ -        │ -     │
스프링제본  │ 7,000    │ 10,000 │ 18,000  │ 30,000   │ 별도  │
양장제본    │ 15,000   │ 20,000 │ 35,000  │ 50,000   │ 별도  │
```

---

## 5. 낙관적 잠금 충돌 처리

### 5.1 동시 편집 충돌 시나리오

```mermaid
sequenceDiagram
    participant A as 관리자 A
    participant B as 관리자 B
    participant BFF as NestJS BFF
    participant DB as PostgreSQL

    A->>BFF: GET /price/matrix/DP02 (version=1)
    B->>BFF: GET /price/matrix/DP02 (version=1)

    A->>BFF: PUT /price/matrix/DP02 (version=1, 가격 변경)
    BFF->>DB: UPDATE WHERE version=1 → version=2
    BFF-->>A: 200 OK (version=2)

    B->>BFF: PUT /price/matrix/DP02 (version=1, 다른 가격 변경)
    BFF->>DB: UPDATE WHERE version=1 → FAIL (version 불일치)
    BFF-->>B: 409 Conflict

    Note over B: "다른 관리자가 이 가격을 수정했습니다.<br/>최신 데이터를 불러온 후 다시 수정해주세요."

    B->>BFF: GET /price/matrix/DP02 (version=2)
    BFF-->>B: 최신 데이터 (version=2)
```

---

## 6. 자동저장 로직

### 6.1 자동저장 타이머

```
폼 데이터 변경 감지
    └── isDirty = true
        └── 30초 타이머 시작
            └── 타이머 완료
                └── POST /api/admin/product/print/{id}/auto-save
                    ├── 성공: "자동저장 완료" 토스트 (3초)
                    └── 실패: 조용히 무시 (다음 주기에 재시도)
```

### 6.2 자동저장 복원 규칙

- 페이지 로드 시 `auto_save_data` 존재 여부 확인
- 존재 시: "임시저장된 데이터가 있습니다. 복원하시겠습니까?" 토스트 표시
- "복원" 선택: 임시저장 데이터로 폼 채우기
- "삭제" 선택: 임시저장 데이터 삭제, 빈 폼 표시
- 정상 저장 완료 시: 임시저장 데이터 자동 삭제

---

## 7. 조건부 표시 규칙

| # | 조건 | 표시 변화 |
|---|------|----------|
| 1 | 상품유형 미선택 | 사이즈 버튼 disabled, 안내 텍스트 표시 |
| 2 | 사이즈 미선택 | 소재/용지 버튼 disabled, 안내 텍스트 표시 |
| 3 | 상품유형=실사/굿즈 | 소재 선택 영역 표시, 용지 선택 영역 숨김 |
| 4 | 상품유형=인쇄/제본/패키지 | 용지 선택 영역 표시, 소재 선택 영역 숨김 |
| 5 | 가격 코드 미선택 | 가격관리 버튼 disabled |
| 6 | 당일출고 체크 | 할증율 입력 필드 표시 (30~50%) |
| 7 | 제본 상품 (PR01/PR02) | 페이지 수 입력 필드 표시 |
| 8 | 마스터 데이터 참조 중 | 삭제 버튼 비활성화, "비활성화" 버튼 표시 |
| 9 | 가격 매트릭스 변경 있음 | 저장 버튼 활성화, 변경 셀 하이라이트 |
| 10 | 폼 변경 있음 (dirty) | "저장하지 않은 변경사항이 있습니다" 이탈 경고 |

---

## 8. 쇼핑몰 주문페이지 인터랙션 (모듈 6)

> Figma option_NEW 분석 + option-dependency-map.md 기반

### 8.1 옵션 종속성 33개 규칙 통합 시퀀스

```mermaid
sequenceDiagram
    participant User as 사용자
    participant UI as React 주문페이지
    participant Engine as OptionEngine (프론트)
    participant BFF as NestJS BFF
    participant Cache as Redis

    Note over User,Cache: 1. 상품 카테고리 진입 시

    User->>UI: 상품 카테고리 페이지 접근
    UI->>BFF: GET /api/storefront/options/config?productType=PRINT
    BFF->>Cache: 옵션 설정 JSON 캐시 조회 (TTL: 24h)
    Cache-->>BFF: 옵션 그룹 설정 데이터
    BFF-->>UI: {optionGroups: [...], dependencies: [...], priceSummary: {...}}
    UI->>Engine: 옵션 엔진 초기화 (종속 규칙 등록)

    Note over User,Cache: 2. 사이즈 선택 시 (FILTER + RESET 트리거)

    User->>UI: 사이즈 "100x150mm" 선택
    UI->>Engine: handleOptionChange("SIZE", "100x150")
    Engine->>Engine: FILTER 규칙 실행: 종이 목록 필터링
    Engine->>Engine: RESET 규칙 실행: 하위 옵션 초기화
    Engine->>BFF: GET /api/storefront/options/cascading?productType=PRINT&size=100x150
    BFF->>Cache: 종속 옵션 캐시 조회 (TTL: 1h)
    BFF-->>Engine: {papers: [...], coatings: [...]}
    Engine-->>UI: 종이 드롭다운 갱신, 하위 옵션 리셋

    Note over User,Cache: 3. 가격 영향 옵션 변경 시

    User->>UI: 종이 "몽블랑 190g" 선택
    UI->>Engine: handleOptionChange("PAPER", "MONGBLANC_190")
    Engine->>Engine: debounce(300ms) 타이머 시작
    Engine->>BFF: POST /api/storefront/price/calculate
    BFF-->>Engine: {total: 55000, tax: 5500, breakdown: {...}, unitPrice: 110}
    Engine-->>UI: 가격 Summary 실시간 갱신

    Note over User,Cache: 4. SHOW_HIDE 트리거 (박/형압)

    User->>UI: 박/형압 섹션 펼침 → 박(앞면) "있음" 선택
    UI->>Engine: handleOptionChange("FOIL_FRONT", "있음")
    Engine->>Engine: SHOW_HIDE 규칙: 박(앞면) 칼라 + 크기 표시
    Engine-->>UI: ColorChip 8종 + 크기 Input(mm) 표시
```

### 8.2 가격 실시간 갱신 트리거 매트릭스

가격 재계산은 아래 옵션 변경 시 debounce(300ms) 후 자동 트리거됩니다.

| 옵션 변경 | 인쇄 | 제본 | 문구 | 포토 | 캘린더 | 디캘 | 액세 | 아크릴 | 실사 | 스티커 | 굿즈 |
|----------|:----:|:----:|:----:|:----:|:-----:|:----:|:----:|:-----:|:----:|:-----:|:----:|
| 사이즈 | O | O | O | O | O | O | O | O | O | O | O |
| 종이/소재 | O | O | O | - | O | O | - | O | O | O | - |
| 인쇄방식 | O | O | - | - | O | - | - | - | - | O | - |
| 별색인쇄 | O | - | - | - | - | - | - | - | O | O | - |
| 코팅 | O | O | - | - | - | - | - | - | - | - | - |
| 커팅 | O | - | - | - | - | - | - | - | - | O | - |
| 수량 | O | O | O | O | O | O | O | O | O | O | O |
| 건수 | O | - | - | - | - | - | - | - | - | - | - |
| 후가공 | O | - | - | - | - | - | - | - | - | O | - |
| 박/형압 | O | O | - | - | - | - | - | - | - | - | - |
| 봉투/포장 | O | O | O | - | O | O | - | O | - | - | O |
| 크기직접입력 | - | - | - | - | - | - | - | O | O | - | - |
| 소재 컬러 | - | - | - | - | - | - | - | - | - | - | O |

### 8.3 Collapsible 토글 인터랙션

```mermaid
stateDiagram-v2
    [*] --> Collapsed

    Collapsed --> Expanded : 클릭 "▶ 후가공" 또는 "▶ 박/형압 가공"
    Expanded --> Collapsed : 클릭 "▼ 후가공" 또는 "▼ 박/형압 가공"

    state Expanded {
        [*] --> SubOptionIdle
        SubOptionIdle --> SubOptionSelected : 세부 옵션 선택
        SubOptionSelected --> SubOptionSelected : 추가 옵션 변경
        SubOptionSelected --> PriceRecalc : 가격 영향 옵션 변경
        PriceRecalc --> SubOptionSelected : 가격 갱신 완료
    }

    note right of Collapsed
        접힌 상태에서도
        선택된 옵션 요약 표시
        (예: "금박 1도 / 형압 양각")
    end note
```

### 8.4 구간할인 슬라이더 인터랙션 (문구/아크릴/굿즈)

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Slider as 구간할인 슬라이더
    participant Table as 단가 테이블
    participant Summary as 가격 Summary

    User->>Slider: 슬라이더 드래그 (수량 변경)
    Slider->>Slider: 수량 구간 스냅 (1, 10, 50, 100, 500, 1000)
    Slider->>Table: 현재 수량 구간 하이라이트
    Table->>Table: 행 하이라이트 (예: 100개 = 2,800원/개)

    Note over Table: 단가 테이블 예시 (문구)
    Note over Table: 1개: 3,260원
    Note over Table: 10개: 3,100원
    Note over Table: 50개: 2,950원
    Note over Table: 100개: 2,800원 ← 하이라이트
    Note over Table: 500개: 2,500원
    Note over Table: 1000개: 2,200원

    Slider->>Summary: 가격 재계산 트리거
    Summary->>Summary: 본체가 = 2,800 × 100 = 280,000원
    Summary->>Summary: 부가세 = 28,000원
    Summary->>Summary: 합계 = 308,000원
```

### 8.5 상품 카테고리 전환 시 옵션 세트 교체

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Router as Next.js Router
    participant UI as 주문페이지 컴포넌트
    participant Engine as OptionEngine

    User->>Router: 카테고리 변경 (예: 인쇄 -> 제본)
    Router->>UI: productType 파라미터 변경
    UI->>Engine: destroyEngine() (이전 옵션 정리)
    UI->>Engine: initEngine(productType="BOOK")
    Engine->>Engine: 새 옵션 설정 JSON 로드
    Engine->>Engine: 종속 규칙 재등록 (제본용 33개 중 해당 규칙)
    Engine-->>UI: 제본 옵션 세트 렌더링
    Note over UI: 내지/표지 분리 UI, 띠걸이 Image Button 등
```
