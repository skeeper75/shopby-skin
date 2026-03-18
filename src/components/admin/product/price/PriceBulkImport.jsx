// @MX:NOTE: CSV/Excel 가격 일괄 업로드 컴포넌트 (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '../../../../components/ui/Dialog';

/**
 * PriceBulkImport - CSV/Excel 가격 일괄 업로드
 * @param {boolean} open
 * @param {function} onOpenChange
 * @param {function} onImport - 가져오기 완료 콜백 ({ imported, failed })
 */
const PriceBulkImport = ({ open, onOpenChange, onImport }) => {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [importing, setImporting] = React.useState(false);
  const [error, setError] = React.useState('');
  const fileInputRef = React.useRef(null);

  const TEMPLATE_HEADERS = ['행(수량)', '열(옵션)', '가격(원)'];

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('CSV 또는 Excel 파일만 업로드 가능합니다.');
      return;
    }
    setError('');
    setFile(f);
    // CSV 미리보기 (간단 파싱)
    if (f.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const lines = ev.target.result.split('\n').slice(0, 6); // 최대 5행 미리보기
        const rows = lines.map((l) => l.split(',').map((v) => v.trim()));
        setPreview(rows);
      };
      reader.readAsText(f);
    } else {
      setPreview([['Excel 파일은 미리보기를 지원하지 않습니다.']]);
    }
  };

  const handleImport = async () => {
    if (!file) { setError('파일을 선택하세요.'); return; }
    setImporting(true);
    try {
      // TODO: priceApi.bulkImport(productId, file) 호출
      await new Promise((res) => setTimeout(res, 1000));
      onImport?.({ imported: 100, failed: 0 });
      onOpenChange(false);
      resetState();
    } catch (err) {
      setError('가져오기 중 오류가 발생했습니다.');
    } finally {
      setImporting(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const csv = [TEMPLATE_HEADERS.join(','), '100장,단면,15000', '100장,양면,20000'].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetState(); onOpenChange(o); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>가격 일괄 업로드</DialogTitle>
          <DialogDescription>CSV 또는 Excel 파일로 가격 매트릭스를 일괄 등록합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 템플릿 다운로드 */}
          <div className="p-3 bg-[--huni-bg-subtle] rounded border border-[--huni-stroke-default]">
            <p className="text-xs text-[--huni-fg-muted] mb-2">업로드 양식을 먼저 다운로드하세요.</p>
            <button
              className="text-xs text-[--huni-fg-brand] hover:underline font-medium"
              onClick={downloadTemplate}
            >
              템플릿 다운로드 (CSV)
            </button>
          </div>

          {/* 파일 업로드 영역 */}
          <div
            className="border-2 border-dashed border-[--huni-stroke-default] rounded p-6 text-center cursor-pointer hover:border-[--huni-stroke-brand] transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFileChange({ target: { files: [f] } });
            }}
          >
            {file ? (
              <div>
                <p className="text-sm font-medium text-[--huni-fg-default]">{file.name}</p>
                <p className="text-xs text-[--huni-fg-muted] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-[--huni-fg-muted]">파일을 드래그하거나 클릭하여 선택</p>
                <p className="text-xs text-[--huni-fg-muted] mt-1">CSV, XLSX, XLS 파일 지원</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* 오류 메시지 */}
          {error && <p className="text-sm text-[--huni-fg-error]">{error}</p>}

          {/* 미리보기 */}
          {preview && (
            <div>
              <p className="text-xs font-medium text-[--huni-fg-muted] mb-1">미리보기</p>
              <div className="overflow-auto border border-[--huni-stroke-default] rounded">
                <table className="text-xs w-full border-collapse">
                  {preview.map((row, i) => (
                    <tr key={i} className={i === 0 ? 'bg-[--huni-bg-subtle]' : ''}>
                      {row.map((cell, j) => (
                        <td key={j} className="border border-[--huni-stroke-default] px-2 py-1">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-subtle]"
            onClick={() => { resetState(); onOpenChange(false); }}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            onClick={handleImport}
            disabled={importing || !file}
          >
            {importing ? '가져오는 중...' : '가져오기'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { PriceBulkImport };
