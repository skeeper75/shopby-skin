// @MX:NOTE: 상품 수정 페이지 (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { productApi } from '../../../services/admin/product';
import { ProductForm } from '../../../components/admin/product/ProductForm';
import { Skeleton } from '../../../components/ui/Skeleton';

/**
 * 상품 수정 페이지
 * @param {number|string} productId - 수정할 상품 ID (라우터 params에서 주입)
 * TODO: useParams()로 productId 가져오기
 */
const ProductEditPage = ({ productId = 1 }) => {
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productApi.getOne(Number(productId));
      setProduct(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await productApi.update(Number(productId), values);
      showToast('상품이 수정되었습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <div className="min-w-[1280px] p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-[--huni-fg-muted]">
        <span>상품 관리</span>
        <span>›</span>
        <span className="text-[--huni-fg-default] font-medium">상품 수정</span>
      </div>
      <h1 className="text-xl font-bold text-[--huni-fg-default]">상품 수정</h1>

      <div className="max-w-3xl">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <ProductForm
            initialValues={product}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={saving}
          />
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2 bg-[--huni-fg-default] text-white text-sm rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

export default ProductEditPage;
