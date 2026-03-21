/**
 * Shopby 어드민 패널 크롤링 스크립트 v2
 * - NHN Commerce OAuth2 로그인 처리
 * - service.shopby.co.kr 어드민 주요 화면 스크린샷 수집
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CREDENTIALS = {
  url: 'https://service.shopby.co.kr',
  id: 'huniprinting',
  pw: 'huni@SANG#6080',
};

const SCREENSHOT_DIR = '/Users/innojini/Dev/shopby-skin/.moai/temp/shopby-admin-screenshots';
const REPORT_PATH = '/Users/innojini/Dev/shopby-skin/.moai/specs/SPEC-SCREEN-001/shopby-admin-crawl-report.md';

// 캡처할 페이지 목록
const PAGES_TO_CAPTURE = [
  { id: 'order-list', name: '주문관리 > 전체주문', path: '/order/list', waitFor: 'networkidle' },
  { id: 'product-list', name: '상품관리 > 상품목록', path: '/product/list', waitFor: 'networkidle' },
  { id: 'product-register', name: '상품관리 > 상품등록', path: '/product/add', waitFor: 'networkidle' },
  { id: 'member-list', name: '회원관리 > 회원목록', path: '/member/list', waitFor: 'networkidle' },
  { id: 'coupon-list', name: '프로모션 > 쿠폰관리', path: '/promotion/coupon/list', waitFor: 'networkidle' },
  { id: 'board-notice', name: '게시판관리 > 공지사항', path: '/board/notice/list', waitFor: 'networkidle' },
  { id: 'board-inquiry', name: '게시판관리 > 1:1문의', path: '/board/qna/list', waitFor: 'networkidle' },
  { id: 'stats-sales', name: '통계 > 매출통계', path: '/statistics/sales', waitFor: 'networkidle' },
  { id: 'settings', name: '설정', path: '/setting', waitFor: 'networkidle' },
];

async function analyzePageComponents(page) {
  return await page.evaluate(() => {
    const components = {};

    // 테이블
    const tables = document.querySelectorAll('table, .table, [class*="table"]');
    components.tables = tables.length > 0 ? `${tables.length}개의 테이블` : null;

    // 폼
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input, select, textarea');
    components.forms = forms.length > 0 ? `${forms.length}개의 폼 (입력 요소 ${inputs.length}개)` : null;

    // 버튼
    const buttons = document.querySelectorAll('button, [type="button"], [type="submit"], .btn, [class*="btn"]');
    const uniqueButtonTexts = [...new Set([...buttons].map(b => b.textContent?.trim()).filter(t => t && t.length < 30 && t.length > 0))].slice(0, 10);
    components.buttons = buttons.length > 0 ? `${buttons.length}개 (예: ${uniqueButtonTexts.join(', ')})` : null;

    // 탭
    const tabs = document.querySelectorAll('[role="tab"], .tab, [class*="tab"]');
    components.tabs = tabs.length > 0 ? `${tabs.length}개의 탭` : null;

    // 모달
    const modals = document.querySelectorAll('[role="dialog"], .modal, [class*="modal"], [class*="dialog"]');
    components.modals = modals.length > 0 ? `${modals.length}개의 모달` : null;

    // 필터/검색
    const searchBoxes = document.querySelectorAll('[type="search"], [placeholder*="검색"], [placeholder*="search"]');
    const selects = document.querySelectorAll('select');
    const datepickers = document.querySelectorAll('[class*="datepicker"], [class*="date-picker"], [class*="calendar"]');
    components.filters = (searchBoxes.length + selects.length + datepickers.length) > 0
      ? `검색창 ${searchBoxes.length}개, 셀렉트박스 ${selects.length}개, 날짜피커 ${datepickers.length}개` : null;

    // 사이드바 메뉴
    const sidebar = document.querySelector('nav, aside, [class*="sidebar"], [class*="gnb"], [class*="lnb"], [class*="aside"]');
    if (sidebar) {
      const menuItems = sidebar.querySelectorAll('a, li');
      const menuTexts = [...menuItems]
        .map(m => m.textContent?.trim())
        .filter(t => t && t.length < 40 && t.length > 0)
        .slice(0, 30);
      components.sidebar = menuTexts.join('\n');
    }

    // 페이지 타이틀
    const h1 = document.querySelector('h1, .page-title, [class*="title"]');
    const breadcrumb = document.querySelector('[class*="breadcrumb"], [aria-label*="breadcrumb"], [class*="bread"]');
    components.pageTitle = h1?.textContent?.trim() || document.title;
    components.breadcrumb = breadcrumb?.textContent?.trim().replace(/\s+/g, ' ') || null;

    // 레이아웃 감지
    const hasSidebar = !!(document.querySelector('[class*="sidebar"], [class*="gnb"], [class*="lnb"], aside'));
    const hasTopNav = !!(document.querySelector('header, [class*="header"], [class*="topbar"]'));
    const hasTabs = tabs.length > 2;
    const hasCard = !!(document.querySelector('[class*="card"], .card'));
    const hasChart = !!(document.querySelector('canvas, [class*="chart"], svg'));

    let layoutPattern = [];
    if (hasSidebar) layoutPattern.push('좌측 사이드바');
    if (hasTopNav) layoutPattern.push('상단 헤더');
    if (hasTabs) layoutPattern.push('탭 구조');
    if (hasCard) layoutPattern.push('카드 레이아웃');
    if (hasChart) layoutPattern.push('차트/그래프');
    components.layout = layoutPattern.length > 0 ? layoutPattern.join(' + ') : '기본 레이아웃';

    return components;
  });
}

async function capturePages() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'ko-KR',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();
  const results = [];
  let loginSuccess = false;
  let sidebarNav = '';

  console.log('=== Shopby 어드민 크롤링 v2 시작 ===\n');

  // 1. shopby 로그인 페이지로 이동
  console.log('[STEP 1] shopby 서비스어드민 로그인 페이지 접속');
  await page.goto(CREDENTIALS.url + '/login', { timeout: 30000, waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '00-shopby-login.png') });
  console.log(`  현재 URL: ${page.url()}`);

  // 2. shopby 직접 로그인 시도 (shopby 아이디/비번)
  try {
    // shopby 로그인 폼의 아이디/비번 입력
    const idInput = page.locator('input[placeholder*="아이디"], input[name*="id"], input[type="text"]').first();
    await idInput.waitFor({ timeout: 5000 });
    await idInput.fill(CREDENTIALS.id);

    const pwInput = page.locator('input[type="password"]').first();
    await pwInput.fill(CREDENTIALS.pw);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '00a-login-filled.png') });

    // "로그인" 버튼 클릭 (빨간 버튼 - shopby 직접 로그인)
    const loginBtn = page.locator('button:has-text("로그인")').first();
    await loginBtn.click();
    console.log('  - shopby 로그인 버튼 클릭');

    // 네비게이션 대기
    await page.waitForNavigation({ timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(3000);

    const afterUrl = page.url();
    console.log(`  - 로그인 후 URL: ${afterUrl}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '00b-after-login.png') });

    // NHN Commerce 통합 로그인 페이지로 이동했는지 확인
    if (afterUrl.includes('accounts.nhn-commerce.com')) {
      console.log('\n[STEP 2] NHN Commerce 통합 로그인 페이지로 리다이렉트됨');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-nhn-login.png') });

      // NHN 통합 로그인 처리
      const nhnIdInput = page.locator('input[placeholder*="아이디"], input[type="text"]').first();
      await nhnIdInput.waitFor({ timeout: 10000 });
      await nhnIdInput.fill(CREDENTIALS.id);

      const nhnPwInput = page.locator('input[type="password"]').first();
      await nhnPwInput.fill(CREDENTIALS.pw);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01a-nhn-login-filled.png') });

      const nhnLoginBtn = page.locator('button:has-text("로그인"), button[type="submit"]').first();
      await nhnLoginBtn.click();
      console.log('  - NHN 로그인 버튼 클릭');

      await page.waitForNavigation({ timeout: 20000 }).catch(() => null);
      await page.waitForTimeout(3000);

      const finalUrl = page.url();
      console.log(`  - NHN 로그인 후 URL: ${finalUrl}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01b-nhn-after-login.png') });

      // 추가 OAuth 콜백 대기
      if (finalUrl.includes('oauth') || finalUrl.includes('redirect')) {
        await page.waitForNavigation({ timeout: 15000 }).catch(() => null);
        await page.waitForTimeout(2000);
        console.log(`  - OAuth 콜백 후 URL: ${page.url()}`);
      }
    }

    // 로그인 성공 확인
    const currentUrl = page.url();
    if (!currentUrl.includes('login') && !currentUrl.includes('signin')) {
      loginSuccess = true;
      console.log(`\n  [OK] 로그인 성공! 현재 URL: ${currentUrl}`);
    } else {
      console.log(`\n  [WARN] 여전히 로그인 페이지. URL: ${currentUrl}`);
      // 페이지 내용 확인
      const pageContent = await page.content();
      if (pageContent.includes('아이디 또는 비밀번호') || pageContent.includes('로그인 실패')) {
        console.log('  [WARN] 로그인 실패 메시지 감지');
      }
    }

  } catch (err) {
    console.error(`  [FAIL] 로그인 오류: ${err.message}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '00-login-error.png') });
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-dashboard.png') });

  // 3. 사이드바 구조 추출 (대시보드)
  try {
    sidebarNav = await page.evaluate(() => {
      // 다양한 사이드바 셀렉터 시도
      const selectors = [
        '.lnb', '.gnb', '.sidebar', 'aside', 'nav',
        '[class*="aside"]', '[class*="sidebar"]', '[class*="menu"]',
      ];

      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim().length > 10) {
          const items = el.querySelectorAll('a, li, [class*="item"]');
          const texts = [...items]
            .map(i => i.textContent?.trim())
            .filter(t => t && t.length > 0 && t.length < 50)
            .slice(0, 50);
          if (texts.length > 3) return texts.join('\n');
        }
      }

      // 전체 메뉴 링크 추출
      const allLinks = document.querySelectorAll('a[href]');
      const menuLinks = [...allLinks]
        .filter(a => {
          const href = a.getAttribute('href');
          return href && !href.startsWith('http') && href.length > 1;
        })
        .map(a => `${a.textContent?.trim()} (${a.getAttribute('href')})`)
        .filter(t => t && t.length > 3)
        .slice(0, 40);
      return menuLinks.join('\n') || 'N/A';
    });
    console.log(`\n[사이드바/메뉴 구조 (처음 500자)]\n${sidebarNav.slice(0, 500)}\n`);
  } catch (err) {
    console.error('사이드바 추출 오류:', err.message);
  }

  // 4. 대시보드 분석
  try {
    const dashComponents = await analyzePageComponents(page);
    results.push({
      id: 'dashboard',
      name: '대시보드',
      url: page.url(),
      screenshot: '02-dashboard.png',
      navPath: '대시보드',
      components: dashComponents,
      status: 'success',
    });
    console.log(`[OK] 대시보드 분석: ${dashComponents.pageTitle}`);
  } catch (err) {
    console.error('[FAIL] 대시보드 분석:', err.message);
  }

  // 5. 각 페이지 순차 방문
  if (loginSuccess) {
    for (let i = 0; i < PAGES_TO_CAPTURE.length; i++) {
      const pageInfo = PAGES_TO_CAPTURE[i];
      const screenshotName = `${String(i + 3).padStart(2, '0')}-${pageInfo.id}.png`;

      try {
        console.log(`\n[${i + 6}] 방문: ${pageInfo.name}`);
        const targetUrl = `${CREDENTIALS.url}${pageInfo.path}`;

        await page.goto(targetUrl, {
          timeout: 25000,
          waitUntil: 'domcontentloaded',
        });
        await page.waitForTimeout(2500);

        const currentUrl = page.url();

        if (currentUrl.includes('/login')) {
          console.log(`  [SKIP] 로그인 리다이렉트`);
          results.push({
            id: pageInfo.id, name: pageInfo.name, url: targetUrl,
            screenshot: null, navPath: pageInfo.name, components: {},
            status: 'redirected-to-login', error: '세션 만료 또는 권한 없음',
          });
          continue;
        }

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, screenshotName) });
        const components = await analyzePageComponents(page);

        results.push({
          id: pageInfo.id, name: pageInfo.name, url: currentUrl,
          screenshot: screenshotName, navPath: pageInfo.name,
          components, status: 'success',
        });
        console.log(`  [OK] 캡처 -> ${screenshotName} | 타이틀: ${components.pageTitle}`);

      } catch (err) {
        console.error(`  [FAIL] ${pageInfo.name}: ${err.message}`);
        results.push({
          id: pageInfo.id, name: pageInfo.name, url: `${CREDENTIALS.url}${pageInfo.path}`,
          screenshot: null, navPath: pageInfo.name, components: {},
          status: 'error', error: err.message,
        });
      }
    }
  } else {
    console.log('\n[WARN] 로그인 실패로 인해 추가 페이지 캡처 건너뜀');

    // 로그인 실패 시에도 현재 페이지들 기록
    for (const pageInfo of PAGES_TO_CAPTURE) {
      results.push({
        id: pageInfo.id, name: pageInfo.name, url: `${CREDENTIALS.url}${pageInfo.path}`,
        screenshot: null, navPath: pageInfo.name, components: {},
        status: 'skipped-login-failed', error: '로그인 실패',
      });
    }
  }

  await browser.close();
  return { results, sidebarNav, loginSuccess };
}

function generateReport(data) {
  const { results, sidebarNav, loginSuccess } = data;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const successCount = results.filter(r => r.status === 'success').length;

  let md = `# Shopby 어드민 UI 크롤링 리포트

> 자동 생성: ${now}
> 대상 사이트: ${CREDENTIALS.url}
> 로그인 상태: ${loginSuccess ? '성공' : '실패 (NHN Commerce OAuth 인증 필요)'}
> 총 캡처: ${successCount}개 성공 / ${results.length - successCount}개 실패/스킵

---

## 사이드바 내비게이션 구조

\`\`\`
${sidebarNav || '(추출 실패 - 로그인 후 재시도 필요)'}
\`\`\`

---

## 화면별 UI 분석

`;

  for (const result of results) {
    md += `### ${result.name}\n\n`;
    md += `| 항목 | 내용 |\n|------|------|\n`;
    md += `| URL | \`${result.url}\` |\n`;
    md += `| 스크린샷 | ${result.screenshot ? `\`${result.screenshot}\`` : '(없음)'} |\n`;
    md += `| 상태 | ${result.status === 'success' ? '성공' : result.status} |\n`;
    if (result.error) md += `| 오류 | ${result.error} |\n`;

    if (result.status === 'success' && result.components) {
      const c = result.components;
      if (c.pageTitle) md += `| 페이지 타이틀 | ${c.pageTitle} |\n`;
      if (c.breadcrumb) md += `| 브레드크럼 | ${c.breadcrumb} |\n`;
      md += `| 레이아웃 패턴 | ${c.layout || '알 수 없음'} |\n`;
      if (c.tables) md += `| 테이블 | ${c.tables} |\n`;
      if (c.forms) md += `| 폼/입력 | ${c.forms} |\n`;
      if (c.buttons) md += `| 버튼 | ${c.buttons} |\n`;
      if (c.tabs) md += `| 탭 | ${c.tabs} |\n`;
      if (c.filters) md += `| 필터/검색 | ${c.filters} |\n`;
    }

    md += `\n`;

    // 후니프린팅 관련성 분석
    md += `**후니프린팅 어드민 설계 관련성:**\n`;
    if (result.name.includes('주문')) {
      md += `- 주문 목록: 필터(날짜/상태/결제방식), 데이터 테이블(주문번호/고객명/금액/상태), 일괄 처리 버튼\n`;
      md += `- 인쇄업 추가: 파일 첨부 상태, 인쇄 옵션(수량/규격/재질), 작업 진행 상태\n`;
    } else if (result.name.includes('상품')) {
      md += `- 상품 관리: 카테고리, 이미지, 가격, 재고 구조\n`;
      md += `- 인쇄업 추가: 인쇄 규격(A4/A3 등), 파일 업로드 정책, 교정 절차\n`;
    } else if (result.name.includes('회원')) {
      md += `- 회원 목록: B2B 기업 고객 정보, 담당자명, 사업자번호, 구매 이력\n`;
    } else if (result.name.includes('통계')) {
      md += `- 통계: 기간별 매출 차트, 상품별/채널별 집계 테이블\n`;
    } else if (result.name.includes('대시보드')) {
      md += `- 요약 카드(오늘 주문/매출/미처리 건수), 최근 주문, 빠른 실행\n`;
    } else if (result.name.includes('쿠폰') || result.name.includes('적립금')) {
      md += `- 할인 조건, 적용 대상, 기간 설정, 발급/사용 이력\n`;
    } else if (result.name.includes('게시판') || result.name.includes('공지') || result.name.includes('문의')) {
      md += `- 목록 테이블, 내용 에디터, 카테고리/상태 필터\n`;
    } else if (result.name.includes('설정')) {
      md += `- 쇼핑몰 기본 정보, 배송 설정, 결제 수단, 알림 설정\n`;
    }

    md += `\n---\n\n`;
  }

  // 스크린샷 목록
  md += `## 스크린샷 파일 목록\n\n`;
  const screenshots = results.filter(r => r.screenshot);
  for (const r of screenshots) {
    md += `- \`${r.screenshot}\` - ${r.name}\n`;
  }

  // 로그인 화면 스크린샷
  md += `\n**로그인 과정 스크린샷:**\n`;
  const loginShots = [
    '00-shopby-login.png',
    '00a-login-filled.png',
    '00b-after-login.png',
    '01-nhn-login.png',
    '01a-nhn-login-filled.png',
    '01b-nhn-after-login.png',
  ];
  for (const shot of loginShots) {
    if (fs.existsSync(path.join(SCREENSHOT_DIR, shot))) {
      md += `- \`${shot}\`\n`;
    }
  }

  // 설계 시사점
  md += `
## 설계 시사점 요약

### 공통 레이아웃 패턴 (shopby 어드민 기준)

1. **좌측 고정 사이드바**: 1단계 대메뉴 + 2단계 서브메뉴, 아코디언 확장
2. **상단 헤더**: 쇼핑몰 로고/이름, 사용자 정보, 알림, 로그아웃
3. **콘텐츠 영역 구조**:
   - 페이지 타이틀 + 브레드크럼
   - 검색/필터 패널 (접힘/펼침 가능)
   - 데이터 테이블 (정렬, 체크박스, 페이지네이션)
   - 일괄 처리 액션 버튼
4. **등록/수정 화면**: 탭 구조 + 섹션별 폼 + 하단 저장/취소

### 후니프린팅 어드민 스킨 커스터마이징 전략

#### NATIVE 화면 (스킨만 수정)
- 주문 관리, 상품 관리, 회원 관리, 통계, 설정
- 브랜드 컬러, 폰트, 아이콘만 변경
- 레이아웃 구조는 shopby 기본 유지

#### SKIN 화면 (컴포넌트 재배치)
- 대시보드: 인쇄업 특화 요약 카드 배치
- 주문 상세: 인쇄 파일 프리뷰, 작업 상태 추가

#### CUSTOM 화면 (별도 개발)
- 인쇄 파일 관리
- 작업 진행 현황 (Kanban)
- 교정 요청/승인

### 주요 UI 컴포넌트 재사용 가능 항목
- 데이터 테이블 (정렬/필터/선택)
- 날짜 범위 피커
- 상태 배지 (대기/처리중/완료)
- 탭 내비게이션
- 검색 필터 패널
- 페이지네이션
- 파일 업로드 드래그앤드롭
- 확인 모달
`;

  return md;
}

// 메인 실행
(async () => {
  try {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

    const data = await capturePages();

    console.log('\n=== 리포트 생성 중 ===');
    const report = generateReport(data);
    fs.writeFileSync(REPORT_PATH, report, 'utf-8');

    const jsonPath = path.join(SCREENSHOT_DIR, 'crawl-results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data.results, null, 2), 'utf-8');

    const successCount = data.results.filter(r => r.status === 'success').length;
    console.log(`\n[완료] 리포트: ${REPORT_PATH}`);
    console.log(`[완료] 스크린샷: ${SCREENSHOT_DIR}`);
    console.log(`[완료] 성공 ${successCount}개 / 총 ${data.results.length}개`);
    console.log(`[완료] 로그인: ${data.loginSuccess ? '성공' : '실패'}`);

  } catch (err) {
    console.error('크롤링 실패:', err);
    process.exit(1);
  }
})();
