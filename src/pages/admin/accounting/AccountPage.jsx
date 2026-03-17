// @MX:NOTE: [AUTO] AccountPage - 계좌관리 페이지 (입금/출금/보증금 3용도)
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import { getAccounts, ACCOUNT_PURPOSES } from '../../../services/admin/accounting';
import { formatCurrency } from '../../../utils/excelExport';

/** 용도별 색상 */
const PURPOSE_STYLES = {
  입금: 'bg-[#E8F5E9] text-[#00C853]',
  출금: 'bg-[#FFEBEE] text-[#F44336]',
  보증금: 'bg-[#EDE9FA] text-[--huni-bg-brand]',
};

/**
 * 계좌관리 페이지
 */
const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const data = await getAccounts();
        setAccounts(data);
      } catch (err) {
        console.error('계좌 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const filtered = activeFilter
    ? accounts.filter((a) => a.purpose === activeFilter)
    : accounts;

  const totalByPurpose = Object.keys(ACCOUNT_PURPOSES).reduce((acc, key) => {
    const purpose = ACCOUNT_PURPOSES[key];
    acc[purpose] = accounts
      .filter((a) => a.purpose === purpose)
      .reduce((sum, a) => sum + (a.balance ?? 0), 0);
    return acc;
  }, {});

  return (
    <div className="space-y-5" style={{ minWidth: 1100 }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]">계좌 관리</h2>
        <button
          type="button"
          className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors"
          onClick={() => alert('TODO: 계좌 등록 기능 구현 예정')}
        >
          + 계좌 등록
        </button>
      </div>

      {/* 요약 카드 (용도별 합계) */}
      <div className="grid grid-cols-3 gap-4">
        {Object.values(ACCOUNT_PURPOSES).map((purpose) => (
          <div key={purpose} className="bg-white rounded-lg border border-[--huni-stroke-default] p-5">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${PURPOSE_STYLES[purpose]}`}>
                {purpose}
              </span>
              <span className="text-xs text-[--huni-fg-muted]">
                {accounts.filter((a) => a.purpose === purpose).length}개 계좌
              </span>
            </div>
            <p className="text-2xl font-bold text-[--huni-fg-default] mt-3">
              {formatCurrency(totalByPurpose[purpose] ?? 0)}
            </p>
            <p className="text-sm text-[--huni-fg-muted] mt-0.5">{purpose} 계좌 총 잔액</p>
          </div>
        ))}
      </div>

      {/* 필터 + 테이블 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] overflow-hidden">
        {/* 필터 */}
        <div className="px-5 py-3 border-b border-[--huni-stroke-default] flex items-center gap-2">
          {['전체', ...Object.values(ACCOUNT_PURPOSES)].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setActiveFilter(p === '전체' ? '' : p)}
              className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${
                (activeFilter === '' && p === '전체') || activeFilter === p
                  ? 'bg-[--huni-bg-brand] text-white border-[--huni-bg-brand]'
                  : 'bg-white text-[--huni-fg-default] border-[--huni-stroke-default] hover:border-[--huni-bg-brand]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* 테이블 */}
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-[--huni-fg-muted] text-sm">로딩 중...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F6F6] border-b border-[--huni-stroke-default]">
                <th className="text-left px-5 py-3 font-medium text-[--huni-fg-default]">은행</th>
                <th className="text-left px-5 py-3 font-medium text-[--huni-fg-default]">계좌번호</th>
                <th className="text-left px-5 py-3 font-medium text-[--huni-fg-default]">예금주</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-20">용도</th>
                <th className="text-right px-5 py-3 font-medium text-[--huni-fg-default] w-32">잔액</th>
                <th className="text-left px-4 py-3 font-medium text-[--huni-fg-default]">메모</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-16">상태</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((account) => (
                <tr key={account.id} className="border-b border-[--huni-stroke-default]/50 hover:bg-[#F6F6F6]/50">
                  <td className="px-5 py-3 font-medium text-[--huni-fg-default]">{account.bankName}</td>
                  <td className="px-5 py-3 text-[--huni-fg-muted] font-mono">{account.accountNumber}</td>
                  <td className="px-5 py-3 text-[--huni-fg-default]">{account.accountHolder}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${PURPOSE_STYLES[account.purpose]}`}>
                      {account.purpose}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-[--huni-bg-brand]">
                    {formatCurrency(account.balance)}
                  </td>
                  <td className="px-4 py-3 text-[--huni-fg-muted]">{account.memo || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs ${account.isActive ? 'bg-[#E8F5E9] text-[#00C853]' : 'bg-[#F5F5F5] text-[#424242]'}`}>
                      {account.isActive ? '활성' : '비활성'}
                    </span>
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

export default AccountPage;
