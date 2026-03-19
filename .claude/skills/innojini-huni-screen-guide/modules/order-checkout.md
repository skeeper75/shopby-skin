# A-6: 주문/결제 (7 화면)

## 목차

- [SCR-A6-FILE-UPLOAD: 파일/편집정보 입력](#scr-a6-file-upload)
- [SCR-A6-CART: 보관함/장바구니](#scr-a6-cart)
- [SCR-A6-SHIPPING: 배송 정보](#scr-a6-shipping)
- [SCR-A6-ADDRESS-LIST: 배송지 목록](#scr-a6-address-list)
- [SCR-A6-PAYMENT: 결제하기](#scr-a6-payment)
- [SCR-A6-ORDER-COMPLETE: 주문 완료](#scr-a6-order-complete)
- [SCR-A6-DESIGN-REQUEST: 디자인 의뢰](#scr-a6-design-request)

---

## SCR-A6-FILE-UPLOAD

**파일/편집정보 입력 | CUSTOM | 우선순위 1 | 규모 XL**

### 1. 화면 개요

- ID: SCR-A6-FILE-UPLOAD
- 화면명: 파일/편집정보 입력
- 분류: CUSTOM (S3 + PitStop API 연동)
- 우선순위: 1 (필수 — 인쇄 주문의 핵심 진입점)
- 규모: XL (다중 파일 업로드, 실시간 검증, 상태 머신, 5+ 상태)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  파일/편집정보 입력      │ ← header (48px)
├─────────────────────────────┤
│ [상품명 · 단가 · 수량]       │ ← 주문 요약 바 (collapsed)
├─────────────────────────────┤
│  디자인 파일 보유 여부       │
│  ┌──────────┬──────────┐    │
│  │ 디자인   │ 디자인   │    │ ← DesignRequestToggle
│  │   있음   │   없음   │    │   (탭형 토글)
│  └──────────┴──────────┘    │
├─────────────────────────────┤
│  파일 업로드 (디자인 있음)   │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   + 파일 끌어다 놓기 │    │ ← DropzoneUploader
│  │   또는 파일 선택     │    │   (dashed border)
│  │   AI·PDF·PSD·CDR   │    │
│  │   300dpi+ CMYK      │    │
│  └─────────────────────┘    │
│                             │
│  업로드된 파일 목록          │
│  ┌─────────────────────┐    │
│  │ [썸네일] 파일명.pdf  │    │ ← FileListItem
│  │  ██████░░  75%       │    │   progress bar
│  │  [검증중...]          │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ [썸네일] 파일명2.ai  │    │
│  │  ██████████ 완료     │    │
│  │  [✓ 검증 통과]       │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │    FileValidationAlert   │
│  │  ⚠ 재단선 3mm 필요  │    │
│  └─────────────────────┘    │
│                             │
│  인쇄 사양 메모 (선택)       │
│  ┌─────────────────────┐    │
│  │  특이사항 입력...    │    │ ← textarea
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │   장바구니에 담기    │    │ ← CTA (primary)
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**데스크탑 (1280px) — PageShell maxWidth="xl"**
```
┌──────────────────────────────────────────────────────────────┐
│                        Header                                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────────────┐  ┌─────────────────────┐ │
│  │  파일/편집정보 입력           │  │  주문 요약            │ │
│  │                               │  │  ─────────────────  │ │
│  │  디자인 보유 여부             │  │  [상품명]            │ │
│  │  [ 있음 ] [ 없음 ]            │  │  단가: 50,000원      │ │
│  │                               │  │  수량: 500부         │ │
│  │  ┌───────────────────────┐   │  │  ─────────────────  │ │
│  │  │                       │   │  │  소계: 50,000원      │ │
│  │  │  파일을 여기에 끌어다  │   │  │  배송비: 3,000원     │ │
│  │  │  놓거나 파일 선택      │   │  │  합계: 53,000원      │ │
│  │  │                       │   │  └─────────────────────┘ │
│  │  │  지원: AI PDF PSD CDR │   │                          │
│  │  │  CMYK 300dpi+ 3mm재단 │   │  ┌─────────────────────┐ │
│  │  └───────────────────────┘   │  │  PreviewRenderer     │ │
│  │                               │  │  (업로드 완료 후)    │ │
│  │  [파일1.pdf] ██████ 완료 ✓   │  │  [미리보기 이미지]   │ │
│  │  [파일2.ai]  ██░░░░ 40% ...  │  └─────────────────────┘ │
│  │                               │                          │
│  │  FileValidationAlert          │                          │
│  │  ⚠ 파일2.ai: 해상도 72dpi    │                          │
│  │                               │                          │
│  │  ┌──────────────────────┐    │                          │
│  │  │   장바구니에 담기     │    │                          │
│  │  └──────────────────────┘    │                          │
│  └───────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
FileUploadPage
├── PageShell (maxWidth="xl")
│   ├── OrderSummaryBar (collapsed on mobile)
│   ├── DesignRequestToggle
│   │   ├── Tab: "디자인 있음" → FileUploadSection
│   │   └── Tab: "디자인 없음" → NoDesignSection
│   │       ├── TemplateSelectCard (자체 제작)
│   │       └── DesignRequestCard → SCR-A6-DESIGN-REQUEST
│   ├── FileUploadSection (조건부 렌더)
│   │   ├── DropzoneUploader
│   │   │   ├── DragOverlay
│   │   │   └── FileInput (accept=".ai,.pdf,.psd,.cdr")
│   │   ├── FileList
│   │   │   └── FileListItem (per file)
│   │   │       ├── FileThumbnail
│   │   │       ├── UploadProgressBar
│   │   │       ├── ValidationStatusBadge
│   │   │       │   ├── STAT_010: 접수됨
│   │   │       │   ├── STAT_030: 검증중
│   │   │       │   ├── STAT_050: 완료
│   │   │       │   └── STAT_900: 오류
│   │   │       └── FileRemoveButton
│   │   └── FileValidationAlert (조건부)
│   ├── PrintSpecNote (textarea, optional)
│   └── AddToCartButton (CTA)
└── PreviewRenderer (desktop sidebar / modal on mobile)
```

### 4. Props/States 정의

**DropzoneUploader Props**
```
accept: string[]          // ['.ai', '.pdf', '.psd', '.cdr']
maxFiles: number          // 10
maxSizePerFile: number    // 500MB (bytes)
onDrop: (files) => void
onReject: (rejections) => void
disabled: boolean
```

**FileUploadState (per file)**
```
id: string                // uuid
file: File
name: string
size: number
s3Key: string | null      // S3 업로드 후 키
uploadProgress: number    // 0-100
pitStopStatus:
  | 'idle'
  | 'STAT_010'            // 접수됨
  | 'STAT_030'            // 검증 처리중
  | 'STAT_050'            // 검증 완료
  | 'STAT_900'            // 오류
validationErrors: ValidationError[]
previewUrl: string | null
```

**ValidationError**
```
code: 'LOW_DPI' | 'WRONG_COLORSPACE' | 'NO_BLEED' | 'UNSUPPORTED_FORMAT'
message: string           // 한국어 오류 메시지
severity: 'error' | 'warning'
```

**페이지 레벨 State**
```
designMode: 'has_design' | 'no_design'
files: FileUploadState[]
isAllValidated: boolean   // 모든 파일 STAT_050
printNote: string
isSubmitting: boolean
```

### 5. shopby API 매핑

> CUSTOM 화면 — shopby API 없음. 자체 구축 API 설계.

**파일 업로드 presigned URL 요청**
```
POST /api/v1/files/upload-url
Body: { filename, fileType, orderItemId }
Response: {
  uploadUrl: string,       // S3 presigned PUT URL (15분 만료)
  s3Key: string,
  fileId: string
}
Auth: 로그인 필수
```

**S3 직접 업로드 (presigned URL 사용)**
```
PUT {uploadUrl}
Body: (binary file data)
Headers: Content-Type: application/octet-stream
Response: 204 No Content
Auth: S3 presigned URL 내장 (별도 인증 불필요)
```

**PitStop 검증 요청**
```
POST /api/v1/files/{fileId}/validate
Body: { s3Key, productId }
Response: {
  jobId: string,
  status: 'STAT_010'
}
Auth: 로그인 필수
```

**PitStop 검증 상태 폴링**
```
GET /api/v1/files/{fileId}/validate-status
Response: {
  status: 'STAT_010' | 'STAT_030' | 'STAT_050' | 'STAT_900',
  errors: ValidationError[],
  previewUrl: string | null,
  processedAt: string | null
}
Auth: 로그인 필수
폴링 간격: 2초, 최대 5분
```

**장바구니 담기**
```
POST /api/v1/cart/items
Body: {
  productNo: number,
  optionNo: number,
  quantity: number,
  fileIds: string[],
  printNote: string
}
Response: { cartItemId: string }
Auth: 로그인 필수
```

### 6. 데이터 플로우

```
사용자 파일 드래그/선택
  → DropzoneUploader.onDrop()
  → 파일 유효성 1차 검사 (확장자, 크기)
  → FileList에 idle 상태로 추가
  → POST /api/v1/files/upload-url (presigned URL 취득)
  → PUT {presignedUrl} (S3 직접 업로드)
    → uploadProgress 0→100 업데이트 (XHR progress 이벤트)
  → POST /api/v1/files/{fileId}/validate (PitStop 요청)
    → status: STAT_010 표시
  → polling GET /api/v1/files/{fileId}/validate-status
    → STAT_030: "검증 중..." 스피너
    → STAT_050: "검증 통과" + previewUrl 렌더
    → STAT_900: ValidationError 표시 + FileValidationAlert

사용자 "장바구니에 담기" 클릭
  → isAllValidated 체크 (모든 파일 STAT_050 필요)
  → POST /api/v1/cart/items
  → 성공: SCR-A6-CART로 이동
  → 실패: 에러 토스트
```

### 7. 인터랙션 상태

1. **초기 상태**: 빈 Dropzone, CTA 비활성화
2. **드래그 오버**: Dropzone 테두리 파란색 강조, 오버레이 텍스트 변경
3. **업로드 중**: 파일별 progress bar, CTA 비활성화, 취소 버튼 노출
4. **검증 중 (STAT_030)**: 스피너 애니메이션, "PitStop으로 검증 중..."
5. **검증 완료 (STAT_050)**: 초록 체크, previewUrl로 썸네일, CTA 활성화
6. **검증 오류 (STAT_900)**: 빨간 X, 상세 오류 Alert, 파일 교체 유도
7. **혼합 상태**: 일부 완료/일부 오류 — CTA는 오류가 없을 때만 활성화
8. **최대 파일 초과**: "최대 10개까지 업로드 가능합니다" 토스트

**엣지 케이스**
- 네트워크 단절 중 업로드: 재시도 UI + "연결 확인 후 다시 시도" 안내
- S3 presigned URL 만료 (15분): 자동 재발급 후 이어서 업로드
- 폴링 5분 타임아웃: "검증 시간이 초과되었습니다. 고객센터 문의" 안내
- 동일 파일 재업로드: 중복 경고 다이얼로그 → 교체 또는 추가 선택

### 8. 에러 처리

| 에러 상황 | 사용자 피드백 |
|-----------|-------------|
| 지원하지 않는 확장자 | "AI, PDF, PSD, CDR 파일만 업로드 가능합니다" (즉시) |
| 파일 크기 초과 (500MB+) | "파일 크기가 500MB를 초과합니다" (즉시) |
| S3 업로드 실패 (네트워크) | "파일 업로드에 실패했습니다. 다시 시도해 주세요" + 재시도 버튼 |
| PitStop 해상도 부족 (72dpi) | "[파일명]: 해상도가 너무 낮습니다. 300dpi 이상 파일을 사용해 주세요" |
| CMYK 아님 (RGB) | "[파일명]: RGB 색상 모드입니다. CMYK로 변환 후 업로드해 주세요" |
| 재단선 없음 | "[파일명]: 재단선(블리드) 3mm가 필요합니다" |
| 장바구니 담기 실패 | "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요" |

### 9. 접근성 요구사항

- Dropzone: `role="button"`, `aria-label="파일 업로드 영역. 파일을 드래그하거나 클릭하여 선택"`, Enter/Space 키 활성화
- FileListItem: `role="listitem"`, 파일명과 상태를 `aria-label`로 결합 ("파일명.pdf, 검증 완료")
- UploadProgressBar: `role="progressbar"`, `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax=100`
- ValidationAlert: `role="alert"`, `aria-live="assertive"` (오류 발생 즉시 읽힘)
- CTA 비활성화 상태: `aria-disabled="true"` + `title="모든 파일 검증 완료 후 이용 가능합니다"`
- 키보드 순서: 탭 토글 → Dropzone → 파일 목록(파일별) → 메모 → CTA

---

## SCR-A6-CART

**보관함/장바구니 | SKIN | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-A6-CART
- 화면명: 보관함/장바구니
- 분류: SKIN (shopby 스킨 커스터마이징)
- 우선순위: 1 (필수)
- 규모: M (4 상태, 1-2 인터랙션)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  장바구니 (3)           │ ← header + 아이템 수
├─────────────────────────────┤
│ [전체선택] [선택삭제]        │ ← 일괄 액션 바
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ [체크] [썸네일 64px] │    │ ← CartItemCard
│  │  A4 전단지 · 코팅없음 │    │
│  │  고급지 120g | 500부  │    │
│  │  [파일: design.pdf ✓]│    │ ← FilePreview (pill)
│  │  50,000원            │    │
│  │  수량: [-] 500 [+]   │    │
│  │  [삭제] [나중에 구매]│    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ [체크] [썸네일 64px] │    │
│  │  명함 · 양면         │    │
│  │  아트지 350g | 100부 │    │
│  │  [파일: 미업로드]    │    │ ← 파일 미업로드 warning
│  │  15,000원            │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  배송비 안내                 │
│  100,000원 이상 무료배송     │
│  현재: 65,000원 (3,000원)   │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │  주문하기 (2개)      │    │ ← sticky CTA
│  │  65,000원 + 3,000원 │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**데스크탑 (1280px) — SplitLayout**
```
┌────────────────────────────────────────────────────────┐
│  장바구니 (3개 상품)                                   │
├────────────────────────────┬───────────────────────────┤
│  상품 목록 (60%)            │  주문 요약 (40%)          │
│                             │  ──────────────────────── │
│  [전체선택] [선택삭제]      │  상품 합계   65,000원     │
│  ──────────────────────── │  배송비       3,000원     │
│  [✓] [이미지] 상품명        │  ──────────────────────── │
│       A4 전단지 · 500부     │  결제 예정액 68,000원     │
│       [design.pdf ✓]        │                           │
│       50,000원              │  ┌───────────────────┐   │
│       수량: [-] 500 [+]     │  │   주문하기 (2개)  │   │
│  ──────────────────────── │  └───────────────────┘   │
│  [✓] [이미지] 명함 · 100부  │                           │
│       [파일 업로드 필요]     │  쿠폰/포인트는            │
│       15,000원              │  주문서에서 적용           │
└────────────────────────────┴───────────────────────────┘
```

### 3. 컴포넌트 트리

```
CartPage
├── PageShell
│   ├── CartHeader (제목 + 아이템 수)
│   ├── BulkActionBar (전체선택, 선택삭제)
│   ├── CartItemList
│   │   └── CartItemCard (per item)
│   │       ├── CheckboxSelect
│   │       ├── ProductThumbnail (64x64)
│   │       ├── ProductInfo (명, 옵션, 사양)
│   │       ├── FilePreview (파일명 pill / 업로드 필요 경고)
│   │       ├── UnitPrice
│   │       ├── QuantityStepper (min=1)
│   │       └── ItemActions (삭제, 나중에 구매)
│   ├── ShippingFeeNotice
│   └── CartSummary (desktop sidebar / mobile sticky)
│       ├── SubtotalDisplay
│       ├── ShippingFeeDisplay
│       ├── TotalDisplay
│       └── CheckoutButton (주문하기)
└── EmptyCartState (조건부 — 아이템 0개)
```

### 4. Props/States 정의

**CartItem State**
```
cartItemId: string
productNo: number
productName: string
optionName: string
printSpec: { paper, size, coating, quantity }
fileId: string | null
fileStatus: 'uploaded' | 'not_uploaded'
unitPrice: number
quantity: number
isSelected: boolean
```

**Cart 페이지 State**
```
items: CartItem[]
isAllSelected: boolean
shippingFee: number         // 3000 | 8000(제주) | 0(무료)
subtotal: number
total: number
isLoading: boolean
```

### 5. shopby API 매핑

**장바구니 조회**
```
GET /cart
Response: {
  cartItems: CartItem[],
  cartSummary: { subtotal, shippingFee, total }
}
Auth: 로그인 필수
```

**장바구니 수량 변경**
```
PUT /cart
Body: { cartItemNo, quantity }
Response: 업데이트된 CartSummary
Auth: 로그인 필수
```

**장바구니 아이템 삭제**
```
DELETE /cart
Body: { cartItemNos: number[] }
Auth: 로그인 필수
```

### 6. 데이터 플로우

```
페이지 진입
  → GET /cart → items, summary 렌더

수량 변경 [-] / [+]
  → debounce 500ms
  → PUT /cart
  → summary 즉시 낙관적 업데이트 → 응답 후 확정

파일 미업로드 상태 아이템 [주문하기] 클릭
  → 파일 업로드 필요 아이템 목록 다이얼로그
  → "파일 업로드" 버튼 → SCR-A6-FILE-UPLOAD
  → 또는 "해당 상품 제외 후 주문" 선택 가능

[주문하기] (파일 모두 준비됨)
  → POST /order-sheets (shopby 주문서 생성)
  → SCR-A6-SHIPPING으로 이동
```

### 7. 인터랙션 상태

1. **정상 상태**: 아이템 목록 + 요약 + 주문하기
2. **빈 장바구니**: EmptyCartState — "담긴 상품이 없습니다" + 쇼핑 계속하기 버튼
3. **파일 미업로드 포함**: 해당 아이템에 노란색 경고 배지, 주문하기 클릭 시 모달 경고
4. **선택 삭제**: 체크된 아이템만 삭제 확인 다이얼로그 → 삭제 → 목록 갱신

### 8. 에러 처리

| 에러 상황 | 사용자 피드백 |
|-----------|-------------|
| 장바구니 조회 실패 | 스켈레톤 로딩 후 "불러오기 실패. 새로고침 해주세요" |
| 수량 변경 실패 | "수량 변경에 실패했습니다" 토스트 + 이전 값 복원 |
| 재고 부족 | "재고가 부족합니다. 수량을 줄여주세요" |
| 주문서 생성 실패 | "주문서 생성에 실패했습니다. 다시 시도해 주세요" |

### 9. 접근성 요구사항

- CartItemCard: `role="article"`, `aria-label="[상품명], [수량], [금액]"`
- CheckboxSelect: `aria-label="[상품명] 선택"`
- QuantityStepper: `-` 버튼 `aria-label="수량 감소"`, `+` 버튼 `aria-label="수량 증가"`, 수량 표시 `aria-live="polite"`
- 전체선택 체크박스: `aria-label="전체 상품 선택"`, 부분 선택 시 `aria-checked="mixed"`
- CheckoutButton: 파일 미업로드 시 `aria-describedby` → 경고 메시지 ID

---

## SCR-A6-SHIPPING

**배송 정보 | NATIVE | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-A6-SHIPPING
- 화면명: 배송 정보 입력
- 분류: NATIVE (shopby 기본 제공)
- 우선순위: 1 (필수)
- 규모: M (4 상태, 1-2 인터랙션)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  배송 정보              │
├─────────────────────────────┤
│  받는 분 정보                │
│  ┌─────────────────────┐    │
│  │  이름               │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  연락처             │    │
│  └─────────────────────┘    │
│                             │
│  배송지                      │
│  ┌─────────────────────┐    │
│  │ 우편번호  [주소 검색]│    │ ← AddressSearch
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  기본 주소          │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  상세 주소          │    │
│  └─────────────────────┘    │
│                             │
│  배송 메모                   │
│  ┌─────────────────────┐    │
│  │  배송 시 요청사항...│    │ ← select + custom
│  └─────────────────────┘    │
│                             │
│  [ ] 기본 배송지로 저장      │
│  [ ] 주문자 정보와 동일      │ ← autofill 토글
│                             │
│  [배송지 목록에서 선택 →]    │ ← SCR-A6-ADDRESS-LIST 링크
│                             │
│  ┌─────────────────────┐    │
│  │   다음 (결제하기)   │    │ ← CTA
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
ShippingPage
├── PageShell (maxWidth="xl") + FormLayout
│   ├── RecipientForm
│   │   ├── NameInput
│   │   └── PhoneInput (자동 하이픈)
│   ├── AddressSection
│   │   ├── AddressSearch (Daum 우편번호 API)
│   │   ├── AddressBaseInput (자동 입력)
│   │   └── AddressDetailInput
│   ├── DeliveryMemoSelect
│   │   └── CustomMemoInput (조건부)
│   ├── SaveAddressCheckbox
│   ├── SameAsOrdererCheckbox
│   ├── AddressListLink (→ SCR-A6-ADDRESS-LIST)
│   └── NextButton (→ SCR-A6-PAYMENT)
```

### 4. Props/States 정의

**ShippingForm State**
```
recipientName: string
recipientPhone: string
zipCode: string
addressBase: string
addressDetail: string
deliveryMemo: string
customMemo: string
saveAddress: boolean
sameAsOrderer: boolean
```

### 5. shopby API 매핑

**주문서 조회 (배송지 선택용)**
```
GET /order-sheet
Response: {
  orderer: { name, phone, email },
  shippingAddress: { /* 최근 사용 배송지 */ } | null
}
Auth: 로그인 필수
```

### 6. 데이터 플로우

```
페이지 진입
  → GET /order-sheet → orderer 정보 로드
  → 최근 배송지 자동 입력 (있을 경우)

"주문자 정보와 동일" 체크
  → recipientName = orderer.name
  → recipientPhone = orderer.phone

[주소 검색] 클릭
  → Daum 우편번호 팝업
  → 선택 → zipCode, addressBase 자동 입력

배송지 목록에서 선택
  → SCR-A6-ADDRESS-LIST 이동 → 선택 후 복귀
  → 선택된 주소로 폼 자동 채움

[다음] 클릭
  → 폼 유효성 검사
  → 성공: SCR-A6-PAYMENT로 이동 + 배송지 데이터 전달
```

### 7. 인터랙션 상태

1. **초기 상태**: 빈 폼 (최근 배송지 자동 입력 시도)
2. **주문자 동일 체크 활성화**: 이름/연락처 자동 입력 + 입력 필드 비활성화
3. **주소 검색 완료**: zipCode, 기본 주소 자동 입력 + 상세 주소 필드 포커스
4. **유효성 오류**: 미입력 필드 빨간 테두리 + 오류 메시지

### 8. 에러 처리

| 에러 상황 | 사용자 피드백 |
|-----------|-------------|
| 이름 미입력 | "받는 분 이름을 입력해 주세요" (인라인) |
| 연락처 형식 오류 | "올바른 연락처를 입력해 주세요" (인라인) |
| 주소 미입력 | "배송지 주소를 입력해 주세요" (인라인) |

### 9. 접근성 요구사항

- 모든 input: `<label>` 명시적 연결 (`htmlFor`)
- 필수 항목: `aria-required="true"` + 시각적 * 표시
- 인라인 오류: `aria-describedby` → 오류 메시지 ID, `role="alert"`
- AddressSearch 버튼: `aria-label="주소 검색 팝업 열기"`

---

## SCR-A6-ADDRESS-LIST

**배송지 목록 | NATIVE | 우선순위 1 | 규모 S**

### 1. 화면 개요

- ID: SCR-A6-ADDRESS-LIST
- 화면명: 배송지 목록
- 분류: NATIVE
- 우선순위: 1 (필수)
- 규모: S (3 상태)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  배송지 목록            │
│                    [+ 추가] │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ [기본] 홍길동        │    │ ← 기본 배송지 뱃지
│  │ 010-1234-5678        │    │
│  │ (12345) 서울시...    │    │
│  │        [수정] [삭제] │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  김지니              │    │
│  │  010-9876-5432       │    │
│  │  (98765) 경기도...   │    │
│  │        [수정] [삭제] │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
AddressListPage
├── PageShell
│   ├── AddressListHeader (제목 + 추가 버튼)
│   ├── AddressCardList
│   │   └── AddressListCard (per address)
│   │       ├── DefaultBadge (조건부)
│   │       ├── RecipientInfo (이름, 전화, 주소)
│   │       ├── EditButton → AddressForm 모달
│   │       └── DeleteButton
│   └── EmptyAddressState (주소 0개)
└── AddressFormModal (신규/수정 공용)
    ├── AddressSearch
    ├── RecipientForm
    └── SetDefaultCheckbox
```

### 4. Props/States 정의

**Address**
```
addressId: string
recipientName: string
recipientPhone: string
zipCode: string
addressBase: string
addressDetail: string
isDefault: boolean
```

### 5. shopby API 매핑

**배송지 목록 조회**
```
GET /profile/shipping-addresses
Response: { shippingAddresses: Address[] }
Auth: 로그인 필수
```

**배송지 등록/수정/삭제**
```
POST   /profile/shipping-addresses
PUT    /profile/shipping-addresses/{addressId}
DELETE /profile/shipping-addresses/{addressId}
```

### 6. 데이터 플로우

```
페이지 진입 → GET /profile/shipping-addresses → 목록 렌더
[선택] 클릭 → 선택된 address 데이터와 함께 SCR-A6-SHIPPING으로 복귀
[+ 추가] → AddressFormModal 열기 → POST → 목록 갱신
[수정] → AddressFormModal (기존 데이터 채움) → PUT → 갱신
[삭제] → 확인 다이얼로그 → DELETE → 목록 갱신
```

### 7. 인터랙션 상태

1. **목록 상태**: 카드 목록 + 선택/수정/삭제 액션
2. **빈 상태**: "등록된 배송지가 없습니다" + 추가 유도
3. **모달 열림**: 폼 입력 → 저장/취소

### 8. 에러 처리

| 에러 상황 | 사용자 피드백 |
|-----------|-------------|
| 조회 실패 | "배송지 목록을 불러오지 못했습니다" |
| 최대 개수 초과 (10개) | "배송지는 최대 10개까지 등록 가능합니다" |
| 삭제 실패 | "삭제에 실패했습니다" 토스트 |

### 9. 접근성 요구사항

- AddressListCard: `role="article"`, `aria-label="[이름] 배송지"`
- 기본 배송지 뱃지: `aria-label="기본 배송지"` 포함
- EditButton: `aria-label="[이름] 배송지 수정"`
- DeleteButton: `aria-label="[이름] 배송지 삭제"`
- 모달: `role="dialog"`, `aria-modal="true"`, 열릴 때 포커스 트랩

---

## SCR-A6-PAYMENT

**결제하기 | NATIVE | 우선순위 1 | 규모 L**

### 1. 화면 개요

- ID: SCR-A6-PAYMENT
- 화면명: 결제하기
- 분류: NATIVE (shopby 결제 모듈)
- 우선순위: 1 (필수)
- 규모: L (전체 상태 + 3-5 인터랙션)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  결제하기               │
├─────────────────────────────┤
│  주문 상품 요약              │
│  ┌─────────────────────┐    │
│  │ [이미지] 상품명      │    │
│  │ 옵션 · 500부 · 50,000│    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  결제 수단                   │
│                             │
│  간편결제                    │
│  ┌──────┐┌──────┐┌──────┐  │
│  │카카오││ 네이버││  토스 │  │ ← 간편결제 (우선 노출)
│  │ Pay  ││  Pay ││  Pay  │  │
│  └──────┘└──────┘└──────┘  │
│                             │
│  신용/체크카드               │
│  ┌─────────────────────┐    │
│  │  카드 선택...        │    │ ← PaymentMethodSelector
│  └─────────────────────┘    │
│  무이자 할부: [3개월 ▼]      │
│                             │
│  가상계좌 / 계좌이체         │
│  ┌─────────────────────┐    │
│  │  은행 선택...        │    │
│  └─────────────────────┘    │
│                             │
│  후불결제 (법인 회원)        │ ← B2BPaymentOptions (조건부)
│  ┌─────────────────────┐    │
│  │ [○] 세금계산서 후불  │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  쿠폰 / 포인트               │
│  ┌──────────────┬───────┐   │
│  │ 쿠폰 선택... │ 적용  │   │
│  └──────────────┴───────┘   │
│  보유 포인트: 1,500P         │
│  ┌──────────────┬───────┐   │
│  │ 1500         │ 전액  │   │
│  └──────────────┴───────┘   │
├─────────────────────────────┤
│  최종 결제 금액              │
│  ─────────────────────────  │
│  상품 합계      65,000원     │
│  배송비          3,000원     │
│  쿠폰 할인      -5,000원     │
│  포인트 사용    -1,500원     │
│  ─────────────────────────  │
│  결제 금액      61,500원     │
│                             │
│  [√] 주문 내용 확인 및 동의  │
│                             │
│  ┌─────────────────────┐    │
│  │  61,500원 결제하기   │    │ ← 최종 CTA
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**데스크탑 (1280px) — SplitLayout**
```
┌────────────────────────────┬──────────────────────────┐
│  결제 수단 선택 (60%)       │  주문 요약 (40%)          │
│                             │  ──────────────────────── │
│  간편결제                   │  [상품 목록 요약]          │
│  [카카오] [네이버] [토스]   │                           │
│                             │  쿠폰/포인트 적용         │
│  신용/체크카드              │  결제 금액 상세            │
│  [카드 선택 ▼]              │  ──────────────────────── │
│  무이자: [3개월 ▼]          │  61,500원                 │
│                             │                           │
│  가상계좌/계좌이체          │  [√] 동의 체크박스         │
│  [은행 선택 ▼]              │                           │
│                             │  ┌─────────────────────┐ │
│  후불결제 (법인)            │  │  61,500원 결제하기   │ │
│  [○] 세금계산서 후불        │  └─────────────────────┘ │
└────────────────────────────┴──────────────────────────┘
```

### 3. 컴포넌트 트리

```
PaymentPage
├── PageShell (maxWidth="xl") + SplitLayout
│   ├── PaymentSection (left)
│   │   ├── OrderItemSummary (미니 목록)
│   │   ├── PaymentMethodSelector
│   │   │   ├── QuickPayGroup (카카오/네이버/토스)
│   │   │   ├── CardPaySection
│   │   │   │   ├── CardSelector
│   │   │   │   └── InstallmentSelector (무이자 옵션)
│   │   │   ├── VirtualAccountSection
│   │   │   └── B2BPaymentOptions (법인 회원 조건부)
│   │   └── CouponPointSection
│   │       ├── CouponSelector (최대 3개)
│   │       ├── PrintingMoneyInput (후니머니)
│   │       └── PointInput
│   └── OrderSummary (right/sticky)
│       ├── PriceSummaryList
│       ├── AgreementCheckbox
│       └── PaymentCTAButton (최종 결제)
```

### 4. Props/States 정의

**PaymentMethod**
```
type: 'kakaopay' | 'naverpay' | 'tosspay' | 'card' | 'virtualaccount' | 'b2b_deferred'
cardNo?: string
installmentMonths?: 3 | 6 | 12
bankCode?: string
```

**Discount State**
```
appliedCoupons: Coupon[]      // 최대 3개
printingMoneyUsed: number     // 후니머니
pointsUsed: number
totalDiscount: number
```

**Payment Page State**
```
selectedMethod: PaymentMethod | null
discounts: DiscountState
finalAmount: number
isAgreed: boolean
isProcessing: boolean
isMember: boolean
isCorporate: boolean          // B2B 옵션 노출 여부
```

### 5. shopby API 매핑

**결제 예약 (결제 창 호출 전)**
```
POST /payments/reserve
Body: {
  orderSheetNo: string,
  paymentMethodType: string,
  couponNos: number[],
  usedPoints: number,
  usedPrintingMoney: number,
  installmentMonths?: number
}
Response: {
  paymentReservationNo: string,
  pgParams: { /* PG사 파라미터 */ }
}
Auth: 로그인 필수
```

**결제 완료 승인**
```
POST /payments/confirm
Body: {
  paymentReservationNo: string,
  pgResultParams: { /* PG사 콜백 파라미터 */ }
}
Response: {
  orderNo: string,
  status: 'SUCCESS' | 'FAILED'
}
Auth: 로그인 필수
```

**쿠폰 목록 조회**
```
GET /coupons/usable?orderSheetNo={no}
Response: { coupons: Coupon[] }
Auth: 로그인 필수
```

### 6. 데이터 플로우

```
페이지 진입
  → GET /coupons/usable → 사용 가능 쿠폰 로드
  → 법인 회원 여부 확인 → B2BPaymentOptions 조건부 렌더

간편결제 [카카오Pay] 클릭
  → selectedMethod = 'kakaopay'
  → 할부 옵션 숨김

[결제하기] 클릭
  → isAgreed 체크
  → POST /payments/reserve → paymentReservationNo 취득
  → PG사 결제 창 팝업 (pgParams 전달)
  → 사용자 결제 완료
  → PG사 콜백 수신 (pgResultParams)
  → POST /payments/confirm
  → 성공: SCR-A6-ORDER-COMPLETE로 이동
  → 실패: 에러 메시지 + 결제 수단 선택으로 복귀
```

### 7. 인터랙션 상태

1. **초기 로딩**: 결제 수단 스켈레톤, 쿠폰 목록 로딩
2. **간편결제 선택**: 카드/계좌 섹션 접힘, 할부 없음
3. **카드 선택**: 무이자 할부 옵션 노출 (3/6/12개월)
4. **쿠폰 적용**: 할인 금액 즉시 반영, 최대 3개 제한 시 추가 비활성화
5. **결제 진행 중**: isProcessing = true → CTA "결제 처리 중..." + 스피너, 버튼 비활성화
6. **PG사 팝업 닫힘 (취소)**: 이전 상태 복원, "결제가 취소되었습니다" 토스트
7. **법인 후불결제**: 기타 결제 수단 비활성화, 세금계산서 정보 폼 노출

### 8. 에러 처리

| 에러 상황 | 사용자 피드백 |
|-----------|-------------|
| 결제 예약 실패 | "결제 준비에 실패했습니다. 다시 시도해 주세요" |
| PG사 결제 실패 | PG사 오류 메시지 표시 + 다른 결제 수단 안내 |
| 카드 한도 초과 | "카드 한도를 초과했습니다. 다른 카드나 결제 수단을 이용해 주세요" |
| 가상계좌 발급 실패 | "가상계좌 발급에 실패했습니다. 은행을 변경하거나 다시 시도해 주세요" |
| 포인트 잔액 부족 | "사용 가능한 포인트가 부족합니다" (실시간 검증) |
| 쿠폰 만료 | "만료된 쿠폰입니다. 다른 쿠폰을 선택해 주세요" |

### 9. 접근성 요구사항

- PaymentMethod 선택: `role="radiogroup"`, 각 옵션 `role="radio"`, `aria-checked`
- 간편결제 버튼: `aria-label="카카오페이로 결제"` 등 명시
- 할부 선택: `aria-label="할부 개월 선택"`, `aria-describedby` → 무이자 안내
- 금액 업데이트: `aria-live="polite"` 영역에서 결제 금액 변경 알림
- 동의 체크박스: `aria-required="true"`, 미체크 시 CTA 클릭 → 포커스 이동 + 오류 메시지
- 결제 처리 중: `aria-busy="true"`, 스크린리더에 "결제 처리 중입니다" 알림

---

## SCR-A6-ORDER-COMPLETE

**주문 완료 | NATIVE | 우선순위 1 | 규모 S**

### 1. 화면 개요

- ID: SCR-A6-ORDER-COMPLETE
- 화면명: 주문 완료
- 분류: NATIVE
- 우선순위: 1 (필수)
- 규모: S (3 상태)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│           주문 완료          │ ← header (뒤로가기 없음)
├─────────────────────────────┤
│                             │
│       ✓ 주문이 완료         │
│         되었습니다           │
│                             │
│  ┌─────────────────────┐    │
│  │  OrderCompleteCard   │    │
│  │  주문번호: 2024-XXXX │    │
│  │  주문일시: 2024.3.19 │    │
│  │  ──────────────────  │    │
│  │  A4 전단지 · 500부   │    │
│  │  50,000원            │    │
│  │  ──────────────────  │    │
│  │  결제 금액  61,500원 │    │
│  │  결제 수단  카카오Pay│    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │   주문 내역 확인     │    │ ← NextActionButtons
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │    쇼핑 계속하기     │    │
│  └─────────────────────┘    │
│                             │
│  추가 혜택 안내 (optional)   │
│  "회원가입 시 500P 적립"     │ ← 비회원 결제 시
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
OrderCompletePage
├── PageShell (maxWidth="lg")
│   ├── CompleteIcon + 완료 메시지
│   ├── OrderCompleteCard
│   │   ├── OrderNo + 주문일시
│   │   ├── OrderItemSummary
│   │   └── PaymentSummary
│   ├── NextActionButtons
│   │   ├── OrderDetailButton (→ 주문내역 상세)
│   │   └── ContinueShoppingButton (→ 홈)
│   └── GuestSignupPrompt (비회원 조건부)
```

### 4. Props/States 정의

**Page Props (URL params)**
```
orderNo: string    // URL: /order/complete?orderNo=2024-XXXX
```

**OrderComplete State**
```
orderNo: string
orderedAt: string
items: OrderItem[]
paymentAmount: number
paymentMethod: string
isGuest: boolean
```

### 5. shopby API 매핑

**주문 완료 정보 조회**
```
GET /profile/orders/{orderNo}
Response: {
  orderNo, orderedAt, items, paymentInfo, shippingInfo
}
Auth: 로그인 필수 (비회원: orderNo + 이메일 조합)
```

### 6. 데이터 플로우

```
페이지 진입 (URL: /order/complete?orderNo=xxx)
  → GET /profile/orders/{orderNo}
  → OrderCompleteCard 렌더
  → 브라우저 뒤로가기 비활성화 (결제 중복 방지)
  → GA4 purchase 이벤트 전송
```

### 7. 인터랙션 상태

1. **로딩 중**: 스켈레톤 카드
2. **완료 표시**: 주문 정보 + 다음 행동 버튼
3. **비회원**: 회원가입 유도 배너 추가 노출

### 8. 에러 처리

| 에러 상황 | 사용자 피드백 |
|-----------|-------------|
| 주문 정보 조회 실패 | "주문 정보를 불러오지 못했습니다. 주문내역에서 확인해 주세요" + 주문내역 링크 |
| 잘못된 orderNo | "존재하지 않는 주문입니다" → 홈으로 이동 |

### 9. 접근성 요구사항

- 완료 아이콘: `aria-hidden="true"`, 텍스트로만 의미 전달
- 주문번호: `<output>` 또는 `aria-live="polite"` 로 첫 렌더 시 알림
- NextActionButtons: 명확한 레이블, 탭 순서 주문내역 확인 → 쇼핑 계속하기
- 뒤로가기 비활성화: `history.replaceState`로 스택 관리

---

## SCR-A6-DESIGN-REQUEST

**디자인 의뢰 | CUSTOM | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-A6-DESIGN-REQUEST
- 화면명: 디자인 의뢰
- 분류: CUSTOM (자체 API)
- 우선순위: 2 (중요)
- 규모: M (4 상태, 1-2 인터랙션)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  디자인 의뢰            │
├─────────────────────────────┤
│  어떤 디자인이 필요하신가요? │
│  ┌─────────────────────┐    │
│  │  의뢰 내용 상세 입력 │    │ ← DesignRequestForm
│  │  (최소 50자)         │    │
│  └─────────────────────┘    │
│                             │
│  참고 파일 첨부 (선택)       │
│  ┌─────────────────────┐    │
│  │  + 참고 이미지 첨부  │    │ ← ReferenceUploader
│  │  JPG PNG PDF (최대3) │    │
│  └─────────────────────┘    │
│                             │
│  연락처 / 마감일             │
│  ┌─────────────────────┐    │
│  │  연락처 (자동입력)   │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  희망 마감일 [달력]  │    │
│  └─────────────────────┘    │
│                             │
│  예산                        │
│  ┌─────────────────────┐    │
│  │  [50,000원 이하 ▼]  │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │   의뢰 신청하기     │    │ ← CTA
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
DesignRequestPage
├── PageShell (maxWidth="xl") + FormLayout
│   ├── RequestDescriptionTextarea (min 50자)
│   ├── ReferenceUploader (최대 3개, JPG/PNG/PDF)
│   ├── ContactInput (로그인 사용자 자동 입력)
│   ├── DeadlinePicker (DatePicker, 최소 오늘+3일)
│   ├── BudgetSelector (5단계 범위 선택)
│   └── SubmitButton
```

### 4. Props/States 정의

**DesignRequest Form State**
```
description: string         // min 50자
referenceFiles: File[]      // max 3
contactPhone: string        // 로그인 시 자동 입력
deadline: Date | null
budgetRange: '~50k' | '50k~100k' | '100k~200k' | '200k~' | 'discuss'
isSubmitting: boolean
```

### 5. shopby API 매핑

> CUSTOM — 자체 API 설계

**디자인 의뢰 제출**
```
POST /api/v1/design-requests
Body: FormData {
  description: string,
  referenceFileIds: string[],  // 사전 업로드 후 ID 전달
  contactPhone: string,
  deadline: string,            // ISO 8601
  budgetRange: string,
  productId: number            // 연관 상품
}
Response: {
  requestId: string,
  status: 'pending',
  estimatedResponseTime: '영업일 1-2일'
}
Auth: 로그인 필수
```

**참고 파일 업로드 (S3)**
```
POST /api/v1/files/upload-url
  → S3 presigned URL 방식 (FILE-UPLOAD와 동일)
  → accept: image/jpeg, image/png, application/pdf
```

### 6. 데이터 플로우

```
페이지 진입 (SCR-A6-FILE-UPLOAD "디자인 없음" > 의뢰 선택)
  → 로그인 사용자 연락처 자동 입력

참고 파일 첨부
  → S3 presigned URL 방식으로 업로드
  → fileId 저장

[의뢰 신청하기] 클릭
  → 폼 유효성 검사 (description 50자 이상, deadline, budgetRange)
  → POST /api/v1/design-requests
  → 성공: 완료 페이지 또는 "의뢰가 접수되었습니다" 다이얼로그
  → 영업일 1-2일 내 담당자 연락 안내
```

### 7. 인터랙션 상태

1. **입력 중**: 실시간 글자 수 카운터 (description)
2. **파일 첨부 완료**: 업로드된 파일 목록 + 제거 버튼
3. **제출 중**: CTA "신청 중..." + 스피너
4. **제출 완료**: 성공 메시지 + 홈으로 이동 버튼

### 8. 에러 처리

| 에러 상황 | 사용자 피드백 |
|-----------|-------------|
| 설명 50자 미만 | "의뢰 내용을 50자 이상 입력해 주세요" (인라인) |
| 마감일 미선택 | "희망 마감일을 선택해 주세요" (인라인) |
| 파일 업로드 실패 | "파일 업로드에 실패했습니다. 다시 시도해 주세요" |
| 제출 실패 | "의뢰 신청에 실패했습니다. 잠시 후 다시 시도해 주세요" |

### 9. 접근성 요구사항

- Textarea: `aria-label="디자인 의뢰 내용"`, `aria-describedby` → "최소 50자 입력"
- 글자 수 카운터: `aria-live="polite"`, "현재 N자 입력됨" 스크린리더 전달
- DatePicker: 키보드 네비게이션 지원 (화살표로 날짜 이동)
- BudgetSelector: `role="radiogroup"`, 각 옵션 `role="radio"`
- ReferenceUploader: FILE-UPLOAD 접근성 패턴 동일 적용
