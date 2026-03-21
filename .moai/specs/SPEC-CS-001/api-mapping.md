# SPEC-CS-001: API Mapping Table

> shopby Enterprise API 및 Provider 매핑 - A4B5-CS + B1-ADMIN 도메인 화면설계 기준 문서
>
> 작성일: 2026-03-20 | 작성: manager-spec (MoAI)

---

## 1. Screen-to-API Matrix

### 1.1 공지사항 (쇼핑몰)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----------------|-------------|--------|---------|----------|-------------|
| NoticeList | 페이지 로딩 | `BoardProvider` | `/boards/{boardNo}/articles` | GET | `{ pageNumber, pageSize, categoryNo }` (query) | `{ items: [{ articleNo, title, registerYmdt, viewCnt }], totalCount }` | - |
| NoticeList | 카테고리 필터 | `BoardProvider` | `/boards/{boardNo}/articles` | GET | `{ categoryNo }` (query) | 동일 | - |
| NoticeDetail | 게시글 클릭 | `BoardProvider` | `/boards/{boardNo}/articles/{articleNo}` | GET | - | `{ articleNo, title, content, registerYmdt, viewCnt }` | 404: 게시글 없음 |
| NoticeDetail | 이전/다음 게시글 | `BoardProvider` | `/boards/{boardNo}/articles/{articleNo}/navigation` | GET | - | `{ previousArticle, nextArticle }` | - |

### 1.2 FAQ (쇼핑몰)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----------------|-------------|--------|---------|----------|-------------|
| FaqList | 페이지 로딩 | `BoardProvider` | `/boards/{boardNo}/articles` | GET | `{ pageSize: 100 }` (query) | `{ items: [{ articleNo, title, content, categoryNo }] }` | - |
| FaqList | 카테고리 필터 | 프론트엔드 필터링 | - | - | - | 로컬 필터 (전체 데이터 로드 후) | - |

### 1.3 비회원 주문조회

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----------------|-------------|--------|---------|----------|-------------|
| GuestOrder | 주문 조회 | `GuestOrderProvider` > `searchGuestOrders()` | `/guest/orders` | GET | `{ orderNo, password, orderRequestType }` (query) | `{ orderInfo, orderProducts }` | 404: 주문 미존재 |
| GuestOrder | 프론트 추가 검증 | 프론트엔드 검증 | - | - | 이메일+휴대폰 추가 대조 | - | 불일치 시 프론트 차단 |

### 1.4 공지사항 관리 (관리자)

| 화면 | 사용자 액션 | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-------------|--------|-------------|----------|-------------|
| AdminNotice | 목록 조회 | `/admin/boards/{boardNo}/articles` | GET | `{ pageNumber, pageSize }` (query) | `{ items: [...], totalCount }` | - |
| AdminNotice | 등록 | `/admin/boards/{boardNo}/articles` | POST | `{ title, content, categoryNo, isNotice }` | `{ articleNo }` | 400: 필수값 누락 |
| AdminNotice | 수정 | `/admin/boards/{boardNo}/articles/{articleNo}` | PUT | `{ title, content, categoryNo, isNotice }` | `{ result: boolean }` | 404: 게시글 없음 |
| AdminNotice | 삭제 | `/admin/boards/{boardNo}/articles/{articleNo}` | DELETE | - | 204 No Content | 404: 게시글 없음 |
| AdminNotice | 상단 고정 | `/admin/boards/{boardNo}/articles/{articleNo}` | PUT | `{ isNotice: true }` | `{ result: boolean }` | - |

### 1.5 FAQ 관리 (관리자)

| 화면 | 사용자 액션 | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-------------|--------|-------------|----------|-------------|
| AdminFaq | 목록 조회 | `/admin/boards/{boardNo}/articles` | GET | `{ categoryNo }` (query) | `{ items: [...] }` | - |
| AdminFaq | 등록 | `/admin/boards/{boardNo}/articles` | POST | `{ title, content, categoryNo, displayOrder }` | `{ articleNo }` | 400: 필수값 누락 |
| AdminFaq | 순서 변경 | `/admin/boards/{boardNo}/articles/order` | PUT | `{ articles: [{ articleNo, displayOrder }] }` | `{ result: boolean }` | - |
| AdminFaq | 카테고리 관리 | `/admin/boards/{boardNo}/categories` | POST/PUT/DELETE | `{ categoryName }` | `{ categoryNo }` | 400: 중복 카테고리 |

### 1.6 1:1문의 관리 (관리자)

| 화면 | 사용자 액션 | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-------------|--------|-------------|----------|-------------|
| AdminInquiry | 목록 조회 | `/admin/inquiries` | GET | `{ inquiryStatus, pageNumber }` (query) | `{ items: [{ inquiryNo, title, memberName, status }] }` | - |
| AdminInquiry | 상세 조회 | `/admin/inquiries/{inquiryNo}` | GET | - | `{ title, content, memberInfo, replies }` | 404: 문의 없음 |
| AdminInquiry | 답변 등록 | `/admin/inquiries/{inquiryNo}/reply` | POST | `{ content }` | `{ result: boolean }` | 400: 내용 비어있음 |
| AdminInquiry | 상태 변경 | `/admin/inquiries/{inquiryNo}/status` | PUT | `{ status }` | `{ result: boolean }` | - |

### 1.7 이용후기 관리 (관리자)

| 화면 | 사용자 액션 | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-------------|--------|-------------|----------|-------------|
| AdminReview | 목록 조회 | `/admin/product-reviews` | GET | `{ pageNumber, rate, hasImage }` (query) | `{ items: [...], totalCount }` | - |
| AdminReview | 삭제 | `/admin/product-reviews/{reviewNo}` | DELETE | - | 204 No Content | 404: 리뷰 없음 |
| AdminReview | 답변 등록 | `/admin/product-reviews/{reviewNo}/reply` | POST | `{ content }` | `{ result: boolean }` | - |
| AdminReview | 관리자 등록 | `/admin/product-reviews` | POST | `{ productNo, content, rate, images }` | `{ reviewNo }` | 400: 필수값 누락 |
| AdminReview | 적립금 회수 | `/admin/accumulations` | POST | `{ memberNo, amount: -1000, reason }` | `{ result: boolean }` | 400: 잔액 부족 |

### 1.8 관리자 등록/관리

| 화면 | 사용자 액션 | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-------------|--------|-------------|----------|-------------|
| AdminOperator | 목록 조회 | `/admin/operators` | GET | `{ role, status }` (query) | `{ items: [{ operatorNo, name, email, role, status }] }` | - |
| AdminOperator | 등록 | `/admin/operators` | POST | `{ name, email, role, permissionGroupNo }` | `{ operatorNo }` | 400: 이메일 중복 |
| AdminOperator | 권한 변경 | `/admin/operators/{operatorNo}` | PUT | `{ role, permissionGroupNo }` | `{ result: boolean }` | 403: 대표관리자만 가능 |
| AdminOperator | 비활성화 | `/admin/operators/{operatorNo}/status` | PUT | `{ status: 'INACTIVE' }` | `{ result: boolean }` | 400: 유일 대표관리자 |

---

## 2. CUSTOM API (체험단관리)

| 화면 | 사용자 액션 | API Endpoint | Method | Request Body | Response | Error Cases |
|------|------------|-------------|--------|-------------|----------|-------------|
| AdminExperience | 공고 목록 | `/api/admin/experience-campaigns` | GET | `{ status, page }` (query) | `{ items: [...], totalCount }` | - |
| AdminExperience | 공고 등록 | `/api/admin/experience-campaigns` | POST | `{ title, contentHtml, startDate, endDate, maxParticipants, productId }` | `{ id }` | 400: 필수값 누락 |
| AdminExperience | 공고 수정 | `/api/admin/experience-campaigns/:id` | PUT | 동일 | `{ result: boolean }` | 404: 공고 없음 |
| AdminExperience | 공고 삭제 | `/api/admin/experience-campaigns/:id` | DELETE | - | 204 No Content | 400: 진행중 삭제 불가 |
| AdminExperience | 신청자 목록 | `/api/admin/experience-campaigns/:id/applications` | GET | - | `{ items: [{ id, memberName, status }] }` | - |
| AdminExperience | 당첨 처리 | `/api/admin/experience-campaigns/:id/select-winners` | POST | `{ applicationIds: [1, 2, 3] }` | `{ selectedCount, notifiedCount }` | 400: 모집중 상태 |
| ShopExperience | 공고 목록 (쇼핑몰) | `/api/experience-campaigns` | GET | `{ status: 'RECRUITING' }` (query) | `{ items: [...] }` | - |
| ShopExperience | 신청 | `/api/experience-campaigns/:id/apply` | POST | `{ reason }` | `{ applicationId }` | 409: 중복 신청, 400: 모집 마감 |

---

## 3. Provider 매핑 요약

| 기능 | shopby Provider | 주요 Action/State |
|------|----------------|-------------------|
| 공지사항 | `BoardProvider` | `fetchArticles()`, `getArticle()` |
| FAQ | `BoardProvider` | `fetchArticles()` (전체 로드 → 프론트 필터) |
| 비회원 주문조회 | `GuestOrderProvider` | `searchGuestOrders()` |
| 공지관리 | Admin API 직접 호출 | CRUD endpoints |
| FAQ관리 | Admin API 직접 호출 | CRUD + 순서변경 endpoints |
| 1:1문의 | Admin API 직접 호출 | 답변 + 상태변경 endpoints |
| 이용후기 | Admin API 직접 호출 | CRUD + 적립금 endpoints |
| 관리자등록 | Admin API 직접 호출 | 운영자 CRUD endpoints |
| 체험단 (CUSTOM) | 자체 API | 전용 REST API endpoints |
