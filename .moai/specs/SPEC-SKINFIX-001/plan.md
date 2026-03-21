---
id: SPEC-SKINFIX-001
type: plan
tags: [SPEC-SKINFIX-001, implementation-plan]
---

# SPEC-SKINFIX-001: 구현 계획

## 실행 전략

**방법론**: DDD (ANALYZE-PRESERVE-IMPROVE)
- 기존 동작을 보존하면서 디자인 시스템 정합성을 복원하는 작업
- 시각적 결과는 동일하게 유지하되, 토큰 참조로 전환

## 단계별 실행 계획

### Phase 1: 토큰 기반 복원 (Module 0 + 4) - 위험도 낮음

**목표**: CSS 변수 정의 완성 + 색상 체계 통일

태스크:
1. `src/design-system/tokens/colors.css`에 13개 alias 변수 추가
2. `src/design-system/tokens/typography.css`에 font-size/weight alias 추가
3. `src/design-system/tokens/spacing.css`에 spacing alias 추가
4. `src/design-system/tokens/radius.css`에 radius alias 추가
5. `src/globals.css` 또는 colors.css에 `--point-color` 오버라이드 추가

**검증**: 빌드 성공, 기존 페이지 시각 변화 없음 (alias 추가만이므로)

### Phase 2: 네비게이션 복원 (Module 1) - 위험도 낮음

**목표**: 모든 페이지 간 연결 정상화

태스크:
1. `src/components/BottomNav/BottomNav.jsx`: 카테고리 링크 수정
2. Footer 컴포넌트: 커스텀 링크 섹션 추가
3. 모바일 Sheet 메뉴: 서비스 링크 추가

**검증**: 모바일/데스크톱 네비게이션 플로우 테스트

### Phase 3: PageShell 표준화 (Module 3) - 위험도 중간

**목표**: 전 페이지 레이아웃 표준화

태스크:
1. ~22개 미채택 페이지에 PageShell 래핑
2. 인라인 max-w-* 클래스 제거
3. 각 페이지별 적절한 maxWidth 적용

**검증**: 데스크톱 1280px / 모바일 375px 양쪽 레이아웃 확인

### Phase 4: 색상 토큰 전환 (Module 2) - 위험도 중간

**목표**: 하드코딩 색상 완전 제거

태스크:
1. 쇼핑몰 페이지 5개 우선 (FAQ, Terms, Notice, CustomerCenter, Reviews)
2. OrderSheet, Cart 등 핵심 구매 페이지
3. 관리자 페이지 주요 컴포넌트

**검증**: 각 페이지 시각 비교 (변환 전후 동일)

### Phase 5: JIT 패턴 정규화 (Module 5) - 위험도 낮음

**목표**: Tailwind 호환성 확보

태스크:
1. `bg-[--huni-*]` → `bg-[var(--huni-*)]` 일괄 변환
2. `text-[--huni-*]` → `text-[var(--huni-*)]` 일괄 변환
3. `border-[--huni-*]` → `border-[var(--huni-*)]` 일괄 변환

**검증**: 빌드 성공, 스타일 정상 적용

## 기술 제약

- `@shopby/react-components` 소스 수정 불가 (CSS 오버라이드만 허용)
- 모바일 기존 동작 보존 (lg+ 조건부 수정만)
- 벤더 패키지 버전 1.16.5 고정

## 예상 영향

- 수정 파일: ~90개
- 신규 파일: 0개
- 삭제 파일: 0개
- 시각적 변화: 최소 (토큰 매핑으로 동일 색상 유지, 네비게이션 링크 추가)
