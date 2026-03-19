# SCR-B8-PRINT-ORDER: 인쇄 주문관리 (XL 완성 예제)

## 1. 화면 개요

| 항목 | 내용 |
|------|------|
| **Screen ID** | SCR-B8-PRINT-ORDER |
| **화면명** | 인쇄 주문관리 |
| **유형** | CUSTOM |
| **우선순위** | 1순위 (MVP) |
| **복잡도** | XL |
| **패턴** | AdminLayout + DataTable + DetailPanel(Sheet) |
| **경로** | \`/admin/print-orders\` |
| **설명** | 인쇄 주문의 접수부터 배송까지 전체 주기를 관리하는 어드민 화면. 필터, 상태 탭, 일괄 처리, 상세 패널 제공 |
| **대상 디바이스** | Desktop only (최소 1024px) |
| **브랜드 컬러** | Primary #5538B6 |
| **UI 프레임워크** | Tailwind CSS + shadcn/ui |

### 진입 경로

- 어드민 사이드바 > 주문관리 > 인쇄 주문
- 어드민 대시보드 > 신규 주문 알림 클릭
- 직접 URL 접근 (\`/admin/print-orders\`)
- 직접 URL 접근 with 필터 (\`/admin/print-orders?status=file_review\`)

### 주문 상태 매트릭스 (8단계)

| 단계 | 상태 코드 | 상태명 | Badge 색상 | 설명 | 가능 전이 |
|------|----------|--------|-----------|------|----------|
| 1 | \`received\` | 접수 | \`bg-gray-100 text-gray-700\` | 고객 주문 접수 완료 | → 파일확인 |
| 2 | \`file_review\` | 파일확인 | \`bg-yellow-100 text-yellow-700\` | 업로드 파일 확인 중 | → 파일승인, 접수(반려) |
| 3 | \`file_approved\` | 파일승인 | \`bg-blue-100 text-blue-700\` | 파일 검수 완료, 제작 대기 | → 제작대기 |
| 4 | \`production_ready\` | 제작대기 | \`bg-indigo-100 text-indigo-700\` | 제작 스케줄 대기 | → 제작중 |
| 5 | \`in_production\` | 제작중 | \`bg-purple-100 text-purple-700\` | 인쇄/후가공 진행 중 | → 제작완료 |
| 6 | \`production_done\` | 제작완료 | \`bg-teal-100 text-teal-700\` | 제작 완료, 포장/발송 대기 | → 배송중 |
| 7 | \`shipping\` | 배송중 | \`bg-orange-100 text-orange-700\` | 택배사 발송 완료 | → 배송완료 |
| 8 | \`delivered\` | 배송완료 | \`bg-green-100 text-green-700\` | 배송 완료 | (종료) |

### 특수 상태

| 상태 코드 | 상태명 | Badge 색상 | 설명 |
|----------|--------|-----------|------|
| \`cancelled\` | 취소 | \`bg-red-100 text-red-700\` | 고객/관리자 취소 |
| \`refunded\` | 환불 | \`bg-pink-100 text-pink-700\` | 환불 처리 완료 |
| \`on_hold\` | 보류 | \`bg-amber-100 text-amber-700\` | 확인 필요 사항 발생 |

### 일괄 처리 액션 (Bulk Actions)

| 액션 | 설명 | 권한 |
|------|------|------|
| 일괄상태변경 | 선택한 주문들의 상태를 한번에 변경 | \`admin.orders.update\` |
| 엑셀다운로드 | 선택/전체 주문 목록 엑셀 다운로드 | \`admin.orders.export\` |
| SMS발송 | 선택한 주문의 고객에게 SMS 발송 | \`admin.orders.notify\` |

---

## 2. 와이어프레임

### 전체 레이아웃 (1280px+)

\`\`\`
┌──────────────────────────────────────────────────────────────────────────┐
│  후니프린팅 어드민                              🔔 3  👤 관리자  [로그아웃] │ AdminHeader
├─────────┬────────────────────────────────────────────────────────────────┤
│         │                                                                │
│  📊     │  인쇄 주문관리                                     PageHeader │
│ 대시보드 │  주문의 접수부터 배송까지 전체 주기를 관리합니다.                 │
│         │                                                                │
│  📦     │  ┌──────────────────────────────────────────────────────────┐ │
│ 주문관리 │  │  📅 주문일시   [2026-03-01] ~ [2026-03-19]              │ │ FilterSection
│  ▸ 일반  │  │  🔍 검색       [주문번호, 상품명, 주문자명  ▾] [       ]│ │
│  ▸ 인쇄 ◀│  │  💳 결제상태   [전체 ▾]   📁 파일상태  [전체 ▾]        │ │
│         │  │  [검색] [초기화]                                         │ │
│  👥     │  └──────────────────────────────────────────────────────────┘ │
│ 회원관리 │                                                                │
│         │  ┌──────────────────────────────────────────────────────────┐ │
│  📄     │  │ [전체 128] [접수 12] [파일확인 8] [파일승인 5]           │ │ StatusTabBar
│ 상품관리 │  │ [제작대기 15] [제작중 23] [제작완료 10] [배송중 18]      │ │
│         │  │ [배송완료 37]                                            │ │
│  💰     │  └──────────────────────────────────────────────────────────┘ │
│ 정산    │                                                                │
│         │  ┌──────────────────────────────────────────────────────────┐ │
│  ⚙️     │  │ □ 2건 선택  [일괄상태변경 ▾] [엑셀다운로드] [SMS발송]   │ │ ActionBar
│ 설정    │  └──────────────────────────────────────────────────────────┘ │
│         │                                                                │
│         │  ┌──────────────────────────────────────────────────────────┐ │
│         │  │ □ │주문번호    │주문일시      │상품명       │수량│금액    │ │ DataTable
│         │  │───┼───────────┼─────────────┼────────────┼───┼───────│ │ Header
│         │  │ □ │PN-20260319│03-19 14:23  │명함 스노우.. │500│₩60,500│ │
│         │  │   │-001       │             │250g 양면코팅│   │       │ │
│         │  │   │ [결제완료] [파일확인] [검증완료]        │ 서울..  │⋮│ │
│         │  │───┼───────────┼─────────────┼────────────┼───┼───────│ │
│         │  │ ■ │PN-20260319│03-19 13:45  │전단A4 아르..│1000│₩125,000│ │
│         │  │   │-002       │             │떼 150g     │   │       │ │
│         │  │   │ [결제완료] [접수] [대기중]              │ 부산..  │⋮│ │
│         │  │───┼───────────┼─────────────┼────────────┼───┼───────│ │
│         │  │ ■ │PN-20260318│03-18 16:10  │리플렛 3단..│2000│₩280,000│ │
│         │  │   │-015       │             │랑데뷰 180g │   │       │ │
│         │  │   │ [결제완료] [제작중] [검증완료]          │ 대전..  │⋮│ │
│         │  │───┼───────────┼─────────────┼────────────┼───┼───────│ │
│         │  │   │ ...       │             │            │   │       │ │
│         │  └──────────────────────────────────────────────────────────┘ │
│         │                                                                │
│         │  ┌──────────────────────────────────────────────────────────┐ │
│         │  │  ◀ 1 2 3 [4] 5 6 7 ▶    20건씩 ▾    총 128건           │ │ Pagination
│         │  └──────────────────────────────────────────────────────────┘ │
│         │                                                                │
├─────────┴────────────────────────────────────────────────────────────────┤
│  (c) 2026 후니프린팅. All rights reserved.                        Footer │
└──────────────────────────────────────────────────────────────────────────┘
\`\`\`

### DetailPanel (Sheet) - 우측 슬라이드

\`\`\`
┌──────────────────────────────────────────────────────┬───────────────────────────────────┐
│                                                      │                                   │
│  (메인 콘텐츠 영역 - 어두운 오버레이)                  │  주문 상세  PN-20260319-001    ✕ │ Sheet Header
│                                                      │                                   │
│                                                      │  ┌───────────────────────────┐   │
│                                                      │  │ 주문 상태 이력             │   │ StatusTimeline
│                                                      │  │                           │   │
│                                                      │  │ ● 접수      03-19 14:23   │   │
│                                                      │  │ │                         │   │
│                                                      │  │ ● 파일확인  03-19 14:30   │   │
│                                                      │  │ │ 담당: 김인쇄             │   │
│                                                      │  │ ○ 파일승인  (대기중)       │   │
│                                                      │  │ ○ 제작대기                 │   │
│                                                      │  │ ○ 제작중                   │   │
│                                                      │  │ ○ 제작완료                 │   │
│                                                      │  │ ○ 배송중                   │   │
│                                                      │  │ ○ 배송완료                 │   │
│                                                      │  └───────────────────────────┘   │
│                                                      │                                   │
│                                                      │  ┌───────────────────────────┐   │
│                                                      │  │ 주문 정보                  │   │ OrderInfo
│                                                      │  │ 주문자: 홍길동             │   │
│                                                      │  │ 연락처: 010-1234-5678     │   │
│                                                      │  │ 이메일: hong@example.com  │   │
│                                                      │  │ 주문일: 2026-03-19 14:23  │   │
│                                                      │  └───────────────────────────┘   │
│                                                      │                                   │
│                                                      │  ┌───────────────────────────┐   │
│                                                      │  │ 상품 정보                  │   │ ProductInfo
│                                                      │  │ 제품: 명함                 │   │
│                                                      │  │ 사이즈: 90x50mm           │   │
│                                                      │  │ 용지: 스노우지 250g       │   │
│                                                      │  │ 후가공: 양면코팅, 귀도리   │   │
│                                                      │  │ 수량: 500매               │   │
│                                                      │  │ 납기: 빠른 (2영업일)      │   │
│                                                      │  └───────────────────────────┘   │
│                                                      │                                   │
│                                                      │  ┌───────────────────────────┐   │
│                                                      │  │ 인쇄 파일                  │   │ FileSection
│                                                      │  │ 명함_앞면.ai  2.3MB       │   │
│                                                      │  │    ✓ 검증완료              │   │
│                                                      │  │    [미리보기] [다운로드]    │   │
│                                                      │  │ 명함_뒷면.ai  1.8MB       │   │
│                                                      │  │    ✓ 검증완료              │   │
│                                                      │  │    [미리보기] [다운로드]    │   │
│                                                      │  └───────────────────────────┘   │
│                                                      │                                   │
│                                                      │  ┌───────────────────────────┐   │
│                                                      │  │ 결제 정보                  │   │ PaymentInfo
│                                                      │  │ 결제수단: 카드             │   │
│                                                      │  │ 인쇄비: ₩35,000          │   │
│                                                      │  │ 용지비: ₩12,000          │   │
│                                                      │  │ 후가공비: ₩8,000         │   │
│                                                      │  │ 납기추가: ₩5,000         │   │
│                                                      │  │ ─────────────────        │   │
│                                                      │  │ 합계: ₩60,500 (VAT포함)  │   │
│                                                      │  │ 결제상태: [결제완료]       │   │
│                                                      │  └───────────────────────────┘   │
│                                                      │                                   │
│                                                      │  ┌───────────────────────────┐   │
│                                                      │  │ 배송 정보                  │   │ ShippingInfo
│                                                      │  │ 수령인: 홍길동             │   │
│                                                      │  │ 주소: 서울시 강남구 ...   │   │
│                                                      │  │ 연락처: 010-1234-5678     │   │
│                                                      │  │ 배송메모: 부재시 경비실    │   │
│                                                      │  │ 택배사: -                  │   │
│                                                      │  │ 운송장: -                  │   │
│                                                      │  └───────────────────────────┘   │
│                                                      │                                   │
│                                                      │  ┌───────────────────────────┐   │
│                                                      │  │ 관리자 메모                │   │ AdminMemo
│                                                      │  │ [메모 입력...           ]  │   │
│                                                      │  │ [저장]                     │   │
│                                                      │  │ 03-19 14:30 김인쇄        │   │
│                                                      │  │ "파일 확인 완료, 재단선   │   │
│                                                      │  │  여유 2mm - 고객 확인 중" │   │
│                                                      │  └───────────────────────────┘   │
│                                                      │                                   │
│                                                      │  ─────────────────────────────   │
│                                                      │  상태 변경: [파일승인 ▾] [변경]  │ StatusAction
│                                                      │                                   │
└──────────────────────────────────────────────────────┴───────────────────────────────────┘
\`\`\`

---

## 3. 컴포넌트 트리

\`\`\`
AdminPrintOrderPage
├── AdminLayout
│   ├── AdminHeader
│   │   ├── Logo
│   │   ├── NotificationBell (count badge)
│   │   ├── AdminProfile
│   │   └── LogoutButton
│   ├── AdminSidebar
│   │   └── SidebarNavItem[]
│   │       ├── NavIcon
│   │       ├── NavLabel
│   │       └── SubNavList (expandable)
│   └── AdminContent
│       ├── PageHeader
│       │   ├── PageTitle ("인쇄 주문관리")
│       │   └── PageDescription
│       ├── FilterSection
│       │   ├── DateRangePicker
│       │   │   ├── StartDateInput
│       │   │   ├── DateSeparator ("~")
│       │   │   └── EndDateInput
│       │   ├── SearchInput
│       │   │   ├── SearchFieldSelect (주문번호 | 상품명 | 주문자명)
│       │   │   └── SearchTextField
│       │   ├── FilterSelect[] (결제상태, 파일상태)
│       │   │   ├── FilterLabel
│       │   │   └── Select (shadcn/ui)
│       │   ├── SearchButton
│       │   └── ResetButton
│       ├── StatusTabBar
│       │   └── StatusTab[]
│       │       ├── StatusLabel
│       │       └── StatusCount (badge)
│       ├── ActionBar
│       │   ├── SelectionInfo ("N건 선택")
│       │   ├── BulkStatusChangeDropdown
│       │   │   ├── DropdownTrigger ("일괄상태변경")
│       │   │   └── DropdownMenu
│       │   │       └── StatusMenuItem[]
│       │   ├── ExcelDownloadButton
│       │   └── SMSSendButton
│       ├── DataTable
│       │   ├── TableHeader
│       │   │   ├── CheckboxAll (전체 선택)
│       │   │   └── ColumnHeader[] (sortable)
│       │   │       ├── ColumnLabel
│       │   │       └── SortIndicator (asc | desc | none)
│       │   └── TableBody
│       │       └── TableRow[] (clickable → DetailPanel)
│       │           ├── CheckboxCell
│       │           ├── OrderNumberCell
│       │           │   └── OrderNumber (link style)
│       │           ├── OrderDateCell
│       │           ├── ProductNameCell
│       │           │   ├── ProductType
│       │           │   └── ProductSpec (용지, 후가공 요약)
│       │           ├── QuantityCell
│       │           ├── AmountCell
│       │           ├── PaymentStatusCell
│       │           │   └── StatusBadge
│       │           ├── OrderStatusCell
│       │           │   └── StatusBadge
│       │           ├── FileStatusCell
│       │           │   └── StatusBadge
│       │           ├── ShippingInfoCell
│       │           │   ├── ReceiverName
│       │           │   └── AddressShort
│       │           └── ActionCell
│       │               └── ActionDropdown (⋮)
│       │                   ├── ViewDetailItem
│       │                   ├── ChangeStatusItem
│       │                   ├── DownloadFilesItem
│       │                   └── CancelOrderItem
│       └── Pagination
│           ├── PrevButton
│           ├── PageNumber[]
│           ├── NextButton
│           ├── PageSizeSelect (20 | 50 | 100)
│           └── TotalCount
├── DetailPanel (Sheet - shadcn/ui)
│   ├── SheetHeader
│   │   ├── SheetTitle ("주문 상세")
│   │   ├── OrderNumber
│   │   └── CloseButton
│   ├── SheetContent (scrollable)
│   │   ├── StatusTimeline
│   │   │   └── TimelineItem[]
│   │   │       ├── TimelineDot (completed | current | upcoming)
│   │   │       ├── TimelineLabel
│   │   │       ├── TimelineDate
│   │   │       └── TimelineNote (담당자, 메모)
│   │   ├── OrderInfoSection
│   │   │   └── InfoRow[] (주문자, 연락처, 이메일, 주문일)
│   │   ├── ProductInfoSection
│   │   │   └── InfoRow[] (제품, 사이즈, 용지, 후가공, 수량, 납기)
│   │   ├── FileSection
│   │   │   └── FileItem[]
│   │   │       ├── FileIcon
│   │   │       ├── FileName
│   │   │       ├── FileSize
│   │   │       ├── ValidationStatus
│   │   │       ├── PreviewButton
│   │   │       └── DownloadButton
│   │   ├── PaymentInfoSection
│   │   │   ├── PaymentMethod
│   │   │   ├── PriceBreakdown
│   │   │   │   └── PriceLineItem[]
│   │   │   ├── TotalAmount
│   │   │   └── PaymentStatusBadge
│   │   ├── ShippingInfoSection
│   │   │   └── InfoRow[] (수령인, 주소, 연락처, 메모, 택배사, 운송장)
│   │   └── AdminMemoSection
│   │       ├── MemoInput
│   │       ├── SaveButton
│   │       └── MemoHistory[]
│   │           ├── MemoDate
│   │           ├── MemoAuthor
│   │           └── MemoContent
│   └── SheetFooter
│       ├── StatusChangeSelect
│       └── StatusChangeButton
└── ConfirmDialog (상태 변경 확인)
    ├── DialogTitle
    ├── DialogDescription
    ├── CancelButton
    └── ConfirmButton
\`\`\`

---

## 4. DataTable 컬럼 정의

| # | 컬럼명 | 필드 | 너비 | 정렬 | 설명 |
|---|--------|------|------|------|------|
| 0 | 선택 | - | 48px (fixed) | - | Checkbox, 전체선택 헤더 |
| 1 | 주문번호 | \`orderNumber\` | 120px (fixed) | - | \`PN-YYYYMMDD-NNN\` 형식, 클릭 시 DetailPanel |
| 2 | 주문일시 | \`orderedAt\` | 150px (fixed) | sortable (기본 desc) | \`MM-DD HH:mm\` 형식, 호버 시 full datetime 툴팁 |
| 3 | 상품명 | \`productName\` | 200px (flex: 1) | - | 제품타입 + 스펙 요약 (2줄), ellipsis 처리 |
| 4 | 수량 | \`quantity\` | 80px (fixed) | sortable | 숫자 + "매" 단위, 우측 정렬 |
| 5 | 금액 | \`totalAmount\` | 100px (fixed) | sortable | ₩ 포맷, 우측 정렬 |
| 6 | 결제상태 | \`paymentStatus\` | 90px (fixed) | - | Badge: 결제대기(gray), 결제완료(green), 환불(red) |
| 7 | 주문상태 | \`orderStatus\` | 90px (fixed) | - | Badge: 8단계 상태별 색상 (섹션 1 매트릭스 참고) |
| 8 | 파일상태 | \`fileStatus\` | 90px (fixed) | - | Badge: 대기중(gray), 검증중(yellow), 검증완료(green), 오류(red) |
| 9 | 배송정보 | \`shipping\` | 150px (fixed) | - | 수령인 + 주소 축약, 운송장 번호 (있을 경우) |
| 10 | 액션 | - | 48px (fixed) | - | DropdownMenu (⋮): 상세보기, 상태변경, 파일다운, 취소 |

### 컬럼 합산 너비

- Fixed 컬럼: 48 + 120 + 150 + 80 + 100 + 90 + 90 + 90 + 150 + 48 = 966px
- Flex 컬럼 (상품명): 나머지 공간 (최소 200px)
- 최소 테이블 너비: 1166px (sidebar 240px 제외 시 content 영역에 적합)

### Badge 컴포넌트 스펙

\`\`\`typescript
interface StatusBadgeProps {
  status: string;
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  colorClass: string; // Tailwind 클래스
}

// 결제상태 Badge 매핑
const paymentStatusMap: Record<string, StatusBadgeProps> = {
  pending:   { status: 'pending',   label: '결제대기', variant: 'secondary', colorClass: 'bg-gray-100 text-gray-700' },
  paid:      { status: 'paid',      label: '결제완료', variant: 'default',   colorClass: 'bg-green-100 text-green-700' },
  refunded:  { status: 'refunded',  label: '환불',     variant: 'destructive', colorClass: 'bg-red-100 text-red-700' },
  cancelled: { status: 'cancelled', label: '취소',     variant: 'destructive', colorClass: 'bg-red-100 text-red-700' },
};

// 파일상태 Badge 매핑
const fileStatusMap: Record<string, StatusBadgeProps> = {
  waiting:    { status: 'waiting',    label: '대기중',   variant: 'secondary', colorClass: 'bg-gray-100 text-gray-700' },
  validating: { status: 'validating', label: '검증중',   variant: 'secondary', colorClass: 'bg-yellow-100 text-yellow-700' },
  valid:      { status: 'valid',      label: '검증완료', variant: 'default',   colorClass: 'bg-green-100 text-green-700' },
  invalid:    { status: 'invalid',    label: '오류',     variant: 'destructive', colorClass: 'bg-red-100 text-red-700' },
};
\`\`\`

---

## 5. API 매핑

### 5.1 주문 목록 조회

\`\`\`
GET /api/admin/print-orders
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 인쇄 주문 목록 조회 (필터, 페이지네이션, 정렬) |
| **인증** | 필요 (admin token) |
| **권한** | \`admin.orders.read\` |
| **캐싱** | SWR, staleTime: 30초 (어드민은 실시간성 중요) |

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|---------|------|------|------|--------|
| \`page\` | number | N | 페이지 번호 | 1 |
| \`size\` | number | N | 페이지 크기 | 20 |
| \`sort\` | string | N | 정렬 필드 | \`orderedAt\` |
| \`order\` | string | N | 정렬 방향 | \`desc\` |
| \`status\` | string | N | 주문상태 필터 (comma separated) | - |
| \`paymentStatus\` | string | N | 결제상태 필터 | - |
| \`fileStatus\` | string | N | 파일상태 필터 | - |
| \`startDate\` | string | N | 조회 시작일 (ISO 8601) | - |
| \`endDate\` | string | N | 조회 종료일 (ISO 8601) | - |
| \`searchField\` | string | N | 검색 필드 (\`orderNumber\`, \`productName\`, \`customerName\`) | - |
| \`searchKeyword\` | string | N | 검색 키워드 | - |

**Response:**

\`\`\`json
{
  "items": [
    {
      "id": "order_abc123",
      "orderNumber": "PN-20260319-001",
      "orderedAt": "2026-03-19T14:23:00+09:00",
      "customer": {
        "name": "홍길동",
        "phone": "010-1234-5678",
        "email": "hong@example.com"
      },
      "product": {
        "type": "business_card",
        "typeName": "명함",
        "size": "90x50mm",
        "paper": "스노우지 250g",
        "finishings": ["양면코팅", "귀도리"]
      },
      "quantity": 500,
      "totalAmount": 60500,
      "paymentStatus": "paid",
      "orderStatus": "file_review",
      "fileStatus": "valid",
      "shipping": {
        "receiverName": "홍길동",
        "address": "서울시 강남구 테헤란로 123",
        "trackingNumber": null,
        "courier": null
      }
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20,
    "totalItems": 128,
    "totalPages": 7
  },
  "statusCounts": {
    "all": 128,
    "received": 12,
    "file_review": 8,
    "file_approved": 5,
    "production_ready": 15,
    "in_production": 23,
    "production_done": 10,
    "shipping": 18,
    "delivered": 37
  }
}
\`\`\`

**Response 매핑:**

| API 필드 | UI 매핑 |
|----------|---------|
| \`items[]\` | DataTable rows |
| \`items[].orderNumber\` | 주문번호 컬럼 + DetailPanel 헤더 |
| \`items[].orderedAt\` | 주문일시 컬럼 (MM-DD HH:mm 변환) |
| \`items[].product.typeName\` + \`product.paper\` + \`product.finishings\` | 상품명 컬럼 (2줄 표시) |
| \`items[].quantity\` | 수량 컬럼 |
| \`items[].totalAmount\` | 금액 컬럼 (₩ 포맷팅) |
| \`items[].paymentStatus\` | 결제상태 Badge |
| \`items[].orderStatus\` | 주문상태 Badge |
| \`items[].fileStatus\` | 파일상태 Badge |
| \`items[].shipping\` | 배송정보 컬럼 |
| \`pagination\` | Pagination 컴포넌트 |
| \`statusCounts\` | StatusTabBar 카운트 표시 |

### 5.2 주문 상세 조회

\`\`\`
GET /api/admin/print-orders/:id
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 인쇄 주문 상세 정보 조회 (DetailPanel 표시용) |
| **인증** | 필요 (admin token) |
| **권한** | \`admin.orders.read\` |
| **캐싱** | SWR, staleTime: 10초 |

**Response:**

\`\`\`json
{
  "id": "order_abc123",
  "orderNumber": "PN-20260319-001",
  "orderedAt": "2026-03-19T14:23:00+09:00",
  "customer": {
    "id": "member_xyz",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "email": "hong@example.com"
  },
  "product": {
    "type": "business_card",
    "typeName": "명함",
    "size": "90x50mm",
    "paper": "스노우지 250g",
    "finishings": ["양면코팅", "귀도리"],
    "deliveryOption": "fast",
    "deliveryDays": 2
  },
  "quantity": 500,
  "pricing": {
    "printCost": 35000,
    "paperCost": 12000,
    "finishingCost": 8000,
    "deliverySurcharge": 5000,
    "subtotal": 55000,
    "tax": 5500,
    "total": 60500
  },
  "payment": {
    "status": "paid",
    "method": "card",
    "paidAt": "2026-03-19T14:25:00+09:00",
    "cardInfo": "신한카드 **** 1234"
  },
  "files": [
    {
      "id": "file_abc123",
      "name": "명함_앞면.ai",
      "size": 2412544,
      "status": "valid",
      "previewUrl": "/api/admin/files/file_abc123/preview",
      "downloadUrl": "/api/admin/files/file_abc123/download"
    },
    {
      "id": "file_def456",
      "name": "명함_뒷면.ai",
      "size": 1887437,
      "status": "valid",
      "previewUrl": "/api/admin/files/file_def456/preview",
      "downloadUrl": "/api/admin/files/file_def456/download"
    }
  ],
  "shipping": {
    "receiverName": "홍길동",
    "address": "서울시 강남구 테헤란로 123 4층",
    "zipCode": "06142",
    "phone": "010-1234-5678",
    "memo": "부재시 경비실에 맡겨주세요",
    "courier": null,
    "trackingNumber": null
  },
  "statusHistory": [
    {
      "status": "received",
      "statusName": "접수",
      "changedAt": "2026-03-19T14:23:00+09:00",
      "changedBy": "system",
      "note": null
    },
    {
      "status": "file_review",
      "statusName": "파일확인",
      "changedAt": "2026-03-19T14:30:00+09:00",
      "changedBy": "김인쇄",
      "note": "파일 확인 시작"
    }
  ],
  "adminMemos": [
    {
      "id": "memo_001",
      "content": "파일 확인 완료, 재단선 여유 2mm - 고객 확인 중",
      "createdAt": "2026-03-19T14:30:00+09:00",
      "createdBy": "김인쇄"
    }
  ],
  "proofRequired": true
}
\`\`\`

### 5.3 주문 상태 변경 (단건)

\`\`\`
PUT /api/admin/print-orders/:id/status
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 주문 상태 변경 |
| **인증** | 필요 (admin token) |
| **권한** | \`admin.orders.update\` |

**Request:**

\`\`\`json
{
  "status": "file_approved",
  "note": "파일 검수 완료, 제작 진행 가능"
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": "order_abc123",
  "orderNumber": "PN-20260319-001",
  "previousStatus": "file_review",
  "currentStatus": "file_approved",
  "changedAt": "2026-03-19T15:00:00+09:00",
  "changedBy": "김인쇄"
}
\`\`\`

**상태 전이 검증 (서버 사이드):**

| 현재 상태 | 허용 전이 |
|----------|----------|
| \`received\` | \`file_review\`, \`cancelled\` |
| \`file_review\` | \`file_approved\`, \`received\` (반려), \`on_hold\`, \`cancelled\` |
| \`file_approved\` | \`production_ready\`, \`on_hold\`, \`cancelled\` |
| \`production_ready\` | \`in_production\`, \`on_hold\`, \`cancelled\` |
| \`in_production\` | \`production_done\`, \`on_hold\` |
| \`production_done\` | \`shipping\` |
| \`shipping\` | \`delivered\` |
| \`delivered\` | (전이 불가) |
| \`on_hold\` | 이전 상태 복원 |

### 5.4 일괄 상태 변경

\`\`\`
POST /api/admin/print-orders/batch-status
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 선택한 복수 주문의 상태 일괄 변경 |
| **인증** | 필요 (admin token) |
| **권한** | \`admin.orders.update\` |

**Request:**

\`\`\`json
{
  "orderIds": ["order_abc123", "order_def456", "order_ghi789"],
  "status": "production_ready",
  "note": "일괄 제작 투입"
}
\`\`\`

**Response:**

\`\`\`json
{
  "total": 3,
  "success": 2,
  "failed": 1,
  "results": [
    { "orderId": "order_abc123", "success": true, "currentStatus": "production_ready" },
    { "orderId": "order_def456", "success": true, "currentStatus": "production_ready" },
    { "orderId": "order_ghi789", "success": false, "error": "INVALID_TRANSITION", "message": "접수 상태에서 제작대기로 직접 전이할 수 없습니다." }
  ]
}
\`\`\`

### 5.5 관리자 메모 추가

\`\`\`
POST /api/admin/print-orders/:id/memos
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 주문에 관리자 메모 추가 |
| **인증** | 필요 (admin token) |
| **권한** | \`admin.orders.update\` |

**Request:**

\`\`\`json
{
  "content": "고객 전화 확인 완료, 재단선 수정 불필요"
}
\`\`\`

### 5.6 엑셀 다운로드

\`\`\`
GET /api/admin/print-orders/export
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 주문 목록 엑셀 파일 다운로드 |
| **인증** | 필요 (admin token) |
| **권한** | \`admin.orders.export\` |
| **Content-Type** | \`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\` |

**Query Parameters:** 목록 조회와 동일한 필터 파라미터 + \`orderIds\` (선택 다운로드 시)

### 5.7 SMS 발송

\`\`\`
POST /api/admin/print-orders/send-sms
\`\`\`

| 항목 | 내용 |
|------|------|
| **용도** | 선택한 주문의 고객에게 SMS 발송 |
| **인증** | 필요 (admin token) |
| **권한** | \`admin.orders.notify\` |

**Request:**

\`\`\`json
{
  "orderIds": ["order_abc123", "order_def456"],
  "templateId": "production_start",
  "customMessage": null
}
\`\`\`

---

## 6. 데이터 플로우

### 6.1 메인 플로우: 필터 → 목록 → 상세 → 상태변경

\`\`\`
[페이지 진입]
     │
     ▼
┌──────────────────┐
│ 초기 데이터 로드  │  GET /api/admin/print-orders?page=1&size=20&sort=orderedAt&order=desc
│ (기본 필터)       │
└────────┬─────────┘
         │
┌────────▼─────────┐
│ DataTable 렌더링  │  items[] → TableRow, statusCounts → StatusTabBar
│ + StatusTabBar    │
└────────┬─────────┘
         │
         ├──────────────────────────────────────┐
         │                                      │
┌────────▼─────────┐              ┌─────────────▼──────────┐
│ 필터/검색 변경    │              │ 행 클릭                 │
│                  │              │                        │
│ FilterSection    │              │ GET /api/admin/        │
│ 값 변경 → URL    │              │ print-orders/:id       │
│ query 업데이트    │              │                        │
│ → 목록 재조회     │              │ DetailPanel(Sheet)     │
└────────┬─────────┘              │ 슬라이드 오픈           │
         │                        └──────────┬─────────────┘
         ▼                                   │
┌──────────────────┐              ┌──────────▼─────────────┐
│ URL 기반 상태관리 │              │ 상태 변경 액션          │
│ (React Router    │              │                        │
│  searchParams)   │              │ PUT /api/admin/        │
│                  │              │ print-orders/:id/status│
│ 뒤로가기 시      │              │                        │
│ 필터 상태 복원    │              │ Optimistic Update      │
└──────────────────┘              │ → 목록 재조회           │
                                  └────────────────────────┘
\`\`\`

### 6.2 StatusTabBar 필터 연동 플로우

\`\`\`
[StatusTab 클릭 (예: "파일확인")]
     │
     ▼
┌──────────────────┐
│ URL 업데이트      │  ?status=file_review (기존 필터 유지)
└────────┬─────────┘
         │
┌────────▼─────────┐
│ 목록 재조회       │  GET /api/admin/print-orders?status=file_review&page=1&...
│ page=1 리셋      │
└────────┬─────────┘
         │
┌────────▼─────────┐
│ DataTable 갱신    │  해당 상태의 주문만 표시
│ StatusTabBar      │  선택 탭 하이라이트
│ 카운트 유지       │  statusCounts는 전체 기준 (탭별 카운트 항상 표시)
└──────────────────┘
\`\`\`

### 6.3 일괄 처리 플로우

\`\`\`
[Checkbox로 복수 행 선택]
     │
     ▼
┌──────────────────┐
│ ActionBar 활성화  │  "N건 선택" 표시, 벌크 액션 버튼 활성
└────────┬─────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
┌────────▼──────┐  ┌───────▼───────┐  ┌──────▼────────┐
│일괄상태변경    │  │ 엑셀다운로드   │  │ SMS발송       │
│               │  │               │  │               │
│ Dropdown:     │  │ GET /export   │  │ 템플릿 선택   │
│ 상태 선택     │  │ ?orderIds=... │  │ 모달          │
│               │  │               │  │               │
│ ConfirmDialog │  │ Blob 다운로드 │  │ POST /send-sms│
│ "N건 → 상태?" │  │               │  │               │
│               │  │               │  │               │
│ POST /batch-  │  └───────────────┘  └───────────────┘
│ status        │
└───────┬───────┘
        │
┌───────▼────────┐
│ 부분 실패 처리  │  성공/실패 건수 Toast 표시
│                │  실패 건: 에러 사유 표시
│ 목록 재조회     │  성공 건: 상태 즉시 반영
└────────────────┘
\`\`\`

### 6.4 URL 기반 상태 관리

\`\`\`typescript
// URL searchParams ↔ 필터 상태 동기화
interface FilterState {
  page: number;
  size: number;
  sort: string;
  order: 'asc' | 'desc';
  status: string | null;
  paymentStatus: string | null;
  fileStatus: string | null;
  startDate: string | null;
  endDate: string | null;
  searchField: string | null;
  searchKeyword: string | null;
}

// URL 예시: /admin/print-orders?status=file_review&page=1&size=20&sort=orderedAt&order=desc
// 브라우저 뒤로가기 시 필터 상태 자동 복원
// 새로고침 시에도 필터 상태 유지
\`\`\`

---

## 7. 인터랙션 상태

### 7.1 상태 정의

| 상태 | 설명 | UI 표현 |
|------|------|---------|
| \`loading\` | 목록 데이터 로딩 중 | DataTable Skeleton rows (20행), StatusTabBar 카운트 "-" |
| \`loaded\` | 목록 정상 표시 | DataTable 데이터 행, StatusTabBar 카운트 숫자 표시 |
| \`empty\` | 검색/필터 결과 없음 | EmptyState 일러스트 + "검색 결과가 없습니다" + 필터 초기화 버튼 |
| \`filtering\` | 필터 조건 변경 후 재조회 중 | DataTable 반투명(opacity: 0.6) + 상단 로딩 바 |
| \`detail-open\` | DetailPanel(Sheet) 열림 | 우측 Sheet 슬라이드, 배경 오버레이(opacity: 0.4) |
| \`detail-loading\` | 상세 정보 로딩 중 | Sheet 내부 Skeleton (섹션별) |
| \`bulk-selecting\` | 복수 행 선택 중 | 선택 행 배경색 하이라이트, ActionBar 카운트 업데이트 |
| \`status-changing\` | 상태 변경 요청 중 | ConfirmDialog 표시 → 확인 후 Spinner + 버튼 비활성 |
| \`batch-processing\` | 일괄 처리 진행 중 | ActionBar 버튼 비활성, Progress 표시 |
| \`exporting\` | 엑셀 다운로드 중 | 다운로드 버튼 Spinner, "다운로드 중..." 텍스트 |
| \`error\` | API 오류 발생 | Toast 알림 (우측 상단) |

### 7.2 상태 전이 다이어그램

\`\`\`
loading → loaded ⇄ filtering → loaded
              │
              ├→ empty (결과 없음)
              │
              ├→ bulk-selecting ⇄ loaded
              │       │
              │       ├→ status-changing → loaded (refresh)
              │       ├→ batch-processing → loaded (refresh)
              │       └→ exporting → loaded
              │
              └→ detail-open
                    │
                    ├→ detail-loading → detail-open (loaded)
                    │
                    ├→ status-changing → detail-open (refresh)
                    │
                    └→ loaded (Sheet 닫기)

* 모든 상태에서 error 전이 가능
* error는 Toast로 표시, 이전 상태 유지
\`\`\`

### 7.3 Skeleton 로딩 세부사항

**DataTable Skeleton:**
\`\`\`
┌───┬─────────────┬──────────────┬─────────────┬──────┬────────┐
│ □ │ ████████    │ ██████████   │ ████████████│ ████ │ ██████ │  ← Skeleton row
│   │             │              │ ████████    │      │        │
├───┼─────────────┼──────────────┼─────────────┼──────┼────────┤
│ □ │ ████████    │ ██████████   │ ████████████│ ████ │ ██████ │
│   │             │              │ ██████      │      │        │
├───┼─────────────┼──────────────┼─────────────┼──────┼────────┤
│ □ │ ████████    │ ██████████   │ ████████████│ ████ │ ██████ │
...
\`\`\`

**DetailPanel Skeleton:**
\`\`\`
┌───────────────────────────────┐
│  주문 상세  ████████████   ✕ │
│                               │
│  ● ████████  ██████████      │  StatusTimeline skeleton
│  │                           │
│  ○ ████████                  │
│                               │
│  ┌───────────────────────┐   │
│  │ ████████               │   │  InfoSection skeleton
│  │ █████: ████████████   │   │
│  │ █████: ████████████   │   │
│  │ █████: ████████████   │   │
│  └───────────────────────┘   │
└───────────────────────────────┘
\`\`\`

---

## 8. 에러 처리

### 8.1 에러 유형별 처리

| 에러 유형 | 발생 시점 | 에러 코드 | 사용자 메시지 | 처리 방법 |
|----------|----------|-----------|-------------|----------|
| 목록 조회 실패 | 페이지 로드, 필터 변경 | \`LIST_FETCH_FAIL\` | "주문 목록을 불러오는데 실패했습니다." | 재시도 버튼 + Toast, 3회 실패 시 에러 페이지 |
| 상세 조회 실패 | DetailPanel 오픈 | \`DETAIL_FETCH_FAIL\` | "주문 상세 정보를 불러올 수 없습니다." | Sheet 내부 에러 표시 + 재시도 버튼, 닫기 가능 |
| 상태 변경 실패 | 단건 상태 변경 | \`STATUS_CHANGE_FAIL\` | "상태 변경에 실패했습니다. 다시 시도해 주세요." | ConfirmDialog 유지 + 에러 메시지, 재시도 가능 |
| 잘못된 상태 전이 | 상태 변경 | \`INVALID_TRANSITION\` | "현재 상태에서 해당 상태로 변경할 수 없습니다." | 허용 상태만 Dropdown에 표시 (서버 검증은 안전장치) |
| 일괄 부분 실패 | 일괄 상태 변경 | \`BATCH_PARTIAL_FAIL\` | "N건 성공, M건 실패. 실패 사유를 확인해 주세요." | 성공/실패 요약 Dialog, 실패 건 사유 목록 표시 |
| 권한 없음 | 모든 변경 액션 | \`PERMISSION_DENIED\` | "해당 작업을 수행할 권한이 없습니다." | Toast 에러 + 액션 버튼 숨김 (권한 재확인) |
| 인증 만료 | 전구간 | \`AUTH_EXPIRED\` | "로그인이 만료되었습니다." | 로그인 페이지 리다이렉트 (현재 URL 보존) |
| 엑셀 생성 실패 | 엑셀 다운로드 | \`EXPORT_FAIL\` | "엑셀 파일 생성에 실패했습니다." | Toast 에러 + 재시도 안내 |
| SMS 발송 실패 | SMS 발송 | \`SMS_SEND_FAIL\` | "SMS 발송에 실패했습니다." | 실패 건수 표시 + 재시도 옵션 |
| 네트워크 오류 | 전구간 | \`NETWORK_ERROR\` | "네트워크 연결을 확인해 주세요." | Toast + 자동 재시도 (exponential backoff, 최대 3회) |
| 서버 오류 | 전구간 | \`SERVER_ERROR\` | "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." | Toast + 재시도 버튼 |

### 8.2 에러 표시 UI 패턴

**목록 조회 실패 (전체 영역):**
\`\`\`
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              주문 목록을 불러오는데                         │
│              실패했습니다.                                 │
│                                                          │
│              네트워크 상태를 확인하고                       │
│              다시 시도해 주세요.                           │
│                                                          │
│                    [다시 시도]                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
\`\`\`

**일괄 처리 부분 실패 Dialog:**
\`\`\`
┌──────────────────────────────────────┐
│  일괄 상태 변경 결과                   │
│                                      │
│  ✓ 성공: 2건                          │
│  ✕ 실패: 1건                          │
│                                      │
│  실패 상세:                           │
│  ┌──────────────────────────────┐   │
│  │ PN-20260318-015              │   │
│  │ 사유: 접수 상태에서 제작대기로 │   │
│  │       직접 전이할 수 없습니다. │   │
│  └──────────────────────────────┘   │
│                                      │
│                          [확인]      │
└──────────────────────────────────────┘
\`\`\`

### 8.3 Optimistic Update 와 Rollback

\`\`\`typescript
async function changeOrderStatus(orderId: string, newStatus: string, note?: string) {
  // 1. Optimistic: 로컬 상태 즉시 업데이트
  const previousData = queryClient.getQueryData(['print-orders']);
  queryClient.setQueryData(['print-orders'], (old) => ({
    ...old,
    items: old.items.map(item =>
      item.id === orderId ? { ...item, orderStatus: newStatus } : item
    ),
  }));

  try {
    // 2. 서버 요청
    await api.put(\`/api/admin/print-orders/\${orderId}/status\`, { status: newStatus, note });
    // 3. 성공: 서버 데이터로 갱신 (statusCounts 포함)
    queryClient.invalidateQueries(['print-orders']);
    toast.success('주문 상태가 변경되었습니다.');
  } catch (error) {
    // 4. 실패: Rollback
    queryClient.setQueryData(['print-orders'], previousData);
    toast.error(getErrorMessage(error));
  }
}
\`\`\`

---

## 9. 접근성

### 9.1 키보드 내비게이션

| 키 | 동작 | 컨텍스트 |
|----|------|---------|
| \`Tab\` | 다음 포커스 요소 이동 | 전체 (필터 → 탭바 → 액션바 → 테이블) |
| \`Shift + Tab\` | 이전 포커스 요소 이동 | 전체 |
| \`Enter\` | 행 선택 → DetailPanel 오픈 | DataTable 행 포커스 시 |
| \`Space\` | Checkbox 토글 | DataTable Checkbox 포커스 시 |
| \`Arrow Up\` | 이전 행으로 이동 | DataTable 내 |
| \`Arrow Down\` | 다음 행으로 이동 | DataTable 내 |
| \`Arrow Left\` | 이전 페이지 | Pagination 포커스 시 |
| \`Arrow Right\` | 다음 페이지 | Pagination 포커스 시 |
| \`Home\` | 첫 번째 행으로 이동 | DataTable 내 |
| \`End\` | 마지막 행으로 이동 | DataTable 내 |
| \`Escape\` | DetailPanel(Sheet) 닫기 | Sheet 열린 상태 |
| \`Escape\` | ConfirmDialog 닫기 | Dialog 열린 상태 |
| \`Ctrl + A\` | 현재 페이지 전체 선택/해제 | DataTable 포커스 시 |

### 9.2 ARIA 속성

**DataTable:**
\`\`\`html
<table role="grid" aria-label="인쇄 주문 목록" aria-rowcount="128" aria-colcount="11">
  <thead>
    <tr role="row">
      <th role="columnheader" aria-label="전체 선택">
        <input type="checkbox" aria-label="현재 페이지 전체 선택" />
      </th>
      <th role="columnheader" aria-sort="none">주문번호</th>
      <th role="columnheader" aria-sort="descending">
        주문일시
        <span aria-hidden="true">▼</span>
      </th>
      <th role="columnheader">상품명</th>
      <th role="columnheader" aria-sort="none">수량</th>
      <th role="columnheader" aria-sort="none">금액</th>
      <th role="columnheader">결제상태</th>
      <th role="columnheader">주문상태</th>
      <th role="columnheader">파일상태</th>
      <th role="columnheader">배송정보</th>
      <th role="columnheader" aria-label="액션">액션</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row" aria-rowindex="1" aria-selected="false"
        tabindex="0" aria-label="주문 PN-20260319-001, 명함, 500매, 60,500원">
      <td role="gridcell">
        <input type="checkbox" aria-label="주문 PN-20260319-001 선택" />
      </td>
      <td role="gridcell">PN-20260319-001</td>
      <td role="gridcell">
        <time datetime="2026-03-19T14:23:00+09:00">03-19 14:23</time>
      </td>
    </tr>
  </tbody>
</table>
\`\`\`

**StatusTabBar:**
\`\`\`html
<div role="tablist" aria-label="주문 상태별 필터">
  <button role="tab" aria-selected="true" aria-controls="order-panel"
          aria-label="전체 주문 128건">
    전체 <span class="badge">128</span>
  </button>
  <button role="tab" aria-selected="false" aria-controls="order-panel"
          aria-label="접수 상태 12건">
    접수 <span class="badge">12</span>
  </button>
</div>
<div id="order-panel" role="tabpanel" aria-label="주문 목록">
  <!-- DataTable -->
</div>
\`\`\`

**DetailPanel (Sheet):**
\`\`\`html
<div role="dialog" aria-modal="true" aria-label="주문 상세 PN-20260319-001">
  <div role="banner">
    <h2 id="sheet-title">주문 상세</h2>
    <span>PN-20260319-001</span>
    <button aria-label="주문 상세 패널 닫기">✕</button>
  </div>
  <div role="main" aria-labelledby="sheet-title">
    <!-- Sheet 콘텐츠 -->
  </div>
</div>
\`\`\`

**ConfirmDialog:**
\`\`\`html
<div role="alertdialog" aria-modal="true"
     aria-labelledby="confirm-title" aria-describedby="confirm-desc">
  <h3 id="confirm-title">상태 변경 확인</h3>
  <p id="confirm-desc">
    주문 PN-20260319-001의 상태를 "파일확인"에서 "파일승인"으로 변경하시겠습니까?
  </p>
  <button>취소</button>
  <button autofocus>확인</button>
</div>
\`\`\`

**Pagination:**
\`\`\`html
<nav aria-label="주문 목록 페이지 이동">
  <button aria-label="이전 페이지" aria-disabled="false">◀</button>
  <button aria-label="1 페이지">1</button>
  <button aria-current="page" aria-label="4 페이지, 현재 페이지">4</button>
  <button aria-label="5 페이지">5</button>
  <button aria-label="다음 페이지" aria-disabled="false">▶</button>
  <span aria-live="polite">총 128건 중 61-80건 표시</span>
</nav>
\`\`\`

### 9.3 스크린 리더 지원

- 페이지 로드 시 \`aria-live="polite"\`: "인쇄 주문 목록, 총 128건"
- 필터 적용 시 \`aria-live="polite"\`: "파일확인 상태 주문 8건 표시"
- 정렬 변경 시 \`aria-live="polite"\`: "주문일시 내림차순으로 정렬되었습니다"
- 상태 변경 성공 시 \`aria-live="assertive"\`: "주문 PN-20260319-001 상태가 파일승인으로 변경되었습니다"
- 일괄 처리 완료 시 \`aria-live="assertive"\`: "2건 성공, 1건 실패"
- 에러 발생 시 \`role="alert"\`: 에러 메시지 즉시 안내

### 9.4 포커스 관리

- **Sheet 오픈 시**: Sheet CloseButton으로 포커스 이동, 배경 포커스 트랩
- **Sheet 닫기 시**: 이전 포커스 위치 (클릭했던 행)로 포커스 복원
- **ConfirmDialog 오픈 시**: 확인 버튼으로 포커스, Dialog 내부 포커스 트랩
- **ConfirmDialog 닫기 시**: 트리거 버튼으로 포커스 복원
- **행 삭제/상태변경 후**: 다음 행으로 포커스 이동 (마지막 행이면 이전 행)
- **페이지 변경 시**: DataTable 첫 번째 행으로 포커스 이동
- **필터 초기화 시**: 첫 번째 필터 입력으로 포커스 이동

### 9.5 색상 및 대비

- 모든 텍스트: 4.5:1 이상 대비 (WCAG AA)
- Badge 텍스트: 배경색 대비 3:1 이상
- 포커스 인디케이터: \`outline: 2px solid #5538B6\`, \`outline-offset: 2px\`
- 선택된 행 배경: \`bg-primary-50\` (#5538B6 10% opacity), 텍스트 대비 유지
- Hover 행 배경: \`bg-gray-50\`, 포커스와 구분 가능
- 상태 Badge는 색상만으로 구분하지 않음 (텍스트 레이블 항상 포함)
