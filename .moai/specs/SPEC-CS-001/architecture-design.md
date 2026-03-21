---
id: SPEC-CS-001
artifact: architecture-design
version: "1.0.0"
created: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-CS-001: A4B5-CS + B1-ADMIN 아키텍처 설계

> 후니프린팅 고객센터/관리자 도메인 (9개 기능) 기술 아키텍처

---

## 1. 시스템 아키텍처 개요

### 1.1 2-Tier 아키텍처에서의 위치

```mermaid
graph TD
    subgraph "Tier 1: NATIVE (shopby Provider/API)"
        T1A["BoardProvider (공지사항)"]
        T1B["BoardProvider (FAQ)"]
        T1C["GuestOrderProvider (비회원주문조회)"]
        T1D["Admin Board API (공지관리/FAQ관리)"]
        T1E["Admin Inquiry API (1:1문의)"]
        T1F["Admin Review API (이용후기)"]
        T1G["Admin Operator API (관리자등록)"]
    end

    subgraph "Tier 2: CUSTOM (자체 개발)"
        T2A["체험단관리 UI"]
        T2B["체험단 REST API"]
        T2C["체험단 DB"]
    end

    subgraph "공통 인프라"
        INF1["src/utils/api.js (fetchHttpRequest)"]
        INF2["@shopby/shared (apiCreator)"]
        INF3["알림 서비스 (이메일/알림톡)"]
    end

    T1A --> INF2
    T1B --> INF2
    T1C --> INF2
    T1D --> INF1
    T1E --> INF1
    T1F --> INF1
    T1G --> INF1
    T2A --> T2B
    T2B --> T2C
    T1E --> INF3
    T2B --> INF3
```

### 1.2 핵심 설계 원칙

| 원칙 | 내용 |
|------|------|
| NATIVE 최우선 | 7/9 기능은 shopby 기본 Provider/API 활용 |
| CUSTOM 최소화 | 체험단관리만 자체 개발, 나머지는 설정 기반 |
| Provider 활용 | 쇼핑몰 프론트는 shopby Provider 패턴 유지 |
| Admin API 직접 호출 | 관리자 기능은 shopby Admin API 직접 호출 |
| 보안 우선 | Rate Limiting, RBAC, XSS 방지 적용 |

---

## 2. 쇼핑몰 프론트 아키텍처

### 2.1 공지사항 페이지 구조

```mermaid
graph LR
    subgraph "공지사항 페이지"
        A["NoticeListPage"] --> B["BoardProvider"]
        B --> C["NoticeFilter (카테고리 탭)"]
        B --> D["NoticeList (게시글 목록)"]
        B --> E["Pagination"]
        A --> F["NoticeDetailPage"]
        F --> G["NoticeContent"]
        F --> H["NoticeNavigation (이전/다음)"]
    end
```

**라우트 구조**:
- `/customer/notice` - 공지사항 목록
- `/customer/notice/:id` - 공지사항 상세

### 2.2 FAQ 페이지 구조

```mermaid
graph LR
    subgraph "FAQ 페이지"
        A["FaqPage"] --> B["BoardProvider"]
        B --> C["FaqCategoryFilter"]
        B --> D["FaqAccordionList"]
        D --> E["FaqAccordionItem"]
        E --> F["질문 (항상 표시)"]
        E --> G["답변 (토글)"]
    end
```

**라우트 구조**:
- `/customer/faq` - FAQ 페이지 (SPA, 페이지 이동 없음)

### 2.3 비회원 주문조회 구조

```mermaid
graph LR
    subgraph "비회원 주문조회"
        A["GuestOrderPage"] --> B["GuestOrderProvider"]
        B --> C["GuestOrderForm"]
        C --> D["주문번호 입력"]
        C --> E["이메일 입력"]
        C --> F["휴대폰번호 입력"]
        B --> G["GuestOrderResult"]
        G --> H["주문 상태"]
        G --> I["상품 목록"]
        G --> J["배송 추적"]
    end
```

**라우트 구조**:
- `/order/guest` - 비회원 주문조회

---

## 3. 관리자 패널 아키텍처

### 3.1 관리자 게시판 관리 구조

```mermaid
graph TD
    subgraph "관리자 게시판"
        A["AdminBoardPage"] --> B["AdminNoticeTab"]
        A --> C["AdminFaqTab"]
        A --> D["AdminInquiryTab"]
        A --> E["AdminReviewTab"]

        B --> B1["NoticeEditor (CRUD)"]
        C --> C1["FaqEditor (CRUD + 순서변경)"]
        D --> D1["InquiryDetail + ReplyEditor"]
        E --> E1["ReviewManager + AdminReviewForm"]
    end

    subgraph "shopby Admin API"
        API1["POST /admin/boards/{boardNo}/articles"]
        API2["GET /admin/boards/{boardNo}/articles"]
        API3["PUT /admin/boards/{boardNo}/articles/{articleNo}"]
        API4["DELETE /admin/boards/{boardNo}/articles/{articleNo}"]
        API5["POST /admin/inquiries/{inquiryNo}/reply"]
        API6["DELETE /admin/product-reviews/{reviewNo}"]
    end

    B1 --> API1
    B1 --> API2
    B1 --> API3
    B1 --> API4
    D1 --> API5
    E1 --> API6
```

### 3.2 관리자 등록/관리 구조

```mermaid
graph TD
    subgraph "관리자 관리"
        A["AdminManagementPage"] --> B["AdminList"]
        A --> C["AdminRegisterForm"]
        A --> D["AdminRoleEditor"]

        B --> B1["역할 필터 (대표/운영자/부운영자)"]
        B --> B2["상태 필터 (활성/비활성)"]
        C --> C1["이름/이메일/역할/권한그룹"]
        D --> D1["권한 그룹 매트릭스"]
    end

    subgraph "shopby Admin Operator API"
        OP1["POST /admin/operators"]
        OP2["GET /admin/operators"]
        OP3["PUT /admin/operators/{operatorNo}"]
        OP4["PUT /admin/operators/{operatorNo}/status"]
    end

    C --> OP1
    B --> OP2
    D --> OP3
    B --> OP4
```

---

## 4. 체험단관리 CUSTOM 모듈 아키텍처

### 4.1 데이터 모델

```mermaid
erDiagram
    EXPERIENCE_CAMPAIGNS {
        int id PK
        string title
        text content_html
        date start_date
        date end_date
        int max_participants
        int product_id FK
        string status "모집중/모집마감/진행중/완료"
        datetime created_at
        datetime updated_at
    }

    EXPERIENCE_APPLICATIONS {
        int id PK
        int campaign_id FK
        int member_no
        string member_name
        string member_email
        string member_phone
        text apply_reason
        string status "신청/당첨/미당첨/후기완료"
        datetime applied_at
    }

    EXPERIENCE_CAMPAIGNS ||--o{ EXPERIENCE_APPLICATIONS : "has"
```

### 4.2 체험단 상태 머신

```mermaid
stateDiagram-v2
    [*] --> 모집중 : 공고 등록
    모집중 --> 모집마감 : 모집기간 종료
    모집마감 --> 진행중 : 당첨자 선정
    진행중 --> 완료 : 후기 수합 완료

    state 모집중 {
        [*] --> 신청접수
        신청접수 --> 신청접수 : 추가 신청
    }

    state 진행중 {
        [*] --> 상품발송
        상품발송 --> 후기대기
        후기대기 --> 후기완료
    }
```

### 4.3 API 설계 방향

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/admin/experience-campaigns` | 체험단 공고 등록 |
| GET | `/api/admin/experience-campaigns` | 공고 목록 조회 |
| PUT | `/api/admin/experience-campaigns/:id` | 공고 수정 |
| DELETE | `/api/admin/experience-campaigns/:id` | 공고 삭제 |
| GET | `/api/admin/experience-campaigns/:id/applications` | 신청자 목록 |
| POST | `/api/admin/experience-campaigns/:id/select-winners` | 당첨자 선정 |
| GET | `/api/experience-campaigns` | 쇼핑몰 공고 목록 |
| POST | `/api/experience-campaigns/:id/apply` | 체험단 신청 |

---

## 5. 보안 아키텍처

### 5.1 비회원 주문조회 보안

```mermaid
sequenceDiagram
    participant User as 비회원
    participant Frontend as 프론트엔드
    participant RateLimit as Rate Limiter
    participant API as shopby API

    User->>Frontend: 주문번호+이메일+휴대폰 입력
    Frontend->>RateLimit: 조회 요청 (IP 체크)

    alt IP당 10회 초과
        RateLimit-->>Frontend: 429 Too Many Requests
        Frontend-->>User: "잠시 후 다시 시도해주세요"
    else 정상
        RateLimit->>API: 주문 조회
        alt 정보 일치
            API-->>Frontend: 주문 데이터
            Frontend-->>User: 주문 상세 표시
        else 정보 불일치
            API-->>Frontend: 404 Not Found
            Frontend-->>User: "일치하는 주문을 찾을 수 없습니다" + 회원가입 CTA
        end
    end
```

### 5.2 관리자 접근 제어

```mermaid
graph TD
    A["관리자 로그인"] --> B{"역할 확인"}
    B -->|대표관리자| C["전체 메뉴 접근"]
    B -->|운영자| D["권한 그룹 메뉴만 접근"]
    B -->|부운영자| E["읽기 위주 제한 메뉴"]

    C --> F["관리자 관리 가능"]
    D --> G["상품/주문/게시판 관리"]
    E --> H["게시판 관리만 가능"]

    F --> I{"30분 비활동?"}
    G --> I
    H --> I
    I -->|예| J["자동 로그아웃"]
    I -->|아니오| K["세션 유지"]
```

### 5.3 체험단 HTML 보안

| 위협 | 방어 수단 |
|------|----------|
| XSS (스크립트 삽입) | DOMPurify로 HTML 정화 |
| SQL Injection | Parameterized Query 필수 |
| CSRF | 관리자 API에 CSRF 토큰 적용 |
| 파일 업로드 공격 | 체험단 이미지 업로드 시 파일 유형/크기 제한 |

---

## 6. 화면 라우팅

### 6.1 쇼핑몰 라우트

| Route | 페이지 | 컴포넌트 |
|-------|--------|---------|
| `/customer/notice` | 공지사항 목록 | NoticeListPage |
| `/customer/notice/:id` | 공지사항 상세 | NoticeDetailPage |
| `/customer/faq` | FAQ | FaqPage |
| `/order/guest` | 비회원 주문조회 | GuestOrderPage |

### 6.2 관리자 라우트

| Route | 페이지 | 컴포넌트 |
|-------|--------|---------|
| `/admin/board/notice` | 공지사항 관리 | AdminNoticePage |
| `/admin/board/faq` | FAQ 관리 | AdminFaqPage |
| `/admin/board/inquiry` | 1:1문의 관리 | AdminInquiryPage |
| `/admin/board/review` | 이용후기 관리 | AdminReviewPage |
| `/admin/experience` | 체험단 관리 | AdminExperiencePage |
| `/admin/operators` | 관리자 관리 | AdminOperatorPage |
