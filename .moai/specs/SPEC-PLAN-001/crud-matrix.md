# SPEC-PLAN-001 CRUD 매트릭스

> 88개 기능의 생성(C)/조회(R)/수정(U)/삭제(D) 작업과 화면/API 매핑.
> 화면설계 및 도메인별 SPEC 작성 시 핵심 참조 자료.

---

## Section 1: A1A2-MEMBER (18개 기능)

회원 가입, 로그인, 회원등급 및 관리자 회원관리 영역.

### 쇼핑몰 기능 (12개)

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 일반 로그인 | NATIVE | shopby: 토큰 발급 | shopby: 프로필 조회 | - | shopby: 로그아웃(토큰 삭제) | 로그인 페이지 | - | `POST /auth/token`, `GET /profile`, `DELETE /auth/token` |
| 아이디 찾기 (이메일 발송) | NATIVE | shopby: 이메일 발송 | shopby: 아이디 조회 | - | - | 아이디 찾기 페이지 | - | `POST /members/id`, `POST /members/id/send-email` |
| 비밀번호 찾기 (임시PW) | NATIVE | shopby: 재설정 메일 발송 | - | shopby: 비밀번호 재설정 | - | 비밀번호 찾기 페이지 | - | `PUT /members/password`, `POST /members/password/send-email` |
| 약관동의 | SKIN | - | shopby: 약관 목록/상세 조회 | - | - | 회원가입 1단계 | - | `GET /terms`, `GET /terms/{termsNo}` |
| 정보입력 | SKIN | shopby: 회원 가입 | - | - | - | 회원가입 2단계 | - | `POST /members` |
| 이메일 중복확인 | NATIVE | - | shopby: 중복 여부 확인 | - | - | 회원가입 폼 내 실시간 | - | `GET /members/id/exist` |
| 휴대전화 인증 | NATIVE | shopby: 인증번호 발송 | shopby: 인증번호 확인 | - | - | 회원가입 폼 내 인증 | - | `POST /members/authentication/sms`, `POST /members/authentication/sms/verify` |
| 가입완료 메일 발송 | NATIVE | shopby: 자동 메일 발송 | - | - | - | 가입완료 페이지 | - | `POST /members` 성공 시 자동 트리거 |
| SNS 로그인 (카카오/네이버) | NATIVE | shopby: OpenID 토큰 발급 | shopby: OpenID 프로필 조회 | - | - | 로그인 페이지 하단 | - | `GET /auth/openid/{provider}`, `POST /auth/openid/{provider}/callback` |
| SNS 로그인 (구글/애플) | EXTERNAL | BFF: OAuth 토큰 발급 + shopby 회원 연동 | BFF: OAuth 프로필 조회 | - | - | 로그인 페이지 하단 (P2) | - | `POST /custom/oauth/google/callback`, `POST /custom/oauth/apple/callback` |
| 비회원 주문 허용 | NATIVE | shopby: 비회원 토큰 발급 | shopby: 비회원 주문 조회 | - | - | 비회원 주문 프로세스 | - | `POST /guest/token`, `GET /guest/orders` |
| 회원등급 체계 | NATIVE | - | shopby: 등급 목록/내 등급 조회 | - | - | 마이페이지 등급 배지, 등급 안내 | - | `GET /members/grades`, `GET /profile/grade` |

### 관리자 기능 (6개)

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 회원관리 (주문내역/정보확인) | NATIVE | - | Admin: 회원 목록/상세 조회 | Admin: 회원 정보 수정 | - | - | 회원관리 목록/상세 | `GET /admin/members`, `GET /admin/members/{memberNo}`, `PUT /admin/members/{memberNo}` |
| 탈퇴회원 관리 | NATIVE | - | Admin: 탈퇴회원 목록 조회 | - | - | - | 탈퇴회원 목록 | `GET /admin/members/withdrawn` |
| 프린팅머니 관리 | NATIVE | Admin: 적립금 수동 지급 | Admin: 적립금 내역 조회 | Admin: 적립금 차감 | - | - | 적립금관리 | `POST /admin/members/{memberNo}/accumulations`, `GET /admin/accumulations` |
| 쿠폰관리 (발행/매칭/사용내역) | NATIVE | Admin: 쿠폰 발행 | Admin: 쿠폰 목록 조회 | Admin: 쿠폰 수정 | Admin: 쿠폰 삭제 | - | 쿠폰관리 | `POST /admin/coupons`, `GET /admin/coupons`, `PUT /admin/coupons/{couponNo}`, `DELETE /admin/coupons/{couponNo}` |
| 쿠폰등록내역 | NATIVE | - | Admin: 등록내역 조회 | - | - | - | 쿠폰등록내역 | `GET /admin/coupons/issued` |
| 쿠폰사용내역 | NATIVE | - | Admin: 사용내역 조회 | - | - | - | 쿠폰사용내역 | `GET /admin/coupons/used` |

---

## Section 2: A3-MYPAGE (16개 기능)

회원 마이페이지 전체 기능 (주문, 쿠폰, 적립금, 리뷰, 문의, 정보관리, 증빙서류).

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 주문조회 | SKIN | - | shopby: 주문 목록 조회 | - | - | 마이페이지 > 주문조회 | - | `GET /profile/orders` |
| 주문상세조회(편집 미리보기) | CUSTOM | - | shopby: 주문상세 + BFF: 편집 미리보기 데이터 | - | - | 마이페이지 > 주문상세 | - | `GET /profile/orders/{orderNo}`, `GET /custom/orders/{orderNo}/preview` |
| 쿠폰관리 | NATIVE | - | shopby: 보유 쿠폰 목록 조회 | - | - | 마이페이지 > 쿠폰관리 | - | `GET /profile/coupons` |
| 쿠폰등록 | NATIVE | shopby: 쿠폰 코드 등록 | - | - | - | 마이페이지 > 쿠폰등록 | - | `POST /profile/coupons` |
| 프린팅머니 | SKIN | - | shopby: 적립금 내역 조회 | - | - | 마이페이지 > 프린팅머니 | - | `GET /profile/accumulations` |
| 머니충전 | CUSTOM | BFF: 충전 결제 생성 → shopby 적립금 전환 | BFF: 충전 내역 조회 | - | - | 마이페이지 > 머니충전 | - | `POST /custom/money/charge`, `GET /custom/money/charge-history` |
| 나의 리뷰 | NATIVE | - | shopby: 내 리뷰 목록 조회 | - | - | 마이페이지 > 나의 리뷰 | - | `GET /profile/product-reviews` |
| 리뷰쓰기(사진업로드) 수정/삭제 | NATIVE | shopby: 리뷰 등록 | - | shopby: 리뷰 수정 | shopby: 리뷰 삭제 | 마이페이지 > 리뷰쓰기 | - | `POST /profile/product-reviews`, `PUT /profile/product-reviews/{reviewNo}`, `DELETE /profile/product-reviews/{reviewNo}` |
| 1:1문의 + 문의하기 | NATIVE | shopby: 문의 등록 | shopby: 문의 목록/상세 조회 | - | shopby: 문의 삭제 | 마이페이지 > 1:1문의 | - | `POST /profile/inquiries`, `GET /profile/inquiries`, `DELETE /profile/inquiries/{inquiryNo}` |
| 회원정보수정 | NATIVE | - | shopby: 프로필 조회 | shopby: 프로필 수정 | - | 마이페이지 > 회원정보수정 | - | `GET /profile`, `PUT /profile` |
| 회원정보수정_비밀번호입력 | NATIVE | - | - | shopby: 비밀번호 확인 | - | 회원정보수정 진입 전 | - | `POST /profile/password/verify` |
| 비밀번호변경 | NATIVE | - | - | shopby: 비밀번호 변경 | - | 마이페이지 > 비밀번호변경 | - | `PUT /profile/password` |
| 회원탈퇴 | NATIVE | - | shopby: 탈퇴 전 안내정보 조회 | - | shopby: 회원 탈퇴 | 마이페이지 > 회원탈퇴 | - | `GET /profile` (잔여혜택), `DELETE /members` |
| 증빙서류발급내역 | SKIN | shopby: 증빙서류 발급 요청 | shopby: 발급내역 조회 + BFF: 팝빌 상태 조회 | shopby: 발급 상태 변경 | - | 마이페이지 > 증빙서류 | - | `POST /profile/tax-invoices`, `GET /profile/tax-invoices`, `GET /custom/tax/status/{invoiceNo}` |
| 사업자정보(목록/등록) | SKIN | shopby: 추가필드 등록 | shopby: 사업자정보 목록 조회 | shopby: 사업자정보 수정 | shopby: 사업자정보 삭제 | 마이페이지 > 사업자정보 | - | `POST /profile/business-info`, `GET /profile/business-info`, `PUT /profile/business-info/{id}`, `DELETE /profile/business-info/{id}` |
| 현금영수증정보 | SKIN | shopby: 현금영수증 정보 등록 | shopby: 현금영수증 정보 조회 | shopby: 현금영수증 정보 수정 | - | 마이페이지 > 현금영수증 | - | `POST /profile/cash-receipt`, `GET /profile/cash-receipt`, `PUT /profile/cash-receipt` |

---

## Section 3: A10B4-PRODUCT (14개 기능)

상품관리 영역. 인쇄/제본 종속옵션 엔진, 가격 매트릭스, 굿즈/수작/포장재/디자인 상품 등록.

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 인쇄/제본 상품등록 | CUSTOM | BFF: 종속옵션 상품 생성 + shopby 상품 동기화 | BFF: 상품상세 조회 | BFF: 상품 수정 | BFF: 상품 삭제 | - | 인쇄/제본 상품등록 | `POST /custom/products/printing`, `GET /custom/products/printing/{id}`, `PUT /custom/products/printing/{id}`, `DELETE /custom/products/printing/{id}` |
| 사이즈선택 팝업 | CUSTOM | BFF: 사이즈 옵션 생성 | BFF: 사이즈 옵션 목록 조회 | BFF: 사이즈 옵션 수정 | BFF: 사이즈 옵션 삭제 | - | 상품등록 내 팝업 | `POST /custom/options/sizes`, `GET /custom/options/sizes`, `PUT /custom/options/sizes/{id}`, `DELETE /custom/options/sizes/{id}` |
| 소재선택 팝업 | CUSTOM | BFF: 소재 옵션 생성 | BFF: 소재 옵션 목록 조회 | BFF: 소재 옵션 수정 | BFF: 소재 옵션 삭제 | - | 상품등록 내 팝업 | `POST /custom/options/materials`, `GET /custom/options/materials`, `PUT /custom/options/materials/{id}`, `DELETE /custom/options/materials/{id}` |
| 종이선택 팝업 | CUSTOM | BFF: 종이 옵션 생성 | BFF: 종이 옵션 목록 조회 | BFF: 종이 옵션 수정 | BFF: 종이 옵션 삭제 | - | 상품등록 내 팝업 | `POST /custom/options/papers`, `GET /custom/options/papers`, `PUT /custom/options/papers/{id}`, `DELETE /custom/options/papers/{id}` |
| 가격관리 팝업 8종 | CUSTOM | BFF: 가격 매트릭스 생성 | BFF: 가격 매트릭스 조회 | BFF: 가격 매트릭스 수정 | BFF: 가격 매트릭스 삭제 | - | 상품등록 내 팝업 | `POST /custom/pricing/{productType}`, `GET /custom/pricing/{productType}`, `PUT /custom/pricing/{productType}/{id}`, `DELETE /custom/pricing/{productType}/{id}` |
| 사이즈관리 | CUSTOM | BFF: 사이즈 마스터 생성 | BFF: 사이즈 마스터 목록 조회 | BFF: 사이즈 마스터 수정 | BFF: 사이즈 마스터 삭제 | - | 사이즈관리 | `POST /custom/masters/sizes`, `GET /custom/masters/sizes`, `PUT /custom/masters/sizes/{id}`, `DELETE /custom/masters/sizes/{id}` |
| 소재관리 | CUSTOM | BFF: 소재 마스터 생성 | BFF: 소재 마스터 목록 조회 | BFF: 소재 마스터 수정 | BFF: 소재 마스터 삭제 | - | 소재관리 | `POST /custom/masters/materials`, `GET /custom/masters/materials`, `PUT /custom/masters/materials/{id}`, `DELETE /custom/masters/materials/{id}` |
| 용지관리 | CUSTOM | BFF: 용지 마스터 생성 | BFF: 용지 마스터 목록 조회 | BFF: 용지 마스터 수정 | BFF: 용지 마스터 삭제 | - | 용지관리 | `POST /custom/masters/papers`, `GET /custom/masters/papers`, `PUT /custom/masters/papers/{id}`, `DELETE /custom/masters/papers/{id}` |
| 가격관리 (출력/코팅/후가공/제본) | CUSTOM | BFF: 가격표 생성 | BFF: 가격표 조회 | BFF: 가격표 수정 | BFF: 가격표 삭제 | - | 가격관리 | `POST /custom/pricing/tables`, `GET /custom/pricing/tables`, `PUT /custom/pricing/tables/{id}`, `DELETE /custom/pricing/tables/{id}` |
| 굿즈 카테고리관리 | NATIVE | Admin: 카테고리 생성 | Admin: 카테고리 목록 조회 | Admin: 카테고리 수정 | Admin: 카테고리 삭제 | - | 카테고리관리 | `POST /admin/categories`, `GET /admin/categories`, `PUT /admin/categories/{categoryNo}`, `DELETE /admin/categories/{categoryNo}` |
| 굿즈 상품등록 | SKIN | Admin: 상품 등록 | Admin: 상품 조회 | Admin: 상품 수정 | Admin: 상품 삭제 | - | 굿즈 상품등록 | `POST /admin/products`, `GET /admin/products/{productNo}`, `PUT /admin/products/{productNo}`, `DELETE /admin/products/{productNo}` |
| 수작 상품등록 | SKIN | Admin: 상품 등록 | Admin: 상품 조회 | Admin: 상품 수정 | Admin: 상품 삭제 | - | 수작 상품등록 | `POST /admin/products`, `GET /admin/products/{productNo}`, `PUT /admin/products/{productNo}`, `DELETE /admin/products/{productNo}` |
| 포장재 상품등록 | SKIN | Admin: 상품 등록 | Admin: 상품 조회 | Admin: 상품 수정 | Admin: 상품 삭제 | - | 포장재 상품등록 | `POST /admin/products`, `GET /admin/products/{productNo}`, `PUT /admin/products/{productNo}`, `DELETE /admin/products/{productNo}` |
| 디자인 상품등록 | SKIN | Admin: 상품 등록 | Admin: 상품 조회 | Admin: 상품 수정 | Admin: 상품 삭제 | - | 디자인 상품등록 | `POST /admin/products`, `GET /admin/products/{productNo}`, `PUT /admin/products/{productNo}`, `DELETE /admin/products/{productNo}` |

---

## Section 4: A6B8-ORDER (15개 기능)

주문 프로세스 (파일업로드, 장바구니, 배송, 결제) 및 관리자 주문관리 영역.

### 쇼핑몰 기능 (6개)

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 파일/편집 정보입력 | CUSTOM | BFF: 파일 업로드 (presigned URL) | BFF: 업로드 파일 정보 조회 | BFF: 파일 교체 | BFF: 파일 삭제 | 주문 > 파일업로드 | - | `POST /custom/files/presigned-url`, `POST /custom/files/upload-complete`, `GET /custom/files/{orderFileId}`, `DELETE /custom/files/{orderFileId}` |
| 보관함/장바구니 | SKIN | shopby: 장바구니 추가 + BFF: 인쇄옵션 저장 | shopby: 장바구니 조회 | shopby: 수량 변경 | shopby: 장바구니 삭제 | 보관함/장바구니 | - | `POST /cart`, `GET /cart`, `PUT /cart/{cartNo}`, `DELETE /cart/{cartNo}`, `POST /custom/cart/options` |
| 배송정보입력 | NATIVE | shopby: 배송지 등록 | shopby: 배송비 조회 | - | - | 주문 > 배송정보 | - | `POST /profile/shipping-addresses`, `GET /profile/shipping-addresses`, `GET /order/calculate` |
| 배송지목록/입력 | NATIVE | shopby: 배송지 추가 | shopby: 배송지 목록 조회 | shopby: 배송지 수정 | shopby: 배송지 삭제 | 주문 > 배송지선택 | - | `POST /profile/shipping-addresses`, `GET /profile/shipping-addresses`, `PUT /profile/shipping-addresses/{addressNo}`, `DELETE /profile/shipping-addresses/{addressNo}` |
| 결제하기 (이니시스 연동) | EXTERNAL | shopby: 주문 생성 + External: PG 결제 | - | - | - | 주문 > 결제 | - | `POST /order/sheet`, `POST /order/pay`, External: 이니시스/네이버페이/카카오페이 |
| 주문완료 + 메일 발송 | NATIVE | shopby: 주문완료 메일 자동 발송 | shopby: 주문완료 정보 조회 | - | - | 주문완료 페이지 | - | `GET /profile/orders/{orderNo}` (주문완료 후 자동 트리거) |

### 관리자 기능 (9개)

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 주문관리-인쇄/제본/굿즈 | SKIN | - | Admin: 주문 목록/상세 조회 + BFF: 커스텀 상태 | Admin: 주문 상태 변경 | - | - | 주문관리 목록/상세 | `GET /admin/orders`, `GET /admin/orders/{orderNo}`, `PUT /admin/orders/{orderNo}/status`, `GET /custom/admin/orders/{orderNo}/status` |
| 파일확인처리 | CUSTOM | BFF: 검수 결과 생성 | BFF: 업로드 파일 조회/검수 | BFF: 검수 상태 변경 | - | - | 파일검수 워크플로우 | `POST /custom/admin/files/{orderFileId}/review`, `GET /custom/admin/files/pending`, `PUT /custom/admin/files/{orderFileId}/review` |
| 재업로드요청 문자 발송 | CUSTOM | BFF: SMS/알림톡 발송 | BFF: 발송 이력 조회 | - | - | - | 재업로드 요청 관리 | `POST /custom/admin/notifications/reupload`, `GET /custom/admin/notifications/reupload/{orderNo}` |
| 주문서출력 | SKIN | - | Admin: 주문서 데이터 조회 | - | - | - | 주문서출력 | `GET /admin/orders/{orderNo}/print` |
| 주문상태변경 처리 (+문자) | SKIN | BFF: 상태변경 문자 발송 | Admin: 주문상태 조회 | Admin: 주문상태 변경 + BFF: 커스텀 상태 변경 | - | - | 주문상태변경 | `PUT /admin/orders/{orderNo}/status`, `PUT /custom/admin/orders/{orderNo}/process-status`, `POST /custom/admin/notifications/status-change` |
| 주문관리-후불결제 | CUSTOM | BFF: 후불 주문 생성 | BFF: 후불결제 목록/상세 조회 | BFF: 결제 상태 변경 (미결제→완료) | - | - | 후불결제 관리 | `POST /custom/admin/deferred-payments`, `GET /custom/admin/deferred-payments`, `PUT /custom/admin/deferred-payments/{id}/settle` |
| 증빙서류발급 관리 | SKIN | Admin: 증빙서류 발급 처리 | Admin: 발급 요청 목록 조회 + BFF: 팝빌 상태 | Admin: 발급 상태 변경 | - | - | 증빙서류 관리 | `GET /admin/tax-invoices`, `PUT /admin/tax-invoices/{id}/issue`, `GET /custom/admin/tax/popbill-status/{id}` |
| 주문상태변경 (일괄) | SKIN | - | Admin: 주문 목록 조회 | Admin: 일괄 상태 변경 | - | - | 일괄상태변경 | `PUT /admin/orders/batch-status` |
| 고객 SMS 발송 | CUSTOM | BFF: SMS/알림톡 발송 | BFF: 발송 이력 조회 | - | - | - | 고객 SMS 발송 | `POST /custom/admin/notifications/sms`, `GET /custom/admin/notifications/sms/history` |

---

## Section 5: A4B5-CS + B1-ADMIN (9개 기능)

고객센터 (공지, FAQ, 비회원조회) 및 관리자 게시판/운영 관리 영역.

### 쇼핑몰 기능 (3개)

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 공지사항 | NATIVE | - | shopby: 공지 목록/상세 조회 | - | - | 고객센터 > 공지사항 | - | `GET /boards/notice`, `GET /boards/notice/{articleNo}` |
| 자주묻는질문 | NATIVE | - | shopby: FAQ 목록/상세 조회 | - | - | 고객센터 > FAQ | - | `GET /boards/faq`, `GET /boards/faq/{articleNo}` |
| 비회원 주문조회 | NATIVE | - | shopby: 비회원 주문 조회 | - | - | 고객센터 > 비회원조회 | - | `GET /guest/orders` (주문번호+휴대전화) |

### 관리자 기능 (6개)

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 관리자 등록/관리 | NATIVE | Admin: 관리자 등록 | Admin: 관리자 목록 조회 | Admin: 관리자 정보 수정 | Admin: 관리자 삭제 | - | 관리자 등록/관리 | `POST /admin/operators`, `GET /admin/operators`, `PUT /admin/operators/{operatorNo}`, `DELETE /admin/operators/{operatorNo}` |
| 공지사항 관리 | NATIVE | Admin: 공지 등록 | Admin: 공지 목록 조회 | Admin: 공지 수정 | Admin: 공지 삭제 | - | 공지사항 관리 | `POST /admin/boards/notice`, `GET /admin/boards/notice`, `PUT /admin/boards/notice/{articleNo}`, `DELETE /admin/boards/notice/{articleNo}` |
| 자주묻는질문 관리 | NATIVE | Admin: FAQ 등록 | Admin: FAQ 목록 조회 | Admin: FAQ 수정 | Admin: FAQ 삭제 | - | FAQ 관리 | `POST /admin/boards/faq`, `GET /admin/boards/faq`, `PUT /admin/boards/faq/{articleNo}`, `DELETE /admin/boards/faq/{articleNo}` |
| 1:1문의 (확인/답변) | NATIVE | Admin: 답변 등록 | Admin: 문의 목록/상세 조회 | Admin: 답변 수정 | - | - | 1:1문의 관리 | `GET /admin/inquiries`, `POST /admin/inquiries/{inquiryNo}/reply`, `PUT /admin/inquiries/{inquiryNo}/reply` |
| 체험단관리 | CUSTOM | BFF: 체험단 캠페인 생성 | BFF: 캠페인 목록/상세 조회 | BFF: 캠페인 수정, 당첨처리 | BFF: 캠페인 삭제 | - | 체험단관리 | `POST /custom/admin/campaigns`, `GET /custom/admin/campaigns`, `PUT /custom/admin/campaigns/{id}`, `DELETE /custom/admin/campaigns/{id}`, `POST /custom/admin/campaigns/{id}/select-winners` |
| 이용후기관리 | NATIVE | Admin: 임의 리뷰 등록 | Admin: 리뷰 목록 조회 | Admin: 리뷰 수정 | Admin: 리뷰 삭제 | - | 이용후기 관리 | `POST /admin/product-reviews`, `GET /admin/product-reviews`, `PUT /admin/product-reviews/{reviewNo}`, `DELETE /admin/product-reviews/{reviewNo}` |

---

## Section 6: Pages + A7A8-CONTENT + A5-PAYMENT (9개 기능)

쇼핑몰 페이지 (메인, 서브, 리스트, 상품), 콘텐츠 페이지 (회사소개, 약관 등), 수동결제.

### Pages (4개)

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 메인 | SKIN | - | shopby: 메인 상품/배너/기획전 조회 | - | - | 메인 페이지 | - | `GET /display/main`, `GET /display/banners`, `GET /display/events` |
| 서브메인(랜딩페이지) | SKIN | - | shopby: 기획전/프로모션 페이지 조회 | - | - | 서브메인(랜딩) | - | `GET /display/events/{eventNo}` |
| LIST (검색결과) | SKIN | - | shopby: 상품 목록/검색 조회 | - | - | 상품목록/검색결과 | - | `GET /products`, `GET /products/search` |
| 상품페이지(상품옵션) | SKIN/CUSTOM | - | shopby: 상품상세 + BFF: 인쇄옵션/가격계산 | - | - | 상품상세 페이지 | - | `GET /products/{productNo}`, `GET /custom/products/{productNo}/options`, `GET /custom/products/{productNo}/calculate-price` |

### A7A8-CONTENT (4개)

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 회사소개 | NATIVE | - | shopby: 회사소개 페이지 조회 | - | - | 회사소개 | - | `GET /display/pages/about` |
| 이용약관 | NATIVE | - | shopby: 약관 내용 조회 | - | - | 이용약관 | - | `GET /terms` (이용약관) |
| 개인정보보호 | NATIVE | - | shopby: 약관 내용 조회 | - | - | 개인정보보호정책 | - | `GET /terms` (개인정보) |
| 찾아오시는 길 | SKIN | - | shopby: 정보 + External: 지도 API 조회 | - | - | 찾아오시는 길 | - | `GET /display/pages/location`, External: 카카오맵 API |

### A5-PAYMENT (1개)

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 수동카드결제 (PC+모바일) | CUSTOM | BFF: 수동 결제 생성 + External: PG 결제 | BFF: 수동결제 내역 조회 | BFF: 결제 취소/부분취소 | - | - | 수동카드결제 | `POST /custom/admin/manual-payments`, `GET /custom/admin/manual-payments`, `PUT /custom/admin/manual-payments/{id}/cancel` |

---

## Section 7: B7-STATISTICS (7개 기능)

관리자 통계 영역. 상품통계, 매출통계, 발주/정산, 팀별통계.

| 기능 | shopby분류 | C (생성) | R (조회) | U (수정) | D (삭제) | 쇼핑몰 화면 | 관리자 화면 | API 엔드포인트 |
|------|-----------|----------|----------|----------|----------|------------|------------|---------------|
| 인쇄/제본 상품통계 | CUSTOM | - | BFF: 인쇄/제본 통계 데이터 조회 | - | - | - | 인쇄/제본 통계 | `GET /custom/admin/statistics/printing` |
| 굿즈 상품통계 | SKIN | - | Admin: 굿즈 상품 통계 조회 | - | - | - | 굿즈 통계 | `GET /admin/statistics/products?category=goods` |
| 패키지 상품통계 | CUSTOM | - | BFF: 패키지 통계 데이터 조회 | - | - | - | 패키지 통계 | `GET /custom/admin/statistics/package` |
| 수작 상품통계 | SKIN | - | Admin: 수작 상품 통계 조회 | - | - | - | 수작 통계 | `GET /admin/statistics/products?category=handmade` |
| 월별 매출통계 | NATIVE | - | Admin: 월별 매출 통계 조회 | - | - | - | 월별 매출통계 | `GET /admin/statistics/sales/monthly` |
| 굿즈 발주/정산 | SKIN | BFF: Excel 내보내기 생성 | Admin: 발주/정산 내역 조회 + BFF: 외주정산 데이터 | - | - | - | 굿즈 발주/정산 | `GET /admin/statistics/orders?category=goods`, `GET /custom/admin/settlements/goods`, `GET /custom/admin/settlements/goods/export` |
| 제작상품 팀별통계 | CUSTOM | - | BFF: 팀별 통계 데이터 조회 + Excel 내보내기 | - | - | - | 팀별통계 | `GET /custom/admin/statistics/teams`, `GET /custom/admin/statistics/teams/export` |

---

## CRUD 통계 요약

### 도메인별 CRUD 통계

| 도메인 | 기능 수 | C 건수 | R 건수 | U 건수 | D 건수 | shopby API | BFF API | Admin 전용 |
|--------|---------|--------|--------|--------|--------|-----------|---------|-----------|
| A1A2-MEMBER | 18 | 10 | 16 | 4 | 3 | 16 | 1 | 6 |
| A3-MYPAGE | 16 | 9 | 16 | 9 | 5 | 13 | 2 | 0 |
| A10B4-PRODUCT | 14 | 14 | 14 | 14 | 14 | 5 | 9 | 5 |
| A6B8-ORDER | 15 | 11 | 15 | 7 | 2 | 8 | 7 | 9 |
| A4B5-CS + B1-ADMIN | 9 | 6 | 9 | 5 | 4 | 7 | 1 | 6 |
| Pages + Content + Payment | 9 | 1 | 9 | 1 | 0 | 7 | 2 | 1 |
| B7-STATISTICS | 7 | 1 | 7 | 0 | 0 | 3 | 4 | 7 |
| **합계** | **88** | **52** | **86** | **40** | **28** | **59** | **26** | **34** |

### API 담당 분류

| API 구분 | 담당 기능 수 | 비율 |
|----------|------------|------|
| shopby Open API (쇼핑몰 NATIVE/SKIN) | 38개 | 43% |
| NestJS BFF API (CUSTOM 자체 개발) | 24개 | 27% |
| shopby Server API (Admin 관리자) | 21개 | 24% |
| External API (PG, OAuth, 지도 등) | 5개 | 6% |

### API 분류 상세

**shopby Open API (38개)** - shopby가 기본 제공하는 API를 Aurora Skin에서 래핑하여 사용. 로그인, 회원가입, 쿠폰, 적립금, 게시판, 상품조회 등 표준 쇼핑몰 기능 포함.

**NestJS BFF API (24개)** - shopby에서 미지원하는 인쇄 도메인 특화 기능. 종속옵션 엔진, 가격 매트릭스, 파일 업로드, 후불결제, 통계, 체험단 등. 별도 DB + 별도 API 서버 필요.

**shopby Server API (21개)** - shopby 관리자 전용 API. 회원관리, 상품등록(굿즈/수작/포장재), 주문관리, 게시판관리 등. shopby 관리자 화면에서 직접 사용하거나 Admin API를 통해 커스텀 관리자 화면에서 호출.

**External API (5개)** - 외부 서비스 연동. PG 결제(이니시스), SNS 로그인(구글/애플 OAuth), 지도(카카오맵), SMS/알림톡 발송.
