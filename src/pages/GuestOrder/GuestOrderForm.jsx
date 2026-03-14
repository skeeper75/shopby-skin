import { useSignInActionContext, useSignInValueContext, TextField, Button } from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';

const GuestOrderForm = () => {
  const { updateGuestOrderInfo, searchGuestOrders } = useSignInActionContext();

  const {
    guestOrderInfo: { orderNo, orderPassword },
  } = useSignInValueContext();

  const { catchError } = useErrorBoundaryActionContext();

  const handleOrderNoChange = ({ currentTarget: { value } }) => {
    updateGuestOrderInfo({ orderNo: value });
  };

  const handleOrderPasswordChange = ({ currentTarget: { value } }) => {
    updateGuestOrderInfo({ orderPassword: value });
  };

  const getGuestOrders = async () => {
    try {
      await searchGuestOrders({ orderNo, password: orderPassword, orderRequestType: 'ALL' });
      location.href = `/orders/${orderNo}`;
    } catch (error) {
      catchError(error);
    }
  };

  const handleOrderPasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      getGuestOrders();
    }
  };

  const handleSearchGuestOrdersBtnClick = () => {
    getGuestOrders();
  };

  return (
    <div>
      <section className="sign-in">
        <div className="guest-order">
          <div className="guest-order__input-wrap">
            <TextField name="orderNo" placeholder="주문번호 입력" onChange={handleOrderNoChange} value={orderNo} />
          </div>
          <div className="guest-order__input-wrap">
            <TextField
              name="orderPassword"
              type="password"
              placeholder="주문번호 비밀번호 입력"
              onChange={handleOrderPasswordChange}
              onKeyDown={handleOrderPasswordKeyDown}
            />
          </div>
          <Button label="조회하기" onClick={handleSearchGuestOrdersBtnClick} />
        </div>
      </section>
    </div>
  );
};

export default GuestOrderForm;
