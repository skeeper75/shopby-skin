// @MX:NOTE: 사이즈 마스터 데이터 관리 페이지 (SPEC-SKIN-006)
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
import { Field, FieldLabel, FieldError } from '../../../../components/ui/Field';
import { TextField } from '../../../../components/ui/TextField';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { Pagination } from '../../../../components/ui/admin/Pagination';

const PAGE_SIZE = 15;

const EMPTY_FORM = { name: '', width: '', height: '', unit: 'mm', memo: '', sortOrder: '', active: true };

/**
 * 사이즈 관리 페이지
 */
const SizePage = () => {
  const [items, setItems] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [sortKey, setSortKey] = React.useState('sortOrder');
  const [sortDir, setSortDir] = React.useState('asc');

  // 다이얼로그 상태
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState(null); // null = 신규
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = React.useState({});
  const [saving, setSaving] = React.useState(false);

  // 삭제 확인 다이얼로그
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  // 토스트 메시지
  const [toast, setToast] = React.useState(null);

  // 데이터 로드
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await sizeApi.getList({ page, pageSize: PAGE_SIZE, search, sortKey, sortDir });
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, search, sortKey, sortDir]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // 검색 디바운스
  const searchTimeout = React.useRef(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
    }, 300);
  };

  // 정렬
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="ml-1 text-[--huni-fg-muted] opacity-40">↕</span>;
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  // 신규 등록 다이얼로그 열기
  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setDialogOpen(true);
  };

  // 수정 다이얼로그 열기
  const openEdit = (item) => {
    setEditTarget(item);
    setForm({
      name: item.name,
      width: String(item.width),
      height: String(item.height),
      unit: item.unit,
      memo: item.memo ?? '',
      sortOrder: String(item.sortOrder),
      active: item.active,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = '사이즈명을 입력하세요.';
    if (!form.width || isNaN(Number(form.width))) errors.width = '가로(숫자)를 입력하세요.';
    if (!form.height || isNaN(Number(form.height))) errors.height = '세로(숫자)를 입력하세요.';
    return errors;
  };

  // 저장
  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        width: Number(form.width),
        height: Number(form.height),
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (editTarget) {
        await sizeApi.update(editTarget.id, payload);
        showToast('수정되었습니다.');
      } else {
        await sizeApi.create(payload);
        showToast('등록되었습니다.');
      }
      setDialogOpen(false);
      loadData();
    } finally {
      setSaving(false);
    }
  };

  // 삭제 확인 열기
  const openDelete = (item) => {
    setDeleteTarget(item);
  };

  // 삭제 실행
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await sizeApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      showToast('삭제되었습니다.');
      loadData();
    } finally {
      setDeleting(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const thCls = 'px-4 py-2 text-left text-xs font-semibold text-[--huni-fg-muted] bg-[--huni-bg-subtle] border-b border-[--huni-stroke-default] cursor-pointer select-none';
  const tdCls = 'px-4 py-2 text-sm text-[--huni-fg-default] border-b border-[--huni-stroke-default]';

  return (
    <div className="min-w-[1280px] p-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[--huni-fg-default]">사이즈 관리</h1>
        <button
          className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          onClick={openCreate}
        >
          + 사이즈 등록
        </button>
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-3">
        <TextField
          placeholder="사이즈명 검색"
          value={search}
          onChange={handleSearchChange}
          className="w-64"
        />
      </div>

      {/* 테이블 */}
      <div className="border border-[--huni-stroke-default] rounded overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thCls} onClick={() => handleSort('sortOrder')}>
                순서 <SortIcon col="sortOrder" />
              </th>
              <th className={thCls} onClick={() => handleSort('name')}>
                사이즈명 <SortIcon col="name" />
              </th>
              <th className={thCls}>규격 (W × H)</th>
              <th className={thCls}>단위</th>
              <th className={thCls}>메모</th>
              <th className={thCls} onClick={() => handleSort('active')}>
                활성 <SortIcon col="active" />
              </th>
              <th className={thCls}>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className={tdCls}>
                      <Skeleton className="h-4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-[--huni-fg-muted]">
                  등록된 사이즈가 없습니다.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-[--huni-bg-subtle] transition-colors">
                  <td className={tdCls}>{item.sortOrder}</td>
                  <td className={tdCls}>{item.name}</td>
                  <td className={tdCls}>{item.width} × {item.height}</td>
                  <td className={tdCls}>{item.unit}</td>
                  <td className={tdCls}>{item.memo}</td>
                  <td className={tdCls}>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {item.active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className={tdCls}>
                    <div className="flex gap-2">
                      <button
                        className="text-xs text-[--huni-fg-brand] hover:underline"
                        onClick={() => openEdit(item)}
                      >
                        수정
                      </button>
                      <button
                        className="text-xs text-[--huni-fg-error] hover:underline"
                        onClick={() => openDelete(item)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* 등록/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? '사이즈 수정' : '사이즈 등록'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Field error={formErrors.name}>
              <FieldLabel required>사이즈명</FieldLabel>
              <TextField
                placeholder="예: A4"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                error={!!formErrors.name}
              />
              <FieldError />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field error={formErrors.width}>
                <FieldLabel required>가로 (W)</FieldLabel>
                <TextField
                  placeholder="210"
                  type="number"
                  value={form.width}
                  onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
                  error={!!formErrors.width}
                />
                <FieldError />
              </Field>
              <Field error={formErrors.height}>
                <FieldLabel required>세로 (H)</FieldLabel>
                <TextField
                  placeholder="297"
                  type="number"
                  value={form.height}
                  onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                  error={!!formErrors.height}
                />
                <FieldError />
              </Field>
            </div>
            <Field>
              <FieldLabel>단위</FieldLabel>
              <select
                className="flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm"
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="inch">inch</option>
              </select>
            </Field>
            <Field>
              <FieldLabel>정렬 순서</FieldLabel>
              <TextField
                placeholder="1"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              />
            </Field>
            <Field>
              <FieldLabel>메모</FieldLabel>
              <TextField
                placeholder="메모"
                value={form.memo}
                onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
              />
            </Field>
            <Field>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4"
                />
                활성 상태
              </label>
            </Field>
          </div>
          <DialogFooter>
            <button
              className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-subtle]"
              onClick={() => setDialogOpen(false)}
            >
              취소
            </button>
            <button
              className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>사이즈 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[--huni-fg-default] py-2">
            <strong>{deleteTarget?.name}</strong> 사이즈를 삭제하시겠습니까?<br />
            이 작업은 되돌릴 수 없습니다.
          </p>
          <DialogFooter>
            <button
              className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-subtle]"
              onClick={() => setDeleteTarget(null)}
            >
              취소
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2 bg-[--huni-fg-default] text-white text-sm rounded shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
};

export default SizePage;
