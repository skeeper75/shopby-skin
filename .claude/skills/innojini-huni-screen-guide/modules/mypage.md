# A-3: 마이페이지 (16 화면)

## 목차

- [SCR-A3-ORDER-LIST: 주문 조회](#scr-a3-order-list)
- [SCR-A3-ORDER-DETAIL: 주문 상세](#scr-a3-order-detail)
- [SCR-A3-OPTION-STORAGE: 옵션 보관함](#scr-a3-option-storage)
- [SCR-A3-PRINTING-MONEY: 프린팅머니](#scr-a3-printing-money)
- [SCR-A3-MONEY-CHARGE: 프린팅머니 충전](#scr-a3-money-charge)
- [SCR-A3-MEMBER-EDIT: 회원정보 수정](#scr-a3-member-edit)
- [SCR-A3-COUPON: 쿠폰 관리](#scr-a3-coupon)
- [SCR-A3-PRODUCT-QA: 상품 Q&A](#scr-a3-product-qa)
- [SCR-A3-MY-REVIEW: 나의 리뷰](#scr-a3-my-review)
- [SCR-A3-INQUIRY: 1:1 문의](#scr-a3-inquiry)
- [SCR-A3-PW-CHANGE: 비밀번호 변경](#scr-a3-pw-change)
- [SCR-A3-RECEIPTS: 증빙서류](#scr-a3-receipts)
- [SCR-A3-BIZ-INFO: 사업자 정보](#scr-a3-biz-info)
- [SCR-A3-CASH-RECEIPT: 현금영수증 정보](#scr-a3-cash-receipt)
- [SCR-A3-EXPERIENCE-TEAM: 체험단 활동](#scr-a3-experience-team)
- [SCR-A3-WITHDRAWAL: 회원 탈퇴](#scr-a3-withdrawal)

> **레이아웃 공통 패턴**: 마이페이지 전체는 SplitLayout을 기반으로 좌측 사이드바 네비게이션 + 우측 콘텐츠 영역 구조. 데스크탑(1280px+)에서는 사이드바 고정 표시, 모바일(768px 미만)에서는 상단 탭 또는 드로어로 전환.

---

## SCR-A3-ORDER-LIST

**주문 조회 | NATIVE | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-A3-ORDER-LIST
- 화면명: 주문 조회
- 분류: NATIVE (Shopby GET /profile/orders 활용)
- 우선순위: 1 (마이페이지 핵심 — 재주문 및 제작 현황 파악 진입점)
- 규모: M (날짜 필터, 상태 배지, 주문 카드 목록, 페이지네이션)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]       주문 조회          │ ← PageShell header
├─────────────────────────────┤
│ [전체] [제작중] [배송중] [완료]│ ← StatusTabBar (스크롤 가능)
├─────────────────────────────┤
│ 기간 조회                    │
│ [1개월▼] [3개월] [6개월] [직접]│ ← DateRangeFilter (칩 선택)
│ 2025-01-01 ~ 2025-03-19     │
├─────────────────────────────┤
│ 총 12건                      │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 2025.03.15  #2503150001 │ │ ← OrderCard
│ │ [인쇄중] ←─ StatusBadge  │ │
│ │ 명함 (양면) 500매         │ │
│ │ ┌──────────────────┐    │ │
│ │ │[썸네일] 상품명    │    │ │
│ │ └──────────────────┘    │ │
│ │ 결제금액: 38,500원       │ │
│ │ [주문상세] [재주문]      │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 2025.03.10  #2503100002 │ │
│ │ [배송중]                 │ │
│ │ 전단지 A4 1000매         │ │
│ │ 결제금액: 52,000원       │ │
│ │ [주문상세] [배송조회]    │ │
│ └─────────────────────────┘ │
│                             │
│ [< 1 2 3 ... >]             │ ← Pagination
└─────────────────────────────┘
```

**데스크탑 (1280px) — PageShell + SplitLayout**
```
┌──────────────────────────────────────────────────────────────┐
│ [로고]              [프린팅머니 12,500원] [장바구니] [내 정보▼] │
├─────────────┬────────────────────────────────────────────────┤
│ 마이페이지  │  주문 조회                                       │
│ ─────────── │  ┌──────────────────────────────────────────┐  │
│ > 주문 조회 │  │ [전체▼] [1개월▼] 2025-01-01 ~ 2025-03-19 │  │
│   주문 상세 │  └──────────────────────────────────────────┘  │
│   옵션 보관 │  총 12건                                         │
│ ─────────── │  ┌─────────────────┐ ┌─────────────────┐       │
│   프린팅머니│  │ #2503150001     │ │ #2503100002     │       │
│   충전하기  │  │ [인쇄중]        │ │ [배송중]        │       │
│ ─────────── │  │ 명함 (양면) 500 │ │ 전단지 A4 1000  │       │
│   쿠폰      │  │ 2025.03.15      │ │ 2025.03.10      │       │
│   리뷰      │  │ 38,500원        │ │ 52,000원        │       │
│   Q&A       │  │ [상세] [재주문] │ │ [상세] [배송조회]│       │
│   1:1 문의  │  └─────────────────┘ └─────────────────┘       │
│ ─────────── │  [< 1 2 3 ... >]                                │
│   회원정보  │                                                  │
│   비밀번호  │                                                  │
│   탈퇴      │                                                  │
└─────────────┴────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
OrderListPage (PageShell + SplitLayout)
├── MyPageSidebar (SplitLayout left)
│   └── MyPageNavItem (반복)
└── OrderListContent (SplitLayout right)
    ├── StatusTabBar
    │   └── StatusTab[] (전체/접수/파일접수/파일검수/제작접수/인쇄중/후가공/출고/배송중/완료/취소)
    ├── DateRangeFilter
    │   ├── QuickRangeChips (1개월/3개월/6개월)
    │   └── DatePickerInputs (직접입력)
    ├── OrderCountLabel
    ├── OrderCardList
    │   └── OrderCard[] (반복)
    │       ├── OrderMeta (날짜, 주문번호)
    │       ├── StatusBadge
    │       ├── OrderItemThumbnail
    │       ├── OrderItemName
    │       ├── OrderAmount
    │       └── OrderActionButtons (상세보기/재주문/배송조회)
    └── Pagination
```

### 4. Props / States

**OrderCard Props**
```
orderNo: string
orderedAt: string (ISO 8601)
status: 'ACCEPTED' | 'FILE_RECEIVED' | 'FILE_CHECKED' | 'PRODUCTION_ACCEPTED'
       | 'PRINTING' | 'POST_PROCESSING' | 'SHIPPED' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED'
items: OrderItem[]
  - productName: string
  - thumbnailUrl: string
  - quantity: number
totalAmount: number
deliveryTrackingUrl?: string
```

**DateRangeFilter States**
```
quickRange: '1M' | '3M' | '6M' | 'CUSTOM' (default: '1M')
startDate: string | null
endDate: string | null
```

**OrderListPage States**
```
activeStatus: string (default: 'ALL')
dateRange: { start, end }
currentPage: number
orders: Order[]
totalCount: number
isLoading: boolean
```

### 5. API 매핑

```
GET /profile/orders
Query params:
  - page: number (1-based)
  - pageSize: number (default: 10)
  - startYmd: string (YYYYMMDD)
  - endYmd: string (YYYYMMDD)
  - orderStatusType: string (빈 값 = 전체)

Response:
  - items[]: { orderNo, orderedAt, orderStatus, orderProducts[], payAmt }
  - totalCount: number
  - pageNumber: number
```

### 6. 데이터 플로우

```
마운트
  → DateRangeFilter 기본값 설정 (최근 1개월)
  → GET /profile/orders (page=1, 1개월 범위)
  → OrderCardList 렌더링

StatusTab 변경
  → activeStatus 업데이트
  → currentPage = 1 리셋
  → API 재호출

DateRange 변경
  → dateRange 업데이트
  → currentPage = 1 리셋
  → API 재호출

재주문 버튼 클릭
  → SCR-A3-OPTION-STORAGE 또는 상품 페이지로 이동
  → 저장된 옵션 자동 불러오기 (옵션 보관함 연동)
```

### 7. 인터랙션 상태

| 상태 | 설명 | UI |
|------|------|----|
| 로딩 | API 응답 대기 | OrderCard 스켈레톤 3개 |
| 정상 | 주문 목록 표시 | OrderCard 리스트 |
| 빈 목록 | 해당 기간 주문 없음 | "주문 내역이 없습니다" + 상품 둘러보기 버튼 |
| 에러 | API 실패 | 에러 메시지 + 재시도 버튼 |

### 8. 에러 처리

- API 타임아웃(5초): 스켈레톤 유지 → 에러 토스트 → 재시도 버튼 노출
- 401 Unauthorized: 로그인 페이지 리다이렉트
- 빈 결과: 필터 조건 안내 + CTA (상품 보러가기)

### 9. 접근성

- StatusTab: `role="tablist"`, 각 탭 `role="tab"`, `aria-selected`
- OrderCard: `role="article"`, `aria-label="주문번호 {orderNo}, {status}"`
- 재주문 버튼: `aria-label="주문번호 {orderNo} 재주문"`
- 날짜 입력: `<label>` 연결, `aria-describedby` 형식 안내

---

## SCR-A3-ORDER-DETAIL

**주문 상세 | SKIN | 우선순위 1 | 규모 L**

### 1. 화면 개요

- ID: SCR-A3-ORDER-DETAIL
- 화면명: 주문 상세
- 분류: SKIN (Shopby 기본 + 8단계 제작 트래커 커스텀)
- 우선순위: 1 (인쇄업 핵심 UX — 제작 진행상황 실시간 파악)
- 규모: L (트래커 타임라인, 파일 미리보기, 영수증/취소 액션)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]     주문 상세            │
├─────────────────────────────┤
│ 주문번호: 2503150001         │
│ 주문일시: 2025.03.15 14:23  │
├─────────────────────────────┤
│ 제작 진행 현황               │ ← OrderTrackerTimeline
│ ●─────●─────●─────◌─◌─◌─◌─◌│
│ 접수  파일  파일  제작  인쇄  │
│       접수  검수  접수  중    │
│             ↑ 현재 단계      │
│                             │
│ "파일 검수 중입니다.          │
│  보통 1-2 영업일 소요됩니다." │
├─────────────────────────────┤
│ 주문 상품                    │
│ ┌─────────────────────────┐ │
│ │[썸네일] 명함 (양면 UV)   │ │ ← OrderItemCard
│ │ 규격: 90x54mm / 500매   │ │
│ │ 용지: 스노우화이트 350g  │ │
│ │ 후가공: 단면 UV 코팅     │ │
│ │                         │ │
│ │ [파일 미리보기]          │ │ ← FilePreview 버튼
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ 결제 정보                    │
│ 상품금액          35,000원   │
│ 배송비             3,500원   │
│ 할인 (쿠폰)       -5,000원   │
│ ───────────────────────────  │
│ 결제금액          33,500원   │
│ 결제수단: 신용카드 (삼성)    │
├─────────────────────────────┤
│ 배송 정보                    │
│ 홍길동 / 010-1234-5678      │
│ 서울시 강남구 테헤란로 123   │
│                             │
│ [배송 조회]                  │
├─────────────────────────────┤
│ [증빙서류 발급]  [주문 취소] │
└─────────────────────────────┘
```

**데스크탑 (1280px) — PageShell maxWidth="xl"**
```
┌──────────────────────────────────────────────────────┐
│ 마이페이지 사이드바 │  주문 상세                       │
│                   │  주문번호 2503150001 | 2025.03.15  │
│                   │                                   │
│                   │ ┌──── 제작 진행 현황 ────────────┐ │
│                   │ │ ●──●──●──◌──◌──◌──◌──◌        │ │
│                   │ │ 접수 파일 파일 제작 인쇄 후가 출 배│ │
│                   │ │      접수 검수 접수 중  공  고 송 │ │
│                   │ │ "파일 검수 중 (1-2 영업일)"     │ │
│                   │ └────────────────────────────────┘ │
│                   │                                   │
│                   │ ┌── 좌측: 주문 상품 ──┐ ┌── 우측 ─┐│
│                   │ │ [썸네일]            │ │결제정보  ││
│                   │ │ 명함 (양면 UV)      │ │배송정보  ││
│                   │ │ 90x54 / 500매       │ │액션버튼  ││
│                   │ │ [파일 미리보기]     │ └─────────┘│
│                   │ └─────────────────────┘            │
└───────────────────┴──────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
OrderDetailPage (PageShell maxWidth="xl")
├── MyPageSidebar
└── OrderDetailContent
    ├── OrderMeta (주문번호, 주문일시)
    ├── OrderTrackerTimeline
    │   ├── TrackerStep[] (8단계: 접수/파일접수/파일검수/제작접수/인쇄중/후가공/출고/배송중)
    │   │   ├── StepCircle (completed/active/pending)
    │   │   ├── StepLabel
    │   │   └── StepConnector
    │   └── TrackerStatusMessage (현재 단계 설명 + 예상 소요 안내)
    ├── OrderItemCard
    │   ├── ProductThumbnail
    │   ├── ProductSpecList (규격/용지/수량/후가공)
    │   └── FilePreview (인쇄 파일 미리보기 모달 트리거)
    ├── PaymentSummary
    │   ├── PriceRow[] (상품금액/배송비/할인/결제금액)
    │   └── PaymentMethodInfo
    ├── DeliveryInfo
    │   ├── RecipientInfo
    │   └── DeliveryTrackingButton
    └── OrderActionBar
        ├── ReceiptButton → SCR-A3-RECEIPTS
        └── CancelButton (제작 전 단계만 활성화)
```

### 4. Props / States

**OrderTrackerTimeline Props**
```
currentStatus: OrderStatus (8단계 enum)
statusHistory: StatusHistoryItem[]
  - status: OrderStatus
  - changedAt: string (ISO 8601)
  - memo?: string
```

**TrackerStep 상태 계산**
```
completed: statusHistory에 해당 status 존재
active: currentStatus === this.status
pending: 그 외
```

**FilePreview Props**
```
fileUrl: string
fileType: 'pdf' | 'image'
isOpen: boolean
onClose: () => void
```

**OrderDetailPage States**
```
order: OrderDetail | null
isLoading: boolean
isCancelModalOpen: boolean
isFilePreviewOpen: boolean
```

### 5. API 매핑

```
GET /profile/orders/{orderNo}
Response:
  - orderNo, orderedAt, orderStatus
  - statusHistory[]: { status, changedAt, memo }
  - orderProducts[]:
      - productNo, productName, thumbnailUrl
      - optionName, quantity
      - specs: { size, paper, finishing }
      - printFileUrl?: string
  - payment: { totalAmt, deliveryAmt, discountAmt, payAmt, payType }
  - delivery: { receiverName, phone, addr, trackingNo, deliveryCompany }

DELETE /profile/orders/{orderNo}  (주문 취소)
  - 제약: orderStatus가 ACCEPTED 또는 FILE_RECEIVED 상태만 가능
```

### 6. 데이터 플로우

```
마운트 (orderNo param)
  → GET /profile/orders/{orderNo}
  → OrderTrackerTimeline 렌더링 (8단계 상태 계산)
  → 취소 버튼 활성화 여부 결정 (status 기반)

파일 미리보기 클릭
  → FilePreview 모달 오픈
  → PDF: iframe embed / 이미지: img tag
  → 보안: presigned URL 또는 프록시 경유

주문 취소 버튼 클릭
  → ConfirmDialog 표시
  → 확인 시 DELETE /profile/orders/{orderNo}
  → 성공: 주문 목록으로 이동 + 성공 토스트
  → 실패: 에러 메시지 (이미 제작 시작된 경우 안내)
```

### 7. 인터랙션 상태

| 상태 | 설명 | UI |
|------|------|----|
| 로딩 | API 대기 | 전체 스켈레톤 |
| 정상 | 주문 정보 표시 | 트래커 + 상품 정보 |
| 제작 시작 전 | ACCEPTED/FILE_RECEIVED | 취소 버튼 활성화 |
| 제작 진행 중 | FILE_CHECKED 이후 | 취소 버튼 비활성화 (tooltip: "제작이 시작되어 취소 불가") |
| 배송 중 | DELIVERING | 배송조회 버튼 활성화 |
| 완료 | DELIVERED | 리뷰 작성 버튼 노출 |
| 취소됨 | CANCELLED | 취소 정보 표시 |

### 8. 에러 처리

- 존재하지 않는 주문번호: 404 → "주문을 찾을 수 없습니다" + 목록으로 돌아가기
- 타인의 주문 접근: 403 → 주문 목록으로 리다이렉트
- 취소 실패 (제작 시작): 에러 모달 "이미 제작이 시작되어 취소가 불가합니다. 고객센터(1234-5678)로 문의해 주세요."
- 파일 미리보기 실패: "파일을 불러올 수 없습니다" 인라인 에러

### 9. 접근성

- OrderTrackerTimeline: `role="list"`, 각 단계 `role="listitem"`, 완료/현재/대기 상태 `aria-label` 포함
- 취소 버튼 비활성: `aria-disabled="true"` + `aria-describedby` (비활성 이유)
- FilePreview 모달: `role="dialog"`, `aria-modal="true"`, 닫기 버튼 포커스 트랩

---

## SCR-A3-OPTION-STORAGE

**옵션 보관함 | CUSTOM | 우선순위 1 | 규모 L**

### 1. 화면 개요

- ID: SCR-A3-OPTION-STORAGE
- 화면명: 옵션 보관함
- 분류: CUSTOM (Shopby 기본 기능 없음 — 완전 커스텀 구현)
- 우선순위: 1 (후니프린팅 핵심 차별화 기능 — 인쇄 설정 저장/재주문)
- 규모: L (저장된 옵션 카드 그리드, 파일 미리보기, 재주문 플로우)

### 2. 화면 개요 (도메인)

인쇄 주문 시 선택한 사양(규격, 용지, 후가공, 수량)과 업로드 파일을 저장해두고, 나중에 동일 사양으로 빠르게 재주문할 수 있는 기능. MOO(moo.com) 디자인 라이브러리 컨셉과 유사.

### 3. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]      옵션 보관함         │
├─────────────────────────────┤
│ 저장된 인쇄 설정 3개         │
│ [최신순▼]  [검색...]         │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ [파일 썸네일 미리보기]   │ │ ← SavedOptionCard
│ │ ─────────────────────── │ │
│ │ 명함 양면 UV             │ │
│ │ 90×54mm · 500매         │ │
│ │ 스노우화이트 350g        │ │
│ │ 단면 UV 코팅             │ │
│ │ 저장일: 2025.03.15      │ │
│ │ ─────────────────────── │ │
│ │ [재주문]  [편집]  [삭제] │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ [파일 썸네일]            │ │
│ │ 전단지 A4               │ │
│ │ A4 · 1,000매            │ │
│ │ 아트지 150g · 양면인쇄  │ │
│ │ 저장일: 2025.02.28      │ │
│ │ [재주문]  [편집]  [삭제] │ │
│ └─────────────────────────┘ │
│                             │
│ [+ 새 인쇄 설정 추가]        │
└─────────────────────────────┘
```

**데스크탑 (1280px) — PageShell + ResponsiveGrid cols={1,2,3}**
```
┌──────────────────────────────────────────────────────────────┐
│ 사이드바 │  옵션 보관함                                        │
│         │  저장된 인쇄 설정 3개   [최신순▼]  [검색...]         │
│         │                                                     │
│         │  ┌───────────────┐ ┌───────────────┐ ┌──────────┐  │
│         │  │ [썸네일]      │ │ [썸네일]      │ │ [썸네일] │  │
│         │  │ 명함 양면 UV  │ │ 전단지 A4     │ │ 스티커   │  │
│         │  │ 90×54 · 500매 │ │ A4 · 1000매   │ │ 원형 50mm│  │
│         │  │ 2025.03.15    │ │ 2025.02.28    │ │ 2025.02.01│ │
│         │  │ [재주문][편집]│ │ [재주문][편집]│ │[재주문]  │  │
│         │  └───────────────┘ └───────────────┘ └──────────┘  │
│         │                                                     │
│         │  [+ 새 인쇄 설정 추가]                               │
└─────────┴────────────────────────────────────────────────────┘
```

### 4. 컴포넌트 트리

```
OptionStoragePage (PageShell + ResponsiveGrid cols={1,2,3})
├── MyPageSidebar
└── OptionStorageContent
    ├── StorageHeader
    │   ├── SavedCountLabel
    │   ├── SortSelect (최신순/오래된순/상품명순)
    │   └── SearchInput
    ├── SavedOptionGrid (ResponsiveGrid)
    │   └── SavedOptionCard[] (반복)
    │       ├── FilePreviewThumbnail
    │       │   └── FilePreviewModal (클릭 시 전체화면)
    │       ├── OptionSpecList
    │       │   ├── ProductName
    │       │   ├── SpecItem (규격/수량/용지/후가공)
    │       │   └── SavedDate
    │       └── CardActionButtons
    │           ├── ReorderButton
    │           ├── EditButton
    │           └── DeleteButton
    └── AddNewOptionButton
```

### 5. Props / States

**SavedOptionCard Props**
```
savedOptionId: string
productName: string
productNo: number
specs: {
  size: string       // "90×54mm"
  quantity: number
  paper: string      // "스노우화이트 350g"
  finishing: string  // "단면 UV 코팅"
}
printFileUrl?: string
thumbnailUrl?: string
savedAt: string (ISO 8601)
onReorder: (savedOptionId: string) => void
onEdit: (savedOptionId: string) => void
onDelete: (savedOptionId: string) => void
```

**OptionStoragePage States**
```
savedOptions: SavedOption[]
isLoading: boolean
sortBy: 'LATEST' | 'OLDEST' | 'NAME'
searchKeyword: string
deleteConfirmId: string | null
```

### 6. API 매핑

```
커스텀 API (Shopby 기본 제공 없음):

GET /custom/option-storage
Query: page, pageSize, sortBy, keyword
Response: { items: SavedOption[], totalCount }

POST /custom/option-storage
Body: { productNo, specs{}, printFileKey }
Response: { savedOptionId }

PUT /custom/option-storage/{id}
Body: { specs{}, printFileKey? }

DELETE /custom/option-storage/{id}

재주문 플로우:
POST /cart/add
Body: { productNo, optionNo, quantity, savedOptionId }
→ SCR-A6-CART로 이동
```

### 7. 데이터 플로우

```
마운트
  → GET /custom/option-storage (최신순 기본)
  → SavedOptionGrid 렌더링

재주문 클릭
  → POST /cart/add (savedOptionId 포함)
  → 성공: "장바구니에 담겼습니다" 토스트 + 장바구니 이동 선택
  → 실패 (상품 단종): "해당 상품이 더 이상 판매되지 않습니다"

삭제 클릭
  → ConfirmDialog ("저장된 설정을 삭제하시겠습니까?")
  → 확인: DELETE /custom/option-storage/{id}
  → 성공: 목록에서 제거 (낙관적 업데이트)

검색/정렬 변경
  → 클라이언트 사이드 필터링 (목록 수가 적을 경우)
  → 또는 API 재호출 (100개 이상일 경우)
```

### 8. 인터랙션 상태

| 상태 | 설명 | UI |
|------|------|----|
| 로딩 | API 대기 | 카드 스켈레톤 3개 |
| 정상 | 저장된 설정 목록 | 그리드 카드 |
| 빈 목록 | 저장된 설정 없음 | "저장된 인쇄 설정이 없습니다" + 상품 주문 CTA |
| 삭제 확인 | 삭제 버튼 클릭 | ConfirmDialog 오버레이 |
| 재주문 처리 | POST 진행 중 | 재주문 버튼 스피너 |
| 파일 미리보기 | 썸네일 클릭 | FilePreviewModal (전체화면) |

### 9. 에러 처리

- 파일 만료: S3 presigned URL 만료 시 썸네일 "파일 미리보기 불가" placeholder
- 상품 단종 재주문: "현재 판매하지 않는 상품입니다. 유사 상품을 찾아드릴까요?" + 검색 CTA
- 저장 한도 초과: 최대 50개 제한 시 "보관함이 가득 찼습니다. 오래된 설정을 삭제해 주세요."

### 10. 접근성

- SavedOptionCard: `role="article"`, `aria-label="{상품명} 저장 설정"`
- DeleteButton: `aria-label="{상품명} 저장 설정 삭제"`
- FilePreviewModal: `role="dialog"`, `aria-modal="true"`, ESC 닫기

---

## SCR-A3-PRINTING-MONEY

**프린팅머니 | CUSTOM | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-A3-PRINTING-MONEY
- 화면명: 프린팅머니
- 분류: CUSTOM (MyPay API 기반 자체 포인트 시스템)
- 우선순위: 1 (결제 수단 — 잔액 및 거래내역 핵심 화면)
- 규모: M (잔액 위젯, 거래내역 목록, 충전/사용 필터)

### 2. 화면 개요 (도메인)

"프린팅머니"는 후니프린팅 전용 선불 충전금. 충전 후 주문 시 결제 수단으로 사용. 잔액은 헤더 영역에도 표시됨.

### 3. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]      프린팅머니          │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │       현재 잔액          │ │ ← AccountBalanceWidget
│ │    12,500원             │ │
│ │  ┌─────────────────┐   │ │
│ │  │   충전하기 →     │   │ │
│ │  └─────────────────┘   │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ 거래 내역                    │
│ [전체▼] [충전] [사용] [환불] │ ← TransactionTypeFilter
│ [1개월▼]                     │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 2025.03.15 14:23       │ │ ← TransactionHistory item
│ │ 충전 (신용카드)          │ │
│ │              +50,000원  │ │
│ │ 잔액: 62,500원          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 2025.03.14 10:15       │ │
│ │ 결제 사용 (#2503140001) │ │
│ │              -38,500원  │ │
│ │ 잔액: 12,500원          │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**데스크탑 — PageShell + SplitLayout**
```
┌──────────────────────────────────────────────────────────────┐
│ 사이드바 │  프린팅머니                                         │
│         │  ┌────────────────────┐  ┌──────────────────────┐  │
│         │  │   현재 잔액        │  │ 이달 충전: 50,000원   │  │
│         │  │   12,500원        │  │ 이달 사용: 38,500원   │  │
│         │  │  [충전하기]        │  └──────────────────────┘  │
│         │  └────────────────────┘                             │
│         │                                                     │
│         │  거래 내역   [전체▼] [1개월▼]                        │
│         │  ─────────────────────────────────────────────────  │
│         │  2025.03.15  충전 (신용카드)          +50,000원      │
│         │  2025.03.14  결제 사용 #2503140001   -38,500원      │
│         │  2025.02.20  충전 (계좌이체)          +30,000원      │
└─────────┴────────────────────────────────────────────────────┘
```

### 4. 컴포넌트 트리

```
PrintingMoneyPage (PageShell + SplitLayout)
├── MyPageSidebar
└── PrintingMoneyContent
    ├── AccountBalanceWidget
    │   ├── BalanceAmount
    │   ├── MonthlyStats (이달 충전/사용 요약)
    │   └── ChargeButton → SCR-A3-MONEY-CHARGE
    ├── TransactionFilterBar
    │   ├── TypeFilter (전체/충전/사용/환불)
    │   └── DateRangeFilter
    ├── TransactionHistoryList
    │   └── TransactionItem[]
    │       ├── TransactionDate
    │       ├── TransactionDescription
    │       ├── TransactionAmount (충전: green +, 사용: red -)
    │       └── BalanceAfter
    └── Pagination
```

### 5. API 매핑

```
커스텀 MyPay API:

GET /custom/mypay/balance
Response: { balance: number, monthlyCharged: number, monthlyUsed: number }

GET /custom/mypay/transactions
Query: page, pageSize, type(CHARGE/USE/REFUND), startYmd, endYmd
Response: { items: Transaction[], totalCount }
  Transaction: { txId, txType, amount, balanceAfter, description, createdAt, orderNo? }
```

### 6. 데이터 플로우

```
마운트
  → 병렬: GET /custom/mypay/balance + GET /custom/mypay/transactions
  → AccountBalanceWidget 렌더링
  → TransactionHistoryList 렌더링

충전하기 버튼
  → SCR-A3-MONEY-CHARGE로 이동
  → 충전 완료 후 돌아오면 잔액 갱신 (query refetch)

필터 변경
  → currentPage = 1 리셋
  → GET /custom/mypay/transactions 재호출
```

### 7. 인터랙션 상태

| 상태 | 설명 | UI |
|------|------|----|
| 로딩 | API 대기 | 잔액/목록 스켈레톤 |
| 정상 | 잔액 + 거래내역 | 위젯 + 리스트 |
| 거래내역 없음 | 해당 기간 없음 | "거래 내역이 없습니다" |
| 잔액 부족 경고 | 잔액 < 10,000원 | 잔액 텍스트 주황색 + "충전 권장" 안내 |

### 8. 에러 처리

- MyPay API 연결 실패: "프린팅머니 서비스에 일시적인 문제가 발생했습니다." + 고객센터 안내
- 잔액 조회 실패: 헤더 잔액 표시를 "-원"으로 처리

### 9. 접근성

- 잔액 금액: `aria-live="polite"` (충전 후 자동 갱신 시 스크린리더 알림)
- 충전 금액 색상: 색상만으로 구분하지 않고 "+", "-" 텍스트 병기

---

## SCR-A3-MONEY-CHARGE

**프린팅머니 충전 | CUSTOM | 우선순위 1 | 규모 L**

### 1. 화면 개요

- ID: SCR-A3-MONEY-CHARGE
- 화면명: 프린팅머니 충전
- 분류: CUSTOM (MyPay API + PG 결제 연동)
- 우선순위: 1 (수익과 직결 — 충전 전환율이 매출에 영향)
- 규모: L (충전 금액 선택, PG 결제 위젯, 충전 완료 플로우)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]    프린팅머니 충전       │
├─────────────────────────────┤
│ 현재 잔액: 12,500원          │
├─────────────────────────────┤
│ 충전 금액 선택               │
│ ┌──────┐ ┌──────┐ ┌──────┐ │ ← ChargeAmountSelector
│ │1만원 │ │3만원 │ │5만원 │ │
│ └──────┘ └──────┘ └──────┘ │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │10만원│ │20만원│ │직접  │ │
│ └──────┘ └──────┘ └입력 ─┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │  직접 입력              │ │
│ │  [     50,000    원] ← │ │ ← 직접 입력 시 활성화
│ └─────────────────────────┘ │
│                             │
│ 충전 후 잔액: 62,500원       │ ← 실시간 계산
├─────────────────────────────┤
│ 결제 수단                    │
│ ┌─────────────────────────┐ │
│ │  ○ 신용/체크카드         │ │ ← PGPaymentWidget
│ │  ○ 계좌이체              │ │
│ │  ○ 카카오페이            │ │
│ │  ○ 네이버페이            │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ 유의사항                     │
│ · 충전된 금액은 환불 불가     │
│ · 회원 탈퇴 시 잔액 소멸      │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │   50,000원 충전하기     │ │ ← CTA
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**데스크탑 (1280px) — PageShell maxWidth="lg"**
```
┌──────────────────────────────────────────────────────────────┐
│ 사이드바 │  프린팅머니 충전                                    │
│         │  현재 잔액: 12,500원                                 │
│         │                                                     │
│         │  ┌──────────────────────┐  ┌──────────────────────┐ │
│         │  │ 충전 금액 선택       │  │ 결제 수단             │ │
│         │  │ [1만][3만][5만]      │  │ ○ 신용/체크카드      │ │
│         │  │ [10만][20만][직접입력]│  │ ○ 계좌이체           │ │
│         │  │                     │  │ ○ 카카오페이         │ │
│         │  │ 충전 후 잔액        │  │ ○ 네이버페이         │ │
│         │  │ 62,500원           │  └──────────────────────┘ │
│         │  └──────────────────────┘                          │
│         │                                                     │
│         │  유의사항 (접기/펼치기)                              │
│         │  [50,000원 충전하기]                                 │
└─────────┴────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
MoneyChargePage (PageShell maxWidth="lg")
├── MyPageSidebar
└── MoneyChargeContent
    ├── CurrentBalanceDisplay
    ├── ChargeAmountSelector
    │   ├── PresetAmountChips (1만/3만/5만/10만/20만)
    │   ├── CustomAmountOption
    │   └── CustomAmountInput (직접 입력 선택 시 활성화)
    ├── ExpectedBalanceDisplay (실시간 계산: 현재잔액 + 충전금액)
    ├── PGPaymentWidget
    │   └── PaymentMethodRadioGroup
    │       └── PaymentMethodOption[]
    ├── ChargeNoticeAccordion (유의사항)
    └── ChargeSubmitButton
```

### 4. Props / States

**ChargeAmountSelector States**
```
selectedPreset: number | 'CUSTOM' | null
customAmount: string
finalAmount: number (유효성 검증 후)
minAmount: 10000
maxAmount: 500000
```

**MoneyChargePage States**
```
currentBalance: number
selectedAmount: number | null
selectedPayMethod: 'CARD' | 'BANK_TRANSFER' | 'KAKAO_PAY' | 'NAVER_PAY' | null
isProcessing: boolean
isSuccess: boolean
pgOrderId: string | null
```

### 5. API 매핑

```
커스텀 MyPay + PG 연동:

POST /custom/mypay/charge/prepare
Body: { amount: number, payMethod: string }
Response: { pgOrderId, pgParams: {} }
→ PG사 결제창 호출

POST /custom/mypay/charge/confirm (PG 결제 완료 콜백 후)
Body: { pgOrderId, pgToken, amount }
Response: { success: boolean, newBalance: number, txId: string }
```

### 6. 데이터 플로우

```
마운트
  → GET /custom/mypay/balance (현재 잔액 표시)

금액 선택/입력
  → finalAmount 계산
  → ExpectedBalanceDisplay 실시간 갱신

충전하기 버튼 클릭
  → 유효성 검증 (금액 범위, 결제수단 선택)
  → POST /custom/mypay/charge/prepare
  → PG사 결제창 오픈 (팝업 또는 리다이렉트)
  → PG 콜백 수신

PG 콜백 처리 (성공)
  → POST /custom/mypay/charge/confirm
  → 성공: 충전 완료 화면 or 토스트 + 잔액 갱신
  → SCR-A3-PRINTING-MONEY로 이동

PG 콜백 처리 (실패/취소)
  → 에러 메시지 표시
  → 충전 폼 유지 (재시도 가능)
```

### 7. 인터랙션 상태

| 상태 | 설명 | UI |
|------|------|----|
| 금액 미선택 | 초기 상태 | 충전 버튼 비활성 |
| 금액 선택 | 프리셋 또는 직접입력 | 충전 버튼 활성, 예상 잔액 표시 |
| 직접입력 | CUSTOM 선택 | 금액 입력 필드 포커스 |
| 유효성 에러 | 범위 벗어남 | 인라인 에러 (10,000원 이상, 500,000원 이하) |
| 결제 처리 중 | PG 처리 중 | 버튼 스피너, 입력 비활성화 |
| 결제 완료 | 충전 성공 | 성공 화면 or 토스트 |
| 결제 실패 | PG 실패/취소 | 에러 메시지 + 재시도 |

### 8. 에러 처리

- PG 결제 팝업 차단: "팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요." + 설정 안내 링크
- 결제 실패 (카드 한도 초과 등): PG사 에러 메시지 그대로 표시
- 네트워크 오류 (confirm 단계): "결제는 완료되었을 수 있습니다. 잔액을 확인해 주세요." + 고객센터 안내 (이중 청구 방지)
- 금액 범위: 최소 10,000원 / 최대 500,000원 (1회)

### 9. 접근성

- ChargeAmountSelector: `role="radiogroup"`, 각 칩 `role="radio"`
- 직접입력 필드: `inputmode="numeric"`, `aria-label="충전 금액 직접 입력"`, min/max 힌트
- 충전하기 버튼: `aria-busy="true"` (처리 중), `aria-disabled="true"` (금액 미선택)
- 유의사항: `<details>/<summary>` 또는 아코디언 컴포넌트

---

## SCR-A3-MEMBER-EDIT

**회원정보 수정 | NATIVE | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-A3-MEMBER-EDIT
- 화면명: 회원정보 수정
- 분류: NATIVE (Shopby PUT /members)
- 우선순위: 1 (B2B 고객 정보 관리 — 사업자 정보 포함)
- 규모: M (개인정보 폼 + 사업자 정보 섹션)

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]    회원정보 수정         │
├─────────────────────────────┤
│ 기본 정보                    │
│ 이름 *                       │
│ ┌─────────────────────────┐ │
│ │ 홍길동                  │ │
│ └─────────────────────────┘ │
│ 이메일 (수정 불가)            │
│ ┌─────────────────────────┐ │
│ │ hong@example.com        │ │ ← disabled
│ └─────────────────────────┘ │
│ 휴대폰 번호 *                 │
│ ┌─────────────────────────┐ │
│ │ 010-1234-5678           │ │
│ └─────────────────────────┘ │
│ [인증 요청]                  │
│                             │
│ 수신 동의                    │
│ [✓] SMS 수신 동의            │
│ [✓] 이메일 수신 동의         │
├─────────────────────────────┤
│ 사업자 정보 (선택)           │ ← BusinessInfoForm (접기/펼치기)
│ 사업자 등록번호               │
│ ┌─────────────────────────┐ │
│ │ 123-45-67890            │ │
│ └─────────────────────────┘ │
│ 상호명                       │
│ ┌─────────────────────────┐ │
│ │ (주)후니프린팅           │ │
│ └─────────────────────────┘ │
│ 대표자명                     │
│ ┌─────────────────────────┐ │
│ │ 홍길동                  │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ [저장]                       │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
MemberEditPage (PageShell maxWidth="xl" + FormLayout)
├── MyPageSidebar
└── MemberEditForm
    ├── BasicInfoSection
    │   ├── NameInput
    │   ├── EmailInput (disabled)
    │   ├── PhoneInput + PhoneVerifyButton
    │   └── MarketingConsentCheckboxes
    ├── BusinessInfoAccordion (선택 사항)
    │   └── BusinessInfoForm
    │       ├── BusinessRegNoInput
    │       ├── CompanyNameInput
    │       ├── RepresentativeNameInput
    │       └── BusinessTypeInput
    └── SaveButton
```

### 4. API 매핑

```
GET /members/me (초기 데이터 로드)
PUT /members
Body: { name, mobileNo, smsAgree, emailAgree, businessInfo? }
  businessInfo: { businessRegNo, companyName, representativeName, businessType }
```

### 5. 인터랙션 상태

| 상태 | 설명 | UI |
|------|------|----|
| 초기 | 현재 정보 표시 | 폼 필드 채워짐 |
| 수정 중 | 필드 변경 | 저장 버튼 활성화 |
| 전화번호 인증 | 인증 번호 발송 | 인증번호 입력 필드 노출 |
| 저장 처리 중 | PUT 진행 중 | 버튼 스피너 |
| 저장 완료 | 성공 | "저장되었습니다" 토스트 |
| 유효성 에러 | 필수항목 누락 | 인라인 에러 메시지 |

### 6. 에러 처리

- 전화번호 중복: "이미 사용 중인 번호입니다."
- 사업자번호 형식 오류: "올바른 사업자 등록번호를 입력해 주세요." (10자리 숫자)
- API 실패: 토스트 에러 메시지

### 7. 접근성

- 필수 입력: `required` 속성 + `aria-required="true"`
- 비활성 이메일: `aria-label="이메일 (수정 불가)"`, `aria-readonly="true"`
- 인증 상태: `aria-live="polite"` (인증 완료/실패 알림)

---

## SCR-A3-COUPON

**쿠폰 관리 | NATIVE | 우선순위 2 | 규모 S**

### 1. 화면 개요

- ID: SCR-A3-COUPON
- 화면명: 쿠폰 관리
- 분류: NATIVE (GET /coupons)
- 우선순위: 2 | 규모: S

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]       쿠폰 관리          │
├─────────────────────────────┤
│ 쿠폰 등록                    │
│ ┌──────────────────┐ [등록] │ ← CouponRegisterForm
│ │  쿠폰 코드 입력  │        │
│ └──────────────────┘        │
├─────────────────────────────┤
│ [사용 가능(3)] [사용 완료(5)]│
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 첫 주문 10% 할인         │ │ ← CouponCard
│ │ 최대 5,000원 / 3만원 이상│ │
│ │ ~2025.06.30             │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
CouponPage (PageShell + ResponsiveGrid)
├── CouponRegisterForm (코드 입력 + 등록 버튼)
├── CouponStatusTabs (사용 가능/사용 완료)
└── CouponGrid
    └── CouponCard[] (쿠폰명, 할인내용, 유효기간, 조건)
```

### 4. API 매핑

```
GET /coupons?usable=true|false
POST /coupons/register (쿠폰 코드 등록)
Body: { couponCode: string }
```

### 5. 인터랙션 상태

| 상태 | UI |
|------|----|
| 쿠폰 없음 | "사용 가능한 쿠폰이 없습니다" |
| 등록 성공 | 토스트 + 목록 갱신 |
| 등록 실패 | "유효하지 않은 쿠폰 코드입니다" 인라인 에러 |
| 만료 쿠폰 | 회색 처리 + "만료됨" 배지 |

---

## SCR-A3-PRODUCT-QA

**상품 Q&A | NATIVE | 우선순위 2 | 규모 S**

### 1. 화면 개요

- ID: SCR-A3-PRODUCT-QA
- 분류: NATIVE (GET /boards/product-inquiries)
- 우선순위: 2 | 규모: S

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]       상품 Q&A           │
├─────────────────────────────┤
│ [답변완료(5)] [미답변(2)]    │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 명함 인쇄 용지 문의      │ │ ← BoardList item
│ │ 2025.03.10 | [미답변]   │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 배송 기간 문의           │ │
│ │ 2025.03.05 | [답변완료] │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ [문의 작성]                  │ ← WriteForm 트리거
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
ProductQAPage (PageShell + FormLayout)
├── QAStatusTabs (답변완료/미답변)
├── BoardList
│   └── QAListItem[] (제목, 날짜, 답변상태)
│       └── QADetail (펼치기: 질문 + 답변 내용)
└── WriteFormButton → QA 작성 모달/페이지
```

### 4. API 매핑

```
GET /boards/product-inquiries?answered=true|false&page=1
POST /boards/product-inquiries (문의 작성)
Body: { productNo?, title, content, secret: boolean }
```

### 5. 인터랙션 상태

| 상태 | UI |
|------|----|
| 목록 | BoardList 렌더링 |
| 펼치기 | QA 상세 인라인 표시 |
| 문의 작성 | 모달 또는 별도 페이지 |
| 비밀글 | "비밀글입니다" 잠금 아이콘 |

---

## SCR-A3-MY-REVIEW

**나의 리뷰 | NATIVE | 우선순위 2 | 규모 S**

### 1. 화면 개요

- ID: SCR-A3-MY-REVIEW
- 분류: NATIVE (GET /profile/product-reviews)
- 우선순위: 2 | 규모: S

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]       나의 리뷰          │
├─────────────────────────────┤
│ [작성 완료(3)] [작성 가능(2)]│
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ [썸네일] 명함 양면 UV    │ │ ← ReviewCard
│ │ ★★★★★ 2025.03.16       │ │
│ │ 품질이 정말 좋네요!      │ │
│ │ [수정] [삭제]           │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
MyReviewPage (PageShell + ResponsiveGrid)
├── ReviewStatusTabs
└── ReviewGrid
    └── ReviewCard[] (썸네일, 별점, 내용, 날짜, 수정/삭제)
        └── PhotoUploader (수정 시 사진 추가)
```

### 4. API 매핑

```
GET /profile/product-reviews?written=true|false
PUT /profile/product-reviews/{reviewId}
DELETE /profile/product-reviews/{reviewId}
```

### 5. 인터랙션 상태

| 상태 | UI |
|------|----|
| 작성 완료 | ReviewCard 리스트 (수정/삭제 가능) |
| 작성 가능 | 주문 상품 목록 + "리뷰 작성" 버튼 |
| 리뷰 없음 | "작성된 리뷰가 없습니다" |
| 삭제 확인 | ConfirmDialog |

---

## SCR-A3-INQUIRY

**1:1 문의 | NATIVE | 우선순위 2 | 규모 S**

### 1. 화면 개요

- ID: SCR-A3-INQUIRY
- 분류: NATIVE (GET /boards/personal-inquiries)
- 우선순위: 2 | 규모: S

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]       1:1 문의           │
├─────────────────────────────┤
│ [전체] [답변완료] [미답변]   │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ [주문문의] 배송 지연 문의│ │ ← InquiryList item
│ │ 2025.03.10 | [미답변]   │ │
│ │ 첨부파일: 1             │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ [문의 작성]                  │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
InquiryPage (PageShell + FormLayout)
├── InquiryStatusTabs
├── InquiryList
│   └── InquiryItem[] (유형 배지, 제목, 날짜, 상태, 첨부파일 수)
│       └── InquiryDetail (펼치기)
└── WriteInquiryButton → 작성 모달
    └── WriteForm (제목, 유형, 내용, FileAttach)
```

### 4. API 매핑

```
GET /boards/personal-inquiries?answered=true|false
POST /boards/personal-inquiries
Body: { inquiryType, title, content, attachFileUrls?: string[] }
```

### 5. 인터랙션 상태

| 상태 | UI |
|------|----|
| 목록 | InquiryList |
| 작성 폼 | 모달: 제목/유형/내용/파일 첨부 |
| 파일 첨부 | FileAttach (최대 5개, 10MB 제한) |
| 답변 완료 | 답변 내용 펼쳐보기 |

---

## SCR-A3-PW-CHANGE

**비밀번호 변경 | NATIVE | 우선순위 2 | 규모 S**

### 1. 화면 개요

- ID: SCR-A3-PW-CHANGE
- 분류: NATIVE (PUT /members/password)
- 우선순위: 2 | 규모: S

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]    비밀번호 변경         │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 현재 비밀번호            │ │ ← PasswordChangeForm (카드)
│ │ [●●●●●●●●]             │ │
│ ├─────────────────────────┤ │
│ │ 새 비밀번호              │ │
│ │ [●●●●●●●●]             │ │
│ │ 8자 이상, 영문+숫자+특수 │ │
│ ├─────────────────────────┤ │
│ │ 새 비밀번호 확인         │ │
│ │ [●●●●●●●●]             │ │
│ └─────────────────────────┘ │
│ [변경]                       │
└─────────────────────────────┘
```

### 3. API 매핑

```
PUT /members/password
Body: { currentPassword, newPassword, newPasswordConfirm }
```

### 4. 인터랙션 상태

| 상태 | UI |
|------|----|
| 기본 | 폼 비어있음 |
| 유효성 에러 | 인라인 에러 (불일치, 규칙 위반) |
| 변경 완료 | "비밀번호가 변경되었습니다" 토스트 |
| 현재 비번 오류 | "현재 비밀번호가 일치하지 않습니다" |

---

## SCR-A3-RECEIPTS

**증빙서류 | SKIN | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-A3-RECEIPTS
- 화면명: 증빙서류
- 분류: SKIN (Shopby 주문 API + 커스텀 증빙서류 발급 기능)
- 우선순위: 2 | 규모: M (B2B 고객 세금계산서/영수증 발급 필요)

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]       증빙서류           │
├─────────────────────────────┤
│ 주문 선택                    │
│ ┌─────────────────────────┐ │
│ │ 주문번호 선택 ▼          │ │ ← 주문 드롭다운
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ 서류 유형                    │ ← ReceiptTypeSelector
│ ○ 거래명세서                │
│ ○ 세금계산서 (사업자 필요)  │
│ ○ 현금영수증                │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │   [미리보기]  [다운로드] │ │ ← ReceiptViewer + 다운로드
│ │                         │ │
│ │   [거래명세서 PDF 미리봄]│ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
ReceiptsPage (PageShell + FormLayout)
├── OrderSelectDropdown
├── ReceiptTypeSelector (라디오 그룹)
├── ReceiptViewer (PDF 임베드 or 이미지)
└── ReceiptActionButtons (미리보기/다운로드)
```

### 4. API 매핑

```
GET /profile/orders/{orderNo} (주문 정보)
GET /custom/receipts/{orderNo}?type=TRADE_STATEMENT|TAX_INVOICE|CASH_RECEIPT
  → PDF URL 반환 (S3 presigned URL)
POST /custom/receipts/{orderNo}/generate
Body: { type, recipientInfo? }
```

### 5. 인터랙션 상태

| 상태 | UI |
|------|----|
| 주문 미선택 | 서류 유형 비활성 |
| 유형 선택 | 발급 버튼 활성 |
| PDF 로딩 | 스피너 |
| 세금계산서 선택 | 사업자 정보 없으면 경고 → SCR-A3-BIZ-INFO 링크 |

---

## SCR-A3-BIZ-INFO

**사업자 정보 | SKIN | 우선순위 2 | 규모 S**

### 1. 화면 개요

- ID: SCR-A3-BIZ-INFO
- 분류: SKIN (GET /config/member-extra-info + 커스텀 저장)
- 우선순위: 2 | 규모: S

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]      사업자 정보         │
├─────────────────────────────┤
│ 사업자 등록번호              │
│ [123-45-67890             ] │
│ 상호명                       │
│ [(주)후니프린팅            ] │
│ 대표자명                     │
│ [홍길동                   ] │
│ 업태/종목                    │
│ [제조업 / 인쇄업           ] │
│                             │
│ 사업자등록증 첨부            │
│ [파일 선택] bizreg.pdf ✓    │ ← FileUploader
│                             │
│ [저장]                       │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
BizInfoPage (PageShell + FormLayout)
└── BusinessInfoForm
    ├── BusinessRegNoInput
    ├── CompanyNameInput
    ├── RepresentativeInput
    ├── BusinessTypeInput
    └── FileUploader (사업자등록증 PDF/이미지)
```

### 4. API 매핑

```
GET /config/member-extra-info (기존 정보 로드)
PUT /config/member-extra-info (저장)
Body: { businessRegNo, companyName, representativeName, businessType, bizRegFileKey? }
```

### 5. 인터랙션 상태

| 상태 | UI |
|------|----|
| 정보 없음 | 빈 폼 |
| 정보 있음 | 기존 데이터 채워짐 |
| 파일 업로드 | 업로드 진행바 |
| 저장 완료 | "저장되었습니다" 토스트 |

---

## SCR-A3-CASH-RECEIPT

**현금영수증 정보 | SKIN | 우선순위 2 | 규모 S**

### 1. 화면 개요

- ID: SCR-A3-CASH-RECEIPT
- 분류: SKIN (커스텀 필드)
- 우선순위: 2 | 규모: S

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]   현금영수증 정보         │
├─────────────────────────────┤
│ 발급 유형                    │ ← CashReceiptForm
│ ○ 소득공제용 (개인)          │
│ ○ 지출증빙용 (사업자)        │
│                             │
│ 소득공제용 선택 시:          │
│ 휴대폰 번호                  │
│ [010-1234-5678            ] │
│                             │
│ 지출증빙용 선택 시:          │
│ 사업자 등록번호              │
│ [123-45-67890             ] │
│                             │
│ [저장]                       │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
CashReceiptPage (PageShell + FormLayout)
└── CashReceiptForm
    ├── ReceiptTypeRadioGroup (소득공제/지출증빙)
    ├── PersonalPhoneInput (소득공제 선택 시)
    └── BusinessRegNoInput (지출증빙 선택 시)
```

### 4. API 매핑

```
GET /custom/cash-receipt-info
PUT /custom/cash-receipt-info
Body: { type: 'PERSONAL' | 'BUSINESS', identifier: string }
```

### 5. 인터랙션 상태

| 상태 | UI |
|------|----|
| 소득공제 선택 | 휴대폰 번호 필드 노출 |
| 지출증빙 선택 | 사업자번호 필드 노출 |
| 저장 완료 | "저장되었습니다" 토스트 |

---

## SCR-A3-EXPERIENCE-TEAM

**체험단 활동 | CUSTOM | 우선순위 3 | 규모 M**

### 1. 화면 개요

- ID: SCR-A3-EXPERIENCE-TEAM
- 분류: CUSTOM (체험단 프로그램 활동 관리)
- 우선순위: 3 | 규모: M

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]      체험단 활동         │
├─────────────────────────────┤
│ [참여중(1)] [완료(3)] [신청가능]│
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 명함 체험단 2025 Q1     │ │ ← ExperienceCard
│ │ [진행중] ~2025.03.31    │ │
│ │ 미션: SNS 후기 작성      │ │
│ │ 혜택: 50% 할인 쿠폰      │ │
│ │ [미션 완료하기]          │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
ExperienceTeamPage (PageShell + ResponsiveGrid)
├── ActivityStatusTabs (참여중/완료/신청가능)
└── ExperienceGrid
    └── ExperienceCard[]
        ├── ProgramName + StatusBadge
        ├── MissionDescription
        ├── BenefitInfo
        └── ActionButton (미션 완료/신청/결과 보기)
```

### 4. API 매핑

```
GET /custom/experience-team/activities
  ?status=PARTICIPATING|COMPLETED|AVAILABLE
POST /custom/experience-team/apply (신청)
POST /custom/experience-team/{id}/complete (미션 완료)
Body: { evidenceUrl?: string, review?: string }
```

### 5. 인터랙션 상태

| 상태 | UI |
|------|----|
| 참여중 | 미션 완료 버튼, 남은 기간 |
| 완료 | 결과/혜택 정보, 재신청 여부 |
| 신청 가능 | 신청 버튼, 혜택 안내 |
| 활동 없음 | "참여 중인 체험단이 없습니다" |

---

## SCR-A3-WITHDRAWAL

**회원 탈퇴 | NATIVE | 우선순위 3 | 규모 S**

### 1. 화면 개요

- ID: SCR-A3-WITHDRAWAL
- 분류: NATIVE (DELETE /members)
- 우선순위: 3 | 규모: S

### 2. 와이어프레임

```
┌─────────────────────────────┐
│ [←]       회원 탈퇴          │
├─────────────────────────────┤
│ 탈퇴 전 확인해 주세요        │
│                             │
│ · 탈퇴 시 모든 데이터 삭제   │
│ · 프린팅머니 잔액 소멸       │
│ · 진행 중인 주문 취소 필요   │
│ · 탈퇴 후 30일 내 재가입 불가│
├─────────────────────────────┤
│ WithdrawalForm:             │
│ [✓] 위 내용을 확인했습니다   │
│                             │
│ 탈퇴 사유 (선택)             │
│ ○ 이용 빈도가 낮음          │
│ ○ 불만족스러운 서비스       │
│ ○ 개인정보 보호             │
│ ○ 기타                     │
├─────────────────────────────┤
│ 비밀번호 확인                │
│ [●●●●●●●●]                 │
├─────────────────────────────┤
│ [탈퇴하기]                   │ ← 확인 후 ConfirmDialog
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
WithdrawalPage (PageShell maxWidth="lg")
├── WithdrawalNoticeList (탈퇴 전 안내사항)
├── WithdrawalForm
│   ├── AgreementCheckbox
│   ├── WithdrawalReasonRadioGroup
│   └── PasswordConfirmInput
└── WithdrawalButton → ConfirmDialog
    └── ConfirmDialog (최종 확인)
```

### 4. API 매핑

```
DELETE /members
Body: { password, reason?: string }
→ 성공 시 세션 종료 + 홈으로 이동
```

### 5. 인터랙션 상태

| 상태 | UI |
|------|----|
| 동의 미체크 | 탈퇴 버튼 비활성 |
| 동의 완료 | 탈퇴 버튼 활성 (danger 스타일) |
| 최종 확인 | ConfirmDialog "정말 탈퇴하시겠습니까?" |
| 처리 중 | 버튼 스피너 |
| 완료 | 홈 이동 + 로그아웃 |

### 6. 에러 처리

- 비밀번호 불일치: "비밀번호가 일치하지 않습니다"
- 진행 중 주문 존재: "취소 대기 중인 주문이 있습니다. 주문 취소 후 탈퇴 신청이 가능합니다."
- 프린팅머니 잔액 존재: "프린팅머니 잔액(12,500원)이 있습니다. 탈퇴 시 잔액이 소멸됩니다." 추가 확인

### 7. 접근성

- 탈퇴 버튼: `aria-describedby` (탈퇴 결과 안내)
- ConfirmDialog: `role="alertdialog"`, `aria-modal="true"` (파괴적 액션임을 명시)
