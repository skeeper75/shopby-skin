# Printly 인쇄 파일처리 자동화 시스템
## 개발 명세서 (Development Specification Document)

**프로젝트명:** Printly Print File Processing Automation  
**문서 버전:** v1.0  
**작성일:** 2026-03-03  
**기술 스택:** Next.js · React · TypeScript · NestJS · AWS S3/SQS · Neon PostgreSQL  
**배포 환경:** Vercel · Railway · Neon  

---

# 목차

1. 프로젝트 개요 및 배경
2. AS-IS 시스템 분석 (CRT DigitalEdit V2)
3. TO-BE 시스템 아키텍처
4. 기술 스택 상세 정의
5. 데이터 모델 설계 (ERD)
6. API 설계 (NestJS)
7. AWS 연동 설계 (S3 · SQS)
8. PDF 파일처리 파이프라인
9. User Flow 및 UI/UX 설계
10. 프론트엔드 화면 설계
11. 에러 처리 및 모니터링
12. 보안 설계
13. 배포 및 인프라
14. 개발 환경 세팅 가이드
15. 개발 범위 및 일정

---

# 1. 프로젝트 개요 및 배경

## 1.1 프로젝트 목적

기존 Windows 데스크톱 기반의 인쇄 파일처리 시스템(CRT DigitalEdit V2)을 웹 기반 SaaS로 전환하여, 고객이 업로드한 PDF 파일을 자동으로 검증·변환·최적화하는 클라우드 네이티브 파이프라인을 구축한다.

## 1.2 핵심 목표

| 구분 | 설명 |
|------|------|
| 클라우드 전환 | Windows 로컬 → AWS 클라우드 기반 처리 |
| 자동화 확대 | 수동 PitStop CLI 실행 → 이벤트 기반 자동 파이프라인 |
| 실시간 모니터링 | 콘솔 로그 → 웹 대시보드 실시간 상태 추적 |
| 확장성 확보 | 단일 서버 → 수평 스케일링 가능한 큐 기반 처리 |
| 접근성 개선 | 데스크톱 앱 → 브라우저 어디서든 접근 |

## 1.3 문서 범위

본 문서는 AS-IS 시스템(C#/.NET 기반 393개 소스 파일, 47개 프로젝트)의 분석 결과를 토대로, TO-BE 시스템의 전체 아키텍처, 데이터 모델, API, UI/UX, 배포 전략을 정의한다. 개발자가 이 문서만으로 환경 세팅부터 개발·배포까지 수행할 수 있도록 작성하였다.

---

# 2. AS-IS 시스템 분석 (CRT DigitalEdit V2)

## 2.1 시스템 구성 개요

기존 시스템은 C# .NET Framework 기반의 Windows 데스크톱 애플리케이션으로, 13개 프레임워크 프로젝트, 16개 클라이언트 모듈, 6개 서버 프로젝트로 구성되어 있다.

```mermaid
graph TB
    subgraph "AS-IS: CRT DigitalEdit V2"
        subgraph "Framework Layer (13개)"
            FW_CORE[CRT.Framework.Core<br/>핵심 기능/상수/설정]
            FW_PDF[CRT.Framework.PDF<br/>PDFLib + Syncfusion]
            FW_AWS[CRT.Framework.AWS<br/>S3/SQS 클라이언트]
            FW_SEC[CRT.Framework.Security<br/>AES 암호화]
            FW_BAR[CRT.Framework.Barcode<br/>ZXing 바코드]
            FW_PIT[CRT.Framework.Pitstop<br/>Enfocus PitStop CLI]
            FW_EXT[CRT.Framework.Extensions<br/>확장 메서드]
        end

        subgraph "Client Layer - WinForms (16개)"
            CL_MAIN[CRT.Yeolim.Main<br/>MDI 컨테이너]
            CL_ORD[Module.Order<br/>주문 관리]
            CL_AUTH[Module.Auth<br/>인증/권한]
            CL_EDU[Module.Education<br/>교육 PDF]
            CL_RPT[Module.Reports<br/>작업지시서]
            CL_STAT[Module.Statistic<br/>통계]
        end

        subgraph "Server Layer (6개)"
            SV_PROC[ServerProcess<br/>PitStop 배치 처리]
            SV_HOT[ServerProcess.HotFolder<br/>폴더 감시]
            SV_SQS[SQSMonitorService<br/>SQS 큐 리스너]
            SV_DATA[Yeolim.Data<br/>DAC/Biz 패턴]
            SV_WEB[Yeolim.Web<br/>WCF 서비스]
        end

        DB[(SQL Server)]
        S3[(AWS S3)]
        SQS[(AWS SQS)]
    end

    CL_MAIN --> CL_ORD & CL_AUTH & CL_EDU & CL_RPT & CL_STAT
    CL_ORD --> SV_WEB
    SV_WEB --> SV_DATA
    SV_DATA --> DB
    SV_SQS --> SV_PROC
    SV_HOT --> SV_PROC
    SV_SQS --> SQS
    SV_PROC --> S3
    SV_PROC --> FW_PIT & FW_PDF & FW_AWS
```

## 2.2 핵심 파일처리 파이프라인 (AS-IS)

기존 시스템의 PDF 파일처리는 3개의 독립 서버 프로세스를 통해 수행된다.

```mermaid
sequenceDiagram
    participant Client as WinForms 클라이언트
    participant WebAPI as WCF Web API
    participant DB as SQL Server
    participant S3 as AWS S3
    participant SQS as AWS SQS
    participant Monitor as SQS Monitor Service
    participant Server as ServerProcess.exe
    participant PitStop as Enfocus PitStop CLI

    Client->>WebAPI: 주문 등록 + PDF 업로드
    WebAPI->>DB: T_JOB_JOB INSERT (STAT_010)
    WebAPI->>S3: PDF 파일 업로드
    S3-->>SQS: S3 이벤트 알림 (ObjectCreated)
    
    loop 큐 폴링 (MaxMsgCntAtATime=10)
        Monitor->>SQS: GetMessagesAsync
        SQS-->>Monitor: S3JsonMessage (Records[].S3.Object.Key)
    end
    
    Monitor->>S3: DownloadFile (bucketNm, s3Key)
    S3-->>Monitor: PDF 파일 다운로드
    Monitor->>Server: CLI 실행 (-in "savePdfFilePath")
    
    Server->>DB: GetJobDetail → STAT_030 (처리 중)
    Server->>DB: ProcessOptions + PDFInfo JSON 조회
    
    rect rgb(255, 240, 230)
        Note over Server,PitStop: PitStop01: 문서 구조 오류 검사
        Server->>PitStop: CheckDocumentStructureProblems
        PitStop-->>Server: EnfocusReport XML
    end
    
    rect rgb(230, 255, 230)
        Note over Server,PitStop: PitStop02: 핵심 처리 (폰트/컬러/페이지)
        Server->>PitStop: EmbedFont + FontOutline + RGB→CMYK + ...
        PitStop-->>Server: 변환된 PDF + Report XML
    end
    
    rect rgb(230, 230, 255)
        Note over Server,PitStop: PitStop03: Font Flatten (조건부)
        Server->>PitStop: Flattening (미임베드 폰트 시)
        PitStop-->>Server: 평탄화된 PDF
    end
    
    Server->>Server: PDF Resize (선택) + ClearMargin (선택)
    Server->>DB: STAT_040 (파일 이동 중)
    Server->>Server: BaseFinalOutputDirectory로 복사
    Server->>S3: UploadFile (결과 PDF)
    Server->>DB: STAT_050 (처리 완료)
    
    Monitor->>SQS: DeleteMessageAsync (ReceiptHandle)
```

## 2.3 Job 상태 코드 체계 (AS-IS 분석)

소스 코드에서 추출한 상태 코드 체계는 다음과 같다.

| 상태 코드 | 의미 | 전이 조건 |
|-----------|------|-----------|
| STAT_010 | 주문 접수 (Job 등록) | 클라이언트에서 주문 생성 시 |
| STAT_020 | 파일 업로드 완료 | S3 업로드 성공 시 |
| STAT_030 | Job 처리 중 | ServerProcess 시작 시 |
| STAT_040 | 처리 완료 - 파일 이동 중 | PitStop 전 과정 완료 시 |
| STAT_050 | Job 처리 완료 | 최종 Output 이동 완료 |
| STAT_900 | Job 오류 | 어느 단계에서든 Exception 시 |

```mermaid
stateDiagram-v2
    [*] --> STAT_010: 주문 접수
    STAT_010 --> STAT_020: PDF 업로드 완료
    STAT_020 --> STAT_030: ServerProcess 시작
    STAT_030 --> STAT_030: PitStop 단계별 진행 로그
    STAT_030 --> STAT_040: PitStop 처리 완료
    STAT_040 --> STAT_050: 파일 이동 + S3 업로드 완료
    STAT_050 --> [*]: 완료

    STAT_010 --> STAT_900: 오류 발생
    STAT_020 --> STAT_900: 오류 발생
    STAT_030 --> STAT_900: PitStop 오류
    STAT_040 --> STAT_900: 파일 이동 오류
```

## 2.4 ProcessOptions 구조 분석

기존 시스템의 핵심 설정 객체인 ProcessOptions를 분석한 결과, PDF 처리에 필요한 모든 옵션이 JSON으로 직렬화되어 DB에 저장된다.

```mermaid
classDiagram
    class ProcessOptions {
        +SizeF CutSize
        +SizeF ArtSize
        +FontOptions FontOptions
        +ChangeColorToCMYK ChangeColorToCMYK
        +PageOptions PageOptions
        +EtcOptions EtcOptions
        +WarningOptions WarningOptions
    }

    class FontOptions {
        +bool NotEmbededFontFlatten
        +bool EmbedFont
        +bool FontOutline
        +bool ChangeCMYKBlackToKBlack
        +bool ChangeRGBBlackToKBlack
    }

    class ChangeColorToCMYK {
        +bool CheckChangeMagentaColorToCMYK
        +bool CheckChangeCyanColorToCMYK
        +bool ChangeRgbToCMYK
        +bool ChangeSpotColorToCMYK
        +bool ChangeToAllBlack
        +int Cyan/Magenta/Yellow/Black
    }

    class PageOptions {
        +ReSizePageScale ReSizePageScale
        +ClearMargin ClearMargin
        +AddEmptyPage AddEmptyPage
    }

    class EtcOptions {
        +bool RemovePrinterMarks
        +bool RemoveInvisibleData
        +bool LayerAndAnnotationFlatten
        +bool ResampleImage
        +int ResampleImageDpi
        +bool SavePdfVersion15
    }

    class WarningOptions {
        +ImagePpi ImagePpi
        +ObjectCloseToPage ObjectCloseToPage
        +InkCoverage InkCoverage
    }

    ProcessOptions --> FontOptions
    ProcessOptions --> ChangeColorToCMYK
    ProcessOptions --> PageOptions
    ProcessOptions --> EtcOptions
    ProcessOptions --> WarningOptions
```

## 2.5 PDF 메타데이터 구조 (PDFInfo)

```mermaid
classDiagram
    class PDFInfo {
        +string FilePath
        +string ServerFilePath
        +int PageCount
        +List~PageInfo~ PageInfoList
        +List~FontInfo~ FontList
        +bool IsFontEmbededAll
        +bool IsSameSize
        +bool IsSameTrimBoxSize
        +string JobGroupId
    }

    class PageInfo {
        +int PageNo
        +SizeF VisiblePageSize
        +BoxInfo MediaBox
        +BoxInfo CropBox
        +BoxInfo TrimBox
        +BoxInfo BleedBox
    }

    class BoxInfo {
        +float X1, Y1, X2, Y2
        +float Width, Height
        +float WidthMM, HeightMM
    }

    class FontInfo {
        +string FontName
        +bool Embeded
    }

    PDFInfo --> PageInfo : 1..*
    PDFInfo --> FontInfo : 0..*
    PageInfo --> BoxInfo : MediaBox
    PageInfo --> BoxInfo : CropBox
    PageInfo --> BoxInfo : TrimBox
    PageInfo --> BoxInfo : BleedBox
```

---

# 3. TO-BE 시스템 아키텍처

## 3.1 전체 시스템 아키텍처

```mermaid
graph TB
    subgraph "클라이언트 (Vercel)"
        NEXT[Next.js 14+ App Router<br/>React · TypeScript · Tailwind · Shadcn]
        UPLOAD[파일 업로드 UI]
        DASH[대시보드]
        STATUS[실시간 상태 모니터링]
    end

    subgraph "API 서버 (Railway)"
        NEST[NestJS API Server]
        AUTH_M[Auth Module<br/>JWT + Passport]
        ORDER_M[Order Module<br/>주문/Job 관리]
        FILE_M[File Module<br/>업로드/다운로드]
        PROC_M[Process Module<br/>처리 옵션 관리]
        NOTI_M[Notification Module<br/>WebSocket + SSE]
        WORKER[Worker Module<br/>SQS Consumer]
    end

    subgraph "AWS Cloud"
        S3_UP[(S3 Bucket<br/>upload/)]
        S3_PROC[(S3 Bucket<br/>processing/)]
        S3_OUT[(S3 Bucket<br/>output/)]
        SQS_IN[SQS Queue<br/>file-upload-events]
        SQS_PROC[SQS Queue<br/>processing-tasks]
        SQS_DLQ[SQS DLQ<br/>실패 메시지]
        SNS[SNS Topic<br/>처리 완료 알림]
        LAMBDA[Lambda Function<br/>PDF 검증/변환]
    end

    subgraph "데이터베이스 (Neon)"
        PG[(PostgreSQL<br/>Neon Serverless)]
    end

    subgraph "외부 서비스"
        PITSTOP[Enfocus PitStop Server<br/>EC2 or On-premise]
    end

    NEXT --> NEST
    UPLOAD --> NEST
    DASH --> NEST
    STATUS -->|WebSocket| NEST
    
    NEST --> PG
    FILE_M -->|Presigned URL| S3_UP
    S3_UP -->|Event| SQS_IN
    WORKER --> SQS_IN
    WORKER --> SQS_PROC
    SQS_PROC --> LAMBDA
    LAMBDA --> PITSTOP
    LAMBDA --> S3_PROC
    PITSTOP --> S3_OUT
    S3_OUT -->|Event| SNS
    SNS --> NOTI_M
    SQS_PROC -.->|실패| SQS_DLQ

    style NEXT fill:#0070f3,color:#fff
    style NEST fill:#e0234e,color:#fff
    style PG fill:#4169e1,color:#fff
    style S3_UP fill:#ff9900,color:#fff
    style S3_PROC fill:#ff9900,color:#fff
    style S3_OUT fill:#ff9900,color:#fff
```

## 3.2 레이어드 아키텍처 상세

```mermaid
graph LR
    subgraph "Presentation Layer"
        A1[Next.js Pages/Routes]
        A2[React Components]
        A3[Shadcn UI Library]
        A4[React Query / SWR]
    end

    subgraph "API Gateway Layer"
        B1[NestJS Controllers]
        B2[DTO Validation<br/>class-validator]
        B3[Guards<br/>JWT Auth]
        B4[Interceptors<br/>Logging/Transform]
    end

    subgraph "Business Logic Layer"
        C1[Services]
        C2[Use Cases]
        C3[Domain Events]
    end

    subgraph "Infrastructure Layer"
        D1[Prisma ORM]
        D2[AWS SDK v3]
        D3[Bull Queue]
        D4[WebSocket Gateway]
    end

    subgraph "External"
        E1[(Neon PostgreSQL)]
        E2[(AWS S3)]
        E3[(AWS SQS)]
        E4[PitStop Server]
    end

    A1 --> B1
    A2 --> A4
    A4 --> B1
    B1 --> B2 --> B3 --> C1
    C1 --> C2
    C2 --> D1 & D2 & D3
    D1 --> E1
    D2 --> E2
    D3 --> E3
    D4 --> A1
```

---

# 4. 기술 스택 상세 정의

## 4.1 프론트엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14+ (App Router) | SSR/SSG, 라우팅, 미들웨어 |
| React | 18+ | UI 컴포넌트 |
| TypeScript | 5.x | 타입 안전성 |
| Tailwind CSS | 3.x | 유틸리티 기반 스타일링 |
| Shadcn/ui | latest | 재사용 가능한 UI 컴포넌트 |
| React Query | 5.x | 서버 상태 관리 + 캐싱 |
| Zustand | 4.x | 클라이언트 상태 관리 |
| React Hook Form | 7.x | 폼 상태 관리 |
| Zod | 3.x | 런타임 스키마 검증 |
| Recharts | 2.x | 차트/통계 시각화 |

## 4.2 백엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| NestJS | 10.x | API 프레임워크 |
| Prisma | 5.x | ORM + 마이그레이션 |
| @nestjs/bull | latest | 작업 큐 (Redis 기반) |
| @nestjs/websockets | latest | 실시간 통신 |
| @aws-sdk/client-s3 | 3.x | S3 파일 관리 |
| @aws-sdk/client-sqs | 3.x | SQS 메시지 관리 |
| class-validator | latest | DTO 유효성 검증 |
| Passport + JWT | latest | 인증 |
| pdf-lib | latest | 서버사이드 PDF 메타데이터 추출 |

## 4.3 인프라

| 서비스 | 용도 | 비고 |
|--------|------|------|
| Vercel | 프론트엔드 배포 | Next.js 최적화 |
| Railway | 백엔드 배포 | NestJS + Worker |
| Neon | PostgreSQL DB | Serverless, 브랜치 지원 |
| AWS S3 | 파일 저장소 | 업로드/처리/결과 3개 prefix |
| AWS SQS | 메시지 큐 | Standard + DLQ |
| AWS Lambda | PDF 처리 워커 | 선택적 (EC2 대체 가능) |
| Redis (Upstash) | 캐시 + Bull Queue | Railway 애드온 |

---

# 5. 데이터 모델 설계 (ERD)

## 5.1 전체 ERD

```mermaid
erDiagram
    COMPANY {
        uuid id PK
        varchar company_code UK "예: HUNI, MYCOM"
        varchar name
        jsonb settings "회사별 설정"
        timestamp created_at
    }

    USER {
        uuid id PK
        uuid company_id FK
        varchar email UK
        varchar password_hash
        varchar name
        enum role "ADMIN, OPERATOR, VIEWER"
        boolean is_active
        timestamp created_at
        timestamp last_login_at
    }

    ORDER {
        uuid id PK
        uuid company_id FK
        uuid customer_id FK
        varchar order_no UK "자동 채번"
        varchar title
        text description
        enum status "DRAFT, CONFIRMED, PROCESSING, COMPLETED, CANCELLED"
        jsonb metadata
        timestamp ordered_at
        timestamp created_at
    }

    CUSTOMER {
        uuid id PK
        uuid company_id FK
        varchar name
        varchar email
        varchar phone
        varchar company_name
        timestamp created_at
    }

    JOB {
        uuid id PK
        uuid order_id FK
        uuid company_id FK
        int job_sequence "주문 내 순번"
        varchar job_title
        enum status "PENDING, UPLOADING, UPLOADED, QUEUED, PROCESSING, PITSTOP_01, PITSTOP_02, PITSTOP_03, RESIZE, CLEAR_MARGIN, MOVING, COMPLETED, ERROR"
        varchar s3_input_key
        varchar s3_output_key
        varchar s3_result_key
        varchar local_file_name
        jsonb process_options "ProcessOptions JSON"
        jsonb pdf_info "PDFInfo JSON"
        jsonb pitstop_report "Enfocus Report"
        text error_message
        boolean has_error
        timestamp started_at
        timestamp completed_at
        timestamp created_at
    }

    JOB_LOG {
        uuid id PK
        uuid job_id FK
        enum status
        varchar description
        boolean is_error
        text error_detail
        varchar pitstop_config_path
        varchar pitstop_report_path
        varchar variable_set_path
        jsonb report_warnings
        jsonb report_failures
        jsonb report_fixes
        jsonb report_errors
        timestamp created_at
    }

    FILE_ASSET {
        uuid id PK
        uuid job_id FK
        enum asset_type "INPUT, OUTPUT, REPORT, PREVIEW, THUMBNAIL"
        varchar file_name
        varchar s3_key
        varchar s3_bucket
        varchar content_type
        bigint file_size
        varchar checksum_md5
        timestamp created_at
    }

    PROCESS_PRESET {
        uuid id PK
        uuid company_id FK
        varchar name "예: 기본 설정, 교육용, 고품질"
        text description
        jsonb options "ProcessOptions JSON"
        boolean is_default
        timestamp created_at
    }

    COMPANY ||--o{ USER : "has"
    COMPANY ||--o{ ORDER : "has"
    COMPANY ||--o{ CUSTOMER : "has"
    COMPANY ||--o{ PROCESS_PRESET : "has"
    CUSTOMER ||--o{ ORDER : "places"
    ORDER ||--o{ JOB : "contains"
    JOB ||--o{ JOB_LOG : "logs"
    JOB ||--o{ FILE_ASSET : "has"
```

## 5.2 핵심 테이블 상세

### JOB 테이블 상태 머신

```mermaid
stateDiagram-v2
    [*] --> PENDING: Job 생성
    PENDING --> UPLOADING: 파일 업로드 시작
    UPLOADING --> UPLOADED: S3 업로드 완료
    UPLOADED --> QUEUED: SQS 메시지 발행
    QUEUED --> PROCESSING: Worker 수신
    PROCESSING --> PITSTOP_01: 문서 구조 검사 시작
    PITSTOP_01 --> PITSTOP_02: 검사 통과
    PITSTOP_02 --> PITSTOP_03: 폰트 Flatten 필요 시
    PITSTOP_02 --> RESIZE: Flatten 불필요 시
    PITSTOP_03 --> RESIZE: Flatten 완료
    RESIZE --> CLEAR_MARGIN: 리사이즈 완료
    CLEAR_MARGIN --> MOVING: 마진 제거 완료
    MOVING --> COMPLETED: 결과 파일 이동 완료
    
    PITSTOP_01 --> ERROR: 문서 구조 오류
    PITSTOP_02 --> ERROR: 처리 실패
    PITSTOP_03 --> ERROR: Flatten 실패
    RESIZE --> ERROR: 리사이즈 실패
    MOVING --> ERROR: 파일 이동 실패
    
    ERROR --> QUEUED: 재처리 요청
    COMPLETED --> [*]
```

### ProcessOptions JSON 스키마

```json
{
  "cutSize": { "width": 210, "height": 297 },
  "artSize": { "width": 216, "height": 303 },
  "fontOptions": {
    "notEmbeddedFontFlatten": false,
    "embedFont": true,
    "fontOutline": false,
    "changeCMYKBlackToKBlack": true,
    "changeRGBBlackToKBlack": true
  },
  "colorOptions": {
    "changeRgbToCMYK": true,
    "changeSpotColorToCMYK": false,
    "changeToAllBlack": false,
    "targetCyan": 0,
    "targetMagenta": 0,
    "targetYellow": 0,
    "targetBlack": 0
  },
  "pageOptions": {
    "resizePageScale": { "enabled": false, "type": "ART" },
    "clearMargin": { "enabled": false, "left": 0, "top": 0, "right": 0, "bottom": 0 },
    "addEmptyPage": { "firstPage": false, "lastPage": false }
  },
  "etcOptions": {
    "removePrinterMarks": true,
    "removeInvisibleData": true,
    "layerAndAnnotationFlatten": true,
    "resampleImage": false,
    "resampleImageDpi": 300,
    "savePdfVersion15": true
  },
  "warningOptions": {
    "imagePpi": { "check": true, "ppi": 150 },
    "objectCloseToPage": { "check": true, "length": 3 },
    "inkCoverage": { "check": false, "value": 300, "ignoreAreaPt": 6 }
  }
}
```

---

# 6. API 설계 (NestJS)

## 6.1 API 모듈 구조

```mermaid
graph TB
    subgraph "NestJS Application"
        APP[AppModule]
        
        subgraph "Core Modules"
            AUTH[AuthModule<br/>POST /auth/login<br/>POST /auth/register<br/>POST /auth/refresh]
            USER[UserModule<br/>GET /users<br/>GET /users/:id<br/>PATCH /users/:id]
        end
        
        subgraph "Business Modules"
            ORDER[OrderModule<br/>CRUD /orders]
            JOB[JobModule<br/>CRUD /jobs<br/>POST /jobs/:id/retry]
            FILE[FileModule<br/>POST /files/presign<br/>POST /files/confirm<br/>GET /files/:id/download]
            PRESET[PresetModule<br/>CRUD /presets]
        end
        
        subgraph "Infrastructure Modules"
            QUEUE[QueueModule<br/>Bull + SQS Consumer]
            WS[WebSocketModule<br/>Gateway /ws]
            HEALTH[HealthModule<br/>GET /health]
        end
    end

    APP --> AUTH & USER & ORDER & JOB & FILE & PRESET & QUEUE & WS & HEALTH
```

## 6.2 주요 API 엔드포인트

### 파일 업로드 플로우

| 단계 | Method | Endpoint | 설명 |
|------|--------|----------|------|
| 1 | POST | /api/files/presign | Presigned URL 발급 (S3 직접 업로드용) |
| 2 | PUT | (S3 Presigned URL) | 클라이언트 → S3 직접 업로드 |
| 3 | POST | /api/files/confirm | 업로드 완료 확인 + Job 생성 |
| 4 | GET | /api/jobs/:id/status | Job 상태 조회 (폴링 또는 SSE) |
| 5 | GET | /api/files/:id/download | 결과 파일 다운로드 |

### 주문 관리 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/orders | 주문 생성 |
| GET | /api/orders | 주문 목록 (필터/페이지네이션) |
| GET | /api/orders/:id | 주문 상세 + Job 목록 |
| PATCH | /api/orders/:id | 주문 수정 |
| DELETE | /api/orders/:id | 주문 삭제 (소프트) |

### Job 관리 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/jobs | Job 생성 (주문에 파일 추가) |
| GET | /api/jobs | Job 목록 (상태별 필터) |
| GET | /api/jobs/:id | Job 상세 + 로그 |
| POST | /api/jobs/:id/retry | 실패 Job 재처리 |
| POST | /api/jobs/:id/cancel | 처리 중단 |
| GET | /api/jobs/:id/report | PitStop 리포트 조회 |
| GET | /api/jobs/:id/preview | PDF 미리보기 이미지 |

## 6.3 Presigned URL 업로드 시퀀스

```mermaid
sequenceDiagram
    participant Browser as 브라우저
    participant Next as Next.js
    participant API as NestJS API
    participant S3 as AWS S3
    participant SQS as AWS SQS
    participant DB as Neon PostgreSQL

    Browser->>Next: 파일 선택
    Next->>API: POST /api/files/presign<br/>{fileName, contentType, orderId}
    API->>DB: Job INSERT (PENDING)
    API->>S3: createPresignedPost()
    S3-->>API: {url, fields, key}
    API-->>Next: {presignedUrl, jobId, s3Key}
    
    Next->>S3: PUT 파일 업로드 (Presigned URL)
    Note over Next,S3: 대용량 파일 직접 업로드<br/>(서버 부하 없음)
    S3-->>Next: 200 OK
    
    Next->>API: POST /api/files/confirm<br/>{jobId, s3Key}
    API->>DB: Job UPDATE (UPLOADED)
    API->>SQS: SendMessage({jobId, s3Key})
    API-->>Next: {status: "QUEUED"}
    
    Note over Next: 실시간 상태 모니터링 시작
    Next-->API: WebSocket /ws/jobs/:id
```

---

# 7. AWS 연동 설계 (S3 · SQS)

## 7.1 S3 버킷 구조

```
printly-files-{env}/
├── uploads/                          # 고객 원본 파일
│   └── {company_id}/
│       └── {YYYY-MM-DD}/
│           └── {job_id}_{filename}.pdf
│
├── processing/                       # 처리 중간 파일
│   └── {company_id}/
│       └── {YYYY-MM-DD}/
│           └── {job_id}/
│               ├── [step1]_output.pdf
│               ├── [step2]_output.pdf
│               ├── config.xml
│               ├── variable_set.evl
│               └── report.xml
│
├── output/                           # 최종 결과 파일
│   └── {company_id}/
│       └── {YYYY-MM-DD}/
│           └── {job_title}/
│               └── [{job_id}]_{filename}_완료.pdf
│
└── previews/                         # 미리보기 이미지
    └── {job_id}/
        ├── thumb_page1.jpg
        └── preview_page1.jpg
```

## 7.2 SQS 큐 설계

```mermaid
graph LR
    subgraph "Producer"
        API[NestJS API]
    end

    subgraph "SQS Queues"
        Q1[printly-file-processing<br/>Standard Queue<br/>VisibilityTimeout: 600s<br/>RetentionPeriod: 7d]
        Q2[printly-file-processing-dlq<br/>Dead Letter Queue<br/>maxReceiveCount: 3]
        Q3[printly-notifications<br/>Status Change Events]
    end

    subgraph "Consumer"
        W1[Worker Process<br/>Railway]
        W2[Notification Handler]
    end

    API -->|SendMessage| Q1
    Q1 -->|ReceiveMessage| W1
    Q1 -.->|실패 3회| Q2
    W1 -->|상태 변경| Q3
    Q3 --> W2
    W2 -->|WebSocket Push| API
```

## 7.3 SQS 메시지 포맷

```json
{
  "messageType": "FILE_PROCESSING_REQUEST",
  "version": "1.0",
  "payload": {
    "jobId": "uuid",
    "companyId": "uuid",
    "s3Key": "uploads/company-id/2026-03-03/job-id_file.pdf",
    "s3Bucket": "printly-files-production",
    "processOptions": { "...ProcessOptions JSON..." },
    "pdfInfo": { "...PDFInfo JSON..." },
    "callbackUrl": "https://api.printly.io/api/jobs/{jobId}/callback",
    "priority": "NORMAL",
    "retryCount": 0
  },
  "metadata": {
    "timestamp": "2026-03-03T12:00:00Z",
    "source": "printly-api",
    "traceId": "uuid"
  }
}
```

---

# 8. PDF 파일처리 파이프라인

## 8.1 전체 처리 파이프라인

```mermaid
graph TB
    START([파일 업로드 완료]) --> VALIDATE

    subgraph "Step 1: 검증"
        VALIDATE[PDF 유효성 검증<br/>pdf-lib으로 메타데이터 추출]
        VALIDATE --> CHECK_PAGE[페이지 수/사이즈 확인]
        CHECK_PAGE --> CHECK_FONT[폰트 임베딩 확인]
        CHECK_FONT --> CHECK_COLOR[색상 공간 확인]
        CHECK_COLOR --> GEN_INFO[PDFInfo JSON 생성]
    end

    GEN_INFO --> QUEUE[SQS 큐에 발행]

    subgraph "Step 2: PitStop 01 - 문서 구조 검사"
        PS1[CheckDocumentStructureProblems]
        PS1 --> PS1_RPT{Report 확인}
        PS1_RPT -->|Failure/Error| ERR1[에러 처리<br/>STAT_900]
        PS1_RPT -->|Pass| PS2_START
    end

    subgraph "Step 3: PitStop 02 - 핵심 변환"
        PS2_START[Action List 동적 구성]
        PS2_START --> FONT[폰트 처리<br/>Embed + Outline + K-Black]
        FONT --> COLOR[색상 변환<br/>RGB→CMYK + Spot→CMYK]
        COLOR --> PAGE[페이지 처리<br/>빈 페이지 추가]
        PAGE --> ETC[기타 처리<br/>마크 제거 + 레이어 평탄화]
        ETC --> WARN[경고 검사<br/>DPI + 객체 근접 + 잉크 농도]
    end

    subgraph "Step 4: 조건부 처리"
        FLATTEN{폰트 미임베드?}
        FLATTEN -->|Yes| PS3[PitStop 03<br/>Font Flattening]
        FLATTEN -->|No| RESIZE_CHK
        PS3 --> RESIZE_CHK
        
        RESIZE_CHK{리사이즈 필요?}
        RESIZE_CHK -->|Yes| RESIZE[PDFLib Resize<br/>Art/Cut Size 기준]
        RESIZE_CHK -->|No| MARGIN_CHK
        RESIZE --> MARGIN_CHK
        
        MARGIN_CHK{마진 제거?}
        MARGIN_CHK -->|Yes| MARGIN[PDFLib ClearMargin<br/>L/T/R/B]
        MARGIN_CHK -->|No| OUTPUT
        MARGIN --> OUTPUT
    end

    subgraph "Step 5: 결과 처리"
        OUTPUT[최종 PDF 파일]
        OUTPUT --> LOCAL_COPY[로컬 Output 폴더 복사]
        LOCAL_COPY --> S3_UPLOAD[S3 Output 업로드]
        S3_UPLOAD --> DB_UPDATE[DB 상태 업데이트<br/>STAT_050]
        DB_UPDATE --> NOTIFY[WebSocket 완료 알림]
    end

    QUEUE --> PS1
    PS1_RPT -->|Pass| PS2_START
    WARN --> FLATTEN

    ERR1 --> NOTIFY_ERR[에러 알림]

    style START fill:#4caf50,color:#fff
    style ERR1 fill:#f44336,color:#fff
    style NOTIFY fill:#2196f3,color:#fff
```

## 8.2 PitStop Action 매핑 (AS-IS → TO-BE)

기존 EnumActionType 기반 Action을 새로운 시스템의 ProcessingStep으로 매핑한다.

| AS-IS EnumActionType | 카테고리 | TO-BE ProcessingStep | 조건 |
|---------------------|----------|---------------------|------|
| CheckDocumentStructureProblems | 검증 | VALIDATE_STRUCTURE | 항상 실행 |
| EmbedFont | 폰트 | EMBED_FONT | fontOptions.embedFont = true |
| FontOutline | 폰트 | FONT_OUTLINE | fontOptions.fontOutline = true |
| ChangeCMYKBlackToKBlack | 폰트 | CMYK_BLACK_TO_K | fontOptions.changeCMYKBlackToKBlack |
| ChangeRGBBlackToKBlack | 폰트 | RGB_BLACK_TO_K | fontOptions.changeRGBBlackToKBlack |
| AddBackground | 폰트 | ADD_BACKGROUND | 미임베드 + Flatten 체크 시 |
| ChangeRgbToCMYK | 색상 | RGB_TO_CMYK | colorOptions.changeRgbToCMYK |
| ChangeSpotColorToCMYK | 색상 | SPOT_TO_CMYK | colorOptions.changeSpotColorToCMYK |
| ChangeMagentaToCMYK | 색상 | MAGENTA_TO_CMYK | 마젠타 변환 체크 시 |
| ChangeCyanToCMYK | 색상 | CYAN_TO_CMYK | 시안 변환 체크 시 |
| ChangeAllBlack | 색상 | ALL_BLACK | colorOptions.changeToAllBlack |
| AddEmptyPageFirst/Last | 페이지 | ADD_EMPTY_PAGE | pageOptions.addEmptyPage |
| RemovePrinterMarks | 기타 | REMOVE_MARKS | TrimBox 존재 시 |
| RemoveInvisibleData | 기타 | REMOVE_INVISIBLE | etcOptions.removeInvisibleData |
| LayerAndAnnotationFlatten | 기타 | FLATTEN_LAYERS | etcOptions.layerAndAnnotationFlatten |
| ResampleImage | 기타 | RESAMPLE_IMAGE | etcOptions.resampleImage |
| SavePdfVersion15 | 기타 | SAVE_PDF_1_5 | etcOptions.savePdfVersion15 |
| CheckImageDPI | 경고 | CHECK_IMAGE_DPI | warningOptions.imagePpi.check |
| CheckObjectCloseToPage | 경고 | CHECK_OBJECT_PROXIMITY | warningOptions.objectCloseToPage.check |

---

# 9. User Flow 및 UI/UX 설계

## 9.1 전체 User Flow

```mermaid
flowchart TB
    A([사용자 접속]) --> B{로그인 상태?}
    B -->|No| C[로그인 페이지]
    C --> D{인증 성공?}
    D -->|No| C
    D -->|Yes| E[대시보드]
    B -->|Yes| E

    E --> F{어떤 작업?}
    
    F -->|새 주문| G[주문 생성]
    G --> H[주문 정보 입력<br/>고객명, 제목, 설명]
    H --> I[PDF 파일 업로드<br/>드래그앤드롭 / 선택]
    I --> J[처리 옵션 선택<br/>프리셋 또는 커스텀]
    J --> K[업로드 진행<br/>프로그래스 바]
    K --> L[주문 확인 및 제출]
    L --> M[처리 대기열 진입]
    
    F -->|주문 조회| N[주문 목록]
    N --> O[주문 상세]
    O --> P[Job 상태 모니터링<br/>실시간 업데이트]
    P --> Q{처리 완료?}
    Q -->|Yes| R[결과 다운로드<br/>보고서 확인]
    Q -->|Error| S[에러 상세 확인<br/>재처리 요청]
    Q -->|No| P
    
    F -->|설정| T[처리 프리셋 관리]
    T --> U[프리셋 CRUD]
    
    F -->|통계| V[처리 통계<br/>대시보드]

    style A fill:#4caf50,color:#fff
    style R fill:#2196f3,color:#fff
    style S fill:#f44336,color:#fff
```

## 9.2 파일 업로드 상세 User Flow

```mermaid
flowchart TB
    A[파일 선택/드래그] --> B{파일 유효성?}
    B -->|PDF 아님| C[⚠️ "PDF 파일만 업로드 가능합니다"]
    B -->|100MB 초과| D[⚠️ "파일 크기 제한: 100MB"]
    B -->|유효| E[파일 정보 표시<br/>이름, 크기, 페이지 수]
    
    E --> F[처리 옵션 패널]
    F --> G{프리셋 사용?}
    G -->|Yes| H[프리셋 선택<br/>드롭다운]
    G -->|No| I[커스텀 옵션<br/>아코디언 폼]
    
    I --> I1[폰트 옵션]
    I --> I2[색상 옵션]
    I --> I3[페이지 옵션]
    I --> I4[기타 옵션]
    I --> I5[경고 옵션]
    
    H --> J[업로드 시작 버튼]
    I1 & I2 & I3 & I4 & I5 --> J
    
    J --> K[Presigned URL 요청]
    K --> L[S3 직접 업로드<br/>프로그래스 바 표시]
    L --> M[업로드 완료 확인]
    M --> N[✅ "업로드 완료! 처리가 시작됩니다"]
    N --> O[Job 상태 카드 표시<br/>실시간 업데이트 시작]
```

## 9.3 실시간 상태 모니터링 Flow

```mermaid
sequenceDiagram
    participant User as 사용자 브라우저
    participant WS as WebSocket
    participant API as NestJS
    participant Worker as Worker Process
    participant DB as PostgreSQL

    User->>WS: Connect /ws/jobs/{jobId}
    WS-->>User: Connected ✓
    
    Worker->>DB: UPDATE status = PROCESSING
    Worker->>API: Status Changed Event
    API->>WS: Push {status: PROCESSING, step: "PitStop 01"}
    WS-->>User: 🔄 "문서 구조 검사 중..."

    Worker->>DB: UPDATE status = PITSTOP_02
    Worker->>API: Status Changed Event
    API->>WS: Push {status: PITSTOP_02, step: "폰트/색상 변환 중"}
    WS-->>User: 🔄 "폰트 임베딩 및 색상 변환 중..."

    Worker->>DB: UPDATE status = COMPLETED
    Worker->>API: Status Changed Event
    API->>WS: Push {status: COMPLETED, outputUrl: "..."}
    WS-->>User: ✅ "처리 완료! 다운로드 가능"
    
    User->>WS: Disconnect
```

---

# 10. 프론트엔드 화면 설계

## 10.1 화면 구성도 (Sitemap)

```mermaid
graph TB
    ROOT["/"] --> LOGIN["/login<br/>로그인"]
    ROOT --> DASH["/dashboard<br/>대시보드"]
    
    DASH --> ORD_LIST["/orders<br/>주문 목록"]
    ORD_LIST --> ORD_NEW["/orders/new<br/>새 주문"]
    ORD_LIST --> ORD_DETAIL["/orders/:id<br/>주문 상세"]
    ORD_DETAIL --> JOB_DETAIL["/orders/:id/jobs/:jobId<br/>Job 상세"]
    
    DASH --> PRESET["/settings/presets<br/>프리셋 관리"]
    PRESET --> PRESET_NEW["/settings/presets/new<br/>프리셋 생성"]
    PRESET --> PRESET_EDIT["/settings/presets/:id<br/>프리셋 수정"]
    
    DASH --> STATS["/statistics<br/>통계"]
    DASH --> SETTINGS["/settings<br/>설정"]
    SETTINGS --> COMPANY["/settings/company<br/>회사 설정"]
    SETTINGS --> USERS["/settings/users<br/>사용자 관리"]

    style ROOT fill:#333,color:#fff
    style DASH fill:#0070f3,color:#fff
    style ORD_NEW fill:#4caf50,color:#fff
```

## 10.2 주요 화면 와이어프레임 설명

### 대시보드 (Dashboard)

```
┌─────────────────────────────────────────────────────────┐
│  🏠 Printly     📦 주문    ⚙️ 설정    📊 통계    👤     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  오늘의 현황                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 대기 중   │ │ 처리 중   │ │ 완료      │ │ 오류      │    │
│  │   12     │ │    5     │ │   83     │ │    2     │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                         │
│  실시간 처리 현황                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Job #1234  명함_앞면.pdf      ████████░░ 80%     │    │
│  │ Job #1235  전단지_A4.pdf      ██████░░░░ 60%     │    │
│  │ Job #1236  카탈로그.pdf       ███░░░░░░░ 30%     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  최근 주문                          처리량 추이 (7일)     │
│  ┌──────────────────────┐   ┌────────────────────────┐  │
│  │ #ORD-2026-0301  처리중│   │     📈 Recharts       │  │
│  │ #ORD-2026-0300  완료  │   │     Line/Bar Chart    │  │
│  │ #ORD-2026-0299  완료  │   │                        │  │
│  └──────────────────────┘   └────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 새 주문 생성 (New Order)

```
┌─────────────────────────────────────────────────────────┐
│  ← 주문 목록    새 주문 생성                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Step 1: 주문 정보                                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 고객명*    [________________▼]  (기존 고객 검색)   │    │
│  │ 주문명*    [________________________]             │    │
│  │ 설명       [________________________]             │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Step 2: 파일 업로드                                     │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                   │    │
│  │     ┌────────────────────────────────┐            │    │
│  │     │   📄  여기에 PDF를 끌어놓거나     │            │    │
│  │     │       클릭하여 선택하세요         │            │    │
│  │     │   (최대 100MB, PDF만 가능)       │            │    │
│  │     └────────────────────────────────┘            │    │
│  │                                                   │    │
│  │  업로드된 파일:                                      │    │
│  │  ✅ 명함_앞면.pdf (2.3MB, 1p)    [🗑️]             │    │
│  │  ✅ 명함_뒷면.pdf (1.8MB, 1p)    [🗑️]             │    │
│  │  ⏳ 전단지.pdf     ████░░ 40%                     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Step 3: 처리 옵션                                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 프리셋: [기본 설정 ▼]  또는  [커스텀 설정 열기 ▶]   │    │
│  │                                                   │    │
│  │ ▼ 폰트 옵션                                       │    │
│  │   ☑ 폰트 임베딩    ☐ 폰트 아웃라인                 │    │
│  │   ☑ CMYK Black → K  ☑ RGB Black → K              │    │
│  │                                                   │    │
│  │ ▶ 색상 옵션  ▶ 페이지 옵션  ▶ 기타 옵션             │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│                              [취소]  [💾 주문 제출]       │
└─────────────────────────────────────────────────────────┘
```

### Job 상세 화면

```
┌─────────────────────────────────────────────────────────┐
│  ← 주문 #ORD-2026-0301    Job 상세                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  명함_앞면.pdf                                           │
│  ┌────────────┐  상태: ✅ 처리 완료                      │
│  │            │  페이지: 1p (90×50mm)                    │
│  │  PDF 미리   │  폰트: 3개 (전체 임베딩됨)                │
│  │  보기 영역   │  소요시간: 12.3초                        │
│  │            │                                         │
│  └────────────┘  [📥 결과 다운로드]  [🔄 재처리]          │
│                                                         │
│  처리 타임라인                                            │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ●─ 14:30:01  UPLOADED      파일 업로드 완료        │    │
│  │ ●─ 14:30:02  QUEUED        처리 대기열 진입        │    │
│  │ ●─ 14:30:05  PITSTOP_01    문서 구조 검사 통과     │    │
│  │ ●─ 14:30:08  PITSTOP_02    폰트/색상 변환 완료     │    │
│  │    Warnings: 이미지 해상도 150dpi 미만 (2건)        │    │
│  │ ●─ 14:30:12  COMPLETED     처리 완료 ✅            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  PitStop 리포트                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ⚠️ Warnings (2)                                   │    │
│  │   - 페이지 1: 이미지 해상도 120dpi (권장 150dpi)    │    │
│  │   - 페이지 1: 객체가 재단선에서 2mm 이내            │    │
│  │ ✅ Fixes (5)                                      │    │
│  │   - RGB → CMYK 변환: 3건                          │    │
│  │   - 폰트 임베딩: 2건                               │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

# 11. 에러 처리 및 모니터링

## 11.1 에러 처리 전략

```mermaid
flowchart TB
    ERR([에러 발생]) --> TYPE{에러 유형?}
    
    TYPE -->|파일 유효성| V[검증 에러]
    V --> V1[사용자에게 즉시 알림<br/>"유효하지 않은 PDF입니다"]
    V1 --> V2[Job 상태: ERROR<br/>재업로드 안내]
    
    TYPE -->|PitStop 처리| P[처리 에러]
    P --> P1{Failure?}
    P1 -->|Document Structure| P2[문서 구조 오류<br/>재처리 불가 → 수정 필요]
    P1 -->|Font/Color| P3[변환 오류<br/>자동 재시도 1회]
    P3 --> P4{재시도 성공?}
    P4 -->|No| P5[DLQ 이동<br/>관리자 알림]
    P4 -->|Yes| P6[정상 완료]
    
    TYPE -->|인프라| I[시스템 에러]
    I --> I1[S3/SQS 연결 실패]
    I1 --> I2[지수 백오프 재시도<br/>최대 3회]
    I2 --> I3{복구?}
    I3 -->|No| I4[Circuit Breaker<br/>관리자 알림]
    I3 -->|Yes| I5[정상 복구]
    
    TYPE -->|타임아웃| T[타임아웃]
    T --> T1[ExecuteTimeoutSec: 600<br/>SQS VisibilityTimeout: 900]
    T1 --> T2[메시지 자동 재처리<br/>maxReceiveCount: 3]

    style ERR fill:#f44336,color:#fff
    style P6 fill:#4caf50,color:#fff
    style I5 fill:#4caf50,color:#fff
```

## 11.2 모니터링 대시보드 지표

| 지표 | 측정 방법 | 알림 임계값 |
|------|-----------|------------|
| 처리 대기 Job 수 | SQS ApproximateNumberOfMessages | > 50 |
| DLQ 메시지 수 | SQS DLQ 모니터링 | > 0 |
| 평균 처리 시간 | Job started_at ~ completed_at | > 120초 |
| 에러율 | ERROR / 전체 Job | > 5% |
| S3 스토리지 사용량 | CloudWatch | > 80% 알림 |
| API 응답 시간 | p99 latency | > 2초 |
| WebSocket 연결 수 | 동시 접속 | > 500 |

---

# 12. 보안 설계

## 12.1 인증/인가 Flow

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Next as Next.js
    participant API as NestJS
    participant DB as PostgreSQL

    User->>Next: 로그인 폼 제출
    Next->>API: POST /auth/login {email, password}
    API->>DB: 사용자 조회 + bcrypt 검증
    DB-->>API: User 정보
    API-->>Next: {accessToken (15min), refreshToken (7d)}
    Next->>Next: httpOnly Cookie에 저장
    
    Note over Next,API: 이후 모든 API 요청
    Next->>API: Authorization: Bearer {accessToken}
    API->>API: JWT Guard 검증
    API->>API: Role Guard (ADMIN/OPERATOR/VIEWER)
    API-->>Next: 응답 데이터
    
    Note over Next,API: 토큰 만료 시
    Next->>API: POST /auth/refresh {refreshToken}
    API-->>Next: 새 {accessToken}
```

## 12.2 S3 보안 정책

| 항목 | 설정 |
|------|------|
| 버킷 접근 | Private (Public Access Block 활성화) |
| 업로드 | Presigned URL (5분 만료) |
| 다운로드 | Presigned URL (1시간 만료) |
| 암호화 | SSE-S3 (AES-256) |
| 버전 관리 | 활성화 (실수 복구용) |
| 수명 주기 | processing/ 30일 후 삭제, output/ 90일 후 Glacier |

---

# 13. 배포 및 인프라

## 13.1 배포 아키텍처

```mermaid
graph TB
    subgraph "CI/CD Pipeline"
        GH[GitHub Repository]
        GHA[GitHub Actions]
    end

    subgraph "Vercel (Frontend)"
        V_PROD[Production<br/>printly.io]
        V_PREV[Preview<br/>PR별 미리보기]
    end

    subgraph "Railway (Backend)"
        R_API[API Service<br/>NestJS]
        R_WORKER[Worker Service<br/>SQS Consumer]
        R_REDIS[Redis<br/>Bull Queue + Cache]
    end

    subgraph "Neon (Database)"
        N_MAIN[Main Branch<br/>Production]
        N_DEV[Dev Branch<br/>Development]
        N_PR[PR Branch<br/>자동 생성/삭제]
    end

    subgraph "AWS"
        S3[(S3 Bucket)]
        SQS[SQS Queues]
        CF[CloudFront CDN<br/>미리보기 이미지]
    end

    GH -->|push main| GHA
    GHA -->|deploy| V_PROD
    GHA -->|deploy| R_API & R_WORKER
    GHA -->|PR| V_PREV
    GHA -->|migrate| N_MAIN

    R_API --> N_MAIN
    R_API --> S3
    R_API --> SQS
    R_WORKER --> SQS
    R_WORKER --> S3
    R_WORKER --> N_MAIN
    V_PROD --> R_API
    CF --> S3

    style V_PROD fill:#000,color:#fff
    style R_API fill:#e0234e,color:#fff
    style N_MAIN fill:#4169e1,color:#fff
```

## 13.2 환경별 설정

| 환경 | Frontend | Backend | Database | AWS |
|------|----------|---------|----------|-----|
| Local | localhost:3000 | localhost:4000 | Neon Dev Branch | LocalStack |
| Preview | xxx.vercel.app | Railway Preview | Neon PR Branch | Dev S3/SQS |
| Production | printly.io | api.printly.io | Neon Main | Prod S3/SQS |

## 13.3 환경변수

```
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000

# Backend (.env)
DATABASE_URL=postgresql://...@ep-xxx.ap-northeast-1.aws.neon.tech/printly
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=printly-files-dev
SQS_QUEUE_URL=https://sqs.ap-northeast-2.amazonaws.com/.../printly-file-processing
SQS_DLQ_URL=https://sqs.ap-northeast-2.amazonaws.com/.../printly-file-processing-dlq

REDIS_URL=redis://...
```

---

# 14. 개발 환경 세팅 가이드

## 14.1 필수 도구

| 도구 | 버전 | 설치 |
|------|------|------|
| Node.js | 20 LTS | fnm 또는 nvm |
| pnpm | 8+ | npm install -g pnpm |
| Docker | 24+ | Docker Desktop |
| AWS CLI | 2.x | brew install awscli |
| Git | 2.40+ | 기본 설치 |

## 14.2 프로젝트 구조 (Monorepo)

```
printly/
├── apps/
│   ├── web/                    # Next.js 프론트엔드
│   │   ├── app/                # App Router
│   │   │   ├── (auth)/         # 인증 레이아웃 그룹
│   │   │   │   └── login/
│   │   │   ├── (dashboard)/    # 대시보드 레이아웃 그룹
│   │   │   │   ├── orders/
│   │   │   │   ├── statistics/
│   │   │   │   └── settings/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/             # Shadcn 컴포넌트
│   │   │   ├── orders/         # 주문 관련 컴포넌트
│   │   │   ├── jobs/           # Job 관련 컴포넌트
│   │   │   └── common/         # 공통 컴포넌트
│   │   ├── hooks/              # 커스텀 훅
│   │   ├── lib/                # 유틸리티
│   │   └── types/              # TypeScript 타입
│   │
│   └── api/                    # NestJS 백엔드
│       ├── src/
│       │   ├── auth/           # 인증 모듈
│       │   ├── orders/         # 주문 모듈
│       │   ├── jobs/           # Job 모듈
│       │   ├── files/          # 파일 모듈
│       │   ├── presets/        # 프리셋 모듈
│       │   ├── workers/        # SQS Worker 모듈
│       │   ├── notifications/  # WebSocket 모듈
│       │   ├── common/         # 공통 (Guards, Pipes, Filters)
│       │   ├── prisma/         # Prisma 모듈
│       │   └── main.ts
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
│
├── packages/
│   ├── shared/                 # 공유 타입/유틸
│   │   ├── types/              # 공유 TypeScript 타입
│   │   ├── constants/          # 공유 상수
│   │   └── validators/         # Zod 스키마
│   └── config/                 # 공유 설정
│       ├── eslint/
│       ├── tsconfig/
│       └── tailwind/
│
├── docker-compose.yml          # 로컬 개발 환경
├── pnpm-workspace.yaml
├── turbo.json                  # Turborepo 설정
└── README.md
```

## 14.3 초기 세팅 명령어

```bash
# 1. 저장소 클론
git clone https://github.com/printly/printly.git
cd printly

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# 4. 로컬 인프라 시작 (Redis, LocalStack)
docker-compose up -d

# 5. DB 마이그레이션
cd apps/api
pnpm prisma migrate dev

# 6. 시드 데이터
pnpm prisma db seed

# 7. 개발 서버 시작 (Turborepo)
cd ../..
pnpm dev
```

## 14.4 docker-compose.yml

```yaml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  localstack:
    image: localstack/localstack:latest
    ports:
      - '4566:4566'
    environment:
      - SERVICES=s3,sqs
      - DEFAULT_REGION=ap-northeast-2
    volumes:
      - ./scripts/localstack-init.sh:/etc/localstack/init/ready.d/init.sh
```

---

# 15. 개발 범위 및 일정

## 15.1 개발 단계 (Phase)

```mermaid
gantt
    title Printly 파일처리 시스템 개발 일정
    dateFormat  YYYY-MM-DD
    
    section Phase 1: 기반 구축 (4주)
    프로젝트 세팅 + Monorepo       :p1_1, 2026-03-10, 5d
    DB 스키마 + Prisma 마이그레이션  :p1_2, after p1_1, 3d
    NestJS 기본 모듈 (Auth/User)    :p1_3, after p1_2, 5d
    Next.js 레이아웃 + 로그인       :p1_4, after p1_2, 5d
    AWS S3/SQS 연동 모듈           :p1_5, after p1_3, 4d
    
    section Phase 2: 핵심 기능 (6주)
    주문 CRUD (API + UI)           :p2_1, after p1_5, 7d
    파일 업로드 (Presigned URL)     :p2_2, after p2_1, 5d
    SQS Worker + 처리 파이프라인    :p2_3, after p2_2, 10d
    PitStop 연동 (Action 매핑)     :p2_4, after p2_3, 7d
    결과 처리 + S3 업로드           :p2_5, after p2_4, 5d
    
    section Phase 3: 실시간 + UX (3주)
    WebSocket 실시간 상태           :p3_1, after p2_5, 5d
    대시보드 + 통계                 :p3_2, after p3_1, 5d
    PitStop 리포트 뷰어             :p3_3, after p3_2, 5d
    처리 프리셋 관리                :p3_4, after p3_2, 3d
    
    section Phase 4: 안정화 (3주)
    에러 처리 + DLQ                 :p4_1, after p3_3, 5d
    성능 최적화 + 캐싱              :p4_2, after p4_1, 5d
    E2E 테스트 + QA                :p4_3, after p4_2, 5d
    배포 파이프라인 + 문서화         :p4_4, after p4_3, 5d
```

## 15.2 Phase별 세부 산출물

### Phase 1: 기반 구축 (4주)

| 태스크 | 산출물 | 담당 |
|--------|--------|------|
| Monorepo 세팅 | pnpm + Turborepo 구성 완료 | Full-stack |
| DB 설계 | Prisma schema + 초기 마이그레이션 | Backend |
| 인증 모듈 | JWT 로그인/회원가입/토큰 갱신 | Backend |
| 레이아웃 | Sidebar + Header + 라우팅 구조 | Frontend |
| AWS 모듈 | S3Client + SQSClient NestJS 서비스 | Backend |

### Phase 2: 핵심 기능 (6주)

| 태스크 | 산출물 | 담당 |
|--------|--------|------|
| 주문 관리 | Order CRUD API + UI (목록/상세/생성) | Full-stack |
| 파일 업로드 | Presigned URL + 드래그앤드롭 UI | Full-stack |
| SQS Worker | BullMQ + SQS Consumer 서비스 | Backend |
| PitStop 연동 | ProcessOptions → PitStop Action 변환 | Backend |
| 결과 처리 | 결과 파일 S3 업로드 + DB 업데이트 | Backend |

### Phase 3: 실시간 + UX (3주)

| 태스크 | 산출물 | 담당 |
|--------|--------|------|
| WebSocket | 실시간 Job 상태 업데이트 | Full-stack |
| 대시보드 | 통계 차트 + 실시간 처리 현황 | Frontend |
| 리포트 뷰어 | PitStop Report XML 파싱 + 표시 | Full-stack |
| 프리셋 관리 | 처리 옵션 프리셋 CRUD | Full-stack |

### Phase 4: 안정화 (3주)

| 태스크 | 산출물 | 담당 |
|--------|--------|------|
| 에러 처리 | DLQ 모니터링 + 재시도 로직 | Backend |
| 성능 최적화 | Redis 캐싱 + 쿼리 최적화 | Full-stack |
| E2E 테스트 | Playwright + Jest 테스트 스위트 | QA |
| CI/CD | GitHub Actions + 배포 파이프라인 | DevOps |

## 15.3 우선순위 매트릭스

```mermaid
quadrantChart
    title 기능 우선순위 매트릭스
    x-axis "낮은 임팩트" --> "높은 임팩트"
    y-axis "낮은 긴급도" --> "높은 긴급도"
    quadrant-1 즉시 개발
    quadrant-2 계획 개발
    quadrant-3 검토 후 결정
    quadrant-4 후순위
    "파일 업로드": [0.9, 0.95]
    "PitStop 연동": [0.85, 0.9]
    "주문 관리 CRUD": [0.8, 0.85]
    "실시간 상태": [0.7, 0.7]
    "대시보드": [0.6, 0.5]
    "프리셋 관리": [0.5, 0.4]
    "통계": [0.4, 0.3]
    "사용자 관리": [0.3, 0.6]
    "PDF 미리보기": [0.55, 0.35]
    "DLQ 모니터링": [0.65, 0.55]
```

---

# 부록

## A. AS-IS 소스코드 프로젝트 목록 (47개)

| 분류 | 프로젝트 | 주요 역할 |
|------|---------|-----------|
| Framework | CRT.Framework.Core | 핵심 상수, 설정, 파라미터 |
| Framework | CRT.Framework.PDF | PDFLib + Syncfusion PDF 조작 |
| Framework | CRT.Framework.PDF.Objects | PDFInfo, PageInfo, BoxInfo 객체 |
| Framework | CRT.Framework.AWS | S3Client, SqsClient, AwsConfig |
| Framework | CRT.Framework.Pitstop | PitStop CLI 설정, Report 파싱 |
| Framework | CRT.Framework.Barcode | ZXing 바코드 생성 |
| Framework | CRT.Framework.Security | AES 암호화, 하드웨어 키 |
| Framework | CRT.Framework.Extensions | 확장 메서드 (DataTable, String 등) |
| Framework | CRT.Framework.Utils | CommandLine, PathUtil |
| Framework | CRT.Framework.Attribute | StringValue 커스텀 어트리뷰트 |
| Framework | CRT.Framework.DevExpr | DevExpress WinForms 확장 |
| Framework | CRT.Framework.WinForms | BaseForm, 공통 컨트롤 |
| Client | CRT.Yeolim.Main | MDI 메인 앱 (FrmMain, FrmLogin) |
| Client | CRT.Yeolim.Core | AppConstants, AppGlobalVariant |
| Client | CRT.Yeolim.Objects | ProcessOptions (핵심 설정 객체) |
| Client | CRT.Yeolim.Module.Order | 주문 관리 (FrmOrder, FrmOrderDetail) |
| Client | CRT.Yeolim.Module.Auth | 인증 (FrmUser, FrmAuthGroup) |
| Client | CRT.Yeolim.Module.Education | 교육 PDF 관리 |
| Client | CRT.Yeolim.Module.Common | 공용 코드 관리 |
| Client | CRT.Yeolim.Module.Reports | 작업지시서 리포트 |
| Client | CRT.Yeolim.Module.Statistic | 통계 |
| Client | CRT.Yeolim.Module.Customer | 고객 관리 |
| Server | CRT.Yeolim.ServerProcess | 배치 PDF 처리 (PitStop 01/02/03) |
| Server | CRT.Yeolim.ServerProcess.HotFolder | 핫폴더 감시 + 처리 |
| Server | CRT.Yeolim.SQSMonitorService | SQS 큐 폴링 + ServerProcess 호출 |
| Server | CRT.Yeolim.Data | DAC/Biz 데이터 계층 |
| Server | CRT.Yeolim.Web | WCF 웹 서비스 |
| Tool | CRT.Yeolim.PdfBarcodeWriter | PDF 바코드 삽입 |
| Tool | CRT.Yeolim.PdfClearMargin | PDF 마진 제거 |
| Tool | CRT.Yeolim.PdfResize | PDF 리사이징 |
| Tool | CRT.Yeolim.SaveAsErrorPdf | 에러 PDF 저장 |
| Tool | AddMarginPdf | PDF 마진 추가 |
| Tool | MergePdfs | PDF 병합 |
| Tool | FoxitSaveAs | Foxit SaveAs 변환 |
| Tool | UnEmbededFontList | 미임베드 폰트 목록 |
| Tool | PitStopConfig | PitStop 설정 관리 |
| Tool | RunPitstopCLI | PitStop CLI 실행기 |
| Tool | ShowToastMessage | 토스트 알림 |
| Tool | SpreadSheetAddImage | 엑셀 이미지 추가 |
| Tool | FtpTlsTest | FTP TLS 테스트 |

## B. 핵심 TypeScript 타입 정의 (공유 패키지)

```typescript
// packages/shared/types/job.ts

export enum JobStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  PITSTOP_01 = 'PITSTOP_01',
  PITSTOP_02 = 'PITSTOP_02',
  PITSTOP_03 = 'PITSTOP_03',
  RESIZE = 'RESIZE',
  CLEAR_MARGIN = 'CLEAR_MARGIN',
  MOVING = 'MOVING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface ProcessOptions {
  cutSize: { width: number; height: number };
  artSize: { width: number; height: number };
  fontOptions: FontOptions;
  colorOptions: ColorOptions;
  pageOptions: PageOptions;
  etcOptions: EtcOptions;
  warningOptions: WarningOptions;
}

export interface FontOptions {
  notEmbeddedFontFlatten: boolean;
  embedFont: boolean;
  fontOutline: boolean;
  changeCMYKBlackToKBlack: boolean;
  changeRGBBlackToKBlack: boolean;
}

export interface ColorOptions {
  changeRgbToCMYK: boolean;
  changeSpotColorToCMYK: boolean;
  changeToAllBlack: boolean;
  targetCyan: number;
  targetMagenta: number;
  targetYellow: number;
  targetBlack: number;
}

export interface PageOptions {
  resizePageScale: { enabled: boolean; type: 'ART' | 'CUT' };
  clearMargin: {
    enabled: boolean;
    left: number; top: number;
    right: number; bottom: number;
  };
  addEmptyPage: { firstPage: boolean; lastPage: boolean };
}

export interface PdfInfo {
  filePath: string;
  pageCount: number;
  pages: PageInfo[];
  fonts: FontInfo[];
  isFontEmbeddedAll: boolean;
  isSameSize: boolean;
}

export interface PageInfo {
  pageNo: number;
  visiblePageSize: { width: number; height: number };
  mediaBox: BoxInfo | null;
  cropBox: BoxInfo | null;
  trimBox: BoxInfo | null;
  bleedBox: BoxInfo | null;
}

export interface BoxInfo {
  x1: number; y1: number;
  x2: number; y2: number;
  widthMm: number; heightMm: number;
}
```

## C. Prisma 스키마

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole { ADMIN OPERATOR VIEWER }
enum OrderStatus { DRAFT CONFIRMED PROCESSING COMPLETED CANCELLED }
enum JobStatus {
  PENDING UPLOADING UPLOADED QUEUED
  PROCESSING PITSTOP_01 PITSTOP_02 PITSTOP_03
  RESIZE CLEAR_MARGIN MOVING COMPLETED ERROR
}
enum AssetType { INPUT OUTPUT REPORT PREVIEW THUMBNAIL }

model Company {
  id        String   @id @default(uuid())
  code      String   @unique
  name      String
  settings  Json     @default("{}")
  users     User[]
  orders    Order[]
  customers Customer[]
  presets   ProcessPreset[]
  createdAt DateTime @default(now()) @map("created_at")
  @@map("companies")
}

model User {
  id           String   @id @default(uuid())
  companyId    String   @map("company_id")
  company      Company  @relation(fields: [companyId], references: [id])
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String
  role         UserRole @default(OPERATOR)
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  lastLoginAt  DateTime? @map("last_login_at")
  @@map("users")
}

model Order {
  id          String      @id @default(uuid())
  companyId   String      @map("company_id")
  company     Company     @relation(fields: [companyId], references: [id])
  customerId  String?     @map("customer_id")
  customer    Customer?   @relation(fields: [customerId], references: [id])
  orderNo     String      @unique @map("order_no")
  title       String
  description String?
  status      OrderStatus @default(DRAFT)
  metadata    Json        @default("{}")
  orderedAt   DateTime?   @map("ordered_at")
  jobs        Job[]
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")
  @@map("orders")
}

model Job {
  id              String    @id @default(uuid())
  orderId         String    @map("order_id")
  order           Order     @relation(fields: [orderId], references: [id])
  companyId       String    @map("company_id")
  jobSequence     Int       @map("job_sequence")
  jobTitle        String    @map("job_title")
  status          JobStatus @default(PENDING)
  s3InputKey      String?   @map("s3_input_key")
  s3OutputKey     String?   @map("s3_output_key")
  s3ResultKey     String?   @map("s3_result_key")
  localFileName   String?   @map("local_file_name")
  processOptions  Json?     @map("process_options")
  pdfInfo         Json?     @map("pdf_info")
  pitstopReport   Json?     @map("pitstop_report")
  errorMessage    String?   @map("error_message")
  hasError        Boolean   @default(false) @map("has_error")
  startedAt       DateTime? @map("started_at")
  completedAt     DateTime? @map("completed_at")
  logs            JobLog[]
  assets          FileAsset[]
  createdAt       DateTime  @default(now()) @map("created_at")
  @@map("jobs")
}

model JobLog {
  id              String   @id @default(uuid())
  jobId           String   @map("job_id")
  job             Job      @relation(fields: [jobId], references: [id])
  status          JobStatus
  description     String?
  isError         Boolean  @default(false) @map("is_error")
  errorDetail     String?  @map("error_detail")
  reportWarnings  Json?    @map("report_warnings")
  reportFailures  Json?    @map("report_failures")
  reportFixes     Json?    @map("report_fixes")
  reportErrors    Json?    @map("report_errors")
  createdAt       DateTime @default(now()) @map("created_at")
  @@map("job_logs")
}

model FileAsset {
  id          String    @id @default(uuid())
  jobId       String    @map("job_id")
  job         Job       @relation(fields: [jobId], references: [id])
  assetType   AssetType @map("asset_type")
  fileName    String    @map("file_name")
  s3Key       String    @map("s3_key")
  s3Bucket    String    @map("s3_bucket")
  contentType String    @map("content_type")
  fileSize    BigInt    @map("file_size")
  checksumMd5 String?   @map("checksum_md5")
  createdAt   DateTime  @default(now()) @map("created_at")
  @@map("file_assets")
}

model ProcessPreset {
  id          String  @id @default(uuid())
  companyId   String  @map("company_id")
  company     Company @relation(fields: [companyId], references: [id])
  name        String
  description String?
  options     Json
  isDefault   Boolean @default(false) @map("is_default")
  createdAt   DateTime @default(now()) @map("created_at")
  @@map("process_presets")
}

model Customer {
  id          String   @id @default(uuid())
  companyId   String   @map("company_id")
  company     Company  @relation(fields: [companyId], references: [id])
  name        String
  email       String?
  phone       String?
  companyName String?  @map("company_name")
  orders      Order[]
  createdAt   DateTime @default(now()) @map("created_at")
  @@map("customers")
}
```

---

**문서 끝**

*본 문서는 CRT DigitalEdit V2 소스코드(393개 C# 파일) 분석을 기반으로 작성되었으며, Printly 인쇄 파일처리 자동화 시스템의 전체 개발 범위를 정의합니다.*
