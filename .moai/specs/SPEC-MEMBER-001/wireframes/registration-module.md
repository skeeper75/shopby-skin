---
id: SPEC-MEMBER-001
artifact: wireframes/registration-module
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI (expert-frontend)
status: draft
screens: SCR-MBR-011 ~ SCR-MBR-020
---

# SPEC-MEMBER-001: 회원가입 모듈 와이어프레임 사양서

> Registration Module (10 Screens) - Step Wizard 3단계 회원가입 플로우

---

## Design System Reference

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#5538B6` | CTA 버튼, 활성 상태, 링크 |
| Primary Dark | `#351D87` | 버튼 hover, 강조 텍스트 |
| Border Default | `#CACACA` | 입력 필드 기본 테두리 |
| Border Selected | `#553886` + `border-2` | 포커스 상태 테두리 |
| Error | `#DC2626` | 오류 메시지, 오류 테두리 |
| Success | `#16A34A` | 성공 메시지, 성공 아이콘 |
| Warning/Medium | `#F59E0B` | 비밀번호 강도 "보통" |
| Background Card | `#FFFFFF` | 카드 배경 |
| Background Page | `#F5F5F5` | 페이지 배경 |
| Text Primary | `#1A1A1A` | 본문 텍스트 |
| Text Secondary | `#6B7280` | 보조 텍스트, 힌트 |
| Text Disabled | `#9CA3AF` | 비활성화 텍스트 |
| Font | Noto Sans | 400(body), 500(medium), 600(semibold) |
| Card Width (Step 1, 3) | `480px` | 약관동의, 가입완료 |
| Card Width (Step 2) | `560px` | 정보입력 (필드 다수) |
| Border Radius | `8px` | 카드, 버튼, 입력 필드 |
| Spacing Unit | `4px` | 기본 간격 단위 |

---

## Step Wizard 공통 구조

### Step Indicator

```
+------------------------------------------------------------+
|   (1) 약관동의  -------  (2) 정보입력  -------  (3) 가입완료   |
|   [Active/Done]         [Active/Done]         [Active/Done]  |
+------------------------------------------------------------+
```

| Step | 상태: 현재 | 상태: 완료 | 상태: 미도달 |
|------|----------|----------|------------|
| 원형 숫자 | `#5538B6` bg + white text | `#5538B6` bg + check icon | `#CACACA` bg + `#6B7280` text |
| 라벨 텍스트 | `#1A1A1A` 600 weight | `#5538B6` 500 weight | `#6B7280` 400 weight |
| 연결선 | - | `#5538B6` solid | `#CACACA` dashed |

---

## SCR-MBR-011: 약관동의 (Step 1)

### ASCII Wireframe (PC Layout - 480px Card)

```
+================================================================+
|                          Header (Global)                        |
+================================================================+
|                                                                  |
|            +----- Card (480px, centered) -----+                 |
|            |                                    |                |
|            |  [Step: (1)----(2)----(3)]         |                |
|            |                                    |                |
|            |  +------------------------------+  |                |
|            |  |  [ ] 전체 동의                  |  |                |
|            |  |      모든 약관에 동의합니다       |  |                |
|            |  +------------------------------+  |                |
|            |                                    |                |
|            |  ---- 구분선 (1px #E5E7EB) ----    |                |
|            |                                    |                |
|            |  [ ] 이용약관 (필수)      [보기 v]  |                |
|            |  +------------------------------+  |                |
|            |  | (아코디언 펼침 영역)            |  |                |
|            |  | 약관 내용 텍스트...             |  |                |
|            |  | max-height: 200px, overflow    |  |                |
|            |  +------------------------------+  |                |
|            |                                    |                |
|            |  [ ] 개인정보처리방침 (필수) [보기 v]|                |
|            |  +------------------------------+  |                |
|            |  | (아코디언 펼침 영역)            |  |                |
|            |  +------------------------------+  |                |
|            |                                    |                |
|            |  [ ] 마케팅 수신동의 (선택) [보기 v]|                |
|            |  +------------------------------+  |                |
|            |  | (아코디언 펼침 영역)            |  |                |
|            |  +------------------------------+  |                |
|            |                                    |                |
|            |  [ ] 14세 이상입니다 (필수)         |                |
|            |                                    |                |
|            |  +------------------------------+  |                |
|            |  |  [이전]         [다음]         |  |                |
|            |  +------------------------------+  |                |
|            |                                    |                |
|            |  이미 계정이 있으신가요? 로그인     |                |
|            |                                    |                |
|            +------------------------------------+                |
|                                                                  |
+================================================================+
|                          Footer (Global)                        |
+================================================================+
```

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| Step Indicator | Custom | 3-step, current=1 | `#5538B6` active, `#CACACA` inactive | 표시 전용 (클릭 불가) |
| 전체 동의 체크박스 | Checkbox | label="모든 약관에 동의합니다" | `#5538B6` checked, border `#CACACA` | 클릭 시 하위 전체 토글 |
| 구분선 | Divider | height=1px | `#E5E7EB` | - |
| 약관 체크박스 (필수) | Checkbox | label, required badge | `#5538B6` checked, badge `#DC2626` text | 개별 토글, 해제 시 전체동의 해제 |
| 약관 체크박스 (선택) | Checkbox | label, optional badge | `#5538B6` checked, badge `#6B7280` text | 개별 토글 |
| "보기" 토글 | Button/Link | variant=text, icon=chevron | `#6B7280` text, `#5538B6` hover | 클릭 시 아코디언 토글 |
| 아코디언 패널 | Collapsible | max-height=200px, scroll | `#F9FAFB` bg, `#E5E7EB` border | 슬라이드 애니메이션 300ms |
| 14세 확인 체크박스 | Checkbox | label="14세 이상입니다 (필수)" | `#5538B6` checked | 개별 토글 |
| "이전" 버튼 | Button | variant=outline, width=calc(50%-8px) | border `#CACACA`, text `#6B7280` | /member/login 이동 |
| "다음" 버튼 | Button | variant=primary, width=calc(50%-8px) | bg `#5538B6`, text white, disabled `#E5E7EB` bg `#9CA3AF` text | 필수약관 전체동의 시 활성화 |
| 로그인 링크 | Link | text="로그인" | `#5538B6` underline | /member/login 이동 |

### State Variations

| State | 전체동의 | 필수약관 | 다음 버튼 | 설명 |
|-------|---------|---------|----------|------|
| Initial | unchecked | all unchecked | disabled (`#E5E7EB` bg) | 최초 진입 |
| Partial | unchecked | 일부 checked | disabled | 필수 약관 미완료 |
| All Required | unchecked (선택 미체크) | 필수 전체 checked | **enabled** (`#5538B6` bg) | 필수만 동의 |
| All Checked | checked | all checked | **enabled** | 전체 동의 |
| Accordion Open | - | - | - | 특정 약관 "보기" 클릭 시 패널 펼침 |

### 전체동의 로직

- "전체 동의" 체크 -> 모든 하위 체크박스 ON (필수 3개 + 선택 1개)
- "전체 동의" 해제 -> 모든 하위 체크박스 OFF
- 하위 중 1개라도 OFF -> "전체 동의" 자동 해제
- 하위 전체 ON -> "전체 동의" 자동 체크
- "다음" 활성화 조건: 이용약관(필수) + 개인정보처리방침(필수) + 14세 확인(필수) = 3개 모두 checked

### Accessibility

- 체크박스: `role="checkbox"`, `aria-checked`, `aria-required="true"` (필수 항목)
- 아코디언: `aria-expanded`, `aria-controls`, `id` 연결
- "보기" 버튼: `aria-label="이용약관 내용 보기"`
- "다음" 버튼 비활성화 시: `aria-disabled="true"`, 클릭 무시
- Tab 순서: 전체동의 -> 이용약관 체크 -> 보기 -> 개인정보 체크 -> 보기 -> 마케팅 체크 -> 보기 -> 14세 -> 이전 -> 다음

### Responsive Notes

- Mobile (< 768px): 카드 -> 전체 폭, padding 16px, margin-top 0
- 아코디언 패널: max-height 300px (모바일에서 더 크게)
- 버튼: 전체 폭 세로 배치 (다음 상단, 이전 하단)

---

## SCR-MBR-012: 정보입력 (Step 2)

### ASCII Wireframe (PC Layout - 560px Card)

```
+================================================================+
|                          Header (Global)                        |
+================================================================+
|                                                                  |
|          +----- Card (560px, centered) --------+                |
|          |                                      |               |
|          |  [Step: (1)====(2)----(3)]           |               |
|          |                                      |               |
|          |  이메일 *                             |               |
|          |  +----------------------------------+|               |
|          |  | user@example.com          [icon] ||               |
|          |  +----------------------------------+|               |
|          |  (인라인 메시지 영역)                  |               |
|          |                                      |               |
|          |  비밀번호 *                           |               |
|          |  +----------------------------------+|               |
|          |  | ********              [eye icon] ||               |
|          |  +----------------------------------+|               |
|          |  [====____] 보통                      |               |
|          |                                      |               |
|          |  비밀번호 확인 *                      |               |
|          |  +----------------------------------+|               |
|          |  | ********              [eye icon] ||               |
|          |  +----------------------------------+|               |
|          |  (일치 여부 메시지 영역)              |               |
|          |                                      |               |
|          |  이름 *                               |               |
|          |  +----------------------------------+|               |
|          |  | 홍길동                            ||               |
|          |  +----------------------------------+|               |
|          |                                      |               |
|          |  휴대전화 *                           |               |
|          |  +------------------------+ +------+|               |
|          |  | 010-1234-5678          | |인증발송||               |
|          |  +------------------------+ +------+|               |
|          |                                      |               |
|          |  (SMS 인증 영역 - 조건부 표시)        |               |
|          |  +------------------------+ +------+|               |
|          |  | 인증번호 6자리          | | 확인 ||               |
|          |  +------------------------+ +------+|               |
|          |  02:45 남음            [재발송]       |               |
|          |                                      |               |
|          |  +----------------------------------+|               |
|          |  | [이전]            [가입하기]       ||               |
|          |  +----------------------------------+|               |
|          |                                      |               |
|          +--------------------------------------+               |
|                                                                  |
+================================================================+
|                          Footer (Global)                        |
+================================================================+
```

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| Step Indicator | Custom | 3-step, current=2, step1=done | `#5538B6` done/active | 표시 전용 |
| 이메일 필드 | TextField | type=email, placeholder="이메일 주소 입력", required | border `#CACACA`, focus `#553886` border-2 | 입력 중지 300ms 후 중복확인 API |
| 이메일 상태 아이콘 | Icon | spinner/check/x | spinner `#5538B6`, check `#16A34A`, x `#DC2626` | 중복확인 결과에 따라 변경 |
| 비밀번호 필드 | TextField | type=password, placeholder="영문+숫자+특수문자 8자 이상" | border `#CACACA`, focus `#553886` border-2 | 입력 시 강도 실시간 업데이트 |
| 비밀번호 표시/숨김 | IconButton | icon=eye/eye-off | `#6B7280` | 토글 type=text/password |
| 강도 표시기 | ProgressBar | 3-segment, label | weak `#DC2626`, medium `#F59E0B`, strong `#16A34A` | 입력에 따라 실시간 변경 |
| 비밀번호 확인 필드 | TextField | type=password, placeholder="비밀번호 재입력" | border `#CACACA`, focus `#553886` border-2 | blur 시 일치 검증 |
| 이름 필드 | TextField | type=text, placeholder="이름 입력", maxLength=20 | border `#CACACA`, focus `#553886` border-2 | blur 시 유효성 검증 |
| 휴대전화 필드 | TextField | type=tel, placeholder="010-0000-0000", inputMode=numeric | border `#CACACA`, focus `#553886` border-2 | 자동 하이픈 포맷팅 |
| 인증발송 버튼 | Button | variant=outline, size=sm | border `#5538B6`, text `#5538B6` | 클릭 시 SMS 발송 API |
| 인증번호 입력 필드 | TextField | type=text, maxLength=6, inputMode=numeric | border `#CACACA`, focus `#553886` border-2 | 6자리 입력 시 자동 확인 가능 |
| 확인 버튼 | Button | variant=outline, size=sm | border `#5538B6`, text `#5538B6` | 인증번호 확인 API |
| 타이머 | Text | format="MM:SS" | `#DC2626` (1분 미만), `#6B7280` (1분 이상) | 매초 카운트다운 |
| 재발송 링크 | Button/Link | variant=text | `#5538B6` text, disabled `#9CA3AF` | 1분 쿨다운 후 활성화 |
| "이전" 버튼 | Button | variant=outline, width=calc(50%-8px) | border `#CACACA`, text `#6B7280` | Step 1로 이동 |
| "가입하기" 버튼 | Button | variant=primary, width=calc(50%-8px) | bg `#5538B6`, disabled `#E5E7EB` | 모든 조건 충족 시 활성화 |
| 인라인 오류 메시지 | Text | fontSize=13px | `#DC2626` + error icon | 필드 하단 표시 |
| 인라인 성공 메시지 | Text | fontSize=13px | `#16A34A` + check icon | 필드 하단 표시 |

### Field Validation Rules

| Field | Rule | Trigger | Error Message | Success Message |
|-------|------|---------|--------------|-----------------|
| 이메일 | RFC 5322 형식 | blur + 300ms debounce | "올바른 이메일 형식을 입력해주세요" | - |
| 이메일 | API 중복확인 | debounce 300ms (형식 유효 시) | "이미 사용 중인 이메일입니다" | "사용 가능한 이메일입니다" |
| 비밀번호 | 최소 8자 | keyup | "8자 이상 입력해주세요" | - |
| 비밀번호 | 영문+숫자+특수문자 조합 | keyup | "영문, 숫자, 특수문자를 모두 포함해주세요" | - |
| 비밀번호 확인 | password === confirmPassword | blur, keyup | "비밀번호가 일치하지 않습니다" | (초록 체크 아이콘) |
| 이름 | 2~20자, 특수문자 금지 | blur | "이름은 2~20자의 한글 또는 영문만 가능합니다" | - |
| 휴대전화 | 010-XXXX-XXXX 형식 | blur | "올바른 휴대전화 번호를 입력해주세요" | - |
| SMS 인증번호 | 6자리 숫자 | blur | "올바른 인증번호를 입력해주세요" | - |

### "가입하기" 버튼 활성화 조건 (AND)

| # | 조건 | 확인 방법 |
|---|------|----------|
| 1 | 이메일 중복확인 완료 (사용 가능) | emailValidation === 'valid' |
| 2 | 비밀번호 규칙 충족 | 영문+숫자+특수문자 8자 이상 |
| 3 | 비밀번호 확인 일치 | password === confirmPassword |
| 4 | 이름 유효 | 2~20자, 특수문자 없음 |
| 5 | SMS 인증 완료 | smsAuth === 'verified' |

5개 조건 모두 충족 시 "가입하기" 버튼 `#5538B6` 활성화. 미충족 시 `#E5E7EB` bg + `#9CA3AF` text.

### Responsive Notes

- Mobile: 카드 전체 폭, padding 16px
- 휴대전화 + 인증발송 버튼: 모바일에서 버튼 하단 배치 (전체 폭)
- 버튼 영역: 세로 배치 (가입하기 상단, 이전 하단)

---

## SCR-MBR-013: 이메일 중복확인 - 사용가능 (State)

### ASCII Wireframe (이메일 필드 영역)

```
  이메일 *
  +---------------------------------------------+
  | user@example.com                     [check] |   <- 초록 체크 아이콘
  +---------------------------------------------+
    border: 2px solid #16A34A (success green)

  [check] 사용 가능한 이메일입니다                   <- 초록 텍스트 13px
```

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| 이메일 필드 | TextField | value filled, valid state | border `#16A34A` 2px | 수정 시 재검증 시작 |
| 체크 아이콘 | Icon | name=check-circle, size=20 | fill `#16A34A` | - |
| 성공 메시지 | Text | "사용 가능한 이메일입니다" | color `#16A34A`, fontSize 13px | - |

### State Transition

- 이메일 수정 시 -> 스피너(확인 중) -> 재검증 결과로 전환
- "가입하기" 버튼 활성화 조건 중 1번 충족

---

## SCR-MBR-014: 이메일 중복확인 - 중복 (State)

### ASCII Wireframe (이메일 필드 영역)

```
  이메일 *
  +---------------------------------------------+
  | existing@example.com                    [X]  |   <- 빨간 X 아이콘
  +---------------------------------------------+
    border: 2px solid #DC2626 (error red)

  [X] 이미 사용 중인 이메일입니다                    <- 빨간 텍스트 13px
```

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| 이메일 필드 | TextField | value filled, error state | border `#DC2626` 2px | 수정 시 재검증 시작 |
| X 아이콘 | Icon | name=x-circle, size=20 | fill `#DC2626` | - |
| 오류 메시지 | Text | "이미 사용 중인 이메일입니다" | color `#DC2626`, fontSize 13px | - |

### State Transition

- 이메일 수정 시 -> 스피너(확인 중) -> 재검증 결과로 전환
- "가입하기" 버튼 비활성화 유지

---

## SCR-MBR-015: SMS 인증 진행중 (State)

### ASCII Wireframe (휴대전화 + SMS 영역)

```
  휴대전화 *
  +------------------------------+ +----------+
  | 010-1234-5678                | | 재발송    |   <- 쿨다운 중이면 비활성화
  +------------------------------+ +----------+
    (비활성화 상태 - 수정 불가)      45초 후 재발송 가능

  인증번호
  +------------------------------+ +----------+
  | _ _ _ _ _ _                  | |  확인    |
  +------------------------------+ +----------+
    border: #553886 (focus)

  02:45 남음                                        <- 빨간 텍스트 (1분 미만 시)
```

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| 휴대전화 필드 | TextField | disabled, value filled | bg `#F9FAFB`, text `#6B7280` | 수정 불가 |
| 재발송 버튼 | Button | variant=outline, size=sm | 활성: border `#5538B6`, 비활성: `#E5E7EB` | 1분 쿨다운 후 활성화 |
| 쿨다운 안내 | Text | "N초 후 재발송 가능" | `#6B7280` fontSize 12px | 1분 카운트다운 |
| 인증번호 필드 | TextField | maxLength=6, inputMode=numeric, autoFocus | border `#553886` border-2 (focus) | 6자리 입력 |
| 확인 버튼 | Button | variant=primary, size=sm | bg `#5538B6`, text white | 인증번호 확인 API |
| 타이머 | Text | format="MM:SS" | < 1분: `#DC2626`, >= 1분: `#6B7280` | 매초 카운트다운 (180초 시작) |

### Timer Rules

| Timer | Duration | Display | Behavior |
|-------|----------|---------|----------|
| 인증 유효 | 3분 (180초) | MM:SS 형식 | 0 도달 시 SCR-MBR-017 전환 |
| 재발송 쿨다운 | 1분 (60초) | "N초 후 재발송 가능" | 0 도달 시 재발송 버튼 활성화 |

### Accessibility

- 타이머: `aria-live="polite"`, `role="timer"`
- 인증번호 필드: `aria-label="SMS 인증번호 6자리"`, `autocomplete="one-time-code"`
- 포커스: 인증번호 발송 성공 시 인증번호 필드로 자동 포커스

---

## SCR-MBR-016: SMS 인증 완료 (State)

### ASCII Wireframe (휴대전화 + SMS 영역)

```
  휴대전화 *
  +---------------------------------------------+
  | 010-1234-5678                        [lock]  |   <- 자물쇠 아이콘
  +---------------------------------------------+
    (비활성화 - 수정 불가)

  인증번호
  +---------------------------------------------+
  | 123456                             [check]   |   <- 초록 체크 아이콘
  +---------------------------------------------+
    border: 2px solid #16A34A
    (비활성화 - 수정 불가)

  [check] 인증이 완료되었습니다                       <- 초록 텍스트
```

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| 휴대전화 필드 | TextField | disabled, value filled | bg `#F9FAFB`, text `#6B7280`, lock icon | 수정 불가 |
| 인증번호 필드 | TextField | disabled, value filled, success state | bg `#F9FAFB`, border `#16A34A` 2px | 수정 불가 |
| 체크 아이콘 | Icon | name=check-circle, size=20 | fill `#16A34A` | - |
| 성공 메시지 | Text | "인증이 완료되었습니다" | color `#16A34A`, fontSize 13px | - |

### State Notes

- 인증 완료 후 휴대전화, 인증번호 필드 모두 disabled
- 타이머, 재발송 버튼, 확인 버튼 모두 숨김
- "가입하기" 버튼 활성화 조건 중 5번(SMS 인증) 충족

---

## SCR-MBR-017: SMS 인증 만료 (State)

### ASCII Wireframe (휴대전화 + SMS 영역)

```
  휴대전화 *
  +------------------------------+ +----------+
  | 010-1234-5678                | | 재발송    |   <- 활성화 상태
  +------------------------------+ +----------+
    (비활성화)

  인증번호
  +---------------------------------------------+
  | 123456                                [X]    |   <- 빨간 X 아이콘
  +---------------------------------------------+
    border: 2px solid #DC2626
    (비활성화 - 수정 불가)

  [X] 인증번호가 만료되었습니다. 재발송해주세요.      <- 빨간 텍스트

  00:00                                              <- 타이머 종료
```

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| 휴대전화 필드 | TextField | disabled | bg `#F9FAFB` | 수정 불가 |
| 재발송 버튼 | Button | variant=primary, size=sm | bg `#5538B6`, text white | 클릭 시 SMS 재발송, SCR-MBR-015 전환 |
| 인증번호 필드 | TextField | disabled, error state | border `#DC2626` 2px, bg `#FEF2F2` | 수정 불가 |
| X 아이콘 | Icon | name=x-circle | fill `#DC2626` | - |
| 만료 메시지 | Text | "인증번호가 만료되었습니다. 재발송해주세요." | color `#DC2626`, fontSize 13px | - |
| 타이머 | Text | "00:00" | color `#DC2626` | 정지 상태 |

### State Transition

- "재발송" 클릭 -> 1분 쿨다운 체크 -> 통과 시 SMS 발송 -> SCR-MBR-015 전환
- 1분 미경과 시 "N초 후 재발송 가능" 안내

---

## SCR-MBR-018: 비밀번호 강도 표시 (Section)

### ASCII Wireframe (비밀번호 필드 하단 섹션)

#### 상태 1: 약함 (Weak)

```
  비밀번호 *
  +---------------------------------------------+
  | ***                               [eye-off]  |
  +---------------------------------------------+
  [====____________] 약함
   #DC2626            #E5E7EB

  "영문, 숫자, 특수문자를 모두 포함해주세요"          <- 힌트 텍스트
```

#### 상태 2: 보통 (Medium)

```
  비밀번호 *
  +---------------------------------------------+
  | ********                          [eye-off]  |
  +---------------------------------------------+
  [========________] 보통
   #F59E0B            #E5E7EB

  "특수문자를 추가하면 더 안전합니다"                 <- 힌트 텍스트
```

#### 상태 3: 강함 (Strong)

```
  비밀번호 *
  +---------------------------------------------+
  | **********#!                      [eye-off]  |
  +---------------------------------------------+
  [================] 강함
   #16A34A
```

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| 강도 바 (3-segment) | ProgressBar | width=100%, height=4px | - | 실시간 업데이트 |
| Segment 1 | Bar | 33% width | filled: active color, empty: `#E5E7EB` | - |
| Segment 2 | Bar | 33% width | filled: active color, empty: `#E5E7EB` | - |
| Segment 3 | Bar | 33% width | filled: active color, empty: `#E5E7EB` | - |
| 강도 라벨 | Text | "약함" / "보통" / "강함" | 약함 `#DC2626`, 보통 `#F59E0B`, 강함 `#16A34A` | 실시간 변경 |
| 힌트 텍스트 | Text | fontSize=12px | `#6B7280` | 강도별 다른 메시지 |

### Password Strength Algorithm

| Strength | Condition | Segments Filled | Color | Hint |
|----------|-----------|----------------|-------|------|
| Empty | 미입력 | 0/3 | - | "영문+숫자+특수문자 8자 이상" |
| Weak | 8자 미만 OR 1가지 문자 유형만 | 1/3 | `#DC2626` | "영문, 숫자, 특수문자를 모두 포함해주세요" |
| Medium | 8자 이상 + 2가지 문자 유형 | 2/3 | `#F59E0B` | "특수문자를 추가하면 더 안전합니다" (또는 해당 유형) |
| Strong | 8자 이상 + 영문+숫자+특수문자 모두 포함 | 3/3 | `#16A34A` | (없음 - 충분히 강함) |

### Accessibility

- 강도 바: `role="meter"`, `aria-valuemin=0`, `aria-valuemax=3`, `aria-valuenow=N`
- 강도 라벨: `aria-live="polite"` (변경 시 스크린 리더 통보)
- 비밀번호 표시/숨김 토글: `aria-label="비밀번호 표시"` / `aria-label="비밀번호 숨기기"`

---

## SCR-MBR-019: 가입완료 (Step 3)

### ASCII Wireframe (PC Layout - 480px Card)

```
+================================================================+
|                          Header (Global)                        |
+================================================================+
|                                                                  |
|            +----- Card (480px, centered) -----+                 |
|            |                                    |                |
|            |  [Step: (1)====(2)====(3)]         |                |
|            |            모두 완료 상태            |                |
|            |                                    |                |
|            |         [체크 원형 아이콘]           |                |
|            |          80px, #5538B6 bg           |                |
|            |          white check icon           |                |
|            |                                    |                |
|            |      "회원가입이 완료되었습니다!"     |                |
|            |       24px, 600 weight, #1A1A1A     |                |
|            |                                    |                |
|            |      "홍길동님, 환영합니다."          |                |
|            |       16px, 400 weight, #6B7280     |                |
|            |                                    |                |
|            |  +------------------------------+  |                |
|            |  |  [쿠폰 아이콘]                |  |                |
|            |  |  신규 가입 축하 쿠폰            |  |                |
|            |  |                                |  |                |
|            |  |  5,000원 할인                   |  |                |
|            |  |  30px, 600 weight, #5538B6     |  |                |
|            |  |                                |  |                |
|            |  |  30,000원 이상 주문 시 사용     |  |                |
|            |  |  유효기간: 30일                  |  |                |
|            |  |  13px, #6B7280                 |  |                |
|            |  +------------------------------+  |                |
|            |   bg: #F5F0FF, border: #5538B6/20  |                |
|            |   border-radius: 12px, padding: 24 |                |
|            |                                    |                |
|            |  +------------------------------+  |                |
|            |  |    로그인하기                   |  |                |
|            |  +------------------------------+  |                |
|            |  bg: #5538B6, text: white, full-w  |                |
|            |                                    |                |
|            |  +------------------------------+  |                |
|            |  |    메인으로                     |  |                |
|            |  +------------------------------+  |                |
|            |  border: #CACACA, text: #6B7280    |                |
|            |                                    |                |
|            +------------------------------------+                |
|                                                                  |
+================================================================+
|                          Footer (Global)                        |
+================================================================+
```

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| Step Indicator | Custom | 3-step, all done | `#5538B6` all steps | 표시 전용 |
| 체크 아이콘 | Icon | circle bg, check icon, 80x80px | bg `#5538B6`, icon white | - |
| 환영 제목 | Heading | h2, "회원가입이 완료되었습니다!" | `#1A1A1A` 24px 600 weight | - |
| 환영 부제 | Text | "{memberName}님, 환영합니다." | `#6B7280` 16px 400 weight | - |
| 쿠폰 카드 | Card | 쿠폰 정보 표시 | bg `#F5F0FF`, border `rgba(85,56,182,0.2)`, radius 12px | - |
| 쿠폰 아이콘 | Icon | ticket/gift, 32px | fill `#5538B6` | - |
| 쿠폰 라벨 | Text | "신규 가입 축하 쿠폰" | `#351D87` 14px 500 weight | - |
| 쿠폰 금액 | Text | "5,000원 할인" | `#5538B6` 30px 600 weight | - |
| 쿠폰 조건 | Text | "30,000원 이상 주문 시 사용" | `#6B7280` 13px | - |
| 쿠폰 유효기간 | Text | "유효기간: 30일" | `#6B7280` 13px | - |
| "로그인하기" 버튼 | Button | variant=primary, fullWidth | bg `#5538B6`, text white, hover `#351D87` | /member/login 이동 |
| "메인으로" 버튼 | Button | variant=outline, fullWidth | border `#CACACA`, text `#6B7280` | / (메인) 이동 |

### Coupon Information (Confirmed Policy)

| Item | Value | Source |
|------|-------|--------|
| 쿠폰명 | 신규 가입 축하 쿠폰 | SPEC-PLAN-001 |
| 할인금액 | **5,000원** | policy-confirmed.md #12 |
| 최소주문금액 | **30,000원** | policy-confirmed.md #13 |
| 유효기간 | 30일 | policy-confirmed.md #21 |
| 발급 방식 | 가입 완료 시 자동 발급 | shopby 프로모션 설정 |

> Note: screens.md와 acceptance.md에 10,000원으로 기재되어 있으나, policy-confirmed.md (확정 정책문서)에 5,000원으로 확정. 본 와이어프레임은 확정 정책을 따름.

### Accessibility

- 환영 메시지: `role="alert"`, 페이지 진입 시 스크린 리더 자동 읽기
- 쿠폰 카드: `role="region"`, `aria-label="신규 가입 축하 쿠폰"`
- "로그인하기" 버튼에 자동 포커스

### Responsive Notes

- Mobile: 카드 전체 폭, 쿠폰 카드 padding 16px
- 체크 아이콘: 60x60px (모바일)
- 버튼: 전체 폭 유지

---

## SCR-MBR-020: 폼 유효성 검증 오류 (State)

### ASCII Wireframe (정보입력 폼 전체 오류 상태)

```
  이메일 *
  +---------------------------------------------+
  | invalid-email                          [X]   |
  +---------------------------------------------+
    border: 2px solid #DC2626
  [X] 올바른 이메일 형식을 입력해주세요

  비밀번호 *
  +---------------------------------------------+
  | ***                               [eye-off]  |
  +---------------------------------------------+
    border: 2px solid #DC2626
  [====____________] 약함
  [!] 영문, 숫자, 특수문자를 모두 포함해주세요

  비밀번호 확인 *
  +---------------------------------------------+
  | ******                            [eye-off]  |
  +---------------------------------------------+
    border: 2px solid #DC2626
  [X] 비밀번호가 일치하지 않습니다

  이름 *
  +---------------------------------------------+
  | (빈 필드)                                    |
  +---------------------------------------------+
    border: 2px solid #DC2626
  [!] 이름을 입력해주세요

  휴대전화 *
  +------------------------------+ +----------+
  | 010-1234                     | | 인증발송  |
  +------------------------------+ +----------+
    border: 2px solid #DC2626
  [!] 올바른 휴대전화 번호를 입력해주세요

  +----------------------------------------------+
  |  [이전]              [가입하기]                |
  +----------------------------------------------+
                          disabled (#E5E7EB)
```

### Field Error Messages (Complete List)

| Field | Validation Rule | Error Message | Icon |
|-------|----------------|---------------|------|
| 이메일 | 빈 값 | "이메일을 입력해주세요" | ! (exclamation) |
| 이메일 | RFC 5322 형식 위반 | "올바른 이메일 형식을 입력해주세요" | X |
| 이메일 | 중복 | "이미 사용 중인 이메일입니다" | X |
| 비밀번호 | 빈 값 | "비밀번호를 입력해주세요" | ! |
| 비밀번호 | 8자 미만 | "8자 이상 입력해주세요" | ! |
| 비밀번호 | 조합 미충족 | "영문, 숫자, 특수문자를 모두 포함해주세요" | ! |
| 비밀번호 확인 | 빈 값 | "비밀번호 확인을 입력해주세요" | ! |
| 비밀번호 확인 | 불일치 | "비밀번호가 일치하지 않습니다" | X |
| 이름 | 빈 값 | "이름을 입력해주세요" | ! |
| 이름 | 2자 미만 | "이름은 2자 이상 입력해주세요" | ! |
| 이름 | 특수문자 포함 | "이름은 한글 또는 영문만 가능합니다" | X |
| 이름 | 20자 초과 | "이름은 20자 이내로 입력해주세요" | ! |
| 휴대전화 | 빈 값 | "휴대전화 번호를 입력해주세요" | ! |
| 휴대전화 | 형식 오류 | "올바른 휴대전화 번호를 입력해주세요" | X |
| SMS 인증 | 미완료 상태에서 가입 시도 | "휴대전화 인증을 완료해주세요" | ! |
| SMS 인증번호 | 불일치 | "인증번호가 일치하지 않습니다" | X |
| SMS 인증번호 | 만료 | "인증번호가 만료되었습니다. 재발송해주세요." | X |

### Error Display Rules

| Rule | Description |
|------|-------------|
| 표시 위치 | 해당 필드 바로 아래, padding-top 4px |
| 색상 | 텍스트 `#DC2626`, 아이콘 `#DC2626` |
| 필드 테두리 | `border: 2px solid #DC2626` |
| 아이콘 크기 | 14px, 텍스트 앞에 인라인 배치 |
| 폰트 | Noto Sans, 13px, 400 weight |
| 표시 타이밍 | blur 이벤트 시 (포커스 이탈), "가입하기" 클릭 시 전체 검증 |
| 해소 조건 | 필드 재입력 후 유효성 통과 시 즉시 제거 |
| 다중 오류 | 필드당 1개만 표시 (우선순위: 빈값 > 형식 > 중복) |
| 접근성 | `role="alert"`, `aria-live="assertive"`, 오류 필드에 `aria-invalid="true"` + `aria-describedby` |

### Component Specification Table

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|--------------|-------------|
| 오류 필드 테두리 | CSS | border: 2px solid | `#DC2626` | 유효 입력 시 기본 테두리 복귀 |
| 오류 아이콘 (!) | Icon | name=alert-circle, 14px | fill `#DC2626` | 인라인 |
| 오류 아이콘 (X) | Icon | name=x-circle, 14px | fill `#DC2626` | 인라인 |
| 오류 메시지 텍스트 | Text | fontSize=13px, lineHeight=1.4 | color `#DC2626` | blur/submit 시 표시 |
| "가입하기" 비활성 | Button | disabled=true | bg `#E5E7EB`, text `#9CA3AF` | 클릭 무시 |

### "가입하기" 클릭 시 전체 검증 Flow

1. 모든 필드에 대해 순차 유효성 검증 실행
2. 오류 발견 시 첫 번째 오류 필드로 스크롤 + 포커스
3. 모든 오류 필드에 인라인 오류 메시지 동시 표시
4. 오류가 없으면 가입 API 호출

---

## 화면 간 전환 매트릭스

```
SCR-MBR-011 (약관동의)
    |
    +-- "다음" 클릭 (필수 약관 동의 시) --> SCR-MBR-012 (정보입력)
    +-- "이전" 클릭 --> /member/login
    +-- "로그인" 링크 --> /member/login

SCR-MBR-012 (정보입력)
    |
    +-- 이메일 입력 300ms --> SCR-MBR-013 (사용가능) 또는 SCR-MBR-014 (중복)
    +-- 비밀번호 입력 --> SCR-MBR-018 (강도 표시)
    +-- "인증발송" 클릭 --> SCR-MBR-015 (인증 진행중)
    |     +-- 인증번호 확인 성공 --> SCR-MBR-016 (인증 완료)
    |     +-- 타이머 만료 --> SCR-MBR-017 (인증 만료)
    +-- 유효성 오류 --> SCR-MBR-020 (오류 상태)
    +-- "가입하기" 클릭 (전체 통과) --> SCR-MBR-019 (가입완료)
    +-- "이전" 클릭 --> SCR-MBR-011 (약관동의)

SCR-MBR-019 (가입완료)
    |
    +-- "로그인하기" --> /member/login
    +-- "메인으로" --> / (메인 페이지)
```

---

## Step Guard Rules

| Guard | 조건 | 동작 |
|-------|------|------|
| Step 2 직접 접근 차단 | 약관동의 미완료 상태에서 /member/signup?step=info 직접 접근 | /member/signup?step=terms 로 리다이렉트 |
| Step 3 직접 접근 차단 | 가입 미완료 상태에서 /member/signup?step=complete 직접 접근 | /member/signup?step=terms 로 리다이렉트 |
| 로그인 사용자 접근 차단 | 로그인 상태에서 /member/signup 접근 | / (메인 페이지) 로 리다이렉트 |
| 뒤로가기 방지 | 가입 완료 후 브라우저 뒤로가기 | 정보입력으로 돌아가지 않음 (history.replaceState) |

---

## API Mapping Summary

| Screen | User Action | API Endpoint | Method |
|--------|-------------|-------------|--------|
| SCR-MBR-011 | 약관 목록 조회 | `/terms` | GET |
| SCR-MBR-011 | 약관 상세 조회 | `/terms/{termsNo}` | GET |
| SCR-MBR-012 | 이메일 중복확인 | `/members/id/exist` | GET |
| SCR-MBR-012 | SMS 인증번호 발송 | `/members/authentication/sms` | POST |
| SCR-MBR-012 | SMS 인증번호 확인 | `/members/authentication/sms/verify` | POST |
| SCR-MBR-012 | 회원가입 제출 | `/members` | POST |

---

## Related Requirements Coverage

| Screen | REQ Coverage |
|--------|-------------|
| SCR-MBR-011 | REQ-032, 033, 034, 035, 036, 037, 038, 039 |
| SCR-MBR-012 | REQ-040~058 |
| SCR-MBR-013 | REQ-049 |
| SCR-MBR-014 | REQ-050 |
| SCR-MBR-015 | REQ-053, 056, 057 |
| SCR-MBR-016 | REQ-054 |
| SCR-MBR-017 | REQ-056, 058 |
| SCR-MBR-018 | REQ-044 |
| SCR-MBR-019 | REQ-059, 060, 061 |
| SCR-MBR-020 | REQ-041, 042 |

---

*Document: expert-frontend (MoAI)*
*Reference: SPEC-MEMBER-001 v1.0.0*
*Policy: policy-confirmed.md (coupon: 5,000 won / min order: 30,000 won)*
