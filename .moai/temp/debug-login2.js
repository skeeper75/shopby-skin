/**
 * 로그인 폼 디버그 스크립트 v2
 * - btn_login 클래스 버튼 사용
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = '/Users/innojini/Dev/shopby-skin/.moai/temp/shopby-admin-v3';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('1. shopby 로그인 페이지...');
  await page.goto('https://service.shopby.co.kr/login', { waitUntil: 'networkidle', timeout: 30000 });

  // shopby 폼 입력
  await page.fill('#username', 'huniprinting');
  await page.fill('#password', 'huni@SANG#6080');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug2-01-filled.png') });

  // btn_main_login 클래스 버튼 클릭 (첫 번째 = 일반 로그인)
  const loginBtn = page.locator('.btn_main_login').first();
  console.log('로그인 버튼 클릭...');
  await loginBtn.click();
  await page.waitForTimeout(4000);
  console.log('클릭 후 URL:', page.url());
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug2-02-after-click.png') });

  // NHN SSO 처리
  if (page.url().includes('accounts.nhn-commerce.com')) {
    console.log('\n2. NHN SSO 페이지...');
    await page.waitForTimeout(2000);

    // 폼 구조
    const inputs = await page.evaluate(() => {
      const els = document.querySelectorAll('input');
      return Array.from(els).map(e => ({
        type: e.type,
        name: e.name,
        id: e.id,
        placeholder: e.placeholder,
        value: e.value?.substring(0, 30),
        visible: e.offsetParent !== null
      }));
    });
    console.log('SSO inputs:', JSON.stringify(inputs, null, 2));

    const buttons = await page.evaluate(() => {
      const els = document.querySelectorAll('button, input[type="submit"], a[class*="btn"]');
      return Array.from(els).map(e => ({
        tag: e.tagName,
        type: e.type,
        text: e.textContent?.trim()?.substring(0, 50),
        id: e.id,
        class: e.className?.substring(0, 60),
        visible: e.offsetParent !== null
      }));
    });
    console.log('SSO buttons:', JSON.stringify(buttons, null, 2));

    // 입력 채우기
    const textInputs = await page.locator('input[type="text"]:visible').all();
    const pwInputs = await page.locator('input[type="password"]:visible').all();
    const emailInputs = await page.locator('input[type="email"]:visible').all();

    console.log(`\n가시적 입력: 텍스트${textInputs.length} 비밀번호${pwInputs.length} 이메일${emailInputs.length}`);

    if (textInputs.length > 0) {
      const val = await textInputs[0].inputValue();
      console.log('기존 텍스트 값:', val);
      if (!val) await textInputs[0].fill('huniprinting');
    }

    if (pwInputs.length > 0) {
      await pwInputs[0].fill('huni@SANG#6080');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug2-03-sso-filled.png') });

    // 모든 버튼 시도
    const allBtns = await page.locator('button:visible').all();
    console.log(`\n버튼 ${allBtns.length}개:`);
    for (const btn of allBtns) {
      const text = await btn.textContent();
      console.log(' -', text?.trim());
    }

    // 첫 번째 버튼 또는 로그인 버튼 클릭
    let clicked = false;
    for (const btn of allBtns) {
      const text = await btn.textContent();
      if (text && (text.includes('로그인') || text.includes('Login'))) {
        console.log('로그인 버튼 클릭:', text.trim());
        await btn.click();
        clicked = true;
        break;
      }
    }

    if (!clicked && allBtns.length > 0) {
      console.log('첫 번째 버튼 클릭');
      await allBtns[0].click();
      clicked = true;
    }

    if (!clicked) {
      console.log('Enter 키 시도');
      await page.keyboard.press('Enter');
    }

    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    console.log('\n최종 URL:', page.url());
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug2-04-final.png') });

    const pageTitle = await page.title();
    const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 300));
    console.log('제목:', pageTitle);
    console.log('내용:', bodyText?.substring(0, 200));
  }

  await browser.close();
}

main().catch(e => console.error('Fatal:', e.message));
