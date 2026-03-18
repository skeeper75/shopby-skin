// @MX:SPEC: SPEC-SKIN-007
// 회원 검색 바 컴포넌트

import { useState } from 'react';
import { TextField } from '../../ui/TextField';

const GRADE_OPTIONS = [
  { value: 'gold', label: '골드' },
  { value: 'silver', label: '실버' },
  { value: 'normal', label: '일반' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'suspended', label: '정지' },
];

/**
 * 회원 검색 바
 * @param {Function} onSearch - 검색 실행 핸들러 (params) => void
 */
const MemberSearchBar = ({ onSearch }) => {
  const [params, setParams] = useState({
    search: '',
    grade: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch?.(params);
  };

  const handleReset = () => {
    const reset = { search: '', grade: '', status: '', startDate: '', endDate: '' };
    setParams(reset);
    onSearch?.(reset);
  };

  return (
    <div
      style={{
        padding: 'var(--huni-spacing-md)',
        background: 'var(--huni-bg-muted)',
        borderRadius: 'var(--huni-radius-md)',
        border: '1px solid var(--huni-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--huni-spacing-sm)',
      }}
    >
      {/* 1행: 검색어 + 등급 + 상태 */}
      <div style={{ display: 'flex', gap: 'var(--huni-spacing-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          value={params.search}
          onChange={(e) => handleChange('search', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="이름, 아이디, 이메일, 전화번호"
          style={{ width: '260px' }}
        />

        <select
          value={params.grade}
          onChange={(e) => handleChange('grade', e.target.value)}
          style={selectStyle}
        >
          <option value="">등급 전체</option>
          {GRADE_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>

        <select
          value={params.status}
          onChange={(e) => handleChange('status', e.target.value)}
          style={selectStyle}
        >
          <option value="">상태 전체</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* 2행: 가입일 범위 + 버튼 */}
      <div style={{ display: 'flex', gap: 'var(--huni-spacing-sm)', alignItems: 'center' }}>
        <label style={{ fontSize: 'var(--huni-font-size-sm)', color: 'var(--huni-text-secondary)', whiteSpace: 'nowrap' }}>
          가입일
        </label>
        <input
          type="date"
          value={params.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          style={{ ...inputStyle, width: '150px' }}
        />
        <span style={{ color: 'var(--huni-text-muted)' }}>~</span>
        <input
          type="date"
          value={params.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          style={{ ...inputStyle, width: '150px' }}
        />

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--huni-spacing-xs)' }}>
          <button onClick={handleReset} style={resetBtnStyle}>초기화</button>
          <button onClick={handleSearch} style={searchBtnStyle}>검색</button>
        </div>
      </div>
    </div>
  );
};

const selectStyle = {
  padding: '7px 10px',
  border: '1px solid var(--huni-border-default)',
  borderRadius: 'var(--huni-radius-sm)',
  fontSize: 'var(--huni-font-size-sm)',
  background: 'var(--huni-bg-surface)',
  color: 'var(--huni-text-primary)',
};

const inputStyle = {
  padding: '7px 10px',
  border: '1px solid var(--huni-border-default)',
  borderRadius: 'var(--huni-radius-sm)',
  fontSize: 'var(--huni-font-size-sm)',
  background: 'var(--huni-bg-surface)',
  color: 'var(--huni-text-primary)',
};

const resetBtnStyle = {
  padding: 'var(--huni-spacing-xs) var(--huni-spacing-md)',
  background: 'var(--huni-bg-surface)',
  color: 'var(--huni-text-secondary)',
  border: '1px solid var(--huni-border-default)',
  borderRadius: 'var(--huni-radius-sm)',
  fontSize: 'var(--huni-font-size-sm)',
  cursor: 'pointer',
};

const searchBtnStyle = {
  padding: 'var(--huni-spacing-xs) var(--huni-spacing-lg)',
  background: 'var(--huni-color-brand)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--huni-radius-sm)',
  fontSize: 'var(--huni-font-size-sm)',
  fontWeight: 'var(--huni-font-weight-medium)',
  cursor: 'pointer',
};

export { MemberSearchBar };
