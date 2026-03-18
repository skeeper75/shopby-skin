---
id: SPEC-SKIN-002
version: 2.0.0
type: acceptance
---

# SPEC-SKIN-002 v2: 마이페이지 디자인시스템 마이그레이션 - 인수 조건

## 1. 컴포넌트 렌더링 테스트

### Scenario 1: 주문 상태 Chip 렌더링

- **Given** 주문 목록에 다양한 상태의 주문이 있을 때
- **When** 주문조회 페이지가 로드되면
- **Then** 각 주문의 상태가 Huni `Chip` 컴포넌트로 렌더링된다
- **And** 주문접수는 `Chip` variant="secondary", 제작중은 variant="warning", 배송중은 variant="info", 배송완료는 variant="neutral", 취소는 variant="danger"로 표시된다

### Scenario 2: Pagination 렌더링 및 동작

- **Given** 주문 목록이 20건 이상일 때
- **When** 주문조회 페이지가 로드되면
- **Then** 하단에 Huni `Pagination` 컴포넌트가 렌더링된다
- **And** 현재 페이지 번호가 `--huni-fg-brand` 토큰으로 강조된다
- **When** 다음 페이지 버튼을 클릭하면
- **Then** 주문 목록이 해당 페이지 데이터로 갱신된다

### Scenario 3: 쿠폰관리 Tabs 렌더링

- **Given** 사용자가 쿠폰관리 페이지에 접속했을 때
- **When** 페이지가 로드되면
- **Then** `Tabs.Root > Tabs.List > Tabs.Trigger(3개)` 구조로 3탭이 렌더링된다
- **And** 기본 활성 탭은 "사용가능"이다
- **And** 각 Trigger에 해당 건수가 `Chip`으로 표시된다
- **And** 탭 전환 시 Indicator 애니메이션이 동작한다

### Scenario 4: 리뷰 Tabs + Pagination

- **Given** 나의리뷰 페이지에 접속했을 때
- **When** 페이지가 로드되면
- **Then** `Tabs` variant="chip"으로 작성가능/작성완료 2탭이 표시된다
- **When** "작성완료" 탭을 클릭하면
- **Then** 작성한 리뷰 목록이 `Pagination`과 함께 표시된다

### Scenario 5: 주문 목록 Skeleton 로딩

- **Given** 주문조회 페이지에 접속했을 때
- **When** 주문 데이터를 로딩 중이면
- **Then** 주문 카드와 동일한 형태의 `Skeleton` 컴포넌트 5개가 wave 애니메이션으로 표시된다
- **When** 데이터 로딩이 완료되면
- **Then** Skeleton이 실제 주문 카드 콘텐츠로 교체된다

### Scenario 6: 회원정보수정 Field + TextField 구조

- **Given** 회원정보수정 페이지에서 비밀번호 확인 후
- **When** 수정 폼이 표시되면
- **Then** 이름, 휴대전화, 주소 필드가 `Field.Root > Field.Label > Field.Control > TextField` 구조로 렌더링된다
- **And** 이메일 필드는 readOnly로 `data-disabled` 스타일이 적용된다
- **And** 각 Field에 `aria-describedby`가 자동 연결된다

### Scenario 7: 비밀번호변경 폼 구조

- **Given** 비밀번호변경 페이지에 접속했을 때
- **When** 페이지가 로드되면
- **Then** 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인 3개 필드가 `Field` + `TextField` type="password" 구조로 렌더링된다
- **And** 각 필드에 `TextField.Slot`의 Eye/EyeOff `Icon` 토글이 제공된다
- **When** 새 비밀번호와 확인이 불일치하면
- **Then** `data-invalid` 속성이 추가되고 `Field.ErrorMessage`에 "비밀번호가 일치하지 않습니다" 메시지가 표시된다

### Scenario 8: 회원탈퇴 Dialog

- **Given** 회원탈퇴 페이지에서
- **When** "탈퇴하기" 버튼을 클릭하면
- **Then** `Dialog` Compound Component가 `data-open` 속성과 함께 열린다
- **And** `Dialog.Header`에 "회원탈퇴" 제목이 표시된다
- **And** `Dialog.Body`에 잔여 적립금/쿠폰 안내와 탈퇴 사유 `Checkbox` 목록이 표시된다
- **And** `Dialog.Footer`에 "탈퇴 확인" / "취소" 버튼이 표시된다

### Scenario 9: Q&A 작성 TextField multiline

- **Given** 상품Q&A 작성 페이지에서
- **When** 문의 내용을 입력할 때
- **Then** `Field` + `TextField` multiline 컴포넌트가 autoresize 동작한다
- **And** `TextField.Slot`에 파일 첨부 `Icon` 버튼이 제공된다

### Scenario 10: 옵션 삭제 Dialog + Snackbar

- **Given** 옵션보관함에서 저장된 옵션이 있을 때
- **When** "삭제" 버튼을 클릭하면
- **Then** `Dialog`로 "삭제하시겠습니까?" 확인 다이얼로그가 표시된다
- **When** "확인"을 클릭하면
- **Then** 옵션이 삭제되고 `useSnackbar`로 "옵션이 삭제되었습니다" success 알림이 표시된다

---

## 2. 신규 기능 테스트 (A-3-14, A-3-15)

### Scenario N1: 증빙서류 Tabs + Chip 렌더링

- **Given** 사용자가 증빙서류 메뉴에 접속했을 때
- **When** 페이지가 로드되면
- **Then** `Tabs` variant="line"으로 현금영수증/세금계산서 2탭이 렌더링된다
- **And** 각 주문의 발급 상태가 `Chip`으로 표시된다: 신청가능(brand), 발급완료(positive), 불가(neutral), 신용카드(info)

### Scenario N2: 증빙서류 신청 Dialog

- **Given** 증빙서류 목록에서 "신청가능" 상태인 주문이 있을 때
- **When** "신청하기" 버튼을 클릭하면
- **Then** `Dialog`로 신청 폼이 표시된다
- **And** 사업자 정보 선택 및 발급 정보 입력이 `Field` + `TextField` 구조로 제공된다
- **When** 신청을 완료하면
- **Then** 상태가 "발급완료" `Chip`으로 변경되고 `Snackbar` success 알림이 표시된다

### Scenario N3: 사업자정보 등록

- **Given** 사업자 회원이 사업자정보 페이지에 접속했을 때
- **When** "+ 사업자 정보 등록" 버튼을 클릭하면
- **Then** 사업자번호, 상호명, 대표자명, 업태, 종목, 사업장주소, 수신 이메일 필드가 `Field` + `TextField` 구조로 표시된다
- **And** 사업자번호 필드에 `TextField.Slot`으로 "검증" 버튼이 제공된다
- **When** 사업자번호 검증 후 정보를 저장하면
- **Then** 사업자 정보 카드가 목록에 추가되고 `Snackbar` success 알림이 표시된다

### Scenario N4: 사업자정보 수정/삭제

- **Given** 등록된 사업자 정보가 있을 때
- **When** "수정" 버튼을 클릭하면
- **Then** `Dialog`에 수정 가능한 `Field` + `TextField` 폼이 표시된다
- **When** "삭제" 버튼을 클릭하면
- **Then** `Dialog`로 삭제 확인 다이얼로그가 표시된다
- **When** 삭제를 확인하면
- **Then** 사업자 정보가 삭제되고 `Snackbar` success 알림이 표시된다

---

## 3. 회귀 테스트 (기존 기능 보존)

### Scenario R1: 마이페이지 접근 제어 회귀

- **Given** 비로그인 사용자가 마이페이지 URL에 접근하면
- **When** 페이지 로드 시
- **Then** 로그인 페이지로 리다이렉트된다

### Scenario R2: 주문 조회 + 상세 회귀

- **Given** 주문 내역이 있는 회원이 마이페이지에 접속했을 때
- **When** 주문조회 메뉴를 클릭하면
- **Then** 주문 목록이 날짜 역순으로 표시된다
- **When** 주문 카드를 클릭하면
- **Then** 주문 상세 (상품, 배송, 결제, 타임라인)가 표시된다

### Scenario R3: 옵션보관함 CRUD 회귀

- **Given** 저장된 인쇄 옵션이 있을 때
- **When** "불러오기" 버튼을 클릭하면
- **Then** 해당 상품 주문 페이지로 옵션이 적용된 상태로 이동한다
- **When** "삭제" 후 확인하면
- **Then** 옵션이 목록에서 제거된다

### Scenario R4: 리뷰 작성 + 쿠폰 발행 회귀

- **Given** 배송완료된 주문이 있을 때
- **When** 리뷰를 작성하고 등록하면
- **Then** 리뷰가 즉시 노출되고 리뷰 쿠폰이 자동 발행된다

### Scenario R5: 회원정보 수정 회귀

- **Given** 비밀번호 확인이 완료된 상태에서
- **When** 이름을 변경하고 저장하면
- **Then** 변경된 이름이 저장되고 마이페이지 메인에 반영된다

### Scenario R6: 반응형 레이아웃 회귀

- **Given** 마이페이지에 접속했을 때
- **When** 뷰포트를 Desktop(>= 1024px)에서 Mobile(< 768px)로 변경하면
- **Then** 사이드바가 숨겨지고 그리드 메뉴로 전환된다
- **And** 주문 카드가 단일 컬럼으로 표시된다

---

## 4. 토큰 전환 검증

### Scenario T1: --po-* 토큰 완전 제거

- **Given** 마이그레이션이 완료된 후
- **When** 마이페이지 관련 파일에서 `--po-` 문자열을 검색하면
- **Then** 검색 결과가 0건이다

### Scenario T2: --huni-* 토큰 사용 확인

- **Given** 마이그레이션이 완료된 후
- **When** 사이드바 메뉴의 active 상태 스타일을 검사하면
- **Then** 배경색이 `--huni-bg-brand-subtlest`, 텍스트가 `--huni-fg-brand` 토큰을 참조한다

### Scenario T3: Chip 토큰 사용 확인

- **Given** 마이그레이션이 완료된 후
- **When** "제작중" 상태의 주문 Chip 스타일을 검사하면
- **Then** 배경이 `--huni-bg-warning-subtle`, 텍스트가 `--huni-fg-warning` 토큰을 사용한다

---

## 5. 접근성 검증

### Scenario A1: Tabs 키보드 네비게이션

- **Given** 쿠폰관리 페이지의 Tabs에서
- **When** 키보드 화살표 키로 탭 간 이동하면
- **Then** `data-focus-visible` 속성이 추가되고 포커스 링이 표시된다
- **And** Enter/Space 키로 탭이 활성화된다

### Scenario A2: Dialog 포커스 트랩

- **Given** 주문 취소 확인 Dialog가 열린 상태에서
- **When** Tab 키로 포커스를 이동하면
- **Then** Dialog 내부에서만 포커스가 순환된다
- **And** Escape 키로 Dialog가 닫힌다

### Scenario A3: Field aria 속성 자동 연결

- **Given** 회원정보수정 폼의 이름 필드에서
- **When** 유효성 오류가 발생하면
- **Then** `aria-invalid="true"` 속성이 설정된다
- **And** `aria-describedby`가 `Field.ErrorMessage`의 id를 참조한다

---

## 6. 품질 게이트

- [ ] 마이페이지 모든 파일에서 `--po-*` 토큰 참조 0건
- [ ] 마이페이지 모든 파일에서 lucide-react 직접 import 0건
- [ ] 마이페이지 모든 파일에서 `<hr>` 직접 사용 0건
- [ ] 마이페이지 모든 탭 UI가 Tabs Compound Component 사용
- [ ] 마이페이지 모든 페이지네이션이 Pagination 컴포넌트 사용
- [ ] 마이페이지 모든 상태 뱃지가 Chip 컴포넌트 사용
- [ ] 마이페이지 모든 폼 필드가 Field + TextField 구조 사용
- [ ] 마이페이지 모든 모달이 Dialog Compound Component 사용
- [ ] 마이페이지 모든 알림이 Snackbar (useSnackbar) 사용
- [ ] 마이페이지 모든 로딩 UI가 Skeleton 컴포넌트 사용
- [ ] Mobile/Desktop 반응형 레이아웃 정상 동작
- [ ] 키보드 네비게이션 및 포커스 관리 정상 동작
- [ ] Lighthouse 접근성 점수 90+

## 7. Definition of Done

- [ ] REQ-MIG-002-001 ~ REQ-MIG-002-017 모든 인수 기준 충족
- [ ] 신규 기능: 증빙서류발급(A-3-14) 구현 완료
- [ ] 신규 기능: 사업자정보(A-3-15) 구현 완료
- [ ] 회귀 테스트: R1 ~ R6 전체 통과
- [ ] 토큰 검증: T1 ~ T3 통과
- [ ] 접근성 검증: A1 ~ A3 통과
- [ ] E2E 테스트: 주문조회 -> 상세 -> 취소 요청 플로우 통과
- [ ] E2E 테스트: 회원정보 수정 플로우 통과
- [ ] E2E 테스트: 증빙서류 신청 플로우 통과
- [ ] 코드 리뷰 완료
