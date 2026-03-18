# SPEC-SKIN-005 v2: 관리자 기반/주문관리 디자인시스템 마이그레이션

> **SPEC ID**: SPEC-SKIN-005
> **버전**: 2.0.0
> **상태**: Draft
> **작성일**: 2026-03-14
> **갱신일**: 2026-03-17
> **우선순위**: High
> **유형**: Migration (M)
> **Phase**: 2
> **IA 항목**: No. 44, 86~94
> **기술 스택**: React 18 + @shopby/react-components + Huni Design System v2 (SPEC-DS-006) + Tailwind CSS
> **관련 정책**: POLICY-B1-ADMIN, POLICY-A6B8-ORDER

---

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-03-14 | 초기 SPEC 작성 |
| 1.1.0 | 2026-03-15 | 프론트엔드 프로토타입 완료 (9/9 IA, UI 80-85%, 백엔드 0%) |
| 2.0.0 | 2026-03-17 | Huni 디자인시스템 마이그레이션 + 백엔드 API 연동 계획 재작성 |

---

## 1. 개요

SPEC-SKIN-005의 기존 프론트엔드 프로토타입(9/9 IA UI 완료, 31파일/3,854줄)을 Huni Design System v2(SPEC-DS-006) 컴포넌트로 마이그레이션하고, 미완료 백엔드 API 연동을 포함하는 중규모 마이그레이션이다.

### 1.1 마이그레이션 범위

- **UI 마이그레이션**: 이전 패턴 -> Huni 컴포넌트 대체 (12 컴포넌트, 10 페이지)
- **백엔드 연동**: 14개 API 엔드포인트 Mock -> 실제 연동
- **변경 파일 예상**: 31+ 파일
- **테스트 커버리지 목표**: 85% (현재 0% -> 85%)

### 1.2 현재 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| UI 프로토타입 | 80-85% 완료 | 12 컴포넌트, 10 페이지 |
| 백엔드 API | 0% (전체 Mock) | 14개 엔드포인트 |
| 테스트 커버리지 | 0% | 프로토타입 단계 |
| MX 태그 | 43개 추가됨 | ANCHOR 3, WARN 2, NOTE 18, TODO 8, SPEC 12 |

---

## 2. 정책 기반 구현 방식

| 영역 | 정책 분류 | 구현 방식 | 근거 |
|------|-----------|-----------|------|
| 관리자 등록/관리 | NATIVE | shopby 운영자관리 + Huni 컴포넌트 스킨 | POLICY-B1-ADMIN: RBAC 4단계, shopby 네이티브 |
| 관리자 인증 | NATIVE | shopby 관리자 인증 + Huni 컴포넌트 | POLICY-B1-ADMIN: 슈퍼관리자 2FA, 비밀번호 90일 |
| 주문관리 (인쇄/제본) | SKIN | shopby 주문관리 API + 커스텀 상태 트래킹 | POLICY-A6B8-ORDER: 커스텀 인쇄 상태 |
| 주문관리 (굿즈) | NATIVE | shopby 기본 주문관리 | POLICY-A6B8-ORDER: 네이티브 |
| 파일확인처리 | CUSTOM | 파일 검수 워크플로우 자체 개발 | POLICY-A6B8-ORDER: 자동+수동 검수 |
| 주문서출력 | SKIN | PDF 커스텀 생성 | POLICY-A6B8-ORDER: 작업지시서 |
| 후불결제 | CUSTOM | B2B 후불/정산 자체 개발 | POLICY-A6B8-ORDER: B2B 승인 고객 |
| SMS/알림톡 | NATIVE | shopby 알림 + NHN 알림톡 API | POLICY-A6B8-ORDER: 11종 알림톡 |

---

## 3. 컴포넌트 마이그레이션 매핑

### 3.1 대체표 (이전 -> 신규)

| 이전 패턴 | 신규 Huni 컴포넌트 | 적용 위치 | 비고 |
|----------|-------------------|-----------|------|
| shadcn Tabs | `Tabs` | 관리자 섹션 네비, 주문 상세 탭 | line/chip, Radix 기반 |
| 커스텀 페이지네이션 | `Pagination` | 주문 목록, 후불결제 목록, 증빙 목록 | numbered |
| shadcn Dialog | `Dialog` | 주문 상세, 파일 미리보기, 상태변경 확인, SMS 발송 | lazyMount/unmountOnExit |
| `<input>` 직접/shadcn Input | `TextField` | 검색 바, 필터 입력, SMS 메시지 작성 | clearable |
| label+input 조합 | `Field` | 관리자 등록 폼, SMS 발송 폼 | 10 slots, auto aria-* |
| 커스텀 토글 | `Switch` | 설정 토글 (알림, 자동발송 등) | Radix 기반 |
| alert/toast | `Snackbar` | 상태변경 완료, SMS 발송 결과, 오류 알림 | useSnackbar hook |
| 커스텀 로딩 스피너 | `Skeleton` | 주문 목록 로딩, 대시보드 카드 로딩 | wave |
| shadcn Badge | `Chip` | 주문 상태 뱃지 (접수/제작중/배송중/완료) | data-selected |
| `<hr>` 직접 | `Divider` | 섹션 구분 | full/inset |
| lucide 직접 import | `Icon` | 사이드바 아이콘, 액션 버튼 아이콘 | xs~xl |
| `--po-*` CSS 변수 | `--huni-*` 토큰 | 전체 파일 | 시맨틱 토큰 |

### 3.2 미대체 항목 (기존 유지)

| 기존 컴포넌트 | 유지 사유 |
|-------------|-----------|
| DataTable (TanStack Table) | 테이블 프레임워크, 디자인시스템 범위 외 |
| DatePicker | 기간 필터, Radix Calendar 기반 유지 |
| AdminSidebar (커스텀) | 레이아웃 컴포넌트, 내부 요소만 대체 |
| PrintSheet (커스텀) | 인쇄용 레이아웃, 디자인시스템 범위 외 |
| StatCard (커스텀) | 대시보드 카드, 내부 요소만 대체 |

---

## 4. 요구사항 (EARS Format)

### 4.1 UI 마이그레이션 요구사항

#### REQ-SKIN-005-V2-001: CSS 토큰 마이그레이션

시스템은 **항상** 모든 관리자 UI 요소에서 `--po-*` CSS 변수 대신 `--huni-*` 시맨틱 토큰을 사용해야 한다

**관리자 토큰 매핑**:
- Sidebar active 텍스트 `#5538B6` -> `--huni-fg-brand`
- Sidebar active 배경 `#EEEBF9` -> `--huni-bg-brand-subtle`
- Table header 배경 `#F6F6F6` -> `--huni-bg-neutral-subtle`
- Table row hover `#EEEBF9` -> `--huni-bg-brand-subtle`
- Pagination active `#5538B6` -> `--huni-fg-brand`

#### REQ-SKIN-005-V2-002: Tabs 마이그레이션

**WHEN** 관리자가 주문 상세 패널에서 탭을 클릭하면
**THEN** Huni `Tabs` 컴포넌트가 indicator animation과 함께 콘텐츠를 전환해야 한다

#### REQ-SKIN-005-V2-003: Pagination 마이그레이션

**WHEN** 주문 목록, 후불결제 목록, 증빙서류 목록이 페이지 크기를 초과하면
**THEN** Huni `Pagination` 컴포넌트로 페이지 네비게이션을 제공해야 한다

#### REQ-SKIN-005-V2-004: Dialog 마이그레이션

**WHEN** 관리자가 주문 상세, 파일 미리보기, 상태변경 확인, SMS 발송 모달을 열면
**THEN** Huni `Dialog` 컴포넌트가 lazyMount/unmountOnExit 패턴으로 렌더링되어야 한다

#### REQ-SKIN-005-V2-005: TextField/Field 마이그레이션

**WHEN** 관리자가 검색, 필터, SMS 메시지 등 텍스트를 입력하면
**THEN** Huni `TextField` + `Field` 컴포넌트가 동일한 UX를 제공해야 한다

#### REQ-SKIN-005-V2-006: Switch 마이그레이션

**WHEN** 관리자가 설정 토글(알림 설정, 자동발송 등)을 조작하면
**THEN** Huni `Switch` 컴포넌트가 Radix 기반으로 동작해야 한다

#### REQ-SKIN-005-V2-007: Snackbar 마이그레이션

**WHEN** 관리자 작업(상태변경, SMS 발송, 일괄처리)이 완료되거나 실패하면
**THEN** Huni `Snackbar` 컴포넌트로 피드백을 제공해야 한다

#### REQ-SKIN-005-V2-008: Skeleton 마이그레이션

**WHEN** 관리자 페이지 데이터가 로딩 중이면
**THEN** Huni `Skeleton` 컴포넌트로 로딩 상태를 표시해야 한다

#### REQ-SKIN-005-V2-009: Chip 주문 상태 뱃지

**WHEN** 주문 목록에서 주문 상태를 표시하면
**THEN** Huni `Chip` 컴포넌트로 상태별 색상 구분된 뱃지를 표시해야 한다

**상태별 Chip 매핑** (POLICY-A6B8-ORDER 기반):
- 접수중: `--huni-bg-brand-subtle` / `--huni-fg-brand`
- 제작중: 경고 토큰 계열
- 배송중: 성공 토큰 계열
- 완료: `--huni-bg-neutral-subtle` / `--huni-fg-neutral`

#### REQ-SKIN-005-V2-010: Divider/Icon 마이그레이션

시스템은 **항상** `<hr>` 대신 Huni `Divider`, lucide 직접 import 대신 Huni `Icon`을 사용해야 한다

### 4.2 백엔드 API 연동 요구사항

#### REQ-SKIN-005-V2-011: 관리자 인증 API 연동

**WHEN** 관리자가 ID/비밀번호로 로그인하면
**THEN** 실제 관리자 인증 API(POST /admin/login)와 연동하여 JWT 토큰을 발급받아야 한다

**IF** 비밀번호가 90일 이상 미변경이면 **THEN** 변경 안내 화면을 표시해야 한다

**세부 사항** (POLICY-B1-ADMIN 기반):
- RBAC 4단계: 슈퍼관리자/관리자/운영자/뷰어
- 로그인 실패 5회 시 30분 잠금
- 권한별 메뉴 접근 제한

#### REQ-SKIN-005-V2-012: 주문관리 API 연동

**WHEN** 관리자가 주문관리 메뉴에 접속하면
**THEN** 실제 주문 API(GET /admin/orders)와 연동하여 주문 목록을 표시해야 한다

**세부 사항**:
- 검색: 주문번호, 주문자명, 상품명
- 필터: 기간, 주문상태, 상품분류
- 페이징: Pagination 컴포넌트 연동
- Excel 다운로드 (xlsx 형식)

#### REQ-SKIN-005-V2-013: 파일검수 워크플로우 연동

**WHEN** 관리자가 파일확인 버튼을 클릭하면
**THEN** 파일검수 API(PUT /admin/orders/{orderNo}/file-check)와 연동하여 검수를 처리해야 한다

**세부 사항** (POLICY-A6B8-ORDER 기반):
- 자동검수: 해상도(300dpi), 색상모드(CMYK) 확인
- 수동검수: 재단선, 여백, 서체 확인 (체크리스트)
- 재업로드 요청: 3회 제한, 5일 기한
- 승인 후 작업지시서 자동 생성

#### REQ-SKIN-005-V2-014: 주문상태 변경 + 알림

**WHEN** 관리자가 주문 상태를 변경하면
**THEN** 상태 API(PUT /admin/orders/{orderNo}/status)와 연동하고, 해당 알림톡을 발송해야 한다

**주문 상태** (POLICY-A6B8-ORDER Section 5):
- 내부 11단계: 주문접수 -> 결제완료 -> 파일확인중 -> 재업로드대기 -> 파일승인 -> 작업지시 -> 인쇄중 -> 후가공 -> 포장 -> 출고 -> 배송중 -> 배송완료
- 고객 노출 9단계: 주문접수/결제완료/파일확인중/파일재업로드요청/파일확인완료/제작중/출고완료/배송중/배송완료

**알림톡 연동** (POLICY-A6B8-ORDER Section 9):
- 11종 알림톡 자동 발송
- 재업로드 요청(003): 알림톡 + 이메일
- 제작중(005): 알림톡
- 출고완료(008/009): 알림톡 (송장번호 포함)

#### REQ-SKIN-005-V2-015: 일괄 상태변경

**WHEN** 관리자가 주문 목록에서 다건을 선택하고 일괄 상태변경을 실행하면
**THEN** 일괄 API(PUT /admin/orders/batch-status)와 연동하여 선택 주문 전체의 상태를 변경해야 한다

**세부 사항**:
- 동시 최대 50건 처리
- 각 주문별 알림톡 개별 발송
- 실패 건 목록 표시

#### REQ-SKIN-005-V2-016: SMS/알림톡 발송

**WHEN** 관리자가 SMS 발송 메뉴에서 메시지를 작성하고 발송하면
**THEN** NHN 알림톡 API(POST /admin/sms/send)와 연동하여 발송해야 한다

**세부 사항**:
- 개별/다건 발송 지원
- 템플릿 메시지 선택 기능
- 발송 결과 확인 (성공/실패 로그)

#### REQ-SKIN-005-V2-017: 테스트 커버리지

시스템은 **항상** 85% 이상의 테스트 커버리지를 유지해야 한다

시스템은 마이그레이션으로 인해 기존 UI 동작이 **변경되지 않아야 한다**

---

## 5. 기술 명세

### 5.1 Compound Component 패턴

```
// Dialog 사용 예시 (주문 상세)
<Dialog.Root lazyMount unmountOnExit>
  <Dialog.Trigger>주문 상세</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>주문 HN-001</Dialog.Header>
    <Tabs.Root defaultValue="info">
      <Tabs.List>
        <Tabs.Trigger value="info">주문 정보</Tabs.Trigger>
        <Tabs.Trigger value="file">파일 확인</Tabs.Trigger>
        <Tabs.Trigger value="history">변경 이력</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="info">...</Tabs.Content>
    </Tabs.Root>
    <Dialog.Footer>
      <Dialog.Close>닫기</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### 5.2 Chip 상태 뱃지 매핑

| 내부 상태 | 고객 노출 | Chip variant | 색상 토큰 |
|----------|----------|-------------|----------|
| 주문접수 | 주문접수 | default | neutral |
| 결제완료 | 결제완료 | brand | brand-subtle |
| 파일확인중 | 파일확인중 | brand | brand |
| 재업로드대기 | 파일재업로드요청 | warning | warning |
| 파일승인 | 파일확인완료 | success | success |
| 작업지시~포장 | 제작중 | warning | warning |
| 출고 | 출고완료 | info | info |
| 배송중 | 배송중 | success | success-subtle |
| 배송완료 | 배송완료 | neutral | neutral-subtle |
| 주문취소 | 주문취소 | danger | danger |

### 5.3 파일검수 워크플로우

```
파일 업로드 -> 자동검수(해상도+색상모드)
  -> [통과] -> 수동검수(재단선+여백+서체)
      -> [통과] -> 파일승인 -> 작업지시서 생성
      -> [불통과] -> 재업로드 요청 (알림톡+이메일)
  -> [불통과] -> 재업로드 요청 (알림톡+이메일)
      -> 재업로드 횟수 확인 (3회 제한)
      -> [3회 초과] -> 1:1 문의 유도
      -> [3회 미만] -> 재업로드 대기 (5일 기한)
```

### 5.4 RBAC 권한 매트릭스 (POLICY-B1-ADMIN 기반)

| 메뉴 | 슈퍼관리자 | 관리자 | 운영자 | 뷰어 |
|------|-----------|--------|--------|------|
| 관리자 계정 | CRUD | R(하위) | - | - |
| 주문 관리 | CRUD | CRUD | RU | R |
| 파일확인 | CRUD | CRUD | RU | R |
| 상태변경 | CRUD | CRUD | RU | - |
| 후불결제 | CRUD | CRU | R | R |
| 증빙서류 | CRUD | CRU | R | R |
| SMS 발송 | CRUD | CRUD | CRU | - |
| 감사 로그 | R | R(본인) | - | - |

---

## 6. 트레이서빌리티

| 요구사항 ID | 정책 문서 | IA 항목 |
|------------|----------|---------|
| REQ-SKIN-005-V2-001 | SPEC-DS-006 토큰 체계 | 전체 |
| REQ-SKIN-005-V2-002~010 | SPEC-DS-006 컴포넌트 | 44, 86~94 |
| REQ-SKIN-005-V2-011 | POLICY-B1-ADMIN (RBAC 4단계) | 44 |
| REQ-SKIN-005-V2-012 | POLICY-A6B8-ORDER (주문관리) | 86 |
| REQ-SKIN-005-V2-013 | POLICY-A6B8-ORDER (파일검수) | 87 |
| REQ-SKIN-005-V2-014 | POLICY-A6B8-ORDER (상태변경+알림) | 90 |
| REQ-SKIN-005-V2-015 | POLICY-A6B8-ORDER (일괄처리) | 93 |
| REQ-SKIN-005-V2-016 | POLICY-A6B8-ORDER (SMS/알림톡) | 88, 94 |
| REQ-SKIN-005-V2-017 | TRUST 5 (Tested) | 전체 |
