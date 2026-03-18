/**
 * 쇼핑바이 관리자 사이드바 메뉴 크롤러
 * 1depth → 2depth → 3depth 메뉴 구조를 탐색하여 JSON으로 저장합니다.
 *
 * @MX:ANCHOR index.js 파이프라인의 두 번째 단계 - 메뉴 지도 생성
 */

'use strict';

const fs = require('fs');
const path = require('path');

const MENU_MAP_OUTPUT = path.join(__dirname, '../../ref/shopby/admin-analysis/menu-map.json');

/**
 * 메뉴 아이템의 카테고리를 URL 또는 텍스트로부터 추론합니다.
 * @param {string} title
 * @param {string} url
 * @returns {string}
 */
function inferCategory(title, url) {
  const categoryMap = {
    '상품': '상품관리',
    'product': '상품관리',
    '주문': '주문관리',
    'order': '주문관리',
    '회원': '회원관리',
    'member': '회원관리',
    '게시판': '게시판관리',
    'board': '게시판관리',
    '쿠폰': '프로모션',
    'coupon': '프로모션',
    '프로모션': '프로모션',
    'promotion': '프로모션',
    '정산': '정산관리',
    'settle': '정산관리',
    '배송': '배송관리',
    'delivery': '배송관리',
    '통계': '통계',
    'statistics': '통계',
    '설정': '설정',
    'setting': '설정',
    '디자인': '디자인',
    'design': '디자인',
  };

  const searchText = (title + ' ' + url).toLowerCase();

  for (const [keyword, category] of Object.entries(categoryMap)) {
    if (searchText.includes(keyword.toLowerCase())) {
      return category;
    }
  }

  return '기타';
}

/**
 * @MX:NOTE 사이드바 DOM 구조는 shopby admin의 버전에 따라 다를 수 있음
 * 여러 패턴의 셀렉터를 시도하여 호환성을 유지합니다.
 *
 * 사이드바에서 1depth 메뉴를 추출합니다.
 * @param {import('playwright').Page} page
 * @returns {Promise<Array>}
 */
async function extractDepth1Menus(page) {
  // 일반적인 관리자 사이드바 셀렉터 패턴
  const sidebarSelectors = [
    '.sidebar',
    '.lnb',
    '.gnb',
    '#sidebar',
    'nav.admin-nav',
    '.admin-menu',
    '[class*="sidebar"]',
    '[class*="gnb"]',
    '[class*="lnb"]',
  ];

  let sidebar = null;
  for (const selector of sidebarSelectors) {
    sidebar = await page.$(selector);
    if (sidebar) {
      console.log(`[메뉴 탐색] 사이드바 발견: ${selector}`);
      break;
    }
  }

  if (!sidebar) {
    console.warn('[메뉴 탐색 경고] 사이드바를 찾을 수 없습니다. 전체 네비게이션을 탐색합니다.');
  }

  // 1depth 메뉴 항목 추출
  const depth1Selectors = [
    '.sidebar > ul > li',
    '.lnb > ul > li',
    '.gnb > ul > li',
    'nav > ul > li',
    '.menu-list > li',
    '[class*="nav-item"]',
    '.sidebar-menu > li',
  ];

  let depth1Items = [];
  for (const selector of depth1Selectors) {
    depth1Items = await page.$$(selector);
    if (depth1Items.length > 0) {
      console.log(`[메뉴 탐색] 1depth 메뉴 ${depth1Items.length}개 발견 (셀렉터: ${selector})`);
      break;
    }
  }

  if (depth1Items.length === 0) {
    // 폴백: 모든 네비게이션 링크 수집
    depth1Items = await page.$$('a[href]:not([href="#"])');
    console.warn(`[메뉴 탐색] 폴백으로 ${depth1Items.length}개 링크 수집`);
  }

  return depth1Items;
}

/**
 * @MX:NOTE 하위 메뉴 항목을 재귀적으로 탐색합니다.
 * 최대 3depth까지만 처리합니다.
 *
 * @param {import('playwright').ElementHandle} menuItem - 메뉴 요소
 * @param {number} depth - 현재 depth (1부터 시작)
 * @param {string} parentTitle - 부모 메뉴 제목
 * @returns {Promise<Array<Object>>}
 */
async function extractMenuChildren(menuItem, depth, parentTitle) {
  const results = [];

  try {
    // 링크 요소 찾기
    const linkEl = await menuItem.$('a');
    if (!linkEl) return results;

    const title = (await linkEl.textContent())?.trim() || '';
    const href = (await linkEl.getAttribute('href')) || '';

    if (!title || title.length === 0) return results;

    const url = href.startsWith('http') ? href : href;
    const category = inferCategory(title, url);

    const menuData = {
      title,
      url,
      depth,
      parentTitle: parentTitle || null,
      category,
    };

    results.push(menuData);

    // 3depth까지만 처리
    if (depth < 3) {
      const childSelectors = ['> ul > li', '> .sub-menu > li', '> .dropdown > li', '> [class*="sub"] > li'];

      for (const childSelector of childSelectors) {
        const children = await menuItem.$$(childSelector);
        if (children.length > 0) {
          for (const child of children) {
            const childMenus = await extractMenuChildren(child, depth + 1, title);
            results.push(...childMenus);
          }
          break;
        }
      }
    }
  } catch (error) {
    console.error(`[메뉴 추출 오류] depth ${depth}: ${error.message}`);
  }

  return results;
}

/**
 * 동적으로 렌더링되는 메뉴를 클릭하여 하위 메뉴를 펼칩니다.
 * @param {import('playwright').Page} page
 * @param {import('playwright').ElementHandle} menuItem
 */
async function expandMenuItem(page, menuItem) {
  try {
    const toggleEl = await menuItem.$('[class*="toggle"], [class*="expand"], [class*="arrow"], > a');
    if (toggleEl) {
      await toggleEl.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(500);
    }
  } catch (error) {
    // 클릭 실패는 무시 (이미 열려있거나 하위 메뉴 없음)
  }
}

/**
 * URL 목록에서 링크를 직접 스크랩하는 폴백 방법
 * @param {import('playwright').Page} page
 * @returns {Promise<Array<Object>>}
 */
async function extractMenusFromLinks(page) {
  const links = await page.evaluate(() => {
    const anchors = document.querySelectorAll('a[href]');
    const results = [];

    anchors.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent?.trim() || '';

      // 의미 있는 링크만 수집 (빈 텍스트, javascript:, # 제외)
      if (text && href && !href.startsWith('javascript:') && href !== '#' && href !== '/') {
        // 네비게이션 맥락 파악
        const li = a.closest('li');
        const depth =
          li
            ? (() => {
              let d = 1;
              let parent = li.parentElement;
              while (parent) {
                if (parent.tagName === 'LI') d++;
                parent = parent.parentElement;
                if (d > 5) break;
              }
              return d;
            })()
            : 1;

        results.push({ title: text, url: href, depth, raw: true });
      }
    });

    return results;
  });

  return links;
}

/**
 * 사이드바 메뉴를 크롤링하여 메뉴 구조를 반환하고 JSON 파일로 저장합니다.
 *
 * @MX:ANCHOR index.js 파이프라인에서 호출되는 공개 함수
 * @param {import('playwright').Page} page - 인증된 페이지 객체
 * @returns {Promise<Array<Object>>} 메뉴 배열 (title, url, depth, parentTitle, category)
 */
async function crawlMenus(page) {
  console.log('\n[메뉴 크롤링 시작]');

  await page.waitForLoadState('networkidle', { timeout: 30_000 });

  let allMenus = [];

  try {
    const depth1Items = await extractDepth1Menus(page);

    if (depth1Items.length === 0) {
      console.warn('[메뉴 크롤링] DOM 기반 탐색 실패, 링크 스크랩으로 전환');
      allMenus = await extractMenusFromLinks(page);
    } else {
      // 각 1depth 메뉴 항목 처리
      for (let i = 0; i < depth1Items.length; i++) {
        const item = depth1Items[i];

        // 하위 메뉴 펼치기
        await expandMenuItem(page, item);

        const menus = await extractMenuChildren(item, 1, null);
        allMenus.push(...menus);
      }
    }
  } catch (error) {
    console.error(`[메뉴 크롤링 오류] ${error.message}`);
    // 폴백: 링크 기반 스크랩
    allMenus = await extractMenusFromLinks(page);
  }

  // 중복 URL 제거
  const uniqueMenus = allMenus.filter(
    (menu, index, self) => index === self.findIndex((m) => m.url === menu.url && m.title === menu.title),
  );

  // 카테고리 재추론 (raw 방식으로 수집된 경우)
  const processedMenus = uniqueMenus.map((menu) => ({
    ...menu,
    category: menu.category || inferCategory(menu.title, menu.url),
  }));

  console.log(`[메뉴 크롤링 완료] 총 ${processedMenus.length}개 메뉴 항목 수집`);

  // JSON 저장
  const outputDir = path.dirname(MENU_MAP_OUTPUT);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    MENU_MAP_OUTPUT,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        totalCount: processedMenus.length,
        menus: processedMenus,
      },
      null,
      2,
    ),
    'utf-8',
  );

  console.log(`[메뉴 저장 완료] ${MENU_MAP_OUTPUT}`);

  return processedMenus;
}

module.exports = { crawlMenus };
