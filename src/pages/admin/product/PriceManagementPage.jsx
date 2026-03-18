// @MX:NOTE: 가격 관리 페이지 - 매트릭스 편집 + 시뮬레이터 (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { priceApi } from '../../../services/admin/product';
import { PriceMatrixEditor } from '../../../components/admin/product/price/PriceMatrixEditor';
import { PricePopup } from '../../../components/admin/product/price/PricePopup';
import { PriceBulkImport } from '../../../components/admin/product/price/PriceBulkImport';
import { PRICE_POPUP_TYPE_LABELS } from '../../../components/admin/product/price/PricePopupConfig';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { Skeleton } from '../../../components/ui/Skeleton';

// 시뮬레이터 - 특정 옵션 조합의 가격 계산
const PriceSimulator = ({ matrix, rows, cols }) => {
  const [selectedRow, setSelectedRow] = React.useState(rows[0] ?? '');
  const [selectedCol, setSelectedCol] = React.useState(cols[0] ?? '');

  const key = `${selectedRow}-${selectedCol}`;
  const price = matrix[key];

  return (
    <div className="p-4 border border-[--huni-stroke-default] rounded bg-[--huni-bg-subtle] space-y-3">
      <h3 className="text-sm font-semibold text-[--huni-fg-default]">가격 시뮬레이터</h3>
      <div className="flex items-center gap-3">
        <div className="space-y-1">
          <label className="text-xs text-[--huni-fg-muted]">수량</label>
          <select
            className="h-9 rounded border border-[--huni-stroke-default] px-2 text-sm bg-white"
            value={selectedRow}
            onChange={(e) => setSelectedRow(e.target.value)}
          >
            {rows.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[--huni-fg-muted]">옵션</label>
          <select
            className="h-9 rounded border border-[--huni-stroke-default] px-2 text-sm bg-white"
            value={selectedCol}
            onChange={(e) => setSelectedCol(e.target.value)}
          >
            {cols.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[--huni-fg-muted]">예상 금액</label>
          <div className="h-9 flex items-center px-3 border border-[--huni-stroke-default] rounded bg-white min-w-[120px]">
            <span className="text-sm font-bold text-[--huni-fg-brand]">
              {price !== undefined && price !== '' ? `${Number(price).toLocaleString()}원` : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 가격 관리 페이지
 * TODO: productId를 라우터 params에서 가져와야 함
 */
const PriceManagementPage = ({ productId = 1 }) => {
  const [rows, setRows] = React.useState([]);
  const [cols, setCols] = React.useState([]);
  const [matrix, setMatrix] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  // 팝업 상태
  const [popupType, setPopupType] = React.useState(null);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [bulkImportOpen, setBulkImportOpen] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await priceApi.getMatrix(productId);
      setRows(res.rows);
      setCols(res.cols);
      setMatrix(res.matrix);
      setDirty(false);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  React.useEffect(() => { loadData(); }, [loadData]);

  const handleMatrixChange = (newMatrix) => {
    setMatrix(newMatrix);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await priceApi.updateMatrix(productId, matrix);
      setDirty(false);
      showToast('가격이 저장되었습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handlePopupSave = (values) => {
    showToast(`${values.type} 가격 설정이 저장되었습니다.`);
    // TODO: API 저장 연동
  };

  const handleBulkImport = ({ imported, failed }) => {
    showToast(`${imported}건 가져오기 완료 (실패: ${failed}건)`);
    loadData();
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <div className="min-w-[1280px] p-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[--huni-fg-default]">가격 관리</h1>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-subtle]"
            onClick={() => setBulkImportOpen(true)}
          >
            CSV 업로드
          </button>
          <button
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            onClick={handleSave}
            disabled={saving || !dirty}
          >
            {saving ? '저장 중...' : dirty ? '변경사항 저장' : '저장됨'}
          </button>
        </div>
      </div>

      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">기본 가격 매트릭스</TabsTrigger>
          <TabsTrigger value="extra">추가 가격 설정</TabsTrigger>
        </TabsList>

        {/* 매트릭스 탭 */}
        <TabsContent value="matrix" className="space-y-4 mt-4">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <>
              <div className="border border-[--huni-stroke-default] rounded overflow-hidden">
                <div className="p-3 bg-[--huni-bg-subtle] border-b border-[--huni-stroke-default]">
                  <p className="text-xs text-[--huni-fg-muted]">
                    셀을 클릭하여 가격을 입력하세요. Tab/Enter로 다음 셀로 이동합니다.
                  </p>
                </div>
                <div className="p-4">
                  <PriceMatrixEditor
                    rows={rows}
                    cols={cols}
                    matrix={matrix}
                    onChange={handleMatrixChange}
                  />
                </div>
              </div>
              <PriceSimulator matrix={matrix} rows={rows} cols={cols} />
            </>
          )}
        </TabsContent>

        {/* 추가 가격 설정 탭 */}
        <TabsContent value="extra" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {PRICE_POPUP_TYPE_LABELS.map((item) => (
              <button
                key={item.value}
                className="p-4 border border-[--huni-stroke-default] rounded text-left hover:border-[--huni-stroke-brand] hover:bg-[--huni-bg-subtle] transition-colors"
                onClick={() => { setPopupType(item.value); setPopupOpen(true); }}
              >
                <span className="text-sm font-medium text-[--huni-fg-default]">{item.label}</span>
                <span className="block text-xs text-[--huni-fg-muted] mt-0.5">설정하기</span>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 가격 팝업 */}
      {popupType && (
        <PricePopup
          type={popupType}
          open={popupOpen}
          onOpenChange={setPopupOpen}
          onSave={handlePopupSave}
        />
      )}

      {/* CSV 업로드 */}
      <PriceBulkImport
        open={bulkImportOpen}
        onOpenChange={setBulkImportOpen}
        onImport={handleBulkImport}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2 bg-[--huni-fg-default] text-white text-sm rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

export default PriceManagementPage;
