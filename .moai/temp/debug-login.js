/**
 * 로그인 폼 디버그 스크립트
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = '/Users/innojini/Dev/shopby-skin/.moai/temp/shopby-admin-v3';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 로그인 페이지 이동
  console.log('1. shopby 로그인 페이지...');
  await page.goto('https://service.shopby.co.kr/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug-01-shopby-login.png') });

  // 폼 구조 파악
  const shopbyInputs = await page.evaluate(() => {
    const els = document.querySelectorAll('input');
    return Array.from(els).map(e => ({
      type: e.type,
      name: e.name,
      id: e.id,
      placeholder: e.placeholder,
      visible: e.offsetParent !== null
    }));
  });
  console.log('shopby 폼 inputs:', JSON.stringify(shopbyInputs, null, 2));

  const shopbyButtons = await page.evaluate(() => {
    const els = document.querySelectorAll('button');
    return Array.from(els).map(e => ({
      type: e.type,
      text: e.textContent?.trim(),
      id: e.id,
      class: e.className?.substring(0, 50)
    }));
  });
  console.log('shopby 폼 buttons:', JSON.stringify(shopbyButtons, null, 2));

  // 폼 채우기
  try {
    console.log('\n2. shopby 폼 입력...');
    await page.fill('#username', 'huniprinting');
    await page.fill('#password', 'huni@SANG#6080');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug-02-shopby-filled.png') });

    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    console.log('폼 제출 후 URL:', page.url());
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug-03-after-shopby-submit.png') });
  } catch(e) {
    console.log('폼 오류:', e.message);
  }

  // NHN SSO 페이지 확인
  if (page.url().includes('accounts.nhn-commerce.com')) {
    console.log('\n3. NHN SSO 페이지...');

    // 잠시 대기 후 폼 구조 파악
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug-04-nhn-login.png') });

    const nhnInputs = await page.evaluate(() => {
      const els = document.querySelectorAll('input');
      return Array.from(els).map(e => ({
        type: e.type,
        name: e.name,
        id: e.id,
        placeholder: e.placeholder,
        value: e.value?.substring(0, 20),
        visible: e.offsetParent !== null,
        class: e.className?.substring(0, 50)
      }));
    });
    console.log('NHN SSO inputs:', JSON.stringify(nhnInputs, null, 2));

    const nhnButtons = await page.evaluate(() => {
      const els = document.querySelectorAll('button, input[type="submit"]');
      return Array.from(els).map(e => ({
        tag: e.tagName,
        type: e.type,
        text: e.textContent?.trim(),
        id: e.id,
        class: e.className?.substring(0, 60),
        visible: e.offsetParent !== null
      }));
    });
    console.log('NHN SSO buttons:', JSON.stringify(nhnButtons, null, 2));

    // username 필드가 이미 채워져 있을 수 있음 (shopby에서 전달)
    // password만 입력하면 되는 경우
    const textInputs = await page.locator('input[type="text"]:visible').all();
    const pwInputs = await page.locator('input[type="password"]:visible').all();
    const emailInputs = await page.locator('input[type="email"]:visible').all();

    console.log(`\n텍스트 입력: ${textInputs.length}개, 비밀번호 입력: ${pwInputs.length}개, 이메일 입력: ${emailInputs.length}개`);

    // 현재 값 확인
    for (let i = 0; i < textInputs.length; i++) {
      const val = await textInputs[i].inputValue();
      console.log(`  텍스트[${i}] 현재값: "${val}"`);
    }

    // 입력 시도
    if (textInputs.length > 0) {
      await textInputs[0].clear();
      await textInputs[0].fill('huniprinting');
    } else if (emailInputs.length > 0) {
      await emailInputs[0].clear();
      await emailInputs[0].fill('huniprinting');
    }

    if (pwInputs.length > 0) {
      await pwInputs[0].clear();
      await pwInputs[0].fill('huni@SANG#6080');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug-05-nhn-filled.png') });

    // 로그인 버튼 클릭 - 다양한 방법 시도
    let clicked = false;

    // 방법 1: submit 버튼
    try {
      const submitBtn = page.locator('button[type="submit"]:visible, input[type="submit"]:visible').first();
      if (await submitBtn.isVisible()) {
        console.log('submit 버튼 클릭');
        await submitBtn.click();
        clicked = true;
      }
    } catch(e) {}

    if (!clicked) {
      // 방법 2: 로그인 텍스트 버튼
      const allBtns = await page.locator('button:visible').all();
      for (const btn of allBtns) {
        const text = await btn.textContent();
        console.log('버튼 텍스트:', text?.trim());
        if (text && (text.includes('로그인') || text.includes('Login') || text.includes('로 그 인'))) {
          console.log('로그인 버튼 클릭:', text.trim());
          await btn.click();
          clicked = true;
          break;
        }
      }
    }

    if (!clicked) {
      // 방법 3: Enter 키
      console.log('Enter 키로 제출 시도');
      if (pwInputs.length > 0) {
        await pwInputs[0].press('Enter');
      }
    }

    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    console.log('\n최종 URL:', page.url());
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug-06-final.png') });

    // 페이지 텍스트 확인
    const pageText = await page.evaluate(() => document.body?.innerText?.substring(0, 500));
    console.log('페이지 내용:', pageText?.substring(0, 300));
  }

  await browser.close();
}

main().catch(e => console.error('Fatal:', e.message));
