// @MX:NOTE: [AUTO] VendorCreatePage - 거래처 등록 페이지
// @MX:SPEC: SPEC-SKIN-008

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorForm from '../../../components/admin/vendor/VendorForm';
import { createVendor } from '../../../services/admin/vendor';

/**
 * 거래처 등록 페이지
 */
const VendorCreatePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      await createVendor(formData);
      navigate('/admin/vendor');
    } catch (err) {
      setError('거래처 등록에 실패했습니다. 다시 시도해주세요.');
      console.error('거래처 등록 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl" style={{ minWidth: 800 }}>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/vendor')}
          className="text-[--huni-fg-muted] hover:text-[--huni-fg-default] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-[#424242]">거래처 등록</h2>
      </div>

      {/* 폼 카드 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-6">
        {error && (
          <div className="mb-4 px-4 py-3 rounded bg-[#FFEBEE] border border-[#F44336]/30 text-[#F44336] text-sm">
            {error}
          </div>
        )}
        <VendorForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/vendor')}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default VendorCreatePage;
