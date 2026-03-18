// @MX:NOTE: 상품 등록 페이지 - 인쇄/제본 상품 (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { productApi } from '../../../services/admin/product';
import { ProductForm } from '../../../components/admin/product/ProductForm';

/**
 * 상품 등록 페이지
 * TODO: 저장 후 목록 페이지로 라우팅 (useNavigate 연동 필요)
 */
const ProductCreatePage = () => {
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await productApi.create(values);
      showToast('상품이 등록되었습니다.');
      // TODO: navigate('/admin/products')
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // TODO: navigate(-1)
    window.history.back();
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <div className="min-w-[1280px] p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-[--huni-fg-muted]">
        <span>상품 관리</span>
        <span>›</span>
        <span className="text-[--huni-fg-default] font-medium">상품 등록</span>
      </div>
      <h1 className="text-xl font-bold text-[--huni-fg-default]">상품 등록</h1>

      <div className="max-w-3xl">
        <ProductForm onSave={handleSave} onCancel={handleCancel} loading={saving} />
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2 bg-[--huni-fg-default] text-white text-sm rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

export default ProductCreatePage;
