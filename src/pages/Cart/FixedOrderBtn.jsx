import { func } from 'prop-types';

import { Button, useCartStateContext, useCurrencyStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

// TODO: i18n

const FixedOrderBtn = ({ onOrderBtnClick }) => {
  const { paymentInfo, checkedCartNos } = useCartStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  return (
    <div className="cart__fixed-order-btn">
      <div className="cart__fixed-summary">
        <div className="cart__fixed-summary-label">
          <span>총 결제금액</span>
          <span className="cart__fixed-summary-number">({checkedCartNos.length}개)</span>
        </div>
        <em>
          <strong>{convertToKoreanCurrency(paymentInfo.totalAmt)}</strong>
          {currencyLabel}
        </em>
      </div>
      <Button className="cart__order-btn" label="주문하기" onClick={onOrderBtnClick} />
    </div>
  );
};

export default FixedOrderBtn;

FixedOrderBtn.propTypes = {
  onOrderBtnClick: func,
};
