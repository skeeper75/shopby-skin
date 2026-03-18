// @MX:NOTE: 사이즈 선택 팝업 Dialog (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { sizeApi } from '../../../../services/admin/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../../../../components/ui/Dialog';
import { TextField } from '../../../../components/ui/TextField';
import { Skeleton } from '../../../../components/ui/Skeleton';

/**
 * SizeSelectPopup - 사이즈 선택 팝업
 * @param {boolean} open
 * @param {function} onOpenChange
 * @param {function} onSelect - 선택 콜백 (선택된 사이즈 배열)
 * @param {boolean} multiple - 다중 선택 여부
 * @param {number[]} selectedIds - 이미 선택된 ID 목록
 */
const SizeSelectPopup = ({ open, onOpenChange, onSelect, multiple = false, selectedIds = [] }) => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [checked, setChecked] = React.useState(new Set(selectedIds));

  React.useEffect(() => {
    if (open) {
      setChecked(new Set(selectedIds));
      loadItems();
    }
  }, [open]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await sizeApi.getList({ active: true });
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleItem = (id) => {
    if (multiple) {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      setChecked(new Set([id]));
    }
  };

  const handleConfirm = () => {
    const selected = items.filter((item) => checked.has(item.id));
    onSelect?.(selected);
    onOpenChange(false);
  };

  const thCls = 'px-3 py-2 text-left text-xs font-semibold text-[--huni-fg-muted] bg-[--huni-bg-subtle] border-b border-[--huni-stroke-default]';
  const tdCls = 'px-3 py-2 text-sm text-[--huni-fg-default] border-b border-[--huni-stroke-default]';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>사이즈 선택</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <TextField
            placeholder="사이즈명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          <div className="border border-[--huni-stroke-default] rounded overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0">
                <tr>
                  <th className={thCls} style={{ width: 40 }}></th>
                  <th className={thCls}>사이즈명</th>
                  <th className={thCls}>규격</th>
                  <th className={thCls}>단위</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 4 }).map((__, j) => (
                        <td key={j} className={tdCls}><Skeleton className="h-4" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-sm text-[--huni-fg-muted]">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[--huni-bg-subtle] cursor-pointer transition-colors"
                      onClick={() => toggleItem(item.id)}
                    >
                      <td className={tdCls}>
                        <input
                          type={multiple ? 'checkbox' : 'radio'}
                          checked={checked.has(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="w-4 h-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className={tdCls}>{item.name}</td>
                      <td className={tdCls}>{item.width} × {item.height}</td>
                      <td className={tdCls}>{item.unit}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {multiple && checked.size > 0 && (
            <p className="text-xs text-[--huni-fg-muted]">{checked.size}개 선택됨</p>
          )}
        </div>

        <DialogFooter>
          <button
            className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-subtle]"
            onClick={() => onOpenChange(false)}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            onClick={handleConfirm}
            disabled={checked.size === 0}
          >
            선택 완료
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { SizeSelectPopup };
