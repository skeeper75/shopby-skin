// @MX:NOTE: [AUTO] InvoicePreview - 청구서 미리보기 Dialog
// @MX:SPEC: SPEC-SKIN-008

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../ui';
import { formatCurrency, formatDate } from '../../../utils/excelExport';

/**
 * 청구서 미리보기 Dialog
 * @param {Object} props
 * @param {boolean} props.open - 열림 상태
 * @param {function} props.onClose - 닫기 핸들러
 * @param {Object} props.invoice - 청구서 데이터
 */
const InvoicePreview = ({ open, onClose, invoice }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>청구서 미리보기</DialogTitle>
        </DialogHeader>

        {/* 청구서 본문 */}
        <div className="border border-[--huni-stroke-default] rounded p-6 space-y-5 print:border-none">
          {/* 제목 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[--huni-fg-default]">청 구 서</h2>
            <p className="text-sm text-[--huni-fg-muted] mt-1">{invoice.invoiceNo}</p>
          </div>

          {/* 청구/수신 정보 */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="font-semibold text-[--huni-fg-default] mb-2">수신</p>
              <p className="text-[--huni-fg-default] font-medium">{invoice.vendorName}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="font-semibold text-[--huni-fg-default] mb-2">발행</p>
              <p className="text-[--huni-fg-default]">발행일: {formatDate(invoice.issueDate)}</p>
              <p className="text-[--huni-fg-muted]">만기일: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <hr className="border-[--huni-stroke-default]" />

          {/* 품목 테이블 */}
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F6F6]">
                <th className="text-left px-3 py-2 font-medium text-[--huni-fg-default]">품목</th>
                <th className="text-center px-3 py-2 font-medium text-[--huni-fg-default] w-20">수량</th>
                <th className="text-right px-3 py-2 font-medium text-[--huni-fg-default] w-28">단가</th>
                <th className="text-right px-3 py-2 font-medium text-[--huni-fg-default] w-28">금액</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items ?? []).map((item, idx) => (
                <tr key={idx} className="border-t border-[--huni-stroke-default]/50">
                  <td className="px-3 py-2 text-[--huni-fg-default]">{item.description}</td>
                  <td className="px-3 py-2 text-center text-[--huni-fg-default]">{item.quantity}</td>
                  <td className="px-3 py-2 text-right text-[--huni-fg-default]">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-3 py-2 text-right text-[--huni-fg-default] font-medium">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 합계 */}
          <div className="border-t border-[--huni-stroke-default] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[--huni-fg-muted]">
              <span>소계</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[--huni-fg-muted]">
              <span>부가세 (10%)</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-[--huni-fg-default] text-base border-t border-[--huni-stroke-default] pt-2">
              <span>합계</span>
              <span className="text-[--huni-bg-brand]">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] hover:bg-[--huni-bg-muted] transition-colors"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors"
          >
            인쇄
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreview;
