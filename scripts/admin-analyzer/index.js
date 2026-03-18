/**
 * 쇼핑바이 관리자 페이지 자동 분석기 - 메인 엔트리포인트
 *
 * 사용법:
 *   node scripts/admin-analyzer/index.js [옵션]
 *
 * 옵션:
 *   --crawl-only      메뉴 크롤링만 실행 (스크린샷/DOM 분석 제외)
 *   --screenshot-only 스크린샷 캡처만 실행 (기존 menu-map.json 필요)
 *   --analyze-only    DOM 분석만 실행 (기존 menu-map.json 필요)
 *   --all             전체 파이프라인 실행 (기본값)
 *
 * 환경변수:
 *   SHOPBY_ADMIN_URL  관리자 URL
 *   SHOPBY_ADMIN_ID   관리자 아이디
 *   SHOPBY_ADMIN_PW   관리자 비밀번호
 *
 * @MX:ANCHOR 전체 분석 파이프라인의 진입점
 */

'use strict';

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const { login } = require('./login');
const { crawlMenus } = require('./crawl');
const { captureScreenshots } = require('./screenshot');
const { analyzeAllPages } = require('./dom-analyzer');

const MENU_MAP_PATH = path.join(__dirname, '../../ref/shopby/admin-analysis/menu-map.json');
const VIEWPORT = { width: 1920, height: 1080 };

/**
 * 명령줄 인자를 파싱하여 실행 모드를 결정합니다.
 * @returns {{ crawlOnly: boolean, screenshotOnly: boolean, analyzeOnly: boolean }}
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    crawlOnly: args.includes('--crawl-only'),
    screenshotOnly: args.includes('--screenshot-only'),
    analyzeOnly: args.includes('--analyze-only'),
    all: args.includes('--all') || args.length === 0,
  };
}

/**
 * 기존 menu-map.json을 로드합니다.
 * @returns {Array<Object>}
 */
function loadExistingMenuMap() {
  if (!fs.existsSync(MENU_MAP_PATH)) {
    throw new Error(`menu-map.json 파일이 없습니다: ${MENU_MAP_PATH}\n먼저 --crawl-only 옵션으로 메뉴를 크롤링해주세요.`);
  }

  const data = JSON.parse(fs.readFileSync(MENU_MAP_PATH, 'utf-8'));
  const menus = data.menus || data;

  if (!Array.isArray(menus) || menus.length === 0) {
    throw new Error('menu-map.json에 메뉴 데이터가 없습니다.');
  }

  console.log(`[메뉴 맵 로드] ${menus.length}개 항목`);
  return menus;
}

/**
 * @MX:WARN 브라우저 인스턴스는 반드시 finally 블록에서 닫아야 합니다.
 * @MX:REASON 브라우저가 닫히지 않으면 프로세스가 종료되지 않고 메모리 누수 발생
 *
 * 전체 파이프라인을 실행합니다: 로그인 → 크롤 → 스크린샷 → DOM 분석
 */
async function runPipeline() {
  const args = parseArgs();
  const mode = args.crawlOnly
    ? 'crawl-only'
    : args.screenshotOnly
      ? 'screenshot-only'
      : args.analyzeOnly
        ? 'analyze-only'
        : 'all';

  console.log('='.repeat(60));
  console.log('쇼핑바이 관리자 페이지 자동 분석기');
  console.log(`실행 모드: ${mode}`);
  console.log('='.repeat(60));

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let page = null;

  try {
    // 로그인 (모든 모드에서 필요)
    console.log('\n[1단계] 관리자 로그인');
    page = await login(browser);

    // 뷰포트 설정
    await page.setViewportSize(VIEWPORT);

    let menuItems = [];

    // 메뉴 크롤링
    if (args.all || args.crawlOnly) {
      console.log('\n[2단계] 메뉴 구조 크롤링');
      menuItems = await crawlMenus(page);
    } else {
      // 기존 menu-map.json 로드
      menuItems = loadExistingMenuMap();
    }

    // 스크린샷 캡처
    if (args.all || args.screenshotOnly) {
      if (menuItems.length === 0 && (args.screenshotOnly || args.analyzeOnly)) {
        menuItems = loadExistingMenuMap();
      }
      console.log('\n[3단계] 페이지 스크린샷 캡처');
      const screenshotResults = await captureScreenshots(page, menuItems);
      console.log(`\n스크린샷 결과: 성공 ${screenshotResults.success}개, 실패 ${screenshotResults.failed}개`);
    }

    // DOM 분석
    if (args.all || args.analyzeOnly) {
      if (menuItems.length === 0) {
        menuItems = loadExistingMenuMap();
      }
      console.log('\n[4단계] DOM 구조 분석');
      const analysisResults = await analyzeAllPages(page, menuItems);
      console.log(`\nDOM 분석 결과: ${analysisResults.length}개 페이지 완료`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('분석 완료!');
    console.log('결과물 위치:');
    console.log('  메뉴 맵: ref/shopby/admin-analysis/menu-map.json');
    console.log('  스크린샷: ref/shopby/admin-screenshots/');
    console.log('  DOM 분석: ref/shopby/admin-analysis/pages/');
    console.log('='.repeat(60));
  } catch (error) {
    console.error(`\n[파이프라인 오류] ${error.message}`);
    process.exitCode = 1;
  } finally {
    // 브라우저 정리
    if (page) {
      await page.close().catch(() => {});
    }
    await browser.close().catch(() => {});
    console.log('\n[브라우저 종료 완료]');
  }
}

// 실행
runPipeline();
