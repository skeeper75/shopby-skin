// @MX:NOTE: 굿즈 상품 등록 페이지 (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { productApi } from '../../../../services/admin/product';
import { GeneralProductForm } from '../../../../components/admin/product/GeneralProductForm';

const GoodsCreatePage = () => {
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await productApi.create({ ...values, type: 'goods' });
      setToast('굿즈 상품이 등록되었습니다.');
      // TODO: navigate('/admin/products/general')
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-w-[1280px] p-6 space-y-4">
      <h1 className="text-xl font-bold text-[--huni-fg-default]">굿즈 상품 등록</h1>
      <GeneralProductForm productType="goods" onSave={handleSave} onCancel={() => window.history.back()} loading={saving} />
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2 bg-[--huni-fg-default] text-white text-sm rounded shadow-lg">{toast}</div>
      )}
    </div>
  );
};

export default GoodsCreatePage;
