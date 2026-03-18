/**
 * 쇼핑바이 관리자 페이지 스크린샷 캡처 모듈
 * 메뉴 목록의 각 URL을 방문하여 전체 페이지 스크린샷을 저장합니다.
 *
 * @MX:ANCHOR index.js 파이프라인의 세 번째 단계 - 스크린샷 수집
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SCREENSHOTS_BASE = path.join(__dirname, '../../ref/shopby/admin-screenshots');
const PAGE_TIMEOUT_MS = 30_000;
const PAGE_DELAY_MS = 2_000;

/**
 * 파일 시스템에 안전한 파일명으로 변환합니다.
 * @param {string} name
 * @returns {string}
 */
function toSafeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .toLowerCase();
}

/**
 * 카테고리별 스크린샷 저장 디렉토리를 생성합니다.
 * @param {string} category
 * @returns {string} 디렉토리 경로
 */
function ensureCategoryDir(category) {
  const safeCategory = toSafeFilename(category || '기타');
  const dirPath = path.join(SCREENSHOTS_BASE, safeCategory);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
}

/**
 * @MX:WARN 페이지 방문 시 타임아웃이 발생할 수 있습니다.
 * @MX:REASON 관리자 페이지는 대용량 데이터를 로딩하는 경우가 많아 networkidle 대기 시간이 길어질 수 있음
 *
 * 단일 페이지를 방문하여 스크린샷을 캡처합니다.
 * @param {import('playwright').Page} page
 * @param {Object} menuItem - { title, url, category }
 * @param {string} outputPath - 저장할 파일 경로
 * @returns {Promise<boolean>} 성공 여부
 */
async function captureSinglePage(page, menuItem, outputPath) {
  try {
    await page.goto(menuItem.url, {
      timeout: PAGE_TIMEOUT_MS,
      waitUntil: 'networkidle',
    });

    // 페이지 로딩 안정화 대기
    await page.waitForTimeout(1000);

    // 전체 페이지 스크린샷
    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });

    return true;
  } catch (error) {
    if (error.message.includes('Timeout') || error.message.includes('timeout')) {
      console.warn(`[타임아웃 스킵] ${menuItem.title} (${menuItem.url})`);
    } else {
      console.error(`[캡처 실패] ${menuItem.title}: ${error.message}`);
    }
    return false;
  }
}

/**
 * 메뉴 항목 목록의 각 페이지를 방문하여 전체 페이지 스크린샷을 저장합니다.
 * 각 페이지 방문 사이에 2초 딜레이를 적용합니다.
 *
 * @MX:ANCHOR index.js 파이프라인에서 호출되는 공개 함수
 * @param {import('playwright').Page} page - 인증된 페이지 객체
 * @param {Array<Object>} menuItems - crawlMenus()로 반환된 메뉴 배열
 * @returns {Promise<Object>} { success: number, failed: number, skipped: number, failures: Array }
 */
async function captureScreenshots(page, menuItems) {
  console.log(`\n[스크린샷 캡처 시작] 총 ${menuItems.length}개 페이지`);

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    failures: [],
  };

  // URL이 없거나 유효하지 않은 항목 필터링
  const validItems = menuItems.filter((item) => {
    if (!item.url || item.url === '#' || item.url.startsWith('javascript:')) {
      results.skipped++;
      return false;
    }
    return true;
  });

  console.log(`[스크린샷 대상] ${validItems.length}개 유효 페이지`);

  for (let i = 0; i < validItems.length; i++) {
    const menuItem = validItems[i];
    const progress = `[${i + 1}/${validItems.length}]`;
    const breadcrumb = menuItem.parentTitle ? `${menuItem.parentTitle} > ${menuItem.title}` : menuItem.title;

    // 카테고리 디렉토리 생성
    const categoryDir = ensureCategoryDir(menuItem.category);
    const safeTitle = toSafeFilename(menuItem.title);
    const outputPath = path.join(categoryDir, `${safeTitle}.png`);

    console.log(`${progress} ${breadcrumb} 캡처 중...`);

    const success = await captureSinglePage(page, menuItem, outputPath);

    if (success) {
      results.success++;
      console.log(`${progress} ${breadcrumb} 캡처 완료`);
    } else {
      results.failed++;
      results.failures.push({ title: menuItem.title, url: menuItem.url });
    }

    // 페이지 간 2초 딜레이 (마지막 페이지 제외)
    if (i < validItems.length - 1) {
      await page.waitForTimeout(PAGE_DELAY_MS);
    }
  }

  console.log('\n[스크린샷 캡처 완료]');
  console.log(`  성공: ${results.success}개`);
  console.log(`  실패: ${results.failed}개`);
  console.log(`  스킵: ${results.skipped}개`);

  if (results.failures.length > 0) {
    console.log('\n[실패 목록]');
    results.failures.forEach((f) => console.log(`  - ${f.title}: ${f.url}`));
  }

  return results;
}

module.exports = { captureScreenshots };
