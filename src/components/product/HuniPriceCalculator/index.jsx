// @MX:NOTE: HuniPriceCalculator - 가격 계산 컴포넌트
// SPEC-SKIN-003 TAG-002: 실시간 가격 계산 및 표시

import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../ui/Skeleton';
import { Chip } from '../../ui/Chip';
import { Divider } from '../../ui/Divider';
import { usePrintPrice } from '../../../hooks/usePrintPrice';
import { OptionSelection } from '../../../types/print-options';

/**
 * HuniPriceCalculator Props
 */
interface HuniPriceCalculatorProps {
  selections: Record<string, OptionSelection>;
  productType: string;
}

/**
 * 가격 상세 내역 아이템
 */
const PriceBreakdownItem = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm text-[--huni-fg-muted]">{label}</span>
    <span
      className={`text-sm font-medium ${
        highlight ? 'text-[--huni-fg-brand]' : 'text-[--huni-fg-default]'
      }`}
    >
      {typeof value === 'number' ? value.toLocaleString() + '원' : value}
    </span>
  </div>
);

/**
 * 가격 상세 내역
 */
const PriceBreakdown = ({ breakdown, loading }: { breakdown?: any; loading: boolean }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (!breakdown) {
    return null;
  }

  return (
    <div className="space-y-1">
      <PriceBreakdownItem label="기본단가" value={breakdown.paper?.price || 0} />
      <PriceBreakdownItem label="사이즈" value={breakdown.size?.price || 0} />
      <PriceBreakdownItem label="수량" value={breakdown.quantity?.price || 0} />

      {breakdown.finishing && breakdown.finishing.length > 0 && (
        <PriceBreakdownItem
          label="후가공"
          value={breakdown.finishing.reduce((sum: number, item: any) => sum + item.price, 0)}
        />
      )}

      {breakdown.coating && (
        <PriceBreakdownItem label="코팅" value={breakdown.coating.price || 0} />
      )}

      {breakdown.rushFee && breakdown.rushFee > 0 && (
        <PriceBreakdownItem label="급행 할증" value={breakdown.rushFee} />
      )}

      {breakdown.discount && breakdown.discount > 0 && (
        <PriceBreakdownItem label="할인" value={`-${breakdown.discount.toLocaleString()}원`} />
      )}

      <Divider />
      <PriceBreakdownItem label="최종 가격" value={breakdown.totalPrice || 0} highlight />
    </div>
  );
};

/**
 * HuniPriceCalculator 메인 컴포넌트
 */
const HuniPriceCalculator = ({ selections, productType }: HuniPriceCalculatorProps) => {
  const { priceData, loading, error, calculatePrice } = usePrintPrice(productType);

  // 옵션 변경 시 가격 재계산
  useEffect(() => {
    const requiredFields = [
      'paper-type',
      'paper-thickness',
      'size',
      'quantity',
      'print-sides',
    ];

    const hasAllRequired = requiredFields.every((field) => selections[field]);

    if (hasAllRequired) {
      calculatePrice(selections);
    }
  }, [selections, calculatePrice]);

  // 필수 옵션 미선택 여부 확인
  const isMissingRequired = !selections['paper-type'] ||
                            !selections['paper-thickness'] ||
                            !selections['size'] ||
                            !selections['quantity'] ||
                            !selections['print-sides'];

  // 대량 주문 여부 확인 (2,000매 초과)
  const isBulkOrder = parseInt(selections['quantity']?.value || '0') > 2000;

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[--huni-stroke-default] shadow-lg p-4 z-10 lg:static lg:shadow-none lg:border-t-0 lg:p-0">
      {/* 데스크톱: 인라인 / 모바일: 고정 바텀시트 */}
      <div className="max-w-7xl mx-auto">
        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-12 w-32" />
          </div>
        )}

        {/* 필수 옵션 미선택 */}
        {!loading && isMissingRequired && (
          <div className="text-center py-4">
            <p className="text-sm text-[--huni-fg-muted]">
              필수 옵션을 선택하시면 예상 가격이 표시됩니다.
            </p>
          </div>
        )}

        {/* 대량 주문 안내 */}
        {!loading && isBulkOrder && (
          <div className="bg-[--huni-bg-warning] border border-[--huni-stroke-warning] rounded-md p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📋</span>
              <div className="flex-1">
                <h4 className="font-medium text-[--huni-fg-warning] mb-1">
                  대량 주문 견적 문의
                </h4>
                <p className="text-sm text-[--huni-fg-muted]">
                  선택하신 수량은 대량 주문으로 별도 견적이 필요합니다.
                  고객센터로 문의해주시면 최적의 가격을 안내해드립니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 가격 표시 */}
        {!loading && !isMissingRequired && !isBulkOrder && priceData && (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* 예상 가격 */}
              <div className="flex items-baseline space-x-2">
                <span className="text-sm text-[--huni-fg-muted]">예상 가격</span>
                <span className="text-2xl font-bold text-[--huni-fg-brand]">
                  {priceData.totalPrice?.toLocaleString() || '0'}원
                </span>
              </div>

              {/* 급행 할증 뱃지 */}
              {priceData.rushFee > 0 && (
                <Chip variant="warning" size="sm" className="mt-2">
                  급행 할증 +{priceData.rushFee.toLocaleString()}원
                </Chip>
              )}

              {/* 할인 뱃지 */}
              {priceData.discount > 0 && (
                <Chip variant="success" size="sm" className="mt-2">
                  할인 -{priceData.discount.toLocaleString()}원
                </Chip>
              )}
            </div>

            {/* 가격 상세 보기 토글 */}
            <details className="lg:hidden">
              <summary className="cursor-pointer text-sm text-[--huni-fg-brand]">
                상세보기
              </summary>
              <div className="mt-4">
                <PriceBreakdown breakdown={priceData.breakdown} loading={false} />
              </div>
            </details>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-[--huni-bg-error] border border-[--huni-stroke-error] rounded-md p-3">
            <p className="text-sm text-[--huni-fg-error]">{error}</p>
          </div>
        )}

        {/* 데스크톱 가격 상세 (항상 표시) */}
        <div className="hidden lg:block mt-4">
          <PriceBreakdown breakdown={priceData?.breakdown} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default HuniPriceCalculator;
