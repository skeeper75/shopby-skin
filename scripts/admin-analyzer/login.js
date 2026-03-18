/**
 * 쇼핑바이 관리자 로그인 모듈
 * 환경변수에서 인증 정보를 읽어 로그인 후 인증된 페이지 객체를 반환합니다.
 *
 * @MX:ANCHOR 인증 플로우의 진입점 - index.js에서 직접 호출됨
 */

'use strict';

const MAX_RETRY_COUNT = 3;
const LOGIN_TIMEOUT_MS = 30_000;

/**
 * 환경변수에서 인증 정보를 로드합니다.
 * @returns {{ adminUrl: string, adminId: string, adminPw: string }}
 */
function loadCredentials() {
  const adminUrl = process.env.SHOPBY_ADMIN_URL;
  const adminId = process.env.SHOPBY_ADMIN_ID;
  const adminPw = process.env.SHOPBY_ADMIN_PW;

  if (!adminUrl || !adminId || !adminPw) {
    throw new Error(
      '환경변수가 설정되지 않았습니다. SHOPBY_ADMIN_URL, SHOPBY_ADMIN_ID, SHOPBY_ADMIN_PW를 설정해주세요.',
    );
  }

  return { adminUrl, adminId, adminPw };
}

/**
 * 로그인 페이지에서 폼을 채우고 제출합니다.
 * @param {import('playwright').Page} page
 * @param {string} adminUrl
 * @param {string} adminId
 * @param {string} adminPw
 */
async function performLogin(page, adminUrl, adminId, adminPw) {
  await page.goto(adminUrl, { timeout: LOGIN_TIMEOUT_MS });

  // 로그인 폼 필드 탐지 - 다양한 셀렉터 시도
  const idSelectors = [
    'input[name="adminId"]',
    'input[name="userId"]',
    'input[name="id"]',
    'input[type="text"]:first-of-type',
    '#adminId',
    '#userId',
  ];

  const pwSelectors = [
    'input[name="adminPassword"]',
    'input[name="password"]',
    'input[type="password"]',
    '#adminPassword',
    '#password',
  ];

  let idInput = null;
  for (const selector of idSelectors) {
    idInput = await page.$(selector);
    if (idInput) break;
  }

  let pwInput = null;
  for (const selector of pwSelectors) {
    pwInput = await page.$(selector);
    if (pwInput) break;
  }

  if (!idInput) {
    throw new Error('로그인 페이지에서 아이디 입력 필드를 찾을 수 없습니다.');
  }
  if (!pwInput) {
    throw new Error('로그인 페이지에서 비밀번호 입력 필드를 찾을 수 없습니다.');
  }

  await idInput.fill(adminId);
  await pwInput.fill(adminPw);

  // 로그인 버튼 클릭 또는 폼 제출
  const submitSelectors = [
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("로그인")',
    'button:has-text("Login")',
    '.btn-login',
    '#btnLogin',
  ];

  let submitted = false;
  for (const selector of submitSelectors) {
    const btn = await page.$(selector);
    if (btn) {
      await btn.click();
      submitted = true;
      break;
    }
  }

  if (!submitted) {
    // 폼 직접 제출 시도
    await pwInput.press('Enter');
  }
}

/**
 * 로그인 성공 여부를 확인합니다.
 * 대시보드 URL로 리다이렉트되거나 대시보드 요소가 존재하면 성공으로 판단합니다.
 * @param {import('playwright').Page} page
 * @param {string} adminUrl
 * @returns {Promise<boolean>}
 */
async function verifyLoginSuccess(page, adminUrl) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 15_000 });

    const currentUrl = page.url();

    // URL이 로그인 페이지에서 변경되었는지 확인
    const loginPagePatterns = ['/login', '/signin', '/auth'];
    const isOnLoginPage = loginPagePatterns.some((pattern) => currentUrl.includes(pattern));

    if (!isOnLoginPage && currentUrl !== adminUrl) {
      console.log(`[로그인 성공] 현재 URL: ${currentUrl}`);
      return true;
    }

    // 대시보드 특유의 요소 확인
    const dashboardSelectors = ['.sidebar', '.gnb', '.lnb', '#sidebar', '.admin-layout', '.dashboard'];

    for (const selector of dashboardSelectors) {
      const element = await page.$(selector);
      if (element) {
        console.log(`[로그인 성공] 대시보드 요소 감지: ${selector}`);
        return true;
      }
    }

    // 에러 메시지 존재 확인
    const errorSelectors = ['.error-message', '.alert-danger', '.login-error', '[class*="error"]'];

    for (const selector of errorSelectors) {
      const element = await page.$(selector);
      if (element) {
        const errorText = await element.textContent();
        console.error(`[로그인 실패] 에러 메시지: ${errorText?.trim()}`);
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error(`[로그인 검증 오류] ${error.message}`);
    return false;
  }
}

/**
 * 쇼핑바이 관리자 페이지에 로그인합니다.
 * 최대 3회 재시도하며, 인증된 page 객체를 반환합니다.
 *
 * @MX:ANCHOR index.js의 메인 파이프라인에서 호출되는 공개 함수
 * @param {import('playwright').Browser} browser - Playwright 브라우저 인스턴스
 * @returns {Promise<import('playwright').Page>} 인증된 페이지 객체
 */
async function login(browser) {
  const { adminUrl, adminId, adminPw } = loadCredentials();

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRY_COUNT; attempt++) {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();

    try {
      console.log(`[로그인 시도 ${attempt}/${MAX_RETRY_COUNT}] ${adminUrl}`);

      await performLogin(page, adminUrl, adminId, adminPw);
      const success = await verifyLoginSuccess(page, adminUrl);

      if (success) {
        console.log('[로그인 완료] 인증된 세션이 시작되었습니다.');
        return page;
      }

      throw new Error('로그인 검증 실패 - 대시보드로 이동하지 못했습니다.');
    } catch (error) {
      lastError = error;
      console.error(`[로그인 실패 ${attempt}/${MAX_RETRY_COUNT}] ${error.message}`);
      await page.close().catch(() => {});
      await context.close().catch(() => {});

      if (attempt < MAX_RETRY_COUNT) {
        // 재시도 전 2초 대기
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  throw new Error(`로그인 최대 재시도 횟수(${MAX_RETRY_COUNT}회) 초과: ${lastError?.message}`);
}

module.exports = { login };
