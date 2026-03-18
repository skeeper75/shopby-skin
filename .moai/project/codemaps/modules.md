# 모듈 설명 - @shopby/react-skin

## 진입점 모듈

### `src/index.js` - 애플리케이션 부트스트랩

**책임**: 환경 초기화, API 설정, React DOM 마운트

**초기화 순서**:
1. CSS 임포트 (@shopby/shared 스타일)
2. `renderApp()` 비동기 함수 실행
3. `initializeShopApi()` 호출 → `public/environment.json` 로드
4. clientId, profile, tc 획득
5. URL 파라미터 파싱 (trackingKey, channelType)
6. `setPolyfill()` 폴리필 적용
7. React DOM `createRoot`로 마운트

**공개 인터페이스**: 없음 (사이드 이펙트 전용)

---

### `src/App.jsx` - 루트 컴포넌트

**책임**: 전역 Provider 체인 구성, 외부 스크립트 초기화

**Props**:
- `clientId` (string, 필수) - 쇼핑몰 ID
- `profile` (string, 필수) - 환경 프로파일 ('alpha' | 'real')
- `tc` (object, 선택) - 넷퍼넬 설정

**Provider 체인** (마운트 순서):
1. ShopbyExternalScript.initialize()
2. MallProvider (쇼핑몰 기본 정보)
3. AuthProvider (인증 상태)
4. ModalProvider (모달 전역 관리)
5. TermsProvider (약관 데이터)
6. DesignPopupProvider (디자인 팝업)
7. EventProviderV2 (이벤트 처리)
8. BrowserRouter (React Router)

---

## 라우터 모듈 (`src/router/`)

### `index.js` - 라우트 정의

**책임**: 60+ 라우트 선언적 정의

**패턴**: `useRoutes()` 훅 기반, 모든 페이지 `React.lazy()` 지연 로드

**라우트 분류**:
- **Layout 포함** (`/` 하위): IntroPageRoute > Layout 래퍼
- **독립 라우트**: DesignPopup, OrderSpecification, SimpleReceipt, 404 등

### `MemberRoute.jsx` - 인증 필수 가드

**책임**: 비로그인 사용자의 보호된 페이지 접근 차단

**동작**: `isSignedIn()` 확인 → 비로그인 시 `/sign-in` 리다이렉트 (state.from 보존)

**라우트 예시**:
- `/my-page/*` (마이페이지 모든 경로)
- `/member-modification`
- `/orders/:orderNo`

### `NotAccessLoggedInUserRouter.jsx` - 비로그인 전용 가드

**책임**: 로그인된 사용자의 회원가입/로그인 페이지 차단

**라우트**: `/sign-in`, `/sign-up`

### `IntroPageRoute.jsx` - 인트로 페이지

**책임**: 인트로 화면 표시 조건 처리

---

## 컴포넌트 모듈 (`src/components/`)

총 93개 디렉토리, 각각 `index.js` + `ComponentName.jsx` 패턴

### 새로 추가된 컴포넌트

#### `components/product/` (NEW)
상품 구성/주문 관련:
- **PrintConfigurator**: 인쇄 커스터마이징 UI
- **HuniPriceCalculator**: 후니 가격 계산기
- **OptionActions**: 옵션 작업 버튼 그룹
- **PrintFileUpload**: 인쇄 파일 업로드

#### `components/ui/` (NEW - Shadcn/ui)
재사용 가능한 UI 프리미티브 (barrel export via index.js):
- **Button**: 기본 버튼
- **Card**: 카드 컨테이너
- **Input**: 입력 필드
- **Dialog**: 모달
- **Checkbox**: 체크박스
- **Radio**: 라디오 버튼
- **Tabs**: 탭 네비게이션
- **Snackbar**: 토스트 알림

### 레이아웃 관련 컴포넌트

| 컴포넌트 | 책임 |
|---------|------|
| Layout | 전체 페이지 레이아웃 (헤더/메인/푸터), Provider 초기화 |
| LayoutProvider | 레이아웃 상태 관리 (하단 네비 표시 여부 등) |
| Header | 상단 헤더 (로고, 검색, 장바구니) |
| Footer | 하단 푸터 |
| Nav | 메인 네비게이션 메뉴 |
| BottomNav | 모바일 하단 네비게이션 바 |
| CategoryNav | 카테고리 네비게이션 |
| SkeletonLayout | 로딩 스켈레톤 |

### 관리자 관련 컴포넌트 (확장)

**AdminLayout & Structure**:
- `AdminLayout` - 관리자 페이지 레이아웃
- `AdminSidebar` - 사이드바 네비게이션
- `DataTable` - 데이터 테이블
- `DatePicker` - 날짜 선택
- `SearchBar` - 검색 바

**Admin Subdirectories**:
- `components/admin/board/` - 게시판 관리
- `components/admin/coupon/` - 쿠폰 관리
- `components/admin/member/` - 회원 관리
- `components/admin/product/` - 상품 관리
- `components/admin/accounting/` - 회계/원장
- `components/admin/statistics/` - 통계
- `components/admin/vendor/` - 거래처 관리

---

## 페이지 모듈 (`src/pages/`)

총 45개 고객 페이지 + 13개+ 관리자 페이지

### 새로 추가된 페이지

#### `pages/ProductDetail/` (확장)
- **index.jsx**: 메인 페이지
- **ProductSummary.jsx**: 상품 요약 섹션 (NEW)

**5개 주요 섹션**:
1. Summary - 상품 정보 요약
2. Content - 상품 상세 콘텐츠
3. Purchase - 구매 옵션
4. Review - 리뷰 영역
5. Inquiry - 문의 영역

#### `pages/Cart/` (NEW)
- **index.jsx**: 장바구니 페이지
- 상품 목록, 수량 조정, 결제 정보 표시

#### `pages/OrderSheet/` (NEW)
- **index.jsx**: 주문서 작성 페이지
- 배송 정보, 결제 수단 선택, 주문 완료

### 고객 페이지 분류

**인증** (6개):
- SignIn, SignUp, SignUpConfirm, FindId, FindPassword, ChangePassword

**쇼핑** (8개):
- ProductDetail, Cart, OrderSheet, OrderConfirm, OrderDetail, Claim

**마이페이지** (12개):
- MyPage, ProductReview, PersonalInquiry, ProductInquiry, Coupon, Accumulation, Like, ShippingAddress

**고객센터** (5개):
- CustomerCenter, FAQ, Notice, Event, Board

**정보** (6개):
- Terms, About, Guide, WorkGuide, MemberWithdrawal

**특수** (2개):
- NoAccess, ServiceCheck, ExpiredMall, NotFound

### 관리자 페이지 (13개+)

**기본**:
- AdminLogin, AdminDashboard

**기능별 (subdirectories)**:
- `pages/admin/board/` - 게시판 관리
- `pages/admin/coupon/` - 쿠폰 관리
- `pages/admin/member/` - 회원 관리
- `pages/admin/product/` - 상품 (General/Master)
- `pages/admin/accounting/` - Account/Ledger/Receivable
- `pages/admin/statistics/` - Product/Sales/Settlement/Team
- `pages/admin/vendor/` - List/Detail/StoreBoard

---

## 커스텀 훅 모듈 (`src/hooks/`)

| 훅 | 책임 |
|----|------|
| `useSearchKeyword` | 검색 키워드 상태 관리, 최근 검색어 저장 |
| `useChangePassword` | 비밀번호 변경 로직 (유효성 검사 포함) |
| `useLayoutChanger` | 레이아웃 동적 변경 |
| `useDragAndDrop` | 드래그 앤 드롭 인터랙션 |
| `useSyncTokenExpiryWithLocation` | 라우트 변경 시 토큰 만료 시간 갱신 |
| `usePrintOptions` | 인쇄 옵션 관리 (레거시) |
| `usePrintOptionsV2` | 인쇄 옵션 관리 (개선) - NEW |
| `useResponsive` | 반응형 미디어 쿼리 |
| `useAdminAuth` | 관리자 인증 상태 관리 |

---

## 서비스 레이어 모듈 (`src/services/admin/`)

14개 비즈니스 로직 모듈 - 각각 API 호출 추상화

| 서비스 | 책임 | 주요 함수 |
|--------|------|----------|
| `auth.js` | 관리자 인증 | loginAdmin, logoutAdmin, validateToken |
| `product.js` | 상품 관리 | getProducts, getProduct, createProduct, updateProduct |
| `orders.js` | 주문 관리 | getOrders, getOrder, updateOrderStatus |
| `member.js` | 회원 정보 | getMember, getMemberDetail |
| `members.js` | 회원 목록 | getMembers, searchMembers |
| `accounting.js` | 회계/원장 | getAccounts, getLedgers, getReceivables |
| `statistics.js` | 통계 데이터 | getProductStats, getSalesStats, getSettlementStats |
| `vendor.js` | 거래처 관리 | getVendors, getVendor, updateVendor |
| `board.js` | 게시판 관리 | getBoards, createBoard, deleteBoard |
| `coupon.js` | 쿠폰 관리 | getCoupons, createCoupon, updateCoupon |
| `printPrice.js` | 인쇄 가격 | calculatePrice, getPriceTable |
| `printOptions.js` | 인쇄 옵션 | getOptions, getOptionsByProduct |
| `inventory.js` | 인벤토리 | getInventory, updateInventory |
| `settlement.js` | 정산 관리 | getSettlements, updateSettlement |

---

## API 계층 모듈 (`src/api/`)

### `api.js` - HTTP 클라이언트

**책임**: Shopby Shop API 호출 추상화

**공개 함수**:
- `initializeShopApi({ platform? })` - API SDK 초기화
- `fetchHttpRequest({ url, baseURL?, method?, query?, requestBody?, headers? })` - 범용 HTTP 요청

**내부 처리**:
- JWT 액세스 토큰 자동 헤더 첨부
- 401 응답 시 토큰 갱신 후 재요청
- FormData 감지 및 스토리지 API 전환
- KCP 결제 응답은 text()로 파싱

### `printPrice.js` - 인쇄 가격 API

**책임**: 인쇄 옵션별 가격 계산

### `custom/` - 커스텀 API

프로젝트 특화 API 호출 모음

---

## 유틸리티 모듈 (`src/utils/`)

### 핵심 유틸

| 파일 | 책임 |
|------|------|
| `api.js` | HTTP 클라이언트 |
| `excelExport.js` | Excel 내보내기 |
| `dateFormat.js` | 날짜 포맷팅 |
| `validation.js` | 폼 유효성 검사 |
| `storage.js` | localStorage 관리 |
| `formatter.js` | 숫자, 통화 포맷팅 |

---

## 타입 정의 모듈 (`src/types/`)

### `print-options.js` (NEW)

**책임**: 인쇄 옵션 타입 정의

**주요 타입**:
- PrintOption - 개별 옵션
- PrintOptions - 전체 옵션 집합
- PrintPriceDetails - 가격 상세 정보

---

## 상수 모듈 (`src/constants/`)

공통 상수 정의. `@shopby/shared`와 연계하여 사용.

### 주요 상수
- API 엔드포인트
- 에러 메시지
- 상수값 매핑

---

## 디자인 시스템 모듈 (`src/design-system/`)

### 컴포넌트 구성

**Atoms (8개)**:
- BadgeLabel, InfoTooltip, ColorChip, Divider
- Icon, Skeleton, Checkbox, RadioGroup, Switch, Chip

**Molecules (9개)**:
- OptionLabel, SizeOptionChip, RadioOption
- DropdownSelect, CounterOption, SizeInput
- QuantityInput, CTAButton, Field, TextField
- Tabs, Pagination

**Organisms (6개)**:
- CollapsibleSection, PriceSummary, Dialog
- Snackbar, SnackbarProvider/useSnackbar

**Utilities (3개)**:
- `cn()` - 클래스 병합 유틸리티
- `createSlotRecipeContext()` - 슬롯 레시피 컨텍스트
- `useFocusVisible()` - 포커스 가시성 훅

### 토큰 및 스타일

**tokens/**:
- typography.css - 타이포그래피 정의
- spacing.css - 간격 토큰
- colors.css - 색상 팔레트

**utils/index.js** (@MX:ANCHOR):
- 13개 이상의 컴포넌트에서 임포트
- 클래스 병합, 포커스 링 관리

---

## 라이브러리 의존성

### @shopby/react-components
**진입점**: App.jsx, Layout.jsx에서 직접 임포트

**Provider 체인** (10+):
- AuthProvider, MallProvider, ModalProvider
- CartProvider, ProductDetailProvider, BannerProvider
- OrderConfigProvider, BoardConfigurationProvider
- TermsProvider, DesignPopupProvider

**Context Hooks** (사용 패턴):
```javascript
const { profile } = useAuthStateContext();
const { addToCart } = useCartActionContext();
```

### @shopby/shared
**임포트**: 유틸, 상수, 스타일

**핵심 함수**:
- `apiCreator()` - API SDK 초기화
- `memberAuth` - 토큰 관리
- `isSignedIn()` - 로그인 상태 확인

---

## 다음 단계

자세한 정보:
- **entry-points.md**: 각 모듈의 진입 경로
- **data-flow.md**: 모듈 간 데이터 흐름
- **dependencies.md**: 모듈 간 의존성 그래프
