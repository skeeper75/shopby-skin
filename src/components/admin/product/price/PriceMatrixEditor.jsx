// @MX:WARN: contentEditable 인라인 편집 - 키보드 탐색(Tab/Enter/Arrow) 복잡성 주의
// @MX:REASON: 스프레드시트 스타일 편집 구현으로 DOM 직접 조작 필요
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';

/**
 * PriceMatrixEditor - 스프레드시트 스타일 가격 매트릭스 편집기
 * @param {string[]} rows - 행 레이블 (예: ['100장', '200장'])
 * @param {string[]} cols - 열 레이블 (예: ['단면', '양면'])
 * @param {object} matrix - 초기 매트릭스 값 { '100장-단면': 15000, ... }
 * @param {function} onChange - 값 변경 콜백 (matrix 전달)
 * @param {boolean} readonly - 읽기 전용 여부
 */
const PriceMatrixEditor = ({ rows = [], cols = [], matrix: initialMatrix = {}, onChange, readonly = false }) => {
  const [matrix, setMatrix] = React.useState(initialMatrix);
  const [selectedCell, setSelectedCell] = React.useState(null); // 'row-col'
  const cellRefs = React.useRef({});

  // 외부에서 initialMatrix가 바뀌면 동기화
  React.useEffect(() => {
    setMatrix(initialMatrix);
  }, [initialMatrix]);

  const cellKey = (row, col) => `${row}-${col}`;

  const getCellValue = (row, col) => {
    const val = matrix[cellKey(row, col)];
    return val !== undefined ? val : '';
  };

  const setCellValue = (row, col, value) => {
    const num = value === '' ? '' : Number(value.replace(/,/g, ''));
    const newMatrix = { ...matrix, [cellKey(row, col)]: num };
    setMatrix(newMatrix);
    onChange?.(newMatrix);
  };

  // 셀 포커스 이동 헬퍼
  const focusCell = (rowIdx, colIdx) => {
    const r = rows[rowIdx];
    const c = cols[colIdx];
    if (!r || !c) return;
    const key = cellKey(r, c);
    const el = cellRefs.current[key];
    if (el) {
      el.focus();
      // 텍스트 전체 선택
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  // 키보드 탐색
  const handleKeyDown = (e, rowIdx, colIdx) => {
    if (readonly) return;
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          if (colIdx > 0) focusCell(rowIdx, colIdx - 1);
          else if (rowIdx > 0) focusCell(rowIdx - 1, cols.length - 1);
        } else {
          if (colIdx < cols.length - 1) focusCell(rowIdx, colIdx + 1);
          else if (rowIdx < rows.length - 1) focusCell(rowIdx + 1, 0);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (rowIdx < rows.length - 1) focusCell(rowIdx + 1, colIdx);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (rowIdx > 0) focusCell(rowIdx - 1, colIdx);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (rowIdx < rows.length - 1) focusCell(rowIdx + 1, colIdx);
        break;
      case 'ArrowLeft':
        // contentEditable 내 커서 이동이므로 기본 동작 허용
        break;
      case 'ArrowRight':
        break;
      case 'Escape':
        e.currentTarget.blur();
        break;
      default:
        break;
    }
  };

  const handleInput = (e, row, col) => {
    if (readonly) return;
    setCellValue(row, col, e.currentTarget.textContent);
  };

  const handleFocus = (row, col) => {
    setSelectedCell(cellKey(row, col));
  };

  const handleBlur = (e, row, col) => {
    // 현재 값을 숫자로 정규화
    const raw = e.currentTarget.textContent.replace(/,/g, '').trim();
    const num = raw === '' ? '' : Number(raw);
    e.currentTarget.textContent = num !== '' ? num.toLocaleString() : '';
    setSelectedCell(null);
  };

  const thCls = 'px-3 py-2 text-xs font-semibold text-[--huni-fg-muted] bg-[--huni-bg-subtle] border border-[--huni-stroke-default] text-center';
  const tdCls = 'border border-[--huni-stroke-default] p-0';

  return (
    <div className="overflow-auto">
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th className={thCls} style={{ minWidth: '100px' }}></th>
            {cols.map((col) => (
              <th key={col} className={thCls} style={{ minWidth: '120px' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row}>
              <th className={`${thCls} text-left`}>{row}</th>
              {cols.map((col, colIdx) => {
                const key = cellKey(row, col);
                const isSelected = selectedCell === key;
                const val = getCellValue(row, col);

                return (
                  <td
                    key={col}
                    className={`${tdCls} ${isSelected ? 'ring-2 ring-inset ring-[--huni-stroke-brand]' : ''}`}
                  >
                    <div
                      ref={(el) => { cellRefs.current[key] = el; }}
                      contentEditable={!readonly}
                      suppressContentEditableWarning
                      className={`px-3 py-2 min-h-[36px] text-right outline-none ${readonly ? 'cursor-default' : 'cursor-text'}`}
                      onFocus={() => handleFocus(row, col)}
                      onBlur={(e) => handleBlur(e, row, col)}
                      onInput={(e) => handleInput(e, row, col)}
                      onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                      data-row={row}
                      data-col={col}
                    >
                      {val !== '' ? Number(val).toLocaleString() : ''}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { PriceMatrixEditor };
