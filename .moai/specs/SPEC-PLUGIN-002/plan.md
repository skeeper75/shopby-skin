---
id: SPEC-PLUGIN-002
type: plan
---

# SPEC-PLUGIN-002 구현 계획

## 1. 기술 접근 방식

### SPEC-SCREEN-001에서 데이터 추출 및 조직 전략

SPEC-SCREEN-001 (632줄)의 데이터를 다음 방식으로 추출하고 재조직한다:

1. **화면 인벤토리 테이블 파싱**: 섹션 5의 88개 화면 행을 9개 도메인 모듈로 분배
2. **공통 패턴 추출**: 섹션 6-7의 설계 가이드라인과 공통 디자인 패턴을 SKILL.md와 reference.md로 분리
3. **관리자 패턴 추출**: 섹션 8의 shopby Admin 분석을 admin 모듈들에 통합
4. **정책 기본값 보존**: 섹션 4의 미결정 정책 기본값을 SKILL.md에 보존

### 모듈 조직 전략

| 모듈 | SPEC-SCREEN-001 소스 | 화면 수 | 예상 크기 |
|------|---------------------|--------|----------|
| login-signup.md | A-1 (6 화면) | 6 | ~3,000줄 |
| mypage.md | A-3 (16 화면) | 16 | ~8,000줄 |
| customer-center.md | A-4 (7 화면) | 7 | ~3,500줄 |
| order-checkout.md | A-6 (7 화면) | 7 | ~5,000줄 |
| info-guide.md | A-7/A-8 (15 화면) | 15 | ~4,500줄 |
| product-catalog.md | A-9/A-10 (18 화면) | 18 | ~7,000줄 |
| admin-management.md | B-1~B-3 (7 화면) | 7 | ~4,000줄 |
| admin-product-board.md | B-4~B-6 (33 화면) | 33 | ~12,000줄 |
| admin-order-stats.md | B-7~B-9 (22 화면) | 22 | ~9,000줄 |

### 화면 상세 스펙 작성 기준

각 화면은 SPEC-SCREEN-001의 테이블 행(화면 ID, 분류, 우선순위, 규모, API, 레이아웃, 핵심 UI, 벤치마크)을 기반으로 확장하되, 다음 추가 정보를 포함:

- **와이어프레임**: SPEC-SCREEN-001의 레이아웃 컬럼을 아스키 아트로 구체화
- **컴포넌트 트리**: 핵심 UI 컬럼의 컴포넌트를 계층 구조로 확장
- **API 요청/응답**: shopby API 컬럼을 request params + response fields로 확장
- **인터랙션 상태**: 규모(S/M/L/XL)에 비례하여 상세도 조절
  - S 화면: loading/error/success 3 상태
  - M 화면: loading/empty/error/success + 주요 인터랙션 1-2개
  - L 화면: 모든 상태 + 인터랙션 3-5개
  - XL 화면: 모든 상태 + 인터랙션 5+ + 엣지 케이스

### 플러그인 검증 체크리스트

- [ ] plugin.json 스키마 유효성
- [ ] SKILL.md 500줄 이하
- [ ] 9개 모듈 파일 존재 및 화면 ID 완전성 (88개 화면 모두 커버)
- [ ] reference.md 컴포넌트 카탈로그 완전성
- [ ] 4개 템플릿 파일 존재
- [ ] 2개 예제 파일 존재
- [ ] 에이전트 정의 파일 유효성
- [ ] 커맨드 정의 파일 유효성
- [ ] Progressive Disclosure 동작 확인 (L1/L2/L3)
- [ ] SPEC-SCREEN-001과 화면 ID 일관성 검증

---

## 2. 마일스톤 (우선순위 기반)

### Primary Goal: 플러그인 골격 + SKILL.md 리팩터링

**범위**: 플러그인 구조 생성, SKILL.md 리팩터링, plugin.json 작성

**산출물**:
- `.claude-plugin/plugin.json`
- 리팩터링된 `SKILL.md` (500줄 이하, 모듈 참조 포함)
- 디렉토리 구조 (modules/, templates/, examples/ 빈 디렉토리)

**완료 기준**:
- plugin.json 유효
- SKILL.md 500줄 이하
- 기존 정보 100% 보존

### Secondary Goal: 핵심 모듈 (1순위 화면)

**범위**: 1순위 화면이 포함된 핵심 모듈 작성

**산출물** (우선순위별):
1. `modules/order-checkout.md` (SCR-A6: 파일업로드 XL + 장바구니 + 결제 - 핵심 구매 플로우)
2. `modules/product-catalog.md` (SCR-A10: PrintProduct XL + 메인/목록/상세 - 핵심 상품 플로우)
3. `modules/login-signup.md` (SCR-A1: 로그인/회원가입 - 진입점)
4. `modules/mypage.md` (SCR-A3: 주문 조회/상세 + 옵션 보관함 + 프린팅머니)
5. `modules/admin-order-stats.md` (SCR-B8: 인쇄 주문관리 XL + 파일확인 XL - 핵심 운영)

**완료 기준**:
- 5개 모듈의 1순위 화면 상세 스펙 완성
- 각 화면에 9가지 필수 정보 포함

### Third Goal: 보조 모듈 + 참조 문서

**범위**: 나머지 4개 모듈 + reference.md

**산출물**:
1. `modules/customer-center.md` (SCR-A4)
2. `modules/info-guide.md` (SCR-A7/A-8)
3. `modules/admin-management.md` (SCR-B1~B-3)
4. `modules/admin-product-board.md` (SCR-B4~B-6)
5. `reference.md` (컴포넌트 카탈로그 + API 매핑 + 디자인 토큰)

**완료 기준**:
- 9개 모듈 전체 완성 (88개 화면 100% 커버)
- reference.md 컴포넌트/API 카탈로그 완성

### Fourth Goal: 템플릿 + 예제 + 에이전트/커맨드

**범위**: 설계 템플릿, 완성 예제, 에이전트 및 커맨드 정의

**산출물**:
1. `templates/native-screen.md`
2. `templates/skin-screen.md`
3. `templates/custom-screen.md`
4. `templates/admin-screen.md`
5. `examples/print-product-xl.md` (SCR-A10-PRINT-PRODUCT 완전 예제)
6. `examples/admin-print-order-xl.md` (SCR-B8-PRINT-ORDER 완전 예제)
7. `agents/huni-screen-designer.md`
8. `commands/huni-screen.md`

**완료 기준**:
- 4개 템플릿 작성 완료
- 2개 예제 각 10,000+ 토큰 수준의 상세도
- 에이전트/커맨드 정의 완료 및 유효성 검증

### Optional Goal: 2/3순위 화면 상세 보강

**범위**: Secondary/Third Goal에서 작성된 모듈 내 2/3순위 화면의 상세도 보강

**산출물**:
- 각 모듈의 2순위 화면: M 수준 상세 (loading/empty/error/success + 인터랙션 1-2개)
- 각 모듈의 3순위 화면: S 수준 상세 (loading/error/success 3 상태)

---

## 3. 위험 및 대응 계획

### Risk 1: 모듈 파일 크기 초과

**상황**: admin-product-board.md (33 화면)이 너무 커져서 Claude의 컨텍스트 윈도우에 부담

**대응**: 33 화면을 3개 서브 모듈로 분할 가능
- admin-product.md (B-4: 18 화면)
- admin-board.md (B-5: 9 화면)
- admin-member.md (B-6: 6 화면)

### Risk 2: shopby API 응답 구조 미확인

**상황**: SPEC-SCREEN-001에 API 엔드포인트는 있지만 응답 구조 상세가 없는 경우

**대응**:
- 기존 코드베이스 (`src/utils/api.js`, 각 페이지 컴포넌트)에서 API 호출 패턴 추출
- shopby API 문서 참조 (가능한 경우)
- 불확실한 필드는 `[TBD]` 마크하고 구현 단계에서 확인

### Risk 3: 토큰 예산 초과

**상황**: 전체 모듈 로드 시 토큰 예산 초과

**대응**: Progressive Disclosure 엄격 적용
- SKILL.md는 인덱스 역할만 수행 (3,000 토큰)
- 화면 질의 시 해당 모듈만 로드 (5,000-15,000 토큰)
- 컴포넌트/API 질의 시 reference.md만 로드 (8,000 토큰)

### Risk 4: 기존 SKILL.md와의 호환성

**상황**: 기존 `/innojini-huni-screen-guide` 호출 방식이 변경됨

**대응**: 하위 호환성 유지
- 기존 커맨드 패턴 (SCR-A1, admin pattern, policy) 모두 새 구조에서 동작
- SKILL.md의 Quick Reference 섹션에 기존 주요 정보 유지

---

## 4. 전문가 자문 권장사항

### expert-frontend 자문 권장

이 SPEC은 88개 화면의 UI/UX 설계를 포함하므로 다음 영역에서 expert-frontend 자문을 권장한다:

- 컴포넌트 트리 설계의 타당성 검증
- React 18 + Context API 환경에서의 상태 관리 패턴 적절성
- 반응형 레이아웃 (PageShell, ResponsiveGrid) 활용 패턴 검증
- 접근성(a11y) 요구사항의 실현 가능성

### builder-skill + builder-plugin 자문 권장

이 SPEC의 실행은 두 builder 에이전트의 협업이 필요하다:

- **builder-skill**: SKILL.md 리팩터링, modules/ 구조, Progressive Disclosure 설계
- **builder-plugin**: plugin.json, 에이전트, 커맨드, 디렉토리 구조

---

## 5. 구현 순서 권장

1. builder-plugin으로 플러그인 골격 생성 (plugin.json, 디렉토리 구조)
2. builder-skill로 SKILL.md 리팩터링 (500줄 이하로 축약)
3. builder-skill로 핵심 모듈 5개 작성 (1순위 화면)
4. builder-skill로 보조 모듈 4개 + reference.md 작성
5. builder-skill로 템플릿 4종 + 예제 2건 작성
6. builder-plugin으로 에이전트 + 커맨드 정의
7. 전체 플러그인 검증 (체크리스트 실행)
