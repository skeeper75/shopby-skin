---
id: SPEC-SKIN-009
version: 1.0.0
status: draft
created: 2026-03-18
updated: 2026-03-18
---

# SPEC-SKIN-009 구현 계획

## 개요

shopby Enterprise 관리자 페이지를 Playwright로 자동 분석하여 Native vs Custom 기능 매트릭스를 생성하는 단계별 구현 계획.

---

## Phase 1: Playwright 크롤러 + 스크린캡처 + DOM 분석 — 우선순위 최고

### 목표
Playwright로 shopby 관리자 페이지에 로그인하고, 전체 메뉴를 탐색하여 스크린샷과 DOM 구조를 수집한다.

### 태스크

**T1.1: Playwright 환경 설정**

- Playwright 설치 (`npm install -D @playwright/test`)
- `scripts/admin-analyzer/` 디렉토리 생성
- `ref/shopby/admin-screenshots/` 디렉토리 구조 생성
- `ref/shopby/admin-analysis/` 디렉토리 생성
- `.gitignore`에 스크린샷 디렉토리 추가
- 관련 요구사항: R1.1

**T1.2: 로그인 모듈 구현**

- `scripts/admin-analyzer/login.js` 작성
- 환경 변수에서 자격 증명 로드
- 로그인 폼 자동 입력 및 제출
- 로그인 성공 확인 (대시보드 리다이렉트)
- 실패 시 최대 3회 재시도
- 관련 요구사항: R1.1, R1.5

**T1.3: 메뉴 크롤러 구현**

- `scripts/admin-analyzer/crawl.js` 작성
- 사이드바 메뉴 DOM 탐색
- 1depth → 2depth → 3depth 메뉴 구조 추출
- 각 메뉴 항목: { title, url, depth, parentTitle, category }
- 결과를 `menu-map.json`에 저장
- 관련 요구사항: R1.2, R1.3, R1.4

**T1.4: 스크린캡처 모듈 구현**

- `scripts/admin-analyzer/screenshot.js` 작성
- `menu-map.json`에서 URL 목록 로드
- 각 페이지 방문 → networkidle 대기 → 풀 페이지 스크린샷
- 카테고리별 디렉토리에 저장
- 페이지당 2초 간격, 30초 타임아웃
- 진행률 콘솔 출력
- 관련 요구사항: R2.1~R2.6

**T1.5: DOM 분석 모듈 구현**

- `scripts/admin-analyzer/dom-analyzer.js` 작성
- 각 페이지에서 UI 요소 추출:
  - 페이지 제목, breadcrumb
  - 검색 폼 필드 (input, select, datepicker)
  - 테이블 컬럼 헤더
  - 버튼 텍스트 (등록, 수정, 삭제, 엑셀 등)
  - 탭 라벨
- 결과를 페이지별 JSON으로 저장
- 관련 요구사항: R3.1~R3.3

### 산출물

- Playwright 스크립트 5개 (crawl, login, screenshot, dom-analyzer, index)
- `menu-map.json` (전체 메뉴 구조)
- 카테고리별 스크린샷 (80~120장)
- 페이지별 DOM 분석 JSON (80~120개)

### 리스크

| 리스크 | 수준 | 대응 |
|--------|------|------|
| 로그인 실패 | 중간 | 재시도 + OTP 수동 처리 |
| SPA 라우팅 감지 불가 | 낮음 | 사이드바 클릭 기반 네비게이션 |
| 페이지 로딩 타임아웃 | 중간 | 30초 타임아웃 + 스킵 |
| 동적 콘텐츠 미렌더링 | 낮음 | networkidle + 추가 대기 |

---

## Phase 2: 기능 매트릭스 + 개발 권고안 — 우선순위 높음

### 목표
Phase 1의 분석 결과와 shopby 문서를 대조하여 기능 매트릭스와 개발 권고안을 생성한다.

### 태스크

**T2.1: 기능 매트릭스 생성**

- Phase 1의 DOM 분석 결과 로드
- shopby 문서(ref/shopby/shopby_enterprise_docs/) 카테고리별 대조
- 각 기능에 대해 NATIVE/SKIN/CUSTOM/SKIP 분류
- 분류 근거(스크린샷, 문서 참조) 명시
- `feature-matrix.md` 생성
- 관련 요구사항: R4.1~R4.4

**T2.2: SPEC 중복/갭 분석**

- 현재 SPEC-SKIN-005~008과 기능 매트릭스 대조
- 중복 구현된 기능 목록 작성
- 미구현 영역 중 CUSTOM 필요 기능 식별
- 관련 요구사항: R4.4

**T2.3: 개발 권고안 문서 작성**

- NATIVE/SKIP 기능 → "개발하지 않아도 되는 기능" 목록
- CUSTOM 기능 → "반드시 개발해야 하는 기능" + 우선순위
- SKIN 기능 → "경량 커스터마이징 영역" 목록
- 향후 SPEC 제안
- `recommendations.md` 생성
- 관련 요구사항: R5.1~R5.6

### 산출물

- `feature-matrix.md` (기능 매트릭스)
- `recommendations.md` (개발 권고안)
- SPEC 중복/갭 분석 보고

### 리스크

| 리스크 | 수준 | 대응 |
|--------|------|------|
| 문서와 실제 UI 불일치 | 중간 | 스크린샷 기준으로 판단 |
| 분류 기준 주관성 | 중간 | 명확한 분류 가이드라인 수립 |

---

## 기술적 접근 방식

### Playwright 크롤링 전략

```
1. 브라우저 시작 (headless, 1920x1080)
2. 로그인 페이지 접속 → 자격 증명 입력 → 로그인
3. 대시보드 도착 확인
4. 사이드바 메뉴 DOM 순회
   ├── 1depth 메뉴 클릭 → 2depth 메뉴 노출
   │   ├── 2depth 메뉴 클릭 → 페이지 이동
   │   │   ├── URL 기록
   │   │   ├── 스크린샷 캡처
   │   │   ├── DOM 분석
   │   │   └── 다음 메뉴로 이동
   │   └── 3depth 메뉴가 있으면 재귀 탐색
   └── 다음 1depth로 이동
5. 결과 저장
```

### 기능 분류 기준

| 분류 | 기준 | 예시 |
|------|------|------|
| NATIVE | shopby 관리자 UI를 그대로 사용 가능 | 기본 주문관리, 회원목록 |
| SKIN | shopby UI + CSS/레이아웃 커스터마이징 | 상품등록 폼 필드 추가 |
| CUSTOM | 완전 별도 개발 필요 | 가격 매트릭스, 원장 관리, 인쇄 통계 |
| SKIP | 인쇄업에 불필요 | 정기결제, 사은품 관리 등 |

---

## Traceability

| TAG | 요구사항 | Phase | 태스크 |
|-----|----------|-------|--------|
| SPEC-SKIN-009-R1 | Playwright 크롤러 | Phase 1 | T1.1~T1.3 |
| SPEC-SKIN-009-R2 | 스크린캡처 | Phase 1 | T1.4 |
| SPEC-SKIN-009-R3 | DOM 분석 | Phase 1 | T1.5 |
| SPEC-SKIN-009-R4 | 기능 매트릭스 | Phase 2 | T2.1~T2.2 |
| SPEC-SKIN-009-R5 | 개발 권고안 | Phase 2 | T2.3 |
