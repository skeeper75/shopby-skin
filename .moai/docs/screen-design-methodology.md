# 후니프린팅 화면설계 방법론

> 작성일: 2026-03-21
> 근거: SPEC-PLAN-001 (마스터 기획서) + design-consistency-audit.md (일관성 감사)
> 기반: seed.design 원칙 (계층적 토큰 + 의미적 변수 + 컴포넌트 합성)

---

## 1. 설계 원칙

### 1.1 핵심 원칙 3가지

**원칙 1: 공유 우선 (Shared First)**
- 모든 화면은 공유 레이아웃(Header/Footer/Breadcrumb)부터 시작
- 새 컴포넌트 만들기 전에 공유 라이브러리에 동일/유사 컴포넌트가 있는지 확인
- 도메인별 변형이 필요하면 공유 컴포넌트를 확장하여 사용

**원칙 2: 토큰 기반 (Token-Driven)**
- 모든 시각적 속성(색상, 폰트, 크기, 간격)은 디자인 토큰 변수로 지정
- 하드코딩된 hex/px 값 사용 금지
- 토큰 변경 한 곳 → 전체 사이트 반영

**원칙 3: 개발 연결 (Dev-Ready)**
- 화면설계는 곧 개발 스펙 → 시맨틱 네이밍, Auto Layout, 반응형 고려
- 화면 간 연결(링크/버튼 → 목적지)이 명확히 문서화
- 각 화면에 개발 우선순위(P1/P2/P3)와 shopby 분류(NATIVE/SKIN/CUSTOM) 표기

### 1.2 설계 분류 기준 (SPEC-PLAN-001 기반)

| 분류 | 설계 접근 | 디자인 자유도 |
|------|---------|-------------|
| **NATIVE** | shopby 기본 UI 래핑 → 스킨 커스터마이징 | 낮음 (API 구조 따름) |
| **SKIN** | shopby API + 완전 커스텀 UI | 중간 (API 데이터 기반) |
| **CUSTOM** | 자체 개발 → 인쇄 도메인 리서치 기반 | 높음 (자유 설계) |

### 1.3 설계 방향 기준 (SPEC-PLAN-001 REQ-PLAN-031/032)

| 화면 유형 | 설계 방향 | 근거 |
|----------|---------|------|
| 인쇄 특화 (상품옵션, 파일업로드, 가격, 관리자 전체) | **PC-First** | 복잡한 조작, 대형 이미지, 다단 옵션 |
| 일반 쇼핑몰 (로그인, 회원가입, 마이페이지, 장바구니) | **Mobile-First** | 모바일 트래픽 70%+, 심플한 폼 |

---

## 2. 3-Layer 설계 아키텍처

### 2.1 계층 구조

```
Layer 1: Shared Foundation (전체 사이트 공통)
├── shared-tokens      → 디자인 변수 (색상, 타이포, 스페이싱, 반경)
├── shared-layout      → Header, Footer, Breadcrumb, AdminSidebar, PageTitle
├── shared-forms       → TextField, Select, Checkbox, Radio, Button, Toggle
└── shared-feedback    → Toast, Modal, Alert, EmptyState, Loading, Pagination

Layer 2: Domain Components (도메인 전용)
├── member-components  → SNSButton, PasswordStrength, StepIndicator
├── mypage-components  → SidebarHeader, OrderCard, CouponCard, StatusBadge
├── order-components   → FileDropZone, ValidationBadge, AddressCard
├── cs-components      → CategoryTab, FAQAccordion, NoticeItem
└── admin-*-components → TableHeader/Row, FormField, OptionChain, PriceGrid

Layer 3: Screen Files (실제 화면)
├── member-auth.pen, member-registration.pen, ...
├── mypage-orders.pen, mypage-account.pen, ...
├── product-*-order.pen (SSOT - 유지)
├── order-cart.pen, order-upload-flow.pen, ...
└── cs-front.pen, cs-experience.pen, ...
```

### 2.2 Layer별 책임

| Layer | 파일 패턴 | 소유자 | 변경 빈도 |
|-------|---------|--------|----------|
| L1: Shared | shared-*.pen | 디자인 시스템 | 거의 없음 (토큰/레이아웃 확정 후) |
| L2: Domain | {domain}-components.pen | 도메인 기획자 | SPEC 변경 시 |
| L3: Screen | {domain}-{screen}.pen | 화면 설계자 | 화면 설계 시 |

### 2.3 참조 규칙

```
Screen File → MUST use → Domain Components + Shared Foundation
Domain Components → MUST use → Shared Foundation (tokens, forms, feedback)
Domain Components → MUST NOT → 다른 도메인 컴포넌트 직접 참조

예외: Product 도메인
product-*-order.pen → SSOT로 유지, 재설계 대상 아님
product-components.pen → 다른 도메인의 참조 모델 (가장 완성도 높음)
```

---

## 3. 화면설계 프로세스 (5단계)

### Step 1: SPEC 확인 및 화면 목록 작성

SPEC 문서에서 해당 도메인의 기능 목록을 추출하고, 각 기능에 필요한 화면을 식별합니다.

**작성 양식:**
| 화면 ID | 화면명 | 유형 | shopby 분류 | 우선순위 | 연결 화면 |
|---------|-------|------|-----------|---------|----------|
| SCR-A1-01 | 로그인 | Front | NATIVE | P1 | → 메인/회원가입 |

**규칙:**
- 화면 ID: `SCR-{도메인코드}-{순번}` 형식
- 유형: Front (쇼핑몰) / Admin (관리자)
- 모든 화면은 연결 화면(진입/이탈 경로) 명시

### Step 2: 공유 레이어 확인

화면 설계 전, shared-*.pen 파일에 필요한 공유 컴포넌트가 있는지 확인합니다.

**체크리스트:**
- [ ] Header 컴포넌트가 shared-layout.pen에 있는가?
- [ ] Footer 컴포넌트가 shared-layout.pen에 있는가?
- [ ] Breadcrumb 컴포넌트가 shared-layout.pen에 있는가?
- [ ] 필요한 폼 요소(Button, TextField, Select 등)가 shared-forms.pen에 있는가?
- [ ] 필요한 피드백 요소(Modal, Toast, Pagination 등)가 shared-feedback.pen에 있는가?
- [ ] 없는 경우: shared 파일에 먼저 추가 후 화면 설계 진행

### Step 3: 도메인 컴포넌트 정의

해당 도메인에만 필요한 고유 컴포넌트를 식별하고 {domain}-components.pen에 등록합니다.

**판단 기준:**
- 2개 이상의 화면에서 사용되면 → 도메인 컴포넌트로 등록
- 1개 화면에서만 사용되면 → 화면 내부에 직접 구성
- 다른 도메인에서도 사용 가능하면 → shared 레이어로 승격 검토

**네이밍 규칙:**
- 공유: `CMP-{ComponentName}` (예: CMP-Button, CMP-Header)
- 도메인: `CMP-{ComponentName}` (예: CMP-OrderCard, CMP-FAQAccordion)
- 상태 변형: `CMP-{ComponentName}-{State}` (예: CMP-Button-Selected)

### Step 4: 화면 합성 (Composition)

각 화면을 공유 레이아웃 + 도메인 컴포넌트를 조합하여 구성합니다.

**쇼핑몰 화면 기본 구조:**
```
┌─────────────────────────────────────┐
│ CMP-Header (shared-layout)         │  ← 공유
├─────────────────────────────────────┤
│ CMP-Breadcrumb (shared-layout)     │  ← 공유
├─────────────────────────────────────┤
│                                     │
│  [도메인별 컨텐츠 영역]              │  ← 도메인 + 공유 폼/피드백 조합
│                                     │
├─────────────────────────────────────┤
│ CMP-Footer (shared-layout)         │  ← 공유
└─────────────────────────────────────┘
```

**관리자 화면 기본 구조:**
```
┌──────────┬──────────────────────────┐
│ CMP-     │ CMP-AdminHeader          │  ← 공유
│ Admin    ├──────────────────────────┤
│ Sidebar  │ CMP-TabBar               │  ← 도메인
│ (shared) ├──────────────────────────┤
│          │ [관리자 컨텐츠 영역]       │  ← 도메인 + 공유 조합
│          │                          │
│          ├──────────────────────────┤
│          │ CMP-ActionBar             │  ← 도메인
└──────────┴──────────────────────────┘
```

### Step 5: 페이지 흐름 검증 및 문서화

화면 간 네비게이션을 Mermaid 다이어그램으로 문서화하고, 모든 경로가 연결되어 있는지 검증합니다.

**검증 항목:**
- [ ] 모든 화면에 진입 경로가 있는가? (고립된 화면 없음)
- [ ] 모든 CTA 버튼에 목적지 화면이 명시되어 있는가?
- [ ] 에러/빈 상태(Empty State)에서의 대체 경로가 있는가?
- [ ] 로그인/비로그인 분기가 명시되어 있는가?
- [ ] 뒤로가기/취소 시 돌아갈 화면이 명시되어 있는가?

---

## 4. 품질 게이트 (화면별 체크리스트)

화면설계가 "완료"되려면 다음 모든 항목을 통과해야 합니다:

### 4.1 구조적 일관성
- [ ] 공유 Header 사용 (CMP-Header 또는 CMP-AdminHeader)
- [ ] 공유 Footer 사용 (CMP-Footer, 관리자는 제외 가능)
- [ ] 공유 Breadcrumb 사용 (Front 화면 필수)
- [ ] 페이지 제목(PageTitle) 형식 통일

### 4.2 시각적 일관성
- [ ] 폰트: Noto Sans KR만 사용
- [ ] 색상: 모든 색상이 $color-xxx 변수 참조
- [ ] 버튼 높이: 48/40/32/24px 스케일 준수
- [ ] 인풋 높이: 44px (일반), 50px (옵션 전용)
- [ ] Corner radius: 2/4/6/8/12px 스케일 준수
- [ ] 스페이싱: 4/8/12/16/20/24/32/40px 스케일 준수

### 4.3 네이밍 일관성
- [ ] 컴포넌트: CMP-PascalCase
- [ ] 변수: $color-xxx, $typo-xxx, $space-xxx, $radius-xxx
- [ ] 화면 ID: SCR-{도메인코드}-{순번}

### 4.4 개발 연결성
- [ ] shopby 분류 (NATIVE/SKIN/CUSTOM) 표기
- [ ] 우선순위 (P1/P2/P3) 표기
- [ ] 연결 화면 경로 표기
- [ ] API 매핑 정보 표기 (가능한 경우)

### 4.5 시각 검증
- [ ] Pencil App에서 열어 시각 확인
- [ ] 다른 도메인 화면과 Header/Footer 비교
- [ ] 모바일 뷰포트 확인 (Mobile-First 화면만)

---

## 5. 재설계 우선순위

직전 일관성 감사 결과를 기반으로 한 도메인별 재설계 우선순위:

### Phase 1: 공유 레이어 구축 (최우선)
**신규 생성 필요:**
- shared-tokens.pen → 통일 디자인 토큰 (design-unified-standards.md 기반)
- shared-layout.pen → CMP-Header, CMP-Footer, CMP-Breadcrumb, CMP-AdminSidebar
- shared-forms.pen → CMP-Button, CMP-TextField, CMP-Select, CMP-Checkbox, CMP-Radio
- shared-feedback.pen → CMP-Modal, CMP-Toast, CMP-Pagination, CMP-EmptyState

**기준 모델:** product-components.pen (가장 완성도 높음, SSOT)

### Phase 2: 최저 점수 도메인 재설계
1. **Mypage (20% 일관성)** → 완전 재설계 필요
   - 폰트 Inter → Noto Sans KR
   - 하드코딩 색상 → $color-xxx 변수
   - kebab-case → CMP-PascalCase
   - 공유 Header/Footer 추가

2. **Order (44%)** → 부분 재설계
   - 폰트 Inter → Noto Sans KR
   - 변수 $xxx → $color-xxx
   - 네이밍 PascalCase → CMP-PascalCase

3. **Member (46%)** → 부분 재설계
   - 폰트 Inter → Noto Sans KR
   - 변수 $xxx → $color-xxx
   - Corner radius 8px → 6px (통일 기준)

### Phase 3: 보완 도메인
4. **Admin (70%)** → 폰트 통일 (3종 혼재 → Noto Sans KR)
5. **CS (88%)** → 미세 조정만 필요 (폰트 이미 올바름, 변수 올바름)

### Phase 4: 신규 도메인
6. **Pages** → 새로 설계 (공유 레이어 기반)
7. **Statistics** → 새로 설계 (관리자 레이아웃 기반)

---

## 6. 페이지 시뮬레이션 방법

### 6.1 도메인별 흐름도

각 도메인의 화면 간 연결을 Mermaid flowchart로 문서화합니다.

**예시 - 회원 도메인 흐름:**
```
메인/아무 페이지
  ├── [로그인 버튼] → SCR-A1-LOGIN
  │     ├── [SNS 로그인] → SCR-A1-SNS → 메인
  │     ├── [일반 로그인] → 메인
  │     ├── [아이디 찾기] → SCR-A1-FIND-ID
  │     ├── [비밀번호 찾기] → SCR-A1-FIND-PW → SCR-A1-RESET-PW
  │     └── [회원가입] → SCR-A1-REGISTER-TERMS
  │           → SCR-A1-REGISTER-INFO
  │           → SCR-A1-REGISTER-COMPLETE → 메인
```

### 6.2 전체 사이트맵 검증

모든 도메인 흐름도를 통합하여 다음을 검증합니다:
1. **고립 화면 없음**: 모든 화면에 진입 경로가 있는가?
2. **순환 경로 확인**: 무한 루프가 발생하는 경로가 없는가?
3. **에러 복구**: 에러 시 사용자가 이전 상태로 돌아갈 수 있는가?
4. **로그인 분기**: 로그인 필수 화면에서 비로그인 사용자 처리가 있는가?

### 6.3 개발 스코핑

화면 인벤토리를 기반으로 개발 범위를 산출합니다:
- 총 화면 수: ~64개 (Product 제외 ~52개)
- Front 화면: ~35개 (일반 사용자)
- Admin 화면: ~29개 (관리자)
- shopby 분류별: NATIVE(설정만) / SKIN(UI 개발) / CUSTOM(전체 개발)
- 우선순위별: P1(런칭 필수) / P2(런칭 후) / P3(향후)

---

## 7. Pencil .pen 작업 규칙 (기존 피드백 통합)

| 규칙 | 설명 |
|------|------|
| 순차 작업 | 한 번에 1개 .pen 파일만 작업, 서브에이전트/병렬 금지 |
| 컴포넌트 선등록 | 공유/도메인 컴포넌트를 먼저 등록 후 화면 설계 |
| Figma 비교 | Product 디자인 시 Figma 원본과 비교 필수 |
| 시각 검증 | 수정 후 Pencil App에서 시각 확인 |
| 파일당 제한 | 최대 12화면/400노드 per .pen 파일 |
| SSOT 참조 | product-print-order.pen이 화면 디자인 일관성의 기준 |
| 디자인시스템 | huni-design-system 플러그인 반드시 참조 |

---

*본 방법론은 SPEC-PLAN-001과 design-consistency-audit.md, design-unified-standards.md를 통합한 실무 가이드입니다.*
*Product 도메인(product-*-order.pen)은 이미 원칙이 적용된 SSOT이므로 재설계 대상에서 제외합니다.*
