# SPEC-SKIN-004 v2: 고객센터/정보/마케팅 디자인시스템 마이그레이션

> **SPEC ID**: SPEC-SKIN-004
> **버전**: 2.0.0
> **상태**: Draft
> **작성일**: 2026-03-14
> **갱신일**: 2026-03-17
> **우선순위**: Medium
> **유형**: Migration (S)
> **Phase**: 1
> **IA 항목**: No. 20~26, 33~39
> **기술 스택**: React 18 + @shopby/react-components + Huni Design System v2 (SPEC-DS-006) + Tailwind CSS
> **관련 정책**: POLICY-A4B5-CS, POLICY-A7A8-CONTENT, POLICY-A9-MARKETING

---

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-03-14 | 초기 SPEC 작성 |
| 1.1.0 | 2026-03-15 | 구현 완료 (14/14 IA, 295 tests) |
| 2.0.0 | 2026-03-17 | Huni 디자인시스템 마이그레이션 SPEC 재작성. 이전 패턴(--po-*, 직접 input, 커스텀 UI)을 SPEC-DS-006 Compound Component로 대체 |

---

## 1. 개요

SPEC-SKIN-004의 기존 구현(14/14 IA 완료, 295 테스트 통과)을 유지하면서, 이전 디자인 패턴을 Huni Design System v2(SPEC-DS-006) 컴포넌트로 마이그레이션한다. 기능 변경 없이 컴포넌트 대체와 토큰 전환에 집중하며, 기존 테스트를 회귀 검증에 활용한다.

### 1.1 마이그레이션 범위

- **대상 페이지**: 14개 (고객센터 7, 정보 4, 가이드 1, 마케팅 3)
- **변경 파일 예상**: 28파일 (기존 구현 기준)
- **기존 테스트**: 295/295 통과 유지 필수

---

## 2. 정책 기반 구현 방식

| 영역 | 정책 분류 | 구현 방식 | 근거 |
|------|-----------|-----------|------|
| 공지사항/FAQ/Q&A/비회원주문조회 | NATIVE | shopby 네이티브 + Huni 컴포넌트 스킨 적용 | POLICY-A4B5-CS: 기본 CS 채널은 네이티브 |
| 대량주문견적/기업인쇄상담/디자인상담 | SKIN | 커스텀 게시판 + Huni 컴포넌트 | POLICY-A4B5-CS: 인쇄 전문 상담은 SKIN |
| 가이드/찾아오시는길 | SKIN | 콘텐츠 페이지 + Huni 컴포넌트 | POLICY-A7A8-CONTENT: 스킨 커스텀 |
| 랜딩페이지 5종 | SKIN | 기획전 + Huni 컴포넌트 | POLICY-A9-MARKETING: 스킨 커스터마이징 |
| 이용후기 | NATIVE | shopby 상품후기 API + Huni 컴포넌트 | POLICY-A9-MARKETING: 네이티브 |
| 체험단 | CUSTOM | 별도 개발 + Huni 컴포넌트 | POLICY-A9-MARKETING: shopby 미지원 |

---

## 3. 컴포넌트 마이그레이션 매핑

### 3.1 대체표 (이전 -> 신규)

| 이전 패턴 | 신규 Huni 컴포넌트 | 적용 위치 | 비고 |
|----------|-------------------|-----------|------|
| `<input type="text">` 직접 | `TextField` | 견적문의 폼, 검색 바, 비회원조회 입력 | 7 slots, clearable |
| label + input 조합 | `Field` | InquiryForm 전체, 비회원주문조회 | 10 slots, auto aria-* |
| `<hr>` 직접 | `Divider` | 고객센터 섹션 구분, 가이드 섹션 구분 | full/inset |
| 커스텀 로딩 스피너 | `Skeleton` | 공지 목록 로딩, 리뷰 로딩, FAQ 로딩 | wave/pulse |
| 커스텀 토스트/alert | `Snackbar` | 문의 접수 완료, 조회 실패 안내 | useSnackbar hook |
| lucide 직접 import | `Icon` | 가이드 카드 아이콘, 네비게이션 아이콘 | xs~xl 사이즈 |
| 커스텀 탭 UI | `Tabs` | FAQ 카테고리, 공지사항 카테고리 | line/chip, indicator animation |
| 커스텀 페이지네이션 | `Pagination` | 공지사항 목록 | numbered/loadMore |
| `--po-*` CSS 변수 | `--huni-*` 토큰 | 전체 파일 | 시맨틱 토큰 |

### 3.2 미대체 항목 (기존 유지)

| 기존 컴포넌트 | 유지 사유 |
|-------------|-----------|
| HuniCustomSelect | SPEC-DS-006 범위 외 (DropdownSelect 유지) |
| Accordion (Radix) | FAQ 아코디언은 Radix Collapsible 직접 사용 유지 |
| HeroBanner (커스텀) | 랜딩페이지 전용, 디자인시스템 범위 외 |
| LandingTemplate (커스텀) | 마케팅 전용 템플릿 패턴, 범위 외 |
| InquiryForm (커스텀) | 비즈니스 로직 컴포넌트, 내부 요소만 대체 |
| ChatWidget | 카카오 채널 위젯, 범위 외 |

---

## 4. 요구사항 (EARS Format)

### REQ-SKIN-004-V2-001: CSS 토큰 마이그레이션

시스템은 **항상** 모든 UI 요소에서 `--po-*` CSS 변수 대신 `--huni-*` 시맨틱 토큰을 사용해야 한다

**토큰 매핑**:
- `--po-color-primary` -> `--huni-fg-brand`
- `--po-bg-*` -> `--huni-bg-*`
- `--po-border-*` -> `--huni-stroke-*`
- 직접 색상 리터럴(`#5538B6`, `#EEEBF9` 등) -> 해당 `--huni-*` 토큰

### REQ-SKIN-004-V2-002: TextField 마이그레이션

**WHEN** 사용자가 견적문의/상담 폼 또는 검색 바에 텍스트를 입력하면
**THEN** Huni `TextField` 컴포넌트가 동일한 UX를 제공해야 한다

**세부 사항**:
- InquiryForm 내 텍스트 입력 필드: `TextField` (단일행) 또는 `TextField` multiline (복수행)
- FAQ 검색바: `TextField` + clearable
- 비회원주문조회 입력: `TextField` (주문번호, 이메일, 휴대전화)

### REQ-SKIN-004-V2-003: Field 마이그레이션

**WHEN** 사용자가 폼 필드를 조작하면
**THEN** Huni `Field` 컴포넌트가 label, hint, error 상태를 Context Provider로 관리해야 한다

**세부 사항**:
- InquiryForm의 모든 필드 그룹: `Field` 래핑
- 비회원주문조회 입력 그룹: `Field` 래핑
- auto aria-* 속성 자동 적용

### REQ-SKIN-004-V2-004: Snackbar 마이그레이션

**WHEN** 문의 접수가 완료되거나 조회에 실패하면
**THEN** Huni `Snackbar` 컴포넌트로 피드백을 제공해야 한다

**세부 사항**:
- 견적문의/상담 접수 완료: success Snackbar
- 비회원주문조회 실패: error Snackbar
- 기존 alert/window.confirm -> Snackbar 또는 Dialog 대체

### REQ-SKIN-004-V2-005: Skeleton 마이그레이션

**WHEN** 콘텐츠가 로딩 중이면
**THEN** Huni `Skeleton` 컴포넌트로 로딩 상태를 표시해야 한다

**세부 사항**:
- 공지사항 목록 로딩: Skeleton (wave)
- FAQ 목록 로딩: Skeleton (wave)
- 리뷰 목록 로딩: Skeleton (pulse)
- 가이드 카드 로딩: Skeleton (wave)

### REQ-SKIN-004-V2-006: Divider 마이그레이션

시스템은 **항상** 섹션 구분에 `<hr>` 직접 사용 대신 Huni `Divider` 컴포넌트를 사용해야 한다

### REQ-SKIN-004-V2-007: Tabs 마이그레이션

**WHEN** 사용자가 FAQ 카테고리 탭 또는 공지사항 카테고리 탭을 클릭하면
**THEN** Huni `Tabs` 컴포넌트가 indicator animation과 함께 콘텐츠를 전환해야 한다

**세부 사항**:
- FAQ 카테고리: `Tabs` (line variant)
- 공지사항 카테고리: `Tabs` (line variant)
- Tabs.Root + Tabs.List + Tabs.Trigger + Tabs.Content dot notation

### REQ-SKIN-004-V2-008: Pagination 마이그레이션

**WHEN** 공지사항 목록이 페이지 크기를 초과하면
**THEN** Huni `Pagination` 컴포넌트로 페이지 네비게이션을 제공해야 한다

### REQ-SKIN-004-V2-009: Icon 마이그레이션

시스템은 **항상** lucide-react 아이콘을 직접 import하는 대신 Huni `Icon` 컴포넌트를 통해 사용해야 한다

### REQ-SKIN-004-V2-010: 기존 테스트 회귀 방지

시스템은 **항상** 마이그레이션 후 기존 295개 테스트가 모두 통과해야 한다

시스템은 마이그레이션으로 인해 기존 기능이 **변경되지 않아야 한다**

---

## 5. 기술 명세

### 5.1 Compound Component 패턴

```
// TextField 사용 예시 (dot notation)
<Field.Root>
  <Field.Label>회사명</Field.Label>
  <TextField placeholder="회사명을 입력하세요" />
  <Field.ErrorMessage>필수 입력 항목입니다</Field.ErrorMessage>
</Field.Root>
```

### 5.2 data-* State Attribute 패턴

- `data-checked`, `data-disabled`, `data-focus-visible` 등
- 기존 className 기반 상태 표현 -> data-* attribute로 전환

### 5.3 CVA Slot Recipe

- `createSlotRecipeContext()` 활용
- 기존 inline style/className -> slot recipe 기반 스타일링

### 5.4 토큰 적용 예시

| 용도 | 이전 | 신규 |
|------|------|------|
| FAQ 질문 행 hover | `bg: #EEEBF9` | `--huni-bg-brand-subtle` |
| Primary 버튼 | `bg: #5538B6` | `--huni-fg-brand` |
| 구분선 | `border: #CACACA` | `--huni-stroke-default` |
| 섹션 배경 | `bg: #F6F6F6` | `--huni-bg-neutral-subtle` |

---

## 6. 트레이서빌리티

| 요구사항 ID | 정책 문서 | IA 항목 |
|------------|----------|---------|
| REQ-SKIN-004-V2-001 | SPEC-DS-006 토큰 체계 | 전체 |
| REQ-SKIN-004-V2-002 | POLICY-A4B5-CS (문의 폼) | 23, 24, 25 |
| REQ-SKIN-004-V2-003 | POLICY-A4B5-CS (문의 폼) | 23, 24, 25, 26 |
| REQ-SKIN-004-V2-004 | POLICY-A4B5-CS (접수 피드백) | 23~26 |
| REQ-SKIN-004-V2-005 | POLICY-A7A8-CONTENT (콘텐츠 로딩) | 20, 21, 36 |
| REQ-SKIN-004-V2-006 | SPEC-DS-006 Divider | 전체 |
| REQ-SKIN-004-V2-007 | POLICY-A4B5-CS (FAQ 카테고리) | 20, 21 |
| REQ-SKIN-004-V2-008 | POLICY-A4B5-CS (공지 목록) | 20 |
| REQ-SKIN-004-V2-009 | SPEC-DS-006 Icon | 전체 |
| REQ-SKIN-004-V2-010 | 회귀 방지 | 전체 |
