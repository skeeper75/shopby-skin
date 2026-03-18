// @MX:NOTE: ProductSummary - 상품 요약 정보
// SPEC-SKIN-003: 상품 기본 정보 표시

import React from 'react';
import { Chip } from '../../components/ui/Chip';

/**
 * ProductSummary Props
 */
interface ProductSummaryProps {
  productNo?: string | number;
}

/**
 * ProductSummary 컴포넌트
 */
const ProductSummary = ({ productNo }: ProductSummaryProps) => {
  // 실제로는 상품 데이터에서 가져와야 함
  const productData = {
    name: '명함 인쇄',
    description: '프리미엄 아트지를 사용한 고급 명함 인쇄 서비스',
    tags: ['NEW', 'BEST'],
    badge: 'HOT',
  };

  return (
    <div className="space-y-4">
      {/* 뱃지 */}
      {productData.badge && (
        <div className="flex gap-2">
          <Chip variant="error" size="sm">
            {productData.badge}
          </Chip>
        </div>
      )}

      {/* 상품명 */}
      <h1 className="text-2xl font-bold text-[--huni-fg-default]">
        {productData.name}
      </h1>

      {/* 상품 설명 */}
      <p className="text-sm text-[--huni-fg-muted]">
        {productData.description}
      </p>

      {/* 태그 */}
      {productData.tags.length > 0 && (
        <div className="flex gap-2">
          {productData.tags.map((tag) => (
            <Chip key={tag} variant="primary" size="sm">
              {tag}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSummary;
