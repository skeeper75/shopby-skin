/**
 * 쇼핑바이 관리자 기능 매트릭스 생성기
 *
 * DOM 분석 결과와 shopby 문서를 교차 참조하여
 * 각 기능을 NATIVE/SKIN/CUSTOM/SKIP으로 분류합니다.
 *
 * 사용법:
 *   node scripts/admin-analyzer/feature-matrix.js
 *
 * @MX:ANCHOR 크롤링 없이도 독립적으로 실행 가능한 분석 도구
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 경로 상수
const ANALYSIS_PAGES_BASE = path.join(__dirname, '../../ref/shopby/admin-analysis/pages');
const MENU_MAP_PATH = path.join(__dirname, '../../ref/shopby/admin-analysis/menu-map.json');
const ENTERPRISE_DOCS_BASE = path.join(__dirname, '../../ref/shopby/shopby_enterprise_docs');
const OUTPUT_MATRIX = path.join(__dirname, '../../ref/shopby/admin-analysis/feature-matrix.md');
const OUTPUT_RECOMMENDATIONS = path.join(__dirname, '../../ref/shopby/admin-analysis/recommendations.md');

/**
 * 분류 상수
 * - NATIVE:  shopby 관리자 UI 그대로 사용 가능 (개발 불필요)
 * - SKIN:    CSS/레이아웃 커스터마이징만 필요 (경량 개발)
 * - CUSTOM:  별도 UI/API 개발 필요 (중/고 개발)
 * - SKIP:    인쇄업 특성상 불필요한 기능
 */
const CLASSIFICATION = {
  NATIVE: 'NATIVE',
  SKIN: 'SKIN',
  CUSTOM: 'CUSTOM',
  SKIP: 'SKIP',
};

/**
 * 인쇄업 특성에 기반한 분류 규칙 정의
 *
 * @MX:NOTE 이 규칙들은 인쇄업(디지털인쇄, 소책자, 스티커, 포토북 등)의
 * 업무 흐름과 shopby 기본 기능의 호환성을 기반으로 작성됩니다.
 */
const CLASSIFICATION_RULES = {
  // SKIP 대상: 인쇄업과 무관한 기능
  skipKeywords: [
    '모바일앱',
    '앱푸시',
    'push notification',
    '네이버페이',
    '카카오페이',
    '토스페이',
    '간편결제',
    '소셜로그인',
    '라이브방송',
    '라이브커머스',
    '가상화폐',
    '포인트몰',
    '플래시세일',
    '선물하기',
    '친구추천',
    'SNS공유',
    '인플루언서',
    '제휴마케팅',
    '디지털콘텐츠',
    '전자책',
    'VOD',
    '음원',
    '구독서비스',
    '렌탈',
    '중고거래',
    '경매',
  ],

  // NATIVE 대상: 그대로 사용 가능한 기본 기능
  nativeKeywords: [
    '회원관리',
    '회원목록',
    '주문관리',
    '주문목록',
    '주문상세',
    '배송관리',
    '배송현황',
    '취소/반품',
    '클레임',
    '정산',
    '세금계산서',
    '공지사항',
    '1:1문의',
    '상품문의',
    '약관관리',
    '접근제한',
    '관리자계정',
    '시스템설정',
    '알림설정',
    '이메일설정',
  ],

  // SKIN 대상: CSS 커스터마이징으로 해결 가능
  skinKeywords: [
    '디자인설정',
    '테마',
    '레이아웃',
    '배너관리',
    '팝업관리',
    '메인화면',
    '카테고리디자인',
    '브랜드페이지',
    '이벤트페이지',
    '컨텐츠관리',
    'SEO',
    '메타태그',
  ],

  // CUSTOM 대상: 인쇄업 특화 별도 개발 필요
  customKeywords: [
    '인쇄옵션',
    '제작옵션',
    '파일업로드',
    '디자인작업',
    '교정',
    '색상프로필',
    '재단선',
    '출력사양',
    '지종선택',
    '인쇄방식',
    '제본방식',
    '코팅',
    '후가공',
    '납기일',
    '생산현황',
    '작업현황',
    '인쇄소',
    '협력업체',
  ],
};

/**
 * 인쇄업 관련 SPEC-SKIN-005~008 구현 현황
 * overlap/gap 분석에 사용됩니다.
 */
const SPEC_IMPLEMENTATIONS = {
  'SPEC-SKIN-005': {
    description: '관리자 디자인시스템 마이그레이션 및 API 서비스 레이어',
    features: ['디자인시스템', 'API서비스레이어', '관리자UI컴포넌트'],
  },
  'SPEC-SKIN-006': {
    description: '관리자 상품/주문 관리',
    features: ['상품관리', '주문관리', '주문상태변경'],
  },
  'SPEC-SKIN-007': {
    description: '관리자 회원/게시판 관리',
    features: ['회원관리', '게시판관리', '1:1문의'],
  },
  'SPEC-SKIN-008': {
    description: '관리자 거래처/원장/통계',
    features: ['거래처관리', '원장관리', '매출통계'],
  },
};

/**
 * 분석 결과 JSON 파일들을 재귀적으로 로드합니다.
 * @param {string} baseDir
 * @returns {Array<Object>}
 */
function loadAnalysisResults(baseDir) {
  const results = [];

  if (!fs.existsSync(baseDir)) {
    console.warn(`[경고] 분석 결과 디렉토리가 없습니다: ${baseDir}`);
    console.warn('  crawl + analyze 후 다시 실행하거나, 문서 기반 분석을 진행합니다.');
    return results;
  }

  function readDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        readDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        try {
          const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          results.push({ ...data, _file: fullPath });
        } catch (error) {
          console.warn(`[경고] JSON 파싱 실패: ${fullPath}`);
        }
      }
    }
  }

  readDir(baseDir);
  return results;
}

/**
 * shopby_enterprise_docs에서 문서 내용을 로드합니다.
 * @returns {Object} 카테고리별 문서 요약
 */
function loadEnterpriseDocs() {
  const docs = {};

  if (!fs.existsSync(ENTERPRISE_DOCS_BASE)) {
    console.warn('[경고] shopby_enterprise_docs 디렉토리가 없습니다.');
    return docs;
  }

  // 최상위 mdx 파일들 로드
  const entries = fs.readdirSync(ENTERPRISE_DOCS_BASE, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      const category = entry.name.replace('.mdx', '');
      try {
        const content = fs.readFileSync(path.join(ENTERPRISE_DOCS_BASE, entry.name), 'utf-8');
        // 제목과 첫 200자 요약 저장
        const lines = content.split('\n').filter((l) => l.trim());
        docs[category] = {
          title: lines[0]?.replace(/^#+\s*/, '') || category,
          summary: content.slice(0, 500),
          hasDoc: true,
        };
      } catch (error) {
        docs[category] = { title: category, summary: '', hasDoc: false };
      }
    }
  }

  return docs;
}

/**
 * @MX:NOTE 분류 결정 로직 - 규칙 기반 + 컨텍스트 기반 혼합 방식
 *
 * 메뉴/기능 정보를 기반으로 NATIVE/SKIN/CUSTOM/SKIP 분류합니다.
 * @param {Object} featureInfo - { title, category, actionButtons, searchFields, tableHeaders }
 * @param {Object} docs - 관련 문서 정보
 * @returns {{ classification: string, rationale: string, priority: string }}
 */
function classifyFeature(featureInfo, docs) {
  const { title = '', category = '', actionButtons = [], tableHeaders = [], tabLabels = [] } = featureInfo;

  const searchText = [title, category, ...actionButtons.map((b) => b.text || b), ...(tabLabels || [])].join(' ').toLowerCase();

  // SKIP 판단
  for (const keyword of CLASSIFICATION_RULES.skipKeywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      return {
        classification: CLASSIFICATION.SKIP,
        rationale: `인쇄업 비관련 기능: "${keyword}" 키워드 포함`,
        priority: 'none',
      };
    }
  }

  // 인쇄업 특화 CUSTOM 판단
  for (const keyword of CLASSIFICATION_RULES.customKeywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      return {
        classification: CLASSIFICATION.CUSTOM,
        rationale: `인쇄업 특화 개발 필요: "${keyword}" 기능 포함`,
        priority: 'P1',
      };
    }
  }

  // 액션 버튼 기반 복잡도 분석
  const hasFileUpload = actionButtons.some((b) => (b.text || b).includes('업로드') || (b.text || b).includes('파일'));
  const hasComplexActions = actionButtons.length > 8;
  const hasExcelDownload = actionButtons.some(
    (b) => (b.text || b).includes('엑셀') || (b.text || b).includes('다운로드'),
  );

  if (hasFileUpload) {
    return {
      classification: CLASSIFICATION.CUSTOM,
      rationale: '파일 업로드 기능 포함 - 인쇄 파일 관리 커스터마이징 필요',
      priority: 'P1',
    };
  }

  // NATIVE 판단
  for (const keyword of CLASSIFICATION_RULES.nativeKeywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      return {
        classification: CLASSIFICATION.NATIVE,
        rationale: `shopby 기본 제공 기능: "${keyword}" - 별도 개발 불필요`,
        priority: 'none',
      };
    }
  }

  // SKIN 판단
  for (const keyword of CLASSIFICATION_RULES.skinKeywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      return {
        classification: CLASSIFICATION.SKIN,
        rationale: `CSS/레이아웃 커스터마이징: "${keyword}" - 경량 개발`,
        priority: 'P3',
      };
    }
  }

  // 테이블 컬럼 기반 분류 (복잡한 데이터 구조 = CUSTOM)
  if (tableHeaders.length > 12) {
    return {
      classification: CLASSIFICATION.CUSTOM,
      rationale: `복잡한 데이터 테이블 (${tableHeaders.length}개 컬럼) - 커스터마이징 검토 필요`,
      priority: 'P2',
    };
  }

  // 엑셀 다운로드가 있는 목록 페이지는 NATIVE로 판단
  if (hasExcelDownload && tableHeaders.length > 0) {
    return {
      classification: CLASSIFICATION.NATIVE,
      rationale: '엑셀 다운로드 포함 목록 페이지 - shopby 기본 기능 활용',
      priority: 'none',
    };
  }

  // 기본값: 단순 설정 페이지 → NATIVE
  if (actionButtons.length <= 3 && tableHeaders.length === 0) {
    return {
      classification: CLASSIFICATION.NATIVE,
      rationale: '단순 설정 페이지 - shopby 기본 제공',
      priority: 'none',
    };
  }

  // 나머지: SKIN (중간 복잡도)
  return {
    classification: CLASSIFICATION.SKIN,
    rationale: '브랜드 아이덴티티에 맞는 CSS 커스터마이징 필요',
    priority: 'P2',
  };
}

/**
 * 문서 기반으로 shopby 기본 기능 목록을 생성합니다 (DOM 분석 데이터 없을 때 사용)
 * @returns {Array<Object>}
 */
function generateDocBasedFeatures() {
  const features = [];

  // shopby 엔터프라이즈 문서 기반 기능 목록 (알려진 구조)
  const knownFeatures = [
    // 상품 관리
    { title: '상품 목록', category: '상품관리', group: 'product' },
    { title: '상품 등록', category: '상품관리', group: 'product', actionButtons: [{ text: '등록' }, { text: '파일업로드' }] },
    { title: '상품 대량 등록', category: '상품관리', group: 'product', actionButtons: [{ text: '업로드' }] },
    { title: '상품 이미지 관리', category: '상품관리', group: 'product', actionButtons: [{ text: '업로드' }] },
    { title: '카테고리 관리', category: '상품관리', group: 'product' },
    { title: '재고 관리', category: '상품관리', group: 'product' },
    { title: '상품 문의', category: '상품관리', group: 'product' },
    { title: '상품 후기', category: '상품관리', group: 'product' },

    // 주문 관리
    { title: '주문 목록', category: '주문관리', group: 'order', tableHeaders: ['주문번호', '주문일', '고객명', '상품명', '금액', '상태'], actionButtons: [{ text: '엑셀다운로드' }] },
    { title: '주문 상세', category: '주문관리', group: 'order' },
    { title: '배송 현황', category: '주문관리', group: 'order' },
    { title: '취소/반품 관리', category: '주문관리', group: 'order' },
    { title: '교환 관리', category: '주문관리', group: 'order' },

    // 회원 관리
    { title: '회원 목록', category: '회원관리', group: 'member', tableHeaders: ['회원번호', '이름', '이메일', '가입일', '등급'], actionButtons: [{ text: '엑셀다운로드' }] },
    { title: '회원 상세', category: '회원관리', group: 'member' },
    { title: '회원 등급 관리', category: '회원관리', group: 'member' },
    { title: '탈퇴 회원 관리', category: '회원관리', group: 'member' },
    { title: '블랙리스트 관리', category: '회원관리', group: 'member' },

    // 프로모션
    { title: '쿠폰 관리', category: '프로모션', group: 'promotion' },
    { title: '쿠폰 발급 내역', category: '프로모션', group: 'promotion' },
    { title: '적립금 관리', category: '프로모션', group: 'promotion' },
    { title: '이벤트 관리', category: '프로모션', group: 'promotion' },
    { title: '기획전 관리', category: '프로모션', group: 'promotion' },

    // 게시판/CS
    { title: '공지사항', category: '게시판관리', group: 'management' },
    { title: 'FAQ', category: '게시판관리', group: 'management' },
    { title: '1:1 문의', category: '게시판관리', group: 'management' },
    { title: '게시판 관리', category: '게시판관리', group: 'management' },

    // 정산
    { title: '정산 현황', category: '정산관리', group: 'partner' },
    { title: '세금계산서', category: '정산관리', group: 'partner' },
    { title: '거래명세서', category: '정산관리', group: 'partner' },

    // 통계
    { title: '매출 통계', category: '통계', group: 'management', tableHeaders: ['날짜', '매출', '주문수', '회원수'] },
    { title: '상품별 통계', category: '통계', group: 'management' },
    { title: '회원별 통계', category: '통계', group: 'management' },

    // 설정
    { title: '기본 설정', category: '설정', group: 'service' },
    { title: '결제 설정', category: '설정', group: 'service' },
    { title: '배송 설정', category: '설정', group: 'service' },
    { title: '약관 관리', category: '설정', group: 'service' },
    { title: '알림 설정', category: '설정', group: 'service' },
    { title: '관리자 계정', category: '설정', group: 'service' },

    // 디자인
    { title: '테마 설정', category: '디자인', group: 'appearance', tabLabels: ['PC', '모바일'] },
    { title: '배너 관리', category: '디자인', group: 'appearance' },
    { title: '팝업 관리', category: '디자인', group: 'appearance' },
    { title: '메인 화면 설정', category: '디자인', group: 'appearance' },
  ];

  return knownFeatures;
}

/**
 * SPEC-SKIN-005~008과의 overlap/gap을 분석합니다.
 * @param {Array<Object>} classifiedFeatures
 * @returns {Object} overlap/gap 분석 결과
 */
function analyzeSpecOverlap(classifiedFeatures) {
  const overlap = {};
  const gaps = [];

  for (const [specId, spec] of Object.entries(SPEC_IMPLEMENTATIONS)) {
    overlap[specId] = {
      description: spec.description,
      coveredFeatures: [],
      uncoveredFeatures: [...spec.features],
    };

    for (const feature of classifiedFeatures) {
      const featureText = (feature.title + ' ' + feature.category).toLowerCase();
      for (const specFeature of spec.features) {
        if (featureText.includes(specFeature.toLowerCase())) {
          if (!overlap[specId].coveredFeatures.includes(specFeature)) {
            overlap[specId].coveredFeatures.push(specFeature);
            overlap[specId].uncoveredFeatures = overlap[specId].uncoveredFeatures.filter((f) => f !== specFeature);
          }
        }
      }
    }
  }

  // CUSTOM 기능 중 SPEC에서 다루지 않는 것 = gap
  const customFeatures = classifiedFeatures.filter((f) => f.classification === CLASSIFICATION.CUSTOM);
  for (const feature of customFeatures) {
    const coveredBySpec = Object.values(SPEC_IMPLEMENTATIONS).some((spec) =>
      spec.features.some((sf) => feature.title.includes(sf) || feature.category.includes(sf)),
    );
    if (!coveredBySpec) {
      gaps.push({ title: feature.title, category: feature.category, rationale: feature.rationale });
    }
  }

  return { overlap, gaps };
}

/**
 * 마크다운 형식의 기능 매트릭스 보고서를 생성합니다.
 * @param {Array<Object>} classifiedFeatures
 * @param {Object} overlapAnalysis
 * @returns {string}
 */
function generateMatrixMarkdown(classifiedFeatures, overlapAnalysis) {
  const stats = {
    [CLASSIFICATION.NATIVE]: classifiedFeatures.filter((f) => f.classification === CLASSIFICATION.NATIVE).length,
    [CLASSIFICATION.SKIN]: classifiedFeatures.filter((f) => f.classification === CLASSIFICATION.SKIN).length,
    [CLASSIFICATION.CUSTOM]: classifiedFeatures.filter((f) => f.classification === CLASSIFICATION.CUSTOM).length,
    [CLASSIFICATION.SKIP]: classifiedFeatures.filter((f) => f.classification === CLASSIFICATION.SKIP).length,
  };

  const total = classifiedFeatures.length;
  const generatedAt = new Date().toISOString();

  let md = `# Shopby Admin 기능 매트릭스

> 생성일: ${generatedAt}
> 총 기능 수: ${total}개

## 분류 기준

| 분류 | 설명 | 개발 비용 |
|------|------|----------|
| **NATIVE** | shopby 관리자 UI 그대로 사용 가능 | 없음 |
| **SKIN** | CSS/레이아웃 커스터마이징만 필요 | 경량 |
| **CUSTOM** | 별도 UI/API 개발 필요 | 중~고 |
| **SKIP** | 인쇄업 특성상 불필요 | - |

## 요약

| 분류 | 수량 | 비율 |
|------|------|------|
| NATIVE | ${stats.NATIVE} | ${Math.round((stats.NATIVE / total) * 100)}% |
| SKIN | ${stats.SKIN} | ${Math.round((stats.SKIN / total) * 100)}% |
| CUSTOM | ${stats.CUSTOM} | ${Math.round((stats.CUSTOM / total) * 100)}% |
| SKIP | ${stats.SKIP} | ${Math.round((stats.SKIP / total) * 100)}% |
| **합계** | **${total}** | **100%** |

`;

  // 카테고리별 분류 상세
  const categories = [...new Set(classifiedFeatures.map((f) => f.category))];

  md += `## 카테고리별 상세 분류\n\n`;

  for (const category of categories) {
    const categoryFeatures = classifiedFeatures.filter((f) => f.category === category);

    md += `### ${category}\n\n`;
    md += `| 기능 | 분류 | 근거 |\n`;
    md += `|------|------|------|\n`;

    for (const feature of categoryFeatures) {
      const classEmoji = {
        NATIVE: 'NATIVE',
        SKIN: 'SKIN',
        CUSTOM: 'CUSTOM',
        SKIP: 'SKIP',
      }[feature.classification];

      md += `| ${feature.title} | **${classEmoji}** | ${feature.rationale} |\n`;
    }

    md += '\n';
  }

  // SPEC 중복/갭 분석
  md += `## SPEC-SKIN-005~008 중복/갭 분석\n\n`;

  for (const [specId, data] of Object.entries(overlapAnalysis.overlap)) {
    md += `### ${specId}\n`;
    md += `${data.description}\n\n`;

    if (data.coveredFeatures.length > 0) {
      md += `**커버된 기능:** ${data.coveredFeatures.join(', ')}\n\n`;
    }
    if (data.uncoveredFeatures.length > 0) {
      md += `**미커버 기능 (갭):** ${data.uncoveredFeatures.join(', ')}\n\n`;
    }
  }

  if (overlapAnalysis.gaps.length > 0) {
    md += `### SPEC 미포함 CUSTOM 기능 (신규 개발 필요)\n\n`;
    md += `| 기능 | 카테고리 | 비고 |\n`;
    md += `|------|----------|------|\n`;
    for (const gap of overlapAnalysis.gaps) {
      md += `| ${gap.title} | ${gap.category} | ${gap.rationale} |\n`;
    }
    md += '\n';
  }

  return md;
}

/**
 * 개발 권장사항 마크다운을 생성합니다.
 * @param {Array<Object>} classifiedFeatures
 * @returns {string}
 */
function generateRecommendationsMarkdown(classifiedFeatures) {
  const p1Features = classifiedFeatures.filter((f) => f.priority === 'P1');
  const p2Features = classifiedFeatures.filter((f) => f.priority === 'P2');
  const p3Features = classifiedFeatures.filter((f) => f.priority === 'P3');
  const nativeFeatures = classifiedFeatures.filter((f) => f.classification === CLASSIFICATION.NATIVE);
  const skipFeatures = classifiedFeatures.filter((f) => f.classification === CLASSIFICATION.SKIP);

  const generatedAt = new Date().toISOString();

  let md = `# Shopby Admin 개발 권장사항

> 생성일: ${generatedAt}

## 개발 로드맵

### P1 - 즉시 개발 필요 (${p1Features.length}개)

인쇄업 핵심 워크플로우에 필수적인 기능입니다.

| 기능 | 카테고리 | 근거 |
|------|----------|------|
`;

  for (const f of p1Features) {
    md += `| ${f.title} | ${f.category} | ${f.rationale} |\n`;
  }

  if (p1Features.length === 0) {
    md += `| (해당 없음) | - | - |\n`;
  }

  md += `
### P2 - 단계적 개발 (${p2Features.length}개)

브랜드 아이덴티티 및 운영 효율성 향상을 위한 기능입니다.

| 기능 | 카테고리 | 근거 |
|------|----------|------|
`;

  for (const f of p2Features) {
    md += `| ${f.title} | ${f.category} | ${f.rationale} |\n`;
  }

  if (p2Features.length === 0) {
    md += `| (해당 없음) | - | - |\n`;
  }

  md += `
### P3 - 선택적 개선 (${p3Features.length}개)

UX 향상을 위한 선택적 개선 사항입니다.

| 기능 | 카테고리 | 근거 |
|------|----------|------|
`;

  for (const f of p3Features) {
    md += `| ${f.title} | ${f.category} | ${f.rationale} |\n`;
  }

  if (p3Features.length === 0) {
    md += `| (해당 없음) | - | - |\n`;
  }

  md += `
## shopby 기본 활용 가능 기능 (NATIVE)

다음 기능들은 shopby 관리자 UI를 그대로 활용하여 개발 비용을 절감할 수 있습니다.

`;

  for (const f of nativeFeatures) {
    md += `- **${f.title}** (${f.category}): ${f.rationale}\n`;
  }

  md += `
## 제외 기능 (SKIP)

인쇄업 특성상 불필요한 기능으로 구현에서 제외합니다.

`;

  for (const f of skipFeatures) {
    md += `- **${f.title}** (${f.category}): ${f.rationale}\n`;
  }

  md += `
## 인쇄업 특화 개발 가이드라인

### 파일 업로드/관리
- 인쇄 원고 파일(PDF, AI, PSD) 업로드 기능 커스터마이징 필요
- 파일 미리보기 및 교정 기능 별도 개발 권장

### 제품 옵션 구조
- shopby 기본 옵션 구조를 인쇄 사양(지종, 수량, 후가공)에 맞게 확장
- 옵션별 단가 계산 로직 커스터마이징

### 생산 관리 워크플로우
- 주문 상태에 인쇄 진행 상태(접수→교정→인쇄→후가공→배송) 추가
- 외주 파트너사 연동을 위한 API 개발

### 납기일 관리
- 인쇄 제작 기간을 고려한 납기일 자동 계산 기능
- 긴급 주문 처리 프로세스 별도 구현
`;

  return md;
}

/**
 * 기능 매트릭스 생성 메인 함수
 *
 * @MX:ANCHOR 독립 실행 가능한 분석 도구의 진입점
 */
async function generateFeatureMatrix() {
  console.log('='.repeat(60));
  console.log('Shopby Admin 기능 매트릭스 생성기');
  console.log('='.repeat(60));

  // DOM 분석 결과 로드 시도
  console.log('\n[1단계] DOM 분석 결과 로드');
  let analysisData = loadAnalysisResults(ANALYSIS_PAGES_BASE);

  // 메뉴 맵에서 추가 데이터 로드
  if (fs.existsSync(MENU_MAP_PATH)) {
    const menuMap = JSON.parse(fs.readFileSync(MENU_MAP_PATH, 'utf-8'));
    const menuItems = menuMap.menus || menuMap;
    console.log(`  메뉴 맵: ${Array.isArray(menuItems) ? menuItems.length : 0}개 항목`);

    // DOM 분석 결과가 없으면 메뉴 맵 데이터로 보완
    if (analysisData.length === 0 && Array.isArray(menuItems)) {
      analysisData = menuItems.map((item) => ({
        title: item.title,
        category: item.category,
        url: item.url,
        actionButtons: [],
        tableHeaders: [],
        tabLabels: [],
      }));
    }
  }

  // DOM 분석 데이터가 없으면 문서 기반 기능 목록 사용
  if (analysisData.length === 0) {
    console.log('  DOM 분석 데이터 없음 - 문서 기반 분석으로 대체합니다.');
    analysisData = generateDocBasedFeatures();
  }

  console.log(`  분석 대상: ${analysisData.length}개 기능`);

  // shopby 문서 로드
  console.log('\n[2단계] shopby 엔터프라이즈 문서 로드');
  const docs = loadEnterpriseDocs();
  console.log(`  문서 카테고리: ${Object.keys(docs).length}개`);

  // 각 기능 분류
  console.log('\n[3단계] 기능 분류 (NATIVE/SKIN/CUSTOM/SKIP)');
  const classifiedFeatures = analysisData.map((feature) => {
    const { classification, rationale, priority } = classifyFeature(feature, docs);
    return {
      ...feature,
      classification,
      rationale,
      priority,
    };
  });

  // 통계 출력
  const stats = {
    NATIVE: classifiedFeatures.filter((f) => f.classification === 'NATIVE').length,
    SKIN: classifiedFeatures.filter((f) => f.classification === 'SKIN').length,
    CUSTOM: classifiedFeatures.filter((f) => f.classification === 'CUSTOM').length,
    SKIP: classifiedFeatures.filter((f) => f.classification === 'SKIP').length,
  };

  console.log(`\n  분류 결과:`);
  console.log(`    NATIVE: ${stats.NATIVE}개`);
  console.log(`    SKIN:   ${stats.SKIN}개`);
  console.log(`    CUSTOM: ${stats.CUSTOM}개`);
  console.log(`    SKIP:   ${stats.SKIP}개`);

  // SPEC 중복/갭 분석
  console.log('\n[4단계] SPEC-SKIN-005~008 중복/갭 분석');
  const overlapAnalysis = analyzeSpecOverlap(classifiedFeatures);

  // 보고서 생성
  console.log('\n[5단계] 보고서 생성');

  const matrixMd = generateMatrixMarkdown(classifiedFeatures, overlapAnalysis);
  const recommendationsMd = generateRecommendationsMarkdown(classifiedFeatures);

  // 출력 디렉토리 생성
  const outputDir = path.dirname(OUTPUT_MATRIX);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 파일 저장
  fs.writeFileSync(OUTPUT_MATRIX, matrixMd, 'utf-8');
  fs.writeFileSync(OUTPUT_RECOMMENDATIONS, recommendationsMd, 'utf-8');

  console.log(`\n[완료] 보고서 저장 완료:`);
  console.log(`  기능 매트릭스: ${OUTPUT_MATRIX}`);
  console.log(`  개발 권장사항: ${OUTPUT_RECOMMENDATIONS}`);
  console.log('='.repeat(60));
}

// 직접 실행 시 메인 함수 호출
generateFeatureMatrix().catch((error) => {
  console.error(`[오류] ${error.message}`);
  process.exit(1);
});

module.exports = { generateFeatureMatrix, classifyFeature, loadAnalysisResults };
