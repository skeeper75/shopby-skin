// @MX:NOTE: 용지 선택 팝업 Dialog (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { paperApi } from '../../../../services/admin/product';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../../../../components/ui/Dialog';
import { TextField } from '../../../../components/ui/TextField';
import { Skeleton } from '../../../../components/ui/Skeleton';

const FINISH_LABELS = { glossy: '유광', matte: '무광', 'semi-gloss': '반광', none: '없음' };

/**
 * PaperSelectPopup - 용지 선택 팝업
 */
const PaperSelectPopup = ({ open, onOpenChange, onSelect, multiple = false, selectedIds = [] }) => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [checked, setChecked] = React.useState(new Set(selectedIds));

  React.useEffect(() => {
    if (open) { setChecked(new Set(selectedIds)); loadItems(); }
  }, [open]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await paperApi.getList({ active: true });
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const toggleItem = (id) => {
    if (multiple) {
      setChecked((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
    } else {
      setChecked(new Set([id]));
    }
  };

  const handleConfirm = () => {
    onSelect?.(items.filter((item) => checked.has(item.id)));
    onOpenChange(false);
  };

  const thCls = 'px-3 py-2 text-left text-xs font-semibold text-[--huni-fg-muted] bg-[--huni-bg-subtle] border-b border-[--huni-stroke-default]';
  const tdCls = 'px-3 py-2 text-sm text-[--huni-fg-default] border-b border-[--huni-stroke-default]';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>용지 선택</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <TextField placeholder="용지명 검색" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="border border-[--huni-stroke-default] rounded overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0">
                <tr>
                  <th className={thCls} style={{ width: 40 }}></th>
                  <th className={thCls}>용지명</th>
                  <th className={thCls}>평량</th>
                  <th className={thCls}>코팅</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 4 }).map((__, j) => <td key={j} className={tdCls}><Skeleton className="h-4" /></td>)}</tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="px-3 py-6 text-center text-sm text-[--huni-fg-muted]">검색 결과가 없습니다.</td></tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-[--huni-bg-subtle] cursor-pointer" onClick={() => toggleItem(item.id)}>
                      <td className={tdCls}>
                        <input type={multiple ? 'checkbox' : 'radio'} checked={checked.has(item.id)} onChange={() => toggleItem(item.id)} className="w-4 h-4" onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className={tdCls}>{item.name}</td>
                      <td className={tdCls}>{item.gsm} g/m²</td>
                      <td className={tdCls}>{FINISH_LABELS[item.finish] ?? item.finish}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <DialogFooter>
          <button className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm" onClick={() => onOpenChange(false)}>취소</button>
          <button className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium disabled:opacity-50" onClick={handleConfirm} disabled={checked.size === 0}>선택 완료</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { PaperSelectPopup };
