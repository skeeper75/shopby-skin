// @MX:ANCHOR: [AUTO] excelExport - 공통 Excel(CSV) 내보내기 유틸
// @MX:REASON: [AUTO] fan_in >= 3 (거래처, 원장, 통계 등 다수 페이지에서 사용)
// @MX:SPEC: SPEC-SKIN-008

/**
 * 배열 데이터를 CSV 파일로 내보냅니다.
 * @param {Object[]} data - 내보낼 데이터 배열
 * @param {string[]} headers - CSV 헤더 컬럼명 배열
 * @param {string[]} keys - 데이터 객체의 키 배열 (headers 순서와 일치)
 * @param {string} filename - 저장될 파일명 (확장자 제외)
 */
export const exportToCSV = (data, headers, keys, filename = 'export') => {
  // CSV 헤더 행 생성
  const headerRow = headers.map((h) => `"${h}"`).join(',');

  // 데이터 행 생성
  const dataRows = data.map((row) =>
    keys
      .map((key) => {
        const value = row[key] ?? '';
        // 쉼표, 쌍따옴표, 줄바꿈이 있으면 쌍따옴표로 감쌈
        const strValue = String(value).replace(/"/g, '""');
        return `"${strValue}"`;
      })
      .join(',')
  );

  // BOM 추가 (한글 깨짐 방지)
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\n');

  // Blob 생성 및 다운로드
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${formatDateForFilename(new Date())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 날짜를 파일명용 문자열로 포맷합니다 (YYYYMMDD).
 * @param {Date} date
 * @returns {string}
 */
const formatDateForFilename = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

/**
 * 숫자를 한국 원화 형식으로 포맷합니다.
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount == null) return '-';
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

/**
 * 날짜 문자열을 한국 형식으로 포맷합니다 (YYYY-MM-DD → YYYY.MM.DD).
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return dateStr.replace(/-/g, '.');
};
