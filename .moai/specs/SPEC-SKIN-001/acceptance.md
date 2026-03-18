---
id: SPEC-SKIN-001
version: 2.0.0
type: acceptance
---

# SPEC-SKIN-001 v2: 인증/회원가입 디자인시스템 마이그레이션 - 인수 조건

## 1. 컴포넌트 렌더링 테스트

### Scenario 1: 로그인 폼 TextField 렌더링

- **Given** 사용자가 로그인 페이지에 접속했을 때
- **When** 페이지가 로드되면
- **Then** 이메일 필드가 `Field.Root > Field.Label > Field.Control > TextField` 구조로 렌더링된다
- **And** 비밀번호 필드에 `TextField.Slot`이 포함된 `Icon`(eye) 토글 버튼이 표시된다
- **And** `--po-*` 토큰 참조가 0건이다

### Scenario 2: 로그인 폼 유효성 상태 표시

- **Given** 로그인 폼에 빈 값이 입력된 상태에서
- **When** "로그인하기" 버튼을 클릭하면
- **Then** 이메일 TextField에 `data-invalid` 속성이 추가된다
- **And** `Field.ErrorMessage`에 "입력해주세요" 메시지가 표시된다
- **And** 테두리 색상이 `--huni-stroke-danger` 토큰을 사용한다

### Scenario 3: 비밀번호 보기/숨기기 토글

- **Given** 비밀번호 필드에 텍스트가 입력된 상태에서
- **When** `TextField.Slot` 내 Eye `Icon`을 클릭하면
- **Then** 입력 type이 "password"에서 "text"로 전환된다
- **And** 아이콘이 Eye에서 EyeOff로 변경된다
- **When** EyeOff `Icon`을 다시 클릭하면
- **Then** 입력 type이 "text"에서 "password"로 전환된다

### Scenario 4: 약관동의 Checkbox 렌더링

- **Given** 사용자가 회원가입 약관동의 스텝에 진입했을 때
- **When** 페이지가 로드되면
- **Then** "전체 동의" 체크박스가 `Checkbox.Root > Checkbox.Control > Checkbox.Label` 구조로 렌더링된다
- **And** 개별 약관 체크박스 3개가 동일한 Compound Component 구조로 렌더링된다

### Scenario 5: 전체동의 연동 동작

- **Given** 약관동의 스텝에서 개별 체크박스가 모두 해제된 상태에서
- **When** "전체 동의" Checkbox를 클릭하면
- **Then** 모든 개별 Checkbox에 `data-checked` 속성이 추가된다
- **When** 개별 Checkbox 하나를 해제하면
- **Then** "전체 동의" Checkbox의 `data-checked` 속성이 제거된다

### Scenario 6: 회원가입 폼 Field 구조

- **Given** 사용자가 회원가입 정보입력 스텝에 진입했을 때
- **When** 페이지가 로드되면
- **Then** 이메일, 비밀번호, 비밀번호 확인, 이름, 휴대전화 5개 필드가 모두 `Field` + `TextField` 구조로 렌더링된다
- **And** 각 `Field`에 자동으로 `aria-describedby` 속성이 연결된다
- **And** 이메일 필드 우측에 "중복확인" 버튼이 `TextField.Slot`으로 배치된다
- **And** 휴대전화 필드 우측에 "인증요청" 버튼이 `TextField.Slot`으로 배치된다

### Scenario 7: 약관 전문 Dialog 표시

- **Given** 약관동의 스텝에서
- **When** 개별 약관의 "보기" 버튼을 클릭하면
- **Then** `Dialog` Compound Component가 `data-open` 속성과 함께 열린다
- **And** `Dialog.Header`에 약관 제목이 표시된다
- **And** `Dialog.Body`에 약관 전문이 표시된다
- **And** `Dialog.Close` 버튼으로 닫을 수 있다

### Scenario 8: Snackbar 알림 동작

- **Given** 사용자가 로그인 폼에서
- **When** 올바른 자격 증명으로 로그인에 성공하면
- **Then** `useSnackbar`의 `success` variant로 "로그인되었습니다" 알림이 표시된다
- **When** 잘못된 자격 증명으로 로그인에 실패하면
- **Then** `useSnackbar`의 `error` variant로 에러 메시지 알림이 표시된다

### Scenario 9: Icon 래퍼 사용 확인

- **Given** 인증/회원가입 전체 페이지에서
- **When** 소스 코드를 검사하면
- **Then** lucide-react에서 직접 import하는 구문이 0건이다
- **And** 모든 아이콘이 Huni `Icon` 래퍼 컴포넌트를 통해 사용된다

### Scenario 10: Divider 컴포넌트 사용

- **Given** 로그인 페이지의 소셜 로그인 구분선에서
- **When** 페이지가 렌더링되면
- **Then** "또는 이메일로 계속하기" 텍스트 좌우에 Huni `Divider` 컴포넌트가 사용된다
- **And** `<hr>` 직접 사용이 0건이다

---

## 2. 회귀 테스트 (기존 기능 보존)

### Scenario R1: 로그인 플로우 회귀

- **Given** 가입된 회원이 로그인 페이지에 접속했을 때
- **When** 올바른 이메일과 비밀번호를 입력하고 "로그인하기"를 클릭하면
- **Then** JWT 토큰이 localStorage에 저장된다
- **And** 이전 페이지 또는 메인 페이지로 리다이렉트된다

### Scenario R2: 회원가입 전체 스텝 플로우 회귀

- **Given** 비회원이 회원가입 페이지에 접속했을 때
- **When** 약관동의(필수 모두 체크) -> 정보입력(이메일 중복확인 + 휴대전화 인증 완료) -> "가입하기" 클릭
- **Then** 회원가입 API가 호출되고 가입완료 페이지로 이동한다

### Scenario R3: 아이디 찾기 플로우 회귀

- **Given** 아이디 찾기 페이지에서
- **When** 가입된 휴대전화 번호를 입력하고 "아이디 찾기"를 클릭하면
- **Then** 마스킹된 이메일(ho****@gmail.com)과 가입일이 표시된다

### Scenario R4: SMS 인증 타이머 회귀

- **Given** 회원가입 정보입력에서 인증번호가 발송된 상태일 때
- **When** 3분(180초)이 경과하면
- **Then** 타이머가 0:00이 되고 재발송 안내가 표시된다

### Scenario R5: 반응형 레이아웃 회귀

- **Given** 로그인/회원가입 페이지에서
- **When** 뷰포트를 Mobile(< 768px), Tablet(768~1024px), Desktop(>= 1024px)로 변경하면
- **Then** 각 브레이크포인트에 맞는 레이아웃이 정상 표시된다

---

## 3. 토큰 전환 검증

### Scenario T1: --po-* 토큰 완전 제거

- **Given** 마이그레이션이 완료된 후
- **When** 인증/회원가입 관련 파일에서 `--po-` 문자열을 검색하면
- **Then** 검색 결과가 0건이다

### Scenario T2: --huni-* 토큰 사용 확인

- **Given** 마이그레이션이 완료된 후
- **When** 로그인 페이지의 CTA 버튼 스타일을 검사하면
- **Then** 배경색이 `--huni-bg-brand-solid` 토큰을 참조한다
- **And** 호버 배경색이 `--huni-bg-brand-solid-hover` 토큰을 참조한다

---

## 4. 접근성 검증

### Scenario A1: 키보드 포커스 표시

- **Given** 로그인 폼에서
- **When** Tab 키로 이메일 필드에 포커스하면
- **Then** `data-focus-visible` 속성이 추가되고 `--huni-stroke-brand` 테두리가 표시된다

### Scenario A2: aria 속성 자동 연결

- **Given** 회원가입 폼의 이메일 필드에서
- **When** 유효성 오류가 발생하면
- **Then** `aria-invalid="true"` 속성이 설정된다
- **And** `aria-describedby`가 `Field.ErrorMessage`의 id를 참조한다

---

## 5. 품질 게이트

- [ ] 인증/회원가입 모든 파일에서 `--po-*` 토큰 참조 0건
- [ ] 인증/회원가입 모든 파일에서 lucide-react 직접 import 0건
- [ ] 인증/회원가입 모든 파일에서 `<hr>` 직접 사용 0건
- [ ] 인증/회원가입 모든 폼 필드가 Field + TextField 구조 사용
- [ ] 인증/회원가입 모든 모달이 Dialog Compound Component 사용
- [ ] 인증/회원가입 모든 알림이 Snackbar (useSnackbar) 사용
- [ ] Mobile/Desktop 반응형 레이아웃 정상 동작
- [ ] 키보드 네비게이션 및 data-focus-visible 정상 동작
- [ ] Lighthouse 접근성 점수 90+

## 6. Definition of Done

- [ ] REQ-MIG-001-001 ~ REQ-MIG-001-009 모든 인수 기준 충족
- [ ] E2E 테스트: 로그인 -> 로그아웃 플로우 통과
- [ ] E2E 테스트: 회원가입 전체 스텝 플로우 통과
- [ ] 회귀 테스트: R1 ~ R5 전체 통과
- [ ] 토큰 검증: T1, T2 통과
- [ ] 접근성 검증: A1, A2 통과
- [ ] 코드 리뷰 완료
