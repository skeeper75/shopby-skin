# 진입점 - @shopby/react-skin (Aurora Skin)

> 생성일: 2026-03-14

---

## 애플리케이션 진입점

### 빌드 진입점

**파일**: `src/index.js`

Webpack의 `entry` 설정에서 가리키는 최초 실행 파일. 브라우저에서 번들 JS가 로드될 때 실행됩니다.

**초기화 순서**:
1. 공통 스타일 CSS 임포트 (`@shopby/shared/styles/*`, `./assets/style.css`)
2. `renderApp()` 비동기 함수 실행
3. `initializeShopApi()` → `public/environment.json` 로드 → clientId, profile, tc 획득
4. URL 파라미터에서 `trackingKey`, `channelType` 추출 및 설정 (단, `/callback/auth-callback` 경로 제외)
5. `setPolyfill()` 브라우저 호환성 폴리필 적용
6. `document.getElementById('app')`에 React 트리 마운트

**런타임 HTML 진입점**: `public/index.html` (id="app" 엘리먼트)

---

## 라우트 진입점 (전체 목록)

### 메인 레이아웃 포함 라우트 (`/` 기준)

아래 모든 경로는 `IntroPageRoute > Layout` 래퍼 내에서 렌더링됩니다.

| 경로 | 컴포넌트 | 라우트 가드 | 설명 |
|---|---|---|---|
| `/` | `Main` | 없음 | 메인 홈 페이지 |
| `/products` | `DisplayCategoryList` | 없음 | 전시 카테고리 상품 목록 |
| `/display/:sectionsId` | `ProductSectionList` | 없음 | 상품 섹션 목록 |
| `/product-detail` | `ProductDetail` | 없음 | 상품 상세 |
| `/cart` | `Cart` | 없음 | 장바구니 |
| `/order/:orderSheetNo` | `OrderSheet` | 없음 | 주문서 작성 |
| `/order/confirm` | `OrderConfirm` | 없음 | 주문 완료 |
| `/orders` | `MyOrders` | 없음 | 주문 목록 |
| `/orders/:orderNo` | `OrderDetail` | 없음 | 주문 상세 |
| `/claims` | `MyClaims` | 없음 | 클레임 목록 |
| `/claim/:orderOptionNo` | `Claim` | 없음 | 클레임 신청 |
| `/sign-in` | `SignIn` | 비로그인 전용 | 로그인 페이지 |
| `/sign-up` | `SignUpMenu` | 비로그인 전용 | 회원가입 선택 |
| `/sign-up/form` | `SignUp` | 비로그인 전용 | 회원가입 폼 |
| `/sign-up-confirm` | `SignUpConfirm` | 비로그인 전용 | 회원가입 완료 확인 |
| `/find-id` | `FindId` | 비로그인 전용 | 아이디 찾기 |
| `/find-password` | `FindPassword` | 비로그인 전용 | 비밀번호 찾기 |
| `/change-password` | `ChangePassword` | 없음 | 비밀번호 변경 |
| `/adult-certification` | `AdultCertification` | 없음 | 성인 인증 |
| `/member-withdrawal` | `MemberWithdrawal` | 없음 | 회원 탈퇴 |
| `/member-only` | `MemberOnly` | 없음 | 회원 전용 안내 |
| `/member-modification` | `MemberModification` | 로그인 필수 | 회원 정보 수정 |
| `/my-page` | `MyPage` | 로그인 필수 | 마이페이지 |
| `/my-page/product-review` | `MyPageProductReview` | 로그인 필수 | 상품 리뷰 관리 |
| `/my-page/personal-inquiry` | `MyPagePersonalInquiry` | 로그인 필수 | 1:1 문의 목록 |
| `/my-page/personal-inquiry/:inquiryNo` | `MyPagePersonalInquiryDetail` | 로그인 필수 | 1:1 문의 상세 |
| `/my-page/product-inquiry` | `MyPageProductInquiry` | 로그인 필수 | 상품 문의 목록 |
| `/my-page/coupon` | `MyPageCoupon` | 로그인 필수 | 쿠폰 관리 |
| `/my-page/accumulation` | `MyPageAccumulation` | 로그인 필수 | 적립금 내역 |
| `/my-page/like` | `MyPageLike` | 로그인 필수 | 찜 목록 |
| `/my-page/shipping-address` | `MyPageShippingAddress` | 로그인 필수 | 배송지 관리 |
| `/notice` | `Notice` | 없음 | 공지사항 |
| `/customer-center` | `CustomerCenter` | 없음 | 고객센터 |
| `/faq` | `FAQ` | 없음 | 자주 묻는 질문 |
| `/event/:eventNoOrId` | `Event` | 없음 | 이벤트 상세 |
| `/callback/auth-callback` | `OpenIdCallback` | 없음 | OpenID 소셜 로그인 콜백 |
| `/pages/order/guest-order.html` | `GuestOrder` | 없음 | 비회원 주문 (레거시 경로) |

### 독립 라우트 (Layout 없음)

| 경로 | 컴포넌트 | 설명 |
|---|---|---|
| `/design-popup` | `DesignWindowPopup` | 팝업 창 전용 렌더러 |
| `/order-specification/:orderNo` | `OrderSpecification` | 주문 명세서 (인쇄용) |
| `/simple-receipt/:orderNo` | `SimpleReceipt` | 간이 영수증 (인쇄용) |
| `/no-access` | `NoAccess` | 접근 불가 안내 |
| `/callback` | `CallBack` | OAuth 콜백 처리 |
| `/service-check` | `ServiceCheck` | 서비스 점검 안내 |
| `/expired-mall` | `ExpiredMall` | 만료된 쇼핑몰 안내 |
| `/not-found` | `NotFound` | 404 오류 페이지 |
| `*` | `NotFoundRoute` | 정의되지 않은 경로 처리 |

---

## 외부 이벤트 핸들러

### ShopbyExternalScript 연동 (App.jsx)

외부 JS 라이브러리 `ShopbyExternalScript` (전역 객체)를 통한 이벤트 진입점:

**`ShopbyExternalScript.initialize()`**
- 트리거: clientId와 profile이 설정된 이후 (컴포넌트 마운트 시)
- 목적: 외부 스크립트와 `sb` 전역 객체 등록

**`ShopbyExternalScript.setPageScriptType(pageScriptType)`**
- 트리거: 라우트(location) 변경 시마다
- 목적: 현재 페이지 타입을 외부 스크립트에 전달

**`ShopbyExternalScript.clearGlobalObjectSb()`**
- 트리거: 라우트 변경 시 이전 페이지 cleanup (useEffect 반환 함수)
- 목적: 페이지 이탈 시 `sb` 전역 객체 초기화

---

## 라우트 가드 진입점

### MemberRoute 가드 흐름

```
사용자가 보호된 경로 접근
        │
        ▼
isSignedIn() 확인 (@shopby/shared)
        │
   ┌────┴────┐
   │ false   │ true
   ▼         ▼
/sign-in   페이지 렌더
리다이렉트  (children 또는 Outlet)
(state.from
 에 원래 경로 보존)
```

### 인증 완료 후 리다이렉트 흐름 (SignIn 페이지)

SignIn 페이지는 `location.state.from` 값을 확인하여 로그인 성공 후 원래 페이지로 복귀합니다.

---

## 환경 설정 진입점

**파일**: `public/environment.json`

런타임에 fetch로 로드되는 환경 설정 파일. 빌드 시 포함되지 않아 배포 후에도 변경 가능합니다.

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

이 파일이 로드되기 전까지 애플리케이션이 초기화되지 않습니다 (`renderApp()`이 awaiting 상태).
