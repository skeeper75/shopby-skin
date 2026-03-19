---
id: SPEC-PLUGIN-002
type: acceptance
---

# SPEC-PLUGIN-002 수락 기준

## AC-01: 플러그인 구조 준수

### Scenario 1: plugin.json 유효성

```gherkin
Given 플러그인 디렉토리가 생성되었을 때
When .claude-plugin/plugin.json을 읽으면
Then name, description, version, author 필드가 존재해야 한다
And name은 "huni-screen-guide"이어야 한다
And version은 시맨틱 버전 형식이어야 한다
```

### Scenario 2: 필수 디렉토리 구조

```gherkin
Given 플러그인이 설치되었을 때
When 디렉토리 구조를 검사하면
Then 다음 파일/디렉토리가 모두 존재해야 한다:
  | 경로 |
  | .claude-plugin/plugin.json |
  | skills/innojini-huni-screen-guide/SKILL.md |
  | skills/innojini-huni-screen-guide/reference.md |
  | skills/innojini-huni-screen-guide/modules/ (9개 파일) |
  | skills/innojini-huni-screen-guide/templates/ (4개 파일) |
  | skills/innojini-huni-screen-guide/examples/ (2개 파일) |
  | agents/huni-screen-designer.md |
  | commands/huni-screen.md |
```

---

## AC-02: SKILL.md 모듈화

### Scenario 1: 줄 수 제한

```gherkin
Given SKILL.md가 작성되었을 때
When 줄 수를 카운트하면
Then 500줄 이하여야 한다
```

### Scenario 2: 기존 정보 보존

```gherkin
Given 기존 SKILL.md v1.1의 내용을 비교할 때
When 새 SKILL.md를 검사하면
Then 다음 섹션이 보존 또는 참조되어야 한다:
  | 섹션 | 처리 방식 |
  | Architecture Decision (Hybrid 7.55) | SKILL.md에 요약 보존 |
  | Excluded Features (25개) | SKILL.md에 보존 |
  | Policy Defaults | SKILL.md에 보존 |
  | Screen Inventory (88개) | SKILL.md에 인덱스, modules/에 상세 |
  | Design System | SKILL.md에 요약 보존 |
  | E-Commerce UX Patterns | modules/에 이동 |
  | Admin Common Patterns | modules/에 이동 |
  | UI Pattern Library | SKILL.md에 인덱스, modules/에 상세 |
  | shopby API Quick Reference | reference.md로 이동 |
  | Benchmark Quick Reference | SKILL.md에 보존 |
```

### Scenario 3: 모듈 참조 링크

```gherkin
Given SKILL.md에 모듈 참조가 있을 때
When 각 참조 링크를 따라가면
Then 실제 파일이 존재해야 한다
And 파일 내용이 참조 설명과 일치해야 한다
```

---

## AC-03: 화면별 상세 설계 스펙

### Scenario 1: 88개 화면 커버리지

```gherkin
Given 9개 모듈 파일이 작성되었을 때
When 모든 모듈에서 화면 ID를 추출하면
Then SPEC-SCREEN-001의 88개 화면 ID가 모두 포함되어야 한다
And 누락된 화면 ID가 없어야 한다
```

### Scenario 2: 필수 정보 포함 (1순위 화면)

```gherkin
Given 1순위 화면의 상세 스펙이 작성되었을 때
When 각 화면 섹션을 검사하면
Then 다음 9가지 항목이 모두 포함되어야 한다:
  | 항목 |
  | 화면 개요 (ID, 이름, 분류, 우선순위, 규모) |
  | 와이어프레임 레이아웃 (모바일/데스크톱) |
  | 컴포넌트 트리 (계층 구조) |
  | Props/States 정의 |
  | shopby API 매핑 (또는 커스텀 API) |
  | 데이터 플로우 |
  | 인터랙션 상태 (loading/empty/error/success) |
  | 에러 처리 |
  | 접근성 요구사항 |
```

### Scenario 3: 모듈-화면 배분 일치

```gherkin
Given 모듈별 화면 배분 표가 정의되었을 때
When 각 모듈 파일의 화면 수를 카운트하면
Then 다음과 일치해야 한다:
  | 모듈 | 화면 수 |
  | login-signup.md | 6 |
  | mypage.md | 16 |
  | customer-center.md | 7 |
  | order-checkout.md | 7 |
  | info-guide.md | 15 |
  | product-catalog.md | 18 |
  | admin-management.md | 7 |
  | admin-product-board.md | 33 |
  | admin-order-stats.md | 22 |
```

---

## AC-04: 컴포넌트 카탈로그 (reference.md)

### Scenario 1: 컴포넌트 카탈로그 완전성

```gherkin
Given reference.md가 작성되었을 때
When 컴포넌트 카탈로그를 검사하면
Then 다음 카테고리의 컴포넌트가 모두 포함되어야 한다:
  | 카테고리 | 최소 컴포넌트 수 |
  | Layout | 4 (PageShell, ResponsiveGrid, SplitLayout, FormLayout) |
  | Product | 5 (StepIndicator, OptionSelector, PaperSampleCard 등) |
  | Order | 4 (OrderTrackerTimeline, CartItemCard 등) |
  | File | 3 (DropzoneUploader, FileValidationAlert 등) |
  | Auth | 4 (LoginForm, SNSLoginButtons 등) |
  | Common | 4 (StatusBadge, DateRangeFilter 등) |
  | Admin | 8 (AdminLayout, DataTable, SearchBar 등) |
And 각 컴포넌트에 props, behavior, design token 매핑이 포함되어야 한다
```

### Scenario 2: shopby API 엔드포인트 상세

```gherkin
Given reference.md의 API 섹션이 작성되었을 때
When API 엔드포인트를 검사하면
Then 각 엔드포인트에 다음 정보가 포함되어야 한다:
  | 항목 |
  | HTTP 메서드 (GET/POST/PUT/DELETE) |
  | 경로 (path) |
  | 주요 요청 파라미터 |
  | 응답 주요 필드 목록 |
  | 인증 요구사항 (public/member/admin) |
```

---

## AC-05: 화면 설계 템플릿

### Scenario 1: 템플릿 완전성

```gherkin
Given 4개 템플릿이 작성되었을 때
When 각 템플릿을 검사하면
Then 다음 섹션이 포함되어야 한다:
  | 섹션 |
  | 화면 메타데이터 (빈 슬롯) |
  | 레이아웃 구조 (모바일/데스크톱 스켈레톤) |
  | 컴포넌트 트리 (빈 슬롯) |
  | API 연동 (패턴 가이드) |
  | 상태 관리 패턴 |
  | 인터랙션 상태 체크리스트 |
  | 접근성 체크리스트 |
```

### Scenario 2: 템플릿 유형 적합성

```gherkin
Given native-screen.md 템플릿이 작성되었을 때
When 템플릿 내용을 검사하면
Then PageShell 래핑 패턴이 포함되어야 한다
And shopby Provider 활용 가이드가 포함되어야 한다

Given admin-screen.md 템플릿이 작성되었을 때
When 템플릿 내용을 검사하면
Then AdminLayout + DataTable 패턴이 포함되어야 한다
And Tailwind CSS + shadcn/ui 가이드가 포함되어야 한다
```

---

## AC-06: 완성 예제

### Scenario 1: PrintProduct XL 예제 상세도

```gherkin
Given examples/print-product-xl.md가 작성되었을 때
When 예제를 검사하면
Then 다음 항목이 모두 포함되어야 한다:
  | 항목 |
  | 화면 개요 (SCR-A10-PRINT-PRODUCT) |
  | 모바일 와이어프레임 (375px) |
  | 데스크톱 와이어프레임 (1280px) |
  | 전체 컴포넌트 트리 (StepIndicator > 6단계) |
  | 각 단계의 props/states |
  | 옵션 종속성 트리 (상위 변경 시 하위 초기화) |
  | 실시간 가격 계산 데이터 플로우 |
  | shopby 옵션 API + 커스텀 가격엔진 매핑 |
  | 모든 인터랙션 상태 (5+ 상태) |
  | 접근성: 키보드 Wizard 네비게이션 |
```

### Scenario 2: Admin PrintOrder XL 예제 상세도

```gherkin
Given examples/admin-print-order-xl.md가 작성되었을 때
When 예제를 검사하면
Then 다음 항목이 모두 포함되어야 한다:
  | 항목 |
  | 화면 개요 (SCR-B8-PRINT-ORDER) |
  | 데스크톱 와이어프레임 (AdminLayout) |
  | 전체 컴포넌트 트리 (FilterSection > DataTable > DetailPanel) |
  | DataTable 컬럼 정의 (타입/정렬/검색/너비) |
  | 필터/검색 조건 목록 |
  | 상태탭 정의 (전체/접수/파일확인/제작/배송) |
  | 일괄 상태 변경 인터랙션 플로우 |
  | 8단계 주문 상태 전환 매트릭스 |
  | shopby Server API 매핑 |
  | 모든 인터랙션 상태 |
```

---

## AC-07: 에이전트 및 커맨드

### Scenario 1: 에이전트 정의 유효성

```gherkin
Given agents/huni-screen-designer.md가 작성되었을 때
When YAML frontmatter를 파싱하면
Then 다음 필드가 존재해야 한다:
  | 필드 | 값 |
  | name | huni-screen-designer |
  | model | sonnet |
  | tools | Read, Grep, Glob |
  | skills | innojini-huni-screen-guide |
And description이 화면 설계 가이드 제공 역할을 명시해야 한다
```

### Scenario 2: 커맨드 정의 유효성

```gherkin
Given commands/huni-screen.md가 작성되었을 때
When YAML frontmatter를 파싱하면
Then name 필드가 "huni-screen"이어야 한다
And description이 화면 설계 가이드 조회를 명시해야 한다
And 파라미터 (<screen-id>) 사용법이 포함되어야 한다
```

---

## AC-08: Progressive Disclosure

### Scenario 1: Level 1 로드 (Metadata Only)

```gherkin
Given SKILL.md의 YAML frontmatter만 로드되었을 때
When 토큰 사용량을 측정하면
Then 150 토큰 이하여야 한다
```

### Scenario 2: Level 2 로드 (Body)

```gherkin
Given SKILL.md 전체가 로드되었을 때
When 토큰 사용량을 측정하면
Then 4,000 토큰 이하여야 한다
And 화면 인벤토리 인덱스와 모듈 참조 링크가 포함되어야 한다
```

### Scenario 3: Level 3 로드 (Bundled, On-Demand)

```gherkin
Given 사용자가 "SCR-A6-FILE-UPLOAD" 화면을 질의했을 때
When Claude가 모듈을 로드하면
Then modules/order-checkout.md만 로드해야 한다
And 다른 모듈은 로드하지 않아야 한다
```

---

## AC-09: SPEC-SCREEN-001 일관성

### Scenario 1: 화면 ID 일관성

```gherkin
Given 모든 모듈이 작성되었을 때
When 모든 화면 ID를 추출하여 SPEC-SCREEN-001과 비교하면
Then 누락된 화면 ID가 0개여야 한다
And 추가된 화면 ID가 0개여야 한다
And 화면 ID 형식이 SPEC-SCREEN-001과 동일해야 한다
```

### Scenario 2: 분류 일관성

```gherkin
Given 모든 모듈이 작성되었을 때
When 각 화면의 분류(NATIVE/SKIN/CUSTOM/EXTERNAL)를 추출하면
Then SPEC-SCREEN-001의 분류와 100% 일치해야 한다
```

### Scenario 3: API 엔드포인트 일관성

```gherkin
Given 모든 모듈이 작성되었을 때
When 각 화면의 shopby API 엔드포인트를 추출하면
Then SPEC-SCREEN-001의 API 컬럼과 일치해야 한다
And 추가 상세(요청/응답 구조)는 일관되어야 한다
```

---

## AC-10: 품질 게이트 (TRUST 5)

### Tested

```gherkin
Given 플러그인이 완성되었을 때
When 검증 체크리스트를 실행하면
Then 모든 항목이 PASS여야 한다:
  | 검증 항목 |
  | plugin.json 스키마 유효성 |
  | SKILL.md 500줄 이하 |
  | 88개 화면 ID 완전성 |
  | 모듈-화면 배분 일치 |
  | 참조 링크 유효성 (깨진 링크 0개) |
  | YAML frontmatter 유효성 |
```

### Readable

```gherkin
Given 모든 문서가 작성되었을 때
When 문서를 검사하면
Then 한국어로 작성되어야 한다 (코드/기술 용어 제외)
And 일관된 마크다운 포맷을 사용해야 한다
And 각 모듈에 목차(TOC)가 포함되어야 한다
```

### Unified

```gherkin
Given 9개 모듈이 작성되었을 때
When 모듈 간 형식을 비교하면
Then 모든 모듈이 동일한 화면 스펙 템플릿을 사용해야 한다
And 제목 수준(heading level)이 일관되어야 한다
```

### Secured

```gherkin
Given reference.md의 API 섹션이 작성되었을 때
When 인증 요구사항을 검사하면
Then 각 API 엔드포인트의 인증 수준(public/member/admin)이 명시되어야 한다
```

### Trackable

```gherkin
Given 플러그인의 모든 파일이 작성되었을 때
When 추적성을 검사하면
Then SPEC-PLUGIN-002 태그가 모든 파일에 참조되어야 한다
And SPEC-SCREEN-001과의 관계가 명시되어야 한다
```

---

## Definition of Done

- [ ] plugin.json 유효 (Claude Code 공식 스키마)
- [ ] SKILL.md 500줄 이하 (기존 정보 100% 보존)
- [ ] 9개 모듈 파일 완성 (88개 화면 커버)
- [ ] reference.md 완성 (컴포넌트 카탈로그 + API 매핑)
- [ ] 4개 템플릿 완성
- [ ] 2개 완성 예제 작성
- [ ] 에이전트 정의 유효
- [ ] 커맨드 정의 유효
- [ ] Progressive Disclosure 동작 확인
- [ ] SPEC-SCREEN-001 일관성 검증 통과
- [ ] TRUST 5 품질 게이트 통과
