---
id: SPEC-SKIN-001
version: 2.0.0
status: draft
created: 2026-03-14
updated: 2026-03-17
author: MoAI
priority: high
issue_number: 0
tags: [auth, signup, login, design-system-migration, huni-ds, TextField, Field, Dialog, Snackbar, Icon]
depends_on: [SPEC-DS-006]
affects: [SPEC-SKIN-003, SPEC-SKIN-004]
migration_from: SPEC-SKIN-001-v1.0.0
---

# SPEC-SKIN-001 v2: 인증/회원가입 디자인시스템 마이그레이션

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2026-03-14 | 초안 작성 - 인증/회원가입 7개 IA 기능 명세 |
| 2.0.0 | 2026-03-17 | SPEC-DS-006 기반 디자인시스템 마이그레이션 - 이전 input/form 패턴을 Huni TextField, Field, Dialog, Snackbar, Icon으로 대체 |

---

## 1. 개요

### 1.1 마이그레이션 목적

SPEC-SKIN-001에 구현된 인증/회원가입 7개 기능(100% 구현 완료)을 SPEC-DS-006에서 정의한 Huni 디자인시스템 v2로 마이그레이션한다. 기존의 직접 `<input>` 요소, shadcn/ui 기반 컴포넌트, `--po-*` 토큰 사용을 모두 Huni Compound Component 패턴과 `--huni-*` 토큰 체계로 전환한다.

### 1.2 마이그레이션 범위

- **유형**: Migration (S 사이즈)
- **현재 상태**: 7/7 기능 구현 완료 (이전 컴포넌트 사용)
- **대상**: 로그인, 아이디 찾기, 비밀번호 찾기, 회원가입(약관동의/정보입력/완료), 비밀번호 보기/숨기기
- **정책 기반**: POLICY-A1A2-MEMBER 참조

### 1.3 정책 통합 (POLICY-A1A2-MEMBER)

| 기능 | 구현 방식 | 설명 |
|------|-----------|------|
| 일반 로그인 | NATIVE | shopby 기본 제공, 스킨 UI만 교체 |
| SNS 로그인 (카카오/네이버) | NATIVE | shopby 간편로그인 설정 활성화 |
| 아이디 찾기 | NATIVE | shopby 기본 제공 |
| 비밀번호 찾기 | NATIVE | shopby 기본 제공 |
| 약관동의 | SKIN | shopby 기본 약관 + 스킨 커스터마이징 |
| 회원가입 정보입력 | SKIN | 기본 필드 제공, 추가 필드는 스킨에서 구현 |
| 이메일 중복확인 | NATIVE | shopby API 제공 |
| 휴대전화 인증 | NATIVE | shopby 본인인증 연동 |
| 가입완료 메일 | NATIVE | shopby 자동메일 설정 |

---

## 2. 컴포넌트 매핑 (이전 -> 신규)

| 이전 패턴 | 신규 Huni 컴포넌트 | 적용 위치 | 비고 |
|----------|-------------------|----------|------|
| `<input type="text">` 직접 | `TextField` | 로그인 폼, 회원가입 폼, 찾기 폼 | 7 slots, Compound Component |
| label + input 조합 | `Field` + `TextField` | 모든 폼 필드 | Field.Root > Field.Label > Field.Control > Field.ErrorMessage |
| `<input type="password">` + 커스텀 토글 | `TextField` (type="password") + `Icon` | 비밀번호 필드 | TextField.Slot에 Eye/EyeOff Icon 배치 |
| `<input type="checkbox">` 직접 | `Checkbox` | 약관동의 체크박스 | data-checked/disabled 속성 |
| `alert()` / 커스텀 모달 | `Dialog` | 확인 다이얼로그 (이메일 중복, 삭제 확인 등) | Dialog.Root > Dialog.Trigger > Dialog.Content |
| 커스텀 토스트 / alert | `Snackbar` (useSnackbar) | 로그인 성공/실패, 인증 결과 알림 | Programmatic API 사용 |
| lucide-react 직접 import | `Icon` | Eye, EyeOff, Check, AlertCircle 등 | lucide-react 래퍼 |
| `--po-*` CSS 변수 | `--huni-*` 토큰 | 전체 스타일 | --huni-bg-*, --huni-fg-*, --huni-stroke-* |
| `<hr>` 직접 | `Divider` | "또는" 구분선 | Divider variant="full" |

---

## 3. 요구사항 (EARS 형식)

### REQ-MIG-001-001: 로그인 폼 TextField 마이그레이션

**WHEN** 사용자가 로그인 페이지에 접속하면,
**THE SYSTEM SHALL** 이메일/비밀번호 입력 필드를 Huni `Field` + `TextField` Compound Component로 렌더링해야 한다.

**수용 기준**:
- [ ] 이메일 필드: `Field.Root > Field.Label > Field.Control(TextField) > Field.ErrorMessage` 구조
- [ ] 비밀번호 필드: `TextField.Slot`에 `Icon`(Eye/EyeOff) 배치하여 보기/숨기기 토글
- [ ] `data-focus-visible` 속성으로 키보드 포커스 시 `--huni-stroke-brand` 테두리 표시
- [ ] `data-invalid` 속성으로 유효성 오류 시 `--huni-stroke-danger` 테두리 표시
- [ ] 기존 로그인 API 호출 로직 변경 없음

### REQ-MIG-001-002: 회원가입 폼 Field/TextField 마이그레이션

**WHEN** 사용자가 회원가입 정보입력 스텝에 진입하면,
**THE SYSTEM SHALL** 모든 입력 필드를 Huni `Field` + `TextField` Compound Component로 렌더링해야 한다.

**수용 기준**:
- [ ] 이메일, 비밀번호, 비밀번호 확인, 이름, 휴대전화 - 5개 필드 모두 `Field` + `TextField` 사용
- [ ] 각 `Field`에 자동 `aria-describedby`, `aria-invalid` 속성 연결
- [ ] 비밀번호 강도 인디케이터: `Field.HelperText`에 시각적 프로그레스 바 표시
- [ ] 이메일 중복확인 버튼: `TextField.Slot` position="end"에 배치
- [ ] 인증요청 버튼: `TextField.Slot` position="end"에 배치
- [ ] 기존 유효성 검사 로직 및 API 호출 동작 보존

### REQ-MIG-001-003: 약관동의 Checkbox 마이그레이션

**WHEN** 사용자가 회원가입 약관동의 스텝에 진입하면,
**THE SYSTEM SHALL** 약관 동의 체크박스를 Huni `Checkbox` Compound Component로 렌더링해야 한다.

**수용 기준**:
- [ ] `Checkbox.Root > Checkbox.Control > Checkbox.Label` 구조
- [ ] "전체 동의" 체크박스: `data-checked` 속성 반영
- [ ] 개별 약관 체크박스: 필수/선택 구분하여 `data-disabled` 미적용
- [ ] 기존 전체동의/개별해제 연동 로직 보존
- [ ] `data-focus-visible`로 키보드 포커스 링 표시

### REQ-MIG-001-004: Dialog 마이그레이션

**WHEN** 시스템이 사용자에게 확인/알림 모달을 표시해야 할 때,
**THE SYSTEM SHALL** Huni `Dialog` Compound Component를 사용해야 한다.

**수용 기준**:
- [ ] 이메일 중복 확인 결과: `Dialog.Content > Dialog.Header > Dialog.Body > Dialog.Footer` 구조
- [ ] 약관 전문 보기: `Dialog`로 약관 내용 표시 (기존 바텀시트 대체)
- [ ] `Dialog.Close` 버튼으로 닫기
- [ ] `lazyMount`, `unmountOnExit` 적용으로 성능 최적화
- [ ] `data-open` 속성으로 열림/닫힘 상태 관리

### REQ-MIG-001-005: Snackbar 알림 마이그레이션

**WHEN** 사용자 액션의 결과를 알림으로 표시해야 할 때,
**THE SYSTEM SHALL** Huni `Snackbar` Programmatic API (useSnackbar)를 사용해야 한다.

**수용 기준**:
- [ ] 로그인 성공: `snackbar.success("로그인되었습니다")` 호출
- [ ] 로그인 실패: `snackbar.error("이메일 또는 비밀번호를 확인해주세요")` 호출
- [ ] 인증번호 발송: `snackbar.info("인증번호가 발송되었습니다")` 호출
- [ ] 회원가입 완료: `snackbar.success("회원가입이 완료되었습니다")` 호출
- [ ] `SnackbarProvider`가 앱 루트에 설정되어 있어야 함
- [ ] 큐 방식으로 다중 알림 순차 표시

### REQ-MIG-001-006: Icon 마이그레이션

**FOR ALL** 인증/회원가입 페이지의 아이콘 사용처,
**THE SYSTEM SHALL** lucide-react 직접 import 대신 Huni `Icon` 래퍼 컴포넌트를 사용해야 한다.

**수용 기준**:
- [ ] Eye, EyeOff (비밀번호 토글): `<Icon name="eye" size="sm" />`
- [ ] Check (유효성 성공): `<Icon name="check" size="sm" />`
- [ ] AlertCircle (유효성 오류): `<Icon name="alert-circle" size="sm" />`
- [ ] ChevronLeft (뒤로가기): `<Icon name="chevron-left" size="md" />`
- [ ] 일관된 크기 체계 적용 (xs/sm/md/lg/xl)

### REQ-MIG-001-007: Divider 마이그레이션

**FOR ALL** 구분선 사용처,
**THE SYSTEM SHALL** `<hr>` 직접 사용 대신 Huni `Divider` 컴포넌트를 사용해야 한다.

**수용 기준**:
- [ ] "또는 이메일로 계속하기" 구분선: `Divider` variant="full" + 라벨 텍스트
- [ ] 스텝 간 구분선: `Divider` variant="inset"

### REQ-MIG-001-008: 토큰 체계 전환

**FOR ALL** 인증/회원가입 페이지의 스타일 참조,
**THE SYSTEM SHALL** `--po-*` CSS 변수 사용을 `--huni-*` 토큰으로 전환해야 한다.

**수용 기준**:
- [ ] `--po-primary` -> `--huni-bg-brand-solid`, `--huni-fg-brand`
- [ ] `--po-border` -> `--huni-stroke-neutral`
- [ ] `--po-error` -> `--huni-fg-danger`
- [ ] `--po-success` -> `--huni-fg-positive`
- [ ] `--po-text-muted` -> `--huni-fg-neutral-subtle`
- [ ] 기존 `--po-*` 참조가 0건이 되어야 함

### REQ-MIG-001-009: 기존 기능 회귀 방지

시스템은 **항상** 마이그레이션 전후로 다음 기능이 동일하게 동작해야 한다:

**수용 기준**:
- [ ] 로그인 API 호출 및 JWT 토큰 저장 정상 동작
- [ ] 회원가입 전체 스텝 플로우 정상 동작 (약관 -> 정보입력 -> 완료)
- [ ] 이메일 중복확인 API 연동 정상 동작
- [ ] 휴대전화 SMS 인증 (타이머, 재발송) 정상 동작
- [ ] 아이디 찾기 / 비밀번호 찾기 플로우 정상 동작
- [ ] 반응형 레이아웃 (Mobile/Tablet/Desktop) 정상 동작
- [ ] 키보드 네비게이션 및 aria 속성 정상 동작

---

## 4. IA 기능 목록 (v1 유지)

| No | 영역 | 기능 | 우선순위 | 상태 |
|----|------|------|----------|------|
| 1 | 로그인 | 일반 로그인 | P0 | 구현완료 -> 마이그레이션 필요 |
| 2 | 로그인 | 아이디 찾기 | P0 | 구현완료 -> 마이그레이션 필요 |
| 3 | 로그인 | 비밀번호 찾기 | P0 | 구현완료 -> 마이그레이션 필요 |
| 4 | 회원가입 | 약관동의 + 정보입력 | P0 | 구현완료 -> 마이그레이션 필요 |
| 5 | 회원가입 | 이메일 중복확인 | P0 | 구현완료 -> 마이그레이션 필요 |
| 6 | 회원가입 | 휴대전화 인증 | P0 | 구현완료 -> 마이그레이션 필요 |
| 7 | 회원가입 | 가입완료 메일 발송 | P1 | 구현완료 -> 마이그레이션 필요 |

---

## 5. 디자인 토큰 매핑

### 5.1 시맨틱 토큰 참조

| 용도 | 이전 값 | 신규 Huni 토큰 |
|------|---------|---------------|
| CTA 버튼 배경 | `#5538B6` | `--huni-bg-brand-solid` |
| CTA 버튼 호버 | `#3B2573` | `--huni-bg-brand-solid-hover` |
| CTA 버튼 비활성 | `#CACACA` | `--huni-bg-disabled` |
| 입력 필드 기본 테두리 | `#CACACA` | `--huni-stroke-neutral` |
| 입력 필드 포커스 테두리 | `#5538B6` | `--huni-stroke-brand` |
| 입력 필드 에러 테두리 | `#EF4444` | `--huni-stroke-danger` |
| 입력 필드 성공 테두리 | `#22C55E` | `--huni-stroke-positive` |
| 에러 텍스트 | `#EF4444` | `--huni-fg-danger` |
| 성공 텍스트 | `#22C55E` | `--huni-fg-positive` |
| 보조 텍스트 | `#979797` | `--huni-fg-neutral-subtle` |
| 본문 텍스트 | `#424242` | `--huni-fg-neutral` |

### 5.2 컴포넌트 data-* 상태 속성

| 컴포넌트 | 속성 | 용도 |
|---------|------|------|
| TextField | `data-focus-visible` | 키보드 포커스 링 |
| TextField | `data-invalid` | 유효성 오류 상태 |
| TextField | `data-disabled` | 비활성 상태 |
| Checkbox | `data-checked` | 체크 상태 |
| Checkbox | `data-disabled` | 비활성 상태 |
| Dialog | `data-open` | 열림/닫힘 상태 |
