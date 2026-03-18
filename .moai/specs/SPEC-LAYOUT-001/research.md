# SPEC-LAYOUT-001 Research: 반응형 레이아웃 시스템

## 현황 감사 결과

### 1. 반응형 인프라 현황

| 항목 | 상태 | 비고 |
|------|------|------|
| Tailwind CSS | ✅ 설치됨 | 기본 breakpoint 사용 (sm/md/lg/xl) |
| useMediaQuery hook | ✅ 존재 | CSS 미디어 쿼리 기반, 실시간 반응 |
| useResponsive hook | ✅ 존재 | isMobile/isTablet/isDesktop 제공 |
| LayoutProvider | ✅ 존재 | useResponsive 통합됨 |
| Huni 디자인 토큰 | ⚠️ 부분적 | 색상/간격/타이포 있으나 반응형 토큰 없음 |
| react-device-detect | ❌ 레거시 | 15개 파일에서 여전히 사용 중 |

### 2. 페이지별 반응형 지원 현황

| 페이지 | 반응형 클래스 수 | 상태 | 우선순위 |
|--------|----------------|------|----------|
| Main (MainContents) | 11 | ⚠️ 부분적 | - |
| Header | 다수 | ✅ 양호 | - |
| ProductDetail | 15 (6파일) | ⚠️ 부분적 | 높음 |
| MyPage | 18 (5파일) | ⚠️ 부분적 | 중간 |
| **Cart** | **0** | **❌ 미지원** | **최우선** |
| **OrderSheet** | **0** | **❌ 미지원** | **최우선** |
| **Claim** | **0** | **❌ 미지원** | 높음 |
| **SignUp** | **0** | **❌ 미지원** | 높음 |
| **FindId/Password** | **0** | **❌ 미지원** | 중간 |
| **MemberModification** | **0** | **❌ 미지원** | 중간 |
| **GuestOrder** | **0** | **❌ 미지원** | 높음 |

### 3. 컨테이너 너비 불일치

```
max-w-7xl (1280px) → MainContents, Header
max-w-[1200px]     → Reviews, ExperienceGroup
max-w-4xl (896px)  → CustomerCenter, OrderSheet
max-w-3xl (768px)  → admin/ProductEdit
max-w-2xl (672px)  → admin/VendorCreate (+ minWidth: 800 하드코딩)
없음               → Cart, Claim, SignUp, FindId, 대다수 페이지
```

### 4. react-device-detect 사용 현황 (15+ 파일)

핵심 페이지: Cart.jsx, OrderSheet.jsx, ProductDetail.jsx, OrderConfirm.jsx
유틸리티: domain.js, api.js, common.js
컴포넌트: Meta.jsx, AppCardAuthenticate (3파일), Netfunnel.jsx

문제: UA 문자열 기반 정적 감지 → 데스크톱 브라우저 리사이즈에 무반응

### 5. 디자인 시스템 토큰 Gap

#### 존재하는 토큰:
- colors.css: 브랜드/시맨틱 색상 완비
- spacing.css: 4px 기반 간격 스케일 (2px~64px)
- typography.css: 폰트 사이즈 스케일 (11px~26px)
- radius.css, elevation.css, motion.css

#### 부재하는 토큰:
- **breakpoint 토큰** (반응형 경계값)
- **container 토큰** (컨테이너 최대 너비, 패딩)
- **responsive typography** (뷰포트별 폰트 크기)
- **responsive spacing** (뷰포트별 간격 조정)
- **grid 토큰** (컬럼 수, 거터)

### 6. 레이아웃 프리미티브 부재

현재 없는 컴포넌트:
- `PageShell` - 통합 페이지 컨테이너
- `ContentArea` - 콘텐츠 영역 래퍼
- `ResponsiveGrid` - 반응형 그리드
- `FormLayout` - 반응형 폼 레이아웃
- `SplitView` - 데스크톱 2단/모바일 스택 레이아웃

## 디자인 시스템 벤치마크

### Toss Design System
- Mobile-first 접근
- 4px 간격 체계 (Huni와 동일)
- 반응형 타이포그래피 스케일
- 컴포넌트 단위 반응형 (페이지 단위 아님)

### 당근 Seed Design System
- 적응형 레이아웃 (Adaptive)
- 컴포넌트 내부에서 반응형 처리
- 일관된 컨테이너 시스템

### Material Design 3
- 3단계 레이아웃: Compact / Medium / Expanded
- Breakpoint: 600px / 840px / 1200px
- 12컬럼 그리드 시스템
- 고정 마진 + 유동 거터

### 권장 표준 (종합)

| 항목 | 권장 값 | 근거 |
|------|---------|------|
| Breakpoints | sm:640 / md:768 / lg:1024 / xl:1280 | Tailwind 기본값 유지 |
| 주 전환점 | lg:1024px | 모바일↔데스크톱 경계 |
| 컨테이너 Max | 1280px (max-w-7xl) | 현재 Main 페이지 패턴 |
| 모바일 패딩 | 16px (px-4) | 4px 배수, 터치 영역 확보 |
| 태블릿 패딩 | 24px (px-6) | 정보 밀도 증가 |
| 데스크톱 패딩 | 32px (px-8) | 넓은 여백 확보 |
