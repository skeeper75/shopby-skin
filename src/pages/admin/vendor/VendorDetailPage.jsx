// @MX:NOTE: [AUTO] VendorDetailPage - 거래처 상세/수정 페이지
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VendorForm from '../../../components/admin/vendor/VendorForm';
import VendorGradeChip from '../../../components/admin/vendor/VendorGradeChip';
import { getVendor, updateVendor, deleteVendor } from '../../../services/admin/vendor';
import { formatCurrency } from '../../../utils/excelExport';

/**
 * 거래처 상세/수정 페이지
 */
const VendorDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendor = async () => {
      setIsFetching(true);
      try {
        const data = await getVendor(id);
        setVendor(data);
      } catch (err) {
        setError('거래처 정보를 불러올 수 없습니다.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchVendor();
  }, [id]);

  const handleUpdate = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      const updated = await updateVendor(id, formData);
      setVendor(updated);
      setIsEditing(false);
    } catch (err) {
      setError('수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`"${vendor?.name}" 거래처를 삭제하시겠습니까?`)) return;
    try {
      await deleteVendor(id);
      navigate('/admin/vendor');
    } catch (err) {
      setError('삭제에 실패했습니다.');
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64 text-[--huni-fg-muted] text-sm">
        로딩 중...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-[--huni-fg-muted] text-sm">거래처를 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate('/admin/vendor')}
          className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-muted] transition-colors"
        >
          목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5" style={{ minWidth: 800 }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/vendor')}
            className="text-[--huni-fg-muted] hover:text-[--huni-fg-default] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-[#424242]">거래처 상세</h2>
        </div>
        {!isEditing && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/admin/vendor/${id}/board`)}
              className="px-3 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] hover:bg-[--huni-bg-muted] transition-colors"
            >
              매장게시판
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 rounded border border-[#F44336]/40 text-[#F44336] text-sm hover:bg-[#FFEBEE] transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-[#FFEBEE] border border-[#F44336]/30 text-[#F44336] text-sm">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-6">
          <h3 className="text-base font-semibold text-[--huni-fg-default] mb-5">정보 수정</h3>
          <VendorForm
            initialData={vendor}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <>
          {/* 기본 정보 카드 */}
          <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-[--huni-fg-default]">{vendor.name}</h3>
                <p className="text-sm text-[--huni-fg-muted] mt-0.5">{vendor.type}</p>
              </div>
              <VendorGradeChip grade={vendor.grade} />
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <InfoRow label="담당자" value={vendor.manager} />
              <InfoRow label="연락처" value={vendor.contact} />
              <InfoRow label="이메일" value={vendor.email || '-'} />
              <InfoRow label="주소" value={vendor.address || '-'} />
              <InfoRow label="잔액" value={formatCurrency(vendor.balance)} highlight />
              <InfoRow label="등록일" value={vendor.createdAt} />
              {vendor.memo && <InfoRow label="메모" value={vendor.memo} className="col-span-2" />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/** 정보 행 컴포넌트 */
const InfoRow = ({ label, value, highlight = false, className = '' }) => (
  <div className={className}>
    <span className="text-[--huni-fg-muted]">{label}</span>
    <span className={`ml-3 font-medium ${highlight ? 'text-[--huni-bg-brand]' : 'text-[--huni-fg-default]'}`}>
      {value}
    </span>
  </div>
);

export default VendorDetailPage;
