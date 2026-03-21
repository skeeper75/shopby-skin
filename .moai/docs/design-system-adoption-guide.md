# 후니프린팅 디자인시스템 채택 가이드

> seed-design(당근 디자인 시스템)에서 채택해야 할 **구조적 요소**
> 후니프린팅 고유 토큰(브랜드 색상 #5538B6, 인쇄 도메인 컴포넌트 등)은 별도 관리

---

## 1. 채택 대상 vs 고유 영역 구분

| 영역 | seed-design에서 채택 | 후니프린팅 고유 |
|------|-------------------|---------------|
| **토큰 아키텍처** | 2-Layer (Scale → Semantic) | - |
| **색상 역할 체계** | Property × Role × State 구조 | 실제 색상값 (#5538B6 등) |
| **타이포 스케일** | t1~t10 스케일 체계 | 폰트 (Noto Sans KR) |
| **스페이싱 시스템** | 시맨틱 간격 토큰 체계 | 실제 px 값 |
| **Radius 스케일** | r0.5~r6, full 체계 | - |
| **상태 시스템** | Enabled/Pressed/Selected/Disabled | 인쇄 도메인 상태 (검수 Pass/Fail 등) |
| **컴포넌트 분류** | 6-카테고리 구조 | 인쇄 전용 컴포넌트 (옵션칩, 카운터 등) |

---

## 2. 채택 요소 1: 토큰 아키텍처 (2-Layer)

seed-design의 핵심 원칙: **Scale Token → Semantic Token**

```
Scale Token: 실제 값에 이름을 부여 (플랫폼에 독립적)
  예: $font-size.t4 = 14px, $radius.r1_5 = 6px

Semantic Token: Scale의 조합으로 디자인 의도를 표현 (실제 사용 단위)
  예: $color.fg.brand = 브랜드 전경색, $dimension.spacing-x.global-gutter = 화면 가장자리 간격
```

### 후니프린팅 적용

**현재 문제**: 각 .pen 파일이 직접 값($color-primary)이나 하드코딩(#5538B6)을 사용

**적용 방법**:
```
Layer 1 (Scale): 값의 스케일만 정의
  $font-size.t1 = 11px
  $font-size.t2 = 12px
  ...
  $radius.r1 = 4px
  $radius.r1_5 = 6px
  ...
  $dimension.x2 = 8px
  $dimension.x4 = 16px

Layer 2 (Semantic): 용도별 의미 부여
  $color.fg.brand = (후니 primary 색상 참조)
  $color.bg.layer-1 = (카드/입력 배경)
  $color.bg.layer-default = (페이지 배경)
  $color.stroke.outline = (테두리)
  $spacing.global-gutter = $dimension.x4 (16px)
  $spacing.component-default = $dimension.x3 (12px)
```

### 이점
- 브랜드 색상이 바뀌어도 Semantic 레이어만 수정
- 모든 .pen 파일이 같은 Semantic 토큰을 참조하므로 자동으로 일관성 확보
- 개발 전환 시 CSS Custom Properties와 1:1 매핑 가능

---

## 3. 채택 요소 2: 색상 역할 체계 (Property × Role × State)

seed-design은 색상을 **3개 속성** × **역할** × **상태**로 체계화합니다.

### Property (속성)
| 속성 | 용도 | .pen 적용 |
|------|------|----------|
| **bg** (Background) | 화면/카드/버튼 배경 | `fill` 속성 |
| **fg** (Foreground) | 텍스트/아이콘 전경 | `textColor`, `fill` (텍스트) |
| **stroke** | 테두리/구분선 | `stroke.fill` 속성 |

### Role (역할)
| 역할 | 의미 | 후니프린팅 매핑 |
|------|------|---------------|
| **brand** | 브랜드/주요 액션 강조 | $color-primary 계열 |
| **neutral** | 중립적 요소 | $color-text-dark, $color-border |
| **positive** | 성공/완료 | $color-success |
| **negative** | 오류/삭제 | $color-error |
| **informative** | 정보/안내 | $color-info |
| **warning** | 경고/주의 | $color-warning |

### 후니프린팅 적용 네이밍

**변경 전** (현재 혼재):
```
Product: $color-primary, $color-text-dark, $color-border
Member: $primary, $text-primary, $border
Mypage: #5538B6, #424242, #CACACA (하드코딩)
```

**변경 후** (seed-design 역할 체계 적용):
```
$color.bg.layer-default     → 페이지 배경 (#FFFFFF 또는 #F6F6F6)
$color.bg.brand-solid       → 브랜드 채운 배경 (primary 버튼)
$color.fg.neutral            → 기본 텍스트 (#424242)
$color.fg.neutral-subtle     → 보조 텍스트 (#979797)
$color.fg.brand              → 브랜드 텍스트 (링크, 선택됨)
$color.stroke.outline        → 기본 테두리 (#CACACA)
$color.stroke.brand-solid    → 브랜드 테두리 (선택 상태)
$color.bg.positive-subtle    → 성공 배경 (#F0FDF4)
$color.bg.negative-subtle    → 에러 배경 (#FEF2F2)
```

### 이점
- 같은 "의미"를 가진 색상은 모든 도메인에서 같은 토큰 이름
- 역할을 보면 용도를 즉시 파악 가능
- 테마 전환(다크 모드 등) 시 역할 매핑만 변경

---

## 4. 채택 요소 3: 시맨틱 스페이싱

seed-design은 단순 px 값이 아닌 **용도별 시맨틱 간격**을 정의합니다.

| 시맨틱 토큰 | seed-design 값 | 용도 | 후니프린팅 적용 |
|-----------|---------------|------|---------------|
| `global-gutter` | 16px (x4) | 화면 가장자리 ↔ 콘텐츠 | Header 좌우 패딩, 카드 그리드 여백 |
| `component-default` | 12px (x3) | 컴포넌트 간 기본 간격 | 폼 필드 간 간격, 카드 내부 |
| `nav-to-title` | 20px (x5) | 네비게이션 → 타이틀 | Header → Breadcrumb/PageTitle |
| `between-chips` | 8px (x2) | 칩/태그 사이 간격 | 옵션 칩, 뱃지 간격 |
| `between-text` | 6px (x1.5) | 텍스트 요소 간 간격 | 제목 → 설명 텍스트 |
| `screen-bottom` | 56px (x14) | 화면 하단 여백 | Footer 위 여백 |

### 후니프린팅 적용

**현재 문제**: 패딩/간격 값이 도메인별로 다름
- Product Header 패딩: 40px
- Member 버튼 패딩: 24px
- Admin 헤더 패딩: 24px

**적용 방법**: 시맨틱 토큰으로 통일
```
$spacing.global-gutter = 16px       → 모든 화면의 좌우 콘텐츠 여백
$spacing.section-gap = 24px         → 섹션 간 간격
$spacing.component-gap = 12px       → 컴포넌트 간 간격
$spacing.input-padding-x = 12px     → 입력 필드 좌우 패딩
$spacing.button-padding-x = 20px    → 버튼 좌우 패딩 (Primary)
$spacing.card-padding = 16px        → 카드 내부 패딩
```

---

## 5. 채택 요소 4: 상태 시스템 (State)

seed-design은 상태를 **상호작용 상태**와 **옵션 상태**로 구분합니다.

### 상호작용 상태 (사용자 동작에 따라 변함)
| 상태 | 설명 | 시각적 표현 |
|------|------|-----------|
| **Enabled** | 기본 상태 (아무 상호작용 없음) | 기본 스타일 |
| **Pressed** | 누르고 있는 상태 | 약간 어두운 배경 |

### 옵션 상태 (설정에 따라 적용)
| 상태 | 설명 | 시각적 표현 |
|------|------|-----------|
| **Selected** | 선택됨/활성화됨 | 브랜드 테두리 2px + 브랜드 텍스트 |
| **Disabled** | 비활성화됨 | 회색 배경 + 흐린 텍스트 |

### 후니프린팅 적용

**현재**: 상태 스타일이 도메인별로 다름
- Product: selected = white fill + #5538B6 stroke w2
- Member: Inter 폰트로 다른 느낌
- Mypage: 하드코딩된 색상

**통일 기준** (seed-design 원칙 적용):
```
모든 도메인 동일:
  Enabled  → bg: $color.bg.layer-default, stroke: $color.stroke.outline (1px)
  Selected → bg: $color.bg.layer-default, stroke: $color.stroke.brand-solid (2px)
  Disabled → bg: $color.bg.neutral-subtle, stroke: $color.stroke.outline (1px), opacity: 0.6
  Pressed  → bg: $color.bg.brand-subtle (seed-design의 pressed 패턴)
```

---

## 6. 채택 요소 5: 컴포넌트 카테고리 구조

seed-design은 컴포넌트를 6가지 카테고리로 분류합니다.

| 카테고리 | 포함 컴포넌트 | 후니프린팅 대응 |
|---------|-------------|---------------|
| **Buttons** | Button, IconButton, FAB | CMP-Button, CMP-UploadButton |
| **Controls** | Checkbox, Radio, Select, Switch, TextField, Slider | CMP-Checkbox, CMP-RadioButton, CMP-OptionSelect, CMP-Toggle |
| **Display** | Avatar, Badge, Card, Chip, Tag | CMP-Badge, CMP-ColorChip, CMP-StatusBadge |
| **Feedback** | Dialog, Modal, Toast, Progress, Skeleton | CMP-Modal, CMP-Toast, CMP-EmptyState |
| **Layout** | Divider, Tabs | CMP-Header, CMP-Tab, CMP-Pagination |
| **Navigation** | AppBar, BottomSheet, Breadcrumb | CMP-Breadcrumb, CMP-AdminSidebar |

### 후니프린팅 추가 카테고리 (인쇄 도메인 전용)
| 카테고리 | 컴포넌트 | 비고 |
|---------|---------|------|
| **Print Controls** | CMP-OptionButton, CMP-CounterInput, CMP-FinishSelect | 인쇄 옵션 선택 |
| **Print Display** | CMP-PriceSummary, CMP-VolumeDiscountCard, CMP-ColorChip | 인쇄 정보 표시 |
| **Upload** | CMP-FileDropZone, CMP-UploadProgressBar, CMP-ValidationBadge | 파일 업로드/검수 |
| **Admin Data** | CMP-TableHeaderRow, CMP-FormField, CMP-PriceMatrixGrid | 관리자 데이터 |

---

## 7. 실행 체크리스트

### 즉시 적용 가능 (도구 변경 없음)

- [ ] **네이밍 통일**: 모든 .pen 파일에서 CMP-PascalCase 사용
- [ ] **폰트 통일**: Noto Sans KR (seed-design 원본 참조)
- [ ] **상태 패턴 통일**: Enabled/Selected/Disabled 3-state 모든 도메인 동일 적용
- [ ] **스케일 준수**: font-size t1~t10, radius r0.5~r6, dimension x1~x16

### 단기 작업 (shared-*.pen 생성)

- [ ] **공유 토큰 파일**: Pencil 변수로 시맨틱 토큰 등록
- [ ] **공유 레이아웃**: Header/Footer/Breadcrumb 컴포넌트 생성
- [ ] **공유 폼**: Button/TextField/Select/Checkbox 통일 컴포넌트

### 중기 목표 (코드 전환 시)

- [ ] **CSS Custom Properties**: Pencil 변수 → CSS 변수 매핑
- [ ] **컴포넌트 라이브러리**: React + Tailwind 컴포넌트 생성
- [ ] **Storybook**: 컴포넌트 문서화 + 시각 테스트

---

## 8. 핵심 요약

seed-design에서 가져오는 것은 **값(colors, specific px)이 아니라 구조(architecture)**입니다:

1. **2-Layer 토큰** = Scale(값) + Semantic(의미) → 일관성의 기반
2. **색상 역할 체계** = Property × Role × State → 색상 사용 규칙
3. **시맨틱 스페이싱** = 용도별 간격 이름 → 레이아웃 일관성
4. **상태 시스템** = Enabled/Selected/Disabled → 인터랙션 일관성
5. **컴포넌트 분류** = 6-카테고리 → 라이브러리 구조

이 구조가 적용되면, 후니프린팅 고유 디자인 토큰(브랜드 색상, 인쇄 전용 컴포넌트)은 이 구조 위에 자연스럽게 올라갑니다.

---

*본 가이드는 ref/seed.design/seed-design/ (당근 SEED Design System) 분석을 기반으로 작성되었습니다.*
*참조: rootage/color.yaml, font-size.yaml, radius.yaml, dimension.yaml, docs/content/docs/foundation/*
