# 진입점 - @shopby/react-skin

## 애플리케이션 진입점

### 빌드 진입점

**파일**: `src/index.js`

Webpack entry 설정에서 가리키는 최초 실행 파일.

**초기화 순서**:
1. CSS 임포트 (@shopby/shared 스타일)
2. `renderApp()` 비동기 함수 실행
3. `initializeShopApi()` 호출 → `public/environment.json` 로드
4. clientId, profile, tc 획득
5. URL 파라미터 추출 (trackingKey, channelType)
   - 단, `/callback/auth-callback` 경로는 제외
6. `setPolyfill()` 폴리필 적용
7. `document.getElementById('app')`에 React 트리 마운트

**런타임 HTML 진입점**: `public/index.html` (id="app" 엘리먼트)

---

## 라우트 진입점 (전체 목록)

### 메인 레이아웃 포함 라우트 (`/` 기준)

모든 경로는 `IntroPageRoute > Layout` 래퍼 내에서 렌더링됨.

| 경로 | 컴포넌트 | 라우트 가드 | 설명 |
|-----|---------|-----------|------|
| `/` | Main | 없음 | 메인 홈 페이지 |
| `/products` | DisplayCategoryList | 없음 | 전시 카테고리 목록 |
| `/display/:sectionsId` | ProductSectionList | 없음 | 상품 섹션 목록 |
| `/product-detail` | ProductDetail | 없음 | 상품 상세 (5개 섹션) |
| `/cart` | Cart | 없음 | 장바구니 (NEW) |
| `/order/:orderSheetNo` | OrderSheet | 없음 | 주문서 작성 (NEW) |
| `/order/confirm` | OrderConfirm | 없음 | 주문 완료 |
| `/orders` | MyOrders | 없음 | 주문 목록 |
| `/orders/:orderNo` | OrderDetail | 없음 | 주문 상세 |
| `/claims` | MyClaims | 없음 | 클레임 목록 |
| `/claim/:orderOptionNo` | Claim | 없음 | 클레임 신청 |
| `/sign-in` | SignIn | 비로그인 전용 | 로그인 |
| `/sign-up` | SignUpMenu | 비로그인 전용 | 회원가입 선택 |
| `/sign-up/form` | SignUp | 비로그인 전용 | 회원가입 폼 |
| `/sign-up-confirm` | SignUpConfirm | 비로그인 전용 | 회원가입 완료 |
| `/find-id` | FindId | 비로그인 전용 | 아이디 찾기 |
| `/find-password` | FindPassword | 비로그인 전용 | 비밀번호 찾기 |
| `/change-password` | ChangePassword | 없음 | 비밀번호 변경 |
| `/adult-certification` | AdultCertification | 없음 | 성인 인증 |
| `/member-withdrawal` | MemberWithdrawal | 없음 | 회원 탈퇴 |
| `/member-only` | MemberOnly | 없음 | 회원 전용 안내 |
| `/member-modification` | MemberModification | 로그인 필수 | 회원 정보 수정 |
| `/my-page` | MyPage | 로그인 필수 | 마이페이지 |
| `/my-page/product-review` | MyPageProductReview | 로그인 필수 | 상품 리뷰 관리 |
| `/my-page/personal-inquiry` | MyPagePersonalInquiry | 로그인 필수 | 1:1 문의 목록 |
| `/my-page/personal-inquiry/:inquiryNo` | MyPagePersonalInquiryDetail | 로그인 필수 | 1:1 문의 상세 |
| `/my-page/product-inquiry` | MyPageProductInquiry | 로그인 필수 | 상품 문의 목록 |
| `/my-page/coupon` | MyPageCoupon | 로그인 필수 | 쿠폰 관리 |
| `/my-page/accumulation` | MyPageAccumulation | 로그인 필수 | 적립금 내역 |
| `/my-page/like` | MyPageLike | 로그인 필수 | 찜 목록 |
| `/my-page/shipping-address` | MyPageShippingAddress | 로그인 필수 | 배송지 관리 |
| `/notice` | Notice | 없음 | 공지사항 |
| `/customer-center` | CustomerCenter | 없음 | 고객센터 |
| `/faq` | FAQ | 없음 | 자주 묻는 질문 |
| `/event/:eventNoOrId` | Event | 없음 | 이벤트 상세 |
| `/callback/auth-callback` | OpenIdCallback | 없음 | OpenID 소셜 로그인 콜백 |
| `/pages/order/guest-order.html` | GuestOrder | 없음 | 비회원 주문 (레거시) |

### 독립 라우트 (Layout 없음)

| 경로 | 컴포넌트 | 설명 |
|-----|---------|------|
| `/design-popup` | DesignWindowPopup | 팝업 창 전용 렌더러 |
| `/order-specification/:orderNo` | OrderSpecification | 주문 명세서 (인쇄용) |
| `/simple-receipt/:orderNo` | SimpleReceipt | 간이 영수증 (인쇄용) |
| `/no-access` | NoAccess | 접근 불가 안내 |
| `/callback` | CallBack | OAuth 콜백 처리 |
| `/service-check` | ServiceCheck | 서비스 점검 안내 |
| `/expired-mall` | ExpiredMall | 만료된 쇼핑몰 안내 |
| `/not-found` | NotFound | 404 오류 페이지 |
| `*` | NotFoundRoute | 정의되지 않은 경로 처리 |

---

## 관리자 라우트 진입점

### 기본 관리자 페이지

| 경로 | 컴포넌트 | 설명 |
|-----|---------|------|
| `/admin/login` | AdminLogin | 관리자 로그인 |
| `/admin/dashboard` | AdminDashboard | 관리자 대시보드 |

### 관리자 기능별 라우트 (13개+)

**게시판 관리**:
- `/admin/board/list` → AdminBoardList
- `/admin/board/:boardNo` → AdminBoardDetail

**쿠폰 관리**:
- `/admin/coupon/list` → AdminCouponList
- `/admin/coupon/create` → AdminCouponCreate

**회원 관리**:
- `/admin/member/list` → AdminMemberList
- `/admin/member/:memberId` → AdminMemberDetail

**상품 관리**:
- `/admin/product/general` → AdminProductGeneral
- `/admin/product/master` → AdminProductMaster
- `/admin/product/:productNo` → AdminProductDetail

**회계/원장** (SPEC-SKIN-008):
- `/admin/accounting/account` → AdminAccount (거래처 통장)
- `/admin/accounting/ledger` → AdminLedger (원장)
- `/admin/accounting/receivable` → AdminReceivable (응수금)

**통계** (SPEC-SKIN-008):
- `/admin/statistics/product` → AdminProductStatistics
- `/admin/statistics/sales` → AdminSalesStatistics
- `/admin/statistics/settlement` → AdminSettlementStatistics
- `/admin/statistics/team` → AdminTeamStatistics

**거래처 관리** (SPEC-SKIN-008):
- `/admin/vendor/list` → AdminVendorList
- `/admin/vendor/:vendorId` → AdminVendorDetail
- `/admin/vendor/board` → AdminStoreBoard

---

## 라우트 가드 진입점

### MemberRoute 가드 흐름

```
사용자가 보호된 경로 접근
        │
        ▼
isSignedIn() 확인
        │
   ┌────┴────┐
   │ false   │ true
   ▼         ▼
/sign-in   페이지 렌더
리다이렉트  (state.from에 원래 경로 보존)
```

**보호된 경로**:
- `/my-page/*` (마이페이지 모든 경로)
- `/member-modification`
- `/orders` 관련 경로

### NotAccessLoggedInUserRouter 가드 흐름

```
로그인된 사용자가 회원가입/로그인 페이지 접근
        │
        ▼
isSignedIn() 확인
        │
   ┌────┴────┐
   │ true    │ false
   ▼         ▼
홈(/)       페이지 렌더
리다이렉트  (회원가입/로그인)
```

---

## 외부 이벤트 핸들러

### ShopbyExternalScript 연동 (App.jsx)

외부 JS 라이브러리 연동을 위한 이벤트 진입점:

**`ShopbyExternalScript.initialize()`**
- 트리거: 컴포넌트 마운트 시 (clientId, profile 설정 후)
- 목적: 외부 스크립트와 `sb` 전역 객체 등록

**`ShopbyExternalScript.setPageScriptType(pageScriptType)`**
- 트리거: 라우트(location) 변경 시마다
- 목적: 현재 페이지 타입을 외부 스크립트에 전달

**`ShopbyExternalScript.clearGlobalObjectSb()`**
- 트리거: 라우트 변경 시 이전 페이지 cleanup
- 목적: 페이지 이탈 시 `sb` 전역 객체 초기화

---

## 환경 설정 진입점

**파일**: `public/environment.json`

런타임에 fetch로 로드되는 환경 설정 파일. 빌드 시 포함되지 않아 배포 후에도 변경 가능.

**구조**:
```json
{
  "clientId": "쇼핑몰 클라이언트 ID",
  "profile": "alpha | real",
  "tc": {
    "use": true,
    "id": "넷퍼넬 ID"
  }
}
```

이 파일이 로드되기 전까지 애플리케이션이 초기화되지 않음.

---

## 페이지별 초기화 진입점

### 상품 상세 페이지 (ProductDetail)

**진입 경로**: `/product-detail?productNo=12345`

**초기화 순서**:
1. ProductDetailProvider 마운트 (Layout 내부)
2. productNo 쿼리 파라미터 추출
3. Shopby API: GET /products/{productNo} 호출
4. 상품 정보 로드 (이미지, 옵션, 가격, 리뷰)
5. ProductDetail 페이지 렌더링

**핵심 구성요소**:
- ProductSummary.jsx - 상품 요약 정보
- 5개 섹션 (Summary, Content, Purchase, Review, Inquiry)
- usePrintOptions / usePrintOptionsV2 훅

### 장바구니 페이지 (Cart) - NEW

**진입 경로**: `/cart`

**초기화 순서**:
1. Cart 페이지 마운트
2. CartProvider 상태 구독
3. 장바구니 상품 목록 로드
4. 사용자 상호작용 처리 (수량 변경, 제거)

### 주문서 페이지 (OrderSheet) - NEW

**진입 경로**: `/order/:orderSheetNo`

**초기화 순서**:
1. OrderSheet 페이지 마운트
2. orderSheetNo 파라미터 추출
3. Shopby API: GET /order-sheets/{orderSheetNo} 호출
4. 주문자 정보, 배송지, 결제 수단 로드
5. OrderSheet 페이지 렌더링

### 마이페이지 (MyPage)

**진입 경로**: `/my-page`

**초기화 순서**:
1. MemberRoute 가드 확인
   - 비로그인: /sign-in으로 리다이렉트 (state.from 보존)
   - 로그인됨: 계속 진행
2. useAuthStateContext() 구독
3. 회원 프로필 정보 로드 (등급, 포인트)
4. MyPage 페이지 렌더링

---

## 관리자 페이지 초기화 진입점

### 관리자 로그인 (AdminLogin)

**진입 경로**: `/admin/login`

**초기화 순서**:
1. AdminLogin 페이지 마운트
2. 로그인 폼 렌더링
3. 로그인 성공 → 관리자 토큰 저장
4. AdminDashboard로 네비게이션

### 관리자 대시보드 (AdminDashboard)

**진입 경로**: `/admin/dashboard`

**초기화 순서**:
1. AdminLayout 마운트
2. useAdminAuth 훅으로 인증 확인
3. AdminSidebar 네비게이션 렌더링
4. 대시보드 데이터 로드 (통계, 요약 정보)

### 관리자 기능별 페이지

**공통 초기화 순서** (모든 관리자 페이지):
1. AdminLayout 래퍼 내 렌더링
2. useAdminAuth 인증 확인
3. 해당 Admin Service 모듈 호출
   - services/admin/product.js
   - services/admin/orders.js
   - services/admin/member.js
   - services/admin/accounting.js (SPEC-SKIN-008)
   - services/admin/statistics.js (SPEC-SKIN-008)
   - services/admin/vendor.js (SPEC-SKIN-008)
   - 등등
4. 데이터 로드 및 테이블/목록 렌더링

---

## 커스텀 훅 진입점

### usePrintOptions / usePrintOptionsV2

**호출 위치**: ProductDetail, OrderSheet 페이지

**초기화**:
```javascript
const printOptions = usePrintOptions();
// 또는
const printOptionsV2 = usePrintOptionsV2();
```

**역할**:
- 인쇄 옵션 데이터 로드
- 가격 계산
- 파일 업로드 처리

### useResponsive

**호출 위치**: 레이아웃 및 반응형 컴포넌트

**역할**:
- 미디어 쿼리 감지
- 모바일/PC 레이아웃 전환

### useSyncTokenExpiryWithLocation

**호출 위치**: Layout.jsx

**역할**:
- 라우트 변경 시 토큰 만료 시간 갱신
- 세션 유지

---

## 서비스 레이어 진입점

### 14개 Admin Service 모듈

**호출 위치**: 각 관리자 페이지

**진입점**:
```javascript
import { getProducts, createProduct } from 'src/services/admin/product.js';
import { getOrders, updateOrderStatus } from 'src/services/admin/orders.js';
// 등등
```

**역할**:
- API 요청 추상화
- 비즈니스 로직 캡슐화
- 데이터 변환

---

## 디자인 시스템 진입점

**진입점**: `src/design-system/index.js` (배럴 export)

**호출 패턴**:
```javascript
import { Badge, Button, Dialog } from 'src/design-system';
// 또는
import Badge from 'src/design-system/components/atoms/Badge';
```

---

## UI 컴포넌트 라이브러리 진입점 (NEW)

**진입점**: `src/components/ui/index.js` (배럴 export)

**호출 패턴**:
```javascript
import { Button, Card, Dialog, Input } from 'src/components/ui';
```

---

## 타입 정의 진입점 (NEW)

**진입점**: `src/types/print-options.js`

**호출 패턴**:
```javascript
import { PrintOption, PrintOptions } from 'src/types/print-options';
```
