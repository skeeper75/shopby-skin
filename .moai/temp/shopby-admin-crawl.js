const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = '/Users/innojini/Dev/shopby-skin/.moai/temp/shopby-admin-v2';
const REPORT_PATH = '/Users/innojini/Dev/shopby-skin/.moai/specs/SPEC-SCREEN-001/shopby-admin-crawl-v2.md';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  const results = [];
  
  // Step 1: Navigate to login
  console.log('1. Navigating to login page...');
  await page.goto('https://service.shopby.co.kr/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '00-login.png'), fullPage: false });
  console.log('   Login page loaded. URL:', page.url());
  
  // Step 2: Fill login form (first form, not SSO)
  console.log('2. Attempting login...');
  try {
    // Try filling the shopby admin login form directly
    const idInput = await page.locator('input[placeholder*="아이디"]').first();
    const pwInput = await page.locator('input[placeholder*="비밀번호"]').first();
    
    if (await idInput.isVisible()) {
      await idInput.fill('huniprinting');
      await pwInput.fill('huni@SANG#6080');
      
      // Click the red login button (first button, not SSO)
      const loginBtn = await page.locator('button:has-text("로그인")').first();
      await loginBtn.click();
      
      console.log('   Login form submitted. Waiting for navigation...');
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(3000);
    } else {
      console.log('   ID input not found. Trying alternative selectors...');
      // Try type="text" input
      const inputs = await page.locator('input[type="text"], input[type="password"]').all();
      if (inputs.length >= 2) {
        await inputs[0].fill('huniprinting');
        await inputs[1].fill('huni@SANG#6080');
        await page.locator('button[type="submit"], button:has-text("로그인")').first().click();
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(3000);
      }
    }
  } catch(e) {
    console.log('   Login error:', e.message);
  }
  
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-after-login.png'), fullPage: false });
  console.log('   After login URL:', page.url());
  const afterLoginTitle = await page.title();
  console.log('   Page title:', afterLoginTitle);
  
  // Check if we're logged in (not on login page anymore)
  const currentUrl = page.url();
  const isLoggedIn = !currentUrl.includes('login') && !currentUrl.includes('accounts.nhn');
  console.log('   Login status:', isLoggedIn ? 'SUCCESS' : 'FAILED (still on login page)');
  
  if (!isLoggedIn) {
    // Try SSO login path
    console.log('3. Trying SSO login path...');
    await page.goto('https://service.shopby.co.kr/login', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Check if there's a direct ID/PW form or if it redirects to SSO
    const pageContent = await page.content();
    console.log('   Page has login form:', pageContent.includes('아이디') || pageContent.includes('로그인'));
    
    // Extract form structure for debugging
    const formInfo = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      const buttons = document.querySelectorAll('button, a');
      return {
        inputs: Array.from(inputs).map(i => ({ type: i.type, placeholder: i.placeholder, name: i.name, id: i.id })),
        buttons: Array.from(buttons).map(b => ({ text: b.textContent?.trim()?.substring(0, 50), tag: b.tagName, href: b.href }))
      };
    });
    console.log('   Form inputs:', JSON.stringify(formInfo.inputs));
    console.log('   Buttons:', JSON.stringify(formInfo.buttons.slice(0, 10)));
    
    results.push({ status: 'LOGIN_FAILED', url: currentUrl, formInfo });
  }
  
  if (isLoggedIn) {
    // Step 3: Extract sidebar navigation
    console.log('3. Extracting navigation structure...');
    const navStructure = await page.evaluate(() => {
      const nav = document.querySelector('nav, [class*="sidebar"], [class*="menu"], [class*="nav"]');
      if (!nav) return 'No navigation found';
      return nav.innerText;
    });
    console.log('   Nav structure found:', navStructure?.substring(0, 200));
    
    // Step 4: Get all navigation links
    const navLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('nav a, [class*="sidebar"] a, [class*="menu"] a');
      return Array.from(links).map(a => ({ 
        text: a.textContent?.trim(), 
        href: a.href 
      })).filter(l => l.text && l.href);
    });
    console.log('   Found', navLinks.length, 'navigation links');
    
    // Step 5: Visit each major section
    const visitedUrls = new Set();
    let screenshotCount = 2;
    
    for (const link of navLinks.slice(0, 30)) {
      if (visitedUrls.has(link.href) || !link.href.startsWith('http')) continue;
      visitedUrls.add(link.href);
      
      try {
        console.log(`   Visiting: ${link.text} (${link.href})`);
        await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);
        
        const filename = `${String(screenshotCount).padStart(2, '0')}-${link.text.replace(/[^a-zA-Z0-9가-힣]/g, '_').substring(0, 30)}.png`;
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename), fullPage: false });
        
        // Extract page components
        const pageInfo = await page.evaluate(() => {
          return {
            title: document.title,
            h1: document.querySelector('h1')?.textContent?.trim(),
            tables: document.querySelectorAll('table').length,
            forms: document.querySelectorAll('form').length,
            buttons: document.querySelectorAll('button').length,
            inputs: document.querySelectorAll('input, select, textarea').length,
            tabs: document.querySelectorAll('[role="tab"], .tab, [class*="tab"]').length,
            modals: document.querySelectorAll('[role="dialog"], .modal, [class*="modal"]').length,
          };
        });
        
        results.push({
          name: link.text,
          url: link.href,
          screenshot: filename,
          ...pageInfo
        });
        
        screenshotCount++;
      } catch(e) {
        console.log(`   Error visiting ${link.text}:`, e.message?.substring(0, 100));
      }
    }
  }
  
  // Generate report
  let report = `# Shopby 관리자 화면 크롤링 리포트 v2\n\n`;
  report += `> 생성일: ${new Date().toISOString()}\n`;
  report += `> 대상: https://service.shopby.co.kr\n`;
  report += `> 로그인 상태: ${isLoggedIn ? '성공' : '실패'}\n`;
  report += `> 캡처 화면: ${results.length}개\n\n`;
  
  if (!isLoggedIn) {
    report += `## 로그인 실패 분석\n\n`;
    report += `shopby 서비스어드민은 NHN Commerce 통합회원 OAuth SSO를 통해 로그인합니다.\n`;
    report += `제공된 자격증명(huniprinting)은 shopby 서비스어드민 전용 계정이며,\n`;
    report += `SSO 리다이렉트 후 통합계정 로그인 페이지에서 별도 인증이 필요할 수 있습니다.\n\n`;
    if (results[0]?.formInfo) {
      report += `### 로그인 폼 구조\n\n`;
      report += `\`\`\`json\n${JSON.stringify(results[0].formInfo, null, 2)}\n\`\`\`\n\n`;
    }
  } else {
    report += `## 화면별 분석\n\n`;
    for (const r of results) {
      report += `### ${r.name}\n\n`;
      report += `- URL: ${r.url}\n`;
      report += `- 스크린샷: ${r.screenshot}\n`;
      report += `- 테이블: ${r.tables}개, 폼: ${r.forms}개, 버튼: ${r.buttons}개\n`;
      report += `- 입력필드: ${r.inputs}개, 탭: ${r.tabs}개, 모달: ${r.modals}개\n\n`;
    }
  }
  
  fs.writeFileSync(REPORT_PATH, report);
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'results.json'), JSON.stringify(results, null, 2));
  
  console.log('\nReport saved to:', REPORT_PATH);
  console.log('Screenshots saved to:', SCREENSHOT_DIR);
  
  await browser.close();
}

main().catch(e => console.error('Fatal error:', e.message));
