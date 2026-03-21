# 후니프린팅 디자인 토큰 표준 v1.0

## 1. 색상 토큰

### 1.1 핵심 9색 (SSOT - 전 도메인 통일 완료)

| 토큰명 | 값 | 용도 |
|--------|------|------|
| color-primary | #5538B6 | 브랜드 메인, 활성 상태, CTA |
| color-primary-dark | #3B2573 | 강조 버튼 (장바구니 담기 등) |
| color-text-dark | #424242 | 본문 텍스트, 제목 |
| color-text-muted | #979797 | 보조 텍스트, 플레이스홀더 |
| color-border | #CACACA | 테두리, 구분선 |
| color-bg-white | #FFFFFF | 카드/모달 배경 |
| color-bg-section | #F6F6F6 | 페이지 배경, 섹션 배경 |
| color-error | #CC1523 | 오류, 삭제, 경고 |
| color-gold | #E6B93F | 별점, 골드 등급 |

### 1.2 확장 토큰 (도메인 공통)

| 토큰명 | 표준값 | 현재 Admin 값 | 통일 방향 |
|--------|--------|-------------|----------|
| color-primary-light | #EDE9FB | #EDE9F6 | #EDE9FB로 통일 |
| color-success | #16A34A | #38A169 | #16A34A로 통일 |
| color-warning | #D97706 | #DD6B20 | #D97706으로 통일 |

### 1.3 도메인 특화 토큰 (해당 도메인에서만 사용)

| 토큰명 | 값 | 도메인 |
|--------|------|--------|
| color-kakao | #FEE500 | Member (카카오 로그인) |
| color-naver | #03C75A | Member (네이버 로그인) |
| color-admin-bg | #F8FAFC | CS Admin (관리자 배경) |
| color-admin-sidebar | #1E293B | CS Admin (사이드바) |
| color-active-green | #C6F6D5 | Admin Product (활성 뱃지) |
| color-inactive-gray | #E2E8F0 | Admin Product (비활성 뱃지) |
| color-status-pending | #FD7E14 | Mypage (입금대기 뱃지) |

---

## 2. 컴포넌트 크기 표준

### 2.1 높이 (Height) - 프론트 UI

| 요소 | 표준 높이 | 비고 |
|------|----------|------|
| 소형 버튼 | 32px | 인라인 액션, 페이지네이션, SearchBar |
| 일반 버튼 | 44px | 대부분의 액션 버튼 |
| CTA 버튼 | 50px | 로그인, 가입, 결제, 제출 등 핵심 액션 |
| 입력 필드 | 44px | 텍스트, 셀렉트, 검색 입력 |
| 테이블 행 | 44px | 프론트 테이블 |
| 탭 | 44px | 카테고리 탭, 필터 탭 |
| 글로벌 헤더 | 60px | 전 페이지 공통 GNB |

### 2.1-A 높이 (Height) - 관리자 UI

| 요소 | 표준 높이 | 비고 |
|------|----------|------|
| 인라인 버튼 | 28px | 테이블 내 편집/삭제 등 |
| 컴팩트 버튼/셀렉트 | 36px | 필터, 검색, 소형 액션 |
| 일반 버튼/입력 | 40px | 모달 버튼, 관리자 폼 입력 |
| 탭/테이블 행 | 48px | 관리자 탭바, 데이터 행 |
| 액션바 | 64px | 하단 고정 저장/취소 툴바 |

### 2.2 모서리 반경 (Corner Radius)

| 요소 | 표준값 | 비고 |
|------|--------|------|
| 입력 필드 | 4px | 텍스트, 셀렉트 |
| 일반 버튼 | 4px | 테이블/폼 내 버튼 |
| CTA 버튼 | 5px | 주요 액션 버튼 |
| 카드 | 8px | 주문 카드, 쿠폰 카드 |
| 모달/팝업 | 12px | 다이얼로그, 모달 |
| 배지 | 2-4px | 상태 배지, 라벨 |
| 원형 요소 | 9999px | 아바타, 원형 배지 |

### 2.3 간격 (Spacing)

| 요소 | 표준값 | 비고 |
|------|--------|------|
| 페이지 패딩 | 32px | 콘텐츠 영역 좌우 |
| 카드 내부 패딩 | 16px | 카드/리스트 아이템 |
| 모달 패딩 | 24px | 모달/팝업 내부 |
| 폼 필드 간격 | 16px | 폼 필드 사이 gap |
| 헤더 좌우 패딩 | 40px | GNB 좌우 여백 |
| 사이드바 너비 | 220px | 마이페이지/관리자 |
| 입력 필드 패딩 | [0, 12px] | 좌우 내부 패딩 |

---

## 3. 타이포그래피 표준

| 요소 | 폰트 | 크기 | 굵기 |
|------|------|------|------|
| 페이지 타이틀 | Noto Sans | 24px | 600 |
| 섹션 타이틀 | Noto Sans | 20px | 600 |
| 카드/모달 타이틀 | Noto Sans | 18px | 600 |
| 라벨 | Noto Sans | 16px | 500 |
| 본문 | Noto Sans | 14px | 400 |
| 보조 텍스트 | Noto Sans | 13px | 400 |
| 캡션/힌트 | Noto Sans | 12px | 400 |
| 소형 텍스트 | Noto Sans | 11px | 400 |
| 배지 텍스트 | Noto Sans | 9-11px | 600 |

---

## 4. 폼 레이아웃 표준 (v1.1 추가)

### 4.1 버튼 너비 원칙

| 컨텍스트 | 데스크톱(PC) | 모바일 | 비고 |
|---------|-------------|--------|------|
| 로그인/회원가입 CTA | fill_container | fill_container | 좁은 카드 폼 내 |
| 결제/주문 CTA | fill_container | fill_container | 핵심 전환 액션 |
| 일반 폼 제출 (저장/등록) | hug_contents, 우측 정렬 | fill_container | 데스크톱은 고유 너비 |
| 모달 버튼 | hug_contents, 우측 정렬 | fill_container | 확인/취소 |
| 버튼 그룹 (이전/다음) | 각 hug_contents, flex row | 각 fill_container | 데스크톱은 좌우 배치 |
| 테이블 인라인 액션 | hug_contents | hug_contents | 항상 고유 너비 |

### 4.2 입력 필드 레이아웃

| 항목 | 데스크톱(PC) | 모바일 |
|------|-------------|--------|
| 필드 너비 | fill_container (폼 카드 내) | fill_container |
| 라벨 위치 | 필드 상단 (vertical) | 필드 상단 |
| 라벨/필드 간격 | 6-8px | 6px |
| 필드 간 간격 | 16px | 12px |
| 2열 필드 (업태/종목) | flex row, gap 12px | 1열 stack |
| 폼 카드 패딩 | 24-32px | 16px |

### 4.3 디자인 시스템 참조

근거: Material Design 3, Apple HIG, Ant Design, Toss Design 공통 원칙.
PC 우선 설계(인쇄 업종 B2B). 모바일 대응은 코드 구현 시 CSS 미디어 쿼리로 처리.

---

## 5. 적용 규칙

### 5.1 변경 원칙
- [HARD] 변경 전 해당 파일을 git add하여 백업
- [HARD] 1파일씩 순차 작업, 각 파일 완료 후 스크린샷 검증
- [HARD] batch_design U()만 사용 (replace_all_matching_properties의 색상 변수 사용 금지)
- [HARD] 레이아웃 구조 변경 금지, 속성(색상/크기/간격)만 수정

### 5.2 적용 우선순위
1. 토큰 불일치 통일 (success, warning, primary-light)
2. 컴포넌트 크기 표준화 (버튼, 입력, cornerRadius)
3. 파일 간 동일 컴포넌트 시각적 비교 검증

---

작성일: 2026-03-21
기준: SPEC-DESIGN-003, shared-*.pen, product-components.pen (SSOT)
