---
id: SPEC-ORDER-001
artifact: architecture-design
version: "1.0.0"
created: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-ORDER-001: A6B8-ORDER 아키텍처 설계

> 후니프린팅 주문관리 도메인 (15개 기능) 기술 아키텍처

---

## 1. 시스템 아키텍처 개요

### 1.1 Hybrid 아키텍처에서의 위치

```mermaid
graph TD
    subgraph "Tier 1: NATIVE/SKIN (shopby Provider)"
        T1A["OrderSheetProvider (주문서 작성)"]
        T1B["ShippingAddressProvider (배송지)"]
        T1C["PaymentProvider (결제 모듈)"]
        T1D["OrderCompleteProvider (주문완료)"]
        T1E["CartProvider (장바구니)"]
    end

    subgraph "Tier 2: CUSTOM (자체 개발)"
        T2A["FileUploadModule (파일 업로드/검수)"]
        T2B["OptionStorageService (옵션보관함)"]
        T2C["PrintStatusTracker (인쇄 공정 상태)"]
        T2D["DeferredPaymentService (후불결제)"]
        T2E["NotificationService (알림톡/SMS)"]
    end

    subgraph "BFF Server (Node.js)"
        BFF1["/api/files/* (파일 관리)"]
        BFF2["/api/orders/status (상태 관리)"]
        BFF3["/api/notifications/* (알림)"]
        BFF4["/api/b2b/* (후불결제)"]
    end

    subgraph "외부 서비스"
        EXT1["AWS S3 (파일 스토리지)"]
        EXT2["PitStop Server (PDF 검증)"]
        EXT3["KG이니시스 (PG 결제)"]
        EXT4["카카오 알림톡"]
        EXT5["팝빌 (증빙서류)"]
        EXT6["네이버페이"]
    end

    subgraph "공통 인프라"
        INF1["shopby API Gateway"]
        INF2["Custom DB (옵션/상태/파일 메타)"]
    end

    T1A --> INF1
    T1C --> EXT3
    T1C --> EXT6
    T2A --> BFF1
    T2C --> BFF2
    T2E --> BFF3
    T2D --> BFF4
    BFF1 --> EXT1
    BFF1 --> EXT2
    BFF3 --> EXT4
    BFF4 --> INF1
    T1E --> INF1
    T2B --> INF2
```

### 1.2 핵심 설계 원칙

| 원칙 | 내용 |
|------|------|
| Provider 보존 | shopby 공식 Provider(Order, Cart, Shipping)는 수정하지 않고 래핑만 수행 |
| BFF 분리 | 인쇄 특화 로직(파일, 상태, 알림)은 BFF에서 처리, shopby API와 분리 |
| 이벤트 기반 동기화 | shopby 주문상태와 인쇄 커스텀 상태는 이벤트 기반으로 동기화 |
| Presigned URL | 파일 업로드/다운로드는 Presigned URL로 S3 직접 접근, BFF 부하 최소화 |
| 알림톡 우선 | 모든 고객 알림은 알림톡 우선, 실패 시 SMS 자동 폴백 |

---

## 2. 파일 업로드 아키텍처

### 2.1 업로드 시퀀스

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant BFF as BFF Server
    participant S3 as AWS S3
    participant PS as PitStop Server

    C->>BFF: POST /api/files/presigned-url (파일명, 크기)
    BFF->>S3: CreatePresignedPost (멀티파트)
    S3-->>BFF: Presigned URL + Upload ID
    BFF-->>C: Presigned URL 반환

    C->>S3: Multipart Upload (직접 업로드)
    Note over C,S3: 프로그레스바 실시간 업데이트

    S3-->>C: Upload Complete (ETag)
    C->>BFF: POST /api/files/validate (S3 Key)
    BFF->>PS: PDF Preflight Request
    PS-->>BFF: 검증 결과 (해상도, CMYK, 도련, 폰트)
    BFF-->>C: 3단계 결과 (통과/경고/오류)
```

### 2.2 파일 검증 항목

| 항목 | 검증 기준 | 오류 시 결과 |
|------|----------|------------|
| 해상도 | 300 DPI (대형은 100~150 DPI) | 경고: 인쇄 품질 저하 가능 |
| 컬러모드 | CMYK 필수 | 오류: RGB -> CMYK 변환 필요 |
| 도련(bleed) | 사방 3mm | 경고: 흰색 테두리 노출 가능 |
| 안전영역 | 재단선 안쪽 3mm | 경고: 콘텐츠 잘림 가능 |
| 폰트 | 아웃라인 변환/임베드 | 오류: 텍스트 깨짐 |
| 포맷 | PDF/AI/PSD/JPG/PNG | 오류: 지원하지 않는 포맷 |
| 파일 크기 | 300MB/파일, 1GB/주문 | 오류: 크기 초과 |
| 오버프린트 | 확인 (특히 흰색 오브젝트) | 경고: 인쇄 누락 가능 |

---

## 3. 인쇄 공정 상태 머신

### 3.1 상태 전이 다이어그램

```mermaid
stateDiagram-v2
    [*] --> ORDER_RECEIVED : 결제 완료

    ORDER_RECEIVED --> FILE_CHECKING : 파일 검수 시작
    FILE_CHECKING --> PRINT_READY : 검수 승인
    FILE_CHECKING --> REUPLOAD_WAIT : 재업로드 요청

    REUPLOAD_WAIT --> FILE_CHECKING : 재업로드 접수

    PRINT_READY --> PRINTING : 인쇄 시작
    PRINTING --> POST_PROCESSING : 인쇄 완료

    POST_PROCESSING --> PACKAGING : 후가공 완료
    PACKAGING --> SHIPPED : 출고
    SHIPPED --> DELIVERING : 배송 시작
    DELIVERING --> DELIVERED : 배송 완료

    DELIVERED --> [*]

    note right of FILE_CHECKING
        PitStop 자동 검증 + 관리자 수동 확인
    end note

    note right of REUPLOAD_WAIT
        48시간 타임아웃 시 리마인더 발송
    end note
```

### 3.2 shopby 상태 매핑

```mermaid
graph LR
    subgraph "shopby 주문상태"
        S1["입금확인"]
        S2["상품준비중"]
        S3["배송준비중"]
        S4["배송중"]
        S5["배송완료"]
    end

    subgraph "인쇄 커스텀 상태"
        C1["ORDER_RECEIVED"]
        C2["FILE_CHECKING"]
        C3["PRINT_READY"]
        C4["PRINTING"]
        C5["POST_PROCESSING"]
        C6["PACKAGING"]
        C7["SHIPPED"]
        C8["DELIVERING"]
    end

    S1 --> C1
    S2 --> C2
    S2 --> C3
    S3 --> C4
    S3 --> C5
    S3 --> C6
    S4 --> C7
    S5 --> C8
```

### 3.3 상태 변경 시 알림

| 상태 전이 | 알림 방식 | 알림 내용 |
|-----------|----------|----------|
| -> ORDER_RECEIVED | 이메일 + 알림톡 | 주문번호, 예상 제작일 |
| -> PRINT_READY | 알림톡 | 파일 확인 완료, 제작 시작 |
| -> REUPLOAD_WAIT | 알림톡 + SMS | 문제 내용, 재업로드 링크 |
| -> SHIPPED | 알림톡 | 송장번호, 배송조회 링크 |
| -> DELIVERED | 알림톡 | 배송 완료, 리뷰 유도 |

---

## 4. 결제 아키텍처

### 4.1 결제 플로우

```mermaid
sequenceDiagram
    participant C as Client
    participant SP as shopby Provider
    participant PG as KG이니시스
    participant BFF as BFF Server

    C->>SP: 주문서 작성 완료
    SP->>SP: 주문 데이터 유효성 검증
    SP->>PG: 결제 모듈 호출 (신용카드/네이버페이)

    alt 결제 성공
        PG-->>SP: 결제 완료 콜백
        SP->>SP: 주문 생성 (ORDER_RECEIVED)
        SP-->>C: 주문 완료 페이지
        SP->>BFF: POST /api/notifications/order-complete
        BFF-->>C: 이메일 + 알림톡 발송
    else 결제 실패
        PG-->>SP: 결제 실패 콜백
        SP-->>C: 팝업 (실패 사유 + 재시도)
        SP->>BFF: POST /api/notifications/payment-failed
        BFF-->>C: 알림톡 (재결제 링크)
    end
```

### 4.2 배송비 계산 로직

```mermaid
flowchart TD
    A["주문 상품 목록"] --> B{"배너/현수막 포함?"}
    B -->|포함| C["배너 상품 별도 배송비"]
    B -->|미포함| D{"주문 금액 >= 50,000원?"}

    D -->|예| E["배송비 = 0원 (무료배송)"]
    D -->|아니오| F["배송비 = 3,000원"]

    E --> G{"제주/도서산간?"}
    F --> G

    G -->|제주| H["+ 3,000원"]
    G -->|도서산간| I["+ 5,000원"]
    G -->|일반| J["추가 없음"]

    C --> K{"혼합주문?"}
    K -->|예| L["최대 배송비 1건 부과"]
    K -->|아니오| M["각각 계산"]
```

---

## 5. 데이터 모델

### 5.1 커스텀 DB 테이블

```mermaid
erDiagram
    ORDER_FILE {
        string id PK
        string order_no FK
        string s3_key
        string file_name
        int file_size
        string file_format
        string validation_status
        json validation_result
        boolean warning_accepted
        datetime uploaded_at
        datetime expires_at
    }

    OPTION_STORAGE {
        string id PK
        string member_no FK
        string product_no FK
        json print_options
        string file_id FK
        datetime created_at
        datetime expires_at
    }

    PRINT_STATUS {
        string id PK
        string order_no FK
        string shopby_status
        string print_status
        string previous_status
        string changed_by
        datetime changed_at
        string notification_id
    }

    DEFERRED_PAYMENT {
        string id PK
        string order_no FK
        string partner_no FK
        decimal amount
        string status
        datetime payment_due
        datetime paid_at
        string payment_method
    }

    NOTIFICATION_LOG {
        string id PK
        string order_no FK
        string member_no
        string channel
        string template_id
        string content
        string status
        datetime sent_at
    }

    ORDER_FILE ||--o| OPTION_STORAGE : "연결"
    PRINT_STATUS }|--|| ORDER_FILE : "주문 파일"
    DEFERRED_PAYMENT }|--o| PRINT_STATUS : "후불 주문"
    NOTIFICATION_LOG }|--|| PRINT_STATUS : "알림 이력"
```

---

## 6. BFF API 설계

### 6.1 엔드포인트 목록

| 엔드포인트 | Method | 설명 | 인증 |
|-----------|--------|------|------|
| `/api/files/presigned-url` | POST | S3 Presigned URL 발급 | 회원 |
| `/api/files/validate` | POST | PitStop 검증 요청 | 회원 |
| `/api/files/validate/:fileId` | GET | 검증 결과 조회 | 회원 |
| `/api/files/template/:productNo` | GET | PDF 가이드라인 다운로드 | 공개 |
| `/api/storage` | GET/POST/DELETE | 옵션보관함 CRUD | 회원 |
| `/api/orders/status` | GET | 인쇄 공정 상태 조회 | 회원 |
| `/api/orders/status` | PUT | 상태 변경 (관리자) | 관리자 |
| `/api/orders/status/batch` | PUT | 일괄 상태 변경 | 관리자 |
| `/api/orders/print-sheet/:orderNo` | GET | 주문서 PDF 생성 | 관리자 |
| `/api/notifications/send` | POST | 알림톡/SMS 발송 | 관리자 |
| `/api/notifications/batch` | POST | 일괄 발송 | 관리자 |
| `/api/b2b/deferred` | GET/POST/PUT | 후불결제 관리 | 관리자 |
| `/api/receipts/tax-invoice` | POST | 세금계산서 발급 | 관리자 |
| `/api/receipts/cash-receipt` | POST | 현금영수증 발급 | 관리자 |

### 6.2 인증/인가

- 회원 API: shopby accessToken 검증 (JWT)
- 관리자 API: shopby Admin Token + 역할 검증
- 파일 접근: S3 Presigned URL (15분 만료)

---

## 7. 보안 고려사항

| 항목 | 대응 |
|------|------|
| 파일 업로드 악용 | 허용 포맷 화이트리스트, 파일 크기 제한, 바이러스 스캔 |
| 결제 정보 보안 | PG 위임, 카드번호 미저장, PCI-DSS 준수 |
| 주문 데이터 암호화 | HTTPS 전송, AES-256 저장 |
| API 인증 | JWT 토큰 검증, 역할 기반 접근 제어 |
| S3 접근 제어 | Presigned URL (15분), IAM 역할, 버킷 정책 |
| CSRF 방지 | SameSite 쿠키, CSRF 토큰 |
