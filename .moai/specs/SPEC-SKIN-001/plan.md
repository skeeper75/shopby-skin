---
id: SPEC-SKIN-001
version: 2.0.0
type: plan
---

# SPEC-SKIN-001 v2: 인증/회원가입 디자인시스템 마이그레이션 - 구현 계획

## 1. 마일스톤 (우선순위 기반)

### Primary Goal: 폼 컴포넌트 마이그레이션

모든 폼 필드를 Huni Field + TextField로 전환하고 토큰 체계를 --huni-*로 교체한다.

**Task 1.1: Field + TextField 전환**
- 로그인 폼 (이메일, 비밀번호) - 2개 필드
- 아이디 찾기 폼 (휴대전화) - 1개 필드
- 비밀번호 찾기 폼 (이메일, 휴대전화) - 2개 필드
- 회원가입 정보입력 폼 (이메일, 비밀번호, 비밀번호 확인, 이름, 휴대전화) - 5개 필드
- 총 10개 입력 필드 마이그레이션

**Task 1.2: 비밀번호 토글 Icon 전환**
- 기존 커스텀 PasswordToggle -> TextField.Slot + Icon(eye/eye-off)
- 로그인, 회원가입 비밀번호 필드 적용

**Task 1.3: 토큰 체계 전환**
- 모든 --po-* 참조를 --huni-* 토큰으로 교체
- cn() 유틸리티 사용 확인 (clsx + tailwind-merge)

### Secondary Goal: Dialog/Snackbar/Checkbox 마이그레이션

**Task 2.1: Checkbox 전환**
- 약관동의 페이지의 전체동의 + 개별 약관 체크박스
- Checkbox.Root > Checkbox.Control > Checkbox.Label 구조 적용
- 전체동의/개별해제 연동 로직 보존

**Task 2.2: Dialog 전환**
- 약관 전문 보기 모달 -> Dialog Compound Component
- 이메일 중복확인 결과 알림 -> Dialog
- Dialog.Header > Dialog.Body > Dialog.Footer 구조

**Task 2.3: Snackbar 전환**
- 기존 alert/toast 알림 -> useSnackbar hook
- SnackbarProvider 루트 설정 확인
- 성공/실패/정보 variant 적용

### Final Goal: Icon/Divider 정리 및 회귀 테스트

**Task 3.1: Icon 래퍼 전환**
- lucide-react 직접 import -> Huni Icon 래퍼
- Eye, EyeOff, Check, AlertCircle, ChevronLeft 등

**Task 3.2: Divider 전환**
- `<hr>` 직접 사용 -> Huni Divider
- "또는 이메일로 계속하기" 구분선

**Task 3.3: 회귀 테스트**
- 로그인 플로우 E2E 확인
- 회원가입 전체 스텝 E2E 확인
- 반응형 레이아웃 검증

---

## 2. 파일별 마이그레이션 전략

| 파일 | 변경 내용 | 규모 |
|------|----------|------|
| `pages/SignIn/` | TextField, Field, Icon, Divider, Snackbar 적용 | M |
| `pages/SignUp/` | TextField, Field, Checkbox, Icon, Dialog 적용 | M |
| `pages/SignUpConfirm/` | Icon, Snackbar 적용 | S |
| `pages/FindId/` | TextField, Field, Snackbar 적용 | S |
| `pages/FindPassword/` | TextField, Field, Snackbar 적용 | S |
| `components/auth/StepIndicator/` | 토큰 전환만 | XS |
| `components/auth/PhoneVerification/` | TextField, Field, Icon 적용 | S |
| `components/auth/PasswordToggle/` | 삭제 (TextField.Slot + Icon으로 대체) | XS |
| `components/auth/TermsAgreement/` | Checkbox, Dialog 적용 | S |

---

## 3. 기술적 접근

### 3.1 Compound Component 패턴 적용

모든 폼 필드는 다음 패턴을 따른다:

```
Field.Root
  Field.Label
  Field.Control
    TextField (또는 TextField + TextField.Slot)
  Field.ErrorMessage
  Field.HelperText (선택)
```

### 3.2 data-* 상태 속성 활용

- `data-focus-visible`: 키보드 포커스 시 브랜드 색상 테두리
- `data-invalid`: 유효성 오류 시 danger 색상
- `data-checked`: 체크박스 체크 상태
- `data-disabled`: 비활성 상태

### 3.3 기존 로직 보존 전략

- API 호출 로직 (fetchHttpRequest 등) 수정 없음
- 상태 관리 로직 수정 없음
- 유효성 검사 규칙 수정 없음
- 오직 UI 컴포넌트 레이어만 교체

---

## 4. 리스크 및 대응

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| Field 컨텍스트와 기존 유효성 검사 라이브러리 충돌 | Medium | Field의 aria-* 자동 연결이 기존 로직과 호환되는지 사전 검증 |
| Snackbar Provider 미설정 | Low | 앱 루트 레이아웃에 SnackbarProvider 추가 확인 |
| 비밀번호 토글 동작 차이 | Low | TextField.Slot 내 Icon 클릭 이벤트가 type 전환과 동일하게 동작하는지 확인 |
| 토큰 매핑 누락 | Low | Grep으로 --po-* 잔존 참조 전수 검사 |

---

## 5. 의존성

- **SPEC-DS-006**: Huni 디자인시스템 컴포넌트 (선행 완료 필수)
  - TextField, Field, Checkbox, Dialog, Snackbar, Icon, Divider 모두 구현 완료 상태여야 함
- **SnackbarProvider**: 앱 루트에 설정 필요 (SPEC-DS-006에서 제공)
