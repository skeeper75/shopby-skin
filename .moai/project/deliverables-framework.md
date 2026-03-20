# 후니프린팅 리뉴얼 산출물 체계 (Deliverables Framework)

> SPEC-PLAN-001 기반 88개 기능 전체의 단계별 산출물 정의
> 작성일: 2026-03-20

---

## 1. 프로젝트 단계 개요

```
Phase 0: 마스터 기획 (SPEC-PLAN-001) ← 현재 단계
    ↓
Phase 1: 운영정책 확정 (25개 정책)
    ↓
Phase 2: 도메인별 기능분석 (7개 SPEC)
    ↓
Phase 3: 화면설계 (SPEC-SCREEN-001 연동)
    ↓
Phase 4: 디자인 (SPEC-DESIGN 연동)
    ↓
Phase 5: 개발 구현 (/moai run)
    ↓
Phase 6: 테스트 및 배포
```

---

## 2. Phase별 산출물 목록

### Phase 0: 마스터 기획 (SPEC-PLAN-001)

| # | 산출물 | 파일 | 상태 | 설명 |
|---|--------|------|------|------|
| 0-1 | 마스터 기획서 | spec.md | 완료 (v1.1.0) | 88개 기능, 25개 정책, 9개 CUSTOM 모듈 |
| 0-2 | 리서치 보고서 | research.md, research-*.md | 완료 | shopby 분석, 인쇄업계 리서치, 정책 리서치 |
| 0-3 | 시각화 다이어그램 | diagrams.md | 완료 | UserFlow, ERD, 시퀀스, 아키텍처 등 8개 |
| 0-4 | CRUD 매트릭스 | crud-matrix.md | 완료 | 88개 기능의 C/R/U/D 매핑 |
| 0-5 | 시스템 연동 맵 | integration-map.md | 완료 | shopby-CUSTOM 데이터 경계 |
| 0-6 | 기능 데이터 | features-data.json | 완료 | 88개 기능 구조화 데이터 |
| 0-7 | 정책 데이터 | policies-data.json | 완료 | 25개 정책 구조화 데이터 |
| 0-8 | CUSTOM 개발 데이터 | custom-dev-data.json | 완료 | 9개 CUSTOM 모듈 데이터 |

### Phase 1: 운영정책 확정

| # | 산출물 | 산출 방식 | 상태 | 설명 |
|---|--------|----------|------|------|
| 1-1 | 런칭 필수 정책 14개 확정 | 지니님 검토 + 결정 | 미완료 | 배송비 6, 결제 3, 쿠폰 3, 리뷰 2 |
| 1-2 | 런칭 후 조정 정책 11개 확정 | 지니님 검토 + 결정 | 미완료 | 결제 2, 쿠폰 7, 리뷰 2 |
| 1-3 | 정책 확정 문서 | spec.md 3절 업데이트 | 미완료 | 각 정책의 최종 결정 + 근거 기록 |

### Phase 2: 도메인별 기능분석 (7개 SPEC)

각 도메인 SPEC이 생산하는 산출물:

| # | 산출물 | 파일명 | 설명 |
|---|--------|--------|------|
| 2-1 | 리서치 보고서 | research.md | 해당 도메인의 코드베이스 분석, 경쟁사 벤치마크 |
| 2-2 | 요구사항 정의서 (EARS) | spec.md | 기능별 EARS 요구사항 (Ubiquitous/Event/State/Unwanted/Optional) |
| 2-3 | 요구사항 분석서 | requirements-analysis.md | 핵심 의사결정(KD) 분석, 엣지 케이스, 리스크 |
| 2-4 | 아키텍처 설계서 | architecture-design.md | Provider 전략, 데이터 흐름, 파일 영향도, MX 태그 전략 |
| 2-5 | 수용 기준서 | acceptance.md | Given/When/Then 형식 인수 테스트 시나리오 |
| 2-6 | 구현 계획서 | plan.md | TAG별 구현 단계, 의존성, 리스크 대응 |

**7개 도메인별 현황:**

| 순서 | SPEC ID | 도메인 | 기능 수 | Phase 2 상태 |
|------|---------|--------|---------|-------------|
| 1 | SPEC-MEMBER-001 | 로그인/회원 | 18 | 완료 (6개 산출물 모두 생성) |
| 2 | SPEC-ORDER-001 | 주문관리 | 15 | 미착수 |
| 3 | SPEC-PRODUCT-001 | 상품관리 | 14 | 미착수 |
| 4 | SPEC-MYPAGE-001 | 마이페이지 | 16 | 미착수 |
| 5 | SPEC-PAGE-001 | 페이지/콘텐츠/결제 | 9 | 미착수 |
| 6 | SPEC-CS-001 | 고객센터/관리자 | 9 | 미착수 |
| 7 | SPEC-STATS-001 | 통계 | 7 | 미착수 |

### Phase 3: 화면설계

각 도메인 SPEC에 추가되는 산출물:

| # | 산출물 | 파일명 | 설명 |
|---|--------|--------|------|
| 3-1 | 화면 목록 | screens.md | 해당 도메인의 전체 화면 ID 및 계층 구조 |
| 3-2 | 와이어프레임 | wireframes/ 또는 .pen 파일 | 각 화면의 레이아웃, 컴포넌트 배치 |
| 3-3 | 인터랙션 정의서 | interactions.md | 사용자 액션별 시스템 반응, 상태 전이 |
| 3-4 | shopby API 매핑표 | api-mapping.md | 화면 요소 ↔ shopby API 엔드포인트 매핑 |
| 3-5 | 컴포넌트 명세서 | components.md | 신규/재사용 컴포넌트 Props 계약, 상태 관리 |

**전제 조건**: Phase 1 (운영정책 확정) 완료 필수 (REQ-PLAN-044)

### Phase 4: 디자인

| # | 산출물 | 도구 | 설명 |
|---|--------|------|------|
| 4-1 | 비주얼 디자인 | Figma / Pencil (.pen) | 와이어프레임 기반 시각 디자인 |
| 4-2 | 디자인 토큰 | design-tokens.json | 색상, 타이포그래피, 간격 등 |
| 4-3 | 컴포넌트 디자인 | Figma 컴포넌트 | Huni Design System 기반 |
| 4-4 | 반응형 명세 | Figma 또는 문서 | PC/모바일 브레이크포인트별 레이아웃 |

**전제 조건**: Phase 3 (화면설계) 완료

### Phase 5: 개발 구현 (/moai run)

| # | 산출물 | 도구/명령어 | 설명 |
|---|--------|-----------|------|
| 5-1 | 소스 코드 | /moai run SPEC-XXX | DDD/TDD 방법론으로 구현 |
| 5-2 | 단위 테스트 | Jest/Vitest | 85%+ 커버리지 |
| 5-3 | E2E 테스트 | Playwright | 수용 기준 시나리오 검증 |
| 5-4 | MX 태그 | 코드 내 @MX 주석 | ANCHOR, WARN, NOTE, TODO |
| 5-5 | Git 커밋/PR | /moai sync | Conventional Commits, SPEC 참조 |

**전제 조건**: Phase 4 (디자인) 완료

### Phase 6: 테스트 및 배포

| # | 산출물 | 설명 |
|---|--------|------|
| 6-1 | QA 테스트 결과 | 수용 기준 전체 검증 보고서 |
| 6-2 | 성능 테스트 결과 | P95 응답시간, 동시 접속 검증 |
| 6-3 | 보안 점검 결과 | OWASP 검증, XSS/CSRF 점검 |
| 6-4 | 배포 매뉴얼 | shopby 설정, 환경변수, DNS 등 |

---

## 3. 전체 의존성 맵

```
SPEC-PLAN-001 (Phase 0, 완료)
    │
    ├── Phase 1: 운영정책 25개 확정 (미완료)
    │       │
    │       └──→ 모든 Phase 3 (화면설계) 진입 조건
    │
    ├── Phase 2: 도메인별 기능분석
    │       │
    │       ├── SPEC-MEMBER-001 (완료) ──→ Phase 3 대기 (Phase 1 의존)
    │       ├── SPEC-ORDER-001 (미착수) ──→ CUSTOM 모듈 정의 + PG 계약 필요
    │       ├── SPEC-PRODUCT-001 (미착수) ──→ CUSTOM 모듈 정의 필요
    │       ├── SPEC-MYPAGE-001 (미착수) ──→ SPEC-MEMBER-001 의존
    │       ├── SPEC-PAGE-001 (미착수)
    │       ├── SPEC-CS-001 (미착수)
    │       └── SPEC-STATS-001 (미착수)
    │
    └── SPEC-SCREEN-001 (화면설계 가이드, 진행중)
            │
            └──→ 각 도메인별 Phase 3의 템플릿/가이드 제공
```

---

## 4. 현재 상태 요약 및 즉시 착수 가능 작업

### 완료된 산출물
- SPEC-PLAN-001: 마스터 기획서 (v1.1.0) + 보충 문서 7개
- SPEC-MEMBER-001: Phase 2 기능분석 6개 산출물 전체
- SPEC-SCREEN-001: 화면설계 가이드 리서치 진행중
- SPEC-LAYOUT-001/002: 반응형 레이아웃 시스템 (구현 완료)
- SPEC-DESIGN-001/002: 디자인 시스템 (진행중)

### 미완료 블로커
1. **운영정책 25개 확정** - 모든 화면설계의 전제 조건
2. **CUSTOM 모듈 9개 상세 정의** - ORDER/PRODUCT SPEC의 전제 조건
3. **외부 서비스 계약** - PG사, 카카오 알림톡, 팝빌, AWS S3

### 즉시 착수 가능 작업
| 작업 | 의존성 | 담당 |
|------|--------|------|
| 운영정책 14개 (런칭 필수) 검토 및 확정 | 없음 | 지니님 결정 |
| 나머지 6개 도메인 SPEC Phase 2 착수 | 없음 (병행 가능) | MoAI |
| SPEC-SCREEN-001 화면설계 가이드 완성 | 없음 | MoAI |
| CUSTOM 모듈 5개 (P1) 상세 정의 | 결제 정책 결정 | MoAI + 지니님 |

---

## 5. 권장 실행 순서

### Step 1: 운영정책 확정 (즉시)
```
/moai run SPEC-PLAN-001 --task policy-review
```
25개 정책을 하나씩 검토하고 확정합니다. shopby 설정만 필요한 10개는 빠르게 결정 가능.

### Step 2: 나머지 도메인 기능분석 (병행)
```
/moai plan "SPEC-ORDER-001 주문관리 도메인"
/moai plan "SPEC-PRODUCT-001 상품관리 도메인"
...
```
운영정책 확정과 병행하여 나머지 6개 도메인의 Phase 2 산출물을 생성합니다.

### Step 3: 화면설계 (운영정책 확정 후)
```
/moai plan "SPEC-MEMBER-001 화면설계"
```
운영정책이 확정된 후, SPEC-SCREEN-001 가이드를 기반으로 도메인별 화면설계를 진행합니다.

### Step 4: 디자인 → 개발 (화면설계 완료 후)
화면설계가 완료된 도메인부터 순차적으로 디자인과 개발을 진행합니다.

---

## 6. /moai 명령어 매핑

| 프로젝트 단계 | MoAI 명령어 | 산출물 |
|-------------|------------|--------|
| Phase 0 마스터 기획 | `/moai plan` | SPEC 문서 |
| Phase 1 정책 확정 | 대화형 검토 (AskUserQuestion) | 정책 확정 문서 |
| Phase 2 기능분석 | `/moai plan "도메인명"` | SPEC 6개 산출물 |
| Phase 3 화면설계 | `/moai plan "화면설계"` + Pencil/Figma | 와이어프레임, 인터랙션 |
| Phase 4 디자인 | Figma MCP / Pencil MCP | 비주얼 디자인 |
| Phase 5 개발 | `/moai run SPEC-XXX` | 소스 코드, 테스트 |
| Phase 6 배포 | `/moai sync SPEC-XXX` | PR, 문서 |

---

*문서 버전: 1.0.0*
*작성: MoAI Orchestrator*
*기준 문서: SPEC-PLAN-001 v1.1.0*
