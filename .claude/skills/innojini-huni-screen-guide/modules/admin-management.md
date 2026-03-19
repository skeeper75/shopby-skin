# B-1~B-3: 관리자/거래처/원장 (7 화면)

## 목차

### B-1 관리자 (2 화면)
- [SCR-B1-ADMIN-REG: 관리자 등록](#scr-b1-admin-reg)
- [SCR-B1-ADMIN-MGMT: 관리자 관리](#scr-b1-admin-mgmt)

### B-2 거래처 (2 화면)
- [SCR-B2-VENDOR-MGMT: 거래처 관리](#scr-b2-vendor-mgmt)
- [SCR-B2-VENDOR-BOARD: 매장 게시판](#scr-b2-vendor-board)

### B-3 원장 (3 화면)
- [SCR-B3-ACCOUNT: 계좌 관리](#scr-b3-account)
- [SCR-B3-LEDGER: 원장 관리](#scr-b3-ledger)
- [SCR-B3-RECEIVABLES: 업체별 미수금](#scr-b3-receivables)

---

## 공통 어드민 패턴

모든 어드민 화면: **Desktop-only (>=1024px)**, Tailwind CSS + shadcn/ui

**AdminLayout 공통 구조**:
```
AdminLayout
  └── Sidebar (nav)
  └── Content
        ├── PageHeader (title + breadcrumb)
        ├── FilterSection (collapsible, Card)
        │     ├── 검색 조건 필드들
        │     └── Button[빨강] "검색" + Button[outline] "초기화"
        └── ResultSection
              ├── StatusTabs (뱃지 카운트)
              ├── ActionBar (일괄선택 + 액션 버튼)
              ├── DataTable (checkbox + 정렬 + 행 액션)
              └── Pagination (30/100 + 엑셀 export)
```

**DetailPanel 공통 패턴**: DataTable 행 클릭 → Sheet(drawer) 우측 슬라이드

---

## SCR-B1-ADMIN-REG

**관리자 등록 | CUSTOM | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-B1-ADMIN-REG
- 화면명: 관리자 등록
- 분류: CUSTOM (자체 권한 관리 API)
- 우선순위: 2
- 규모: M (등록 폼 + 역할 선택 + 권한 체크리스트)
- 비고: 슈퍼 관리자만 접근, 역할(Role) 기반 권한 체계

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [관리자 등록]                                           │ │
│  │ 홈 > 관리자 > 관리자 등록                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FormLayout (Card max-w-2xl mx-auto)                    │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ 기본 정보                                         │  │ │
│  │  │  아이디*    [________________]  (영문/숫자 4-20자)│  │ │
│  │  │  비밀번호*  [________________]  (8자 이상)        │  │ │
│  │  │  비번확인*  [________________]                    │  │ │
│  │  │  이름*      [________________]                    │  │ │
│  │  │  이메일     [________________]                    │  │ │
│  │  │  연락처     [________________]                    │  │ │
│  │  ├──────────────────────────────────────────────────┤  │ │
│  │  │ 역할 및 권한                                      │  │ │
│  │  │  역할*   ( ) 슈퍼관리자  (•) 일반관리자           │  │ │
│  │  │          ( ) 통계전용   ( ) 주문처리              │  │ │
│  │  │  권한 메뉴 (체크리스트, 역할 선택 시 자동 세팅)   │  │ │
│  │  │  [v] 주문관리  [v] 통계  [ ] 거래처관리           │  │ │
│  │  │  [ ] 원장관리  [v] 고객센터  [ ] 시스템설정       │  │ │
│  │  ├──────────────────────────────────────────────────┤  │ │
│  │  │              [취소]  [등록(빨강)]                 │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
AdminRegisterPage
  ├── PageHeader (title, breadcrumb)
  └── AdminRegisterForm (Card)
        ├── BasicInfoSection
        │     ├── Input: loginId (중복확인 버튼 포함)
        │     ├── Input: password (type=password)
        │     ├── Input: passwordConfirm (type=password)
        │     ├── Input: name
        │     ├── Input: email
        │     └── Input: phone
        ├── RoleSelector (RadioGroup)
        │     └── RoleOption × 4 (슈퍼/일반/통계/주문)
        ├── PermissionChecklist
        │     └── PermissionItem × N (역할 변경 시 preset 적용)
        └── FormActions
              ├── Button[outline] "취소"
              └── Button[red] "등록"
```

### 4. Props / States

```typescript
interface AdminRegisterForm {
  loginId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  email?: string;
  phone?: string;
  role: "SUPER" | "GENERAL" | "STATS_ONLY" | "ORDER_PROCESS";
  permissions: string[];  // 메뉴 권한 코드 배열
}

// 역할별 기본 권한 preset
const ROLE_PERMISSION_PRESET: Record<string, string[]> = {
  SUPER: ["ORDER", "STATS", "VENDOR", "LEDGER", "CS", "SYSTEM"],
  GENERAL: ["ORDER", "STATS", "CS"],
  STATS_ONLY: ["STATS"],
  ORDER_PROCESS: ["ORDER", "CS"],
};
```

### 5. API 매핑

```
POST /admin/custom/admins
  Body: { loginId, password, name, email, phone, role, permissions[] }
  Response: { adminNo, loginId, name, role, createdAt }

GET /admin/custom/admins/check-id?loginId={id}
  Response: { available: boolean }
```

### 6. 데이터 플로우

```
RoleSelector.onChange(role)
  └── PermissionChecklist 자동 preset 적용

Input[loginId].onBlur → GET /admin/custom/admins/check-id
  └── 중복 시 에러 메시지 표시

FormActions[등록] → 유효성 검사 → POST /admin/custom/admins
  └── 성공: 관리자 관리 목록으로 이동 + 토스트
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 아이디 중복 | 포커스 아웃 | 인라인 에러 "이미 사용 중인 아이디" |
| 비밀번호 불일치 | 확인란 입력 | 인라인 에러 "비밀번호가 일치하지 않음" |
| 역할 변경 | RadioGroup | 권한 체크리스트 preset 자동 적용 |
| 등록 진행 | 버튼 클릭 | 버튼 disabled + 스피너 |
| 등록 성공 | API 200 | 토스트 + 목록 페이지 이동 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 아이디 중복 (409) | 인라인 에러 메시지 |
| 유효성 실패 (400) | 필드별 인라인 에러 |
| 권한 없음 (403) | 토스트 "슈퍼 관리자만 등록 가능" |
| 서버 오류 (500) | 토스트 에러 + 재시도 버튼 |

### 9. 주의사항

- 슈퍼관리자 권한은 슈퍼관리자만 부여 가능 (프론트 + 백엔드 이중 검증)
- 비밀번호는 SHA-256 이상 해시 후 전송
- 권한 체크리스트는 역할 preset 이후 개별 조정 가능

---

## SCR-B1-ADMIN-MGMT

**관리자 관리 | CUSTOM | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-B1-ADMIN-MGMT
- 화면명: 관리자 관리
- 분류: CUSTOM
- 우선순위: 2
- 규모: M (검색 필터 + DataTable + 상태 변경 + 상세 Drawer)
- 비고: 관리자 목록 CRUD, 계정 활성/비활성 제어

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [관리자 관리]                          [+ 관리자 등록]  │ │
│  │ 홈 > 관리자 > 관리자 관리                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection (Card, collapsible)                      │ │
│  │  검색어 [__________] 역할 [전체 ▼] 상태 [전체 ▼]       │ │
│  │                               [검색(빨강)]  [초기화]   │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ ResultSection                                          │ │
│  │  StatusTabs: [전체 24] [활성 20] [비활성 4]            │ │
│  │  ActionBar: [선택 0] [상태변경 ▼]                      │ │
│  │  DataTable:                                            │ │
│  │  [ ] 번호 아이디   이름  역할    최근로그인  상태  액션  │ │
│  │  [ ] 1    admin01  홍길동 슈퍼   2026-03-18  활성  [수정]│ │
│  │  [ ] 2    mgr01    김철수 일반   2026-03-17  활성  [수정]│ │
│  │  [ ] 3    stats01  이영희 통계전용 -          비활성 [수정]│ │
│  │  Pagination: [< 1 2 3 >]  30개씩 ▼  엑셀              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
AdminMgmtPage
  ├── PageHeader (title, breadcrumb, RegisterButton)
  ├── AdminFilterSection
  │     ├── Input: keyword (아이디/이름 검색)
  │     ├── Select: role
  │     └── Select: status (활성/비활성)
  ├── StatusTabs (전체/활성/비활성 카운트)
  ├── ActionBar
  │     ├── SelectAllCheckbox
  │     └── DropdownMenu: 상태변경 (활성화/비활성화)
  ├── DataTable
  │     └── AdminRow (체크박스, 번호, 아이디, 이름, 역할, 최근로그인, StatusBadge, 수정버튼)
  ├── Pagination
  └── AdminDetailSheet (Drawer, 행 클릭 시 열림)
        ├── 기본정보 (읽기 전용)
        ├── 역할/권한 편집 (RoleSelector + PermissionChecklist)
        ├── 비밀번호 초기화 버튼
        └── 저장 / 닫기 버튼
```

### 4. Props / States

```typescript
interface AdminListItem {
  adminNo: number;
  loginId: string;
  name: string;
  role: string;
  lastLoginAt: string | null;
  status: "ACTIVE" | "INACTIVE";
}

interface AdminDetailState {
  selectedAdmin: AdminListItem | null;
  isDrawerOpen: boolean;
  editRole: string;
  editPermissions: string[];
}
```

### 5. API 매핑

```
GET /admin/custom/admins
  Query: keyword, role, status, page, pageSize
  Response: { list: AdminListItem[], total, page }

PATCH /admin/custom/admins/{adminNo}
  Body: { role, permissions[], status }
  Response: 수정된 AdminListItem

POST /admin/custom/admins/{adminNo}/reset-password
  Response: { tempPassword }

PATCH /admin/custom/admins/bulk-status
  Body: { adminNos[], status }
  Response: { updatedCount }
```

### 6. 데이터 플로우

```
FilterSection → onSearch → GET /admin/custom/admins
  └── DataTable 갱신

DataTable 행 클릭 → AdminDetailSheet 열림
  └── PATCH /admin/custom/admins/{adminNo}
        └── 성공: 목록 갱신 + Sheet 닫힘

ActionBar[상태변경] → PATCH /admin/custom/admins/bulk-status
  └── 성공: 목록 갱신 + StatusTabs 카운트 갱신
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| Drawer 열기 | 행 클릭 | 우측 Sheet 슬라이드 인 |
| 비밀번호 초기화 | 버튼 클릭 | 확인 Dialog → 임시 비밀번호 표시 |
| 일괄 상태변경 | 드롭다운 선택 | 확인 Dialog → 처리 |
| 슈퍼관리자 수정 | 수정 시도 | 현재 접속자 본인만 수정 가능 토스트 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 본인 계정 비활성화 (400) | 토스트 "본인 계정은 비활성화 불가" |
| 권한 없음 (403) | 토스트 + 해당 필드 disabled |
| 서버 오류 (500) | 토스트 에러 |

### 9. 주의사항

- 현재 로그인 중인 슈퍼관리자 자신의 계정은 비활성화 불가
- 비밀번호 초기화 시 임시 비밀번호를 화면에 1회만 표시
- StatusBadge: 활성=green, 비활성=gray

---

## SCR-B2-VENDOR-MGMT

**거래처 관리 | CUSTOM | 우선순위 2 | 규모 L**

### 1. 화면 개요

- ID: SCR-B2-VENDOR-MGMT
- 화면명: 거래처 관리
- 분류: CUSTOM
- 우선순위: 2
- 규모: L (거래처 목록 + 신용등급 + 거래조건 + 상세 패널)
- 비고: 매장(거래처) 신용등급·거래조건·계좌정보 통합 관리

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [거래처 관리]                        [+ 거래처 등록]   │ │
│  │ 홈 > 거래처 > 거래처 관리                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection (Card)                                   │ │
│  │  거래처명/코드 [__________]  신용등급 [전체 ▼]          │ │
│  │  거래상태 [전체 ▼]  지역 [전체 ▼]                      │ │
│  │                             [검색(빨강)]  [초기화]     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ StatusTabs: [전체 86] [정상 72] [거래정지 8] [휴면 6]  │ │
│  │ ActionBar: [선택 0] [상태변경 ▼] [엑셀 내보내기]       │ │
│  │ DataTable:                                             │ │
│  │  [ ] 코드   거래처명  지역  신용등급 미수금액  상태 액션│ │
│  │  [ ] V-001  행복문구  서울  A등급   ₩150,000  정상  [▶] │ │
│  │  [ ] V-002  미래인쇄  부산  B등급   ₩0        정상  [▶] │ │
│  │  [ ] V-003  구름샵    인천  C등급   ₩820,000  정지  [▶] │ │
│  │  Pagination: [< 1 2 3 >]  30개씩 ▼  총 86건            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────── VendorDetailPanel ─┐ │
│  │ V-001 행복문구                               [닫기 X]  │ │
│  │ Tabs: [기본정보] [신용/거래조건] [계좌정보] [거래이력] │ │
│  │                                                        │ │
│  │ [기본정보 탭]                                          │ │
│  │  대표자: 홍길동  사업자번호: 123-45-67890              │ │
│  │  주소: 서울 종로구...  연락처: 02-1234-5678            │ │
│  │  담당 관리자: 김철수  등록일: 2023-05-12               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
VendorMgmtPage
  ├── PageHeader (title, breadcrumb, RegisterButton)
  ├── VendorFilterSection
  │     ├── Input: keyword (거래처명/코드)
  │     ├── Select: creditGrade (A/B/C/D/E)
  │     ├── Select: status (정상/거래정지/휴면)
  │     └── Select: region
  ├── StatusTabs (전체/정상/거래정지/휴면 카운트)
  ├── ActionBar
  │     ├── SelectAllCheckbox
  │     ├── DropdownMenu: 상태변경
  │     └── ExcelExportButton
  ├── DataTable
  │     └── VendorRow (코드, 거래처명, 지역, CreditInfoCard, 미수금액, StatusBadge, 상세버튼)
  ├── Pagination
  └── VendorDetailPanel (Sheet drawer)
        ├── Tabs: 기본정보 / 신용·거래조건 / 계좌정보 / 거래이력
        ├── BasicInfoTab (읽기 전용 + 편집 토글)
        ├── CreditTradeTab
        │     ├── CreditGradeSelector (A~E)
        │     ├── CreditLimitInput (신용한도)
        │     ├── PaymentTermsSelect (선불/후불/혼합)
        │     └── TradeStatusToggle (정상/정지)
        ├── AccountInfoTab (계좌 목록, SCR-B3-ACCOUNT 연동)
        └── TradeHistoryTab (최근 거래내역 테이블)
```

### 4. Props / States

```typescript
interface VendorListItem {
  vendorCode: string;
  vendorName: string;
  region: string;
  creditGrade: "A" | "B" | "C" | "D" | "E";
  receivablesAmount: number;
  status: "NORMAL" | "SUSPENDED" | "DORMANT";
}

interface VendorDetail extends VendorListItem {
  ceoName: string;
  businessNo: string;
  address: string;
  phone: string;
  managerAdminName: string;
  registeredAt: string;
  creditLimit: number;
  paymentTerms: "PREPAY" | "POSTPAY" | "MIXED";
  accounts: AccountInfo[];
}
```

### 5. API 매핑

```
GET /admin/custom/vendors
  Query: keyword, creditGrade, status, region, page, pageSize
  Response: { list: VendorListItem[], total, statusCounts{} }

GET /admin/custom/vendors/{vendorCode}
  Response: VendorDetail

PATCH /admin/custom/vendors/{vendorCode}
  Body: { creditGrade, creditLimit, paymentTerms, status, ... }
  Response: 수정된 VendorDetail

PATCH /admin/custom/vendors/bulk-status
  Body: { vendorCodes[], status }
  Response: { updatedCount }

GET /admin/custom/vendors/{vendorCode}/trade-history
  Query: page, pageSize
  Response: { list: TradeHistoryItem[], total }
```

### 6. 데이터 플로우

```
FilterSection → onSearch → GET /admin/custom/vendors
  └── DataTable 갱신 (VendorRow + CreditInfoCard)

VendorRow[▶] 클릭 → GET /admin/custom/vendors/{code}
  └── VendorDetailPanel 열림 (4개 탭)

CreditTradeTab 저장 → PATCH /admin/custom/vendors/{code}
  └── 성공: 목록 갱신 + 토스트
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 패널 열기 | 행 [▶] 클릭 | 우측 Sheet 슬라이드 인 |
| 거래정지 처리 | 상태 변경 | 확인 Dialog "미수금 ₩820,000 존재. 정지 처리?" |
| 신용등급 변경 | Select | CreditInfoCard 즉시 갱신 (낙관적 업데이트) |
| 미수금 경보 | 금액 > 한도 | AlertBadge 빨강 표시 |
| 엑셀 내보내기 | 버튼 클릭 | 다운로드 시작 토스트 |

### 8. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 신용한도 초과 경고 | 인라인 경고 배지 (저장은 허용) |
| 거래정지 중 주문 유입 | 주문 화면에서 경고 배너 별도 처리 |
| 서버 오류 | 토스트 에러 |

### 9. 주의사항

- CreditInfoCard: 등급(A=파랑~E=빨강) + 한도 대비 사용률 Progress Bar
- 거래정지 시 미수금 잔액 확인 Dialog 필수
- 신용등급 변경 이력은 TradeHistoryTab에 기록

---

## SCR-B2-VENDOR-BOARD

**매장 게시판 | CUSTOM | 우선순위 3 | 규모 M**

### 1. 화면 개요

- ID: SCR-B2-VENDOR-BOARD
- 화면명: 매장 게시판
- 분류: CUSTOM
- 우선순위: 3
- 규모: M (게시글 목록 + 작성 에디터 + 댓글)
- 비고: 관리자-거래처 간 공지·문의 게시판, 거래처별 공개 범위 설정

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [매장 게시판]                          [+ 글 작성]      │ │
│  │ 홈 > 거래처 > 매장 게시판                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection (Card)                                   │ │
│  │  유형 [전체 ▼] 거래처 [전체 ▼] 키워드 [__________]    │ │
│  │  기간 [이번달 ▼]                [검색(빨강)]  [초기화] │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ StatusTabs: [전체 42] [공지 5] [일반 35] [답변대기 2]  │ │
│  │ BoardDataTable:                                        │ │
│  │  번호  유형  제목                  거래처  작성일  조회 │ │
│  │  [공지] 공지  [배송비 정책 변경 안내]  전체   03-15  234  │ │
│  │  42    일반  [재고 문의드립니다]    V-001  03-18   12  │ │
│  │  41    일반  [3월 발주 확인요청]    V-003  03-17   8   │ │
│  │  Pagination: [< 1 2 3 >]  30개씩                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
VendorBoardPage
  ├── PageHeader (title, breadcrumb, WriteButton)
  ├── BoardFilterSection
  │     ├── Select: postType (공지/일반)
  │     ├── Select: vendorCode
  │     ├── Input: keyword
  │     └── DateRangePreset
  ├── StatusTabs (전체/공지/일반/답변대기)
  ├── BoardDataTable
  │     └── BoardRow (번호, 유형Badge, 제목(링크), 거래처, 작성일, 조회수)
  ├── Pagination
  └── WriteEditor (Dialog 또는 별도 페이지)
        ├── Select: 공개 범위 (전체/특정 거래처 선택)
        ├── Select: 유형 (공지/일반)
        ├── Input: 제목
        ├── RichTextEditor (TipTap 또는 Quill)
        ├── FileAttachment (첨부파일)
        └── 저장 / 취소 버튼
```

### 4. Props / States

```typescript
interface BoardPost {
  postNo: number;
  postType: "NOTICE" | "GENERAL";
  title: string;
  vendorCode: string | "ALL";
  authorName: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  hasReply: boolean;
}
```

### 5. API 매핑

```
GET /admin/custom/vendor-board
  Query: postType, vendorCode, keyword, startDate, endDate, page
  Response: { list: BoardPost[], total, statusCounts{} }

POST /admin/custom/vendor-board
  Body: { postType, title, content, vendorCode, attachments[] }
  Response: 생성된 BoardPost

PATCH /admin/custom/vendor-board/{postNo}
  Body: { title, content, postType, vendorCode }

DELETE /admin/custom/vendor-board/{postNo}
  Response: 204
```

### 6. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 작성 Dialog | [+ 글 작성] 클릭 | Dialog 또는 신규 페이지 |
| 공지 고정 | 유형=공지 선택 | 목록 최상단 고정, [공지] 배지 |
| 답변대기 탭 | StatusTabs | hasReply=false 게시글 필터 |
| 삭제 확인 | 삭제 버튼 | "삭제하시겠습니까?" Dialog |

### 7. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 첨부파일 크기 초과 | 인라인 에러 "파일은 10MB 이하" |
| 서버 오류 | 토스트 에러 |

### 8. 주의사항

- 공지 유형은 특정 거래처 또는 전체 공개 선택 가능
- 파일 첨부 허용 확장자: PDF, JPG, PNG, XLSX (최대 10MB)
- RichTextEditor: TipTap 권장 (shadcn/ui와 호환성 우수)

---

## SCR-B3-ACCOUNT

**계좌 관리 | CUSTOM | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-B3-ACCOUNT
- 화면명: 계좌 관리
- 분류: CUSTOM
- 우선순위: 2
- 규모: M (계좌 목록 + 등록/수정 폼)
- 비고: 후불 거래처 입금 수신 계좌 및 환불 계좌 관리

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [계좌 관리]                            [+ 계좌 등록]   │ │
│  │ 홈 > 원장 > 계좌 관리                                   │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection (Card)                                   │ │
│  │  거래처 [__________]  은행 [전체 ▼]  용도 [전체 ▼]     │ │
│  │                              [검색(빨강)]  [초기화]    │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ AccountDataTable:                                      │ │
│  │  번호  거래처      은행    계좌번호         예금주  용도  상태  액션  │ │
│  │  1     행복문구    국민은행 123-456-789012  홍길동  입금  활성  [수정][삭제] │ │
│  │  2     행복문구    신한은행 987-654-321098  홍길동  환불  활성  [수정][삭제] │ │
│  │  3     미래인쇄    하나은행 456-789-123456  김철수  입금  비활성 [수정][삭제] │ │
│  │  Pagination: [< 1 2 >]  30개씩                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
AccountMgmtPage
  ├── PageHeader (title, breadcrumb, RegisterButton)
  ├── AccountFilterSection
  │     ├── Input: vendorKeyword
  │     ├── Select: bankCode
  │     └── Select: accountPurpose (입금/환불)
  ├── AccountDataTable
  │     └── AccountRow (번호, 거래처, 은행, 계좌번호(마스킹), 예금주, 용도, StatusBadge, 수정/삭제)
  ├── Pagination
  └── AccountFormDialog (등록/수정 공용)
        ├── VendorSearchInput (거래처 검색·선택)
        ├── Select: bankCode (은행 목록)
        ├── Input: accountNumber
        ├── Input: accountHolder
        ├── Select: purpose (입금/환불)
        ├── Toggle: isActive
        └── 저장 / 취소
```

### 4. Props / States

```typescript
interface AccountInfo {
  accountNo: number;
  vendorCode: string;
  vendorName: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;   // 화면 표시 시 마스킹 (끝 4자리만 표시)
  accountHolder: string;
  purpose: "DEPOSIT" | "REFUND";
  isActive: boolean;
}
```

### 5. API 매핑

```
GET /admin/custom/accounts
  Query: vendorKeyword, bankCode, purpose, page, pageSize
  Response: { list: AccountInfo[], total }

POST /admin/custom/accounts
  Body: { vendorCode, bankCode, accountNumber, accountHolder, purpose, isActive }
  Response: 생성된 AccountInfo

PATCH /admin/custom/accounts/{accountNo}
  Body: { bankCode, accountNumber, accountHolder, purpose, isActive }

DELETE /admin/custom/accounts/{accountNo}
  Response: 204
```

### 6. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 등록 Dialog | [+ 계좌 등록] | Dialog 열림 |
| 수정 Dialog | [수정] 버튼 | Dialog (기존 값 채워짐) |
| 삭제 확인 | [삭제] 버튼 | "거래 이력 있는 계좌는 비활성화만 가능" 안내 |
| 계좌번호 마스킹 | 목록 표시 | ****1234 형태 표시 |

### 7. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 중복 계좌 (409) | "이미 등록된 계좌번호" 인라인 에러 |
| 거래 이력 있는 계좌 삭제 (400) | "비활성화로 변경하시겠습니까?" 유도 |
| 서버 오류 | 토스트 에러 |

### 8. 주의사항

- 계좌번호는 API 저장 시 암호화, 화면 표시 시 마스킹 처리
- 거래처당 동일 용도 계좌 복수 등록 가능 (주 계좌 선택 기능 필요 시 추가)

---

## SCR-B3-LEDGER

**원장 관리 | CUSTOM | 우선순위 2 | 규모 XL**

### 1. 화면 개요

- ID: SCR-B3-LEDGER
- 화면명: 원장 관리
- 분류: CUSTOM
- 우선순위: 2
- 규모: XL (이카운트 ERP 벤치마크 — 이중 장부 원장 패턴)
- 비고: 거래처별 채권·채무 원장, 전표 단위 거래 내역, 잔액 합산, 기간별 원장 조회

### 2. 화면 개요 (비즈니스 컨텍스트)

후니프린팅 원장은 **이카운트 ERP** 방식을 벤치마크합니다.

- **채권 원장**: 거래처가 후니프린팅에 지급해야 할 금액 추적 (매출 → 입금 차감)
- **채무 원장**: 후니프린팅이 거래처에 지급해야 할 금액 추적 (반품·환불)
- **전표(Voucher)**: 각 거래를 차변/대변으로 기록하는 이중 분개 단위
- **잔액 계산**: 기초잔액 + 차변 합계 - 대변 합계 = 기말잔액

### 3. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [원장 관리]                    [전표 등록] [엑셀 내보내기]│ │
│  │ 홈 > 원장 > 원장 관리                                   │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection (Card)                                   │ │
│  │  거래처 [__________]  원장 유형 [채권 ▼]               │ │
│  │  기간 [2026-01-01] ~ [2026-03-31]  [이번달] [분기] [연도]│ │
│  │  전표 유형 [전체 ▼]                [검색(빨강)]  [초기화]│ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ SummaryBar (Card, grid-cols-4)                         │ │
│  │  기초잔액: ₩1,200,000  │  매출(차변): ₩3,450,000      │ │
│  │  입금(대변): ₩2,800,000 │  기말잔액:  ₩1,850,000      │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ SplitLayout (좌: 원장 목록 / 우: 전표 상세)            │ │
│  │  ┌──────────────────────┐ ┌──────────────────────────┐ │ │
│  │  │ LedgerDataTable      │ │ TransactionDetail        │ │ │
│  │  │ 날짜  전표번호  적요  │ │ 전표번호: V-20260318-001  │ │ │
│  │  │  차변금액  대변금액  │ │ 일자: 2026-03-18          │ │ │
│  │  │  잔액     유형  [▶]  │ │ 거래처: 행복문구          │ │ │
│  │  │ ─────────────────── │ │ 유형: 매출               │ │ │
│  │  │ 03-18 V-001 3월인쇄  │ │ ─────────────────────── │ │ │
│  │  │   ₩450,000  -        │ │ 차변   대변   적요        │ │ │
│  │  │   ₩1,850,000 매출 [▶]│ │ 매출채권 ₩450,000         │ │ │
│  │  │ 03-15 V-002 입금확인 │ │         매출  ₩450,000    │ │ │
│  │  │   -   ₩300,000      │ │ ─────────────────────── │ │ │
│  │  │   ₩1,400,000 입금 [▶]│ │ 관련 주문: ORD-20260318-5│ │ │
│  │  └──────────────────────┘ └──────────────────────────┘ │ │
│  │  Pagination: [< 1 2 3 >]  30개씩                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 4. 컴포넌트 트리

```
LedgerMgmtPage
  ├── PageHeader (title, breadcrumb, VoucherRegisterButton, ExcelExportButton)
  ├── LedgerFilterSection
  │     ├── VendorSearchInput
  │     ├── Select: ledgerType (채권/채무)
  │     ├── DateRangePicker (기간 필터)
  │     ├── DateRangePresets (이번달/분기/연도)
  │     └── Select: voucherType (전체/매출/입금/반품/환불/조정)
  ├── LedgerSummaryBar (grid-cols-4)
  │     ├── SummaryCard: 기초잔액
  │     ├── SummaryCard: 차변 합계 (매출/채무발생)
  │     ├── SummaryCard: 대변 합계 (입금/결제)
  │     └── SummaryCard: 기말잔액 (강조 표시)
  ├── SplitLayout
  │     ├── LedgerDataTable (좌측 패널)
  │     │     └── LedgerRow
  │     │           ├── date, voucherNo, description
  │     │           ├── debitAmount (차변), creditAmount (대변)
  │     │           ├── runningBalance (잔액 누계)
  │     │           ├── voucherTypeBadge
  │     │           └── DetailButton [▶]
  │     └── TransactionDetail (우측 패널, 선택 시 표시)
  │           ├── VoucherHeader (번호, 일자, 거래처, 유형)
  │           ├── JournalEntryTable (차변/대변 분개표)
  │           ├── RelatedOrderLink (관련 주문 번호 링크)
  │           ├── AttachmentList (영수증·세금계산서)
  │           └── VoucherMemo
  ├── Pagination
  └── VoucherRegisterDialog
        ├── Select: voucherType
        ├── VendorSearchInput
        ├── DatePicker: transactionDate
        ├── Input: description (적요)
        ├── JournalEntryEditor (차변/대변 항목 추가)
        │     └── AccountCodeSelect + AmountInput × N
        ├── RelatedOrderInput (주문 번호 연결, optional)
        ├── FileUpload (첨부: 세금계산서, 영수증)
        └── 저장 / 취소
```

### 5. Props / States

```typescript
interface LedgerFilter {
  vendorCode?: string;
  ledgerType: "RECEIVABLE" | "PAYABLE";
  startDate: string;
  endDate: string;
  voucherType?: "SALES" | "PAYMENT" | "RETURN" | "REFUND" | "ADJUSTMENT";
  page: number;
  pageSize: number;
}

interface LedgerSummary {
  openingBalance: number;   // 기초잔액
  totalDebit: number;       // 차변 합계
  totalCredit: number;      // 대변 합계
  closingBalance: number;   // 기말잔액 (= 기초 + 차변 - 대변)
  vendorCode: string;
  period: { startDate: string; endDate: string };
}

interface LedgerEntry {
  entryId: number;
  voucherNo: string;          // V-YYYYMMDD-NNN
  transactionDate: string;
  description: string;        // 적요
  debitAmount: number;        // 차변 (0이면 대변 거래)
  creditAmount: number;       // 대변 (0이면 차변 거래)
  runningBalance: number;     // 누적 잔액
  voucherType: string;
  relatedOrderNo?: string;
}

interface VoucherDetail {
  voucherNo: string;
  transactionDate: string;
  vendorCode: string;
  vendorName: string;
  voucherType: string;
  description: string;
  journalEntries: JournalEntry[];   // 분개 항목 (차변/대변)
  relatedOrderNo?: string;
  attachments: Attachment[];
  memo?: string;
  createdBy: string;
  createdAt: string;
}

interface JournalEntry {
  accountCode: string;     // 계정 코드 (예: 110100=매출채권)
  accountName: string;
  side: "DEBIT" | "CREDIT";
  amount: number;
}
```

### 6. API 매핑

```
GET /admin/custom/ledger/summary
  Query: vendorCode, ledgerType, startDate, endDate
  Response: LedgerSummary

GET /admin/custom/ledger/entries
  Query: vendorCode, ledgerType, startDate, endDate, voucherType, page, pageSize
  Response: { list: LedgerEntry[], total, summary: LedgerSummary }

GET /admin/custom/ledger/vouchers/{voucherNo}
  Response: VoucherDetail

POST /admin/custom/ledger/vouchers
  Body: { voucherType, vendorCode, transactionDate, description,
          journalEntries[], relatedOrderNo?, attachments[] }
  Response: 생성된 VoucherDetail

PATCH /admin/custom/ledger/vouchers/{voucherNo}
  Body: { description, memo, attachments[] }
  // 금액·분개 수정 불가 (취소 후 재발행 원칙)
  Response: 수정된 VoucherDetail

POST /admin/custom/ledger/vouchers/{voucherNo}/cancel
  Body: { cancelReason }
  Response: { cancelVoucherNo }   // 역전 전표 번호

GET /admin/custom/ledger/export
  Query: (LedgerFilter 동일)
  Response: Excel 파일 스트림

GET /admin/custom/ledger/account-codes
  Response: { list: AccountCode[] }
  // 계정과목 목록 (매출채권, 현금, 매출 등)
```

### 7. 데이터 플로우

```
LedgerFilterSection → onSearch(filter)
  ├── GET /admin/custom/ledger/entries → LedgerDataTable 갱신
  └── GET /admin/custom/ledger/summary → LedgerSummaryBar 갱신

LedgerRow[▶] 클릭 → GET /admin/custom/ledger/vouchers/{voucherNo}
  └── TransactionDetail 패널 갱신

VoucherRegisterDialog[저장] → POST /admin/custom/ledger/vouchers
  └── 성공: 목록 + SummaryBar 재조회 + Dialog 닫힘 + 토스트

[전표 취소] 버튼 → POST /admin/custom/ledger/vouchers/{no}/cancel
  └── 역전 전표 생성 → 목록 갱신
      (원본 전표는 "취소됨" 배지로 유지, 삭제 안 함)

[엑셀 내보내기] → GET /admin/custom/ledger/export
  └── 브라우저 다운로드
```

### 8. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 전표 선택 | LedgerRow[▶] | TransactionDetail 패널 갱신 (SplitLayout 우측) |
| 잔액 마이너스 | closingBalance < 0 | SummaryCard 빨강 텍스트 |
| 전표 등록 | [전표 등록] 버튼 | VoucherRegisterDialog 열림 |
| 분개 균형 검증 | 저장 시 | 차변 합계 ≠ 대변 합계 → 인라인 에러 |
| 전표 취소 | [취소] 버튼 | "취소 사유 입력 후 역전 전표 자동 생성" Dialog |
| 기간 프리셋 | 버튼 클릭 | DateRangePicker 자동 설정 후 즉시 조회 |
| 엑셀 내보내기 | 버튼 클릭 | 로딩 스피너 → 다운로드 시작 토스트 |
| 계좌 코드 선택 | JournalEntryEditor | AccountCodeSelect 검색 드롭다운 |
| 관련 주문 링크 | TransactionDetail | 클릭 시 주문관리 화면으로 이동 |

### 9. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 분개 불균형 (차변 ≠ 대변) | "차변·대변 합계가 일치하지 않습니다" 인라인 에러, 저장 차단 |
| 미래 날짜 전표 | 경고 Dialog "미래 날짜 전표입니다. 계속하시겠습니까?" |
| 취소된 전표 수정 시도 | 토스트 "취소된 전표는 수정 불가. 역전 전표 확인 권장" |
| 첨부파일 크기 초과 | 인라인 에러 "파일은 20MB 이하" |
| 서버 오류 (500) | 토스트 에러 + 재시도 버튼 |

### 10. 주의사항

- **이중 분개 원칙**: 차변·대변 금액 합계 반드시 일치 (프론트 + 백엔드 이중 검증)
- **전표 불변 원칙**: 한 번 확정된 전표는 수정 불가. 취소 시 역전 전표 자동 생성
- **역전 전표**: 원본 전표의 차변·대변을 반전한 전표 자동 생성 (감사 추적 유지)
- **잔액 계산**: 기말잔액 = 기초잔액 + 차변 합계 - 대변 합계 (채권 원장 기준)
- **계정과목**: 표준 계정과목 코드표 사용, 초기 데이터 시딩 필요
- **이카운트 ERP 참고**: 거래처원장 조회 화면의 기초잔액·차대변·기말잔액 SummaryBar 레이아웃 벤치마크
- SplitLayout 비율: 좌측 60% (목록) / 우측 40% (상세), `grid-cols-[3fr_2fr]`

---

## SCR-B3-RECEIVABLES

**업체별 미수금 | CUSTOM | 우선순위 2 | 규모 L**

### 1. 화면 개요

- ID: SCR-B3-RECEIVABLES
- 화면명: 업체별 미수금
- 분류: CUSTOM
- 우선순위: 2
- 규모: L (미수금 현황 + 연체 경보 + 거래정지 기준 관리)
- 비고: 거래처별 미수금 잔액, 연체 일수, 거래정지 임박 알림

### 2. 화면 개요 (비즈니스 컨텍스트)

- **미수금**: 후불 거래처가 결제 기한이 지났음에도 미납한 채권 금액
- **연체 기준**: 30일 이상 미납 시 경고, 60일 이상 시 거래정지 권고
- **거래정지 기준**: 미수금 > 신용한도 또는 연체 > 60일
- **목적**: 채권 리스크 실시간 모니터링 및 선제적 거래정지 판단

### 3. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [업체별 미수금]                    [엑셀 내보내기]     │ │
│  │ 홈 > 원장 > 업체별 미수금                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ SummaryTopBar (grid-cols-3, 빨강 강조)                 │ │
│  │  총 미수금: ₩12,450,000  │  거래정지 대상: 3건  │  30일↑: 8건  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection (Card)                                   │ │
│  │  거래처명 [__________]  연체구분 [전체 ▼]  신용등급 [전체 ▼] │ │
│  │  미수금 [전체 ▼]                  [검색(빨강)]  [초기화]│ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ StatusTabs: [전체 28] [정상 15] [주의(30일↑) 8] [위험(60일↑) 5] │ │
│  │ ActionBar: [선택 0] [거래정지 처리] [알림 발송]        │ │
│  │ ReceivablesDataTable:                                  │ │
│  │  [ ] 거래처     신용등급  미수금액    최장연체일  상태   액션 │ │
│  │  [ ] 행복문구   A등급    ₩150,000   15일        정상   [▶] │ │
│  │  [!] 구름샵     C등급    ₩820,000   58일        주의   [▶] │ │
│  │  [!!] 날개샵   D등급    ₩1,200,000  73일        위험   [거래정지] [▶] │ │
│  │  Pagination: [< 1 2 3 >]  30개씩  총 28건               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 4. 컴포넌트 트리

```
ReceivablesMgmtPage
  ├── PageHeader (title, breadcrumb, ExcelExportButton)
  ├── SummaryTopBar (grid-cols-3)
  │     ├── SummaryCard: 총 미수금 (전체 합산)
  │     ├── AlertSummaryCard: 거래정지 대상 건수 (빨강)
  │     └── WarningSummaryCard: 30일 초과 건수 (주황)
  ├── ReceivablesFilterSection
  │     ├── Input: vendorKeyword
  │     ├── Select: overdueCategory (전체/30일이상/60일이상/90일이상)
  │     ├── Select: creditGrade
  │     └── Select: receivablesRange (전체/50만미만/50-100만/100만이상)
  ├── StatusTabs (전체/정상/주의/위험)
  ├── ActionBar
  │     ├── SelectAllCheckbox
  │     ├── Button[red]: 거래정지 처리
  │     └── Button[outline]: 알림 발송 (SMS/이메일)
  ├── ReceivablesDataTable
  │     └── ReceivablesRow
  │           ├── AlertBadge (! 주의 / !! 위험)
  │           ├── vendorName
  │           ├── CreditGradeBadge
  │           ├── receivablesAmount (금액 포맷)
  │           ├── maxOverdueDays (최장 연체 일수)
  │           ├── StatusBadge (정상/주의/위험)
  │           ├── Button[red]: 거래정지 (위험 등급만 표시)
  │           └── DetailButton [▶]
  ├── Pagination
  └── VendorReceivablesSheet (Drawer)
        ├── VendorSummaryCard (거래처 기본정보 + 신용등급)
        ├── ReceivablesBreakdownTable (미수금 항목별 상세)
        │     └── 주문번호, 발생일, 만기일, 금액, 연체일수
        ├── PaymentHistorySection (최근 납부 이력)
        └── SheetActionBar
              ├── Button[red]: 거래정지 처리
              └── Button[outline]: 알림 발송
```

### 5. Props / States

```typescript
interface ReceivablesSummary {
  totalReceivables: number;       // 총 미수금
  suspensionTargetCount: number;  // 거래정지 대상 건수
  overdueOver30Count: number;     // 30일 초과 건수
}

interface VendorReceivables {
  vendorCode: string;
  vendorName: string;
  creditGrade: "A" | "B" | "C" | "D" | "E";
  creditLimit: number;
  receivablesAmount: number;      // 총 미수금
  maxOverdueDays: number;         // 최장 연체 일수
  riskLevel: "NORMAL" | "WARNING" | "DANGER";
  tradeStatus: "NORMAL" | "SUSPENDED";
}

interface ReceivablesItem {
  orderNo: string;
  occurredAt: string;    // 발생일
  dueAt: string;         // 만기일
  amount: number;
  overdueDays: number;   // 연체 일수 (만기일 기준)
  isOverdue: boolean;
}

// 연체 위험 기준 (설정 가능)
const RISK_THRESHOLD = {
  WARNING: { days: 30 },   // 30일 이상 → 주의
  DANGER: { days: 60 },    // 60일 이상 → 위험 (거래정지 권고)
};
```

### 6. API 매핑

```
GET /admin/custom/receivables/summary
  Response: ReceivablesSummary

GET /admin/custom/receivables
  Query: vendorKeyword, overdueCategory, creditGrade, receivablesRange,
         riskLevel, page, pageSize
  Response: { list: VendorReceivables[], total, statusCounts{} }

GET /admin/custom/receivables/{vendorCode}
  Response: {
    vendor: VendorDetail,
    receivablesItems: ReceivablesItem[],
    paymentHistory: PaymentHistoryItem[]
  }

POST /admin/custom/receivables/suspend
  Body: { vendorCodes[], reason }
  Response: { suspendedCount, failedCodes[] }

POST /admin/custom/receivables/notify
  Body: { vendorCodes[], notifyType: "SMS" | "EMAIL" | "BOTH" }
  Response: { sentCount }

GET /admin/custom/receivables/export
  Query: (filter 동일)
  Response: Excel 파일 스트림
```

### 7. 데이터 플로우

```
페이지 진입 → 병렬 요청
  ├── GET /admin/custom/receivables/summary → SummaryTopBar
  └── GET /admin/custom/receivables → ReceivablesDataTable

FilterSection/StatusTabs → onSearch → GET /admin/custom/receivables
  └── DataTable 갱신

ReceivablesRow[▶] → GET /admin/custom/receivables/{vendorCode}
  └── VendorReceivablesSheet 열림

[거래정지 처리] → 확인 Dialog
  └── POST /admin/custom/receivables/suspend
        └── 성공: 거래처 상태 갱신 + SummaryTopBar 재조회

[알림 발송] → 알림 수단 선택 Dialog
  └── POST /admin/custom/receivables/notify
        └── 성공: "N건 발송 완료" 토스트
```

### 8. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 위험 행 강조 | riskLevel=DANGER | 행 배경 연빨강 (bg-red-50) |
| 주의 행 강조 | riskLevel=WARNING | 행 배경 연주황 (bg-amber-50) |
| AlertBadge | 주의=! (주황) / 위험=!! (빨강) | 행 첫 번째 셀 |
| 거래정지 버튼 | riskLevel=DANGER | 빨강 버튼 표시 (NORMAL은 숨김) |
| 알림 발송 Dialog | 버튼 클릭 | SMS/이메일/모두 선택 + 수신처 미리보기 |
| 연체일수 강조 | 30일↑ 주황, 60일↑ 빨강 | 연체일수 셀 색상 구분 |
| SummaryTopBar 갱신 | 거래정지 처리 후 | 숫자 즉시 갱신 |

### 9. 에러 처리

| 에러 | 처리 방식 |
|------|-----------|
| 이미 거래정지 중인 업체 (400) | "이미 거래정지 상태인 업체 포함" 경고 후 나머지 처리 |
| 알림 발송 실패 | "N건 발송 실패. 재시도하시겠습니까?" Dialog |
| 서버 오류 | 토스트 에러 |

### 10. 주의사항

- SummaryTopBar는 페이지 진입 시 항상 최신 데이터 조회 (캐시 사용 금지)
- 거래정지 처리 시 SCR-B2-VENDOR-MGMT의 거래처 상태와 동기화 필요
- 연체 기준일(30일/60일)은 설정 화면에서 변경 가능하도록 설계 권장
- AlertBadge: 미수금 > 신용한도 초과 시 추가 경보 아이콘 표시
- 엑셀 내보내기: 미수금 항목 상세 포함 옵션 제공
