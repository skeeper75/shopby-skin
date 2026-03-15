import { useState, useCallback, useMemo } from 'react';

// @MX:ANCHOR: [AUTO] 주문관리 전역에서 사용되는 재사용 가능 데이터 테이블 컴포넌트 (fan_in >= 5)
// @MX:REASON: Orders, FileCheck, StatusChange, DeferredPayment, Receipts, SMS 페이지에서 공통 사용

/**
 * 재사용 가능한 데이터 테이블 컴포넌트
 * - 정렬 가능한 컬럼, 체크박스 선택, 페이지네이션 지원
 *
 * @param {Object} props
 * @param {Array} props.columns - 컬럼 정의 배열 [{ key, label, sortable, width, render }]
 * @param {Array} props.data - 테이블 데이터
 * @param {Function} props.onSelectionChange - 선택 변경 콜백
 * @param {Object} props.pagination - 페이지네이션 설정 { page, pageSize, total }
 * @param {Function} props.onPageChange - 페이지 변경 콜백
 * @param {Function} props.onSort - 정렬 변경 콜백
 * @param {Function} props.onRowClick - 행 클릭 콜백
 * @param {boolean} props.selectable - 체크박스 선택 활성화 여부
 */
const DataTable = ({
  columns = [],
  data = [],
  onSelectionChange,
  pagination = { page: 1, pageSize: 10, total: 0 },
  onPageChange,
  onSort,
  onRowClick,
  selectable = false,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 전체 페이지 수 계산
  const totalPages = useMemo(
    () => Math.ceil(pagination.total / pagination.pageSize) || 1,
    [pagination.total, pagination.pageSize]
  );

  // 정렬 핸들러
  const handleSort = useCallback(
    (key) => {
      const direction =
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      setSortConfig({ key, direction });
      onSort?.({ key, direction });
    },
    [sortConfig, onSort]
  );

  // 전체 선택/해제
  const handleSelectAll = useCallback(
    (e) => {
      const newSelection = e.target.checked ? data.map((_, idx) => idx) : [];
      setSelectedRows(newSelection);
      onSelectionChange?.(e.target.checked ? data : []);
    },
    [data, onSelectionChange]
  );

  // 개별 행 선택/해제
  const handleSelectRow = useCallback(
    (idx) => {
      setSelectedRows((prev) => {
        const isSelected = prev.includes(idx);
        const newSelection = isSelected
          ? prev.filter((i) => i !== idx)
          : [...prev, idx];

        onSelectionChange?.(newSelection.map((i) => data[i]));
        return newSelection;
      });
    },
    [data, onSelectionChange]
  );

  // 정렬 아이콘 렌더링
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  // 페이지네이션 번호 배열 생성
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [pagination.page, totalPages]);

  return (
    <div className="w-full">
      {/* 테이블 */}
      <div className="overflow-x-auto border border-[#CACACA] rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F6F6F6] border-b border-[#CACACA]">
              {selectable && (
                <th className="w-[40px] p-3 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === data.length && data.length > 0}
                    className="w-4 h-4 accent-[#5538B6]"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-3 text-left text-sm font-semibold text-[#424242] whitespace-nowrap"
                  style={{ width: col.width || 'auto' }}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 hover:text-[#5538B6] transition-colors"
                    >
                      {col.label}
                      <span className="text-xs text-[#979797]">{renderSortIcon(col.key)}</span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-8 text-center text-[#979797] text-sm"
                >
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="border-b border-[#CACACA] last:border-b-0 hover:bg-[#EEEBF9] transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(row, idx)}
                >
                  {selectable && (
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(idx)}
                        onChange={() => handleSelectRow(idx)}
                        className="w-4 h-4 accent-[#5538B6]"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="p-3 text-sm text-[#424242]">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-center gap-1 mt-4">
          <button
            type="button"
            onClick={() => onPageChange?.(1)}
            disabled={pagination.page === 1}
            className="px-2 py-1 text-sm rounded disabled:opacity-40 hover:bg-[#EEEBF9] text-[#424242]"
          >
            {'<<'}
          </button>
          <button
            type="button"
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-2 py-1 text-sm rounded disabled:opacity-40 hover:bg-[#EEEBF9] text-[#424242]"
          >
            {'<'}
          </button>
          {pageNumbers.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onPageChange?.(num)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                num === pagination.page
                  ? 'bg-[#5538B6] text-white'
                  : 'text-[#979797] hover:bg-[#EEEBF9]'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page === totalPages}
            className="px-2 py-1 text-sm rounded disabled:opacity-40 hover:bg-[#EEEBF9] text-[#424242]"
          >
            {'>'}
          </button>
          <button
            type="button"
            onClick={() => onPageChange?.(totalPages)}
            disabled={pagination.page === totalPages}
            className="px-2 py-1 text-sm rounded disabled:opacity-40 hover:bg-[#EEEBF9] text-[#424242]"
          >
            {'>>'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
