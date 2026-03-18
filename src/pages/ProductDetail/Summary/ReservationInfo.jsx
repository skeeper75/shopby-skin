import dayjs from 'dayjs';
import { string, number } from 'prop-types';

const ReservationInfo = ({ reservationDeliveryYmdt, reservationEndYmdt, reservationStartYmdt }) => {
  const startDate = dayjs(reservationStartYmdt).format('YYYY-MM-DD HH:mm');
  const endDate = dayjs(reservationEndYmdt).format('YYYY-MM-DD HH:mm');
  const deliveryDate = dayjs(reservationDeliveryYmdt).format('MM/DD');

  return (
    <dl className="product-summary__reservation-info">
      <div>예약판매기간</div>
      <span>
        {startDate} ~ {endDate} [{deliveryDate} 예약배송]
      </span>
    </dl>
  );
};

ReservationInfo.propTypes = {
  reservationDeliveryYmdt: string,
  reservationEndYmdt: string,
  reservationStartYmdt: string,
  reservationStockCnt: number,
};

export default ReservationInfo;
