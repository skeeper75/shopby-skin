# SPEC-SKIN v2 통합 연구 결과

> 작성일: 2026-03-17
> 목적: 전체 SPEC-SKIN (001~008) 재정의를 위한 통합 리서치
> 트리거: SPEC-DS-006 (Huni 디자인시스템 v2) 완성 후 코드 마이그레이션

---

## 1. 프로젝트 현황

### 1.1 구현 현황

| SPEC | 영역 | IA 항목 | 구현율 | 디자인시스템 |
|------|------|---------|--------|-------------|
| SPEC-SKIN-001 | 인증/회원가입 | 7/7 | 100% | 이전 (--po-*, 직접 input) |
| SPEC-SKIN-002 | 마이페이지 | 17/19 | 89% | 이전 |
| SPEC-SKIN-003 | 상품/주문/결제 | 9/10 | 90% | 이전 |
| SPEC-SKIN-004 | 고객센터/마케팅 | 14/14 | 100% | 이전 |
| SPEC-SKIN-005 | 관리자 기반/주문 | 9/9 | 100% (UI 80-85%) | 이전 |
| SPEC-SKIN-006 | 관리자 상품관리 | 0/14 | 0% | - |
| SPEC-SKIN-007 | 관리자 게시판/회원 | 0/15 | 0% | - |
| SPEC-SKIN-008 | 관리자 거래처/통계 | 0/13 | 0% | - |

**Phase 1 합계**: 47/50 (94%) - 증빙서류(A-3-14), 사업자정보(A-3-15), 디자인의뢰(A-6-7) 미구현
**Phase 2 합계**: 9/42 (21%) - 관리자 기반만 완성

### 1.2 새 디자인시스템 (SPEC-DS-006)

14개 Compound Component + 4개 유틸리티:

**Atoms (7):**
- `Checkbox` (5 slots, Radix) - data-checked/disabled/focus-visible
- `RadioGroup` (6 slots, Radix) - data-checked/disabled
- `Switch` (5 slots, Radix) - data-checked/disabled
- `Chip` (5 slots) - data-selected/disabled
- `Divider` - full/inset, horizontal/vertical
- `Icon` (lucide-react) - xs/sm/md/lg/xl
- `Skeleton` - neutral/brand, wave/pulse

**Molecules (4):**
- `TextField` (7 slots) - multiline, autoresize, clearable
- `Field` (10 slots) - Context Provider, auto aria-*
- `Tabs` (7 slots, Radix) - line/chip, indicator animation
- `Pagination` - numbered/loadMore

**Organisms (2):**
- `Dialog` (8 slots, Radix) - lazyMount/unmountOnExit
- `Snackbar` (10 slots) - useSnackbar hook, queue

**Utilities:**
- `cn()` - clsx + tailwind-merge
- `createSlotRecipeContext()` - slot recipe 전파
- `getStateDataAttributes()` - data-* 유틸
- `useFocusVisible()` - 키보드 포커스 관리

**토큰 체계:**
- `--huni-bg-*`, `--huni-fg-*`, `--huni-stroke-*` (시맨틱)
- `--huni-space-*`, `--huni-radius-*`, `--huni-shadow-*`, `--huni-duration-*`

---

## 2. 정책 기반 구현 방식

### 2.1 NATIVE (shopby 기본 기능)
- 일반로그인, SNS로그인 (카카오/네이버), 비회원주문조회
- 회원등급, 프린팅머니 적립, 쿠폰 관리
- 관리자등록/관리 (RBAC 4단계)
- 월별매출 통계
- SMS/알림톡

### 2.2 SKIN (기본 + 커스터마이징)
- 회원가입 폼 (추가필드)
- 주문조회/상세 (편집 미리보기)
- 장바구니 (인쇄옵션 커스텀)
- 배송 (분할배송)
- 거래처관리 (유형/등급/결제조건 추가)
- 작업지시서 (PDF 커스텀)
- 굿즈발주정산

### 2.3 CUSTOM (완전 별도 구축)
- 옵션보관함 (6개월, 최대 30건)
- 프린팅머니 충전 (PG 연동)
- 출력상품 4종 옵션엔진 (8단계 종속)
- 가격 매트릭스 (수량×옵션)
- 파일업로드 (S3 Presigned URL, 100MB)
- 파일검수 (자동 3단계 + 수동)
- 재업로드 자동화 (알림톡, 3회, 5일)
- 매장게시판 (거래처별 비공개)
- 계좌/원장 관리 (오프라인 통합)
- 미수금 자동관리 (4단계 연체)
- 상품별통계 5종 (인쇄/제본/굿즈/패키지/수작)
- 팀별통계, 대시보드 (실시간 KPI)
- 엑셀 내보내기 (xlsx, 10만행)

---

## 3. 마이그레이션 매핑 (이전 → 신규)

### 3.1 컴포넌트 대체표

| 이전 패턴 | 신규 컴포넌트 | 영향 SPEC |
|----------|-------------|----------|
| `<input type="text">` 직접 | `TextField` | 001~008 |
| label+input 조합 | `Field` | 001~008 |
| `<input type="checkbox">` 직접 | `Checkbox` | 002, 003, 006~008 |
| 커스텀 라디오 버튼 | `RadioGroup` | 003, 006 |
| 커스텀 토글 | `Switch` | 002, 005~008 |
| `<select>` 또는 커스텀 드롭다운 | 기존 `DropdownSelect` 유지 | - |
| 커스텀 탭 UI | `Tabs` | 002, 003, 005~008 |
| 커스텀 페이지네이션 | `Pagination` | 002, 005~008 |
| 커스텀 모달/다이얼로그 | `Dialog` | 003, 005~008 |
| alert/window.confirm | `Dialog` | 전체 |
| 커스텀 토스트 | `Snackbar` | 전체 |
| 커스텀 태그/뱃지 | `Chip` | 002, 003 |
| `<hr>` 직접 | `Divider` | 전체 |
| 커스텀 로딩 스피너 | `Skeleton` | 전체 |
| lucide 직접 import | `Icon` | 전체 |
| `--po-*` CSS 변수 | `--huni-*` 토큰 | 전체 |

### 3.2 SPEC별 마이그레이션 규모

| SPEC | 대체 컴포넌트 수 | 규모 | 유형 |
|------|----------------|------|------|
| SPEC-SKIN-001 | TextField, Field, Dialog | S | 마이그레이션 |
| SPEC-SKIN-002 | Tabs, Pagination, Chip, TextField, Dialog, Skeleton | M | 마이그레이션 |
| SPEC-SKIN-003 | RadioGroup, Checkbox, TextField, Dialog, Snackbar, Tabs | XL | 재작성 |
| SPEC-SKIN-004 | Divider, Skeleton, Snackbar, TextField | S | 마이그레이션 |
| SPEC-SKIN-005 | Dialog, TextField, Tabs, Pagination, Switch | M | 마이그레이션 |
| SPEC-SKIN-006 | 전체 신규 (Dialog, TextField, Tabs, Switch, Pagination) | XL | 신규 |
| SPEC-SKIN-007 | 전체 신규 (Dialog, TextField, Tabs, Pagination) | L | 신규 |
| SPEC-SKIN-008 | 전체 신규 (Tabs, Dialog, Pagination) + 차트 | L | 신규 |

---

## 4. 기존 인프라

### 4.1 커스텀 훅 (11개)
- useAdminAuth, usePrintPrice, useIslandShipping
- usePrintOptions, useFileUpload, useOrderStatus
- useMemberGrade, usePrintingMoney, useCoupon
- useDeliveryTracker, usePayment

### 4.2 컴포넌트 (92개 디렉토리)
- 관리자 전용: 13개 (AdminBanner, admin/ 등)
- Huni 전용: HuniBadge, HuniOptionPreview, HuniPriceCalculator, HuniSkeletonCard
- shopby 래퍼: @shopby/react-components 기반 다수

### 4.3 페이지 (46개)
- 사용자: 36개 (인증, 쇼핑, 마이페이지, 고객센터, 정보, 마케팅)
- 관리자: 10개 (Dashboard, Orders, Members, FileCheck, SMS 등)

---

## 5. 재정의 실행 계획

### 실행 순서 (우선순위)

**Batch 1 - 핵심 비즈니스 + 신규 (XL)**
1. SPEC-SKIN-003 v2: 상품/주문/결제 (정책 A5/A6/A10 + 파일처리)
2. SPEC-SKIN-006 v2: 관리자 상품관리 (정책 B4)

**Batch 2 - 관리자 확장 (L)**
3. SPEC-SKIN-007 v2: 관리자 게시판/회원/쿠폰 (정책 B5/B6)
4. SPEC-SKIN-008 v2: 관리자 거래처/원장/통계 (정책 B2/B3/B7)

**Batch 3 - 마이그레이션 (M)**
5. SPEC-SKIN-002 v2: 마이페이지 (정책 A3)
6. SPEC-SKIN-005 v2: 관리자 기반/주문 (정책 B1/B8)

**Batch 4 - 마이그레이션 (S)**
7. SPEC-SKIN-001 v2: 인증/회원가입 (정책 A1/A2)
8. SPEC-SKIN-004 v2: 고객센터/마케팅 (정책 A4/A7~A9)

### 각 SPEC v2 공통 포함사항
- Huni 디자인시스템 (SPEC-DS-006) 컴포넌트 명시
- `--huni-*` 토큰 전용 (--po-* 사용 금지)
- 정책 문서 기반 구현 방식 (NATIVE/SKIN/CUSTOM) 명시
- data-* state attribute 패턴
- Compound Component dot notation
- CVA slot recipe + createSlotRecipeContext
