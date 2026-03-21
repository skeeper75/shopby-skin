# 후니프린팅 디자인 통일 기준서

> 작성일: 2026-03-21
> 근거: design-consistency-audit.md 감사 결과 + 국내외 디자인 시스템 방법론 리서치
> 상태: 초안 - 지니님 검토 필요

---

## 1. 통일 원칙

### 1.1 단일 진실의 원천 (Single Source of Truth)
- **색상/타이포/스페이싱**: 디자인 토큰 변수 파일 1곳에서 정의
- **공유 컴포넌트**: 1개의 공유 컴포넌트 파일에서 관리
- **도메인 전용 컴포넌트**: 각 도메인 -components.pen에서 관리 (공유 변수 참조)
- **참조 체인**: Figma 원본 → 디자인 토큰 → 공유 컴포넌트 → 도메인 화면

### 1.2 계층적 일관성 (Atomic Design)
```
Level 1: Design Tokens (변수)
  └─ Level 2: Atoms (버튼, 인풋, 뱃지, 아이콘)
      └─ Level 3: Molecules (폼 필드, 검색바, 카드)
          └─ Level 4: Organisms (헤더, 사이드바, 테이블)
              └─ Level 5: Templates (레이아웃)
                  └─ Level 6: Pages (화면)
```

---

## 2. 디자인 토큰 통일 기준

### 2.1 폰트 패밀리
```
기준: Noto Sans KR (Figma SSOT 기준)
적용: 모든 도메인의 모든 텍스트

근거:
- Figma 원본이 "Noto Sans KR" 사용
- 한국어 인쇄 사이트에 최적화된 폰트
- Google Fonts 무료 사용 가능
- CS 도메인이 이미 올바르게 사용 중
```

### 2.2 타이포그래피 스케일
| 토큰명 | 사이즈 | 용도 |
|--------|-------|------|
| `$typo-xs` | 11px | 힌트 텍스트, 범위 안내 |
| `$typo-sm` | 12px | 뱃지, 날짜, 보조 정보 |
| `$typo-base` | 13px | 본문, 테이블 셀, 옵션 설명 |
| `$typo-md` | 14px | 버튼 라벨, 폼 라벨, 리스트 항목 |
| `$typo-lg` | 16px | 섹션 제목, CTA 버튼, 모달 제목 |
| `$typo-xl` | 18px | 페이지 부제목, 관리자 제목 |
| `$typo-2xl` | 20px | 상품명, 페이지 제목 |
| `$typo-3xl` | 24px | 대제목 (마이페이지, 인증 카드) |

### 2.3 색상 토큰
```
-- 브랜드 --
$color-primary:          #5538B6
$color-primary-dark:     #3B2573
$color-primary-secondary:#9580D9
$color-primary-light-1:  #C9C2DF
$color-primary-light-2:  #DED7F4
$color-primary-light-3:  #EEEBF9

-- 텍스트 --
$color-text-dark:        #424242  (본문)
$color-text-medium:      #565656  (부제)
$color-text-muted:       #979797  (비활성/플레이스홀더)

-- 배경 --
$color-bg-white:         #FFFFFF  (카드, 입력)
$color-bg-section:       #F6F6F6  (섹션 배경)
$color-bg-light:         #E9E9E9  (비활성 배경)
$color-bg-page:          #F8F8FA  (페이지 배경 - 관리자)

-- 보더 --
$color-border:           #CACACA  (기본 테두리)

-- 액센트 --
$color-accent-gold:      #E6B93F  (별점, 하이라이트)
$color-accent-teal:      #7AC8C4  (UP 뱃지)

-- 상태 --
$color-success:          #22C55E
$color-success-light:    #F0FDF4
$color-warning:          #F59E0B
$color-warning-light:    #FFFBEB
$color-error:            #EF4444
$color-error-light:      #FEF2F2
$color-info:             #3B82F6
$color-info-light:       #EFF6FF

-- 관리자 전용 --
$color-admin-sidebar:    #1E1B2E
$color-admin-sidebar-text: #8B85A1
$color-active-green:     #C6F6D5
$color-inactive-gray:    #E2E8F0

-- SNS --
$color-kakao:            #FEE500
$color-naver:            #03C75A
```

### 2.4 스페이싱 스케일
| 토큰명 | 값 | 용도 |
|--------|---|------|
| `$space-1` | 4px | 아이콘-텍스트 간격 |
| `$space-2` | 8px | 컴포넌트 내부 간격 |
| `$space-3` | 12px | 카드 패딩, 리스트 간격 |
| `$space-4` | 16px | 섹션 패딩, 폼 필드 간격 |
| `$space-5` | 20px | 리스트 아이템 패딩 |
| `$space-6` | 24px | 모달 패딩, 대 섹션 간격 |
| `$space-8` | 32px | 카드 패딩 (대형) |
| `$space-10` | 40px | 헤더 좌우 패딩 |

### 2.5 Corner Radius 스케일
| 토큰명 | 값 | 용도 |
|--------|---|------|
| `$radius-xs` | 2px | 작은 뱃지 |
| `$radius-sm` | 4px | 체크박스, 기본 뱃지, 페이지네이션 |
| `$radius-md` | 6px | 버튼, 인풋, 드롭다운 |
| `$radius-lg` | 8px | 카드, 토스트, 검색바 |
| `$radius-xl` | 12px | 모달, 대형 카드, 상태 뱃지 |
| `$radius-full` | 9999px | 원형 뱃지, 스텝 인디케이터 |

---

## 3. 컴포넌트 통일 기준

### 3.1 네이밍 컨벤션
```
형식: CMP-{ComponentName}
변형: CMP-{ComponentName}-{State}

예시:
  CMP-Button             (기본)
  CMP-Button-Secondary   (보조)
  CMP-Button-Small       (소형)
  CMP-OptionButton       (옵션 선택)
  CMP-OptionButton-Selected (선택됨)
```

### 3.2 버튼 시스템
| 유형 | 높이 | 패딩(좌우) | Corner Radius | 폰트 |
|------|------|-----------|--------------|------|
| Primary (대형) | 48px | 24px | 6px | 16px / 600 |
| Secondary | 40px | 20px | 6px | 14px / 500 |
| Small | 32px | 12px | 6px | 13px / 500 |
| Badge/Tag | 24px | 10-12px | 12px | 11-12px / 500-600 |
| Icon Button | 28-32px | - | 6px | - |

### 3.3 인풋 시스템
| 유형 | 높이 | 패딩(좌우) | Corner Radius | 폰트 |
|------|------|-----------|--------------|------|
| TextField | 44px | 12px | 6px | 14px / normal |
| Select | 44px | 12px | 6px | 14px / normal |
| 옵션 버튼 | 50px | - (center) | 4px | 14px / normal |
| Counter | 50px | - | 4px | 14px / normal |
| Search | 40px | 14px | 8px | 14px / normal |

### 3.4 상태 스타일링
| 상태 | Fill | Stroke | 텍스트 색상 |
|------|------|--------|-----------|
| Default | $color-bg-white | $color-border 1px | $color-text-dark |
| Selected | $color-bg-white | $color-primary 2px | $color-primary |
| Disabled | $color-bg-section | $color-border 1px | $color-text-muted |
| Error | $color-bg-white | $color-error 1px | $color-error |
| Hover | $color-primary-light-3 | $color-primary 1px | $color-primary |

### 3.5 공유 레이아웃 컴포넌트 (신규 필요)

**CMP-Header** (쇼핑몰 공통)
- 너비: 1440px, 높이: 60px
- 좌: 로고, 중: 검색바, 우: 네비게이션
- 패딩: 40px (좌우)
- 배경: $color-bg-white
- 하단 보더: $color-border 1px

**CMP-Breadcrumb** (쇼핑몰 공통)
- 너비: 1440px, 높이: 30px
- 패딩: 40px (좌우)
- 폰트: 12px, $color-text-muted
- 현재 위치: $color-text-dark

**CMP-AdminLayout** (관리자 공통)
- 사이드바: 240px 너비, $color-admin-sidebar 배경
- 헤더: 64px 높이
- 콘텐츠 영역: 나머지

**CMP-Footer** (전체 공통 - 신규)
- 너비: 1440px
- 회사 정보, 고객센터, 이용약관
- 배경: $color-bg-section

---

## 4. 액션 플랜

### Phase 1: 디자인 토큰 통합 (우선순위 P1)
1. designs/shared-tokens.pen 파일 생성
2. 위 Section 2의 모든 토큰을 Pencil 변수로 등록
3. 각 도메인 -components.pen 파일에서 변수 참조로 전환
4. Mypage 하드코딩 → 변수 치환 (replace_all_matching_properties 활용)

### Phase 2: 폰트 통일 (우선순위 P1)
1. 모든 .pen 파일에서 fontFamily를 "Noto Sans KR"로 통일
2. replace_all_matching_properties로 일괄 치환 가능
3. 파일별 순차 작업 (Pencil 제약)

### Phase 3: 공유 컴포넌트 생성 (우선순위 P2)
1. designs/shared-components.pen 생성
2. CMP-Header, CMP-Breadcrumb, CMP-Footer 컴포넌트 제작
3. 각 도메인 화면 파일에서 공유 컴포넌트 인스턴스로 교체

### Phase 4: 컴포넌트 규격 통일 (우선순위 P2)
1. 버튼 높이 통일: 48/40/32px 스케일
2. Corner radius 통일: 2/4/6/8/12px 스케일
3. 인풋 높이 통일: 44px (일반), 50px (옵션)

### Phase 5: 네이밍 통일 (우선순위 P3)
1. Mypage: kebab-case → CMP-PascalCase
2. Order: PascalCase (접두사 없음) → CMP-PascalCase
3. 변수명: $xxx → $color-xxx 통일

### Phase 6: 검증 및 문서화 (우선순위 P3)
1. 각 파일 스크린샷으로 시각 검증
2. component-map.json 업데이트
3. 디자인 시스템 플러그인 반영

---

## 5. 실행 권장 순서

```
Phase 1 + 2 (토큰+폰트) → Phase 3 (공유 컴포넌트) → Phase 4 (규격) → Phase 5 (네이밍) → Phase 6 (검증)
```

**주의사항**:
- 모든 .pen 작업은 순차적으로 1파일씩 진행 (Pencil 제약)
- 각 파일 수정 후 반드시 Pencil App에서 시각 확인
- product-print-order.pen이 화면 디자인의 SSOT이므로 먼저 통일 후 나머지 적용
- huni-design-system 플러그인과 동기화 필수

---

## 6. 참고: 방법론 리서치 요약

### 디자인 시스템 감사 방법론
| 방법론 | 출처 | 핵심 |
|--------|------|------|
| Interface Inventory | Brad Frost | 모든 UI 요소 캡처 → 중복/편차 식별 |
| Design Token Audit | W3C Design Tokens Spec | 시각적 속성을 토큰으로 추출 → 자동 비교 |
| Component Audit | Nathan Curtis | 컴포넌트 인스턴스 목록 → 속성 비교 매트릭스 |
| Visual Regression | Chromatic/Percy | 스크린샷 diff로 시각적 변경 감지 |

### 한국 기업 사례
| 회사 | 시스템 | 일관성 관리 방법 |
|------|--------|----------------|
| Toss | TDS | Figma Token Studio + 코드 동기화 |
| Kakao | Kasa | 크로스플랫폼 디자인 토큰 |
| Naver | Verde | 서비스 간 공유 컴포넌트 라이브러리 |
| 쿠팡 | Rocket Design | Figma Plugin으로 토큰 검증 자동화 |

### 글로벌 기업 사례 (리서치 에이전트 보완)
| 회사 | 시스템 | 핵심 전략 |
|------|--------|----------|
| Shopify | Polaris | 3계층 토큰 + 모노레포, v9→v11 점진적 토큰 정제 |
| Atlassian | ADS | 20개 제품 35개 컴포넌트, 토큰 수준 WCAG AA 강제 |
| Ant Design | v5 | Seed→Map→Alias 3계층, ConfigProvider 런타임 테마 전환 |
| Chakra UI | v2+ | strictTokens 컴파일 타임 강제, 미정의 토큰 사용 시 TypeScript 오류 |

### W3C Design Tokens 표준 (2025.10 안정 버전)
- Adobe, Google, Microsoft, Figma 등 20개+ 기업 참여
- 파일 확장자: `.tokens` 또는 `.tokens.json`
- 모든 속성에 `$` 접두사 (`$value`, `$type`, `$description`)
- Token Resolvers: 멀티 브랜드/테마 조합 관리
- 후니프린팅 적용: Pencil 변수 → W3C 토큰 형식으로 향후 전환 가능

### 3계층 디자인 토큰 아키텍처 (권장)
| 계층 | 역할 | 예시 |
|------|------|------|
| **Base (Primitive)** | 원시 디자인 값 | `$color-blue-500: #5538B6` |
| **Semantic** | 의도 기반 매핑 | `$color-primary: $color-blue-500` |
| **Component** | 컴포넌트별 구현 | `$btn-bg: $color-primary` |

### 도구 추천
| 도구 | 용도 | .pen 적용 가능성 |
|------|------|----------------|
| Style Dictionary | 디자인 토큰 관리/변환, W3C DTCG 지원 | 높음 (JSON 기반) |
| Pencil Variables | .pen 내 변수 시스템 | 직접 사용 가능 |
| search_all_unique_properties | 속성 감사 자동화 | 이미 사용 중 |
| replace_all_matching_properties | 일괄 속성 치환 | 이미 사용 가능 |
| Chromatic + Percy | 시각적 회귀 테스트 (코드 전환 후) | 코드 전환 후 적용 |
| ESLint + Stylelint | 토큰 강제 린팅 | 코드 전환 후 적용 |
| Figma Design Lint | Figma 내 스타일 일관성 검사 | 현재 Figma에서 활용 가능 |

### 참고 출처
- W3C Design Tokens Format Module 2025.10 (designtokens.org)
- Shopify Polaris Tokens (github.com/Shopify/polaris-tokens)
- Atlassian Design Tokens (atlassian.design/components/tokens)
- Ant Design Customize Theme (ant.design/docs/react/customize-theme)
- Chakra UI Design Tokens (chakra-ui.com/docs/theming/tokens)
- Storybook v9 Visual Testing (storybook.js.org/docs/writing-tests)
- Design Lint Figma Plugin (github.com/destefanis/design-lint)

---

*본 기준서는 지니님의 검토와 승인 후 적용됩니다.*
*디자인 토큰 기반 일관성 관리는 향후 코드 전환 시에도 동일 토큰 구조를 재사용할 수 있어 개발 효율성을 높입니다.*
