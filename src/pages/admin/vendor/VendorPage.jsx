// @MX:NOTE: [AUTO] VendorPage - 거래처 목록 페이지
// @MX:SPEC: SPEC-SKIN-008
// @MX:TODO: [AUTO] 실제 API 연동 미완성 - 목업 데이터 사용 중

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorGradeChip from '../../../components/admin/vendor/VendorGradeChip';
import VendorTypeFilter from '../../../components/admin/vendor/VendorTypeFilter';
import { getVendors } from '../../../services/admin/vendor';
import { formatCurrency } from '../../../utils/excelExport';
import { exportToCSV } from '../../../utils/excelExport';

const GRADE_ORDER = { S: 0, A: 1, B: 2, C: 3 };

/**
 * 거래처 목록 페이지
 */
const VendorPage = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [keyword, setKeyword] = useState('');

  const fetchVendors = async (params = {}) => {
    setIsLoading(true);
    try {
      const { data } = await getVendors(params);
      setVendors(data);
    } catch (err) {
      console.error('거래처 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors({ type: typeFilter, grade: gradeFilter, keyword });
  }, [typeFilter, gradeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors({ type: typeFilter, grade: gradeFilter, keyword });
  };

  const handleExport = () => {
    exportToCSV(
      vendors,
      ['거래처명', '유형', '등급', '담당자', '연락처', '이메일', '잔액'],
      ['name', 'type', 'grade', 'manager', 'contact', 'email', 'balance'],
      '거래처목록'
    );
  };

  return (
    <div className="space-y-5" style={{ minWidth: 1280 }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]">거래처 관리</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] hover:bg-[--huni-bg-muted] transition-colors"
          >
            CSV 내보내기
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/vendor/create')}
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors"
          >
            + 거래처 등록
          </button>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-4 space-y-3">
        {/* 유형 필터 */}
        <VendorTypeFilter value={typeFilter} onChange={setTypeFilter} />

        {/* 등급 + 검색 */}
        <div className="flex items-center gap-3">
          {/* 등급 필터 */}
          <div className="flex gap-1">
            {['전체', 'S', 'A', 'B', 'C'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGradeFilter(g === '전체' ? '' : g)}
                className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                  (gradeFilter === '' && g === '전체') || gradeFilter === g
                    ? 'bg-[--huni-bg-brand] text-white border-[--huni-bg-brand]'
                    : 'bg-white text-[--huni-fg-default] border-[--huni-stroke-default] hover:border-[--huni-bg-brand]'
                }`}
              >
                {g === '전체' ? '전체등급' : `${g}등급`}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* 검색 */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="거래처명, 담당자, 연락처 검색"
              className="w-64 h-9 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] placeholder:text-[--huni-fg-muted] focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors"
            >
              검색
            </button>
          </form>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] overflow-hidden">
        <div className="px-5 py-3 border-b border-[--huni-stroke-default] text-sm text-[--huni-fg-muted]">
          총 {vendors.length}개 거래처
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-[--huni-fg-muted] text-sm">
            로딩 중...
          </div>
        ) : vendors.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-[--huni-fg-muted] text-sm">
            거래처가 없습니다.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F6F6] border-b border-[--huni-stroke-default]">
                <th className="text-left px-5 py-3 font-medium text-[--huni-fg-default]">거래처명</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-28">유형</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-20">등급</th>
                <th className="text-left px-4 py-3 font-medium text-[--huni-fg-default] w-24">담당자</th>
                <th className="text-left px-4 py-3 font-medium text-[--huni-fg-default] w-36">연락처</th>
                <th className="text-right px-4 py-3 font-medium text-[--huni-fg-default] w-28">잔액</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-28">최종수정일</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-20">관리</th>
              </tr>
            </thead>
            <tbody>
              {vendors
                .sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade])
                .map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="border-b border-[--huni-stroke-default]/50 hover:bg-[#F6F6F6]/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/vendor/${vendor.id}`)}
                        className="text-[--huni-bg-brand] font-medium hover:underline text-left"
                      >
                        {vendor.name}
                      </button>
                      {vendor.memo && (
                        <span className="ml-2 text-xs text-[--huni-fg-muted]">({vendor.memo})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs px-2 py-0.5 rounded bg-[--huni-bg-muted] text-[--huni-fg-muted]">
                        {vendor.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <VendorGradeChip grade={vendor.grade} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-[--huni-fg-default]">{vendor.manager}</td>
                    <td className="px-4 py-3 text-[--huni-fg-muted]">{vendor.contact}</td>
                    <td className="px-4 py-3 text-right text-[--huni-fg-default] font-medium">
                      {formatCurrency(vendor.balance)}
                    </td>
                    <td className="px-4 py-3 text-center text-[--huni-fg-muted] text-xs">{vendor.updatedAt}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/vendor/${vendor.id}`)}
                        className="text-xs px-2.5 py-1 rounded border border-[--huni-stroke-default] text-[--huni-fg-default] hover:bg-[--huni-bg-muted] transition-colors"
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VendorPage;
