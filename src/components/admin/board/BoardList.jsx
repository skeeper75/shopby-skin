// @MX:ANCHOR: 재사용 게시판 목록 컴포넌트 - config pattern 기반
// @MX:REASON: fan_in >= 3 (NoticePage, FaqPage, QaPage, PersonalInquiryPage 등)
// @MX:SPEC: SPEC-SKIN-007

import { useState, useEffect, useCallback } from 'react';
import { TextField } from '../../ui/TextField';
import { BoardStatusChip } from './BoardStatusChip';

/**
 * 재사용 게시판 목록 컴포넌트
 *
 * @param {Object} config - 설정 객체
 * @param {Array} config.columns - 컬럼 정의 [{ key, label, width, render }]
 * @param {Array} [config.searchFields] - 검색 필드 [{ key, label, type: 'text'|'select', options }]
 * @param {Array} [config.statusFilters] - 상태 필터 [{ value, label }]
 * @param {Function} config.fetchData - 데이터 fetch 함수 (params) => Promise<{ items, total }>
 * @param {Function} [onRowClick] - 행 클릭 핸들러 (item) => void
 * @param {React.ReactNode} [headerActions] - 우측 상단 액션 버튼
 * @param {string} [emptyMessage] - 데이터 없을 때 메시지
 */
const BoardList = ({
  config,
  onRowClick,
  headerActions,
  emptyMessage = '데이터가 없습니다.',
}) => {
  const { columns = [], searchFields = [], statusFilters = [], fetchData } = config;

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [activeStatus, setActiveStatus] = useState('');

  const PAGE_SIZE = 20;

  const loadData = useCallback(async () => {
    if (!fetchData) return;
    setIsLoading(true);
    try {
      const params = {
        page,
        size: PAGE_SIZE,
        ...(activeStatus ? { status: activeStatus } : {}),
        ...searchParams,
      };
      const result = await fetchData(params);
      setItems(result.items ?? []);
      setTotal(result.total ?? 0);
    } catch (err) {
      console.error('[BoardList] 데이터 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, page, activeStatus, searchParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (key, value) => {
    setSearchParams((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--huni-spacing-md)' }}>
      {/* 검색 영역 */}
      {searchFields.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--huni-spacing-sm)',
            padding: 'var(--huni-spacing-md)',
            background: 'var(--huni-bg-muted)',
            borderRadius: 'var(--huni-radius-md)',
            border: '1px solid var(--huni-border-default)',
            flexWrap: 'wrap',
          }}
        >
          {searchFields.map((field) => {
            if (field.type === 'select') {
              return (
                <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--huni-spacing-xs)' }}>
                  <label style={{ fontSize: 'var(--huni-font-size-sm)', color: 'var(--huni-text-secondary)', whiteSpace: 'nowrap' }}>
                    {field.label}
                  </label>
                  <select
                    onChange={(e) => handleSearch(field.key, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid var(--huni-border-default)',
                      borderRadius: 'var(--huni-radius-sm)',
                      fontSize: 'var(--huni-font-size-sm)',
                      background: 'var(--huni-bg-surface)',
                      color: 'var(--huni-text-primary)',
                    }}
                  >
                    <option value="">전체</option>
                    {(field.options ?? []).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              );
            }
            return (
              <TextField
                key={field.key}
                placeholder={`${field.label} 검색`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch(field.key, e.target.value);
                }}
                style={{ width: '220px' }}
              />
            );
          })}
        </div>
      )}

      {/* 헤더: 상태 필터 + 액션 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--huni-spacing-xs)' }}>
          {statusFilters.length > 0 && (
            <>
              <button
                onClick={() => handleStatusFilter('')}
                style={filterButtonStyle(activeStatus === '')}
              >
                전체 ({total})
              </button>
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleStatusFilter(filter.value)}
                  style={filterButtonStyle(activeStatus === filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </>
          )}
          {!statusFilters.length && (
            <span style={{ fontSize: 'var(--huni-font-size-sm)', color: 'var(--huni-text-muted)' }}>
              총 {total}건
            </span>
          )}
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>

      {/* 테이블 */}
      <div
        style={{
          border: '1px solid var(--huni-border-default)',
          borderRadius: 'var(--huni-radius-md)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--huni-bg-muted)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: 'var(--huni-spacing-sm) var(--huni-spacing-md)',
                    textAlign: 'left',
                    fontSize: 'var(--huni-font-size-sm)',
                    fontWeight: 'var(--huni-font-weight-semibold)',
                    color: 'var(--huni-text-secondary)',
                    borderBottom: '1px solid var(--huni-border-default)',
                    width: col.width ?? 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 'var(--huni-spacing-xl)', textAlign: 'center', color: 'var(--huni-text-muted)' }}>
                  불러오는 중...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 'var(--huni-spacing-xl)', textAlign: 'center', color: 'var(--huni-text-muted)' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr
                  key={item.id ?? idx}
                  onClick={() => onRowClick?.(item)}
                  style={{
                    borderBottom: '1px solid var(--huni-border-subtle)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    if (onRowClick) e.currentTarget.style.background = 'var(--huni-bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: 'var(--huni-spacing-sm) var(--huni-spacing-md)',
                        fontSize: 'var(--huni-font-size-sm)',
                        color: 'var(--huni-text-primary)',
                        verticalAlign: 'middle',
                      }}
                    >
                      {col.render
                        ? col.render(item[col.key], item)
                        : (item[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--huni-spacing-xs)' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={pageButtonStyle(false)}
          >
            이전
          </button>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={pageButtonStyle(p === page)}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={pageButtonStyle(false)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

// 스타일 헬퍼
const filterButtonStyle = (isActive) => ({
  padding: '4px 12px',
  border: isActive ? '1px solid var(--huni-color-brand)' : '1px solid var(--huni-border-default)',
  borderRadius: 'var(--huni-radius-sm)',
  background: isActive ? 'var(--huni-color-brand)' : 'var(--huni-bg-surface)',
  color: isActive ? '#fff' : 'var(--huni-text-secondary)',
  fontSize: 'var(--huni-font-size-sm)',
  cursor: 'pointer',
  fontWeight: isActive ? 'var(--huni-font-weight-medium)' : 'normal',
});

const pageButtonStyle = (isActive) => ({
  padding: '6px 12px',
  border: isActive ? '1px solid var(--huni-color-brand)' : '1px solid var(--huni-border-default)',
  borderRadius: 'var(--huni-radius-sm)',
  background: isActive ? 'var(--huni-color-brand)' : 'var(--huni-bg-surface)',
  color: isActive ? '#fff' : 'var(--huni-text-secondary)',
  fontSize: 'var(--huni-font-size-sm)',
  cursor: 'pointer',
});

export { BoardList };
