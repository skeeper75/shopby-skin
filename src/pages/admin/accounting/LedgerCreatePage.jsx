// @MX:NOTE: [AUTO] LedgerCreatePage - 원장 거래 등록 페이지
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LedgerForm from '../../../components/admin/accounting/LedgerForm';
import { createLedgerEntry, getAccounts } from '../../../services/admin/accounting';
import { getVendors } from '../../../services/admin/vendor';

/**
 * 원장 거래 등록 페이지
 */
const LedgerCreatePage = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vendorsResult, accountsData] = await Promise.all([
          getVendors(),
          getAccounts(),
        ]);
        setVendors(vendorsResult.data);
        setAccounts(accountsData);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      await createLedgerEntry(formData);
      navigate('/admin/accounting/ledger');
    } catch (err) {
      setError('거래 등록에 실패했습니다. 다시 시도해주세요.');
      console.error('거래 등록 실패:', err);
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
          onClick={() => navigate('/admin/accounting/ledger')}
          className="text-[--huni-fg-muted] hover:text-[--huni-fg-default] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-[#424242]">거래 등록</h2>
      </div>

      <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-6">
        {error && (
          <div className="mb-4 px-4 py-3 rounded bg-[#FFEBEE] border border-[#F44336]/30 text-[#F44336] text-sm">
            {error}
          </div>
        )}
        <LedgerForm
          vendors={vendors}
          accounts={accounts}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/accounting/ledger')}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default LedgerCreatePage;
