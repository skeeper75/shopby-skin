import { useProductDetailStateContext, VisibleComponent } from '@shopby/react-components';

import Sanitized from '../../../components/Sanitized';
import { cn } from '../../../lib/utils';

import AccumulationInformation from './AccumulationInformation';
import DownloadCouponButton from './DownloadCouponButton';
import FreightInformation from './FreightInformation';
import PriceInformation from './PriceInformation';
import RepresentativeCategory from './RepresentativeCategory';
import ReservationInfo from './ReservationInfo';
import WeightInformation from './WeightInformation';

// 상품 요약 정보 (브랜드, 상품명, 가격, 배송정보 등)
const Summary = () => {
  const {
    productDetail: { summary, reservationData, categories },
  } = useProductDetailStateContext();

  return (
    <div className={cn('product-summary', 'space-y-3 lg:space-y-4')}>
      <RepresentativeCategory categories={categories} />
      <p className={cn('product-summary__brand-name', 'text-sm text-muted-foreground')}>{summary.brandName}</p>
      <h2 className={cn('product-summary__title', 'text-lg sm:text-xl lg:text-2xl font-bold leading-tight')}>
        <Sanitized html={summary.productName} />
      </h2>
      <div className={cn('product-summary__price-info', 'flex flex-wrap items-end gap-2')}>
        <PriceInformation {...summary} />
        <DownloadCouponButton />
      </div>
      <div
        className={cn(
          'product-summary__freight-line',
          'space-y-2 pt-4 border-t border-border text-sm text-muted-foreground'
        )}
      >
        <VisibleComponent shows={!!reservationData} TruthyComponent={<ReservationInfo {...reservationData} />} />
        <FreightInformation {...summary.freight} />
        <WeightInformation productWeight={summary?.freight?.totalWeight ?? 0} />
        <AccumulationInformation {...summary.accumulation} />
      </div>
    </div>
  );
};
export default Summary;
