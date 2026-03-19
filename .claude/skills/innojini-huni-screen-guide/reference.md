# 후니프린팅 컴포넌트 카탈로그 & API 레퍼런스

> SPEC-PLUGIN-002 REQ-04 | 최종 업데이트: 2026-03-19

## 목차

- [1. 쇼핑몰 컴포넌트 카탈로그](#1-쇼핑몰-컴포넌트-카탈로그)
- [2. 관리자 컴포넌트 카탈로그](#2-관리자-컴포넌트-카탈로그)
- [3. shopby API 엔드포인트 상세](#3-shopby-api-엔드포인트-상세)
- [4. 디자인 토큰 매핑](#4-디자인-토큰-매핑)
- [5. 정책 > UI 컴포넌트 연결 매핑](#5-정책--ui-컴포넌트-연결-매핑)

---

## 1. 쇼핑몰 컴포넌트 카탈로그

### Layout 컴포넌트 (src/components/Layout/)

#### PageShell

페이지 컨테이너. 일관된 max-width, 중앙 정렬, 반응형 패딩 제공. fan_in=20.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| children | node | - | 자식 콘텐츠 |
| maxWidth | `'sm'~'7xl'\|'full'` | `'7xl'` | 최대 너비 (sm=384px ~ 7xl=1280px) |
| padding | `'none'\|'sm'\|'responsive'` | `'responsive'` | 패딩 (responsive=px-4 md:px-6 lg:px-8) |
| className | string | - | 추가 CSS 클래스 |
| as | `'div'\|'section'\|'article'\|'main'\|...` | `'div'` | 렌더링 HTML 요소 |

**MAX_WIDTH_MAP**: sm=384, md=448, lg=512, xl=576, 2xl=672, 3xl=768, 4xl=896, 5xl=1024, 6xl=1152, 7xl=1280

**사용 예**: 인증 카드(sm), 폼 페이지(4xl), 주문/장바구니(5xl), 메인/카탈로그(7xl)

#### ResponsiveGrid

뷰포트에 따라 컬럼 수 자동 조정되는 CSS Grid. 상품 목록, 카테고리 그리드에 사용.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| children | node | - | 그리드 아이템 |
| cols | `{ mobile: 1-6, tablet: 1-6, desktop: 1-6 }` | `{ mobile:1, tablet:2, desktop:4 }` | 뷰포트별 컬럼 수 |
| gap | string | `'gap-4'` | Tailwind gap 클래스 |
| className | string | - | 추가 CSS 클래스 |

**주의**: Tailwind JIT 동적 클래스 - GRID_COLS 맵에 정의된 1~6만 사용 가능

#### SplitLayout

좌우 분할 레이아웃. 모바일: 수직 스택 / 데스크톱: 메인(8/12) + 사이드바(4/12). fan_in=3.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| main | node (필수) | - | 메인 콘텐츠 (좌측, 8/12) |
| aside | node (필수) | - | 사이드바 (우측, 4/12) |
| asideSticky | bool | false | 사이드바 sticky 여부 |
| reverse | bool | false | main/aside 순서 반전 |
| className | string | - | 추가 CSS 클래스 |

**사용 예**: 장바구니 (main=상품목록, aside=결제요약), 주문서, 인쇄상품 주문 (aside=실시간 가격)

#### FormLayout / FormLayout.Row

반응형 폼 레이아웃. 모바일: 수직 / 데스크톱: 수평(라벨 3/12 + 입력 9/12).

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| children | node | - | FormRow 컴포넌트 |
| className | string | - | 추가 CSS 클래스 |

**FormRow Props**:

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| label | node (필수) | - | 필드 라벨 |
| children | node | - | 입력 필드 |
| required | bool | false | 필수 표시 (*) |

### Product 컴포넌트

#### StepIndicator

멀티스텝 Wizard 진행 표시기. 인쇄 상품 주문 6단계에 사용.

| Prop | 타입 | 설명 |
|------|------|------|
| steps | `{ id, label, icon? }[]` | 단계 목록 |
| currentStep | number | 현재 활성 단계 인덱스 |
| completedSteps | number[] | 완료된 단계 인덱스 배열 |
| onStepClick | `(index) => void` | 단계 클릭 핸들러 (완료된 단계만 클릭 가능) |

#### OptionSelector

인쇄 옵션 선택기 (용지, 사이즈, 코팅 등). Chip/RadioOption 조합.

| Prop | 타입 | 설명 |
|------|------|------|
| options | `{ value, label, description?, disabled?, image? }[]` | 옵션 목록 |
| value | string | 선택된 값 |
| onChange | `(value) => void` | 변경 핸들러 |
| layout | `'chip'\|'radio'\|'grid'` | 레이아웃 모드 |
| disabled | bool | 비활성 상태 |

#### PaperSampleCard

용지 샘플 카드. 용지 이미지, 이름, 두께, 재질 표시.

| Prop | 타입 | 설명 |
|------|------|------|
| name | string | 용지명 |
| thickness | string | 두께 (예: "120g") |
| texture | string | 재질 설명 |
| imageUrl | string | 샘플 이미지 URL |
| selected | bool | 선택 상태 |
| onClick | function | 클릭 핸들러 |

#### QuantityPricingTable

수량별 가격 테이블. 수량 구간별 단가/합계 표시.

| Prop | 타입 | 설명 |
|------|------|------|
| tiers | `{ qty, unitPrice, totalPrice }[]` | 수량 구간별 가격 |
| selectedQty | number | 선택된 수량 |
| onQtySelect | `(qty) => void` | 수량 선택 핸들러 |
| currency | string | 통화 (기본: '원') |

#### RealTimePriceWidget

실시간 가격 계산 위젯. 옵션 변경 시 debounced API 호출 후 가격 업데이트.

| Prop | 타입 | 설명 |
|------|------|------|
| unitPrice | number | 단가 |
| totalPrice | number | 합계 |
| quantity | number | 수량 |
| isCalculating | bool | 계산 중 상태 |
| discount | `{ rate, amount }?` | 수량 할인 정보 |

### Order 컴포넌트

#### OrderTrackerTimeline

주문 상태 추적 타임라인. 8단계 상태 진행 표시.

| Prop | 타입 | 설명 |
|------|------|------|
| currentStatus | string | 현재 상태 코드 (STAT_010~STAT_900) |
| statusHistory | `{ status, timestamp, label }[]` | 상태 변경 이력 |
| orientation | `'horizontal'\|'vertical'` | 방향 (모바일:vertical, 데스크톱:horizontal) |

**상태 코드**: STAT_010(접수) → STAT_020(파일확인) → STAT_030(파일승인) → STAT_040(제작대기) → STAT_050(제작중) → STAT_060(제작완료) → STAT_070(배송중) → STAT_080(배송완료)

#### CartItemCard

장바구니 상품 카드. 인쇄 옵션 요약 + 수량 변경 + 삭제.

| Prop | 타입 | 설명 |
|------|------|------|
| item | `{ productNo, name, options, quantity, price, imageUrl }` | 상품 정보 |
| onQuantityChange | `(qty) => void` | 수량 변경 |
| onRemove | function | 삭제 핸들러 |
| onOptionEdit | function | 옵션 수정 핸들러 |

#### CartSummary

장바구니 합계. 상품 금액, 배송비, 할인, 최종 결제 금액.

| Prop | 타입 | 설명 |
|------|------|------|
| subtotal | number | 상품 합계 |
| shippingFee | number | 배송비 |
| discount | number | 할인 금액 |
| total | number | 최종 결제 금액 |
| freeShippingThreshold | number | 무료배송 기준 (기본: 100,000원) |
| freeShippingRemaining | number | 무료배송까지 남은 금액 |

#### FilePreview

업로드된 파일 미리보기. PDF/AI/PSD 파일 썸네일 + 규격 정보.

| Prop | 타입 | 설명 |
|------|------|------|
| file | `{ name, size, type, url, thumbnail? }` | 파일 정보 |
| specs | `{ width, height, dpi, colorMode }` | 파일 규격 |
| status | `'pending'\|'valid'\|'invalid'` | 검증 상태 |
| onRemove | function | 삭제 핸들러 |

### File 컴포넌트

#### DropzoneUploader

드래그앤드롭 파일 업로드. 인쇄 파일 업로드에 사용.

| Prop | 타입 | 설명 |
|------|------|------|
| accept | string[] | 허용 파일 형식 (예: ['.pdf', '.ai', '.psd']) |
| maxSize | number | 최대 파일 크기 (bytes, 기본 50MB) |
| multiple | bool | 다중 업로드 여부 |
| onUpload | `(files) => void` | 업로드 핸들러 |
| onValidationError | `(errors) => void` | 유효성 에러 핸들러 |
| uploading | bool | 업로드 진행 중 |
| progress | number | 업로드 진행률 (0-100) |

#### FileValidationAlert

파일 검증 결과 알림. 규격 불일치, 크기 초과 등 경고 표시.

| Prop | 타입 | 설명 |
|------|------|------|
| errors | `{ type, message, severity }[]` | 검증 에러 목록 |
| onDismiss | function | 닫기 핸들러 |

### Auth 컴포넌트

#### LoginForm

로그인 폼. 이메일/비밀번호 + 자동로그인 + SNS 로그인.

| Prop | 타입 | 설명 |
|------|------|------|
| onSubmit | `({ email, password, keepSignedIn }) => void` | 제출 핸들러 |
| loading | bool | 로그인 진행 중 |
| error | string | 에러 메시지 |

#### SNSLoginButtons

SNS 로그인 버튼 그룹. 카카오, 네이버, Apple.

| Prop | 타입 | 설명 |
|------|------|------|
| providers | string[] | 활성화된 SNS 목록 |
| onSNSLogin | `(provider) => void` | SNS 로그인 핸들러 |

### Common 컴포넌트

#### StatusBadge

상태 표시 뱃지. 5가지 시맨틱 색상.

| Prop | 타입 | 설명 |
|------|------|------|
| status | `'info'\|'success'\|'warning'\|'error'\|'neutral'` | 상태 유형 |
| label | string | 표시 텍스트 |
| size | `'sm'\|'md'` | 크기 |

**색상 매핑**: info=--huni-bg-informative-solid, success=--huni-bg-positive-solid, warning=--huni-bg-warning-solid, error=--huni-bg-critical-solid

#### Pagination

페이지네이션. 디자인 시스템 molecules/Pagination 기반.

| Prop | 타입 | 설명 |
|------|------|------|
| totalCount | number | 전체 건수 |
| pageSize | number | 페이지당 건수 |
| currentPage | number | 현재 페이지 |
| onPageChange | `(page) => void` | 페이지 변경 |

---

## 2. 관리자 컴포넌트 카탈로그

> Desktop only (>=1024px) | Tailwind CSS + shadcn/ui

#### AdminLayout

관리자 전체 레이아웃. Sidebar + Content 2단 구조.

| Prop | 타입 | 설명 |
|------|------|------|
| children | node | Content 영역 |
| sidebarCollapsed | bool | 사이드바 접힘 상태 |

#### AdminSidebar

관리자 사이드 메뉴. 5개 메뉴 섹션.

메뉴 섹션: 대시보드, 주문관리 (주문목록/파일확인/상태변경/주문서출력), 상품관리 (인쇄상품/굿즈/마스터데이터), 회원관리 (회원/쿠폰/프린팅머니), 통계 (매출/주문/상품)

#### DataTable (shadcn/ui Table 기반)

데이터 테이블. 정렬, 검색, 페이지네이션, 일괄 선택.

| Prop | 타입 | 설명 |
|------|------|------|
| columns | `{ key, header, type, sortable, searchable, width }[]` | 컬럼 정의 |
| data | object[] | 테이블 데이터 |
| selectable | bool | 체크박스 선택 활성화 |
| selectedRows | string[] | 선택된 행 ID 목록 |
| onSelectionChange | `(ids) => void` | 선택 변경 핸들러 |
| onRowClick | `(row) => void` | 행 클릭 핸들러 |
| sortBy | string | 정렬 컬럼 |
| sortOrder | `'asc'\|'desc'` | 정렬 방향 |
| onSort | `(column, order) => void` | 정렬 변경 |
| pageSize | `30\|100` | 페이지당 건수 |

#### StatusTabBar

상태 탭 바. 탭별 건수 뱃지 표시.

| Prop | 타입 | 설명 |
|------|------|------|
| tabs | `{ key, label, count }[]` | 탭 목록 |
| activeTab | string | 활성 탭 key |
| onTabChange | `(key) => void` | 탭 변경 |

#### DetailDrawer (Sheet)

상세 정보 슬라이드 패널. 행 클릭 시 우측에서 슬라이드.

| Prop | 타입 | 설명 |
|------|------|------|
| open | bool | 열림 상태 |
| onClose | function | 닫기 핸들러 |
| title | string | 패널 제목 |
| children | node | 상세 콘텐츠 |
| width | string | 패널 너비 (기본: 'w-[480px]') |

#### BulkActionBar

일괄 액션 바. 선택된 행에 대한 일괄 작업.

| Prop | 타입 | 설명 |
|------|------|------|
| selectedCount | number | 선택 건수 |
| actions | `{ key, label, variant, onClick }[]` | 액션 버튼 목록 |
| onClearSelection | function | 선택 해제 |

#### StatCard

통계 카드. 숫자 + 변화율 표시.

| Prop | 타입 | 설명 |
|------|------|------|
| title | string | 지표명 |
| value | string/number | 값 |
| change | number | 변화율 (%) |
| icon | node | 아이콘 |

---

## 3. shopby API 엔드포인트 상세

### 상품 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | `/products` | 상품 목록 조회 | public |
| GET | `/products/{productNo}` | 상품 상세 조회 | public |
| GET | `/products/{productNo}/options` | 상품 옵션 조회 | public |
| GET | `/categories` | 카테고리 목록 | public |
| GET | `/display/sections` | 기획전/섹션 조회 | public |

**GET /products 주요 파라미터**: categoryNo, keyword, pageNumber, pageSize, order (POPULAR/RECENT/LOW_PRICE/HIGH_PRICE/REVIEW)

**응답 주요 필드**: items[].productNo, productName, salePrice, immediateDiscountAmt, imageUrls[], reviewRate, totalReviewCount

### 주문 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | `/profile/orders` | 주문 목록 조회 | member |
| GET | `/profile/orders/{orderNo}` | 주문 상세 조회 | member |
| POST | `/orders` | 주문 생성 | member |
| POST | `/cart` | 장바구니 추가 | member |
| GET | `/cart` | 장바구니 조회 | member |
| PUT | `/cart/{cartNo}` | 장바구니 수량 변경 | member |
| DELETE | `/cart/{cartNo}` | 장바구니 삭제 | member |
| POST | `/profile/orders/{orderNo}/claim/cancel` | 주문 취소 | member |

### 회원 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | `/auth/sign-in` | 로그인 | public |
| POST | `/auth/sign-up` | 회원가입 | public |
| GET | `/profile` | 내 정보 조회 | member |
| PUT | `/profile` | 내 정보 수정 | member |
| GET | `/profile/accumulations` | 적립금 내역 | member |
| GET | `/profile/coupons` | 쿠폰 목록 | member |
| GET | `/profile/likes` | 찜 목록 | member |

### 게시판 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | `/boards/{boardNo}/articles` | 게시글 목록 (공지, FAQ, Q&A) | public |
| GET | `/boards/{boardNo}/articles/{articleNo}` | 게시글 상세 | public |
| POST | `/boards/{boardNo}/articles` | 게시글 작성 (1:1문의) | member |
| GET | `/products/{productNo}/reviews` | 상품 리뷰 목록 | public |

### 쿠폰/적립금 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | `/coupons/{couponNo}/download` | 쿠폰 다운로드 | member |
| GET | `/profile/coupons/usable` | 사용 가능 쿠폰 | member |

### 커스텀 API (자체 백엔드)

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/print/calculate-price` | 인쇄 가격 계산 | public |
| POST | `/api/files/upload` | 인쇄 파일 업로드 | member |
| POST | `/api/files/validate` | 파일 규격 검증 | member |
| GET | `/api/admin/print-orders` | 관리자 주문 목록 | admin |
| GET | `/api/admin/print-orders/:id` | 관리자 주문 상세 | admin |
| PUT | `/api/admin/print-orders/:id/status` | 주문 상태 변경 | admin |
| POST | `/api/admin/print-orders/batch-status` | 일괄 상태 변경 | admin |
| GET | `/api/admin/statistics/sales` | 매출 통계 | admin |
| POST | `/api/admin/sms/send` | SMS 발송 | admin |

---

## 4. 디자인 토큰 매핑

> 소스: `src/design-system/tokens/` (SPEC-DS-009)

### 색상 시스템

| 토큰 (CSS Variable) | 값 | 용도 |
|---------------------|-----|------|
| `--huni-color-primary` | #5538B6 | 브랜드 기본 |
| `--huni-color-primary-dark` | #3B2573 | 브랜드 진한 (hover) |
| `--huni-color-primary-secondary` | #9580D9 | 브랜드 보조 |
| `--huni-color-primary-light-1` | #C9C2DF | 보조 밝은 1 |
| `--huni-color-primary-light-2` | #DED7F4 | 보조 밝은 2 |
| `--huni-color-primary-light-3` | #EEEBF9 | 보조 밝은 3 (배경) |
| `--huni-color-text-dark` | #424242 | 본문 텍스트 |
| `--huni-color-text-medium` | #565656 | 보조 텍스트 |
| `--huni-color-text-muted` | #979797 | 비활성 텍스트 |
| `--huni-color-border-default` | #CACACA | 기본 테두리 |
| `--huni-color-bg-section` | #F6F6F6 | 섹션 배경 |

**시맨틱 색상**:

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--huni-bg-critical-solid` | #EF4444 | 에러/삭제 |
| `--huni-bg-positive-solid` | #22C55E | 성공/완료 |
| `--huni-bg-warning-solid` | #EAB308 | 경고 |
| `--huni-bg-informative-solid` | #3B82F6 | 정보 |
| `--huni-color-accent-gold` | #E6B93F | 강조 골드 |
| `--huni-color-accent-teal` | #7AC8C4 | 강조 틸 |

### 타이포그래피

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--huni-typo-family` | 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif | 기본 폰트 |
| `--huni-typo-size-t1` | 11px | 캡션, 뱃지 |
| `--huni-typo-size-t2` | 12px | 보조 텍스트 |
| `--huni-typo-size-t3` | 13px | 소형 본문 |
| `--huni-typo-size-t4` | 14px | 기본 본문 |
| `--huni-typo-size-t5` | 16px | 강조 본문 |
| `--huni-typo-size-t6` | 18px | 소제목 |
| `--huni-typo-size-t7` | 20px | 제목 |
| `--huni-typo-size-t8` | 22px | 큰 제목 |
| `--huni-typo-size-t9` | 24px | 페이지 제목 |
| `--huni-typo-size-t10` | 26px | 히어로 제목 |

**굵기**: normal=400, medium=500, bold=700

### 간격 (Spacing)

4px 기반 스케일:

| 토큰 | 값 | Tailwind |
|------|-----|----------|
| `--huni-space-1` | 4px | `p-1` |
| `--huni-space-2` | 8px | `p-2` |
| `--huni-space-3` | 12px | `p-3` |
| `--huni-space-4` | 16px | `p-4` |
| `--huni-space-5` | 20px | `p-5` |
| `--huni-space-6` | 24px | `p-6` |
| `--huni-space-8` | 32px | `p-8` |
| `--huni-space-10` | 40px | `p-10` |
| `--huni-space-12` | 48px | `p-12` |
| `--huni-space-16` | 64px | `p-16` |

### 브레이크포인트

| 이름 | 너비 | Tailwind 접두사 | 용도 |
|------|------|----------------|------|
| sm | 640px | `sm:` | 소형 태블릿 |
| md | 768px | `md:` | 태블릿 |
| lg | 1024px | `lg:` | 데스크톱 시작, Admin 최소 |
| xl | 1280px | `xl:` | 넓은 데스크톱 |

---

## 5. 정책 > UI 컴포넌트 연결 매핑

> REQ-12 (SOFT) | 정책 결정이 UI 컴포넌트에 미치는 영향

### 배송 정책

| 정책 | 기본값 | 영향 컴포넌트 | Prop/설정 |
|------|--------|-------------|----------|
| 무료배송 기준 | 100,000원 | CartSummary | `freeShippingThreshold: 100000` |
| 기본 배송비 | 3,000원 | CartSummary | `shippingFee: 3000` |
| 배송 방법 | 택배 | OrderTrackerTimeline | 배송 추적 단계 표시 |

### 결제 정책

| 정책 | 기본값 | 영향 컴포넌트 | Prop/설정 |
|------|--------|-------------|----------|
| 동시 쿠폰 | 최대 3개 | PaymentMethodSelector | `maxCoupons: 3` |
| 후불결제 | 활성화 | PaymentMethodSelector | `deferredPaymentEnabled: true` |
| 최소 주문금액 | 10,000원 | CartSummary | `minOrderAmount: 10000` |

### 쿠폰 정책

| 정책 | 기본값 | 영향 컴포넌트 | Prop/설정 |
|------|--------|-------------|----------|
| 중복 할인 | 불가 | CouponSelector | `stackable: false` |
| 최대 할인율 | 30% | CouponSelector | `maxDiscountRate: 0.3` |

### 리뷰 정책

| 정책 | 기본값 | 영향 컴포넌트 | Prop/설정 |
|------|--------|-------------|----------|
| 노출 방식 | 즉시 노출 | ReviewCard | `moderationMode: 'post'` |
| 포토 리뷰 보상 | 프린팅머니 500원 | ReviewForm | `photoRewardAmount: 500` |

### 파일 검수 정책

| 정책 | 기본값 | 영향 컴포넌트 | Prop/설정 |
|------|--------|-------------|----------|
| 허용 파일 형식 | PDF, AI, PSD | DropzoneUploader | `accept: ['.pdf', '.ai', '.psd']` |
| 최대 파일 크기 | 50MB | DropzoneUploader | `maxSize: 52428800` |
| 최소 DPI | 300 | FilePreview | `minDpi: 300` |

### 회원등급 정책

| 정책 | 기본값 | 영향 컴포넌트 | Prop/설정 |
|------|--------|-------------|----------|
| 등급 체계 | 4단계 (일반/실버/골드/VIP) | GradeBadge | `grades: ['일반','실버','골드','VIP']` |
| VIP 할인율 | 5% | QuantityPricingTable | `memberDiscount` 행 표시 |

### 프린팅머니 정책

| 정책 | 기본값 | 영향 컴포넌트 | Prop/설정 |
|------|--------|-------------|----------|
| 적립률 | 주문 금액의 1% | CartSummary | `accumulationRate: 0.01` |
| 최소 사용금액 | 1,000원 | PaymentMethodSelector | `minAccumulationUse: 1000` |
