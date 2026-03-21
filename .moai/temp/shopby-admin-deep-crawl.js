/**
 * Shopby 어드민 딥 크롤 스크립트 v4
 * - Enter 키 기반 SSO 로그인
 * - 전체메뉴 열기 후 모든 사이드바 메뉴 탐색
 * - 각 페이지 스크린샷 + UI 컴포넌트 분석
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = '/Users/innojini/Dev/shopby-skin/.moai/temp/shopby-admin-v3';
const REPORT_PATH = '/Users/innojini/Dev/shopby-skin/.moai/specs/SPEC-SCREEN-001/shopby-admin-deep-crawl.md';

async function login(page) {
  console.log('\n[LOGIN] 로그인 시작...');

  // 1단계: shopby 로그인 폼
  await page.goto('https://service.shopby.co.kr/login', { waitUntil: 'networkidle', timeout: 30000 });

  await page.fill('#username', 'huniprinting');
  await page.fill('#password', 'huni@SANG#6080');
  await page.locator('.btn_main_login').first().click();
  await page.waitForTimeout(4000);

  console.log('[LOGIN] shopby 제출 후 URL:', page.url());

  // 2단계: NHN Commerce SSO
  if (page.url().includes('accounts.nhn-commerce.com')) {
    console.log('[LOGIN] NHN SSO 처리...');
    await page.waitForTimeout(2000);

    const textInputs = await page.locator('input[type="text"]:visible').all();
    const pwInputs = await page.locator('input[type="password"]:visible').all();

    if (textInputs.length > 0) {
      const val = await textInputs[0].inputValue();
      if (!val) await textInputs[0].fill('huniprinting');
    }

    if (pwInputs.length > 0) {
      await pwInputs[0].fill('huni@SANG#6080');
      // Enter 키로 제출 (버튼이 <a> 태그라서 button locator로 안 잡힘)
      await pwInputs[0].press('Enter');
    }

    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    console.log('[LOGIN] SSO 완료 후 URL:', page.url());
  }

  const finalUrl = page.url();
  const isLoggedIn = !finalUrl.includes('login') && !finalUrl.includes('accounts.nhn');
  console.log('[LOGIN] 최종 URL:', finalUrl);
  console.log('[LOGIN] 결과:', isLoggedIn ? '성공' : '실패');
  return isLoggedIn;
}

async function expandAllMenus(page) {
  console.log('\n[MENU] 전체메뉴 확장...');

  // 전체메뉴 열기 버튼 클릭
  try {
    const allMenuBtn = page.locator('button:has-text("전체메뉴"), a:has-text("전체메뉴")').first();
    if (await allMenuBtn.isVisible({ timeout: 3000 })) {
      await allMenuBtn.click();
      await page.waitForTimeout(1500);
      console.log('[MENU] 전체메뉴 열기 클릭');
    }
  } catch (e) {
    console.log('[MENU] 전체메뉴 버튼 없음');
  }

  // 접힌 서브메뉴 모두 열기
  const expandedCount = await page.evaluate(() => {
    // 아코디언/접힌 메뉴 항목들 클릭
    const collapsed = document.querySelectorAll(
      '[class*="closed"], [class*="collapse"], [aria-expanded="false"], [class*="arrow_down"]'
    );
    let count = 0;
    for (const el of collapsed) {
      if (el.offsetParent !== null) {
        el.click();
        count++;
      }
    }
    return count;
  });
  console.log(`[MENU] ${expandedCount}개 메뉴 항목 확장`);
  await page.waitForTimeout(1000);
}

async function collectMenuLinks(page) {
  // 페이지의 모든 내부 링크 수집
  const links = await page.evaluate(() => {
    const seen = new Set();
    const items = [];
    const els = document.querySelectorAll('a[href]');

    for (const el of els) {
      const href = el.href;
      const text = el.textContent?.trim()?.replace(/\s+/g, ' ');

      if (!href || !text) continue;
      if (seen.has(href)) continue;
      if (!href.includes('service.shopby.co.kr')) continue;
      if (href.includes('login') || href.includes('logout') || href.includes('javascript:')) continue;
      if (text.length === 0 || text.length > 60) continue;

      // 부모 요소로 카테고리 추정
      let category = '';
      let el2 = el.parentElement;
      for (let i = 0; i < 5; i++) {
        if (!el2) break;
        const cls = el2.className || '';
        if (cls.includes('gnb') || cls.includes('lnb') || cls.includes('nav') || cls.includes('menu') || cls.includes('sidebar')) {
          category = cls.split(' ')[0];
          break;
        }
        el2 = el2.parentElement;
      }

      seen.add(href);
      items.push({ text, href, category });
    }
    return items;
  });

  return links;
}

async function extractPageInfo(page) {
  return await page.evaluate(() => {
    const breadcrumbs = document.querySelector(
      '[class*="breadcrumb"], [class*="bread_crumb"], nav[aria-label*="breadcrumb"]'
    );

    const listCount = document.querySelectorAll('tbody tr, [class*="list-item"], [class*="list_item"]').length;

    return {
      title: document.title,
      h1: (
        document.querySelector('h2.tit, h2[class*="title"], .page_tit, .tit_page, h2, h3')
          ?.textContent?.trim()?.substring(0, 80)
      ) ?? '',
      tables: document.querySelectorAll('table').length,
      forms: document.querySelectorAll('form').length,
      buttons: document.querySelectorAll('button').length,
      inputs: document.querySelectorAll('input:not([type="hidden"]),select,textarea').length,
      tabs: document.querySelectorAll('[role="tab"],[class*="tab_list"] li,[class*="tabList"] li').length,
      modals: document.querySelectorAll('[role="dialog"],[class*="modal"],[class*="layer_pop"]').length,
      pagination: document.querySelectorAll('[class*="pagination"],[class*="paging"]').length > 0,
      breadcrumb: breadcrumbs?.textContent?.trim()?.replace(/\s+/g, ' ')?.substring(0, 150) ?? '',
      listItems: listCount,
    };
  });
}

async function visitPage(page, url, name, idx) {
  try {
    console.log(`\n[PAGE ${idx}] ${name}`);
    console.log(`  URL: ${url}`);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);

    // 로그인 페이지로 리다이렉트된 경우 건너뜀
    if (page.url().includes('login') || page.url().includes('accounts.nhn')) {
      console.log(`  [SKIP] 로그인 필요`);
      return null;
    }

    const safeName = name.replace(/[^a-zA-Z0-9가-힣_-]/g, '_').substring(0, 30);
    const filename = `${String(idx).padStart(3, '0')}-${safeName}.png`;
    const screenshotPath = path.join(SCREENSHOT_DIR, filename);

    await page.screenshot({ path: screenshotPath, fullPage: false });

    const info = await extractPageInfo(page);

    console.log(`  테이블:${info.tables} 폼:${info.forms} 입력:${info.inputs} 버튼:${info.buttons} 탭:${info.tabs} 목록행:${info.listItems}`);

    return { idx, name, url, screenshot: filename, ...info };
  } catch (e) {
    console.log(`  [ERROR] ${e.message?.substring(0, 100)}`);
    return null;
  }
}

function generateReport(results, menuLinks) {
  const now = new Date().toISOString();
  const success = results.filter(r => r !== null);

  let report = `# Shopby 어드민 딥 크롤 리포트\n\n`;
  report += `> 생성일: ${now}\n`;
  report += `> 총 캡처 화면: ${success.length}개\n`;
  report += `> 스크린샷 위치: \`.moai/temp/shopby-admin-v3/\`\n\n`;

  // 사이드바 메뉴 트리
  report += `## 발견된 내비게이션 링크\n\n`;
  const uniqueLinks = [...new Map(menuLinks.map(l => [l.href, l])).values()];
  for (const item of uniqueLinks.slice(0, 80)) {
    report += `- [${item.text}](${item.href})\n`;
  }
  report += '\n';

  // 화면 목록 테이블
  report += `## 화면 목록\n\n`;
  report += `| # | 화면명 | 테이블 | 폼 | 입력 | 버튼 | 탭 | 스크린샷 |\n`;
  report += `|---|--------|--------|-----|------|------|-----|----------|\n`;
  for (const r of success) {
    report += `| ${r.idx} | ${r.name} | ${r.tables ?? 0} | ${r.forms ?? 0} | ${r.inputs ?? 0} | ${r.buttons ?? 0} | ${r.tabs ?? 0} | ${r.screenshot} |\n`;
  }

  // 상세 분석
  report += `\n## 화면별 상세 분석\n\n`;
  for (const r of success) {
    report += `### ${r.idx}. ${r.name}\n\n`;
    report += `- **URL**: \`${r.url}\`\n`;
    report += `- **타이틀**: ${r.title || 'N/A'}\n`;
    report += `- **헤딩**: ${r.h1 || 'N/A'}\n`;
    report += `- **Breadcrumb**: ${r.breadcrumb || 'N/A'}\n`;
    report += `- **UI 구성**:\n`;
    report += `  - 테이블: ${r.tables ?? 0}개\n`;
    report += `  - 폼: ${r.forms ?? 0}개\n`;
    report += `  - 입력 필드: ${r.inputs ?? 0}개\n`;
    report += `  - 버튼: ${r.buttons ?? 0}개\n`;
    report += `  - 탭: ${r.tabs ?? 0}개\n`;
    report += `  - 목록 행: ${r.listItems ?? 0}개\n`;
    report += `  - 페이지네이션: ${r.pagination ? 'O' : 'X'}\n`;
    report += `- **스크린샷**: \`${r.screenshot}\`\n\n`;
  }

  // 카테고리별 패턴 분석
  report += `## 카테고리별 UI 패턴 분석\n\n`;

  const categories = [
    { label: '목록형 화면 (테이블 2개 이상)', filter: r => r.tables >= 2 },
    { label: '데이터 입력 화면 (입력 10개 이상)', filter: r => r.inputs >= 10 },
    { label: '탭 기반 화면', filter: r => r.tabs > 0 },
    { label: '페이지네이션 화면', filter: r => r.pagination },
    { label: '복합 화면 (테이블+탭)', filter: r => r.tables > 0 && r.tabs > 0 },
  ];

  for (const cat of categories) {
    const filtered = success.filter(cat.filter);
    report += `### ${cat.label} (${filtered.length}개)\n\n`;
    for (const item of filtered) {
      report += `- **${item.name}**: 테이블 ${item.tables}개, 입력 ${item.inputs}개, 버튼 ${item.buttons}개, 탭 ${item.tabs}개\n`;
    }
    report += '\n';
  }

  return report;
}

async function main() {
  // 스크린샷 디렉토리 준비
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 로그인
  const isLoggedIn = await login(page);

  if (!isLoggedIn) {
    console.log('[ERROR] 로그인 실패. 종료합니다.');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '000-login-failed.png') });
    await browser.close();
    return;
  }

  // 대시보드 스크린샷
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '001-dashboard.png') });
  const dashInfo = await extractPageInfo(page);
  const results = [{ idx: 1, name: '대시보드', url: page.url(), screenshot: '001-dashboard.png', ...dashInfo }];
  console.log(`\n[DASHBOARD] 대시보드 캡처 완료`);

  // 전체메뉴 확장
  await expandAllMenus(page);

  // 메뉴 링크 수집
  const menuLinks = await collectMenuLinks(page);
  console.log(`\n[MENU] 총 ${menuLinks.length}개 링크 수집`);

  // 대시보드 URL
  const dashboardUrl = page.url();

  // 방문할 URL 목록 (중복 제거)
  const visitMap = new Map();
  for (const link of menuLinks) {
    if (!visitMap.has(link.href)) {
      visitMap.set(link.href, link.text);
    }
  }

  console.log(`\n[CRAWL] 탐색 예정: ${visitMap.size}개 URL`);

  // 각 URL 방문
  let idx = 2;
  const visited = new Set([dashboardUrl]);

  for (const [url, name] of visitMap) {
    if (visited.has(url)) continue;
    visited.add(url);

    const result = await visitPage(page, url, name, idx);
    if (result) {
      results.push(result);
      idx++;
    }

    // 최대 70개로 제한
    if (idx > 70) {
      console.log('\n[CRAWL] 최대 페이지 수 도달');
      break;
    }
  }

  // 리포트 생성
  console.log('\n[REPORT] 리포트 생성...');
  const report = generateReport(results, menuLinks);

  const reportDir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(REPORT_PATH, report);
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'crawl-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log(`\n[DONE] 완료!`);
  console.log(`  캡처 화면: ${results.length}개`);
  console.log(`  리포트: ${REPORT_PATH}`);
  console.log(`  스크린샷: ${SCREENSHOT_DIR}/`);

  await browser.close();
}

main().catch(e => {
  console.error('[FATAL]', e.message);
  process.exit(1);
});
