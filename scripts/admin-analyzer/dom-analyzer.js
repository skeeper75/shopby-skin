/**
 * 쇼핑바이 관리자 페이지 DOM 분석 모듈
 * 각 페이지의 검색 폼, 데이터 테이블, 액션 버튼 등 UI 요소를 추출합니다.
 *
 * @MX:ANCHOR index.js 파이프라인의 네 번째 단계 - DOM 구조 분석
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ANALYSIS_PAGES_BASE = path.join(__dirname, '../../ref/shopby/admin-analysis/pages');
const PAGE_TIMEOUT_MS = 30_000;
const PAGE_DELAY_MS = 2_000;

/**
 * 파일 시스템에 안전한 이름으로 변환합니다.
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
 * @MX:NOTE DOM 파싱 핵심 로직 - 페이지 컨텍스트(브라우저)에서 실행됩니다.
 * page.evaluate() 내부 함수이므로 Node.js 모듈을 사용할 수 없습니다.
 *
 * 브라우저 컨텍스트에서 페이지 제목을 추출합니다.
 * @returns {string}
 */
function extractPageTitleBrowser() {
  // h1, h2, breadcrumb 순서로 시도
  const titleSelectors = [
    'h1',
    'h2',
    '.breadcrumb li:last-child',
    '.page-title',
    '.title',
    '[class*="page-title"]',
    '[class*="header-title"]',
  ];

  for (const selector of titleSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      const text = el.textContent?.trim();
      if (text && text.length > 0 && text.length < 100) {
        return text;
      }
    }
  }

  return document.title || '';
}

/**
 * @MX:NOTE 검색 폼 필드 추출 로직
 * 관리자 페이지의 검색 영역에서 input, select, datepicker 요소를 수집합니다.
 * @returns {Array<Object>}
 */
function extractSearchFieldsBrowser() {
  const searchFields = [];

  // 검색 폼 영역 탐지
  const searchContainerSelectors = [
    'form.search-form',
    '.search-area',
    '.filter-area',
    '#searchForm',
    '[class*="search-box"]',
    '[class*="filter"]',
    'fieldset',
  ];

  let searchContainer = null;
  for (const selector of searchContainerSelectors) {
    searchContainer = document.querySelector(selector);
    if (searchContainer) break;
  }

  const container = searchContainer || document.body;

  // 검색 입력 필드 수집
  const inputs = container.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
  inputs.forEach((input) => {
    const label = findLabelForInput(input);
    searchFields.push({
      type: 'input',
      inputType: input.type || 'text',
      name: input.name || input.id || '',
      placeholder: input.placeholder || '',
      label: label,
    });
  });

  // 셀렉트 박스 수집
  const selects = container.querySelectorAll('select');
  selects.forEach((select) => {
    const label = findLabelForInput(select);
    const options = Array.from(select.options).map((opt) => opt.text?.trim()).filter(Boolean).slice(0, 10);
    searchFields.push({
      type: 'select',
      name: select.name || select.id || '',
      label: label,
      optionCount: select.options.length,
      sampleOptions: options,
    });
  });

  // 날짜 선택기 탐지
  const datepickers = container.querySelectorAll('[class*="datepicker"], [class*="date-picker"], [data-type="date"]');
  datepickers.forEach((dp) => {
    const label = dp.closest('td, div')?.querySelector('label, th')?.textContent?.trim() || '';
    searchFields.push({
      type: 'datepicker',
      label: label,
      class: dp.className,
    });
  });

  return searchFields;
}

/**
 * 입력 요소에 연결된 레이블 텍스트를 찾습니다.
 * @param {Element} inputEl
 * @returns {string}
 */
function findLabelForInput(inputEl) {
  // for 속성으로 연결된 label
  if (inputEl.id) {
    const label = document.querySelector(`label[for="${inputEl.id}"]`);
    if (label) return label.textContent?.trim() || '';
  }

  // 부모 요소에서 label/th 탐색
  const parent = inputEl.closest('td, div, tr, li');
  if (parent) {
    const prevTh = parent.previousElementSibling;
    if (prevTh && (prevTh.tagName === 'TH' || prevTh.tagName === 'TD')) {
      return prevTh.textContent?.trim() || '';
    }
    const label = parent.querySelector('label');
    if (label && label !== inputEl) return label.textContent?.trim() || '';
  }

  return '';
}

/**
 * @MX:NOTE 데이터 테이블 컬럼 헤더 추출
 * 목록형 관리자 페이지의 테이블 구조를 파악합니다.
 * @returns {Array<string>}
 */
function extractTableHeadersBrowser() {
  const headers = [];

  // 테이블 헤더 셀 수집
  const thSelectors = ['table thead th', 'table tr:first-child th', '.data-grid th', '[class*="table"] th'];

  for (const selector of thSelectors) {
    const ths = document.querySelectorAll(selector);
    if (ths.length > 0) {
      ths.forEach((th) => {
        const text = th.textContent?.trim();
        if (text && text.length > 0 && text.length < 50) {
          headers.push(text);
        }
      });
      if (headers.length > 0) break;
    }
  }

  return [...new Set(headers)]; // 중복 제거
}

/**
 * @MX:NOTE 액션 버튼 추출 로직
 * 등록, 수정, 삭제, 엑셀 다운로드 등 주요 액션을 식별합니다.
 * @returns {Array<Object>}
 */
function extractActionButtonsBrowser() {
  const buttons = [];
  const actionKeywords = [
    '등록',
    '수정',
    '삭제',
    '저장',
    '취소',
    '확인',
    '검색',
    '초기화',
    '엑셀',
    'excel',
    'Excel',
    '다운로드',
    'download',
    '업로드',
    'upload',
    '복사',
    '이동',
    '발송',
    '승인',
    '거절',
    '처리',
    '출력',
    '인쇄',
  ];

  const buttonEls = document.querySelectorAll('button, input[type="button"], input[type="submit"], a.btn, a[class*="btn"]');

  buttonEls.forEach((btn) => {
    const text = btn.textContent?.trim() || btn.value?.trim() || '';
    if (text.length === 0 || text.length > 30) return;

    const isActionButton = actionKeywords.some((kw) => text.includes(kw));
    if (!isActionButton && !btn.classList.toString().includes('btn')) return;

    buttons.push({
      text: text,
      type: btn.tagName === 'INPUT' ? btn.type : 'button',
      class: btn.className?.toString().slice(0, 50) || '',
    });
  });

  // 중복 제거 (텍스트 기준)
  return buttons.filter((btn, index, self) => index === self.findIndex((b) => b.text === btn.text));
}

/**
 * @MX:NOTE 탭 네비게이션 레이블 추출
 * 페이지 내 탭 UI 구조를 파악합니다.
 * @returns {Array<string>}
 */
function extractTabLabelsBrowser() {
  const tabSelectors = [
    '.tab-list li',
    '.tabs li',
    '[role="tab"]',
    '.nav-tabs li',
    '[class*="tab-item"]',
    '[class*="tab-btn"]',
  ];

  for (const selector of tabSelectors) {
    const tabs = document.querySelectorAll(selector);
    if (tabs.length > 1) {
      return Array.from(tabs)
        .map((tab) => tab.textContent?.trim())
        .filter((text) => text && text.length > 0 && text.length < 30);
    }
  }

  return [];
}

/**
 * @MX:NOTE 모달/팝업 트리거 탐지
 * 페이지에서 팝업을 열 수 있는 요소를 식별합니다.
 * @returns {Array<Object>}
 */
function extractModalTriggersBrowser() {
  const triggers = [];
  const modalAttrs = ['data-toggle="modal"', 'data-bs-toggle="modal"'];

  // data 속성으로 모달 트리거 탐지
  const dataModalEls = document.querySelectorAll('[data-toggle="modal"], [data-bs-toggle="modal"]');
  dataModalEls.forEach((el) => {
    triggers.push({
      text: el.textContent?.trim() || '',
      target: el.getAttribute('data-target') || el.getAttribute('data-bs-target') || '',
    });
  });

  // onclick 팝업 패턴 탐지
  const onclickEls = document.querySelectorAll('[onclick*="open"], [onclick*="popup"], [onclick*="layer"]');
  onclickEls.forEach((el) => {
    const text = el.textContent?.trim() || '';
    if (text.length > 0 && text.length < 30) {
      triggers.push({ text, type: 'onclick-popup' });
    }
  });

  return triggers.filter((t, i, self) => i === self.findIndex((s) => s.text === t.text));
}

/**
 * 단일 페이지의 DOM 구조를 분석하고 JSON 파일로 저장합니다.
 *
 * @MX:ANCHOR index.js 파이프라인에서 호출되는 공개 함수
 * @param {import('playwright').Page} page - 인증된 페이지 객체
 * @param {Object} menuItem - { title, url, depth, parentTitle, category }
 * @returns {Promise<Object|null>} 분석 결과 또는 null (실패 시)
 */
async function analyzeDom(page, menuItem) {
  try {
    await page.goto(menuItem.url, {
      timeout: PAGE_TIMEOUT_MS,
      waitUntil: 'networkidle',
    });

    await page.waitForTimeout(1000);

    // 브라우저 컨텍스트에서 DOM 분석 실행
    const domData = await page.evaluate(() => {
      // 인라인 함수 정의 (page.evaluate는 별도 컨텍스트에서 실행됨)

      function findLabelForInputInline(inputEl) {
        if (inputEl.id) {
          const label = document.querySelector(`label[for="${inputEl.id}"]`);
          if (label) return label.textContent?.trim() || '';
        }
        const parent = inputEl.closest('td, div, tr, li');
        if (parent) {
          const prevTh = parent.previousElementSibling;
          if (prevTh && (prevTh.tagName === 'TH' || prevTh.tagName === 'TD')) {
            return prevTh.textContent?.trim() || '';
          }
          const label = parent.querySelector('label');
          if (label && label !== inputEl) return label.textContent?.trim() || '';
        }
        return '';
      }

      // 페이지 제목 추출
      let pageTitle = '';
      const titleSelectors = ['h1', 'h2', '.breadcrumb li:last-child', '.page-title', '.title'];
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          const text = el.textContent?.trim();
          if (text && text.length > 0 && text.length < 100) {
            pageTitle = text;
            break;
          }
        }
      }

      // 검색 폼 필드 추출
      const searchFields = [];
      const container = document.querySelector('form.search-form, .search-area, .filter-area, #searchForm') || document.body;

      container.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])').forEach((input) => {
        searchFields.push({
          type: 'input',
          inputType: input.type || 'text',
          name: input.name || input.id || '',
          placeholder: input.placeholder || '',
          label: findLabelForInputInline(input),
        });
      });

      container.querySelectorAll('select').forEach((select) => {
        const options = Array.from(select.options).map((o) => o.text?.trim()).filter(Boolean).slice(0, 10);
        searchFields.push({
          type: 'select',
          name: select.name || select.id || '',
          label: findLabelForInputInline(select),
          optionCount: select.options.length,
          sampleOptions: options,
        });
      });

      container.querySelectorAll('[class*="datepicker"], [class*="date-picker"]').forEach((dp) => {
        const label = dp.closest('td, div')?.querySelector('label, th')?.textContent?.trim() || '';
        searchFields.push({ type: 'datepicker', label });
      });

      // 테이블 헤더 추출
      const tableHeaders = [];
      for (const sel of ['table thead th', 'table tr:first-child th', '.data-grid th']) {
        const ths = document.querySelectorAll(sel);
        if (ths.length > 0) {
          ths.forEach((th) => {
            const text = th.textContent?.trim();
            if (text && text.length > 0 && text.length < 50) tableHeaders.push(text);
          });
          break;
        }
      }

      // 액션 버튼 추출
      const actionKeywords = ['등록', '수정', '삭제', '저장', '취소', '검색', '초기화', '엑셀', '다운로드', '업로드', '발송', '승인', '처리'];
      const actionButtons = [];
      document.querySelectorAll('button, input[type="button"], input[type="submit"], a.btn').forEach((btn) => {
        const text = btn.textContent?.trim() || btn.value?.trim() || '';
        if (text.length > 0 && text.length < 30) {
          const isAction = actionKeywords.some((kw) => text.includes(kw)) || btn.className?.toString().includes('btn');
          if (isAction) actionButtons.push({ text, class: btn.className?.toString().slice(0, 50) || '' });
        }
      });

      // 탭 레이블 추출
      let tabLabels = [];
      for (const sel of ['.tab-list li', '.tabs li', '[role="tab"]', '.nav-tabs li']) {
        const tabs = document.querySelectorAll(sel);
        if (tabs.length > 1) {
          tabLabels = Array.from(tabs)
            .map((t) => t.textContent?.trim())
            .filter((t) => t && t.length > 0 && t.length < 30);
          break;
        }
      }

      // 모달 트리거 추출
      const modalTriggers = [];
      document.querySelectorAll('[data-toggle="modal"], [data-bs-toggle="modal"]').forEach((el) => {
        const text = el.textContent?.trim() || '';
        if (text) modalTriggers.push({ text, target: el.getAttribute('data-target') || '' });
      });

      return {
        pageTitle: pageTitle || document.title || '',
        searchFields,
        tableHeaders: [...new Set(tableHeaders)],
        actionButtons: actionButtons.filter((b, i, s) => i === s.findIndex((x) => x.text === b.text)),
        tabLabels,
        modalTriggers: modalTriggers.filter((t, i, s) => i === s.findIndex((x) => x.text === t.text)),
      };
    });

    const result = {
      url: menuItem.url,
      title: menuItem.title,
      pageTitle: domData.pageTitle,
      category: menuItem.category,
      depth: menuItem.depth,
      parentTitle: menuItem.parentTitle,
      timestamp: new Date().toISOString(),
      searchFields: domData.searchFields,
      tableHeaders: domData.tableHeaders,
      actionButtons: domData.actionButtons,
      tabLabels: domData.tabLabels,
      modalTriggers: domData.modalTriggers,
    };

    // 카테고리별 디렉토리에 저장
    const safeCategory = menuItem.category
      ? menuItem.category.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, '-').toLowerCase()
      : '기타';

    const categoryDir = path.join(ANALYSIS_PAGES_BASE, safeCategory);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const safeTitle = menuItem.title
      .replace(/[<>:"/\\|?*]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();

    const outputPath = path.join(categoryDir, `${safeTitle}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');

    return result;
  } catch (error) {
    if (error.message.includes('Timeout') || error.message.includes('timeout')) {
      console.warn(`[DOM 분석 타임아웃 스킵] ${menuItem.title}`);
    } else {
      console.error(`[DOM 분석 실패] ${menuItem.title}: ${error.message}`);
    }
    return null;
  }
}

/**
 * 메뉴 목록 전체에 대해 DOM 분석을 실행합니다.
 * @param {import('playwright').Page} page
 * @param {Array<Object>} menuItems
 * @returns {Promise<Array<Object>>} 분석 결과 배열
 */
async function analyzeAllPages(page, menuItems) {
  console.log(`\n[DOM 분석 시작] 총 ${menuItems.length}개 페이지`);

  const results = [];
  const validItems = menuItems.filter((item) => item.url && item.url !== '#' && !item.url.startsWith('javascript:'));

  for (let i = 0; i < validItems.length; i++) {
    const menuItem = validItems[i];
    const progress = `[${i + 1}/${validItems.length}]`;
    const breadcrumb = menuItem.parentTitle ? `${menuItem.parentTitle} > ${menuItem.title}` : menuItem.title;

    console.log(`${progress} ${breadcrumb} 분석 중...`);

    const result = await analyzeDom(page, menuItem);
    if (result) {
      results.push(result);
      console.log(`${progress} ${breadcrumb} 분석 완료`);
    }

    // 페이지 간 2초 딜레이
    if (i < validItems.length - 1) {
      await page.waitForTimeout(PAGE_DELAY_MS);
    }
  }

  console.log(`\n[DOM 분석 완료] ${results.length}/${validItems.length}개 성공`);
  return results;
}

module.exports = { analyzeDom, analyzeAllPages };
