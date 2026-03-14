# 모듈 설명 - @shopby/react-skin (Aurora Skin)

> 생성일: 2026-03-14

---

## 진입점 모듈

### `src/index.js` - 애플리케이션 부트스트랩

**책임**: DOM 마운트, API 초기화, 전역 설정

**주요 동작 순서**:
1. `initializeShopApi()` 호출 → `public/environment.json`에서 clientId, profile, tc 로드
2. 추적 키(trackingKey), 채널 타입(channelType) URL 파라미터 설정
3. `setPolyfill()` 폴리필 적용
4. React DOM `createRoot`로 `<BrowserRouter>`와 `<App>` 마운트

**공개 인터페이스**: 없음 (사이드 이펙트 전용 파일)

---

### `src/App.jsx` - 루트 컴포넌트

**책임**: 전역 Provider 체인 구성, 외부 스크립트 초기화

**Props**:
- `clientId` (string, 필수) - 쇼핑몰 클라이언트 ID
- `profile` (string, 필수) - 환경 프로파일 ('alpha' | 'real')
- `tc` (shape, 선택) - 넷퍼넬 설정 (`{ use: bool, id: string }`)

**내부 컴포넌트**: `MarketingPrivacyAgreeNotification` - 마케팅 정보 수신 동의 알림 처리

---

## 라우터 모듈 (`src/router/`)

### `index.js` - 라우트 정의

**책임**: 전체 페이지 라우트 매핑, 코드 스플리팅 설정

**패턴**: `useRoutes()` 훅으로 선언적 라우트 구성. 모든 페이지/컴포넌트는 `React.lazy()`로 지연 로드.

**라우트 분류**:
- 레이아웃 포함 라우트 (`/` 하위): 헤더/푸터가 있는 일반 페이지
- 독립 라우트: `design-popup`, `order-specification/:orderNo`, `simple-receipt/:orderNo`, `no-access`, `callback`, `service-check`, `expired-mall`, `not-found`

### `MemberRoute.jsx` - 인증 필수 라우트 가드

**책임**: 비로그인 사용자의 보호된 페이지 접근 차단

**동작**: `isSignedIn()` 확인 → 비로그인 시 `/sign-in`으로 리다이렉트 (원래 경로를 `state.from`에 보존)

**사용 방식**: 두 가지 패턴 지원
1. Outlet 방식 (my-page 등 중첩 라우트)
2. children 래퍼 방식

### `NotAccessLoggedInUserRouter.jsx` - 비로그인 전용 가드

**책임**: 이미 로그인된 사용자의 회원가입/로그인 페이지 접근 차단

### `IntroPageRoute.jsx` - 인트로 페이지 라우트

**책임**: 인트로 화면 표시 조건 처리

---

## 컴포넌트 모듈 (`src/components/`)

총 73개 디렉토리. 각 디렉토리는 `index.js` + `ComponentName.jsx` 패턴으로 구성.

### 레이아웃 관련 컴포넌트

| 컴포넌트 | 책임 |
|---|---|
| `Layout` | 전체 페이지 레이아웃 (헤더/메인/푸터), 내부 Provider 초기화 |
| `LayoutProvider` | 레이아웃 상태 관리 (하단 내비게이션 표시 여부 등) |
| `Header` | 상단 헤더 (로고, 검색, 장바구니 아이콘) |
| `Footer` | 하단 푸터 |
| `Nav` | 메인 내비게이션 메뉴 |
| `BottomNav` | 모바일 하단 내비게이션 바 |
| `CategoryNav` | 카테고리 내비게이션 |
| `Meta` | SEO용 메타태그 관리 |
| `SkeletonLayout` | 로딩 스켈레톤 레이아웃 |

### 상품 관련 컴포넌트

| 컴포넌트 | 책임 |
|---|---|
| `ProductThumbItem` | 상품 썸네일 카드 |
| `ProductThumbInfo` | 상품 썸네일 정보 표시 |
| `ProductThumbBadge` | 상품 배지 (신상품, 할인 등) |
| `ProductInquiryForm` | 상품 문의 작성 폼 |
| `ProductInquiryList` | 상품 문의 목록 |
| `ProductReviewList` | 상품 리뷰 목록 |
| `ReviewForm` | 리뷰 작성 폼 |
| `ReviewAccumulation` | 리뷰 적립금 안내 |
| `PriceTag` | 가격 표시 컴포넌트 |
| `OptionLabel` | 상품 옵션 레이블 |
| `RestockNotificationForm` | 재입고 알림 신청 폼 |
| `RestockNotificationModal` | 재입고 알림 모달 |

### 주문/결제 관련 컴포넌트

| 컴포넌트 | 책임 |
|---|---|
| `OrderSpecification` | 주문 명세서 |
| `SimpleReceipt` | 간이 영수증 |
| `OrderDetailOrdererInfo` | 주문자 정보 표시 |
| `OrderDetailAddressInfo` | 배송지 정보 표시 |
| `OrderDetailPaymentInfo` | 결제 정보 표시 |
| `OrderNoLabel` | 주문 번호 레이블 |
| `CashReceiptForm` | 현금영수증 신청 폼 |
| `CashReceiptFormModal` | 현금영수증 모달 |
| `CashReceiptInfo` | 현금영수증 정보 표시 |

### 회원/인증 관련 컴포넌트

| 컴포넌트 | 책임 |
|---|---|
| `CheckMemberPassword` | 회원 비밀번호 확인 |
| `PasswordChanger` | 비밀번호 변경 UI |
| `AppCardAuthenticate` | 앱 카드 인증 |
| `IdentificationVerificationBtn` | 본인인증 버튼 |
| `MarketingReceiveAgreement` | 마케팅 수신 동의 |

### 게시판/컨텐츠 관련 컴포넌트

| 컴포넌트 | 책임 |
|---|---|
| `Board` | 게시판 목록 |
| `BoardNoticeList` | 공지사항 목록 |
| `BoardProductItem` | 게시판 상품 아이템 |
| `FAQList` | FAQ 목록 |
| `ReportForm` | 신고 폼 |
| `CustomBanner` | 커스텀 배너 |
| `AdminBanner` | 어드민 배너 |
| `CustomSlider` | 커스텀 슬라이더 |

### 공통 UI 컴포넌트

| 컴포넌트 | 책임 |
|---|---|
| `ErrorBoundary` | React 에러 경계 |
| `FullModal` | 전체 화면 모달 |
| `TitleModal` | 제목이 있는 모달 |
| `GoToList` | 목록으로 돌아가기 버튼 |
| `BackButton` | 뒤로가기 버튼 |
| `SearchKeyword` | 검색 키워드 입력 |
| `Timer` | 타이머 컴포넌트 |
| `InfoList` | 정보 목록 |
| `ListSkeleton` | 목록 스켈레톤 |
| `GallerySkeleton` | 갤러리 스켈레톤 |
| `Sanitized` | XSS 방지 HTML 렌더링 |
| `TotalCountAndSort` | 총 개수 및 정렬 UI |

### 폼 관련 컴포넌트

| 컴포넌트 | 책임 |
|---|---|
| `AddressForm` | 주소 입력 폼 |
| `ShippingAddressForm` | 배송지 입력 폼 |
| `SearchZipCodeForm` | 우편번호 검색 폼 |
| `FileUpload` | 파일 업로드 |
| `ImageFileUpload` | 이미지 파일 업로드 |
| `ImageFileUploader` | 이미지 업로더 UI |
| `StartYmdSelector` | 시작일 선택 |

### 기타 컴포넌트

| 컴포넌트 | 책임 |
|---|---|
| `Netfunnel` | 넷퍼넬 트래픽 제어 래퍼 |
| `DesignPopup` | 디자인 팝업 |
| `DesignPopup/DesignWindowPopup` | 팝업 창 전용 렌더러 |
| `CurrencyWrap` | 통화 처리 래퍼 |
| `TermsContent` | 약관 콘텐츠 |
| `TermsDetail` | 약관 상세 |
| `OpenIdSignIn` | OpenID 소셜 로그인 |
| `ProductSectionListRouter` | 상품 섹션 목록 라우터 |
| `GalleryListPage` | 갤러리 형태 목록 페이지 |
| `FoldingImagesByOnRow` | 1행 이미지 접기 |
| `CustomTerms` | 커스텀 약관 |

---

## 페이지 모듈 (`src/pages/`)

총 34개 디렉토리.

### 메인/탐색 페이지

| 페이지 | 경로 | 접근 제한 |
|---|---|---|
| `Main` | `/` | 없음 |
| `DisplayCategoryList` | `/products` | 없음 |
| `ProductSectionList` | `/display/:sectionsId` | 없음 |
| `ProductDetail` | `/product-detail` | 없음 |

### 회원 인증 페이지

| 페이지 | 경로 | 접근 제한 |
|---|---|---|
| `SignIn` | `/sign-in` | 비로그인 전용 |
| `SignUp` | `/sign-up/form` | 비로그인 전용 |
| `SignUpMenu` | `/sign-up` | 비로그인 전용 |
| `SignUpConfirm` | `/sign-up-confirm` | 비로그인 전용 |
| `FindId` | `/find-id` | 비로그인 전용 |
| `FindPassword` | `/find-password` | 비로그인 전용 |
| `ChangePassword` | `/change-password` | 없음 |
| `AdultCertification` | `/adult-certification` | 없음 |
| `MemberWithdrawal` | `/member-withdrawal` | 없음 |
| `OpenIdCallback` | `/callback/auth-callback` | 없음 |
| `CallBack` | `/callback` | 없음 |

### 마이페이지

| 페이지 | 경로 | 접근 제한 |
|---|---|---|
| `MyPage` | `/my-page` | 로그인 필수 |
| `MemberModification` | `/member-modification` | 로그인 필수 |
| `MyPage/ProductReview` | `/my-page/product-review` | 로그인 필수 |
| `MyPage/PersonalInquiry` | `/my-page/personal-inquiry` | 로그인 필수 |
| `MyPage/PersonalInquiry/PersonalInquiryDetail` | `/my-page/personal-inquiry/:inquiryNo` | 로그인 필수 |
| `MyPage/ProductInquiry` | `/my-page/product-inquiry` | 로그인 필수 |
| `MyPage/Coupon` | `/my-page/coupon` | 로그인 필수 |
| `MyPage/Accumulation` | `/my-page/accumulation` | 로그인 필수 |
| `MyPage/Like` | `/my-page/like` | 로그인 필수 |
| `MyPage/ShippingAddress` | `/my-page/shipping-address` | 로그인 필수 |
| `MyPage/Claims` | `/claims` | 없음 |
| `MyPage/Orders` | `/orders` | 없음 |

### 주문/결제 페이지

| 페이지 | 경로 | 접근 제한 |
|---|---|---|
| `Cart` | `/cart` | 없음 |
| `OrderSheet` | `/order/:orderSheetNo` | 없음 |
| `OrderConfirm` | `/order/confirm` | 없음 |
| `OrderDetail` | `/orders/:orderNo` | 없음 |
| `Claim` | `/claim/:orderOptionNo` | 없음 |
| `GuestOrder` | `/pages/order/guest-order.html` | 없음 |

### 고객센터/컨텐츠 페이지

| 페이지 | 경로 | 접근 제한 |
|---|---|---|
| `CustomerCenter` | `/customer-center` | 없음 |
| `FAQ` | `/faq` | 없음 |
| `Notice` | `/notice` | 없음 |
| `Event` | `/event/:eventNoOrId` | 없음 |

### 특수/오류 페이지

| 페이지 | 경로 | 설명 |
|---|---|---|
| `NoAccess` | `/no-access` | 접근 불가 안내 |
| `MemberOnly` | `/member-only` | 회원 전용 안내 |
| `ServiceCheck` | `/service-check` | 서비스 점검 안내 |
| `ExpiredMall` | `/expired-mall` | 만료된 쇼핑몰 안내 |
| `NotFound` | `/not-found` | 404 페이지 |

---

## 커스텀 훅 모듈 (`src/hooks/`)

| 훅 | 책임 |
|---|---|
| `useSearchKeyword` | 검색 키워드 상태 관리 및 최근 검색어 저장 |
| `useChangePassword` | 비밀번호 변경 로직 (유효성 검사 포함) |
| `useLayoutChanger` | 레이아웃 동적 변경 (헤더 표시 여부 등) |
| `useDragAndDrop` | 드래그 앤 드롭 인터랙션 처리 |
| `useSyncTokenExpiryWithLocation` | 라우트 변경 시 토큰 만료 시간 자동 갱신 |

---

## 유틸리티 모듈 (`src/utils/`)

### `api.js` - HTTP 클라이언트

**책임**: Shopby Shop API 호출 추상화

**공개 함수**:

- `initializeShopApi({ platform? })` - API SDK 초기화, environment.json 로드
- `fetchHttpRequest({ url, baseURL?, method?, query?, requestBody?, headers? })` - 범용 HTTP 요청 함수

**내부 처리**:
- JWT 액세스 토큰 자동 헤더 첨부
- 401 응답 시 토큰 갱신 후 재요청
- FormData 감지 및 스토리지 API 전환
- KCP 결제 응답은 text()로 파싱 (나머지는 json())

---

## 상수 모듈 (`src/constants/`)

공통 상수 정의. 구체적인 내용은 `@shopby/shared` 패키지와 연계하여 사용.
