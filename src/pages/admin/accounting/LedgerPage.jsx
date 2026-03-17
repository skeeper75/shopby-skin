// @MX:NOTE: [AUTO] LedgerPage - 원장관리 페이지 (거래등록, 잔액 자동계산)
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LedgerTable from '../../../components/admin/accounting/LedgerTable';
import InvoicePreview from '../../../components/admin/accounting/InvoicePreview';
import { getLedgerEntries, getAccounts, getInvoice } from '../../../services/admin/accounting';
import { getVendors } from '../../../services/admin/vendor';
import { exportToCSV, formatCurrency } from '../../../utils/excelExport';

/**
 * 원장관리 페이지
 */
const LedgerPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchEntries = async (params = {}) => {
    setIsLoading(true);
    try {
      const { data } = await getLedgerEntries(params);
      setEntries(data);
    } catch (err) {
      console.error('원장 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSearch = () => {
    fetchEntries({ dateFrom, dateTo, type: typeFilter });
  };

  const handleRowClick = async (entry) => {
    if (!entry.invoiceNo) return;
    try {
      const invoice = await getInvoice(entry.invoiceNo);
      setSelectedInvoice(invoice);
      setIsInvoiceOpen(true);
    } catch (err) {
      console.error('청구서 조회 실패:', err);
    }
  };

  const handleExport = () => {
    exportToCSV(
      entries,
      ['날짜', '거래처', '유형', '금액', '잔액', '거래내역', '청구서번호'],
      ['date', 'vendorName', 'type', 'amount', 'balance', 'description', 'invoiceNo'],
      '원장'
    );
  };

  // 요약 합계
  const summary = entries.reduce(
    (acc, e) => {
      if (e.type === '입금') acc.totalCredit += e.amount;
      else if (e.type === '출금') acc.totalDebit += e.amount;
      return acc;
    },
    { totalCredit: 0, totalDebit: 0 }
  );

  return (
    <div className="space-y-5" style={{ minWidth: 1280 }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]">원장 관리</h2>
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
            onClick={() => navigate('/admin/accounting/ledger/create')}
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors"
          >
            + 거래 등록
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-4">
          <p className="text-sm text-[--huni-fg-muted]">총 입금</p>
          <p className="text-xl font-bold text-[#00C853] mt-1">{formatCurrency(summary.totalCredit)}</p>
        </div>
        <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-4">
          <p className="text-sm text-[--huni-fg-muted]">총 출금</p>
          <p className="text-xl font-bold text-[#F44336] mt-1">{formatCurrency(summary.totalDebit)}</p>
        </div>
        <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-4">
          <p className="text-sm text-[--huni-fg-muted]">순 잔액</p>
          <p className="text-xl font-bold text-[--huni-bg-brand] mt-1">
            {formatCurrency(summary.totalCredit - summary.totalDebit)}
          </p>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] px-5 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 유형 필터 */}
          <div className="flex gap-1">
            {['전체', '입금', '출금', '조정'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t === '전체' ? '' : t)}
                className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                  (typeFilter === '' && t === '전체') || typeFilter === t
                    ? 'bg-[--huni-bg-brand] text-white border-[--huni-bg-brand]'
                    : 'bg-white text-[--huni-fg-default] border-[--huni-stroke-default] hover:border-[--huni-bg-brand]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-[--huni-stroke-default]" />

          {/* 날짜 필터 */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40"
            />
            <span className="text-[--huni-fg-muted] text-sm">~</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors"
            >
              조회
            </button>
          </div>
        </div>
      </div>

      {/* 원장 테이블 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] overflow-hidden">
        <div className="px-5 py-3 border-b border-[--huni-stroke-default] text-sm text-[--huni-fg-muted]">
          총 {entries.length}건 | 행을 클릭하면 청구서를 확인할 수 있습니다.
        </div>
        <LedgerTable
          entries={entries}
          isLoading={isLoading}
          onRowClick={handleRowClick}
        />
      </div>

      {/* 청구서 미리보기 */}
      <InvoicePreview
        open={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default LedgerPage;
