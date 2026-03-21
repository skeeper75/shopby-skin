# 후니프린팅 디자인 일관성 감사 보고서

> 작성일: 2026-03-21
> 범위: designs/ 전체 6개 도메인 컴포넌트 파일
> 방법: Pencil MCP batch_get + search_all_unique_properties 기반 속성 추출

---

## 1. 감사 요약

### 감사 대상 파일
| 도메인 | 컴포넌트 파일 | 컴포넌트 수 |
|--------|-------------|-----------|
| 상품 (SSOT) | product-components.pen | 40+ |
| 회원 | member-components.pen | 14 |
| 마이페이지 | mypage-components.pen | 7 |
| 주문 | order-components.pen | 15 |
| CS | cs-components.pen | 23 |
| 관리자 | admin-product-components.pen | 30+ |

### 일관성 점수 (Product SSOT 기준)
| 도메인 | 폰트 | 변수명 | 네이밍 | 높이 | 반경 | 종합 |
|--------|------|--------|--------|------|------|------|
| CS | 90% | 100% | 100% | 70% | 80% | **88%** |
| Admin | 40% | 80% | 100% | 60% | 70% | **70%** |
| Member | 0% | 50% | 100% | 80% | 0% | **46%** |
| Order | 0% | 50% | 50% | 60% | 60% | **44%** |
| Mypage | 0% | 0% | 0% | 50% | 50% | **20%** |

---

## 2. 크로스도메인 비교 매트릭스

### 2.1 폰트 패밀리 (Severity: CRITICAL)

| 도메인 | 사용 폰트 | Figma 기준 (Noto Sans KR) 일치 |
|--------|----------|-------------------------------|
| Product | Noto Sans | 부분 일치 (KR 누락) |
| Member | Inter | 불일치 |
| Mypage | Inter | 불일치 |
| Order | Inter | 불일치 |
| CS | Noto Sans KR | 완전 일치 |
| Admin | Pretendard + Noto Sans + Inter | 3개 혼재 - 심각 |

**분석**: Figma 원본은 "Noto Sans KR" 사용. CS만 정확히 일치. Product는 "KR" 누락. Member/Mypage/Order는 "Inter"로 완전히 다른 폰트. Admin은 3개 폰트가 한 파일에 혼재.

### 2.2 디자인 변수 (Severity: CRITICAL)

| 도메인 | 컨벤션 | 예시 | 하드코딩 비율 |
|--------|--------|------|-------------|
| Product | `$color-xxx` | `$color-primary`, `$color-text-dark` | 0% |
| Member | `$xxx` | `$primary`, `$text-primary` | 5% |
| Mypage | 하드코딩 | `#5538B6`, `#424242` | 100% |
| Order | `$xxx` | `$primary`, `$text-primary` | 0% |
| CS | `$color-xxx` | `$color-primary`, `$color-text-dark` | 0% |
| Admin | `$color-xxx` + 혼합 | `$color-primary` + `#1E1B2E` | 30% |

**의미적 동일 토큰의 이름 차이**:
| 의미 | Product | Member/Order | CS | Admin |
|------|---------|-------------|-----|-------|
| 본문 텍스트 | `$color-text-dark` | `$text-primary` | `$color-text-dark` | `$color-text-primary` |
| 보조 텍스트 | `$color-text-muted` | `$text-secondary`/`$text-tertiary` | `$color-text-muted` | `$color-text-secondary` |
| 기본 배경 | `$color-bg-white` | `$bg-primary` | `$color-bg-white` | `$color-bg-card` |
| 섹션 배경 | `$color-bg-section` | - | `$color-bg-section` | `$color-bg-page` |

### 2.3 컴포넌트 네이밍 (Severity: MODERATE)

| 도메인 | 컨벤션 | 예시 |
|--------|--------|------|
| Product | CMP-PascalCase | CMP-OptionButton, CMP-Header |
| Member | CMP-PascalCase | CMP-TextField, CMP-Button |
| Mypage | kebab-case | order-card, coupon-card, empty-state |
| Order | PascalCase (접두사 없음) | FileDropZone, UploadProgressBar |
| CS | CMP-PascalCase | CMP-CategoryTab, CMP-Pagination |
| Admin | CMP-PascalCase | CMP-TableHeaderRow, CMP-Modal |

### 2.4 버튼 높이 (Severity: MODERATE)

| 용도 | Product | Member | Mypage | Order | CS | Admin |
|------|---------|--------|--------|-------|-----|-------|
| Primary | 50px | 48px | 40px | - | 48px | 40px |
| Secondary | 50px | 48px | - | - | 40px | 36px |
| Small | - | 36px | - | - | - | 32px |
| Badge/Tag | 14px | - | 24px | 28-32px | 24px | 24px |

### 2.5 Corner Radius (Severity: MODERATE)

| 요소 | Product | Member | Mypage | Order | CS | Admin |
|------|---------|--------|--------|-------|-----|-------|
| 버튼/인풋 | 4px | 8px | 4px | 6-8px | 6px | 6-8px |
| 카드 | - | 12px | 8px | 8px | 8px | 8-12px |
| 뱃지 | 2px | - | 12px | 16px | 4-12px | 4-12px |
| 모달 | - | - | - | - | 12px | 12px |
| 체크박스 | 3px | 4px | - | 4px | 3px | 3-4px |

### 2.6 공유 컴포넌트 현황 (Severity: HIGH)

| 컴포넌트 | Product | Member | Mypage | Order | CS | Admin |
|----------|---------|--------|--------|-------|-----|-------|
| Header | CMP-Header (1440x60) | 없음 | 없음 | 없음 | 없음 | CMP-AdminHeader |
| Breadcrumb | CMP-Breadcrumb (독립) | 없음 | page-title 내장 | 없음 | 없음 | AdminHeader 내장 |
| Footer | 없음 | 없음 | 없음 | 없음 | 없음 | 없음 |
| Sidebar | 없음 | 없음 | sidebar-header | 없음 | 없음 | CMP-AdminSidebar |
| Pagination | CMP-Pagination (28px) | 없음 | 없음 | 없음 | CMP-Pagination (36px) | CMP-Pagination (32px) |
| Empty State | 없음 | 없음 | empty-state | 없음 | CMP-EmptyState | 없음 |
| Modal | 없음 | 없음 | 없음 | 없음 | CMP-ConfirmModal | CMP-Modal, CMP-ModalLarge |

---

## 3. 발견된 핵심 문제

### P1 - 폰트 불일치 (긴급)
4종 폰트(Noto Sans, Noto Sans KR, Inter, Pretendard)가 혼재. 동일 사이트 내에서 사용자가 페이지를 이동할 때 텍스트 렌더링이 달라지는 시각적 불일치 발생.

### P2 - 변수 시스템 부재 (긴급)
Mypage는 모든 색상이 하드코딩. 테마 변경이나 브랜드 색상 수정 시 개별 파일을 모두 수동 수정해야 함. 3가지 변수 네이밍 컨벤션이 공존하여 재사용 불가.

### P3 - 공유 레이아웃 부재 (높음)
Header, Footer, Breadcrumb 등 모든 페이지에 공통으로 나타나는 요소가 도메인별로 따로 만들어지거나 아예 없음. 사이트 탐색 경험의 일관성이 깨짐.

### P4 - 컴포넌트 크기 편차 (중간)
동일한 의미의 버튼이 36~50px, Corner radius가 4~12px까지 편차. 사용자가 도메인을 넘나들 때 미묘한 이질감 유발.

### P5 - 네이밍 불일치 (낮음)
CMP-PascalCase (4개), kebab-case (1개), PascalCase without prefix (1개). 개발 시 컴포넌트 매핑 혼란 가능.

---

## 4. 색상 팔레트 비교

### Figma 기준 (SSOT)
```
Primary:     #5538B6
Primary-Dark:#3B2573
Primary-Lt1: #C9C2DF
Primary-Lt2: #DED7F4
Primary-Lt3: #EEEBF9
Text-Dark:   #424242
Text-Medium: #565656
Text-Muted:  #979797
Border:      #CACACA
BG-Light:    #E9E9E9
BG-Section:  #F6F6F6
BG-White:    #FFFFFF
Accent-Gold: #E6B93F
Accent-Teal: #7AC8C4
```

### 도메인별 비브랜드 색상 사용 (하드코딩된 고유 색상)
| 도메인 | 비표준 색상 | 용도 |
|--------|-----------|------|
| Mypage | #FD7E14 | 입금대기 상태 뱃지 |
| Admin | #1E1B2E | 사이드바 배경 |
| Admin | #8B85A1 | 섹션 라벨 |
| Admin | #F8F8FA | 테이블 헤더 배경 |
| Admin | #A0AEC0 | 비활성 스텝 아이콘 |
| CS | #FEF2F2 | 에러 배너 배경 |
| CS | #FFFBEB | 경고 배너 배경 |
| CS | #F0FDF4 | 성공 뱃지 배경 |
| Admin | #F0FFF4, #FFF5F5 | 토스트 배경 |
| Admin | #FEF9C3 | 조건부 뱃지 배경 |

---

## 5. 참조 방법론

### 디자인 토큰 기반 일관성 관리 (W3C Design Tokens)
- 모든 시각적 속성(색상, 타이포, 스페이싱, 반경)을 토큰으로 정의
- 단일 변수 파일에서 관리하여 전역 일관성 보장
- 참고: Salesforce Lightning, Material Design, IBM Carbon

### Atomic Design 감사 (Brad Frost)
- Interface Inventory: 모든 고유 UI 요소를 스크린샷으로 수집
- 같은 의미의 컴포넌트 비교 → 편차 식별
- Atom → Molecule → Organism 계층 강제

### 한국 디자인 시스템 사례
- Toss: Design Token + Figma Token Studio로 코드-디자인 동기화
- Kakao: Kasa Design System으로 크로스플랫폼 일관성
- Naver: Verde Design System으로 서비스 간 통합

---

*감사 수행: MoAI UltraThink + Pencil MCP 순차 감사*
*다음 단계: design-unified-standards.md (통일 기준서)*
