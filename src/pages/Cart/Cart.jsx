import { useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  CartProvider,
  NaverPayProvider,
  OrderSheetProvider,
  useCartActionContext,
  useCartStateContext,
  useMallStateContext,
  useModalActionContext,
  useNaverPayActionContext,
  useOrderSheetActionContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import CartPriceTag from './CartPriceTag';
import CartTopSelectManager from './CartTopSelectManager';
import DeliverySection from './DeliverySection';
import FixedOrderBtn from './FixedOrderBtn';

const CartContent = () => {
  const navigate = useNavigate();
  const { fetchCartDetail, checkOrderOnlyExtraProduct, convertExtraProductsWithoutBaseProductNoToGeneralProducts } =
    useCartActionContext();
  const { checkedProducts, checkedCartNos, cartDetail, checkingStatusPerCartNo } = useCartStateContext();
  const { showNaverPayButton, prepareNaverPay, checkUsesNaverPayOrder } = useNaverPayActionContext();
  const { makeOrderSheet } = useOrderSheetActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { openAlert } = useModalActionContext();

  const [usesNaverPayOrder, setUsesNaverPayOrder] = useState(false);
  const allCartNosLength = useMemo(() => Object.keys(checkingStatusPerCartNo).length, [checkingStatusPerCartNo]);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: '장바구니',
  });

  useEffect(() => {
    fetchCartDetail();
  }, []);

  useEffect(() => {
    if (cartDetail) {
      // 외부스크립트, sb객체 등록 기능. 삭제금지
      ShopbyExternalScript?.setGlobalObjectSb({ cart: cartDetail });
    }
  }, [cartDetail]);

  const handleOrderBtnClick = async () => {
    try {
      const { data } = await checkOrderOnlyExtraProduct();

      const { baseProductName, extraProductName } = data;

      if (baseProductName && extraProductName) {
        openAlert({
          Content: (
            <>
              선택한 상품 중 {baseProductName}과 개별적으로 주문할 수 없는 상품이 있습니다.
              <br />
              함께 주문해주세요.
              <br />
              <br />- 상품명: {extraProductName}
            </>
          ),
        });

        return;
      }

      const { data: convertedCheckedProducts } = await convertExtraProductsWithoutBaseProductNoToGeneralProducts();

      const {
        data: { orderSheetNo },
      } = await makeOrderSheet({
        cartNos: checkedCartNos,
        products: convertedCheckedProducts,
      });

      navigate(`/order/${orderSheetNo}`, {
        state: {
          orderSheetNo,
        },
      });
    } catch (context) {
      if (context.error?.code === 'PPVE0009' || context.error?.code === 'O8002') {
        openAlert({
          message: context.error.description,
        });

        return;
      }

      catchError(context);
    }
  };

  useEffect(() => {
    (async () => {
      const usesNaverPayOrder = await checkUsesNaverPayOrder({
        cacheOption: {
          type: 'MEMORY',
          timeBySeconds: 180,
        },
      });
      setUsesNaverPayOrder(usesNaverPayOrder);
    })();
  }, []);

  useEffect(() => {
    showNaverPayButton({
      containerElementId: 'naver-pay',
      isCartPage: true,
      isVisible: allCartNosLength > 0 && usesNaverPayOrder,
      redirectUrlAfterBuying: location.href, // backUrl
      redirectUrlAfterWishing: location.href, // backUrl
    });
  }, [allCartNosLength, usesNaverPayOrder]);

  useEffect(() => {
    if (!checkedProducts) return;

    const items = checkedProducts.map(
      ({ productNo, optionNo, orderCnt, optionInputs, channelType, baseProductName, baseProductNo }) => ({
        baseProductName,
        baseProductNo,
        productNo,
        optionNo,
        orderCnt,
        optionInputs,
        channelType: channelType ?? '',
      })
    );

    prepareNaverPay({ items });
  }, [checkedProducts]);

  return (
    <div className="cart">
      <CartTopSelectManager />
      <DeliverySection />
      <section className="l-panel cart__payment-info">
        <CartPriceTag />
        <Button className="cart__order-btn" label="주문하기" onClick={handleOrderBtnClick} />
        <div className="cart__naver-pay-btn" id="naver-pay" />
      </section>
      <FixedOrderBtn onOrderBtnClick={handleOrderBtnClick} />
    </div>
  );
};

const Cart = () => {
  const { clientId, mallProfile } = useMallStateContext();
  const { cartConfig } = useMallStateContext();

  return (
    <OrderSheetProvider>
      <NaverPayProvider clientId={clientId} mallProfile={mallProfile} platform={isMobile ? 'MOBILE_WEB' : 'PC'}>
        <CartProvider
          dividesInvalidProducts={true}
          guestCartOption={{
            storagePeriodByDays: cartConfig?.storagePeriod,
            storageMaxQuantity: cartConfig?.storageMaxQuantity,
          }}
        >
          <CartContent />
        </CartProvider>
      </NaverPayProvider>
    </OrderSheetProvider>
  );
};

export default Cart;
