# SCR-A10-PRINT-PRODUCT: 인쇄 상품 주문 (XL 완성 예제)

## 1. 화면 개요

| 항목 | 내용 |
|------|------|
| **Screen ID** | SCR-A10-PRINT-PRODUCT |
| **화면명** | 인쇄 상품 주문 (Product Configurator) |
| **유형** | CUSTOM |
| **우선순위** | 1순위 (MVP) |
| **복잡도** | XL |
| **패턴** | Step Wizard (6단계) |
| **경로** | `/products/print/:productNo` |
| **설명** | 인쇄 상품의 옵션을 단계별로 선택하고, 실시간 가격 계산 후 파일 업로드까지 완료하는 주문 구성 화면 |
| **대상 제품** | 명함, 전단/포스터, 리플렛, 카탈로그, 봉투, 스티커, 현수막, 배너 등 |
| **브랜드 컬러** | Primary #5538B6 |
| **Breakpoints** | sm: 640px, md: 768px, lg: 1024px, xl: 1280px |

### 진입 경로

- 메인 > 카테고리 > 상품 선택
- 메인 > 검색 > 상품 선택
- 메인 > 빠른주문 > 제품 타입 선택
- 직접 URL 접근 (\`/products/print/123\`)

### 핵심 비즈니스 규칙

- 옵션 의존성: 제품타입 → 사이즈 → 용지/소재 → 후가공 → 가격 (상위 변경 시 하위 초기화)
- 최소 주문수량은 제품타입+사이즈 조합에 따라 동적으로 결정
- 가격은 모든 옵션 확정 후 서버에서 계산 (클라이언트 캐싱 허용, TTL 5분)
- 파일 업로드는 최종 단계에서만 가능 (옵션 확정 후)
- 장바구니 담기 및 바로 주문 모두 지원

---

## 2. 와이어프레임

### Mobile (375px) - Vertical Step Layout

\`\`\`
┌─────────────────────────────────┐
│  ← 인쇄 상품 주문          ≡   │ Header (sticky)
├─────────────────────────────────┤
│                                 │
│  ● ─ ○ ─ ○ ─ ○ ─ ○ ─ ○       │ StepIndicator (horizontal scroll)
│  1   2   3   4   5   6         │
│  상품 사이즈 용지 후가공 수량 파일│
│                                 │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │    [명함 이미지]         │   │ ProductTypeCard (선택됨)
│  │    명함                  │   │
│  │    ✓ 선택됨              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    [전단 이미지]         │   │ ProductTypeCard
│  │    전단/포스터           │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    [리플렛 이미지]       │   │ ProductTypeCard
│  │    리플렛                │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    [카탈로그 이미지]     │   │ ProductTypeCard
│  │    카탈로그              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    [봉투 이미지]         │   │ ProductTypeCard
│  │    봉투                  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    [스티커 이미지]       │   │ ProductTypeCard
│  │    스티커                │   │
│  └─────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │ PriceSummaryBar (sticky bottom)
│  │ 예상 금액: 계산 중...    │   │
│  │ [이전]        [다음 →]   │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
\`\`\`

### Desktop (1280px) - SplitLayout

\`\`\`
┌──────────────────────────────────────────────────────────────────────┐
│  ← 후니프린팅  │  카테고리  │  빠른주문  │  고객센터  │  🔍  👤  🛒  │ GNB
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  인쇄 상품 주문 > 명함                                    Breadcrumb │
│                                                                      │
│  ● ── ○ ── ○ ── ○ ── ○ ── ○                                        │
│  1.상품  2.사이즈  3.용지  4.후가공  5.수량  6.파일                  │ StepIndicator
│                                                                      │
├────────────────────────────────┬─────────────────────────────────────┤
│                                │                                     │
│  STEP 1. 상품 선택             │   ┌───────────────────────────┐    │
│                                │   │                           │    │
│  ┌────────┐ ┌────────┐       │   │    [미리보기 이미지]      │    │
│  │ [img]  │ │ [img]  │       │   │                           │    │
│  │ 명함   │ │ 전단/  │       │   │    명함 - 90x50mm        │    │
│  │  ✓     │ │ 포스터 │       │   │    스노우지 250g          │    │
│  └────────┘ └────────┘       │   │                           │    │
│                                │   └───────────────────────────┘    │
│  ┌────────┐ ┌────────┐       │                                     │ Preview Panel
│  │ [img]  │ │ [img]  │       │   ┌───────────────────────────┐    │
│  │리플렛  │ │카탈로그│       │   │  선택 옵션 요약            │    │
│  └────────┘ └────────┘       │   │                           │    │
│                                │   │  제품: 명함               │    │
│  ┌────────┐ ┌────────┐       │   │  사이즈: -                │    │
│  │ [img]  │ │ [img]  │       │   │  용지: -                  │    │
│  │ 봉투   │ │스티커  │       │   │  후가공: -                │    │
│  └────────┘ └────────┘       │   │  수량: -                  │    │
│                                │   │                           │    │
│  ┌────────┐ ┌────────┐       │   │  ─────────────────────    │    │
│  │ [img]  │ │ [img]  │       │   │  예상 금액: ₩--,---       │    │
│  │ 현수막 │ │ 배너   │       │   │                           │    │ PriceSummary
│  └────────┘ └────────┘       │   │  [장바구니] [바로주문]    │    │
│                                │   └───────────────────────────┘    │
│                                │                                     │
│  ┌────────────────────────┐   │                                     │
│  │ [이전]      [다음 →]   │   │                                     │ StepNavigation
│  └────────────────────────┘   │                                     │
│                                │                                     │
├────────────────────────────────┴─────────────────────────────────────┤
│  Footer                                                              │
└──────────────────────────────────────────────────────────────────────┘
\`\`\`

### Step 5 (수량+가격) Desktop 상세

\`\`\`
├────────────────────────────────┬─────────────────────────────────────┤
│                                │                                     │
│  STEP 5. 수량 및 가격          │   ┌───────────────────────────┐    │
│                                │   │   명함 미리보기           │    │
│  수량 선택                     │   │   [이미지]                │    │
│  ┌──────────────────────┐     │   │   90x50mm / 스노우지250g  │    │
│  │  [-]  500  [+]       │     │   └───────────────────────────┘    │
│  └──────────────────────┘     │                                     │
│  최소: 200매 / 100매 단위      │   ┌───────────────────────────┐    │
│                                │   │  가격 상세                 │    │
│  빠른 수량 선택                │   │                           │    │
│  [200] [500] [1000] [2000]    │   │  인쇄비:      ₩35,000    │    │
│  [3000] [5000] [10000]        │   │  용지비:      ₩12,000    │    │
│                                │   │  후가공비:    ₩ 8,000    │    │
│  납기 옵션                     │   │  ─────────────────────    │    │
│  ○ 일반 (3영업일)    +₩0      │   │  소계:        ₩55,000    │    │
│  ● 빠른 (2영업일)    +₩5,000  │   │  부가세:      ₩ 5,500    │    │
│  ○ 초긴급 (1영업일)  +₩15,000 │   │  ─────────────────────    │    │
│                                │   │  합계:        ₩60,500    │    │
│                                │   │                           │    │
│  ┌────────────────────────┐   │   │  [장바구니] [바로주문]    │    │
│  │ [← 이전]   [다음 →]   │   │   └───────────────────────────┘    │
│  └────────────────────────┘   │                                     │
├────────────────────────────────┴─────────────────────────────────────┤
\`\`\`

### Step 6 (파일 업로드) Desktop 상세

\`\`\`
├────────────────────────────────┬─────────────────────────────────────┤
│                                │                                     │
│  STEP 6. 파일 업로드 및 확인   │   ┌───────────────────────────┐    │
│                                │   │  주문 요약                 │    │
│  ┌──────────────────────┐     │   │                           │    │
│  │                      │     │   │  제품: 명함               │    │
│  │   파일을 끌어다      │     │   │  사이즈: 90x50mm         │    │
│  │   놓거나 클릭하세요   │     │   │  용지: 스노우지 250g     │    │
│  │                      │     │   │  후가공: 양면코팅+귀도리  │    │
│  │   AI, PDF, PSD,      │     │   │  수량: 500매             │    │
│  │   JPG, PNG, TIFF     │     │   │  납기: 빠른 (2영업일)    │    │
│  │   (최대 100MB)       │     │   │                           │    │
│  └──────────────────────┘     │   │  ─────────────────────    │    │
│                                │   │  합계: ₩60,500           │    │
│  업로드된 파일                 │   │                           │    │
│  ┌──────────────────────┐     │   │  [장바구니] [바로주문]    │    │
│  │ 명함_앞면.ai          │     │   └───────────────────────────┘    │
│  │    2.3MB  ✓ 검증완료  │     │                                     │
│  │    [미리보기] [삭제]  │     │   ┌───────────────────────────┐    │
│  ├──────────────────────┤     │   │  디자인 가이드             │    │
│  │ 명함_뒷면.ai          │     │   │                           │    │
│  │    1.8MB  ⏳ 검증중   │     │   │  - 재단선 3mm 여유       │    │
│  │    [미리보기] [삭제]  │     │   │  - 해상도 300dpi 이상    │    │
│  └──────────────────────┘     │   │  - CMYK 색상모드          │    │
│                                │   │  - [템플릿 다운로드]      │    │
│  □ 시안 확인 후 제작 진행      │   └───────────────────────────┘    │
│    (시안 확인 없이 바로 제작)   │                                     │
│                                │                                     │
│  ┌────────────────────────┐   │                                     │
│  │ [← 이전] [주문완료 →] │   │                                     │
│  └────────────────────────┘   │                                     │
├────────────────────────────────┴─────────────────────────────────────┤
\`\`\`

---

## 3. 컴포넌트 트리

\`\`\`
PrintProductPage
├── Breadcrumb
│   └── BreadcrumbItem[]
├── StepIndicator
│   └── StepItem[] (6개)
│       ├── StepCircle (active | completed | upcoming)
│       ├── StepLabel
│       └── StepConnector
├── SplitLayout (Desktop) / StackLayout (Mobile)
│   ├── OptionPanel (left / top)
│   │   ├── Step1_ProductType
│   │   │   └── ProductTypeGrid
│   │   │       └── ProductTypeCard[]
│   │   │           ├── ProductImage
│   │   │           ├── ProductName
│   │   │           └── SelectionIndicator
│   │   ├── Step2_Size
│   │   │   └── SizeOptionGroup
│   │   │       ├── SizeCard[] (표준 사이즈)
│   │   │       │   ├── SizeName
│   │   │       │   ├── SizeDimension
│   │   │       │   └── SizePreview (축소 비율 미리보기)
│   │   │       └── CustomSizeInput (커스텀 사이즈, 일부 제품)
│   │   │           ├── WidthInput (mm)
│   │   │           ├── HeightInput (mm)
│   │   │           └── SizeValidation
│   │   ├── Step3_Paper
│   │   │   ├── PaperCategoryTab (일반지 | 고급지 | 특수지)
│   │   │   └── PaperOptionList
│   │   │       └── PaperOptionCard[]
│   │   │           ├── PaperSwatch (색상/질감 미리보기)
│   │   │           ├── PaperName
│   │   │           ├── PaperWeight (g)
│   │   │           ├── PaperDescription
│   │   │           └── PriceIndicator (+₩ 추가금)
│   │   ├── Step4_Finishing
│   │   │   ├── FinishingCategoryGroup[]
│   │   │   │   ├── CategoryLabel (코팅 | 귀도리 | 오시 | 박 | 형압 등)
│   │   │   │   └── FinishingOptionCard[]
│   │   │   │       ├── FinishingName
│   │   │   │       ├── FinishingPreview
│   │   │   │       ├── FinishingDescription
│   │   │   │       ├── PriceIndicator
│   │   │   │       └── CompatibilityBadge (가능/불가)
│   │   │   └── FinishingComboWarning (비호환 조합 경고)
│   │   ├── Step5_Quantity
│   │   │   ├── QuantityInput
│   │   │   │   ├── DecrementButton
│   │   │   │   ├── NumberInput
│   │   │   │   └── IncrementButton
│   │   │   ├── QuantityConstraint (최소/단위 안내)
│   │   │   ├── QuickQuantityButtons
│   │   │   │   └── QuantityChip[]
│   │   │   ├── DeliveryOptionGroup
│   │   │   │   └── DeliveryOptionRadio[]
│   │   │   │       ├── DeliveryLabel
│   │   │   │       ├── DeliveryDays
│   │   │   │       └── DeliveryPrice
│   │   │   └── PriceBreakdown
│   │   │       ├── PriceLineItem[] (인쇄비, 용지비, 후가공비)
│   │   │       ├── Subtotal
│   │   │       ├── Tax
│   │   │       └── TotalPrice
│   │   └── Step6_FileUpload
│   │       ├── FileDropZone
│   │       │   ├── DropIcon
│   │       │   ├── DropText
│   │       │   ├── AllowedFormats
│   │       │   └── MaxSizeInfo
│   │       ├── UploadedFileList
│   │       │   └── UploadedFileItem[]
│   │       │       ├── FileIcon
│   │       │       ├── FileName
│   │       │       ├── FileSize
│   │       │       ├── ValidationStatus (검증중 | 완료 | 실패)
│   │       │       ├── PreviewButton
│   │       │       └── DeleteButton
│   │       ├── ProofCheckbox (시안 확인 여부)
│   │       └── DesignGuideLink
│   └── PreviewPanel (right / bottom)
│       ├── ProductPreview
│       │   ├── PreviewImage (옵션 반영 미리보기)
│       │   └── PreviewCaption
│       ├── OptionSummary
│       │   └── OptionSummaryItem[] (선택된 옵션 목록)
│       ├── PriceSummary
│       │   ├── EstimatedPrice
│       │   └── PriceNote (VAT 포함 여부)
│       └── ActionButtons
│           ├── CartButton (장바구니)
│           └── OrderButton (바로주문)
├── StepNavigation
│   ├── PrevButton
│   └── NextButton (마지막 단계: 주문완료)
└── PriceSummaryBar (Mobile sticky bottom)
    ├── PriceDisplay
    ├── PrevButton
    └── NextButton
\`\`\`

---

## 4. Props / States

### Global Wizard State

\`\`\`typescript
interface PrintWizardState {
  // 현재 단계
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  completedSteps: Set<number>;

  // Step 1: 상품 선택
  productType: ProductType | null;

  // Step 2: 사이즈
  selectedSize: SizeOption | null;
  customSize: { width: number; height: number } | null;

  // Step 3: 용지/소재
  paperCategory: 'standard' | 'premium' | 'special';
  selectedPaper: PaperOption | null;

  // Step 4: 후가공
  selectedFinishings: FinishingOption[];

  // Step 5: 수량 + 가격
  quantity: number;
  deliveryOption: 'normal' | 'fast' | 'urgent';
  calculatedPrice: PriceResult | null;

  // Step 6: 파일 업로드
  uploadedFiles: UploadedFile[];
  proofRequired: boolean;

  // 글로벌 상태
  isCalculating: boolean;
  isPriceStale: boolean; // 옵션 변경 후 재계산 필요
  errors: WizardError[];
}

type ProductType =
  | 'business_card'    // 명함
  | 'flyer_poster'     // 전단/포스터
  | 'leaflet'          // 리플렛
  | 'catalog'          // 카탈로그
  | 'envelope'         // 봉투
  | 'sticker'          // 스티커
  | 'banner'           // 현수막
  | 'standing_banner'; // 배너

interface SizeOption {
  id: string;
  name: string;           // "90x50mm", "A4", "B5" 등
  width: number;          // mm
  height: number;         // mm
  isCustom: boolean;
  minQuantity: number;    // 이 사이즈의 최소 주문수량
  quantityUnit: number;   // 수량 단위 (100매, 500매 등)
}

interface PaperOption {
  id: string;
  name: string;           // "스노우지", "아르떼", "랑데뷰" 등
  category: 'standard' | 'premium' | 'special';
  weight: number;         // g (평량)
  description: string;
  swatchUrl: string;      // 질감 미리보기 이미지
  additionalPrice: number; // 추가 금액 (기본 대비)
  compatibleFinishings: string[]; // 호환 후가공 ID 목록
}

interface FinishingOption {
  id: string;
  name: string;           // "양면코팅", "귀도리", "박(금)", "형압" 등
  category: 'coating' | 'cutting' | 'foil' | 'embossing' | 'other';
  description: string;
  previewUrl: string;
  pricePerUnit: number;
  incompatibleWith: string[]; // 비호환 후가공 ID 목록
}

interface PriceResult {
  printCost: number;      // 인쇄비
  paperCost: number;      // 용지비
  finishingCost: number;  // 후가공비
  deliverySurcharge: number; // 납기 추가금
  subtotal: number;       // 소계
  tax: number;            // 부가세
  total: number;          // 합계
  calculatedAt: string;   // ISO 8601
  validUntil: string;     // 가격 유효기한
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;           // bytes
  type: string;           // MIME type
  uploadProgress: number; // 0-100
  status: 'uploading' | 'validating' | 'valid' | 'invalid';
  validationErrors: string[];
  previewUrl: string | null;
  serverFileId: string | null;
}

interface WizardError {
  step: number;
  field: string;
  code: string;
  message: string;
}
\`\`\`

### 개별 컴포넌트 Props

\`\`\`typescript
// StepIndicator
interface StepIndicatorProps {
  currentStep: number;
  completedSteps: Set<number>;
  steps: { label: string; description?: string }[];
  onStepClick: (step: number) => void; // 완료된 단계만 클릭 가능
}

// ProductTypeCard
interface ProductTypeCardProps {
  type: ProductType;
  name: string;
  imageUrl: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

// SizeOptionGroup
interface SizeOptionGroupProps {
  sizes: SizeOption[];
  selectedSize: SizeOption | null;
  allowCustom: boolean;
  onSelect: (size: SizeOption) => void;
  onCustomSizeChange: (width: number, height: number) => void;
}

// PaperOptionCard
interface PaperOptionCardProps {
  paper: PaperOption;
  isSelected: boolean;
  isCompatible: boolean; // 현재 후가공 선택과 호환 여부
  onSelect: () => void;
}

// FinishingOptionCard
interface FinishingOptionCardProps {
  finishing: FinishingOption;
  isSelected: boolean;
  isCompatible: boolean; // 현재 용지/다른 후가공과 호환 여부
  incompatibleReason?: string;
  onToggle: () => void;
}

// QuantityInput
interface QuantityInputProps {
  value: number;
  min: number;
  step: number;          // 수량 단위
  max: number;
  quickOptions: number[];
  onChange: (qty: number) => void;
}

// FileDropZone
interface FileDropZoneProps {
  acceptedFormats: string[];    // ['.ai', '.pdf', '.psd', '.jpg', '.png', '.tiff']
  maxFileSize: number;          // bytes (100MB)
  maxFiles: number;
  files: UploadedFile[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
}

// PriceSummary
interface PriceSummaryProps {
  price: PriceResult | null;
  isCalculating: boolean;
  isStale: boolean;
  onRecalculate: () => void;
}

// StepNavigation
interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;      // 현재 단계 유효성 충족 여부
  isLastStep: boolean;
  nextLabel?: string;      // 마지막 단계: "주문완료"
  onPrev: () => void;
  onNext: () => void;
}
\`\`\`

---

## 5. API 매핑

### 5.1 shopby API (상품 정보)

\`\`\`
GET /products/{productNo}
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 상품 기본 정보 조회 (이름, 이미지, 카테고리) |
| **인증** | 불필요 (공개 상품) |
| **캐싱** | SWR, staleTime: 10분 |

**Response 매핑:**

| API 필드 | UI 매핑 |
|----------|---------|
| \`productName\` | Breadcrumb, PageTitle |
| \`imageUrls[0]\` | PreviewImage fallback |
| \`categoryDepths\` | Breadcrumb 경로 |
| \`saleStatusType\` | 판매 가능 여부 체크 |

\`\`\`
GET /products/{productNo}/options
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 상품 옵션 목록 조회 (shopby 옵션 체계) |
| **인증** | 불필요 |
| **캐싱** | SWR, staleTime: 5분 |

**Response 매핑:**

| API 필드 | UI 매핑 |
|----------|---------|
| \`flatOptions[].optionName\` | 기본 옵션명 표시 |
| \`flatOptions[].buyPrice\` | 기본 가격 (Custom 가격과 병행) |
| \`flatOptions[].stockCnt\` | 재고 상태 (0이면 품절 표시) |

### 5.2 Custom API (인쇄 옵션)

\`\`\`
GET /api/print/product-types
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 인쇄 제품 타입 목록 조회 |
| **인증** | 불필요 |
| **캐싱** | SWR, staleTime: 30분 (거의 변하지 않음) |

**Response:**

\`\`\`json
{
  "productTypes": [
    {
      "id": "business_card",
      "name": "명함",
      "imageUrl": "/images/types/business_card.jpg",
      "description": "다양한 용지와 후가공으로 나만의 명함",
      "availableSizes": ["90x50", "86x52", "90x55", "custom"],
      "defaultPaperId": "snow_250"
    }
  ]
}
\`\`\`

\`\`\`
GET /api/print/options?productType={type}
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 제품 타입별 가용 옵션 전체 조회 (사이즈, 용지, 후가공) |
| **인증** | 불필요 |
| **캐싱** | SWR, staleTime: 10분 |

**Response:**

\`\`\`json
{
  "sizes": [
    {
      "id": "90x50",
      "name": "90x50mm (표준)",
      "width": 90,
      "height": 50,
      "minQuantity": 200,
      "quantityUnit": 100
    }
  ],
  "papers": [
    {
      "id": "snow_250",
      "name": "스노우지",
      "category": "standard",
      "weight": 250,
      "description": "가장 일반적인 명함 용지",
      "swatchUrl": "/images/papers/snow_250.jpg",
      "additionalPrice": 0,
      "compatibleFinishings": ["coating_both", "round_corner", "foil_gold"]
    }
  ],
  "finishings": [
    {
      "id": "coating_both",
      "name": "양면코팅",
      "category": "coating",
      "description": "양면 유광 코팅 처리",
      "previewUrl": "/images/finishings/coating_both.jpg",
      "pricePerUnit": 0.5,
      "incompatibleWith": ["coating_matte"]
    }
  ]
}
\`\`\`

\`\`\`
POST /api/print/calculate-price
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 실시간 가격 계산 |
| **인증** | 불필요 (비회원도 가격 조회 가능) |
| **Debounce** | 300ms (수량 입력 시) |
| **Timeout** | 5초 |

**Request:**

\`\`\`json
{
  "productType": "business_card",
  "sizeId": "90x50",
  "paperId": "snow_250",
  "finishingIds": ["coating_both", "round_corner"],
  "quantity": 500,
  "deliveryOption": "fast"
}
\`\`\`

**Response:**

\`\`\`json
{
  "printCost": 35000,
  "paperCost": 12000,
  "finishingCost": 8000,
  "deliverySurcharge": 5000,
  "subtotal": 55000,
  "tax": 5500,
  "total": 60500,
  "calculatedAt": "2026-03-19T10:30:00+09:00",
  "validUntil": "2026-03-19T10:35:00+09:00"
}
\`\`\`

\`\`\`
POST /api/files/upload
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 인쇄 파일 업로드 |
| **인증** | 필요 (회원 로그인) |
| **Content-Type** | \`multipart/form-data\` |
| **최대 파일 크기** | 100MB |
| **허용 포맷** | AI, PDF, PSD, JPG, PNG, TIFF |

**Request:**

\`\`\`
FormData:
  file: (binary)
  productType: "business_card"
  sizeId: "90x50"
\`\`\`

**Response:**

\`\`\`json
{
  "fileId": "file_abc123",
  "fileName": "명함_앞면.ai",
  "fileSize": 2412544,
  "previewUrl": "/api/files/file_abc123/preview",
  "validation": {
    "status": "valid",
    "resolution": 300,
    "colorMode": "CMYK",
    "dimensions": { "width": 96, "height": 56 },
    "warnings": ["재단선 여유가 2mm입니다. 3mm 권장합니다."]
  }
}
\`\`\`

\`\`\`
POST /api/print/orders
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 인쇄 주문 생성 |
| **인증** | 필요 |
| **선행조건** | 가격 계산 완료 + 파일 업로드 완료 |

**Request:**

\`\`\`json
{
  "productType": "business_card",
  "sizeId": "90x50",
  "paperId": "snow_250",
  "finishingIds": ["coating_both", "round_corner"],
  "quantity": 500,
  "deliveryOption": "fast",
  "fileIds": ["file_abc123", "file_def456"],
  "proofRequired": true,
  "priceToken": "price_xyz789"
}
\`\`\`

---

## 6. 데이터 플로우

### 6.1 옵션 선택 → 의존성 체크 → 가격 재계산 플로우

\`\`\`
[사용자 액션]
     │
     ▼
┌─────────────┐     ┌──────────────────┐
│ Step 변경    │────▶│ 의존성 체크       │
│ (옵션 선택)  │     │                  │
└─────────────┘     │ 상위 단계 변경?   │
                    │  YES → 하위 초기화 │
                    │  NO → 유지        │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ isPriceStale =   │
                    │ true             │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Step >= 5 ?      │
                    │  YES → 즉시 계산  │
                    │  NO → 지연 계산   │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ POST /api/print/ │
                    │ calculate-price  │
                    │ (debounce 300ms) │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ 가격 결과 반영    │
                    │ isPriceStale =   │
                    │ false            │
                    └──────────────────┘
\`\`\`

### 6.2 옵션 의존성 초기화 규칙

| 변경 단계 | 초기화 대상 | 설명 |
|----------|------------|------|
| Step 1 (제품타입) | Step 2, 3, 4, 5 | 사이즈, 용지, 후가공, 수량 모두 초기화 |
| Step 2 (사이즈) | Step 3, 4, 5 | 용지, 후가공, 수량 초기화 (최소수량 변경) |
| Step 3 (용지) | Step 4 (부분) | 비호환 후가공만 해제, 나머지 유지 |
| Step 4 (후가공) | - | 하위 초기화 없음 (가격만 재계산) |
| Step 5 (수량) | - | 가격만 재계산 |

### 6.3 파일 업로드 → 주문 생성 플로우

\`\`\`
[파일 드래그/선택]
     │
     ▼
┌──────────────┐     ┌──────────────────┐
│ 클라이언트   │────▶│ 서버 업로드       │
│ 포맷 체크    │     │ POST /api/files/ │
│ (확장자,     │     │ upload           │
│  파일크기)   │     │                  │
└──────────────┘     └────────┬─────────┘
                              │
                    ┌─────────▼────────┐
                    │ 서버 검증        │
                    │ - 해상도 체크    │
                    │ - 색상모드 체크  │
                    │ - 사이즈 매칭    │
                    │ - 파일 무결성    │
                    └─────────┬────────┘
                              │
                    ┌─────────▼────────┐
                    │ 검증 결과 반영   │
                    │ valid / invalid  │
                    │ + warnings[]     │
                    └─────────┬────────┘
                              │
                    ┌─────────▼────────┐
                    │ 모든 파일 valid? │
                    │  YES → 주문 가능 │
                    │  NO → 재업로드   │
                    └──────────────────┘
\`\`\`

### 6.4 가격 캐싱 전략

\`\`\`
[가격 계산 요청]
     │
     ▼
┌──────────────────┐
│ 캐시 키 생성     │  key = hash(productType + sizeId + paperId +
│                  │        finishingIds + quantity + deliveryOption)
└────────┬─────────┘
         │
┌────────▼─────────┐
│ 캐시 히트?       │
│  YES → validUntil│
│    체크           │
│  NO → API 호출   │
└────────┬─────────┘
         │
┌────────▼─────────┐
│ 캐시 TTL: 5분    │
│ 메모리 캐시      │
│ (React Query)    │
└──────────────────┘
\`\`\`

---

## 7. 인터랙션 상태

### 7.1 상태 정의

| 상태 | 설명 | UI 표현 |
|------|------|---------|
| \`idle\` | 초기 상태, 아무 옵션도 선택하지 않음 | Step 1 활성, 나머지 비활성 |
| \`loading\` | 옵션 데이터 로딩 중 | Skeleton 카드 표시, 인터랙션 차단 |
| \`selecting\` | 사용자가 옵션을 선택/변경 중 | 선택된 카드 하이라이트, 다음 버튼 활성 |
| \`calculating\` | 서버에서 가격 계산 중 | 가격 영역 Spinner, "계산 중..." 표시 |
| \`calculated\` | 가격 계산 완료 | 가격 상세 표시, 장바구니/주문 버튼 활성 |
| \`uploading\` | 파일 업로드 진행 중 | Progress bar, 업로드 % 표시 |
| \`validating\` | 업로드된 파일 서버 검증 중 | Spinner + "검증 중..." 텍스트 |
| \`valid\` | 모든 파일 검증 완료 | 체크마크, 주문완료 버튼 활성 |
| \`invalid\` | 파일 검증 실패 또는 비호환 옵션 | 에러 메시지, 빨간 테두리, 안내 텍스트 |
| \`error\` | API 오류 발생 | Toast 알림 + 인라인 에러 메시지 |
| \`submitting\` | 주문 생성 요청 중 | 전체 오버레이 + Spinner, 버튼 비활성 |
| \`complete\` | 주문 생성 완료 | 주문완료 페이지로 리다이렉트 |

### 7.2 상태 전이 다이어그램

\`\`\`
idle → loading → selecting ⇄ calculating → calculated
                    │                          │
                    ▼                          ▼
              selecting (옵션 변경)     uploading → validating → valid
                                                         │         │
                                                         ▼         ▼
                                                      invalid   submitting → complete
                                                         │
                                                         ▼
                                                   selecting (재업로드)

* 모든 상태에서 error 전이 가능
* error → 이전 상태 복원 (재시도 시)
\`\`\`

### 7.3 각 상태별 UI 세부사항

**loading 상태:**
- StepIndicator: 전체 비활성 (opacity: 0.5)
- OptionPanel: Skeleton 카드 6개 (ProductType 기준)
- PreviewPanel: Skeleton 이미지 + Skeleton 텍스트 3줄
- StepNavigation: 버튼 비활성 (disabled)

**calculating 상태:**
- PriceSummary: 금액 대신 Spinner + "가격 계산 중..."
- ActionButtons: 비활성 (disabled)
- OptionPanel: 인터랙션 허용 (옵션 변경 가능, 재계산 트리거)

**uploading 상태:**
- FileDropZone: 추가 파일 드래그 허용
- UploadedFileItem: ProgressBar (0-100%), 파일명 표시
- DeleteButton: 업로드 중에도 취소 가능 (AbortController)
- StepNavigation: "주문완료" 버튼 비활성

**submitting 상태:**
- 전체 화면 반투명 오버레이 (z-index: 50)
- 중앙 Spinner + "주문을 처리하고 있습니다..."
- 모든 버튼 비활성
- 브라우저 beforeunload 경고 활성

---

## 8. 에러 처리

### 8.1 에러 유형별 처리

| 에러 유형 | 발생 시점 | 에러 코드 | 사용자 메시지 | 처리 방법 |
|----------|----------|-----------|-------------|----------|
| 비호환 옵션 조합 | Step 4 (후가공) | \`INCOMPATIBLE_COMBO\` | "선택하신 용지와 해당 후가공은 함께 사용할 수 없습니다." | 비호환 옵션 비활성 + 툴팁 표시 |
| 최소 수량 미달 | Step 5 (수량) | \`MIN_QUANTITY\` | "최소 주문수량은 {min}매입니다." | 최소값으로 자동 보정 + 안내 |
| 수량 단위 불일치 | Step 5 (수량) | \`QUANTITY_UNIT\` | "{unit}매 단위로 주문 가능합니다." | 가까운 단위로 올림 보정 |
| 파일 포맷 오류 | Step 6 (업로드) | \`INVALID_FORMAT\` | "지원하지 않는 파일 형식입니다. (AI, PDF, PSD, JPG, PNG, TIFF)" | 파일 추가 거부 + 포맷 안내 |
| 파일 크기 초과 | Step 6 (업로드) | \`FILE_TOO_LARGE\` | "파일 크기가 100MB를 초과합니다." | 업로드 차단 + 크기 안내 |
| 파일 해상도 부족 | Step 6 (검증) | \`LOW_RESOLUTION\` | "인쇄 품질을 위해 300dpi 이상의 파일을 권장합니다." | Warning 표시 (업로드는 허용) |
| 색상모드 불일치 | Step 6 (검증) | \`RGB_COLOR_MODE\` | "RGB 파일입니다. CMYK로 변환 후 업로드해 주세요." | Warning 표시 + 가이드 링크 |
| 가격 계산 타임아웃 | Step 5 | \`PRICE_TIMEOUT\` | "가격 계산에 시간이 걸리고 있습니다. 다시 시도해 주세요." | 재시도 버튼 표시, 3회 실패 시 고객센터 안내 |
| 가격 만료 | 주문 시 | \`PRICE_EXPIRED\` | "가격이 변경되었습니다. 새로운 가격을 확인해 주세요." | 자동 재계산 + 변경사항 하이라이트 |
| 네트워크 오류 | 전구간 | \`NETWORK_ERROR\` | "네트워크 연결을 확인해 주세요." | Toast 알림 + 자동 재시도 (3회) |
| 서버 오류 | 전구간 | \`SERVER_ERROR\` | "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." | Toast 알림 + 재시도 버튼 |
| 인증 만료 | 파일업로드/주문 | \`AUTH_EXPIRED\` | "로그인이 만료되었습니다. 다시 로그인해 주세요." | 로그인 모달 표시 (진행 상태 유지) |

### 8.2 에러 표시 UI 패턴

**인라인 에러 (필드 레벨):**
\`\`\`
┌──────────────────────────────┐
│  수량: [  150  ]             │
│  최소 주문수량은 200매입니다    │  ← 빨간 텍스트, border-red-500
└──────────────────────────────┘
\`\`\`

**배너 에러 (단계 레벨):**
\`\`\`
┌──────────────────────────────────────────────────┐
│ 선택하신 옵션 조합에 문제가 있습니다.                │  ← bg-red-50, border-red-200
│   스노우지 250g에는 형압 후가공을 적용할 수 없습니다. │
│   [후가공 변경하기]                                 │
└──────────────────────────────────────────────────┘
\`\`\`

**Toast 에러 (글로벌):**
\`\`\`
┌──────────────────────────────┐
│ ✕  네트워크 연결을 확인해      │  ← 우측 상단, auto-dismiss 5초
│    주세요. [재시도]            │
└──────────────────────────────┘
\`\`\`

### 8.3 에러 복구 전략

\`\`\`typescript
// 가격 계산 재시도 로직
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // exponential backoff

async function calculatePriceWithRetry(params: PriceRequest): Promise<PriceResult> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await calculatePrice(params);
    } catch (error) {
      if (i === MAX_RETRIES - 1) throw error;
      await delay(RETRY_DELAYS[i]);
    }
  }
  throw new Error('가격 계산에 실패했습니다.');
}

// 파일 업로드 재시도 (AbortController 지원)
async function uploadFileWithRetry(
  file: File,
  params: UploadParams,
  signal: AbortSignal
): Promise<UploadResult> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await uploadFile(file, params, signal);
    } catch (error) {
      if (signal.aborted) throw error; // 사용자 취소
      if (i === MAX_RETRIES - 1) throw error;
      await delay(RETRY_DELAYS[i]);
    }
  }
  throw new Error('파일 업로드에 실패했습니다.');
}
\`\`\`

---

## 9. 접근성

### 9.1 키보드 내비게이션

| 키 | 동작 | 컨텍스트 |
|----|------|---------|
| \`Tab\` | 다음 포커스 가능 요소로 이동 | 전체 |
| \`Shift + Tab\` | 이전 포커스 가능 요소로 이동 | 전체 |
| \`Enter\` / \`Space\` | 옵션 선택 / 버튼 클릭 | ProductTypeCard, SizeCard, PaperCard 등 |
| \`Arrow Left/Right\` | StepIndicator 단계 간 이동 | StepIndicator 포커스 시 |
| \`Arrow Up/Down\` | 목록 내 항목 간 이동 | PaperOptionList, FinishingList |
| \`Escape\` | 현재 단계 선택 취소 / 모달 닫기 | 옵션 선택 영역 |
| \`Home\` / \`End\` | 목록 첫/마지막 항목으로 이동 | 카드 그리드, 옵션 목록 |

### 9.2 ARIA 속성

**StepIndicator:**
\`\`\`html
<nav aria-label="주문 진행 단계">
  <ol role="list">
    <li role="listitem" aria-current="step">
      <span aria-label="1단계: 상품 선택, 현재 단계">1. 상품 선택</span>
    </li>
    <li role="listitem" aria-disabled="true">
      <span aria-label="2단계: 사이즈, 미완료">2. 사이즈</span>
    </li>
  </ol>
</nav>
\`\`\`

**ProductTypeCard Grid:**
\`\`\`html
<div role="radiogroup" aria-label="인쇄 제품 타입 선택">
  <div role="radio" aria-checked="true" tabindex="0"
       aria-label="명함 - 다양한 용지와 후가공으로 나만의 명함">
  </div>
  <div role="radio" aria-checked="false" tabindex="-1"
       aria-label="전단/포스터 - 행사, 홍보를 위한 인쇄물">
  </div>
</div>
\`\`\`

**PriceSummary (실시간 업데이트):**
\`\`\`html
<div aria-live="polite" aria-atomic="true">
  <p>예상 금액: <span aria-label="60,500원">₩60,500</span> (VAT 포함)</p>
</div>
\`\`\`

**FileDropZone:**
\`\`\`html
<div role="button" tabindex="0"
     aria-label="인쇄 파일 업로드. 클릭하거나 파일을 끌어다 놓으세요. 허용 형식: AI, PDF, PSD, JPG, PNG, TIFF. 최대 100MB">
</div>
<input type="file" id="file-upload" class="sr-only"
       accept=".ai,.pdf,.psd,.jpg,.jpeg,.png,.tiff,.tif"
       multiple aria-describedby="file-upload-help" />
<p id="file-upload-help" class="sr-only">
  인쇄 파일을 선택하세요. 여러 파일을 동시에 선택할 수 있습니다.
</p>
\`\`\`

**UploadedFileItem (검증 상태):**
\`\`\`html
<li aria-label="명함_앞면.ai, 2.3MB, 검증 완료">
  <span>명함_앞면.ai</span>
  <span>2.3MB</span>
  <span role="status" aria-label="파일 검증 완료">✓ 검증완료</span>
  <button aria-label="명함_앞면.ai 미리보기">미리보기</button>
  <button aria-label="명함_앞면.ai 삭제">삭제</button>
</li>
\`\`\`

**에러 메시지 연결:**
\`\`\`html
<div>
  <label for="quantity-input">수량</label>
  <input id="quantity-input" type="number" aria-describedby="quantity-error"
         aria-invalid="true" value="150" />
  <p id="quantity-error" role="alert" class="text-red-500">
    최소 주문수량은 200매입니다.
  </p>
</div>
\`\`\`

### 9.3 스크린 리더 지원

- Step 전환 시 \`aria-live="assertive"\`로 "2단계: 사이즈 선택으로 이동했습니다" 안내
- 가격 변경 시 \`aria-live="polite"\`로 "예상 금액이 60,500원으로 변경되었습니다" 안내
- 파일 업로드 진행률 \`aria-live="polite"\` + \`aria-valuenow\`로 퍼센트 안내
- 파일 검증 완료 시 \`role="status"\`로 결과 안내
- 에러 발생 시 \`role="alert"\`로 즉시 안내

### 9.4 포커스 관리

- Step 전환 시: 새 단계의 첫 번째 인터랙티브 요소로 포커스 이동
- 에러 발생 시: 에러 메시지로 포커스 이동
- 파일 삭제 시: 다음 파일 항목 또는 FileDropZone으로 포커스 이동
- 모달/Sheet 열림 시: Sheet 내부 첫 요소로 포커스, Escape로 닫기
- 주문 완료 시: 완료 페이지 heading으로 포커스 이동

### 9.5 반응형 접근성

- Mobile: StepIndicator 가로 스크롤 시 \`role="tablist"\` + swipe 제스처 지원
- Mobile: PriceSummaryBar sticky bottom에 포커스 트랩 없음 (스크롤 자유)
- Desktop: SplitLayout 좌→우 Tab 순서 보장
- 모든 Breakpoint: 최소 터치 영역 44x44px (WCAG 2.5.5)
- 색상 대비: 모든 텍스트 4.5:1 이상 (WCAG AA), Primary #5538B6 on white = 7.2:1
