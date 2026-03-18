---
id: SPEC-SKIN-002
version: 2.0.0
type: plan
---

# SPEC-SKIN-002 v2: 마이페이지 디자인시스템 마이그레이션 - 구현 계획

## 1. 마일스톤 (우선순위 기반)

### Primary Goal: 주문관리 마이그레이션 + 공통 전환

모든 주문 관련 UI를 Huni 컴포넌트로 전환하고 토큰 체계를 교체한다.

**Task 1.1: Chip 컴포넌트 전환 (주문 상태 뱃지)**
- 주문 상태 5종 (주문접수/제작중/배송중/배송완료/취소) Badge -> Chip 전환
- variant별 색상 매핑 적용
- data-selected 필터 연동

**Task 1.2: Pagination 컴포넌트 전환**
- 주문조회 목록 페이지네이션 전환
- Q&A, 리뷰, 1:1문의 목록 페이지네이션 전환
- numbered variant + 이전/다음 네비게이션

**Task 1.3: Dialog 전환 (주문 관련)**
- 주문 취소 확인 Dialog
- 인쇄옵션 미리보기 Dialog
- 옵션 삭제 확인 Dialog

**Task 1.4: Skeleton 로딩 전환**
- 주문 목록 로딩 Skeleton
- 쿠폰 목록 로딩 Skeleton
- 리뷰 목록 로딩 Skeleton

**Task 1.5: 토큰 체계 전환**
- 마이페이지 전체 --po-* -> --huni-* 토큰 교체
- cn() 유틸리티 일관 사용

### Secondary Goal: 탭/폼 마이그레이션

**Task 2.1: Tabs 컴포넌트 전환**
- 쿠폰관리 3탭 (사용가능/사용완료/만료)
- 나의리뷰 2탭 (작성가능/작성완료)
- 증빙서류 2탭 (현금영수증/세금계산서)

**Task 2.2: Field + TextField 전환 (폼 필드)**
- 회원정보수정 폼 (이름, 휴대전화, 주소)
- 비밀번호변경 폼 (현재/새/확인)
- 쿠폰코드 입력 폼
- Q&A/1:1문의 작성 폼 (TextField multiline)

**Task 2.3: 회원탈퇴 Dialog 전환**
- 탈퇴 확인 Dialog
- 탈퇴 사유 Checkbox 전환
- 잔여 혜택 안내 표시

### Final Goal: 신규 기능 구현 + 정리

**Task 3.1: 증빙서류발급 신규 구현 (A-3-14)**
- 증빙서류 페이지 레이아웃 (Tabs 2탭)
- 주문별 발급 상태 목록 (Chip 4종)
- 신청 Dialog + 폼 (Field + TextField)
- Pagination + Skeleton
- 외부 서비스(팝빌) 연동 인터페이스

**Task 3.2: 사업자정보 관리 신규 구현 (A-3-15)**
- 사업자 정보 목록/카드 UI
- CRUD 폼 (Field + TextField 6개 필드)
- 사업자번호 검증 (TextField.Slot 검증 버튼)
- 등록/수정/삭제 Dialog 확인
- 파일 업로드 (사업자등록증)

**Task 3.3: Icon/Divider/Snackbar 정리**
- lucide-react 직접 import -> Icon 래퍼 전환
- `<hr>` -> Divider 전환
- alert/confirm -> Snackbar 전환

**Task 3.4: 회귀 테스트**
- 기존 17개 기능 회귀 테스트
- 반응형 레이아웃 검증
- 접근성 검증

---

## 2. 파일별 마이그레이션 전략

| 파일/디렉토리 | 변경 내용 | 규모 | 우선순위 |
|-------------|----------|------|----------|
| `pages/MyPage/` (메인) | Skeleton, Icon, Divider, 토큰 전환 | M | Primary |
| `pages/MyPage/Orders/` | Chip, Pagination, Dialog, Skeleton | M | Primary |
| `pages/OrderDetail/` | Chip, Dialog, Icon | S | Primary |
| `components/OrderCard/` | Chip, Icon, 토큰 전환 | S | Primary |
| `components/StatusTimeline/` | Icon, 토큰 전환 | S | Primary |
| `pages/MyPage/Coupons/` | Tabs, Chip, Skeleton | S | Secondary |
| `pages/MyPage/PrintingMoney/` | TextField, Dialog, Skeleton | S | Secondary |
| `pages/MyPage/Reviews/` | Tabs, Pagination, TextField(multiline), Field | M | Secondary |
| `pages/MyPage/QnA/` | Pagination, TextField(multiline), Field | S | Secondary |
| `pages/MyPage/Inquiry/` | Pagination, TextField(multiline), Field | S | Secondary |
| `pages/MyPage/OptionLocker/` | Dialog, Skeleton, Icon | S | Secondary |
| `pages/MemberModification/` | Field, TextField, Dialog | S | Secondary |
| `pages/ChangePassword/` | Field, TextField, Icon | S | Secondary |
| `pages/MemberWithdrawal/` | Dialog, Checkbox, Snackbar | S | Secondary |
| `pages/MyPage/ExperienceGroup/` | Pagination, Skeleton | XS | Secondary |
| `pages/MyPage/Receipt/` (신규) | Tabs, Chip, Dialog, Pagination, Skeleton, Field, TextField | L | Final |
| `pages/MyPage/BusinessInfo/` (신규) | Field, TextField, Dialog, Snackbar, Icon | M | Final |
| `components/SideNav/` | 토큰 전환 | XS | Primary |
| `components/SummaryCards/` | 토큰 전환 | XS | Primary |

---

## 3. 기술적 접근

### 3.1 Compound Component 패턴 적용

**Tabs 사용 패턴:**
```
Tabs.Root defaultValue="available"
  Tabs.List
    Tabs.Trigger value="available"  // 사용가능
    Tabs.Trigger value="used"       // 사용완료
    Tabs.Trigger value="expired"    // 만료
  Tabs.Content value="available"
    // 사용 가능 쿠폰 목록
  Tabs.Content value="used"
    // 사용완료 쿠폰 목록
  Tabs.Content value="expired"
    // 만료 쿠폰 목록
```

**Chip 사용 패턴:**
```
Chip variant="warning" data-selected={isActive}
  Chip.Label  // "제작중"
```

**Pagination 사용 패턴:**
```
Pagination
  totalCount={totalOrders}
  pageSize={20}
  currentPage={page}
  onPageChange={handlePageChange}
```

### 3.2 신규 기능 구현 전략 (A-3-14, A-3-15)

증빙서류발급:
- shopby 주문 데이터와 팝빌 API를 연동하는 SKIN 방식
- 발급 상태 4종을 Chip variant로 시각적 구분
- Tabs로 현금영수증/세금계산서 탭 분리

사업자정보:
- shopby 회원 추가필드(custom fields) 활용
- 사업자번호 국세청 API 검증 연동
- Field + TextField 6개 필드 CRUD 폼

### 3.3 기존 로직 보존 전략

- TanStack Query 서버 상태 관리 로직 수정 없음
- Shopby API 호출 로직 수정 없음
- 옵션보관함 커스텀 API 호출 로직 수정 없음
- 오직 UI 컴포넌트 레이어와 토큰 참조만 교체

---

## 4. 리스크 및 대응

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| Tabs 컴포넌트와 기존 상태 관리 충돌 | Medium | Tabs의 value/onValueChange가 기존 탭 상태와 호환되는지 검증 |
| Pagination 컴포넌트와 TanStack Query 연동 | Medium | onPageChange 핸들러가 query 파라미터를 올바르게 갱신하는지 확인 |
| Chip variant 색상과 기존 상태 뱃지 불일치 | Low | 디자인 토큰 매핑표 기준으로 1:1 대응 |
| 증빙서류 팝빌 API 연동 복잡도 | High | 팝빌 SDK 문서 사전 검토, 테스트 환경 확보 |
| 사업자번호 국세청 API 호출 제한 | Medium | 클라이언트 측 형식 검증 우선, 서버 측 API 호출은 제출 시에만 |
| 토큰 매핑 누락 (파일 수 많음) | Medium | Grep으로 --po-* 잔존 참조 전수 검사 |
| Skeleton 레이아웃 시프트 | Low | 실제 콘텐츠와 동일한 크기의 Skeleton 사용 |

---

## 5. 의존성

- **SPEC-DS-006**: Huni 디자인시스템 컴포넌트 (선행 완료 필수)
  - Tabs, Pagination, Chip, TextField, Field, Dialog, Skeleton, Snackbar, Icon, Divider, Checkbox, Switch 모두 구현 완료
- **SPEC-SKIN-001 v2**: 인증 컴포넌트 마이그레이션 (Field/TextField 패턴 선행 확립)
- **SnackbarProvider**: 앱 루트 설정 (SPEC-SKIN-001 v2에서 확인)
- **팝빌 API**: 증빙서류 발급 연동 (계약 상태 확인 필요)
- **국세청 API**: 사업자번호 검증 연동 (API 키 확보 필요)
