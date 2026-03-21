## SPEC-PRODUCT-001 Progress

- Started: 2026-03-20
- Scope: 6개 모듈, 82개 EARS 요구사항, 30개 수용 기준
- Development Mode: DDD (ANALYZE-PRESERVE-IMPROVE)
- KD-PRD-01~KD-PRD-08: All confirmed

### Phase 2: 기능분석 (완료)
- spec.md: 50개 EARS 요구사항 (5모듈, 14기능) -> **v1.1.0: 82개로 확장 (6모듈)**
- requirements-analysis.md: 8개 KD 상세 분석
- architecture-design.md: Tier 2 CUSTOM 아키텍처, DB 설계, API 설계
- acceptance.md: 20개 수용 기준 + 3개 비기능 기준 -> **v1.1.0: 30개 수용 기준으로 확장**
- plan.md: 14개 TAG 구현 계획 (4 Phase) -> **v1.1.0: 26개 TAG (5 Phase)로 확장**

### Phase 3: 화면설계 (완료 - 2026-03-20)
- screens.md: 32개 화면 인벤토리 -> **v1.1.0: 48개로 확장 (쇼핑몰 주문페이지 16개 추가)**
- api-mapping.md: 45+ API 매핑 (BFF 35개 + shopby 6개) -> **v1.1.0: 쇼핑몰 BFF API 5개 추가**
- interactions.md: 3개 상태머신, 10개 조건부 규칙 -> **v1.1.0: 33개 종속 규칙 상세, 가격 갱신 매트릭스, Collapsible/슬라이더 인터랙션 추가**

### Phase 3.5: 주문페이지 심층 분석 (완료 - 2026-03-20)
- product-order-pages.md: 11개 상품별 주문페이지 완전 분석
  - 인쇄 공정 관점 옵션 매핑 (공정 순서 검증 완료)
  - 가격 계산 로직 4유형 분류 (매트릭스형/구간할인형/면적형/고정가형)
  - 파일 업로드 5패턴 분류 (A:PDF+에디터+장바구니, B:에디터만, C:PDF만, D:장바구니만, E:PDF+에디터+할인)
  - 공통/차이 매트릭스 (19개 옵션 그룹 x 11개 상품)
  - 데이터 모델 관점 Excel 연결 포인트 정의
- option-dependency-map.md: 11개 상품별 옵션 종속성 상세 매핑
  - 4가지 종속 유형 정의 (FILTER/SHOW_HIDE/RESET/PRICE_AFFECT)
  - XL/L 상품 종속 체인 Mermaid 다이어그램 (4개)
  - 조건부 표시 규칙 21개 + FILTER 규칙 7개 + RESET 규칙 5개
  - 가격 영향 매트릭스 (17개 옵션 x 11개 상품)
  - 옵션 엔진 구현 설계 가이드 (시퀀스 다이어그램, JSON 구조, 캐시 전략)

### Phase 3.6: SPEC 개선/보강 (완료 - 2026-03-20)
- spec.md v1.1.0: 모듈 6(쇼핑몰 주문페이지 옵션 엔진) 30개 요구사항 추가
  - 11개 상품 카테고리 정의 (REQ-PRD-051~053)
  - 종속옵션 33개 규칙 EARS화 (REQ-PRD-054~056)
  - 가격 계산 4유형 (REQ-PRD-057~064)
  - 별색인쇄/박형압/후가공 UI (REQ-PRD-065~067)
  - 크기 직접입력 (REQ-PRD-068~070)
  - 파일 업로드 5패턴 (REQ-PRD-071~072)
  - 상품별 특화 옵션 (REQ-PRD-073~077)
  - 가격 Summary UI (REQ-PRD-078~080)
  - 쇼핑몰 성능 요구사항 (REQ-PRD-081~082)
- screens.md: 쇼핑몰 주문페이지 11개 + 공통 UI 5개 = 16개 화면 추가
- interactions.md: 종속 규칙 33개 통합 시퀀스, 가격 갱신 매트릭스, Collapsible/슬라이더 인터랙션
- architecture-design.md: 옵션 엔진 데이터 모델 ERD, 가격 계산 4유형 아키텍처, Redis 캐시 전략, BFF 시퀀스 다이어그램
- api-mapping.md: 쇼핑몰 BFF API 5개 엔드포인트 추가
- acceptance.md: 10개 수용 기준 추가 (AC-PRD-021~030), Definition of Done 확장
- plan.md: Phase 5 (TAG-PRD-015~026) 12개 태스크 추가

### Phase 4: Pencil .pen 디자인 (진행중 - 2026-03-20)
- product-components.pen: 43개 공통 Reusable 컴포넌트 등록 완료
  - OVERVIEW 10종 + 상품별 고유 7종 + Component 페이지 UI 11종 + 레이아웃 5종 + 기타
- product-print-order.pen: SCR-PRD-033 디지털인쇄 주문페이지 (XL) 완료 ★ DS SSOT 기준
  - 기본 상태 (16개 옵션 그룹, 가격 Summary, CTA)
  - 후가공 펼침 상태 프레임
  - 박/형압 가공 펼침 상태 프레임 (칼라칩 세로 컬럼 + 뱃지)
  - 모든 후속 .pen 디자인의 기준 템플릿으로 확정
- product-book-order.pen: SCR-PRD-034 책자/제본 주문페이지 (XL) 완료
  - 기본 상태 (16개 옵션 그룹, 박/형압 펼침 포함)
  - Figma REST API 텍스트 검증 완료 (제본/좌철/상철/링컬러/링선택/면지 등 정확 반영)
  - print-order 기준 DS 일관성 보정 완료 (2026-03-20): 타이틀/헤더/브레드크럼/카운터/가격요약/구분선 통일
- product-sticker-order.pen: SCR-PRD-042 스티커 주문페이지 (L) 완료
  - 8개 옵션 그룹 (사이즈 3버튼, 종이, 인쇄 단면, 별색인쇄, 커팅 4버튼, 조각수, 제작수량, 후가공)
  - Pattern A (PDF + 에디터 + 장바구니), 합계 77,000
  - print-order 기준 DS 일관성 보정 완료 (2026-03-20): 카운터 width/fill, 합계 fontWeight
- product-calendar-order.pen: SCR-PRD-037 캘린더 주문페이지 (L) 완료
  - 11개 옵션 그룹 (사이즈, 종이, 인쇄, 장수, 삼각대컬러 ColorChip, 캘린더가공, 링컬러 ColorChip, 제작수량, 개별포장, 캘린더봉투, 수량)
  - Pattern C (PDF만), 합계 82,500
  - print-order 기준 DS 일관성 보정 완료 (2026-03-20): 타이틀/헤더/브레드크럼/카운터/가격요약/구분선 통일
- product-accessories-order.pen: SCR-PRD-048 액세서리 주문페이지 (S) 완료
  - 2개 옵션 그룹 (사이즈 2버튼, 수량)
  - Pattern D (장바구니만), 합계 5,500
  - print-order 복사 후 최소 옵션으로 정리
- product-photobook-order.pen: SCR-PRD-044 포토북 주문페이지 (S) 완료
  - 3개 옵션 그룹 (사이즈 4버튼, 커버타입 3버튼, 제작수량)
  - Pattern B (에디터만), 합계 15,000
  - print-order 복사 후 최소 옵션 + 커버타입 추가
- product-design-calendar-order.pen: SCR-PRD-045 디자인캘린더 주문페이지 (S) 완료
  - 5개 옵션 그룹 (사이즈 2버튼, 용지 Select, 레디자 Select, 제작수량, 캘린더봉투 Select)
  - Pattern B (에디터만), 합계 12,000
  - print-order 복사 후 캘린더 간소화 버전으로 수정
- product-stationery-order.pen: SCR-PRD-035 문구 주문페이지 (M) 완료
  - 8개 옵션 그룹, 구간할인 Slider, Pattern A
- product-goods-order.pen: SCR-PRD-043 굿즈/파우치 주문페이지 (M) 완료
  - 7개 옵션 그룹, 대형 ColorChip 10종+, 구간할인, Pattern E
- product-acrylic-order.pen: SCR-PRD-040 아크릴 주문페이지 (M) 완료
  - 9개 옵션 그룹, 크기직접입력, 면적+구간할인, Pattern B
- product-sign-order.pen: SCR-PRD-041 실사/사인 주문페이지 (M) 완료
  - 5개 옵션 그룹, 직접입력 200~1300x200~8000mm, 면적형, Pattern C
- **쇼핑몰 주문페이지 11/11 전체 완료** ✅

### Phase 4.5: 관리자 화면 와이어프레임 (v1.0 완료 → v2.0 재작성 완료 - 2026-03-21)
- wireframes/master-cascade-module.md: Module 1+2 (13화면, 1,454줄 → **1,860줄**)
  - v2.0: 사이즈에 재단/작업사이즈, 블리드, 판걸이수, MES 연동 10개 필드 추가
  - v2.0: 용지에 15개 카테고리 매핑 그리드, 연당가/절별가격 추가
  - v2.0: 가격관리 8종→14종 가격 유형 카드 그리드
  - v2.0: 용지 팝업에 15개 카테고리 매핑 필터, ★조건부 옵션 뱃지
- wireframes/price-module.md: Module 3 (6화면, 946줄 → **1,047줄**)
  - v2.0: 4종 가격 유형별 팝업 전면 재설계 (매트릭스/고정단가/면적/수량할인)
  - v2.0: 23단계 수량구간, 기준판형 토글, 팝업 1200px 확대
  - v2.0: 후가공/제본 탭 기반 매트릭스 편집기
  - v2.0: 시뮬레이터 견적방식 3종 비교 + 수량별 그래프
- wireframes/registration-module.md: Module 4+5 (13화면, 1,229줄 → **1,855줄**)
  - v2.0: MES 연동 섹션, 견적방식 선택(자동/고정/수량할인) 추가
  - v2.0: 복합 상품 이중 구조 (내지+표지+제본 3중 색상 코딩)
  - v2.0: ★조건부 옵션 규칙 편집기 (FILTER/SHOW_HIDE/RESET/PRICE_AFFECT 4종)
  - v2.0: 수량 제약 + 판수 연동, 견적방식별 3종 UI 분기
- **관리자 32개 화면 와이어프레임 v2.0 전체 완료** ✅ (총 4,762줄, v1.0 대비 +31%)

### Phase 4.6: 관리자 .pen 디자인 (진행중 - 2026-03-20)
- admin-product-components.pen: 20개 관리자 Reusable 컴포넌트 등록 완료
  - AdminSidebar, AdminHeader, FilterBar, TabBar, ActionBar
  - DataTable (HeaderRow, DataRow), Pagination, FormField, FormFieldRequired
  - Modal (600px), ModalLarge (800px), ConfirmDialog
  - OptionChain (4단계 시각화)
  - Badge 3종 (Active/Inactive/Draft), Toast 3종 (Success/Error/Warning)
  - Toggle (On/Off)
  - 16개 디자인 토큰 ($color-primary #5538B6 등)
- admin-product-master.pen: Module 1+2 **전체 13화면 완료** ✅
  - SCR-PRD-001 사이즈 관리 페이지 (AdminLayout + DataTable + Filter + Pagination)
  - SCR-PRD-002 사이즈 등록/수정 모달 (6개 폼 필드 + 사이즈 미리보기)
  - SCR-PRD-003 소재 관리 페이지 (사이즈 매핑 포함)
  - SCR-PRD-004 소재 등록/수정 모달 (소재명 + 사이즈 다중선택)
  - SCR-PRD-005 용지 관리 페이지 (평량/코팅 필터)
  - SCR-PRD-006 용지 등록/수정 모달 (용지 + 평량 + 코팅 + 사이즈 매핑)
  - SCR-PRD-007 가격 관리 마스터 (8종 가격코드 테이블)
  - SCR-PRD-008 엑셀 일괄 업로드 모달 (데이터 유형 선택 + 파일 업로드)
  - SCR-PRD-009 사이즈 선택 팝업 (다중선택 체크박스 + 검색 + 선택 Badge)
  - SCR-PRD-010 소재 선택 팝업 (사이즈 기반 필터링 + 코팅 표시)
  - SCR-PRD-011 용지 선택 팝업 (평량 표시 + 다중선택)
  - SCR-PRD-012 옵션 체인 상태 표시 (4단계 시각화: 상품유형→사이즈→소재/용지→후가공)
  - SCR-PRD-013 상위 옵션 변경 확인 다이얼로그 (경고 + 초기화 안내)
- admin-product-price.pen: Module 3 화면 디자인 미시작
- admin-product-registration.pen: Module 4+5 화면 디자인 미시작

### Phase 4.7: 엑셀 기반 GAP 분석 (완료 - 2026-03-20)
- excel-data-analysis.md: 920줄 상세 분석 문서 (원본 엑셀 3개 전체 파싱)
  - 상품마스터 11개 시트, 244개 상품, 공통 7필드 + 상품별 고유 필드 추출
  - 가격표 14개 시트, 23단계 수량구간 x 11종 인쇄방식 매트릭스 구조
  - 출력소재관리 120종 용지, 7대분류, 15개 상품별 적용 매핑
- **핵심 GAP 8개 항목 확인**:
  1. 사이즈 마스터: 판수/블리드/작업사이즈/출력용지규격/MES 연동 필드 누락
  2. 용지 마스터: 전지규격/연당가/절별가격/상품별 적용 매핑 누락
  3. 가격 마스터: 다중 매트릭스(3~4차원), 14종 가격 유형 미분류
  4. 비규격 사이즈: 실사/아크릴 면적 기반 가격 미반영
  5. 견적 방식 다양성: 자동견적/고정단가/수량할인 3방식 혼재 미분류
  6. MES 연동 필드: ITEM_CD/파일명약어/폴더/출력파일 누락
  7. 조건부 옵션: ★ 마크 제약조건 미반영
  8. 복합 상품: 책자(내지+표지), 포토북(편집기) 이중 구조 미반영
- **다음 단계**: ~~screens.md 필드 보정~~ ✅ → ~~wireframes 재작성~~ ✅ → .pen 재디자인 → DB 스키마 재검토

### Phase 4.8: 엑셀 기반 관리자 화면 재설계 (완료 - 2026-03-21)
- screens.md v2.0: GAP 8개 항목 전체 반영, 관리자 화면 필드 대폭 보정 ✅
  - 사이즈 마스터: +10개 필드 (재단/작업사이즈, 블리드, 판걸이수, MES 등)
  - 용지 마스터: +10개 필드 (전지규격, 연당가, 절별가격, 15개 카테고리 매핑)
  - 가격 관리: 8종→14종 가격 유형 확장
  - 상품등록: MES 연동, 견적방식 3종, 복합상품 이중구조, ★조건부 규칙
- wireframes v2.0: 3개 모듈 전체 재작성 완료 ✅ (3,629줄→4,762줄)
- admin .pen 재디자인: **전체 완료** ✅ (Task 3, 2026-03-21)
  - admin-product-components.pen: 22개→32개 Reusable 컴포넌트 (신규 10개 추가)
    - Module 3용: PriceMatrixGrid, BulkEditToolbar, ModalXL(1200px), PriceSimulatorPanel
    - Module 4+5용: StickyTabBar, FormSection, OptionRuleEditor, ConditionalBadge, EstimateTypeCard, ColorCodedSection
    - 디자인 토큰 5개 추가 (color-bg-accent, color-bg-changed, color-blue, color-green, color-orange)
  - admin-product-master.pen v2.0: Module 1+2 **13화면 중 11화면 업데이트** ✅
    - SCR-PRD-001 사이즈 관리: +10컬럼(재단/작업사이즈, 판걸이수, ITEM_CD 등), 1440px 확장
    - SCR-PRD-002 사이즈 등록: 6필드→16필드 전면 재설계 (규격/인쇄/MES 섹션)
    - SCR-PRD-003 소재 관리: 대분류/중분류 컬럼 추가
    - SCR-PRD-005 용지 관리: +10컬럼(전지규격, 연당가, 카테고리 매핑), 1440px 확장
    - SCR-PRD-006 용지 등록: 6탭 구조 전면 재설계 (기본/규격/원가/MES/상품매핑/구매)
    - SCR-PRD-007 가격 마스터: 8종 테이블→14종 카드 그리드(4열) + 변경이력
    - SCR-PRD-009~011 팝업: 판걸이수/기준판형/대분류/카테고리 정보 추가
  - admin-product-price.pen: Module 3 **6화면 신규 완료** ✅
    - SCR-PRD-014 매트릭스형 가격관리 팝업 (1200x800, 23단계 수량 x 11종 인쇄방식)
    - SCR-PRD-015 고정단가형 가격관리 팝업 (800x700)
    - SCR-PRD-016 면적형 가격관리 팝업 (1200x800, 2D 매트릭스)
    - SCR-PRD-017 수량할인형 가격관리 팝업 (900x850, 할인율 차트)
    - SCR-PRD-018 후가공/제본 가격 설정 (1280x900, AdminLayout)
    - SCR-PRD-019 엑셀 가격 일괄 업로드 (600x560, 3단계 프로세스)
  - admin-product-registration.pen: Module 4+5 **13화면 신규 완료** ✅
    - Module 4 (8화면): SCR-PRD-020 상품목록, 021 기본정보탭(MES+견적방식3종), 022 옵션설정탭(★조건부규칙+복합상품), 023 가격관리탭, 024 미리보기탭, 025 복제다이얼로그, 026 자동저장토스트, 027 저장결과토스트
    - Module 5 (5화면): SCR-PRD-028 굿즈카테고리, 029 굿즈등록, 030 수작등록, 031 포장재등록, 032 디자인등록
- **관리자 32개 화면 .pen 디자인 v2.0 전체 완료** ✅

### Phase 5: 구현 (대기)
- 미시작
- 의존성: DB 스키마 설계 확정 후 시작 가능

### 전문가 상담 권장사항
- expert-backend: NestJS BFF 아키텍처, TypeORM 엔티티 설계, 가격 계산 엔진 4유형 구현, Redis 캐시 전략
- expert-frontend: React 동적 옵션 렌더러, Collapsible UI, 구간할인 슬라이더, 가격 Summary 컴포넌트, ColorChip/ImageButton
