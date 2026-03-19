---
id: SPEC-PLUGIN-002
version: "1.0.0"
status: completed
created: "2026-03-19"
updated: "2026-03-19"
author: MoAI (manager-spec)
priority: P1
tags: [SPEC-PLUGIN-002, plugin, skill, screen-guide, huni, printing]
related_specs: [SPEC-SCREEN-001, SPEC-PLUGIN-001, SPEC-LAYOUT-001, SPEC-LAYOUT-002, SPEC-SKIN-004, SPEC-SKIN-005]
---

# SPEC-PLUGIN-002: innojini-huni-screen-guide 스킬을 완전한 Claude Code 플러그인으로 업그레이드

## 1. 개요

현재 `.claude/skills/innojini-huni-screen-guide/SKILL.md` (284줄)로 존재하는 후니프린팅 화면 설계 가이드를 Claude Code 플러그인으로 업그레이드한다. 현재 스킬은 88개 기능에 대한 요약 수준의 Quick Reference만 제공하며, 화면별 상세 설계 정보(컴포넌트 트리, props/states, API 요청/응답 매핑, 데이터 플로우, 인터랙션 상태, 에러 상태, 접근성 요구사항)가 부재하다.

### 목표

- 88개 화면 각각에 대한 **상세 설계 스펙**을 모듈화하여 제공
- **컴포넌트 카탈로그** (props/behavior/design token 매핑) 완성
- **shopby API 엔드포인트** 상세 매핑 (요청/응답 구조 포함)
- **화면 설계 템플릿** 4종 (NATIVE/SKIN/CUSTOM/Admin)
- **완성 예제** 2건 (PrintProduct XL, Admin PrintOrder XL)
- **전용 에이전트** (huni-screen-designer) 및 **슬래시 커맨드** (/huni-screen)
- **플러그인 구조** (.claude-plugin/plugin.json) 준수

### 현재 상태 vs 목표 상태

| 항목 | 현재 | 목표 |
|------|------|------|
| SKILL.md | 284줄, 요약 수준 | 500줄 이하, 엔트리 포인트 |
| reference.md | 부재 | 컴포넌트 카탈로그 + API 매핑 |
| modules/ | 부재 | 9개 도메인 파일 (88개 화면 상세) |
| templates/ | 부재 | 4종 화면 설계 템플릿 |
| examples/ | 부재 | 2건 완성 예제 |
| 에이전트 | 부재 | huni-screen-designer |
| 커맨드 | 부재 | /huni-screen |
| 플러그인 | 부재 | .claude-plugin/plugin.json |

---

## 2. 환경 (Environment)

- **플랫폼**: Claude Code v2.1.49+
- **플러그인 시스템**: `.claude-plugin/plugin.json` 매니페스트 기반
- **원본 소스**: SPEC-SCREEN-001 (632줄, 88개 화면 인벤토리)
- **기존 스킬**: `.claude/skills/innojini-huni-screen-guide/SKILL.md` (284줄)
- **프로젝트**: shopby-skin (Aurora Skin 기반 React 18 SPA)
- **기술 스택**: React 18 + Webpack 5 + Plain CSS + CSS Variables + Tailwind (Admin)

---

## 3. 가정 (Assumptions)

- SPEC-SCREEN-001의 88개 화면 인벤토리가 최종 확정된 상태이다
- 현재 SKILL.md의 구조와 정보를 기반으로 확장한다 (기존 정보 보존)
- Progressive Disclosure 아키텍처를 적용하여 토큰 효율성을 유지한다
- 플러그인은 shopby-skin 프로젝트에 로컬 설치 형태로 우선 사용하고, 추후 GitHub 배포를 고려한다
- builder-skill 및 builder-plugin 에이전트가 이 SPEC을 직접 실행할 수 있을 정도로 상세해야 한다

---

## 4. 요구사항 (Requirements)

### REQ-01: 플러그인 구조 준수 [HARD]

시스템은 **항상** Claude Code 공식 플러그인 표준을 준수해야 한다.

**WHEN** 플러그인이 생성될 때 **THEN** 다음 디렉토리 구조를 갖추어야 한다:

```
.claude/skills/innojini-huni-screen-guide/
  SKILL.md                          # 엔트리 포인트 (500줄 이하)
  reference.md                      # 컴포넌트 카탈로그 + API 매핑
  modules/
    login-signup.md                  # A-1: 로그인/회원 (6화면)
    mypage.md                        # A-3: 마이페이지 (16화면)
    customer-center.md               # A-4: 고객센터 (7화면)
    order-checkout.md                # A-6: 주문/결제 (7화면)
    info-guide.md                    # A-7/A-8: 정보/가이드 (15화면)
    product-catalog.md               # A-9/A-10: 마케팅/상품 (18화면)
    admin-management.md              # B-1~B-3: 관리자/거래처/원장 (7화면)
    admin-product-board.md           # B-4~B-6: 상품/게시판/회원 관리 (33화면)
    admin-order-stats.md             # B-7~B-9: 통계/주문관리/특화 (22화면)
  templates/
    native-screen.md                 # NATIVE 화면 설계 템플릿
    skin-screen.md                   # SKIN 화면 설계 템플릿
    custom-screen.md                 # CUSTOM 화면 설계 템플릿
    admin-screen.md                  # Admin 화면 설계 템플릿
  examples/
    print-product-xl.md              # PrintProduct XL 완성 예제
    admin-print-order-xl.md          # Admin PrintOrder XL 완성 예제

.claude-plugin/
  plugin.json                        # 플러그인 매니페스트

agents/
  huni-screen-designer.md            # 전용 에이전트

commands/
  huni-screen.md                     # 슬래시 커맨드
```

### REQ-02: SKILL.md 모듈화 [HARD]

시스템은 **항상** SKILL.md를 500줄 이하로 유지하고 모듈로 분할해야 한다.

**WHEN** SKILL.md가 작성될 때 **THEN** 다음 구조를 따라야 한다:

- Quick Reference (현재 SKILL.md의 핵심 내용 축약)
- 아키텍처 결정 요약 (Hybrid 전략)
- 화면 인벤토리 색인 (88개 화면 ID/이름/모듈 참조)
- 정책 기본값 요약
- 디자인 시스템 요약 (레이아웃 컴포넌트, 브레이크포인트)
- 공통 디자인 패턴 인덱스
- 모듈 참조 링크

**IF** SKILL.md가 500줄을 초과하면 **THEN** 상세 내용을 modules/로 이동해야 한다.

### REQ-03: 화면별 상세 설계 스펙 (9개 모듈) [HARD]

**WHEN** 각 모듈이 작성될 때 **THEN** 모든 화면에 대해 다음 정보를 포함해야 한다:

각 화면(SCR-XX-YYY)마다:

1. **화면 개요**: ID, 이름, 분류(NATIVE/SKIN/CUSTOM), 우선순위, 규모
2. **와이어프레임 레이아웃**: 모바일/데스크톱 레이아웃을 텍스트 아스키 아트로 기술
3. **컴포넌트 트리**: 계층적 컴포넌트 구조
4. **Props/States 정의**: 각 컴포넌트의 주요 props와 상태
5. **shopby API 매핑**: 엔드포인트, 요청 파라미터, 응답 구조 주요 필드
6. **데이터 플로우**: 사용자 인터랙션 > API 호출 > 상태 업데이트 > UI 반영 흐름
7. **인터랙션 상태**: loading, empty, error, success 각 상태의 UI 설명
8. **에러 처리**: 주요 에러 케이스와 사용자 피드백
9. **접근성 요구사항**: ARIA 레이블, 키보드 네비게이션, 포커스 관리

모듈별 화면 배분:

| 모듈 파일 | 대상 화면 | 화면 수 |
|----------|---------|--------|
| login-signup.md | SCR-A1-LOGIN ~ SCR-A1-SNS-EXT | 6 |
| mypage.md | SCR-A3-ORDER-LIST ~ SCR-A3-CASH-RECEIPT | 16 |
| customer-center.md | SCR-A4-NOTICE ~ SCR-A4-GUEST-ORDER | 7 |
| order-checkout.md | SCR-A6-FILE-UPLOAD ~ SCR-A6-DESIGN-REQUEST | 7 |
| info-guide.md | SCR-A7-ABOUT ~ SCR-A8-GUIDE-11 | 15 |
| product-catalog.md | SCR-A9-LANDING-PAPER ~ SCR-A10-DETAIL | 18 |
| admin-management.md | SCR-B1-ADMIN-REG ~ SCR-B3-RECEIVABLES | 7 |
| admin-product-board.md | SCR-B4-PRINT-REG ~ SCR-B6-COUPON-USE | 33 |
| admin-order-stats.md | SCR-B7-PRINT-STATS ~ SCR-B9-OUTSOURCE | 22 |

### REQ-04: 컴포넌트 카탈로그 (reference.md) [HARD]

**WHEN** reference.md가 작성될 때 **THEN** 다음 내용을 포함해야 한다:

1. **쇼핑몰 컴포넌트 카탈로그**: 모든 공통 컴포넌트의 props, behavior, design token 매핑
   - Layout: PageShell, ResponsiveGrid, SplitLayout, FormLayout
   - Product: StepIndicator, OptionSelector, PaperSampleCard, QuantityPricingTable, RealTimePriceWidget
   - Order: OrderTrackerTimeline, CartItemCard, CartSummary, FilePreview
   - File: DropzoneUploader, FileValidationAlert, PreviewRenderer
   - Auth: LoginForm, SNSLoginButtons, SignUpForm, VerificationInput
   - Common: StatusBadge, DateRangeFilter, Pagination, Modal

2. **관리자 컴포넌트 카탈로그**: Admin 전용 컴포넌트
   - AdminLayout, AdminSidebar, DataTable, SearchBar, DateRangePicker
   - StatusTabBar, ActionBar, DetailDrawer, BulkActionBar
   - StatCard, ChartPanel, PrintSheet, SMSDialog

3. **shopby API 엔드포인트 상세**: 주요 API의 요청/응답 구조
   - 각 엔드포인트: HTTP 메서드, 경로, 주요 요청 파라미터, 응답 필드 목록
   - 인증 요구사항 (public/member/admin)
   - 에러 응답 패턴

4. **디자인 토큰 매핑**: CSS 변수와 Tailwind 클래스 대응표
   - 색상 시스템 (브랜드 #5538B6, 상태별 색상)
   - 타이포그래피 (clamp() 기반 반응형)
   - 간격/여백 (spacing scale)
   - 브레이크포인트 (sm/md/lg/xl)

### REQ-05: 화면 설계 템플릿 4종 [HARD]

**WHEN** 개발자가 새 화면을 설계할 때 **THEN** 화면 유형에 맞는 템플릿을 사용할 수 있어야 한다.

각 템플릿은 다음 섹션을 포함한다:

- 화면 메타데이터 (ID, 이름, 분류, 우선순위)
- 레이아웃 구조 (모바일/데스크톱)
- 컴포넌트 트리 (빈 슬롯으로 채워넣기)
- shopby API 연동 (또는 커스텀 API)
- 상태 관리 패턴
- 인터랙션 상태 (loading/empty/error/success)
- 접근성 체크리스트
- 벤치마크 참조

| 템플릿 | 대상 | 특징 |
|--------|------|------|
| native-screen.md | NATIVE 28개 | PageShell 래핑, shopby Provider 활용 |
| skin-screen.md | SKIN 25개 | shopby API + 커스텀 UI 조합 |
| custom-screen.md | CUSTOM 33개 | 독립 모듈, 커스텀 API/상태 |
| admin-screen.md | Admin 전체 | AdminLayout + DataTable 패턴 |

### REQ-06: 완성 예제 2건 [HARD]

**WHEN** builder 에이전트가 모듈을 작성할 때 **THEN** 완성 예제를 참조 기준으로 활용할 수 있어야 한다.

1. **print-product-xl.md** (SCR-A10-PRINT-PRODUCT)
   - XL 규모 CUSTOM 화면의 완전한 설계 예제
   - Product Configurator (Step Wizard) 전체 플로우
   - 모바일/데스크톱 와이어프레임
   - 6단계 옵션 종속성 트리
   - 실시간 가격 계산 데이터 플로우
   - shopby 옵션 API + 커스텀 가격엔진 매핑
   - 모든 인터랙션 상태 (loading/selecting/calculating/error/complete)
   - 접근성: 키보드 Wizard 네비게이션

2. **admin-print-order-xl.md** (SCR-B8-PRINT-ORDER)
   - XL 규모 관리자 CUSTOM 화면의 완전한 설계 예제
   - DataTable + SplitLayout + BulkActionBar 전체 구현
   - 필터/검색 > 상태탭 > DataTable > 상세 패널 플로우
   - 일괄 상태 변경 인터랙션
   - 8단계 주문 상태 전환 매트릭스
   - shopby Server API 매핑
   - 모든 인터랙션 상태

### REQ-07: 전용 에이전트 (huni-screen-designer) [HARD]

**WHEN** 플러그인이 설치될 때 **THEN** 전용 에이전트가 등록되어야 한다.

에이전트 요구사항:
- 이름: `huni-screen-designer`
- 모델: sonnet
- 도구: Read, Grep, Glob
- 스킬: innojini-huni-screen-guide
- 역할: 화면 ID를 입력받으면 해당 화면의 상세 설계 가이드를 제공
- 워크플로우: 화면 ID 파싱 > 모듈 파일 로드 > 상세 정보 추출 > 설계 가이드 생성

### REQ-08: 슬래시 커맨드 (/huni-screen) [HARD]

**WHEN** 사용자가 `/huni-screen` 커맨드를 실행할 때 **THEN** 화면 설계 가이드를 제공해야 한다.

사용 패턴:
- `/huni-screen SCR-A1-LOGIN` - 특정 화면의 상세 설계 가이드
- `/huni-screen SCR-B4` - 도메인 전체 화면 개요
- `/huni-screen template NATIVE` - NATIVE 화면 설계 템플릿
- `/huni-screen component StepIndicator` - 특정 컴포넌트 상세
- `/huni-screen policy` - 정책 기본값 조회
- `/huni-screen pattern wizard` - 공통 디자인 패턴 조회

### REQ-09: Progressive Disclosure 아키텍처 [HARD]

**WHILE** 플러그인이 로드되는 동안 **THEN** 3단계 Progressive Disclosure를 적용해야 한다:

- **Level 1 (Metadata)**: SKILL.md frontmatter만 로드 (~100 토큰)
- **Level 2 (Body)**: SKILL.md 본문 로드 (~3,000 토큰) - 트리거 키워드 매칭 시
- **Level 3 (Bundled)**: modules/, reference.md, templates/, examples/ 온디맨드 로드

토큰 예산 가이드:

| 파일 | 예상 토큰 | 로드 시점 |
|------|----------|----------|
| SKILL.md frontmatter | ~100 | 항상 |
| SKILL.md body | ~3,000 | L2 트리거 시 |
| reference.md | ~8,000 | 컴포넌트/API 질의 시 |
| 각 module | ~5,000~15,000 | 해당 도메인 화면 질의 시 |
| 각 template | ~2,000 | 템플릿 요청 시 |
| 각 example | ~10,000 | 예제 요청 시 |

### REQ-10: 기존 SKILL.md 정보 보존 [HARD]

시스템은 **항상** 기존 SKILL.md (v1.1)의 모든 정보를 보존하면서 확장해야 한다.

보존 대상:
- 아키텍처 결정 (Hybrid 전략, 가중 점수 7.55)
- 제외 기능 목록 (25개 회색 영역)
- 정책 기본값 (배송/결제/쿠폰/리뷰/회원등급)
- 화면 인벤토리 테이블 (88개)
- 디자인 시스템 (레이아웃 컴포넌트, 브레이크포인트)
- UX 패턴 (로그인, 마이페이지, 장바구니, 고객센터)
- 관리자 공통 패턴 (표준 레이아웃, 주요 컴포넌트)
- UI 패턴 라이브러리 (5개 패턴)
- shopby API Quick Reference
- 벤치마크 Quick Reference

### REQ-11: 플러그인 매니페스트 [HARD]

**WHEN** plugin.json이 작성될 때 **THEN** Claude Code 플러그인 공식 스키마를 준수해야 한다:

```json
{
  "name": "huni-screen-guide",
  "description": "후니프린팅 88개 화면 설계 가이드 플러그인. 화면별 상세 UI/UX 스펙, shopby API 매핑, 컴포넌트 카탈로그, 설계 템플릿을 제공합니다.",
  "version": "2.0.0",
  "author": { "name": "innojini" }
}
```

### REQ-12: 정책 > UI 컴포넌트 연결 매핑 [SOFT]

**가능하면** reference.md에 정책 결정이 어떤 UI 컴포넌트에 영향을 미치는지 매핑 테이블을 제공한다.

예:
- 무료배송 기준 100,000원 > CartSummary의 `freeShippingThreshold` prop
- 동시 쿠폰 최대 3개 > PaymentMethodSelector의 `maxCoupons` prop
- 리뷰 즉시 노출 > ReviewCard의 `moderationMode: "post"` prop

### REQ-13: Admin DataTable 컬럼 정의 [SOFT]

**가능하면** 각 관리자 화면 모듈에서 DataTable의 기본 컬럼 정의를 포함한다:

| 컬럼 | 타입 | 정렬 | 검색 | 너비 |
|------|------|------|------|------|
| 주문번호 | text | 가능 | 가능 | 120px |
| ... | ... | ... | ... | ... |

### REQ-14: 상태 관리 패턴 [SOFT]

**가능하면** 각 화면 유형별 권장 상태 관리 패턴을 모듈에 포함한다:

- NATIVE: shopby Provider (Context) 활용
- SKIN: shopby API + useReducer 로컬 상태
- CUSTOM: 독립 Context 또는 useState 조합
- Admin: useState (컴포넌트 로컬) + URL 쿼리 파라미터 (필터 상태)

---

## 5. 제약사항 (Constraints)

### [HARD] SKILL.md 500줄 제한

스킬 파일은 Claude Code 공식 표준에 따라 500줄을 초과할 수 없다.

### [HARD] SPEC-SCREEN-001 데이터 일관성

모든 화면 ID, 분류, API 매핑은 SPEC-SCREEN-001과 일치해야 한다. SPEC-SCREEN-001에 없는 화면을 추가하거나 정보를 변경해서는 안 된다.

### [HARD] 기존 코드베이스 참조

레이아웃 컴포넌트(PageShell, ResponsiveGrid 등)의 props와 behavior는 실제 `src/components/Layout/` 구현과 일치해야 한다.

### [HARD] Progressive Disclosure 필수

SKILL.md 본문에 모든 화면 상세를 포함해서는 안 된다. 반드시 modules/로 분할해야 한다.

시스템은 NATIVE 화면에 대해 shopby 기본 기능을 변경하는 설계를 포함**하지 않아야 한다** (SPEC-SCREEN-001 핵심 원칙 준수).

---

## 6. 추적성

| 태그 | 대상 |
|------|------|
| SPEC-PLUGIN-002 | 본 SPEC |
| SPEC-SCREEN-001 | 원본 마스터 플랜 (88개 화면 인벤토리) |
| SPEC-PLUGIN-001 | 관련 플러그인 SPEC (정책 자문 - 별도) |
| SPEC-LAYOUT-001 | 반응형 레이아웃 시스템 |
| SPEC-LAYOUT-002 | 시각 검증 기반 개선 |
| SPEC-SKIN-004 | 고객센터/정보/마케팅 |
| SPEC-SKIN-005 | 관리자 백오피스 기반 |

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-03-19 | 1.0.0 | 초안 작성 - 14개 요구사항, 갭 분석 기반 플러그인 업그레이드 SPEC |
