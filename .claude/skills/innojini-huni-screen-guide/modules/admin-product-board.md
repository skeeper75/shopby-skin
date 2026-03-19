# B-4~B-6: 상품관리/게시판관리/회원관리 (33 화면)

## 목차

### B-4 상품관리 (18 화면)
- [SCR-B4-PRINT-REG: 인쇄/제본 상품등록](#scr-b4-print-reg)
- [SCR-B4-SIZE-POPUP: 사이즈 팝업](#scr-b4-size-popup)
- [SCR-B4-MATERIAL-POPUP: 소재 팝업](#scr-b4-material-popup)
- [SCR-B4-PAPER-POPUP: 종이 팝업](#scr-b4-paper-popup)
- [SCR-B4-PRICE-POPUP: 가격관리 팝업 (8종)](#scr-b4-price-popup)
- [SCR-B4-SIZE-MASTER: 사이즈 마스터](#scr-b4-size-master)
- [SCR-B4-MATERIAL-MASTER: 소재 마스터](#scr-b4-material-master)
- [SCR-B4-PAPER-MASTER: 용지 마스터](#scr-b4-paper-master)
- [SCR-B4-PRICE-MASTER: 가격 마스터](#scr-b4-price-master)
- [SCR-B4-GOODS-CAT: 굿즈 카테고리](#scr-b4-goods-cat)
- [SCR-B4-GOODS-REG: 굿즈 등록](#scr-b4-goods-reg)
- [SCR-B4-HANDMADE-REG: 수작 등록](#scr-b4-handmade-reg)
- [SCR-B4-PACKAGING-REG: 포장재 등록](#scr-b4-packaging-reg)
- [SCR-B4-DESIGN-REG: 디자인 등록](#scr-b4-design-reg)

### B-5 게시판관리 (9 화면)
- [SCR-B5-NOTICE: 공지사항 관리](#scr-b5-notice)
- [SCR-B5-FAQ: FAQ 관리](#scr-b5-faq)
- [SCR-B5-BULK-QUOTE: 대량견적 관리](#scr-b5-bulk-quote)
- [SCR-B5-CORP-CONSULT: 기업상담 관리](#scr-b5-corp-consult)
- [SCR-B5-DESIGN-CONSULT: 디자인상담 관리](#scr-b5-design-consult)
- [SCR-B5-PRODUCT-QA: 상품Q&A 관리](#scr-b5-product-qa)
- [SCR-B5-INQUIRY: 1:1문의 관리](#scr-b5-inquiry)
- [SCR-B5-EXPERIENCE: 체험단 관리](#scr-b5-experience)
- [SCR-B5-REVIEW: 이용후기 관리](#scr-b5-review)

### B-6 회원관리 (6 화면)
- [SCR-B6-MEMBER: 회원 관리](#scr-b6-member)
- [SCR-B6-WITHDRAWN: 탈퇴 회원](#scr-b6-withdrawn)
- [SCR-B6-PRINTING-MONEY: 프린팅머니 관리](#scr-b6-printing-money)
- [SCR-B6-COUPON-MGMT: 쿠폰 관리](#scr-b6-coupon-mgmt)
- [SCR-B6-COUPON-ISSUE: 쿠폰 등록 내역](#scr-b6-coupon-issue)
- [SCR-B6-COUPON-USE: 쿠폰 사용 내역](#scr-b6-coupon-use)

---

## 공통 어드민 패턴

모든 어드민 화면: **Desktop-only (>=1024px)**, Tailwind CSS + shadcn/ui

**AdminLayout 공통 구조**:
```
AdminLayout
  └── Sidebar (nav)
  └── Content
        ├── PageHeader (title + breadcrumb)
        ├── FilterSection (collapsible, Card)
        │     ├── 검색 조건 필드들
        │     └── Button[빨강] "검색" + Button[outline] "초기화"
        └── ResultSection
              ├── StatusTabs (뱃지 카운트)
              ├── ActionBar (일괄선택 + 액션 버튼)
              ├── DataTable (checkbox + 정렬 + 행 액션)
              └── Pagination (30/100 + 엑셀 export)
```

**DetailPanel 공통 패턴**: DataTable 행 클릭 → Sheet(drawer) 우측 슬라이드

---

## SCR-B4-PRINT-REG

**인쇄/제본 상품등록 | CUSTOM | 우선순위 1 | 규모 XL**

### 1. 화면 개요

- ID: SCR-B4-PRINT-REG
- 화면명: 인쇄/제본 상품등록
- 분류: CUSTOM (자체 상품 관리 API)
- 우선순위: 1
- 규모: XL (멀티스텝 폼 + 옵션 의존성 빌더 + 미리보기 패널)
- 비고: 인쇄/제본 상품의 복잡한 옵션 조합을 관리하는 핵심 화면. 사이즈→소재→용지→후가공 순서로 의존성 있는 옵션을 설정하고, 각 조합별 가격을 등록

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ AdminLayout                                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ [인쇄/제본 상품등록]                                          │  │
│  │ 홈 > 상품관리 > 인쇄/제본 상품등록                            │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ StepIndicator                                                 │  │
│  │  (1)기본정보 ─── (2)옵션설정 ─── (3)가격설정 ─── (4)미리보기 │  │
│  │     [현재]         [대기]          [대기]          [대기]     │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │ ┌── Step 1: 기본정보 ──────────────────────────────────────┐  │  │
│  │ │ FormLayout (Card)                                        │  │  │
│  │ │  상품분류*   ( ) 인쇄  (•) 제본                          │  │  │
│  │ │  상품명*     [________________________________]           │  │  │
│  │ │  카테고리*   [1차 ▼] [2차 ▼] [3차 ▼]                    │  │  │
│  │ │  대표이미지* [이미지 업로드 영역 (드래그&드롭)]           │  │  │
│  │ │  상품설명    [WYSIWYG Editor ──────────────────]          │  │  │
│  │ │  최소수량*   [____] ~ 최대수량* [____]                    │  │  │
│  │ │  제작일*     [____] 영업일                                │  │  │
│  │ │  상태*       (•) 판매중 ( ) 판매중지 ( ) 숨김            │  │  │
│  │ │  정렬순서    [____]                                       │  │  │
│  │ └──────────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │ ┌── Step 2: 옵션설정 ──────────────────────────────────────┐  │  │
│  │ │ OptionDependencyBuilder                                  │  │  │
│  │ │  ┌──────────┐   ┌──────────┐   ┌──────────┐             │  │  │
│  │ │  │ 사이즈    │──▶│ 소재     │──▶│ 용지     │             │  │  │
│  │ │  │ [+ 추가]  │   │ [+ 추가] │   │ [+ 추가] │             │  │  │
│  │ │  │ A4       │   │ 아트지   │   │ 스노우화이트│           │  │  │
│  │ │  │ A3       │   │ 모조지   │   │ 랑데부     │           │  │  │
│  │ │  │ B5       │   │ 크라프트 │   │ 마시멜로   │           │  │  │
│  │ │  └──────────┘   └──────────┘   └──────────┘             │  │  │
│  │ │                                                          │  │  │
│  │ │  후가공 옵션 (멀티셀렉트):                                │  │  │
│  │ │  [v] 코팅(무광)  [v] 코팅(유광)  [ ] 박  [ ] 형압       │  │  │
│  │ │  [ ] 오시  [v] 미싱  [ ] 타공  [ ] 귀도리               │  │  │
│  │ │                                                          │  │  │
│  │ │  옵션 의존성 매트릭스:                                    │  │  │
│  │ │  사이즈[A4] → 소재[아트지,모조지] → 용지[스노우화이트]   │  │  │
│  │ │  사이즈[A4] → 소재[크라프트] → 용지[크라프트지]          │  │  │
│  │ │  사이즈[A3] → 소재[아트지] → 용지[스노우화이트,랑데부]   │  │  │
│  │ └──────────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │ ┌── Step 3: 가격설정 ──────────────────────────────────────┐  │  │
│  │ │ PriceConfigPanel                                         │  │  │
│  │ │  옵션 조합 선택: [A4/아트지/스노우화이트 ▼]              │  │  │
│  │ │                                                          │  │  │
│  │ │  [가격 매트릭스 (수량 x 단가)]                           │  │  │
│  │ │  수량       100  200  300  500  1000                     │  │  │
│  │ │  단면인쇄   50   45   40   35   30                       │  │  │
│  │ │  양면인쇄   80   72   65   55   48                       │  │  │
│  │ │                                                          │  │  │
│  │ │  후가공 추가 가격:                                        │  │  │
│  │ │  코팅(무광) +5원/매  코팅(유광) +7원/매  미싱 +3원/매    │  │  │
│  │ │                                                          │  │  │
│  │ │  [가격관리 팝업 열기]  [일괄 적용]                       │  │  │
│  │ └──────────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │ ┌── Step 4: 미리보기 ──────────────────────────────────────┐  │  │
│  │ │ PreviewPanel                                             │  │  │
│  │ │  ┌─────────────────────┐  ┌───────────────────────────┐ │  │  │
│  │ │  │ 상품 미리보기       │  │ 옵션 요약                 │ │  │  │
│  │ │  │ [대표 이미지]       │  │ 사이즈: A4, A3, B5       │ │  │  │
│  │ │  │ 상품명: 명함 인쇄   │  │ 소재: 아트지, 모조지...  │ │  │  │
│  │ │  │ 분류: 인쇄          │  │ 가격 범위: 30~80원/매    │ │  │  │
│  │ │  │ 상태: 판매중        │  │ 옵션 조합: 12개          │ │  │  │
│  │ │  └─────────────────────┘  └───────────────────────────┘ │  │  │
│  │ └──────────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │ ┌────────────────────────────────────────────────────────┐    │  │
│  │ │  [이전] [임시저장]                    [다음/등록(빨강)] │    │  │
│  │ └────────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PrintProductRegPage
  ├── PageHeader (title, breadcrumb)
  ├── StepIndicator
  │     └── StepItem × 4 (기본정보, 옵션설정, 가격설정, 미리보기)
  ├── StepContent
  │     ├── Step1_BasicInfo (Card)
  │     │     ├── RadioGroup: productType (인쇄/제본)
  │     │     ├── Input: productName
  │     │     ├── CascadeSelect × 3: category (1차/2차/3차)
  │     │     ├── ImageUploader: mainImage (드래그&드롭, 최대 5MB)
  │     │     ├── RichTextEditor: description (WYSIWYG)
  │     │     ├── Input: minQuantity, maxQuantity (number)
  │     │     ├── Input: productionDays (number)
  │     │     ├── RadioGroup: status (판매중/판매중지/숨김)
  │     │     └── Input: sortOrder (number)
  │     ├── Step2_OptionSetting
  │     │     ├── OptionDependencyBuilder
  │     │     │     ├── OptionColumn: size
  │     │     │     │     ├── OptionItem × N (사이즈 마스터에서 선택)
  │     │     │     │     └── Button "+" → SCR-B4-SIZE-POPUP 열기
  │     │     │     ├── OptionColumn: material
  │     │     │     │     ├── OptionItem × N (소재 마스터에서 선택)
  │     │     │     │     └── Button "+" → SCR-B4-MATERIAL-POPUP 열기
  │     │     │     └── OptionColumn: paper
  │     │     │           ├── OptionItem × N (용지 마스터에서 선택)
  │     │     │           └── Button "+" → SCR-B4-PAPER-POPUP 열기
  │     │     ├── PostProcessingSelector (CheckboxGroup)
  │     │     │     └── CheckboxItem × N (코팅, 박, 형압, 오시, 미싱, 타공, 귀도리)
  │     │     └── DependencyMatrix (읽기 전용 요약 테이블)
  │     ├── Step3_PriceSetting
  │     │     ├── Select: optionCombination (옵션 조합 선택)
  │     │     ├── PriceMatrix (수량 × 인쇄면 그리드, 인라인 편집)
  │     │     ├── PostProcessingPriceList (후가공별 추가 단가)
  │     │     ├── Button "가격관리 팝업" → SCR-B4-PRICE-POPUP 열기
  │     │     └── Button "일괄 적용" (선택 조합의 가격을 다른 조합에 복사)
  │     └── Step4_Preview
  │           └── PreviewPanel (SplitLayout)
  │                 ├── ProductPreview (이미지 + 기본정보)
  │                 └── OptionSummary (옵션 조합 수, 가격 범위)
  └── StepNavigation
        ├── Button[outline] "이전"
        ├── Button[outline] "임시저장"
        └── Button[red] "다음" / "등록" (마지막 스텝)
```

### 4. Props / States

```typescript
interface PrintProductForm {
  // Step 1: 기본정보
  productType: "PRINT" | "BINDING";
  productName: string;
  categoryPath: [string, string, string]; // 1차/2차/3차
  mainImage: File | null;
  description: string;
  minQuantity: number;
  maxQuantity: number;
  productionDays: number;
  status: "ON_SALE" | "SUSPENDED" | "HIDDEN";
  sortOrder: number;

  // Step 2: 옵션설정
  sizes: SizeOption[];       // 사이즈 마스터에서 선택된 항목
  materials: MaterialOption[]; // 소재 마스터에서 선택된 항목
  papers: PaperOption[];     // 용지 마스터에서 선택된 항목
  postProcessings: string[]; // 후가공 코드 배열
  dependencies: OptionDependency[]; // 사이즈→소재→용지 의존성 매핑

  // Step 3: 가격설정
  priceRules: PriceRule[];   // 옵션 조합별 수량-단가 매트릭스
  postProcessingPrices: PostProcessingPrice[]; // 후가공별 추가 단가
}

interface OptionDependency {
  sizeCode: string;
  materialCodes: string[];
  paperCodes: string[];      // 사이즈+소재 조합에 허용된 용지
}

interface PriceRule {
  optionCombinationKey: string; // "A4_ART_SNOW" 형태
  quantities: number[];         // [100, 200, 300, 500, 1000]
  singleSidePrices: number[];   // 수량별 단면 단가
  doubleSidePrices: number[];   // 수량별 양면 단가
}

interface PostProcessingPrice {
  code: string;     // 후가공 코드
  name: string;     // 후가공명
  unitPrice: number; // 매당 추가 단가
}

// 스텝 상태
interface StepState {
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  isDirty: boolean;        // 임시저장 필요 여부
  draftId?: string;        // 임시저장 ID
}
```

### 5. API 매핑

```
POST /admin/custom/products/print
  Body: PrintProductForm 전체
  Response: { productNo, productName, status, createdAt }

PUT /admin/custom/products/print/{productNo}
  Body: PrintProductForm 전체
  Response: 수정된 상품 정보

POST /admin/custom/products/print/draft
  Body: PrintProductForm (부분)
  Response: { draftId, savedAt }

GET /admin/custom/products/print/draft/{draftId}
  Response: 저장된 임시 폼 데이터

GET /admin/custom/masters/sizes
  Query: productType
  Response: { list: SizeOption[] }

GET /admin/custom/masters/materials
  Query: productType
  Response: { list: MaterialOption[] }

GET /admin/custom/masters/papers
  Query: materialCode
  Response: { list: PaperOption[] }

GET /admin/custom/masters/post-processings
  Response: { list: PostProcessingOption[] }

GET /admin/custom/categories
  Query: parentCode, depth
  Response: { list: CategoryItem[] }
```

### 6. 데이터 플로우

```
StepIndicator.onChange(step)
  └── 현재 스텝 유효성 검사 → 실패 시 이동 차단 + 에러 표시

Step1: CascadeSelect[1차].onChange
  └── GET /admin/custom/categories?parentCode=selected&depth=2
        └── 2차 셀렉트 옵션 갱신 → 3차 초기화

Step2: OptionColumn[size] "+" 클릭
  └── SCR-B4-SIZE-POPUP 모달 열기
        └── 선택 완료 → sizes[] 갱신 → DependencyMatrix 재계산

Step2: OptionDependencyBuilder 의존성 변경
  └── dependencies[] 갱신 → Step3 가격 조합 목록 갱신

Step3: Select[optionCombination].onChange
  └── 해당 조합의 PriceMatrix 로드

Step3: Button "가격관리 팝업" 클릭
  └── SCR-B4-PRICE-POPUP 모달 열기 (해당 조합 컨텍스트 전달)
        └── 저장 완료 → priceRules[] 갱신

Step3: Button "일괄 적용" 클릭
  └── 확인 Dialog → 선택 조합의 가격을 지정된 다른 조합에 복사

StepNavigation: "임시저장" 클릭
  └── POST /admin/custom/products/print/draft → draftId 저장 + 토스트

StepNavigation: "등록" 클릭 (Step 4)
  └── 전체 유효성 검사 → POST /admin/custom/products/print
        └── 성공: 상품 목록으로 이동 + 토스트
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 스텝 전환 | 다음/이전 버튼 | StepIndicator 활성 스텝 변경, 현재 스텝 유효성 검사 |
| 옵션 팝업 열기 | "+" 버튼 | 모달 Dialog 오버레이 |
| 의존성 설정 | 소재/용지 체크 변경 | DependencyMatrix 실시간 갱신 |
| 가격 인라인 편집 | 셀 클릭 | Input 활성화, blur 시 저장 |
| 일괄 가격 적용 | 버튼 클릭 | 확인 Dialog "N개 조합에 가격을 복사합니다" |
| 임시저장 | 버튼 클릭 | 버튼 disabled + 스피너 → 토스트 "임시저장 완료" |
| 등록 진행 | 등록 버튼 | 전체 유효성 검사 → 확인 Dialog → 버튼 disabled + 스피너 |
| 등록 성공 | API 200 | 토스트 "상품이 등록되었습니다" + 목록 이동 |
| 미완료 스텝 이동 | 완료되지 않은 스텝 클릭 | 토스트 "현재 스텝을 완료해주세요" |
| 페이지 이탈 | 뒤로가기/네비 | 확인 Dialog "저장하지 않은 변경사항이 있습니다" |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 유효성 실패 (스텝별) | 해당 스텝으로 이동 + 필드별 인라인 에러 표시 |
| 이미지 업로드 실패 (413) | 토스트 "이미지 크기는 5MB 이하" |
| 중복 상품명 (409) | Step1 상품명 필드 인라인 에러 |
| 옵션 조합 없음 | Step2에서 "하나 이상의 옵션 조합을 설정하세요" 경고 |
| 가격 미설정 조합 존재 | Step3에서 "모든 조합의 가격을 입력하세요" 경고 |
| 임시저장 실패 (500) | 토스트 에러 + 재시도 버튼 |
| 등록 실패 (500) | 토스트 에러 + 재시도 (폼 데이터 유지) |

### 9. 주의사항

- 멀티스텝 폼은 각 스텝 완료 시 로컬 상태 보존 (뒤로 이동 시 데이터 유지)
- 옵션 의존성은 순방향만 (사이즈→소재→용지), 역방향 수정 시 하위 의존성 초기화 확인 Dialog
- 가격 매트릭스의 수량 구간은 기본정보의 최소/최대수량 범위 내에서 자동 생성
- 임시저장은 5분 간격 자동저장 + 수동저장 병행
- 대표이미지는 필수, 최대 5MB, jpg/png/webp 허용
- 후가공 가격은 매당 추가 단가로, 인쇄 단가에 합산되어 표시

---

## SCR-B4-SIZE-POPUP

**사이즈 팝업 | CUSTOM | 우선순위 1 | 규모 S**

### 1. 화면 개요

- ID: SCR-B4-SIZE-POPUP
- 화면명: 사이즈 팝업
- 분류: CUSTOM
- 우선순위: 1
- 규모: S (모달 내 검색 + 데이터 테이블 + 선택)
- 비고: 인쇄/제본 상품등록 Step2에서 사이즈 선택 시 열리는 팝업

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────┐
│ Dialog (max-w-lg)                        │
│  [사이즈 선택]                    [X]    │
│  ┌─────────────────────────────────────┐│
│  │ 검색 [______________] [검색]        ││
│  ├─────────────────────────────────────┤│
│  │ [v] 코드   사이즈명     규격(mm)   ││
│  │ [v] A4     A4          210x297     ││
│  │ [ ] A3     A3          297x420     ││
│  │ [v] B5     B5          176x250     ││
│  ├─────────────────────────────────────┤│
│  │            [취소]  [선택(빨강)]     ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
SizePopup (Dialog)
  ├── DialogHeader (title, closeButton)
  ├── SearchBar (Input + Button)
  ├── DataTable (checkbox, 코드, 사이즈명, 규격)
  └── DialogFooter
        ├── Button[outline] "취소"
        └── Button[red] "선택"
```

### 4. Props / States

```typescript
interface SizePopupProps {
  open: boolean;
  productType: "PRINT" | "BINDING";
  selectedCodes: string[];           // 이미 선택된 사이즈 코드
  onSelect: (sizes: SizeOption[]) => void;
  onClose: () => void;
}
```

### 5. API 매핑

```
GET /admin/custom/masters/sizes
  Query: productType, keyword
  Response: { list: SizeOption[] }
```

### 6. 데이터 플로우

```
Dialog 열림 → GET /admin/custom/masters/sizes → DataTable 렌더
SearchBar.onSearch → 필터링된 결과 표시
Button "선택" → onSelect(checkedSizes) → Dialog 닫힘
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 로딩 | Dialog 열림 | 테이블 스켈레톤 |
| 검색 | 검색 버튼 | 테이블 필터링 |
| 선택 완료 | 선택 버튼 | Dialog 닫힘, 부모 상태 갱신 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 목록 로드 실패 (500) | 토스트 에러 + 재시도 버튼 |
| 선택 없이 확인 | "하나 이상의 사이즈를 선택하세요" 토스트 |

### 9. 주의사항

- 이미 선택된 사이즈는 체크 상태로 표시
- 사이즈 마스터에 등록된 항목만 노출

---

## SCR-B4-MATERIAL-POPUP

**소재 팝업 | CUSTOM | 우선순위 1 | 규모 S**

### 1. 화면 개요

- ID: SCR-B4-MATERIAL-POPUP
- 화면명: 소재 팝업
- 분류: CUSTOM
- 우선순위: 1
- 규모: S (모달 내 검색 + 데이터 테이블 + 선택)
- 비고: 인쇄/제본 상품등록 Step2에서 소재 선택 시 열리는 팝업

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────┐
│ Dialog (max-w-lg)                        │
│  [소재 선택]                      [X]    │
│  ┌─────────────────────────────────────┐│
│  │ 검색 [______________] [검색]        ││
│  ├─────────────────────────────────────┤│
│  │ [v] 코드     소재명     설명       ││
│  │ [v] ART      아트지     고급 광택  ││
│  │ [ ] MOJO     모조지     무광 자연  ││
│  │ [v] KRAFT    크라프트   친환경     ││
│  ├─────────────────────────────────────┤│
│  │            [취소]  [선택(빨강)]     ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
MaterialPopup (Dialog)
  ├── DialogHeader (title, closeButton)
  ├── SearchBar (Input + Button)
  ├── DataTable (checkbox, 코드, 소재명, 설명)
  └── DialogFooter
        ├── Button[outline] "취소"
        └── Button[red] "선택"
```

### 4. Props / States

```typescript
interface MaterialPopupProps {
  open: boolean;
  productType: "PRINT" | "BINDING";
  selectedCodes: string[];
  onSelect: (materials: MaterialOption[]) => void;
  onClose: () => void;
}
```

### 5. API 매핑

```
GET /admin/custom/masters/materials
  Query: productType, keyword
  Response: { list: MaterialOption[] }
```

### 6. 데이터 플로우

```
Dialog 열림 → GET /admin/custom/masters/materials → DataTable 렌더
SearchBar.onSearch → 필터링된 결과 표시
Button "선택" → onSelect(checkedMaterials) → Dialog 닫힘
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 로딩 | Dialog 열림 | 테이블 스켈레톤 |
| 검색 | 검색 버튼 | 테이블 필터링 |
| 선택 완료 | 선택 버튼 | Dialog 닫힘, 부모 상태 갱신 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 목록 로드 실패 (500) | 토스트 에러 + 재시도 버튼 |
| 선택 없이 확인 | "하나 이상의 소재를 선택하세요" 토스트 |

### 9. 주의사항

- 이미 선택된 소재는 체크 상태로 표시
- 소재 마스터에 등록된 항목만 노출

---

## SCR-B4-PAPER-POPUP

**종이 팝업 | CUSTOM | 우선순위 1 | 규모 S**

### 1. 화면 개요

- ID: SCR-B4-PAPER-POPUP
- 화면명: 종이 팝업
- 분류: CUSTOM
- 우선순위: 1
- 규모: S (모달 내 검색 + 데이터 테이블 + 선택)
- 비고: 인쇄/제본 상품등록 Step2에서 용지 선택 시 열리는 팝업

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────┐
│ Dialog (max-w-lg)                             │
│  [종이 선택]                           [X]    │
│  ┌──────────────────────────────────────────┐│
│  │ 소재필터 [아트지 ▼]  검색 [______] [검색]││
│  ├──────────────────────────────────────────┤│
│  │ [v] 코드   용지명        평량  색상     ││
│  │ [v] SNOW   스노우화이트  250g  백색     ││
│  │ [ ] RNDV   랑데부        300g  미색     ││
│  │ [v] MARSH  마시멜로      270g  백색     ││
│  ├──────────────────────────────────────────┤│
│  │              [취소]  [선택(빨강)]        ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PaperPopup (Dialog)
  ├── DialogHeader (title, closeButton)
  ├── FilterBar
  │     ├── Select: materialFilter (소재별 필터)
  │     └── SearchBar (Input + Button)
  ├── DataTable (checkbox, 코드, 용지명, 평량, 색상)
  └── DialogFooter
        ├── Button[outline] "취소"
        └── Button[red] "선택"
```

### 4. Props / States

```typescript
interface PaperPopupProps {
  open: boolean;
  materialCode: string;        // 선택된 소재 코드로 필터
  selectedCodes: string[];
  onSelect: (papers: PaperOption[]) => void;
  onClose: () => void;
}
```

### 5. API 매핑

```
GET /admin/custom/masters/papers
  Query: materialCode, keyword
  Response: { list: PaperOption[] }
```

### 6. 데이터 플로우

```
Dialog 열림 → GET /admin/custom/masters/papers?materialCode → DataTable 렌더
Select[materialFilter].onChange → 재조회
Button "선택" → onSelect(checkedPapers) → Dialog 닫힘
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 로딩 | Dialog 열림 | 테이블 스켈레톤 |
| 소재 필터 변경 | 드롭다운 선택 | 테이블 재조회 |
| 선택 완료 | 선택 버튼 | Dialog 닫힘, 부모 상태 갱신 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 목록 로드 실패 (500) | 토스트 에러 + 재시도 버튼 |
| 선택 없이 확인 | "하나 이상의 용지를 선택하세요" 토스트 |

### 9. 주의사항

- 소재별로 사용 가능한 용지가 다르므로 materialCode 필터 필수
- 이미 선택된 용지는 체크 상태로 표시

---

## SCR-B4-PRICE-POPUP

**가격관리 팝업 (8종) | CUSTOM | 우선순위 1 | 규모 L**

### 1. 화면 개요

- ID: SCR-B4-PRICE-POPUP-1~8
- 화면명: 가격관리 팝업 (8종)
- 분류: CUSTOM
- 우선순위: 1
- 규모: L (수량x옵션 가격 매트릭스 그리드 + 일괄편집 툴바)
- 비고: 인쇄 유형별 8종 팝업 (명함, 전단, 리플렛, 포스터, 봉투, 스티커, 제본, 기타). 각 팝업은 해당 상품 유형의 옵션 조합에 따라 수량별 단가를 매트릭스 형태로 편집

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────────────┐
│ Dialog (max-w-4xl, fullscreen 옵션)                               │
│  [가격관리 - 명함 인쇄]                                    [X]   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ BulkEditToolbar                                            │  │
│  │  옵션조합: [A4/아트지/스노우화이트 ▼]                      │  │
│  │  인쇄면:   [전체 ▼]                                        │  │
│  │  일괄 작업: [선택 행 +10%] [선택 행 -10%] [선택 행 값 입력]│  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ PriceMatrix (수량 x 옵션 그리드)                           │  │
│  │                                                            │  │
│  │  [ ] 수량 ＼ 인쇄면  │  단면    │  양면    │               │  │
│  │  ─────────────────────┼─────────┼─────────┤               │  │
│  │  [ ]  100             │  [50]   │  [80]   │               │  │
│  │  [ ]  200             │  [45]   │  [72]   │               │  │
│  │  [ ]  300             │  [40]   │  [65]   │               │  │
│  │  [ ]  500             │  [35]   │  [55]   │               │  │
│  │  [v] 1000             │  [30]   │  [48]   │               │  │
│  │  ─────────────────────┼─────────┼─────────┤               │  │
│  │  [+ 수량 구간 추가]                                        │  │
│  │                                                            │  │
│  │  후가공 추가 단가:                                         │  │
│  │  코팅(무광) [5]원/매  코팅(유광) [7]원/매  미싱 [3]원/매   │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  [다른 조합에 복사]  [초기화]          [취소]  [저장(빨강)] │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PricePopup (Dialog, max-w-4xl)
  ├── DialogHeader (title: "가격관리 - {상품유형}", closeButton)
  ├── BulkEditToolbar
  │     ├── Select: optionCombination
  │     ├── Select: printSideFilter (전체/단면/양면)
  │     └── BulkActions
  │           ├── Button "+N%" (선택 행 비율 인상)
  │           ├── Button "-N%" (선택 행 비율 인하)
  │           └── Button "값 입력" (선택 행 고정값 설정)
  ├── PriceMatrix
  │     ├── MatrixHeader (수량 \ 인쇄면 컬럼)
  │     ├── MatrixRow × N
  │     │     ├── Checkbox (행 선택)
  │     │     ├── QuantityLabel
  │     │     └── PriceCell × M (인라인 편집 Input[number])
  │     └── Button "수량 구간 추가"
  ├── PostProcessingPriceSection
  │     └── PriceInput × N (후가공별 추가 단가)
  └── DialogFooter
        ├── Button[outline] "다른 조합에 복사"
        ├── Button[outline] "초기화"
        ├── Button[outline] "취소"
        └── Button[red] "저장"
```

### 4. Props / States

```typescript
interface PricePopupProps {
  open: boolean;
  productType: string;           // 상품 유형 (명함, 전단 등)
  optionCombinations: OptionCombination[];
  currentCombinationKey: string;
  priceRules: PriceRule[];
  postProcessingPrices: PostProcessingPrice[];
  onSave: (priceRules: PriceRule[], ppPrices: PostProcessingPrice[]) => void;
  onClose: () => void;
}

interface PriceMatrixState {
  selectedRows: number[];        // 체크된 수량 행 인덱스
  editingCell: { row: number; col: number } | null;
  isDirty: boolean;
}
```

### 5. API 매핑

```
GET /admin/custom/prices/{productNo}
  Query: optionCombinationKey
  Response: { priceRules: PriceRule[], postProcessingPrices: PostProcessingPrice[] }

PUT /admin/custom/prices/{productNo}
  Body: { optionCombinationKey, priceRules[], postProcessingPrices[] }
  Response: { updatedAt }

POST /admin/custom/prices/{productNo}/copy
  Body: { fromKey, toKeys[] }
  Response: { copiedCount }
```

### 6. 데이터 플로우

```
Dialog 열림 → props로 전달된 priceRules 로컬 상태에 복사

Select[optionCombination].onChange
  └── 현재 편집 상태 저장 확인 → 해당 조합 가격 데이터 로드

PriceCell 편집 → 로컬 상태 업데이트 (isDirty = true)

BulkActions "+N%" 클릭
  └── Popover에서 비율 입력 → selectedRows의 모든 셀에 비율 적용

Button "수량 구간 추가" → Input 팝업에서 수량 입력 → 매트릭스 행 추가

Button "다른 조합에 복사"
  └── 복사 대상 조합 선택 Dialog → POST /admin/custom/prices/{productNo}/copy

Button "저장" → PUT /admin/custom/prices/{productNo} → 성공 시 onSave 콜백
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 셀 편집 모드 | 셀 클릭 | Input 활성화, 포커스 |
| 셀 편집 완료 | blur/Enter | 값 저장, 다음 셀 이동 (Tab) |
| 행 선택 | 체크박스 클릭 | 행 하이라이트 + BulkActions 활성화 |
| 일괄 비율 변경 | +/-N% 버튼 | Popover에서 비율 입력 → 선택 행 일괄 적용 |
| 수량 구간 추가 | "+ 수량 구간" 버튼 | Popover에서 수량 입력 → 매트릭스 행 추가 |
| 조합 복사 | "다른 조합에 복사" 버튼 | 대상 조합 다중선택 Dialog |
| 초기화 | 초기화 버튼 | 확인 Dialog → 원래 값으로 복원 |
| 저장 진행 | 저장 버튼 | 버튼 disabled + 스피너 |
| 미저장 이탈 | 취소/닫기 | 확인 Dialog "저장하지 않은 변경사항이 있습니다" |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 가격 0 이하 입력 | 인라인 에러 "0보다 큰 값을 입력하세요" |
| 저장 실패 (500) | 토스트 에러 + 재시도 (편집 데이터 유지) |
| 복사 대상 미선택 | "복사할 조합을 선택하세요" 토스트 |
| 수량 중복 입력 | "이미 존재하는 수량입니다" 토스트 |

### 9. 주의사항

- 8종 팝업은 동일 컴포넌트를 재사용하고 productType props로 구분
- 가격 셀은 Tab 키로 다음 셀 이동, Enter로 아래 셀 이동 (스프레드시트 UX)
- 일괄 비율 변경은 소수점 버림 처리 (원 단위)
- 수량 구간은 정렬 유지 (오름차순)
- 대량 데이터 편집 시 성능을 위해 가상화(virtualization) 고려

---

## SCR-B4-SIZE-MASTER

**사이즈 마스터 | CUSTOM | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-B4-SIZE-MASTER
- 화면명: 사이즈 마스터
- 분류: CUSTOM
- 우선순위: 1
- 규모: M (DataTable + CRUD 모달)
- 비고: 인쇄/제본 상품에서 사용하는 사이즈 규격 마스터 데이터 관리

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [사이즈 마스터]                        [+ 사이즈 등록]  │ │
│  │ 홈 > 상품관리 > 사이즈 마스터                           │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection                                          │ │
│  │  검색어 [__________] 상품분류 [전체 ▼]  [검색] [초기화]│ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ DataTable:                                             │ │
│  │  번호 코드  사이즈명  가로(mm) 세로(mm)  분류  사용  액션│ │
│  │  1    A4    A4       210     297      인쇄  사용  [수정][삭제]│
│  │  2    A3    A3       297     420      인쇄  사용  [수정][삭제]│
│  │  Pagination                                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
SizeMasterPage
  ├── PageHeader (title, breadcrumb, RegisterButton)
  ├── FilterSection (검색어, 상품분류)
  ├── MasterDataTable
  │     └── SizeRow (번호, 코드, 사이즈명, 가로, 세로, 분류, 사용여부 Badge, 수정/삭제)
  ├── Pagination
  └── SizeCrudModal (Dialog)
        ├── Input: code (등록 시만 입력, 수정 시 읽기전용)
        ├── Input: sizeName
        ├── Input: width (mm)
        ├── Input: height (mm)
        ├── RadioGroup: productType (인쇄/제본)
        ├── Switch: isActive
        └── FormActions (취소, 저장)
```

### 4. Props / States

```typescript
interface SizeMaster {
  sizeNo: number;
  code: string;
  sizeName: string;
  width: number;
  height: number;
  productType: "PRINT" | "BINDING";
  isActive: boolean;
}
```

### 5. API 매핑

```
GET /admin/custom/masters/sizes
  Query: keyword, productType, page, pageSize
  Response: { list: SizeMaster[], total }

POST /admin/custom/masters/sizes
  Body: { code, sizeName, width, height, productType, isActive }

PUT /admin/custom/masters/sizes/{sizeNo}
  Body: { sizeName, width, height, productType, isActive }

DELETE /admin/custom/masters/sizes/{sizeNo}
  Response: 204
```

### 6. 데이터 플로우

```
FilterSection → onSearch → GET /admin/custom/masters/sizes → DataTable 갱신
RegisterButton → SizeCrudModal(mode=create) → POST → 목록 갱신
수정 버튼 → SizeCrudModal(mode=edit) → PUT → 목록 갱신
삭제 버튼 → 확인 Dialog → DELETE → 목록 갱신
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 등록 모달 | "+ 사이즈 등록" 버튼 | 빈 폼 모달 |
| 수정 모달 | 행 수정 버튼 | 기존 데이터 채워진 모달 (code 읽기전용) |
| 삭제 확인 | 행 삭제 버튼 | 확인 Dialog "삭제 시 해당 사이즈를 사용하는 상품에 영향" |
| 저장 완료 | API 성공 | 토스트 + 모달 닫힘 + 목록 갱신 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 코드 중복 (409) | 인라인 에러 "이미 존재하는 코드" |
| 사용 중 삭제 (400) | 토스트 "사용 중인 사이즈는 삭제 불가" |
| 서버 오류 (500) | 토스트 에러 |

### 9. 주의사항

- 코드는 등록 후 변경 불가 (상품에서 참조하므로)
- 사용 중인 사이즈 삭제 시 백엔드에서 참조 무결성 체크

---

## SCR-B4-MATERIAL-MASTER

**소재 마스터 | CUSTOM | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-B4-MATERIAL-MASTER
- 화면명: 소재 마스터
- 분류: CUSTOM
- 우선순위: 1
- 규모: M (DataTable + CRUD 모달)
- 비고: 인쇄/제본 상품에서 사용하는 소재(종이 재질) 마스터 데이터 관리

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [소재 마스터]                          [+ 소재 등록]    │ │
│  │ 홈 > 상품관리 > 소재 마스터                             │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection                                          │ │
│  │  검색어 [__________] 상품분류 [전체 ▼]  [검색] [초기화]│ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ DataTable:                                             │ │
│  │  번호 코드  소재명   설명       분류  사용  액션       │ │
│  │  1    ART   아트지   고급 광택  인쇄  사용  [수정][삭제]│ │
│  │  2    MOJO  모조지   무광 자연  인쇄  사용  [수정][삭제]│ │
│  │  Pagination                                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
MaterialMasterPage
  ├── PageHeader (title, breadcrumb, RegisterButton)
  ├── FilterSection (검색어, 상품분류)
  ├── MasterDataTable
  │     └── MaterialRow (번호, 코드, 소재명, 설명, 분류, 사용여부 Badge, 수정/삭제)
  ├── Pagination
  └── MaterialCrudModal (Dialog)
        ├── Input: code (등록 시만 입력)
        ├── Input: materialName
        ├── Textarea: description
        ├── RadioGroup: productType
        ├── Switch: isActive
        └── FormActions
```

### 4. Props / States

```typescript
interface MaterialMaster {
  materialNo: number;
  code: string;
  materialName: string;
  description: string;
  productType: "PRINT" | "BINDING";
  isActive: boolean;
}
```

### 5. API 매핑

```
GET /admin/custom/masters/materials
  Query: keyword, productType, page, pageSize
  Response: { list: MaterialMaster[], total }

POST /admin/custom/masters/materials
  Body: { code, materialName, description, productType, isActive }

PUT /admin/custom/masters/materials/{materialNo}
  Body: { materialName, description, productType, isActive }

DELETE /admin/custom/masters/materials/{materialNo}
  Response: 204
```

### 6. 데이터 플로우

```
FilterSection → onSearch → GET → DataTable 갱신
RegisterButton → MaterialCrudModal(create) → POST → 목록 갱신
수정 → MaterialCrudModal(edit) → PUT → 목록 갱신
삭제 → 확인 Dialog → DELETE → 목록 갱신
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 등록 모달 | 등록 버튼 | 빈 폼 모달 |
| 수정 모달 | 수정 버튼 | 기존 데이터 모달 (code 읽기전용) |
| 삭제 확인 | 삭제 버튼 | 확인 Dialog |
| 저장 완료 | API 성공 | 토스트 + 목록 갱신 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 코드 중복 (409) | 인라인 에러 |
| 사용 중 삭제 (400) | 토스트 "사용 중인 소재는 삭제 불가" |
| 서버 오류 (500) | 토스트 에러 |

### 9. 주의사항

- 코드는 등록 후 변경 불가
- 소재 삭제 시 연결된 용지 마스터 데이터도 영향받으므로 주의

---

## SCR-B4-PAPER-MASTER

**용지 마스터 | CUSTOM | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-B4-PAPER-MASTER
- 화면명: 용지 마스터
- 분류: CUSTOM
- 우선순위: 1
- 규모: M (DataTable + CRUD 모달)
- 비고: 소재별로 사용 가능한 용지(종이 브랜드/제품) 마스터 데이터 관리

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [용지 마스터]                          [+ 용지 등록]    │ │
│  │ 홈 > 상품관리 > 용지 마스터                             │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection                                          │ │
│  │  검색어 [________] 소재 [전체 ▼]  [검색] [초기화]      │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ DataTable:                                             │ │
│  │  번호 코드  용지명       소재   평량  색상 사용  액션  │ │
│  │  1    SNOW  스노우화이트 아트지 250g  백색 사용 [수정][삭제]│
│  │  2    RNDV  랑데부       아트지 300g  미색 사용 [수정][삭제]│
│  │  Pagination                                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PaperMasterPage
  ├── PageHeader (title, breadcrumb, RegisterButton)
  ├── FilterSection (검색어, 소재 필터)
  ├── MasterDataTable
  │     └── PaperRow (번호, 코드, 용지명, 소재, 평량, 색상, 사용여부, 수정/삭제)
  ├── Pagination
  └── PaperCrudModal (Dialog)
        ├── Input: code (등록 시만 입력)
        ├── Input: paperName
        ├── Select: materialCode (소재 마스터에서 선택)
        ├── Input: weight (평량, g 단위)
        ├── Input: color
        ├── Switch: isActive
        └── FormActions
```

### 4. Props / States

```typescript
interface PaperMaster {
  paperNo: number;
  code: string;
  paperName: string;
  materialCode: string;
  materialName: string;
  weight: string;      // "250g"
  color: string;
  isActive: boolean;
}
```

### 5. API 매핑

```
GET /admin/custom/masters/papers
  Query: keyword, materialCode, page, pageSize
  Response: { list: PaperMaster[], total }

POST /admin/custom/masters/papers
  Body: { code, paperName, materialCode, weight, color, isActive }

PUT /admin/custom/masters/papers/{paperNo}
  Body: { paperName, materialCode, weight, color, isActive }

DELETE /admin/custom/masters/papers/{paperNo}
  Response: 204
```

### 6. 데이터 플로우

```
FilterSection → onSearch → GET → DataTable 갱신
RegisterButton → PaperCrudModal(create) → POST → 목록 갱신
수정 → PaperCrudModal(edit) → PUT → 목록 갱신
삭제 → 확인 Dialog → DELETE → 목록 갱신
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 등록 모달 | 등록 버튼 | 빈 폼 모달 (소재 선택 필수) |
| 수정 모달 | 수정 버튼 | 기존 데이터 모달 |
| 삭제 확인 | 삭제 버튼 | 확인 Dialog |
| 저장 완료 | API 성공 | 토스트 + 목록 갱신 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 코드 중복 (409) | 인라인 에러 |
| 사용 중 삭제 (400) | 토스트 "사용 중인 용지는 삭제 불가" |
| 서버 오류 (500) | 토스트 에러 |

### 9. 주의사항

- 용지는 반드시 하나의 소재에 귀속
- 코드는 등록 후 변경 불가
- 소재 마스터의 isActive=false인 소재에 연결된 용지는 상품등록에서 노출되지 않음

---

## SCR-B4-PRICE-MASTER

**가격 마스터 | CUSTOM | 우선순위 1 | 규모 L**

### 1. 화면 개요

- ID: SCR-B4-PRICE-MASTER
- 화면명: 가격 마스터
- 분류: CUSTOM
- 우선순위: 1
- 규모: L (DataTable + SplitLayout 가격 룰 에디터)
- 비고: 상품별 가격 규칙을 관리하는 마스터 화면. 좌측 상품/옵션 트리 + 우측 가격 룰 편집 패널로 구성

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ AdminLayout                                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ [가격 마스터]                                                  │  │
│  │ 홈 > 상품관리 > 가격 마스터                                    │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ SplitLayout (좌 40% / 우 60%)                                 │  │
│  │  ┌─────────────────┐  ┌───────────────────────────────────┐  │  │
│  │  │ PriceMasterTable │  │ PriceRuleEditor                  │  │  │
│  │  │                  │  │                                   │  │  │
│  │  │ 필터:            │  │ [명함 인쇄 > A4 > 아트지]        │  │  │
│  │  │ 상품 [전체 ▼]   │  │                                   │  │  │
│  │  │ 상태 [전체 ▼]   │  │ 기본 가격 규칙:                   │  │  │
│  │  │                  │  │  기준단가   [50] 원/매            │  │  │
│  │  │ ▼ 명함 인쇄      │  │  최소주문   [100] 매             │  │  │
│  │  │   ├─ A4         │  │  수량할인   [v] 사용              │  │  │
│  │  │   │  ├─ 아트지  │  │                                   │  │  │
│  │  │   │  └─ 모조지  │  │ 수량별 할인율:                     │  │  │
│  │  │   └─ A3         │  │  200매 이상: [-10]%               │  │  │
│  │  │      └─ 아트지  │  │  300매 이상: [-20]%               │  │  │
│  │  │ ▼ 전단 인쇄      │  │  500매 이상: [-30]%              │  │  │
│  │  │   └─ ...        │  │  1000매 이상: [-40]%              │  │  │
│  │  │                  │  │  [+ 구간 추가]                    │  │  │
│  │  │                  │  │                                   │  │  │
│  │  │                  │  │ 후가공 가산:                       │  │  │
│  │  │                  │  │  코팅(무광) [5]원  유광 [7]원     │  │  │
│  │  │                  │  │                                   │  │  │
│  │  │                  │  │      [초기화]  [저장(빨강)]       │  │  │
│  │  └─────────────────┘  └───────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PriceMasterPage
  ├── PageHeader (title, breadcrumb)
  └── SplitLayout (resizable, 좌 40% / 우 60%)
        ├── LeftPanel
        │     ├── FilterSection (상품 필터, 상태 필터)
        │     └── PriceMasterTree (Accordion 트리)
        │           └── ProductNode × N
        │                 └── SizeNode × N
        │                       └── MaterialNode × N (클릭 → 우측 패널 로드)
        └── RightPanel: PriceRuleEditor
              ├── Breadcrumb (선택된 옵션 경로)
              ├── BasicPriceSection (Card)
              │     ├── Input: baseUnitPrice (기준 단가)
              │     ├── Input: minOrderQuantity (최소 주문 수량)
              │     └── Switch: useQuantityDiscount (수량 할인 사용)
              ├── QuantityDiscountSection (Card, useQuantityDiscount=true일 때)
              │     ├── DiscountRow × N (수량 기준, 할인율)
              │     └── Button "구간 추가"
              ├── PostProcessingSurchargeSection (Card)
              │     └── SurchargeInput × N (후가공별 가산 단가)
              └── FormActions
                    ├── Button[outline] "초기화"
                    └── Button[red] "저장"
```

### 4. Props / States

```typescript
interface PriceRuleMaster {
  productNo: number;
  optionPath: string;          // "명함인쇄 > A4 > 아트지"
  optionCombinationKey: string;
  baseUnitPrice: number;
  minOrderQuantity: number;
  useQuantityDiscount: boolean;
  quantityDiscounts: QuantityDiscount[];
  postProcessingSurcharges: PostProcessingSurcharge[];
}

interface QuantityDiscount {
  minQuantity: number;
  discountRate: number;        // 음수 (예: -10 = 10% 할인)
}

interface PostProcessingSurcharge {
  code: string;
  name: string;
  surchargePerUnit: number;    // 매당 가산 금액
}

interface PriceMasterState {
  selectedNode: string | null; // 트리에서 선택된 노드 키
  treeFilter: { productType?: string; status?: string };
  editorDirty: boolean;
}
```

### 5. API 매핑

```
GET /admin/custom/prices/tree
  Query: productType, status
  Response: { tree: ProductTreeNode[] }

GET /admin/custom/prices/rules/{optionCombinationKey}
  Response: PriceRuleMaster

PUT /admin/custom/prices/rules/{optionCombinationKey}
  Body: PriceRuleMaster
  Response: { updatedAt }

POST /admin/custom/prices/rules/{optionCombinationKey}/reset
  Response: PriceRuleMaster (기본값으로 초기화)
```

### 6. 데이터 플로우

```
페이지 로드 → GET /admin/custom/prices/tree → 좌측 트리 렌더

좌측 트리 노드 클릭
  └── 우측 편집 중 미저장 확인 → GET /admin/custom/prices/rules/{key}
        └── PriceRuleEditor 갱신

QuantityDiscountSection "구간 추가"
  └── 새 행 추가 (수량, 할인율 입력)

Button "저장" → PUT /admin/custom/prices/rules/{key}
  └── 성공: 토스트 + editorDirty = false

Button "초기화" → 확인 Dialog → POST /admin/custom/prices/rules/{key}/reset
  └── 기본값으로 에디터 갱신
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 트리 노드 선택 | 노드 클릭 | 노드 하이라이트, 우측 패널 로드 |
| 미저장 노드 전환 | 다른 노드 클릭 | 확인 Dialog "저장하지 않은 변경사항" |
| 할인 구간 추가 | "+ 구간 추가" | 새 행 입력 UI |
| 할인 구간 삭제 | 행 삭제 버튼 | 행 제거 |
| 저장 진행 | 저장 버튼 | 버튼 disabled + 스피너 |
| 초기화 | 초기화 버튼 | 확인 Dialog → 기본값 복원 |
| 빈 선택 | 초기 상태 | 우측 패널 "옵션을 선택하세요" 안내 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 규칙 로드 실패 (500) | 우측 패널 에러 메시지 + 재시도 |
| 저장 실패 (500) | 토스트 에러 + 편집 데이터 유지 |
| 할인율 범위 초과 | 인라인 에러 "0~100 사이의 값" |
| 수량 구간 역순 | 인라인 에러 "이전 구간보다 큰 수량 입력" |

### 9. 주의사항

- SplitLayout은 드래그로 좌/우 비율 조절 가능 (최소 30% / 최대 70%)
- 좌측 트리는 상품 → 사이즈 → 소재 3단 계층 구조
- 수량 할인 구간은 오름차순 정렬 유지 필수
- 할인율 변경 시 실시간으로 예상 단가 미리보기 표시 (기준단가 x (1 + 할인율/100))

---

## SCR-B4-GOODS-CAT

**굿즈 카테고리 | SKIN | 우선순위 2 | 규모 S**

### 1. 화면 개요

- ID: SCR-B4-GOODS-CAT
- 화면명: 굿즈 카테고리
- 분류: SKIN (shopby API 사용)
- 우선순위: 2
- 규모: S (카테고리 트리 + 드래그앤드롭 정렬)
- 비고: 굿즈 상품의 카테고리 계층 구조 관리

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [굿즈 카테고리]                      [+ 카테고리 추가]  │ │
│  │ 홈 > 상품관리 > 굿즈 카테고리                           │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ CategoryTree (Card)                                    │ │
│  │  ▼ 머그컵          [수정][삭제]  ≡ (드래그)           │ │
│  │    ├─ 도자기 머그   [수정][삭제]  ≡                    │ │
│  │    └─ 스텐 머그     [수정][삭제]  ≡                    │ │
│  │  ▼ 에코백          [수정][삭제]  ≡                    │ │
│  │  ▶ 스티커          [수정][삭제]  ≡                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
GoodsCategoryPage
  ├── PageHeader (title, breadcrumb, AddButton)
  └── CategoryTree (Card)
        └── CategoryNode × N (재귀, 드래그앤드롭)
              ├── DragHandle
              ├── Label (카테고리명)
              ├── Button "수정" → CategoryEditModal
              └── Button "삭제" → 확인 Dialog
```

### 4. Props / States

```typescript
interface CategoryNode {
  categoryNo: number;
  categoryName: string;
  parentNo: number | null;
  depth: number;
  sortOrder: number;
  children: CategoryNode[];
}
```

### 5. API 매핑

```
GET /admin/categories (shopby API)
  Response: { list: CategoryNode[] }

POST /admin/categories
  Body: { categoryName, parentNo, sortOrder }

PUT /admin/categories/{categoryNo}
  Body: { categoryName, sortOrder }

DELETE /admin/categories/{categoryNo}

PATCH /admin/categories/sort
  Body: { sortOrders: { categoryNo, sortOrder }[] }
```

### 6. 데이터 플로우

```
페이지 로드 → GET /admin/categories → CategoryTree 렌더
드래그앤드롭 완료 → PATCH /admin/categories/sort
추가/수정 → POST/PUT → 트리 갱신
삭제 → 확인 Dialog → DELETE → 트리 갱신
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 드래그 중 | 핸들 드래그 | 드래그 고스트 + 드롭 위치 표시 |
| 노드 접기/펼치기 | 화살표 클릭 | 하위 노드 토글 |
| 정렬 저장 | 드롭 완료 | 자동 PATCH + 토스트 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 하위 카테고리 있는 항목 삭제 | 토스트 "하위 카테고리를 먼저 삭제하세요" |
| 서버 오류 (500) | 토스트 에러 |

### 9. 주의사항

- 최대 3단 깊이 제한
- shopby API 사용, 커스텀 API 아님

---

## SCR-B4-GOODS-REG

**굿즈 등록 | SKIN | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-B4-GOODS-REG
- 화면명: 굿즈 등록
- 분류: SKIN (shopby 상품 등록 API 사용)
- 우선순위: 2
- 규모: M (등록 폼 + 이미지 업로더)
- 비고: 머그컵, 에코백 등 굿즈 상품 등록. shopby 상품 등록 API 활용

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [굿즈 등록]                                             │ │
│  │ 홈 > 상품관리 > 굿즈 등록                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FormLayout (Card max-w-3xl mx-auto)                    │ │
│  │  기본 정보                                              │ │
│  │  상품명*     [________________________________]         │ │
│  │  카테고리*   [1차 ▼] [2차 ▼]                           │ │
│  │  가격*       [________] 원                              │ │
│  │  재고*       [________] 개                              │ │
│  │  상태*       (•) 판매중 ( ) 판매중지                    │ │
│  │                                                         │ │
│  │  이미지                                                 │ │
│  │  [이미지 업로드 영역] (최대 5장, 드래그&드롭)           │ │
│  │  [img1] [img2] [img3] [+ 추가]                         │ │
│  │                                                         │ │
│  │  상세 설명                                              │ │
│  │  [WYSIWYG Editor]                                       │ │
│  │                                                         │ │
│  │               [취소]  [등록(빨강)]                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
GoodsRegPage
  ├── PageHeader (title, breadcrumb)
  └── ProductRegForm (Card)
        ├── BasicInfoSection
        │     ├── Input: productName
        │     ├── CascadeSelect: category (1차/2차)
        │     ├── Input: price (number)
        │     ├── Input: stock (number)
        │     └── RadioGroup: status
        ├── ImageUploader (최대 5장, 드래그앤드롭, 정렬 가능)
        ├── RichTextEditor: description
        └── FormActions (취소, 등록)
```

### 4. Props / States

```typescript
interface GoodsRegForm {
  productName: string;
  categoryNo: number;
  price: number;
  stock: number;
  status: "ON_SALE" | "SUSPENDED";
  images: File[];
  description: string;
}
```

### 5. API 매핑

```
POST /admin/products (shopby API)
  Body: GoodsRegForm (multipart/form-data for images)
  Response: { productNo }

GET /admin/categories
  Query: parentNo
  Response: { list: CategoryItem[] }
```

### 6. 데이터 플로우

```
CascadeSelect[1차].onChange → GET /admin/categories?parentNo → 2차 옵션 갱신
ImageUploader.onDrop → 로컬 프리뷰 생성
FormActions[등록] → 유효성 검사 → POST /admin/products
  └── 성공: 상품 목록 이동 + 토스트
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 이미지 업로드 | 드래그앤드롭/클릭 | 프리뷰 썸네일 표시 |
| 이미지 정렬 | 드래그 | 순서 변경 |
| 등록 진행 | 등록 버튼 | 버튼 disabled + 스피너 |
| 등록 성공 | API 200 | 토스트 + 목록 이동 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 유효성 실패 | 필드별 인라인 에러 |
| 이미지 크기 초과 | 토스트 "5MB 이하 이미지만 업로드 가능" |
| 서버 오류 (500) | 토스트 에러 + 재시도 |

### 9. 주의사항

- shopby 상품 등록 API 사용 (커스텀 아님)
- 이미지 최대 5장, 첫 번째가 대표 이미지
- 가격은 원 단위 정수만 허용

---

## SCR-B4-HANDMADE-REG

**수작 등록 | SKIN | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-B4-HANDMADE-REG
- 화면명: 수작 등록
- 분류: SKIN (shopby 상품 등록 API 사용)
- 우선순위: 2
- 규모: M (등록 폼 + 이미지 업로더)
- 비고: 수작업 상품(캘리그라피, 수제 카드 등) 등록. 굿즈 등록과 유사한 폼에 제작기간 필드 추가

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [수작 등록]                                             │ │
│  │ 홈 > 상품관리 > 수작 등록                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FormLayout (Card max-w-3xl mx-auto)                    │ │
│  │  상품명*     [________________________________]         │ │
│  │  카테고리*   [1차 ▼] [2차 ▼]                           │ │
│  │  가격*       [________] 원                              │ │
│  │  제작기간*   [____] 영업일                              │ │
│  │  재고        [________] 개 (0 = 주문제작)               │ │
│  │  상태*       (•) 판매중 ( ) 판매중지                    │ │
│  │  이미지      [이미지 업로드 영역] (최대 5장)            │ │
│  │  상세 설명   [WYSIWYG Editor]                           │ │
│  │               [취소]  [등록(빨강)]                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
HandmadeRegPage
  ├── PageHeader (title, breadcrumb)
  └── ProductRegForm (Card)
        ├── BasicInfoSection
        │     ├── Input: productName
        │     ├── CascadeSelect: category
        │     ├── Input: price (number)
        │     ├── Input: productionDays (number, 영업일)
        │     ├── Input: stock (number, 0=주문제작)
        │     └── RadioGroup: status
        ├── ImageUploader (최대 5장)
        ├── RichTextEditor: description
        └── FormActions (취소, 등록)
```

### 4. Props / States

```typescript
interface HandmadeRegForm {
  productName: string;
  categoryNo: number;
  price: number;
  productionDays: number;
  stock: number;          // 0이면 주문제작
  status: "ON_SALE" | "SUSPENDED";
  images: File[];
  description: string;
}
```

### 5. API 매핑

```
POST /admin/products (shopby API)
  Body: HandmadeRegForm (multipart/form-data)
  Response: { productNo }
```

### 6. 데이터 플로우

```
FormActions[등록] → 유효성 검사 → POST /admin/products
  └── 성공: 상품 목록 이동 + 토스트
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 재고 0 입력 | stock=0 | 안내 텍스트 "주문제작 상품으로 등록됩니다" |
| 등록 진행 | 등록 버튼 | 버튼 disabled + 스피너 |
| 등록 성공 | API 200 | 토스트 + 목록 이동 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 유효성 실패 | 필드별 인라인 에러 |
| 서버 오류 (500) | 토스트 에러 + 재시도 |

### 9. 주의사항

- 굿즈 등록과 동일한 shopby API 사용, productionDays 추가 필드
- 재고 0은 주문제작 모드를 의미

---

## SCR-B4-PACKAGING-REG

**포장재 등록 | SKIN | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-B4-PACKAGING-REG
- 화면명: 포장재 등록
- 분류: SKIN (shopby 상품 등록 API 사용)
- 우선순위: 2
- 규모: M (등록 폼 + 이미지 업로더)
- 비고: 포장재(봉투, 박스, 리본 등) 상품 등록. 규격 필드 추가

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [포장재 등록]                                           │ │
│  │ 홈 > 상품관리 > 포장재 등록                             │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FormLayout (Card max-w-3xl mx-auto)                    │ │
│  │  상품명*     [________________________________]         │ │
│  │  카테고리*   [1차 ▼] [2차 ▼]                           │ │
│  │  규격        [____] x [____] x [____] mm               │ │
│  │  가격*       [________] 원                              │ │
│  │  재고*       [________] 개                              │ │
│  │  상태*       (•) 판매중 ( ) 판매중지                    │ │
│  │  이미지      [이미지 업로드 영역] (최대 5장)            │ │
│  │  상세 설명   [WYSIWYG Editor]                           │ │
│  │               [취소]  [등록(빨강)]                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PackagingRegPage
  ├── PageHeader (title, breadcrumb)
  └── ProductRegForm (Card)
        ├── BasicInfoSection
        │     ├── Input: productName
        │     ├── CascadeSelect: category
        │     ├── DimensionInput: width, height, depth (mm)
        │     ├── Input: price (number)
        │     ├── Input: stock (number)
        │     └── RadioGroup: status
        ├── ImageUploader (최대 5장)
        ├── RichTextEditor: description
        └── FormActions (취소, 등록)
```

### 4. Props / States

```typescript
interface PackagingRegForm {
  productName: string;
  categoryNo: number;
  width?: number;       // mm
  height?: number;      // mm
  depth?: number;       // mm
  price: number;
  stock: number;
  status: "ON_SALE" | "SUSPENDED";
  images: File[];
  description: string;
}
```

### 5. API 매핑

```
POST /admin/products (shopby API)
  Body: PackagingRegForm (multipart/form-data)
  Response: { productNo }
```

### 6. 데이터 플로우

```
FormActions[등록] → 유효성 검사 → POST /admin/products
  └── 성공: 상품 목록 이동 + 토스트
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 등록 진행 | 등록 버튼 | 버튼 disabled + 스피너 |
| 등록 성공 | API 200 | 토스트 + 목록 이동 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 유효성 실패 | 필드별 인라인 에러 |
| 서버 오류 (500) | 토스트 에러 + 재시도 |

### 9. 주의사항

- shopby 상품 등록 API 사용
- 규격 필드는 선택 사항 (가로 x 세로 x 깊이)
- 포장재는 인쇄 옵션 없음, 단순 상품 등록

---

## SCR-B4-DESIGN-REG

**디자인 등록 | CUSTOM | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-B4-DESIGN-REG
- 화면명: 디자인 등록
- 분류: CUSTOM (자체 디자인 관리 API)
- 우선순위: 2
- 규모: M (등록 폼 + 디자인 미리보기 + 태그 입력)
- 비고: 인쇄/굿즈 상품에 적용 가능한 디자인 템플릿 등록. 태그 기반 검색 지원

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [디자인 등록]                                           │ │
│  │ 홈 > 상품관리 > 디자인 등록                             │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FormLayout (Card max-w-3xl mx-auto)                    │ │
│  │  ┌──────────────────┐  ┌─────────────────────────────┐│ │
│  │  │ DesignPreview     │  │ 기본 정보                   ││ │
│  │  │ [디자인 미리보기] │  │ 디자인명* [______________] ││ │
│  │  │ (업로드된 파일    │  │ 분류*     [인쇄 ▼]        ││ │
│  │  │  실시간 렌더)     │  │ 적용상품  [전단 ▼]        ││ │
│  │  └──────────────────┘  │ 태그      [봄|벚꽃|핑크|x]  ││ │
│  │                         │           [태그 입력... ]    ││ │
│  │                         │ 설명      [______________ ] ││ │
│  │                         └─────────────────────────────┘│ │
│  │  디자인 파일                                            │ │
│  │  원본파일*  [파일 선택] (.ai, .psd, .pdf)              │ │
│  │  미리보기*  [이미지 업로드] (.jpg, .png, .webp)        │ │
│  │  상태*      (•) 사용 ( ) 미사용                        │ │
│  │                                                         │ │
│  │               [취소]  [등록(빨강)]                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
DesignRegPage
  ├── PageHeader (title, breadcrumb)
  └── DesignRegForm (Card)
        ├── SplitSection (좌: 미리보기, 우: 기본정보)
        │     ├── DesignPreview (미리보기 이미지 실시간 렌더)
        │     └── BasicInfoSection
        │           ├── Input: designName
        │           ├── Select: category (인쇄/굿즈/수작)
        │           ├── Select: applicableProduct (적용 가능 상품 유형)
        │           ├── TagInput: tags (Enter로 태그 추가, x로 삭제)
        │           └── Textarea: description
        ├── FileUploadSection
        │     ├── FileUploader: sourceFile (.ai, .psd, .pdf 허용)
        │     └── ImageUploader: previewImage (.jpg, .png, .webp)
        ├── RadioGroup: status (사용/미사용)
        └── FormActions (취소, 등록)
```

### 4. Props / States

```typescript
interface DesignRegForm {
  designName: string;
  category: "PRINT" | "GOODS" | "HANDMADE";
  applicableProduct: string;   // 적용 가능 상품 유형 코드
  tags: string[];
  description: string;
  sourceFile: File | null;     // 원본 디자인 파일
  previewImage: File | null;   // 미리보기 이미지
  status: "ACTIVE" | "INACTIVE";
}
```

### 5. API 매핑

```
POST /admin/custom/designs
  Body: DesignRegForm (multipart/form-data)
  Response: { designNo, designName, createdAt }

GET /admin/custom/designs/tags
  Query: keyword
  Response: { list: string[] }   // 자동완성용 태그 목록
```

### 6. 데이터 플로우

```
ImageUploader[previewImage].onChange → DesignPreview 실시간 갱신
TagInput.onEnter → tags[] 추가 (중복 체크)
TagInput.onChange → GET /admin/custom/designs/tags?keyword → 자동완성
FormActions[등록] → 유효성 검사 → POST /admin/custom/designs
  └── 성공: 디자인 목록 이동 + 토스트
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 미리보기 갱신 | 이미지 업로드 | DesignPreview 실시간 렌더 |
| 태그 추가 | Enter 키 | 태그 뱃지 추가 |
| 태그 자동완성 | 입력 중 | 드롭다운 추천 목록 |
| 태그 삭제 | x 클릭 | 태그 뱃지 제거 |
| 등록 진행 | 등록 버튼 | 버튼 disabled + 스피너 |
| 등록 성공 | API 200 | 토스트 + 목록 이동 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 원본파일 미등록 | 인라인 에러 "원본 디자인 파일을 업로드하세요" |
| 파일 형식 불일치 | 토스트 "허용된 파일 형식: .ai, .psd, .pdf" |
| 파일 크기 초과 | 토스트 "원본파일 50MB / 미리보기 5MB 이하" |
| 서버 오류 (500) | 토스트 에러 + 재시도 |

### 9. 주의사항

- 원본파일은 .ai, .psd, .pdf만 허용 (최대 50MB)
- 미리보기 이미지는 .jpg, .png, .webp (최대 5MB)
- 태그는 최대 10개, 각 태그 최대 20자
- 커스텀 API 사용 (shopby API 아님)

---

## SCR-B5-NOTICE
**공지사항 관리 | SKIN | 2순위 | M** - AdminLayout + DataTable. BoardDataTable + RichEditor + StatusToggle(게시/숨김). 컬럼: 번호, 제목, 카테고리, 작성자, 작성일, 조회수, 상태, 액션. API: shopby `/boards/{boardNo}/articles`. 인터랙션: loading, list, editing(RichEditor), toggling. 접근성: RichEditor `aria-label`, 토글 `role="switch"`.

## SCR-B5-FAQ
**FAQ 관리 | SKIN | 2순위 | M** - AdminLayout + DataTable. FAQDataTable + CategoryManager + RichEditor. 컬럼: 번호, 카테고리, 질문, 답변(미리보기), 정렬순서, 상태, 액션. 카테고리 필터 + 드래그 정렬. API: shopby `/boards/{boardNo}/articles`. 접근성: `role="tablist"`, 드래그 대체 키보드.

## SCR-B5-BULK-QUOTE
**대량견적 관리 | SKIN | 2순위 | M** - AdminLayout + DataTable. QuoteDataTable + DetailPanel(Sheet) + ReplyEditor. 컬럼: 번호, 회사명, 담당자, 인쇄물종류, 수량, 상태(대기/답변완료), 등록일. API: shopby 게시판 + 커스텀 견적. 인터랙션: loading, list, detail-open(Sheet), replying. 접근성: Sheet focus trap.

## SCR-B5-CORP-CONSULT
**기업상담 관리 | SKIN | 2순위 | M** - BULK-QUOTE 동일 패턴. 컬럼: 번호, 회사명, 담당자, 연락처, 상담내용, 상태, 등록일.

## SCR-B5-DESIGN-CONSULT
**디자인상담 관리 | SKIN | 2순위 | M** - BULK-QUOTE 동일 + FilePreview(디자인 파일 미리보기). 컬럼: 번호, 이름, 상담유형, 첨부파일, 상태, 등록일.

## SCR-B5-PRODUCT-QA
**상품Q&A 관리 | SKIN | 2순위 | M** - AdminLayout + DataTable. QADataTable + ReplyEditor. 컬럼: 번호, 상품명, 질문자, 제목, 답변상태(대기/완료), 등록일. API: shopby `/boards/{boardNo}/articles`. 인터랙션: loading, list, replying, filtering(답변상태).

## SCR-B5-INQUIRY
**1:1문의 관리 | SKIN | 2순위 | M** - PRODUCT-QA 동일. 유형 필터: 배송, 결제, 상품, 기타.

## SCR-B5-EXPERIENCE
**체험단 관리 | CUSTOM | 3순위 | L** - AdminLayout + DataTable. ExperienceDataTable + ApplicationReview + StatusManager. 컬럼: 번호, 체험단명, 상품, 모집기간, 신청/선정인원, 상태(모집중/진행중/완료), 등록일. API: CRUD `/api/admin/experiences`. 인터랙션: loading, list, detail, reviewing(신청서 검토), selecting(선정), status-change. 에러: 모집 마감 후 수정 경고.

## SCR-B5-REVIEW
**이용후기 관리 | SKIN | 2순위 | M** - AdminLayout + DataTable. ReviewDataTable + PhotoPreview(라이트박스) + ReplyEditor. 컬럼: 번호, 상품명, 작성자, 별점, 포토(Y/N), 답변상태, 등록일. API: shopby `/products/{productNo}/reviews`. 접근성: 이미지 라이트박스 키보드, 별점 `aria-label`.

---

## SCR-B6-MEMBER
**회원 관리 | SKIN | 2순위 | M** - AdminLayout + DataTable. MemberDataTable + MemberDetailPanel(Sheet) + GradeBadge. 컬럼: 회원번호, 이름, 이메일, 등급(GradeBadge), 가입일, 최근주문, 누적금액. API: shopby `/admin/members`. Sheet: 주문이력, 적립금, 쿠폰, 문의 탭.

## SCR-B6-WITHDRAWN
**탈퇴 회원 | SKIN | 3순위 | S** - AdminLayout + DataTable(읽기 전용). 컬럼: 회원번호, 이름(마스킹), 탈퇴일, 탈퇴사유, 보존기간. API: shopby `/admin/members?status=withdrawn`.

## SCR-B6-PRINTING-MONEY
**프린팅머니 관리 | CUSTOM | 2순위 | L** - AdminLayout + DataTable + SplitLayout. 상단: BalanceSummary(총발행/총사용/잔액). main: MoneyDataTable(회원별 잔액). aside: ManualAdjustForm(지급/차감). 컬럼: 회원번호, 이름, 잔액, 총지급, 총사용, 최근거래일. API: GET `/api/admin/printing-money`, POST `/api/admin/printing-money/adjust`. 에러: 잔액 부족 차감 경고, 조정 사유 필수. 접근성: 금액 `inputmode="numeric"`, 잔액 변경 `aria-live`.

## SCR-B6-COUPON-MGMT
**쿠폰 관리 | SKIN | 2순위 | M** - AdminLayout + DataTable. CouponDataTable + CouponCreateForm(Dialog). 컬럼: 쿠폰번호, 쿠폰명, 할인유형(정액/정률), 할인값, 사용기간, 발급/사용수, 상태. API: shopby `/admin/coupons`. 에러: 할인율 100% 초과, 시작일>종료일 검증.

## SCR-B6-COUPON-ISSUE
**쿠폰 등록 내역 | SKIN | 3순위 | S** - AdminLayout + DataTable(읽기). 컬럼: 발급번호, 쿠폰명, 발급대상, 발급일, 사용여부, 만료일. API: shopby `/admin/coupons/{couponNo}/issues`.

## SCR-B6-COUPON-USE
**쿠폰 사용 내역 | SKIN | 3순위 | S** - COUPON-ISSUE 동일. 컬럼: 사용번호, 쿠폰명, 사용자, 사용일, 주문번호, 할인금액. API: shopby `/admin/coupons/usage-history`.
