# SPEC-SKIN-004 v2: 고객센터/정보/마케팅 디자인시스템 마이그레이션 - 인수 조건

> **SPEC ID**: SPEC-SKIN-004
> **버전**: 2.0.0

---

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-03-14 | 초기 인수 조건 |
| 2.0.0 | 2026-03-17 | Huni 디자인시스템 마이그레이션 인수 조건 재작성 |

---

## 1. 테스트 시나리오

### Scenario 1: CSS 토큰 전환 검증

- **Given** 모든 UI 파일이 마이그레이션된 상태에서
- **When** `--po-*` CSS 변수로 검색하면
- **Then** 검색 결과가 0건이어야 한다 (`--huni-*` 토큰만 존재)

### Scenario 2: TextField 견적문의 폼

- **Given** 견적문의 페이지에서
- **When** 회사명 필드에 텍스트를 입력하면
- **Then** Huni `TextField` 컴포넌트가 렌더링되고, 기존과 동일한 폼 제출이 가능하다

### Scenario 3: Field 유효성 검증

- **Given** 견적문의 폼에서 필수 필드를 비워두고
- **When** "견적 문의하기" 버튼을 클릭하면
- **Then** Huni `Field.ErrorMessage`가 표시되고, 제출이 차단된다

### Scenario 4: Snackbar 접수 완료

- **Given** 견적문의 폼을 올바르게 작성하고
- **When** 폼을 제출하면
- **Then** Huni `Snackbar`로 "문의가 접수되었습니다" 메시지가 표시된다

### Scenario 5: Skeleton 로딩 상태

- **Given** 공지사항 페이지에 접속하면
- **When** API 응답 대기 중일 때
- **Then** Huni `Skeleton` 컴포넌트가 목록 영역에 표시된다

### Scenario 6: Tabs FAQ 카테고리

- **Given** FAQ 페이지에서
- **When** "주문/배송/결제" 탭을 클릭하면
- **Then** Huni `Tabs` 컴포넌트의 indicator가 애니메이션과 함께 이동하고, 해당 카테고리 FAQ가 표시된다

### Scenario 7: Pagination 공지사항

- **Given** 공지사항이 페이지 크기를 초과할 때
- **When** 다음 페이지 버튼을 클릭하면
- **Then** Huni `Pagination` 컴포넌트가 페이지를 전환한다

### Scenario 8: Divider 섹션 구분

- **Given** 고객센터 페이지를 렌더링하면
- **When** 섹션 사이를 확인하면
- **Then** `<hr>` 대신 Huni `Divider` 컴포넌트가 렌더링된다

### Scenario 9: Icon 컴포넌트

- **Given** 가이드 카드 페이지를 렌더링하면
- **When** 아이콘 영역을 확인하면
- **Then** lucide 직접 import 대신 Huni `Icon` 컴포넌트가 사용된다

### Scenario 10: 기존 테스트 회귀 검증

- **Given** 마이그레이션이 완료된 상태에서
- **When** 전체 테스트 스위트를 실행하면
- **Then** 기존 295개 테스트가 모두 통과한다

### Scenario 11: 비회원 주문조회 TextField

- **Given** 비회원 주문조회 페이지에서
- **When** 주문번호, 이메일, 휴대전화 입력 필드를 확인하면
- **Then** Huni `TextField` + `Field` 컴포넌트로 렌더링되고, 기존 조회 기능이 정상 작동한다

---

## 2. 품질 게이트

### 2.1 마이그레이션 완료 기준

- [ ] `--po-*` CSS 변수 사용처 0건 (grep 검증)
- [ ] `<input type="text">` 직접 사용처 0건 (해당 페이지 범위 내)
- [ ] `<hr>` 직접 사용처 0건 (해당 페이지 범위 내)
- [ ] lucide-react 직접 import 0건 (해당 페이지 범위 내, Icon 컴포넌트 경유)
- [ ] 커스텀 로딩 스피너 사용처 0건 (Skeleton으로 대체)

### 2.2 기능 회귀 검증

- [ ] 기존 295/295 테스트 통과
- [ ] 공지사항 카테고리 필터링 정상
- [ ] FAQ 카테고리 탭 전환 정상
- [ ] 견적문의/상담 폼 필수값 검증 정상
- [ ] 비회원 주문조회 정상 동작
- [ ] 가이드 11종 콘텐츠 렌더링 정상
- [ ] 랜딩페이지 Mobile 반응형 정상
- [ ] CustomSelect 키보드 접근성 유지 (WCAG 2.1 AA)

### 2.3 디자인시스템 준수

- [ ] Huni Compound Component dot notation 사용
- [ ] data-* state attribute 패턴 적용
- [ ] `--huni-*` 시맨틱 토큰 전용 사용
- [ ] CVA slot recipe + createSlotRecipeContext 활용

---

## 3. Definition of Done

1. 모든 컴포넌트 대체 완료 (매핑표 기준)
2. CSS 토큰 전환 완료 (`--po-*` -> `--huni-*`)
3. 기존 295개 테스트 전수 통과
4. 신규 마이그레이션 검증 테스트 추가 (최소 10건)
5. 시각적 회귀 없음 (주요 페이지 스크린샷 비교)
6. Huni Design System v2 패턴 준수 확인
