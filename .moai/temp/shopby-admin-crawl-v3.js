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
  let isLoggedIn = false;
  
  // Step 1: Go to shopby login, which redirects to SSO
  console.log('1. Navigating to service.shopby.co.kr/login...');
  await page.goto('https://service.shopby.co.kr/login', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('   Current URL:', page.url());
  
  // Step 2: Click "로그인" to trigger SSO redirect (shopby form does initial auth)
  try {
    // Fill shopby's own login form first
    await page.fill('#username', 'huniprinting');
    await page.fill('#password', 'huni@SANG#6080');
    await page.click('button:has-text("로그인")');
    await page.waitForTimeout(3000);
    console.log('2. After shopby login click, URL:', page.url());
  } catch(e) {
    console.log('2. Shopby form error:', e.message?.substring(0, 100));
  }
  
  // Step 3: If redirected to NHN Commerce SSO, fill credentials there too
  const currentUrl = page.url();
  if (currentUrl.includes('accounts.nhn-commerce.com')) {
    console.log('3. On NHN Commerce SSO page. Filling credentials...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '00-sso-page.png') });
    
    try {
      // Wait for the SSO login form
      await page.waitForSelector('input[type="text"], input[name="username"], input[id="username"]', { timeout: 10000 });
      
      // Get all input fields
      const inputs = await page.evaluate(() => {
        const els = document.querySelectorAll('input');
        return Array.from(els).map(e => ({ type: e.type, name: e.name, id: e.id, placeholder: e.placeholder, visible: e.offsetParent !== null }));
      });
      console.log('   SSO form inputs:', JSON.stringify(inputs));
      
      // Fill SSO form - try multiple selectors
      const textInputs = await page.locator('input[type="text"]:visible').all();
      const pwInputs = await page.locator('input[type="password"]:visible').all();
      
      if (textInputs.length > 0 && pwInputs.length > 0) {
        await textInputs[0].fill('huniprinting');
        await pwInputs[0].fill('huni@SANG#6080');
        
        // Click login button
        const loginBtns = await page.locator('button:visible').all();
        for (const btn of loginBtns) {
          const text = await btn.textContent();
          if (text && text.includes('로그인')) {
            console.log('   Clicking SSO login button:', text.trim());
            await btn.click();
            break;
          }
        }
        
        await page.waitForTimeout(5000);
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        console.log('   After SSO login, URL:', page.url());
      }
    } catch(e) {
      console.log('   SSO login error:', e.message?.substring(0, 200));
    }
  }
  
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-after-all-login.png') });
  const finalUrl = page.url();
  console.log('4. Final URL:', finalUrl);
  console.log('   Title:', await page.title());
  
  isLoggedIn = !finalUrl.includes('login') && !finalUrl.includes('accounts.nhn');
  
  if (isLoggedIn) {
    console.log('=== LOGIN SUCCESS! Crawling admin screens... ===');
    
    // Get page content overview
    const pageText = await page.evaluate(() => document.body?.innerText?.substring(0, 500));
    console.log('   Page content preview:', pageText?.substring(0, 200));
    
    // Extract sidebar navigation
    const navItems = await page.evaluate(() => {
      const allLinks = document.querySelectorAll('a[href]');
      return Array.from(allLinks).map(a => ({
        text: a.textContent?.trim()?.substring(0, 50),
        href: a.href
      })).filter(l => l.text && l.href && l.href.startsWith('http') && !l.text.includes('\n'));
    });
    console.log('   Navigation links found:', navItems.length);
    
    // Visit key admin pages
    const visited = new Set();
    let idx = 2;
    
    for (const item of navItems.slice(0, 40)) {
      if (visited.has(item.href) || !item.href.includes('service.shopby.co.kr')) continue;
      visited.add(item.href);
      
      try {
        await page.goto(item.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1500);
        
        const safeName = item.text.replace(/[^a-zA-Z0-9가-힣_-]/g, '_').substring(0, 25);
        const filename = `${String(idx).padStart(2, '0')}-${safeName}.png`;
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename) });
        
        const info = await page.evaluate(() => ({
          title: document.title,
          h1: document.querySelector('h1,h2,h3')?.textContent?.trim()?.substring(0, 50),
          tables: document.querySelectorAll('table').length,
          forms: document.querySelectorAll('form').length,
          buttons: document.querySelectorAll('button').length,
          inputs: document.querySelectorAll('input,select,textarea').length,
          tabs: document.querySelectorAll('[role="tab"],[class*="tab"]').length,
          breadcrumb: document.querySelector('[class*="breadcrumb"],[class*="gnb"]')?.textContent?.trim()?.substring(0, 100),
        }));
        
        results.push({ name: item.text, url: item.href, screenshot: filename, ...info });
        console.log(`   [${idx}] ${item.text}: tables=${info.tables} forms=${info.forms} inputs=${info.inputs}`);
        idx++;
      } catch(e) {
        console.log(`   Error: ${item.text} - ${e.message?.substring(0, 80)}`);
      }
    }
  } else {
    console.log('=== LOGIN FAILED ===');
    // Document the SSO authentication flow for manual analysis
    const pageContent = await page.evaluate(() => document.body?.innerText?.substring(0, 1000));
    results.push({ status: 'LOGIN_FAILED', url: finalUrl, content: pageContent });
  }
  
  // Generate report
  let report = `# Shopby 관리자 화면 크롤링 리포트 v2\n\n`;
  report += `> 생성일: ${new Date().toISOString()}\n`;
  report += `> 로그인: ${isLoggedIn ? '성공' : '실패 (SSO 인증 필요)'}\n`;
  report += `> 캡처: ${results.length}개 화면\n\n`;
  
  if (isLoggedIn) {
    report += `## 화면 목록\n\n`;
    report += `| # | 화면명 | 테이블 | 폼 | 입력필드 | 버튼 | 탭 | 스크린샷 |\n`;
    report += `|---|--------|--------|-----|---------|------|-----|----------|\n`;
    for (const r of results) {
      report += `| ${results.indexOf(r)+1} | ${r.name} | ${r.tables} | ${r.forms} | ${r.inputs} | ${r.buttons} | ${r.tabs} | ${r.screenshot} |\n`;
    }
    report += `\n## 상세 분석\n\n`;
    for (const r of results) {
      report += `### ${r.name}\n\n`;
      report += `- **URL**: \`${r.url}\`\n`;
      report += `- **타이틀**: ${r.title || 'N/A'}\n`;
      report += `- **제목(H1-H3)**: ${r.h1 || 'N/A'}\n`;
      report += `- **Breadcrumb**: ${r.breadcrumb || 'N/A'}\n`;
      report += `- **UI 구성**: 테이블 ${r.tables}개, 폼 ${r.forms}개, 입력 ${r.inputs}개, 버튼 ${r.buttons}개, 탭 ${r.tabs}개\n`;
      report += `- **스크린샷**: \`${r.screenshot}\`\n\n`;
    }
  } else {
    report += `## 로그인 실패 분석\n\n`;
    report += `shopby 서비스어드민은 2단계 인증 플로우를 사용합니다:\n\n`;
    report += `1. \`service.shopby.co.kr/login\`: shopby 서비스어드민 자체 로그인 폼\n`;
    report += `2. \`accounts.nhn-commerce.com\`: NHN Commerce 통합회원 SSO 인증\n\n`;
    report += `자격증명 "huniprinting"은 1단계에서 입력되지만, 2단계 SSO에서 \n`;
    report += `NHN Commerce 통합계정 자격증명이 별도로 필요할 수 있습니다.\n\n`;
    report += `### 권장 사항\n\n`;
    report += `- NHN Commerce 통합계정 자격증명을 확인하세요 (shopby 계정과 다를 수 있음)\n`;
    report += `- 또는 shopby 어드민에 직접 로그인하여 브라우저 쿠키를 export한 후 Playwright에 주입하세요\n`;
    if (results[0]?.content) {
      report += `\n### 최종 페이지 내용\n\n\`\`\`\n${results[0].content}\n\`\`\`\n`;
    }
  }
  
  fs.writeFileSync(REPORT_PATH, report);
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'results-v2.json'), JSON.stringify(results, null, 2));
  console.log('\nDone. Report:', REPORT_PATH);
  
  await browser.close();
}

main().catch(e => console.error('Fatal:', e.message));
